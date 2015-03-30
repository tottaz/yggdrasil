/*Table structure for table `#__tbeartimesheet_departments` */
DROP TABLE IF EXISTS `#__tbeartimesheet_departments`;

CREATE TABLE IF NOT EXISTS `#__tbeartimesheet_departments` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(64) NOT NULL default 'default',
  `contact_name` varchar(72) NOT NULL default 'Someone',
  `contact_email` varchar(254) NOT NULL default 'somedep@somewhere.com',
  `notify` tinyint(1) NOT NULL default '1',
  `notify_admin` tinyint(1) NOT NULL default '1',
  `acceptance_notify` tinyint(1) NOT NULL default '1',
  `rejection_notify` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `#__tbeartimesheet_departments` */

insert  into `#__tbeartimesheet_departments`(id,name,contact_name,contact_email,notify,notify_admin,acceptance_notify,rejection_notify) values (1,'default','admin','somedep@somewhere.com',1,1,1,1);


DROP TABLE IF EXISTS `#__tbeartimesheet_config`;

CREATE TABLE IF NOT EXISTS `#__tbeartimesheet_config` (
  `IdConfig` int(11) NOT NULL auto_increment,
  `ConfigName` varchar(255) NOT NULL,
  `ConfigValue` text NOT NULL,
  PRIMARY KEY  (`IdConfig`)
) ENGINE = MYISAM CHARACTER SET utf8 COLLATE utf8_general_ci;

INSERT IGNORE INTO `#__tbeartimesheet_config` (`IdConfig`, `ConfigName`, `ConfigValue`) VALUES (1, 'global.register.code', ''),
(2, 'microsoft.server', ''),
(3, 'sleep.time', '1'),
(4, 'server.maxload', '0'),
(5, 'avoid.duplicate', ''),
(6, 'enable.getwith', ''),
(7, 'enable.debug', '0'),
(8, 'include.link', '1'),
(9, 'from.mail', 'hr@thunderbeardesign.com'),
(10, 'organisation', 'ThunderBear Design'),
(11, 'reply.to', 'hr@thunderbeardesign.com'),
(12, 'default.dept', 'technology'),
(13, 'default.country', 'Canada'),
(14, 'default.city', 'Toronto'),
(15, 'default.jobtype', 'Developer'),
(16, 'default.career', 'Project Manager'),
(17, 'default.education', 'University'),
(18, 'default.category', 'New'),
(19, 'default.post.range', '1'),
(20, 'allow.unsolicited', '1'),
(21, 'dept.notify.admin', '1'),
(22, 'dept.notify.contact', '1'),
(23, 'elapsed.days', '30');





