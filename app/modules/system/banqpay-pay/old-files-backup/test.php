<?php 
   
?>

<script type="text/javascript">correctCrumb('','','','');
                    var id = 'a0a0164000000ff706071f000000006';
                    var baseUrl='http://home.av.net/tts/store/NavioMobile/';
                    var storeUrl='http://home.av.net/tts/servlet/store/Store';
                    var country='';
                    var carrier='';
                    var manufacturer='';
                    var browse='';
                    var item='';
                    var carriers=new Array();
                    var buyer=new NavioBuyer();

                    carriers[0]=('Cingular (ATT) Wireless Bill');carriers[1]=('Cingular Wireless Bill');carriers[2]=('T-Mobile Wireless Bill');carriers[3]=('SprintPCS Wireless Bill');carriers[4]=('T-Mobile Wireless Bill');carriers[5]=('Verizon Wireless Bill');
                window.top.document.title=unescape('Fox%20Music');
            </script>
            
<script language="javascript">

var screens = 0;
var currentScreen = 1;
var currentTab = "pdDescription"; // Current product description tab

// Show current tab
function showProductTab(tabIndex)
{
    // Hide previous
    document.getElementById(currentTab).style.visibility = "hidden";

    // Select and show next
    switch (tabIndex)
    {
        case 1:
            currentTab = "pdDescription";
            rotateScreenshots(false);
            break;
        case 2:
            currentTab = "pdScreenshots";
            rotateScreenshots(true);
            break;
        case 3:
            currentTab = "pdLeaderboard";
            rotateScreenshots(false);
            break;
        case 4:
            currentTab = "pdInstruction";
            rotateScreenshots(false);
            break;
    }
    document.getElementById(currentTab).style.visibility = "visible"; }

var rotate = null;

function rotateScreenshots(start)
{
    if (start)
    {
        rotate = setInterval("nextGameScreen()", 5000);
    }
    else
    {
        clearInterval(rotate);
    }
}

</script>


<script>
/*******************************************************
FLASH DETECT 2.5
All code by Ryan Parman and mjac, unless otherwise noted.
(c) 1997-2004 Ryan Parman and mjac
http://www.skyzyx.com
*******************************************************/

// This script will test up to the following version.
flash_versions = 20;

// Initialize variables and arrays
var flash = new Object();
flash.installed=false;
flash.version='0.0';

// Dig through Netscape-compatible plug-ins first.
if (navigator.plugins && navigator.plugins.length) {
	for (x=0; x < navigator.plugins.length; x++) {
		if (navigator.plugins[x].name.indexOf('Shockwave Flash') != -1) {
			flash.version = navigator.plugins[x].description.split('Shockwave Flash ')[1];
			flash.installed = true;
			break;
		}
	}
}

// Then, dig through ActiveX-style plug-ins afterwords
else if (window.ActiveXObject) {
	for (x = 2; x <= flash_versions; x++) {
		try {
			oFlash = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + x + "');");
			if(oFlash) {
				flash.installed = true;
				flash.version = x + '.0';
			}
		}
		catch(e) {}
	}
}

// Create sniffing variables in the following style: flash.ver[x]
// Modified by mjac
flash.ver = Array();
for(i = 4; i <= flash_versions; i++) {
	eval("flash.ver[" + i + "] = (flash.installed && parseInt(flash.version) >= " + i + ") ? true : false;");
}

var cw = new CookieWriter();
var ttl = false;
//new Date();
//ttl.setTime(ttl.getTime() + 24 * 60 * 60 * 1000); 

/*
   name - name of the cookie
   value - value of the cookie
   [expires] - expiration date of the cookie
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/

function setCookie(name, value, expires, path, domain, secure) {
  path = "/tts/store/";
  domain = window.location.host;
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

/*
   name - name of the cookie
   [path] - path of the cookie (must be same as path used to create cookie)
   [domain] - domain of the cookie (must be same as domain used to
     create cookie)
   path and domain default if assigned null or omitted if no explicit
     argument proceeds
*/

