<?php
/**
 Copyright (C)  2010 Urmila Champatiray.
    Permission is granted to copy, distribute and/or modify this document
    under the terms of the GNU Free Documentation License, Version 1.3
    or any later version published by the Free Software Foundation;
    with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
    A copy of the license is included in the section entitled "GNU
    Free Documentation License"
	@license GNU/GPL http://www.gnu.org/copyleft/gpl.html
    Network Tools for Joomla
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
Version 1.0
Created date: October 2010
Creator: Urmila Champatiray
Email: admin@joomlaseo.org
**/

//class NetworkQueryTool
class Networktools {
  
  //Constant properties
  /* The path to the traceroute binary on your server */
  private static $TRACEROUTE_PATH  = '/usr/sbin/traceroute';
  
  /* The path to the ping binary on your server */
  private static $PING_PATH        = '/sbin/ping';
  
  /* The path to the dig binary on your server (Unix only) */
  private static $DIG_PATH         = '/usr/bin/dig';
  
  /* Try removing disclaimers and notices from WHOIS info? (experimental) */
  private static $SAVE_BANDWIDTH = true;
  
  /*
  TLDs that contain subdomains by rule, and are allowed. NOT YET IMPLEMENTED.
  As of this revision, hosts with these TLDs are not compatible with the
  wwwWhois methods. They will be supported in a future version.
  */
  /*
  private static $SECOND_LEVEL_TLDS = array ('.com.au', '.net.au', '.asn.au', 
                                             '.id.au', '.org.au', '.co.uk', 
                                             '.ac.uk', '.gov.uk', '.co.nz');
  */
  private static $SECOND_LEVEL_TLDS = array(); //Empty default for now
  
  /* Error code definitions */
  private static $NQT_INVALID_HOST     = 1;    //Bad hostname supplied
  private static $NQT_INVALID_ADDR     = 2;    //Bad IP address supplied
  private static $NQT_RESOLVEFAIL_NAME = 4;    //Can't resolve name to IP
  private static $NQT_RESOLVEFAIL_ADDR = 8;    //Can't resolve IP to name
  private static $NQT_TLD_UNSUPPORTED  = 16;   //TLD that we can't WHOIS
  private static $NQT_BOOLEAN_EXPECTED = 32;   //Non-boolean parameter received
  private static $NQT_INVALID_PORT     = 64;   //Specified port is out-of-range
  private static $NQT_TLDS_ONLY        = 128;  //Whois wants only base TLDs
  private static $NQT_UNKNOWN_WHOIS    = 256;  //Can't find WHOIS server 
  private static $NQT_CONNECT_FAILED   = 512;  //Connection failure
  private static $NQT_UNIX_ONLY        = 1024; //Windows currently unsupported
  private static $NQT_BOGUS_PATH       = 2048; //Invalid system path
  
  /*
  A map of Regional Internet Registrars (RIRs) to their WHOIS servers
  and strings that will identify them in ARIN output. ARIN is the default RIR,
  and will be consulted to determine which RIR is authoritative for an IP.
  If I am missing any common RIRs here, please let me know...
  */
  private static $RIR_MAP = array(
     array('rirName'=>'RIPE', 
           'rirServer' => 'whois.ripe.net',
           'grepText' => 'the RIPE database'),
     array('rirName'=>'APNIC', 
           'rirServer' => 'whois.apnic.net',
           'grepText' => 'apnic'),
     array('rirName'=>'JPNIC', 
           'rirServer' => 'whois.nic.ad.jp',
           'grepText' => 'nic.ad.jp'),
     array('rirName'=>'BRNIC', 
           'rirServer' => 'whois.registro.br',
           'grepText' => 'apnic'),
     array('rirName'=>'LACNIC', 
           'rirServer' => 'whois.lacnic.net',
           'grepText' => 'lacnic'),
     array('rirName'=>'AFRINIC', 
           'rirServer' => 'whois.afrinic.net',
           'grepText' => 'afrinic'),
     array('rirName'=>'KRNIC', 
           'rirServer' => 'whois.nic.or.kr',
           'grepText' => 'krnic'),
  );
  
