<?php
/*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
?><?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/

class FileTreeDataItem extends TreeDataItem {

	function has_kids(){
		if ($this->data['is_folder'] == '1') {
			return true;
		} else {
			return false;
		}
	}

}

?>