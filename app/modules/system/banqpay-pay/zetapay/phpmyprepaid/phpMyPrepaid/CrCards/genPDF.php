<?php
	//set up the display format ..  This will change
        define('FPDF_FONTPATH','../../fpdf152/font/'); // path to FPDF
        require('../../fpdf152/fpdf.php');             // FIXME this needs to be part of configuration file
        require_once('../../label/PDF_Label.php');
        /*-------------------------------------------------
        To create the object, 2 possibilities:
        either pass a custom format via an array
        or use a built-in AVERY name
        -------------------------------------------------*/
     // Example of custom format; we start at the second column
     //$pdf = new PDF_Label(array('name'=>'5163', 'paper-size'=>'A4', 'marginLeft'=>1, 'marginTop'=>1, 'NX'=>100, 'NY'=>100, 'SpaceX'=>0, 'SpaceY'=>0, 'width'=>120, 'height'=>20, 'metric'=>'mm', 'font-size'=>16), 1, 2);
		        // Standard format
        
$pdf = new PDF_Label('8600', 'mm', 1, 2);
$pdf->Open();
$pdf->AddPage();
// Print labels
foreach($UserPass as $id => $pass ) {
$pdf->Add_PDF_Label(sprintf("%s\n%s\n%s\n%s",
'Prepaid Internet Card', "Username: $id", "Password: $pass", "Good For: $min Min."));
}
//      $pdf->Output(); // can't output now because data has already been sent to the browser
$pdf->Output("test.pdf",false);
echo '<a href="test.pdf" target="_blank">Download these cards as a PDF for printing</a>';echo '</td></tr>';

?>																										  
