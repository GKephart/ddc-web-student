<?php
namespace DdcFullstack\DdcWebStudent;

use Ramsey\Uuid\Uuid;
use \InvalidArgumentException;
use \RangeException;
use \Exception;
use \TypeError;
use \DateTime;
use \PDOException;
use \PDO;
use \SplFixedArray;

require_once("autoload.php");
require_once(dirname(__DIR__, 2) . "/vendor/autoload.php");

/**
 * Invite Data Access Object
 *
 * This is a mySQL Enabled object that records an invitation request by a user to be later approved or declined
 * by a program administrator.
 *
 * @author Dylan McDonald <dmcdonald21@cnm.edu>
 **/
class Invite implements \JsonSerializable {
    use ValidateDate;
    use ValidateUuid;
    /**
     * id for this Invite; this is the primary key
     * @var Uuid|string
     * $inviteId
     **/
    private $inviteId;

    /**
     * username from Active Directory; this is a unique key
     * @var string $username
     **/
    private $username;

    /**
     * full name from Active Directory
     * @var string $fullname
     **/
    private $fullName;

    /**
     * date and time this Invite was created; this is derived from mySQL
     * @var DateTime $createDate
     **/
    private $createDate;

    /**
     * user agent string of this Invite
     * @var string $browser
     **/
    private $browser;

    /**
     * IP address of this Invite; this is stored as network address and accessed as a printable string
     * @var string $ip
     **/
    private $ip;

