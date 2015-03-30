<?php
class Client extends AppModel {

  var $name = 'Client';

  var $belongsTo = array(

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

    'Project' => array(
      'className' => 'Project',
      'foreignKey' => 'client_id',
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

    'Task' => array(
      'className' => 'Task',
      'foreignKey' => 'client_id',
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
    $project_names = '';
    if ($projects = $this->Project->findAll(array('Project.id'=>$this->id),array('Project.id'),null,null,null,-1))
    {
      foreach ($projects as $project)
      {
        $project_names .= $project['Project']['id'].', ';
      }
      $project_names = '<br/>Projects: '.substr($project_names,0,-2).'.';
    }
    $task_names = '';
    if ($tasks = $this->Task->findAll(array('Task.id'=>$this->id),array('Task.id'),null,null,null,-1))
    {
      foreach ($tasks as $task)
      {
        $task_names .= $task['Task']['id'].', ';
      }
      $taks_names = '<br/>Tasks: '.substr($task_names,0,-2).'.';
    }
    return true;
  }

}
?>