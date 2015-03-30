<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

// No Permission
defined('_JEXEC') or die('Restricted Access');

// Imports
jimport('joomla.filesystem.file');

// Utility class
class TbearUtility {
	
	static $props = array();
	
	function __construct() {
		// Get config object
		$this->TbearConfig = TbearFactory::getConfig();
	}

	function render($path) {
		ob_start();
		require_once($path);
		$contents = ob_get_contents();
		ob_end_clean();
		
		return $contents;
	}
    
    function get($name, $default = null) {
        if (!is_array(self::$props) || !isset(self::$props[$name])) {
            return $default;
        }
        
        return self::$props[$name];
    }
    
    function set($name, $value) {
        if (!is_array(self::$props)) {
            self::$props = array();
        }
        
        $previous = self::get($name);
        self::$props[$name] = $value;
        
        return $previous;
    }
	
	function &getMenu() {
		jimport('joomla.application.menu');
		$options = array();
		
		$menu =& JMenu::getInstance('site', $options);
		
		if (JError::isError($menu)) {
			$null = null;
			return $null;
		}
		
		return $menu;
	}
	
	function getComponents() {
		static $components;
		
		if(!isset($components)) {
			$filter = "'com_sef', 'com_sh404sef', 'com_joomfish', 'com_config', 'com_media', 'com_installer', 'com_templates', 'com_plugins', 'com_modules', 'com_cpanel', 'com_cache', 'com_messages', 'com_menus', 'com_massmail', 'com_languages', 'com_users'";
			$rows = $this->_getList("SELECT `name`, `option` FROM `#__components` WHERE `parent` = '0' AND `option` != '' AND `option` NOT IN ({$filter}) ORDER BY `name`");
			
			foreach($rows as $row) {
				$components[] = JHTML::_('select.option', $row->option, $row->name);
			}
		}
		
		return $components;
	}
	
	function getExtensionFromRequest() {
		static $extension;
		
		if (!isset($extension)) {
			$cid = JRequest::getVar('cid', array(0), 'method', 'array');
			$extension = AceDatabase::loadResult("SELECT extension FROM #__acesef_extensions WHERE id = ".$cid[0]);
		}
		
		return $extension;
	}
	
	function getOptionFromRealURL($url) {
		$url = str_replace('&amp;', '&', $url);
		$url = str_replace('index.php?', '', $url);		
		parse_str($url, $vars);
		
		if (isset($vars['option'])) {
			return $vars['option'];
		} else {
			return '';
		}
	}
	
	function getRemoteInfo() {
		// Get config object
		if (!isset($this->TbearConfig)) {
			$this->TbearConfig = TbearFactory::getConfig();
		}
		
		static $information;
		
		if ($this->TbearConfig->cache_versions == 1) {
			$cache = TbearFactory::getCache('86400');
			$information = $cache->load('versions');
		}
		
		
		if (!is_array($information)) {
			$information = array();
			$information['acesef'] = '?.?.?';
			
			$content = self::getRemoteData('http://www.joomace.net/index.php?option=com_aceversions&view=xml&format=xml');
			
			if (strstr($content, '<?xml version="1.0" encoding="UTF-8" ?>')) {
				$xml =& JFactory::getXMLparser('Simple');
				$xml->loadString($content);
				$manifest = $xml->document;
				
				$br_ext = $br_com = false;
				foreach ($manifest->children() as $category) {
					$cat_name = $category->attributes('name');
					
					if ($cat_name == 'acesef extensions') {
						foreach ($category->children() as $extension) {
							$option = $extension->attributes('option');
							
							$ext = new stdClass();
							$ext->version	= trim($extension->attributes('version'));
							$ext->link		= str_replace('http://www.joomace.net/', '', trim($extension->attributes('download')));
						
							$information[$option] = $ext;
						}
						$br_ext = true;
					} 
					elseif ($cat_name == 'components') {
						foreach ($category->children() as $extension) {
							$option = $extension->attributes('option');
		
							if ($option == 'com_acesef') {
								$information['acesef'] = trim($extension->attributes('version'));
								break;
							}
						}
						$br_com = true;
					}
					
					if ($br_ext && $br_com) {
						break;
					}
				}
				
				if ($this->TbearConfig->cache_versions == 1) {
					$cache->save($information, 'versions');
				}
			}
		}
		
		return $information;
	}
	
