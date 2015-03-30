<?
//@mysql_connect('localhost', 'zetaman', '55Z78Pqr5') or die('Cannot connect to MySQL server');
//@mysql_connect('localhost', 'root', '') or die('Cannot connect to MySQL server');
define('ADODB_ERROR_LOG_TYPE',3); 
//define('ADODB_ERROR_LOG_DEST','C:/errors.log');
    
$database="zetapay";  //database provide to Client

include($rootDir.$subDir.'core/adodb/adodb.inc.php');
include($rootDir.$subDir.'core/adodb/adodb-errorhandler.inc.php');


class DBConn extends ADOConnection {
	
	public static $dbconn ; 
	
	public function DBConn($dbtype, &$conn){		
		$this->dbconn = NewADOConnection($dbtype);		
		return $conn;				
	}
	
	public function Connect($ip, $user, $pwd, $db){				
		$this->dbconn->Connect($ip, $user, $pwd, $db);
	}
	
	
	public function Execute($qry, $session_var_name="", $message=""){
		//echo "Its me";		
		if(($session_var_name != null || $session_var_name == "") && ($message == null || $message == "")){
			$rs = $this->dbconn->Execute($qry) OR ($_SESSION[$session_var_name]= $this->dbconn->ErrorMsg());			
			return  $rs;
		}else if($session_var_name != null && $message != null ){
			$rs = $this->dbconn->Execute($qry)OR ($_SESSION[$session_var_name]= $message);
			$i =0;
			$errMsg = $this->dbconn->ErrorMsg();
			$message = str_ireplace("[error]",$errMsg, $i);

			return $rs;
		}else{
			$rs = $this->dbconn->Execute($qry) OR die(" An error occured while executing: ".$qry." Error: ".$this->dbconn->ErrorMsg());

			return $rs;
		}
	}
	
	public function AutoExecute($table, $arrFields, $mode, $where=false, $session_var_name="", $message="", $forceUpdate=true,$magicq=false){
		//echo "Its me";		
		try{
			if($session_var_name != null && ($message == null || $message == "")){
				$rs =  $this->dbconn->AutoExecute($table, $arrFields, $mode, $where, $forceUpdate,$magicq)OR ($_SESSION[$session_var_name]= $this->dbconn->ErrorMsg());
	
				return $rs ;
			}else if($session_var_name != null && $message != null ){
				$rs = $this->dbconn->AutoExecute($table, $arrFields, $mode, $where, $forceUpdate,$magicq)OR ($_SESSION[$session_var_name]= $message);
				$i =0;
				$errMsg = $this->dbconn->ErrorMsg();
				$message = str_ireplace("[error]",$errMsg, $i);
	
				return $rs;
			}else{
				$rs = $this->dbconn->AutoExecute($table, $arrFields, $mode, $where, $forceUpdate,$magicq)OR die(" An error occured while executing: ".$qry." Error: ".$this->dbconn->ErrorMsg()); 
	
				return $rs ; 
			}
		}catch(exception $exc){			 		
			var_dump($exc);
			if($session_var_name != ""){
				$errMsg = $this->dbconn->ErrorMsg();
				$message = str_ireplace("[error]",$errMsg, $i);
				$_SESSION[$session_var_name]= $message;
			}
		}
	}
	/**/	
}
	if( false && $_SESSION['loginid'] == "cc"){
		
	  	 $zetadb = new DBConn("mysql");
	  	 $zetadb->fmtDate = "YmdHis";
//	  	 $zetadb->Connect('localhost', 'root', '', $database);
		 $zetadb->Connect('localhost', 'zetaman', '5d7u1b2ai', $database);
		
	}else{
	  	$zetadb = NewADOConnection('mysql');
//	  	$zetadb->Connect('localhost', 'root', '', $database);
	  	$zetadb->Connect('localhost', 'zetaman', '5d7u1b2ai', $database); 
		
	}
 
  	
?>