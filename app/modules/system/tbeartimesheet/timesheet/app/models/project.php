<?php
class Project extends AppModel {

  var $name = 'Project';

  var $belongsTo = array(

    'Client' => array(
      'className' => 'Client',
      'foreignKey' => 'client_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

    'Rate' => array(
      'className' => 'Rate',
      'foreignKey' => 'rate_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

  );

  var $hasMany = array(

    'Task' => array(
      'className' => 'Task',
      'foreignKey' => 'project_id',
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
      'client_id' => array(
        'required' => array(
          'method' => VALID_NOT_EMPTY,
          'message' => 'You must select a Client.',
        ),
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'client_id', 'model' => 'Client', 'conditions' => array('Client.id'=>$this->data[$this->name]['client_id'])),
          'message' => 'The Client you selected does not exist.',
        ),
      ),
      'rate_id' => array(
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'rate_id', 'model' => 'Rate', 'conditions' => array('Rate.id'=>$this->data[$this->name]['rate_id'])),
          'message' => 'The Rate you selected does not exist.',
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