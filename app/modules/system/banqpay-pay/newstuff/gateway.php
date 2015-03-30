<?php
/*---------------------------------------------------------------------------*/
//
// gateway.php
//
// Author  : Gyuchang Jun <geoid@bitpass.com>
// Date    : 10/24/2003
// KH      : 12/30/2003 - update for fulfill_req
// KH      : 01/09/2004 - max-age=$validFor
// KH      : 03/12/2004 - _bp_save_/attach_
//
// $Id: gateway.php.txt,v 1.2 2005/07/18 22:24:22 khlee Exp $
// Copyright 2003-2004. BitPass, Inc. All rights reserved.
//
/*---------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------*/
//
// Configuration
//
/*---------------------------------------------------------------------------*/

// publisher ID
$pubid = '00000719';

// base directory which contains the premium content
$base = 'premium/';

// name of the index file, which usually is one of
// index.html, index.htm, index.cgi, index.asp or index.php
$index = 'index.html:index.htm:index.php';


/*---------------------------------------------------------------------------*/
//
// Automatically generated configuration.
// Do not change them unless you are absolutely sure about it.
//
/*---------------------------------------------------------------------------*/

// standard P3P privacy policy
// you can find out of the meaning of this form at 
// http://www.w3.org/P3P/
$P3P = '"NOI NID CUR OUR NOR UNI COM NAV INT STA"';

// pass key phrase
$secret = 'c2VjcmV0MTEyMjMyNzQ5Ng==';

error_reporting(E_ERROR); // avoid warnings.
// supported MIME type
$MIME_TYPE = array(
        'htm'   => 'text/html',		'html'  => 'text/html',
        'txt'   => 'text/plain',	'asc'   => 'text/plain',
        'css'   => 'text/css',		'js'    => 'text/javascript',
        'gif'   => 'image/gif',		'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',	'jpe'   => 'image/jpeg',
        'tiff'  => 'image/tiff',	'tif'   => 'image/tiff',
        'png'   => 'image/png',		'mp3'   => 'audio/mpeg',
        'mp2'   => 'audio/mpeg',	'mpga'  => 'audio/mpeg',
        'wma'   => 'audio/x-ms-wma',	'wax'   => 'audio/x-ms-wax',
	'ra'	=> 'audio/x-realaudio',	'ram'	=> 'audio/x-pn-realaudio',
	'rm'	=> 'audio/x-pn-realaudio',
        'qt'    => 'video/quicktime',	'mov'   => 'video/quicktime',
        'asf'   => 'video/x-ms-asf',	'asx'   => 'video/x-ms-asf',
        'wmv'   => 'video/x-ms-wmv',	'wvx'   => 'video/x-ms-wvx',
        'wm'    => 'video/x-ms-wm',	'wmx'   => 'video/x-ms-wmx',
        'swf'   => 'application/x-shockwave-flash',
        'pdf'   => 'application/pdf',
        'wmz'   => 'application/x-ms-wmz',
        'wmd'   => 'application/x-ms-wmd',
        'zip'   => 'application/zip',
);

// default MIME type
$DEFAULT_TYPE = 'application/octet-stream';
//$DOWNLOAD_TYPE = 'application/force-download';
$DOWNLOAD_TYPE = 'application/octetstream';

// Library compatibility
$BCMATH = extension_loaded('bcmath');

// PHP extensions
$PHP_EXT = "php:php3:php4";

// support direct POST to PHP
$direct_post = 0;

/*---------------------------------------------------------------------------*/
//
// Phase 0. Pre-process configuration
//
/*---------------------------------------------------------------------------*/

// Fix SCRIPT_NAME if modified by web server/handler
if ( isSet($_SERVER['SCRIPT_NAME']) && isSet( $_SERVER['REQUEST_URI']) ) {
    if (strpos($_SERVER['REQUEST_URI'], $_SERVER['SCRIPT_NAME']) !== 0) {
        // SCRIPT_NAME broken.
        $lastslash = strrpos($_SERVER['SCRIPT_NAME'], '/');
        $scriptbase = ($lastslash === FALSE) ? $_SERVER['SCRIPT_NAME'] : substr($_SERVER['SCRIPT_NAME'], $lastslash);
        $scriptprefixlen = strpos($_SERVER['REQUEST_URI'], $scriptbase);

        if ($scriptpreflxlen !== FALSE) {
            // fix the script name
            $_SERVER['ORIG_SCRIPT_NAME'] =  $_SERVER['SCRIPT_NAME'];
            $_SERVER['SCRIPT_NAME'] = substr($_SERVER['REQUEST_URI'], 0, $scriptprefixlen + strlen($scriptbase));
        }
    }
}

// set script name
$gateway = $_SERVER['SCRIPT_NAME'];


// set $host
if (isSet($_SERVER['HTTP_HOST']) && preg_match("/([^:]*)(:?(.*))?/", $_SERVER['HTTP_HOST'], $matches)) {
    $host = $matches[1];
} else {
    $host = $_SERVER['SERVER_NAME'];
}


$bp_config['WINDOWS'] = 0;

if (isSet($_SERVER['OS']) && preg_match("/Windows/i", $_SERVER['OS'], $matches)) {
	$bp_config['WINDOWS'] = 1;
}

if (isSet($_SERVER['SERVER_SOFTWARE']) 
	&& preg_match("/Microsoft.*IIS\/(.*)/i", $_SERVER['SERVER_SOFTWARE'], $matches)) {
	$bp_config['WINDOWS'] = 1;
}
if (!isSet($_SERVER['DOCUMENT_ROOT'])) {
    $fix_path_tr = "";
    $fix_path_info = "";
    if (isSet($_SERVER['ORIG_PATH_TRANSLATED'])) {
	// cgi.fix_pathinfo = 1 in php.ini
	$fix_path_tr = canonical_path($_SERVER['ORIG_PATH_TRANSLATED']);
	$fix_path_info = canonical_path($_SERVER['ORIG_PATH_INFO']);
    } elseif (isSet($_SERVER['PATH_TRANSLATED'])) {
	$fix_path_tr = canonical_path($_SERVER['PATH_TRANSLATED']);
	if (isSet($_SERVER['PATH_INFO'])) {
	    $fix_path_info = canonical_path($_SERVER['PATH_INFO']);
	}
    }

    if ($fix_path_tr) {
	$doc_len = 0; // not found yet
	if ($fix_path_info != "") {
	    $doc_len = strlen($fix_path_tr) - strlen($fix_path_info);
	    if ( substr($fix_path_tr, $doc_len) != $fix_path_info ) {
		$doc_len = 0;
	    }
	} 
	if ($doc_len == 0 && isSet($_SERVER['SCRIPT_NAME'])) {
	    $doc_len = strpos($fix_path_tr, canonical_path($_SERVER['SCRIPT_NAME']));
	}
	if ($doc_len == 0 && isSet($_SERVER['PHP_SELF'])) {
	    $doc_len = strpos($fix_path_tr, canonical_path($_SERVER['PHP_SELF']));
	}
	if ($doc_len == 0) {
	    // Last resort, search .php
	    $doc_len = strpos($fix_path_tr, '.php');
	    if ($doc_len) {
		$doc_len = strrpos($fix_path_tr, '/', $doc_len);
	    }
	}
	$_SERVER['DOCUMENT_ROOT'] = substr($fix_path_tr, 0, $doc_len);
    }
}

