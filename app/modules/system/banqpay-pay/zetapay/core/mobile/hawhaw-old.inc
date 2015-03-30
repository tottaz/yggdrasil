<?php                      

// HAWHAW: HTML and WML hybrid adapted webserver
// PHP class library
// Copyright (C) 2001 Norbert Huffschmid
// Last modified: 13. December 2001
// Tested with PHP 3.0.7, 3.0.13 and 4.0.0
//
// This library is free software; you can redistribute it and/or modify it under the
// terms of the GNU Library General Public License as published by the Free Software
// Foundation; either version 2 of the License, or (at your option) any later
// version.
//
// This library is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Library General Public License for more details.
// http://www.gnu.org/copyleft/lgpl.html
//
// If you modify this library according your own requirements, you have to make sure
// that the HAWHAW copyright link below the display area in a HTML style generated
// page is kept unchanged.
//
// If you believe that you can not live with the automatically created HAWHAW
// copyright link, you have the possibility to purchase an enhanced license.
//
// For further information about this library and its license terms please visit:
// http://www.hawhaw.de/

// miscellaneous constants
define("HAW_VERSION", "HAWHAW V4.04");
define("HAW_COPYRIGHT", "(C) Norbert Huffschmid");

// constants for markup languages
define("HAW_HTML", 1);
define("HAW_WML",  2);
define("HAW_HDML", 3);

// constants for debug mode
define("HAW_DEBUG_PUREHTML", 1);
define("HAW_DEBUG_WML", 2);
define("HAW_DEBUG_HDML", 3);
define("HAW_DEBUG_AVANTGO", 4);
define("HAW_DEBUG_IMODE", 5);
define("HAW_DEBUG_UPBROWSER", 6);
define("HAW_DEBUG_OWGUI_1_3", 7);

// constant to turn on debug mode
// to turn on debug mode: comment the next line and un-comment the line
//  with the debug mode you want to turn on.
define("HAW_DEBUG", 0);                      // non-debugging mode (standard)
// define("HAW_DEBUG", HAW_DEBUG_PUREHTML);  // debug big-screen HTML
// define("HAW_DEBUG", HAW_DEBUG_WML);       // debug WML
// define("HAW_DEBUG", HAW_DEBUG_HDML);      // debug HDML
// define("HAW_DEBUG", HAW_DEBUG_AVANTGO);   // debug Avantgo
// define("HAW_DEBUG", HAW_DEBUG_IMODE);     // debug iMode
// define("HAW_DEBUG", HAW_DEBUG_UPBROWSER); // debug UP browser
// define("HAW_DEBUG", HAW_DEBUG_OWGUI_1_3); // debug Openwave GUI extensions for WML 1.3


// constants for page elements
define("HAW_PLAINTEXT", 1);
define("HAW_IMAGE", 2);
define("HAW_TABLE", 3);
define("HAW_FORM", 4);
define("HAW_LINK", 5);
define("HAW_PHONE", 6);
define("HAW_LINKSET", 7);
define("HAW_INPUT", 8);
define("HAW_BANNER", 9);
define("HAW_SELECT", 10);
define("HAW_CHECKBOX", 11);
define("HAW_RADIO", 12);
define("HAW_HIDDEN", 13);
define("HAW_SUBMIT", 14);
define("HAW_RAW", 15);
define("HAW_RULE", 16);

// constants for page setup
define("HAW_ALIGN_LEFT", 1);
define("HAW_ALIGN_RIGHT", 2);
define("HAW_ALIGN_CENTER", 3);
define("HAW_NOTITLE", -1);

// constants for text formatting
define("HAW_TEXTFORMAT_NORMAL", 0);
define("HAW_TEXTFORMAT_BOLD", 1);
define("HAW_TEXTFORMAT_UNDERLINE", 2);
define("HAW_TEXTFORMAT_ITALIC", 4);
define("HAW_TEXTFORMAT_BIG", 8);
define("HAW_TEXTFORMAT_SMALL", 16);

// constants for input treatment
define("HAW_INPUT_TEXT", 0);
define("HAW_INPUT_PASSWORD", 1);

// constants for select treatment
define("HAW_NOTSELECTED", 0);
define("HAW_SELECTED", 1);
define("HAW_SELECT_POPUP", 0);
define("HAW_SELECT_SPIN", 1);

// constants for radio and checkbox treatment
define("HAW_NOTCHECKED", 0);
define("HAW_CHECKED", 1);

// constants for link treatment
define("HAW_NO_ACCESSKEY", -1);

// constants for HDML card types
define("HAW_HDML_DISPLAY", 0);
define("HAW_HDML_ENTRY", 1);
define("HAW_HDML_CHOICE", 2);
define("HAW_HDML_NODISPLAY", 3);

// constants for banners
define("HAW_TOP", 0);
define("HAW_BOTTOM", 1);
define("HAW_NOLINK", -1);



function HAW_specchar($input, $deck)
{
  // convert special characters

  $temp = htmlspecialchars($input); // translate &"<> to HTML entities

  if ($deck->ml == HAW_WML)
    $temp = str_replace("$", "$$", $temp);     // escape $ character in WML
  elseif ($deck->ml == HAW_HDML)
    $temp = str_replace("$", "&dol;", $temp);  // escape $ character in HDML

  if (strstr($deck->charset,"iso-8859-1"))
  {
    // character set iso-8859-1 (trivial mapping 1:1)

    for ($i=0; $i<strlen($temp); $i++)
    {
      // do for each character of $temp

      if (ord(substr($temp, $i, 1)) > 127)
        // translate character into &#...; sequence
        $output .= "&#" . ord(substr($temp, $i, 1)) . ";";
      else
        // copy character unchanged
        $output .= substr($temp, $i, 1);
    }
  }
  else
  {
    // other character set than iso-8859-1

    if ($deck->unicodearray)
    {
      // array with mapping rules was prepared earlier

      if(!trim($temp))
        return $temp;

      while($temp!="")
      {
        // do for each character in string

        if (ord(substr($temp,0,1))>127)
        {
          $index = ord(substr($temp, 0, 1)); // ASCII value of first character from $temp

          if ($deck->unicodearray[$index])
          {
            // unicode stored for this one byte code
            // insert unicode and go 1 byte further

            $output .= "&#" . $deck->unicodearray[$index] . ";";
            $temp = substr($temp, 1, strlen($temp));
          }
          else
          {
            // check if there's a unibyte code stored for 1st two bytes

            $index = $index * 256 + ord(substr($temp, 1, 1));

            if ($deck->unicodearray[$index])
            {
              // unicode stored for this 2-byte code!
              // insert unicode and go 2 bytes further

              $output .= "&#" . $deck->unicodearray[$index] . ";";
              $temp = substr($temp, 2, strlen($temp));
            }
            else
            {
              // no mapping info for 1st 2 bytes available ==> leave it as it is

              $output .= substr($temp, 0, 1);
              $temp = substr($temp, 1, strlen($temp));
            }
          }
        }
        else
        {
          // character <= 127 ==> leave it as it is
          $output .= substr($temp, 0, 1);
          $temp = substr($temp, 1, strlen($temp));
        }
      }
    }

    else
      $output = $temp; // no mapping to unicode required
  }

  return($output);
}







class HAW_hdmlcardset
{
  var $number_of_cards;
  var $card;            // array of cards
  var $title;
  var $final_action;    // action of last card
  var $defaults;        // default values of variables
  var $disable_cache;


  function HAW_hdmlcardset($title, $defaults, $disable_cache)
  {
    $this->title = $title;
    $this->defaults = $defaults;
    $this->disable_cache = $disable_cache;

    // initialize first card of cardset as DISPLAY card

    $this->card[0]["type"] = HAW_HDML_DISPLAY;

    $this->card[0]["options"] = " name=\"1\"";

    if ($title)
      $this->card[0]["options"] .= " title=\"$title\"";

    $this->number_of_cards = 1;
  }


  function add_display_content($display_content)
  {
    // enhance the display content of the current card with the received content

    // number_of_cards-1 is the index of the current card, i.e. the last card

    if ($this->card[$this->number_of_cards-1]["type"] == HAW_HDML_DISPLAY)
      // current card is display card ==> continue with content
      $this->card[$this->number_of_cards-1]["display_content"] .= $display_content;

    else
    {
      // current card is entry or choice card
      // ==> create new display card to display received content
      // ==> link current card to this new display card

      $this->card[$this->number_of_cards]["type"] = HAW_HDML_DISPLAY;

      $cardname = sprintf(" name=\"%d\"", $this->number_of_cards+1);
      $this->card[$this->number_of_cards]["options"] .= $cardname;

      if ($this->title)
        $this->card[$this->number_of_cards]["options"] .= " title=\"$this->title\"";

      $this->card[$this->number_of_cards]["display_content"] = $display_content;

      $action = sprintf("<action type=\"accept\" task=\"go\" dest=\"#%d\">\n",
                         $this->number_of_cards+1);
      $this->card[$this->number_of_cards-1]["action"] = $action;

      $this->number_of_cards++;
    }
  }


  function make_ui_card($options, $generic_content, $cardtype)
  {
    // make user interactive card (ENTRY or CHOICE card)

    if ($this->card[$this->number_of_cards-1]["type"] == HAW_HDML_DISPLAY)
    {
      // current card is display card

      // ==> make an entry/choice card out of it
      $this->card[$this->number_of_cards-1]["type"] = $cardtype;

      // append options to the already existing ones
      $this->card[$this->number_of_cards-1]["options"] .= $options;

      // append received content to the already existing one
      $this->card[$this->number_of_cards-1]["display_content"] .= $generic_content;
    }
    else
    {
      // current card is already entry or choice card
      // ==> create new entry/choice card
      // ==> link current card to this new entry/choice card

      $this->card[$this->number_of_cards]["type"] = $cardtype;

      $cardname = sprintf(" name=\"%d\"", $this->number_of_cards+1);
      $this->card[$this->number_of_cards]["options"] .= $cardname;

      if ($this->title)
        $this->card[$this->number_of_cards]["options"] .= " title=\"$this->title\"";

      $this->card[$this->number_of_cards]["options"] .= $options;

      $this->card[$this->number_of_cards]["display_content"] = $generic_content;

      $action = sprintf("<action type=\"accept\" task=\"go\" dest=\"#%d\">\n",
                         $this->number_of_cards+1);
      $this->card[$this->number_of_cards-1]["action"] = $action;

      $this->number_of_cards++;
    }
  }


  function set_final_action($action)
  {
    $this->final_action = $action;
  }


  function create_hdmldeck()
  {
    if (!HAW_DEBUG)
      header("content-type: text/x-hdml");

    if ($this->disable_cache)
      $ttl = " TTL=\"0\"";

    printf("<hdml version=\"3.0\" public=\"true\"%s>\n", $ttl);
    printf("<!-- Generated by %s %s -->\n", HAW_VERSION, HAW_COPYRIGHT);

    // create NODISPLAY card if it's necessary to initialize variables
    if ($this->defaults)
    {
      while (list($d_key, $d_val) = each($this->defaults))
        $vars .= sprintf("%s=%s&amp;", $d_val[name], $d_val[value]);

      // strip terminating '&'
      $vars = substr($vars, 0, -5);

      echo "<nodisplay>\n";
      printf("<action type=\"accept\" task=\"go\" dest=\"#1\" vars=\"%s\">\n", $vars);
      echo "</nodisplay>\n";
    }

    // set action of last card
    $this->card[$this->number_of_cards-1]["action"] = $this->final_action;

    // create all cards of card set
    $i = 0;
    while ( $i < $this->number_of_cards )
    {
      if ($this->card[$i]["type"] == HAW_HDML_DISPLAY)
        $cardtype = "display";
      elseif ($this->card[$i]["type"] == HAW_HDML_ENTRY)
        $cardtype = "entry";
      elseif ($this->card[$i]["type"] == HAW_HDML_CHOICE)
        $cardtype = "choice";

      printf("<%s%s>\n", $cardtype, $this->card[$i]["options"]);
      printf("%s", $this->card[$i]["action"]);
      printf("%s", $this->card[$i]["display_content"]);
      printf("</%s>\n", $cardtype);

      $i++;
    }

    echo "</hdml>\n";
  }
};






