<?php
/**
 * Ananas  
 *
 * A simple, fast, contact and software licenses software
 *
 * @package		totta
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/
class Analysis extends Admin_Controller {
	
	protected $ci;

	public function __construct() 
	{
		
		parent::__construct();

		// Load the rest client spark
		$this->load->spark('restclient/2.1.0');
		
		$this->lang->load('analysis');
		
		$this->template
			->title($this->module_details['name'])
			->append_js('module::jquery.fancybox.js');
	}
//
//  Main route display all projects
//
	public function index()
	{
		$this->template
			->title($this->module_details['name'])
			->append_css('module::bootstrap.css')
			->append_js('module::jquery.js')
			->append_js('module::jquery-last.js')
			->append_js('module::jquery.tablesorter.js')
			->append_js('module::table2CSV.js')
			->append_js('module::bootstrap-transition.js')
			->append_js('module::bootstrap-alert.js')
			->append_js('module::bootstrap-modal.js')
			->append_js('module::bootstrap-dropdown.js')
			->append_js('module::bootstrap-scrollspy.js')
			->append_js('module::bootstrap-tab.js')
			->append_js('module::bootstrap-tooltip.js')
			->append_js('module::bootstrap-popover.js')
			->append_js('module::bootstrap-button.js')
			->append_js('module::bootstrap-collapse.js')
			->append_js('module::bootstrap-carousel.js')
			->append_js('module::bootstrap-typeahead.js');
		
		//	$this->rest->debug();
		// Get the content and close the curl session
		$this->template->build('scrape');	
	}

	public function ab() {

//
//		Get projects From Luminoso
//
		// Set config options (only 'server' is required to work)
		$config = array('server'	=>	'http://localhost:5000/');
		// Run some setup
		$this->rest->initialize($config);
		
		$param = array('luminoso_account' => Settings::get('luminoso_account'), 
						'luminoso_user_name' => Settings::get('luminoso_user_name'),
						'luminoso_password' => Settings::get('luminoso_password'));
		$this->template->projects = json_decode($this->rest->get('api/v1.0/get_projects', $param), true);
		
		//	$this->rest->debug();
		// Get the content and close the curl session

		$this->template->build('ab');
	}

	public function alchemynews() {
	// Load template details
			$this->template
				->title($this->module_details['name'])
				->append_css('module::bootstrap-switch.min.css')
//				->append_js('module::jquery/jquery.fancybox.js')
				->append_js('module::bootstrap-switch.min.js');

		$this->template->build('alchemynews');
	}


//
// Create a new Alchemy project
//
	public function get_alchemy_sentiment() {

		// Load the rest client spark
		$this->load->spark('restclient/2.1.0');
		// Load the library
		$this->load->library('rest');
		
		$config = array('server' =>	Settings::get('alchemy_url'));
		// Run some setup
		$this->rest->initialize($config);
		
		// Adjust the settings
		$param[] = 'apikey=' . Settings::get('alchemy_api');
		$param[] = 'sourceText=cleaned'; // The url of the page
		$param[] = 'outputMode=json'; // Return JSON
		$param[] = 'showSourceText=1'; // Return the source text
		$param[] = 'url=' . urlencode($_POST['url']); // Return the source text

		$sentiments = $this->rest->get(Settings::get('alchemy_get_text_sentiment'), implode('&', $param));

		// Debug
		$this->rest->debug();

		$sentiments = json_decode(json_encode($sentiments), true);

		if (!empty($sentiments)) {

			
			$result = '<div class=\"row\">
	  					<div class=\"col-md-6\">';
	  		
			if (isset($sentiments['url'])) {
				echo '<p><b>Language: ' . str_replace("\n", '<br>', $sentiments['url']) . '</b></p>';
			}

			if (isset($sentiments['language'])) {
				echo '<p><b>Language: ' . $sentiments['language'] . '</b></p>';
			}
			
			if (isset($sentiments['text'])) {
				echo '<p><b>Text: ' . str_replace("\n", '<br>', $sentiments['text']) . '</b></p>';
			}

			if (isset($sentiments['docSentiment']) && is_array($sentiments['docSentiment'])) {

				$result .= '<table class="table table-striped">
							 <thead>
							    <tr>
							     <th>Type</th>
							     <th>Score</th>
							      <th>Relevance</th>
							  <tr>
							  </thead>
							 <tbody>';

				$result .= '<tr><td>';
				$result .= $sentiments['docSentiment']['type'];
				$result .= '</td><td>';
				$result .= $sentiments['docSentiment']['score'];
				$result .= '</td><td>';
				$result .= $sentiments['docSentiment']['mixed'];
				$result .= '</td></tr>';
				$result .= '  </tbody></table></div></div>';
			}
		}
			echo "Alchemy Sentiment results</br>";
			echo $result; 
			die();
	}

//
// Create a new Alchemy project
//
	public function get_alchemy_contentscrape() {

		// Load the rest client spark
		$this->load->spark('restclient/2.1.0');
		// Load the library
		$this->load->library('rest');
		
		$config = array('server'	=>	Settings::get('alchemy_url'));
		// Run some setup
		$this->rest->initialize($config);
		
		// Adjust the settings
		$param[] = 'apikey=' . Settings::get('alchemy_api');
		$param[] = 'sourceText=cleaned'; // The url of the page
		$param[] = 'outputMode=json'; // Return JSON
		$param[] = 'showSourceText=1'; // Return the source text
		$param[] = 'url=' . urlencode($_POST['url']); // Return the source text
		$param[] = 'cquery=' . $_POST['cquery']; // Return the source text
		
		$queryresults = $this->rest->get(Settings::get('alchemy_get_content_scraping'), implode('&', $param));

		// Debug
//		$this->rest->debug();

		$queryresults = json_decode(json_encode($queryresults), true);

		if (!empty($queryresults)) {

			
			$result = '<div class=\"row\">
	  					<div class=\"col-md-8\">';
	  		
			if (isset($queryresults['url'])) {
				echo '<p><b>Url: ' . str_replace("\n", '<br>', $queryresults['url']) . '</b></p>';
			}

			if (isset($queryresults['queryResults']) && is_array($queryresults['queryResults'])) {
				$result .= '<table class="table table-striped">
							 <thead>
							    <tr>
							     <th>Text</th>
							     <th>URL</th>
							  </tr>
							  </thead>
							 <tbody>';
				foreach ($queryresults['queryResults'] as $entity) {
					$result .= '<tr><td>';
					$result .= $entity['resultText'];
					$result .= '</td><td>';
					$result .= $entity['resultURL'];
					$result .= '</td></tr>';
				}
				$result .= '</tbody></table></div></div>';
			}
		}
			echo "Alchemy Content Scrapes</br>";
			echo $result; 
			die();
	}


//
// Create a new Alchemy project
//
	public function get_alchemy_news() {

		// Load the rest client spark
		$this->load->spark('restclient/2.1.0');
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
			$param[] = 'schema.enriched.url.title=' . urlencode($_GET['title']); // Return the source text
		}
		if (!empty($_GET['textstring'])) {
			$param[] = 'schema.enriched.url.text=' . urlencode($_GET['textstring']); // Return the source text
		}

		$querystring = "";

		$querystring = 'label_format_string=schema.enriched.url.title,schema.enriched.url.url';

		if (!empty($_GET['descriptionss'])) {
			$querystring .= ',schema.enriched.url.text';
		}

		if (!empty($_GET['authorss'])) {
			$querystring .= ',schema.enriched.url.author';
		}

		if (!empty($_GET['imagess'])) {
			$querystring .= ',schema.enriched.url.image';
		}

		if (!empty($_GET['keywordss'])) {
			$querystring .= ',schema.enriched.url.keywords';
		}

		$param[] = $querystring;

		$queryresults = $this->rest->get(Settings::get('alchemy_get_news'), implode('&', $param));
		
		// Debug
//			$this->rest->debug();

		$queryresults = json_decode(json_encode($queryresults), true);

		if (!empty($queryresults)) {

			$result = '<div class=\"row\">
	  					<div class=\"col-md-8\">';

			if (isset($queryresults['status'])) {
				$result .= '<p><b>Status: ' . str_replace("\n", '<br>', $queryresults['status']) . '</b></p>';
			}
	  		
			if (isset($queryresults['result']['docs']) && is_array($queryresults['result']['docs'])) {

				foreach ($queryresults['result']['docs'] as $newsrow) {

					if (isset($newsrow['source']['schema.enriched']['url']['title'])) {
						$result .= '<p><b>Title: </b><a href=' . $newsrow['source']['schema.enriched']['url']['url'] . ' target=new>' . $newsrow['source']['schema.enriched']['url']['title'] . '</a></p>';
					}

					if (isset($newsrow['source']['schema.enriched']['url']['text'])) {
						$result .= '</p><b>Description:</b> ' . str_replace("\n", '<br>', $newsrow['source']['schema.enriched']['url']['text']) . '</p>';
					}

					if (isset($newsrow['source']['schema.enriched']['url']['author'])) {
						$result .= '<p><b>Author: </b>' . str_replace("\n", '<br>', $newsrow['source']['schema.enriched']['url']['author']) . '</p>';
					}

					if (isset($newsrow['source']['schema.enriched']['url']['image'])) {
						$result .= '<p><b>IMAGE: </b> <img src=' . $newsrow['source']['schema.enriched']['url']['image'] . '><a></p>';
					}

					if (!empty($newsrow['source']['schema.enriched']['url']['keywords'])) {					

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

						foreach ($newsrow['source']['schema.enriched']['url']['keywords'] as $entity) {
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

//
// Delete a project
// 
	public function luminoso_altest() {

		// Set config options (only 'server' is required to work)
		$config = array('server' =>	'http://localhost:5000/');
		
		// Run some setup
		$this->rest->initialize($config);
		
		$this->rest->format('application/json');
		
		$param = array('project_name' => $_POST['project'],
						'article_text' => $_POST['article_text'],
						'luminoso_account' => Settings::get('luminoso_account'), 
						'luminoso_user_name' => Settings::get('luminoso_user_name'),
						'luminoso_password' => Settings::get('luminoso_password'));
		
		$correlations = json_decode($this->rest->get('api/v1.0/get_correlation', $param), true);
		
		// Debug
		//$this->rest->debug();

		$param = array('project_name' => $_POST['project1'],
						'article_text' => $_POST['article_text1'],
						'luminoso_account' => Settings::get('luminoso_account'), 
						'luminoso_user_name' => Settings::get('luminoso_user_name'),
						'luminoso_password' => Settings::get('luminoso_password'));
		
		$correlations1 = json_decode($this->rest->get('api/v1.0/get_correlation', $param), true);
		
		// Debug
		//$this->rest->debug();

		$result = "<div class=\"row\">
  					<div class=\"col-md-6\">
					<table class=\"table table-striped\">
						<thead>
							<th>Topic</th>
							<th>Score</th>
						</thead>
					<tbody>";

		foreach ($correlations as $correlation) {		
			$result .= "<tr><td>";
			$result .= $correlation[0][0];
			$result .= "</td><td>";
			$result .= $correlation[0][1];
			$result .= "</td></tr>";
		}

		$result .= "</tbody></table></div>";

		$result .= "<div class=\"col-md-6\">
					<table class=\"table table-striped\">
						<thead>
							<th>Topic</th>
							<th>Score</th>
						</thead>
					<tbody>";

		foreach ($correlations1 as $correlation1) {		
			$result .= "<tr><td>";
			$result .= $correlation1[0][0];
			$result .= "</td><td>";
			$result .= $correlation1[0][1];
			$result .= "</td></tr>";
		}

		$result .= "</tbody></table></div></div>";

		echo "Correlation compare results</br>";
		echo $result; 
		die();
	}


	public function get_alchemy_screenscape($url, $dest) {
		
		// Set the variables
		$loadtime = microtime(true);
		
		// Return false if apikey not set or file exists
		if (!Settings::get('alchemy_api') || !$url || file_exists($dest)) return false;

		// Load the rest client spark
		$this->load->spark('restclient/2.1.0');
		// Load the library
		$this->load->library('rest');
		
		$config = array('server'	=>	Settings::get('alchemy_url'));
		// Run some setup
		$this->rest->initialize($config);
		
		// Adjust the settings
		$param[] = 'apikey=' . Settings::get('alchemy_api');
		$param[] = 'sourceText=cleaned'; // The url of the page
		$param[] = 'outputMode=json'; // Return JSON
		$param[] = 'showSourceText=1'; // Return the source text
		$param[] = 'url=' . urlencode($url); // Return the source text
		
		$json = json_encode($this->rest->get(Settings::get('alchemy_get_named_entities'), implode('&', $param)), true);

		// Set the results
		if ($json) {
			if (file_exists($dest)) @unlink($dest);
			
			//
			// Put data content in the file
			//

			@file_put_contents($dest, $json, FILE_APPEND | LOCK_EX);
			
			return Array(
				'loadtime' => round((microtime(true) - $loadtime) * 1000),
				'size' => filesize($dest)
			);
		}
		else {
			log_message('debug', 'No results from Alchemy');
			return false;
		}
	}
	
	//
	//  Get correlation/score of a text field
	//
	public function get_corralation() {
	
		// Set config options (only 'server' is required to work)
		$config = array('server' =>	'http://localhost:5000/');
		
		// Run some setup
		$this->rest->initialize($config);
		
		$this->rest->format('application/json');

		$param = array('project_name' => $_POST['project'],
						'article_text' => $_POST['article_text'],
						'luminoso_account' => Settings::get('luminoso_account'), 
						'luminoso_user_name' => Settings::get('luminoso_user_name'),
						'luminoso_password' => Settings::get('luminoso_password'));
		
		$correlations = json_decode($this->rest->get('api/v1.0/get_correlation', $param), true);
		
		// Debug
		//$this->rest->debug();


		$result = "<div class=\"row\">
  					<div class=\"col-md-6\">
					<h2 class=\"green_title\"><?php echo __('luminoso:score') ?></h2>
					<table class=\"table table-striped\">
						<thead>
							<th><?php echo __('luminoso:topic') ?></th>
							<th><?php echo __('luminoso:score') ?></th>
						</thead>
					<tbody>";

		foreach ($correlations as $correlation) {
		
			$result .= "<tr><td>";
			$result .= $correlation[0][0];
			$result .= "</td><td>";
			$result .= $correlation[0][1];
			$result .= "</td></tr></div></div>";
		
		}

		$result .= "</tbody></table>";

		echo "Correlation results</br>";
		echo $result; 
		die();
	}

	public function check_graph() {

		$this->template
			->title($this->module_details['name'])
			->append_css('module::stylegraph.css');
		
		//	$this->rest->debug();
		// Get the content and close the curl session
		$this->template->build('graph');	
	}
}