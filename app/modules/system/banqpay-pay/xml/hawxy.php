<?php

// HAWXY: HAWHAW XML Proxy
//
// Copyright (C) 2005 Norbert Huffschmid
// Last modified: 22. January 2006
//
// This program makes ordinary PHP-enabled webservers to HAWHAW
// proxies. A HAWHAW proxy is a server through which a broad
// range of mobile devices can browse web pages written in
// HAWHAW XML.
//
// HAWHAW XML is a markup language especially designed for mobile
// applications. HAWHAW XML can be converted into many other
// markup languages like HTML, WML, HDML, cHTML and MML. As existing
// mobile devices do not understand HAWHAW XML, a conversion
// from HAWHAW XML into the markup language accepted by a given
// browser is necessary. A HAWHAW proxy performs this conversion
// automatically.
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// http://www.gnu.org/copyleft/gpl.html
//
// This program requires the HAWHAW PHP class library hawhaw.inc
// V5.12 or higher. Please visit the HAWHAW homepage at
// http://www.hawhaw.de/ for download and more information about

define("HAX_VERSION", "1.4.2");

#######    HAWXY CONFIGURATION PART (BEGIN)    ##############################

// you can overwrite these default config values by creating a
// file named hawxy_config.php which is located in the same directory
// as hawxy.php and contains the (modified) HAWXY CONFIGURATION PART
// ==> advantage: hawxy.php is not to be modified again in case of
//                upgrade to higher version
@include("hawxy_config.php");

// error messages
$err = array();
$err[0] = "Could not connect to remote XML server:";
$err[1] = "Maximum XML file size exceeded!";
$err[2] = "XML error";
$err[3] = "Invalid redirection attribute";
$err[4] = "Error";
$err[5] = "Second <deck> declaration not allowed!";
$err[6] = "not allowed here";
$err[7] = "requires attribute:";
$err[8] = "Second <linkset> not allowed!";
$err[9] = "Second <form> not allowed!";
$err[10]= "line";
$err[11]= "Invalid address";
$err[12]= "403: Forbidden - Connection to remote XML server not allowed";
$err[13]= "This proxy does not support automatic image conversion!";
$err[14]= "invalid attribute:";

// constants for XML parsing
define("HAX_PARSE_BEGIN", 1);
define("HAX_PARSE_END", 2);

// constants for XML tags
define("HAX_TAG_UNDEFINED",	0);
define("HAX_TAG_HAWHAW",	1);
define("HAX_TAG_DECK",		2);
define("HAX_TAG_FORM",		3);
define("HAX_TAG_TEXT",		4);
define("HAX_TAG_RULE",		5);
define("HAX_TAG_LINK",		6);
define("HAX_TAG_LINKSET",	7);
define("HAX_TAG_INPUT",		8);
define("HAX_TAG_SUBMIT",	9);
define("HAX_TAG_RADIO",		10);
define("HAX_TAG_BUTTON",	11);
define("HAX_TAG_CHECKBOX",	12);
define("HAX_TAG_SELECT",	13);
define("HAX_TAG_OPTION",	14);
define("HAX_TAG_HIDDEN",	15);
define("HAX_TAG_IMAGE",		16);
define("HAX_TAG_TABLE",		17);
define("HAX_TAG_ROW",		18);
define("HAX_TAG_TD",		19);
define("HAX_TAG_PHONE",		20);
define("HAX_TAG_VOICE_TEXT",	21);
define("HAX_TAG_VOICE_HELP",	22);
define("HAX_TAG_VOICE_NOMATCH",	23);
define("HAX_TAG_VOICE_NOINPUT",	24);
define("HAX_TAG_RAW",	25);


class HAX_tagstack
{
  // stack class for storage of HAWHAW tags, read by PHP's XML parser

  var $pointer;
  var $stack = array();

  function HAX_tagstack()
  {
    // Constructor
    $this->pointer = 0;
  }

  function push($element, $tag)
  {
    $this->stack[$this->pointer]["element"] = $element;
    $this->stack[$this->pointer]["tag"] = $tag;
    $this->pointer++;
    return;
  }

  function pop()
  {
    $this->pointer--;
    return($this->stack[$this->pointer]);
  }

  function get_size()
  {
    return($this->pointer);
  }

  function get_previous_tag()
  {
    if ($this->pointer == 0)
      return(HAX_TAG_UNDEFINED);
    else
      return($this->stack[$this->pointer - 1]["tag"]);
  }
};

class HAX_td
{
  // pseudo HAWHAW class for td element

  var $element; // points to HAW_text, HAW_image, HAW_link or NONE object
  var $tag;     // type of stored element

  function HAX_td()
  {
    // Constructor
    $this->element = 0;
    $this->tag = HAX_TAG_UNDEFINED;
  }
};

class HAX_voice_event
{
  // pseudo class for help/nomatch/noinput events

  var $tag;
  var $text;
  var $audio_src;
  var $url;

  function HAX_voice_event($tag, $text, $audio_src="", $url="")
  {
    // Constructor
    $this->tag = $tag;
    $this->text = $text;
    $this->audio_src = $audio_src;
    $this->url = $url;
  }
};



