<?php

	/**
	 * example 6
	 * demonstrates nullblocks
	 *
	 * $Id: ex6.php,v 1.2 2005/04/07 12:02:52 cocomp Exp $
	 */

	include_once('./xtemplate.class.php');

	$xtpl = new XTemplate('ex6.xtpl');

	$xtpl->assign('INTRO_TEXT', "what happens if we don't parse the subblocks?");
	$xtpl->parse('main.block');
	
	$xtpl->assign('INTRO_TEXT', 'what happens if we parse them? :)');
	$xtpl->parse('main.block.subblock1');
	$xtpl->parse('main.block.subblock2');
	$xtpl->parse('main.block');

	$xtpl->assign('INTRO_TEXT', 'ok.. SetNullBlock("block not parsed!") coming');
	$xtpl->SetNullBlock('block not parsed!');
	$xtpl->parse('main.block');

	$xtpl->assign('INTRO_TEXT', "ok.. custom nullblocks.. SetNullBlock('subblock1 not parsed!', 'main.block.subblock1')");
	$xtpl->SetNullBlock('block not parsed!');
	$xtpl->SetNullBlock('subblock1 not parsed!', 'main.block.subblock1');
	$xtpl->parse('main.block');

	$xtpl->parse('main');
	$xtpl->out('main');

/*
		$Log: ex6.php,v $
		Revision 1.2  2005/04/07 12:02:52  cocomp
		MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
		
		Revision 1.1  2001/07/11 10:49:25  cranx
		*** empty log message ***
		
		Revision 1.2  2001/03/26 23:25:02  cranx
		added keyword expansion to be more clear
		
*/

?>