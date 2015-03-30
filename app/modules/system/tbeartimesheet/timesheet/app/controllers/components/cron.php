<?php
class CronComponent extends Object
{
  var $controller;
  var $tasks=array();
  var $components=array('Configuration','requestHandler');
  function startup(&$controller)
  {
    $this->controller=$controller;
  }

  /**
     * Adds a task to the list
     * @param string $tarea CakeURL of the action (/controller/action)
     */
  function add($accion)
  {
    $this->tasks[]=$accion;
  }

  function __destruct()
  {
    if (CONFIG_CRON_INTERVAL) //if 0 then disabled
    {
      $lastrun = $this->Configuration->value('CONFIG_CRON_LASTRUN');

      $nextrun = $lastrun + 60 * CONFIG_CRON_INTERVAL;
      if (time()>$nextrun)
      {
        flush();
        if (!isset($this->requestHandler) || !$this->requestHandler->isAjax())
        {
          $this->_execute_tasks();
        }
      }
    }
  }

  /**
     * Executed after flushed the page to the user, it the
     * call isn’t ajax.
     * It must call the programmed tasks if the timeout has
     * expired.
     */
  function _execute_tasks()
  {
    //a near future date for auto error recovering
    $this->Configuration->update('CONFIG_CRON_LASTRUN', time() - CONFIG_CRON_RETRY_INTERVAL);
    foreach ($this->tasks as $t)
    {
      @$this->controller->requestAction($t);
    }
    $this->Configuration->update('CONFIG_CRON_LASTRUN', time() + CONFIG_CRON_INTERVAL);
  }

}
?>
