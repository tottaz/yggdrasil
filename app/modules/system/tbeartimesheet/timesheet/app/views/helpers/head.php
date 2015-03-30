<?php
class HeadHelper extends Helper
{
  var $helpers=array('html','javascript');

  var $_library; //static array of files to be included

  function __construct()
  {
    static $library;  //for php4 compat
    $this->_library=& $library;
    $this->_library=array();
  }

  /**
   * Adds a javascript file to array
   * @param string $file File to be included
   * @param type $type css | js
   */
  function register($file,$type)
  {
    if (!in_array($type,array('css','js')))
    {
      die("HeadHelper: Incorrect type: $type");
    }
    if (! in_array(array($file,$type),$this->_library))
    {
      $this->_library[]=array($file,$type);
    }

  }

  /**
   * Creates all the links to the files registered
   * @return string
   */
  function print_registered()
  {
    foreach ($this->_library as $l)
    {
      $file=$l[0];
      $type=$l[1];
      switch ($type)
      {
        case 'css':
          echo $this->html->css($file);
          break;
        case 'js':
          echo $this->javascript->link($file);
          break;
      }
    }
  }
}
?>
