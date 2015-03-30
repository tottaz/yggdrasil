<H3>Customer Record</H3>

<?php
// Copyright (C) 2002-2004  Paul Yasi <paul@citrusdb.org>, read the README file for more information
// this will print a full customer record including customer, billing, service and support info.

// Includes
require_once('include/citrus.inc.php');

echo "<blockquote>";

//
// get the customer information
//
$query = "SELECT c.signup_date c_signup_date, c.name c_name, c.company c_company, c.street c_street, c.city c_city, 
			c.state c_state, c.zip c_zip, c.country c_country, c.phone c_phone, c.fax c_fax, c.source c_source, 
			c.contact_email c_contact_email, c.maiden_name c_maiden_name, c.default_billing_id c_default_billing_id, 
			c.cancel_date c_cancel_date, c.removal_date c_removal_date, 
			b.name b_name, b.company b_company, b.street b_street, b.city b_city, b.state b_state, 
			b.country b_country, b.zip b_zip, b.phone b_phone, b.fax b_fax, b.contact_email b_contact_email, 
			b.account_number b_account_number, b.billing_type b_billing_type, 
			b.creditcard_number b_creditcard_number, b.creditcard_expire b_creditcard_expire, 
			b.billing_status b_billing_status, b.next_billing_date b_next_billing_date, 
			b.prev_billing_date b_prev_billing_date, 
			u.account_number u_account_number, u.master_service_id u_master_service_id, u.billing_id u_billing_id, 
			u.start_datetime u_start_datetime, u.salesperson u_salesperson, u.usage_multiple u_usage_multiple, 
			u.removed u_removed, 
			m.id m_id, m.service_description m_service_description, m.pricerate m_pricerate, 
			m.frequency m_frequency, m.options_table m_options_table
			FROM customer c LEFT JOIN billing b ON b.id = c.default_billing_id 
			LEFT JOIN user_services u ON u.account_number = c.account_number 
			LEFT JOIN master_services m ON u.master_service_id = m.id 
			WHERE c.account_number = '$account_number' AND removed <> 'y'";
$result = db_query($query) or die ("Customer Query Failed $query");
$myresult = db_fetch_assoc($result);
    
//
// Put values into variablies and Print basic customer inf
//
$signup_date = $myresult['c_signup_date'];
$name = $myresult['c_name'];
$company = $myresult['c_company'];        
$street = $myresult['c_street'];
$city = $myresult['c_city'];
$state = $myresult['c_state'];
$zip = $myresult['c_zip'];
$country = $myresult['c_country'];
$phone = $myresult['c_phone'];
$fax = $myresult['c_fax'];
$source = $myresult['c_source'];
$contactemail = $myresult['c_contact_email'];
$maidenname = $myresult['c_maiden_name'];
$tax_exempt_id = $myresult['c_tax_exempt_id'];
$default_billing_id = $myresult['c_default_billing_id'];
$cancel_date = $myresult['c_cancel_date'];
$removal_date = $myresult['c_removal_date'];
$billingemail = $myresult['b_contact_email'];

echo "Name: $name<br>
Company: $company<br>
Street: $street<br>
City: $city<br>
State: $state<br>
Zip: $zip<br>
Country: $country<br>
Phone: $phone<br>
Fax: $fax<br>
Source: $source<br>
Customer Email: $contactemail<br>
Billing Email: $billingemail<br>";


