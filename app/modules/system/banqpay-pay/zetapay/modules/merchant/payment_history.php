	<?php
	// GET Variables

	echo '<table cellspacing=2 cellpadding=2 border=0>
		<td bgcolor="#ddcccc" width=100><b>ID</b></td>
		<td bgcolor="#ddcccc" width=130><b>Date</b></td>
		<td bgcolor="#ddcccc" width=200><b>Type</b></td>
		<td bgcolor="#ddcccc" width=100><b>Status</b></td>
		<td bgcolor="#ddcccc" width=100><b>Response</b></td>
		<td bgcolor="#ddcccc" width=150><b>Amount</b></td>';

	// get the billing_history for this account, the account number is stored in the corresponding billing record

	$query = "SELECT p.id p_id, p.creation_date p_cdate, p.payment_type p_payment_type, p.status p_status,
		p.billing_amount p_billing_amount, p.response_code p_response_code, c.account_number c_acctnum,
		b.account_number b_acctnum, b.id b_id
	FROM payment_history p
	LEFT JOIN billing b ON p.billing_id = b.id
	LEFT JOIN customer c ON b.account_number = c.account_number
	WHERE b.account_number = '$base->input['account_number']' ORDER BY p.id DESC";
        $result = db_query($query)
                or die ("Query Failed".db_error());

/*	BILLING HISTORY EXAMPLE
*	$query = "SELECT h.id h_id, h.billing_id h_bid, h.billing_date h_bdate, h.billing_type h_btype,
*        h.from_date h_from, h.to_date h_to, h.total_due h_total,
*        c.account_number c_acctnum, b.account_number b_acctnum, b.id b_id
*        FROM billing_history h
*        LEFT JOIN billing b ON h.billing_id = b.id
*        LEFT JOIN customer c ON b.account_number = c.account_number
*        WHERE b.account_number = '$base->input['account_number']' ORDER BY h.id DESC";
*/


	while ($myresult = db_fetch_assoc($result))
	{
		$id = $myresult['p_id'];
		$date = $myresult['p_cdate'];
		$type = $myresult['p_payment_type'];
		$status = $myresult['p_status'];
		$response = $myresult['p_response_code'];
		$amount = $myresult['p_billing_amount'];

		print "<tr bgcolor=\"#ffeeee\">";
		print "<td>$id</td>";
		print "<td>$date</td>";
		print "<td>$type</td>";
		print "<td>$status</td>";
		print "<td>$response</td>";
                print "<td>$amount</td>";
	}

	echo '</table>';

	?>