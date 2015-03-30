<?php

/*  Copyright (C) 2004 - 2005  Carl Peterson (petecarlson@cpete.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/
	//////////////////////////////////////////////////////////////////////////
	//	CREATE REQUESTED ACCOUNTS, ADD TO DB AND MAKE PDF		//
	//	File written by Carl H. Peterson 2004, 2005			//
	//////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////
	//	First we are going to include the file that creates an 		//
	//	array of usernames and passwords.  We will than loop 		//
	//	through the array, add them to the DB and echo them		//
	//	onto the screen.  We will then loop through the array		//
	//	again to kicl out a nice PDF for printing.			//
	//////////////////////////////////////////////////////////////////////////
	if(isset($_POST['AnzahlSeiten'])) { include('CrCards/process.php'); 
	}else{
		include('CrCards/process2.php'); }
	include('create_NF_ID.php'); 	// <--- This creates the array Userpass
					// with username as key and pass as value		

	//////////////////////////////////////////////////////////////////////////
        //          DATABASE INSERTION GOES HERE FOR NOW.                       //
        //          Later I may make an array and then                          //
        //          insert it all at once.                                      //
        //                      (C) Carl H. Peterson 2004                       //
        //                      (C) phpMyAdmin project 2004                     //
        //////////////////////////////////////////////////////////////////////////
        include('CrCards/DBinsert.php');
	/////////////////////////////////////////////////////////////////////////
	//          DUMP IT INTO A TABLE IN CASE PDFS DON'T WORK               //
	/////////////////////////////////////////////////////////////////////////
	if(isset($_POST['AnzahlSeiten'])) { include('CrCards/dispTable.php'); }
	
	//////////////////////////////////////////////////////////////////////////
	//      CARD PRINTING USING FPDF AND A LITTLE LUCK			//
	//	This uses PDF_Label.php Credits are in that file somewhere	//
	//	but it was released as Freeware.  I will atribute it and 	//
	//	clean this up later.  Don't know what the AVERY names are 	//
	//	but I will try some of them and leave in the ones that		//
	//	seem like they would be good to use for card printing		//
	//									//
	//////////////////////////////////////////////////////////////////////////

	if(isset($_POST['AnzahlSeiten'])) { include('CrCards/genPDF.php'); }
	if(isset($qwprint)) { include('CrCards/genPPC.php');}

	// ----------> END OF CARD PRINTING
	//-----------> END OF THIS FILE
?>
