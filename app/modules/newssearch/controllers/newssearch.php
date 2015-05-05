<?php defined('BASEPATH') OR exit('No direct script access allowed');
/** 
 *
 * @package		yggdrasil
 * @author		torbjorn zetterlund
// ------------------------------------------------------------------------
*/

class Newssearch extends Admin_Controller {
	
	protected $ci;

	public function __construct() 
	{
		
		parent::__construct();

		// Load the rest client spark
		//$this->load->spark('restclient/2.1.0');
		
		$this->lang->load('analysis');
	}

	public function index() {
	// Load template details
			$this->template
				->title($this->module_details['name'])
				->append_css('module::bootstrap-switch.min.css')
				->append_js('module::bootstrap-switch.min.js');

		$this->template->build('newssearch');
	}

//
// Create a new Alchemy project
//
	public function get_alchemy_news() {

		// Load the library
		$this->load->library('rest');
		
		$config = array('server' =>	Settings::get('alchemy_url'));
		// Run some setup
		$this->rest->initialize($config);
		
		// Adjust the settings
		$param[] = 'apikey=' . Settings::get('alchemy_news_api');
		$param[] = 'outputMode=json'; // Return JSON
		$param[] = 'compact=1'; //compact mode
		$param[] = 'start=' . urlencode($_GET['start']); // Start Day
		$param[] = 'end=' . urlencode($_GET['end']); // End date
		$param[] = 'maxResults=' . urlencode($_GET['maxresults']); // How many items

		if (!empty($_GET['title'])) {
			$param[] = 'enriched.url.title=' . urlencode($_GET['title']); // Return the source text
		}
		if (!empty($_GET['textstring'])) {
			$param[] = 'enriched.url.text=' . urlencode($_GET['textstring']); // Return the source text
		}

		$querystring = "";

		$querystring = 'label_format_string=enriched.url.title,enriched.url.url';

		if (!empty($_GET['descriptionss'])) {
			$querystring .= ',enriched.url.text';
		}

		if (!empty($_GET['authorss'])) {
			$querystring .= ',enriched.url.author';
		}

		if (!empty($_GET['imagess'])) {
			$querystring .= ',enriched.url.image';
		}

		if (!empty($_GET['keywordss'])) {
			$querystring .= ',enriched.url.keywords';
		}

		$param[] = $querystring;

		$queryresults = $this->rest->get(Settings::get('alchemy_get_news'), implode('&', $param));
		
		// Debug
//		$this->rest->debug();

		$queryresults = json_decode(json_encode($queryresults), true);

		if (!empty($queryresults)) {

			$result = '<div class=\"row\">
	  					<div class=\"col-md-8\">';

			if (isset($queryresults['status'])) {
				$result .= '<p><b>Status: ' . str_replace("\n", '<br>', $queryresults['status']) . '</b></p>';
			}
	  		
			if (isset($queryresults['result']['docs']) && is_array($queryresults['result']['docs'])) {

				foreach ($queryresults['result']['docs'] as $newsrow) {

					$result .= '<div class="jumbotron"><pre>';

					if (isset($newsrow['source']['enriched']['url']['title'])) {
						$result .= '<p><b>Title: </b><a href=' . $newsrow['source']['enriched']['url']['url'] . ' target=new>' . $newsrow['source']['enriched']['url']['title'] . '</a></p>';
					}

					if (isset($newsrow['source']['enriched']['url']['text'])) {
						$result .= '</p><b>Description:</b> ' . str_replace("\n", '<br>', $newsrow['source']['enriched']['url']['text']) . '</p>';
					}

					if (isset($newsrow['source']['enriched']['url']['author'])) {
						$result .= '<p><b>Author: </b>' . str_replace("\n", '<br>', $newsrow['source']['enriched']['url']['author']) . '</p>';
					}

					if (isset($newsrow['source']['enriched']['url']['image'])) {
						$result .= '<p><b>IMAGE: </b> <img src=' . $newsrow['source']['enriched']['url']['image'] . '><a></p>';
					}

					if (!empty($newsrow['source']['enriched']['url']['keywords'])) {					

						$result .= '<table class="table table-striped">
								 <thead>
								    <tr>
								     <th>Keyword</th>
								     <th>Relevance</th>
								     <th>Sentiment</th>
								     <th>Sentiment Score</th>
								     <th>Sentiment Type</th>
								  </tr>
								  </thead>
								 <tbody>';

						foreach ($newsrow['source']['enriched']['url']['keywords'] as $entity) {
							$result .= '<tr><td>';
							$result .= $entity['text'];
							$result .= '</td><td>';
							$result .= $entity['relevance'];
							$result .= '</td><td>';
							$result .= $entity['sentiment']['mixed'];
							$result .= '</td><td>';
							$result .= $entity['sentiment']['score'];
							$result .= '</td><td>';
							$result .= $entity['sentiment']['type'];
							$result .= '</td></tr>';
						}
						$result .= '</tbody></table>';
					}
					$result .= '</pre><button type="button" class="btn btn-primary">Save</button></div>';
				}
				$result .= '</div></div>';
			}
		}
		echo "Query String that you can add to a feed<br>";
		$queryparam = 'start=' . urlencode($_GET['start']); // Start Day
		$queryparam .= '&end=' . urlencode($_GET['end']); // End date
		$queryparam .= '&maxResults=' . urlencode($_GET['maxresults']); // How many items
		$queryparam .= '&outputMode=json'; // Return JSON
		$queryparam .= '&compact=1'; //compact mode
		$queryparam .= '&' . $querystring;
		echo $queryparam;
		echo "<br><br><b>Alchemy News</b></br>";
		if (!empty($result)) {
			echo $result; 
		}
		die();
	}
}
