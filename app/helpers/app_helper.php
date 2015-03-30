<?php
/**
 * App  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		App
 * @author		App Dev Team
// ------------------------------------------------------------------------
*/
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Throws a 403 and displays an Access Denied error message.
 *
 * @access	public
 * @return	void
 */
function access_denied() {
        
    show_error(__('You do not have permission to access this page.'), 403, __('Access Denied'));

    // show_error() will exit, but just in-case...
    exit;
}

if (!function_exists('isSSL')) {

    function isSSL() {
        if ((!empty($_SERVER['HTTPS']) and $_SERVER['HTTPS'] !== 'off') or $_SERVER['SERVER_PORT'] == 443) {
            return true;
        } else {
            return false;
        }
    } 

}

// --------------------------------------------------------------------

function get_user_full_name_by_id($user_id) {
    $CI = &get_instance();
    $CI->load->model('users/user_m');
    return $CI->user_m->get_full_name($user_id);
}

function get_ship_unique_id_by_id($ship_id) {
    $CI = &get_instance();
    $CI->load->model('ships/ships_m');
    return $CI->ships_m->getUniqueIdById($ship_id);
}

/**
 * Sets the appropriate JSON header, the status header, then
 * encodes the output and exits execution with the JSON.
 *
 * @access	public
 * @param	mixed	The output to encode
 * @param	int		The status header
 * @return	void
 */
function output_json($output, $status = 200) {
    if (headers_sent()) {
        show_error(__('Headers have already been sent.'));
    }

    PAN::$CI->output->set_status_header($status);
    PAN::$CI->output->set_header('Content-type: application/json');
    exit(json_encode($output));
}

function logo($img_only = false, $anchor = true, $h = 1) {
    $logo = Settings::get('logo_url');
    $title = Settings::get('site_name');
    if (empty($logo)) {
        $anchor = $anchor ? anchor('admin', $title) : $title;
        return $img_only ? '' : "<h" . $h . " class='logo'>" . $anchor . "</h" . $h . ">";
    } else {
        $logo = "<img src='$logo' style='height:50px;' alt='$title' />";
        $anchor = $anchor ? '<a href="' . site_url('admin') . '">' . $logo . '</a>' : $logo;
        return "<div class='img-logo'>$anchor</div>";
    }
}

/**
 * Replaces PHP's file_get_contents in URLs, to get around the allow_url_fopen limitation.
 * Still loads regular files using file_get_contents.
 * 
 * @param string $url
 * @return string 
 */
function get_url_contents($url, $redirect = true) {

    if (empty($url)) {
        return '';
    }

    # First, let's check whether this is a local file.

    if (stristr($url, FCPATH) !== false) {
        return file_get_contents($url);
    }

    # This is for PDFs, to bypass the need for an external request.
    $config = array();
    include APPPATH . 'config/template.php';
    $theme_location = $config['theme_locations'][0];
    $fcpath = FCPATH;
    $base_url = BASE_URL;

    $buffer = str_ireplace($fcpath, '', $theme_location);
    $buffer = $base_url . $buffer;

    # Check if it's in third_party/themes.
    if (substr($url, 0, strlen($buffer)) == $buffer) {
        $path_without_buffer = substr($url, strlen($buffer), strlen($url) - strlen($buffer));
        $path_without_version = explode('?', $path_without_buffer);
        $path_without_version = $path_without_version[0];
        $path = $theme_location . $path_without_version;

        if (file_exists($path)) {
            return file_get_contents(urldecode($path));
        }
    }

    # Check if it's in uploads.
    $buffer = $base_url . 'uploads/';
    if (substr($url, 0, strlen($buffer)) == $buffer) {
        $path_without_buffer = substr($url, strlen($buffer), strlen($url) - strlen($buffer));
        $path_without_version = explode('?', $path_without_buffer);
        $path_without_version = $path_without_version[0];
        $path = FCPATH . 'uploads/' . $path_without_version;
        if (file_exists($path)) {
            return file_get_contents(urldecode($path));
        }
    }

    if (substr($url, 0, 7) != 'http://') {
        return file_get_contents($url);
    } else {
        include_once APPPATH . 'libraries/HTTP_Request.php';
        $http = new HTTP_Request();
        try {
            $result = $http->request($url);
        } catch (Exception $e) {
            deal_with_no_internet($redirect, $url);
            return '';
        }
        $result = trim($result);
        return $result;
    }
}

/**
 * Redirects to the no_internet_access page if $redirect is true (which is only true in PDFs), or if a firewall is blocking external resource access completely.
 * Else, defines TEMPORARY_NO_INTERNET_ACCESS which is used in the admin layout, to show a subtle "no internet access" notification.
 * 
 * @param boolean $redirect 
 */
function deal_with_no_internet($redirect = false, $url = '') {
    if ($redirect) {
        redirect('no_internet_access/' . base64_encode($url));
    } else {
        defined('TEMPORARY_NO_INTERNET_ACCESS') or define('TEMPORARY_NO_INTERNET_ACCESS', true);
    }
}

