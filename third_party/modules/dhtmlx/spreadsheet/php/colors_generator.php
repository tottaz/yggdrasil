<?php

$height = 18;
$width = 18;

$colors_list = Array("000000", "ffffff", "ff0000", "ffc000", "ffff00", "92d050", "00b050", "00b0f0", "0070c0");

for ($i = 0; $i < count($colors_list); $i++) {
	$color = parse_color($colors_list[$i]);
	$im = imagecreate($width, $height);
	$color = imagecolorallocate($im, $color['R'], $color['G'], $color['B']);
	imagefilledrectangle($im, 0, 0, $width, $height, $color);
	imagepng($im, "../imgs/icons/colors/color_".$colors_list[$i].".png");
}



function parse_color($color) {
	$final = Array();
	$final['R'] = hexdec(substr($color, 0, 2));
	$final['G'] = hexdec(substr($color, 2, 2));
	$final['B'] = hexdec(substr($color, 4, 2));
	return $final;
}

?>