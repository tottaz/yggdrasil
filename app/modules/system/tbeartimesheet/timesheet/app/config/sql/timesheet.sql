CREATE TABLE `clients` (
  `id` int(11) NOT NULL auto_increment,
  `rate_id` int(11) default NULL,
  `name` varchar(64) collate latin1_general_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `clients.rate_id` (`rate_id`),
  CONSTRAINT `clients.rate_id` FOREIGN KEY (`rate_id`) REFERENCES `rates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE `configurations` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) collate latin1_general_ci default NULL,
  `value` text collate latin1_general_ci,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL auto_increment,
  `client_id` int(11) NOT NULL,
  `rate_id` int(11) default NULL,
  `name` varchar(64) collate latin1_general_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `projects.client_id` (`client_id`),
  KEY `projects.rate_id` (`rate_id`),
  CONSTRAINT `projects.client_id` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `projects.rate_id` FOREIGN KEY (`rate_id`) REFERENCES `rates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE `rates` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(32) collate latin1_general_ci default NULL,
  `rate` decimal(8,2) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL auto_increment,
  `client_id` int(11) NOT NULL,
  `project_id` int(11) default NULL,
  `type_id` int(11) NOT NULL,
  `rate_id` int(11) default NULL,
  `name` varchar(50) collate latin1_general_ci NOT NULL,
  `time_start` datetime default NULL,
  `time_end` datetime default NULL,
  `amount` decimal(8,2) NOT NULL,
  `billed` tinyint(4) NOT NULL default '0',
  `notes` text collate latin1_general_ci,
  PRIMARY KEY  (`id`),
  KEY `timesheets.project_id` (`project_id`),
  KEY `timesheets.type_id` (`type_id`),
  KEY `times.client_id` (`client_id`),
  KEY `times.rate_id` (`rate_id`),
  CONSTRAINT `times.client_id` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `times.project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `times.rate_id` FOREIGN KEY (`rate_id`) REFERENCES `rates` (`id`),
  CONSTRAINT `times.type_id` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE `types` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(64) collate latin1_general_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

INSERT INTO `configurations` VALUES ('1', 'SITE_NAME', 'Time Sheet');
INSERT INTO `configurations` VALUES ('2', 'SITE_EMAIL', 'timesheet@domain.com');
INSERT INTO `configurations` VALUES ('3', 'SMTP_HOST', 'mail.domain.com');
INSERT INTO `configurations` VALUES ('4', 'SMTP_USER', 'login@domain.com');
INSERT INTO `configurations` VALUES ('5', 'SMTP_PASS', 'password');
INSERT INTO `configurations` VALUES ('6', 'CRON_LASTRUN', '0');
INSERT INTO `configurations` VALUES ('7', 'CRON_INTERVAL', '1440');
INSERT INTO `configurations` VALUES ('8', 'CRON_RETRY_INTERVAL', '60');
INSERT INTO `types` VALUES ('1', 'Bookwork');
INSERT INTO `types` VALUES ('2', 'Support');
INSERT INTO `types` VALUES ('3', 'Server Management');
INSERT INTO `types` VALUES ('4', 'Development');
INSERT INTO `types` VALUES ('5', 'Consultation');
INSERT INTO `types` VALUES ('6', 'Data Entry');
INSERT INTO `types` VALUES ('7', 'Research');
INSERT INTO `types` VALUES ('8', 'Training');
INSERT INTO `types` VALUES ('9', 'Testing');
INSERT INTO `types` VALUES ('10', 'Monitoring');