  private static $NQT_VERSION = '1.9';
  //}}}Constant properties
  
  //Variable properties -{{{
  private $target   = null;
  private $host     = null;
  private $ipAddr   = null;
  private $output   = null;
  public  $error    = null;
  private $system   = null;
  private $timeout  = 10;
  //}}}Variable properties
  
  //Methods -{{{
  /**
   * Constructor. Accepts an optional host parameter, which can be either
   * a hostname or an IP address. Performs a variety of initialization
   * duties.
   * 
   * @param string $host        An optional host or IP to initialize these
   *                            properties without calling the setters.
   * @param bool $debug         Whether or not to enable debugging. Defaults
   *                            to false.
  **/
  public function __construct($host = null, $debug = false) {
    
    $this->enableDebug($debug);
    
    $this->debug('constructor received host of ' . $host);
    /* If we were passed a hostname or IP address, set the host property */
    if (!is_null($host) && $host != '') {
      $this->setHost($host);
    }
    
    /* Figure out if we're running on Unix or Windows */
    $this->system = $this->registerSystemType();
    
    /* Set the connect timeout */
    $this->setTimeout(is_int($this->timeout) && $this->timeout > 1 
                      ? $this->timeout : 5);
  }
  
  /**
   * A method to determine and set the system type (unix or Windows). This is
   * a bit of a kludge, and relies upon the "fact" that on Windows installs,
   * there is a COMSPEC environment variable which doesn't exist on unix 
   * installs. We need to know this because the arguments to some commands are
   * different by platform, e.g. `ping -c10` on unix is `ping -n 10` on Windows.
   * 
   * @return string             'WINDOWS' for Windows, 'UNIX' for a unix system.
  **/
  private function registerSystemType() {
    return preg_match('/windows/i', getenv('COMSPEC')) ? 'WINDOWS' : 'UNIX';
  }
  
  /**
   * A method to set the host name and address. We will try to validate whatever
   * host or IP was passed.
   * 
   * @param string $host        The hostname (fully-qualified domain name) or IP
   *                            address upon which network tests should be done.
   * @return bool               True on success, false on error.
  **/
  public function setHost($host) {
    $this->debug('setHost() called with ' . $host);
    $host = trim($host);
    
    /* target is a cached copy of whatever we were passed, for display purposes */
    $this->setTarget($host);
    
    if (preg_match('/[^0-9\.]/', $host)) {
      $this->debug('setHost() has a hostname.');
      /* We have a hostname. */
      if (!$this->isValidHostName($host)) {
        $this->debug('setHost() has an invalid hostname.');
        return false;
      }
      if (($this->ipAddr = $this->resolveHost($host)) === false) {
        /* Can't resolve hostname */
        $this->debug('Unable to resolve hostname in setHost().');
        return false;
      }
      $this->host = $host;
    }
    else {
      /* We have an IP address */
      $this->debug('setHost() has an IP address.');
      if (!$this->isValidHostAddr($host)) {
        $this->debug('setHost() has an invalid IP address.');
        return false;
      }
      if (($this->host = $this->resolveAddr($host)) === false) {
        /* Can't resolve IP */
        return false;
      }
      $this->ipAddr = $host;
    }
    return true;
  }
  
  /**
   * A method to set the target, as it was passed to us. We may need to use
   * it later for display purposes, and we want to know whether to show a
   * hostname or an IP address.
   *
   * @param string $target    The target, as it was passed to setHost().
  **/
  private function setTarget($target) {
    $this->target = $target;
  }
  
  /**
   * A method to retrieve the currently set target.
   *
   * @return string           The hostname or IP address passed to setHost().
  **/
  public function getTarget() {
    return $this->target;
  }
  
