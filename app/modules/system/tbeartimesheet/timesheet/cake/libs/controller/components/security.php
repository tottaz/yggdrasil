<?php
/* SVN FILE: $Id: security.php 4064 2006-12-04 05:29:12Z phpnut $ */
/**
 * Short description for file.
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
 * @since			CakePHP v 0.10.8.2156
 * @version			$Revision: 4064 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-12-03 23:29:12 -0600 (Sun, 03 Dec 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Short description for file.
 *
 * Long description for file
 *
 * @package		cake
 * @subpackage	cake.cake.libs.controller.components
 */
class SecurityComponent extends Object {
/**
 * Holds an instance of the core Security object
 *
 * @var object Security
 * @access public
 */
	var $Security = null;
/**
 * The controller method that will be called if this request is black-hole'd
 *
 * @var string
 * @access public
 */
	var $blackHoleCallback = null;
/**
 * List of controller actions for which a POST request is required
 *
 * @var array
 * @access public
 * @see SecurityComponent::requirePost()
 */
	var $requirePost = array();
/**
 * List of actions that require a valid authentication key
 *
 * @var array
 * @access public
 * @see SecurityComponent::requireAuth()
 */
	var $requireAuth = array();
/**
 * Controllers from which actions of the current controller are allowed to receive
 * requests.
 *
 * @var array
 * @see SecurityComponent::requireAuth()
 */
	var $allowedControllers = array();
/**
 * Actions from which actions of the current controller are allowed to receive
 * requests.
 *
 * @var array
 * @see SecurityComponent::requireAuth()
 */
	var $allowedActions = array();
/**
 * Other components used by the Security component
 *
 * @var array
 * @access public
 */
	var $components = array('RequestHandler', 'Session');
/**
 * Security class constructor
 */
	function __construct () {
		$this->Security = Security::getInstance();
	}
/**
 * Component startup.  All security checking happens here.
 *
 * @param object $controller
 * @return unknown
 * @access public
 */
	function startup(&$controller) {
		if (is_array($this->requirePost) && !empty($this->requirePost)) {

			if (in_array($controller->action, $this->requirePost)) {

				if (!$this->RequestHandler->isPost()) {

					if (!$this->blackHole($controller)) {
						return null;
					}
				}
			}
		}

		if (is_array($this->requireAuth) && !empty($this->requireAuth) && !empty($controller->params['form'])) {
			if (in_array($controller->action, $this->requireAuth)) {

				if (!isset($controller->params['data']['_Token'])) {

					if (!$this->blackHole($controller)) {
						return null;
					}
				}
				$token = $controller->params['data']['_Token']['key'];

				if ($this->Session->check('_Token')) {
					$tData = $this->Session->read('_Token');
					if (!(intval($tData['expires']) > strtotime('now')) || $tData['key'] !== $token) {

						if (!$this->blackHole($controller)) {
							return null;
						}
					}

					if (!empty($tData['allowedControllers']) && !in_array($controller->params['controller'], $tData['allowedControllers']) ||!empty($tData['allowedActions']) && !in_array($controller->params['action'], $tData['allowedActions'])) {
						if (!$this->blackHole($controller)) {
							return null;
						}
					}
				} else {
					if (!$this->blackHole($controller)) {
						return null;
					}
				}
			}
		}

		// Add auth key for new form posts
		$authKey = Security::generateAuthKey();
		$expires = strtotime('+'.Security::inactiveMins().' minutes');
		$token = array(
			'key' => $authKey,
			'expires' => $expires,
			'allowedControllers' => $this->allowedControllers,
			'allowedActions' => $this->allowedActions
		);
		if (!isset($controller->params['data'])) {
			$controller->params['data'] = array();
		}
		$controller->params['_Token'] = $token;
		$this->Session->write('_Token', $token);
	}
/**
 * Black-hole an invalid request with a 404 error or custom callback
 *
 * @param object $controller
 * @return callback in controller
 * @access public
 */
	function blackHole(&$controller) {
		if ($this->blackHoleCallback == null) {
			header('HTTP/1.0 404 Not Found');
			exit();
		} elseif (method_exists($controller, $this->blackHoleCallback)) {
			return $controller->{$this->blackHoleCallback}();
		}
	}
/**
 * Sets the actions that require a POST request, or empty for all actions
 *
 * @access public
 * @return void
 */
	function requirePost() {
		$this->requirePost = func_get_args();
	}
/**
 * Sets the actions that require an authenticated request, or empty for all actions
 *
 * @access public
 * @return void
 */
	function requireAuth() {
		$this->requireAuth = func_get_args();
	}
}
?>