// change the reference of the relative path of $base
// from web root to current dir
if (!isAbsPath($base)) {
    $base = $_SERVER['DOCUMENT_ROOT'].'/'.$base;
}
$base = canonical_path($base);


// send P3P privacy policy so that the browser will accept the cookie
if ($P3P) {
    header("P3P: CP=".$P3P, FALSE);
}


// public key of BitPass
$pubkey = array(
	'e' => '65537',
	'n' => '124662108628483073023707414085550684603564858191089586074432766031711169328995315417790821584030512928837958161504727045129056238103480976053470494999911578183783537521640197707293154317695747977434756966490091770922712537556172009406473969176340336603058341202908929170982636411709113764440550989167022488271',
	'keysize' => 1024 
);

// split $index
$index = explode(':', $index);


// split $PHP_EXT
$PHP_EXT = explode(':', $PHP_EXT);


// send out version number
header('X-BITPASS-GW-VER: PHP Revision: 1.23.1.6', FALSE);

// General PATH_INFO fix, works for 1and1 .htaccess RewriteRule, and ORIG_PATH_INFO
if ( isSet($_SERVER['SCRIPT_NAME']) && isSet($_SERVER['REQUEST_URI']) ) {
    list ($abspath) = split('\?', $_SERVER['REQUEST_URI']); // Query string
    $rstr = '/^[a-z]+:\/\/[^\/%+]*/i';  // scheme and server name
    $abspath = urldecode(preg_replace($rstr, '', $abspath)); 

    $rstr = '/^'. preg_quote($_SERVER['SCRIPT_NAME'], '/') .'(.*)$/';
    if (preg_match($rstr, $abspath, $matches)) {
        if (isSet($_SERVER['PATH_INFO'])) {
            $_SERVER['ORIGINAL_PATH_INFO'] = $_SERVER['PATH_INFO'];
        }
        $_SERVER['PATH_INFO'] = $matches[1];
        $_SERVER['ORIGINAL_PHP_SELF'] = $_SERVER['PHP_SELF'];
        $_SERVER['PHP_SELF'] = $abspath;
//    } else if (isSet($_SERVER['PHP_SELF']) ) {
//	$rstr = '/^'. preg_quote($_SERVER['PHP_SELF'], '/') .'(.*)$/';
//	if (preg_match($rstr, $abspath, $matches)) {
//	    if (isSet($_SERVER['PATH_INFO'])) {
//		$_SERVER['ORIGINAL_PATH_INFO'] = $_SERVER['PATH_INFO'];
//	    }
//	    $gateway = $_SERVER['PHP_SELF'];
//            $_SERVER['SCRIPT_NAME'] = $_SERVER['PHP_SELF'];
//            $_SERVER['PATH_INFO'] = $matches[1];
//            $_SERVER['ORIGINAL_PHP_SELF'] = $_SERVER['PHP_SELF'];
//            $_SERVER['PHP_SELF'] = $abspath;
//	}
    }
}

/*---------------------------------------------------------------------------*/
//
// Phase 1. See if this request comes with "Voucher"
//
/*---------------------------------------------------------------------------*/

// see which method is used
if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_GET['_bp_']) {
    if (isSet($_POST['BITPASS_VOUCHER_SUBMISSION'])
		&& $_POST['BITPASS_VOUCHER_SUBMISSION']) {
        // check the voucher
        list($res, $msg, $path, $qstr, $passexp) = check_voucher($pubkey);

        // check the result
        if ($res) {
            issue_pass($host, $gateway, $path, $qstr, $passexp, $secret);
            if (isSet($_GET['_bp_save_'])) {
                $qstr .= ($qstr) ? '&_bp_save_=1' : '_bp_save_=1';
            }
            if ($direct_post && ($GW_SCRIPT = fulfill_req($base, $_SERVER['PATH_INFO'], 0, 1))) {
                chdir(dirname($GW_SCRIPT));
                require($GW_SCRIPT);
            } else {
                redirect($gateway, $qstr, isSet($_GET['_bp_close_']));
            }
        } else {
            list($errcode, $errmsg) = explode(':', $msg, 2);
            errbounce($errcode, $errmsg, $pubid);
        }
        exit;
    } else if (isSet($_POST['BITPASS_DIAGNOSIS_REQUEST']) 
		&& $_POST['BITPASS_DIAGNOSIS_REQUEST']) {
        if (validate_request($pubkey)) {
            diagnosis();
        }
        exit;
    }
}


// test whether $base is a real directory
if (!is_dir($base)) {
    errbounce('C9', "specified premium dir ($base) is not a directory", $pubid);
    exit;
}


/*---------------------------------------------------------------------------*/
//
// Phase 2. See if this is a bounce request
//
/*---------------------------------------------------------------------------*/

// check path_info
if ( $_SERVER['REQUEST_METHOD'] == 'GET' &&
     (!isSet($_SERVER['PATH_INFO']) || $_SERVER['PATH_INFO'] == '') ) {
    $n = isSet($_GET['n']) ? $_GET['n'] : '';
    $w = isSet($_GET['w']) ? $_GET['w'] : 0;
    $h = isSet($_GET['h']) ? $_GET['h'] : 0;

    $n = htmlentities($n);
    $w = is_numeric($w) ? $w : 0;
    $h = is_numeric($h) ? $h : 0;

    if ($n && $w != 0 && $h != 0) {
        header("X-BITPASS-GW: Bouncing geometry", FALSE);
        setcookie($n, "$w:$h", 0, '/', $host, 0);
        print("$w:$h");
    } else {
        header("X-BITPASS-GW: NOTHING TO DO", FALSE);
        header("Status: 403 Forbidden");
    }
    exit;
}