    function replaceLoop($search, $replace, $text) {
        $count = 0;
		
		while ((strpos($text, $search) !== false) && ($count < 10)) {
            $text = str_replace($search, $replace, $text);
			$count++;
        }

        return $text;
    }
	
	function _multiLayeredCheckup($section, $text, $ext_params, $area, $url_params, $component, $real_url, $own_page = false) {
		$_area = $section."_area";
		$_components = $section."_components";
		$_cats = $section."_cats";
		$_enable_cats = $section."_enable_cats";
		$_in_cats = $section."_in_cats";
		$cat = TbearUtility::get('category.param');
		
		if (empty($text)) {
			return false;
		}
		
		$cfg_area = self::_getArea($ext_params->get($_area, 'global'), $this->TbearConfig->$_area);
		if (strcasecmp($cfg_area, $area) != 0) {
			return false;
		}
		
		if (!in_array($component, $this->TbearConfig->$_components)) {
			return false;
		}
		
		if (self::getConfigState($ext_params, $_enable_cats) && ($cat[$_cats.'_status'] == 0 && $cat['_flag'] == 1)) {
			return false;
		}
		if (!self::getConfigState($ext_params, $_in_cats) && $cat['_is_cat'] == 1) {
			return false;
		}
		
		if (self::getParam($url_params, $section) != 1) {
			return false;
		}
		
		if ($own_page && (strcasecmp($real_url, $cat['_real_url']) != 0)) {
			return false;
		}
		
		return true;
	}

	function _getArea($param, $config) {
        if (($param == '1') || ($param == 'global' && $config == '1')) {
            return 'content';
        } elseif (($param == '2') || ($param == 'global' && $config == '2')) {
            return 'component';
        } elseif (($param == '3') || ($param == 'global' && $config == '3')) {
            return 'trigger';
        } 
    }

	function _urlFilter($section, $sef_url, $real_url, $ext_params) {
		$var_s = $section.'_auto_filter_s';
		$var_r = $section.'_auto_filter_r';
		
		$ext_s = $ext_params->get($var_s, '');
		$ext_r = $ext_params->get($var_r, '');
		
		$in_filter = false;
		
		// Get filters
		$global_s_filter = explode(', ', $this->TbearConfig->$var_s);
		$global_r_filter = explode(', ', $this->TbearConfig->$var_r);
		$extension_s_filter = explode(', ', $ext_s);
		$extension_r_filter = explode(', ', $ext_r);
		
		// Combine filters
		$s_filters = array_unique(array_merge($global_s_filter, $extension_s_filter));
		$r_filters = array_unique(array_merge($global_r_filter, $extension_r_filter));
		
		foreach ($s_filters as $filter) {
			if (!empty($filter)) {
				$pos_sef = strpos($sef_url, $filter);
				if ($pos_sef !== false) {
					$in_filter = true;
				}
			}
		}
		
		foreach ($r_filters as $filter) {
			if (!empty($filter)) {
				$pos_real = strpos($real_url, $filter);
				if ($pos_real !== false) {
					$in_filter = true;
				}
			}
		}
		
        return $in_filter;
    }
    
