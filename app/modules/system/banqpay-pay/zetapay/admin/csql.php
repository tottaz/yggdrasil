<?
session_start();
$indexphp = ereg_replace(".*/","",$_SERVER['PHP_SELF']);
error_reporting(E_ALL ^ E_WARNING ^ E_NOTICE);
$db_host = $_REQUEST['db_host']; $db_user = $_REQUEST['db_user']; $db_pass = $_REQUEST['db_pass']; $db_base = $_REQUEST['db_base'];
?>
<html>
<head><title>cleverSql v1.0</title>
<meta http-equiv="expires" content="0">
<meta http-equiv='Content-Type' content='text/html; charset=windows-1252'>
<style type="text/css"> 
td,body { font-family:Verdana;font-size:13px;}
table, td, th { border-color: #EEEEEE #CCCCCC #CCCCCC #EEEEEE; border-style: solid; border-width: 1px; background-color:#FFFFFF;}
.nob { border:none; border-color:#ffffff; }
th{color: #FFFFFF; background-color: #3366CC;font-size:10pt;font-weight:bold;text-align:left;}
.th1{color: #FFFFFF; background-color: #3366CC;font-size:10pt;font-weight:bold;text-align:center;}
.thc {background-color:#3366CC;font-weight:bold;color:#ffffff;text-align:center;}
.thl {background-color:#eaeaea;font-weight:bold;text-align:left;}
.thr {background-color:#eaeaea;font-weight:bold;text-align:right;}
input, textarea, select{font-family: Verdana,Arial,Helvetica; font-size: 11px;}
</style>
<?
	chdir('..');
	require('connect.php');
	require('config.php');
	list($adm_login) = mysql_fetch_row(mysql_query("SELECT username FROM zetapay_users WHERE id=3"));
	if( ($_SESSION['suid'] == substr( md5($superpass), 8, 16 )) ){
		$suid = substr( md5($superpass), 8, 16 );
		$_SESSION['suid'] = $suid;
	}else if($_POST['username'] == $adm_login && $_POST['password'] == $superpass){
		$suid = substr( md5($superpass), 8, 16 );
		$_SESSION['suid'] = $suid;
	}else{
?>
		</head><body bgcolor=#FFFFFF><center><TABLE class=design border=1 cellpadding=2><form action=<?=$indexphp?> method=POST><tr></tr>
		<tr bgcolor=#E0E0E0><td class=thr>Username:</td><td><input type=text name=username value='' style='width:140px'></td></tr>
		<tr bgcolor=#E0E0E0><td class=thr>Password:</td><td><input type=password name=password style='width:140px'></td></tr>
		</td></tr><tr bgcolor=#E0E0E0><td class=th1 colspan=2><input type=submit value="Login >>"></td></tr></form></table><div style='font-size:10px;line-height:18px'>&copy; <a style='color:#000000' target=_blank href=http://cleverscripts.com>clever<font color=#ee0000><b>S</b></font>cripts.com</a> 2003</div></center></body></html>
<? 
		exit; 
	}
	// ========= main section ==========
	$query = $_REQUEST['query'];
	if(!$query)$query = "show tables";
	$history = $_REQUEST['history'];
	if($history) { $history = explode(" ", trim($history)); foreach($history as $hk=>$h) if($h) $history[$hk] = str_replace("bla_SPACE_bla"," ",$h);}
	if(!count($history)) $history[]="show tables";

?>
<script language=JavaScript>
var history=new Array(<? foreach($history as $h) echo '"'.$h.'",';?>"");
var inHist=<?=count($history)?>,hLen=<?=count($history)?>;
function hi_back(){document.f1.query.value=history[--inHist];setHistButtons();}
function hi_forw(){document.f1.query.value=history[++inHist];setHistButtons(); }
function setHistButtons(){document.f1.h_back.disabled=(inHist==0);document.f1.h_forw.disabled=(inHist>=<?=count($history)?>-1);}
function init(){f1.query.focus(); setHistButtons();}
function prepare(){var i,j,h,s=''; var regexp = /\s/;
for(i=0;i<history.length;i++) if(history[i].length){h=history[i];while(h.search(regexp)!=-1) h = h.replace(regexp, "bla_SPACE_bla");s+=h+" ";}
var q = document.f1.query.value; while(q.search(regexp)!=-1) q = q.replace(regexp, "bla_SPACE_bla");document.f1.history.value=s+q;
}
function go(p){document.f1.query.value='select * FROM '+p;prepare();document.f1.submit();return false; }
function drop(p){document.f1.query.value='drop table '+p;prepare();document.f1.submit();return false; }
function desc(p){document.f1.query.value='describe '+p;prepare();document.f1.submit();return false; }
function showt(){document.f1.query.value='show tables';prepare();document.f1.submit();return false; }
function rep(){document.f1.query.value=history[hLen-1];prepare();document.f1.submit();return false; }
function inte(o){var v = document.f1.query.value,t = o.checked?'<textarea name=query cols=60 rows=8>'+v+'</textarea>':'<input type=text name=query size=60 value="'+v+'">';document.all['queryline'].innerHTML = t;}
</script></head>
<body onLoad="init();" bgcolor=#ffffff alink=#0000ff vlink=#0000ff>
<center>
<TABLE class=design border=0 cellpadding=2 cellspacing=0 class=nob>
<?
echo "<form method=POST>";
echo "<tr><td class=nob>Current database: \n<select name=db_base size=1 onchange='submit();'>\n"; $db_list = mysql_list_dbs();
while ($row = mysql_fetch_object($db_list)) echo "<option ",($db_base==$row->Database?"selected":"")," value='$row->Database'>",$row->Database,"</option>\n";
echo "</select>\n<input type=hidden name=db_host value=$db_host><input type=hidden name=db_user value=$db_user><input type=hidden name=db_pass value=$db_pass>";
?>
<input type=checkbox value=123 onclick="inte(this);">Multiline</td></tr></form>
<form name=f1 method=POST onsubmit='prepare();submit();'>
<tr><td class=nob><div id=queryline><input type=text name=query size=60></div></td><td class=nob valign=top>
<input name=h_back type=button value='<' onclick='hi_back();'><input name=h_forw type=button value='>' onclick='hi_forw();'>
&nbsp;<input type=button value=Submit onclick='prepare();submit();'>
<input type=hidden name=db_host value=<?=$db_host?>><input type=hidden name=db_user value=<?=$db_user?>><input type=hidden name=db_pass value=<?=$db_pass?>><input type=hidden name=db_base value=<?=$db_base?>>
<input type=hidden name=history value=''>
</td></tr>
<tr><td class=nob>
<a href=# style='color=#0000ff' onClick='return(rep())'>Repeat query</a>&nbsp;
<a href=# style='color=#0000ff' onClick='return(showt())'>Show tables</a>&nbsp;
<a href=<?=$indexphp?>>Re-Login</a>
</td></tr>
</form>
</table><br>
<? 

$q=stripslashes($query);
if(eregi("^use ",$q))$db_base=substr($q,4);
if(eregi('show tables',$q))$tv1=1;

if($q){
  echo"$q<br><br>";
  if($db_base) mysql_select_db($db_base);
  if(!mysql_error()) $w=mysql_query($q); else $no_base=1;
  if(mysql_error() || $no_base) echo "<font color=#ff0000><b>MySQL error:</b></font> ",mysql_error(); 
  if($w){
    echo'<TABLE class=design width=100% cellpadding=2 bordercolor=#bbbbbb border=1><tr align=center>';
    $i=0; if($tv1!=1) while($a=mysql_field_name($w,$i++)){ 
	echo"<td class=thc><i>$a</i></td>"; 
	$d[]=$a; 
    	} 
    else echo "<td colspan=2 class=thc>Tables in <b>\"$db_base\"</b></td>";
    echo'</tr>';
    while($a=mysql_fetch_array($w)){
      echo"<tr>\n"; 
      if($tv1) { $t=$a[0]; echo "<td class=thr>";
//      echo "&nbsp;[<a href=$t style='font-weight:normal' onClick=\"return dump('$t');\">dump</a>]";
      echo "&nbsp;[<a href=$t onClick=\"return( confirm('Delete table \'$t?\'')? drop('$t'):false )\" style=\"color:#ff0000\">kill</a>]&nbsp;[<a href=$t onClick=\"return desc('$t');\">desc</a>]</td><td width=100% valign=top>&nbsp;<a href=$t onClick=\"return go('$t');\">$t</a></td>";}
      reset($d);
      while ($b=each($d)){ $t=$a[$b[1]]; echo'<td valign=top>';
        $t1=nl2br(htmlentities(stripslashes($t)));
        if($t1=="")$t1="&nbsp;";
        echo "$t1</td>"; }
      print("</tr>\n");
    } echo'</table>';
  }
}
?>
<div style='font-size:10px;line-height:30px'>&copy; <a style='color:#000000' target=_blank href=http://cleverscripts.com>clever<font color=#ee0000><b>S</b></font>cripts.com</a> 2003</div>
</center>
</body>
</html>