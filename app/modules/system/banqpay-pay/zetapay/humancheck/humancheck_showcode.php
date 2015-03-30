<?PHP
	session_start();
	$string = $_SESSION['noautomationcode'];
	if(!$string){
		$string = randomPass("7");
		$_SESSION['noautomationcode'] = $string;
	}
	$width  = 100;
	$height = 20;
	if($turing_difficulty == 3){
		$circles=5;
		$width=100;
		$height=40;
		$font=100;
		$im     = ImageCreateFromPNG("backgroundimage.png");
		$img_size	= getimagesize("backgroundimage.png");

		$fontwidth = ImageFontWidth($font) * strlen($string);
		$fontheight = ImageFontHeight($font);

		$x = ($img_size[0] - strlen($string) * $fontwidth )/2;
		$x = $x + 100;
		$y = ($img_size[1] - $fontheight) / 2; // middle of the code string will be in middle of the background image
		$background_color = imagecolorallocate ($im, 255, 255, 255);
		$text_color = imagecolorallocate ($im, rand(0,100), rand(0,100),rand(0,100)); // Random Text
		$text_color = "000000";
		imagerectangle($im,0,0,$width-1,$height-1,$text_color);
		imagestring ($im, $font, $x,$y,  $string, $text_color);
		DistortImage($im,$width-1,$height-1);
		header ("Content-type: image/jpeg");
		ImagePNG($im);
		exit;
	}else{
        
		$im     = imagecreatefrompng("access_code.png");
		$black  = imagecolorallocate($im, 0,0,0);
		ImageString($im, 8, 10, 6, $string, $black);
		DistortImage($im,$width-1,$height-1);
		ImagePNG($im);
		ImageDestroy($im);
		exit;
	}
	function DistortImage($dist_img, $w, $h){
		global $turing_difficulty;
		// a random piece of ellipse
		$color = ImageColorAllocate( $dist_img, rand(0,255), rand(0,255), rand(0,255) );
//		$color = "000000";
		ImageArc($dist_img, rand(0,	$w), rand(0, $h), rand($w / 2, $w) ,rand($h / 2, $h), 0,360, $color);
		//and rectangle
		$color = ImageColorAllocate($dist_img, rand(0,255), rand(0,255), rand(0,255));
//		$color = "000000";
		ImageRectangle($dist_img, rand(0, $w/2 ), rand(0, $h/2 ), rand($w / 2, $w), rand($h / 2, $h), $color);
		//starry night
		if($turing_difficulty > 1){
			$cnt = $w * $h / 10;
			for($i=0;$i<$cnt;$i++){
				$color = ImageColorAllocate($dist_img, rand(0,255), rand(0,255), rand(0,255));
				ImageSetPixel($dist_img, rand(0,$w), rand(0,$h), $color);
			}
		}
		return $dist_img;
	}
	function randomPass($length = 7) {
		// all the chars we want to use
		$all = explode( " ","A B D E F H K L M N P Q R S T W X Y Z ". " 1 2 3 4 5 6 7 8 9");
		for($i=0;$i<$length;$i++) {
			srand((double)microtime()*700000000);
			$randy = rand(0, 28);
			$pass .= $all[$randy];
		}
		return $pass;
	}
?>