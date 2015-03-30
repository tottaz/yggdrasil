<?php
class ConfigurationComponent extends Object
{
  var $controller;

  function startup(&$controller)
  {
    $this->controller = $controller;
    loadModel('Configuration');

    $this->controller->Configuration = &new Configuration();
    $configurations = $this->controller->Configuration->findAll();
    foreach ($configurations as $configuration)
    {
      $name='CONFIG_' . $configuration['Configuration']['name'];
      if (!defined($name))
      {
        define($name,$configuration['Configuration']['value']);
      }
    }
  }

  function update($name,$value)
  {
    $name=substr($name,7);
    $configuration = $this->controller->Configuration->findByName($name);
    $this->controller->Configuration->id = $configuration['Configuration']['id'];
    $this->controller->Configuration->save(array('Configuration'=>array('value'=>$value)));
  }

  function value($name)
  {
    $name=substr($name,7);
    $configuration=$this->controller->Configuration->find(array('Configuration.name'=>$name));
    if ($configuration)
    {
      return $configuration['Configuration']['value'];
    }
  }

}
?>