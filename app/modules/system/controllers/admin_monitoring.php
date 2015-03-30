<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 *
 * Index controller - view basic disk space and cpu usage.
 * 
 * @author 	
 * @link	
 */
class Admin_monitoring extends Admin_Controller
{
	// --------------------------------------------------------------------------	

	/**
	 * Constructor method
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	
		$this->load->language('diskspace');
		$this->load->library('diskSpace');
	}

	// --------------------------------------------------------------------------	
	
	/**
	 * Show general table stats
	 *
	 * @access	public
	 */
	public function index()
	{
		// -------------------------------------
		// Get basic info
		// -------------------------------------

		// load class with default drive  
		//$dUsage = new diskSpace;
		
		// or load class with specific drive  
		$dUsage = new diskSpace( "." );
		
		$this->template->disk = $dUsage->the_drive;
		// will output: .  
		$this->template->rawsize = $dUsage->raw_diskspace;
		
		// will output: Raw Size: 489616760832  
	
		$this->template->rawfree = $dUsage->raw_freespace;
		// will output: Raw Free: 454473097216  
	
		$this->template->readablesize = $dUsage->readable_diskspace;
		// will output: Readable Size: 455.99 GB  
	
		$this->template->readablefree = $dUsage->readable_freespace;
		// will output: Readable Free: 423.26 GB  
		  
		$this->template->perentagefree = $dUsage->percentage_free;
		// will output: Percentage Free: 93%  
		  
		$this->template->percentageused = $dUsage->percentage_used;
		// will output: Percentage Used: 7%  
		// -------------------------------------
		$this->template->memoryusage = $dUsage->memory_get_usage;
		
//		$this->template->serverload = $dUsage->get_server_load;	
		
//		$this->template->serveruptime = $dUsage->get_server_uptime;	
		
		$this->template->build('admin/diskspace');
	}
}