<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
*/

// ------------------------------------------------------------------------

$lang = array(

	/** Global Words **/
 	'global:home' => 'Home',
 	'global:about' => 'About',
 	'global:import' => 'Import',
    
 	'global:overview' => 'Overview',
 	'global:error' => 'Error',
	'global:version' => 'App :1',
	'global:allrelatedmediacopyright' => 'Yggdrasil is Copyright :1 :2',
	'global:insecure_action' => 'Insecure action was attempted but caught',
	'global:maps' => 'Media Map',   
	'global:enter' => 'Enter',    	  
	'global:upload_failed' => 'There was a problem uploading your file. Please try again. If the problem persists, please contact support@thunderbeaardesign.com.',
	'global:upload_not_allowed' => 'The file type of the file you were trying to upload is not allowed. If you need to upload a file of that type, please compress it into a .zip or any other archive format you might find appropriate.',
	'global:copied' => 'Copied!',
	'global:users' => 'Users',
	'global:noonreport' => 'Noon Report',    
	'global:schedule' => 'Schedule',    
	'global:people' => 'People',
	'global:whois' => 'Who is onboard',    
	'global:database' => 'Database',    
	'global:couldnotsendemail' => 'Could not send the email.  Please check your settings.',
	'global:emailsent' => 'Email has been sent!',
	'global:yes' => 'Yes',
	'global:no' => 'No',
	'global:dontshowagain' => "Don't show this again",
    'global:disable' => 'Disable',
	'global:enable' => 'Enable',
	'global:is_enabled' => 'Enabled?',
	'global:is_completed' => 'Completed?',
	'global:Y' => 'Y',
	'global:N' => 'N',
	'global:notes' => 'Notes',
	'global:description' => 'Description', 
	'global:backtoadmin' => 'Back to Admin',
	'global:type' => 'Type',
	'global:name'		=>	'Name',
	'global:first_name'	=>	'First Name',
	'global:last_name'	=>	'Last Name',
	'global:for'		=>	'for',
	'global:from'		=>	'from',
	'global:phone'		=>	'Phone',
	'global:email'		=>	'Email',
	'global:contacts'	=>	'Contacts',
	'global:week'		=> 'Weekly',
	'global:quarterly'	=> 'Quarterly',
    'global:every_six_months' => 'Every 6 months',
    'global:biyearly'	=> 'Every 2 years',
	'global:month'		=> 'Monthly',
	'global:year'		=> 'Yearly',
	'global:fax'		=>	'Fax',
	'global:mobile'		=>	'Mobile',
	'global:address'	=>	'Address',
	'global:api_key'	=> 'API Key',
	'global:website'	=>	'Website',
	'global:action'		=>	'Action',
	'global:items'		=>	'Items',
	'global:dashboard'	=>	'Dashboard',
	'global:settings'	=>	'Settings',
	'global:calendar'   =>  'Calendar',
	'global:logout' 	=>	'Logout',
	'global:login'		=> 	'login',
	'global:newssearch'	=>	'newssearch',
	'global:edit'		=> 	'edit',
	'global:delete'		=>	'delete',
	'global:created'	=>	'created',
	'global:remove'		=>	'remove',
    
	'global:optional_increment' => '<strong>Optional</strong> - will auto increment',

	'global:apikey' => 'Api Key',

	/** Greetings **/
	'global:greetings'	=>	array('Ahoi!', 'Hello,', 'Hey,', 'Sup,'),
	/** End Greetings **/


	/** Post **/
	'global:postcontent'	=>	'Post Content',
	'global:createpost'		=>	'Create Post',	
	'global:manageposts'	=>	'Manage Posts',
	'global:suggestions'	=>	'Suggestions',

	/** Feeds **/
	'global:addfeed'		=>	'Add Feed',	
	'global:managefeeds'	=>	'Manage Feeds',

	/** End Dashboard **/

	/** Users **/

	// ==============================
	// = LOGIN PAGE                 =
	// ==============================
	'login:forgotinstructions'	=>	'Please enter your email address so we can send you an email to reset your password.',
	'login:reset'				=>	'Reset &raquo;',
	'login:reset'				=>	'Reset Password',
	'login:username'			=>	'Username',
	'login:password'			=>	'Password',
	'login:changepassword'		=>	'Change Password',
	'login:email'				=>	'Email Address',
	'login:login'				=>	'Login',
	'login:logout'				=>	'Logout',
	'login:remember'			=>	'Remember Me',
	'login:forgot'				=>	'Forgot your password?',
	'login:cancel'				=>	'&laquo; Cancel',
	/** End Users **/
		
	/** Contact Log **/
	'contact:title'			=>	'Recent Contact History',
	'contact:method'		=>	'Contact Method',
	'contact:contact'		=>	'Contact',
	'contact:subject'		=>	'Subject',
	'contact:content'		=>	'Content',
	'contact:method'		=>	'Contact Method',
	// 'contact:view_all'		=>	'View All',
	/** End Contact Log **/
	
	/** Users **/
	'users:create_user' => 'Create User',
	
	/** Settings **/
	
	'settings:allowed_extensions' => 'Allowed Upload Extensions',
	'settings:comma_separated' => 'comma-separated',
	'settings:pdf_page_size' => 'PDF Page Size',
	'settings:testemailsettings' => 'Test Email Settings',
	'settings:items_per_page' => 'Items Per Page',
	'settings:items_per_page_explain' => 'Number of items to show per page.',
	'settings:send_x_days_before' => 'Default "send days before"',
	'settings:file_to_import' => 'File To Import',
	'settings:export_types' => 'App exports everything in JSON format.',
	'settings:file_should_be_csv' => 'App will process your file and import everything in it.',
	'settings:importnow' => 'Import now!',
	'settings:whatimporting' => 'What are you importing?',
	'settings:whatexporting' => 'What are you exporting?',
	'settings:nouploadedimportfile' => 'You did not upload a file to import.',
	'settings:import' => 'Import',
	'settings:imported_entries' => 'Imported :1 entries successfully.',
	'settings:xwereduplicates' => ':1 were duplicates, and were ignored.',
	'settings:import_desc' => 'Import data into App.',
	'settings:export' => 'Export',
	'settings:exportnow' => 'Export now!',
	'settings:importexport' => 'Import / Export',
	'settings:removelogo' => 'Remove Logo',
	'settings:wrong_license_key' => 'The license key you have entered is not valid.',
	'settings:noopenssl' => 'Your PHP server does not have OpenSSL configured, which means you can\'t use Gmail or Google Apps for sending email. Please contact your host and let them know you need OpenSSL.',
	'settings:logoremoved' => 'Logo removed successfully!',
	'settings:save' => 'Save Settings',
	'settings:logodimensions' => 'The logo should be 178 pixels wide and 56 pixels tall.',
	'settings:logoformatsallowed' => 'BMP, PNG, JPG (JPEG) and GIF are allowed.',
	'settings:ftp_user' => 'FTP User',
	'settings:ftp_pass' => 'FTP Password',
	'settings:ftp_path' => 'FTP Path',
	'settings:ftp_port' => 'FTP Port',
	'settings:ftp_pasv' => 'Passive Mode?',
	'settings:nophpupdates' => "Because of the way your server is configured, you need to enter your FTP details so that App can update itself. These details are used internally by App and are never transmitted to anyone.",
	'settings:ftp_host' => 'FTP Host',
	'settings:uptodate' => 'App is up to date (:1)',
	'settings:newversionavailable' => 'There is a new version of App available (:1)!',
	'settings:updatenow' => 'Update now!',
	'settings:youneedtoconfigurefirst' => 'Your App is not yet configured to update itself. Please enter your FTP details below, then press "Save Settings".<br /> App will then let you update.',
	'settings:general' => 'General',
	'settings:email_templates' => 'Emails',
	'settings:branding' => 'Branding',
	'settings:feeds' => 'Feeds',
	'settings:api_keys' => 'API Keys',

	'settings:site_name' => 'Site name',
	'settings:language' => 'Language',
	'settings:timezone' => 'Timezone',
	'settings:notify_email' => 'Notify email',
	'settings:theme' => 'Frontend Theme',
	'settings:admin_theme' => 'Theme',
	'settings:admin_name' => 'Admin name',
	'settings:date_format' => 'Date format',
	'settings:task_time_interval' => 'Task Time Interval',
	'settings:mailing_address' => 'Mailing Address',
	
	'settings:default_subject' => 'Default Subject',
	'settings:default_contents' => 'Default Message',
	
	'settings:logo' => 'Your logo',
	'settings:frontend_css' => 'Frontend Custom CSS',
	'settings:backend_css' => 'Backend Custom CSS',
	
	'settings:rss_password' => 'RSS Password',
	'settings:default_feeds' => 'Default Feeds',
	'settings:cron_job_feed' => 'Cron Job',
	'settings:feed_generator' => 'Feed Generator',
	'settings:your_link' => 'Your Link',
	'settings:bcc' => 'BCC',
	'settings:automaticallybccclientemail' => 'Automatically send a copy of the email to the notify email (defined above)',
	'settings:api_note' => 'Name / Note',
	'settings:api_key' => 'Key',
	'settings:noonreport' => 'Noon Report',
	'settings:custom_css' => 'Custom CSS',
	'settings:plugins'  => 'Plugins',
	'settings:applications'  => 'Application',
	
	'settings:authentication' => 'Authentication',
	'settings:LDAP' => 'LDAP Authentication',
	'settings:ldap_connect' => 'ldap conenct',
	'settings:ldap_port'    => 'ldap port',
	'settings:ldap_dc'      => 'ldap_dc',
	
	'settings:ldapauthnotify' => 'Set the LDAP details',
	'settings:local' => 'Local Authentication',
	'settings:google' => 'Google Authenitcation',	
	'settings:google_client_id' => 'Google Client ID:',	
	'settings:google_email_address' => 'Google Email address:',	
	'settings:google_client_secret' => 'Google Client secret',	
	'settings:google_redirect_uri' => 'Redirect URIs',	
	'settings:google_javascript_origins' => 'Google JavaScripts Origins',
	'settings:google_API_key' => 'google_API_key',
	
	/** End Settings **/	
	/** General Admin **/
	'general:id' => 'Id',
	'general:title' => 'Title',
	'general:status' => 'Status',
	'general:actions' => 'Actions',
	'general:save' => 'save',
	'general:delete' => 'delete',

	/** Keywords **/
	'keywords:create_user' => 'Create User',
	 	
	/** MIS Report  **/    
	'misreport:misreport'  => 'GPIS Advisory Report',
	'misreport:odp'  => '1. 3 years ODP',
	'misreport:programme'  => '4. 80-20 Programme Expenditure',
	'misreport:adhoc'  => '3. Programme',
	'misreport:financial'  => '5. Financial Reporting Compliance',
	'misreport:governance'  => '6. Governance Compliance',
	'misreport:hr'  => '2. People & HR',
	'misreport:pm'  => 'Project Management',
	'misreport:globalgrowth' => 'Global Growth',
	'misreport:growthtarget' => 'FR Growth Target',
	'misreport:hrstaff' => '2. People & HR',
	'misreport:contributionglobal' => 'Contribution Global',    
	'misreport:globalcompliance'  => 'Global Financial Reporting Compliance %',
	'misreport:kpifr' => 'KPIs: FR Income Growth - by NRO',
	'misreport:kpifrglobal' => 'KPIs: FR Income Growth - Global',
	'misreport:contributionbynro' => 'Contribution - by NRO',
	'misreport:contributionbynroyear' => 'Contribution - by NRO from 2012-2014',   

	//
	// Action
	//

	'action:action' => 'Action',
	'action:action_data' => 'Action Data',
	'action:action_analysis' => 'Action Analysis',
	'action:actiongrid' => 'Edit Action Data',

	//
	//  System
	//      
	
	'system:system' => 'System',
	'system:diskspace' => 'Diskspace used',
	'system:cache' => 'Empty Cache',
	'system:export' => 'Export tables',    
	'system:database' => 'Database',
	'system:files' => 'Files',
	'system:keywords' => 'Keywords',
	'system:logs' => 'Logs',
	'system:cronlogs' => 'Cron Logs',
	'system:cronstats' => 'Cron Stats',
	'system:modules' => 'Modules',
	'system:navigation' => 'Navigation',
	'system:pages' => 'Pages',
	'system:redirects' => 'Re-directs',
	'system:themes' => 'Themes',
	'system:variables' => 'Variables',
	'system:widgets' => 'Widgets',
	'system:worldcloud' => 'World Cloud',
	'system:serverstat' => 'Server Stat',
	'system:apilogs' => 'API Logs',
	'system:phpinfo' => 'PHPINFO',

	/** Global Yggdrasil **/
	'global:overview' => 'Overview',
	'global:error' => 'Error',
	'global:version' => 'Yggdrasil :1',
	'global:allrelatedmediacopyright' => 'Copyright :1 :2',
	'global:developedat' => 'Developed at',
	'global:insecure_action' => 'Insecure action was attempted but caught',

	'global:upload_failed' => 'There was a problem uploading your file. Please try again. If the problem persists, please contact support@thunderbeaardesign.com.',
	'global:upload_not_allowed' => 'The file type of the file you were trying to upload is not allowed. If you need to upload a file of that type, please compress it into a .zip or any other archive format you might find appropriate.',
	'global:copied' => 'Copied!',
	'global:users' => 'Users',

	'global:optional_increment' => '<strong>Optional</strong> - will auto increment',

	/** End Dashboard **/
		
	/** Contact Log **/
	'contact:title'			=>	'Recent Contact History',
	'contact:method'		=>	'Contact Method',
	'contact:contact'		=>	'Contact',
	'contact:subject'		=>	'Subject',
	'contact:content'		=>	'Content',
	'contact:method'		=>	'Contact Method',
	'contact:calling_title'         =>	'Calling office ":1"',
	// 'contact:view_all'		=>	'View All',
	/** End Contact Log **/
			
	/** End Settings **/
	'update:ifyourenotsurecontactus' => "If you're not sure what to do, please <a href='http://thunderbeardesign.com/forums/newtopic/2/'>start a new tech support topic in the forums</a>.",
	'update:youmodified' => 'You modified',
	'update:youdeleted' => 'You deleted',
	'update:loadingpleasewait' => 'Loading, please wait...',
	'update:errordownloading' => 'An update to Yggdrasil is available, but Yggdrasil is having problems downloading it.',
	'update:herearestepstofix' => 'Here are a few steps you can try to fix it:',
	'update:makesureuploadsiswritable' => 'Make sure that your uploads folder is writable (CHMOD 0777).',
	'update:deletesystemupdate' => 'Delete the Yggdrasil-update-system folder (inside the uploads folder), and all its contents.',
	'update:loadagain' => "Load Yggdrasil again. If the error persists, change the owner of the Yggdrasil folder (chown) so it matches the web server's user. If you can't do that, or don't know how to, please send an email to support@thunderebardesign.com, and we'll help you.",
	'update:whatschanged' => "What's new in :1",
	'update:ftp_conn' => 'Yggdrasil could not connect to the FTP host.',
	'update:ftp_login' => 'Yggdrasil could not login via FTP (wrong FTP username/password?).',
	'update:ftp_chdir' => 'Yggdrasil could not set the FTP path (path probably does not exist).',
	'update:ftp_no_uploads' => 'Yggdrasil could not obtain permission to upload files via FTP.',
	'update:ftp_indexwrong' => 'The FTP Path you entered is incorrect. It should be the path to Yggdrasil\'s directory.',
	'update:ftp_indexnotfound' => 'The FTP Path you entered is incorrect. It should be the path to Yggdrasil\'s directory.',
	'update:update_conflict' => 'You modified some files since the last update. In order to safeguard your customizations, here is a list of files that you have modified, that conflict with the latest upgrade.',
	'update:update_no_perms' => 'Yggdrasil does not have enough permissions to update itself, nor does it have access to an FTP account from which it can update itself. Update cannot continue.',
	'update:review_files' => 'Please review these files and make backups of them before proceeding. When the upgrade is finished, you will have to re-integrate your modifications back into them. Please do not just replace the updated files with your outdated modified copies, as that may break Yggdrasil.',
	'update:internetissues' => "Yggdrasil is unable to connect to the Internet.",
	'update:needsinternet' => 'For Yggdrasil to function correctly, your server must allow it to fetch some information from the Internet (port 80).',
	'update:maybefirewall' => "It appears that your server is blocking Yggdrasil from accessing the Internet. This could be a firewall issue in your server. Please contact your host for help. Ask them to allow PHP to access :1.",
	'update:nointernetaccess' => 'No Internet Access',
	'update:updated' => 'Yggdrasil was upgraded from :1 to :2',
	/** Action Logger  **/
    
    'maintenance:logs' => 'Logs',   
	/** End Action Logger **/	

);