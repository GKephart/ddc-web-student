<?php


//prepare an empty reply
$reply = new stdClass();
$reply->status = 200;
$reply->data = null;

try {

	$method = $_SERVER["HTTP_X_HTTP_METHOD"] ?? $_SERVER["REQUEST_METHOD"];

	// verify the session, start if not active
	if(session_status() !== PHP_SESSION_ACTIVE) {
		session_start();
	}
	if($method === "GET") {

		$postJson = file_get_contents("./posts.json");

		if($postJson === false) {
			throw(new RuntimeException("Unable to read post data", 500));
		}
		$posts = json_decode($postJson);
		$reply->data = $posts;
	}
} catch(\Exception | \TypeError | Error $exception) {
    var_dump($exception);
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}
// encode and return reply to front end caller
header("Content-type: application/json");
header("Access-Control-Allow-Origin: *");
echo json_encode($reply);
