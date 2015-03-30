<?php
	include("core/include/function.inc.php");
?>
</td></tr>
<tr valign="top"><td>
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td>
<table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" align='center'>
        <tr>
        	<?
				$permitted_tabs = $_SESSION['permitted_tabs'];
				$permitted_subtabs = $_SESSION['permitted_subtabs'];

        		if(	$permitted_tabs == null || $permitted_tabs == "")
				{
        			$tmpArray = getPermittedTabsForUserFromDB();
					$permitted_tabs =$tmpArray['permitted_tabs'];
					$permitted_subtabs=$tmpArray['permitted_subtabs'];
        			$_SESSION['permitted_tabs']=$permitted_tabs;
        			$_SESSION['permitted_subtabs']=$permitted_subtabs;
			   	}
			 ?>
	
			<script>document.write(drawTabs(<?echo "'".($base->input['subdirectory']==""?$data->TYPE:$base->input['subdirectory'])."',".$permitted_tabs; ?>));</script>
			<script>highlightMainTab("<? echo $base->input['function']?>");</script>
		</tr>
	</table>
	<tr><td align="left">
		<table align=center cellspacing="0" cellpadding="0" width="100%" border="0">
	       	<tr ><td width="100%">
	       	<img src="cpos/images/1x1.gif" border="0" height="5px" />
	   		</td></tr>
	   	</table>
	</td></tr>
	<tr><td>
     	<table border="0" align="center" width="100%" cellpadding="0" cellspacing="0" align='center'>
     		<tr>
			<script>document.write(drawSubTabs(<? echo "'".$base->input['function']."',".$permitted_subtabs; ?>));</script>
			<script>highlightSubTab("<? echo $base->input['menu_type'] ?>");</script>
			<td>&nbsp;</td>
			</tr>
		</table>
	</td></tr>
</table>
</td></tr>
<tr valign="top"><td>