<?php
/* SVN FILE: $Id: aclnode.php 4043 2006-12-01 02:47:40Z phpnut $ */
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
 * @subpackage		cake.cake.libs.controller.components.dbacl.models
 * @since			CakePHP v 0.10.0.1232
 * @version			$Revision: 4043 $
 * @modifiedby		$LastChangedBy: phpnut $
 * @lastmodified	$Date: 2006-11-30 20:47:40 -0600 (Thu, 30 Nov 2006) $
 * @license			http://www.opensource.org/licenses/mit-license.php The MIT License
 */
/**
 * Load AppModel class
 */
loadModel();
/**
 * Short description for file.
 *
 * Long description for file
 *
 * @package		cake
 * @subpackage	cake.cake.libs.controller.components.dbacl.models
 *
 */
class AclNode extends AppModel {
/**
 * Database configuration to use
 *
 * @var string
 */
	var $useDbConfig = ACL_DATABASE;
/**
 * Cache Queries
 *
 * @var boolean
 */
	var $cacheQueries = false;
/**
 * Creates a new ARO/ACO node
 *
 * @param int $linkId
 * @param mixed $parentId
 * @param string $alias
 * @return boolean True on success, false on fail
 * @access public
 */
	function create($linkId = 0, $parentId = null, $alias = '') {
		parent::create();
		if (strtolower(get_class($this)) == "aclnode") {
			trigger_error("[acl_base] The AclBase class constructor has been called, or the class was instantiated. This class must remain abstract. Please refer to the Cake docs for ACL configuration.", E_USER_ERROR);
			return null;
		}
		extract ($this->__dataVars());

		if ($parentId == null || $parentId === 0) {
			$parent = $this->find(null, 'MAX(rght) as rght', null, -1);
			$parent['lft'] = $parent[0]['rght'];

			if ($parent[0]['rght'] == null || !$parent[0]['rght']) {
				$parent['lft'] = 0;
			}
		} else {
			$parent = $this->find($this->_resolveID($parentId), null, null, 0);
			if ($parent == null || count($parent) == 0) {
				trigger_error("Null parent in {$class}::create()", E_USER_WARNING);
				return null;
			}
			$parent = $parent[$class];
			$this->_syncTable(1, $parent['lft'], $parent['lft']);
		}
		$return = $this->save(array($class => array($secondary_id => $linkId,
																	'alias' => $alias,
																	'lft' => $parent['lft'] + 1,
																	'rght' => $parent['lft'] + 2)));
		$this->id  = $this->getLastInsertID();
		return $return;
	}
/**
 * Deletes the ARO/ACO node with the given ID
 *
 * @param mixed $id	The id or alias of an ARO/ACO node
 * @return boolean True on success, false on fail
 * @access public
 */
	function delete($id) {
		extract ($this->__dataVars());
		$db =& ConnectionManager::getDataSource($this->useDbConfig);

		$result = $this->find($this->_resolveID($id));
		$object = $result[$class];
		if ($object == null || count($object) == 0) {
			return false;
		}

		$children = $this->findAll(array("{$class}.rght" => "< {$result[$class]['rght']}", "{$class}.lft" => "> {$result[$class]['lft']}"), 'id', null, null, null, -1);
		$idList = DataSource::getFieldValue($children, '{n}.' . $class . '.id');
		$idList[] = $result[$class]['id'];

		$this->ArosAco->query('DELETE FROM ' . $db->fullTableName($this->ArosAco) . " WHERE {$class}_id in (" . implode(', ', $idList) . ')');

		$table = $db->fullTableName($this);
		$this->query("DELETE FROM {$table} WHERE {$table}.lft >= {$result[$class]['lft']} AND {$table}.rght <= {$result[$class]['rght']}");

		$shift = 1 + $result[$class]['rght'] - $result[$class]['lft'];
		$this->query('UPDATE ' . $table . ' SET `rght` = `rght` - ' . $shift . ' WHERE `rght` > ' . $result[$class]['rght']);
		$this->query('UPDATE ' . $table . ' SET `lft` = `lft` - ' . $shift . ' WHERE `lft` > ' . $result[$class]['lft']);
		return true;
	}
/**
 * Sets the parent of the given node
 *
 * @param mixed $parentId
 * @param mixed $id
 * @return boolean True on success, false on failure
 * @access public
 */
	function setParent($parentId = null, $id = null) {
		if (strtolower(get_class($this)) == "aclnode") {
			trigger_error("[acl_base] The AclBase class constructor has been called, or the class was instantiated. This class must remain abstract. Please refer to the Cake docs for ACL configuration.", E_USER_ERROR);
			return null;
		}
		extract ($this->__dataVars());

		if ($id == null && $this->id == false) {
			return false;
		} elseif ($id == null) {
			$id = $this->id;
		}
		$object = $this->find($this->_resolveID($id), null, null, 0);

		if ($object == null || count($object) == 0) {
			return false;
		}
		$object = $object[$class];
		$parent = $this->getParent($id);

		if (($parent == null && $parentId == null) || ($parentId == $parent[$class][$secondary_id] && $parentId != null) || ($parentId == $parent[$class]['alias'] && $parentId != null)) {
			return false;
		}

		if ($parentId == null) {
			$newParent = $this->find(null, 'MAX(rght) as lft', null, -1);
			$newParent = $newParent[0];
			$newParent['rght'] = $newParent['lft'];
		} else {
			$newParent = $this->find($this->_resolveID($parentId), null, null, 0);
			$newParent = $newParent[$class];
		}

		if ($parentId != null && $newParent['lft'] <= $object['lft'] && $newParent['rght'] >= $object['rght']) {
			return false;
		}
		$this->_syncTable(0, $object['lft'], $object['lft']);

		if ($object['lft'] < $newParent['lft']) {
			$newParent['lft'] = $newParent['lft'] - 2;
			$newParent['rght'] = $newParent['rght'] - 2;
		}

		if ($parentId != null) {
			$this->_syncTable(1, $newParent['lft'], $newParent['lft']);
		}
		$object['lft'] = $newParent['lft'] + 1;
		$object['rght'] = $newParent['lft'] + 2;
		$this->save(array($class => $object));

		if ($newParent['lft'] == 0) {
			$this->_syncTable(2, $newParent['lft'], $newParent['lft']);
		}
		return true;
	}
/**
 * Get the parent node of the given Aro or Aco
 *
 * @param moxed $id
 * @return array
 * @access public
 */
	function getParent($id) {
		$path = $this->getPath($id);
		if ($path == null || count($path) < 2) {
			return null;
		} else {
			return $path[count($path) - 2];
		}
	}
/**
 * Gets the path to the given Aro or Aco
 *
 * @param mixed $id
 * @return array
 * @access public
 */
	function getPath($id) {
		if (strtolower(get_class($this)) == "aclnode") {
			trigger_error("[acl_base] The AclBase class constructor has been called, or the class was instantiated. This class must remain abstract. Please refer to the Cake docs for ACL configuration.", E_USER_ERROR);
			return null;
		}
		extract ($this->__dataVars());
		$item = $this->find($this->_resolveID($id), null, null, 0);

		if ($item == null || count($item) == 0) {
			return null;
		}
		return $this->findAll(array($class . '.lft' => '<= ' . $item[$class]['lft'], $class . '.rght' => '>= ' . $item[$class]['rght']), null, array($class . '.lft' => 'ASC'), null, null, 0);
	}
/**
 * Get the child nodes of the given Aro or Aco
 *
 * @param mixed $id
 * @return array
 * @access public
 */
	function getChildren($id) {
		if (strtolower(get_class($this)) == "aclnode") {
			trigger_error("[acl_base] The AclBase class constructor has been called, or the class was instantiated. This class must remain abstract. Please refer to the Cake docs for ACL configuration.", E_USER_ERROR);
			return null;
		}

		extract ($this->__dataVars());
		$item = $this->find($this->_resolveID($id), null, null, 0);
		return $this->findAll(array($class . '.lft' => '> ' . $item[$class]['lft'], $class . '.rght' => '< ' . $item[$class]['rght']), null, null, null, null, null, 0);
	}
/**
 * Gets a conditions array to find an Aro or Aco, based on the given id or alias
 *
 * @param mixed $id
 * @return array Conditions array for a find/findAll call
 * @access public
 */
	function _resolveID($id) {
		extract($this->__dataVars());
		$key = (is_numeric($id) ? $secondary_id : 'alias');
		return array($this->name . '.' . $key => $id);
	}
/**
 * Shifts the left and right values of the aro/aco tables
 * when a node is added or removed
 *
 * @param unknown_type $dir
 * @param unknown_type $lft
 * @param unknown_type $rght
 * @access protected
 */
	function _syncTable($dir, $lft, $rght) {
		$db =& ConnectionManager::getDataSource($this->useDbConfig);

		if ($dir == 2) {
			$shift = 1;
			$dir = '+';
		} else {
			$shift = 2;

			if ($dir > 0) {
				 $dir = '+';
			} else {
				 $dir = '-';
			}
		}
		$db->query('UPDATE ' . $db->fullTableName($this) . ' SET ' . $db->name('rght') . ' = ' . $db->name('rght') . ' ' . $dir . ' ' . $shift . ' WHERE ' . $db->name('rght') . ' > ' . $rght);
		$db->query('UPDATE ' . $db->fullTableName($this) . ' SET ' . $db->name('lft') . ' = ' . $db->name('lft') . '  ' . $dir . ' ' . $shift . ' WHERE ' . $db->name('lft') . '  > ' . $lft);
	}
/**
 * Infers data based on the currently-intantiated subclass.
 *
 * @return array
 * @access private
 */
	function __dataVars() {
		$vars = array();
		$class = strtolower(get_class($this));
		if ($class == 'aro') {
			$vars['secondary_id'] = 'foreign_key';
		} else {
			$vars['secondary_id'] = 'object_id';
		}
		$vars['class'] = ucwords($class);
		return $vars;
	}
}
?>