<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Modules controller, lists all installed modules
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
	/**
	 * Constructor method
	 *
	 * 
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();

		$this->lang->load('modules');
	}

	/**
	 * Index method
	 * 
	 * @return void
	 */
	public function index()
	{
		$this->module_m->import_unknown();

		$this->template
			->title($this->module_details['name'])
			->set('all_modules', $this->module_m->get_all(NULL, TRUE))
			->build('admin/index');
	}
	
	/**
	 * Enable
	 *
	 * Enables an module
	 *
	 * @param	string	$slug	The slug of the module to enable
	 * @access	public
	 * @return	void
	 */
	public function install($slug)
	{
		if ($this->module_m->install($slug))
		{
			// Fire an event. A module has been enabled when installed. 
			Events::trigger('module_enabled', $slug);
							
			// Clear the module cache
			$this->appcache->delete_all('module_m');
			$this->session->set_userdata('success', sprintf(lang('modules.install_success'), $slug));
		}
		else
		{
			$this->session->set_userdata('error', sprintf(lang('modules.install_error'), $slug));
		}

		redirect('admin/modules');
	}

	/**
	 * Enable
	 *
	 * Enables an module
	 *
	 * @param	string	$slug	The slug of the module to enable
	 * @access	public
	 * @return	void
	 */
	public function enable($slug)
	{
		if ($this->module_m->enable($slug))
		{
			// Fire an event. A module has been enabled. 
			Events::trigger('module_enabled', $slug);
			
			// Clear the module cache
			$this->appcache->delete_all('module_m');
			$this->session->set_userdata('success', sprintf(lang('modules.enable_success'), $slug));
		}
		else
		{
			$this->session->set_userdata('error', sprintf(lang('modules.enable_error'), $slug));
		}

		redirect('admin/modules');
	}

	/**
	 * Disable
	 *
	 * Disables an module
	 *
	 * @param	string	$slug	The slug of the module to disable
	 * @access	public
	 * @return	void
	 */
	public function disable($slug)
	{
		if ($this->module_m->disable($slug))
		{
			// Fire an event. A module has been disabled. 
			Events::trigger('module_disabled', $slug);
			
			// Clear the module cache
			$this->appcache->delete_all('module_m');
			$this->session->set_userdata('success', sprintf(lang('modules.disable_success'), $slug));
		}
		else
		{
			$this->session->set_userdata('error', sprintf(lang('modules.disable_error'), $slug));
		}

		redirect('admin/modules');
	}
	
	/**
	 * Upgrade
	 *
	 * Upgrade an addon module
	 *
	 * @param	string	$slug	The slug of the module to disable
	 * @access	public
	 * @return	void
	 */
	public function upgrade($slug)
	{
		// If upgrade succeeded
		if ($this->module_m->upgrade($slug))
		{
			// Fire an event. A module has been upgraded. 
			Events::trigger('module_upgraded', $slug);
			
			$this->session->set_userdata('success', sprintf(lang('modules.upgrade_success'), $slug));
		}
		// If upgrade failed
		else
		{
			$this->session->set_userdata('error', sprintf(lang('modules.upgrade_error'), $slug));
		}
		
		redirect('admin/modules');
	}

	/**
	 * Delete Recursive
	 *
	 * Recursively delete a folder
	 *
	 * @param	string	$str	The path to delete
	 * @return	bool
	 */
	private function _delete_recursive($str)
	{
        if (is_file($str))
		{
            return @unlink($str);
        }
		elseif (is_dir($str))
		{
            $scan = glob(rtrim($str,'/').'/*');

			foreach($scan as $index => $path)
			{
                $this->_delete_recursive($path);
            }

            return @rmdir($str);
        }
    }
}
