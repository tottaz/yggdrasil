<table width="100%" border="0" align="center" bgcolor="#FFFFFF">
<tr>
	<td>
		<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
		<tr>
			<td width=20> </td>
			<td width="100%" valign="top">
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
				<tr>
					<td>
						<span class="text4">Sell Products or Services</span><br>
						<hr width="100%" size="1"><br>
					</td>
				</tr>
				</table>
				<table width="100%" border="0" align="center" cellpadding="3" cellspacing="3" bgcolor="#FFFFFF">
				<tr>
<?	if($use_shop){	?>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td>
								<font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_submit_site"><font face="Arial, Helvetica, sans-serif" size="2">
								Submit Site to  <?=$sitename?> Shops</font></a></font>
							</td>
						</tr>
						<tr>
							<td width=375 valign="bottom"> If your website accepts <?=$sitename?>, add it here so that other members can visit your site</td>
						</tr>
						</table>
					</td>
<?	}	?>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td><font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_buynow"><font face="Arial, Helvetica, sans-serif" size="2">Buy Now Buttons</font></a></font></td>
						</tr>
						<tr>
							<td width=375 valign="bottom">
								Buy Now Buttons create a customized payment button, and your Buyers will be able to make their
								purchases quickly and securely on <?=$sitename?>'s hosted payment pages.
							</td>
						</tr>
						</table>
					</td>
				</tr>
				<tr>
<?	if($use_shop){	?>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td>
								<font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_edit_sites"><font face="Arial, Helvetica, sans-serif" size="2">
								Manage My Sites</font></a></font>
							</td>
						</tr>
						<tr>
							<td width=375 valign="bottom">Click here to manage the sites that you have added to <?=$sitename?> Shops</td>
						</tr>
						</table>
					</td>
<?	}	?>
<?	if($use_donate){	?>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td><font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_donate"><font face="Arial, Helvetica, sans-serif" size="2">Donation Buttons</font></a></font></td>
						</tr>
						<tr>
							<td width=375 valign="bottom">
								Donation Buttons create a customized donation button, and your visitors will be able to make their 
								donations quickly and securely on <?=$sitename?>'s hosted payment pages.
							</td>
						</tr>
						</table>
					</td>
<?	}	?>
				</tr>
<?	if($use_subscription){	?>
				<tr>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td><font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_add_subscribe"><font face="Arial, Helvetica, sans-serif" size="2">Subscriptions and Recurring Payments</font></a></font></td>
						</tr>
						<tr>
							<td width=375 valign="bottom">
								<?=$sitename?>'s Subscriptions and Recurring Payments system lets you accept
								recurring payments for your service. Your subscribers will be able to
								subscribe quickly and securely from <?=$sitename?>'s hosted payment pages,
								where they can make initial payments (if necessary) and set up any future
								payments for the subscription.
							</td>
						</tr>
						</table>
					</td>
				</tr>
<?	}	?>
				<tr>
					<td width="50%" valign="top">
						<table width="100%" border="0" cellspacing="0" cellpadding="3">
						<tr>
							<td><font face="Arial, Helvetica, sans-serif" size="2"><a href="?a=merchant_add_links"><font face="Arial, Helvetica, sans-serif" size="2">Add Links</font></a></font></td>
						</tr>
						<tr>
							<td width=375 valign="bottom">
								<?=$sitename?>'s Links Payments system lets you accept
								recurring payments for dynamic links on your website.
							</td>
						</tr>
						</table>
					</td>
				</tr>

				</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>