    function getSefStatus() {
        static $status;
        
        if (!isset($status)) {
			$JoomlaConfig =& JFactory::getConfig();
			
            $status = array();
            $status['version_checker'] = (bool)$this->TbearConfig->version_checker;
            $status['php'] = (bool)version_compare(PHP_VERSION, '5.0.0', '>');
			$status['s_mod_rewrite'] = '';
			if (function_exists('apache_get_modules')) {
				$modules = apache_get_modules();
				$status['s_mod_rewrite'] = (bool)in_array('mod_rewrite', $modules);
			}
            $status['sef'] = (bool)$JoomlaConfig->getValue('sef');
            $status['mod_rewrite'] = (bool)$JoomlaConfig->getValue('sef_rewrite');
			$status['htaccess'] = false;
			if (file_exists(JPATH_ROOT.DS.'.htaccess')) {
				$filesize = filesize(JPATH_ROOT.DS.'.htaccess');
				$status['htaccess'] = (bool)($filesize > 2060);
			}
            $status['live_site'] = $JoomlaConfig->getValue('live_site');
			if (TbearUtility::JoomFishInstalled()) {
				$status['jfrouter'] = JPluginHelper::isEnabled('system', 'jfrouter');
			}
            $status['acesef'] = (bool)$this->TbearConfig->mode;
            $status['plugin'] = JPluginHelper::isEnabled('system', 'acesef');
            $status['generate_sef'] = (bool)$this->TbearConfig->generate_sef;
        }
        
        return $status;
    }
	
	function JoomFishInstalled() {
        static $installed;
		
        if (!isset($installed)) {
            $installed = JFile::exists(JPATH_ROOT.DS.'administrator'.DS.'components'.DS.'com_joomfish'.DS.'joomfish.php');
        }
		
        return $installed;
    }
	
