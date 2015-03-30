<?php

	/**
	 * example 2
	 * demonstrates multiple level dynamic blocks
	 *
	 * $Id: ex2.php,v 1.2 2005/04/07 12:02:52 cocomp Exp $
	 */

	include_once('./xtemplate.class.php');

	$xtpl = new XTemplate('ex2.xtpl');

	/**
	 * you can reference to array keys in the template file the following way:
	 * {DATA.ID} or {DATA.NAME} 
	 * say we have an array from a mysql query with the following fields: ID, NAME, AGE
	 */
	$rows = array();
	
	// add some data
	$rows[1]=array('ID'=>'38',
					'NAME'=>'cocomp',
             		'AGE'=>'33'
             		);
             		
	// add some data
	$rows[2]=array('ID'=>'27',
					'NAME'=>'linkhogthrob',
					'AGE'=>'34'
					);
					
	// add some data
	$rows[3]=array('ID'=>'56',
					'NAME'=>'pingu',
					'AGE'=>'23'
					);

	$rowsize = count($rows);
	
	for ($i = 1; $i <= $rowsize; $i++) {
		
		// assign array data
		$xtpl->assign('DATA', $rows[$i]);
		$xtpl->assign('ROW_NR', $i);
		
		// parse a row
		$xtpl->parse('main.table.row');

		// another way to do it would be:
		/*
		$xtpl->insert_loop('main.table.row', array('DATA'=>$rows[$i],
													'ROW_NR'=>$i
													));
		*/
	
	}

	// parse the table
	$xtpl->parse('main.table');
	
	$xtpl->parse('main');
	$xtpl->out('main');

/*
		$Log: ex2.php,v $
		Revision 1.2  2005/04/07 12:02:52  cocomp
		MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
		
		Revision 1.1  2001/07/11 10:49:25  cranx
		*** empty log message ***
		
		Revision 1.2  2001/03/26 23:25:02  cranx
		added keyword expansion to be more clear
		
*/

?>