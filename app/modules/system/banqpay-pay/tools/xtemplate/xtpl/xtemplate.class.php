<?php

/* $Id: xtemplate.class.php,v 1.7 2005/04/11 11:20:28 cocomp Exp $
// $Log: xtemplate.class.php,v $
// Revision 1.7  2005/04/11 11:20:28  cocomp
// Fixed backslashes issue (properly\!)
//
// Revision 1.6  2005/04/11 10:00:47  cocomp
// Added restart() method sf:641407 feature request
//
// Revision 1.5  2005/04/08 09:17:37  cocomp
// Fixed bug with backslashes sf:810773 & updated docs
//
// Revision 1.4  2005/04/07 12:02:52  cocomp
// MAJOR UPDATE: E_ALL safe, better internal documentation, code readability ++, many bugfixes and new features - considered stable
//
*/

/*

XTemplate class - http://www.phpxtemplate.org/

Latest stable & CVS versions available @ http://sourceforge.net/projects/xtpl/

License: LGPL / BSD - see license.txt

html generation with templates - fast & easy
Copyright (c) 2000-2001 Barnabas Debreceni [cranx@users.sourceforge.net], 2002-2005 Jeremy Coates [cocomp@users.sourceforge.net]

contributors:
Ivar Smolin <okul@linux.ee> (14-march-2001)
- made some code optimizations
Bert Jandehoop <bert.jandehoop@users.info.wau.nl> (26-june-2001)
- new feature to substitute template files by other templates
- new method array_loop()

Various contributions over the years from:
Code: Noel Walsh (NW), John Carter (JC)
Bug reporting: SadGeezer

*/

// When developing uncomment the line below, re-comment before making public
//error_reporting(E_ALL);
class XTemplate {

	/***[ variables ]***********************************************************/

	var $filecontents = '';                               /* raw contents of template file */
	var $blocks = array();                                /* unparsed blocks */
	var $parsed_blocks = array();                 /* parsed blocks */
	var $preparsed_blocks = array();          /* preparsed blocks, for file includes */
	var $block_parse_order = array();         /* block parsing order for recursive parsing (sometimes reverse:) */
	var $sub_blocks = array();                        /* store sub-block names for fast resetting */
	var $vars = array();                                  /* variables array */
	var $filevars = array();                          /* file variables array */
	var $filevar_parent = array();                /* filevars' parent block */
	var $filecache = array();                         /* file caching */

	var $tpldir = '';                     /* location of template files */
	var $files = null;                    /* file names lookup table */
	var $filename = '';

	// moved to setup method so uses the tag_start & end_delims
	var $file_delim = '';//"/\{FILE\s*\"([^\"]+)\"\s*\}/m";  /* regexp for file includes */
	var $filevar_delim = '';//"/\{FILE\s*\{([A-Za-z0-9\._]+?)\}\s*\}/m";  /* regexp for file includes */
	var $filevar_delim_nl = '';//"/^\s*\{FILE\s*\{([A-Za-z0-9\._]+?)\}\s*\}\s*\n/m";  /* regexp for file includes w/ newlines */
	var $block_start_delim = '<!-- ';         /* block start delimiter */
	var $block_end_delim = '-->';                 /* block end delimiter */
	var $block_start_word = 'BEGIN:';         /* block start word */
	var $block_end_word = 'END:';                 /* block end word */

	/* this makes the delimiters look like: <!-- BEGIN: block_name --> if you use my syntax. */

	var $tag_start_delim = '{';
	var $tag_end_delim = '}';
	/* this makes the delimiters look like: {tagname} if you use my syntax. */

	var $mainblock = 'main';

	var $output_type = 'HTML';

	var $_null_string = array('' => '');             /* null string for unassigned vars */
	var $_null_block = array('' => '');  /* null string for unassigned blocks */
	var $_error = '';
	var $_autoreset = true;                                     /* auto-reset sub blocks */

	var $_ignore_missing_blocks = true ;          // NW 17 oct 2002 - Set to FALSE to
	// generate errors if a non-existant blocks is referenced

	// JC 20/11/02 for echoing the template filename if in development
	var $_file_name_full_path = '';
	
