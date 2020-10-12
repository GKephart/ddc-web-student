<?php
/**
 * detects the domain controllers from DNS based on the domain name
 *
 * @param string $domainName domain name to search or null to autodetect
 * @return array domain controllers found, or empty array if none found
 **/
function detectDomainController(string $domainName = null) : array {
    // autodetect the domain name based on the server's hostname
    if($domainName === null) {
        $hostname = empty($_SERVER["HTTP_HOST"]) === true ? $_SERVER["SERVER_NAME"] : $_SERVER["HTTP_HOST"];
        $domainName = $hostname;
        $lastDot = strrpos($hostname, ".");
        if($lastDot !== false) {
            $secondDot = strrpos($hostname, ".", -(strlen($hostname) - $lastDot + 1));
            if($secondDot !== false) {
                $domainName = substr($hostname, $secondDot + 1);
            }
        }
    }

    // sanitize the hostname
    $domainName = filter_var(strtolower(trim($domainName)), FILTER_SANITIZE_URL);
    $rfc1123regex = "/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/";
    if(empty($domainName) === true) {
        throw(new \InvalidArgumentException("domain name is not valid"));
    }
    $domainName = filter_var($domainName, FILTER_VALIDATE_REGEXP, ["options" => ["regexp" => $rfc1123regex]]);
    if($domainName === false) {
        throw(new \InvalidArgumentException("domain name is not valid"));
    }

    // query DNS for the domain controllers
    $dnsQuery = "_ldap._tcp.dc._msdcs.$domainName";
    $dnsResults = dns_get_record($dnsQuery, DNS_SRV);
    if($dnsResults === false) {
        throw(new \RuntimeException("DNS query failed"));
    }

    // grab the domain controllers out of the array
    $domainControllers = [];
    foreach($dnsResults as $dnsResult) {
        $domainControllers[] = $dnsResult["target"];
    }
    sort($domainControllers);
    return ($domainControllers);
}

/**
 * generates the base dn based on the domain name
 *
 * @param string $domainName domain name to use as a basis
 * @return string formatted base dn
 **/
function generateBaseDn(string $domainName) : string {
    $serverHostnameComponents = explode(".", $domainName);
    $serverBaseDn = "";
    foreach($serverHostnameComponents as $index => $name) {
        $serverBaseDn = $serverBaseDn . "dc=$name";
        if($index < count($serverHostnameComponents) - 1) {
            $serverBaseDn = "$serverBaseDn,";
        }
    }
    return($serverBaseDn);
}