function parse_tags($content, $data) {
    foreach ($data as $tag => $value) {
        $content = str_ireplace("{{$tag}}", $value, $content);
    }
    return $content;
}

/**
 * Sends an email as given, without doing any processing.
 * 
 * BCCs the email if it's being sent to a ship and the BCC setting is turned on.
 * 
 * If $from is not provided, the notify_email will be used.
 * 
 * @param string $to
 * @param string $subject
 * @param string $message
 * @param string $from
 * @param array $attachments
 * @return boolean 
 */
function send_App_email_raw($to, $subject, $message, $from = null, $attachments = array()) {

    $CI = &get_instance();
    $CI->load->library('email');

    if (Settings::get('enable_pdf_attachments') == 0) {
        $attachments = array();
    }

    if (!empty($from)) {
        $CI->email->from($from);
    } else {
        $CI->email->from(Settings::get('notify_email'), Settings::get('site_name'));
    }

    $to = explode(',', $to);
    foreach ($to as $recipient) {
        $recipient = trim($recipient);
        $CI->email->to($recipient);
    }




    foreach ($attachments as $filename => $contents) {
        $attachment = FCPATH . 'uploads/' . $filename;
        file_put_contents($attachment, $contents);
        $CI->email->attach($attachment);
    }



    $result = $CI->email->subject($subject)->message(str_ireplace('{bcc}', '', $message))->send();

    if (!$result) {
        show_error($CI->email->print_debugger());
        die;
    }
    
    foreach ($attachments as $filename => $contents) {
        $attachment = FCPATH . 'uploads/' . $filename;
        @unlink($attachment);
    }

    $CI->email->clear(true);

    foreach ($to as $to_address) {
        if ($to_address != Settings::get('notify_email')) {
            if (Settings::get('bcc')) {
                # It's for a ship, let's BCC this stuff.
                $date = format_date(time());
                send_email_email_raw(Settings::get('notify_email'), $subject, str_ireplace('{bcc}', 'This email was sent to ' . $to_address . ' on ' . $date . '<br /><hr /><br />', $message), $from, $attachments);
            }
        }
    }

    return $result;
}

function add_column($table, $name, $type, $constraint = null, $default = '', $null = FALSE) {
    $CI = &get_instance();
    $result = $CI->db->query("SHOW COLUMNS FROM " . $CI->db->dbprefix($table) . " LIKE '{$name}'")->row_array();

    if (!isset($result['Field']) or $result['Field'] != $name) {
        $properties = array(
            'type' => $type,
            'null' => $null,
        );

        if ($null === FALSE) {
            $properties['default'] = $default;
        }

        if ($constraint !== NULL) {
            $properties['constraint'] = $constraint;
        }

        return $CI->dbforge->add_column($table, array(
                    $name => $properties,
                ));
    }
}

function get_count($type, $ship_id = 0) {

    static $counts = array(
        'paid' => array(),
        'overdue' => array(),
        'sent_but_unpaid' => array(),
        'unsent' => array(),
        'recurring' => array(),
        'estimates' => array(),
        'all' => array(),
        'proposals' => array(),
        'task_comments' => array(),
        'project_comments' => array(),
    );

    $ship_id = (int) $ship_id;

    if (isset($counts[$type][$ship_id])) {
        return $counts[$type][$ship_id];
    }

    $CI = &get_instance();

    switch ($type) {
        case 'all':
            $counts[$type][$ship_id] = get_count('unpaid', $ship_id) + get_count('paid', $ship_id);
            break;
        case 'proposals':

            $ship_id = ($ship_id == 0) ? null : $ship_id;

            if ($ship_id !== NULL) {
                $where = array('ship_id' => $ship_id);
            } else {
                $where = array();
            }

            $counts[$type][$ship_id] = $CI->proposals_m->count($where);
            break;
        case 'estimates':
            $counts[$type][$ship_id] = $CI->invoice_m->countEstimates($ship_id);
            break;
        case 'paid':
            $buffer = $CI->invoice_m->paid_totals($ship_id == 0 ? null : $ship_id);
            $counts[$type][$ship_id] = $buffer['count'];
            break;
        case 'overdue':
            $buffer = $CI->invoice_m->overdue_totals($ship_id == 0 ? null : $ship_id);
            $counts[$type][$ship_id] = $buffer['count'];
            break;
        case 'sent_but_unpaid':
            $counts[$type][$ship_id] = $CI->invoice_m->count_sent_but_unpaid($ship_id == 0 ? null : $ship_id);
            break;
        case 'unpaid':
            $buffer = $CI->invoice_m->unpaid_totals($ship_id == 0 ? null : $ship_id);
            $counts[$type][$ship_id] = $buffer['count'];
            break;
        case 'unsent':
            $counts[$type][$ship_id] = $CI->invoice_m->count_unsent($ship_id == 0 ? null : $ship_id);
            break;
        case 'recurring':
            $counts[$type][$ship_id] = $CI->invoice_m->count_recurring($ship_id == 0 ? null : $ship_id);
            break;
        case 'task_comments':
            # In this case, $ship_id is actually a task ID.
            $counts[$type][$ship_id] = $CI->project_task_m->get_comment_count($ship_id);
            break;
        case 'project_comments':
            # In this case, $ship_id is actually a project ID.
            $counts[$type][$ship_id] = $CI->project_m->get_comment_count($ship_id);
            break;
    }

    return $counts[$type][$ship_id];
}