	/**
     * Constructor - Instantiate the object
     *
     * @param string $file Template file to work on
     * @param string $tpldir Location of template files (useful for keeping files outside web server root)
     * @param array $files Filenames lookup
     * @param string $mainblock Name of main block in the template
     * @param boolean $autosetup If true, run setup() as part of constuctor
     * @return XTemplate
     */
	function XTemplate ($file,  $tpldir = '', $files = null, $mainblock = 'main', $autosetup = true) {

		$this->filename = $file;

		// JC 20/11/02 for echoing the template filename if in development
		$this->_file_name_full_path = realpath($file);
		
		$this->tpldir = $tpldir;

		if (is_array($files)) {
			$this->files = $files;
		}

		$this->mainblock = $mainblock;

		if ($autosetup) {
			// setup the rest of the preprocess elements
			$this->setup();
		}
	}


	/***************************************************************************/
	/***[ public stuff ]********************************************************/
	/***************************************************************************/

	/**
	 * Restart the class - allows one instantiation with several files processed by restarting
	 * e.g. $xtpl = new XTemplate('file1.xtpl');
	 * $xtpl->parse('main');
	 * $xtpl->out('main');
	 * $xtpl->restart('file2.xtpl');
	 * $xtpl->parse('main');
	 * $xtpl->out('main');
	 * (Added in response to sf:641407 feature request)
	 *
	 * @param string $file Template file to work on
	 * @param string $tpldir Location of template files
	 * @param array $files Filenames lookup
	 * @param string $mainblock Name of main block in the template
	 * @param boolean $autosetup If true, run setup() as part of restarting
	 * @param string $tag_start {
	 * @param string $tag_end }
	 */
	function restart ($file, $tpldir = '', $files = null, $mainblock = 'main', $autosetup = true, $tag_start = '{', $tag_end = '}') {
		
		$this->filename = $file;
		
		$this->_file_name_full_path = realpath($file);
		
		$this->tpldir = $tpldir;
		
		if (is_array($files)) {
			$this->files = $files;
		}
		
		$this->mainblock = $mainblock;
		
		$this->tag_start_delim = $tag_start;
		$this->tag_end_delim = $tag_end;

		// Start with fresh file contents
		$this->filecontents = '';
		
		// Reset the template arrays
		$this->blocks = array();
		$this->parsed_blocks = array();
		$this->preparsed_blocks = array();
		$this->block_parse_order = array();
		$this->sub_blocks = array();
		$this->vars = array();
		$this->filevars = array();
		$this->filevar_parent = array();
		$this->filecache = array();

		if ($autosetup) {
			$this->setup();
		}
	}

	/**
     * setup - the elements that were previously in the constructor
     *
     * @access public
     * @param boolean $add_outer If true is passed when called, it adds an outer main block to the file
     */
	function setup ($add_outer = false) {
		
		$this->tag_start_delim = preg_quote($this->tag_start_delim);
		$this->tag_end_delim = preg_quote($this->tag_end_delim);

		// Setup the file delimiters

		// regexp for file includes
		$this->file_delim = "/" . $this->tag_start_delim . "FILE\s*\"([^\"]+)\"\s*" . $this->tag_end_delim . "/m";

		// regexp for file includes
		$this->filevar_delim = "/" . $this->tag_start_delim . "FILE\s*" . $this->tag_start_delim . "([A-Za-z0-9\._]+?)" . $this->tag_end_delim . "\s*" . $this->tag_end_delim . "/m";

		// regexp for file includes w/ newlines
		$this->filevar_delim_nl = "/^\s*" . $this->tag_start_delim . "FILE\s*" . $this->tag_start_delim . "([A-Za-z0-9\._]+?)" . $this->tag_end_delim . "\s*" . $this->tag_end_delim . "\s*\n/m";

		if (empty($this->filecontents)) {
			// read in template file
			$this->filecontents = $this->_r_getfile($this->filename);
		}

		if ($add_outer) {
			$this->_add_outer_block();
		}

		// preprocess some stuff
		$this->blocks = $this->_maketree($this->filecontents, '');
		$this->filevar_parent = $this->_store_filevar_parents($this->blocks);
		$this->scan_globals();
	}

