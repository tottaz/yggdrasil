<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

/**
* Builds route for the JobBoard component.
*
* @access public
* @param array Query associative array
* @return array SEF URI segments
*/

function JobboardBuildRoute( & $query) {

	$segments = array ();
	
	$menu = & JSite::getMenu();
	if ( empty($query['Itemid'])) {
		$menuItem = & $menu->getActive();
	}
	else {
		$menuItem = & $menu->getItem($query['Itemid']);
	}
	$jView = ( empty($menuItem->query['view']))?null:$menuItem->query['view'];
	// $jTask = ( empty($menuItem->query['task']))?null:$menuItem->query['task'];
	$jLayout = ( empty($menuItem->query['layout']))?null:$menuItem->query['layout'];
	$jCatId = ( empty($menuItem->query['catid']))?null:$menuItem->query['catid'];
	$jDaterange = ( empty($menuItem->query['daterange']))?null:$menuItem->query['daterange'];
	$jSearch = ( empty($menuItem->query['search']))?null:$menuItem->query['search'];
	$jKeysrch = ( empty($menuItem->query['keysrch']))?null:$menuItem->query['keysrch'];
	$jLocsrch = ( empty($menuItem->query['locsrch']))?null:$menuItem->query['locsrch'];
	$jID = ( empty($menuItem->query['id']))?null:$menuItem->query['id'];
	$jLyt = ( empty($menuItem->query['lyt']))?null:$menuItem->query['lyt'];                                          // && @intval($query['id']) > 0
	$jJobid = ( empty($menuItem->query['job_id']))?null:$menuItem->query['job_id'];

	if ( $jView == @$query['view'] && $jCatId == @$query['catid'] && $jDaterange == @intval($query['daterange']) && $jSearch == @$query['search'] &&  @strlen($query['search']) > 0  && $jKeysrch == @$query['keysrch'] &&  @strlen($query['keysrch']) > 0  && $jLocsrch == @$query['locsrch'] &&  @strlen($query['locsrch']) > 0 ) {
		unset ($query['view']);
		unset ($query['catid']);
		unset ($query['daterange']);
		unset ($query['search']);
		unset ($query['keysrch']);
		unset ($query['locsrch']);
	}
    elseif ($jView == @$query['view'] && $jID == @$query['id'] && @intval($query['id']) > 0 && $jCatId  == @intval($query['catid'])  && @intval($query['catid']) > 0 && $jLyt == @$query['lyt'] ) {
        unset ($query['view']);
        unset ($query['id']);
        unset ($query['catid']);
        unset ($query['lyt']);
	}
    elseif ($jView == @$query['view'] && $jLayout == @$query['layout'] ) { //job board home
        unset ($query['view']);
        unset ($query['layout']);
	}
    elseif ($jView == @$query['view'] && $jJobid == @$query['job_id'] && $jCatId == @$query['catid'] && $jLyt == @$query['lyt']  ) { //apply now & email to a friend
        unset ($query['view']);
        unset ($query['job_id']);
        unset ($query['catid']);
        unset ($query['lyt']);
	}
    elseif ($jView == @$query['view'] && $jCatId == @$query['catid'] && $jLayout == @$query['layout']  ) { // job list view
        unset ($query['view']);
        unset ($query['catid']);
        unset ($query['layout']);
	}
    elseif ($jView == @$query['view'] ) {
        unset ($query['view']);
	}

	if ( isset ($query['view'])) {
		$view = $query['view'];
		$segments[] = $view;
		unset ($query['view']);
	}

	if ( isset ($query['catid'])) {
		$catid = $query['catid'];
		$segments[] = $catid;
		unset ($query['catid']);
	}

	if (@ isset ($query['layout'])) {
		$layout = $query['layout'];
		$segments[] = $layout;
		unset ($query['layout']);
	}

	if ( isset ($query['id'])) {
		$id = $query['id'];
		$segments[] = $id;
		unset ($query['id']);
	}

	if ( isset ($query['daterange'])) {
		$daterange = $query['daterange'];
		$segments[] = $daterange;
		unset ($query['daterange']);
	}

	if ( isset ($query['search'])) {
		$search = $query['search'];
		$segments[] = $search;
		unset ($query['search']);
	}

	if ( isset ($query['keysrch'])) {
		$keysrch = $query['keysrch'];
		$segments[] = $keysrch;
		unset ($query['keysrch']);
	}

	if ( isset ($query['locsrch'])) {
		$locsrch = $query['keysrch'];
		$segments[] = $locsrch;
		unset ($query['locsrch']);
	}

	if ( isset ($query['job_id'])) {
		$job_id = $query['job_id'];
		$segments[] = $job_id;
		unset ($query['job_id']);
    }
	if ( isset ($query['lyt'])) {
		$lyt = $query['lyt'];
		$segments[] = $lyt;
		unset ($query['lyt']);
	}

	return $segments;
}

/**
* Decodes SEF URI segments for the JobBoard component.
*
* @access public
* @param array SEF URI segments array
* @return array Query associative array
*/
function JobboardParseRoute($segments) {
	$vars = array ();
	$vars['view'] = $segments[0];

	if ($segments[0] == 'list') {
        	if (!isset($segments[1]))
        		$segments[1]='';
            if (isset($segments[1]))
        	    $vars['catid'] = $segments[1];
            if (isset($segments[2]))
			    $vars['layout'] = $segments[2];
	}
	elseif ($segments[0] == 'job') {
        	if (!isset($segments[1]))
        		$segments[1]='';
        	$vars['id'] = $segments[1];
            if (isset($segments[3]))
        	    $vars['catid'] = $segments[2];
            if (isset($segments[3]))
			    $vars['lyt'] = $segments[3];
	}
	elseif ($segments[0] == 'apply' || $segments[0] == 'share') {
        	if (!isset($segments[1]))
        		$segments[1]='';
        	$vars['job_id'] = $segments[1];
        	$vars['catid'] = $segments[2];
            if (isset($segments[3]))
			    $vars['lyt'] = $segments[3];
	}
	elseif ($segments[0] == 'query') {
        	if (!isset($segments[1]))
        		$segments[1]='';
        	$vars['layout'] = $segments[1];
            if (isset($segments[2]))
        	    $vars['catid'] = $segments[2];
            if (isset($segments[3]))
        	    $vars['search'] = $segments[3];
            if (isset($segments[3]))
        	    $vars['locsrch'] = $segments[3];
            if (isset($segments[4]))
        	    $vars['locsrch'] = $segments[4];
	}

	return $vars;
}