  /**
   * A method to determine whether or not a hostname is valid.
   * 
   * @param string $hostname    The hostname to test. Currently, only alphanums,
   *                            dots, slashes, and underscores will pass this
   *                            test. This rules out some i18n domains. Sorry.
   * @return bool               True if the hostname is valid, false if not.
  **/
  public function isValidHostName($host) {
    
    /* Check for null host */
    if (is_null($host) || $host == '') {
      $this->debug('isValidHostName() has a null hostname.');
      $this->setError(self::$NQT_INVALID_HOST);
      return false;
    }
    
    /* Check for bogus characters. */
    if (preg_match('/[^a-z0-9\.\-_]/i', $host)) {
      $this->debug('isValidHostName() has a hostname with disallowed chars.');
      $this->setError(self::$NQT_INVALID_HOST);
      return false;
    }
    
    /* Subdomains are generally forbidden, NQT operates against TLDs */
    /*
    $tld = strstr($host, '.');
    if (substr_count($tld, '.') > 1 && (!in_array($tld, self::$SECOND_LEVEL_TLDS))) {
      $this->setError(self::$NQT_TLDS_ONLY);
      return false;
    }
    */
    
    return true;
  }
  
  /**
   * A method to determine whether or not an IP address is valid. For our
   * purposes, valid means a dotted quad as [0-255].[0-255].[0-255].[0-255]
   * We are not checking ARIN to determine whether or not the IP is actually
   * allocated.
   * 
   * @param string $ipAddr      The IP address to test.
   * @return bool               True if the IP address is valid, false if not.
  **/
  public function isValidHostAddr($ipAddr) {
    /* Check for null address */
    if (is_null($ipAddr) || $ipAddr == '') {
      $this->debug('isValidHostAddr() has a null IP address.');
      $this->setError(self::$NQT_INVALID_ADDR);
      return false;
    }
    
    /* Check for valid dotted-quad format */
    if (!preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/', $ipAddr)) {
      $this->debug('isValidHostAddr() has an invalid IP address (' . $ipAddr . ')');
      $this->setError(self::$NQT_INVALID_ADDR);
      return false;
    }
    
    return true;
  }
  
  /**
   * A method to resolve a hostname to an IP address. We return the resolved
   * IP, or false if the hostname could not be resolved. In the latter case, 
   * the error is set.
   * 
   * @param string $hostname    The hostname to test.
   * @return mixed              On successful resolution, the IP address that
   *                            corresponds to this hostname. If resolution 
   *                            fails, false.
  **/
  private function resolveHost($hostname) {
    
    /* Check for bogus host */
    if (!$this->isValidHostName($hostname)) {
      return false;
    }
    
    $ip = @gethostbyname($hostname);
    if ($ip == $hostname) {
      $this->setError(self::$NQT_RESOLVEFAIL_NAME);
      return false;
    }
    return $ip;
  }
  
  /**
   * A method to resolve an IP address to a hostname. We return the resolved
   * host, or false if the IP address could not be resolved. In the
   * latter case, the error is set.
   * 
   * @param string $ipAddress   The IP address to test.
   * @return mixed              On successful resolution, the hostname that
   *                            corresponds to this IP address. If resolution 
   *                            fails, false.
  **/
  private function resolveAddr($ipAddress) {
    
    /* Check for bogus host */
    if (!$this->isValidHostAddr($ipAddress)) {
      $this->debug('resolveAddr() has invalid IP address: ' . $ipAddress);
      return false;
    }
    
    $host = @gethostbyaddr($ipAddress);
    if ($host == $ipAddress) {
      $this->setError(self::$NQT_RESOLVEFAIL_ADDR);
      return false;
    }
    return $host;
  }
  
  /**
   * A method to set the error value.
   * 
   * @param int $value          A value corresponding to one of the defined
   *                            error constants.
  **/
  private function setError($value) {
    $this->debug('setError() was called with value: ' . $value);
    $this->error = $value;
  }
  