	/**
     * assign a variable
     *
     * @access public
     * @param string $name Variable to assign $val to
     * @param string / array $val Value to assign to $name
     */
	function assign ($name, $val = '') {

		if (is_array($name)) {

			foreach ($name as $k => $v) {

				$this->vars[$k] = $v;
			}
		} else {

			$this->vars[$name] = $val;
		}
	}

	/**
     * assign a file variable
     *
     * @access public
     * @param string $name Variable to assign $val to
     * @param string / array $val Values to assign to $name
     */
	function assign_file ($name, $val = '') {

		if (is_array($name)) {

			foreach ($name as $k => $v) {

				$this->_assign_file_sub($k, $v);
			}
		} else {

			$this->_assign_file_sub($name, $val);
		}
	}

	/**
     * parse a block
     *
     * @access public
     * @param string $bname Block name to parse
     */
	function parse ($bname) {

		if (isset($this->preparsed_blocks[$bname])) {

			$copy = $this->preparsed_blocks[$bname];

		} elseif (isset($this->blocks[$bname])) {

			$copy = $this->blocks[$bname];

		} elseif ($this->_ignore_missing_blocks) {
			// ------------------------------------------------------
			// NW : 17 Oct 2002. Added default of ignore_missing_blocks
			//      to allow for generalised processing where some
			//      blocks may be removed from the HTML without the
			//      processing code needing to be altered.
			// ------------------------------------------------------
			// JRC: 3/1/2003 added set error to ignore missing functionality
			$this->_set_error("parse: blockname [$bname] does not exist");
			return;

		} else {

			$this->_set_error("parse: blockname [$bname] does not exist");
		}

		/* from there we should have no more {FILE } directives */
		if (!isset($copy)) {
			die('Block: ' . $bname);
		}

		$copy = preg_replace($this->filevar_delim_nl, '', $copy);

		$var_array = array();

		/* find & replace variables+blocks */
		preg_match_all("/" . $this->tag_start_delim . "([A-Za-z0-9\._]+? ?#?.*?)" . $this->tag_end_delim. "/", $copy, $var_array);
		$var_array = $var_array[1];

		foreach ($var_array as $k => $v) {

			// Are there any comments in the tags {tag#a comment for documenting the template}
			$any_comments = explode('#', $v);
			$v = rtrim($any_comments[0]);

			if (sizeof($any_comments) > 1) {

				$comments = $any_comments[1];
			} else {

				$comments = '';
			}

			$sub = explode('.', $v);

			if ($sub[0] == '_BLOCK_') {

				unset($sub[0]);

				$bname2 = implode('.', $sub);

				// trinary operator eliminates assign error in E_ALL reporting
				$var = isset($this->parsed_blocks[$bname2]) ? $this->parsed_blocks[$bname2] : null;
				$nul = (!isset($this->_null_block[$bname2])) ? $this->_null_block[''] : $this->_null_block[$bname2];

				if ($var == '') {

					if ($nul == '') {
						// -----------------------------------------------------------
						// Removed requriement for blocks to be at the start of string
						// -----------------------------------------------------------
						//                      $copy=preg_replace("/^\s*\{".$v."\}\s*\n*/m","",$copy);
						// Now blocks don't need to be at the beginning of a line,
						//$copy=preg_replace("/\s*" . $this->tag_start_delim . $v . $this->tag_end_delim . "\s*\n*/m","",$copy);
						$copy = preg_replace("/" . $this->tag_start_delim . $v . $this->tag_end_delim . "/m", '', $copy);

					} else {

						$copy = preg_replace("/" . $this->tag_start_delim . $v . $this->tag_end_delim . "/", "$nul", $copy);
					}
				} else {

					$var = trim($var);
					// SF Bug no. 810773 - thanks anonymous
					$var = str_replace('\\', '\\\\', $var);
					// Ensure dollars in strings are not evaluated reported by SadGeezer 31/3/04
					$var = str_replace('$', '\\$', $var);
					// Replaced str_replaces with preg_quote
					//$var = preg_quote($var);
					$var = str_replace('\\|', '|', $var);
					$copy = preg_replace("|" . $this->tag_start_delim . $v . $this->tag_end_delim . "|", "$var", $copy);
				}
			} else {

				$var = $this->vars;

				foreach ($sub as $v1) {

					// NW 4 Oct 2002 - Added isset and is_array check to avoid NOTICE messages
					// JC 17 Oct 2002 - Changed EMPTY to stlen=0
					//                if (empty($var[$v1])) { // this line would think that zeros(0) were empty - which is not true
					if (!isset($var[$v1]) || (!is_array($var[$v1]) && strlen($var[$v1]) == 0)) {

						// Check for constant, when variable not assigned
						if (defined($v1)) {

							$var[$v1] = constant($v1);

						} else {

							$var[$v1] = null;
						}
					}

					$var = $var[$v1];
				}

				$nul = (!isset($this->_null_string[$v])) ? ($this->_null_string[""]) : ($this->_null_string[$v]);
				$var = (!isset($var)) ? $nul : $var;

				if ($var == '') {
					// -----------------------------------------------------------
					// Removed requriement for blocks to be at the start of string
					// -----------------------------------------------------------
					//                    $copy=preg_replace("|^\s*\{".$v." ?#?".$comments."\}\s*\n|m","",$copy);
					$copy=preg_replace("|\s*" . $this->tag_start_delim . $v . " ?#?" . $comments . $this->tag_end_delim . "\s*\n|m", '', $copy);
				}

				$var = trim($var);
				// SF Bug no. 810773 - thanks anonymous
				$var = str_replace('\\', '\\\\', $var);
				// Ensure dollars in strings are not evaluated reported by SadGeezer 31/3/04
				$var = str_replace('$', '\\$', $var);
				// Replace str_replaces with preg_quote
				//$var = preg_quote($var);
				$var = str_replace('\\|', '|', $var);
				$copy=preg_replace("|" . $this->tag_start_delim . $v . " ?#?" . $comments . $this->tag_end_delim . "|", "$var", $copy);
			}
		}

		if (isset($this->parsed_blocks[$bname])) {
			$this->parsed_blocks[$bname] .= $copy;
		} else {
			$this->parsed_blocks[$bname] = $copy;
		}

		/* reset sub-blocks */
		if ($this->_autoreset && (!empty($this->sub_blocks[$bname]))) {

			reset($this->sub_blocks[$bname]);

			foreach ($this->sub_blocks[$bname] as $k => $v) {
				$this->reset($v);
			}
		}
	}

