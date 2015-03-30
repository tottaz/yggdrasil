<?php
class Task extends AppModel {

  var $name = 'Task';

  var $belongsTo = array(

    'Rate' => array(
      'className' => 'Rate',
      'foreignKey' => 'rate_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

    'Client' => array(
      'className' => 'Client',
      'foreignKey' => 'client_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

    'Project' => array(
      'className' => 'Project',
      'foreignKey' => 'project_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

    'Type' => array(
      'className' => 'Type',
      'foreignKey' => 'type_id',
      'conditions' => '',
      'fields' => '',
      'order' => '',
      'counterCache' => ''
    ),

  );

  function loadValidation(){
    $this->validate = array(
      'client_id' => array(
        'required' => array(
          'method' => VALID_NOT_EMPTY,
          'message' => 'You must select a Client.',
        ),
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'client_id', 'model' => 'Client', 'conditions' => array('Client.id'=>$this->data[$this->name]['client_id'])),
          'message' => 'The Project you selected does not exist.',
        ),
      ),
      'project_id' => array(
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'project_id', 'model' => 'Project', 'conditions' => array('Project.id'=>$this->data[$this->name]['project_id'])),
          'message' => 'The Project you selected does not exist.',
        ),
        'subexists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'project_id', 'model' => 'Project', 'conditions' => array('Project.id'=>$this->data[$this->name]['project_id'],'Project.client_id'=>$this->data[$this->name]['client_id'])),
          'message' => 'The Project you selected does not exist.',
        ),
      ),
      'type_id' => array(
        'required' => array(
          'method' => VALID_NOT_EMPTY,
          'message' => 'You must select a Type.',
        ),
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'type_id', 'model' => 'Type', 'conditions' => array('Type.id'=>$this->data[$this->name]['type_id'])),
          'message' => 'The Type you selected does not exist.',
        ),
      ),
      'rate_id' => array(
        'exists' => array(
          'method' => 'validateExists',
          'parameters' => array('var' => 'rate_id', 'model' => 'Rate', 'conditions' => array('Rate.id'=>$this->data[$this->name]['rate_id'])),
          'message' => 'The Rate you selected does not exist.',
        ),
      ),
      'time_start' => array(
        'datetime' => array(
          'method' => VALID_DATETIME,
          'message' => 'The Start Time you entered is invalid.',
        ),
      ),
      'time_end' => array(
        'datetime' => array(
          'method' => VALID_DATETIME,
          'message' => 'The End Time you entered is invalid.',
        ),
      ),
      'amount' => array(
        'required' => array(
          'method' => VALID_DECIMAL,
          'message' => 'The Amount must be a number with optional decimal places.',
        ),
      ),
    );
  }

  function beforeSave()
  {
    $this->blankToNull('rate_id');
    $this->blankToNull('time_end');
    return true;
  }

}
?>