  /**
   * A method to set the connect timeout, in seconds, for various methods.
   * 
   * @param int $seconds        The number of seconds after which a connection
   *                            attempt should timeout.
   * @return bool               True unless a bogus value was passed.
  **/
  public function setTimeout($seconds) {
    if (is_int($seconds) && $seconds > 1) {
      $this->timeout = $seconds;
      return true;
    }
    return false;
  }
  
  /**
   * A method to retrieve the currently set error value.
   * 
   * @return int                A value corresponding to one of the defined
   *                            error constants, or 0 if there is no error.
  **/
  public function getError() {
    return (is_null($this->error)) ? 0 : $this->error;
  }
  
  /**
   * A method to retrieve the currently set hostname.
   * 
   * @return string             The currently set hostname.
  **/
  public function getHost() {
    return (is_null($this->host)) ? null : $this->host;
  }
  
  /**
   * A method to retrieve the currently set IP address.
   * 
   * @return string             The currently set IP address.
  **/
  public function getAddr() {
    return (is_null($this->ipAddr)) ? null : $this->ipAddr;
  }
  
  /**
   * A method to get the connect timeout, in seconds, for various methods.
   * 
   * @return int                The currently set connect timeout, in seconds.
  **/
  public function getTimeout() {
    return $this->timeout;
  }
  
  /**
   * A method to print debugging information. Debugging is disabled by default.
   * If you encounter problems with NQT, you might want to turn on this feature
   * by calling enableDebug(true), which will cause all sorts of trace messages
   * to appear in NQT's output.
   * 
   * @param string $msg         The debug message to output.
  **/
  private function debug($msg) {
    if ($this->debug) {
      echo '[debug] ' . $msg . '<br>';
    }
  }
  
  /**
   * A method to enable/disable the debugging capability. Debugging is disabled
   * by default and most users will not need it.
  **/
  public function enableDebug($bool = false) {
    if (!is_bool($bool)) {
      $this->setError(self::$NQT_BOOLEAN_EXPECTED);
      return false;
    }
    $this->debug = $bool;
  }
  
  /**
   * A method to test whether or not a given port on the currently set host is
   * open. This does not implement any sort of protocol check, it just determines
   * whether or not the port is accepting connections.
   * 
   * @param int $port           The port number to test.
   * @return bool               True if the port is open, false if not.
  **/
  private function isRemotePortOpen($port) {
    
    /* Check for bogus port */
    if (!is_numeric($port) || $port < 1 || $port > 65535) {
      $this->setError(self::$NQT_INVALID_PORT);
      return false;
    }
    
    return @fsockopen($this->getAddr(), $port) ? true : false;
  }
  
  /**
   * A method to attempt a ping to the currently set host. This is not a native
   * implementation of ping (yet) - it requires that a ping binary lives in
   * userspace (set the $PING_PATH property to the location for your system).
   * 
   * @param int $numPings       The number of pings, defaults to 5
   * @return string             The output of the ping, or false on error.
  **/
  public function doPing($numPings = 5) {
    
    if (!file_exists(self::$PING_PATH)) {
      $this->setError(self::$NQT_BOGUS_PATH);
      return false;
    }
    
    /* Ensure that we have a legitimate IP address to ping. */
    if (!$this->isValidHostAddr($this->getAddr())) {
      $this->debug('ping() has an invalid IP address.');
      return false;
    }
    
    $ip = $this->getAddr();
      
    /* 
    Figure out whether we're on a unix or a Windows box, and call ping with
    the appropriate argument. This is not tested under Windows...
    */
    if ($this->system == 'UNIX') {
      $this->debug('ping() is on a unix host, running: ' . self::$PING_PATH . 
                   ' -c' . $numPings . ' ' . $ip);
      $ping = escapeshellcmd(self::$PING_PATH . ' -c ' . $numPings . ' ' . $ip);
      return `$ping`;
    }
    
    $ping = escapeshellcmd(self::$PING_PATH . ' -n ' . $numPings . ' ' . $ip);
    return `$ping`;
  }
  
