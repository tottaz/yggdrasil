<?php
class TooltipHelper extends Helper
{
  var $helpers=array('Html','Head');

  var $css='tooltip/Tooltip';
  var $js='tooltip/Tooltip';

  function show($header,$content)
  {
    $this->Head->register('tooltip/Tooltip' , 'js');
    $this->Head->register('tooltip/Tooltip' , 'css');
    $output = '';
    $output .= $this->Html->Image('tooltip/tooltip.png',array('alt'=>'tooltip'));
    $output .= '<div class="tooltip"><h1>'.$header.'</h1>'.$content.'</div>';
    return $output;
  }

}
?>
