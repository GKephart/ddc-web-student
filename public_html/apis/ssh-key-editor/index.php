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
    $reply->message = "wtf";
    $reply->data = null;

    // kick them out if there's no session
    if(empty($_SESSION["adUser"]) === true) {
        throw(new RuntimeException("user not logged in"));
    }

    // execute the command from the session user
    $username = filter_var($_SESSION["adUser"]->username);
    $username = escapeshellarg($username);
    if($method === "GET") {
        $command = escapeshellcmd("sudo -u $username -H /usr/local/bin/list-ssh-keys");
        $jsonResult = exec($command);

        // attach the keys to the result and re-encode it
        $keys = json_decode($jsonResult);
        $reply->keys = $keys;

    } else if($method === "POST" || $method === "PUT") {
        // verify XSRF and load the key
        verifyXsrf();
        $requestContent = file_get_contents("php://input");
        $requestObject = json_decode($requestContent);

        // add an SSH key
        if($method === "POST") {
            $key = escapeshellarg($requestObject);
            $command = escapeshellcmd("sudo -u $username -H /usr/local/bin/post-ssh-key $key");

            // PUT is used to delete a key since DELETE (typically) doesn't have a body
        } else if($method === "PUT") {
            // feed the key to the SSH deleter
            $key = escapeshellarg($requestObject->key);
            $command = escapeshellcmd("sudo -u $username -H /usr/local/bin/delete-ssh-key $key");
        }

        // both methods return JSON - just give it back to Angular
//        $jsonResult = exec($command);
//        $reply = json_decode($jsonResult);
    }
} catch(Exception | Error $exception) {
    $reply->status = 500;
    $reply->message = $exception->getMessage();
}

// encode and report the SSH results
header("Content-type: application/json");
echo json_encode($reply);