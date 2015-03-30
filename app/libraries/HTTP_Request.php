<?php
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------
*/
/**
 * HTTP Request
 * 
 * A web crawler which behaves just like a regular web browser, interpreting
 * location redirects and storing cookies automatically.
 *
 * LICENSE
 *
 * Copyright (c) 2011 Bruno De Barros <bruno@terraduo.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author     Bruno De Barros <bruno@terraduo.com>
 * @copyright  Copyright (c) 2011 Bruno De Barros <bruno@terraduo.com>
 * @license    http://opensource.org/licenses/mit-license     MIT License
 * @version 1.0.0
 * 
 */
class HTTP_Request {

    public $cookies = array();
    public $user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8';
    public $last_url = '';
    public $multipart = false;
    public $redirections = 0;

    function __construct() {
	
    }

    function request($url, $mode = 'GET', $data = array(), $save_to_file = false) {
	if (!stristr($url, 'http://') and !stristr($url, 'https://')) {
	    $url = 'http://' . $url;
	}
	$original = $url;
	$url = parse_url($url);
	if (!isset($url['host'])) {
	    print_r($url);
	    throw new Exception("Failed to parse the given URL correctly.");
	}
	if (!isset($url['path'])) {
	    $url['path'] = '/';
	}
	if (!isset($url['query'])) {
	    $url['query'] = '';
	}
	$errno = 0;
	$errstr = '';
	$fp = @fsockopen($url['host'], 80, $errno, $errstr, 30);
	if (!$fp) {
	    throw new Exception("Failed to connect to {$url['host']}.");
	} else {
	    $out = "$mode {$url['path']}?{$url['query']} HTTP/1.0\r\n";
	    $out .= "Host: {$url['host']}\r\n";
	    $out .= "User-Agent: {$this->user_agent}\r\n";
	    if (count($this->cookies) > 0) {
		$out .= "Cookie: ";
		$i = 0;
		foreach ($this->cookies as $name => $cookie) {
		    if ($i == 0) {
			$out .= "$name=$cookie";
			$i = 1;
		    } else {
			$out .= "; $name=$cookie";
		    }
		}
		$out .= "\r\n";
	    }
	    if (!empty($this->last_url)) {
		$out .= "Referer: " . $this->last_url . "\r\n";
	    }
	    $out .= "Connection: Close\r\n";

	    if ($mode == "POST") {
		if (!$this->multipart) {
		    $out .= "Content-Type: application/x-www-form-urlencoded\r\n";
		    $post = self::urlencodeArray($data, $this->multipart);
		} else {
		    $out .= "Content-Type: multipart/form-data; boundary=AaB03x\r\n";
		    $post = self::urlencodeArray($data, $this->multipart, 'AaB03x');
		}
		$out .= "Content-Length: " . strlen($post) . "\r\n";
		$out .= "\r\n";
		$out .= $post;
	    } else {
		$out .= "\r\n";
	    }

	    $content = '';
	    $header = '';
	    $header_passed = false;

	    if (fwrite($fp, $out)) {

		if (stristr($original, 'http://')) {
		    $this->last_url = $original;
		} else {
		    $this->last_url = "http://" . $original;
		}

		if ($save_to_file) {
		    $fh = fopen($save_to_file, 'w+');
		}

		while (!feof($fp)) {
		    $line = fgets($fp);
		    if ($line == "\r\n" and !$header_passed) {
			$header_passed = true;

			$header = self::parseHeaders($header);

			if (isset($header['Set-Cookie'])) {
			    if (is_array($header['Set-Cookie'])) {
				foreach ($header['Set-Cookie'] as $cookie) {
				    $cookie = explode(';', $cookie);
				    $cookie = explode('=', $cookie[0], 2);
				    $this->cookies[$cookie[0]] = $cookie[1];
				}
			    } else {
				$header['Set-Cookie'] = explode(';', $header['Set-Cookie']);
				$header['Set-Cookie'] = explode('=', $header['Set-Cookie'][0], 2);
				$this->cookies[$header['Set-Cookie'][0]] = $header['Set-Cookie'][1];
			    }
			}

			if (isset($header['Location']) and $this->redirections < 10) {

			    $location = parse_url($header['Location']);
			    if (!isset($location['host'])) {
				# It's a relative URL, let's take care of it.
				$path = explode('/', $url['path']);
				array_pop($path);
				$header['Location'] = 'http://' . $url['host'] . implode('/', $path) . '/' . $header['Location'];
			    }
			    $this->redirections++;
			    $content = $this->request($header['Location'], $mode, $data, $save_to_file);
			    break;
			}
		    }
		    if ($header_passed) {
			if (!$save_to_file) {
			    $content .= $line;
			} else {
			    fwrite($fh, $line);
			}
		    } else {
			$header .= $line;
		    }
		}
		fclose($fp);
		if ($save_to_file) {
		    fclose($fh);
		}
		return trim($content);
	    } else {
		throw new Exception("Failed to send request headers to $url.");
	    }
	}
    }

    public static function urlencodeArray($data, $multipart = false, $boundary = '') {
	$return = "";
	$i = 0;

	if ($multipart) {
	    $return .= '--' . $boundary;
	}

	foreach ($data as $key => $value) {
	    if (!$multipart) {
		if ($i == 0) {
		    $return .= urlencode($key) . "=" . urlencode($value);
		    $i = 1;
		} else {
		    $return .= "&" . urlencode($key) . "=" . urlencode($value);
		}
	    } else {
		$return .= "\r\n" . 'Content-Disposition: form-data; name="' . $key . '"' . "\r\n" . "\r\n";
		$return .= $value . "\r\n";
		$return .= '--' . $boundary;
	    }
	}

	if ($multipart) {
	    $return .= '--';
	}
	return $return;
    }

    public static function GetBetween($content, $start, $end) {
	$r = explode($start, $content);
	if (isset($r[1])) {
	    $r = explode($end, $r[1]);
	    return $r[0];
	}
	return '';
    }

    public static function parseHeaders($headers) {
	$return = array();
	$headers = explode("\r\n", $headers);
	$response = explode(" ", $headers[0]);
	$return['STATUS'] = $response[1];
	unset($headers[0]);
	foreach ($headers as $header) {
	    $header = explode(": ", $header, 2);
	    if (!isset($return[$header[0]])) {
		if (isset($header[1])) {
		    $return[$header[0]] = $header[1];
		}
	    } else {
		if (!is_array($return[$header[0]])) {
		    $return[$header[0]] = array($return[$header[0]]);
		}
		$return[$header[0]][] = $header[1];
	    }
	}
	return $return;
    }

}