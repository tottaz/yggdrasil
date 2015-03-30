<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><?php echo $template['title']; ?></title>
	<?php Asset::css('login.css', array(), 'login-css'); ?>
	<?php echo Asset::render('login-css') ?> 
</head>
<body>
<div id="wrapper">
	<?php if (!isset($hide_header)) :?>
	<div class="header-area">
		 <div class='img-logo'>
		<?php echo logo(); ?>
		</div>
	</div><!-- /header-area end -->
	<?php endif; ?>
	<div id="main">
		<?php echo $template['partials']['notifications']; ?>
		<?php echo $template['body']; ?>
	</div><!-- /main end -->
</div><!-- /wrapper end -->
</body>
</html>