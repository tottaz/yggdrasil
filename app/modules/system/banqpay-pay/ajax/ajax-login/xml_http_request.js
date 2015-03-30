// method that sets up a cross-browser XMLHttpRequest object
function getHTTPObject() {
	var http_object;

	// MSIE Proprietary method

	/*@cc_on
	@if (@_jscript_version >= 5)
		try {
			http_object = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {
			try {
				http_object = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (E) {
				http_object = false;
			}
		}
	@else
		xmlhttp = http_object;
	@end @*/


	// Mozilla and others method

	if (!http_object && typeof XMLHttpRequest != 'undefined') {
		try {
			http_object = new XMLHttpRequest();
		}
		catch (e) {
			http_object = false;
		}
	}

	return http_object;
}