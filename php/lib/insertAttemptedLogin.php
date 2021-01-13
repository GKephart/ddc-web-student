<?php
function insertAttemptedLogin(\PDO $pdo, $parameters) {

// create query template
$query = "INSERT INTO attemptedLogin(attemptedLoginId, attemptedLoginUsername, attemptedLoginResult, createDate, ip, browser) 
VALUES(:attemptedLoginId, :attemptedLoginUsername, :attemptedLoginResult, :createDate, :ip, :browser)";
$statement = $pdo->prepare($query);

$statement->execute($parameters);
}