/**
  This class is the top level class of all HAWHAW classes. Your page should consist
  of exactly one HAW_deck object. For WML browsers one deck with one card will be
  generated. For HDML browsers one deck including as much cards as necessary will
  generated. HTML browsers will receive a normal HTML page. For AvantGo and iMode
  browsers appropriate HTML code is created.
  <p>Do not overload HAW_deck objects! Remember that a lot of WAP clients can not
  handle more than about 1400 byte of compiled data.
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck();<br>
  $myPage = new HAW_deck("My WAP page");<br>
  $myPage = new HAW_deck("", HAW_ALIGN_CENTER);<br>
  ...<br>
  $myPage->set_bgcolor("blue");<br>
  ...<br>
  $myPage->add_text($myText);<br>
  ...<br>
  $myPage->create_page();
*/
class HAW_deck
{
  var $title;
  var $alignment;
  var $timeout;
  var $red_url;
  var $disable_cache = false;
  var $ml;
  var $element;
  var $number_of_elements;
  var $number_of_forms;
  var $number_of_linksets;
  var $top_banners;
  var $number_of_top_banners = 0;
  var $bottom_banners;
  var $number_of_bottom_banners = 0;
  var $display_banners = true;
  var $waphome;
  var $hdmlcardset;

  // browser dependent properties
  var $pureHTML = true;	        	// Big-screen-HTML-code (default)
  var $avantgostyle = false;		// AvantGo browser needs special HTML code
  var $iModestyle = false;		// iMode too
  var $upbrowser = false;               // UP browser
  var $owgui_1_3 = false;               // Openwave GUI Extensions for WML 1.3

  // device simulator properies
  var $td_scroll = false;          // specifies if bigscreen browser is able to scroll table cells
  var $sim_device;                 // can be set to path where the device simulator resides
  var $simdev_width;               // size of display area inside the simulator device
  var $simdev_height;

  // character set properties
  var $charset = "iso-8859-1";     // default charset
  var $unicodemaptab;              // filename of cross mapping table to map country
                                   // specific character code into unicode
  var $unicodearray;               // array containing cross mapping table


  // display properties for HTML

  // page background properties
  var $bgcolor;
  var $background;

  // display (table) properties
  var $border = 8;
  var $disp_bgcolor = "#FFFFFF";
  var $disp_background;
  var $width  = 200;
  var $height = 200;

  // text properties
  var $size;
  var $color;
  var $link_color = "#004411";
  var $vlink_color = "006633";
  var $face = "Arial,Times";

  /**
    Constructor
    @param title (optional, default: HAW_NOTITLE)<br>
       If a string is provided here, it will be displayed
       in the HTML title bar, respectively somewhere on the WAP display. Using a
       title you will normally have to spend one of your few lines on your WAP
       display. Consider that some WAP phones/SDK's and handheld devices don't
       display the title at all.
    @param alignment (optional, default: HAW_ALIGN_LEFT)<br>
       You can enter HAW_ALIGN_CENTER
       or HAW_ALIGN_RIGHT to modify the alignment of the whole page.
  */
  function HAW_deck($title=HAW_NOTITLE, $alignment=HAW_ALIGN_LEFT)
  {
    // register_globals=off in PHP4 inhibits automatic setup of global variables!
    $HTTP_USER_AGENT = getenv(HTTP_USER_AGENT);
    $HTTP_ACCEPT = getenv(HTTP_ACCEPT);
    $HTTP_HOST = getenv(HTTP_HOST);
    $SCRIPT_NAME = getenv(SCRIPT_NAME);

    if ($title != HAW_NOTITLE)
      $this->title = $title;

    $this->alignment = $alignment;
    $this->timeout = 0;
    $this->red_url = "";

    $this->waphome = "http://" . $HTTP_HOST . $SCRIPT_NAME;

    // manipulate HTTP environment variables in case of debug mode
    if (HAW_DEBUG == HAW_DEBUG_WML)
      $HTTP_ACCEPT = "text/vnd.wap.wml";
    elseif (HAW_DEBUG == HAW_DEBUG_HDML)
      $HTTP_ACCEPT = "hdml;version=3.0";
    elseif (HAW_DEBUG == HAW_DEBUG_AVANTGO)
      $HTTP_USER_AGENT = "avantgo";
    elseif (HAW_DEBUG == HAW_DEBUG_IMODE)
      $HTTP_USER_AGENT = "DoCoMo";
    elseif (HAW_DEBUG == HAW_DEBUG_UPBROWSER)
    {
      $HTTP_ACCEPT = "text/vnd.wap.wml";
      $HTTP_USER_AGENT = "UP.Browser";
    }
    elseif (HAW_DEBUG == HAW_DEBUG_OWGUI_1_3)
    {
      $HTTP_ACCEPT = "text/vnd.wap.wml";
      $HTTP_USER_AGENT = "UP/GUI";
    }

    // determine markup language to create

    // check HTTP header for accepted mime types
    if (strstr(strtolower($HTTP_ACCEPT), "text/vnd.wap.wml"))
    {
      $this->ml = HAW_WML;  // create WML

      if (strstr($HTTP_USER_AGENT, "UP/") ||
          strstr($HTTP_USER_AGENT, "UP.B"))
        $this->upbrowser = true; // UP browser

      if ((strstr($HTTP_USER_AGENT, "UP/") ||
           strstr($HTTP_USER_AGENT, "UP.B")) &&
           strstr($HTTP_USER_AGENT, "GUI"))
        $this->owgui_1_3 = true; // device accepts Openwave GUI extensions for WML 1.3
    }
    elseif (strstr(strtolower($HTTP_ACCEPT), "hdml;version=3.0"))
      $this->ml = HAW_HDML; // create HDML
    else
    {
      if (strstr($HTTP_USER_AGENT, "Mozilla") ||
          strstr($HTTP_USER_AGENT, "MSIE") ||
          strstr($HTTP_USER_AGENT, "Explorer") ||
          strstr(strtolower($HTTP_USER_AGENT), "avantgo") ||
          strstr(strtolower($HTTP_USER_AGENT), "docomo"))
        $this->ml = HAW_HTML;   // "normal" WEB surfer: create HTML
      else
        $this->ml = HAW_WML;    // try it with WML
    }

    $this->number_of_elements = 0;
    $this->number_of_forms = 0;
    $this->number_of_linksets = 0;

    if (strstr(strtolower($HTTP_USER_AGENT), "avantgo"))
    {
      // AvantGo browser detected
      $this->avantgostyle = true;
      $this->pureHTML = false;
      $this->display_banners = false;
      $this->border = 1;
      $this->width = 150;
      $this->height = 150;
    }
    elseif (strstr(strtolower($HTTP_USER_AGENT), "docomo"))
    {
      // iMode browser detected
      $this->iModestyle = true;
      $this->pureHTML = false;
      $this->display_banners = false;
    }

    // determine if browser is able to scroll table cells
    // (requirement for the usage of the device simulator)
    if (strstr($HTTP_USER_AGENT, "MSIE") || strstr($HTTP_USER_AGENT, "Netscape6"))
      $this->td_scroll = true;
  }