	/**
     * returns the parsed text for a block, including all sub-blocks.
     *
     * @access public
     * @param string $bname Block name to parse
     */
	function rparse ($bname) {

		if (!empty($this->sub_blocks[$bname])) {

			reset($this->sub_blocks[$bname]);

			foreach ($this->sub_blocks[$bname] as $k => $v) {

				if (!empty($v)) {
					$this->rparse($v);
				}
			}
		}

		$this->parse($bname);
	}

	/**
     * inserts a loop ( call assign & parse )
     *
     * @access public
     * @param string $bname Block name to assign
     * @param string $var Variable to assign values to
     * @param string / array $value Value to assign to $var
    */
	function insert_loop ($bname, $var, $value = '') {

		$this->assign($var, $value);
		$this->parse($bname);
	}

	/**
     * parses a block for every set of data in the values array
     *
     * @access public
     * @param string $bname Block name to loop
     * @param string $var Variable to assign values to
     * @param array $values Values to assign to $var
    */
	function array_loop ($bname, $var, &$values) {

		if (is_array($values)) {

			foreach($values as $v) {

				$this->assign($var, $v);
				$this->parse($bname);
			}
		}
	}

	/**
     * returns the parsed text for a block
     *
     * @access public
     * @param string $bname Block name to return
     * @return string
     */
	function text ($bname = '') {

		// JC 20/11/02 moved from ::out()
		$text = '';
		/*if (SYSTEM_TYPE == 'development' && $this->output_type == "HTML") {
		$Text = "<!-- Template: " . $this->_file_name_full_path . " -->\n";
		} else {
		$Text = "";
		}*/

		$bname = !empty($bname) ? $bname : $this->mainblock;

		$text .= isset($this->parsed_blocks[$bname]) ? $this->parsed_blocks[$bname] : $this->get_error();

		return $text;
	}