  /**
   * A method to attempt a traceroute to the currently set host. This is not a
   * native implementation of traceroute (yet) - it requires that a traceroute
   * binary lives in userspace (set the $TRACEROUTE_PATH property to the location
   * for your system).
   * 
   * @return mixed              The output of the traceroute, or false on error.
  **/
  public function doTraceroute() {
    
    if (!file_exists(self::$TRACEROUTE_PATH)) {
      $this->setError(self::$NQT_BOGUS_PATH);
      return false;
    }
    
    /* Ensure that we have a legitimate IP address to traceroute to */
    if (!$this->isValidHostAddr($this->getAddr())) {
      $this->debug('traceroute() has an invalid IP address.');
      return false;
    }
    
    $ip = $this->getAddr();
    $tr = escapeshellcmd(self::$TRACEROUTE_PATH . ' ' . $ip);
    return `$tr`;
  }
  
  /**
   * A method to return the RIR WHOIS data for an IP address. This method 
   * expects a valid IP address to be set as the current IP, and accepts 
   * an optional RIR WHOIS server parameter. If the IP address is invalid 
   * or for some reason the info cannot be determined, this method
   * returns false and the error is set; otherwise it returns the WHOIS data.
   * 
   * Currently auto-recognized RIRs are ARIN, RIPE, APNIC, JPNIC, LACNIC,
   * AFRINIC, and registro.br.
   * 
   * @param string $whoisServer The RIR WHOIS server to use.
   * @return mixed              A string containing WHOIS data for an IP address,
   *                            or false if the WHOIS cannot be completed.
  **/
  public function doRirWhois($whoisServer = '') {
    
    /* Check for null or bogus IP */
    if (is_null($this->getAddr()) || !$this->isValidHostAddr($this->getAddr())) {
      $this->setError(self::$NQT_INVALID_ADDR);
      return false;
    }
    
    /* If a WHOIS server was specified, ensure it's valid. */
    if ($whoisServer == '') {
      $whoisServer = 'whois.arin.net';
      $this->debug('doRirWhois() has a WHOIS server of whois.arin.net');
    } else {
      if ($this->resolveHost($whoisServer) == $whoisServer ||
          $this->resolveHost($whoisServer) == false) {
        $this->setError(self::$NQT_INVALID_HOST);
        return false;
      }
    }
    
    /* Connect to the WHOIS server and try to fetch the record */
    if (!$sock = @fsockopen($whoisServer, 43, $e, $e, $this->getTimeout())) {
      $this->debug('doRirWhois() could not connect to ' . $whoisServer);
      $this->setError(self::$NQT_CONNECT_FAILED);
      return false;
    }
    fwrite($sock, $this->ipAddr . "\r\n");
    while (!feof($sock)) {
      $buf .= fgets($sock, 10240);
      if (feof($sock)) break;
    }
    
    if (trim($buf) == '') {
      $this->debug('doRirWhois() got a blank response from ' . $whoisServer);
      return false;
    }
    
    /* @TODO Follow recognized redirects to other servers */
    /*
    foreach (self::$RIR_MAP as $rir) {
      if (preg_match('/' . $rir['grepText'] . '/mis', $buf)) {
        $this->debug('doRirWhois() redirected to RIR: ' . $rir['rirName']);
        return $this->doRirWhois($rir['rirServer']);
      }
    }
    */
    return $buf;
  }
  
