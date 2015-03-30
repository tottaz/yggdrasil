<?php

/**
 * This is a CakePHP helper to print calendar link for Mihai Bazon's JSCalendar.
 * @link http://www.dynarch.com/projects/calendar/
 *
 *  1. Download latest ver. of the calendar. If the website make your browser crash,
 *     use http://prdownloads.sourceforge.net/jscalendar/
 *  2. Create folder /app/webroot/js/jscalendar-1.0/ , unpack files there
 *  3. Create folder /app/vendors/jscalendar-1.0/ , move calendar.php there.
 *  4. Copy this file (calendar.php) into /app/views/helpers/ folder.
 *
 *  How to use:
 *  1. Add "Calendar" helper to your controller: $helpers = array('Html','Calendar');
 *  2. In your layout
 *
 *   echo $calendar->get_load_files_code();
 *   echo $calendar->input('Event/start_date');
 *
 *
 * @author Oleg Sverdlov <oleg AT ols.co.il>
 * @from 01/03/2006
 */
class CalendarHelper extends HtmlHelper
{

  var $cal;
  var $helpers = array('Head');
  // calendar options go here; see the documentation and/or calendar-setup.js
  var $cal_options = array('firstDay'       => 0, // show Sunday first
  'showsTime'      => true,
  'showOthers'     => true,
  'ifFormat'       => '%Y-%m-%d %H:%M',
  'timeFormat'     => '24');

  function get_load_files_code( $lang = 'en',$theme='calendar-blue',$stripped=false) {
    /**
        * @param $lang the language used for the calendar (see the lang/ dir)

        * @param $theme the theme file used for the calendar, without the ".css" extension

        * @param $stripped boolean that specifies if the "_stripped" files are to be loaded

        *        The stripped files are smaller as they have no whitespace and comments

        *     1. the absolute URL path to the calendar files

        *
        */

    vendor('jscalendar'.DS.'calendar');

    $path = $this->webroot.JS_URL.$this->themeWeb.'jscalendar/';
    $this->cal = new DHTML_Calendar( $path, $lang, $theme, $stripped );


    return $this->cal->get_load_files_code();

  }


  function input($fieldName, $htmlAttributes = null, $calAttrs = null, $return = false) {
    static $_id = 0;

    //
    $this->setFormTag($fieldName);

    if (is_array($calAttrs)) {
      foreach ($calAttrs as $k=>$v) {
        $this->cal_options[$k] = $v;
      }
    }

    if (!isset($htmlAttributes['value'])) {
      $htmlAttributes['value'] = $this->tagValue($fieldName);
    }

    $htmlAttributes['type'] = 'text';

    if (!isset($htmlAttributes['id']))
    {
      $htmlAttributes['id'] = $this->model.Inflector::camelize($this->field);
    }

    if ($this->tagIsInvalid($this->model, $this->field))
    {
      if (isset($htmlAttributes['class']) && trim($htmlAttributes['class']) != "")
      {
        $htmlAttributes['class'] .= ' form_error';
      }
      else
      {
        $htmlAttributes['class'] = 'form_error';
      }
    }

    // ---------------------------------------------------------------
    $tag = '<input name="data[%s][%s]" %s/>&nbsp;<a href="#" id="%s"><img align="middle" border="0" src="' . $this->cal->calendar_lib_path . 'cal.png" alt="[Calendar]" class="calendarimage" /></a>';

    $trigger_id = 'f-cal-'.$_id;
    $_id++;

    $this->cal_options['inputField']        = $htmlAttributes['id'];
    $this->cal_options['button']                = $trigger_id;

    $js_options = $this->cal->_make_js_hash($this->cal_options);

    $code  = "\n".'<script type="text/javascript">Calendar.setup({' .
    $js_options .
    '});</script>' ;

    return $this->output(
    sprintf( $tag
    , $this->model
    , $this->field
    , $this->_parseAttributes($htmlAttributes, null, ' ', ' ')
    , $trigger_id )
    , $return) . $code;
  }

}  // end of calendarHelper
?>