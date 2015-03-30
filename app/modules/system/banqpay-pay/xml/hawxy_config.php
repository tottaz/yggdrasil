<?php
  
// modify path according actual location of hawhaw.inc
if (!defined("HAW_VERSION"))
  require("../zetapay/core/mobile/hawhaw.inc");  // Could need some checking if this exists..	
// maximum size of remote XML file in byte
if (!defined("HAX_MAX_FILE_SIZE"))
  define("HAX_MAX_FILE_SIZE", 65536);

// treatment of <raw> element (disallow per default)
if (!defined("HAX_RAW_HTML_ALLOWED"))
  define("HAX_RAW_HTML_ALLOWED", false);
if (!defined("HAX_RAW_WML_ALLOWED"))
  define("HAX_RAW_WML_ALLOWED", false);
if (!defined("HAX_RAW_HDML_ALLOWED"))
  define("HAX_RAW_HDML_ALLOWED", false);
if (!defined("HAX_RAW_VXML_ALLOWED"))
  define("HAX_RAW_VXML_ALLOWED", false);


############################
#                          #
#     SIMULATOR SKIN       #
#                          #
############################

// HAWHAW skin is used per default
// direct $skin towards your personal CSS file for skin customization
// (take a look at the CSS file below to learn how to perform skinning)
if (!isset($skin))
  $skin = "http://www.banqpay.com/zetapay/core/css/skin.css";

// set to false if users are not allowed to modify skin
if (!isset($allow_skin_attribute))
  $allow_skin_attribute = true;

// error message can be displayed in special error skin
// if no skin is defined, error is displayed in standard HAWHAW output
if (!isset($error_skin))
  $error_skin = "";


############################
#                          #
#     BANNER PLACEMENT     #
#                          #
############################

if (!isset($banner))
  $banner = array();
// Here you can define banners which are displayed above the simulated device
// Feel free to link towards your own website.
// un-comment the next 5 lines and see what happens ...

//$banner[0]["url"]    = "http://www.hawhaw.de/";
//$banner[0]["img"]    = "http://www.hawhaw.de/hawhaw.gif";
//$banner[0]["alt"]    = "HAWHAW";
//$banner[0]["width"]  = 170;
//$banner[0]["height"] = 70;

//$banner[1]["url"]    = "http://www.hawhaw.de/";
//$banner[1]["img"]    = "http://www.hawhaw.de/hawhaw.gif";
//$banner[1]["alt"]    = "HAWHAW";
//$banner[1]["width"]  = 170;
//$banner[1]["height"] = 70;
// ... continue like this for more banners ...



############################
#                          #
#     LOGFILE HANDLING     #
#                          #
############################

// un-comment these variable definitions to enable logging
// logging requires write permission!
//$access_logfile = "access.log";
//$error_logfile = "error.log";



##############################
#                            #
#     BLACKLIST HANDLING     #
#                            #
##############################

// all webservers in the domains listed below are blocked from service
if (!isset($blacklist))
  $blacklist = array(
"www.foo.com",
"www.bar.com"
);



#####################################
#                                   #
#     IMAGE CONVERSION HANDLING     #
#                                   #
#####################################

// before enabling image conversion your webserver should be configured as follows:
// GD Support: enabled
// GD version: 1.6.2 or higher
// GIF Read Support: enabled
// PNG Support: enabled
// WBMP Support: enabled
if (!isset($img_conversion_enabled))
  $img_conversion_enabled = true; // set to false if requirements are not fulfilled

if (!isset($img_maxsize))
  $img_maxsize = 30000;           // maximum size of remote image file

#######    HAWXY CONFIGURATION PART (END)    ################################
?>