/*---------------------------------------------------------------------------*/
//
// Phase 3. See if this request comes with "Pass" cookie
//
/*---------------------------------------------------------------------------*/

list($res, $msg, $validFor) = verify_pass($gateway, $secret);
// check the result
if ($res == 1) {
    if (isSet($_GET['_bp_save_'])) {
        download($gateway, $_SERVER['PATH_INFO']);
    } else {
        $GW_SCRIPT = fulfill_req($base, $_SERVER['PATH_INFO'], $validFor);
	if ($GW_SCRIPT) {
	    chdir(dirname($GW_SCRIPT));
	    require($GW_SCRIPT);
	}
    }
} else {
    list($errcode, $errmsg) = explode(':', $msg, 2);
    errbounce($errcode, $errmsg, $pubid);
}

exit;


/*---------------------------------------------------------------------------*/
//
// Following routines produce HTML when error occurs
// You might want to customize them
//
/*---------------------------------------------------------------------------*/

function errbounce ($errcode, $errmsg, $pubid) {

    // send out special header
    header("X-BITPASS-GW: ERROR:$errmsg", FALSE);

    // strip bP specific parameter
    $qstr = $_SERVER['QUERY_STRING'];
    $qstr = preg_replace('/_bp_[^&]*/', '', $qstr);
    $qstr = preg_replace('/&+/', '&', $qstr);
    $qstr = preg_replace('/^&/', '', $qstr);
    $qstr = preg_replace('/&$/', '', $qstr);

    $bitpass = 'https://www.bitpass.com/return/'.$errcode.'/'.$pubid;

    $bitpass .= $_SERVER['PATH_INFO'];

    $bitpass .= ($qstr) ? '?'.$qstr : '';

    header("Location: $bitpass");
}

/*---------------------------------------------------------------------------*/

function send403() {

    // requested URI
    $req_uri = htmlspecialchars($_SERVER['REQUEST_URI']);
    $server  = $_SERVER['SERVER_SIGNATURE'];

    print <<<EOT
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML><HEAD>
<TITLE>403 Forbidden</TITLE>
</HEAD><BODY>
<H1>Forbidden<H1>
You don't have permission to access $req_uri on this server.<P>
<HR>
$server
</BODY></HTML>
EOT;

    exit;
}

function send404() {

    // requested URI
    $req_uri = htmlspecialchars($_SERVER['REQUEST_URI']);
    $server  = $_SERVER['SERVER_SIGNATURE'];

    print <<<EOT
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML><HEAD>
<TITLE>404 Not Found</TITLE>
</HEAD><BODY>
<H1>Not Found</H1>
The requested URL $req_uri was not found on this server.<P>
<HR>
$server
</BODY></HTML>
EOT;

    exit;
}

/*---------------------------------------------------------------------------*/

function fulfill_req($base, $path_info, $validFor, $search = 0) {

    // get the path
    $path_arr = explode('/', $path_info);

    // search for PHP script
    $fname = substr($base, 0, strlen($base)-1);
    $script_name = $_SERVER['SCRIPT_NAME'];
    while (count($path_arr)) {
        $fragment = array_shift($path_arr);
        if ($fragment) {

            $fname .= '/'.$fragment;
            $script_name .= '/'.$fragment; 

            if (is_file($fname)) {
                if (ereg("\.([^.]+)$", $fragment, $ext)) {
                    if (in_array($ext[1], $GLOBALS['PHP_EXT'])) {
                        $_SERVER['SCRIPT_FILENAME'] = $fname;
                        $_SERVER['SCRIPT_NAME'] = $script_name;
                        $_SERVER['PATH_INFO'] = ((count($path_arr) > 0) ? '/':'').implode('/', $path_arr);
			return $fname;
                    }
                }
            }
        }
    }


    // fetch global object MIME_TYPE 
    $MIME_TYPE = $GLOBALS['MIME_TYPE'];


    // get the last element of path
    $path_last = end(explode('/', $path_info));


    // examine the real file
    if (is_dir($fname)) {
        if ($path_info[strlen($path_info)-1] != '/') {    // adding trailing /
             $location = $GLOBALS['gateway'].'/'.$path_info.'/';
             $location = ereg_replace('/+', '/', $location);
             if (!$search) {
                 header("Location: http://".$_SERVER['HTTP_HOST'].$location);
                 exit;
             }
        }

        list($indx, $ext) = find_index($fname);
        $fname = canonical_path($fname.'/'.$indx);

        if (in_array($ext, $GLOBALS['PHP_EXT'])) {
	    return $fname;
        } else {
            $ftype = 'text/html';
        }
    } else {    // is_file() or is_link()
        $filename  = basename($fname);
        $extension = end(explode('.', $filename));

        if (in_array($extension, $GLOBALS['PHP_EXT'])) {
	    return $fname;
        }

        $ftype = $GLOBALS['MIME_TYPE'][$extension];

        if (!$ftype) {
            $ftype = $GLOBALS['DEFAULT_TYPE'];
        }
    }

    if ($search) {
	return "";
    }
 
    // open the file
    if (!file_exists($fname)) {
        send404();
    } else if (!is_readable($fname)) {
        send403();
    } else {
        send_file($fname, $ftype, isSet($_GET['_bp_attach_']), $validFor);
    }

    return "";
}

function find_index($dir) {

    $dir .= ($dir[strlen($dir)-1] == '/') ? '' : '/';

    $index_arr = $GLOBALS['index'];

    foreach ($index_arr as $index) {

        $fname = $dir.$index;
        if (is_file($fname)) {
            $ext = end(explode('.', $index));
            return array($index, $ext);
        }
    }

    $index = $index_arr[0];

    $ext = end(explode('.', $index));
    return array($index, $ext);
}
/*---------------------------------------------------------------------------*/