	/**
     * prints the parsed text
     *
     * @access public
     * @param string $bname Block name to echo out
     */
	function out ($bname) {

		$out = $this->text($bname);
		//        $length=strlen($out);
		//header("Content-Length: ".$length); // TODO: Comment this back in later

		// JC 20/11/02 echo the template filename if in development as
		// html comment
		// note 4.3.0 and ZE2 have new function debug_backtrace() that show a
		// function call list - it may be nice to dump that here too
		//if (SYSTEM_TYPE == 'development') {
		//    echo "<!-- Template: " . $this->_file_name_full_path . " -->\n";
		//}
		// moved to ::text() so parsing sub templates work

		echo $out;
	}

	/**
     * prints the parsed text to a specified file
     *
     * @access public
     * @param string $bname Block name to write out
     * @param string $fname File name to write to
     */
	function out_file ($bname, $fname) {

		if (!empty($bname) && !empty($fname) && is_writeable($fname)) {

			$fp = fopen($fname, 'w');
			fwrite($fp, $this->text($bname));
			fclose($fp);
		}
	}

	/**
     * resets the parsed text
     *
     * @access public
     * @param string $bname Block to reset
     */
	function reset ($bname) {

		$this->parsed_blocks[$bname] = '';
	}

	/**
     * returns true if block was parsed, false if not
     *
     * @access public
     * @param string $bname Block name to test
     * @return boolean
     */
	function parsed ($bname) {

		return (!empty($this->parsed_blocks[$bname]));
	}

	/**
     * sets the string to replace in case the var was not assigned
     *
     * @access public
     * @param string $str Display string for null block
     * @param string $varname Variable name to apply $str to
     */
	function SetNullString ($str, $varname = '') {

		$this->_null_string[$varname] = $str;
	}

	/**
     * sets the string to replace in case the block was not parsed
     *
     * @access public
     * @param string $str Display string for null block
     * @param string $bname Block name to apply $str to
     */
	function SetNullBlock ($str, $bname = '') {

		$this->_null_block[$bname] = $str;
	}

	/**
     * sets AUTORESET to 1. (default is 1)
     * if set to 1, parse() automatically resets the parsed blocks' sub blocks
     * (for multiple level blocks)
     *
     * @access public
     */
	function set_autoreset () {

		$this->_autoreset = true;
	}

	/**
     * sets AUTORESET to 0. (default is 1)
     * if set to 1, parse() automatically resets the parsed blocks' sub blocks
     * (for multiple level blocks)
     *
     * @access public
     */
	function clear_autoreset () {

		$this->_autoreset = false;
	}

	/**
     * scans global variables and assigns to PHP array
     *
     * @access public
     */
	function scan_globals () {

		reset($GLOBALS);

		foreach ($GLOBALS as $k => $v) {
			$GLOB[$k] = $v;
		}

		$this->assign('PHP', $GLOB); /* access global variables as {PHP.HTTP_SERVER_VARS.HTTP_HOST} in your template! */
	}

	/**
     * gets error condition / string
     *
     * @access public
     * @return boolean / string
     */
	function get_error () {

		// JRC: 3/1/2003 Added ouptut wrapper and detection of output type for error message output
		$retval = false;

		if ($this->_error != '') {
			
			switch ($this->output_type) {
				case 'HTML':
				case 'html':
				$retval = '<b>[XTemplate]</b><ul>' . nl2br(str_replace('* ', '<li>', str_replace(" *\n", "</li>\n", $this->_error))) . '</ul>';
				break;

				default:
				$retval = '[XTemplate] ' . str_replace(' *\n', "\n", $this->_error);
				break;
			}
		}

		return $retval;
	}

	/***************************************************************************/
	/***[ private stuff ]*******************************************************/
	/***************************************************************************/

