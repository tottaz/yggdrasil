<?php

class Admin extends Admin_Controller {


    function __construct() {
        parent::__construct();

        $this->load->library('grocery_CRUD');
    }
	
	public function enter() 
	{
		
		$this->load->model('Data', '', true);
		
		// Build the Grocery CRUD table and form
		
		$config = new grocery_CRUD();
		
		$config->set_theme('datatables');
		                
		$config->set_table('config');
		
		$config->set_subject('Config');
		
		$config->fields('shipid');
		
		$config->columns('shipid');
		
		$config->display_as('shipid','Ship Name');
		
		$config->set_relation('shipid','ships','ship_name');
		
		$config->unset_add();
		$config->unset_delete();
		$output = $config->render();
	
		// Load the view
		$this->template->build('tables', $output);
	}
        
       	public function country() {
            
            $this->load->model('Data', '', true);
				                
                // Build the Grocery CRUD table and form
    
                $country = new grocery_CRUD();
                
                $country->set_theme('datatables');
                                
                $country->set_table('countries');
                
                $country->set_subject('Countries');
                
                $country->unset_delete();
                
                $country->fields('country','alpha_2','alpha_3','Continent','Region');                
                
                $country->columns('country','alpha_2','alpha_3','Continent','Region');
                
                $country->display_as('country','Country')
                         ->display_as('alpha_2','Alpha 2')                       
                         ->display_as('alpha_3','Alpha 3')
                         ->display_as('Continent','Continent')
                         ->display_as('Region','Region');
                
//                $country->set_relation('personid','personaldata','{names} {family_names}')
//                         ->set_relation('rankid','rank','rank')
//                         ->set_relation('typeid','type','name')
//                         ->set_relation('shipid','ships','ship_name');
                                       
                $output = $country->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}
	
        public function marital() {
            
                $this->load->model('Data', '', true);
				
                // Build the Grocery CRUD table and form
    
                $rank = new grocery_CRUD();
                
                $rank->set_theme('datatables');
                                
                $rank->set_table('marital_status');
                
                $rank->set_subject('Marital Status');
                
                $rank->fields('maritalstatus');    
                
                $rank->columns('maritalstatus');
                
                $rank->display_as('maritalstatus','Marital Status');
                                       
                $output = $rank->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}

	public function meals() {
				
		$this->load->model('Data', '', true);
				
                // Build the Grocery CRUD table and form
    
                $rank = new grocery_CRUD();
                
                $rank->set_theme('datatables');
                                
                $rank->set_table('foodchoice');
                
                $rank->set_subject('Food Choice');
                
                $rank->fields('food_choice');    
                
                $rank->columns('food_choice');
                
                $rank->display_as('food_choice','Food Choice');
                                       
                $output = $rank->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}        

        public function passport() {
				
		$this->load->model('Data', '', true);
		
                // Build the Grocery CRUD table and form
    
                $rank = new grocery_CRUD();
                
                $rank->set_theme('datatables');
                                
                $rank->set_table('passport_type');
                
                $rank->set_subject('Passports');
                
                $rank->fields('type');    
                
                $rank->columns('type');
                
                $rank->display_as('type','Type');
                                       
                $output = $rank->render();                
		
		// Load the views
                $this->template->build('tables', $output);

	}

	public function rank() {
				
		$this->load->model('Data', '', true);
		
                // Build the Grocery CRUD table and form
    
                $rank = new grocery_CRUD();
                
                $rank->set_theme('datatables');
                                
                $rank->set_table('rank')
                     ->callback_after_insert(array($this, 'insert_timestamp', 'rank'));
                
                $rank->set_subject('Ranks');
                
                $rank->fields('rank','sortorder','abbrev_rank','default_username','type');    
                
                $rank->columns('rank','sortorder','abbrev_rank','default_username','type');
                
                $rank->display_as('rank','Rank')
                     ->display_as('sortorder','Sort Order')   
                     ->display_as('abbrev_rank','Abbreviation')   
                     ->display_as('type','Type');
                
                $rank->set_relation('type','rank_type','{ranktype} ({intext})');
                
                $rank->order_by('sortorder','asc');
                                       
                $output = $rank->render();                
		
		// Load the views
                $this->template->build('tables', $output);

	}

	public function ships() {
				
		$this->load->model('Data', '', true);

                // Build the Grocery CRUD table and form
    
                $ships = new grocery_CRUD();
                
                $ships->set_theme('datatables');
                                
                $ships->set_table('ships');
                
                $ships->set_subject('Ships');
                
                $ships->fields('ship_name','imo_number','call_sign','abbreviation_4','abbreviation_2','ip_address','key');    
                
                $ships->columns('ship_name','imo_number','call_sign','abbreviation_4','abbreviation_2','ip_address','key');
                
                $ships->display_as('ship_name','Ship Name')
                      ->display_as('imo_number','IMO')
                      ->display_as('call_sign','Call Sign')
                      ->display_as('abbreviation_4','Long')
                      ->display_as('abbreviation_2','Short')
                      ->display_as('ip_address','Address')
                      ->display_as('key','API Key');
                                       
                $output = $ships->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}
        
        public function ports() {
				
		$this->load->model('Data', '', true);

                // Build the Grocery CRUD table and form
    
                $ports = new grocery_CRUD();
                
                                
                $ports->set_table('ports')
                     ->callback_after_insert(array($this, 'insert_timestamp', 'ports'));
                
                $ports->set_subject('Ports');
                  
                
                $ports->columns('countryid','name','locode','latitude','longitude');
                
                $ports->fields('countryid','name','name_no_accents','locode','subdivision','function','latitude','longitude');    
                
                $ports->display_as('countryid','Country')
                      ->display_as('locode','UNLOCODE')
                      ->display_as('function','Function (follow UNLOCODE or leave blank)')
                      ->display_as('name_no_accents','Name without accents')
                      ->display_as('subdivision','Province/State');
                
                $ports->add_action('Port file',base_url().'app/themes/bootstrap/img/ui_icons/blue_speech_bubble_24.png','ports/single/');
                        
                $ports->set_relation('countryid','countries','country');
              
                                       
                $output = $ports->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}
        
	public function type() {
				
		$this->load->model('Data', '', true);
		
       // Build the Grocery CRUD table and form
    
                $types = new grocery_CRUD();
                
                $types->set_theme('datatables');
                                
                $types->set_table('type')
                     ->callback_after_insert(array($this, 'insert_timestamp', 'type'));
                
                $types->set_subject('Unit Type');
                
                $types->fields('name');    
                
                $types->columns('name');
                
                $types->display_as('name','Name');
                                       
                $output = $types->render();                
		
		// Load the views
                $this->template->build('tables', $output);
	}       
        
       function display_nationality($country, $row) { 
            $country_name = $this->Data->get_country_data($country);
            $country_flag = '<img src="app/themes/bootstrap/img/flags/' .strtolower($country_name['alpha_2']). '.png">&nbsp;';
            return  $country_flag . $country_name['alpha_3'];
        }
        
        function insert_timestamp($post_array, $primary_key, $table) {
            $timestamp_insert = array("lastmodified" => date("Y-m-d H:i:s"));
            $this->db->where('id', $primary_key);
            $this->db->update($table, $timestamp_insert);
        }

}
?>