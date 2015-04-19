<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Yggdrasil
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		Yggdrasil
 * @author		Yggdrasil Dev Team
// ------------------------------------------------------------------------

/**
 * The Yggdrasil Import / Export System Model
 *
 * @subpackage	Models
 * @category	Pie
 */
class Pie_m extends My_Model {

    public $error;

    function txt_to_array($filename) {

        $fields = array();
        $records = array();

        $contents = file_get_contents($filename);
        $contents = @unserialize($contents);
        if (!$contents) {
            return false;
        } else {
            foreach ($contents as $row) {
                $row = (array) $row;

                if (empty($fields)) {
                    $fields = array_keys($row);
                }
                $records[] = $row;
            }
            return array('fields' => $fields, 'records' => $records);
        }
    }

    function csv_to_array($filename, $has_headers = true) {

        $fields = array();
        $records = array();

        ini_set("auto_detect_line_endings", true);

        if (($handle = fopen($filename, "r")) !== FALSE) {
            $row = 1;
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if ($row == 1 and $has_headers) {
                    $new_data = array();
                    foreach ($data as $field) {
                        if ($field == 'terms,notes') {
                            $new_data[] = 'terms';
                            $new_data[] = 'notes';
                        } else {
                            $new_data[] = $field;
                        }
                    }
                    $fields = $new_data;
                    $row++;
                } else {
                    $buffer = array();
                    $i = 0;
                    foreach ($data as $field) {
                        if (isset($fields[$i])) {
                            $buffer[$fields[$i]] = $field;
                            $i++;
                        }
                    }
                    $records[] = $buffer;
                }
            }
            fclose($handle);
        }

        return array('fields' => $fields, 'records' => $records);
    }

    function _xml_subset_to_array($simplexml_element) {
        $new_v = array();

        $attributes = array();

        foreach ($simplexml_element->attributes() as $field => $value) {
            $attributes['attribute_' . $field] = (string) $value;
        }

        $arrayed_fields = array();

        foreach ($simplexml_element as $field => $value) {

            foreach ($value->attributes() as $attr_name => $attr_val) {
                $attributes['attribute_' . $attr_name] = (string) $attr_val;
            }

            if (count($value) == 0) {
                @$new_v[$field] = (string) $value;
            } else {
                $arrayed_fields[$field] = $field;
                @$new_v[$field][] = $this->_xml_subset_to_array($value);
            }
        }

        foreach ($arrayed_fields as $arrayed_field) {
            if (count($new_v[$arrayed_field]) == 1) {
                $new_v[$arrayed_field] = reset($new_v[$arrayed_field]);
            }
        }

        if (count(array_keys($new_v)) == 1) {
            return current($new_v);
        } else {
            return array_merge($attributes, $new_v);
        }
    }

    function xml_to_array($filename) {
        $xml = simplexml_load_file($filename);
        $results = $this->_xml_subset_to_array($xml);
        return array('fields' => array_keys(reset($results)), 'records' => $results);
    }

    function json_to_array($filename) {

        $fields = array();
        $records = array();

        $json = (array) json_decode(file_get_contents($filename));
        foreach ($json as $item) {

            $item = (array) $item;

            foreach ($item as $k => $v) {
                if (is_array($v)) {
                    foreach ($v as $key => $row) {
                        $item[$k][$key] = (array) $row;
                    }
                }
            }

            if (empty($fields)) {
                $fields = array_keys($item);
            }
            $records[] = $item;
        }

        return array('fields' => $fields, 'records' => $records);
    }

    function process($filename, $ext = '') {
        if (empty($ext)) {
            $ext = pathinfo($filename, PATHINFO_EXTENSION);
        }
        $method = $ext . '_to_array';
        print_r($method);
        return (method_exists($this, $method)) ? $this->$method($filename) : false;
    }

    function prepare_import($type, $filename, $ext) {
        $buffer = $this->pie->process($filename, strtolower($ext));
        print_r($buffer);
//        $method = 'process_' . $type . '_' . $ext;

        if ($buffer) {
            return $buffer;
        } else {
            return false;
        }
                
//        if ($this->$method($buffer['fields'], $buffer['records'])) {
//            return $buffer;
//        } else {
//            return false;
//        }
    }

    function import($type, $filename, $ext) {

        $CI = &get_instance();
        $CI->load->model('whois/whois_m');
        
        $CI->db->save_queries = false;

        # Process the file and return arrays with the records.
        $import = $this->pie->prepare_import($type, $filename, $ext);
     
        if (!$import) {
            return false;
        }
       
        switch ($type) {

            case 'noonreport':

                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->noonreport_m->update_insert($record);
                    $count++;
                }

                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;

            case 'people':
                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->peole_m->update_insert($record);
                    $count++;
                }
                                
                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;

            case 'schedule':
                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->schedule_m->update_insert($record);
                    $count++;
                }

                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;

           case 'tables':
                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->tables_m->update_insert($record);
                    $count++;
                }

                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;
                
            case 'users':

                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->users_m->update_insert_users($record);
                    $count++;
                }

                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;

          case 'whois':

                $count = 0;
                $dupes = 0;

                foreach ($import['records'] as $record) {
                    $CI->whois_m->update_insert($record);
                    $count++;
                }

                return array(
                    'count' => $count,
                    'duplicates' => $dupes,
                );

                break;
                
        }
    }

    function prepare_export($type) {

        $ext = ($type == 'users' or $type == 'time_entries') ? 'csv' : 'json';
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

    function get_export_csv($fields, $records, $type) {

        $filename = $this->prepare_export($type);
        $file = fopen($filename, 'w+');
        
        fputcsv($file, $fields);

        foreach ($records as $record) {
            fputcsv($file, $record);
        }
        fclose($file);
        return array(
            'filename' => $filename,
            'contents' => file_get_contents($filename)
        );
    }

    function get_export_json($records, $type) {
        $filename = $this->prepare_export($type);
        $contents = json_encode($records);
        file_put_contents($filename, $contents);
        return array(
            'filename' => $filename,
            'contents' => $contents
        );
    }

    function export($type) {

        $CI = &get_instance();

        switch ($type) {
            case 'whois':
                $CI->load->model('whois/whois_m');
                $data = $CI->whois_m->get_export();
                Settings::setLastModified(date("Y-m-d H:i:s"));                
                return $this->get_export_json($data, $type);
            case 'people':
                $CI->load->model('people/people_m');
                $data = $CI->people_m->get_export();
                Settings::setLastModified(date("Y-m-d H:i:s"));                   
                return $this->get_export_json($data, $type);
                break;
            case 'schedule':
                $CI->load->model('schedule/schedule_m');
                $data = $CI->schedule_m->get_export();
                Settings::setLastModified(date("Y-m-d H:i:s"));                   
                return $this->get_export_json($data, $type);
                break;
            case 'noonreport':
                $CI->load->model('noonreport/noonreport_m');
                $data = $CI->noonreport_m->get_export();
                Settings::setLastModified(date("Y-m-d H:i:s"));                   
                return $this->get_export_json($data, $type);
                break;
            case 'users':
                $CI->load->model('users/user_m');
                $users = $CI->user_m->get_export();
                Settings::setLastModified(date("Y-m-d H:i:s"));                   
                return $this->get_export_csv(array_keys($users[0]), $users, $type);
                break;
        }
    }
}