  /**
    Adds a HAW_text object to HAW_deck.
    @param text Some HAW_text object.
    @see HAW_text
  */
  function add_text($text)
  {
    if (!is_object($text))
      die("invalid argument in add_text()");

    $this->element[$this->number_of_elements] = $text;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_image object to HAW_deck.
    @param image Some HAW_image object.
    @see HAW_image
  */
  function add_image($image)
  {
    if (!is_object($image))
      die("invalid argument in add_image()");

    $this->element[$this->number_of_elements] = $image;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_table object to HAW_deck.
    @param table Some HAW_table object.
    @see HAW_table
  */
  function add_table($table)
  {
    if (!is_object($table))
      die("invalid argument in add_table()");

    $this->element[$this->number_of_elements] = $table;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_form object to HAW_deck.
    @param form Some HAW_form object.
    @see HAW_form
  */
  function add_form($form)
  {
    if (!is_object($form))
      die("invalid argument in add_form()");

    if ($this->number_of_forms > 0)
      die("only one form per deck allowed!");

    $this->element[$this->number_of_elements] = $form;

    $this->number_of_elements++;
    $this->number_of_forms++;
  }


  /**
    Adds a HAW_link object to HAW_deck.
    @param link Some HAW_link object.
    @see HAW_link
  */
  function add_link($link)
  {
    if (!is_object($link))
      die("invalid argument in add_link()");

    $this->element[$this->number_of_elements] = $link;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_phone object to HAW_deck.
    @param phone Some HAW_phone object.
    @see HAW_phone
  */
  function add_phone($phone)
  {
    if (!is_object($phone))
      die("invalid argument in add_phone()");

    $this->element[$this->number_of_elements] = $phone;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_linkset object to HAW_deck.
    @param linkset Some HAW_linkset object.
    @see HAW_linkset
  */
  function add_linkset($linkset)
  {
    if (!is_object($linkset))
      die("invalid argument in add_linkset()");

    if ($this->number_of_linksets > 0)
      die("only one linkset per deck allowed!");

    $this->element[$this->number_of_elements] = $linkset;

    $this->number_of_elements++;
    $this->number_of_linksets++;
  }


  /*
    Adds a HAW_raw object to HAW_deck. (undocumented feature - for test only!)
    @param raw_markup_object Some HAW_raw object.
    @see HAW_raw
  */
  function add_raw($raw)
  {
    if (!is_object($raw))
      die("invalid argument in add_raw()");

    $this->element[$this->number_of_elements] = $raw;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_banner object to HAW_deck.<br>
    Note: Has no effect on WML/handheld pages.
    @param banner Some HAW_banner object.
    @param position (optional)<br>
      HAW_TOP: above HAW_deck<br>
      HAW_BOTTOM: beneath HAW_deck  (default)
    @see HAW_banner
  */
  function add_banner($banner, $position=HAW_BOTTOM)
  {
    if (!is_object($banner))
      die("invalid argument in add_banner()");

    if ($position == HAW_TOP)
    {
      $this->top_banners[$this->number_of_top_banners] = $banner;
      $this->number_of_top_banners++;
    }
    else
    {
      $this->bottom_banners[$this->number_of_bottom_banners] = $banner;
      $this->number_of_bottom_banners++;
    }
  }


  /**
    Adds a HAW_rule object to HAW_deck.
    @param rule Some HAW_rule object.
    @see HAW_rule
  */
  function add_rule($rule)
  {
    if (!is_object($rule))
      die("invalid argument in add_rule()");

    $this->element[$this->number_of_elements] = $rule;

    $this->number_of_elements++;
  }


  /**
    Redirects automatically after timeout to another URL.<br>
    Note: This feature can not be supported for HDML browsers, due to HDML's missing
    timer functionality. If you intend to serve HDML users, you should consider this
    by creating an additional link to <i>red_url</i>.
    @param timeout Some timeout value in seconds.
    @param red_url Some URL string.
  */
  function set_redirection($timeout, $red_url)
  {
    $this->timeout = $timeout;
    $this->red_url = $red_url;
  }


  /**
    Disables deck caching in the users client.<br>
    Note: Use this object function, if you intend to provide changing content under
    the same URL.
  */
  function disable_cache()
  {
    $this->disable_cache = true;
  }


  /**
    Sets a given character set.<br>
    Note: For the iso-8859-1 character set all characters with value greater
    127 are automatically transformed into a "&amp;#dec;" sequence (unicode).
    For all other character sets a specific cross mapping table is
    required for the conversion into unicode. Usage of unicode cross
    mapping tables is recommended for all non-iso-8859-1 character sets
    because many WAP clients support unicode only. Please refer to the
    Internationalization section of the HAWHAW homepage for more
    information.
    @param charset Character set that is used in your country.<br>Default: iso-8859-1
    @param unicodemaptab (optional)<br>
           Cross mapping table from country specific character coding to
           unicode (default: no mapping to unicode activated).<br>
           With this parameter you specify where HAWHAW will find the conversion table
           with the mapping rules. It is recommended to store the cross mapping table
           in the same directory where hawhaw.inc is located.<br>
           format: [PATH][Filename].[EXT] e.g. "../GB2312.TXT"
  */
  function set_charset($charset, $unicodemaptab="")
  {
    $this->charset = $charset;
    $this->unicodemaptab = $unicodemaptab;

    if ($unicodemaptab)
    {
      // cross mapping table is to be used

      if(!file_exists($unicodemaptab))
      {
        $errormsg =  "HAWHAW!<br>Cross mapping table \"$unicodemaptab\" not found!<br>";
        $errormsg .= "Please download your country-specific unicode cross mapping table from:<br>";
        $errormsg .= "<a href=http://www.unicode.org/Public/MAPPINGS/>http://www.unicode.org/Public/MAPPINGS/</a>";
        die("$errormsg");
      }

      // open cross mapping table file and create array with mapping info

      $filename = $unicodemaptab;
      $line=file($filename);

      while(list($key,$value)=each($line))
      {
        if (substr($value, 0, 2) == "0x") // skip comment lines
        {
          $pair = explode("	", $value); // tab separates code and unicode

          if ((strlen($pair[0]) == 6) && ($pair[0] < 0x8080))
            $this->unicodearray[hexdec($pair[0]) + 0x8080] = hexdec($pair[1]); // offset EUC
          else
            $this->unicodearray[hexdec($pair[0])] = hexdec($pair[1]);
        }
      }
    }
  }


  /**
    Sets the background color for a HTML created page. Has no effect on WML/handheld
    pages.
    @param bgcolor See HTML specification for possible values (e.g. "#CCFFFF",
      "red", ...).
  */
  function set_bgcolor($bgcolor)
  {
    $this->bgcolor = $bgcolor;
  }


  /**
    Sets a wallpaper for a HTML created page. Has no effect on WML/handheld pages.
    @param background e.g. "backgrnd.gif"
  */
  function set_background($background)
  {
    $this->background = $background;
  }


  /**
    Sets the thickness of the HTML display frame. Has no effect on WML/handheld pages.
    @param border Thickness is pixels (default: 8)
  */
  function set_border($border)
  {
    $this->border = $border;
  }


  /**
    Sets the display background color for a HTML created page. Has no effect on
    WML/handheld pages.
    @param disp_bgcolor See HTML specification for possible values (e.g. "#CCFFFF",
      "red", ...).
  */
  function set_disp_bgcolor($disp_bgcolor)
  {
    $this->disp_bgcolor = $disp_bgcolor;
  }


  /**
    Sets a display wallpaper for a HTML created page. Has no effect on WML/handheld
    pages.
    @param background e.g. "backgrnd.gif"
  */
  function set_disp_background($background)
  {
    $this->disp_background = $background;
  }


  /**
    Sets the display width for a HTML created page. Has no effect on WML/handheld
    pages.
    @param width See HTML specification for possible values (e.g. "200", "50%", ...).
  */
  function set_width($width)
  {
    $this->width = $width;
  }


  /**
    Sets the display height for a HTML created page. Has no effect on WML/handheld
    pages.
    @param height See HTML specification for possible values (e.g. "200", "50%", ...).
  */
  function set_height($height)
  {
    $this->height = $height;
  }


  /**
    Sets the font size for all characters in a HTML created page. Has no effect on
    WML/handheld pages.
    @param size See HTML specification for possible values (e.g. "4", "+2", ...).
  */
  function set_size($size)
  {
    $this->size = $size;
  }


  /**
    Sets the color for all characters in a HTML created page. Has no effect on
    WML/handheld pages.
    @param color See HTML specification for possible values (e.g. "#CCFFFF", "red",
       ...).
  */
  function set_color($color)
  {
    $this->color = $color;
  }


  /**
    Sets the color of links in a HTML created page. Has no effect on
    WML/handheld pages.
    @param link_color See HTML specification for possible values (e.g. "#CCFFFF", "red",
       ...).
  */
  function set_link_color($link_color)
  {
    $this->link_color = $link_color;
  }


  /**
    Sets the color of visited links in a HTML created page. Has no effect on
    WML/handheld pages.
    @param vlink_color See HTML specification for possible values (e.g. "#CCFFFF", "red",
       ...).
  */
  function set_vlink_color($vlink_color)
  {
    $this->vlink_color = $vlink_color;
  }


  /**
    Sets the font for all characters in a HTML created page. Has no effect on
    WML/handheld pages.
    @param face See HTML specification for possible values (e.g. "Avalon",
       "Wide Latin").
  */
  function set_face($face)
  {
    $this->face = $face;
  }


  /**
    Sets the URL of a WAP site, a HTML-browsing user is invited to enter via WAP.
    Has no effect on WML created pages.<br>
    Note:  Below the display of a HTML-created page, a small copyright link to the
    HAWHAW information page will be created automatically by HAWHAW. The information
    page in return invites the visitor to take a look via WAP at your hybrid page.
    Therefore by default your hostname and your refering script will be part of this
    copyright link. You can modify this value, e.g. if your application directs the
    user with get-method queries across different pages, but you want to make
    visible the entry page only.
    @param waphome Some URL string.
  */
  function set_waphome($waphome)
  {
    $this->waphome = $waphome;
  }


  /**
    Activates the device simulator on bigscreen browsers.
    This function requires an image of your favorite device, which must be
    sliced into five JPG files as the figure shows.<br>
    <img src="set_sim_device.gif" alt="set_sim_device" align="right">
    These five subimages MUST be named:
    <ul>
    <li>top.jpg</li>
    <li>left.jpg</li>
    <li>display.jpg</li>
    <li>right.jpg</li>
    <li>bottom.jpg</li>
    </ul>
    The segment in the middle, represented by display.jpg, will contain the HAWHAW
    output. The size of this segment can be specified in the function call. By default
    a size of 150 x 120 pixel is assumed.
    The device simulator can be displayed only by Internet Explorer and Netscape 6. This
    is because the layout requires a scrollable table element, which is unfortunately not
    supported by all browsers, e.g. Netscape 4.x. For visitors with old browsers the
    classic HAWHAW layout will be presented instead.
    <br><br>
    @param path Relative or absolute path where the device image segments are stored.
    @param width (optional) Width of the display segment (default: 150)
    @param height (optional) Height of the display segment (default: 120)
    <br clear=all>
  */
  function set_sim_device($path, $width=150, $height=120)
  {
    $this->sim_device = $path;
    $this->simdev_width = $width;
    $this->simdev_height = $height;
  }


  /**
    Creates the page in the according markup language. Depending on the clients
    browser type HTML (pure HTML, handheldfriendly AvantGo HTML, iMode cHTML), WML
    or HDML code is created.
  */
  function create_page()
  {
    global $haw_license_holder;
    global $haw_license_domain;
    global $haw_signature;
    global $haw_sig_text;
    global $haw_sig_link;

    if (HAW_DEBUG)
      header("content-type: text/plain");

    if ($this->ml == HAW_HTML)
    {
      // create HTML page header

      if (!HAW_DEBUG)
        header("content-type: text/html");

      echo "<!doctype html public \"-//w3c//dtd html 4.0 transitional//en\">\n";
      echo "<html>\n";
      echo "<head>\n";

      if (!$this->iModestyle)
      {
        // iMode does not support meta tags

        if ($haw_license_domain)
          $license = " - registered for $haw_license_domain";

        printf("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=%s\">\n",
                $this->charset);
        printf("<meta name=\"GENERATOR\" content=\"%s (PHP) %s%s\">\n",
               HAW_VERSION, HAW_COPYRIGHT, $license);

        if ($this->timeout > 0)
        {
          printf("<meta http-equiv=\"refresh\" content=\"%d; URL=%s%s\">\n",
                  $this->timeout, $this->red_url, $dispsiminfo);
        }

        if ($this->disable_cache)
        {
          echo "<meta http-equiv=\"Cache-Control\" content=\"must-revalidate\">\n";
          echo "<meta http-equiv=\"Cache-Control\" content=\"no-cache\">\n";
          echo "<meta http-equiv=\"Cache-Control\" content=\"max-age=0\">\n";
          echo "<meta http-equiv=\"Expires\" content=\"0\">\n";
        }
      }

      if ($this->avantgostyle)
      {
        echo "<meta name=\"HandheldFriendly\" content=\"True\">\n";
      }

      if ($this->pureHTML)
      {
        if ($this->bgcolor)
          // set background color for a HTML created page
          $bgcolor = " bgcolor=\"" . $this->bgcolor . "\"";

        if ($this->background)
          // set wallpaper for a HTML created page
          $background = " background=\"" . $this->background . "\"";

        if ($this->disp_background)
          // set display wallpaper for a HTML created page
          $disp_background = " background=\"" . $this->disp_background . "\"";

        if ($this->size)
          // set the font size for all characters in a HTML created page
          $size = " size=\"" . $this->size . "\"";

        if ($this->color)
          // set the color for all characters in a HTML created page
          $color = " color=\"" . $this->color . "\"";

        if ($this->link_color)
          // set the color of links in a HTML created page
          $link_color = " link=\"" . $this->link_color . "\"";

        if ($this->vlink_color)
          // set the color of visited links in a HTML created page
          $vlink_color = " vlink=\"" . $this->vlink_color . "\"";

        if ($this->face)
          // set the font for all characters in a HTML created page
          $face = " face=\"" . $this->face . "\"";
      }

      printf("<title>%s</title>\n", HAW_specchar($this->title, $this));
      echo "</head>\n";
      printf("<body%s%s%s%s>\n", $bgcolor, $background, $link_color, $vlink_color);

      if ($this->display_banners)
      {
        if ($this->number_of_top_banners > 0)
        {
          echo "<center>\n";

            for ($i=0; $i<$this->number_of_top_banners; $i++)
            {
              // display banners at the top of the HTML page
              $banner = $this->top_banners[$i];
              $banner->create();
            }

          echo "</center>\n";
        }
      }

      if ($this->pureHTML)
      {
        echo "<center><br>\n";

        if ($this->td_scroll && $this->sim_device)
        {
          // create device simulator table layout
          echo "<table border=0 cellpadding=0 cellspacing=0>\n";
          printf("<tr><td colspan=\"3\"><img src=\"%s/top.jpg\"></td></tr>\n",
                  $this->sim_device);
          printf("<tr><td valign=\"top\"><img src=\"%s/left.jpg\"></td>\n",
                  $this->sim_device);
          printf("<td width=\"%d\" height=\"%d\" background=\"%s/display.jpg\" valign=\"top\">\n",
                  $this->simdev_width, $this->simdev_height, $this->sim_device);
        }
        else
        {
          // create simple table design for big-screen HTML
          printf("<table border=\"%d\" bgcolor=\"%s\" cellpadding=\"8\" width=\"%s\" height=\"%s\"%s>\n",
                  $this->border, $this->disp_bgcolor, $this->width, $this->height, $disp_background);
          echo "<tr><td valign=\"top\">\n";
        }

        printf("<font%s%s%s>\n", $size, $color, $face);
      }
    }
    else
    {
      // determine default values for WML and HDML form elements

      while (list($e_key, $e_val) = each($this->element))
      {
        if ($e_val->get_elementtype() == HAW_FORM)
        {
          // one (and only one!) form exists

          $form = $e_val;
          $defaults = $form->get_defaults();
        }
      }

      if ($this->ml == HAW_WML)
      {
        // create WML page header
        if (!HAW_DEBUG)
          header("content-type: text/vnd.wap.wml");

        if ($this->disable_cache)
        {
          // not all WAP clients interprete meta directives!
          // disable caching by sending HTTP content-location header with unique value

          $request_uri = getenv(REQUEST_URI);

          if (strchr($request_uri, "?"))
            // request URI already contains parameter(s)
            $header= sprintf("content-location: %s&hawcid=%s", $request_uri, date("U"));
          else
            // no parameters in URI
            $header= sprintf("content-location: %s?hawcid=%s", $request_uri, date("U"));

          header($header);
        }

        echo "<?xml version=\"1.0\"?>\n";

        if ($this->owgui_1_3)
          echo "<!DOCTYPE wml PUBLIC \"-//OPENWAVE.COM//DTD WML 1.3//EN\" \"http://www.openwave.COM/dtd/wml13.dtd\" >\n";
        else
          echo "<!DOCTYPE wml PUBLIC \"-//WAPFORUM//DTD WML 1.1//EN\" \"http://www.wapforum.org/DTD/wml_1.1.xml\">\n";

        printf("<!-- Generated by %s %s -->\n", HAW_VERSION, HAW_COPYRIGHT);

        echo "<wml>\n";

        if ($this->disable_cache)
        {
          echo "<head>\n";
          echo "<meta http-equiv=\"Cache-Control\" content=\"must-revalidate\" forua=\"true\"/>\n";
          echo "<meta http-equiv=\"Cache-Control\" content=\"no-cache\" forua=\"true\"/>\n";
          echo "<meta http-equiv=\"Cache-Control\" content=\"max-age=0\" forua=\"true\"/>\n";
          echo "<meta http-equiv=\"Expires\" content=\"0\" forua=\"true\"/>\n";
          echo "<meta http-equiv=\"Pragma\" content=\"no-cache\" forua=\"true\"/>\n";
          echo "</head>\n";
        }

        if ($this->title)
          $title = " title=\"" . HAW_specchar($this->title,$this) . "\"";

        printf("<card%s>\n", $title);

        if ($defaults)
        {
          // default values exist

          // set variables each time the card is enter in forward direction ...

          echo "<onevent type=\"onenterforward\">\n";
          echo "<refresh>\n";

          // initialize all WML variables with their default values
          while (list($d_key, $d_val) = each($defaults))
            printf("<setvar name=\"%s\" value=\"%s\"/>\n",
                   $d_val[name], HAW_specchar($d_val[value], $this));

          reset($defaults);

          echo "</refresh>\n";
          echo "</onevent>\n";

          // ... and backward direction

          echo "<onevent type=\"onenterbackward\">\n";
          echo "<refresh>\n";

          while (list($d_key, $d_val) = each($defaults))
            printf("<setvar name=\"%s\" value=\"%s\"/>\n", $d_val[name], $d_val[value]);

          echo "</refresh>\n";
          echo "</onevent>\n";
        }

        // set redirection timeout
        if ($this->timeout > 0)
        {
           echo "<onevent type=\"ontimer\">\n";
           printf("<go href=\"%s\"/>\n", HAW_specchar($this->red_url, $this));
           echo "</onevent>\n";
           printf("<timer value=\"%d\"/>\n", $this->timeout*10);
        }

        // define <back> softkey
        echo "<do type=\"prev\" label=\"Back\">\n";
        echo "<prev/>\n";
        echo "</do>\n";
      }
      elseif ($this->ml == HAW_HDML)
      {
        // create HDML card set structure

        $this->hdmlcardset = new HAW_hdmlcardset(HAW_specchar($this->title, $this),
                                                 $defaults, $this->disable_cache);
      }
    }

    if ($this->td_scroll && $this->sim_device)
      // make content of table element scrollable
      $divstyle = sprintf(" style=\"width:%d;height:%d;overflow:auto\"",
                            $this->simdev_width, $this->simdev_height);

    switch ( $this->alignment )
    {
      case HAW_ALIGN_LEFT:
      {
        if ($this->ml == HAW_HTML)
          printf("<div align=\"left\"%s>\n", $divstyle);
        elseif ($this->ml == HAW_WML)
          echo "<p>\n"; // left is default

        break;
      }

      case HAW_ALIGN_CENTER:
      {
        if ($this->ml == HAW_HTML)
          printf("<div align=\"center\"%s>\n", $divstyle);
        elseif ($this->ml == HAW_WML)
          echo "<p align=\"center\">\n";

        break;
      }

      case HAW_ALIGN_RIGHT:
      {
        if ($this->ml == HAW_HTML)
          printf("<div align=\"right\"%s>\n", $divstyle);
        elseif ($this->ml == HAW_WML)
          echo "<p align=\"right\">\n";

        break;
      }

    }

    $i = 0;
    while ( $this->element[$i] )
    {
      $page_element = $this->element[$i];
      switch ($page_element->get_elementtype())
      {
        case HAW_PLAINTEXT:
        case HAW_IMAGE:
        case HAW_TABLE:
        case HAW_FORM:
        case HAW_LINK:
        case HAW_PHONE:
        case HAW_LINKSET:
        case HAW_RAW:
        case HAW_RULE:
        {
          $element = $this->element[$i];
          $element->create($this);

          break;
        }
      }

      $i++;
    }

    if ($this->ml == HAW_HTML)
    {
      // create HTML page end

      //  ATTENTION!
      //
      //  DO NOT REMOVE THE COPYRIGHT LINK WITHOUT PERMISSION!
      //  IF YOU DO SO, YOU ARE VIOLATING THE LICENSE TERMS
      //  OF THIS SOFTWARE! YOU HAVE TO PAY NOTHING FOR THIS
      //  SOFTWARE, SO PLEASE BE SO FAIR TO ACCEPT THE RULES.
      //  IF YOU DON'T, YOUR WEBSITE WILL AT LEAST BE LISTED IN
      //  THE HAWHAW HALL OF SHAME!
      //  PLEASE REFER TO THE LIBRARY HEADER AND THE HAWHAW
      //  HOMEPAGE FOR MORE INFORMATION.

      echo "</div>\n";

      if ($this->pureHTML)
      {
        echo "</font></td>\n";

        if ($this->td_scroll && $this->sim_device)
        {
          // display lower part of device simulator
          printf("<td valign=\"top\"><img src=\"%s/right.jpg\"></td></tr>\n",
                  $this->sim_device);
          printf("<tr><td colspan=\"3\"><img src=\"%s/bottom.jpg\"></td>\n",
                  $this->sim_device);
        }

        echo "</tr></table>\n";

        if ($haw_license_holder && $haw_signature)
        {
          if ($haw_signature == 1)
            $signature = sprintf("<font size=-1>Powered by HAWHAW (C)</font>\n");
          else
            if ($haw_sig_text)
              if ($haw_sig_link)
                $signature = sprintf("<a href=\"%s\" target=\"_blank\"><font size=-1>%s</font></a>\n", $haw_sig_link, $haw_sig_text);
              else
                $signature = sprintf("<font size=-1>%s</font>\n", $haw_sig_text);
        }
        else
          $signature = sprintf("<a href=\"http://www.hawhaw.de/info/index.htm?host=%s\" target=\"_blank\"><font size=-1>Powered by HAWHAW (C)</font></a>\n", $this->waphome);
        echo $signature;

        echo "</center>\n";
      }

      if ($this->display_banners)
      {
        if ($this->number_of_bottom_banners > 0)
        {
          echo "<center>\n";

            for ($i=0; $i<$this->number_of_bottom_banners; $i++)
            {
              // display banners at the bottom of the HTML page
              $banner = $this->bottom_banners[$i];
              $banner->create();
            }

          echo "</center>\n";
        }
      }

      echo "</body>\n";
      echo "</html>\n";
    }
    elseif ($this->ml == HAW_WML)
    {
      // create WML page end
      echo "</p>\n";
      echo "</card>\n";
      echo "</wml>\n";
    }
    elseif ($this->ml == HAW_HDML)
    {
      // create HDML page from hdml card set structure
      $cardset = $this->hdmlcardset;
      $cardset->create_hdmldeck();
    }
  }
};






/**
  This class defines a form with various possible input elements. The input elements
  have to be defined as seperate objects and are linked to the form with a special
  "add" function. One HAW_deck object can contain only one HAW_form object.
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck(...);<br>
  ...<br>
  $myForm = new HAW_form("/mynextpage.wml");<br>
  $myText = new HAW_text(...);<br>
  $myForm->add_text($myText);<br>
  $myInput = new HAW_input(...);<br>
  $myForm->add_input($myInput);<br>
  $mySubmit = new HAW_submit(...);<br>
  $myForm->add_submit($mySubmit);<br>
  ...<br>
  $myPage->add_form($myForm);<br>
  ...<br>
  $myPage->create_page();
  @see HAW_text
  @see HAW_image
  @see HAW_table
  @see HAW_input
  @see HAW_select
  @see HAW_radio
  @see HAW_checkbox
  @see HAW_hidden
  @see HAW_submit
  @see HAW_rule
*/
class HAW_form
{
  var $url;
  var $element;
  var $number_of_elements;
  var $number_of_submitobjects;


  /**
    Constructor
    @param url Address where the user input is sent to.<br>
      Note: Currently only the GET method is supported.
  */
  function HAW_form($url)
  {
    $this->url = $url;
    $this->number_of_elements = 0;
  }


  /**
    Adds a HAW_text object to HAW_form.
    @param text Some HAW_text object.
    @see HAW_text
  */
  function add_text($text)
  {
    if (!is_object($text))
      die("invalid argument in add_text()");

    $this->element[$this->number_of_elements] = $text;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_image object to HAW_form.
    @param image Some HAW_image object.
    @see HAW_image
  */
  function add_image($image)
  {
    if (!is_object($image))
      die("invalid argument in add_image()");

    $this->element[$this->number_of_elements] = $image;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_table object to HAW_form.
    @param table Some HAW_table object.
    @see HAW_table
  */
  function add_table($table)
  {
    if (!is_object($table))
      die("invalid argument in add_table()");

    $this->element[$this->number_of_elements] = $table;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_input object to HAW_form.
    @param input Some HAW_input object.
    @see HAW_input
  */
  function add_input($input)
  {
    if (!is_object($input))
      die("invalid argument in add_input()");

    $this->element[$this->number_of_elements] = $input;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_select object to HAW_form.
    @param select Some HAW_select object.
    @see HAW_select
  */
  function add_select($select)
  {
    if (!is_object($select))
      die("invalid argument in add_select()");

    $this->element[$this->number_of_elements] = $select;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_radio object to HAW_form.
    @param radio Some HAW_radio object.
    @see HAW_radio
  */
  function add_radio($radio)
  {
    if (!is_object($radio))
      die("invalid argument in add_radio()");

    $this->element[$this->number_of_elements] = $radio;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_checkbox object to HAW_form.
    @param checkbox Some HAW_checkbox object.
    @see HAW_checkbox
  */
  function add_checkbox($checkbox)
  {
    if (!is_object($checkbox))
      die("invalid argument in add_checkbox()");

    $this->element[$this->number_of_elements] = $checkbox;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_hidden object to HAW_form.
    @param hidden Some HAW_hidden object.
    @see HAW_hidden
  */
  function add_hidden($hidden)
  {
    if (!is_object($hidden))
      die("invalid argument in add_hidden()");

    $this->element[$this->number_of_elements] = $hidden;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_submit object to HAW_form.
    @param submit Some HAW_submit object.
    @see HAW_submit
  */
  function add_submit($submit)
  {
    if (!is_object($submit))
      die("invalid argument in add_submit()");

    if ($this->number_of_submitobjects > 0)
      die("only one HAW_submit object per form allowed!");

    $this->element[$this->number_of_elements] = $submit;

    $this->number_of_elements++;
    $this->number_of_submitobjects++;
  }


  /*
    Adds a HAW_raw object to HAW_form. (undocumented feature - for test only!)
    @param raw_markup_object Some HAW_raw object.
    @see HAW_raw
  */
  function add_raw($raw)
  {
    if (!is_object($raw))
      die("invalid argument in add_raw()");

    $this->element[$this->number_of_elements] = $raw;

    $this->number_of_elements++;
  }


  /**
    Adds a HAW_rule object to HAW_form.
    @param rule Some HAW_rule object.
    @see HAW_rule
  */
  function add_rule($rule)
  {
    if (!is_object($rule))
      die("invalid argument in add_rule()");

    $this->element[$this->number_of_elements] = $rule;

    $this->number_of_elements++;
  }


  function get_defaults()
  {
    $i = 0;
    while (list($key, $val) = each($this->element))
    {
      switch ($val->get_elementtype())
      {
        case HAW_CHECKBOX:
        {
          $checkbox = $val;

          if ($checkbox->is_checked())
          {
            $defaults[$i]["name"]  = $checkbox->get_name();
            $defaults[$i]["value"] = $checkbox->get_value();
            $i++;
          }

          break;
        }

        case HAW_INPUT:
        case HAW_SELECT:
        case HAW_RADIO:
        case HAW_HIDDEN:
        {
          $element = $val;

          $defaults[$i]["name"]  = $element->get_name();
          $defaults[$i]["value"] = $element->get_value();
          $i++;

          break;
        }
      }
    }

    return $defaults;
  }

  function get_elementtype()
  {
    return HAW_FORM;
  }

  function create(&$deck)
  {
    // determine all elements that have to be submitted

    $i = 0;
    while (list($key, $val) = each($this->element))
    {
      switch ($val->get_elementtype())
      {
        case HAW_INPUT:
        case HAW_SELECT:
        case HAW_CHECKBOX:
        case HAW_RADIO:
        case HAW_HIDDEN:
        {
          $element = $val;
          $getvar[$i] = $element->get_name();
          $i++;
        }
      }
    }

    if ($deck->ml == HAW_HTML)
    {
      // start tag of HTML form
      printf("<form action=\"%s\" method=\"get\">\n", $this->url);
    }
      // not necessary in WML and HDML!


    $i = 0;
    while ( $this->element[$i] )
    {
      $form_element = $this->element[$i];
      switch ($form_element->get_elementtype())
      {
        case HAW_PLAINTEXT:
        case HAW_IMAGE:
        case HAW_TABLE:
        case HAW_INPUT:
        case HAW_SELECT:
        case HAW_RADIO:
        case HAW_CHECKBOX:
        case HAW_HIDDEN:
        case HAW_RAW:
        case HAW_RULE:
        {
          $form_element->create($deck);
          break;
        }

        case HAW_SUBMIT:
        {
          $submit = $this->element[$i];
          $submit->create($deck, $getvar, $this->url);
          break;
        }

      }

      $i++;
    }

    if ($deck->ml == HAW_HTML)
    {
      // terminate HTML form
      echo "</form>\n";
    }
  }
};






/**
  This class allows to insert plain text into a HAW_deck, HAW_form or HAW_table object.
  <p><b>Examples:</b><p>
  $myText1 = new HAW_text("Hello WAP!");<br>
  $myText2 = new HAW_text("Welcome to HAWHAW", HAW_TEXTFORMAT_BOLD);<br>
  $myText3 = new HAW_text("Good Morning", HAW_TEXTFORMAT_BOLD | HAW_TEXTFORMAT_BIG);<br>
  <br>
  $myText3->set_br(2);<br>
  @see HAW_deck
  @see HAW_form
  @see HAW_row
*/
class HAW_text
{
  var $text;
  var $attrib;
  var $br;

  /**
    Constructor
    @param text Some string you want to display
    @param attrib (optional)<br>
      HAW_TEXTFORMAT_NORMAL  (default)<br>
      HAW_TEXTFORMAT_BOLD<br>
      HAW_TEXTFORMAT_UNDERLINE<br>
      HAW_TEXTFORMAT_ITALIC<br>
      HAW_TEXTFORMAT_BIG<br>
      HAW_TEXTFORMAT_SMALL
  */
  function HAW_text($text, $attrib=HAW_TEXTFORMAT_NORMAL)
  {
    $this->text = $text;
    $this->attrib = $attrib;
    $this->br = 1; // default: 1 line break after text
  }

  /**
    Sets the number of line breaks (CRLF) after text. (default: 1)
    @param br Some number of line breaks.
  */
  function set_br($br)
  {
    if (!is_int($br) || ($br < 0))
      die("invalid argument in set_br()");

    $this->br = $br;
  }

  function get_elementtype()
  {
    return HAW_PLAINTEXT;
  }

  function create(&$deck)
  {
    if ($deck->ml == HAW_HDML)
    {
      // HDML

      if ($deck->alignment == HAW_ALIGN_CENTER)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<center>\n");

      if ($deck->alignment == HAW_ALIGN_RIGHT)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<right>\n");

      // print text
      if ($this->text)
      {
        $content = sprintf("%s\n", HAW_specchar($this->text, $deck));
        $deck->hdmlcardset->add_display_content($content);
      }

      // create required amount of carriage return's
      for ($i=0; $i < $this->br; $i++)
        $br .= "<br>\n";

      $deck->hdmlcardset->add_display_content($br);
    }
    else
    {
      // HTML or WML

      if ($this->attrib & HAW_TEXTFORMAT_BOLD)
        echo "<b>\n";

      if ($this->attrib & HAW_TEXTFORMAT_UNDERLINE)
        echo "<u>\n";

      if ($this->attrib & HAW_TEXTFORMAT_ITALIC)
        echo "<i>\n";

      if ($this->attrib & HAW_TEXTFORMAT_BIG)
        echo "<big>\n";

      if ($this->attrib & HAW_TEXTFORMAT_SMALL)
        echo "<small>\n";

      // print text
      if ($this->text)
        printf("%s\n", HAW_specchar($this->text, $deck));

      if ($this->attrib & HAW_TEXTFORMAT_SMALL)
        echo "</small>\n";

      if ($this->attrib & HAW_TEXTFORMAT_BIG)
        echo "</big>\n";

      if ($this->attrib & HAW_TEXTFORMAT_ITALIC)
        echo "</i>\n";

      if ($this->attrib & HAW_TEXTFORMAT_UNDERLINE)
        echo "</u>\n";

      if ($this->attrib & HAW_TEXTFORMAT_BOLD)
        echo "</b>\n";

      // create required amount of carriage return's
      if ($deck->ml == HAW_HTML)
      {
        // break instruction in HTML
        $br_command = "<br clear=all>\n";
      }
      elseif ($deck->ml == HAW_WML)
      {
        // break instruction in WML
        $br_command = "<br/>\n";
      }
      for ($i=0; $i < $this->br; $i++)
        echo $br_command;
    }
  }
};






/**
  This class allows to insert bitmap images into a HAW_deck, HAW_form or HAW_table
  object.
  <p><b>Examples:</b><p>
  $myImage1 = new HAW_image("my_image.wbmp", "my_image.gif", ":-)");<br>
  $myImage2 = new HAW_image("my_image.wbmp", "my_image.gif", ":-)", "my_image.bmp");<br>
  $myImage2->set_br(1);<br>
  @see HAW_deck
  @see HAW_form
  @see HAW_row
*/
class HAW_image
{
  var $src_wbmp;
  var $src_html;
  var $alt;
  var $src_bmp;
  var $br;

  /**
    Constructor
    @param src_wbmp Your bitmap in WAP-conform .wbmp format.
    @param src_html Your bitmap in .gif, .jpg or any other HTML compatible format.
    @param alt Alternative text for your bitmap. Will be displayed if the client can
       display none of your graphic formats.
    @param src_bmp (optional)<br>your bitmap in monochrome .bmp format. If the
       browser signals in the HTTP request header, that he's only able to display
       image/bmp and not image/vnd.wap.wbmp (e.g. the UPSim 3.2 did so), this image
       will be sent.
  */
  function HAW_image($src_wbmp, $src_html, $alt, $src_bmp="")
  {
    $this->src_wbmp = $src_wbmp;
    $this->src_html = $src_html;
    $this->alt      = $alt;
    $this->src_bmp  = $src_bmp;
    $this->br = 0; // default: no line break after image
  }

  /**
    Sets the number of line breaks (CRLF) after the image. (default: 0)
    @param br Some number of line breaks.
  */
  function set_br($br)
  {
    if (!is_int($br) || ($br < 0))
      die("invalid argument in set_br()");

    $this->br = $br;
  }

  function get_elementtype()
  {
    return HAW_IMAGE;
  }

  function create(&$deck)
  {
    $HTTP_ACCEPT = getenv(HTTP_ACCEPT);

    if ($deck->ml == HAW_HDML)
    {
      // HDML

      if ($deck->alignment == HAW_ALIGN_CENTER)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<center>\n");

      if ($deck->alignment == HAW_ALIGN_RIGHT)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<right>\n");

      $content = sprintf("<img src=\"%s\" alt=\"%s\">\n",
                         $this->src_bmp,
                         HAW_specchar($this->alt, $deck));

      $deck->hdmlcardset->add_display_content($content);

      // create required amount of carriage return's
      for ($i=0; $i < $this->br; $i++)
        $br .= "<br>\n";

      $deck->hdmlcardset->add_display_content($br);
    }
    else
    {
      // HTML or WML

      if ($deck->ml == HAW_HTML)
      {
        printf("<img src=\"%s\" alt=\"%s\">\n",
               $this->src_html, HAW_specchar($this->alt, $deck));

        // break instruction in HTML
        $br_command = "<br clear=all>\n";
      }
      else
      {
        if (strstr(strtolower($HTTP_ACCEPT), "image/vnd.wap.wbmp"))
          // user agent is able to display .wbmp image
          printf("<img src=\"%s\" alt=\"%s\"/>\n", $this->src_wbmp,
                  HAW_specchar($this->alt, $deck));

        elseif (strstr(strtolower($HTTP_ACCEPT), "image/bmp") && $this->src_bmp)
          // user agent is able to display .bmp and .bmp image is available
          printf("<img src=\"%s\" alt=\"%s\"/>\n", $this->src_bmp,
                  HAW_specchar($this->alt, $deck));

        else
          // hope that the user agent makes the best of it!
          printf("<img src=\"%s\" alt=\"%s\"/>\n", $this->src_wbmp,
                  HAW_specchar($this->alt, $deck));

        // break instruction in WML
        $br_command = "<br/>\n";
      }

      // create required amount of carriage return's
      for ($i=0; $i < $this->br; $i++)
        echo $br_command;
    }
  }
};






/**
  This class allows to insert tables into a HAW_deck or HAW_form object.
  <p>Note: Not all WAP clients are able to display tables properly! HDML is not
  supporting tables at all. For HDML users the table's content will be generated
  column-by-column, respectively row-by-row, where each table cell will result in
  one separate line on the display.
  <p><b>Examples:</b><p>
  ...<br>
  $myTable = new HAW_table();<br>
  $row1 = new HAW_row();<br>
  $row1->add_column($image1);<br>
  $row1->add_column($text1);<br>
  $myTable->add_row($row1);<br>
  $row2 = new HAW_row();<br>
  $row2->add_column($image2);<br>
  $row2->add_column($text2);<br>
  $myTable->add_row($row2);<br>
  $myDeck->add_table($myTable);<br>
  ...
  @see HAW_deck
  @see HAW_form
  @see HAW_row
*/
class HAW_table
{
  var $row;
  var $number_of_rows;

  /**
    Constructor
  */
  function HAW_table()
  {
    $this->number_of_rows = 0;
  }


  /**
    Adds a HAW_row object to HAW_table.
    @param row Some HAW_row object.
  */
  function add_row($row)
  {
    if (!is_object($row))
      die("invalid argument in add_row()");

    $this->row[$this->number_of_rows] = $row;

    $this->number_of_rows++;
  }

  function get_elementtype()
  {
    return HAW_TABLE;
  }

  function create(&$deck)
  {
    // HDML does not support tables ==> skip all table tags for HDML

    if ($deck->ml == HAW_HTML)
    {
      // HTML
      echo "<table border>\n";
    }
    elseif ($deck->ml == HAW_WML)
    {
      // WML

      // evaluate maximum number of columns in table

      $max_columns = 0;
      for ($i = 0; $i < $this->number_of_rows; $i++)
      {
        $row = $this->row[$i];
        $columns = $row->get_number_of_columns();

        if ($columns > $max_columns)
          $max_columns = $columns;
      }

      printf("<table columns=\"%d\">\n", $max_columns);
    }

    for ($i = 0; $i < $this->number_of_rows; $i++)
    {
      $row = $this->row[$i];
      $row->create($deck);
    }

    //terminate table
    if ($deck->ml == HAW_HTML)
    {
      // make new line in HTML
      echo "</table><br clear=all>\n";
    }
    elseif ($deck->ml == HAW_WML)
    {
      // make new line in WML
      echo "</table><br/>\n";
    }
  }
};






/**
  This class defines the rows, a HAW_table object consists of.
  <p><b>Examples:</b><p>
  ...<br>
  $image1 = new HAW_image("my_image.wbmp", "my_image.gif", ":-)");<br>
  $text1 = new HAW_text("my text");<br>
  $row1 = new HAW_row();<br>
  $row1->add_column($image1);<br>
  $row1->add_column();<br>
  $row1->add_column($text1);<br>
  ...
  @see HAW_table
  @see HAW_text
  @see HAW_image
  @see HAW_link
*/
class HAW_row
{
  var $column;
  var $number_of_columns;

  /**
    Constructor
  */
  function HAW_row()
  {
    $this->number_of_columns = 0;
  }


  /**
    Adds a cell element to a HAW_row object.
    @param cell_element (optional)<br>Can be a HAW_text object, a HAW_image object,
      a HAW_link object or the NULL pointer (default).
      The latter results in an empty cell element.
  */
  function add_column($cell_element=NULL)
  {
    $this->column[$this->number_of_columns] = $cell_element;

    if (is_object($cell_element))
    {
      if (($cell_element->get_elementtype() != HAW_PLAINTEXT) &&
          ($cell_element->get_elementtype() != HAW_IMAGE) &&
          ($cell_element->get_elementtype() != HAW_LINK))
        die("invalid argument in add_column()");
    }

    $this->number_of_columns++;
  }

  function get_number_of_columns()
  {
     return $this->number_of_columns;
  }

  function create(&$deck)
  {
    // HDML does not support tables ==> skip all table tags for HDML

    if ($deck->ml != HAW_HDML)
      echo "<tr>\n";  // start of row

    for ($i = 0; $i < $this->number_of_columns; $i++)
    {
      if ($deck->ml != HAW_HDML)
        echo "<td>\n";  // start of column

      // call create function for each cellelement that is a HAWHAW object
      $column = $this->column[$i];
      if (is_object($column))
        $column->create($deck);

      if ($deck->ml != HAW_HDML)
        echo "</td>\n";  // end of column
    }

    if ($deck->ml != HAW_HDML)
      echo "</tr>\n";  // end of row
  }
};






/**
  This class provides a text input area in a HAW_form object.
  <p><b>Examples:</b><p>
  $myInput1 = new HAW_input("cid", "", "Customer ID");<br>
  <br>
  $myInput2 = new HAW_input("cid", "", "Customer ID", "*N");<br>
  $myInput2->set_size(6);<br>
  $myInput2->set_maxlength(6);<br>
  <br>
  $myInput3 = new HAW_input("pw", "", "Password", "*N");<br>
  $myInput3->set_size(8);<br>
  $myInput3->set_maxlength(8);<br>
  $myInput3->set_type(HAW_INPUT_PASSWORD);<br>
  $myInput3->display_format_in_HTML(true);
  @see HAW_form
*/
class HAW_input
{
  var $name;
  var $value;
  var $label;
  var $size;
  var $maxlength;
  var $type;
  var $format;
  var $display_format_in_HTML;

  /**
    Constructor
    @param name Variable in which the input is sent to the destination URL.
    @param value Initial value (string!) that will be presented in the input area.
    @param label Describes your input area on the surfer's screen/display.
    @param format (optional, default: "*M")<br>
       Input format code according to the WAP standard.
       Allows the WAP user client e.g. to input only digits and no characters. On a
       HTML generated page this format has no significance.
  */
  function HAW_input($name, $value, $label, $format="*M")
  {
    $this->name   = $name;
    $this->value  = $value;
    $this->label  = $label;
    $this->format = $format;
    $this->type   = HAW_INPUT_TEXT;
    $this->display_format_in_HTML = false;
  }

  /**
    Set size of the input area.<br>Note: Will be ignored in case of HDML output.
    @param size Number of characters fitting into the input area.
  */
  function set_size($size)
  {
    $this->size = $size;
  }

  /**
    Set maximum of allowed characters in the input area.<br>
    Note: Will be ignored in case of HDML output.
    @param maxlength Maximum number of characters the user can enter.
  */
  function set_maxlength($maxlength)
  {
    $this->maxlength = $maxlength;
  }

  /**
    Set input type
    @param type Allowed values: HAW_INPUT_TEXT (default) or HAW_INPUT_PASSWORD.
  */
  function set_type($type)
  {
    $this->type = $type;
  }

  /**
    If you set this true, you can see next to your HTML text input area the format
    code which would have been sent to a WAP user client.
    @param display_format_in_HTML Allowed values: true (default) or false.
  */
  function display_format_in_HTML($display_format_in_HTML)
  {
    $this->display_format_in_HTML = $display_format_in_HTML;
  }

  function get_name()
  {
    return $this->name;
  }

  function get_value()
  {
    return $this->value;
  }

  function get_label()
  {
    return $this->label;
  }

  function get_size()
  {
    return $this->size;
  }

  function get_maxlength()
  {
    return $this->maxlength;
  }

  function get_type()
  {
    return $this->type;
  }

  function get_format()
  {
    return $this->format;
  }

  function get_elementtype()
  {
    return HAW_INPUT;
  }

  function create(&$deck)
  {
    if ($this->type == HAW_INPUT_PASSWORD)
      $type = "type=\"password\"";
    else
      $type = "type=\"text\"";

    if ($this->size)
      $size = sprintf("size=\"%d\"", $this->size);

    if ($this->maxlength)
      $maxlength = sprintf("maxlength=\"%d\"", $this->maxlength);

    if ($deck->ml == HAW_HTML)
    {
      // create HTML input
      printf("%s: <input %s name=\"%s\" value=\"%s\" %s %s>",
              HAW_specchar($this->label, $deck), $type,
              $this->name, $this->value, $size, $maxlength);

      // show format information to be applied by a real WAP client
      // (has no effect in HTML)
      if ($this->display_format_in_HTML)
        printf("%s<br>\n", $this->format);
      else
        echo "<br>\n";
    }
    elseif ($deck->ml == HAW_WML)
    {
      // create WML input
      printf("%s:<input format=\"%s\" %s name=\"%s\" value=\"%s\" %s %s/>\n",
              HAW_specchar($this->label, $deck), $this->format,
              $type, $this->name, $this->value, $size, $maxlength);
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // create HDML input

      $options  = " format=\"$this->format\"";
      $options .= " key=\"$this->name\"";

      if ($this->type == HAW_INPUT_PASSWORD)
        $options .= " NOECHO=\"true\"";

      if ($deck->alignment == HAW_ALIGN_CENTER)
        $display_content = "<center>\n";
      elseif ($deck->alignment == HAW_ALIGN_RIGHT)
        $display_content = "<right>\n";

      $display_content .= HAW_specchar($this->label, $deck);
      $display_content .= ":\n";

      // make user interactive entry card
      $deck->hdmlcardset->make_ui_card($options, $display_content, HAW_HDML_ENTRY);
    }
  }
};






/**
  This class provides a select element in a HAW_form object.
  It allows to create optimized WML for WAP devices which
  are capable to interprete the Openwave GUI extensions for WML 1.3. All other
  WAP devices receive WML 1.1 compatible markup code, which is quite similar to
  the markup code created by the HAW_radio class.
  <p><b>Examples:</b><p>
  $mySelect = new HAW_select("color");<br>
  $mySelect->add_option("Blue", "b");<br>
  $mySelect->add_option("Red", "r", HAW_SELECTED);<br>
  $mySelect->add_option("Yellow", "y");
  @see HAW_form
*/
class HAW_select
{
  var $name;
  var $type;
  var $value;
  var $options;
  var $number_of_options;


  /**
    Constructor
    @param name Variable in which the information about the selected option is sent to
       the destination URL.
    @param type (optional)<br>
      Type of select area:<br>
      HAW_SELECT_POPUP: popup the whole selection list  (default)<br>
      HAW_SELECT_SPIN: rotate options on a WAP device screen<br>
  */
  function HAW_select($name, $type=HAW_SELECT_POPUP)
  {
    $this->name = $name;
    $this->type = $type;
    $this->value = false;
    $this->number_of_options = 0;
  }


  function get_name()
  {
    return $this->name;
  }


  function get_value()
  {
    return $this->value;
  }


  /**
    Adds one option to a HAW_select object.
    @param label Describes the option on the surfer's screen/display.
    @param value Value (string!) sent in the "name" variable, if this option is selected.
    @param is_selected (optional)<br>Allowed values are HAW_SELECTED or HAW_NOT_SELECTED
       (default).<br>Note: Setting to "selected" will overwrite previous "selected"
       options of this HAW_select object.
  */
  function add_option($label, $value, $is_selected=HAW_NOT_SELECTED)
  {
    if (!$label || !$value)
      die("invalid argument in add_option()");

    $this->options[$this->number_of_options]["label"] = $label;
    $this->options[$this->number_of_options]["value"] = $value;

    if (!$this->value || ($is_selected == HAW_SELECTED))
      $this->value = $value;

    $this->number_of_options++;
  }


  function get_elementtype()
  {
    return HAW_SELECT;
  }


  function create(&$deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create HTML select

      echo "<select name=\"" . $this->name . "\" size=\"1\">\n";

      for ($i=0; $i < $this->number_of_options; $i++)
      {
        if ($this->options[$i]["value"] == $this->value)
          $state = " selected";

        echo "<option" . $state . " value=\"" . $this->options[$i]["value"] . "\">"
                       . HAW_specchar($this->options[$i]["label"], $deck) . "\n";
      }

      echo "</select>\n";
    }
    elseif ($deck->ml == HAW_WML)
    {
      // create WML select

      if ($deck->owgui_1_3)
      {
        // Openwave GUI extensions for WML 1.3

        switch ($this->type)
        {
          case HAW_SELECT_POPUP: { $type_option = "type=\"popup\""; break; }
          case HAW_SELECT_SPIN:  { $type_option = "type=\"spin\"";  break; }
          default:               { $type_option = "type=\"popup\""; break; }
        }

        echo "<select " . $type_option . " name=\"" . $this->name . "\">\n";
      }
      else
        // conventional WML (similar as for HAW_radio)
        echo "<select name=\"" . $this->name . "\">\n";

      for ($i=0; $i < $this->number_of_options; $i++)
      {
        echo "<option value=\"" . $this->options[$i]["value"] . "\">"
             . HAW_specchar($this->options[$i]["label"], $deck) . "</option>\n";
      }

      echo "</select>\n";
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // create HDML select (similar as for HAW_radio)

      $options = " key=\"$this->name\"";

      while (list($key, $val) = each($this->options))
      {
        // create one <ce> statement for each option
        $ce_area .= sprintf("<ce value=\"%s\">%s\n",
                            $val["value"],
                            HAW_specchar($val["label"], $deck));
      }

      // make user interactive choice card
      $deck->hdmlcardset->make_ui_card($options, $ce_area, HAW_HDML_CHOICE);
    }
  }
};






/**
  This class provides a radio button element in a HAW_form object.
  <p><b>Examples:</b><p>
  $myRadio = new HAW_radio("country");<br>
  $myRadio->add_button("Finland", "F");<br>
  $myRadio->add_button("Germany", "G", HAW_CHECKED);<br>
  $myRadio->add_button("Sweden", "S");
  @see HAW_form
*/
class HAW_radio
{
  var $name;
  var $value;
  var $buttons;
  var $number_of_buttons;

  /**
    Constructor
    @param name Variable in which the information about the pressed button is sent to
       the destination URL.
  */
  function HAW_radio($name)
  {
    $this->name  = $name;
    $this->number_of_buttons = 0;
  }

  function get_name()
  {
    return $this->name;
  }

  function get_value()
  {
    return $this->value;
  }

  /**
    Adds one radio button to a HAW_radio object.
    @param label Describes the radiobutton on the surfer's screen/display.
    @param value Value (string!) sent in the "name" variable, if this button is selected.
    @param is_checked (optional)<br>Allowed values are HAW_CHECKED or HAW_NOT_CHECKED
       (default).<br>Note: Setting to "checked" will overwrite previous "checked"
       radiobuttons of this HAW_radio object.
  */
  function add_button($label, $value, $is_checked=HAW_NOTCHECKED)
  {
    if (!$label || !$value)
      die("invalid argument in add_button()");

    $this->buttons[$this->number_of_buttons]["label"] = $label;
    $this->buttons[$this->number_of_buttons]["value"] = $value;

    if (!$this->value || ($is_checked == HAW_CHECKED))
      $this->value = $value;

    $this->number_of_buttons++;
  }

  function get_elementtype()
  {
    return HAW_RADIO;
  }

  function create(&$deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create HTML radio

      while (list($key, $val) = each($this->buttons))
      {
        if ($val["value"] == $this->value)
          $state = "checked";
        else
          $state = "";

        printf("<input type=\"radio\" name=\"%s\" %s value=\"%s\"> %s<br>\n",
                $this->name, $state, $val["value"],
                HAW_specchar($val["label"], $deck));
      }
    }
    elseif ($deck->ml == HAW_WML)
    {
      // create WML radio

      if ($deck->owgui_1_3)
        // Openwave GUI extensions for WML 1.3
        printf("<select type=\"radio\" name=\"%s\">\n", $this->name);
      else
        // conventional WML (similar as for HAW_select)
        printf("<select name=\"%s\">\n", $this->name);

      while (list($key, $val) = each($this->buttons))
      {
        printf("<option value=\"%s\">%s</option>\n",
                $val["value"], HAW_specchar($val["label"], $deck));
      }

      echo "</select>\n";
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // create HDML radio (similar as for HAW_select)

      $options = " key=\"$this->name\"";

      while (list($key, $val) = each($this->buttons))
      {
        // create one <ce> statement for each button
        $ce_area .= sprintf("<ce value=\"%s\">%s\n",
                            $val["value"],
                            HAW_specchar($val["label"], $deck));
      }

      // make user interactive choice card
      $deck->hdmlcardset->make_ui_card($options, $ce_area, HAW_HDML_CHOICE);
    }
  }
};






/**
  This class provides a single checkbox element in a HAW_form object.
  <p><b>Examples:</b><p>
  $myCheckbox = new HAW_checkbox("agmt", "yes", "I agree");<br>
  $myCheckbox = new HAW_checkbox("agmt", "yes", "I agree", HAW_NOTCHECKED);<br>
  $myCheckbox = new HAW_checkbox("agmt", "yes", "I agree", HAW_CHECKED);<br>
  <br>
  Note: The first and the second example are identical.
  @see HAW_form
*/
class HAW_checkbox
{
  var $name;
  var $value;
  var $state;

  /**
    Constructor
    @param name Variable in which "value" sent to the destination URL, in case that
       the box is checked.
    @param value See name.
    @param label Describes the checkbox on the surfer's screen/display.
    @param state (optional)<br>Allowed values are HAW_CHECKED or HAW_NOTCHECKED
       (default).
  */
  function HAW_checkbox($name, $value, $label, $state=HAW_NOTCHECKED)
  {
    $this->name  = $name;
    $this->value = $value;
    $this->label = $label;
    $this->state = $state;
  }

  function is_checked()
  {
    return $this->state;
  }

  function get_name()
  {
    return $this->name;
  }

  function get_value()
  {
    return $this->value;
  }

  function get_label()
  {
    return $this->label;
  }

  function get_elementtype()
  {
    return HAW_CHECKBOX;
  }

  function create(&$deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create HTML checkbox

      if ($this->is_checked())
        $state = "checked";

      printf("<input type=\"checkbox\" name=\"%s\" %s value=\"%s\"> %s<br>\n",
              $this->name, $state, $this->value,
              HAW_specchar($this->label, $deck));
    }
    elseif ($deck->ml == HAW_WML)
    {
      // create WML checkbox
      printf("<select name=\"%s\" multiple=\"true\">\n", $this->name);
      printf("<option value=\"%s\">%s</option>\n",
             $this->value, HAW_specchar($this->label, $deck));
      printf("</select>\n");
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // create HDML checkbox
      // HDML does not support the multiple option feature!
      // ==> trick: simulate checkbox by creating radio buttons [x] and [ ]

      $options = " key=\"$this->name\"";

      // create label above the radio buttons
      $cb = sprintf("%s\n", HAW_specchar($this->label, $deck));

      // create "checked" radio button
      $cb .= sprintf("<ce value=\"%s\">[x]\n", $this->value);

      // create "not checked" radio button
      $cb .= "<ce value=\"\">[ ]\n";

      // make user interactive choice card
      $deck->hdmlcardset->make_ui_card($options, $cb, HAW_HDML_CHOICE);
    }
  }
};






/**
  This class provides a "hidden" element in a HAW_form object.
  <p><b>Examples:</b><p>
  $myHiddenElement = new HAW_hidden("internal_reference", "08154711");
  @see HAW_form
*/
class HAW_hidden
{
  var $name;
  var $value;

  /**
    Constructor
    @param name Variable in which "value" sent to the destination URL.
    @param value See name.
  */
  function HAW_hidden($name, $value)
  {
    $this->name = $name;
    $this->value = $value;
  }

  function get_name()
  {
    return $this->name;
  }

  function get_value()
  {
    return $this->value;
  }

  function get_elementtype()
  {
    return HAW_HIDDEN;
  }

  function create(&$deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create hidden HTML field

      printf("<input type=\"hidden\" name=\"%s\" value=\"%s\">\n",
              $this->name, $this->value);
    }
      // not necessary in WML!
  }
};






/**
  This class provides a submit button in a HAW_form object.
  One HAW_form object can contain only one HAW_submit object.
  <p><b>Examples:</b><p>
  $mySubmit = new HAW_submit("Submit");<br>
  $mySubmit = new HAW_submit("Submit", "user_pressed");
  @see HAW_form
*/
class HAW_submit
{
  var $label;
  var $name;

  /**
    Constructor
    @param label What's written on the button.
    @param name (optional)<br>
       Variable in which "label" is sent to the destination URL.
  */
  function HAW_submit($label, $name="")
  {
    $this->label = $label;
    $this->name = $name;
  }

  function get_name()
  {
    return $this->name;
  }

  function get_label()
  {
    return $this->label;
  }

  function get_elementtype()
  {
    return HAW_SUBMIT;
  }

  function create(&$deck, $getvar, $url)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create submit button in HTML

      if ($this->name != "")
        $name = "name=\"" . "$this->name" ."\"";

      printf("<input type=\"submit\" %s value=\"%s\"><br>\n", $name,
            HAW_specchar($this->label, $deck));
    }
    else
    {
      // determine querystring for both WML and HDML

      while (list($key, $val) = each($getvar))
        $query_string .= $val . "=$(" . $val . ")&amp;";

      if ($this->name != "")
        $query_string .= $this->name . "=" . urlencode($this->label);

      if (substr($query_string, -5) == "&amp;")
        $query_string = substr($query_string, 0, strlen($query_string)-5);

      // replace '&' character in URL with '&amp;'
      $url = ereg_replace("&", "&amp;", $url);

      if ($deck->ml == HAW_WML)
      {
        if ($deck->owgui_1_3)
          // create <do type="button"> sequence for Openwave GUI extensions WML 1.3
          printf("<do type=\"button\" label=\"%s\">\n",
                  HAW_specchar($this->label, $deck));
        else
          // create <do type="accept"> sequence in normal WML
          printf("<do type=\"accept\" label=\"%s\">\n",
                  HAW_specchar($this->label, $deck));

        if (strchr($url,"?"))
          printf("<go href=\"%s&amp;%s\">\n", $url, $query_string);
        else
          printf("<go href=\"%s?%s\">\n", $url, $query_string);

        echo "</go>\n";
        echo "</do>\n";
      }
      elseif ($deck->ml == HAW_HDML)
      {
        // store info for final card in HDML card set

        if (strchr($url,"?"))
          $action = sprintf("<action type=\"accept\" label=\"%s\" task=\"go\" dest=\"%s&amp;%s\">\n",
                             HAW_specchar($this->label, $deck),
                             $url, $query_string);
        else
          $action = sprintf("<action type=\"accept\" label=\"%s\" task=\"go\" dest=\"%s?%s\">\n",
                             HAW_specchar($this->label, $deck),
                             $url, $query_string);

        $deck->hdmlcardset->set_final_action($action);
      }
    }
  }
};






/**
  This class provides a link in a HAW_deck object.
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck(...);<br>
  ...<br>
  $myLink = new HAW_link("Continue","/mynextpage.wml");<br>
  $myPage->add_link($myLink);
  @see HAW_deck
  @see HAW_linkset
*/
class HAW_link
{
  var $label;
  var $url;
  var $title;
  var $accesskey;

  /**
    Constructor
    @param label Describes the link on the surfer's screen/display.
    @param url Next destination address.
    @param title (optional)<br>If a string is provided here, it will be displayed
       in the HTML browser status bar during "MouseOver", respectively somewhere
       on the WAP display. In order to work well with a broad range of user agents,
       keep your title under 6 characters.
  */
  function HAW_link($label, $url, $title="")
  {
    $this->label = $label;
    $this->url = $url;
    $this->title = $title;
    $this->accesskey = HAW_NO_ACCESSKEY; // no accesskey assigned
                                         // can be assigned later from HAW_linkset object if required
  }

  function get_url()
  {
    return $this->url;
  }

  function get_label()
  {
    return $this->label;
  }

  function get_title()
  {
    return $this->title;
  }

  function get_accesskey()
  {
    return $this->accesskey;
  }

  function get_elementtype()
  {
    return HAW_LINK;
  }

  function set_accesskey($accesskey)
  {
    if (($accesskey>0) && ($accesskey<10))
      $this->accesskey = $accesskey;
  }

  function create(&$deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      // create link in HTML

      if ($this->title && !$deck->avantgostyle && !$deck->iModestyle)
        $title_option = sprintf(" onmouseover=\"self.status='%s';return true;\"",
                                HAW_specchar($this->title, $deck));

      if ($deck->iModestyle && ($this->accesskey != HAW_NO_ACCESSKEY))
        $accesskey_option = sprintf(" accesskey=\"%d\"", $this->accesskey);

      printf("<a href=\"%s\"%s%s>%s</a><br clear=all>\n",
             HAW_specchar($this->url, $deck), $title_option, $accesskey_option,
             HAW_specchar($this->label, $deck));
    }

    elseif ($deck->ml == HAW_WML)
    {
      // create link in WML

      if ($this->title)
        $title_option = sprintf(" title=\"%s\"",
                                 HAW_specchar($this->title, $deck));

      printf("<a%s href=\"%s\">%s</a><br/>\n",
             $title_option, HAW_specchar($this->url, $deck),
             HAW_specchar($this->label, $deck));
    }

    elseif ($deck->ml == HAW_HDML)
    {
      // create link in HDML

      if ($this->title)
        $title_option = sprintf(" label=\"%s\"",
                                 HAW_specchar($this->title, $deck));

      if ($this->accesskey != HAW_NO_ACCESSKEY)
        $accesskey_option = sprintf(" accesskey=\"%d\"", $this->accesskey);

      $content = sprintf("<a task=\"go\" dest=\"%s\"%s%s>%s</a><br>\n",
                          HAW_specchar($this->url, $deck),
                          $title_option, $accesskey_option,
                          HAW_specchar($this->label, $deck));

      $deck->hdmlcardset->add_display_content($content);
    }

  }
};






/**
  This class provides a phone number in a HAW_deck object. User of WAP, HDML and
  i-Mode devices can establish a voice connection to the specified number. In WML
  a "WTAI link" will be created.<br>
  Please note that not all WAP device are supporting WTAI.
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck(...);<br>
  ...<br>
  $myPhone = new HAW_phone("123-45678", "CALL");<br>
  $myPage->add_phone($myPhone);
  @see HAW_deck
*/
class HAW_phone
{
  var $label;
  var $number;
  var $title;

  /**
    Constructor
    @param phone_number Phone number to dial.
    @param title (optional)<br>If a string is provided here, the call button on a
       WAP/HDML device will be entitled. In order to work well with a broad range
       of user agents, keep your title under 6 characters.
  */
  function HAW_phone($phone_number, $title="")
  {
    $this->label = $phone_number;
    $this->number = ereg_replace("[^+0-9]", "", $phone_number);
    $this->title = $title;
  }

  function get_elementtype()
  {
    return HAW_PHONE;
  }

  function create($deck)
  {
    if ($deck->ml == HAW_HTML)
    {
      if ($deck->iModestyle)
        // create phoneto: link for i-Mode
        printf("<a href=\"phoneto:%s\">%s</a><br clear=all>",
                $this->number, $this->label);
      else
        // create phone number as plain text
        printf("<code><big>%s</big></code><br clear=all>\n", $this->label);
    }
    elseif ($deck->ml == HAW_WML)
    {
      // create phone number in WML

      if ($this->title)
        $title_option = sprintf(" title=\"%s\"",
                                 HAW_specchar($this->title, $deck));

      printf("<a%s href=\"wtai://wp/mc;%s\">%s</a><br/>\n", $title_option,
              ereg_replace("[+]", "%2B", $this->number), $this->label);
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // create phone number in HDML

      if ($this->title)
        $title_option = sprintf(" label=\"%s\"",
                                 HAW_specchar($this->title, $deck));

      $content = sprintf("<a task=\"call\" number=\"%s\"%s>%s</a><br>\n",
                          $this->number, $title_option, $this->label);

      $deck->hdmlcardset->add_display_content($content);
    }
  }
};






/**
  This class defines a set of links. The links have to be defined as seperate
  HAW_link objects and are attached to the linkset with a special "add_link" function.
  For WAP devices browser-dependent WML code will be created. On all UP-browser-based
  WAP devices linksets allow easier navigation through WML decks by using the "onpick"
  WML option and therefore are improving the "usability" of an application. Instead of
  painfully navigating through the links "sports->football->results->today" the mobile
  user e.g. can press "2431" on the keypad to enter his favorite deck. For all other
  WAP devices normal &lt;a&gt; tags are created. One HAW_deck object can contain only
  one linkset object.
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck(...);<br>
  ...<br>
  $myLinkset = new HAW_linkset();<br>
  $myLink1 = new HAW_link("Phonebook", "/wap/phonebook.wml");<br>
  $myLinkset->add_link($myLink1);<br>
  $myLink2 = new HAW_link("DateBook", "/wap/datebook.wml");<br>
  $myLinkset->add_link($myLink2);<br>
  ...<br>
  $myPage->add_linkset($myLinkset);<br>
  ...<br>
  $myPage->create_page();
  @see HAW_link
  @see HAW_deck
*/
class HAW_linkset
{
  var $element;
  var $number_of_elements;


  /**
    Constructor
  */
  function HAW_linkset()
  {
    $this->number_of_elements = 0;
  }


  /**
    Adds a HAW_link object to HAW_linkset
    @param link Some HAW_link object.
    @see HAW_link
  */
  function add_link(&$link)
  {
    if (!is_object($link))
      die("invalid argument in add_link()");

    $link->set_accesskey($this->number_of_elements + 1);

    $this->element[$this->number_of_elements] = $link;

    $this->number_of_elements++;
  }

  function get_elementtype()
  {
    return HAW_LINKSET;
  }

  function create(&$deck)
  {
    if ($this->number_of_elements > 0)
    {
      if ($deck->ml == HAW_HTML)
      {
        // create linkset in HTML

        if ($deck->pureHTML)
        {
          // create links inside a table for big-screen HTML
          echo "<table border cellpadding=\"4\"><tr><td>\n";

          // repeat size and face declarations in table element
          if ($deck->size)
            // set the font size for all characters in the table element
            $size = " size=\"" . $deck->size . "\"";
  
          if ($deck->face)
            // set the font for all characters in the table element
            $face = " face=\"" . $deck->face . "\"";

          printf("<font%s%s>\n", $size, $face);

          while (list($key, $val) = each($this->element))
            $val->create($deck);

          echo "</font></td></tr></table>\n";
        }
        else
          // create normal links for the small devices
          while (list($key, $val) = each($this->element))
            $val->create($deck);
      }

      elseif ($deck->ml == HAW_WML)
      {
        // create linkset in WML

        if ($deck->upbrowser)
        {
          echo "<select>\n";
  
          while (list($key, $val) = each($this->element))
          {
            if ($val->get_title())
              $title = " title=\"" . HAW_specchar($val->get_title(), $deck) . "\"";
  
            printf("<option onpick=\"%s\"%s>%s</option>\n",
                   HAW_specchar($val->get_url(), $deck), $title,
                   HAW_specchar($val->get_label(), $deck));
          }
  
          echo "</select>\n";
        }
        else
          // create normal WML links for non-UP-based WAP devices
          while (list($key, $val) = each($this->element))
            $val->create($deck);
      }

      elseif ($deck->ml == HAW_HDML)
      {
        // create linkset in HDML

        while (list($key, $val) = each($this->element))
          $val->create($deck);
      }
    }
  }
};






/*
  Undocumented class for raw markup insertion - For test only!
*/
class HAW_raw
{
  var $ml;
  var $code;

  /**
    Constructor
    @param ml Markup language (HAW_HTML, HAW_WML, HAW_HDML).
    @param code Some markup code to be inserted for the selected markup language<br>
                Note: Using this class is for meant for test purposes only. Inproper usage
                can result in highly incompatible applications.
  */
  function HAW_raw($ml,$code)
  {
    $this->ml = $ml;
    $this->code = $code;
  }

  function get_elementtype()
  {
    return HAW_RAW;
  }

  function create($deck)
  {
    if ($deck->ml == $this->ml)
      echo($this->code);
  }
};






/**
  This class provides a banner in a HAW_deck object (HTML only).
  <p><b>Examples:</b><p>
  $myPage = new HAW_deck(...);<br>
  ...<br>
  $myBanner1 = new HAW_banner("http://wwww.adpartner1.org/images/adp1.gif", "http://www.adpartner1.org/", "Welcome at adpartner1!");<br>
  $myPage->add_banner($myBanner1);<br>
  ...<br>
  $myBanner2 = new HAW_banner("http://wwww.adpartner2.org/images/adp2.gif", HAW_NOLINK, "Buy products of adpartner2!");<br>
  $myBanner2->set_size(300,50);<br>
  $myBanner2->set_br(0);<br>
  $myPage->add_banner($myBanner2,HAW_TOP);
  @see HAW_deck
*/
class HAW_banner
{
  var $image;
  var $url;
  var $alt;
  var $width = -1;
  var $height = -1;
  var $br = 1;

  /**
    Constructor
    @param image Your ad-partners banner in .gif, .jpg or any other HTML compatible format.
    @param url Link to your ad-partner (or HAW_NOLINK if no link available)
    @param alt Alternative text for the banner
  */
  function HAW_banner($image, $url, $alt)
  {
    $this->image = $image;
    $this->url = $url;
    $this->alt = $alt;
  }

  /**
    Sets explicitely the size of a banner<br>
    Note: Use of this function is not mandatory but will accelerate page set-up
    @param width Width of banner in pixels.
    @param height Height of banner in pixels.
  */
  function set_size($width, $height)
  {
    if (!is_int($width) || ($width < 1) || !is_int($height) || ($height < 1))
      die("invalid argument in set_size()");

    $this->width = $width;
    $this->height = $height;
  }

  /**
    Sets the number of line breaks (CRLF) after banner. (default: 1)
    @param br Some number of line breaks.
  */
  function set_br($br)
  {
    if (!is_int($br) || ($br < 0))
      die("invalid argument in set_br()");

    $this->br = $br;
  }


  function create()
  {
    if ($this->url != HAW_NOLINK)
      // banner links to url
      echo "<a href=\"$this->url\" target=\"_blank\">";

    if (($this->width>0) && ($this->height>0))
      // prepare this variable only if size info available
      $size = sprintf(" width=%d height=%d", $this->width, $this->height);

    printf("<img src=\"%s\" alt=\"%s\"%s hspace=10 vspace=10 border=0>",
           $this->image, $this->alt, $size);

    if ($this->url != HAW_NOLINK)
      // close <a> tag
      echo "</a>\n";

    for ($i=0; $i<$this->br; $i++)
      // create required number of line breaks
      echo "<br>\n";
  }
};






/**
  This class will cause a (hawrizontal) rule to be drawn across the screen.
  You can use it to seperate text paragraphs in HAW_deck or HAW_form objects.
  <p><b>Examples:</b><p>
  $myDefaultRule = new HAW_rule();<br>
  $mySpecialRule = new HAW_rule("60%", 4);<br>
  ...<br>
  $myPage->add_rule($myDefaultRule)<br>;
  ...<br>
  $myPage->add_rule($mySpecialRule);
  @see HAW_deck
  @see HAW_form
*/
class HAW_rule
{
  var $width;
  var $size;


  /**
    Constructor
    @param width (optional)<br>Percentage of screen width or absolute value in
           number of pixels (e.g. "50%", 100).
    @param size (optional)<br>Height of the line to be drawn in pixels.
  */
  function HAW_rule($width="", $size="")
  {
    $this->width = $width;
    $this->size = $size;
  }


  function get_elementtype()
  {
    return HAW_RULE;
  }


  function create(&$deck)
  {
    if ($this->width)
      $width_option = " width=\"" . $this->width . "\"";

    if ($this->size)
      $size_option = " size=\"" . $this->size . "\"";

    if ($deck->ml == HAW_HTML)
      // draw horizontal row in HTML
      echo "<hr" . $width_option . $size_option . ">\n";

    elseif ($deck->ml == HAW_WML)
    {
      if ($deck->owgui_1_3)
        // WAP device accepts Openwave GUI extensions for WML 1.3
        echo "<hr" . $width_option . $size_option . "/>\n";
      else
        // WAP device does not understand <hr> tags
        // ==> draw some number of hyphens to create a rule
        echo "----------<br/>\n";
    }
    elseif ($deck->ml == HAW_HDML)
    {
      // HDML devices doesn't understand <hr>
      // ==> draw some number of hyphens to create a rule

      if ($deck->alignment == HAW_ALIGN_CENTER)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<center>\n");

      if ($deck->alignment == HAW_ALIGN_RIGHT)
        // repeat alignment in HDML for each paragraph
        $deck->hdmlcardset->add_display_content("<right>\n");

      $deck->hdmlcardset->add_display_content("----------\n<br>\n");
    }
  }
};

?>
