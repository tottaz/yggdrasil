<?php

	/**
	 * example 1
	 * demonstrates basic template functions
	 * -simple replaces ( {VARIABLE1}, and {DATA.ID} {DATA.NAME} {DATA.AGE} )
	 * -dynamic blocks
	 *
	 * $Id: ex1.php,v 1.2 2005/04/07 12:02:51 cocomp Exp $
	 */

	include_once('./xtemplate.class.php');

	$xtpl = new XTemplate('ex1.xtpl');
	
	// simple replace
	$xtpl->assign('VARIABLE', 'TEST');
	
	// parse block1
	$xtpl->parse('main.block1');
	
	// uncomment line below to parse block2
	//$xtpl->parse('main.block2');

	/**
	 * you can reference to array keys in the template file the following way:
	 * {DATA.ID} or {DATA.NAME} 
	 * say we have an array from a mysql query with the following fields: ID, NAME, AGE
	 */
	$row = array('ID'=>'38',
				'NAME'=>'cocomp',
             	'AGE'=>'33'
             );
	
	$xtpl->assign('DATA',$row);

	// parse block3
	$xtpl->parse('main.block3');

	$xtpl->parse('main');
	$xtpl->out('main');

/*
		$Log: ex1.php,v $
		Revision 1.2  2005/04/07 12:02:51  cocomp
		MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
		
		Revision 1.1  2001/07/11 10:49:25  cranx
		*** empty log message ***
		
		Revision 1.2  2001/03/26 23:25:02  cranx
		added keyword expansion to be more clear
		
*/

?>