  /**
   * A method to return the WHOIS information for the currently set hostname.
   * If the hostname is invalid or WHOIS data can't be retrieved, we return
   * false (and the error will be set). The optional $whoisServer parameter
   * allows for recursive/nested WHOIS lookups; you generally should not pass
   * this parameter.
   * 
   * @return mixed              A string containing the whois data for a TLD,
   *                            or false if the WHOIS cannot be completed.
  **/
  public function doWwwWhois($whoisServer = '') {
    
    /* Check for null or bogus host */
    if (is_null($this->getHost()) || !$this->isValidHostName($this->getHost())) {
      $this->setError(self::$NQT_INVALID_HOST);
      return false;
    }
    
    /*
    Check for subdomains (not supported), and if one is found, strip
    it down to the base TLD.
    */
    if (substr_count($this->getHost(), '.') > 1) {
      $hostPartsArray = explode('.', $this->getHost());
      $whoisTarget = $hostPartsArray[count($hostPartsArray) - 2] . '.' . $hostPartsArray[count($hostPartsArray) - 1];
      $this->debug('doWwwWhois() found subdomain; chopping to TLD: ' . $whoisTarget);
    } else {
      $whoisTarget = $this->getHost();
    }
    
    /*
    Connect to the root WHOIS server and query on this host. For purposes of
    recursion, we accept a passed-in WHOIS server.
    */
    if ($whoisServer == '') {
      if ($this->getWhoisServerForHost($whoisTarget) === false) {
        $this->debug('doWwwWhois() could not get WHOIS server for ' . $whoisTarget);
        return false;
      }
      $whoisServer = $this->getWhoisServerForHost($whoisTarget);
      $this->debug('host is ' . $whoisTarget);
      $this->debug('wwwWhois() has a whois server of: ' . $whoisServer);
    }
    if (!$sock = @fsockopen($whoisServer, 43, $e, $e, $this->getTimeout())) {
      $this->setError(self::$NQT_CONNECT_FAILED);
      return false;
    }
    
    fwrite($sock, $whoisTarget . "\r\n\r\n");
    while (!feof($sock)) {
      $buf .= fgets($sock, 10240);
    }
    
    if (preg_match('/Whois Server: (.*)/i', $buf, $matches)) {
      return $this->doWwwWhois($matches[1]);
    }
    
    /* Get rid of disclaimers and bloat - EXPERIMENTAL */
    if (self::$SAVE_BANDWIDTH) {
      $this->debug('doWwwWhois() attempting to glob disclaimers out of WHOIS');
      if (preg_match('/the data(.*)domain availability/mis', $buf)) {
        /* Tucows */
        $buf = preg_replace('/the data(.*)domain availability./mis', '', $buf);
        $this->debug('doWwwWhois() found and removed Tucows disclaimer.');
      }
      if (preg_match('/NOTICE: The expiration.*at any time./', $buf)) {
        /* Verislime */
        $buf = preg_replace('/NOTICE: The expiration.*at any time./mis', '', $buf);
        $this->debug('doWwwWhois() found and removed Verisign disclaimer.');
      }
      if (preg_match('|NOTICE AND TERMS(.*)AboutUs(.*)</a>|mis', $buf)) {
        /* Netsol _on top of_ Verislime */
        $buf = preg_replace('|NOTICE AND TERMS(.*)AboutUs(.*)</a>|mis', '', $buf);
        $this->debug('doWwwWhois() found and removed Network Solutions disclaimer.');
      }
      if (preg_match('/NOTICE: Access to.*abide by this policy./', $buf)) {
        /* CORE */
        $buf = preg_replace('/NOTICE: Access to.*abide by this policy./mis', '', $buf);
        $this->debug('doWwwWhois() found and removed CORE disclaimer.');
      }
    }
    
    /* Trim multiple newlines */
    while(preg_match("/[\r\n]{3}/mis", $buf)) {
      $buf = preg_replace("/[\r\n]{3}/mis", "\n\n", $buf);
    }
    
    return $buf;
    
  }
  
