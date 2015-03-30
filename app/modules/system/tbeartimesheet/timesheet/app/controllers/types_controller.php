<?php
class TypesController extends AppController {

  var $name = 'Types';

  function index()
  {
    $conditions = $this->Search->init(array('Type.name'=>'Name'),$this->namedArgs);
    list($order,$limit,$page) = $this->Pagination->init($conditions,$this->namedArgs);
    $this->Type->recursive = 0;
    $this->set('types', $this->Type->findAll($conditions,null,$order,$limit,$page));
  }

  function view($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Type ID.');
      $this->redirect('/types/index');
    }
    $this->set('type', $this->Type->read(null, $id));
  }

  function form($id = null)
  {
    if (empty($this->data))
    {
      if ($id)
      {
        $this->data = $this->Type->read(null, $id);
      }
    }
    else
    {
      $this->cleanUpFields();
      $this->Type->begin();
      if ($this->Type->save($this->data))
      {
        $this->Type->commit();
        $this->Session->setFlash('The Type has been saved.');
        $this->redirect('/types/view/'.$this->Type->id);
      }
      else
      {
        $this->Type->rollback();
        $this->Session->setFlash('Please correct the errors below.');
      }
    }
  }

  function delete($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Type ID.');
      $this->redirect('/types/index');
    }
    try
    {
      $this->Type->begin();
      if ($this->Type->del($id))
      {
        $this->Type->commit();
        $this->Session->setFlash('Type ID '.$id.' has been deleted.');
        $this->redirect('/types/index');
      }
      else
      {
        $this->Type->rollback();
        $this->Session->setFlash('Type ID '.$id.' could not be deleted.');
        $this->redirect('/types/index');
      }
    }
    catch (Exception $e)
    {
      $this->Type->rollback();
      $this->Session->setFlash('Type ID '.$id.' could not be deleted because:<br>'.$e->getMessage());
      $this->redirect('/types/index');
    }
  }

}
?>