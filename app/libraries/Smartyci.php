<?php

if (!defined('BASEPATH'))
	exit('No direct script access allowed');

require_once ("third_party/modules/Smarty-3.1.19/libs/Smarty.class.php");

class Smartyci extends Smarty {
	public function __construct() {
		parent::__construct();

		$config = &get_config();

		$this -> caching = 1;
		$this -> setTemplateDir($config['application_dir'] . "views");
		$this -> setCompileDir($config['application_dir'] . "third_party/modules/Smarty-3.1.19/templates_c");
		$this -> setConfigDir($config['application_dir'] . "third_party/modules/Smarty-3.1.19/configs");
		$this -> setCacheDir($config['application_dir'] . "cache");
	}

	//if specified template is cached then display template and exit, otherwise, do nothing.
	public function useCached($tpl, $cacheId = null) {
		if ($this -> isCached($tpl, $cacheId)) {
			$this -> display($tpl, $cacheId);
			exit();
		}
	}

}
