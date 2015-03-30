<?php
class ClientsController extends AppController {

  var $name = 'Clients';

  function index()
  {
    $conditions = $this->Search->init(array('Client.name'=>'Name'),$this->namedArgs);
    list ($order,$limit,$page) = $this->Pagination->init($conditions,$this->namedArgs);
    $this->Client->recursive = 0;
    $this->set('clients', $this->Client->findAll($conditions, null, $order, $limit, $page));
  }

  function view($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Client ID.');
      $this->redirect('/clients/index');
    }
    $this->set('client', $this->Client->read(null, $id));
  }

  function form($id = null)
  {
    if (empty($this->data))
    {
      if ($id)
      {
        $this->data = $this->Client->read(null, $id);
      }
    }
    else
    {
      $this->cleanUpFields();
      $this->Client->begin();
      if ($this->Client->save($this->data))
      {
        $this->Client->commit();
        $this->Session->setFlash('The Client has been saved.');
        $this->redirect('/clients/view/'.$this->Client->id);
      }
      else
      {
        $this->Client->rollback();
        $this->Session->setFlash('Please correct the errors below.');
      }
    }
    $this->set('rates', $this->Client->Rate->generateList(null, 'Rate.rate'));
  }

  function delete($id = null)
  {
    if (!$id)
    {
      $this->Session->setFlash('Invalid Client ID.');
      $this->redirect('/clients/index');
    }
    try
    {
      $this->Client->begin();
      if ($this->Client->del($id))
      {
        $this->Client->commit();
        $this->Session->setFlash('Client ID '.$id.' has been deleted.');
        $this->redirect('/clients/index');
      }
      else
      {
        $this->Client->rollback();
        $this->Session->setFlash('Client ID '.$id.' could not be deleted.');
        $this->redirect('/clients/index');
      }
    }
    catch (Exception $e)
    {
      $this->Client->rollback();
      $this->Session->setFlash('Client ID '.$id.' could not be deleted because:<br>'.$e->getMessage());
      $this->redirect('/clients/index');
    }
  }

}
?>