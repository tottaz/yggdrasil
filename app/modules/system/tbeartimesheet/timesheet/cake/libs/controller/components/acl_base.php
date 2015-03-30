<?php
/* SVN FILE: $Id: acl_base.php 4043 2006-12-01 02:47:40Z phpnut $ */
/**
 * Access Control List abstract class.
 *
 * Long description for file
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
 * @subpackage		cake.cake.libs.controller.components
 * @since			CakePHP v 0.10.0.1232
 * @version			$Revision: 4043 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-11-30 20:47:40 -0600 (Thu, 30 Nov 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Access Control List abstract class. Not to be instantiated.
 * Subclasses of this class are used by AclComponent to perform ACL checks in Cake.
 *
 * @package 	cake
 * @subpackage	cake.cake.libs.controller.components
 * @abstract
 */
class AclBase{
/**
 * This class should never be instantiated, just subclassed.
 *
 * No instantiations or constructor calls (even statically)
 *
 * @return AclBase
 * @abstract
 */
	function AclBase() {
		if (strcasecmp(get_class($this), "AclBase") == 0 || !is_subclass_of($this, "AclBase")) {
			trigger_error("[acl_base] The AclBase class constructor has been called, or the class was instantiated. This class must remain abstract. Please refer to the Cake docs for ACL configuration.", E_USER_ERROR);
			return null;
		}
	}
/**
 * Empty method to be overridden in subclasses
 *
 * @param string $aro
 * @param string $aco
 * @param string $action
 * @abstract
 */
	function check($aro, $aco, $action = "*") {
	}
}
?>