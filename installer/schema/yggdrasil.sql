-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
-- PLEASE USE MYISAM AND NEVER INNODB. THIS IS UTTERLY IMPORTANT.
--
-- Please make sure that you do NOT use InnoDB. We have had complaints
-- of data corruption when using InnoDB tables. I don't care if it is 
-- a unique server-specific thing that'll never happen again, 
-- we cannot allow ANYONE to have ANY problems of ANY kind with Emily.
--
-- So please, stick to MyISAM. 
--
-- And if your new table schema does not have ENGINE = MYISAM,
-- PLEASE ADD IT.
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `{DBPREFIX}action_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `item_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

-- split --

INSERT INTO `{DBPREFIX}groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User');

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}hidden_notifications` (
  `user_id` int(11) NOT NULL,
  `notification_id` varchar(255) NOT NULL,
  KEY `user_id` (`user_id`,`notification_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(40) NOT NULL,
  `level` int(2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `date_created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}login_attempts` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varbinary(16) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `{DBPREFIX}meta` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL,
  `first_name` varchar(50) DEFAULT '',
  `last_name` varchar(50) DEFAULT '',
  `company` varchar(100) DEFAULT '',
  `phone` varchar(20) DEFAULT '',
  `last_visited_version` varchar(48) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- split --

INSERT INTO `{DBPREFIX}meta` (`id`, `user_id`, `first_name`, `last_name`, `company`, `phone`, `last_visited_version`) VALUES
(1, 1, 'Torbjorn', 'Zetterlund', 'Test', '0', '3.5.9'),
(2, 2, 'Torbjorn', 'Zetterlund', '', '31645100310', '3.5.9');

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `module` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `roles` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=27 ;

-- split --

INSERT INTO `{DBPREFIX}permissions` (`id`, `group_id`, `module`, `roles`) VALUES
(1, 3, 'wiob', '{"view":"1"}'),
(26, 2, 'whois', NULL),
(25, 2, 'schedule', NULL),
(23, 2, 'people', NULL),
(24, 2, 'reports', NULL),
(22, 2, 'dashboard', NULL);


-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}settings` (
  `slug` varchar(100) NOT NULL DEFAULT '',
  `value` text,
  PRIMARY KEY (`slug`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

INSERT INTO `{DBPREFIX}settings` (`slug`, `value`) VALUES
('admin_name', 'Torbjorn Zetterlund'),
('license_key', '111111'),
('mailing_address', ''),
('notify_email', 'tzetter@findmore.ca'),
('rss_password', '6Ohh44pWRsuz'),
('site_name', 'Emily'),
('currency', 'EUR'),
('admin_theme', 'default'),
('ftp_port', '21'),
('ftp_pasv', '0'),
('latest_version', '1.0.0'),
('date_format', 'm/d/Y'),
('time_format', 'H:i'),
('timezone', 'Europe/Berlin'),
('language', 'english'),
('task_time_interval', '0.5'),
('custom_css', ''),
('items_per_page', '10'),
('send_x_days_before', '7'),
('pdf_page_size', 'A4'),
('default_subject', ''),
('logo_url', 'uploads/branding/yggdrasil.jpg'),
('theme', 'default'),
('version', '3.5.9'),
('latest_version_fetch', ''),
('auto_update', '0'),
('ftp_host', ''),
('ftp_user', ''),
('ftp_pass', ''),
('ftp_path', '/'),
('bcc', '0'),
('include_remittance_slip', '1'),
('email_type', 'sendmail'),
('smtp_host', ''),
('smtp_user', ''),
('smtp_pass', ''),
('smtp_port', '25'),
('kitchen_route', 'clients'),
('mailpath', '/usr/sbin/sendmail');

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}updates` (
  `version` varchar(255) NOT NULL,
  `hashes` longtext NOT NULL,
  `suzip` longtext NOT NULL,
  `changed_files` longtext NOT NULL,
  `processed_changelog` longtext NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}update_files` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `filename` text NOT NULL,
  `data` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}users` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` mediumint(8) unsigned NOT NULL,
  `ip_address` char(16) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(40) NOT NULL,
  `salt` varchar(40) DEFAULT '',
  `email` varchar(40) NOT NULL,
  `activation_code` varchar(40) DEFAULT '',
  `forgotten_password_code` varchar(40) DEFAULT '',
  `remember_code` varchar(40) DEFAULT '',
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- split --

INSERT INTO `{DBPREFIX}users` VALUES (1, 1, '127.0.0.1', '{USERNAME}', '{PASSWORD}', '{SALT}', '{NOTIFY_EMAIL}', '', NULL, NULL, 1268889823, 1281291575, 1);

-- split --