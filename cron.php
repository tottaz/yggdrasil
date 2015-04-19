<?php

class Cron extends CI_Controller {

    function __construct()
    {
        parent::__construct();
        include('_construct_cron.php');
    }

    public function index()
    {
        $this->core->cronjobs();
    }

    public function redirect($id)
    {
        $this->core->redirect($id);
    }

}

?>