<?php
// Copyright 2002 Timothy Scott Morizot
//
// This file is part of Easy Firewall Generator for IPTables.
//
// Easy Firewall Generator for IPTables is free software;
// you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// Easy Firewall Generator for IPTables is distributed
// in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// in this distribution; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

/*
 *Check and see if this is the first time the page has been called
 *use the internet interface option to determine this
 *Other than the first time it is called, it is always set.
 *If it is set, then this is a response to a form submission
 *In that case, assume everything is completed
 *If not, reset completed when it's determined it's not completed.
*/
if ($_POST['INET_IFACE'] == "")
{
	$_POST['INET_IFACE']="eth0";
	$COMPLETED="false";
}
else
{
	$COMPLETED="true";
}

/*Check if static or dynamic*/
if ($_POST['DYNAMIC_IP'] == "")
{
	$_POST['DYNAMIC_IP']="true";
	$COMPLETED="false";
}
else if ($_POST['DYNAMIC_IP'] == "false")
{
	if ($_POST['INET_ADDRESS'] == "")
	{
		$COMPLETED="false";
	}
}

//Validate single system or gateway
if ($_POST['GATEWAY'] == "")
{
	$_POST['GATEWAY']="false";
	$COMPLETED="false";
}
else if ($_POST['GATEWAY'] == "true")
{
	//Validate internal interface
	if ($_POST['LOCAL_IFACE'] == "")
	{
		$_POST['LOCAL_IFACE']="eth1";
		$COMPLETED="false";
	}
	//Validate internal IP
	if ($_POST['LOCAL_IP'] == "")
	{
		$_POST['LOCAL_IP']="192.168.1.1";
		$COMPLETED="false";
	}
	//Validate internal network
	if ($_POST['LOCAL_NET'] == "")
	{
		$_POST['LOCAL_NET']="192.168.1.0/24";
		$COMPLETED="false";
	}
	//Validate internal broadcast
	if ($_POST['LOCAL_BCAST'] == "")
	{
		$_POST['LOCAL_BCAST']="192.168.1.255";
		$COMPLETED="false";
	}
	//Check if special section is activated
	//Then validate internal pieces
	if ($_POST['SPECIAL_LAN'] == "true")
	{
		//If no sub-values active, not completed
		if ($_POST['MANGLE_TTL'] == "" && $_POST['TRANSPARENT_PROXY'] == "" &&
			$_POST['BLOCK_OUTBOUND'] == "" && $_POST['INTERNAL_DHCP'] == "" &&
			$_POST['PORT_FORWARD'] == "")
		{
			$COMPLETED="false";
		}

		//If mangle selected, check TTL
		if ($_POST['MANGLE_TTL'] == "true" && $_POST['TTL'] == "")
		{
			$_POST['TTL']="128";
			$COMPLETED="false";
		}

		//If transparent proxy selected, need redirect port
		if ($_POST['TRANSPARENT_PROXY'] == "true" && $_POST['REDIRECT_PORT'] == "")
		{
			$COMPLETED="false";
		}

		if ($_POST['PORT_FORWARD'] == "true")
		{
			if ($_POST['PORT_FORWARD_FROM'] == "")
			{
				$COMPLETED="false";
			}

			if ($_POST['PORT_FORWARD_IP'] == "")
			{
				$COMPLETED="false";
			}

			if ($_POST['PORT_FORWARD_TCP'] == "" && $_POST['PORT_FORWARD_UDP'] == "")
			{
				$_POST['PORT_FORWARD_TCP'] = "true";
				$COMPLETED="false";
			}
		}

		//if block outbound selected, check to see if something
		//is selected.  If not, then it's not completed
		if ($_POST['BLOCK_OUTBOUND'] == "true" && $_POST['IRC_OUT'] == "" &&
			$_POST['TELNET_OUT'] == "" && $_POST['HTTP_OUT'] == "" &&
			$_POST['FTP_OUT'] == "" && $_POST['IM_OUT'] == "" &&
			$_POST['NEWS_OUT'] == "" && $_POST['SSH_OUT'] == "" &&
			$_POST['EMAIL_OUT'] == "")
		{
			$COMPLETED="false";
		}
	}
}