	/**
     * generates the array containing to-be-parsed stuff: $blocks["main"],$blocks["main.table"],$blocks["main.table.row"], etc. also builds the reverse parse order.
     *
     * @access private
     * @param string $con content to be processed
     * @param string $parentblock name of the parent block in the block hierarchy
     */
	function _maketree ($con, $parentblock='') {

		$blocks = array();

		$con2 = explode($this->block_start_delim, $con);

		if (!empty($parentblock)) {

			$block_names = explode('.', $parentblock);
			$level = sizeof($block_names);

		} else {

			$block_names = array();
			$level = 0;
		}

		foreach($con2 as $k => $v) {

			// JRC 06/04/2005 Added block comments (on BEGIN or END) <!-- BEGIN: block_name#Comments placed here -->
			//$patt = "($this->block_start_word|$this->block_end_word)\s*(\w+)\s*$this->block_end_delim(.*)";
			$patt = "($this->block_start_word|$this->block_end_word)\s*(\w+) ?#?.*?\s*$this->block_end_delim(.*)";

			$res = array();

			if (preg_match_all("/$patt/ims", $v, $res, PREG_SET_ORDER)) {
				// $res[0][1] = BEGIN or END
				// $res[0][2] = block name
				// $res[0][3] = kinda content
				$block_word	= $res[0][1];
				$block_name	= $res[0][2];
				$content	= $res[0][3];
				
				if (strtoupper($block_word) == $this->block_start_word) {

					$parent_name = implode('.', $block_names);

					// add one level - array("main","table","row")
					$block_names[++$level] = $block_name;

					// make block name (main.table.row)
					$cur_block_name=implode('.', $block_names);

					// build block parsing order (reverse)
					$this->block_parse_order[] = $cur_block_name;

					//add contents. trinary operator eliminates assign error in E_ALL reporting
					$blocks[$cur_block_name] = isset($blocks[$cur_block_name]) ? $blocks[$cur_block_name] . $content : $content;

					// add {_BLOCK_.blockname} string to parent block
					$blocks[$parent_name] .= str_replace('\\', '', $this->tag_start_delim) . '_BLOCK_.' . $cur_block_name . str_replace('\\', '', $this->tag_end_delim);

					// store sub block names for autoresetting and recursive parsing
					$this->sub_blocks[$parent_name][] = $cur_block_name;

					// store sub block names for autoresetting
					$this->sub_blocks[$cur_block_name][] = '';

				} else if (strtoupper($block_word) == $this->block_end_word) {

					unset($block_names[$level--]);

					$parent_name = implode('.', $block_names);

					// add rest of block to parent block
					$blocks[$parent_name] .= $res[0][3];
				}
			} else {

				// no block delimiters found
				// Saves doing multiple implodes - less overhead
				$tmp = implode('.', $block_names);

				if ($k) {
					$blocks[$tmp] .= $this->block_start_delim;
				}

				// trinary operator eliminates assign error in E_ALL reporting
				$blocks[$tmp] = isset($blocks[$tmp]) ? $blocks[$tmp] . $v : $v;
			}
		}

		return $blocks;
	}

	/**
     * Sub processing for assign_file method
     *
     * @param string $name
     * @param string $val
     */
	function _assign_file_sub ($name, $val) {

		if (isset($this->filevar_parent[$name])) {

			if ($val != '') {

				$val = $this->_r_getfile($val);

				foreach($this->filevar_parent[$name] as $parent) {

					if (isset($this->preparsed_blocks[$parent]) && !isset($this->filevars[$name])) {

						$copy = $this->preparsed_blocks[$parent];

					} elseif (isset($this->blocks[$parent])) {

						$copy = $this->blocks[$parent];
					}

					$res = array();

					preg_match_all($this->filevar_delim, $copy, $res, PREG_SET_ORDER);

					if (is_array($res) && isset($res[0])) {

						foreach ($res[0] as $v) {

							$copy = preg_replace("/" . preg_quote($v) . "/", "$val", $copy);
							$this->preparsed_blocks = array_merge($this->preparsed_blocks, $this->_maketree($copy, $parent));
							$this->filevar_parent = array_merge($this->filevar_parent, $this->_store_filevar_parents($this->preparsed_blocks));
						}
					}
				}
			}
		}

		$this->filevars[$name] = $val;
	}

	/**
     * store container block's name for file variables
     *
     * @access private
     * @param array $blocks
     * @return array
     */
	function _store_filevar_parents ($blocks){

		$parents = array();

		foreach ($blocks as $bname => $con) {

			$res = array();

			preg_match_all($this->filevar_delim, $con, $res);

			foreach ($res[1] as $k => $v) {

				$parents[$v][] = $bname;
			}
		}
		return $parents;
	}

