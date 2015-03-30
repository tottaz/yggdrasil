		<TABLE class=design width=100% cellspacing=0>
		<tr><TD>
			<small>
			Welcome to the <?=$sitename?> Transaction Report System, Here you can
			display the most recent transactions, or search for transactions from a certain
			date and time.
			</small>
		</td></tr>
		</table>
		<br><br>
		<!------///////////////--->
		<div class="titlebar" style="width:50%;height:20px;padding-left:10px;padding-top:5px;color: white;"><b>
			Transaction Search:
		</b></div>
		<!------///////////////--->
		<TABLE width=100% cellspacing=0>
		<tr>
			<td style="padding-left:10px;">&nbsp;</td>
			<TD><bR>
				<TABLE class=design width=100% cellspacing=0>
				<tr><TD>
					<small>
					Please choose an option from the list below.
					</small>
				</td></tr>
				</table>
				<br><br>
				<TABLE class=design width=100% cellspacing=0>
				<form method=POST name=form2>
				<input type="hidden" name="search" value="1">
				<?=$id_post?>
				<tr>
					<th width=40%>Display:</th>
					<td>
						<SELECT name="tdisp">
							<option value="">--------------</option>
							<option value="alt">All Transactions for Today</option>
							<option value="adt">All Deposits for Today</option>
							<option value="apdt">All Pending Deposits for Today</option>
							<option value="awt">All Withdrawals for Today</option>
							<option value="apwt">All Pending Withdrawals for Today</option>
							<option value="">--------------</option>
							<option value="alm">All Transactions for Past 30 Days</option>
							<option value="adm">All Deposits for Past 30 Days</option>
							<option value="apdm">All Pending Deposits for Past 30 Days</option>
							<option value="awm">All Withdrawals for Past 30 Days</option>
							<option value="apwm">All Pending Withdrawals for Past 30 Days</option>
							<option value="">--------------</option>
						</select>
					</td>
				</tr>
				<tr>
					<th colspan=4><div align=center><input type=submit name=submit value="Search"></th>
				</tr>
				</form>
				</table>
				<br>
				<TABLE class=design width=100% cellspacing=0>
				<tr><TD>
					<small>
					<B>Or</b> for a more detailed report, please enter your search criteria in
					the search form below.
					</small>
				</td></tr>
				</table>
				<br><br>
				<TABLE class=design width=100% cellspacing=0>
				<form method=POST name=form1>
				<input type="hidden" name="search" value="1">
				<?=$id_post?>
				<tr>
					<th width=40%>From Date :</th>
					<td>
						<SELECT NAME="from_month">
							<option value="">Month</option>
							<option value="1">Jan</option>
							<option value="2">Feb</option>
							<option value="3">Mar</option>
							<option value="4">Apr</option>
							<option value="5">May</option>
							<option value="6">Jun</option>
							<option value="7">Jul</option>
							<option value="8">Aug</option>
							<option value="9">Sep</option>
							<option value="10">Oct</option>
							<option value="11">Nov</option>
							<option value="12">Dec</option>
						</SELECT>
					</td>
					<td>
						<SELECT NAME="from_date">
							<option value="">Date</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
							<option value="13">13</option>
							<option value="14">14</option>
							<option value="15">15</option>
							<option value="16">16</option>
							<option value="17">17</option>
							<option value="18">18</option>
							<option value="19">19</option>
							<option value="20">20</option>
							<option value="21">21</option>
							<option value="22">22</option>
							<option value="23">23</option>
							<option value="24">24</option>
							<option value="25">25</option>
							<option value="26">26</option>
							<option value="27">27</option>
							<option value="28">28</option>
							<option value="29">29</option>
							<option value="30">30</option>
							<option value="31">31</option>
						</SELECT>
					</td>
					<td>	
						<SELECT NAME="from_year">
							<option value="">Year</a>
							<option value="2000">2000</option>
							<option value="2001">2001</option>
							<option value="2002">2002</option>
							<option value="2003">2003</option>
							<option value="2004">2004</option>
							<option value="2005">2005</option>
							<option value="2006">2006</option>
							<option value="2007">2007</option>
							<option value="2008">2008</option>
							<option value="2009">2009</option>
							<option value="2010">2010</option>
							<option value="2011">2011</option>
							<option value="2012">2012</option>
							<option value="2013">2013</option>
							<option value="2014">2014</option>
							<option value="2015">2015</option>
							<option value="2016">2016</option>
							<option value="2017">2017</option>
							<option value="2018">2018</option>
							<option value="2019">2019</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>To Date :</th>
					<td>
						<SELECT NAME="to_month">
							<option value="">Month</option>
							<option value="1">Jan</option>
							<option value="2">Feb</option>
							<option value="3">Mar</option>
							<option value="4">Apr</option>
							<option value="5">May</option>
							<option value="6">Jun</option>
							<option value="7">Jul</option>
							<option value="8">Aug</option>
							<option value="9">Sep</option>
							<option value="10">Oct</option>
							<option value="11">Nov</option>
							<option value="12">Dec</option>
						</SELECT>
					</td>
					<td>
						<SELECT NAME="to_date">
							<option value="">Date</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
							<option value="13">13</option>
							<option value="14">14</option>
							<option value="15">15</option>
							<option value="16">16</option>
							<option value="17">17</option>
							<option value="18">18</option>
							<option value="19">19</option>
							<option value="20">20</option>
							<option value="21">21</option>
							<option value="22">22</option>
							<option value="23">23</option>
							<option value="24">24</option>
							<option value="25">25</option>
							<option value="26">26</option>
							<option value="27">27</option>
							<option value="28">28</option>
							<option value="29">29</option>
							<option value="30">30</option>
							<option value="31">31</option>
						</SELECT>
					</td>
					<td>	
						<SELECT NAME="to_year">
							<option value="">Year</a>
							<option value="2000">2000</option>
							<option value="2001">2001</option>
							<option value="2002">2002</option>
							<option value="2003">2003</option>
							<option value="2004">2004</option>
							<option value="2005">2005</option>
							<option value="2006">2006</option>
							<option value="2007">2007</option>
							<option value="2008">2008</option>
							<option value="2009">2009</option>
							<option value="2010">2010</option>
							<option value="2011">2011</option>
							<option value="2012">2012</option>
							<option value="2013">2013</option>
							<option value="2014">2014</option>
							<option value="2015">2015</option>
							<option value="2016">2016</option>
							<option value="2017">2017</option>
							<option value="2018">2018</option>
							<option value="2019">2019</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>Transaction Type :</th>
					<td colspan=3>
						<SELECT NAME="ttype">
							<option value="">All Transactions</option>
							<option value="d">Deposits</option>
							<option value="w">Withdrawals</option>
							<option value="t">Transfers</option>
							<option value="r">Referrals</option>
						</SELECT>
					</td>
				</tr>
				<tr>
					<th>Transaction Status:</th>
					<td colspan=3>
						<SELECT NAME="tstatus">
							<option value="">Display All</option>
							<option value="p">Pending Transactions</option>
							<option value="d">Completed Transactions</option>
						</SELECT>
					</td>
				</tr>
				<TR>
					<TH>Payment Processor:
					<td colspan=3>
						<SELECT name=tgate>
							<OPTION value="">Display All
							<OPTION value=11>PayPal
							<OPTION value=15>E-Gold
							<OPTION value=17>Authorize.Net
							<OPTION value=18>NetPay
							<OPTION value=12>Check
						</SELECT>
					</td>
				</TR>
				<tr>
					<th>Enter Email <span class=tiny>(If Searching for Specific User)</span></th>
					<td colspan=3><input type=text name=email value=""></td>
				</tr>
				<tr>
					<th colspan=4><div align=center><input type=submit name=submit value="Search"></th>
				</tr>
				</form>
				</table>
			</td>
		</tr>
		</table>
		<br>