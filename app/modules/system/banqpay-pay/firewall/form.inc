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

function DrawForm()
{
	print("<?xml version=\"1.0\"?>\n");	
	print("<!DOCTYPE html PUBLIC\n");
	print("  \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n");
	print("  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n");

	print("<html xmlns=\"http://www.w3.org/1999/xhtml\">\n");
	print("<head>\n");
	print("<meta name=\"Author\" content=\"Scott Morizot\" />\n");
	print("<title>Easy Firewall Generator for iptables</title>\n");
	print("</head>\n");

	print("<body>\n");

	print("<SCRIPT LANGUAGE=\"JavaScript\">\n");
	print("<!-- hide from JavaScript-challenged browsers\n");
	print("  function openHelp(helpFile,helpName) {\n");
	print("    popupWin = window.open(helpFile,helpName,'scrollbars,resizable,width=400,height=600');\n");
	print("  }\n");
	print("// done hiding -->\n");
	print("</SCRIPT>\n");

	print("<h1 align=\"center\">Easy Firewall Generator for IPTables</h1>\n");
	print("<h2 align=\"center\">Version 1.17</h2>\n");
	print("<h3 align=\"center\"><i>Release Date: 05/11/2005</i> - ");
	print("<a href=\"CHANGELOG\" target=\"_blank\">CHANGELOG</a>");
	print("</h3>\n");

	print("<p>This program generates an <strong>iptables</strong> firewall script\n");
	print("for use with the 2.4 or later linux kernel.  It is intended for use on a single\n");
	print("system connected to the Internet or a gateway system for a private, internal\n");
	print("network.  It provides a range of options, but is not intended to cover\n");
	print("every possible situation.  Make sure you understand what each option in the\n");
	print("generator does and take the time to read the comments in the resulting\n");
	print("firewall.  This generator will not, for example, generate a firewall\n");
	print("suitable for use with a DMZ, but it can provide a starting point.\n");
	print("For the most common uses the generator should produce a firewall\n");
	print("ready for use.</p>\n\n");
	
	print("<p><a href=\"iptables-info.html\" target=\"_blank\">Read here</a> for more information\n");
	print("on iptables firewalls.</p>\n\n");

	print("<p>Easy Firewall Generator implements \n");
	print("<a href=\"javascript:openHelp('credits.html','credits');\">\n");
	print("several ideas</a> presented in Oskar Andreasson's iptables-tutorial.\n");
	print("The link to his tutorial is maintained on the resources page below.</p>\n");

	print("<p><a href=\"resources.html\" target=\"_blank\">Links</a> to additional firewall resources.</p>\n");

	print("<p>Select the desired options and click the <strong>Generate Firewall!</strong>\n");
	print("button.  If your choices require additional input, the Options will redisplay,\n");
	print("perhaps with more options displayed.  When the options are in a completed state\n");
	print("the firewall will be returned as a text document.  Save the result as iptables\n");
	print("for redhat systems or rc.firewall for many others.</p>\n\n");

	print("<form action=\"" . $_SERVER['PHP_SELF'] . "\" method=\"post\">\n");

	//Define Internet Interface
	print("<p>Internet Interface: ");
	print("<input type=\"text\" name=\"INET_IFACE\" value=\"");
	print($_POST['INET_IFACE'] . "\" size=\"6\" tabindex=\"1\" />\n"); 
	print("<a href=\"javascript:openHelp('help-interface.html','interfaces');\">Help</a></p>\n");

	//Static or Dynamic Internet Address?
	print("<p><strong>Select Type of Internet Address</strong>\n");
	print("<a href=\"javascript:openHelp('help-dynamic.html','dynamic');\">Help</a><br />\n");
	print("<input type=\"radio\" name=\"DYNAMIC_IP\" value=\"false\" tabindex=\"2\" ");
	if ($_POST['DYNAMIC_IP'] == "false")
	{
		print("checked=\"true\" ");
	}
	print("/> Static Internet IP Address ");
	if ($_POST['DYNAMIC_IP'] == "false")
	{
		print("<input type=\"text\" name=\"INET_ADDRESS\" value=\"");
		print($_POST['INET_ADDRESS'] . "\" size=\"15\" tabindex=\"3\" />");
		print("<a href=\"javascript:openHelp('help-ipaddress.html','ipaddress');\">Help</a>\n");
	}
	print("<br />\n"); 

	print("<input type=\"radio\" name=\"DYNAMIC_IP\" value=\"true\" tabindex=\"4\" ");
	if ($_POST['DYNAMIC_IP'] == "true")
	{
		print("checked=\"true\" ");
	}
	print("/> Dynamic Internet IP Address</p>\n");

	//Single sytem or gateway/firewall for LAN?
	print("<p><strong>Single System or Private Network Gateway?</strong>\n");
	print("<a href=\"javascript:openHelp('help-gateway.html','gateway');\">Help</a><br />\n");
	print("<input type=\"radio\" name=\"GATEWAY\" value=\"false\" tabindex=\"5\" ");
	if ($_POST['GATEWAY'] == "false")
	{
		print("checked=\"true\" ");
	}
	print("/> Single System <br />\n");
	print("<input type=\"radio\" name=\"GATEWAY\" value=\"true\" tabindex=\"6\" ");
	if ($_POST['GATEWAY'] == "true")
	{
		print("checked=\"true\" ");
	}
	print("/> Gateway/Firewall ");
	if ($_POST['GATEWAY'] == "true")
	{
		//Private network values
		print("<br />\n<ol type=\"a\">\n");
		print("<li>Internal Network Interface: <input type=\"text\" name=\"LOCAL_IFACE\" ");
		print("value=\"" . $_POST['LOCAL_IFACE'] . "\" size=\"6\" tabindex=\"7\" />\n");
		print("<a href=\"javascript:openHelp('help-interface.html','interfaces');\">Help</a></li>\n");
		print("<li>Internal Network IP Address: <input type=\"text\" name=\"LOCAL_IP\" ");
		print("value=\"" . $_POST['LOCAL_IP'] . "\" size=\"15\" tabindex=\"8\" />\n");
		print("<a href=\"javascript:openHelp('help-ipaddress.html','ipaddress');\">Help</a></li>\n");
		print("<li>Internal Network: <input type=\"text\" name=\"LOCAL_NET\" ");
		print("value=\"" . $_POST['LOCAL_NET'] . "\" size=\"20\" tabindex=\"9\" />\n");
		print("<a href=\"javascript:openHelp('help-network.html','network');\">Help</a></li>\n");
		print("<li>Internal Network Broadcast: <input type=\"text\" name=\"LOCAL_BCAST\" ");
		print("value=\"" . $_POST['LOCAL_BCAST'] . "\" size=\"15\" tabindex=\"10\" />\n");
		print("<a href=\"javascript:openHelp('help-broadcast.html','broadcast');\">Help</a></li></ol></p>\n");

		//Also add options that apply to internal network
		print("<p><input type=\"checkbox\" name=\"SPECIAL_LAN\" value=\"true\" tabindex=\"100\" ");
		if ($_POST['SPECIAL_LAN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> <strong>Advanced Network Options</strong> \n");
		print("<a href=\"javascript:openHelp('help-advanced.html','advanced');\">Help</a>\n");
		if ($_POST['SPECIAL_LAN'] == "true") //Provide advanced options
		{
			print("<br />\n<ul>\n");

			//Operate an internal dhcp server
			print("<li><input type=\"checkbox\" name=\"INTERNAL_DHCP\" value=\"true\" tabindex=\"101\" ");
			if ($_POST['INTERNAL_DHCP'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> Internal DHCP Server ");
			print("\n<a href=\"javascript:openHelp('help-internaldhcp.html','internaldhcp');\">Help</a>\n");
			print("</li>\n");

			//Mangle the TTL option
			print("<li><input type=\"checkbox\" name=\"MANGLE_TTL\" value=\"true\" tabindex=\"102\" ");
			if ($_POST['MANGLE_TTL'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> Mangle the Packet TTL ");
			if ($_POST['MANGLE_TTL'] == "true")
			{
				print("- <i>TTL:</i> ");
				print("<input type=\"text\" name=\"TTL\" ");
				print("value=\"" . $_POST['TTL'] . "\" size=\"4\" tabindex=\"103\" />");
			}
			print("\n<a href=\"javascript:openHelp('help-manglettl.html','manglettl');\">Help</a>\n");
			print("</li>\n");

			//Transparent Proxy
			print("<li><input type=\"checkbox\" name=\"TRANSPARENT_PROXY\" value=\"true\" tabindex=\"104\" ");
			if ($_POST['TRANSPARENT_PROXY'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> Transparent Web Proxy ");
			if ($_POST['TRANSPARENT_PROXY'] == "true")
			{
				print("- <i>Redirect Port:</i> ");
				print("<input type=\"text\" name=\"REDIRECT_PORT\" ");
				print("value=\"" . $_POST['REDIRECT_PORT'] . "\" size=\"6\" tabindex=\"105\" />");
			}
			print("\n<a href=\"javascript:openHelp('help-redirect.html','redirect');\">Help</a>\n");
			print("</li>\n");

			//Port forwarding to internal system
			print("<li><input type=\"checkbox\" name=\"PORT_FORWARD\" value=\"true\" tabindex=\"106\" ");
			if ($_POST['PORT_FORWARD'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> Enable Port Forwarding to an Internal System ");
			print("\n<a href=\"javascript:openHelp('help-portforward.html','portforward');\"> Help</a>\n");
			if ($_POST['PORT_FORWARD'] == "true")
			{
				print("<ul><li><i>Port:</i> ");
				print("<input type=\"text\" name=\"PORT_FORWARD_FROM\" ");
				print("value=\"" . $_POST['PORT_FORWARD_FROM'] . "\" size=\"6\" tabindex=\"107\" />");
				print(" <i>(Optional) To:</i> ");
				print("<input type=\"text\" name=\"PORT_FORWARD_TO\" ");
				print("value=\"" . $_POST['PORT_FORWARD_TO'] . "\" size=\"6\" tabindex=\"108\" />");
				print("<input type=\"checkbox\" name=\"PORT_FORWARD_TCP\" ");
				print("value=\"true\" tabindex=\"109\" ");
				if ($_POST['PORT_FORWARD_TCP'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> TCP ");
				print("<input type=\"checkbox\" name=\"PORT_FORWARD_UDP\" ");
				print("value=\"true\" tabindex=\"110\" ");
				if ($_POST['PORT_FORWARD_UDP'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> UDP</li>");
				print("<li><i>Internal IP:</i> ");
				print("<input type=\"text\" name=\"PORT_FORWARD_IP\" ");
				print("value=\"" . $_POST['PORT_FORWARD_IP'] . "\" size=\"15\" tabindex=\"111\" />");
				print(" <i>(Optional) Internal Port:</i> ");
				print("<input type=\"text\" name=\"PORT_FORWARD_IPORT\" ");
				print("value=\"" . $_POST['PORT_FORWARD_IPORT'] . "\" size=\"6\" tabindex=\"112\" />");
				print("</li>\n");
				if ($_POST['DYNAMIC_IP'] == "false")
				{
					print("<li><input type=\"checkbox\" name=\"PORT_FORWARD_REDIRECT_INTERNAL\" ");
					print("value=\"true\" tabindex=\"113\" ");
					if ($_POST['PORT_FORWARD_REDIRECT_INTERNAL'] == "true")
					{
						print("checked=\"true\" ");
					}
					print("/> Also redirect internal requests to the firewall\n");
					print("<a href=\"javascript:openHelp('help-pfinternalredirect.html','pfinternalredirect');\">\n");
					print("Help</a></li>\n");
				}
				print("</ul>\n");
			}
			print("</li>\n");

			//Block outbound services
			print("<li><input type=\"checkbox\" name=\"BLOCK_OUTBOUND\" value=\"true\" tabindex=\"200\" ");
			if ($_POST['BLOCK_OUTBOUND'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> Block Outbound Services \n");
			print("<a href=\"javascript:openHelp('help-blockout.html','blockout');\">Help</a>\n");
			if ($_POST['BLOCK_OUTBOUND'] == "true")
			{
				//Individual services
				print("<br />\n<ul type=\"square\">\n");
				
				//IRC
				print("<li><input type=\"checkbox\" name=\"IRC_OUT\" value=\"true\" tabindex=\"201\" ");
				if ($_POST['IRC_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> IRC </li>");

				//Telnet
				print("<li><input type=\"checkbox\" name=\"TELNET_OUT\" value=\"true\" tabindex=\"202\" ");
				if ($_POST['TELNET_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> Telnet </li>");

				//HTTP
				print("<li><input type=\"checkbox\" name=\"HTTP_OUT\" value=\"true\" tabindex=\"203\" ");
				if ($_POST['HTTP_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> HTTP </li>");

				//FTP
				print("<li><input type=\"checkbox\" name=\"FTP_OUT\" value=\"true\" tabindex=\"204\" ");
				if ($_POST['FTP_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> FTP </li>");

				//Instant Messenger
				print("<li><input type=\"checkbox\" name=\"IM_OUT\" value=\"true\" tabindex=\"205\" ");
				if ($_POST['IM_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> Instant Messenger </li>");

				//NNTP
				print("<li><input type=\"checkbox\" name=\"NEWS_OUT\" value=\"true\" tabindex=\"206\" ");
				if ($_POST['NEWS_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> Usenet News </li>");

				//Email
				print("<li><input type=\"checkbox\" name=\"EMAIL_OUT\" value=\"true\" tabindex=\"207\" ");
				if ($_POST['EMAIL_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> Email </li>");

				//SSH
				print("<li><input type=\"checkbox\" name=\"SSH_OUT\" value=\"true\" tabindex=\"208\" ");
				if ($_POST['SSH_OUT'] == "true")
				{
					print("checked=\"true\" ");
				}
				print("/> SSH </li>");

				print("</ul>\n");
			}
			print("</li>\n</ul>\n");
		}
		print("</p>\n");
	}
	print("</p>\n"); 
	
	//Allow inbound services
	print("<p><input type=\"checkbox\" name=\"INBOUND_ALLOW\" value=\"true\" tabindex=\"300\" ");
	if ($_POST['INBOUND_ALLOW'] == "true")
	{
		print("checked=\"true\" ");
	}
	print("/> <strong>Allow Inbound Services</strong> \n");
	print("<a href=\"javascript:openHelp('help-allowin.html','allowin');\">Help</a>\n");
	if ($_POST['INBOUND_ALLOW'] == "true")
	{
		//Individual services
		print("<br />\n<ul type=\"square\">\n");
		
		//SSH
		print("<li><input type=\"checkbox\" name=\"SSH_IN\" value=\"true\" tabindex=\"301\" ");
		if ($_POST['SSH_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> SSH </li>");

		//DNS
		print("<li><input type=\"checkbox\" name=\"DNS_IN\" value=\"true\" tabindex=\"302\" ");
		if ($_POST['DNS_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> DNS Server ");
		print("<a href=\"javascript:openHelp('help-dnsserver.html','dnsserver');\"> Help</a>\n");
		print("</li>\n");

		//HTTP
		print("<li><input type=\"checkbox\" name=\"HTTP_IN\" value=\"true\" tabindex=\"303\" ");
		if ($_POST['HTTP_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> Web Server ");

		//SSL HTTP
		print("<input type=\"checkbox\" name=\"HTTPSSL_IN\" value=\"true\" tabindex=\"304\" ");
		if ($_POST['HTTPSSL_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> with SSL</li>");

		//FTP
		print("<li><input type=\"checkbox\" name=\"FTP_IN\" value=\"true\" tabindex=\"305\" ");
		if ($_POST['FTP_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> FTP Server ");

		//Passive FTP
		print("<input type=\"checkbox\" name=\"PASSIVE_IN\" value=\"true\" tabindex=\"306\" ");
		if ($_POST['PASSIVE_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> Allow Passive FTP Connections? ");

		//Passive Ports
		if ($_POST['PASSIVE_IN'] == "true")
		{
			print("Ports: ");
			print("<input type=\"text\" name=\"PASSIVE_PORT_FROM\" ");
			print("value=\"");
			print($_POST['PASSIVE_PORT_FROM']);
			print("\" size=\"6\" tabindex=\"307\" />");

			print(" to ");
			print("<input type=\"text\" name=\"PASSIVE_PORT_TO\" ");
			print("value=\"");
			print($_POST['PASSIVE_PORT_TO']);
			print("\" size=\"6\" tabindex=\"308\" />");
		}
		print("<a href=\"javascript:openHelp('help-passiveftp.html','passiveftp');\"> Help</a>\n");
		print("</li>\n");

		//Email
		print("<li><input type=\"checkbox\" name=\"EMAIL_IN\" value=\"true\" tabindex=\"309\" ");
		if ($_POST['EMAIL_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> Email Server ");

		//SSL Email
		print("<input type=\"checkbox\" name=\"EMAILSSL_IN\" value=\"true\" tabindex=\"310\" ");
		if ($_POST['EMAILSSL_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> with SSL</li>");

		//NTP
		print("<li><input type=\"checkbox\" name=\"NTP_IN\" value=\"true\" tabindex=\"311\" ");
		if ($_POST['NTP_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> Time Server (NTP) </li>");

		//External DHCP Server
		print("<li><input type=\"checkbox\" name=\"DHCP_IN\" value=\"true\" tabindex=\"312\" ");
		if ($_POST['DHCP_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> DHCP Server (on the Internet interface) </li>");

		//Inbound instant messaging
		print("<li><input type=\"checkbox\" name=\"IM_IN\" value=\"true\" tabindex=\"313\" ");
		if ($_POST['IM_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> ICQ & AIM File Transfers ");

		//Instant Messaging Ports
		if ($_POST['IM_IN'] == "true")
		{
			print("Ports: ");
			print("<input type=\"text\" name=\"IM_PORT_FROM\" ");
			print("value=\"");
			print($_POST['IM_PORT_FROM']);
			print("\" size=\"6\" tabindex=\"314\" />");

			print(" to ");
			print("<input type=\"text\" name=\"IM_PORT_TO\" ");
			print("value=\"");
			print($_POST['IM_PORT_TO']);
			print("\" size=\"6\" tabindex=\"315\" />");
		}
		print("<a href=\"javascript:openHelp('help-imports.html','imports');\"> Help</a>\n");
		print("</li>\n");

		//Inbound msn messenger file transfers
		print("<li><input type=\"checkbox\" name=\"MESSENGER_IN\" value=\"true\" tabindex=\"316\" ");
		if ($_POST['MESSENGER_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> MSN Messenger File Transfers ");

		//Messenger Ports
		if ($_POST['MESSENGER_IN'] == "true")
		{
			print("Ports: ");
			print("<input type=\"text\" name=\"MSN_PORT_FROM\" ");
			print("value=\"");
			print($_POST['MSN_PORT_FROM']);
			print("\" size=\"6\" tabindex=\"317\" />");

			print(" to ");
			print("<input type=\"text\" name=\"MSN_PORT_TO\" ");
			print("value=\"");
			print($_POST['MSN_PORT_TO']);
			print("\" size=\"6\" tabindex=\"318\" />");
		}
		print("<a href=\"javascript:openHelp('help-messengerports.html','messengerports');\"> Help</a>\n");
		print("</li>\n");

		//Inbound NFS
		print("<li><input type=\"checkbox\" name=\"NFS_IN\" value=\"true\" tabindex=\"319\" ");
		if ($_POST['NFS_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> NFS Server ");

		//Inbound NFS Ports
		if ($_POST['NFS_IN'] == "true")
		{
			print(" - Specify ports - statd: ");
			print("<input type=\"text\" name=\"STATD_PORT\" ");
			print("value=\"");
			print($_POST['STATD_PORT']);
			print("\" size=\"6\" tabindex=\"320\" />");

			print(" lockd: ");
			print("<input type=\"text\" name=\"LOCKD_PORT\" ");
			print("value=\"");
			print($_POST['LOCKD_PORT']);
			print("\" size=\"6\" tabindex=\"321\" />");

			print(" mountd: ");
			print("<input type=\"text\" name=\"MOUNTD_PORT\" ");
			print("value=\"");
			print($_POST['MOUNTD_PORT']);
			print("\" size=\"6\" tabindex=\"322\" />");

			print(" quotad: ");
			print("<input type=\"text\" name=\"RQUOTAD_PORT\" ");
			print("value=\"");
			print($_POST['RQUOTAD_PORT']);
			print("\" size=\"6\" tabindex=\"323\" />");
		}
		print("<a href=\"javascript:openHelp('help-inboundnfs.html','inboundnfs');\"> Help</a>\n");
		print("</li>\n");

		//mDNSResponder
		print("<li><input type=\"checkbox\" name=\"MDNSRESPONDER_IN\" value=\"true\" tabindex=\"324\" ");
		if ($_POST['MDNSRESPONDER_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> mDNSResponder ");
		print("<a href=\"javascript:openHelp('help-mdnsresponder.html','mdnsresponder');\"> Help</a>\n");
		print("</li>\n");

		//User-specified port range
		print("<li><input type=\"checkbox\" name=\"OTHER_IN\" value=\"true\" tabindex=\"395\" ");
		if ($_POST['OTHER_IN'] == "true")
		{
			print("checked=\"true\" ");
		}
		print("/> Specify a custom port range ");
		print("\n<a href=\"javascript:openHelp('help-otherin.html','otherin');\">Help</a>\n");
		if ($_POST['OTHER_IN'] == "true")
		{
			print("<ul><li><i>Port:</i> ");
			print("<input type=\"text\" name=\"OTHER_IN_FROM\" ");
			print("value=\"" . $_POST['OTHER_IN_FROM'] . "\" size=\"6\" tabindex=\"396\" />");
			print(" <i>(Optional) To:</i> ");
			print("<input type=\"text\" name=\"OTHER_IN_TO\" ");
			print("value=\"" . $_POST['OTHER_IN_TO'] . "\" size=\"6\" tabindex=\"397\" />");
			print("<input type=\"checkbox\" name=\"OTHER_IN_TCP\" ");
			print("value=\"true\" tabindex=\"398\" ");
			if ($_POST['OTHER_IN_TCP'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> TCP ");
			print("<input type=\"checkbox\" name=\"OTHER_IN_UDP\" ");
			print("value=\"true\" tabindex=\"399\" ");
			if ($_POST['OTHER_IN_UDP'] == "true")
			{
				print("checked=\"true\" ");
			}
			print("/> UDP</li>");
			print("</ul>\n");
		}
		print("</li>\n");

		print("</ul>\n");
	}
	print("</p>\n");

	// Select a fireparse compatible log format
	print("<p><input type=\"checkbox\" name=\"LOG_FIREPARSE\" value=\"true\" tabindex=\"400\" ");
	if ($_POST['LOG_FIREPARSE'] == "true")
	{
		print("checked=\"true\" ");
	}
	print("/> <strong>Log entries in a Fireparse format?</strong> \n");
	print("<a href=\"javascript:openHelp('help-fireparse.html','fireparse');\">Help</a>\n");

	// Allow an option for irc users to reject ident requests
	print("<p><input type=\"checkbox\" name=\"IRC_USER\" value=\"true\" tabindex=\"401\" ");
	if ($_POST['IRC_USER'] == "true")
	{
		print("checked=\"true\" ");
	}
	print("/> <strong>Do you use Internet Relay Chat (IRC)?</strong> \n");
	print("<a href=\"javascript:openHelp('help-ircuser.html','ircuser');\">Help</a>\n");

	//Submit button
	print("<p><input type=\"submit\" value=\"Generate Firewall!\" tabindex=\"750\" /></p>\n");	

	//Close form
	print("</form>\n");

	//Close document
	print("</body>\n</html>\n");
}

?>
