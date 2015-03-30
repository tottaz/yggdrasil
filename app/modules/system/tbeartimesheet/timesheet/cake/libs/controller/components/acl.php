<?php
/* SVN FILE: $Id: acl.php 4009 2006-11-28 10:19:40Z phpnut $ */
/**
 * Access Control List factory class.
 *
 * Permissions system.
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
 * @since			CakePHP v 0.10.0.1076
 * @version			$Revision: 4009 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-11-28 04:19:40 -0600 (Tue, 28 Nov 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Access Control List factory class.
 *
 * Looks for ACL implementation class in core config, and returns an instance of that class.
 *
 * @package		cake
 * @subpackage	cake.cake.libs.controller.components
 */
class AclComponent extends Object {
/**
 * Instance of ACL_CLASSNAME set in app/config/core.php
 *
 * @var object
 */
	var $_instance = null;
/**
 * Enter description here...
 *
 * @var boolean
 */
	var $controller = true;
/**
 * Constructor.
 *
 * Will return an instance of the correct ACL class.
 */
	function __construct() {
		$this->getACL();
	}
/**
 * Static function used to gain an instance of the correct ACL class.
 *
 * @return object instance of ACL_CLASSNAME set in app/config/core.php
 * @access public
 */
	function &getACL() {
		if ($this->_instance == null) {
			uses('controller' . DS . 'components' . DS . ACL_FILENAME);
			$classname = ACL_CLASSNAME;
			$this->_instance = new $classname;
		}

		if($classname == 'DB_ACL') {
			$this->Aro = new Aro();
			$this->Aco = new Aro();
		}
		return $this->_instance;
	}
/**
 * Empty class defintion, to be overridden in subclasses.
 *
 * @access public
 */
	function _initACL() {
	}
/**
 * Pass-thru function for ACL check instance.
 *
 * @param string $aro
 * @param string $aco
 * @param string $action : default = *
 * @return boolean
 * @access public
 */
	function check($aro, $aco, $action = "*") {
		return $this->_instance->check($aro, $aco, $action);
	}
/**
 * Pass-thru function for ACL allow instance.
 *
 * @param string $aro
 * @param string $aco
 * @param string $action : default = *
 * @return boolean
 * @access public
 */
	function allow($aro, $aco, $action = "*") {
		return $this->_instance->allow($aro, $aco, $action);
	}
/**
 * Pass-thru function for ACL deny instance.
 *
 * @param string $aro
 * @param string $aco
 * @param string $action : default = *
 * @return boolean
 * @abstract public
 */
	function deny($aro, $aco, $action = "*") {
		return $this->_instance->deny($aro, $aco, $action);
	}
/**
 * Pass-thru function for ACL inherit instance.
 *
 * @return boolean
 * @abstract public
 */
	function inherit($aro, $aco, $action = "*") {
		return $this->_instance->inherit($aro, $aco, $action);
	}
/**
 * Pass-thru function for ACL grant instance.
 *
 * @param string $aro
 * @param string $aco
 * @param string $action : default = *
 * @return boolean
 * @access public
 */
	function grant($aro, $aco, $action = "*") {
		return $this->_instance->grant($aro, $aco, $action);
	}
/**
 * Pass-thru function for ACL grant instance.
 *
 * @param string $aro
 * @param string $aco
 * @param string $action : default = *
 * @return boolean
 * @access public
 */
	function revoke($aro, $aco, $action = "*") {
		return $this->_instance->revoke($aro, $aco, $action);
	}
/**
 * Sets the current ARO instance to object from getAro
 *
 * @param string $id
 * @return boolean
 * @access public
 */
	function setAro($id) {
		return $this->Aro = $this->_instance->getAro($id);
	}
/**
* Sets the current ACO instance to object from getAco
 *
 * @param string $id
 * @return boolean
 * @access public
 */
	function setAco($id) {
		return $this->Aco = $this->_instance->getAco($id);
	}
/**
 * Pass-thru function for ACL getAro instance
 * that gets an ARO object from the given id or alias
 *
 * @param string $id
 * @return object Aro
 * @access public
 */
	function getAro($id) {
		return $this->_instance->getAro($id);
	}
/**
 * Pass-thru function for ACL getAco instance.
 * that gets an ACO object from the given id or alias
 *
 * @param string $id
 * @return object Aco
 * @access public
 */
	function getAco($id) {
		return $this->_instance->getAco($id);
	}
}
?>