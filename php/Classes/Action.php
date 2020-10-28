<?php

namespace DdcFullstack\DdcWebStudent;
require_once("autoload.php");

require_once(dirname(__DIR__, 2) . "/vendor/autoload.php");


use Ramsey\Uuid\Uuid;
use \InvalidArgumentException;
use \RangeException;
use \Exception;
use \TypeError;
use \DateTime;
use \PDOException;
use \PDO;

/**
 * Action Data Access Object
 *
 * This is a mySQL Enabled object that records an action by a program administrator when they receive an Invite request.
 **/
class Action implements \JsonSerializable {
    use ValidateDate;
    use ValidateUuid;
    /**
     * id for this Action; this is the primary key
     * @var Uuid|string $actionId
     **/
    private $actionId;

    /**
     * id for the Invite this Action is in reaction to; this is a foreign key
     * @var Uuid|string $inviteId
     **/
    private $inviteId;

    /**
     * whether this Action was approved
     * @var boolean|int $approved
     **/
    private $approved;

    /**
     * date and time this action was taken; this is derived from mySQL
     * @var DateTime $actionDate
     **/
    private $actionDate;

    /**
     * user that took this action
     * @var string $actionUser
     **/
    private $actionUser;

    /**
     * invite associated with this invite; this is used for greedy initialization during API calls
     * @var Invite $invite
     **/
    private $invite;

