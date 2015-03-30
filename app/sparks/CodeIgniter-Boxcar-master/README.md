#Boxcar.io API library for CodeIgniter  
A CodeIgniter library that is a simple port of the Boxcar Provider PHP SDK

##Install
Install the library using sparks

	$ php tools/spark install boxcar


##Usage
In config/boxcar.php set your API key and secret.   
  
In your controller simply load the library and call the API  
   
	$this->load->library('boxcar');

	// send a broadcast (to all your subscribers)
	$broadcast = $this->boxcar->broadcast('Test Name', 'Test Broadcast, this was sent at ' . date('r'));

	var_dump($broadcast);


See the [Boxcar Provider API documentation](http://boxcar.io/help/api/providers) for API details.

Library created by [Ben Edmunds](http://benedmunds.com).