	function backupDB($query, $file_name, $fields, $line) {
		$sql_data = '';
		
		$rows = AceDatabase::loadObjectList($query);

		if (!empty($rows)) {
			foreach ($rows as $row) {
				$values = array();
				foreach ($fields as $field) {
					if (isset($row->$field)) {
						$values[] = "'".self::_cleanBackupFields($row->$field)."'";
					} else {
						$values[] = "''";
					}
				}
				$sql_data .= $line." VALUES (".implode(', ', $values).");\n";;
			}
		} else {
			return false;
		}

		if(!headers_sent()) {
			// flush the output buffer
			while(ob_get_level() > 0) {
				ob_end_clean();
			}

			ob_start();
			header ('Expires: 0');
			header ('Last-Modified: '.gmdate ('D, d M Y H:i:s', time()) . ' GMT');
			header ('Pragma: public');
			header ('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header ('Accept-Ranges: bytes');
			header ('Content-Length: ' . strlen($sql_data));
			header ('Content-Type: Application/octet-stream');
			header ('Content-Disposition: attachment; filename="'.$file_name.'"');
			header ('Connection: close');

			echo($sql_data);

			ob_end_flush();
			die();
			return true;
		} else {
			return false;
		}
    }
	
	// Clean backup fields
	function _cleanBackupFields($text) {
		$text = str_replace(array('\r\n', '\r', '\n', '\t', '\n\n', '`', '”', '“', '¿', '\0', '\x0B'), ' ', $text);
		$text = preg_replace('/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/', ' ', $text);
		$text = preg_replace('/\s/u', ' ', $text);
		$text = stripslashes($text);
		$text = self::replaceSpecialChars($text);
		$text = str_replace('\\', '\\', $text);
		
		return $text;
	}
	
	function getParam($text, $param) {
		$params = new JParameter($text);
		return $params->get($param);
	}
	
	function storeParams($table, $id, $db_field, $new_params) {
		$row = TbearFactory::getTable($table);
		if (!$row->load($id)) {
			return false;
		}
		
		$params = new JParameter($row->$db_field);
		
		foreach ($new_params as $name => $value) {
			$params->set($name, $value);
		}
		
		$row->$db_field = $params->toString();
		
		if (!$row->check()) {
			return false;
		}
		
		if (!$row->store()) {
			return false;
		}
	}
	
	function getRemoteData($url) {
		$user_agent = "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)";
		$data = false;

		// cURL
		if (extension_loaded('curl')) {
			// Init cURL
			$ch = @curl_init();
			
			// Set options
			@curl_setopt($ch, CURLOPT_URL, $url);
			@curl_setopt($ch, CURLOPT_HEADER, 0);
			@curl_setopt($ch, CURLOPT_FAILONERROR, 1);
			@curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			@curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
			
			// Set timeout
			@curl_setopt($ch, CURLOPT_TIMEOUT, 5);
			
			// Grab data
			$data = @curl_exec($ch);
			
			// Clean up
			@curl_close($ch);
			
			// Return data
			if ($data !== false) {
				return $data;
			}
		}

		// fsockopen
		if (function_exists('fsockopen')) {
			$errno = 0;
			$errstr = '';
			
			$url_info = parse_url($url);
			if($url_info['host'] == 'localhost')  {
				$url_info['host'] = '127.0.0.1';
			}

			// Open socket connection
			$fsock = @fsockopen($url_info['scheme'].'://'.$url_info['host'], 80, $errno, $errstr, 5);
		
			if ($fsock) {				
				@fputs($fsock, 'GET '.$url_info['path'].(!empty($url_info['query']) ? '?'.$url_info['query'] : '').' HTTP/1.1'."\r\n");
				@fputs($fsock, 'HOST: '.$url_info['host']."\r\n");
				@fputs($fsock, "User-Agent: ".$user_agent."\n");
				@fputs($fsock, 'Connection: close'."\r\n\r\n");
		
				// Set timeout
				@stream_set_blocking($fsock, 1);
				@stream_set_timeout($fsock, 5);
				
				$data = '';
				$passed_header = false;
				while (!@feof($fsock)) {
					if ($passed_header) {
						$data .= @fread($fsock, 1024);
					} else {
						if (@fgets($fsock, 1024) == "\r\n") {
							$passed_header = true;
						}
					}
				}
				
				// Clean up
				@fclose($fsock);
				
				// Return data
				if ($data !== false) {
					return $data;
				}
			}
		}

		// fopen
		if (function_exists('fopen') && ini_get('allow_url_fopen')) {
			// Set timeout
			if (ini_get('default_socket_timeout') < 5) {
				ini_set('default_socket_timeout', 5);
			}
			@stream_set_blocking($handle, 1);
			@stream_set_timeout($handle, 5);
			@ini_set('user_agent',$user_agent);
			
			$url = str_replace('://localhost', '://127.0.0.1', $url);
			
			$handle = @fopen ($url, 'r');
			
			if ($handle) {
				$data = '';
				while (!feof($handle)) {
					$data .= @fread($handle, 8192);
				}
				
				// Clean up
				@fclose($handle);
			
				// Return data
				if ($data !== false) {
					return $data;
				}
			}
		}
		
		// file_get_contents
		if(function_exists('file_get_contents') && ini_get('allow_url_fopen')) {
			$url = str_replace('://localhost', '://127.0.0.1', $url);
			@ini_set('user_agent',$user_agent);
			$data = @file_get_contents($url);
			
			// Return data
			if ($data !== false) {
				return $data;
			}
		}
		
		return $data;
	}
	
	// Clear texts from unwanted chars
	function cleanText($text) {
		$text = strip_tags($text);
		$text = preg_replace(array('/&amp;quot;/', '/&amp;nbsp;/', '/&amp;lt;/', '/&amp;gt;/', '/&amp;copy;/', '/&amp;amp;/', '/&amp;euro;/', '/&amp;hellip;/'), ' ', $text);
		$text = preg_replace(array('/&quot;/', '/&nbsp;/', '/&lt;/', '/&gt;/', '/&copy;/', '/&amp;/', '/&euro;/', '/&hellip;/'), ' ', $text);
		$text = preg_replace("'<script[^>]*>.*?</script>'si", ' ', $text);
		$text = preg_replace('/<a\s+.*?href="([^"]+)"[^>]*>([^<]+)<\/a>/is', '\2 (\1)', $text);
		$text = preg_replace('/<!--.+?-->/', ' ', $text);
		$text = preg_replace('/{.+?}/', ' ', $text);
		$text = preg_replace('(\{.*?\})', ' ', $text);
		$text = preg_replace('/\s\s+/', ' ', $text);
		$text = preg_replace('/\n\n+/s', ' ', $text);
		$text = preg_replace('/<[^<|^>]*>/u', ' ', $text);
		$text = preg_replace('/{[^}]*}[\s\S]*{[^}]*}/u', ' ', $text);
		$text = preg_replace('/{[^}]*}/u', ' ', $text);
        $text = trim($text);
		$text = str_replace(array('\r\n', '\r', '\n', '\t', '\n\n', '<', '>', ':', '#', '`', '”', '“', '¿', '\0', '\x0B', '"', '&quot;', '&quot'), ' ', $text);
		$text = preg_replace('/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/', ' ', $text);
		while(strpos($text, '  ')) {
			$text = str_replace('  ', ' ', $text);
		}
		
		// Space
		$text = preg_replace('/\s/u', ' ', $text);
		
		// Special chars
		$text = self::replaceSpecialChars($text);
		
		$text = rtrim($text, "'");
		$text = rtrim($text, "\\");
		
        return $text;
    }
	
	// Replace some special chars
	function replaceSpecialChars($text, $reverse = false) {
		if (is_string($text)) {
			if (!$reverse) {
				$text = str_replace("\'", "'", $text);
				$text = addslashes($text);
			} else {
				$text = stripslashes($text);
			}
		}
		
		return $text;
	}
	
	// Get text from XML
	function getXmlText($file, $variable) {
		// Try to find variable
		$value = null;
		if (JFile::exists($file)) {
			$xml =& JFactory::getXMLParser('Simple');
			if ($xml->loadFile($file)) {
				$root =& $xml->document;
				$element =& $root->getElementByPath($variable);
				$value = $element ? $element->data() : '';
			}
		}
		return $value;
    }
	
	// Get Menu title
	function getMenuTitle($Itemid) {
		if (empty($Itemid)) {
			return array();
		}
		
		static $menus = array();
		
		$id = $Itemid;
		if (!isset($menus[$id])) {
			$joomfish = $this->TbearConfig->joomfish_trans_url ? ', id' : '';
			
			// Title or Alias
			$part = 'name';
			if ($this->TbearConfig->menu_url_part == 'alias') {
				$part = 'alias';
			}
			
			$menus[$id] = array();
			
			while ($Itemid > 0) {
				$row = AceDatabase::loadObject("SELECT $part AS name, parent$joomfish FROM #__menu WHERE id = '$Itemid' AND published > 0");
				
				if (is_null($row)) {
					break;
				}
				
				array_unshift($menus[$id], $row->name);
				
				$Itemid = $row->parent;
				if ($this->TbearConfig->parent_menus == '0') {
					break; //  Only last one
				}
			}
		}
        
        return $menus[$id];
    }
	
	// No follow links
	function noFollow($match) {
		$uri =& JFactory::getURI();
	
		if (self::_getDomainFromLink($match[3]) != $uri->getHost() && !self::_alreadyNofollow($match[1]) && !self::_alreadyNofollow($match[4])) {
			return '<a href="'.$match[2].'//'.$match[3].'"'.$match[1].$match[4].' rel="nofollow" >'.$match[5].'</a>';
		} else {
			return '<a href="'.$match[2].'//'.$match[3].'"'.$match[1].$match[4].'>'.$match[5].'</a>';
		}
	}
	
	function _getDomainFromLink($url) {
		preg_match("/^(http:\/\/)?([^\/]+)/i", $url, $match);
		$domain = $match[2];
		preg_match("/[^\.\/]+\.[^\.\/]+$/", $domain, $match);
		return $match[0];
	}
	
	function _alreadyNofollow($text) {
		return (preg_match("/rel=[\"\'].*?nofollow.*?[\"\']/i", $text )) ? true : false ;
	}
}
?>