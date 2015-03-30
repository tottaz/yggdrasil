<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td bgcolor="#FFFFFF">
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
    		<td valign="top">
    			<table width="100%" border="0" cellspacing="0" cellpadding="3">
        		<tr>
					<td>
						<span class="text4">Subscriptions</span><br>
						<hr width="100%" size="1"><br>
					</td>
        		</tr>
        		<tr>
        			<td>
<?
	if( ($_POST['receiver']) && ($_POST['amount']) ){
?>
						<table width="100%" border="0" cellspacing="10" cellpadding="0">
						<tr>
							<td><div align="center"><font size="1" face="Verdana, Arial, Helvetica, sans-serif"><strong>
								Copy This Code and Paste into your page
							</strong></font></div></td>
						</tr>
						<tr>
							<td width="60%"><div align="center">
								<textarea name="textfield3" cols="110" rows="15">
<FORM action="<?=$siteurl?>/handle.php" method="post">
	<input type=hidden name="addsub" value="1">
	<input type=hidden name="receiver" value="<?=$_POST['receiver']?>">
	<input type=hidden name="amount" value="<?=$_POST['amount']?>">
	<input type=hidden name="setup" value="<?=$_POST['setup']?>">
	<input type=hidden name="memo" value="<?=$_POST['memo']?>">
	<input type=hidden name="cycle_d" value="<?=$_POST['cycle_d']?>">
	<input type=hidden name="cycle_p" value="<?=$_POST['cycle_p']?>">
	<input type=hidden name="stop" value="<?=$_POST['stop']?>">
	<input type=hidden name="item_name" value="<?=$_POST['name']?>">
<?	if($_POST['mybutton']){	?>
	<input type=image name="cartImage" src="<?=$siteurl?>/zetapay/img/sub_buttons/<?=$_POST['mybutton']?>">
<?	}else{	?>
	<input type=submit name="cartImage" value="Order now">
<?	}	?>
</form>
								</textarea>
							</div></td>
						</tr>
						<tr>
							<td> </td>
						</tr>
						</table>
<?
	}else{
?>
						<FORM method=post>
						<TABLE class=design cellspacing=0 width=100% align=left>
						<tr>
							<td width="30%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Payment To:</font></td>
							<td width="80%"><input name="receiver" type="name" id="receiver" value="<?=$data->ID?>"></td>
						</tr>
						<tr>
							<td width="30%" align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Subscription Title:</font></td>
							<td width="80%"><input name="name" type="name" id="name" value=""></td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Setup Price</font></td>
							<td><input name="setup" type="text" size="10" maxlength="10"><span class="tiny">Do not put any $ Dollar Signs, enter only a number like 5.00</td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Recurring Amount</font></td>
							<td><input name="amount" type="text" size="10" maxlength="10"><span class="tiny">Do not put any $ Dollar Signs, enter only a number like 5.00</td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Recurring Cycle</font></td>
							<td>
								<table class=empty>
								<tr>
									<td>
										<SELECT name="cycle_d">
											<OPTION>--</OPTION>
											<OPTION VALUE="1">1</OPTION>
											<OPTION VALUE="2">2</OPTION>
											<OPTION VALUE="3">3</OPTION>
											<OPTION VALUE="4">4</OPTION>
											<OPTION VALUE="5">5</OPTION>
											<OPTION VALUE="6">6</OPTION>
											<OPTION VALUE="7">7</OPTION>
											<OPTION VALUE="8">8</OPTION>
											<OPTION VALUE="9">9</OPTION>
											<OPTION VALUE="10">10</OPTION>
											<OPTION VALUE="11">11</OPTION>
											<OPTION VALUE="12">12</OPTION>
											<OPTION VALUE="13">13</OPTION>
											<OPTION VALUE="14">14</OPTION>
											<OPTION VALUE="15">15</OPTION>
											<OPTION VALUE="16">16</OPTION>
											<OPTION VALUE="17">17</OPTION>
											<OPTION VALUE="18">18</OPTION>
											<OPTION VALUE="19">19</OPTION>
											<OPTION VALUE="20">20</OPTION>
											<OPTION VALUE="21">21</OPTION>
											<OPTION VALUE="22">22</OPTION>
											<OPTION VALUE="23">23</OPTION>
											<OPTION VALUE="24">24</OPTION>
											<OPTION VALUE="25">25</OPTION>
											<OPTION VALUE="26">26</OPTION>
											<OPTION VALUE="27">27</OPTION>
											<OPTION VALUE="28">28</OPTION>
											<OPTION VALUE="29">29</OPTION>
											<OPTION VALUE="30">30</OPTION>
											<OPTION VALUE="31">31</OPTION>
										</SELECT>
									</td>
									<td>
										<SELECT name="cycle_p">
											<option value="0">-select one-</option>
											<option value="D">Day(s)</option>
											<option value="M">Month(s)</option>
										</SELECT>
									</td>
								</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td align="center"><font size="2" face="Verdana, Arial, Helvetica, sans-serif">Stop Payments:</font></td>
							<td>
								<SELECT name="stop">
									<OPTION>--</OPTION>
									<OPTION VALUE="1">1</OPTION>
									<OPTION VALUE="2">2</OPTION>
									<OPTION VALUE="3">3</OPTION>
									<OPTION VALUE="4">4</OPTION>
									<OPTION VALUE="5">5</OPTION>
									<OPTION VALUE="6">6</OPTION>
									<OPTION VALUE="7">7</OPTION>
									<OPTION VALUE="8">8</OPTION>
									<OPTION VALUE="9">9</OPTION>
									<OPTION VALUE="10">10</OPTION>
									<OPTION VALUE="11">11</OPTION>
									<OPTION VALUE="12">12</OPTION>
									<OPTION VALUE="13">13</OPTION>
									<OPTION VALUE="14">14</OPTION>
									<OPTION VALUE="15">15</OPTION>
									<OPTION VALUE="16">16</OPTION>
									<OPTION VALUE="17">17</OPTION>
									<OPTION VALUE="18">18</OPTION>
									<OPTION VALUE="19">19</OPTION>
									<OPTION VALUE="20">20</OPTION>
									<OPTION VALUE="21">21</OPTION>
									<OPTION VALUE="22">22</OPTION>
									<OPTION VALUE="23">23</OPTION>
									<OPTION VALUE="24">24</OPTION>
									<OPTION VALUE="25">25</OPTION>
									<OPTION VALUE="26">26</OPTION>
									<OPTION VALUE="27">27</OPTION>
									<OPTION VALUE="28">28</OPTION>
									<OPTION VALUE="29">29</OPTION>
									<OPTION VALUE="30">30</OPTION>
									<OPTION VALUE="31">31</OPTION>
								</SELECT>
							</td>
						</tr>
<?
	//$mybutton
	if( file_exists("images/sub_buttons")){
		$handle=opendir("images/sub_buttons");
		while (false!==($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				$x = strtolower(substr($file, -4));
				if($x && $x == ".jpg" || $x == ".gif" || $x == ".png"){
?>
					<tr>
						<td align="center"><input name="mybutton" type="radio" value="<?=$file?>"></td>
						<td>
							<img src="zetapay/img/buttons/<?=$file?>">
						</td>
					</tr>
<?
				}
			}
		}
	}
?>
						<tr>
							<th colspan=2><input name="create" type="submit" id="create" value="Create Subscription"></th>
						</tr>
						</table>
						</form>
<?
	}
?>
					</td>
				</tr>
				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>