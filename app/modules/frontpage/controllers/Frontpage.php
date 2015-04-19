<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * The frontpage controller
 *
 * @subpackage  Controllers
 * @category    Frontpage
 */
class Frontpage extends Public_Controller {

    public function __construct() 
    {
        parent::__construct();

        $this->load->helper('url');
    }
    
    public function index() 
    {      
        $this->load->view('frontpage.html');
    }
}