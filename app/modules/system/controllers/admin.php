<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * The system Module - currently only remove/empty cache folder(s)
 *
*
* Ananas  
*
* A simple, fast, development framework for web applications and software licenses software
*
* @package		Ananas
* @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/

class Admin extends Admin_Controller
{

	private $cache_path;

	public function __construct()
	{
		parent::__construct();
		
		if (!is_sadmin()) {
			show_error('Access Denied. You are not an admin. Get out of here.');
		}
		
		$this->cache_path = APPPATH . 'cache/' .SITE_REF. '/';
		$this->_log_folder = APPPATH . 'logs/';
		$this->_cron_log_folder = APPPATH . 'cache/' . SITE_REF . '/cron_log/';
		
		$this->config->load('system');
		$this->lang->load('system');
		$this->lang->load('cronlogs');
		$this->lang->load('logs');
		$this->load->helper('directory');
		$this->load->helper('file');
		$this->template->append_css('module::admin.css');
	}


	/**
	 * Dashboard
	 */
	public function index()
	{

		$this->template
			->title($this->module_details['name'])
			->append_css('module::admin.css')
			->append_js('module::chartjs/knockout-2.2.1.js')
			->append_js('module::chartjs/globalize.min.js')
			->append_js('module::chartjs/dx.chartjs.js')
			->build('admin/dashboard');
	}

	/**
	 * List all folders
	 */
	public function exporttables()
	{

		$table_list = config_item('system.export_tables');
		
		asort($table_list);
		
		$tables = array();
		foreach ($table_list as $table)
		{
			$tables[] = array(
				'name' => $table,
				'count' => $this->db->count_all($table),
			);
		}
		$this->template
			->title($this->module_details['name'])
			->set('tables', $tables)
			->build('admin/exporttables');
	}
	
	/**
	 * List all cache folders - configured in config/system
	 */
	public function cache()
	{
		// Discover all the directories in the cache path.
		$cache_folders = glob($this->cache_path.'*', GLOB_ONLYDIR);

		// Get protected cache folders from module config file
		$protected = $this->config->item('system.cache_protected_folders');
		$cannot_remove = $this->config->item('system.cannot_remove_folders');

		$folders = array();

		foreach ($cache_folders as $key => $folder)
		{
			$basename = basename($folder);
			// If the folder is not protected
			if( ! in_array($basename, $protected))
			{
				// Store it in the array of the folders we will be doing something with.
				// Just use the filename on the front end to not expose complete paths
				$folders[] = array(
					'name' => $basename,
					'count' => count(glob($folder.'/*')),
					'cannot_remove' => in_array($basename, $cannot_remove)
				);
			}
		}
		$this->template
			->title($this->module_details['name'])
			->set('folders', $folders)
			->build('admin/emptycache');
	}

	public function cleanup($name = '', $andfolder = 0)
	{
		if ( ! empty($name))
		{
			$andfolder = ($andfolder) ? true : false;
			$apath = $this->_refind_apath($name);

			if ( ! empty($apath))
			{
				$item_count = count(glob($apath.'/*'));
				// just empty or empty and remove?
				$which = ($andfolder) ? 'remove' : 'empty';

				if ($this->delete_files($apath, $andfolder))
				{
					$this->session->set_userdata('success', sprintf(lang('system:'.$which.'_msg'), $item_count, $name));
				}
				else
				{
					$this->session->set_userdata('error', sprintf(lang('system:'.$which.'_msg_err'), $name));
				}
			}
		}

		redirect('admin/system/cache/');
	}

	/**
	 * Delete files from a path
	 *
	 * @param string $apath The path to delete files from.
	 * @param bool $andfolder Whether to delete the folder itself or not.
	 *
	 * @return bool
	 */
	private function delete_files($apath, $andfolder = false)
	{
		$this->load->helper('file');

		if ( ! delete_files($apath, true))
		{
			return false;
		}

		if ($andfolder)
		{
			if ( ! rmdir($apath))
			{
				return false;
			}
		}

		return true;
	}

	/**
	 * Export a table into a specified data format.
	 *
	 * @param string $table The name of the table to export.
	 * @param string $type The type in which to export the data.
	 */
	public function exportfile($table = '', $type = 'xml')
	{
		$this->load->model('system_m');
		$this->load->helper('download');
		$this->load->library('format');

		$table_list = config_item('system.export_tables');

		if (in_array($table, $table_list))
		{
			$this->system_m->export($table, $type, $table_list);
		}
		else
		{
			redirect('admin/system');
		}
	}

	/**
	 * Rediscover a path.
	 *
	 * @param string $name The name of the path.
	 * @return string The folder name.
	 */
	private function _refind_apath($name)
	{
		$folders = glob($this->cache_path.'*', GLOB_ONLYDIR);

		foreach ($folders as $folder)
		{
			if (basename($folder) === $name)
			{
				return $folder;
			}
		}
	}
	/**
	* List cronlogs and delete and view
	*/
	public function cronlogs() {
	
		$items = directory_map($this->_cron_log_folder, 1);
		$items = array_diff($items, array('.', '..', 'index.php', 'index.html'));
		sort($items);
		$items = array_reverse($items);
		
		$this->data->items = & $items;
		$this->template->title($this->module_details['name'])
			->set('folder', $this->_cron_log_folder)
			->build('admin/cronlogsitems', $this->data);
	}

