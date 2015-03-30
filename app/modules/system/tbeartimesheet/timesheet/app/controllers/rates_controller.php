<?php
class RatesController extends AppController {

  var $name = 'Rates';

  function index()
  {
    $conditions = $this->Search->init(array('Rate.name'=>'Name'),$this->namedArgs);
    $this->Pagination->sortBy = 'rate';
    list($order,$limit,$page) = $this->Pagination->init($conditions,$this->namedArgs);
    $this->Rate->recursive = 0;
    $this->set('rates', $this->Rate->findAll($conditions,null,$order,$limit,$page));
  }

  function view($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Rate ID.');
      $this->redirect('/rates/index');
    }
    $this->set('rate', $this->Rate->read(null, $id));
  }

  function form($id = null)
  {
    if (empty($this->data))
    {
      if ($id)
      {
        $this->data = $this->Rate->read(null, $id);
      }
    }
    else
    {
      $this->cleanUpFields();
      $this->Rate->begin();
      if ($this->Rate->save($this->data))
      {
        $this->Rate->commit();
        $this->Session->setFlash('The Rate has been saved.');
        $this->redirect('/rates/view/'.$this->Rate->id);
      }
      else
      {
        $this->Rate->rollback();
        $this->Session->setFlash('Please correct the errors below.');
      }
    }
  }

  function delete($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Rate ID.');
      $this->redirect('/rates/index');
    }
    try
    {
      $this->Rate->begin();
      if ($this->Rate->del($id))
      {
        $this->Rate->commit();
        $this->Session->setFlash('Rate ID '.$id.' has been deleted.');
        $this->redirect('/rates/index');
      }
      else
      {
        $this->Rate->rollback();
        $this->Session->setFlash('Rate ID '.$id.' could not be deleted.');
        $this->redirect('/rates/index');
      }
    }
    catch (Exception $e)
    {
      $this->Rate->rollback();
      $this->Session->setFlash('Rate ID '.$id.' could not be deleted because:<br>'.$e->getMessage());
      $this->redirect('/rates/index');
    }
  }

}
?>