function redirect($base, $qstr, $close) {

    // send out special header
    header("X-BITPASS-GW: VOUCHER VERIFIED", FALSE);

    // establish self URL
    $scheme = (isSet($_SERVER['HTTPS']) && 
               strtoupper($_SERVER['HTTPS']) == 'ON') ? 'https' : 'http';
    $self = $scheme.'://'.$GLOBALS['host'];
    $self .= ($_SERVER['SERVER_PORT'] != 80) ? ':'.$_SERVER['SERVER_PORT'] : '';
    $self .= canonical_path($base.'/'.$_SERVER['PATH_INFO']);
    if ($qstr) {
        $self .= '?'.$qstr;
    }

    if ($close) {
        print <<<EOT
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<TITLE>Redirecting...</TITLE>
<SCRIPT language=javascript type='text/javascript'>
<!--
	top.opener.location='$self';
	top.close();
//-->
</SCRIPT>
</HEAD>
</HTML>
EOT;
    } else {
        header("Location: $self");
        $signature = isSet($_SERVER['SERVER_SIGNATURE']) ? $_SERVER['SERVER_SIGNATURE'] : '';

        print <<<EOT
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML><HEAD>
<TITLE>302 Found</TITLE>
</HEAD><BODY>
<H1>Found</H1>
The document has moved <A HREF="$self">here</A>.<P>
<HR>
$signature</BODY></HTML>
EOT;
    }

    exit;
}

/*---------------------------------------------------------------------------*/


function download ($base, $path_info) {

    // get query string
    $qstr = $_SERVER['QUERY_STRING'];
    $qstr = preg_replace('/_bp_save_/', '_bp_attach_', $qstr);
    
    // establish self URL
    $scheme = (isSet($_SERVER['HTTPS']) &&
               strtoupper($_SERVER['HTTPS']) == 'ON') ? 'https' : 'http';
    $self = $scheme.'://'.$GLOBALS['host'];
    $self .= ($_SERVER['SERVER_PORT'] != 80) ? ':'.$_SERVER['SERVER_PORT'] : '';
    $self .= canonical_path($base.'/'.$path_info);
    $self .= '?'.$qstr;
    
    print <<<EOT
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<TITLE>Downloading...</TITLE>
<STYLE type='text/css'>
INPUT, TD {
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-weight: normal;
        font-size: x-small;
}
</STYLE>
</head>
</HEAD>

<BODY>
<TABLE width='100%' height='100%'>
<TR>
<TD align=center valign=middle>
<TABLE width=425 border=0 cellpadding=2 cellspacing=0 bgcolor='#FFFF99'>
<TR><TD align=center>
<BR>
<B>Thanks for your purchase.</B>
<BR>
</TD></TR>
<TR><TD height=8></TD></TR>
EOT;

    if (preg_match("/safari/i", $_SERVER['HTTP_USER_AGENT'])) {
    print <<<EOT
<TR>
<TD align=center style='line-height:150%'>Press Option-Command-L to see if the download is already in progress.</TD>
</TR>
<TR><TD align=center style='line-height:150%'>
If your browser is not downloading the file,<BR> Right-click or Control-click <A href='$self'><B>HERE</B></A> to save the file.
</TD></TR>
EOT;
    } else {
        print <<<EOT
<TR><TD align=center style='line-height:150%'>
If your browser does not prompt you to save the file,<BR> Right-click or Control-click <A href='$self'><B>HERE</B></A> to save the file.
</TD></TR>
EOT;
    }

    print <<<EOT
<TR><TD height=8></TD></TR>
<TR><TD align=center>
<INPUT type=button value=' Close ' onClick='window.close();'>
</TD></TR>
<TR><TD height=12></TD></TR>
</TABLE>
</TD></TR>
</TABLE>
<IFRAME height=0 width=0 frameborder=0 scrolling=no src='$self'></IFRAME>
</BODY>
</HTML>
EOT;

}

/*---------------------------------------------------------------------------*/

function send_file($fname, $type, $save, $validFor) {
    $fsize = filesize($fname);

    $b = 0;
    $e = $fsize;

    $fh = fopen($fname, 'rb');
    if ( !$fh ) {
	send403(); // exit
    }
    if ($fsize > 0 && isSet($_SERVER['HTTP_RANGE']) && $_SERVER['HTTP_RANGE'] != "") {

        $ranges = $_SERVER['HTTP_RANGE'];
        $pos = strpos($ranges , '=');
        if ($pos > 0) {
            $name = trim( substr($ranges, 0, $pos) );
            if (strtolower($name) == 'bytes') {
                $range = split(',', substr($ranges, $pos + 1));
                $range = verify_range($fsize, $range);

                if (count($range) == 0) {
                    send416($fname, $type);  // exit
                }
                if (count($range) > 1) {
                    return send_file_multi_partial($fname, $fh, $type, $range,  $save, $validFor);
                }
		// count == 1
	        if (! preg_match( '/(\d+)-(\d+)/', $range[0], $matches) ) {
		    send416($fname, $type);  // exit
	        }
	        $b = $matches[1];
	        $e = $matches[2] + 1;

	        if ($e - $b < 0) {
		    send416($fname, $type); // exit
    		}
            }
        }
    }


    if ($b != 0 || $e != $fsize) {
	header("HTTP/1.1 206 Partial content");
	header('Content-Range: bytes '.$range[0].'/'.$fsize);
    }

    send_etag($fname, $fsize);
    header('Content-Length: '.(string)($e - $b));

    if ($save) {
        header('Content-Disposition: attachment; filename='.basename($fname));
	header('Content-Type: '.$GLOBALS['DOWNLOAD_TYPE']);
    } else {
	header('Cache-Control: max-age='.$validFor);
	header('Content-Type: '.$type);
    }

    send_file_data($fh, $b, $e);
    fclose($fh);
}

// send from b to e, (include b, but exclude e)
// side effect: file position set to e.
function send_file_data($fh, $b, $e) {
        fseek($fh, $b);
        $len = 8192;
        if ($b % 8192) {
            $len = 8192 - ($b % 8192);
        }
        $e = $e - $b;

	// turn off output buffering to avoid out of memory 
        while (@ob_end_flush()); 

        while (!feof($fh) and (connection_status()==0) && $e > 0) {
            if ($len > $e) {
                $len = $e;
            }
	    set_time_limit(30); // extend time out to avoid cut off on slow connection
            print (fread($fh, $len));
            flush();

            $e -= $len;
            $len = 8192;
        }

        return $e;
}