//
// Get their service information
//
$query = "SELECT c.signup_date c_signup_date, c.name c_name, c.company c_company, c.street c_street, c.city c_city, 
			c.state c_state, c.zip c_zip, c.country c_country, c.phone c_phone, c.fax c_fax, c.source c_source, 
			c.contact_email c_contact_email, c.maiden_name c_maiden_name, c.default_billing_id c_default_billing_id, 
			c.cancel_date c_cancel_date, c.removal_date c_removal_date, b.id b_id, 
			b.name b_name, b.company b_company, b.street b_street, b.city b_city, b.state b_state, 
			b.country b_country, b.zip b_zip, b.phone b_phone, b.fax b_fax, b.contact_email b_contact_email, 
			b.account_number b_account_number, b.billing_type b_billing_type, 
			b.creditcard_number b_creditcard_number, b.creditcard_expire b_creditcard_expire, 
			b.billing_status b_billing_status, b.next_billing_date b_next_billing_date, 
			b.prev_billing_date b_prev_billing_date, 
			u.account_number u_account_number, u.master_service_id u_master_service_id, u.billing_id u_billing_id, 
			u.start_datetime u_start_datetime, u.salesperson u_salesperson, u.usage_multiple u_usage_multiple, 
			u.removed u_removed, 
			m.id m_id, m.service_description m_service_description, m.pricerate m_pricerate, 
			m.frequency m_frequency, m.options_table m_options_table
			FROM customer c LEFT JOIN billing b ON b.id = c.default_billing_id 
			LEFT JOIN user_services u ON u.account_number = c.account_number 
			LEFT JOIN master_services m ON u.master_service_id = m.id 
			WHERE c.account_number = '$account_number' AND removed <> 'y'";
$result = db_query($query) or die ("Customer Query Failed $query");

echo "<p><h3>Services</h3><table><td>Service ID</td><td>Service Description</td><td>Details</td><td>Price</td><tr>";
while ($myresult = db_fetch_assoc($result))
{
	$m_id = $myresult['m_id'];
	$m_service_description = $myresult['m_service_description'];
	$m_pricerate = $myresult['m_pricerate'];
	$m_frequency = $myresult['m_frequency'];
	echo "<td>$m_id</td><td>$m_service_description</td><td>$m_frequency</td><td>\$$m_pricerate</td><tr>";
}
echo "</table>";

//
// Get their billing information
//
$query = "SELECT c.signup_date c_signup_date, c.name c_name, c.company c_company, c.street c_street, c.city c_city, 
			c.state c_state, c.zip c_zip, c.country c_country, c.phone c_phone, c.fax c_fax, c.source c_source, 
			c.contact_email c_contact_email, c.maiden_name c_maiden_name, c.default_billing_id c_default_billing_id, 
			c.cancel_date c_cancel_date, c.removal_date c_removal_date, b.id b_id, 
			b.name b_name, b.company b_company, b.street b_street, b.city b_city, b.state b_state, 
			b.country b_country, b.zip b_zip, b.phone b_phone, b.fax b_fax, b.contact_email b_contact_email, 
			b.account_number b_account_number, b.billing_type b_billing_type, 
			b.creditcard_number b_creditcard_number, b.creditcard_expire b_creditcard_expire, 
			b.billing_status b_billing_status, b.next_billing_date b_next_billing_date, 
			b.prev_billing_date b_prev_billing_date, 
			u.account_number u_account_number, u.master_service_id u_master_service_id, u.billing_id u_billing_id, 
			u.start_datetime u_start_datetime, u.salesperson u_salesperson, u.usage_multiple u_usage_multiple, 
			u.removed u_removed, 
			m.id m_id, m.service_description m_service_description, m.pricerate m_pricerate, 
			m.frequency m_frequency, m.options_table m_options_table
			FROM customer c LEFT JOIN billing b ON b.id = c.default_billing_id 
			LEFT JOIN user_services u ON u.account_number = c.account_number 
			LEFT JOIN master_services m ON u.master_service_id = m.id 
			WHERE c.account_number = '$account_number' AND removed <> 'y'";
$result = db_query($query) or die ("Customer Query Failed $query");

echo "<p><h3>Billing</h3><table><td>Billing ID</td><td>Billing Type</td><td>Status</td><td>Next Billing</td><tr>";
while ($myresult = db_fetch_assoc($result))
{
	$b_id = $myresult['b_id'];
	$b_billing_type = $myresult['b_billing_type'];
	$b_billing_status = $myresult['b_billing_status'];
	$b_next_billing_date = $myresult['b_next_billing_date'];
	echo "<td>$b_id</td><td>$b_billing_type</td><td>$b_billing_status</td><td>$b_next_billing_date</td><tr>";
}
echo "</table>";

echo "</blockquote>";

?>
