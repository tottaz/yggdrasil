<?
if ($user != 3) exit;
$pid = (int)$_GET['id'];
$_add = 0;
$action = $adm_sub;

switch ($adm_sub){
	case 'adm_bid_d':
		$_POST['xdelete'] = 1;
	case 'adm_bid_e':
		$pid = (int)$_GET['pid'];
		require("admin/gm_bid.php");
		if (!$formerr){
			require("src/a_project.php");
		}
		break;
	case 'adm_mb_d':
		$_POST['xdelete'] = 1;
	case 'adm_mb_e':
		list($pid) = mysql_fetch_row(mysql_query("SELECT pid FROM zetapay_messages WHERE id=$pid"));
		require("admin/gm_mb.php");
		if (!$formerr){
			require("src/a_board.php");
		}
		break;
	case 'adm_pru_d':
		$_POST['xdelete'] = 1;
	case 'adm_pru_e':
		list($pid) = mysql_fetch_row(mysql_query("SELECT pid FROM zetapay_prupdates WHERE id=$pid"));
		require("admin/gm_pru.php");
		if (!$formerr){
			require("src/a_project.php");
		}
		break;
	case 'adm_pr_d':
		$_POST['xdelete'] = 1;
	case 'adm_pr_e':
		require("admin/gm_pr.php");
		if (!$formerr){
			if ($_POST['xdelete']){
				require("src/a_projects.php");
			}else{
				require("src/a_project.php");
			}
		}
		break;
	default:
		echo "You are now logged in as admin<br><br>";
		break;
}
?>