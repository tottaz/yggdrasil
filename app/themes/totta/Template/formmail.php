<?php

error_reporting(0);

@extract($_POST);

$recipient="vedmant@gmail.com";


function check_referer($referers){ 
   if (count($referers)){ 
      $found = false; 
      $temp = explode("/",getenv("HTTP_REFERER")); 
      $referer = $temp[2]; 
      for ($x=0; $x < count($referers); $x++){ 
         if ($referers[$x] == $referer){ 
            $found = true; 
         } 
      } 
      if (!$found){ 
         print_error("You are coming from an <b>unauthorized domain.</b>"); 
         error_log("[FormMail.php] Illegal Referer. (".getenv("HTTP_REFERER").")", 0); 
      } 
         return $found; 
      } else { 
         return true; //Not a good idea, if empty, it will allow it. 
   } 
} 
if ($referers) 
   check_referer($referers); 

// parse the form and create the content string which we will send 
function parse_form($array) { 
   // build reserved keyword array 
   $reserved_keys[] = "MAX_FILE_SIZE"; 
   $reserved_keys[] = "required"; 
   $reserved_keys[] = "require"; 
   $reserved_keys[] = "path_to_file"; 
   $reserved_keys[] = "recipient"; 
   $reserved_keys[] = "subject"; 
   $reserved_keys[] = "bgcolor"; 
   $reserved_keys[] = "text_color"; 
   $reserved_keys[] = "link_color"; 
   $reserved_keys[] = "vlink_color"; 
   $reserved_keys[] = "alink_color"; 
   $reserved_keys[] = "title"; 
   $reserved_keys[] = "missing_fields_redirect"; 
   $reserved_keys[] = "env_report"; 
   if (count($array)) { 
      while (list($key, $val) = each($array)) { 
         // exclude reserved keywords 
         $reserved_violation = 0; 
         for ($ri=0; $ri<count($reserved_keys); $ri++) { 
            if ($key == $reserved_keys[$ri]) { 
               $reserved_violation = 1; 
            } 
         } 
         // prepare content 
         if ($reserved_violation != 1) 
            $content .= "$key: $val\n"; 
      } 
   } 
   return $content; 
} 

// mail the content we figure out in the following steps 
function mail_it($content, $subject, $email, $recipient) { 
        mail($recipient, $subject, $content, "From: $email\r\nReply-To: $email\r\nX-Mailer: DT_formmail"); 
} 

// take in the body building arguments and build the body tag for page display 
function build_body($title, $bgcolor, $text_color, $link_color, $vlink_color, $alink_color) { 
   if ($title) 
      echo "<title>$title</title>"; 
   if (!$bgcolor) 
      $bgcolor = "#FFFFFF"; 
   if (!$text_color) 
      $text_color = "#000000"; 
   if (!$link_color) 
      $link_color = "#0000FF"; 
   if (!$vlink_color) 
      $vlink_color = "#FF0000"; 
   if (!$alink_color) 
      $alink_color = "#000088"; 
   if ($background) 
      $background = "background=\"$background\""; 
   echo "<body bgcolor=\"$bgcolor\" text=\"$text_color\" link=\"$link_color\" vlink=\"$vlink_color\" alink=\"$alink_color\" $background>\n\n"; 
} 

// our mighty error function.. 
function print_error($reason,$type = 0) { 
   build_body($title, $bgcolor, $text_color, $link_color, $vlink_color, $alink_color); 
   // for missing required data 
   if ($type == "missing") { 
      ?> 
      Your information was not submitted for the following reasons:<p> 
     <ul><?php 
     echo $reason."\n"; 
     ?></ul> 
     Please use your browser's back button to return to the form and try again.<?php 
   } else { // every other error 
      ?> 
      Your information was not submitted because of the following reasons:<p> 
      <?php 
   } 
   echo "<br><br>\n"; 
   exit; 
} 

// check for a recipient email address and check the validity of it 
// Thanks to Bradley miller (bradmiller@accesszone.com) for pointing 
// out the need for multiple recipient checking and providing the code. 
$recipient_in = split(',',$recipient); 
for ($i=0;$i<count($recipient_in);$i++) { 
   $recipient_to_test = trim($recipient_in[$i]); 
   if (!eregi("^[_\\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\\.)+[a-z]{2,3}$", $recipient_to_test)) { 
      print_error("<b>I NEED VALID RECIPIENT EMAIL ADDRESS ($recipient_to_test) TO CONTINUE</b>"); 
   } 
} 

// This is because I originally had it require but too many people 
// were used to Matt's Formmail.pl which used required instead. 
if ($required) 
   $require = $required; 
