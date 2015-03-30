<?php
uses('Sanitize');
class TasksController extends AppController {

  var $name = 'Tasks';
  var $helpers = array('Calendar');

  function index()
  {
    $conditions = $this->Search->init(array('Task.name'=>'Name'),$this->namedArgs);
    if (isset($this->namedArgs['date_start']))
    {
      $conditions[] = array('time_end'=>'>='.Sanitize::paranoid($this->namedArgs['date_start'],array(' ','-',':')));
    }
    if (isset($this->namedArgs['date_end']))
    {
      $conditions[] = array('time_end'=>'<'.Sanitize::paranoid($this->namedArgs['date_end'],array(' ','-',':')));
    }
    $this->Pagination->direction = 'DESC';
    list($order,$limit,$page) = $this->Pagination->init($conditions,$this->namedArgs);
    $this->Task->recursive = 0;
    $this->set('tasks', $this->Task->findAll($conditions,array('*','TIMEDIFF(Task.time_end,Task.time_start) AS time'),$order,$limit,$page));
  }

  function view($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Task ID.');
      $this->redirect('/tasks/index');
    }
    $this->set('task', $this->Task->read(null, $id));
  }

  function form($id = null)
  {
    if (empty($this->data))
    {
      if ($id)
      {
        $this->data = $this->Task->read(null, $id);
      }
    }
    else
    {
      $this->cleanUpFields();
      $this->Task->begin();
      if ($this->Task->save($this->data))
      {
        $this->Task->commit();
        $this->Session->setFlash('The Task has been saved.');
        $this->redirect('/tasks/view/'.$this->Task->id);
      }
      else
      {
        $this->Task->rollback();
        $this->Session->setFlash('Please correct the errors below.');
      }
    }
    $this->set('clients', $this->Task->Client->generateList(null, 'Client.name'));
    $this->set('projects', (isset($this->data['Task']['client_id']) && $this->data['Task']['client_id']) ? $this->Task->Project->generateList(array('client_id'=>$this->data['Task']['client_id']),'Project.name') : array());
    $this->set('types', $this->Task->Type->generateList(null, 'Type.name'));
    $this->set('rates', $this->Task->Rate->generateList(null, 'Rate.rate'));
  }

  function delete($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Task ID.');
      $this->redirect('/tasks/index');
    }
    try
    {
      $this->Task->begin();
      if ($this->Task->del($id))
      {
        $this->Task->commit();
        $this->Session->setFlash('Task ID '.$id.' has been deleted.');
        $this->redirect('/tasks/index');
      }
      else
      {
        $this->Task->rollback();
        $this->Session->setFlash('Task ID '.$id.' could not be deleted.');
        $this->redirect('/tasks/index');
      }
    }
    catch (Exception $e)
    {
      $this->Task->rollback();
      $this->Session->setFlash('Task ID '.$id.' could not be deleted because:<br>'.$e->getMessage());
      $this->redirect('/tasks/index');
    }
  }

  function ajaxUpdateProject()
  {
    $this->set('projects', $this->Task->Project->generateList(array('client_id'=>$this->data['Task']['client_id'])));
    $this->render('form_project', 'ajax');
  }

  function ajaxUpdateRate()
  {
    if (isset($this->data['Task']['project_id']))
    {
      $this->data['Task']['rate_id'] = $this->Task->Project->field('Project.rate_id',array('Project.id'=>$this->data['Task']['project_id']));
    }
    if (isset($this->data['Task']['client_id']))
    {
      $this->data['Task']['rate_id'] = $this->Task->Client->field('Client.rate_id',array('Client.id'=>$this->data['Task']['client_id']));
    }
    $this->set('rates', $this->Task->Rate->generateList(null, 'Rate.rate'));
    $this->render('form_rate', 'ajax');
  }

  function ajaxUpdateSuggested()
  {
    $suggested = null;
    if ($this->data['Task']['time_start'] && $this->data['Task']['time_end'] && $this->data['Task']['rate_id'])
    {
      $rate = $this->Task->Rate->field('Rate.rate',array('Rate.id'=>$this->data['Task']['rate_id']));
      $rate_per_second = $rate / 60 / 60;
      $start_time = strtotime($this->data['Task']['time_start']);
      $end_time = strtotime($this->data['Task']['time_end']);
      $time = $end_time - $start_time;
      $suggested['amount'] = $time * $rate_per_second;
      if ($time > 86400)
      {
        $suggested['time'] = date('j G:i',$time-122400);
      }
      else
      {
        $suggested['time'] = date('G:i',$time-122400);
      }
    }
    $this->set('suggested',$suggested);
    $this->render('form_suggested', 'ajax');
  }

}
?>