function send_file_multi_partial($fname, $fh, $type, $range, $save, $validFor) {

    $fsize = filesize($fname);

    $b = array ();
    $e = array ();
    $seg = array ();
    $separater = 'THIS_STRING_SEPARATES';
    $len = 0;
    for ($i = 0; $i < count($range); $i++) {
        if (! preg_match( '/(\d+)\s*-\s*(\d+)/', $range[$i], $matches) ) {
            send416($fname, $type); // exit
        }
        $b[$i] = $matches[1];
        $e[$i] = $matches[2] + 1;

        if ($e[$i] - $b[$i] < 0) {
            send416($fname, $type); // exit
        }
        $seg[$i] =  "\n--".$separater."\n";
        $seg[$i] .= 'Content-Type: '.$type."\n";
        $seg[$i] .= 'Content-Range: bytes '.$range[$i].'/'.$fsize."\n\n";
        
        $len += strlen($seg[$i]) + ($e[$i] - $b[$i]);
    }
    
    $seg[$i] =  "\n--".$separater."--\n";
    $len += strlen($seg[$i]);
    
    if (!$fh) {
        send403(); //exits
    }

    header("HTTP/1.1 206 Partial content");
    send_etag($fname, $fsize);
    
    if ($save) {
        header('Content-Disposition: attachment; filename='.basename($fname));
    } else {
        header('Cache-Control: max-age='.$validFor);
    }
    
    header('Content-Type: multipart/byteranges; boundary='. $separater);
    header('Content-Length: '.$len);
    for ($i = 0; $i < count($range); $i++) {
        print ($seg[$i]);
        if (send_file_data($fh, $b[$i], $e[$i]) > 0) {
            // error;
            fclose($fh);
            return ;
        }
    }
    print ($seg[$i]); // --SEPARATER--
    
    fclose($fh);
}

function verify_range($fsize, $range) {
    $new_range = array ();
    for ($i = 0; $i < count($range); $i++) {
        if (! preg_match( '/(\d*)\s*-\s*(\d*)/', $range[$i], $matches) ) {
            return array ();
        }
        if ($matches[1] == '' && $matches[2] == '') {
            return array ();
        }
        if ($matches[1] != '') {
            if ($matches[1] >= $fsize) {
                return array ();
            }
            $s = $matches[1] + 0;
            if ($matches[2] != '') {
                if ($matches[2] >= $fsize) {
                    return array ();
                }
                $e = $matches[2] + 0;
            } else { 
                $e = $fsize - 1;
            }
        } else {
            if ($matches[2] >= $fsize) {
                return array ();
            }
            $s = $fsize - $matches[2];
            $e = $fsize - 1;
        }
        $new_range[$i] = "$s-$e";
    }
    return $new_range;
}

function send_etag($fname, $fsize) {

    $inode = fileinode($fname);
    $modified = filemtime($fname);

    $ETag = sprintf("\"%x-%x-%x\"", $inode, $fsize, $modified);

    header('Last-Modified: '. gmdate('D, d M Y H:i:s \G\M\T', $modified)); //Tue, 30 Mar 2004 08:22:57 GMT
    header("ETag: ".$ETag);
    header('Accept-Ranges: bytes');

    return array($modified, $ETag);
}

function send416($fname, $type) {
            
    // requested URI
    $req_uri = htmlspecialchars($_SERVER['REQUEST_URI']);
    $server  = $_SERVER['SERVER_SIGNATURE'];
    $fsize = filesize($fname);
        
    header("HTTP/1.1 416 Requested range not satisfiable");
    list($modified, $ETag) = send_etag($fname, $fsize);

    header('Content-Length: 0');
    header('Content-Range: bytes */'.$fsize);
    header('Content-Type: '.$type);

    print "\n";
    exit;
}   

/*---------------------------------------------------------------------------*/

function check_voucher ($pubkey) {

    // essential parameters
    $param1 = array(    'cpath', 'ctime', 'expires', 'ip', 'passexp',
                        'proxy', 'pubid', 'qstr', 'uniq_id', 'version'  );
    sort($param1);
    reset($param1);


    // meta parameters
    $param2 = array(	'hash', 'voucher'	);

    // prepare to build new hash
    $hash_arr = array();

    // check the integrity of the parameter
    foreach ($param1 as $dummy => $key) {
        if (! array_key_exists($key, $_POST)) {
            return array(0, '65:Integrity error', 0, 0, 0);
        }
        array_push($hash_arr, $_POST[$key]);
    }
    foreach ($param2 as $dummy => $key) {
        if (! array_key_exists($key, $_POST)) {
            return array(0, '65:Integrity error', 0, 0, 0);
        }
    }


    // fetch parameters
    $hash = $_POST['hash'];
    $then = $_POST['ctime'];
    $uniq_id0 = $_POST['uniq_id'];
    $evoucher = $_POST['voucher'];


    // build new hash
    $newhash = md5(implode("\n", $hash_arr));
    $newhash = strtoupper($newhash).$_POST['uniq_id'].$_POST['ctime'];
    $newhash = strtoupper(md5($newhash));


    // check hash 
    if ($hash != $newhash) {
        return array(0, '68:Checksum error', 0, 0, 0);
    }


    // check the target publisher
    if ($_POST['pubid'] != hexdec($GLOBALS['pubid'])) {
        return array(0, '69:Access from illegitimate origin', 0, 0, 0);
    }


    // check expiration
    if (abs(time() - $then) > $_POST['expires']) {
        return array(0, '6A:Expired voucher', 0, 0, 0);
    }


    // check path
    $pathinfo = canonical_path($_SERVER['PATH_INFO']);

    if (substr($pathinfo, 0, strlen($_POST['cpath'])) != $_POST['cpath']) {
        return array(0, '6B:Invalid path', 0, 0, 0);
    }


    // check query string
    $qstr = $_SERVER['QUERY_STRING'];

    // strip bP specific parameter
    $qstr = preg_replace('/_bp_[^&]*/', '', $qstr);
    $qstr = preg_replace('/&+/', '&', $qstr);
    $qstr = preg_replace('/^&/', '', $qstr);
    $qstr = preg_replace('/&$/', '', $qstr);

    if ($_POST['qstr'] != $qstr) {
        return array(1, '6C:Query string mismatch', 0, 0, 0);
    }


    // decode voucher
    $voucher = base64_decode($evoucher);


    // verify the signature
    if (! RSA_Verify($hash, $voucher, $pubkey)) {
        $pubkey = loadkey($GLOBALS['pubid']);
        if ($pubkey == FALSE) {
            return array(0, '66:Voucher verification failed', 0, 0, 0);
        }
        if (! RSA_Verify($hash, $voucher, $pubkey)) {
            return array(0, '67:Voucher verification failed', 0, 0, 0);
        }
    }


    // everything looks fine
    return array(1, 'OK', $_POST['cpath'], $qstr, $_POST['passexp']);

}

/*---------------------------------------------------------------------------*/

function validate_request($pubkey) {

    // fetch parameters
    $sign = base64_decode($_POST['sign']);
    $uniq = $_POST['uniq'];

    // compose message
    $mesg = strtoupper(md5($uniq.$GLOBALS['pubid']));

    // verify the signature
    return RSA_Verify($mesg, $sign, $pubkey);
}

