<?php

require_once(dirname(__DIR__, 3) . "/php/Classes/autoload.php");
require_once(dirname(__DIR__, 3) . "/php/lib/ad-verify.php");
require_once(dirname(__DIR__, 3) . "/php/lib/mailer.php");
require_once(dirname(__DIR__, 3) . "/php/lib/xsrf.php");
require_once(dirname(__DIR__, 3) . "/php/lib/jwt.php");


use DdcFullstack\DdcWebStudent\Action;
use DdcFullstack\DdcWebStudent\Invite;
use Ramsey\Uuid\Uuid;

// set Email configuration parameters
$fromAddress = "pschulzetenber@cnm.edu";
$fromName = "Paul Schulzetenberg";

$inviteCreatedSubject = "Invite Request From --FULL_NAME--";

$inviteCreatedMessage = <<< EOF
<h1>Invite Request From --FULL_NAME--</h1>
<p>--FULL_NAME-- &lt;--USERNAME--@cnm.edu&gt; has requested an invite to the CNM STEMulus Deep Dive Coding Bootcamp Server. Please accept or decline their invite at:<br />
<a href="https://bootcamp-coders.cnm.edu/invite-admin/">https://bootcamp-coders.cnm.edu/invite-admin/</a></p>
<p>Thank you,<br />
$fromName</p>
EOF;

// set Email template for an accepted invited
$inviteAcceptedSubject = "Welcome to the CNM STEMulus Deep Dive Coding Bootcamp Server, --FULL_NAME--";
$inviteAcceptedMessage = <<< EOF
<h1>Account for the CNM STEMulus Deep Dive Coding Bootcamp Server Accepted</h1>
<p>Dear --FULL_NAME--:</p>
<p>Thank you for your request for an account on the CNM STEMulus Deep Dive Coding Bootcamp Server. Your request has been accepted by an administrator. You may now login and continue with the setup screencasts at:<br />
<a href="https://bootcamp-coders.cnm.edu/screencasts/prework/">https://bootcamp-coders.cnm.edu/screencasts/prework/</a></p>
<p>Please continue to work through the prework as completely as possible to get up to speed and to maximize your chances of success in the class. Don't hesitate to reach out if you have any questions.</p>
<p>Thank you,<br />
$fromName<br />
<a href="mailto:$fromAddress">$fromAddress</a></p>
EOF;

// start the session and create a XSRF token
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// prepare an empty reply
$reply = new stdClass();
$reply->status = 200;
$reply->data = null;

