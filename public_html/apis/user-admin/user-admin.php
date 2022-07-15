<?php
require_once(dirname(__DIR__, 3) . "/php/Classes/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/ad-verify.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");
require_once("/etc/nginx/capstone-mysql/Secrets.php");

// start the session and create a XSRF token
if(session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// prepare a default reply
$reply = new stdClass();
$reply->status = 500;
$reply->message = "unable to access users";
$reply = json_encode($reply);

try {
    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");
    $pdo = $secrets->getPdoObject();

    // determine which HTTP method was used
    $method = array_key_exists("HTTP_X_HTTP_METHOD", $_SERVER) ? $_SERVER["HTTP_X_HTTP_METHOD"] : $_SERVER["REQUEST_METHOD"];
    if($method !== "GET" && $method !== "DELETE" && $method !== "POST") {
        throw(new HttpRequestMethodException("bad HTTP method", 405));
    }

    // ensure there's a user logged in
    if (isLoggedInAsAdmin($secrets) === false) {
        throw(new RuntimeException("permission denied", 401));
    }

    // sanitize the class and command
    $username = filter_input(INPUT_GET, "username", FILTER_SANITIZE_STRING);
    $username = escapeshellarg($username);

    // set an XSRF cookie on GET requests
    if($method === "GET") {
        setXsrfCookie("/");
    }

    // handle all RESTful calls to User
        if($method === "GET") {
            $command = escapeshellcmd("sudo /etc/sssd/bin/user-get");
        } else if($method === "DELETE") {
            verifyXsrf();
            $command = escapeshellcmd("sudo /etc/sssd/bin/user-delete $username");
        } else if($method === "POST") {
            verifyXsrf();
            $command = escapeshellcmd("sudo /etc/sssd/bin/user-post $username");
        // all user commands return raw JSON good to go
        $reply = exec($command);
    } else {
        throw(new InvalidArgumentException("invalid class", 405));
    }
    // create an exception to pass back to the RESTful caller
}  catch (\Exception | TypeError | InvalidArgumentException | RuntimeException | Error $exception) {
    $reply = new stdClass();
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
    $reply = json_encode($reply);
}

header("Content-type: application/json");
echo $reply;

