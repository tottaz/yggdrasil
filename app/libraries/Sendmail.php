<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sendmail {

    public function __construct() {
	$CI =& get_instance();
	$CI->load->model('Configuration_model', '', TRUE);
	$CI->load->model('admin/Emails_model', '', TRUE);
    }

    public function send($form_id) {

	$CI =& get_instance();

	// Get form Fields

	$fields = $CI->Display_model->getFields($form_id);

	// Get available Emails using $form_id
	
	$emails = $CI->Emails_model->getEmails($form_id, TRUE);

	// Cycle through enabled emails and prep:

	foreach ($emails->result() as $row)	    {

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the To: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendTo'] = array();
	    if(!empty($row->to_entry)) {
		$MAIL['sendTo'] = explode(",", $row->to_entry);
	    }
	    if(isset($row->to_selection)) {
		array_push($MAIL['sendTo'], $CI->input->post("field_" . $row->to_selection));
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the From: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendFrom'] = ($row->from_entry) ? $row->from_entry : $CI->input->post("field_" . $row->from_selection);

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the From: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendFromName'] = ($row->from_name) ? $row->from_name : $CI->input->post("field_" . $row->from_name_selection);


	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the Subject: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendSubject'] = $row->subject;

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the Cc: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendCc'] = $row->cc_entry;

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the Bcc: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['sendBcc'] = $row->bcc_entry;

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Set the Body: Field:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $MAIL['body'] = self::_replaceVars($row->body, $fields);

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Attach Files to Email if true
	    //////////////////////////////////////////////////////////////////////////////////////////

	    if($_POST['files'] && $row->attach_files == "true") {
		foreach($_POST['files'] as $file) {
		    $CI->email->attach('./uploads/' . $file);
		}
	    }

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // initialize email settings:

	    $emailConfigs = $CI->configuration->getValuesByType("email");
	    $emailConfigs['mailtype'] = TRUE;
	    $emailConfigs['priority'] = $row->priority;

	    
	    $CI->email->initialize($emailConfigs);

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Lets Send the Email:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $CI->email->from($MAIL['sendFrom'], $MAIL['sendFromName']);
	    $CI->email->to($MAIL['sendTo']);
	    $CI->email->cc($MAIL['sendCc']);
	    $CI->email->bcc($MAIL['sendBcc']);

	    $CI->email->subject($MAIL['sendSubject']);
	    $CI->email->message($MAIL['body']);

	    $CI->email->send();
	    $CI->email->clear(TRUE);


//	    echo $CI->email->print_debugger();
	}
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Configuration Option to Send Email to Admin
    //////////////////////////////////////////////////////////////////////////////////////////////////

    public function sendToAdmin($message = '', $subject = '') {

	    $CI =& get_instance();

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // initialize email settings:

	    $emailConfigs = $CI->configuration->getValuesByType("email");
	    $emailConfigs['mailtype'] = TRUE;
	    $emailConfigs['priority'] = 3;

	    $CI->email->initialize($emailConfigs);

	    //////////////////////////////////////////////////////////////////////////////////////////
	    // Lets Send the Email to Admin To Test Configuration Settings:
	    //////////////////////////////////////////////////////////////////////////////////////////

	    $adminEmail = $CI->configuration->getValue('admin_email');
	    $adminOrg = $CI->configuration->getValue('org');

	    $CI->email->from($adminEmail, $adminOrg);
	    $CI->email->to($adminEmail);

	    $CI->email->subject($subject);
	    $CI->email->message($message);

	    // check if mail sent successfully

	    if($CI->email->send()) {
		return TRUE;
	    }

	    // mail not sent

	    else {
		return FALSE;
	    }

	    $CI->email->clear(TRUE);
    }


    private function _replaceVars($body, $fields) {

	foreach($fields as $key => $val) {

	    $fieldName = "field_" . $key;
	    $replaceName = "%%field_" . $key . "%%";

	    $value = (is_array($_POST[$fieldName])) ? implode(", ", $_POST[$fieldName]) : $_POST[$fieldName];

	    $value = xss_clean($value);

	    $body = str_replace($replaceName, $value, $body);

	}
	return $body;
    }
}