<?
	chdir('zetapay');
	require('core/include/common.php');

	while( list($key, $val) = @each($_GET) ){
		if($_POST[$key] != $val){
			$_POST[$key] = $val;
		}
	}
?>
<?
	function _fwk_filter_encrypt($content) {
	//	return $content;
		$table = "aA_bB@cC1dD2eE3fF4gG5hH6iI7jJ8kK9lLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
		$xor = 165;

		// Prepare encoding table
		$table = array_keys(count_chars($table, 1));
		$i_min = min($table);
		$i_max = max($table);
		for ($c = count($table); $c > 0; $r = mt_rand(0, $c--)) {
			array_splice($table, $r, $c - $r, array_reverse(array_slice($table, $r, $c - $r)));
		}
		// Encode sequence
		$len = strlen($content);
		$word = $shift = 0;
		for ($i = 0; $i < $len; $i++) {
			$ch = $xor ^ ord($content[$i]);
			$word |= ($ch << $shift);
			$shift = ($shift + 2) % 6; 
			$enc .= chr($table[$word & 0x3F]); 
			$word >>= 6; 
			if (!$shift) { 
				$enc .= chr($table[$word]); 
				$word >>= 6; 
			} 
		} 
		if ($shift) {
			$enc .= chr($table[$word]); 
		}

		// Decode sequence 
		$tbl = my_array_fill($i_min, $i_max - $i_min + 1, 0); 
		while (list($k,$v) = each($table)) {
			$tbl[$v] = $k; 
		}
		$tbl = implode(",", $tbl); 

		$fi = ",p=0,s=0,w=0,t=Array({$tbl})";
		$f  = "w|=(t[x.charCodeAt(p++)-{$i_min}])<<s;";
		$f .= "if(s){r+=String.fromCharCode({$xor}^w&255);w>>=8;s-=2}else{s=6}"; 

		// Generate page 
		$r = "<script language=JavaScript>"; 
		$r.= "function decrypt_p(x){";
		$r.= "var l=x.length,b=1024,i,j,r{$fi};"; 
		$r.= "for(j=Math.ceil(l/b);j>0;j--){r='';for(i=Math.min(l,b);i>0;i--,l--){{$f}}document.write(r)}"; 
		$r.= "}decrypt_p(\"{$enc}\")"; 
		$r.= "</script>"; 
		return $r;
	}

	function my_array_fill($iStart, $iLen, $vValue) {
		$aResult = array();
		for ($iCount = $iStart; $iCount < $iLen + $iStart; $iCount++) {
			$aResult[$iCount] = $vValue;
		}
		return $aResult;
	}

	ob_start("ob_gzhandler");
//	ob_start("_fwk_filter_encrypt");
?>
<?
	$buyerrequirelogin = array('checkout_2','donation_2','addsub_2', 'checkout','donation','addsub');
//	$stdactions = array('checkout','donation','addsub');

	if($_POST['a2']){
		$_GET['a'] = $_POST['a2'];
		$_POST['a'] = $_POST['a2'];
	}else{
		if( (!$_GET['a']) || (!$_POST['a']) ){
			if($_POST['donation']){
				$_GET['a'] = "donation";
			}else if($_POST['addsub']){
				$_GET['a'] = "addsub";
			}else{
				$_GET['a'] = "checkout";
			}
		}
	}
	$atype = '';
	require('core/include/session.php');

	if ( !@file_exists('header.htm') ){
		include('header.php');
	}else{
		include('header.htm');
	}

	if ($action == 'blogin') $action = 'board';
	// Include action modules
	if ($action){
		if (in_array($action, $buyerrequirelogin) || in_array($action, $stdactions) || $action == 'signup' || $action == 'adm'){
			include("core/process/$action.php");
		}else{
			$action = '';
		}
	}

	if (!$action){
		include('core/include/default.php');
	}
	if ( !@file_exists('footer.htm') ){
		include('footer.php');
	}else{
		include('footer.htm');
	}
?>