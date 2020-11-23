<?php
// start the session
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");

if(session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

try {
    // determine which HTTP method was used
    $method = $_SERVER["HTTP_X_HTTP_METHOD"] ?? $_SERVER["REQUEST_METHOD"];

    // create an empty result
    $reply = new stdClass();
    $reply->status = 200;
    $reply->message = null;
    $reply->data = null;

    // kick them out if there's no session
    if(empty($_SESSION["adUser"]) === true) {
        throw(new RuntimeException("user not logged in"));
    }

    // execute the command from the session user
    $username = $_SESSION["adUser"]->username;
    $username = escapeshellarg($username);
    if($method === "GET") {
        $command = escapeshellcmd("sudo /usr/local/bin/list-ssh-keys $username");
        $jsonResult = exec($command);
        $reply->data = json_decode($jsonResult);

    } else if($method === "POST" || $method === "PUT") {
        // verify XSRF and load the key
        verifyXsrf();
        $requestContent = file_get_contents("php://input");
        $requestObject = json_decode($requestContent);
        $delete = filter_var($requestObject->delete, FILTER_VALIDATE_BOOLEAN);
        $key = escapeshellarg($requestObject->key);
        if($method === "POST" && $delete === true ) {
            // feed the key to the SSH deleter
            $command = escapeshellcmd("sudo -u $username -H /usr/local/bin/delete-ssh-key $key");
        } else if($method === "POST") {
            $command = escapeshellcmd("sudo /usr/local/bin/post-ssh-key $key $username");
        }
        // both methods return JSON - just give it back to Angular
        $jsonResult = exec($command);
        $result = json_decode($jsonResult);
        $reply->status = $result->status;
        $reply->message = $result->message;
    }
} catch(Exception | \InvalidArgumentException | \RuntimeException| \Error $exception) {
    $reply->status = 500;
    $reply->message = $exception->getMessage();
}

// encode and report the SSH results
header("Content-type: application/json");
echo json_encode($reply);