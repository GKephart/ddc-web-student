<?php
require_once(dirname(__DIR__, 3) . "/vendor/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");
require_once("/etc/nginx/capstone-mysql/Secrets.php");

use Adldap\Adldap;



try {
    // verify XSRF token defend against operator error
    if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    verifyXsrf();

    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");
    $adconf = (array) $secrets->getSecret("adconf");
    var_dump($adconf);

    $provider = new \Adldap\Connections\Provider($adconf);
    $activeDirectory = new \Adldap\Adldap();
    $activeDirectory->addProvider($provider, "CNM");
    $activeDirectory->setDefaultProvider("CNM");
    $activeDirectory->connect();

   $result = $activeDirectory->auth()->attempt($username, $password, true);
    var_dump($result);
    if ($result === true) {
        //$search = $provider->search();
       // $result = $search->findBy("samaccountname", $adconf['username']);
        // var_dump($result);
        //$result->getDisplayName() . " id: " . $result->getEmployeeId() . PHP_EOL
        echo "Successful connection.  Name: " ;
    } else{
        echo "failed";
    }

}catch(Adldap\Auth\UsernameRequiredException | Adldap\Auth\PasswordRequiredException | Adldap\Auth\BindException | Exception $error ) {
    var_dump($error);
}