  /**
   * A method to determine and return the WHOIS server responsible for a 
   * given TLD.
   * 
   * @param string $host        The hostname/domain name for which to determine
   *                            the WHOIS server.
   * @return string             The WHOIS server responsible for this host.
   *                            If this particular TLD is not supported by NQT,
   *                            an empty string is returned and the error is set.
  **/
  public function getWhoisServerForHost($host) {
    if (!$this->isValidHostName($host)) {
      $this->debug('getWhoisServerForHost() has an invalid host.');
      $this->setError(self::$NQT_INVALID_HOST);
      return false;
    }
    
    /*
    Determine the WHOIS server based upon the TLD. Because this is such a large
    list, we use a switch statement instead of a static class variable "map."
    */
    switch(strtolower(strstr($host, '.'))) {
      case '.com':
      case '.net':
      case '.edu':
        return 'whois.crsnic.net';
      case '.org':
        return 'whois.corenic.net';
      case '.ac':
        return 'whois.nic.ac';
      case '.aero':
        return 'whois.aero';
      case '.am':
        return 'whois.amnic.net';
      case '.as':
        return 'whois.nic.as';
      case '.at':
        return 'whois.nic.at';
      case '.au':
      case '.com.au':
      case '.net.au':
      case '.org.au':
      case '.asn.au':
      case 'id.au':
        return 'whois.ausregistry.net';
      case '.be':
        return 'whois.dns.be';
      case '.biz':
        return 'whois.nic.biz';
      case '.br':
        return 'whois.nic.br';
      case '.ca':
        return 'whois.cira.ca';
      case '.cc':
        return 'ccwhois.verisign-grs.com';
      case '.cd':
        return 'whois.cd';
      case '.ch':
        return 'whois.nic.ch';
      case '.cl':
        return 'nic.cl';
      case '.cn':
        return 'whois.cnnic.net.cn';
      case '.coop':
        return 'whois.nic.coop';
      case '.cx':
        return 'whois.nic.cx';
      case '.cz':
        return 'whois.nic.cz';
      case '.de':
        return 'whois.denic.de';
      case '.dk':
        return 'whois.dk-hostmaster.dk';
      case '.edu':
        return 'whois.educause.net';
      case '.ee':
        return 'myristaja.eenet.ee';
      case '.fi':
        return 'whois.ficora.fi';
      case '.fr':
        return 'whois.afnic.fr';
      case '.gov':
        return 'nic.gov';
      case '.hk':
        return 'whois.hkdnr.net.hk';
      case '.hu':
        return 'whois.nic.hu';
      case '.ie':
        return 'whois.domainregistry.ie';
      case '.il':
        return 'whois.isoc.org.il';
      case '.in':
        return 'whois.inregistry.net';
      case '.info':
        return 'whois.afilias.net';
      case '.int':
        return 'whois.iana.org';
      case '.is':
        return 'whois.isnic.is';
      case '.is':
        return 'aten.isnic.is';
      case '.it':
        return 'whois.nic.it';
      case '.jp':
        return 'whois.jprs.jp';
      case '.kr':
        return 'whois.krnic.net';
      case '.la':
        return 'whois2.afilias-grs.net';
      case '.li':
        return 'whois.nic.ch';
      case '.lt':
        return 'ns.litnet.lt';
      case '.lu':
        return 'whois.dns.lu';
      case '.mil':
        return 'is-1.nic.mil';
      case '.museum':
        return 'whois.museum';
      case '.mx':
        return 'whois.nic.mx';
      case '.name':
        return 'whois.nic.name';
      case '.nl':
        return 'whois.domain-registry.nl';
      case '.no':
        return 'whois.norid.no';
      case '.nu':
        return 'whois.worldnames.net';
      case '.nu':
        return 'whois.nic.nu';
      case '.nz':
        return 'whois.srs.net.nz';
      case '.nz':
        return 'srs-ak.srs.net.nz';
      case '.pl':
        return 'whois.dns.pl';
      case '.pt':
        return 'whois.dns.pt';
      case '.pt':
        return 'online.dns.pt';
      case '.pt':
        return 'hercules.dns.pt';
      case '.ro':
        return 'whois.rotld.ro';
      case '.ru':
        return 'whois.ripn.net';
      case '.se':
        return 'ext.nic-se.se';
      case '.sg':
        return 'aphrodite.nic.net.sg';
      case '.si':
        return 'whois.arnes.si';
      case '.sh':
        return 'whois.nic.sh';
      case '.sk':
        return 'whois.sk-nic.sk';
      case '.su':
        return 'whois.ripn.net';
      case '.tf':
        return 'whois.nic.tf';
      case '.th':
        return 'whois.thnic.net';
      case '.to':
        return 'whois.tonic.to';
      case '.tr':
        return 'whois.nic.tr';
      case '.tv':
        return 'tvwhois.verisign-grs.com';
      case '.tw':
        return 'whois.twnic.net';
      case '.ua':
        return 'whois.net.ua';
      case '.uk':
        return 'whois.nic.uk';
      case '.us':
        return 'whois.nic.us';
      case '.ws':
        return 'whois.worldsite.ws';
      case '.al':
      case '.az':
      case '.ba':
      case '.bg':
      case '.by':
      case '.cy':
      case '.eg':
      case '.es':
      case '.fo':
      case '.gb':
      case '.ge':
      case '.gr':
      case '.hr':
      case '.lv':
      case '.ma':
      case '.md':
      case '.mk':
      case '.mt':
      case '.sm':
      case '.tn':
      case '.ua':
      case '.va':
        return 'whois.ripe.net';
      default:
        /* Well shit! Maybe there is a new gTld that we don't know about. */
        $domain = str_replace('.', '', strstr($host, '.'));
        $whoisServer = gethostbyname($domain . '.whois-servers.net');
        if ($whoisServer == $domain) {
          $this->setError(self::$NQT_TLD_UNSUPPORTED);
          return false;
        }
        return $whoisServer;
    }
  }
  