    /**
     * constructor for this Action
     *
     * @param Uuid|string $newActionId id of this action or null if a new Action
     * @param Uuid|string $newInviteId id of the Invite
     * @param boolean|int $newApproved whether approved, as a boolean or integer
     * @param string $newActionUser user performing the action
     * @param DateTime|string|null $newActionDate date this action was performed or null to set to the current date and time
     * @throws InvalidArgumentException if data types are not valid
     * @throws RangeException if data values are out of bounds (e.g., strings too long, negative integers)
     * @throws Exception if some other exception is thrown
     */
    public function __construct(Uuid $newActionId, Uuid $newInviteId, $newApproved, string $newActionUser, $newActionDate = null) {
        try {
            $this->setActionId($newActionId);
            $this->setInviteId($newInviteId);
            $this->setApproved($newApproved);
            $this->setActionDate($newActionDate);
            $this->setActionUser($newActionUser);
            $this->setInvite(null);
        } catch(InvalidArgumentException | RangeException | Exception | TypeError $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), 0, $exception));
        }
    }

    /**
     * accessor method for action id
     *
     * @return Uuid current value of action id
     **/
    public function getActionId() : Uuid {
        return($this->actionId);
    }

    /**
     * mutator method for action id
     *
     * @param Uuid|string $newActionId new value of action id, or null if brand new
     * @throws InvalidArgumentException if action id is not an integer
     * @throws RangeException if action id is negative
     **/
    public function setActionId(Uuid $newActionId) {
        try {
            $uuid = self::validateUuid($newActionId);
        } catch(\InvalidArgumentException | \RangeException | \Exception | \TypeError $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), 0, $exception));
        }

        // convert and store the tweet id
        $this->actionId = $uuid;
    }

    /**
     * accessor method for invite id
     *
     * @return Uuid current value of invite id
     **/
    public function getInviteId() : Uuid{
        return($this->inviteId);
    }

    /**
     * mutator method for invite id
     *
     * @param Uuid $newInviteId new value of invite id
     * @throws InvalidArgumentException if invite id is not an integer
     * @throws RangeException if invite id is negative
     **/
    public function setInviteId(Uuid $newInviteId) {
        try {
            $uuid = self::validateUuid($newInviteId);
        } catch(\InvalidArgumentException | \RangeException | \Exception | \TypeError $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), 0, $exception));
        }
        // convert and store the tweet id
        $this->inviteId = $uuid;
    }

    /**
     * accessor method for approved
     *
     * @return bool value of approved, as a boolean
     **/
    public function isApproved() : bool {
        return($this->approved === 1);
    }

    /**
     * mutator method for approved
     *
     * @param bool|int $newApproved new value of approved
     * @throws InvalidArgumentException if newApproved is not a boolean
     **/
    public function setApproved(int $newApproved) {
        // verify the approval is valid
        $newApproved = filter_var($newApproved, FILTER_VALIDATE_BOOLEAN);
        if($newApproved === null) {
            throw(new InvalidArgumentException("approved is not a boolean"));
        }

        // assign approved as an integer for mySQL's sake
        $this->approved = $newApproved ? 1 : 0;
    }

    /**
     * accessor method for action date
     *
     * @return DateTime current value of action date, as an object
     **/
    public function getActionDate() {
        return($this->actionDate);
    }

    /**
     * mutator method for action date
     *
     * @param DateTime|string|null $newActionDate new value of action date, or null for the current date
     * @throws InvalidArgumentException if the date is incorrectly formatted
     * @throws RangeException if the date is not a Gregorian date
     **/
    public function setActionDate($newActionDate = null) {
        // base case: if the date is null, use the current date and time
        if ($newActionDate === null) {
            $this->actionDate = new \DateTime();
            return;
        }

        // store the like date using the ValidateDate trait
        try {
            $newActionDate = self::validateDateTime($newActionDate);
        } catch (\InvalidArgumentException | \RangeException | Exception $exception) {
            $exceptionType = get_class($exception);
            throw(new $exceptionType($exception->getMessage(), 0, $exception));
        }
        $this->actionDate = $newActionDate;
    }

    /**
     * accessor method for action user
     *
     * @return string current value of action user
     **/
    public function getActionUser() : string {
        return($this->actionUser);
    }

    /**
     * mutator method for action user
     *
     * @param string $newActionUser new value of action user
     * @throws InvalidArgumentException if action user is invalid
     * @throws RangeException if action user is too large
     **/
    public function setActionUser(string $newActionUser) {
        // verify the action user is secure
        $newActionUser = trim($newActionUser);
        $newActionUser = filter_var($newActionUser, FILTER_SANITIZE_STRING);
        if(empty($newActionUser) === true) {
            throw(new InvalidArgumentException("action user is empty or insecure"));
        }

        // verify the action user will fit in the database
        if(strlen($newActionUser) > 20) {
            throw(new RangeException("action user too large"));
        }

        // store the action user
        $this->actionUser = $newActionUser;
    }

    /**
     * accessor method for invite
     *
     * @return Invite current value of invite
     **/
    public function getInvite() : Invite {
        return($this->invite);
    }

    /**
     * mutator method for invite
     *
     * @param Invite|null $invite null for lazy initialization, Invite object for greedy initialization
     **/
    public function setInvite(Invite $invite = null) {
        $this->invite = $invite;
    }

    /**
     * inserts this Action into mySQL
     *
     * @param PDO $pdo pointer to mySQL connection
     * @throws PDOException when mySQL related errors occur
     **/
    public function insert(PDO $pdo) {
        // enforce the actionId is null (i.e., don't insert an Action that already exists)
        if($this->actionId !== null) {
            throw(new PDOException("not a new action"));
        }

        // create query template
        $query = "INSERT INTO action(actionId, inviteId, approved, actionUser) VALUES(:inviteId, :approved, :actionUser)";
        $statement = $pdo->prepare($query);

        // bind the member variables to the place holders in the template
        $parameters = [
            "actionId"=>$this->actionId->getBytes(),
            "inviteId" => $this->inviteId->getBytes(),
            "approved" => $this->approved,
            "actionUser" => $this->actionUser
        ];

        $statement->execute($parameters);

        // update the null action id with what mySQL just gave us
        $this->actionId = intval($pdo->lastInsertId());
        $this->actionDate = new DateTime();
    }

    /**
     * gets an Action by an action id
     *
     * @param PDO $pdo pointer to mySQL connection
     * @param string|Uuid $actionId action id to search for
     * @return Action|null found Action or null if not found
     * @throws PDOException when mySQL related errors occur
     **/
    public function getActionByActionId(PDO $pdo, string $actionId) : ?Action {

        try {
            $actionId = self::validateUuid($actionId);
        } catch(\InvalidArgumentException | \RangeException | \Exception | \TypeError $exception) {
            throw(new \PDOException($exception->getMessage(), 0, $exception));
        }
        // sanitize the action id before searching
        // create query template
        $query = "SELECT actionId, inviteId, actionDate, approved, actionUser FROM action WHERE actionId = :actionId";
        $statement = $pdo->prepare($query);

        // bind the action id to the place holder in the template
        $parameters = ["actionId" => $actionId->getBytes()];
        $statement->execute($parameters);

        // grab the Action from mySQL
        try {
            $action = null;
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $row = $statement->fetch();
            if($row !== false) {
                $action = new Action($row["actionId"], $row["inviteId"], $row["approved"], $row["actionUser"], $row["actionDate"]);
            }
        } catch(Exception $exception) {
            throw(new PDOException($exception->getMessage(), 0, $exception));
        }
        return($action);
    }

    /**
     * gets an Action by invite id
     *
     * @param PDO $pdo pointer to mySQL connection
     * @param Uuid|string $inviteId invite id to search for
     * @return Action|null found Action or null if not found
     * @throws PDOException when mySQL related errors occur
     **/
    public function getActionByInviteId(PDO $pdo, string $inviteId) {
        try {
            $inviteId = self::validateUuid($inviteId);
        } catch(\InvalidArgumentException | \RangeException | \Exception | \TypeError $exception) {
            throw(new \PDOException($exception->getMessage(), 0, $exception));
        }


        // create query template
        $query = "SELECT actionId, inviteId, actionDate, approved, actionUser FROM action WHERE inviteId = :inviteId";
        $statement = $pdo->prepare($query);

        // bind the invite id to the place holder in the template
        $parameters = ["inviteId" => $inviteId->getBytes()];
        $statement->execute($parameters);

        // grab the Action from mySQL
        try {
            $action = null;
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $row = $statement->fetch();
            if($row !== false) {
                $action = new Action($row["actionId"], $row["inviteId"], $row["approved"], $row["actionUser"], $row["actionDate"]);
            }
        } catch(Exception $exception) {
            throw(new PDOException($exception->getMessage(), 0, $exception));
        }
        return($action);
    }

    /**
     * gets all Actions
     *
     * @param PDO $pdo pointer to mySQL connection
     * @return SplFixedArray all Actions found
     * @throws PDOException when mySQL related errors occur
     **/
    public static function getAllActions(PDO $pdo) {
        // create query template
        $query = "SELECT actionId, inviteId, approved, actionDate, actionUser FROM action";
        $statement = $pdo->prepare($query);
        $statement->execute();

        // build an array of actions
        $actions = new SplFixedArray($statement->rowCount());
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        while(($row = $statement->fetch()) !== false) {
            try {
                $action = new Action($row["actionId"], $row["inviteId"], $row["approved"], $row["actionUser"], $row["actionDate"]);
                $actions[$actions->key()] = $action;
                $actions->next();
            } catch(Exception $exception) {
                throw(new PDOException($exception->getMessage(), 0, $exception));
            }
        }
        return($actions);
    }

    /**
     * formats state variables for JSON encoding
     *
     * @return array formatted state variables to be JSON encoded
     **/
    public function jsonSerialize() : array {
        $stateVariables = get_object_vars($this);
        $stateVariables["inviteId"] = $this->inviteId;
        $stateVariables["actionId"] = $this->actionId;
        $stateVariables["actionDate"] = $this->actionDate->getTimestamp() * 1000;
        if(empty($stateVariables["invite"]) === true) {
            unset($stateVariables["invite"]);
        }
        return($stateVariables);
    }
}