function handleParsedElement($parser, $pos, $name, $attrs)
{
  global $tag_stack;
  global $err;
  global $banner;
  global $img_conversion_enabled;
  global $skin;
  global $allow_skin_attribute;
  static $number_of_decks = 0;
  static $number_of_forms = 0;
  static $number_of_linksets = 0;
  static $markup_language = 0;

  $line = xml_get_current_line_number($parser);

  switch ($name)
  {
    case "HAWHAW":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_HAWHAW, $parser);
        $tag_stack->push(0, HAX_TAG_HAWHAW);
      }
      else
      {
        // HAX_PARSE_END
        $tag_stack->pop();
      }

      break;
    }

    case "DECK":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_DECK, $parser);

        if ($number_of_decks++ > 0)
          error($err[5], $parser, $line);

        // determine contructor arguments of HAW_deck

        if (isset($attrs["TITLE"]))
          $title = $attrs["TITLE"];
        else
          $title = HAW_NOTITLE;

        if (isset($attrs["ALIGN"]) && ($attrs["ALIGN"] == "center"))
          $alignment = HAW_ALIGN_CENTER;
        elseif (isset($attrs["ALIGN"]) && ($attrs["ALIGN"] == "right"))
          $alignment = HAW_ALIGN_RIGHT;
        else
          $alignment = HAW_ALIGN_LEFT;

        $output = HAW_OUTPUT_AUTOMATIC;
        if (isset($attrs["OUTPUT"]))
        {
          switch ($attrs["OUTPUT"])
          {
            case "bigscreen": { $output = HAW_OUTPUT_BIGSCREEN; break; }
            case "wap":       { $output = HAW_OUTPUT_WAP;       break; }
            case "hdml":      { $output = HAW_OUTPUT_HDML;      break; }
            case "pda":       { $output = HAW_OUTPUT_PDA;       break; }
            case "imode":     { $output = HAW_OUTPUT_IMODE;     break; }
            case "mml":       { $output = HAW_OUTPUT_MML;       break; }
            case "voicexml":  { $output = HAW_OUTPUT_VOICEXML;  break; }
            case "xhtml":     { $output = HAW_OUTPUT_XHTML;     break; }
          }
        }

        // initiate HAW_deck object
        $deck = new HAW_deck($title, $alignment, $output);

        $markup_language = $deck->ml;

        // modify HAW_deck objects according attribute list

        if (isset($attrs["REDIRECTION"]))
        {
          $redirection = explode(";", $attrs["REDIRECTION"]);
          $redirection[0] = trim($redirection[0]);  // strip whitespace
          $redirection[1] = trim($redirection[1]);

          if (($redirection[0] < 1) || ($redirection[0] > 3600))
            error($err[3], $parser, $line); // invalid time value

          if (substr(strtolower($redirection[1]), 0, 4) != "url=")
            error($err[3], $parser, $line); // invalid URL declaration

          $deck->set_redirection($redirection[0], determine_url(substr($redirection[1], 4)));
        }

        if (isset($attrs["CACHE"]) &&
            (strtolower($attrs["CACHE"]) == "no")) $deck->disable_cache();
        if (isset($attrs["CHARSET"]))		   $deck->set_charset($attrs["CHARSET"]);
        if (isset($attrs["LANGUAGE"]))		   $deck->set_language($attrs["LANGUAGE"]);
        if (isset($attrs["BACKGROUND"]))	   $deck->set_background($attrs["BACKGROUND"]);
        if (isset($attrs["BGCOLOR"]))		   $deck->set_bgcolor($attrs["BGCOLOR"]);
        if (isset($attrs["SIZE"]))		   $deck->set_size($attrs["SIZE"]);
        if (isset($attrs["COLOR"]))		   $deck->set_color($attrs["COLOR"]);
        if (isset($attrs["LINK_COLOR"]))	   $deck->set_link_color($attrs["LINK_COLOR"]);
        if (isset($attrs["VLINK_COLOR"]))	   $deck->set_vlink_color($attrs["VLINK_COLOR"]);
        if (isset($attrs["FACE"]))		   $deck->set_face($attrs["FACE"]);

        if (isset($attrs["WAPHOME"]))
	  $deck->set_waphome($attrs["WAPHOME"]);
        else
	  $deck->set_waphome("http://" . getenv("HTTP_HOST") . getenv("REQUEST_URI"));

        if (isset($attrs["VOICE_JINGLE"]))	   $deck->set_voice_jingle($attrs["VOICE_JINGLE"]);

        if (isset($attrs["SKIN"]) && $allow_skin_attribute)
          $deck->use_simulator($attrs["SKIN"]);
        else
          $deck->use_simulator($skin);

        // display banners on top of simulator device
        while (list($key, $val) = each($banner))
        {
          // edit config file for banner control
          $top_banner[$key] = new HAW_banner($val["img"], $val["url"], $val["alt"]);
          $top_banner[$key]->set_size($val["width"], $val["height"]);
          $deck->add_banner($top_banner[$key], HAW_TOP);
        }

        $tag_stack->push($deck, HAX_TAG_DECK);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();
        $deck = $element["element"];
        $deck->create_page();
      }

      break;
    }

    case "FORM":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_FORM, $parser);

        if ($number_of_forms++ > 0)
          error($err[9], $parser, $line);

        if (!isset($attrs["ACTION"]))
          error("<form> " . $err[7] . " action", $parser, $line); // action attribute is missing

        // initiate HAW_form object
        $form = new HAW_form($_SERVER['SCRIPT_NAME']);

        // add info about XML source where form input has to be propagated to
        $action = $attrs["ACTION"];
        $hidden = new HAW_hidden("code", $attrs["ACTION"]);
        $form->add_hidden($hidden);

        $tag_stack->push($form, HAX_TAG_FORM);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_form object
        $form = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck)
        $base_element = $element["element"];
        $base_element->add_form($form);		// add HAW_form to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "TEXT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_TEXT, $parser);

        $format = "HAW_TEXTFORMAT_NORMAL";
        if (isset($attrs["BOLD"]) && (strtolower($attrs["BOLD"]) == "yes"))
          $format |= HAW_TEXTFORMAT_BOLD;
        if (isset($attrs["ITALIC"]) && (strtolower($attrs["ITALIC"]) == "yes"))
          $format |= HAW_TEXTFORMAT_ITALIC;
        if (isset($attrs["UNDERLINE"]) && (strtolower($attrs["UNDERLINE"]) == "yes"))
          $format |= HAW_TEXTFORMAT_UNDERLINE;
        if (isset($attrs["BIG"]) && (strtolower($attrs["BIG"]) == "yes"))
          $format |= HAW_TEXTFORMAT_BIG;
        if (isset($attrs["SMALL"]) && (strtolower($attrs["SMALL"]) == "yes"))
          $format |= HAW_TEXTFORMAT_SMALL;
        if (isset($attrs["BOXED"]) && (strtolower($attrs["BOXED"]) == "yes"))
          $format |= HAW_TEXTFORMAT_BOXED;

        $text = new HAW_text("", $format);

        if (isset($attrs["BR"]) && ($attrs["BR"] >= 0))
          $text->set_br($attrs["BR"]+0); // convert string to int!

        if (isset($attrs["COLOR"]))
        {
          $textcolor = $attrs["COLOR"];

          if (isset($attrs["BOXCOLOR"]))
            $boxcolor = $attrs["BOXCOLOR"];
          else
            $boxcolor = "";

          $text->set_color($textcolor, $boxcolor);
        }

        $tag_stack->push($text, HAX_TAG_TEXT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_text object
        $text = $element["element"];

        if (!$text->voice_text)
          $text->voice_text = $text->text;      // update voice_text if not already set

        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_form, ...)
        $base_element = $element["element"];

        if ($element["tag"] == HAX_TAG_TD)
        {
          // include HAW_text object in HAX_td pseudo class
          $base_element->element = $text;
          $base_element->tag = HAX_TAG_TEXT;
        }
        else
          $base_element->add_text($text);		// add HAW_text to base object

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "IMG":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_IMAGE, $parser);

        if (!($alt = $attrs["ALT"]))
          error("<img> " . $err[7] . " alt", $parser, $line); // alt attribute is missing

        if (isset($attrs["SRC"]))
        {
          // source attribute ==> perform automatic image conversion

          if (!$img_conversion_enabled)
            error($err[13], $parser, $line); // image conversion deactivated per config

          if (!function_exists("ImageTypes"))
            error($err[13], $parser, $line); // GD is not loaded

          if (!(ImageTypes() & (IMG_PNG | IMG_WBMP)))
            error($err[13], $parser, $line); // not all necessary image types supported

          $source = $attrs["SRC"];
          $extension = strtolower(substr($source, -4));
          $accept = strtolower($_SERVER['HTTP_ACCEPT']);

          if (   (($extension == ".gif") &&
                   ((strstr($accept, "image/gif")) ||
                   (($markup_language == HAW_HTML) && !(strstr($accept, "image/png")))))
              || (($extension == ".png") &&
                   ((strstr($accept, "image/png")) ||
                   ($markup_language == HAW_HTML)))
              || (($extension == "wbmp") && ($markup_language == HAW_WML)))
          {
            // requesting browser accepts given src image file
            // ==> no conversion required

            $src_html = $source;
            $src_wbmp = $source;
          }
          else
          {
            // session-controlled image conversion
            // convert images of HAWHAW XML files only
            // (we don't want to act as conversion server for the whole world!)

            static $img_counter = 0;

            $varname = "i" . $img_counter;
            session_register($varname);

            $_SESSION[$varname] = $attrs["SRC"];
            $_SESSION['img_ml'] = $markup_language;

            //$url = sprintf("%s?index=%d", $_SERVER['PHP_SELF'] , $img_counter);
            // auto-appending of SID does not work in some environments ?!?!?
            // PHPSESSID may appear twice in url - and if? ...
            $url = sprintf("%s?index=%d&amp;%s", $_SERVER['PHP_SELF'] , $img_counter, SID);

            // create image with session ID instead of image URL's
            // ==> hawxy script will immediately receive a new request
            //     and will create appropriate image on the fly
            $src_html = $url;
            $src_wbmp = $url;

            $img_counter++;
          }
        }

        if (!isset($src_wbmp) && !isset($attrs["WBMP"]))
          error("<img> " . $err[7] . " wbmp", $parser, $line); // wbmp attribute is missing
        elseif (isset($attrs["WBMP"]))
          $src_wbmp = $attrs["WBMP"];  // explicitely given WBMP file has precedence

        if (!isset($src_html) && !isset($attrs["HTML"]))
          error("<img> " . $err[7] . " html", $parser, $line); // html attribute is missing
        elseif (isset($attrs["HTML"]))
          $src_html = $attrs["HTML"];  // explicitely given HTML file has precedence

        if (isset($attrs["BMP"]))
          $image = new HAW_image($src_wbmp, $src_html, $alt, $attrs["BMP"]);
        else
          $image = new HAW_image($src_wbmp, $src_html, $alt);

        if (isset($attrs["BR"]) && ($attrs["BR"] >= 0))
          $image->set_br($attrs["BR"]+0); // convert string to int!

        if (isset($attrs["LOCALSRC"]))
          $image->use_localsrc($attrs["LOCALSRC"]);

        if (isset($attrs["CHTML_ICON"]))
          $image->use_chtml_icon($attrs["CHTML_ICON"]+0); // convert string to int!

        if (isset($attrs["MML_ICON"]) && (strlen($attrs["MML_ICON"]) == 2))
          $image->use_mml_icon($attrs["MML_ICON"]);

        $tag_stack->push($image, HAX_TAG_IMAGE);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_image object
        $image = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_form, ...)
        $base_element = $element["element"];

        if ($element["tag"] == HAX_TAG_TD)
        {
          // include HAW_text object in HAX_td pseudo class
          $base_element->element = $image;
          $base_element->tag = HAX_TAG_IMAGE;
        }
        else
          $base_element->add_image($image);		// add HAW_image to base object

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "INPUT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_INPUT, $parser);

        if (!($name = $attrs["NAME"]))
          error("<input> " . $err[7] . " name", $parser, $line); // name attribute is missing

        if (isset($attrs["FORMAT"]))
          $input = new HAW_input($name, $attrs["VALUE"], $attrs["LABEL"], $attrs["FORMAT"]);
        else
          $input = new HAW_input($name, $attrs["VALUE"], $attrs["LABEL"]);

        if (isset($attrs["SIZE"])) $input->set_size($attrs["SIZE"]);
        if (isset($attrs["MAXLENGTH"])) $input->set_maxlength($attrs["MAXLENGTH"]);
        if (isset($attrs["TYPE"]) && (strtolower($attrs["TYPE"]) == "password"))
          $input->set_type(HAW_INPUT_PASSWORD);

        if (isset($attrs["MODE"]))
        {
          if (strtolower($attrs["MODE"]) == "alphabet") $input->set_mode(HAW_INPUT_ALPHABET);
          if (strtolower($attrs["MODE"]) == "katakana") $input->set_mode(HAW_INPUT_KATAKANA);
          if (strtolower($attrs["MODE"]) == "hiragana") $input->set_mode(HAW_INPUT_HIRAGANA);
          if (strtolower($attrs["MODE"]) == "numeric")  $input->set_mode(HAW_INPUT_NUMERIC);
        }

        if (isset($attrs["BR"]) && ($attrs["BR"] >= 0))
          $input->set_br($attrs["BR"]+0); // convert string to int!

        if (isset($attrs["VOICE_TYPE"]))
          $input->set_voice_type($attrs["VOICE_TYPE"]);

        if (isset($attrs["VOICE_GRAMMAR_SRC"]))
        {
          // set external grammar
          if (isset($attrs["VOICE_GRAMMAR_TYPE"]))
            $input->set_voice_grammar($attrs["VOICE_GRAMMAR_SRC"], $attrs["VOICE_GRAMMAR_TYPE"]);
          else
            $input->set_voice_grammar($attrs["VOICE_GRAMMAR_SRC"]); // requires HAWHAW V5.5 or higher!
        }

        $tag_stack->push($input, HAX_TAG_INPUT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_input object
        $input = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_input($input);		  // add HAW_input to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "RADIO":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_RADIO, $parser);

        if (!($name = $attrs["NAME"]))
          error("<radio> " . $err[7] . " name", $parser, $line); // name attribute is missing

        $radio = new HAW_radio($name);

        $tag_stack->push($radio, HAX_TAG_RADIO);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_radio object
        $radio = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_radio($radio);		  // add HAW_radio to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "BUTTON":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_BUTTON, $parser);

        if (!($label = $attrs["LABEL"]))
          error("<button> " . $err[7] . " label", $parser, $line); // label attribute is missing

        if (!($value = $attrs["VALUE"]))
          error("<button> " . $err[7] . " value", $parser, $line); // value attribute is missing

        if (isset($attrs["CHECKED"]) && (strtolower($attrs["CHECKED"]) == "yes"))
          $checked = HAW_CHECKED;
        else
          $checked = HAW_NOTCHECKED;

        $element = $tag_stack->pop();		// pop base object (HAW_radio)
        $base_element = $element["element"];
        $base_element->add_button($label, $value, $checked); // add button properties
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }
      else
      {
        // HAX_PARSE_END

        // nothing to do any more
      }

      break;
    }

    case "CHECKBOX":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_CHECKBOX, $parser);

        if (!($name = $attrs["NAME"]))
          error("<checkbox> " . $err[7] . " name", $parser, $line); // name attribute is missing

        if (!($value = $attrs["VALUE"]))
          error("<checkbox> " . $err[7] . " value", $parser, $line); // value attribute is missing

        if (!($label = $attrs["LABEL"]))
          error("<checkbox> " . $err[7] . " label", $parser, $line); // label attribute is missing

        if (isset($attrs["CHECKED"]) && (strtolower($attrs["CHECKED"]) == "yes"))
          $checked = HAW_CHECKED;
        else
          $checked = HAW_NOTCHECKED;

        $checkbox = new HAW_checkbox($name, $value, $label, $checked);

        $tag_stack->push($checkbox, HAX_TAG_CHECKBOX);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_checkbox object
        $checkbox = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_checkbox($checkbox); // add HAW_checkbox to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "SELECT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_SELECT, $parser);

        if (!($name = $attrs["NAME"]))
          error("<select> " . $err[7] . " name", $parser, $line); // name attribute is missing

        if (strtolower($attrs["TYPE"]) == "popup")
          $select = new HAW_select($name, HAW_SELECT_POPUP);
        elseif (strtolower($attrs["TYPE"]) == "spin")
          $select = new HAW_select($name, HAW_SELECT_SPIN);
        else
          $select = new HAW_select($name);

        $tag_stack->push($select, HAX_TAG_SELECT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_select object
        $select = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_select($select);		  // add HAW_select to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "OPTION":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_OPTION, $parser);

        if (!($label = $attrs["LABEL"]))
          error("<option> " . $err[7] . " label", $parser, $line); // label attribute is missing

        if (!($value = $attrs["VALUE"]))
          error("<option> " . $err[7] . " value", $parser, $line); // value attribute is missing

        if (isset($attrs["SELECTED"]) && (strtolower($attrs["SELECTED"]) == "yes"))
          $selected = HAW_SELECTED;
        else
          $selected = HAW_NOTSELECTED;

        $element = $tag_stack->pop();		// pop base object (HAW_select)
        $base_element = $element["element"];
        $base_element->add_option($label, $value, $selected); // add option properties
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }
      else
      {
        // HAX_PARSE_END

        // nothing to do any more
      }

      break;
    }

    case "HIDDEN":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_HIDDEN, $parser);

        if (!($name = $attrs["NAME"]))
          error("<hidden> " . $err[7] . " name", $parser, $line); // name attribute is missing

        if (!($value = $attrs["VALUE"]))
          error("<hidden> " . $err[7] . " value", $parser, $line); // value attribute is missing

        $hidden = new HAW_hidden($name, $value);

        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_hidden($hidden); // add HAW_hidden to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }
      else
      {
        // HAX_PARSE_END

        // nothing to do any more
      }

      break;
    }

    case "SUBMIT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_SUBMIT, $parser);

        if (!($label = $attrs["LABEL"]))
          error("<submit> " . $err[7] . " label", $parser, $line); // label attribute is missing

        if (isset($attrs["NAME"]))
          $submit = new HAW_submit($label, $attrs["NAME"]);
        else
          $submit = new HAW_submit($label);

        $tag_stack->push($submit, HAX_TAG_SUBMIT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_submit object
        $submit = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_form)
        $base_element = $element["element"];
        $base_element->add_submit($submit);		  // add HAW_submit to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "A":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_LINK, $parser);

        if (!isset($attrs["HREF"]))
          error("<a> " . $err[7] . " href", $parser, $line); // href attribute is missing

        if (isset($attrs["PROXY"]) && (strtolower($attrs["PROXY"]) == "no"))
          $url = $attrs["HREF"]; // go directly to href
        else
          $url = determine_url($attrs["HREF"]); // let HAWHAW proxy retrieve href

        if (isset($attrs["TITLE"]))
          $link = new HAW_link("", $url, $attrs["TITLE"]);
        else
          $link = new HAW_link("", $url);

        if (isset($attrs["BR"]) && ($attrs["BR"] >= 0))
          $link->set_br($attrs["BR"]+0); // convert string to int!

        if (isset($attrs["VOICE_DTMF"]))
          $link->set_voice_dtmf($attrs["VOICE_DTMF"]);

        if (isset($attrs["VOICE_TIMEOUT"]))
          $link->set_voice_timeout($attrs["VOICE_TIMEOUT"]+0); // convert string to int!

        $tag_stack->push($link, HAX_TAG_LINK);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_link object
        $link = $element["element"];

        if (!$link->voice_text)
          $link->voice_text = $link->label;     // update voice_text if not already set

        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_linkset, ...)
        $base_element = $element["element"];

        if ($element["tag"] == HAX_TAG_TD)
        {
          // include HAW_link object in HAX_td pseudo class
          $base_element->element = $link;
          $base_element->tag = HAX_TAG_LINK;
        }
        else
          $base_element->add_link($link);		// add HAW_link to base object

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "LINKSET":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_LINKSET, $parser);

        if ($number_of_linksets++ > 0)
          error($err[8], $parser, $line);

        $linkset = new HAW_linkset();
        $tag_stack->push($linkset, HAX_TAG_LINKSET);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_linkset object
        $linkset = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck)
        $base_element = $element["element"];
        $base_element->add_linkset($linkset);		  // add HAW_linkset to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "TABLE":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_TABLE, $parser);

        $table = new HAW_table();

        $tag_stack->push($table, HAX_TAG_TABLE);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_table object
        $table = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_form, ...)
        $base_element = $element["element"];
        $base_element->add_table($table);		// add HAW_table to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "TR":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_ROW, $parser);

        $row = new HAW_row();

        $tag_stack->push($row, HAX_TAG_ROW);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_row object
        $row = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_table)
        $base_element = $element["element"];
        $base_element->add_row($row);		// add HAW_row to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "TD":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_TD, $parser);

        $td = new HAX_td();

        $tag_stack->push($td, HAX_TAG_TD);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAX_td object
        $td = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_row)
        $base_element = $element["element"];
        $base_element->add_column($td->element); // add included element of HAX_td to row
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "HR":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_RULE, $parser);

        if (isset($attrs["WIDTH"]) && isset($attrs["SIZE"]))
          $rule = new HAW_rule($attrs["WIDTH"], $attrs["SIZE"]);
        elseif(isset($attrs["WIDTH"]))
          $rule = new HAW_rule($attrs["WIDTH"]);
        else
          $rule = new HAW_rule();

        $tag_stack->push($rule, HAX_TAG_RULE);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_rule object
        $rule = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck or HAW_form)
        $base_element = $element["element"];
        $base_element->add_rule($rule);		// add HAW_rule to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "PHONE":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_PHONE, $parser);

        if (isset($attrs["TITLE"]))
          $phone = new HAW_phone("", $attrs["TITLE"]);
        else
          $phone = new HAW_phone("");

        $tag_stack->push($phone, HAX_TAG_PHONE);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_phone object
        $phone = $element["element"];

        if (!$phone->voice_text)
          $phone->voice_text = $phone->label;   // update voice_text if not already set

        $element = $tag_stack->pop();		// pop base object (HAW_deck)
        $base_element = $element["element"];
        $base_element->add_phone($phone);		// add HAW_phone to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "VOICE_TEXT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_VOICE_TEXT, $parser);

        if (isset($attrs["AUDIO_SRC"]))
          $audio_src = $attrs["AUDIO_SRC"];
        else
          $audio_src = "";

        $event = new HAX_voice_event(HAX_TAG_VOICE_TEXT, "", $audio_src);

        $tag_stack->push($event, HAX_TAG_VOICE_TEXT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAX_voice_event object
        $event = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_input, ...)
        $base_element = $element["element"];

        // set voice text for base element
        $base_element->set_voice_text($event->text, $event->audio_src);

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "VOICE_HELP":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_VOICE_HELP, $parser);

        if (isset($attrs["AUDIO_SRC"]))
          $audio_src = $attrs["AUDIO_SRC"];
        else
          $audio_src = "";

        if (isset($attrs["URL"]))
          $url = $attrs["URL"];
        else
          $url = "";

        $event = new HAX_voice_event(HAX_TAG_VOICE_HELP, "", $audio_src, $url);

        $tag_stack->push($event, HAX_TAG_VOICE_HELP);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAX_voice_event object
        $event = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_input, ...)
        $base_element = $element["element"];

        // activate voice help for base element
        $base_element->set_voice_help($event->text, $event->audio_src, $event->url);

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "VOICE_NOMATCH":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_VOICE_NOMATCH, $parser);

        if (isset($attrs["AUDIO_SRC"]))
          $audio_src = $attrs["AUDIO_SRC"];
        else
          $audio_src = "";

        if (isset($attrs["URL"]))
          $url = $attrs["URL"];
        else
          $url = "";

        $event = new HAX_voice_event(HAX_TAG_VOICE_NOMATCH, "", $audio_src, $url);

        $tag_stack->push($event, HAX_TAG_VOICE_NOMATCH);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAX_voice_event object
        $event = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_input, ...)
        $base_element = $element["element"];

        // activate voice nomatch for base element
        $base_element->set_voice_nomatch($event->text, $event->audio_src, $event->url);

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "VOICE_NOINPUT":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_VOICE_NOINPUT, $parser);

        if (isset($attrs["AUDIO_SRC"]))
          $audio_src = $attrs["AUDIO_SRC"];
        else
          $audio_src = "";

        if (isset($attrs["URL"]))
          $url = $attrs["URL"];
        else
          $url = "";

        $event = new HAX_voice_event(HAX_TAG_VOICE_NOINPUT, "", $audio_src, $url);

        $tag_stack->push($event, HAX_TAG_VOICE_NOINPUT);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAX_voice_event object
        $event = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck, HAW_input, ...)
        $base_element = $element["element"];

        // activate voice noinput for base element
        $base_element->set_voice_noinput($event->text, $event->audio_src, $event->url);

        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }

    case "RAW":
    {
      if ($pos == HAX_PARSE_BEGIN)
      {
        check_state(HAX_TAG_RAW, $parser);

        if (!isset($attrs["MARKUP_LANGUAGE"]))
          error("<raw> " . $err[7] . " markup_language", $parser, $line); // markup_language attribute is missing

        if (strtolower($attrs["MARKUP_LANGUAGE"]) == "html")
        {
          if (HAX_RAW_HTML_ALLOWED == false)
            error($err[4], $parser, $line); // raw html not allowed

          $raw = new HAW_raw(HAW_HTML, "");
        }
        elseif (strtolower($attrs["MARKUP_LANGUAGE"]) == "wml")
        {
          if (HAX_RAW_WML_ALLOWED == false)
            error($err[4], $parser, $line); // raw wml not allowed

          $raw = new HAW_raw(HAW_WML, "");
        }
        elseif (strtolower($attrs["MARKUP_LANGUAGE"]) == "hdml")
        {
          if (HAX_RAW_HDML_ALLOWED == false)
            error($err[4], $parser, $line); // raw hdml not allowed

          $raw = new HAW_raw(HAW_HDML, "");
        }
        elseif (strtolower($attrs["MARKUP_LANGUAGE"]) == "voicexml")
        {
          if (HAX_RAW_VXML_ALLOWED == false)
            error($err[4], $parser, $line); // raw VoiceXML not allowed

          $raw = new HAW_raw(HAW_VXML, "");
        }
        else
          error("<raw> " . $err[14] . " markup_language", $parser, $line); // invalid markup_language attribute

        $tag_stack->push($raw, HAX_TAG_RAW);
      }
      else
      {
        // HAX_PARSE_END
        $element = $tag_stack->pop();		// pop HAW_raw object
        $raw = $element["element"];
        $element = $tag_stack->pop();		// pop base object (HAW_deck or HAW_form)
        $base_element = $element["element"];
        $base_element->add_raw($raw);		// add HAW_raw to base object
        $tag_stack->push($base_element, $element["tag"]); // re-push base object
      }

      break;
    }
  }
}


