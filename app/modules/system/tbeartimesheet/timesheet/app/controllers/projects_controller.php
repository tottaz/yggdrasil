<?php
class ProjectsController extends AppController {

  var $name = 'Projects';

  function index()
  {
    $conditions = $this->Search->init(array('Project.name'=>'Name'),$this->namedArgs);
    list ($order,$limit,$page) = $this->Pagination->init($conditions,$this->namedArgs);
    $this->Project->recursive = 0;
    $this->set('projects', $this->Project->findAll($conditions, null, $order, $limit, $page));
  }

  function view($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Project ID.');
      $this->redirect('/projects/index');
    }
    $this->set('project', $this->Project->read(null, $id));
  }

  function form($id = null)
  {
    if (empty($this->data))
    {
      if ($id)
      {
        $this->data = $this->Project->read(null, $id);
      }
    }
    else
    {
      $this->cleanUpFields();
      $this->Project->begin();
      if ($this->Project->save($this->data))
      {
        $this->Project->commit();
        $this->Session->setFlash('The Project has been saved.');
        $this->redirect('/projects/view/'.$this->Project->id);
      }
      else
      {
        $this->Project->rollback();
        $this->Session->setFlash('Please correct the errors below.');
      }
    }
    $this->set('clients', $this->Project->Client->generateList(null, 'Client.name'));
    $this->set('rates', $this->Project->Rate->generateList(null, 'Rate.rate'));
  }

  function delete($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Project ID.');
      $this->redirect('/projects/index');
    }
    try
    {
      $this->Project->begin();
      if ($this->Project->del($id))
      {
        $this->Project->commit();
        $this->Session->setFlash('Project ID '.$id.' has been deleted.');
        $this->redirect('/projects/index');
      }
      else
      {
        $this->Project->rollback();
        $this->Session->setFlash('Project ID '.$id.' could not be deleted.');
        $this->redirect('/projects/index');
      }
    }
    catch (Exception $e)
    {
      $this->Project->rollback();
      $this->Session->setFlash('Project ID '.$id.' could not be deleted because:<br>'.$e->getMessage());
      $this->redirect('/projects/index');
    }
  }

  function ajaxUpdateRate()
  {
    $this->data['Project']['rate_id'] = $this->Project->Client->field('Client.rate_id',array('Client.id'=>$this->data['Project']['client_id']));
    $this->set('rates', $this->Project->Rate->generateList(null, 'Rate.rate'));
    $this->render('form_rate', 'ajax');
  }

}
?>