<?php
class Rate extends AppModel {

  var $name = 'Rate';
  var $displayField = 'name_rate';

  var $hasMany = array(

    'Client' => array(
      'className' => 'Client',
      'foreignKey' => 'rate_id',
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

    'Project' => array(
      'className' => 'Project',
      'foreignKey' => 'rate_id',
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
      'foreignKey' => 'rate_id',
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
      'rate' => array(
        'exists' => array(
          'method' => VALID_NOT_EMPTY,
          'message' => 'You must enter a rate.',
        ),
        'decimal' => array(
          'method' => VALID_DECIMAL,
          'message' => 'Rate must be a number with optional decimal places.',
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
    $client_names = '';
    if ($clients = $this->Client->findAll(array('Client.id'=>$this->id),array('Client.id'),null,null,null,-1))
    {
      foreach ($clients as $client)
      {
        $client_names .= $client['Client']['id'].', ';
      }
      $client_names = '<br/>Clients: '.substr($client_names,0,-2).'.';
    }
    $project_names = '';
    if ($projects = $this->Project->findAll(array('Project.id'=>$this->id),array('Project.id'),null,null,null,-1))
    {
      foreach ($projects as $project)
      {
        $project_names .= $project['Project']['id'].', ';
      }
      $project_names = '<br/>Projects: '.substr($project_names,0,-2).'.';
    }
    return true;
  }

  function afterFind($results)
  {
    if (isset($results[0]['Rate']) && isset($results[0]['Rate']['name']) && isset($results[0]['Rate']['rate']))
    {
      foreach ($results as $key => $val)
      {
        $results[$key]['Rate']['name_rate'] = $val['Rate']['name'] . ' ($' . $val['Rate']['rate'] . ')';
      }
    }
    return $results;
  }

}
?>