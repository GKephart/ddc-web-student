<?php
require_once("/etc/nginx/capstone-mysql/Secrets.php");
/**
 * verifies whether the user is logged in or not; if so, the login timer is reset
 *
 * @return bool true if logged in, false if not
 **/
function verifyActiveDirectoryLogin() {
    // start the session if not active
    if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    // search the session for login data
    $loggedIn = false;
    //var_dump($_SESSION["adUser"]->loginTime);
    if(empty($_SESSION["adUser"]->username) === false) {
        if((time() - $_SESSION["adUser"]->loginTime) < 600) {
            //$_SESSION["adUser"]->loginTime = time();
            $loggedIn = true;
        } else {
            $_SESSION["adUser"] = [];
            unset($_SESSION["adUser"]);
        }
    }
    return($loggedIn);
}

/**
 *
 * verifies whether the use is logged in *AND* is an administrator
 * this function can be used as drop in replacement for verifyActiveDirectoryLogin
 *
 * @see verifyActiveDirectoryLogin
 * @return bool true if an admin, false if not
 **/
function isLoggedInAsAdmin(\Secrets $secrets ) : bool {
    // start the session if not active
    if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    // search the session for login data
    $isAdmin = false;
    if(empty($_SESSION["adUser"]->username) === false) {
        if((time() - $_SESSION["adUser"]->loginTime) < 600) {

            // see if the the user is an admin user
            $_SESSION["adUser"]->loginTime = time();
            $admins = $secrets->getSecret("admins");
            $isAdmin = in_array($_SESSION["adUser"]->username, $admins->adminsList);
        } else {
            $_SESSION["adUser"] = array();
            unset($_SESSION["adUser"]);
        }
    }
    return($isAdmin);
}