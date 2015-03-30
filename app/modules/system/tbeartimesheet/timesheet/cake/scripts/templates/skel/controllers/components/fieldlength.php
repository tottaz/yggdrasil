<?php
class FieldlengthComponent extends Object
{
  var $controller = true;
  var $ignoreModels = array('App','Page','Report');

  function startup(&$controller)
  {
    $this->controller = &$controller;
    $controllerClass = $this->controller->name;
    $modelClass = $this->controller->modelClass;

    if (in_array($modelClass,$this->ignoreModels))
    {
      return false;
    }

    if (!$fieldLengths = cache('fieldlengths'.DS.$modelClass))
    {
      $cols = $this->controller->$modelClass->query('DESC ' . $this->controller->$modelClass->table);
      foreach ($cols as $column) {
        if (isset($column['COLUMNS'])) {
          if (preg_match('/^(?!.*int).*(?:[(]([0-9]+(?:,[0-9]+)?)[)])$/', $column['COLUMNS']['Type'], $regs))
          {
            $fieldLengths[$column['COLUMNS']['Field']] = $regs[1];
          }
          elseif (strpos($column['COLUMNS']['Type'],'date')!==false)
          {
            $fieldLengths[$column['COLUMNS']['Field']] = 'date';
          }
        }
      }
      $fieldLengths = CACHE_CHECK ? cache('fieldlengths'.DS.$modelClass, serialize($fieldLengths)) : serialize($fieldLengths);
    }
    $this->controller->set('field_lengths', unserialize($fieldLengths));
  }
}
?>