function startElement($parser, $name, $attrs)
{
  // callback function of PHP XML parser for start tags

  handleParsedElement($parser, HAX_PARSE_BEGIN, $name, $attrs);
}


function endElement($parser, $name)
{
  // callback function of PHP XML parser for end tags

  handleParsedElement($parser, HAX_PARSE_END, $name, 0);
}


function characterData($parser, $data)
{
  // callback function of PHP XML parser for character data

  global $tag_stack;

  if ($tag_stack->get_size() > 0)
  {
    $element = $tag_stack->pop();

    if ($element["tag"] == HAX_TAG_TEXT)
      $element["element"]->text .= $data; // append text as data can drop in stepwise

    if ($element["tag"] == HAX_TAG_LINK)
      $element["element"]->label .= $data;

    if ($element["tag"] == HAX_TAG_PHONE)
    {
      $element["element"]->label .= $data;
      $element["element"]->number = ereg_replace("[^+0-9]", "", $element["element"]->label); 
    }

    if ($element["tag"] == HAX_TAG_VOICE_TEXT)
      $element["element"]->text .= $data;

    if ($element["tag"] == HAX_TAG_VOICE_HELP)
      $element["element"]->text .= $data;

    if ($element["tag"] == HAX_TAG_VOICE_NOMATCH)
      $element["element"]->text .= $data;

    if ($element["tag"] == HAX_TAG_VOICE_NOINPUT)
      $element["element"]->text .= $data;

    if ($element["tag"] == HAX_TAG_RAW)
      $element["element"]->code .= $data;

    $tag_stack->push($element["element"], $element["tag"]);
  }
}