	/**
     * Set the error string
     *
     * @param string $str
     */
	function _set_error ($str)    {

		//$this->_error="<b>[XTemplate]</b>&nbsp;<i>".$str."</i>";
		// JRC: 3/1/2003 Made to append the error messages
		$this->_error .= '* ' . $str . " *\n";
		// JRC: 3/1/2003 Removed trigger error, use this externally if you want it eg. trigger_error($xtpl->get_error())
		//trigger_error($this->get_error());
	}

	/**
     * returns the contents of a file
     *
     * @access private
     * @param string $file
     * @return string
     */
	function _getfile ($file) {

		if (!isset($file)) {
			// JC 19/12/02 added $file to error message
			$this->_set_error('!isset file name!' . $file);

			return '';
		}

		// check if filename is mapped to other filename
		if (isset($this->files)) {

			if (isset($this->files[$file])) {

				$file = $this->files[$file];
			}
		}

		// prepend template dir
		if (!empty($this->tpldir)) {

			$file = $this->tpldir. '/' . $file;
		}

		if (isset($this->filecache[$file])) {

			$file_text=$this->filecache[$file];

		} else {

			if (is_file($file)) {

				if (!($fh = fopen($file, 'r'))) {

					$this->_set_error('Cannot open file: ' . $file);
					return '';
				}

				$file_text = fread($fh,filesize($file));
				fclose($fh);

			} else {

				// NW 17Oct 2002 : Added realpath around the file name to identify where the code is searching.
				$this->_set_error("[" . realpath($file) . "] ($file) does not exist");
				$file_text = "<b>__XTemplate fatal error: file [$file] does not exist__</b>";
			}

			$this->filecache[$file] = $file_text;
		}

		return $file_text;
	}

	/**
     * recursively gets the content of a file with {FILE "filename.tpl"} directives
     *
     * @access private
     * @param string $file
     * @return string
     */
	function _r_getfile ($file) {

		$text = $this->_getfile($file);

		$res = array();

		while (preg_match($this->file_delim,$text,$res)) {
			
			$text2 = $this->_getfile($res[1]);
			$text = preg_replace("'".preg_quote($res[0])."'",$text2,$text);
		}

		return $text;
	}


	/**
     * add an outer block delimiter set useful for rtfs etc - keeps them editable in word
     *
     * @access private
     */
	function _add_outer_block () {

		$before = $this->block_start_delim . $this->block_start_word . ' ' . $this->mainblock . ' ' . $this->block_end_delim;
		$after = $this->block_start_delim . $this->block_end_word . ' ' . $this->mainblock . ' ' . $this->block_end_delim;

		$this->filecontents = $before . "\n" . $this->filecontents . "\n" . $after;
	}

	/**
     * Debug function - var_dump wrapped in '<pre></pre>' tags
     *
     * @access private
     * @param multiple Var_dumps all the supplied arguments
     */
	function _pre_var_dump () {

		echo '<pre>';
		var_dump(func_get_args());
		echo '</pre>';
	}
} /* end of XTemplate class. */

/* Stuff from development outside sourceforge

// Revision 1.2  2003/12/05 22:22:17  jeremy
// Removed duplicate function call in out method
//
// Revision 1.1.1.1  2003/10/29 20:22:43  jeremy
// Initial Import
//
// Revision 1.1  2003/06/25 17:17:52  jeremy
// Initial Import
//
// Revision 1.4  2001/08/17 18:25:45  jeremy
// Sorted greedy matching regular expression in parse function preg_match_all line 166: added ? after .* when looking for comments
//
*/
/* Old log stuff

Revision 1.2  2001/09/19 14:11:25  cranx
fixed a bug in the whitespace-stripping block variable interpolating regexp.

Revision 1.1  2001/07/11 10:42:39  cranx
added:
- filename substitution, no nested arrays for the moment, sorry
(including happens when assigning, so assign filevar in the outside blocks first!)

Revision 1.5  2001/07/11 10:39:08  cranx
added:
- we can now specify base dir
- array_loop()
- trigger_error in _set_error

modified:
- newline bugs fixed (for XML)
- in out(): content-length header added
- whiles changed to foreach
- from now on, the class is php4 only :P

*/
/* Old stuff from original releases

xtemplate class 0.3pre
!!! {FILE {VAR}} file variable interpolation may still be buggy !!!
*/

?>