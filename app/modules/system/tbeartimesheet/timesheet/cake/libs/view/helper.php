<?php
/* SVN FILE: $Id: helper.php 4050 2006-12-02 03:49:35Z phpnut $ */
/**
 * Backend for helpers.
 *
 * Internal methods for the Helpers.
 *
 * PHP versions 4 and 5
 *
 * CakePHP :  Rapid Development Framework <http://www.cakephp.org/>
 * Copyright (c)	2006, Cake Software Foundation, Inc.
 *								1785 E. Sahara Avenue, Suite 490-204
 *								Las Vegas, Nevada 89104
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @filesource
 * @copyright		Copyright (c) 2006, Cake Software Foundation, Inc.
 * @link				http://www.cakefoundation.org/projects/info/cakephp CakePHP Project
 * @package			cake
 * @subpackage		cake.cake.libs.view
 * @since			CakePHP v 0.2.9
 * @version			$Revision: 4050 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-12-01 21:49:35 -0600 (Fri, 01 Dec 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Backend for helpers.
 *
 * Long description for class
 *
 * @package		cake
 * @subpackage	cake.cake.libs.view
 */
class Helper extends Object {
/**
 * Holds tag templates.
 *
 * @access public
 * @var array
 */
	var $tags = array('link' => '<a href="%s" %s>%s</a>',
							'mailto' => '<a href="mailto:%s" %s>%s</a>',
							'form' => '<form %s>',
							'input' => '<input name="data[%s][%s]" %s/>',
							'textarea' => '<textarea name="data[%s][%s]" %s>%s</textarea>',
							'hidden' => '<input type="hidden" name="data[%s][%s]" %s/>',
							'textarea' => '<textarea name="data[%s][%s]" %s>%s</textarea>',
							'checkbox' => '<input type="checkbox" name="data[%s][%s]" %s/>',
							'radio' => '<input type="radio" name="data[%s][%s]" id="%s" %s />%s',
							'selectstart' => '<select name="data[%s][%s]" %s>',
							'selectmultiplestart' => '<select name="data[%s][%s][]" %s>',
							'selectempty' => '<option value="" %s>&nbsp;</option>',
							'selectoption' => '<option value="%s" %s>%s</option>',
							'selectend' => '</select>',
							'password' => '<input type="password" name="data[%s][%s]" %s/>',
							'file' => '<input type="file" name="data[%s][%s]" %s/>',
							'file_no_model' => '<input type="file" name="%s" %s/>',
							'submit' => '<input type="submit" %s/>',
							'image' => '<img src="%s" %s/>',
							'tableheader' => '<th%s>%s</th>',
							'tableheaderrow' => '<tr%s>%s</tr>',
							'tablecell' => '<td%s>%s</td>',
							'tablerow' => '<tr%s>%s</tr>',
							'block' => '<div%s>%s</div>',
							'blockstart' => '<div%s>',
							'blockend' => '</div>',
							'css' => '<link rel="%s" type="text/css" href="%s" %s/>',
							'style' => '<style type="text/css"%s>%s</style>',
							'charset' => '<meta http-equiv="Content-Type" content="text/html, charset=%s" />',
							'javascriptblock' => '<script type="text/javascript">%s</script>',
							'javascriptlink' => '<script type="text/javascript" src="%s"></script>');
/**
 * Parses custom config/tags.ini.php and merges with $this->tags.
 *
 * @return html tags used by helpers
 */
	function loadConfig() {

		if (file_exists(APP . 'config' . DS . 'tags.ini.php')) {
			$tags = $this->readConfigFile(APP . 'config' . DS . 'tags.ini.php');
			$this->tags = am($this->tags, $tags);
		}
		return $this->tags;
	}
/**
 * Decides whether to output or return a string.
 *
 * Based on AUTO_OUTPUT and $return's value, this method decides whether to
 * output a string, or return it.
 *
 * @param  string  $str	String to be output or returned.
 * @param  boolean $return Whether this method should return a value or output it.
 * @return mixed	Either string or echos the value, depends on AUTO_OUTPUT and $return.
 */
	function output($str, $return = false) {
		if (AUTO_OUTPUT && $return === false) {
			echo $str;
		} else {
			return $str;
		}
	}
/**
 * Assigns values to tag templates.
 *
 * Finds a tag template by $keyName, and replaces $values's keys with
 * $values's keys.
 *
 * @param  string $keyName Name of the key in the tag array.
 * @param  array  $values  Values to be inserted into tag.
 * @return string Tag with inserted values.
 */
	function assign($keyName, $values) {
		return str_replace('%%' . array_keys($values) . '%%', array_values($values), $this->tags[$keyName]);
	}
/**
 * Returns an array of settings in given INI file.
 *
 * @param string $fileName ini file to read
 * @return array of lines from the $fileName
 */
	function readConfigFile($fileName) {
		$fileLineArray = file($fileName);

		foreach($fileLineArray as $fileLine) {
			$dataLine = trim($fileLine);
			$firstChar = substr($dataLine, 0, 1);

			if ($firstChar != ';' && $dataLine != '') {
				if ($firstChar == '[' && substr($dataLine, -1, 1) == ']') {
					// [section block] we might use this later do not know for sure
					// this could be used to add a key with the section block name
					// but it adds another array level
				} else {
					$delimiter = strpos($dataLine, '=');

					if ($delimiter > 0) {
						$key = strtolower(trim(substr($dataLine, 0, $delimiter)));
						$value = trim(stripcslashes(substr($dataLine, $delimiter + 1)));

						if (substr($value, 0, 1) == '"' && substr($value, -1) == '"') {
							$value = substr($value, 1, -1);
						}

						$iniSetting[$key] = $value;

					} else {
						$iniSetting[strtolower(trim($dataLine))] = '';
					}
				}
			} else {
			}
		}

		return $iniSetting;
	}
/**
 * After render callback.  Overridden in subclasses.
 *
 * @return void
 */
	function afterRender() {
	}
}
?>