<?php
require_once(dirname(__DIR__, 3) . "/vendor/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");
require_once(dirname(__DIR__, 3) . "/php/lib/uuid.php");
require_once(dirname(__DIR__, 3) . "/php/lib/insertAttemptedLogin.php");
require_once("/etc/nginx/capstone-mysql/Secrets.php");

use Adldap\{Adldap,Connections\Provider};
use Adldap\Auth\Events\Failed;

// prepare an empty reply
$reply = new stdClass();
$reply->status = 200;
$reply->message = null;
$reply->data = null;

try {
    // verify XSRF token defend against operator error
    if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    verifyXsrf();

    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");
    $pdo = $secrets->getPdoObject();

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

    $d = Adldap::getEventDispatcher();

//    $d->listen(Failed::class, function (Failed $event) {
//        $conn = $event->getConnection();
//        if ($error = $conn->getDetailedError()) {
//            echo  $error->getErrorCode() . PHP_EOL;
//            echo $error->getErrorMessage() . PHP_EOL;
//            echo $error->getDiagnosticMessage() . PHP_EOL;
//        }
//    });
//

   $result = $activeDirectory->auth()->attempt("$username@cnm.edu", $password, true);
   $createDate = new DateTime();

   $parameters = [
       "attemptedLoginId"=>generateUuidV4()->getBytes(),
       "attemptedLoginUsername" =>$username,
       "attemptedLoginResult"=> (string)$result,
       "createDate" =>$createDate->format("Y-m-d H:i:s.u"),
       "ip" => $_SERVER["REMOTE_ADDR"],
       "browser" => $_SERVER["HTTP_USER_AGENT"]
       ];
   
 insertAttemptedLogin($pdo, $parameters);
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
        throw(new RuntimeException("invalid username or password", 401));
    }
}catch(Adldap\Auth\UsernameRequiredException | Adldap\Auth\PasswordRequiredException | Adldap\Auth\BindException | Exception  | RuntimeException | Error $exception ) {
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}
// encode and return reply to front end caller
header("Content-type: application/json");

echo json_encode($reply);