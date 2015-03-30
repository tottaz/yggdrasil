<?php

	/* Creates a Random word image, to prevent automatic signup
	If you provide $hash (int) through get or POST it 
	will use that word in the array $wordlist otherwise it will make a random image.
	Automatically creates some background circles which 
	will be  randomised to a lighter colour than the text
	$circle is the number of background circles
	Hope you find this useful
	*/

//	$string = "test2";
	for($i=0; $i<5;$i++){
		$string = $string.rand(0,9);
	}

	$wordlist=array(
		"butter","clock","wood","mouse","medel","cup","bread",
		"crisps","towel","chair",
		"bottle","can", "potatoe","brush","hat",
		"carpet","wires","music","humans","dog","cat"
	);
	$circles=5;
	$width=100;
	$height=40;
	$font=100;

	$randno=rand(0,sizeof($wordlist)-1);
	if (!$hash) {
#		$string=$wordlist[$randno];
	} else {
#		$string=$wordlist[$hash];
	}

	$im = ImageCreateFromJpeg("backgroundimage.jpg");
	$img_size	= getimagesize("backgroundimage.jpg");

	$fontwidth = ImageFontWidth($font) * strlen($string);
	$fontheight = ImageFontHeight($font);

	$x = ($img_size[0] - strlen($string) * $fw )/2;
	$y = ($img_size[1] - $fontheight) / 2; // middle of the code string will be in middle of the background image

//	$im = @imagecreate ($width,$height);
	$background_color = imagecolorallocate ($im, 255, 255, 255);
	$text_color = imagecolorallocate ($im, rand(0,100), rand(0,100),rand(0,100)); // Random Text

	imagerectangle($im,0,0,$width-1,$height-1,$text_color);
	imagestring ($im, $font, $x,$y,  $string, "#FF7700");
	header ("Content-type: image/jpeg");
	imagejpeg ($im,'',80);
?>