	public function viewcronlog($item = '') 
	{
		$data = new stdClass();
		
		$data->content = read_file($this->_cron_log_folder . $item);
		$data->content OR redirect('admin/system/cronlogs');
		$data->filename = $item;
		
		$this->template->title(lang('global:view') . ': ' . $item)
			->build('admin/viewcronlogs', $data);
	}

	public function deletecronlog($item = '') 
	{
		if ($this->input->post('action_to') && is_array($this->input->post('action_to'))) 
		{
			$array = $this->input->post('action_to');
			foreach ($array as $value) 
			{
				if (file_exists($this->_cron_log_folder . $value)) 
				{
					unlink($this->_cron_log_folder . $value);
				}
			}
			$this->session->set_userdata('success', sprintf(lang('logs:array_success'), count($array)));
		} 
		else if (file_exists($this->_cron_log_folder . $item)) 
		{
		
			if (unlink($this->_cron_log_folder . $item)) {
				$this->session->set_userdata('success', sprintf(lang('logs:success'), $item));
			} 
			else 
			{
				$this->session->set_userdata('error', lang('logs:error'));
			}
		} 
		else 
		{
			$this->session->set_userdata('error', lang('logs:error'));
		}
		redirect('admin/system/cronlogs');
	}

	public function listcronlogs() 
	{
	
		// Load the models
		$this->load->model('media/Feeds_m', '', true);
		
		$log_items = $this->Feeds_m->get_checklog_items(30,10); //add a setting to make it flexible
		$this->template->log_items = $log_items;
		$this->template->build('admin/listcronlogs');
	}
		/**
		 * List all log items from log file
		 */
	public function logs() 
	{

		$items = directory_map($this->_log_folder, 1);
		$items = array_diff($items, array('.', '..', 'index.php', 'index.html'));
		sort($items);
		$items = array_reverse($items);
		
		$this->data->items = & $items;
		$this->template->title($this->module_details['name'])
			->set('folder', $this->_log_folder)
			->build('admin/logitems', $this->data);
	}

	public function viewlog($item = '') 
	{
		$data = new stdClass();
		
		$data->content = read_file($this->_log_folder . $item);
		$data->content OR redirect('admin/system/logs');
		$data->filename = $item;
		
		$this->template->title(lang('global:view') . ': ' . $item)
			->build('admin/logview', $data);
	}

	public function deletelog($item = '') 
	{
		if ($this->input->post('action_to') && is_array($this->input->post('action_to'))) 
		{
			$array = $this->input->post('action_to');
			foreach ($array as $value) 
			{
				if (file_exists($this->_log_folder . $value)) 
				{
					unlink($this->_log_folder . $value);
				}
			}
			$this->session->set_userdata('success', sprintf(lang('logs:array_success'), count($array)));
		} else if (file_exists($this->_log_folder . $item)) 
		{
			if (unlink($this->_log_folder . $item)) 
			{
				$this->session->set_userdata('success', sprintf(lang('logs:success'), $item));
			} 
			else 
			{
				$this->session->set_userdata('error', lang('logs:error'));
			}
		} 
		else 
		{
			$this->session->set_userdata('error', lang('logs:error'));
		}
		redirect('admin/system/logs');
	}

	public function phpinfo() 
	{
	
		$this->template->build('admin/phpinfo');
	
	}
	
	public function listapilogs() 
	{
	
		// Load the models
		$this->load->model('System_m');
		$log_items = $this->System_m->get_listapilogs(10); //add a setting to make it flexible
		$this->template->log_items = $log_items;
		$this->template->build('admin/listapilogs');
	} 
	
	public function diskspace() 
	{
		$output = array();
		exec("df", $output);
		$output = join("n", $output);
		$space = eregi_replace(".* ([0-9]+)% /var.*", "1", $output);	
	}
//
//   Network Tools
//
	public function networktools() 
	{
		$this->load->library('networktools');

		$this->template
			->title($this->module_details['name'])
			->append_css('module::style.css')
			->build('admin/networktools');	
	}

	public function pageanalysis() 
	{		
		$this->load->library('Analysis');
		$this->load->library('Extractor');

		$urlcheck = $this->input->post('urlcheck', TRUE);
		var_dump($urlcheck);

		if(empty($urlcheck)) {
			$this->template
				->title($this->module_details['name'])
				->append_css('module::style.css')
				->build('admin/pageanalysis');
		}
		else
		{
    		define('GOOGLE_MAGIC', 0xE6359A60);

			if(strtolower($urlcheck) == "http://")
			{
			}
			else if ( ! preg_match('/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i', $urlcheck) )
			{
				?>
				<div class="errorurl" style="width: 395px">
				<strong class="redb">ERROR: Please Provide proper URL to index the page.</strong><br /><br />
				Kindly Provide a proper URL. <br /><br />The <b>Format of URL should be:</b> <br />http://www.example.com, or<br />http://www.example.com/sample-page.php, or<br />http://subdomain.example.com/sub-directory/sample-page.php,<br />or similar to the above formats.
				</div>
				<?php
			}
			else
			{
			    $url=str_replace('http://','',$urlcheck);
				$url='http://'.$url;
				$meta=New analysis;
				$res=$meta->getValues($url);
				$ext=NEW extractor($url);
				$links=$ext->ExtractLinks('');
				$res['links']=$ext->links;
			}
			$pch =  url_exists($urlcheck);
//			var_dump($pch);
			$this->template
				->title($this->module_details['name'])
				->append_css('module::style.css')
				->build('admin/pageanalysisresult');			
		}
	}
}