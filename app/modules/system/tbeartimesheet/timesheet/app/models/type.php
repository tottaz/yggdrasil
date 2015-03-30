<?php
class Type extends AppModel {

  var $name = 'Type';

  var $hasMany = array(

    'Task' => array(
      'className' => 'Task',
      'foreignKey' => 'type_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'limit' => '',
      'offset' => '',
      'dependent' => '',
      'exclusive' => '',
      'finderQuery' => '',
      'counterQuery' => ''
    ),

  );

  function loadValidation(){
    $this->validate = array(
      'name' => array(
        'required' => array(
          'method' => VALID_NOT_EMPTY,
          'message' => 'You must enter a Name.',
        ),
      ),
    );
  }

  function beforeDelete()
  {
    $task_names = '';
    if ($tasks = $this->Task->findAll(array('Task.id'=>$this->id),array('Task.id'),null,null,null,-1))
    {
      foreach ($tasks as $task)
      {
        $task_names .= $task['Task']['id'].', ';
      }
      $task_names = '<br/>Tasks: '.substr($task_names,0,-2).'.';
    }
    return true;
  }

}
?>