function deleteCookie(name, path, domain) {
	path = "/tts/store/";
	domain = window.location.host;

	if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

// date - any instance of the Date object
// * hand all instances of the Date object to this function for "repairs"

function fixDate(date) {
  var base = new Date(0);
  var skew = base.getTime();
  if (skew > 0)
    date.setTime(date.getTime() - skew);
}

function CookieWriter()
	{
	this.getCookie = getCookie;
	this.setCookie = setCookie;
	}

	<script language="JavaScript" src="js/flash.js"></script>
	<script language="JavaScript" src="js/index.js"></script>
	<script language="JavaScript">
	    // Create global variables.
		
        var GsmNumber;
        var model;
        var company;
        var manufacturer;
        var browse;
        var pid;
        var devices;
	    var accountless = false; // accountless checkout set from homepage for items details pages.
	    var productIndex;

		if (!flash.ver[7])
		{
			document.write ('<center class="formlabel">This site requires Macromedia Flash Player 7<br/><br/>');
			document.write ('<input type="button" value="Install Flash Player Now" onclick="installFlash();"/></center>');
		} else
		{
			var model=null;
			model = model == null?getCookie("model"):model;
			deleteCookie("model");
			if (model != null) setCookie("model", model, ttl);
						
			var company=null;
			company = company == null?getCookie("company"):company;
			deleteCookie("company");
			if (company != null) setCookie("company", company, ttl);
			
			var manufacturer=null;
			manufacturer = manufacturer == null?getCookie("manufacturer"):manufacturer;
			deleteCookie("manufacturer");
			if (manufacturer != null) setCookie("manufacturer", manufacturer, ttl);
			
			var browse=null;
			browse = browse == null?getCookie("browse"):browse;
			browse = browse == null?"for my phone only":browse;
			deleteCookie("browse");
			setCookie("browse", browse, ttl);
			
			var pid=null;
			pid = pid == null?getCookie("pid"):pid;
			if(model==null || company == null || manufacturer == null) pid = null;
			if (pid != null && pid != "null") setCookie("pid", pid, ttl);
			else
				{
				deleteCookie("pid");
				deleteCookie("model");
				deleteCookie("company");
				deleteCookie("manufacturer");
				setCookie("browse", "for my phone only", ttl);
				}
			
			var devices=new Array();	
			
			var devicesCookie = getCookie("devices");
			if (devicesCookie != null) devices = devicesCookie.split(',');
		
			
			var s1=new Array ('','','','','','');
			var s2=new Array ('','','','','','');
			var s3=new Array ('','','','','','');
			var s4=new Array ('','','','','','');
			var s5=new Array ('','','','','','');
			var stack=new Array('home');
			var stackPointer=0;
			var next=false;

			document.write ('<frameset rows="*" border="0">\n');
			document.write ('	<frame id="store" title="topnav" name="store" frameborder="0" marginwidth="0" marginheight="0" noresize="" scrolling="no" src="http://home.av.net/tts/store/main.jsp?theme=Disney&id=7f0000010000010a703616f100000007&">');
			document.write ('	</frame>\n');
			document.write ('</frameset>\n');
		}

		function installFlash ()
		{
			window.location="http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash";
		}
	</script>     
    

<script>
    
var flag = false;
var imgBaseUrl = "http://home.av.net/tts/store/NavioMobile/";

function imageLoad() {  // called with onLoad()
    if (document.images) {
        img5on = new Image(); img5on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img6on = new Image(); img6on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img7on = new Image(); img7on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img8on = new Image(); img8on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img9on = new Image(); img9on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img10on = new Image(); img10on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img12on = new Image(); img12on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img13on = new Image(); img13on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img14on = new Image(); img14on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img15on = new Image(); img15on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img16on = new Image(); img16on.src = imgBaseUrl + "img/btn_sound_roll.gif";
		img17on = new Image(); img17on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img18on = new Image(); img18on.src = imgBaseUrl + "img/btn_sound_roll.gif";
		img19on = new Image(); img19on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img20on = new Image(); img20on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        img21on = new Image(); img21on.src = imgBaseUrl + "img/btn_sound_roll.gif";
        return (flag = true);  // set the flag and let the function know know it can work
    }
}

if (document.images) {   // load the off images 
	img5off = new Image(); img5off.src = imgBaseUrl + "img/btn_sound.gif";
	img6off = new Image(); img6off.src = imgBaseUrl + "img/btn_sound.gif";
	img7off = new Image(); img7off.src = imgBaseUrl + "img/btn_sound.gif";
	img8off = new Image(); img8off.src = imgBaseUrl + "img/btn_sound.gif";
	img9off = new Image(); img9off.src = imgBaseUrl + "img/btn_sound.gif";
	img10off = new Image(); img10off.src = imgBaseUrl + "img/btn_sound.gif";
	img12off = new Image(); img12off.src = imgBaseUrl + "img/btn_sound.gif";
	img13off = new Image(); img13off.src = imgBaseUrl + "img/btn_sound.gif";
	img14off = new Image(); img14off.src = imgBaseUrl + "img/btn_sound.gif";
	img15off = new Image(); img15off.src = imgBaseUrl + "img/btn_sound.gif";
	img16off = new Image(); img16off.src = imgBaseUrl + "img/btn_sound.gif";
	img17off = new Image(); img17off.src = imgBaseUrl + "img/btn_sound.gif";
	img18off = new Image(); img18off.src = imgBaseUrl + "img/btn_sound.gif";
	img19off = new Image(); img19off.src = imgBaseUrl + "img/btn_sound.gif";
	img20off = new Image(); img20off.src = imgBaseUrl + "img/btn_sound.gif";
	img21off = new Image(); img21off.src = imgBaseUrl + "img/btn_sound.gif";
}


function rollIn(imgName) {
    if (document.images && (flag == true)) {
        document[imgName].src = eval(imgName + "on.src");
    }
}

function rollOut(imgName) {  // the normal onMouseOut function
    if (document.images){
        document[imgName].src = eval(imgName + "off.src");
    }
}

function changeInputBG(obj,value){ 
  obj.style.background=value;
}

function inputRollIn(obj,value){ 
  obj.src=value;
}

function inputRollOut(obj,value){ 
  obj.src=value;
}                   
 
</script>                                     

<script>
var cw = new CookieWriter();
var ttl = false;
//new Date();
//ttl.setTime(ttl.getTime() + 24 * 60 * 60 * 1000); 

/*
   name - name of the cookie
   value - value of the cookie
   [expires] - expiration date of the cookie
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/

function setCookie(name, value, expires, path, domain, secure) {
	path = "/";
	domain = window.location.host;
  	var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
	  document.cookie = curCookie;
}


/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != (0))
	  {
		return null;
	  }
  } else
	{
    begin += 2;
	}
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
	{
    end = dc.length;
	}
  return unescape(dc.substring(begin + prefix.length, end));
}

/*
   name - name of the cookie
   [path] - path of the cookie (must be same as path used to create cookie)
   [domain] - domain of the cookie (must be same as domain used to
     create cookie)
   path and domain default if assigned null or omitted if no explicit
     argument proceeds
*/

function deleteCookie(name, path, domain) {
  path = "/";
  domain = window.location.host;
  if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

// date - any instance of the Date object
// * hand all instances of the Date object to this function for "repairs"

function fixDate(date) {
  var base = new Date(0);
  var skew = base.getTime();
  if (skew > 0)
	{
    date.setTime(date.getTime() - skew);
	}
}

function CookieWriter()
	{
	this.getCookie = getCookie;
	this.setCookie = setCookie;
	}
</script>

<script>
WiredMinds = function(sname, pagename, group, campaign, milestone, sales, basket)
{
	var _sname = sname;	//WiredMinds variables
	var _pagename = pagename;
	var _group = group;
	var _campaign = campaign;
	var _milestone = milestone;
	var _sales = sales;
	var _basket = basket;
	var resolution="";
	var color_depth="";
	var plugin_list="";
	var jv=0;
	var ref=document.referrer;
	if(typeof(top.document)=="object") ref=top.document.referrer;
	resolution=screen.width+"x"+screen.height;
	color_depth=navigator.appName!='Netscape'? screen.colorDepth : screen.pixelDepth;
	for (var i=0; i<navigator.plugins.length; i++)
	{
		plugin_list += navigator.plugins[i].name + ';';
	}
	if (navigator.javaEnabled())
	{
		jv=1;
	}
	
	//this function takes an url string as a parameter. The string should be like: "&parameter=value"
	//it also takes parameters in pairs: (parameter1, value1, parameter2, value2)
	this.send1 = function()
	{
		var url = '<div style="display:none"><a target="_blank" href="http://www.wiredminds.com"><img src="http://ctsus01.wiredminds.com/click_track/ctin.php?'+
			'custnum=3&js=1&jv=' + jv + '&resolution=' + resolution + '&color_depth=' + color_depth + '&plugins=' + escape(plugin_list) + '&referrer=' + escape(ref);
		if (_sname)
		{
			url += '&sname=' + sname;
		}
		if (_pagename)
		{
			url += '&pagename=' + pagename;
		}
		if (_group)
		{
			url += '&group=' + group;
		}
		if (arguments.length == 1)
		{
			url += arguments[0];
		}
		else
		{
			var params = arguments.length - arguments.length % 2;
			for (var i = 0; i < params; ++i)
			{
				url += '&' + arguments[i] + '=' + arguments[++i];
			}
		}
		url += '"></a></div>';

		var wiredminds_div = false;
		if (!document.getElementById('_wiredminds'))
		{
			var wiredminds_div = document.createElement('div');
			wiredminds_div.setAttribute('id', '_wiredminds');
			wiredminds_div.setAttribute('style', 'display:none');
			document.body.appendChild(wiredminds_div);
		}
		else
		{
			wiredminds_div = document.getElementById('_wiredminds');
		}
		wiredminds_div.innerHTML = url;
	};

	//this function takes as parameters only campaign, milestone, sales and basket
	this.send = function(campaign, milestone, sales, basket)
	{
		_campaign = campaign ? campaign : _campaign;
		_milestone = milestone ? milestone : _milestone;
		_sales = sales ? sales : _sales;
		_basket = basket ? basket : _basket;

		var comma = false;
		str = 'this.send1(';
		if (_campaign)
		{
			if (comma)
			{
				str += ',';
			}
			str += ('"campaign","' + _campaign + '"');
			comma = true;
		}
		if (_milestone)
		{
			if (comma)
			{
				str += ',';
			}
			str += ('"milestone","' + _milestone + '"');
			comma = true;
		}
		if (_sales)
		{
			if (comma)
			{
				str += ',';
			}
			str += ('"sales","' + _sales + '"');
			comma = true;
		}
		if (_basket)
		{
			if (comma)
			{
				str += ',';
			}
			str += ('"basket","' + _basket + '"');
			comma = true;
		}
		str += ')';
		eval(str);
	};
};
</script>

<script>
///////////////////////////////////////////////////////////////////////////////
// store.js
//
// Store functions on all pages.
//
//
///////////////////////////////////////////////////////////////////////////////


var displayCB = true; // Show one carrier billing icon.
var player = false;

//timer
var secs = 0;
var timerID = null;
var timerRunning = false;
var delay = 1000;

///////////////////////////////////////////////////////////////////////////////


function Callback_Survey(params, phonenumber)
{
    if (phonenumber == "" || phonenumber == null)
    {
        alert("You must enter a phone number to redeem this offer");
    }
    else if ((phonenumber = ParseUSNumber(phonenumber)) != 0)
    {
        FORM_DATA = createRequestObject(params);
        docId = FORM_DATA["docId"] + "&GsmNumber=" + phonenumber;
        surveySrc = FORM_DATA["surveySrc"];
        data = FORM_DATA["data"];
        window.top.Navio.Survey(docId, surveySrc, data);
    }
}


function checkNoPhone()
{
    // Need to check all phone information.
    if (!window.top.pid || !window.top.model || !window.top.company || !window.top.manufacturer || window.top.pid == "" || window.top.model == "" || window.top.company == "" || window.top.manufacturer == "" || window.top.pid == "null" || window.top.model == "null" || window.top.company == "null" || window.top.manufacturer == "null")
    {
        document.write('<div style="display:block">');
    }
    else
    {
        document.write('<div style="display:none">');
    }
}


function checkPhone()
{
    // Need to check all phone information.
    if (!window.top.pid || !window.top.model || !window.top.company || !window.top.manufacturer || window.top.pid == "" || window.top.model == "" || window.top.company == "" || window.top.manufacturer == "" || window.top.pid == "null" || window.top.model == "null" || window.top.company == "null" || window.top.manufacturer == "null")
    {
        document.write('<div style="display:none">');
    }
    else
    {
        document.write('<div style="display:block">');
    }
}


function checkCrumb()
{
    if (window.top.s1[0] != "")
    {
        document.write('<div style="display:block">');
    }
    else
    {
        document.write('<div style="display:none">');
    }
}


function correctCrumb(pid, ptype, pnum, param)
{
    if (!window.top.next)
    {
        if (pid == "" || typeof pid == "undefined" || pid == null)
        {
            if (typeof window.top.stack[window.top.stackPointer - 1] == "string")
            {
                window.top.stackPointer--;
            }
            else if (typeof window.top.stack[window.top.stackPointer + 1] == "string")
            {
                window.top.stackPointer++;
            }
            window.top.s1 = new Array("","","","","","");
            window.top.s2 = new Array("","","","","","");
            window.top.s3 = new Array("","","","","","");
            window.top.s4 = new Array("","","","","","");
            window.top.s5 = new Array("","","","","","");
        }
        else
        {
            if (typeof window.top.stack[window.top.stackPointer - 1] == "object" && window.top.stackPointer > 0 && findLastPid(pid, ptype, pnum, param, window.top.stack[window.top.stackPointer - 1]))
            {
                window.top.stackPointer--;
                var arrTemp=  window.top.stack[window.top.stackPointer];
                setS(arrTemp);
            }
            else
            {
                if (typeof window.top.stack[window.top.stackPointer + 1] == "object" && findLastPid(pid, ptype, pnum, param, window.top.stack[window.top.stackPointer + 1]))
                {
                    window.top.stackPointer++;
                    var arrTemp = window.top.stack[window.top.stackPointer];
                    setS(arrTemp);
                }
            }
        }
    }
    window.top.next=false;
}


function createRequestObject(query)
{
    FORM_DATA = new Object(); // The Object ("Array") where our data will be stored.
    separator = ","; // I substitued & with ; to allow & to be passed without parsing  - Nathan
    query_sep = ";"; // The token used to separate data from multi-select inputs
    qu = query;

    /* Get the current URL so we can parse out the data. Adding a null-string ""
     * forces an implicit type cast from property to string, for NS2 compatibility.
     */
    if (query.length < 1)
    {
        return false; // Perhaps we got some bad data?
    }
    keypairs = new Object();
    numKP = 1;

    /* Local vars used to store and keep track of name/value pairs as we parse them
     * back into a usable form. I substitued & with ; to allow & to be passed without
     * parsing  - Nathan
     */
    while (query.indexOf(query_sep) > -1)
    {
        /* Split the query string at each '&', storing the left-hand side
         * of the split in a new keypairs[] holder, and chopping the query
         * so that it gets the value of the right-hand string.
         */
        keypairs[numKP] = query.substring(0,query.indexOf(query_sep));
        query = query.substring((query.indexOf(query_sep)) + 1);
        numKP++;
    }

    keypairs[numKP] = query; // Store what's left in the query string as the final keypairs[] data.

    for (i in keypairs)
    {
        keyName = keypairs[i].substring(0,keypairs[i].indexOf('=')); // Left of '=' is name.
        keyValue = keypairs[i].substring((keypairs[i].indexOf('=')) + 1); // Right of '=' is value.
        while (keyValue.indexOf('+') > -1)
        {
            // Replace each '+' in data string with a space.
            keyValue = keyValue.substring(0,keyValue.indexOf('+')) + ' ' + keyValue.substring(keyValue.indexOf('+') + 1);
        }

        // Unescape non-alphanumerics
        keyValue = unescape(keyValue);

        if (FORM_DATA[keyName])
        {
            /* Object already exists, it is probably a multi-select input,
             * and we need to generate a separator-delimited string
             * by appending to what we already have stored.
             */
            FORM_DATA[keyName] = FORM_DATA[keyName] + separator + keyValue;
        }
        else
        {
            FORM_DATA[keyName] = keyValue; // Normal case: name gets value.
        }
    }
    return FORM_DATA;
}


function findLastPid(pid, ptype, pnum, param, arrayCurrent)
{
    for (var i = 4; i >= 0; i--)
    {
        arrayTemp=arrayCurrent[i];
        if (!(arrayTemp[0] == ""))
        {
            if (arrayTemp[0] == pid && arrayTemp[1] == ptype && arrayTemp[2] == pnum && arrayTemp[3] == param)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
    return false;
}


function getDescription(action, name)
{
	switch(action.toLowerCase())
	{
    	case "preview": return("Experience a short clip or description of this item");
    	case "share": return("Provide friends an opportunity to preview or buy this item");
    	case "get": return("Download or view this item");
    	case "redeliver": return("Get the item again from your digital Active Vault");
    	case "trade": return("Offer this item for bid to others");
    	case "contact us": return("Get your customer service issues resolved by email");
    	case "get help": return("Detailed help");
    	case "terms of use": return("Detailed description of how this item may be used");
    	case "history": return("Get a listing of activity against your loyalty point balance");
    	case "redeem": return("Convert your loyalty points into rights for another good or service");
    	default: return(name);
	}
}


function getMfngNetCN(company)
{
    if (company != null)
    {
        var companyName = company.toLowerCase().replace(/\-/gi, "");

        switch(companyName)
        {
        case 'att': return "123063";
        case 'cingular': return "15";
        case 'sprint': return "123108";
        case 'tmobile': return "123078";
        default: return "";
        }
    }
    else
    {
        return "";
    }
}


function getNextHomePage() 
{
	setCrumb(10);
	window.top.stackPointer++;
	window.top.stack[window.top.stackPointer] = "home";
	window.top.next = false;

    // Set all information into cookies.
    var expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    setCookie("company", window.top.company, expires, "/", window.location.host, false);
    setCookie("manufacturer", window.top.manufacturer, expires, "/", window.location.host, false);
    setCookie("model", window.top.model, expires, "/", window.location.host, false);
    if (window.top.GsmNumber)
    {
		setCookie("GsmNumber", window.top.GsmNumber, expires, "/", window.location.host, false);
    }
    else
    {
		setCookie("GsmNumber", "", expires, "/", window.location.host, false);
    }
    setCookie("devices", window.top.devices, expires, "/", window.location.host, false);
    setCookie("pid", window.top.pid, expires, "/", window.location.host, false);
}


function getNextPage(pid, ptype, pnum, param, name, s)
{
	if (ptype == 'file')
	{
		showHTMLFile(name, param);
	}
	else
	{
		setCrumb(s, pid, ptype, pnum, param, name);
		window.top.stackPointer++;
		window.top.stack[window.top.stackPointer]= new Array(Array(window.top.s1[0],window.top.s1[1],window.top.s1[2],window.top.s1[3],window.top.s1[4]),
									Array(window.top.s2[0],window.top.s2[1],window.top.s2[2],window.top.s2[3],window.top.s2[4]),
									Array(window.top.s3[0],window.top.s3[1],window.top.s3[2],window.top.s3[3],window.top.s3[4]),
									Array(window.top.s4[0],window.top.s4[1],window.top.s4[2],window.top.s4[3],window.top.s4[4]),
									Array(window.top.s5[0],window.top.s5[1],window.top.s5[2],window.top.s5[3],window.top.s5[4]));
		bug = "bug " + window.top.stack;
		window.top.next=true;
		window.document.nextPage.pid.value = pid;
		window.document.nextPage.ptype.value = ptype;
		window.document.nextPage.pnum.value = pnum;
		window.document.nextPage.param.value = param;
		window.document.nextPage.submit();
	}
}


function getPageName()
{
    var pageName = "Home";
    if(window.top.s5[0] != "")
    {
        pageName = window.top.s5[4];
    }
    else if(window.top.s4[0] != "")
    {
        pageName = window.top.s4[4];
    }
    else if(window.top.s3[0] != "")
    {
        pageName = window.top.s3[4];
    }
    else if(window.top.s2[0] != "")
    {
        pageName = window.top.s2[4];
    }
    else if(window.top.s1[0] != "")
    {
        pageName = window.top.s1[4];
    }
    return pageName;
}


function getPhone(c, m, b)
{
	if (c != null && m != null && c != "" && m != "")
		{
		window.carrier = c;
		window.manufacturer = m;
		if (b)
		{
		    window.browse = "Everything";
		}
		else
		{
		    window.browse = "for my phone only";
		}
		window.open("/tts/servlet/store/Store?storeTransform=pop_select_phone.xslt&id=" + window.document.nextPage.id.value + "&ptype=phone&param=" + c +
			"&pnum=" + m, "window2", "width=800,height=600,status=no,menubar=no,location=no,toolbar=no,scrollbars=yes");
		}
}


function getPhoneModel(c, m, b, repeatBuy)
{ 
    if (!repeatBuy)
    {
        buyer.qty = 0;
    }
    if (c == null || m == null)
    {	
		//check if all the functions of the new phone selector are present
		if (typeof buildDeviceList == "function" && typeof alignPhoneModule == "function" && typeof togglePhoneSelector == "function" && typeof checkSavedPhoneData == "function")
		{
		//new phone selectore call
			buildDeviceList();
			alignPhoneModule();
			togglePhoneSelector('open');
			checkSavedPhoneData();
		}
		else 
		{
		//old phone selector call
		window.open("/tts/store/NavioMobile/pop.html", "window1", "width=600,height=320,status=no,menubar=no,location=no,toolbar=no,scrollbars=no");
		}
	}
    else
    {	
        getPhone(c, m, b);
    }
}


function hide(id)
{
    window.document.getElementById(id).style.display = "none";
}

function show(id)
{
    window.document.getElementById(id).style.display = "block";
}

function load(pid, model, devices, icon) 
{
	if (pid != null && model != null && window.manufacturer != null && window.carrier != null)
	{
		var path = "/tts/store/";
		window.top.company = window.carrier;
		window.top.cw.setCookie("company", window.carrier, window.top.ttl, path);
		window.top.manufacturer = window.manufacturer;
		window.top.cw.setCookie("manufacturer", window.manufacturer, window.top.ttl, path);
		window.top.browse = window.browse;
		window.top.cw.setCookie("browse", window.browse,  window.top.ttl, path);
		window.top.pid = pid;
		window.top.cw.setCookie("pid", pid, window.top.ttl, path);
		window.top.model = model;
		window.top.cw.setCookie("model", model, window.top.ttl, path);
		window.top.devices = new Array();
		window.top.devices[0] = icon;
		for (var i = 0; i < devices.length; i++)
		{
			window.top.devices[i+1]=devices[i];
		}
		window.top.cw.setCookie("devices", window.top.devices, window.top.ttl, path);

        // Set all information into cookies.
        var expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
        setCookie("company", window.top.company, expires, "/", window.location.host, false);
        setCookie("manufacturer", window.top.manufacturer, expires, "/", window.location.host, false);
        setCookie("model", window.top.model, expires, "/", window.location.host, false);
        if (window.top.GsmNumber)
        {
			setCookie("GsmNumber", window.top.GsmNumber, expires, "/", window.location.host, false);
        }
        else
        {
			setCookie("GsmNumber", "", expires, "/", window.location.host, false);
        }
        setCookie("devices", window.top.devices, expires, "/", window.location.host, false);
        setCookie("pid", window.top.pid, expires, "/", window.location.host, false);

		buyer.repeat();
		// On IE, prevents page from dissappearing on a reload.
		var ieTimer = setTimeout("window.location.reload()", 5);
	}
}


function navioBuy(device, docId, qty, data, contentType, contentName, warning, warningText)
{
	this.device = device;
	this.docId = docId;
	this.qty = qty;
	this.data = data;
	this.contentType = contentType;
	this.contentName = contentName;
	this.warning = (warning == "false")?false:true;
	this.warningText = warningText;
	this._buy();
	if (typeof wm == "object") wm.send(false, "Buy");

}


function NavioBuyer()
	{
	this.device = "";
	this.docId = "";
	this.qty = 0;
	this.data = "";
	this.contentType = "";
	this.contentName = "";
	this.buy = navioBuy;
	this.repeat = repeatBuy;
	this.warning = true;
	this.warningText = "";
	this.surveySrc = "";
	this.survey = navioSurvey;

	this._buy = function __buy(late)
	{
	    // Do only if not redeeming points.
        if (window.document.nextPage.ptype.value != "reward")
        {
            /** Proceed only if  phone number was entered (next number after = should be a number) if we are in the context of
             *  an accountless purchase or a survey. Otherwise ignore.
             */
            var checkRequired = ((this.data.indexOf("accountless=true") != -1) || (this.data.indexOf("survey=") != -1) || (window.top.accountless == true))?true:false;

            // No number entered
            if (checkRequired && (!window.top.GsmNumber || (window.top.GsmNumber == "") || (window.top.GsmNumber == "undefined")))
            {
                // In accountless purchase or a survey context and no phone number!
                if ((window.top.store.tmp.homepage != undefined) || (window.top.store.tmp.homepage != null))
                {
                    // From the homepage.
                    alert("Please enter your phone number!");
                }
                else
                {
                    // From item details page.
                    popup(baseUrl + "gsmNumber.html", 375, 200);
                }
                return true;
            }

            // We are in accountless but hasn't been passed in, so add it in.
            if (window.top.accountless && (this.data.indexOf("accountless=") == -1))
            {
               this.data += "&accountless=true";
            }

            // Item details page doesn't have it, add it and continue.
            if (checkRequired && (this.data.indexOf("GsmNumber=") == -1))
            {
                this.data += "&GsmNumber=" + window.top.GsmNumber;
            }
        }

        if (((window.top.pid == null) || (window.top.model == null)) && ((this.contentType.indexOf("Ringtone") != -1) || (this.contentType.indexOf("Mobile") != -1)))
        {
            getPhoneModel(null, null, null, true);
        }
        else 
        {
            if (phoneFilteringDetail(this.device, this.contentType))
            {
				whichFunction = typeof window.top.Navio.LaterBuy == "function" && late ? "LaterBuy" : "Buy";
				if (this.warning)
				{
					eval("window.top.Navio." + whichFunction + " (this.docId, this.qty, this.data, this.contentType, this.warningText)");
                }
                else
                {
					eval("window.top.Navio." + whichFunction + " (this.docId, this.qty, this.data)");
                }
                this.qty = 0;
            }
            else
            {
                popAlert(baseUrl, "United States", window.top.company, window.top.manufacturer, window.top.model, window.top.browse, this.contentName);
            }
        }
	};

	this._survey = function __survey()
	{
		if ((window.top.pid == "") && ((this.contentType.indexOf("Ringtone") != -1)||(this.contentType.indexOf("Mobile") != -1)))
		{
			alert("Please select a phone model on the left first then click on the free offer!");
		}
		else 
		{
			if (phoneFilteringDetail(this.device, window.top.devices, window.top.browse, this.contentType))
			{
					callback_params = "docId=" + this.docId + ";surveySrc=" + this.surveySrc + ";data=" + this.data;
					prompt2("Please enter your phone number (xxx)-xxx-xxxx", "","Callback_Survey", callback_params);
			}
			else 
			{
			    popAlert(baseUrl, "United States", window.top.company, window.top.manufacturer, window.top.model, window.top.browse, this.contentName);
			}
		}
	};
}


function navioSurvey(device, docId, surveySrc, data, contentType, contentName)
{
	this.device=device;
	this.docId=docId;
	this.surveySrc=surveySrc;
	this.data=data;
	this.contentType=contentType;
	this.contentName=contentName;
	this._survey();
}


function ParseUSNumber(PhoneNumberInitialString)
{
    var FmtStr = "";
    var index = 0;
    var LimitCheck;
    LimitCheck = PhoneNumberInitialString.length;
    while (index != LimitCheck)
    {
        if (isNaN(parseInt(PhoneNumberInitialString.charAt(index))))
        {
        }
        else
        {
            FmtStr = FmtStr + PhoneNumberInitialString.charAt(index);
        }
        index = index + 1;
    }
    if (FmtStr.length == 10)
    {
        FmtStr = "1" + FmtStr;
    }
    else
    {
        FmtStr=0; //PhoneNumberInitialString;
        alert("United States phone numbers must have exactly ten digits.");
    }
    return FmtStr;
}


function phoneFiltering(titleDevices, content)
{
	if (window.top.browse == "Everything")
	{
		return true;
	}
	else
	{
		return  phoneFilteringDetail(titleDevices, content);
	}
}


function phoneFilteringDetail(titleDevices, content)
{
    if (window.top.devices.length <= 0)
    {
        // On first load and before a first phone selection, leave all items selectable.
        return true;
    }

	if ((content.indexOf("Ringtone") == -1) && (content.indexOf("Mobile") == -1))
	{
		return true;
	}

    // Do we have device to test.	
	if (window.top.devices.length > 0)
	{
        // If has multiple device arrays (bundle), test each one
        if (titleDevices.indexOf("|") != -1)
        {
            var bundleDevices = titleDevices.split("|");

            // Go through each bundle product.
            for (i = 0; i < bundleDevices.length; i++)
            {
                var match = false;
        		var tmpArray = bundleDevices[i].split(",");

                if (tmpArray[tmpArray.length - 1] == "") dump = tmpArray.pop();
                for (j = 0; j < tmpArray.length; j++)
                {
        			for (var k = 0; k < window.top.devices.length; k++)
        			{
        				if (tmpArray[j] == window.top.devices[k])
        				{
        					match = true;
        				}
        			}
                }
                if (!match) return false;
            }
            // Else all bundle product matches.
            return true;
        }
        else
        {
    		var start = 0;
    		var index = titleDevices.indexOf(",");
    		while (index != -1)
    		{
    			for (var i = 0; i < window.top.devices.length; i++)
    			{
    				if (titleDevices.substring(start, index) == window.top.devices[i])
    				{
    					return true;
    				}
    			}
    			start = index + 1;
    			index = titleDevices.indexOf(",", start);
    		}
        }
	}
	return false;
}


function popAlert(base, country, carrier, manufacturer, model, browse, item)
{
	this.country = country;
	this.carrier = carrier;
	this.manufacturer = manufacturer;
	this.model = model;
	this.browse = browse;
	this.item = item;
	if (typeof buildDeviceList != "function") popalert=window.open(base + "pop_alert.htm", "popalert", "width=800,height=420,status=no,menubar=no,location=no,toolbar=no");
}


function popup(url, width, height)
{
    if (width == null)
    {
        width = 614;
    }
    if (height == null)
    {
        height = 850;
    }
    winStats = "toolbar=no,location=no,directories=no,menubar=no,resizable=yes";
    winStats += "scrollbars=no";
    if (navigator.appName.indexOf("Microsoft") >= 0)
    {
        winStats += ",left=250,top=200,width=" + width + ",height=" + height;
    }
    else
    {
        winStats += ",screenX=250,screenY=200,width=" + width + ",height=" + height;
    }
    remote = window.open(url, "_blank", winStats);
    remote.focus();
}


function printCompany(company)
{
	switch(company)
	{
    	case "att":
        	window.document.write("AT&amp;T");
        	break;
    	case "cingular":
        	window.document.write("Cingular");
        	break;
    	case "sprint":
        	window.document.write("Sprint PCS");
        	break;
    	case "tmobile":
        	window.document.write("T-Mobile");
        	break;
    	default:
        	break;
	}						
}


function prompt2(prompttitle, message, sendto, sendto_param)
{
	promptpicture = "";
	promptbox = document.createElement("div");
	promptbox.setAttribute ("'id" , "prompt");
	document.getElementsByTagName("body")[0].appendChild(promptbox);
	promptbox = eval("document.getElementById('prompt').style");
	promptbox.position = "absolute";
	promptbox.top = 100;
	promptbox.left = 200;
	promptbox.width = 300;
	promptbox.border = "outset 1 #bbbbbb";

	document.getElementById("prompt").innerHTML = "<table cellspacing='0' cellpadding='0' border='0' width='100%'><tr valign='center'><td width='22' height='22' style='text-indent:2;' class='prompttitlebar'></td><td class='prompttitlebar'>" + prompttitle + "</td></tr></table>";
	document.getElementById("prompt").innerHTML = document.getElementById('prompt').innerHTML + '<table cellspacing="0" cellpadding="0" border="0" width="100%" class="promptbox"><tr><td>' + message + '</td></tr><tr><td><input type="text" id="promptbox" onblur="this.focus()" class="promptbox"/></td></tr><tr><td align="right"><br/><input type="button" class="prompt" value="OK" onMouseOver="this.style.border=\'1 outset #dddddd\'" onMouseOut="this.style.border=\'1 solid transparent\'" onClick="'+ sendto + '(\'' + sendto_param + '\',document.getElementById(\'promptbox\').value); document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'prompt\'))"/> <input type="button" class="prompt" value="Cancel" onMouseOver="this.style.border=\'1 outset transparent\'" onMouseOut="this.style.border=\'1 solid transparent\'" onClick="' + sendto + '(); document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'prompt\'))"/></td></tr></table>';
	document.getElementById('promptbox').focus();
}


function repeatBuy()
{
    if (this.qty > 0 && this.data.indexOf("storeId") != -1)
    {
        var storeId = this.data.substr(this.data.indexOf("storeId="));
        this.data = "PID=" + window.top.pid + "&NetCN=" + getMfngNetCN(window.top.company) + "&manufacturer=" + getCookie("manufacturer") + "&GsmNumber=" + getCookie("GsmNumber") + "&" + storeId;
        this._buy(true);
    }
    this.qty = 0;
}


function search(myfield)
{
    if (trim(myfield) != "")
    {
        getNextPage("1", "search", 1, xEscapeStore(myfield), "Search Results", 1);
    }
}


function setCrumb(s, pid, ptype, pnum, param, name)
{
	if(s != 0)
	{
		if (s==5 || (window.top.s4[0] != "" && (typeof s == 'undefined' || s == null)))
		{
			window.top.s5[0] = pid;
			window.top.s5[1] = ptype;
			window.top.s5[2] = pnum;
			window.top.s5[3] = param;
			window.top.s5[4] = name;
		}
		else
		{
			window.top.s5[0] = "";
			window.top.s5[1] = "";
			window.top.s5[2] = "";
			window.top.s5[3] = "";
			window.top.s5[4] = "";
			if (s == 4 || (window.top.s3[0] != "" && (typeof s == 'undefined' || s == null)))
			{
				window.top.s4[0] = pid;
				window.top.s4[1] = ptype;
				window.top.s4[2] = pnum;
				window.top.s4[3] = param;
				window.top.s4[4] = name;
			}
			else
			{
				window.top.s4[0] = "";
				window.top.s4[1] = "";
				window.top.s4[2] = "";
				window.top.s4[3] = "";
				window.top.s4[4] = "";
				if (s == 3 || (window.top.s2[0] != "" && (typeof s == 'undefined' || s == null)))
				{
					window.top.s3[0] = pid;
					window.top.s3[1] = ptype;
					window.top.s3[2] = pnum;
					window.top.s3[3] = param;
					window.top.s3[4] = name;
				}
				else
				{
					window.top.s3[0] = "";
					window.top.s3[1] = "";
					window.top.s3[2] = "";
					window.top.s3[3] = "";
					window.top.s3[4] = "";
					if (s == 2 || (window.top.s1[0] != "" && (typeof s == 'undefined' || s == null)))
					{
						window.top.s2[0] = pid;
						window.top.s2[1] = ptype;
						window.top.s2[2] = pnum;
						window.top.s2[3] = param;
						window.top.s2[4] = name;
					}
					else
					{
						window.top.s2[0] = "";
						window.top.s2[1] = "";
						window.top.s2[2] = "";
						window.top.s2[3] = "";
						window.top.s2[4] = "";
						if (s == 1 || typeof s == 'undefined' || s == null)
						{
							window.top.s1[0] = pid;
							window.top.s1[1] = ptype;
							window.top.s1[2] = pnum;
							window.top.s1[3] = param;
							window.top.s1[4] = name;
						}
						else
						{
							window.top.s1[0] = "";
							window.top.s1[1] = "";
							window.top.s1[2] = "";
							window.top.s1[3] = "";
							window.top.s1[4] = "";
						}
					}
				}
			}
		}
	}
}


function setS(arrTemp)
{
	for (var i = 0; i < 5 ; i++)
	{
		window.top.s1[i] = arrTemp[0][i];
		window.top.s2[i] = arrTemp[1][i];
		window.top.s3[i] = arrTemp[2][i];
		window.top.s4[i] = arrTemp[3][i];
		window.top.s5[i] = arrTemp[4][i];
	}
}


function show(id)
{
    window.document.getElementById(id).style.display = "block";
}


function submitSearch(myfield, e)
{
    var keycode;
    if (window.event)
    {
        keycode = window.event.keyCode;
    }
    else
    {
        if (e)
        {
            keycode = e.which;
        }
        else
        {
            return true;
        }
    }
    if (keycode == 13 || keycode == 3)
    {
        search(myfield);
        return false;
    }
    else
    {
        return true;
    }
}


function trim(sString) 
{
    while (sString.substring(0,1) == " ")
    {
        sString = sString.substring(1, sString.length);
    }
    while (sString.substring(sString.length - 1, sString.length) == " ")
    {
        sString = sString.substring(0, sString.length - 1);
    }
    return sString;
}


function updateManufacturers(n) 
{
	var manufacturers = new Array(5);
	manufacturers[0] = new Array(); 
	manufacturers[1] = new Array("LG","Motorola","NEC","Nokia","Panasonic", "Samsung","Siemens","SonyEricsson"); 
	manufacturers[2] = new Array("LG","Motorola","Nokia", "Samsung", "Siemens", "SonyEricsson"); 
	manufacturers[3] = new Array("Audiovox","LG","Nokia", "Samsung", "Sanyo","Toshiba"); 
	manufacturers[4] = new Array("Motorola","Nokia", "Samsung","SonyEricsson"); 
	var man = window.document.form2.manufacturerSelect;
	var arr = manufacturers[n]; 
	var current = man.options.length;
	for (var j = current; j > 0; j--)
    {
        man.options[j] = null;
    }
    for (var i = 0; i < arr.length; i++)
    {	
        man.options[man.options.length] = new Option(arr[i],arr[i]); 
    }
    if (n > 0)
    {
        man.options[0].text = "Phone Manufacturer";
    }
    else
    {
        man.options[0].text = "Select Company";
    }
}


function wrapMessage(message, maxMsgLength)
{
    var m = message;
    if (message.length > maxMsgLength)
    {
        m = "";
        for (var j = 0; j < message.length/maxMsgLength; j++)
        {
            var to = (j + 1) * maxMsgLength;
            m += message.substring (j * maxMsgLength, to);
            if (to < message.length)
            {
                m += "<br>";
            }
        }
    }
    return m;
}


function writeCrumbBottom(URL)
{
    URL += "img/btn_arrow_white.gif";
    if (window.top.s2[0] != "")
    {
        document.write('<li><img src="' + URL + '" width="8" height="8"/>' +
        '<a href="javascript:getNextPage(window.top.s1[0],window.top.s1[1],window.top.s1[2],window.top.s1[3],window.top.s1[4],1);">' +
        window.top.s1[4] + '</a></li>');
    }
    if (window.top.s3[0] != "")
    {
        document.write('<li><img src="' + URL + '" width="8" height="8"/>' +
        '<a href="javascript:getNextPage(window.top.s2[0],window.top.s2[1],window.top.s2[2],window.top.s2[3],window.top.s2[4],2);">' +
        window.top.s2[4] + '</a></li>');
    }
    if (window.top.s4[0] != "")
    {
        document.write('<li><img src="' + URL + '" width="8" height="8"/>' +
        '<a href="javascript:getNextPage(window.top.s3[0],window.top.s3[1],window.top.s3[2],window.top.s3[3],window.top.s3[4],3);">' +
        window.top.s3[4] + '</a></li>');
    }
    if (window.top.s5[0] != "")
    {
        document.write('<li><img src="' + URL + '" width="8" height="8"/>' +
        '<a href="javascript:getNextPage(window.top.s4[0],window.top.s4[1],window.top.s4[2],window.top.s4[3],window.top.s4[4],4);">' +
        window.top.s4[4] + '</a></li>'); 
    }
}


function writeCrumbLine()
{
    if(window.top.s5[0] != "")
    {
        document.write(window.top.s5[4]);
    }
    else if(window.top.s4[0] != "")
    {
        document.write(window.top.s4[4]);
    }
    else if(window.top.s3[0] != "")
    {
        document.write(window.top.s3[4]);
    }
    else if(window.top.s2[0] != "")
    {
        document.write(window.top.s2[4]);
    }
	else if(window.top.s1[0] != "")
    {
        document.write(window.top.s1[4]);
    }
}


function writeCrumbTop()
{
    if(window.top.s1[0] != "")
    {
        document.write(window.top.s1[4]);
    }
    if(window.top.s5[0] != "")
    {
        document.write(": " + window.top.s5[4]);
    }
    else if(window.top.s4[0] != "")
    {
        document.write(": " + window.top.s4[4]);
    }
    else if(window.top.s3[0] != "")
    {
        document.write(": " + window.top.s3[4]);
    }
    else if(window.top.s2[0] != "")
    {
        document.write(": " + window.top.s2[4]);
    }
}


function writeInstrument(type)
{
    var showThisCarrier = true;

    var pid = window.top.pid;
    if (pid == null) pid = top.pid;


	if (this.sprint > 0)
	{
		// It's a carrier billing item.
		if (type.indexOf("billing/carrier") != -1)
		{

			if (pid == "")
			{
				type = type.replace(/\.\*/gi,"CarrierBilling");
			}
			else 
			{
				var carrier = "";
				var company = window.top.company;
				if ((company == null) || (company == undefined) || (company == "")) company = top.company;
				if ((company == null) || (company == undefined) || (company == "")) company = getCookie("company");
    			if (company == "tmobile") company = "t-mobile";

                if ((company != null) || (company != undefined)) // We have a company.
                {
                    // No generic case, have Sprint, and company doesn't match Sprint
                    if (!hasGenericCB && hasSprintCB && (company.toLowerCase().indexOf("sprint") == -1))
                    {
                        // Available only for Sprint
                        document.getElementById("sprintOnly").style.display = "block";
                        displayCB = false;
                    }
                    // Select Sprint but not generic case or Sprint supported, hide carrier billing block.
                    else if ((company.toLowerCase().indexOf("sprint") != -1) && hasGenericCB && !hasSprintCB)
                    {
                        hide("carrierBillingBlock");
                    }
                    else
                    {
               			if (company.toLowerCase().indexOf("sprint") != -1)
                        {
                            if (type.match(/\.\*/gi) != -1) type = type.replace(/\.\*/gi, "SprintPCS");
                            if (type.match(/special\/SprintPCS/gi) != -1) type = type.replace(/special\/SprintPCS/gi, "SprintPCS");
                        }
                        else
                        {
                            // If a selection, try displaying that selection.
                            for (var i = 0; i < window.carriers.length; i ++)
                            {
                                if ((carriers[i].toLowerCase().indexOf(company.toLowerCase()) != -1) && (company.length > 1))
                                {
                                    carrier = window.carriers[i].substring(0, window.carriers[i].indexOf(" "));
                                    break;
                                }
                            }
                            if (type.search(/\.\*/gi) != -1)
                            {
                                if (carrier.length > 0)
                                {
                                    type = type.replace(/\.\*/gi, carrier);
                                }
                                else
                                {
                                    type = type.replace(/\.\*/gi, "CarrierBilling");
                                }
                            }
                        }
                    }
                }
                // We have no company selected
    			else
    			{
                    showThisCarrier = true;

                    // Replace what is given with the generic icon. (no company cases)
                    if (type.match(/\.\*/gi) != -1) type = type.replace(/\.\*/gi,"CarrierBilling");
                    if (type.match(/special\/SprintPCS/gi) != -1) type = type.replace(/special\/SprintPCS/gi,"CarrierBilling");
    			}

        		if (this.sprint == 4) document.write('</div><div style="padding-left:8px;padding-top:5px;padding-right:3px;">');
        		if (displayCB && showThisCarrier)
        		{
            		document.write('<img src="'+type+'_sm.jpg" border="0" width="32" height="20">');
                    displayCB = false; // Show one icon only.
                }
			}
		}
		else
		// It's another payment type item.
		{
        	if (this.sprint == 4) document.write('</div><div style="padding-left:8px;padding-top:5px;padding-right:3px;">');
        	document.write('<img src="'+type+'_sm.jpg" border="0" width="32" height="20">');
		}
		this.sprint--;
	}
}


function xEscapeStore(str, excl)
{
    if (typeof excl == "undefined" || excl == null)
    {
        excl = "";
    }
    if (excl.indexOf ("\\") == -1)
    {
        str = str.replace (/\\/gi, "\\\\");
    }
    if (excl.indexOf ("'") == -1)
    {
        str = str.replace (/\'/gi, "&apos;");
    }
    if (excl.indexOf ('"') == -1)
    {
        str = str.replace (/\"/gi, '\\"');
    }
    if (excl.indexOf ("{") == -1)
    {
        str = str.replace (/\{/gi, "&#123;");
    }
    if (excl.indexOf ("}") == -1)
    {
        str = str.replace (/\}/gi, "&#125;");
    }
    if (excl.indexOf (":") == -1)
    {
        str = str.replace (/\:/gi, "\\:");
    }
    if (excl.indexOf ("~") == -1)
    {
        str = str.replace (/\~/gi, "\\~");
    }
    if (excl.indexOf ("!") == -1)
    {
        str = str.replace (/\!/gi, "\\!");
    }
    if (excl.indexOf ("^") == -1)
    {
        str = str.replace (/\^/gi, "\\^");
    }
    if (excl.indexOf ("(") == -1)
    {
        str = str.replace (/\(/gi, "\\(");
    }
    if (excl.indexOf (")") == -1)
    {
        str = str.replace (/\)/gi, "\\)");
    }
    if (excl.indexOf ("+") == -1)
    {
        str = str.replace (/\+/gi, "\\+");
    }
    if (excl.indexOf ("-") == -1)
    {
        str = str.replace (/\-/gi, "\\-");
    }
    if (excl.indexOf ("|") == -1)
    {
        str = str.replace (/\|/gi, "\\|");
    }
    if (excl.indexOf ("?") == -1)
    {
        str = str.replace (/\?/gi, '\\?');
    }
    if (excl.indexOf ("*") == -1)
    {
        str = str.replace (/\*/gi, "\\*");
    }
    if (excl.indexOf ("[") == -1)
    {
        str = str.replace (/\[/gi, "\\[");
    }
    if (excl.indexOf ("]") == -1)
    {
        str = str.replace (/\]/gi, "\\]");
    }
    if (excl.indexOf ("%") == -1)
    {
        str = str.replace (/\%/gi, "&#37;");
    }
    return str;
}


function xUnEscapeStore(s)
{
	if (typeof s == "undefined")
	{
		s = "";
	}
	s = s.replace (/&apos;/gi, "'");
	return s;
}

preview = function (obj, url)
{
	if (!document.getElementById('_preview_player'))
	{
		var player_div = document.createElement('div');
		player_div.setAttribute('id', '_preview_player');
		document.body.appendChild(player_div);
	}
	if (!player)
	{
		player = new Player(window.parent.Mac, window.parent.Netscape);
	}
	
	player.preview(obj, url);
};

Player = function (mac, netscape)
{
	var backupHTML = null;
	var anchorObj = null;
	var parentObj = null;
	var mouseout = false;
	var preview_pop = false;
	var busy = false;
	var browserId = 3;//1-IE, 2-FF, 3-Mac
	if (!mac)
		{
			if (!netscape)
			{
				browserId = 1;
			}
			else
			{
				browserId = 2;
			}
		}

	this.preview = function (obj, url)
	{
		if (!busy)
		{
			InitializeTimer(30);//preview will be stopped in 30 seconds
			busy = true;
			if (backupHTML)
			{
				_stop();
			}
			if (obj.parentNode)
			{
				anchorObj = obj;
				mouseout = function()
				{
					void(0);
				};
				backup();
				obj.onmouseover = null;
				obj.onmouseout = null;
				if (obj.getElementsByTagName('img')[0])
				{
					if (typeof contentServerUrl == 'string') obj.getElementsByTagName('img')[0].src = contentServerUrl + 'img/btn_sound_play.gif';
					else obj.getElementsByTagName('img')[0].src = baseUrl + 'img/btn_sound_play.gif';
				}
				var extension = url.substr(url.length - 3, 3).toLowerCase();
				switch (extension)
				{
					case "mp3": previewMP3(url);
					break;
					case "wma": previewWMA(url);
					break;
					//case "wmv": previewWMV(url);
					//break;
					default : preview_pop = window.open(url);
				}
			}
			busy = false;
		}
	}

	this.stop = function()
	{
		if (backupHTML)
		{
			_stop();
		}
	};
		
	previewMP3 = function(url)
	{
		switch (browserId)
		{
			case 1:
			{
				if (url.indexOf('&') != -1)
				{
				url += '&ext=mp3.mp3';
				}
				document.getElementById('_preview_player').innerHTML = '<embed  width="0" height="0" src="' + url + '" autostart="true" showcontrols="false" showstatusbar="true" showdisplay="true"></embed>';
			};
			break;
			default: document.getElementById('_preview_player').innerHTML = '<embed src="../../store/player/xspf_player_slim.swf?song_url=' + escape(url) +'&autoload=true&autoplay=true&song_title=notitle" ' +
			'quality="high" bgcolor="#E6E6E6" name="xspf_player" allowscriptaccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" align="center" height="0" width="0"></embed>';
		}
	};

	previewWMA = function(url)
	{
		document.getElementById('_preview_player').innerHTML = '<embed  width="0" height="0" src="' + url + '" autostart="true" showcontrols="false" showstatusbar="false" showdisplay="true"></embed>';
	};

	previewWMV = function(url)
	{
		preview_pop = window.open('about:blank','preview_pop', 'width=300,height=200,status=no,menubar=no,location=no,toolbar=no,scrollbars=no');
		preview_pop.document.open();
		preview_pop.document.writeln('<html><head><title>Preview</title></head><body><embed width="400" height="300" src="' + url + '" autostart="true" showcontrols="false" showstatusbar="false" showdisplay="true"></embed></body></html>');
		preview_pop.document.close();
	};

	_stop = function()
	{
		if (preview_pop)
		{
			preview_pop.close();
			preview_pop = false;
		}
		document.getElementById('_preview_player').innerHTML = '';
		parentObj.innerHTML = backupHTML;
		mouseout();
		backupHTML = false;
	};

	backup = function()
	{
		parentObj = anchorObj.parentNode;
		backupHTML = parentObj.innerHTML;
		if (anchorObj.onmouseout)
		{
			mouseout = anchorObj.onmouseout;
		}
	}
};

showHTMLFile = function(name, url)
{
	var length = findPosition(document.getElementById('content'));
	var length1 = findPosition(document.getElementById('_file'));
	length = length > length1 ? length : length1;

	hide('content');

	document.getElementById('__file').innerHTML = '<iframe id="_file_frame" frameborder="0" marginheight="0" marginwidth="0" width="' +
		document.getElementById('content').parentNode.width + '" height="100%" src="' + url + '"></iframe>';

	var names = document.getElementById('_file').getElementsByTagName('td');

	if (names)
	{
		for (var i=0;i<names.length;++i)
		{
			if (names[i].getAttributeNode('class'))
			{
				if (names[i].getAttributeNode('class').value == '_file_name')
				{
					names[i].innerHTML = name;
				}
			}
		}
	}
	
	length = findPosition(document.getElementById('footer')) - length - 40;//40 = gap
	length = length > 200 ? length : 200;	//200 = min
	length = length < 1000 ? length : 1000;	//1000 = max
	document.getElementById('_file_frame').height = length;

	show('_file');
};

function findPosition(obj)
{
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

function InitializeTimer(sec)
{
    // Set the length of the timer, in seconds
    secs = sec;
    StopTheClock();
    StartTheTimer();
}

function StopTheClock()
{
    if(timerRunning)
        clearTimeout(timerID);
    timerRunning = false;
}

function StartTheTimer()
{
    if (secs==0)
    {
        StopTheClock();
		if (player)
		{
			player.stop();
		}
    }
    else
    {
       // self.status = secs;
        secs = --secs;
        timerRunning = true;
        timerID = self.setTimeout("StartTheTimer()", delay);
    }
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
</script>

<script>
    function popwindow(link,param) {
        videoWindow = window.open(link, "", param);
    } 
</script>
<script>
    function previewwindow(link,param) {
		preview_pop = window.open(link,'preview_pop', param);
		preview_pop.document.open();
		preview_pop.document.writeln('<html><head><title>Preview</title></head><body><embed width="400" height="300" src="' + url + '" autostart="true" showcontrols="false" showstatusbar="false" showdisplay="true"></embed></body></html>');
		preview_pop.document.close();
}        
</script>

              

       <form>
            <input type='hidden' name='useragent'   id='useragent'   value='' />
            <input type='hidden' name='remoteaddr' id='remoteaddr' value='' />
                          <? echo "<A HREF=javascript:popwindow('http://www.banqpay.com/sublink.php?\$105\$11\$epaynews13194.html','scrollbars,resizable,top=15,left=15,width=620,height=360')>Test A</a><br><br>"?>
                          <? echo "<A HREF=javascript:popwindow('http://www.banqpay.com/sublink.php?\$105\$11\$epaynews13194.html&useragent=$useragent&remoteaddr=$remoteaddr','scrollbars,resizable,top=15,left=15,width=620,height=360')>Test B</a><br><br>"?>
       </form>

       <form>
            <input type='hidden' name='useragent'   id='useragent'   value='' />
            <input type='hidden' name='remoteaddr' id='remoteaddr' value='' />
                          <? echo "<A HREF=javascript:previewwindow('http://www.banqpay.com/sublink.php?\$105\$11\$epaynews13194.html','scrollbars,resizable,top=15,left=15,width=620,height=360')>Test E</a><br><br>"?>
                          <? echo "<A HREF=javascript:previewwindow('http://www.banqpay.com/sublink.php?\$105\$11\$epaynews13194.html&useragent=$useragent&remoteaddr=$remoteaddr','scrollbars,resizable,top=15,left=15,width=620,height=360')>Test F</a><br><br>"?>
       </form>




       
                        <? echo "<A HREF=javascript:window.top.open()>Test C</a><br><br>"?>
                        <? echo "<A HREF=javascript:NewWindow=window.open('http://www.banqpay.com/sublink.php?\$105\$11\$epaynews13194.html&useragent=$useragent&remoteaddr=$remoteaddr','','scrollbars,resizable,top=15,left=15,width=620,height=360')>Test D</a><br><br>"?>
                        