<?php

	/**
	 * example 4
	 * demonstrates recursive parse
	 *
	 * $Id: ex4.php,v 1.2 2005/04/07 12:02:52 cocomp Exp $
	 */

	include_once('./xtemplate.class.php');

	$xtpl = new XTemplate('ex4.xtpl');
	$xtpl->rparse('main');
	$xtpl->out('main');

/*
		$Log: ex4.php,v $
		Revision 1.2  2005/04/07 12:02:52  cocomp
		MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
		
		Revision 1.1  2001/07/11 10:49:25  cranx
		*** empty log message ***
		
		Revision 1.2  2001/03/26 23:25:02  cranx
		added keyword expansion to be more clear
		
*/

?>