    /**
     * constructor for this Invite
     *
     * @param Uuid|string $newInviteId id of this Invite, or null if brand new
     * @param string $newUsername username that requested this Invite
     * @param string $newFullName full name of the person that requested this Invite
     * @param string $newBrowser user agent string of the person that requested this Invite
     * @param string $newIp IP address of the person that sent this Invite
     * @param DateTime|null $newCreateDate date this Invite was requested
     * @throws InvalidArgumentException when parameters are incorrect
     * @throws RangeException when parameters are out of range or too large
     * @throws Exception rethrown when other exceptions occur
     **/
    public function __construct( $newInviteId, string $newUsername, string $newFullName, string $newBrowser, string $newIp, $newCreateDate = null) {
        try {

            $this->setInviteId($newInviteId);
            $this->setUsername($newUsername);
            $this->setFullName($newFullName);
            $this->setBrowser($newBrowser);
            $this->setIp($newIp);
            $this->setCreateDate($newCreateDate);
        } catch(InvalidArgumentException | RangeException | Exception | TypeError $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), $exception->getCode(), $exception));
        }
    }

    /**
     * accessor method for invite id
     *
     * @return Uuid current value of invite id
     **/
    public function getInviteId() : Uuid {
        return($this->inviteId);
    }

    /**
     * mutator method for invite id
     *
     * @param Uuid|string $newInviteId new value of invite id, or null if brand new
     * @throws InvalidArgumentException if invite id is not an integer
     * @throws RangeException if invite id is negative
     **/
    public function setInviteId($newInviteId) {
        try {
            $uuid = self::validateUuid($newInviteId);
        } catch(\InvalidArgumentException | \RangeException | \Exception | \TypeError $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), $exception->getCode(), $exception));
        }
        // convert and store the tweet id
        $this->inviteId = $uuid;
    }

    /**
     * accessor method for username
     *
     * @return string current value of username
     **/
    public function getUsername() : string {
        return($this->username);
    }

    /**
     * mutator method for username
     *
     * @param string $newUsername new value of username
     * @throws InvalidArgumentException if username is invalid
     * @throws RangeException if username is too large
     **/
    public function setUsername(string $newUsername) {
        // verify the username is secure
        $newUsername = trim($newUsername);
        $newUsername = filter_var($newUsername, FILTER_SANITIZE_STRING);
        if(empty($newUsername) === true) {
            throw(new InvalidArgumentException("username is empty or insecure"));
        }

        // verify the username will fit in the database
        if(strlen($newUsername) > 20) {
            throw(new RangeException("username too large"));
        }

        // store the username
        $this->username = $newUsername;
    }

    /**
     * accessor method for full name
     *
     * @return string current value of full name
     **/
    public function getFullName() : string {
        return($this->fullName);
    }

    /**
     * mutator method for full name
     *
     * @param string $newFullName new value of full name
     * @throws InvalidArgumentException if full name is invalid
     * @throws RangeException if full name is too large
     **/
    public function setFullName(string $newFullName) {
        // verify the full name is secure
        $newFullName = trim($newFullName);
        $newFullName = filter_var($newFullName, FILTER_SANITIZE_STRING);
        if(empty($newFullName) === true) {
            throw(new InvalidArgumentException("full name is empty or insecure"));
        }

        // verify the full name will fit in the database
        if(strlen($newFullName) > 64) {
            throw(new RangeException("full name too large"));
        }

        // store the full name
        $this->fullName = $newFullName;
    }

    /**
     * accessor method for create date
     *
     * @return DateTime current value of create date, as an object
     **/
    public function getCreateDate() : DateTime {
        return($this->createDate);
    }

    /**
     * mutator method for create date
     *
     * @param DateTime|string|null $newCreateDate new value of create date, or null for the current date
     * @throws InvalidArgumentException if the date is incorrectly formatted
     * @throws RangeException if the date is not a Gregorian date
     **/
    public function setCreateDate($newCreateDate) {
        // base case: if the create date is null, use the current date and time
        if($newCreateDate === null) {
            $this->createDate = new DateTime();
            return;
        }

        // store the create date
        try {
            $newCreateDate = self::validateDateTime($newCreateDate);
        } catch(InvalidArgumentException| Exception $invalidArgument) {
            throw(new InvalidArgumentException($invalidArgument->getMessage(), 0, $invalidArgument));
        } catch(RangeException $range) {
            throw(new RangeException($range->getMessage(), 0, $range));
        }
        $this->createDate = $newCreateDate;
    }

    /**
     * accessor method for browser
     *
     * @return string current value of browser
     **/
    public function getBrowser() : string {
        return($this->browser);
    }

    /**
     * mutator method for browser
     *
     * @param string $newBrowser new value of browser
     * @throws InvalidArgumentException if browser is invalid
     * @throws RangeException if browser is too large
     **/
    public function setBrowser($newBrowser) {
        // verify the browser is secure
        $newBrowser = trim($newBrowser);
        $newBrowser = filter_var($newBrowser, FILTER_SANITIZE_STRING);
        if(empty($newBrowser) === true) {
            throw(new InvalidArgumentException("browser is empty or insecure"));
        }

        // verify the browser will fit in the database
        if(strlen($newBrowser) > 512) {
            throw(new RangeException("browser too large"));
        }

        // store the full name
        $this->browser = $newBrowser;
    }

    /**
     * accessor method for IP
     *
     * @param bool $binaryMode whether or not to return the IP address in binary mode
     * @return string current value of IP in the format indicated by $binaryMode
     **/
    public function getIp( bool $binaryMode = false) {
        if($binaryMode === true) {
            return($this->ip);
        }
        return(inet_ntop($this->ip));
    }

    /**
     * mutator method for IP
     *
     * @param string $newIp new value of IP, in binary or printable mode
     * @throws InvalidArgumentException if the IP cannot be interpreted
     */
    public function setIp(string $newIp) {
        // detect the IP's format and assign it in binary mode
        if(@inet_pton($newIp) !== false) {
            $this->ip = inet_pton($newIp);
        } else if(@inet_ntop($newIp) !== false) {
            $this->ip = $newIp;
        } else {
            throw(new InvalidArgumentException("invalid IP address"));
        }
    }

    /**
     * inserts this Invite into mySQL
     *
     * @param PDO $pdo pointer to mySQL connection
     * @throws PDOException when mySQL related errors occur
     **/
    public function insert(PDO $pdo) {
        // create query template
        $query = "INSERT INTO invite(inviteId, username, fullName, browser, ip, createDate) VALUES(:inviteId, :username, :fullName, :browser, :ip, :createDate)";
        $statement = $pdo->prepare($query);

        $formattedDate = $this->createDate->format("Y-m-d H:i:s.u");

        // bind the member variables to the place holders in the template
        $parameters = ["inviteId" =>$this->inviteId->getBytes(),"username" => $this->username, "fullName" => $this->fullName,
            "browser" => $this->browser, "ip" => $this->ip, "createDate" =>$formattedDate];
        $statement->execute($parameters);

        // update the null invite id with what mySQL just gave us
        $this->inviteId = intval($pdo->lastInsertId());
    }

    /**
     * gets an Invite by invite id
     *
     * @param PDO $pdo pointer to mySQL connection
     * @param string|Uuid $inviteId invite id to search for
     * @return Invite|null found Invite or null if not found
     * @throws PDOException when mySQL related errors occur
     **/
    public static function getInviteByInviteId(PDO $pdo,  $inviteId) : ?Invite {
        if(Uuid::isValid($inviteId) === false) {
            throw new InvalidArgumentException("Please provide a valid Uuid");
        }
        $inviteId = Uuid::fromString($inviteId);
        // create query template
        $query = "SELECT inviteId, username, fullName, createDate, browser, ip FROM invite WHERE inviteId = :inviteId";
        $statement = $pdo->prepare($query);

        // bind the invite id to the place holder in the template
        $parameters = ["inviteId" => $inviteId->getBytes()];
        $statement->execute($parameters);

        // grab the Invite from mySQL
        try {
            $invite = null;
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $row = $statement->fetch();
            if($row !== false) {
                $invite = new Invite($row["inviteId"], $row["username"], $row["fullName"], $row["browser"], $row["ip"], $row["createDate"]);
            }
        } catch(Exception $exception) {
            throw(new PDOException($exception->getMessage(), 0, $exception));
        }
        return($invite);
    }

    /**
     * gets all invites for a username
     *
     * @param PDO $pdo pointer to PDO connection
     * @param string $username username to search for
     * @return SplFixedArray all the invites for this username
     * @throws PDOException when mySQL related errors occur
     **/
    public static function getInviteByUsername(PDO $pdo, string $username)  : SplFixedArray {
        // sanitize the username before searching
        $username = filter_var($username, FILTER_SANITIZE_STRING);
        if($username === false) {
            throw(new PDOException("username is empty or insecure"));
        }

        // create query template
        $query = "SELECT inviteId, username, fullName, createDate, browser, ip FROM invite WHERE username = :username";
        $statement = $pdo->prepare($query);

        // bind the username to the place holder in the template
        $parameters = ["username" => $username];
        $statement->execute($parameters);

        // grab the Invites from mySQL
        $invites = new SplFixedArray($statement->rowCount());
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        while(($row = $statement->fetch()) !== false) {
            try {
                $invite = new Invite($row["inviteId"], $row["username"], $row["fullName"], $row["browser"], $row["ip"], $row["createDate"]);
                $invites[$invites->key()] = $invite;
                $invites->next();
            } catch(Exception $exception) {
                throw(new PDOException($exception->getMessage(), 0, $exception));
            }
        }
        return($invites);
    }

    /**
     * maps all invites that have been processed to the action that was taken
     *
     * @param PDO $pdo pointer to PDO connection
     * @return SplObjectStorage map from actions to invites
     * @throws PDOException when mySQL related errors occur
     **/
    public static function getProcessedInvites(PDO $pdo) : \SplObjectStorage {
        // create query template
        $query = "SELECT invite.inviteId, createDate, username, fullName, browser, ip, actionId, approved, actionDate, actionUser
FROM invite
INNER JOIN action ON invite.inviteId = action.inviteId";
        $statement = $pdo->prepare($query);
        $statement->execute();

        // build a map of invites and actions
        $actionInviteMap = new \SplObjectStorage();
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        while(($row = $statement->fetch()) !== false) {
            try {
                $action = new Action($row["actionId"], $row["inviteId"], $row["approved"], $row["actionUser"], $row["actionDate"]);
                $invite = new Invite($row["inviteId"], $row["username"], $row["fullName"], $row["browser"], $row["ip"], $row["createDate"]);
                $actionInviteMap->attach($action, $invite);
            } catch(Exception $exeption) {
                throw(new PDOException($exeption->getMessage(), 0, $exeption));
            }
        }
        return($actionInviteMap);
    }

    /**
     * gets all invites with no action associated with them
     *
     * @param PDO $pdo pointer to PDO connection
     * @return SplFixedArray all invites with no actions
     * @throws PDOException when mySQL related errors occur
     **/
    public static function getWaitingInvites(PDO $pdo) : \SplFixedArray {

        // create query template
        $query = "SELECT invite.inviteId, createDate, username, fullName, browser, ip
FROM invite
LEFT OUTER JOIN action ON invite.inviteId = action.inviteId
WHERE actionId IS NULL";
        $statement = $pdo->prepare($query);
        $statement->execute();

        // build an array of invites
        $invites = new \SplFixedArray($statement->rowCount());
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        while(($row = $statement->fetch()) !== false) {
            try {
                $invite = new Invite($row["inviteId"], $row["username"], $row["fullName"], $row["browser"], $row["ip"], $row["createDate"]);
                $invites[$invites->key()] = $invite;
                $invites->next();
            } catch(Exception $exception) {
                throw(new PDOException($exception->getMessage(), 0, $exception));
            }
        }
        return($invites);
    }

    /**
     * formats state variables for JSON encoding
     *
     * @return array formatted state variables to be JSON encoded
     **/
    public function jsonSerialize() {
        $stateVariables = get_object_vars($this);
        $stateVariables["inviteId"] = $this->inviteId;
        $stateVariables["ip"] = inet_ntop($this->ip);
        $stateVariables["createDate"] = $this->createDate->getTimestamp() * 1000;
        return($stateVariables);
    }
}