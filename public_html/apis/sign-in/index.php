<?php
require_once(dirname(__DIR__, 3) . "/vendor/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");
require_once("/etc/nginx/capstone-mysql/Secrets.php");

use Adldap\{Adldap,Connections\Provider};

// prepare an empty reply
$reply = new stdClass();
$reply->status = 200;
$reply->message = null;

try {
    // verify XSRF token defend against operator error
    if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    verifyXsrf();

    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");

    $adconf = (array) $secrets->getSecret("adconf");
    $admins = $secrets->getSecret("admins");
    $requestContent = file_get_contents("php://input");
    $requestObject = json_decode($requestContent);


    $username = strtolower(filter_var($requestObject->username, FILTER_SANITIZE_STRING));
    $password = $requestObject->password;

    $provider = new Provider($adconf);
    $activeDirectory = new Adldap();
    $activeDirectory->addProvider($provider, "CNM");
    $activeDirectory->setDefaultProvider("CNM");
    $activeDirectory->connect();

   $result = $activeDirectory->auth()->attempt("$username@cnm.edu", $password, true);

    if ($result === true) {

        $search = $provider->search();
        $search->select(["displayname", "employeeid"]);
        $result = $search->findBy("samaccountname",$username);
        $isAdmin = in_array( $username, $admins->adminsList);

        $adUser= (object) [
            "fullName" => $result->getDisplayName(),
            "loginTime" => time(),
            "username" => $username,
            "isAdmin"=> $isAdmin
        ];

        setJwtAndAuthHeader("auth", $adUser);


        $adUser->studentId = $result->getEmployeeId();
        $_SESSION["adUser"] = $adUser;
        $reply->message= "Sign in was successful";

    } else{
        throw(new RuntimeException("invalid username/password", 401));
    }
}catch(Adldap\Auth\UsernameRequiredException | Adldap\Auth\PasswordRequiredException | Adldap\Auth\BindException | Exception  | RuntimeException | Error $exception ) {
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}
// encode and return reply to front end caller
header("Content-type: application/json");

echo json_encode($reply);