function diagnosis() {

    header('X-BITPASS-GW: DIAG REQ VERIFIED', FALSE);
    header('Content-Type: text/plain');

    print "TIME:".time()."\n";
    print "PUBID:".$GLOBALS['pubid']."\n";
    print "HOST:".$GLOBALS['host']."\n";
    print "BASE:".$GLOBALS['base']."\n";
    print "INDEX:".implode(':', $GLOBALS['index'])."\n";
    print "BCMATH:".$GLOBALS['BCMATH']."\n";
    print "CWD:".getcwd()."\n";
    print "\n";

    $pathinfo = canonical_path($_SERVER['PATH_INFO']);
    $gateway = $_SERVER['SCRIPT_NAME'];
    $qstr = $_SERVER['QUERY_STRING'];

    print "PATHINFO:".$pathinfo."\n";
    print "GATEWAY:".$gateway."\n";
    print "QUERY STRING:".$qstr."\n";
    print "\n";

    print("SERVER:\n");
    foreach ($_SERVER as $k => $v) {
        print "  $k=$v\n";
    }


// test whether base is a real directory
    if (!is_dir($GLOBALS['base'])) {
        print("Error: C9/specified premium dir (".$GLOBALS['base'].") is not a directory");
        exit;
    }

    return;
}

/*---------------------------------------------------------------------------*/

function issue_pass ($host, $base, $path, $qstr, $passexp, $secret) {

    $validFor = 0;
    $cpath = canonical_path("$base/$path");

    // get path for the cookie
    if (substr($cpath, -1) == '/') {
        $cookiepath = dirname($cpath.'foo.bar').'/';
    } else {
        $cookiepath = dirname($cpath).'/';
    }

    // current time
    $now = time();

    // compute the hash
    $hash = md5(implode(':', array($secret, $cpath, $qstr, $now, $passexp)));
    $hash = md5($secret.$hash);

    // assemble pass cookie
    $Pass = array( 'time' => $now, 'hash' => $hash, 'path' => $cpath,
                   'qstr' => $qstr, 'expires' => $passexp );

    // send out cookie
    if (isSet($_POST['usrclock']) && is_numeric($_POST['usrclock'])) {
        $now = $_POST['usrclock'] + 600;
    }
    setcookie('Pass', base64_encode(serialize($Pass)), $now+$passexp, $cookiepath, $host, 0);
}

function verify_pass ($gateway, $secret) {

    // current path
    $uripath = canonical_path($gateway.'/'.$_SERVER['PATH_INFO']);


    // get query string
    $qstr = $_SERVER['QUERY_STRING'];
    $qstr = preg_replace('/_bp_[^&]*/', '', $qstr);
    $qstr = preg_replace('/&+/', '&', $qstr);
    $qstr = preg_replace('/^&/', '', $qstr);
    $qstr = preg_replace('/&$/', '', $qstr);


    // fetch cookie
    // $_COOKIE global variable has some quirkiness.
    // When there are more than one cookies which can be associated to a certain URL
    // ( consider two cookies with same name were issue for different pathes.
    //   e.g. setcookie('pass', 'val1', '/d1/'); setcookie('pass', 'val2', '/d1/d2/'); )
    // Then, request to /d1/d2/ comes with both cookies, val2 first followed by val1.
    // i.e. more specific cookie comes first.
    // However, PHP $_COOKIE has less specific values, 'val1' in this example.
    // This is a problem.
    // Workaround : parse the cookie manually...
    if (!isSet($_SERVER['HTTP_COOKIE'])) {
        return array(0, '00:No pass found', 0);
    }

    $cookie = explode(' ', $_SERVER['HTTP_COOKIE']);

    $rawpasses = array();
    $patharray = explode('/', $uripath);
    foreach ($cookie as $value) {
	if (substr($value, 0, 5) == 'Pass=') {
		$rawpass = substr($value, 5);
		array_push($rawpasses, $rawpass);
        }
    }

    if (count($rawpasses) == 0) {
        return array(0, '00:No pass found', 0);
    }

    $last_code = -1;
    $msg = '00:No pass found';
    $validFor = 0;
    foreach ($rawpasses as $rawpass) {
        list($ret, $newmsg, $validFor) = verify_rawpass ($uripath, $rawpass, $qstr, $secret);
        if ($ret == 1) {
            break;
        }

        list($newcode, $dummy) = split(':', $newmsg, 2);
        if ($lastcode < $newcode) {
            $msg = $newmsg;
        }
    }
    return array($ret, $msg, $validFor);
}


function verify_rawpass ($uripath, $rawpass, $qstr, $secret) {

    // fetch the pass
    $pass = @unserialize(base64_decode(urldecode($rawpass)));


    // check the integrity of the pass
    if (!($pass['time'] && $pass['hash'] && $pass['path']
          && $pass['expires'] && isSet($pass['qstr']))) {
        return array(0, '01:Integrity error', 0);
    }


    // check expiration time of cookie
    $elapsed = $pass['time'] - time();
    if (abs($elapsed) > $pass['expires']) {
        return array(0, '02:Expired pass', 0);
    }
    $validFor = $pass['expires'] - $elapsed;
    if ($validFor < 60) {
	$validFor = 60; 
    } 

    // compare the current path and the pass path
    if (substr($uripath, 0, strlen($pass['path'])) != $pass['path']) {
        return array(0, '03:Pass is not for this URL', 0);
    }


    // compare the current query string with the pass qstr
    //if ($qstr != $pass['qstr']) {
    //    return array(0, '05:Pass is not for this query string', 0);
    //}
    // if it's not directory,
    // compare the current query string with the pass qstr
    if (substr($pass['path'],-1) != "/" && $qstr != $pass['qstr']) {
        return array(0, '05:Pass is not for this query string', 0);
    }


    // compute new hash
    $newhash = md5(implode(':', array($secret, $pass['path'], $pass['qstr'], $pass['time'], $pass['expires']) ));
    $newhash = md5($secret.$newhash);


    // compare hashes
    if (strcmp($newhash, $pass['hash']) != 0 ) {
        return array(0, '04:Checksum error', 0);
    }

    return array(1, 'OK', $validFor);
}

/*---------------------------------------------------------------------------*/

function loadkey($pubid) {

    $keydata = file("http://www.bitpass.com/download/pubkey.php?pubid=$pubid&type=php");

    if ($keydata == FALSE) {
        return FALSE;
    } else {
        list($keysize, $e, $n) = explode(':', $keydata[0]);
        $pubkey = array('keysize' => intval($keysize), 'e' => $e, 'n' => $n);
        return $pubkey;
    }
}

