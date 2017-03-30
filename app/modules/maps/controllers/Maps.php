<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * The admin controller for the maps
 *
 * @subpackage	Controllers
 * @category	Dashboard
 */ 
 class Maps extends Admin_Controller {

   public function __construct() {
        parent::__construct();
         
        // Load the models
        $this->load->model('Maps_m', '', true);
        // Load helpers
        $this->load->helper('array');
  }    
  public function index() {
    //Call Model to get map data
    $data = $this->Maps_m->get_map_country();
    //pass the map data to the template
    $this->template->graph = $data;        
    // Build the template and load the view
    $this->template->build('maps');  
  }       
}