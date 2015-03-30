<?php
/* SVN FILE: $Id: view.php 4064 2006-12-04 05:29:12Z phpnut $ */
/**
 * Methods for displaying presentation data in the view.
 *
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
 * @since			CakePHP v 0.10.0.1076
 * @version			$Revision: 4064 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-12-03 23:29:12 -0600 (Sun, 03 Dec 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Included libraries.
 */
uses (DS . 'view' . DS . 'helper');
/**
 * View, the V in the MVC triad.
 *
 * Class holding methods for displaying presentation data.
 *
 * @package			cake
 * @subpackage		cake.cake.libs.view
 */
class View extends Object{
/**
 * Name of the controller.
 *
 * @var string Name of controller
 * @access public
 */
	var $name = null;
/**
 * Stores the current URL (for links etc.)
 *
 * @var string Current URL
 * @access public
 */
	var $here = null;
/**
 * Action to be performed.
 *
 * @var string Name of action
 * @access public
 */
	var $action = null;
/**
 * An array of names of built-in helpers to include.
 *
 * @var mixed A single name as a string or a list of names as an array.
 * @access public
 */
	var $helpers = array('Html');
/**
 * Path to View.
 *
 * @var string Path to View
 * @access public
 */
	var $viewPath;
/**
 * Replaced with public var viewVars
 * @access protected
 * @deprecated
 */
	var $_viewVars = array();
/**
 * Variables for the view
 *
 * @var array
 * @access public
 */
	var $viewVars = array();
/**
 * Title HTML element of this View.
 *
 * @var boolean
 * @access public
 */
	var $pageTitle = false;
/**
 * Path parts for creating links in views.
 *
 * @var string Base URL
 * @access public
 */
	var $base = null;
/**
 * Name of layout to use with this View.
 *
 * @var string
 * @access public
 */
	var $layout = 'default';
/**
 * Turns on or off Cake's conventional mode of rendering views. On by default.
 *
 * @var boolean
 * @access public
 */
	var $autoRender = true;
/**
 * Turns on or off Cake's conventional mode of finding layout files. On by default.
 *
 * @var boolean
 * @access public
 */
	var $autoLayout = true;
/**
 * Array of parameter data
 *
 * @var array Parameter data
 * @access public
 */
	var $params;
/**
 * True when the view has been rendered.
 *
 * @var boolean
 * @access protected
 */
	var $_hasRendered = null;
/**
 * @deprecated will not be avialable after 1.1.x.x
 */
	var $controller = null;
/**
 * Array of loaded view helpers.
 *
 * @var array
 * @access public
 */
	var $loaded = array();
/**
 * File extension. Defaults to Cake's conventional ".thtml".
 *
 * @var array
 * @access public
 */
	var $ext = '.thtml';
/**
 * Sub-directory for this view file.
 *
 * @var string
 * @access public
 */
	var $subDir = null;
/**
 * The directory where theme web accessible content is stored
 *
 * @var array
 * @access public
 */
	var $themeWeb = null;
/**
 * Plugin name. A Plugin is a sub-application.
 * This is used to set the correct paths for views
 *
 * @var string
 * @access public
 */
	var $plugin = null;
/**
/**
 * List of variables to collect from the associated controller
 *
 * @var array
 * @access protected
 */
	var $_passedVars = array('viewVars', 'action', 'autoLayout', 'autoRender', 'ext', 'base', 'webroot', 'helpers', 'here', 'layout', 'modelNames', 'name', 'pageTitle', 'viewPath', 'params', 'data', 'webservices', 'plugin');
/**
 * Constructor
 *
 * Instance is created in Controller::render() and is never called directly
 *
 * @var object instance of the calling controller
 */
	function __construct(&$controller) {
		if(is_object($controller)) {
			$this->controller =& $controller;
			$c = count($this->_passedVars);

			for ($j = 0; $j < $c; $j++) {
				$var = $this->_passedVars[$j];
				$this->{$var} = $controller->{$var};
			}
			$this->_viewVars =& $this->viewVars;
		}
		parent::__construct();
	}
/**
 * Renders view for given action and layout. If $file is given, that is used
 * for a view filename (e.g. customFunkyView.thtml).
 *
 * @param string $action Name of action to render for
 * @param string $layout Layout to use
 * @param string $file Custom filename for view
 * @return mixed returns an error if View::render() fails to find a related template.
 * 					boolean on successful render
 * @access public
 */
	function render($action = null, $layout = null, $file = null) {

		if (isset($this->_hasRendered) && $this->_hasRendered) {
			return true;
		} else {
			$this->_hasRendered = false;
		}

		if (!$action) {
			$action = $this->action;
		}

		if ($layout) {
			$this->setLayout($layout);
		}

		if ($file) {
			$viewFileName = $file;
		} else {
			$viewFileName = $this->_getViewFileName($action);
		}

		if (!is_null($this->plugin) && is_null($file)) {
			return $this->pluginView($action, $layout);
		}

		if (!is_file($viewFileName) && !fileExistsInPath($viewFileName) || $viewFileName === '/' || $viewFileName === '\\') {
			if (strpos($action, 'missingAction') !== false) {
				$errorAction = 'missingAction';
			} else {
				$errorAction = 'missingView';
			}

			foreach(array($this->name, 'errors') as $viewDir) {
				$errorAction = Inflector::underscore($errorAction);

				if (file_exists(VIEWS . $viewDir . DS . $errorAction . $this->ext)) {
					$missingViewFileName = VIEWS . $viewDir . DS . $errorAction . $this->ext;
				} elseif($missingViewFileName = fileExistsInPath(LIBS . 'view' . DS . 'templates' . DS . $viewDir . DS . $errorAction . '.thtml')) {
				} else {
					$missingViewFileName = false;
				}

				$missingViewExists = is_file($missingViewFileName);

				if ($missingViewExists) {
					break;
				}
			}

			if (strpos($action, 'missingView') === false) {
				return $this->cakeError('missingView', array(array('className' => $this->controller->name,
																					'action' => $action,
																					'file' => $viewFileName,
																					'base' => $this->base)));

				$isFatal = isset($this->isFatal) ? $this->isFatal : false;

				if (!$isFatal) {
					$viewFileName = $missingViewFileName;
				}
			} else {
				$missingViewExists = false;
			}

			if (!$missingViewExists || $isFatal) {
				if (Configure::read() > 0) {
					trigger_error(sprintf("No template file for view %s (expected %s), create it first'", $action, $viewFileName), E_USER_ERROR);
				} else {
					$this->error('404', 'Not found', sprintf("The requested address %s was not found on this server.", '', "missing view \"{$action}\""));
				}
				die();
			}
		}

		if ($viewFileName && !$this->_hasRendered) {
			if (substr($viewFileName, -5) === 'thtml') {
				$out = View::_render($viewFileName, $this->viewVars);
			} else {
				$out = $this->_render($viewFileName, $this->viewVars);
			}

			if ($out !== false) {
				if ($this->layout && $this->autoLayout) {
					$out = $this->renderLayout($out);
					if (isset($this->loaded['cache']) && ((isset($this->controller) && $this->controller->cacheAction != false)) && (defined('CACHE_CHECK') && CACHE_CHECK === true)) {
						$replace = array('<cake:nocache>', '</cake:nocache>');
						$out = str_replace($replace, '', $out);
					}
				}

				print $out;
				$this->_hasRendered = true;
			} else {
				$out = $this->_render($viewFileName, $this->viewVars);
				trigger_error(sprintf("Error in view %s, got: <blockquote>%s</blockquote>", $viewFileName, $out), E_USER_ERROR);
			}
			return true;
		}
	}
/**
 * Renders a piece of PHP with provided parameters and returns HTML, XML, or any other string.
 *
 * This realizes the concept of Elements, (or "partial layouts")
 * and the $params array is used to send data to be used in the Element.
 *
 * @param string $name Name of template file in the/app/views/elements/ folder
 * @param array $params Array of data to be made available to the for rendered view (i.e. the Element)
 * @return string Rendered output
 * @access public
 */
	function renderElement($name, $params = array()) {
		$params = array_merge_recursive($params, $this->loaded);

		if(isset($params['plugin'])) {
			$this->plugin = $params['plugin'];
		}

		if (!is_null($this->plugin)) {
			if (file_exists(APP . 'plugins' . DS . $this->plugin . DS . 'views' . DS . 'elements' . DS . $name . $this->ext)) {
				$elementFileName = APP . 'plugins' . DS . $this->plugin . DS . 'views' . DS . 'elements' . DS . $name . $this->ext;
				return $this->_render($elementFileName, array_merge($this->viewVars, $params), false);
			}
		}

		$paths = Configure::getInstance();
		foreach($paths->viewPaths as $path) {
			if (file_exists($path . 'elements' . DS . $name . $this->ext)) {
				$elementFileName = $path . 'elements' . DS . $name . $this->ext;
				return $this->_render($elementFileName, array_merge($this->viewVars, $params), false);
			}
		}
		return "(Error rendering Element: {$name})";
	}
/**
 * Wrapper for View::renderElement();
 *
 * @param string $name Name of template file in the/app/views/elements/ folder
 * @param array $params Array of data to be made available to the for rendered view (i.e. the Element)
 * @return string View::renderElement()
 * @access public
 */
	function element($name, $params = array()) {
		return $this->renderElement($name, $params = array());
	}
/**
 * Renders a layout. Returns output from _render(). Returns false on error.
 *
 * @param string $contentForLayout Content to render in a view, wrapped by the surrounding layout.
 * @return mixed Rendered output, or false on error
 * @access public
 */
	function renderLayout($contentForLayout) {
		$layoutFilename = $this->_getLayoutFileName();

		if (Configure::read() > 2 && $this->controller != null) {
			$debug = View::_render(LIBS . 'view' . DS . 'templates' . DS . 'elements' . DS . 'dump.thtml', array('controller' => $this->controller), false);
		} else {
			$debug = '';
		}

		if ($this->pageTitle !== false) {
			$pageTitle = $this->pageTitle;
		} else {
			$pageTitle = Inflector::humanize($this->viewPath);
		}

		$dataForLayout = array_merge($this->viewVars, array('title_for_layout'   => $pageTitle,
																				'content_for_layout' => $contentForLayout,
																				'cakeDebug'          => $debug));

		if (is_file($layoutFilename)) {
			if (empty($this->loaded) && !empty($this->helpers)) {
				$loadHelpers = true;
			} else {
				$loadHelpers = false;
				$dataForLayout = array_merge($dataForLayout, $this->loaded);
			}

			if (substr($layoutFilename, -5) === 'thtml') {
				$out = View::_render($layoutFilename, $dataForLayout, $loadHelpers, true);
			} else {
				$out = $this->_render($layoutFilename, $dataForLayout, $loadHelpers);
			}

			if ($out === false) {
				$out = $this->_render($layoutFilename, $dataForLayout);
				trigger_error(sprintf("Error in layout %s, got: <blockquote>%s</blockquote>", $layoutFilename, $out), E_USER_ERROR);
				return false;
			} else {
				return $out;
			}
		} else {
			return $this->cakeError('missingLayout', array(array('layout' => $this->layout,
																					'file' => $layoutFilename,
																					'base' => $this->base)));
		}
	}
/**
 * Sets layout to be used when rendering.
 *
 * @param string $layout Name of layout.
 * @return void
 * @access public
 * @deprecated in 1.2.x.x
 */
	function setLayout($layout) {
		$this->layout = $layout;
	}
/**
 * Displays an error page to the user. Uses layouts/error.html to render the page.
 *
 * @param int $code HTTP Error code (for instance: 404)
 * @param string $name Name of the error (for instance: Not Found)
 * @param string $message Error message as a web page
 * @return rendered error message
 * @access public
 *
 */
	function error($code, $name, $message) {
		header ("HTTP/1.0 {$code} {$name}");
		print ($this->_render(VIEWS . 'layouts/error.thtml', array('code'    => $code,
																						'name'    => $name,
																						'message' => $message)));
	}
/**
 * Returns filename of given action's template file (.thtml) as a string. CamelCased action names will be under_scored! This means that you can have LongActionNames that refer to long_action_names.thtml views.
 *
 * @param string $action Controller action to find template filename for
 * @return string Template filename
 * @access protected
 */
	function _getViewFileName($action) {
		$action = Inflector::underscore($action);
		$paths = Configure::getInstance();

		if (!is_null($this->webservices)) {
			$type = strtolower($this->webservices) . DS;
		} else {
			$type = null;
		}

		$position = strpos($action, '..');

		if ($position === false) {
		} else {
			$action = explode('/', $action);
			$i = array_search('..', $action);
			unset($action[$i - 1]);
			unset($action[$i]);
			$action='..' . DS . implode(DS, $action);
		}

		foreach($paths->viewPaths as $path) {
			if (file_exists($path . $this->viewPath . DS . $this->subDir . $type . $action . $this->ext)) {
				$viewFileName = $path . $this->viewPath . DS . $this->subDir . $type . $action . $this->ext;
				return $viewFileName;
			}
		}

		if ($viewFileName = fileExistsInPath(LIBS . 'view' . DS . 'templates' . DS . 'errors' . DS . $type . $action . '.thtml')) {
		} elseif($viewFileName = fileExistsInPath(LIBS . 'view' . DS . 'templates' . DS . $this->viewPath . DS . $type . $action . '.thtml')) {
		} else {
			$viewFileName = VIEWS . $this->viewPath . DS . $this->subDir . $type . $action . $this->ext;
		}

		return $viewFileName;
	}
/**
 * Returns layout filename for this template as a string.
 *
 * @return string Filename for layout file (.thtml).
 * @access protected
 */
	function _getLayoutFileName() {
		if (isset($this->webservices) && !is_null($this->webservices)) {
			$type = strtolower($this->webservices) . DS;
		} else {
			$type = null;
		}

		if (isset($this->plugin) && !is_null($this->plugin)) {
			if (file_exists(APP . 'plugins' . DS . $this->plugin . DS . 'views' . DS . 'layouts' . DS . $this->layout . $this->ext)) {
				$layoutFileName = APP . 'plugins' . DS . $this->plugin . DS . 'views' . DS . 'layouts' . DS . $this->layout . $this->ext;
				return $layoutFileName;
			}
		}
		$paths = Configure::getInstance();

		foreach($paths->viewPaths as $path) {
			if (file_exists($path . 'layouts' . DS . $this->subDir . $type . $this->layout . $this->ext)) {
				$layoutFileName = $path . 'layouts' . DS . $this->subDir . $type . $this->layout . $this->ext;
				return $layoutFileName;
			}
		}

		if($layoutFileName = fileExistsInPath(LIBS . 'view' . DS . 'templates' . DS . 'layouts' . DS . $type . $this->layout . '.thtml')) {
		} else {
			$layoutFileName = LAYOUTS . $type . $this->layout.$this->ext;
		}
		return $layoutFileName;
	}

/**
 * Renders and returns output for given view filename with its array of data.
 *
 * @param string $___viewFn Filename of the view
 * @param array $___dataForView Data to include in rendered view
 * @return string Rendered output
 * @access protected
 */
	function _render($___viewFn, $___dataForView, $loadHelpers = true, $cached = false) {
		if ($this->helpers != false && $loadHelpers === true) {
			$loadedHelpers = array();
			$loadedHelpers = $this->_loadHelpers($loadedHelpers, $this->helpers);

			foreach(array_keys($loadedHelpers) as $helper) {
				$replace = strtolower(substr($helper, 0, 1));
				$camelBackedHelper = preg_replace('/\\w/', $replace, $helper, 1);

				${$camelBackedHelper} =& $loadedHelpers[$helper];

				if (isset(${$camelBackedHelper}->helpers) && is_array(${$camelBackedHelper}->helpers)) {
					foreach(${$camelBackedHelper}->helpers as $subHelper) {
						${$camelBackedHelper}->{$subHelper} =& $loadedHelpers[$subHelper];
					}
				}
				$this->loaded[$camelBackedHelper] = (${$camelBackedHelper});
			}
		}
		extract($___dataForView, EXTR_SKIP);
		$BASE = $this->base;
		$params =& $this->params;
		$page_title = $this->pageTitle;

		ob_start();

		if (Configure::read() > 0) {
			include ($___viewFn);
		} else {
			@include ($___viewFn);
		}

		if ($this->helpers != false && $loadHelpers === true) {
			foreach ($loadedHelpers as $helper) {
				if (is_object($helper)) {
					if (is_subclass_of($helper, 'Helper') || is_subclass_of($helper, 'helper')) {
						$helper->afterRender();
					}
				}
			}
		}
		$out = ob_get_clean();

		if (isset($this->loaded['cache']) && ((isset($this->controller) && $this->controller->cacheAction != false)) && (defined('CACHE_CHECK') && CACHE_CHECK === true)) {
			if (is_a($this->loaded['cache'], 'CacheHelper')) {
				$cache =& $this->loaded['cache'];

				if ($cached === true) {
					$cache->view = &$this;
				}

				$cache->base			= $this->base;
				$cache->here			= $this->here;
				$cache->action			= $this->action;
				$cache->controllerName	= $this->params['controller'];
				$cache->cacheAction		= $this->controller->cacheAction;
				$cache->cache($___viewFn, $out, $cached);
			}
		}
		return $out;
	}
/**
 * Loads helpers, with their dependencies.
 *
 * @param array $loaded List of helpers that are already loaded.
 * @param array $helpers List of helpers to load.
 * @return array
 * @access protected
 */
	function &_loadHelpers(&$loaded, $helpers) {
		static $tags;
		$helpers[] = 'Session';
		if (empty($tags)) {
			$helperTags = new Helper();
			$tags = $helperTags->loadConfig();
		}

		foreach($helpers as $helper) {
			$pos = strpos($helper, '/');
			if ($pos === false) {
				$plugin = $this->plugin;
			} else {
				$parts = explode('/', $helper);
				$plugin = Inflector::underscore($parts['0']);
				$helper = $parts['1'];
			}
			$helperCn = $helper . 'Helper';

			if (in_array($helper, array_keys($loaded)) !== true) {
				if (!class_exists($helperCn)) {
				    if (is_null($plugin) || !loadPluginHelper($plugin, $helper)) {
						if (!loadHelper($helper)) {
							$this->cakeError('missingHelperFile', array(array(
													'helper' => $helper,
													'file' => Inflector::underscore($helper) . '.php',
													'base' => $this->base)));
							exit();
						}
				    }
					if (!class_exists($helperCn)) {
						$this->cakeError('missingHelperClass', array(array(
												'helper' => $helper,
												'file' => Inflector::underscore($helper) . '.php',
												'base' => $this->base)));
						exit();
					}
				}

				$camelBackedHelper = Inflector::variable($helper);

				${$camelBackedHelper} =& new $helperCn;
				${$camelBackedHelper}->view =& $this;
				${$camelBackedHelper}->tags = $tags;

				$vars = array('base', 'webroot', 'here', 'params', 'action', 'data', 'themeWeb', 'plugin');
				$c = count($vars);
				for ($j = 0; $j < $c; $j++) {
					${$camelBackedHelper}->{$vars[$j]} = $this->{$vars[$j]};
				}

				if (!empty($this->validationErrors)) {
					${$camelBackedHelper}->validationErrors = $this->validationErrors;
				}

				$loaded[$helper] =& ${$camelBackedHelper};

				if (isset(${$camelBackedHelper}->helpers) && is_array(${$camelBackedHelper}->helpers)) {
					$loaded = &$this->_loadHelpers($loaded, ${$camelBackedHelper}->helpers);
				}
			}
		}
		return $loaded;
	}
/**
 * Returns a plugin view
 *
 * @param string $action Name of action to render for
 * @param string $layout Layout to use
 * @return mixed View::render() if template is found, error if template is missing
 * @access public
 */
	function pluginView($action, $layout) {
		$viewFileName = APP . 'plugins' . DS . $this->plugin . DS . 'views' . DS . $this->viewPath . DS . $action . $this->ext;

		if (file_exists($viewFileName)) {
			$this->render($action, $layout, $viewFileName);
		} else {
			return $this->cakeError('missingView', array(array(
											'className' => $this->controller->name,
											'action' => $action,
											'file' => $viewFileName,
											'base' => $this->base)));
		}
	}
/**
 * Renders a cached view if timestamp in file is less or equal to current time.
 *
 * If $layout is xml content type will be set before rendering the cache
 *
 *
 * @param string $filename
 * @param int $timeStart
 * @return mixed outputs view, or returns void if timestamp has expired
 * @access public
 */
	function renderCache($filename, $timeStart) {
		ob_start();
		include ($filename);

		if (Configure::read() > 0 && $this->layout != 'xml') {
			echo "<!-- Cached Render Time: " . round(getMicrotime() - $timeStart, 4) . "s -->";
		}
		$out = ob_get_clean();

		if (preg_match('/^<!--cachetime:(\\d+)-->/', $out, $match)) {
			if (time() >= $match['1']) {
				@unlink($filename);
				unset ($out);
				return;
			} else {
				if($this->layout === 'xml'){
					header('Content-type: text/xml');
				}
				$out = str_replace('<!--cachetime:'.$match['1'].'-->', '', $out);
				e($out);
				die();
			}
		}
	}
}
?>