<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Admin controller for the themes module
 *
 */
class Admin extends Admin_Controller
{
	/**
	 * The current active section
	 *
	 * @var string
	 */
	protected $section = 'themes';

	/**
	 * Validation array
	 *
	 * @var array
	 */
	private $validation_rules = array();

	/**
	 * Constructor method
	 */
	public function __construct()
	{
		// Call the parent's constructor
		parent::__construct();
		$this->load->model('theme_m');
		$this->lang->load('themes');
		$this->load->library('form_validation');

		$this->template->append_css('module::themes.css');
	}

	/**
	 * List all themes
	 */
	public function index()
	{
		$themes = $this->theme_m->get_all();

		$data = array();

		foreach ($themes as $theme)
		{
			if ( ! isset($theme->type) OR $theme->type != 'admin')
			{
				if ($theme->slug == $this->settings->default_theme)
				{
					$theme->is_default = TRUE;
				}

				$data['themes'][] = $theme;
			}
		}

		// Render the view
		$this->template
			->title($this->module_details['name'])
			->build('admin/index', $data);
	}

	/**
	 * List all admin themes
	 *
	 * @access public
	 * @return void
	 */
	public function admin_themes()
	{
		$themes = $this->theme_m->get_all();
		
		$data = array();
		
		foreach ($themes AS $theme)
		{
			if (isset($theme->type) AND $theme->type == 'admin')
			{
				if ($theme->slug == $this->settings->admin_theme)
				{
					$theme->is_default = TRUE;
				}
				
				$data['themes'][] = $theme;
			}
		}

		// Render the view
		$this->template
			// override the active section setting from above
			->set('active_section', 'admin_themes')
			->title($this->module_details['name'])
			->build('admin/index', $data);
	}
	
	/**
	 * Save the option settings
	 *
	 * @param string $slug The theme slug
	 */
	public function options($slug = '')
	{
		if ($this->input->post('btnAction') == 're-index')
		{
			$this->theme_m->delete_options($this->input->post('slug'));

			// now re-index all themes that don't have saved options
			if ($this->theme_m->get_all())
			{
				// Success...
				$this->session->set_userdata('success', lang('themes.re-index_success'));

				redirect('admin/themes/options/'.$slug);
			}
		}

		$all_options = $this->theme_m->get_options_by(array('theme' => $slug));

		$options_array = array();

		if ($all_options)
		{
			// Create dynamic validation rules
			foreach ($all_options as $option)
			{
				$this->validation_rules[] = array(
					'field' => $option->slug.(in_array($option->type, array('select-multiple', 'checkbox')) ? '[]' : ''),
					'label' => $option->title,
					'rules' => 'trim'.($option->is_required ? '|required' : '').'|max_length[255]'
				);

				$options_array[$option->slug] = $option->value;
			}

			// Set the validation rules
			$this->form_validation->set_rules($this->validation_rules);

			// Got valid data?
			if ($this->form_validation->run())
			{
				// Loop through again now we know it worked
				foreach ($options_array as $option_slug => $stored_value)
				{
					$input_value = $this->input->post($option_slug, FALSE);

					if (is_array($input_value))
					{
						$input_value = implode(',', $input_value);
					}

					// Dont update if its the same value
					if ($input_value !== $stored_value)
					{
						$this->theme_m->update_options($option_slug, array('value' => $input_value));
					}
				}

				// Fire an event. Theme options have been updated.
				Events::trigger('theme_options_updated', $options_array);

				// Success...
				$this->session->set_userdata('success', lang('themes.save_success'));

				redirect('admin/themes/options/'.$slug);

			}
		}

		$data->slug = $slug;
		$data->options_array = $all_options;
		$data->controller = &$this;

		$this->template->build('admin/options', $data);
	}

	/**
	 * Set the default theme to theme X
	 */
	public function set_default()
	{
		// Store the theme name
		$theme = $this->input->post('theme');

		// Set the theme
		if ($this->theme_m->set_default($this->input->post()))
		{
			// Fire an event. A default theme has been set.
			Events::trigger('theme_set_default', $theme);

			$this->session->set_userdata('success', sprintf(lang('themes.set_default_success'), $theme));
		}

		else
		{
			$this->session->set_userdata('error', sprintf(lang('themes.set_default_error'), $theme));
		}

		if ($this->input->post('method') == 'admin_themes')
		{
			redirect('admin/themes/admin_themes');
		}

		redirect('admin/themes');
	}

	/**
	 * Form Control
	 *
	 * Returns the form control for the theme option
	 * @todo: Code duplication, see modules/settings/libraries/Settings.php @ form_control().
	 *
	 * @param	object	$option
	 *
	 * @return	string
	 */
	public function form_control(&$option)
	{
		if ($option->options)
		{
			if (substr($option->options, 0, 5) == 'func:')
			{
				if (is_callable($func = substr($option->options, 5)))
				{
					$option->options = call_user_func($func);
				}
				else
				{
					$option->options = array('='.lang('global:select-none'));
				}
			}

			if (is_string($option->options))
			{
				$option->options = explode('|', $option->options);
			}
		}

		switch ($option->type)
		{
			default:
			case 'text':
				$form_control = form_input(array(
					'id' => $option->slug,
					'name' => $option->slug,
					'value' => $option->value,
					'class' => 'text width-20'
				));
				break;

			case 'textarea':
				$form_control = form_textarea(array(
					'id' => $option->slug,
					'name' => $option->slug,
					'value' => $option->value,
					'class' => 'width-20'
				));
				break;

			case 'password':
				$form_control = form_password(array(
					'id' => $option->slug,
					'name' => $option->slug,
					'value' => $option->value,
					'class' => 'text width-20',
					'autocomplete' => 'off',
				));
				break;

			case 'select':
				$form_control = form_dropdown($option->slug, $this->_format_options($option->options), $option->value, 'class="width-20"');
				break;

			case 'select-multiple':
				$options = $this->_format_options($option->options);
				$size = sizeof($options) > 10 ? ' size="10"' : '';
				$form_control = form_multiselect($option->slug.'[]', $options, explode(',', $option->value), 'class="width-20"'.$size);
				break;

			case 'checkbox':

				$form_control = '';
				$stored_values = is_string($option->value) ? explode(',', $option->value) : $option->value;

				foreach ($this->_format_options($option->options) as $value => $label)
				{
					if (is_array($stored_values))
					{
						$checked = in_array($value, $stored_values);
					}
					else
					{
						$checked = FALSE;
					}

					$form_control .= '<label>';
					$form_control .= ''.form_checkbox(array(
						'id' => $option->slug.'_'.$value,
						'name' => $option->slug.'[]',
						'checked' => $checked,
						'value' => $value
					));
					$form_control .= ' '.$label.'</label>';
				}
				break;

			case 'radio':

				$form_control = '';
				foreach ($this->_format_options($option->options) as $value => $label)
				{
					$form_control .= ''.form_radio(array(
						'id' => $option->slug,
						'name' => $option->slug,
						'checked' => $option->value == $value,
						'value' => $value
					)).' '.$label.'';
				}
				break;
		}

		return $form_control;
	}

	/**
	 * Format Options
	 *
	 * Formats the options for a theme option into an associative array.
	 *
	 * @param array $options
	 *
	 * @return array
	 */
	private function _format_options($options = array())
	{
		$select_array = array();

		foreach ($options as $option)
		{
			list($value, $name) = explode('=', $option);
			// todo: Maybe we should remove the trim()'s
			// since this will affect only people who have had the base
			// theme installed in the past.
			$select_array[trim($value)] = trim($name);
		}

		return $select_array;
	}
}