// handle the required fields 
if ($require) { 
   // separate at the commas 
   $require = ereg_replace( " +", "", $require); 
   $required = split(",",$require); 
   for ($i=0;$i<count($required);$i++) { 
      $string = trim($required[$i]); 
      // check if they exsist 
      if((!(${$string})) || (!(${$string}))) { 
         // if the missing_fields_redirect option is on: redirect them 
         if ($missing_fields_redirect) { 
            header ("Location: $missing_fields_redirect"); 
            exit; 
         } 
         $require; 
         $missing_field_list .= "<b>Missing: $required[$i]</b><br>\n"; 
      } 
   } 
   // send error to our mighty error function 
   if ($missing_field_list) 
      print_error($missing_field_list,"missing"); 
} 

// check the email fields for validity 
if (($email) || ($EMAIL)) { 
   $email = trim($email); 
   if ($EMAIL) 
      $email = trim($EMAIL); 
   if (!eregi("^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3}$", $email)) { 
      print_error("your <b>email address</b> seems to be invalid"); 
   } 
   $EMAIL = $email; 
} 

// check zipcodes for validity 
if (($ZIP_CODE) || ($zip_code)) { 
   $zip_code = trim($zip_code); 
   if ($ZIP_CODE) 
      $zip_code = trim($ZIP_CODE); 
   if (!ereg("(^[0-9]{5})-([0-9]{4}$)", trim($zip_code)) && (!ereg("^[a-zA-Z][0-9][a-zA-Z][[:space:]][0-9][a-zA-Z][0-9]$", trim($zip_code))) && (!ereg("(^[0-9]{5})", trim($zip_code)))) { 
      print_error("your <b>zip/postal code</b> is invalid"); 
   } 
} 

// check phone for validity 
if (($PHONE_NO) || ($phone_no)) { 
   $phone_no = trim($phone_no); 
   if ($PHONE_NO) 
      $phone_no = trim($PHONE_NO); 
/*
   if (!ereg("(^(.*)[0-9]{3})(.*)([0-9]{3})(.*)([0-9]{4}$)", $phone_no)) { 
      print_error("your <b>phone number</b> is invalid"); 
   } 
*/
} 

// check phone for validity 
if (($FAX_NO) || ($fax_no)) { 
   $fax_no = trim($fax_no); 
   if ($FAX_NO) 
      $fax_no = trim($FAX_NO); 
/*
   if (!ereg("(^(.*)[0-9]{3})(.*)([0-9]{3})(.*)([0-9]{4}$)", $fax_no)) { 
      print_error("your <b>fax number</b> is invalid"); 
   } 
*/
} 

// prepare the content 
$content = parse_form($_POST); 

// check for a file if there is a file upload it 
if ($file_name) { 
   if (!ereg("/$", $path_to_file)) 
      $path_to_file = $path_to_file."/"; 
   $location = $path_to_file.$file_name; 
   copy($file,$location); 
   unlink($file); 
   $content .= "Uploaded File: ".$path_to_file.$file_name."\n"; 
} 

// if the env_report option is on: get eviromental variables 
if ($env_report) { 
   $env_report = ereg_replace( " +", "", $env_report); 
   $env_reports = split(",",$env_report); 
   $content .= "------ environmental variables ------\n"; 
   for ($i=0;$i<count($env_reports);$i++) { 
      $string = trim($env_reports[$i]); 
      if ($env_reports[$i] == "REMOTE_HOST") 
         $content .= "REMOTE HOST: ".$REMOTE_HOST."\n"; 
      else if ($env_reports[$i] == "REMOTE_USER") 
         $content .= "REMOTE USER: ". $REMOTE_USER."\n"; 
      else if ($env_reports[$i] == "REMOTE_ADDR") 
         $content .= "REMOTE ADDR: ". $REMOTE_ADDR."\n"; 
      else if ($env_reports[$i] == "HTTP_USER_AGENT") 
         $content .= "BROWSER: ". $HTTP_USER_AGENT."\n"; 
   } 
} 
// if the subject option is not set: set the default 
if (!$subject) 
   $subject = "Form submission"; 

// send it off 
mail_it(stripslashes($content), stripslashes($subject), $email, $recipient); 




// if the redirect option is set: redirect them 
if ($redirect) { 
   header ("Location: $redirect"); 
   exit; 
} else { 
   print "Thank you for submitting this online form. We will be in touch with you within 12 hours (our business hours are Monday to Saturday, 9.30 - 4.30)\n"; 
   //print "<a href=\"javascript:history.go(-1)\"><br>Back</a>"; 
}  
?>