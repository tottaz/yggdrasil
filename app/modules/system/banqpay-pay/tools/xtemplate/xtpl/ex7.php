<?php

	/**
	 * example 7
	 * demonstrates file includes
	 *
	 * $Id: ex7.php,v 1.2 2005/04/07 12:02:52 cocomp Exp $
	 */

	include_once('./xtemplate.class.php');

	$xtpl = new XTemplate('ex7.xtpl');

	$xtpl->assign('FILENAME', 'ex7-inc.xtpl');
	
	// Language is set to English
	$xtpl->assign_file('LANGUAGE', 'ex7-inc-eng.xtpl');
	
	// Uncomment the line below to set language to German
	//$xtpl->assign_file('LANGUAGE', 'ex7-inc-de.xtpl');
	
	$xtpl->rparse('main.inc');

	$xtpl->parse('main');
	$xtpl->out('main');

/*
		$Log: ex7.php,v $
		Revision 1.2  2005/04/07 12:02:52  cocomp
		MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
		
		Revision 1.1  2001/07/11 10:49:25  cranx
		*** empty log message ***
		
		Revision 1.2  2001/03/26 23:25:02  cranx
		added keyword expansion to be more clear
		
*/

?>