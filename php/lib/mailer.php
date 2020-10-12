<?php
require_once(dirname(dirname(dirname(__DIR__))) . "/vendor/autoload.php");

/**
 * sends an email via SwiftMailer
 *
 * @param string $fromAddress sender address
 * @param string|null $fromName sender name (optional - null to omit)
 * @param array|string $toAddress recipient address
 * @param array|string|null $toName recipient name (optional - null to omit)
 * @param string $subject subject line
 * @param string $message content of the actual Email
 * @param bool $isHTML whether the $message is HTML formatted (true by default)
 * @throws InvalidArgumentException when required fields are omitted or null
 * @throws RuntimeException if SwiftMailer cannot send the Email
 **/
function sendEmail($fromAddress, $fromName, $toAddress, $toName, $subject, $message, $isHTML = true) {
    // verify required fields are present
    if(empty($fromAddress) === true) {
        throw(new InvalidArgumentException("from address is required"));
    }
    if(empty($toAddress) === true) {
        throw(new InvalidArgumentException("to address is required"));
    }
    if(empty($subject) === true) {
        throw(new InvalidArgumentException("subject is required"));
    }
    if(empty($message) === true) {
        throw(new InvalidArgumentException("message is required"));
    }

    // verify the recipient data types match
    if($toName !== null && ((gettype($toAddress) !== gettype($toName))
            || (gettype($toAddress) !== "array" && gettype($toAddress) !== "string")
            || (gettype($toAddress) === "array" && count($toAddress) !== count($toName)))) {
        throw(new InvalidArgumentException("inconsistent recipient data"));
    }

    // create the sender
    $swiftMessage = new Swift_Message();
    if(empty($fromName) === false) {
        $swiftMessage->setFrom([$fromAddress => $fromName]);
    } else {
        $swiftMessage->setFrom($fromAddress);
    }

    // load recipients into an array
    if(gettype($toAddress) === "array") {
        $recipients = [];
        if(gettype($toName) === "array") {
            for($i = 0; $i < count($toAddress); $i++) {
                $recipients[$toAddress[$i]] = $toName[$i];
            }
        } else {
            for($i = 0; $i < count($toAddress); $i++) {
                $recipients[] = $toAddress[$i];
            }
        }
        $swiftMessage->setTo($recipients);
        // create a single recipient
    } else if(gettype($toAddress) === "string") {
        if(empty($toName) === false) {
            $swiftMessage->setTo([$toAddress => $toName]);
        } else {
            $swiftMessage->setTo($toAddress);
        }
    }

    // create the message data
    $swiftMessage->setSubject($subject);
    if($isHTML === true) {
        $swiftMessage->setBody($message, "text/html");
        $swiftMessage->addPart(html_entity_decode(filter_var($message, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES)), "text/plain");
    } else {
        $swiftMessage->setBody($message, "text/plain");
    }

    // send the mail
    $smtp = new Swift_SmtpTransport("localhost", 25);
    $mailer = new Swift_Mailer($smtp);
    $numSent = $mailer->send($swiftMessage);

    if($toAddress === "string" && $numSent !== 1) {
        throw(new RuntimeException("unable to send email"));
    }
    if($toAddress === "array" && $numSent !== count($toAddress)) {
        throw(new RuntimeException("unable to send email"));
    }
}