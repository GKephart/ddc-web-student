<?php
require_once(dirname(__DIR__, 3) . "/vendor/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
/**
 * api for signing out
 *
 * @author Gkephart
 * @version 1.0
 **/

//verify the xsrf challenge
if(session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

//prepare default error message
$reply = new stdClass();
$reply->status = 200;
$reply->data = null;
try {
    //determine which HTTP method was used
    $method = array_key_exists("HTTP_X_HTTP_METHOD", $_SERVER) ? $_SERVER["HTTP_X_HTTP_METHOD"] : $_SERVER["REQUEST_METHOD"];
    if($method === "GET") {
        $_SESSION = [];
        $reply->message = "You are now signed out.";
    }
    else {
        throw (new \InvalidArgumentException("Invalid HTTP method request"));
    }

} catch(Exception | \TypeError  | \InvalidArgumentException $exception) {
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}

header("Content-type: application/json");
//encode and return reply to front end caller

echo json_encode($reply);