//If inbound allowed checked and none of the sub-values checked
//then it's not completed yet
if ($_POST['INBOUND_ALLOW'] == "true" && $_POST['HTTP_IN'] == "" &&
	$_POST['DNS_IN'] == "" && $_POST['SSH_IN'] == "" &&
	$_POST['FTP_IN'] == "" && $_POST['EMAIL_IN'] == "" &&
	$_POST['EMAILSSL_IN'] == "" && $_POST['NTP_IN'] == "" && 
	$_POST['DHCP_IN'] == "" && $_POST['IM_IN'] == "" && 
	$_POST['MESSENGER_IN'] == "" &&	$_POST['OTHER_IN'] == "" &&
    $_POST['NFS_IN'] == "" && $_POST['MDNSRESPONDER_IN'] == "")
{
	$_POST['SSH_IN'] = "true";
	$COMPLETED = "false";
}

//If passive ftp checked and no ports selected then it's not done
if ($_POST['PASSIVE_IN'] == "true")
{
	if ($_POST['PASSIVE_PORT_FROM'] == "")
	{
		$_POST['PASSIVE_PORT_FROM'] = "62000";
		$COMPLETED = "false";
	}

	if ($_POST['PASSIVE_PORT_TO'] == "")
	{
		$_POST['PASSIVE_PORT_TO'] = "64000";
		$COMPLETED = "false";
	}
}
 
//If ICQ inbound checked and no ports selected then it's not done
if ($_POST['IM_IN'] == "true")
{
	if ($_POST['IM_PORT_FROM'] == "")
	{
		$_POST['IM_PORT_FROM'] = "5000";
		$COMPLETED = "false";
	}

	if ($_POST['IM_PORT_TO'] == "")
	{
		$_POST['IM_PORT_TO'] = "5100";
		$COMPLETED = "false";
	}
}

//If Messenger inbound checked and no ports selected then it's not done
if ($_POST['MESSENGER_IN'] == "true")
{
	if ($_POST['MSN_PORT_FROM'] == "")
	{
		$_POST['MSN_PORT_FROM'] = "6891";
		$COMPLETED = "false";
	}

	if ($_POST['MSN_PORT_TO'] == "")
	{
		$_POST['MSN_PORT_TO'] = "6900";
		$COMPLETED = "false";
	}
}

//If inbound nfs selected and no ports selected, then it's not done
if ($_POST['NFS_IN'] == "true")
{
	if ($_POST['STATD_PORT'] == "")
	{
		$_POST['STATD_PORT'] = "9400";
		$COMPLETED = "false";
	}

	if ($_POST['LOCKD_PORT'] == "")
	{
		$_POST['LOCKD_PORT'] = "9401";
		$COMPLETED = "false";
	}

	if ($_POST['MOUNTD_PORT'] == "")
	{
		$_POST['MOUNTD_PORT'] = "9402";
		$COMPLETED = "false";
	}

	if ($_POST['RQUOTAD_PORT'] == "")
	{
		$_POST['RQUOTAD_PORT'] = "9403";
		$COMPLETED = "false";
	}
}

//If other inbound checked and no ports or protocol selected, then it's
//not ready for prime time.
if ($_POST['OTHER_IN'] == "true")
{
	if ($_POST['OTHER_IN_UDP'] == "" && $_POST['OTHER_IN_TCP'] == "")
	{
		$COMPLETED = "false";
	}
	if ($_POST['OTHER_IN_FROM'] == "")
	{
		$COMPLETED = "false";
	}
}

//if completed return firewall, else redraw form
if ($COMPLETED == "false")
{
	include ('form.inc');
	DrawForm();
}
else
{
	include ('firewall.inc');
}

?>
