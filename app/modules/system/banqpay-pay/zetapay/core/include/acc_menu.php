<table width="100%" border="0" cellpadding="0" cellspacing="0" class="design">
<tr><th>My <?=$sitename?> Account</th></tr>
<tr>
	<td>
		<a class=menulink href=?a=account&<?=$id?>>Overview</a><BR>
		<a class=menulink href=?a=edit&<?=$id?>>My Profile</a><BR>
<?		if($use_pin){	?>
			<a class=menulink href=?a=editpin&<?=$id?>>My Pincode</a><BR>
<?		}	?>
		<a class=menulink href=?a=deposit&<?=$id?>>Deposit Money</a><BR>
		<a class=menulink href=?a=withdraw&<?=$id?>>Withdraw Money</a><BR>
<?		if($use_send){	?>
			<a class=menulink href=?a=transfer&<?=$id?>>Send Money</a><BR>
<?		}	?>
<?		if($use_req){	?>
			<a class=menulink href=?a=reqpay&<?=$id?>>Request Money</a><BR>
<?		}	?>
<?		if($use_sell){	?>
			<a class=menulink href=?a=user_product&<?=$id?>>Sell</a><BR>
<?		}	?>
<?		if($use_escrow){	?>
			<a class=menulink href=?a=escrow&<?=$id?>>Escrow</a><br>
<?		}	?>
<?		if($use_subscription){	?>
			<a class=menulink href=?a=viewsub&<?=$id?>>My Subscriptions</a><br>			
<?		}	?>
<?		if($affil_on){	?>
			<a class=menulink href=?a=affil&<?=$id?>>Referral Program</a><br>
<?			if($action == "affil"){	?>
				<a class=menulink href=?a=affil&be=code&<?=$id?>>· Referral Code</a><br>
				<a class=menulink href=?a=affil&be=dl&<?=$id?>>· Your Statistics</a><br>
				<a class=menulink href=?a=affil&be=stats&<?=$id?>>· Monthly Report</a><br>
<?			}	?>
<?		}	?>
<?		if($bannerads){	?>
			<a class=menulink href=?a=banners&<?=$id?>>Advertise With Us</a><BR>
<?		}	?>
<?		if($use_shop){	?>
			<a class=menulink href=?a=browse&<?=$id?>>Shop</a><BR>
<?		}	?>
	</td>
</tr>
</table>
<div align="center">
<br>