/*---------------------------------------------------------------------------*/

function canonical_path($path) {

    $host = '';
    $path = trim($path);
    if ($path == '') {
	return '';
    }
    if ( $GLOBALS['bp_config']['WINDOWS'] ) {
	$path = str_replace("\\", "/", $path);

        // handle UNC sytle path
	if (preg_match("/^\/\/(\.|[\w-_]+)\/+(.*)$/", $path, $matches)) {
	    if ($matches[1] != ".") {
	        $host = '//'.$matches[1].'/';
	    }
	    $path = $matches[2];
	}
    }
    $path_arr = explode('/', $path);
    $cpath = array();
    $e = '';

    while (count($path_arr)) {
        $e = array_shift($path_arr);
        if (strlen($e) == 0) { continue; }
        if ($e ==  '.') { continue; };
        if ($e == '..') { array_pop($cpath); continue; };
        array_push($cpath, $e);
    }

    if (stristr($e, '.') == FALSE) {
        array_push($cpath, '');
    }

    return $host.($path[0] == '/' ? '/' : '').implode('/', $cpath);
}

function isAbsPath($path) {

	if ($path == '') {
		return 0;
	}
	
	if ( $GLOBALS['bp_config']['WINDOWS'] ) {
		$path = str_replace("\\", "/", $path);
	}
	if ($path['0'] == '/') {
		return 1;
	}
	if ( $GLOBALS['bp_config']['WINDOWS'] == 0 ) {
		// Unix
		return 0;
	}

	// Windows, check the drive name
	$colon = strchr($path, ':');
	if ($colon == 0) {
		return 0;// ':' not found or placed at first
	}
	$slash = strchr($path, '/');
	if ($slash > 0) {
		return ($slash > $colon);
	}
	return 1;
}

/*---------------------------------------------------------------------------*/
//
// RSA_Verify implements RSA signature verification (using PKCS1 v1.5 SS)
//
/*---------------------------------------------------------------------------*/

function RSA_Verify ($msg, $sig, $pubkey) {

    $n = $pubkey['n'];
    $e = $pubkey['e'];
    $k = intval($pubkey['keysize'] / 8);

    if (strlen($sig) != $k) {
        return FALSE;   // Invalid signature
    }

    if (isSet($GLOBALS['BCMATH']) && $GLOBALS['BCMATH']) {
         $phase0 = OS2I($sig);
         $phase1 = bcpowmod_wrap($phase0, $e, $n);
         $em0 = I2OS($phase1, $k-1);
    } else {
         $phase0 = OS2I_E($sig);
         $phase1 = bc_powmod($phase0, $e, $n);
         $em0 = I2OS_E($phase1, $k-1);
    }

    if (! ($em1 = encode($msg, $k-1)) ) {
        return FALSE;
    }

    if (strcmp($em0, $em1) == 0) {
        return TRUE;
    }

    return FALSE;
}

// RSA PKCS v1.5 SS
function encode($M, $emlen) {
    $T = base64_decode('MCAwDAYIKoZIhvcNAgUFAAQQ').pack("H*", md5($M));

    if ($emlen < strlen($T) + 10)
        return;

    return chr(1).str_repeat(chr(0xff), $emlen - strlen($T) - 2).chr(0).$T;
}

//
// core RSA operations; utilizing bcmath
//


// change function name since, bcpowmod function was added in php 5
function bcpowmod_wrap($m, $e, $n) {
    if (function_exists('bcpowmod')) {
	return bcpowmod($m, $e, $n);
    }
    $m = bcmod($m, $n);

    $erb = strrev(bcbin($e));
    $q = '1';

    $a[0] = $m;

    for ($i = 1; $i < strlen($erb); $i++) {
    	$a[$i] = bcmod(bcmul($a[$i-1], $a[$i-1]), $n);
    }

    for ($i = 0; $i < strlen($erb); $i++) {
    	if ($erb[$i] == '1') {
    	  $q = bcmod(bcmul($q, $a[$i]), $n);
        }
    }

    return $q;
}