function check_state($tag, $parser)
{
  // check whether current tag is allowed after previous tag

  global $tag_stack;
  global $err;

  $previous_element_tag = $tag_stack->get_previous_tag();

  $line = xml_get_current_line_number($parser);

  switch ($tag)
  {
    case HAX_TAG_HAWHAW:
    {
        if ($previous_element_tag != HAX_TAG_UNDEFINED)
          error("<hawhaw> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_DECK:
    {
        if ($previous_element_tag != HAX_TAG_HAWHAW)
          error("<deck> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_FORM:
    {
        if ($previous_element_tag != HAX_TAG_DECK)
          error("<form> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_TEXT:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_FORM) &&
            ($previous_element_tag != HAX_TAG_TD))
          error("<text> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_IMAGE:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_FORM) &&
            ($previous_element_tag != HAX_TAG_TD))
          error("<img> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_INPUT:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<input> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_RADIO:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<radio> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_BUTTON:
    {
        if ($previous_element_tag != HAX_TAG_RADIO)
          error("<button> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_CHECKBOX:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<checkbox> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_SELECT:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<select> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_OPTION:
    {
        if ($previous_element_tag != HAX_TAG_SELECT)
          error("<option> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_HIDDEN:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<hidden> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_SUBMIT:
    {
        if ($previous_element_tag != HAX_TAG_FORM)
          error("<submit> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_LINK:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_LINKSET) &&
            ($previous_element_tag != HAX_TAG_TD))
          error("<a> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_LINKSET:
    {
        if ($previous_element_tag != HAX_TAG_DECK)
          error("<linkset> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_TABLE:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_FORM))
          error("<table> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_ROW:
    {
        if ($previous_element_tag != HAX_TAG_TABLE)
          error("<tr> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_TD:
    {
        if ($previous_element_tag != HAX_TAG_ROW)
          error("<td> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_RULE:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_FORM))
          error("<rule> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_PHONE:
    {
        if ($previous_element_tag != HAX_TAG_DECK)
          error("<phone> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_VOICE_TEXT:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_TEXT) &&
            ($previous_element_tag != HAX_TAG_LINK) &&
            ($previous_element_tag != HAX_TAG_LINKSET) &&
            ($previous_element_tag != HAX_TAG_IMAGE) &&
            ($previous_element_tag != HAX_TAG_PHONE) &&
            ($previous_element_tag != HAX_TAG_FORM) &&
            ($previous_element_tag != HAX_TAG_INPUT) &&
            ($previous_element_tag != HAX_TAG_SELECT) &&
            ($previous_element_tag != HAX_TAG_RADIO) &&
            ($previous_element_tag != HAX_TAG_CHECKBOX) &&
            ($previous_element_tag != HAX_TAG_TABLE))
          error("<voice_text> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_VOICE_HELP:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_INPUT) &&
            ($previous_element_tag != HAX_TAG_CHECKBOX) &&
            ($previous_element_tag != HAX_TAG_RADIO) &&
            ($previous_element_tag != HAX_TAG_SELECT))
          error("<voice_help> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_VOICE_NOMATCH:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_INPUT) &&
            ($previous_element_tag != HAX_TAG_CHECKBOX) &&
            ($previous_element_tag != HAX_TAG_RADIO) &&
            ($previous_element_tag != HAX_TAG_SELECT))
          error("<voice_nomatch> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_VOICE_NOINPUT:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_INPUT) &&
            ($previous_element_tag != HAX_TAG_CHECKBOX) &&
            ($previous_element_tag != HAX_TAG_RADIO) &&
            ($previous_element_tag != HAX_TAG_SELECT))
          error("<voice_noinput> " . $err[6], $parser, $line);

        break;
    }

    case HAX_TAG_RAW:
    {
        if (($previous_element_tag != HAX_TAG_DECK) &&
            ($previous_element_tag != HAX_TAG_FORM))
          error("<raw> " . $err[6], $parser, $line);

        break;
    }
  }
}


function error($message, $parser, $line=0)
{
  // if line argument is provided ==> display current line and line number

  global $err;
  global $line_buffer;
  global $error_logfile;
  global $error_skin;

  $myDeck = new HAW_deck($err[4]);

  if ($error_skin)
    $myDeck->use_simulator("http://www.hawhaw.de/skin/error/skin.css");

  if ($line > 0)
    // add line number to message
    $message = $err[10] . " " . $line . ": " . $message;

  $myText2 = new HAW_text($message, HAW_TEXTFORMAT_BOLD);
  $myDeck->add_text($myText2);

  if ($line > 0)
  {
    // display wrong line
    $myRule = new HAW_rule();
    $myDeck->add_rule($myRule);

    $wrong = new HAW_text($line_buffer[$line-1]);
    $myDeck->add_text($wrong);
  }

  $myDeck->set_width("80%");

  $myDeck->create_page();

  xml_parser_free($parser);

  if (isset($error_logfile))
    // write entry in error logfile
    write_log($error_logfile, $message);

  exit; // there is nothing else to do
}


function determine_url($remote_url)
{
  // determine URL from value read from remote XML file

  // remove leading "http://" because it breaks Voxeo's voice browser (bug!)
  if (ereg("^http://", $remote_url))
    $remote_url = substr($remote_url, 7); // remove protocol part

  $url = $_SERVER['PHP_SELF'] . "?code=" . $remote_url;
  return($url);
}


function check_blacklist($blacklist, $xml_parser)
{
  global $err; // array of error messages

  // compare each blacklist entry
  while (list($key, $val) = each($blacklist))
  {
    if (ereg("code=.*" . $val, $_SERVER['QUERY_STRING']))
      // code parameter contains forbidden domain ==> reject request
      error($err[12], $xml_parser);
  }
}


function write_log($logfile, $result)
{
  // write access/error logfile

  $time=date("d M Y H:i:s");          // log date and time

  $url = $_SERVER['PHP_SELF'];
  $url .= "?" . $_SERVER['QUERY_STRING'];      // log requested URL

  $logentry = sprintf("%s [%s] \"%s\" \"%s\" \"%s\" \"%s\"\n",
                      $_SERVER['REMOTE_ADDR'], $time, $result, $url,
                      $_SERVER['HTTP_USER_AGENT'], $_SERVER['HTTP_ACCEPT']);

  //echo "$logentry <br>";
  $fp = fopen($logfile, "a"); // append logentry to existing logfile
  fputs($fp, $logentry);
}


if ($img_conversion_enabled)
{
  ini_set('session.use_cookies', 0);
  ini_set('session.use_trans_sid', 1);       // use trans sid instead of cookies
  ini_set('arg_separator.output', '&amp;');  // '&' is not allowed in WML (XML)
  ini_set('url_rewriter.tags', 'img=src');

  session_start();

  if (isset($_REQUEST[ini_get('session.name')]) && isset($_REQUEST['index']))
  {
    // recall of HAWHAW proxy in order to perform one specific image conversion

    $varname = "i" . $_REQUEST['index'];
    $remote_file = $_SESSION[$varname]; 

    $fd_in = fopen($remote_file, "rb");
    $image_data = fread($fd_in, $img_maxsize);

    if (!feof($fd_in))
      // buffer full ==> XML file too large!
      exit;

    fclose($fd_in);

    $tmpfname = tempnam ("/tmp", "hawxy");
    $fd_out = fopen($tmpfname, "wb");
    fwrite($fd_out, $image_data);
    fclose($fd_out);

    if (ereg(".gif$", $remote_file) || ereg(".GIF$", $remote_file))
      $im = @ImageCreateFromGIF($tmpfname);
    elseif (ereg(".png$", $remote_file) || ereg(".PNG$", $remote_file))
      $im = @ImageCreateFromPNG($tmpfname);
    elseif (ereg(".wbmp$", $remote_file) || ereg(".WBMP$", $remote_file))
      $im = @ImageCreateFromWBMP($tmpfname);

    if (!$im)
    {
      unlink($tmpfname); // delete temporary file
      exit;              // could not create image from file
    }

    if ($_SESSION['img_ml'] == HAW_HTML)
    {
      header("content-type: image/png");
      ImagePng($im);
    }
    else
    {
      header("content-type: image/vnd.wap.wbmp");
      ImageWBMP($im);
    }

    unlink($tmpfname); // delete temporary file

    exit;
  }
  else
  {
    // "normal" proxy request: init session variables
    session_register('img_ml');
  }
}

// START OF HAWXY MAIN PART

// init stack to hold received XML tags
$tag_stack = new HAX_tagstack();

// init XML parsing stuff
$xml_parser = xml_parser_create();
xml_set_element_handler($xml_parser, "startElement", "endElement");
xml_set_character_data_handler($xml_parser, "characterData");


// handle blacklist
if ($blacklist)
  // blacklist available ==> check whether access to remote XML server is blocked
  check_blacklist($blacklist, $xml_parser);


// QUERY_STRING contains "code" (=remote URL of XML file) and eventually
// other parameters which are required for remote server-sided pre-processing
// ==> we have to extract the "code" parameter (this is the URL we're reading the XML from)
// ==> we have to propagate all other parameters transparently to the remote server
$received_query_string = $_SERVER['QUERY_STRING'];
$received_query_string = explode("&", $received_query_string); // create array of all parameters
$new_query_string = "";
while (list($key, $val) = each($received_query_string))
{
  // create new query string with all parameters except "code"
  if (substr($val, 0, 5) != "code=")
    $new_query_string .= "&" . $val;
}
if (strlen($new_query_string) > 0)
  // replace the first '&' character with '?'
  $new_query_string = ereg_replace("^&", "?", $new_query_string);

// determine remote URL to retrieve XML data from
$remote_url = "";
if (isset($HTTP_GET_VARS["code"]) && $HTTP_GET_VARS["code"])
{
  // code parameter was part of QUERYSTRING
  $remote_url = $HTTP_GET_VARS["code"] . $new_query_string;
  if (strtolower(substr($remote_url, 0, 7)) != "http://")
    $remote_url = "http://" . $remote_url;
}
else
{
  // no code parameter received
  error($err[11], $xml_parser);
}

// establish connection to remote web server
ini_set("user_agent", "HAWXY " . HAX_VERSION); // replace default PHP string
if (!($fp=@fopen($remote_url, "r")))
  error($err[0] . " " . $remote_url, $xml_parser);

// read whole XML file into string
$data = "";
while (!feof($fp) && (strlen($data) < HAX_MAX_FILE_SIZE))
  $data .= fread($fp, HAX_MAX_FILE_SIZE);

if (!feof($fp))
  // buffer full ==> XML file too large!
  error($err[1], $xml_parser);

// HAWHAW enhanced license does not apply for HAWXY-like applications!
$haw_license_holder = 0;

// create array with all lines of XML input
$line_buffer = explode("\n", $data);

if (!xml_parse($xml_parser, $data, feof($fp)))
{
  // parse error has occured

  $line_of_fault = xml_get_current_line_number($xml_parser);

  if ($line_of_fault > 5)
  {
    // dump erroneous line only
    error($err[2], $xml_parser, $line_of_fault);
  }
  else
  {
    // in case of remote server-sided script errors the erroneous line 
    // number is not really helpful ==> dump whole input additionally
    $dump = $line_buffer[$line_of_fault-1] . strip_tags($data);
    error($err[10] . " " . $line_of_fault . ": " . $err[2] . ": " . $dump, $xml_parser);
  }
}
xml_parser_free($xml_parser);

if (isset($access_logfile))
  // write entry in access logfile
  write_log($access_logfile, "OK");

?>