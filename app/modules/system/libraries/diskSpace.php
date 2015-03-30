<?php
/**
 * mb_stripos all occurences
 * based on http://www.php.net/manual/en/function.strpos.php#87061
 *
 * Find all occurrences of a needle in a haystack
 *
 * @param string $haystack
 * @param string $needle
 * @return array or false
*/
class diskSpace  
{
	function __construct( $disk = "/" )  
	{
		$this->the_drive = $disk;
		$this->raw_diskspace = $this->disk_spaces( "total" );
		$this->raw_freespace = $this->disk_spaces( "free" );
		$this->readable_diskspace = $this->readableSizes( $this->raw_diskspace );
		$this->readable_freespace = $this->readableSizes( $this->raw_freespace );
		$this->percentage_free = $this->percentages( "free" );
		$this->percentage_used = $this->percentages( "used" );
		$this->memory_get_rusage = $this->memory_get_usage();
		$this->memory_get_usage = $this->readableSizes( $this->memory_get_rusage );
//		$this->get_server_load = $this->get_server_load();
//		$this->get_server_uptime = $this->get_server_uptime();
	}

	public function disk_spaces( $type )
	{
		switch($type)
		{
			case "total":
				return disk_total_space("/");
				break;
			case "free":
				return disk_free_space("/");
			break;
		}
	}

	public function readableSizes( $size )
	{
		$types = array( ' B', ' KB', ' MB', ' GB', ' TB', ' TB', ' EB', ' ZB', ' YB' );
		$i=0;
		while($size>=1024)
		{
			$size/=1024;
			$i++;
		}
		return("".round($size,2).$types[$i]);  
	}

	public function percentages( $type )
	{
		switch($type)
		{
		case "free":
			return (round($this->raw_freespace / $this->raw_diskspace, 2) * 100) . "%";  
			break;
		case "used":
			return round(100 - $this->percentage_free) . "%";
			break;
		}
	}

	public function memory_get_usage( ) 
	{
		//If its Windows 
		if ( substr(PHP_OS,0,3) == 'WIN') 
		{ 
			if ( substr( PHP_OS, 0, 3 ) == 'WIN' ) 
			{ 
				$output = array(); 
				exec( 'tasklist /FI "PID eq ' . getmypid() . '" /FO LIST', $output ); 
				return preg_replace( '/[\D]/', '', $output[5] ) * 1024; 
			} 
		} 
		else 
		{
			//We now assume the OS is UNIX 
			//Tested on Mac OS X 10.4.6 and Linux Red Hat Enterprise 4 
			//This should work on most UNIX systems 
			$pid = getmypid(); 
			exec("ps -eo%mem,rss,pid | grep $pid", $output); 
			$output = explode("  ", $output[0]); 
			//rss is given in 1024 byte units 
			if(isset($output[1])) return $output[1] * 1024;
			if(isset($output[0])) return $output[0] * 1024; 
		}
	}

	public function get_server_load() 
	{
		if ( substr(PHP_OS,0,3) == 'WIN') 
		{
			$cpu_num = 0;
			$load_total = 0;
			foreach($server as $cpu){
				$cpu_num++;
				$load_total += $cpu->loadpercentage;
			}
			$load = round($load_total/$cpu_num);
		}
		else 
		{
			$sys_load = sys_getloadavg();
			$load = $sys_load[0];
		}
			return (int) $load;
	}

	public function get_server_uptime() 
	{
		if ( substr(PHP_OS,0,3) == 'WIN') 
		{
			return 'WIN';
		} 
		else 
		{
			$uptime = system("uptime");
			return $uptime;
		}
	}
}