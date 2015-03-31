<?php
require_once('php/request.php');

$request = new Request();

$js_depends = Array(
	'dhtmlx_core.js',
	'dhtmlxspreadsheet.js',
	'dhtmlxgrid_shcell.js',
	'dhtmlxgrid_borderselection.js',
	'dhtmlxsh_buffer.js',
	'dhtmlxsh_css.js',
	'dhtmlxsh_loader.js',
	'dhtmlxsh_config.js',
	'dhtmlxsh_headedit.js',
	'dhtmlxsh_mathhint.js',
	'dhtmlxsh_modal.js',
	'dhtmlxsh_selection.js',
	'dhtmlxsh_undo.js',
	'dhtmlxsh_context.js',
	'dhtmlxsh_export.js',
	'dhtmlxsh_keys.js'
);



switch ($request->get('load')) {
	case 'js':
		$js = "";
		for ($i = 0; $i < count($js_depends); $i++)
			$js .= file_get_contents($js_depends[$i])."\n";
		$js = str_replace("//#", "//", $js);
		echo $js;
		break;
	default:
		$options = $request->get_all();
		$protocol = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on')) ? 'https://' : 'http://';
		$port = ($_SERVER['SERVER_PORT'] == '80') ? '' : ':'.$_SERVER['SERVER_PORT'];
		$options['dhx_rel_path'] = $protocol.$_SERVER['SERVER_NAME'].$port.pathinfo($_SERVER['PHP_SELF'], PATHINFO_DIRNAME).'/';
		$ln = "\n";
		$tab = "\t";
		$cfg = Array();
		foreach($options as $k => $v) {
			if ($v === 'true')
				$cfg[] = $ln.$tab.$k.": true";
			else if ($v === 'false')
				$cfg[] = $ln.$tab.$k.": false";
			else
				$cfg[] = $ln.$tab.$k.": '".$v."'";
		}
		$cfg = "var cfg = {".implode(",", $cfg).$ln."}".$ln;
		echo $cfg;
		echo file_get_contents("loader.js");
		break;
}

?>