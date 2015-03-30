<?
	$randno=rand(0,sizeof($wordlist)-1);
	if (!$hash) {
		$string=$wordlist[$randno];
	} else {
		$string=$wordlist[$hash];
	}

	$fontwidth = ImageFontWidth($font) * strlen($string);
	$fontheight = ImageFontHeight($font);

	$im = @imagecreate ($width,$height);
	$background_color = imagecolorallocate ($im, 255, 255, 255);
	$text_color = imagecolorallocate ($im, rand(0,100), rand(0,100),
	rand(0,100)); // Random Text

	for ($i=1;$i<=$circles;$i++) {
		$randomcolor = imagecolorallocate ($im , rand(100,255),
		rand(100,255),rand(100,255));
		imagefilledellipse($im,rand(0,$width-10),rand(0,$height-3),
		rand(20,70),rand(20,70),$randomcolor);
	}
	imagerectangle($im,0,0,$width-1,$height-1,$text_color);
	imagestring ($im, $font, rand(3, $width-$fontwidth-3),
	rand(2,$height-$fontheight-3),  $string, $text_color);
	header ("Content-type: image/jpeg");
	imagejpeg ($im,'',80);
?>