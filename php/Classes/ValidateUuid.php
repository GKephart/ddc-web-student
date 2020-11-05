<?php
namespace DdcFullstack\DdcWebStudent;

require_once(dirname(__DIR__, 2) . "/vendor/autoload.php");

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\Rfc4122\UuidV4;

/**
 * Trait to validate a uuid
 *
 * This trait will validate a uuid in any of the following three formats:
 *
 * 1. human readable string (36 bytes)
 * 2. binary string (16 bytes)
 * 3. Ramsey\Uuid\Uuid object
 *
 * @author Dylan McDonald <dmcdonald21@cnm.edu>
 * @package Edu\Cnm\Misquote
 **/
trait ValidateUuid {
    /**
     * validates a uuid irrespective of format
     *
     * @param string|Uuid $newUuid uuid to validate
     * @return Uuid object with validated uuid
     * @throws \InvalidArgumentException if $newMisquoteId is not a valid uuid
     * @throws \RangeException if $newMisquoteId is not a valid uuid v4
     **/
    private static function validateUuid( $newUuid)  {
        // verify a string uuid
        if(gettype($newUuid) === "string") {
            // 16 characters is binary data from mySQL - convert to string and fall to next if block
            if(strlen($newUuid) === 16) {
                $newUuid = bin2hex($newUuid);

                $newUuid = substr($newUuid, 0, 8) . "-" . substr($newUuid, 8, 4) . "-" . substr($newUuid,12, 4) . "-" . substr($newUuid, 16, 4) . "-" . substr($newUuid, 20, 12);
            }

            // 32 characters is a human readable uuid
            if(strlen($newUuid) === 36) {

                if(Uuid::isValid($newUuid) === false) {
                    throw(new \InvalidArgumentException("invalid uuid",400));
                }

                $uuid = Uuid::fromString($newUuid);

            } else {
                throw(new \InvalidArgumentException("invalid uuid",401));
            }
        } else if(gettype($newUuid) === "object" && get_class($newUuid) === "Ramsey\Uuid\Rfc4122\UuidV4") {
            // if the misquote id is already a valid UUID, press on
            $uuid = $newUuid;
        } else {
            // throw out any other trash
            throw(new \InvalidArgumentException("invalid uuid",402));
        }
        return($uuid);
    }
}