function App_upload($input, $unique_id_or_comment_id, $type = 'invoice', $ship_id = 0, $verify_only = false) {
    $return = array();

    if (!empty($input['name'])) {
        if ($type == 'invoice') {
            $folder_name = sha1(time() . $unique_id_or_comment_id) . '/';
        } elseif ($type == 'ship') {
            is_dir('uploads/ships/') or mkdir('uploads/ships/', 0777);

            $folder_name = 'ships/' . $ship_id . '-' . sha1(time()) . '/';
        } else {
            $folder_name = 'branding/';
        }

        for ($i = 0; $i < count($input['name']); $i++) {
            if (empty($input['name'][$i])) {
                continue;
            }
            is_dir('uploads/' . $folder_name) or mkdir('uploads/' . $folder_name, 0777);

            $real_name = basename($input['name'][$i]);
            $target_path = 'uploads/' . $folder_name . $real_name;

            # Check the extension.
            $allowed = array('pdf', 'png', 'psd', 'jpg', 'jpeg', 'bmp', 'ai', 'txt', 'zip', 'rar', '7z', 'gzip', 'bzip', 'gz', 'gif');

            if (!in_array(pathinfo($input['name'][$i], PATHINFO_EXTENSION), $allowed)) {
                return NOT_ALLOWED;
            }

            if (!$verify_only) {
                if (move_uploaded_file($input['tmp_name'][$i], $target_path)) {
                    $base_url = explode('://', base_url());
                    $base_without_index = $base_url[0] . '://' . str_ireplace('//', '/', str_ireplace('index.php', '', $base_url[1]));
                    $return[$real_name] = array(
                        'real_name' => $real_name,
                        'folder_name' => $folder_name,
                        'url' => $base_without_index . 'uploads/' . $folder_name . rawurlencode($real_name)
                    );
                } else {
                    return false;
                }
            } else {
                $base_without_index = (substr(base_url(), -10) == 'index.php/') ? substr(base_url(), 0, strlen(base_url()) - 10) . '/' : base_url();
                $return[$real_name] = array(
                    'real_name' => $real_name,
                    'folder_name' => $folder_name,
                    'url' => $base_without_index . 'uploads/' . $folder_name . rawurlencode($real_name)
                );
            }
        }
    }
    return $return;
}

function get_pdf($type, $return_html = false, $data) {

    $CI = &get_instance();
    $original_layout = $CI->template->_layout;
//    unset($CI->template->_partials['notifications']);
    $CI->template->_module = 'reports';
    $CI->load->helper('typography');
    $CI->load->model('files/files_m');

    $CI->template->pdf_mode = true;
    $CI->template->set_theme(PAN::setting('theme'));
    Asset::add_path('theme', $CI->template->get_theme_path());
//    asset::add_path($CI->template->get_theme_path());
    
    $CI->template->reports = $data;
    $CI->template->set_layout('pdf_report');
    
    $html = $CI->template->build($type, $data, TRUE);    // do not show on screen - can be used to output to pdf
      
    include_once APPPATH . 'libraries/dompdf/dompdf_config.custom.inc.php';
    include_once APPPATH . 'libraries/dompdf/dompdf_config.inc.php';
    $dompdf = new DOMPDF();
    $dompdf->load_html($html);
    $dompdf->set_paper(Settings::get('pdf_page_size'));    
    $dompdf->render();
    
    $filepath = prepare_export($type, 'pdf');
    $filename = basename($filepath); 
    
    file_put_contents($filepath, $dompdf->output());
    $dompdf->stream($filename);    
  
    return array(
        'dompdf' => $dompdf
    );
}    
//    
//      Support functions to create a directory of current data and store files in it
//    
    function prepare_export($type, $ext) {

        $filename = FCPATH . 'uploads/exports/' . date('Y-m-d') . '/' . $type . '-' . date('H-i-s') . '.' . $ext;
        if (!file_exists(FCPATH . 'uploads/exports')) {
            mkdir(FCPATH . 'uploads/exports');
            fopen('uploads/exports/index.html', 'w+');
        }

        if (!file_exists(FCPATH . 'uploads/exports/' . date('Y-m-d'))) {
            mkdir(FCPATH . 'uploads/exports/' . date('Y-m-d'));
            fopen('uploads/exports/' . date('Y-m-d') . '/index.html', 'w+');
        }

        # Create the file.
        fopen($filename, 'w+');

        return $filename;
    }
    
//
//      Support functions to export a csv file 
//    
    
    function get_export_csv($fields, $records, $type) {
        
        $filename = prepare_export($type, 'csv');
        $file = fopen($filename, 'w+');
        
        fputcsv($file, $fields);
        
        foreach ($records as $record) {
            fputcsv($file, $record);
        }
        fclose($file);
        return array(
            'filepath' => $filename,
            'contents' => file_get_contents($filename)
        );
    }