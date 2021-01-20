<?php
require_once(dirname(__DIR__, 3) . "/vendor/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");
require_once(dirname(__DIR__, 3) . "/php/lib/uuid.php");
require_once(dirname(__DIR__, 3) . "/php/lib/insertAttemptedLogin.php");
require_once("/etc/nginx/capstone-mysql/Secrets.php");

use LdapRecord\{Connection, ConnectionException};

use LdapRecord\Auth\{
    UsernameRequiredException,
    PasswordRequiredException,
    BindException
};

// prepare an empty reply
$reply = new stdClass();
$reply->status = 200;
$reply->message = null;
$reply->data = null;

try {
    // verify XSRF token defend against operator error
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    verifyXsrf();

    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");
    $pdo = $secrets->getPdoObject();

    $adconf = (array)$secrets->getSecret("adconf");
    $admins = $secrets->getSecret("admins");

    $connection = new Connection($adconf);

    $requestContent = file_get_contents("php://input");
    $requestObject = json_decode($requestContent);

    $username = strtolower(filter_var($requestObject->username, FILTER_SANITIZE_STRING));
    if(isset($username) === false) {
        throw(new \InvalidArgumentException( "please provide a valid username", 401));
    }    $password = $requestObject->password;


    $user = $connection->query()
        ->where('samaccountname', '=', $username)
        ->first();
    if($user === null) {
        throw(new RuntimeException("invalid username or password", 401));
    }
    $result = $connection->auth()->attempt($user["distinguishedname"][0], $password, true);

    $createDate = new DateTime();

    $parameters = [
        "attemptedLoginId" => generateUuidV4()->getBytes(),
        "attemptedLoginUsername" => $username,
        "attemptedLoginResult" => (string)$result,
        "createDate" => $createDate->format("Y-m-d H:i:s.u"),
        "ip" => $_SERVER["REMOTE_ADDR"],
        "browser" => $_SERVER["HTTP_USER_AGENT"]
    ];

    insertAttemptedLogin($pdo, $parameters);

    if ($result === true) {
        $isAdmin = in_array($username, $admins->adminsList);

        $adUser = (object)[
            "fullName" => $user["cn"][0],
            "loginTime" => time(),
            "username" => $username,
            "isAdmin" => $isAdmin
        ];

        setJwtAndAuthHeader("auth", $adUser);

        $adUser->studentId = $user["employeeid"][0];
        $_SESSION["adUser"] = $adUser;
        $reply->message = "Sign in was successful";

    } else {
        throw(new RuntimeException("invalid username or password", 401));
    }
} catch (Exception | RuntimeException | InvalidArgumentException $exception) {
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}

// encode and return reply to front end caller
header("Content-type: application/json");

echo json_encode($reply);