  /**
   * A method to resolve a hostname to IP or vice versa, whichever was passed
   * in as the target when this object was created.
   *
   * @param string $host        The host or IP address to resolve.
   *
   * @return mixed              A string containing the resolved address/hostname,
   *                            or false if an error occurred.
  **/
  public function doResolveHost() {
    if (preg_match('|[a-zA-Z]|', $this->getTarget())) {
        return $this->resolveHost($this->getTarget());
    }
    return $this->resolveAddr($this->getTarget());
  }
  
  public function doCheckPort($portNumber) {
    if (!$this->isValidHostAddr($this->getAddr())) {
      return false;
    }
    return $this->isRemotePortOpen($portNumber);
  }
  
  /**
   * A method to perform DNS lookups via the DiG binary. This currently only
   * works on Unix hosts. A native implementation that works on any platform
   * is planned for future development.
   * 
   * @return mixed              If unix, the results of `dig any hostname`;
   *                            if Windows or the path to dig is invalid, false
   *                            and the error is set.
  **/
  public function doDig() {
    
     if (!file_exists(self::$DIG_PATH)) {
       $this->debug('doDig() has an invalid path to the dig binary.');
       $this->setError(self::$NQT_BOGUS_PATH);
       return false;
     }
     
     /* Make sure we're a unix host. */
     if (!preg_match('/unix/i', $this->system)) {
       $this->debug('doDig() does not work on Windows systems at this time.');
       $this->setError(self::$NQT_UNIX_ONLY);
       return false;
     }
     
     /* dig takes a hostname, not an IP address */
     if (!$this->isValidHostName($this->getHost())) {
       $this->debug('doDig() requires a valid hostname.');
       $this->setError(self::$NQT_INVALID_HOST);
       return false;
     }
     
     $this->debug('doDig() working...');
     $dig = escapeshellcmd(self::$DIG_PATH . ' any ' . $this->getHost());
     return `$dig`;
  }
}
?>