function bcbin($o) {
    $r = '';
    while ($o != '0') {
        $m = bcmod($o, '4096');
        $r = substr('000000000000'.decbin(intval($m)), -12).$r;
        $o = bcdiv($o, '4096');
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = '0';

    return $r;
}

function OS2I($s) {
    $l = strlen($s);

    $n = ''.ord($s[$l-1]); $b = '256';

    for ($i = 1; $i < $l; $i++) {
        $n = bcadd($n, bcmul(ord($s[$l-($i+1)]), $b));
        $b = bcmul($b, '256');
    }

    return $n;
}

function I2OS($n, $l = -1) {
    $s = '';

    if ($l < 0) {
        while ($n != '0') {
            $s = chr(bcmod($n, '256')).$s;
            $n = bcdiv($n, '256');
        }
    } else {
        for ($i = 0; $i < $l; $i++) {
            $s = chr(bcmod($n, '256')).$s;
            $n = bcdiv($n, '256');
        }
    }

    return $s;
}

//
// core RSA operations; utilizing bcmath emulation
//
function bc_powmod($m, $e, $n) {
    $m = bc_mod($m, $n);

    $erb = strrev(bc_bin($e));
    $q = '1';

    $a[0] = $m;

    for ($i = 1; $i < strlen($erb); $i++) {
    	$a[$i] = bc_mod(bc_mul($a[$i-1], $a[$i-1]), $n);
    }

    for ($i = 0; $i < strlen($erb); $i++) {
    	if ($erb[$i] == '1') {
    	  $q = bc_mod(bc_mul($q, $a[$i]), $n);
        }
    }

    return $q;
}

function bc_bin($o) {
    $r = '';
    while ($o != '0') {
        list($o, $m) = bdiv($o, '4096');
        $r = substr('000000000000'.decbin(intval($m)), -12).$r;
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = '0';

    return $r;
}

function OS2I_E($s) {
    $l = strlen($s);

    $n = ''.ord($s[$l-1]); $b = '256';

    for ($i = 1; $i < $l; $i++) {
        $n = bc_add($n, bc_mul(ord($s[$l-($i+1)]), $b));
        $b = bc_mul($b, '256');
    }

    return $n;
}

function I2OS_E($n, $l = -1) {
    $s = '';

    if ($l < 0) {
        while ($n != '0') {
            list($n, $m) = bdiv($n, '256');
            $s = chr($m).$s;
        }
    } else {
        for ($i = 0; $i < $l; $i++) {
            list($n, $m) = bdiv($n, '256');
            $s = chr($m).$s;
        }
    }

    return $s;
}

/*---------------------------------------------------------------------------*/
//
// Arbitrary length interger arithmetic
//
// - based on Perl bigint package
//
/*---------------------------------------------------------------------------*/

function bc_add($a, $b) {

    $x_ar = internal($a);
    $y_ar = internal($b);

    $car = 0;

    $cx = count($x_ar);
    for ($x = 0; $x < $cx; $x++) {
        if (!(count($y_ar) || $car)) break;
        if ($car = (($x_ar[$x] += array_shift($y_ar) + $car) >= 1E7) ? 1 : 0) {
            $x_ar[$x] -= 1E7;
        }
    }
    $cy = count($y_ar);
    for ($y = 0; $y < $cy; $y++) {
        if (!$car) break;
        if ($car = (($y_ar[$y] += $car) >= 1E7) ? 1 : 0) $y_ar[$y] -= 1E7;
    }

    return external(array_merge($x_ar, $y_ar, array($car)));
}

function bc_div($a, $b) {
    list($d, $m) = bdiv($a, $b);
    return $d;
}

function bc_mod($a, $b) {
    list($d, $m) = bdiv($a, $b);
    return $m;
}

function bc_pow($m, $e) {

    if ($e == 0) return '1';
    if ($e == 1) return $m;

    $r = bc_mul($m,$m);
    if ($e == 2) return $r;

    $i = 2;

    while (2*$i < $e) {
        $r = bc_mul($r, $r);
        $i *= 2;
    }

    for ( ;$i < $e; $i++) {
        $r = bc_mul($r, $m);
    }

    return $r;
}

function bc_mul($a, $b) {
    $x_ar = internal($a);
    $y_ar = internal($b);

    $prod = array(0);
    $cx = count($x_ar);
    for ($x = 0; $x < $cx; $x++) {
        $car = $cty = 0;
        $cy = count($y_ar);
        for ($y = 0; $y < $cy; $y++) {
            $p = $x_ar[$x] * $y_ar[$y] + @$prod[$cty] + $car;
            @$prod[$cty++] = $p - ($car = intval($p / 1E7)) * 1E7;
        }
        if ($car) @$prod[$cty] += $car;
        $x_ar[$x] = array_shift($prod);
    }
    return external(array_merge($x_ar, $prod));
}

/*---------------------------------------------------------------------------*/
// Utility functions

function internal($a) {
    $b = strrev($a);
    $ar = array();

    while (strlen($b)) {
        array_push($ar, strrev(substr($b, 0, 7)));
        $b = substr($b, 7);
    }

    return $ar;
}

function external($ar) {

    $r = '';

    $ca = count($ar);

    for ($i = 0; $i < $ca; $i++) {
        if (strlen($ar[$i]) == 7) {
            $r = $ar[$i].$r;
        } else {
            $r = substr('000000000'.$ar[$i], -7).$r;
        }
    }

    $r = preg_replace('/^0+/', '', $r);
    if ($r == '') $r = 0;

    return $r;
}

function bcmp($a, $b) {

    if (strcmp($a,$b) ==0) return 0;

    $ld = strlen($a) - strlen($b);

    if ($ld != 0) return $ld;

    return strcmp($a, $b);
}

function bdiv($a, $b) {

    if (bcmp($a, $b) < 0) return array('0', $a);

    $x_ar = internal($a);
    $y_ar = internal($b);


    $car = $bar = $prd = $dd = 0;

    if (($dd = intval(1E7/(end($y_ar)+1))) != 1) {
        $cx = count($x_ar);
        for ($x = 0; $x < $cx; $x++) {
            $x_ar[$x] = $x_ar[$x] * $dd + $car;
            $x_ar[$x] -= ($car = intval($x_ar[$x] / 1E7)) * 1E7;
        }
        array_push($x_ar, $car); $car = 0;
        $cy = count($y_ar);
        for ($y = 0; $y < $cy; $y++) {
            $y_ar[$y] = $y_ar[$y] * $dd + $car;
            $y_ar[$y] -= ($car = intval($y_ar[$y] / 1E7)) * 1E7;
        }
    } else {
        array_push($x_ar, 0);
    }

    $q_ar = array(); 
    $v1 = end($y_ar);
    $v2 = (count($y_ar) > 1) ? $y_ar[count($y_ar)-2] : '';

    $cx = count($x_ar) - 1;
    $cy = count($y_ar) - 1;
    while ($cx > $cy) {
        $u0 = end($x_ar);
        $u1 = (count($x_ar) > 1) ? $x_ar[count($x_ar)-2] : '';
        $u2 = (count($x_ar) > 2) ? $x_ar[count($x_ar)-3] : '';

        $q = ($u0 == $v1) ? (1E7 - 1) : intval(($u0*1E7+$u1)/$v1);
        while ($v2*$q > ($u0*1E7+$u1-$q*$v1)*1E7+$u2) --$q;

        if ($q) {
            $car = $bar = 0;

            for ($y = 0, $x = $cx-$cy-1; $y <= $cy; ++$y,++$x) {
        	$prd = $q * $y_ar[$y] + $car;
        	$prd -= ($car = intval($prd / 1E7)) * 1E7;
                if ($bar = (($x_ar[$x] -= $prd + $bar) < 0)) $x_ar[$x] += 1E7;
            }
            if ($x_ar[$cx] < $car + $bar) {
        	$car = 0; --$q;
        	for ($y = 0, $x = $cx-$cy-1; $y <= $cy; ++$y,++$x) {
                    if ($car = (($x_ar[$x] += $y_ar[$y] + $car) > 1E7)) {
                        $x_ar[$x] -= 1E7;
        	    }
        	}
            }   
        }
        array_pop($x_ar);
        array_unshift($q_ar, $q);

        $cx = count($x_ar) - 1;
    }

    $d_ar = array();
    if ($dd != 1) {
        $car = 0;
        $x_rar = array_reverse($x_ar);
        foreach ($x_rar as $x) {
            $prd = $car*1E7 + $x;
            $car = $prd - ($tmp = intval($prd / $dd)) * $dd;
            array_unshift($d_ar, $tmp);
        }
    } else {
        $d_ar = $x_ar;
    }
    array_push($d_ar, 0);

    return array(external($q_ar), external($d_ar));
}

/*---------------------------------------------------------------------------*/
?>