try {

    $secrets = new \Secrets("/etc/nginx/capstone-mysql/ddc-web.ini");
    $pdo = $secrets->getPdoObject();

    $method = $_SERVER["HTTP_X_HTTP_METHOD"] ?? $_SERVER["REQUEST_METHOD"];

    if ($method !== "POST" && $method !== "GET") {
        throw(new Exception("bad HTTP method", 405));
    }

    $command = filter_input(INPUT_GET, "command", FILTER_SANITIZE_STRING);
    $class = filter_input(INPUT_GET, "class", FILTER_SANITIZE_STRING);



    // ensure there's a user logged in
    if (verifyActiveDirectoryLogin() === false) {
        throw(new RuntimeException("user not logged into active directory", 401));
    }

    $isAdmin = isLoggedInAsAdmin($secrets);
    $admins = $secrets->getSecret("admins")->adminsList;

    $adminEmails = [];
    foreach ($admins as $admin) {
        $adminEmails[] = $admin . "@cnm.edu";
    }

    //This API is two APIs in one. The first if block preforms Admin level functions.
    // The if else handles student facing invite creation?
    // This API should be refactored into two separate APIS in the future
    if ($class === "action") {
        if ($isAdmin !== true) {
            throw(new RuntimeException("user is not an admin user", 401));
        }
        if ($method === "GET") {
            $reply->data = Action::getAllActions($pdo)->toArray();
            foreach($reply->data as $action) {
                $action->setInvite(Invite::getInviteByInviteId($pdo, $action->getInviteId()));
            }
        } elseif ($method === "POST") {
            // convert POSTed JSON to an object
            verifyXsrf();
            $requestContent = file_get_contents("php://input");
            $requestObject = json_decode($requestContent);
            $action = new Action(generateUuidV4(), $requestObject->inviteId, $requestObject->approved, $_SESSION["adUser"]->username);

            if($action->isApproved() === true) {
                $invite = Invite::getInviteByInviteId($pdo, $action->getInviteId());
                $username = escapeshellarg(filter_var($invite->getUsername(), FILTER_SANITIZE_STRING));
                $command = escapeshellcmd("sudo /etc/sssd/bin/user-post $username");
                $result = exec($command);
                $resultObject = json_decode($result);

                if($resultObject->status !== 200) {
                    throw(new RuntimeException($resultObject->message, $resultObject->status));
                }

                // second, send an Email
                $recipientAddress = $invite->getUsername() . "@cnm.edu";
                $recipientAddress = trim($recipientAddress);
                $recipientName = $invite->getFullName();
                $inviteAcceptedSubject = str_replace("--FULL_NAME--", $recipientName, $inviteAcceptedSubject);
                $inviteAcceptedMessage = str_replace("--FULL_NAME--", $recipientName, $inviteAcceptedMessage);
               // sendEmail($fromAddress, $fromName, $recipientAddress, $recipientName, $inviteAcceptedSubject, $inviteAcceptedMessage);
            }

            $action->insert($pdo);
            $reply->message = "Invite successfully processed";
        }
    } else if($class === "invite") {


        if($method === "GET") {

            if($isAdmin === false) {
                throw(new RuntimeException("user is not an admin user", 401));
            }


            if($command === "processed") {
                $actionInviteMap = Invite::getProcessedInvites($pdo);
                $result = [];
                foreach($actionInviteMap as $action) {
                    $action->setInvite($actionInviteMap->getInfo());
                    $result[] = $action;
                }
                $reply->data = $result;
                // report all waiting invites
            } else if($command === "waiting") {
                $reply->data = Invite::getWaitingInvites($pdo)->toArray();
            } else {
                throw(new InvalidArgumentException("action type not specified"));
            }
        } if($method === "POST") {
            // verify XSRF tokens
            verifyXsrf();


            // don't allow them to flood us with invites
            $alreadyInvited = Invite::getInviteByUsername($pdo, $_SESSION["adUser"]->username);

            //todo rewrite the Invite class so that getInviteByUsername to return an object not an SPLFixed array
            if($alreadyInvited->getSize() > 0) {
                throw(new InvalidArgumentException("You already have an invite awaiting action by a program administrator. You will receive an Email in your CNM Email if your invite is approved.", 405));
            }

            $username = filter_var($_SESSION["adUser"]->username, FILTER_SANITIZE_STRING);
            $username = escapeshellarg($username);
            $command = escapeshellcmd("sudo /etc/sssd/bin/user-get $username");
            $userJson = exec($command);
            $user = json_decode($userJson);
            if(empty($user->data) === false) {
                throw(new InvalidArgumentException("You already have an active account on the Deep Dive Coding Bootcamp server. An invitation is not necessary.", 405));
            }

            // grab session and server variables and create an Invite
            $invite = new Invite(generateUuidV4(), $_SESSION["adUser"]->username, $_SESSION["adUser"]->fullName, $_SERVER["HTTP_USER_AGENT"], $_SERVER["REMOTE_ADDR"]);

            $inviteCreatedSubject = str_replace("--FULL_NAME--", $_SESSION["adUser"]->fullName, $inviteCreatedSubject);
            $inviteCreatedMessage = str_replace("--FULL_NAME--", $_SESSION["adUser"]->fullName, $inviteCreatedMessage);
            $inviteCreatedMessage = str_replace("--USERNAME--", $_SESSION["adUser"]->username, $inviteCreatedMessage);
            // sendEmail($fromAddress, $fromName, $adminEmails, null, $inviteCreatedSubject, $inviteCreatedMessage);
            $reply->message = "Invite successfully submitted. You will receive an Email in your CNM Email if your invite is approved by a program administrator.";
            $invite->insert($pdo);
        }
    } else {
        throw(new InvalidArgumentException("invalid class", 405));
    }

} catch (\Exception | TypeError | InvalidArgumentException | RuntimeException | Error $exception) {
    $reply->status = $exception->getCode();
    $reply->message = $exception->getMessage();
}

// encode and return reply to front end caller
header("Content-type: application/json");
echo json_encode($reply);