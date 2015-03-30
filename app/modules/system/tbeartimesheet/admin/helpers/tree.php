<?php
class TreeHelper extends Helper
{
  var $helpers=array('Html', 'Link');
  var $rowFormat;

  function show($name, $data, $type='list')
  {
    list($modelName, $fieldName) = explode('/', $name);

    switch ($type)
    {
      case 'table':
        $this->rowFormat = 'odd';
        $output  = '<table cellpadding="0" cellspacing="0" class="data">'."\n";
        $output .= '  <tr>'."\n";
        $output .= '    <th>ID</th>'."\n";
        $output .= '    <th>Name</th>'."\n";
        $output .= '    <th>Actions</th>'."\n";
        $output .= '  </tr>'."\n";
        $output .= $this->tableElement($data, $modelName, $fieldName, 0);
        $output .= '</table>'."\n";
        break;
      case 'select':
        $output = $this->selectElement($data, $modelName, $fieldName, 0);
        break;
      case 'list':
      default:
        $output = $this->listElement($data, $modelName, $fieldName, 0);
        break;
    }

    return $this->output($output);
  }

  function listElement($data, $modelName, $fieldName, $level)
  {
    $tabs = "\n" . str_repeat('  ', $level * 2);
    $li_tabs = $tabs . '  ';

    $output = $tabs. '<ul>';
    foreach ($data as $key=>$val)
    {
      $output .= $li_tabs . '<li>'.$val[$modelName][$fieldName];
      if(isset($val['children'][0]))
      {
        $output .= $this->listElement($val['children'], $modelName, $fieldName, $level+1);
        $output .= $li_tabs . '</li>';
      }
      else
      {
        $output .= '</li>';
      }
    }
    $output .= $tabs . '</ul>';

    return $output;
  }

  function selectElement($data, $modelName, $fieldName, $level)
  {
    $tabs = ' --|'.str_repeat(' --|', $level).' ';

    foreach ($data as $key=>$val)
    {
      $output[$val[$modelName]['id']] = $tabs.$val[$modelName][$fieldName];
      if(isset($val['children'][0]))
      {
        $children = $this->selectElement($val['children'], $modelName, $fieldName, $level+1);
        foreach ($children as $child_id=>$child)
        {
          $output[$child_id] = $child;
        }
      }
    }

    return $output;
  }

  function tableElement($data, $modelName, $fieldName, $level)
  {
    $tabs = ' --|'.str_repeat(' --|', $level).' ';
    $output = '';
    foreach ($data as $key=>$val)
    {
      $style = ($this->rowFormat=='even') ? 'even' : 'odd';
      $output .= '  <tr class="'.$style.'">'."\n";
      $output .= '    <td>'.$val[$modelName]['id'].'</td>'."\n";
      $output .= '    <td><div align="left">'.$tabs.$val[$modelName][$fieldName].'</div></td>'."\n";
      $output .= '    <td nowrap>';
      $output .= '      '.$this->Html->link($this->Html->Image('action/view.png', array('alt'=>'View','title'=>'View')), $this->Link->getLink('/categories/view/' . $val[$modelName]['id']), null, null, false)."\n";
      $output .= '      '.$this->Html->link($this->Html->Image('action/edit.png', array('alt'=>'Edit','title'=>'Edit')), $this->Link->getLink('/categories/form/' . $val[$modelName]['id']), null, null, false)."\n";
      $output .= '      '.$this->Html->link($this->Html->Image('action/delete.png', array('alt'=>'Delete','title'=>'Delete')), $this->Link->getLink('/categories/delete/' . $val[$modelName]['id']), null, 'Are you sure you want to delete '. $modelName .' ID ' . $val[$modelName]['id'] . '?', false)."\n";
      $output .= '    </td>'."\n";
      $output .= '  </tr>'."\n";
      $this->rowFormat = $this->rowFormat=='odd' ? 'even' : 'odd';
      if(isset($val['children'][0]))
      {
        $output .= $this->tableElement($val['children'], $modelName, $fieldName, $level+1);
      }
    }

    return $output;
  }

}
?>