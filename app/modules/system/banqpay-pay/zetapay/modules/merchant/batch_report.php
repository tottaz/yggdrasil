<form name="batch" id="batch" method="post" action="index.cfm">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%" >
<tr valign="top"><td width="100%">
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr valign="top">
		<td align="center" class="subtitle"><font color=red><?=$error?></font></td>
	</tr>
</table>
</td></tr>
<tr valign="top"><td>
<table border="0" cellspacing="0" align=center cellpadding="0" width="100%">
	<tr valign="top">
		<td class="subtitle">Batch Report</td>
		<td align="right" class="trimText">
		<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td style="padding-right:3px;"><img src="cpos/images/world.gif" vspace="0" border="0"></td>
				<td>Time Zone: US/Eastern</td>
			</tr>
		</table>
		</td>
	</tr>
</table>
</td></tr>
<tr valign="top"><td>
<table height="100" align="left" width="100%" cellspacing="2" cellpadding="1" class="outerTable" >
	<tr>
		<td class="formLabel" width="15%">Account</td>
		<td class="formField" width="85%" style="padding-left:15px;" colspan="3">
			<table border="0" cellpadding="0" cellspacing="0">
				<tr>

						<td><select name="account" id="account" size="1" class="large">

								<option value="99993986">ePaymentsnews-CAD&nbsp;&nbsp;(99993986)&nbsp;&nbsp;</option><option value="99993987">ePaymentsnews-USD&nbsp;&nbsp;(99993987)&nbsp;&nbsp;</option>
							</select>
						</td>
						<td style="padding-left:5px; padding-top:1px;">
							<a class="solid" title="Reload and list by account number" href="index.cfm?event=reports.batch&accountsort=num">
								<img src="cpos/images/reload_arrow.gif" width="18" height="18" vspace="0" border="0" alt="Reload and list by account number">
							</a>
						</td>

				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="formLabel">Batch Status</td>
		<td class="formField" style="padding-left:15px;" colspan="3">
			<select name="batchStatus" size="1">
				<option value="All">All</option>
				<option value="C" selected>Completed&nbsp;&nbsp;</option>
				<option value="P">Pending</option>
				<option value="E">Error</option>
			</select>
		</td>
	</tr>
	<tr>
		<td class="formLabel">From Date</td>
		<td class="formField" style="padding-left:15px;" colspan="3">
			<select name="fromDateMonth" id="fromDateMonth">
			</select>
			<script>loadMonths(document.getElementById('fromDateMonth'));</script>
			<select id="fromDateDay" name="fromDateDay">
			</select>
			<script>loadDayofMonth(document.getElementById('fromDateDay'));</script>
			<select id="fromDateYear" name="fromDateYear" >
			<script>loadYears(document.getElementById('fromDateYear'),1997,2010 );</script>
			</select>
		</td>
	</tr>
	<tr>
		<td class="formLabel">To Date</td>
		<td class="formField" style="padding-left:15px;" colspan="3">
			<select name="toDateMonth" id="toDateMonth">
			</select>
			<script>loadMonths(document.getElementById('toDateMonth'));</script>
			<select id="toDateDay" name="toDateDay" >
			</select>
			<script>loadDayofMonth(document.getElementById('toDateDay'));</script>
			<select id="toDateYear" name="toDateYear" >
			<script>loadYears(document.getElementById('toDateYear'),1997,2010 );</script>
			</select>
		</td>
	</tr>
	<tr>
		<td class="formLabel">Level of Detail</td>
		<td class="formField" style="padding-left:15px;" colspan="3">
			<select name="batchdetail" id="batchdetail" size="1">
				<option value="summary" >Summary&nbsp;&nbsp;&nbsp;</option>
				<option value="basic" selected>Basic</option>
				<option value="full" >Full</option>
			</select>
		</td>

	</tr>
</table>
</td></tr>
<tr valign="top"><td>
<table border=0 align="left" width="100%" cellspacing="0" cellpadding="0">
	<tr valign="top">
		<td align="right" height="40">
			<input type="button" name="generateCreditButton" value="Generate Credit Report" onClick="document.batch.type.value='credit';btcSwitchFa();validateBatch();" />
			<input type="button" name="generateSettleButton" value="Generate Settlement Report" onClick="document.batch.type.value='settle';btcSwitchFa();validateBatch();" />
		</td>
	</tr>
</table>
<input type="hidden" name="type" value="">
<input type="hidden" name="event" value="">
</td></tr>
</table>
</form>
