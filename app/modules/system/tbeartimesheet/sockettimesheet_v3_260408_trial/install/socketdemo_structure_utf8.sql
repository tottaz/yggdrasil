DROP TABLE IF EXISTS announcement;
CREATE TABLE announcement (
  `ID` int(11) NOT NULL auto_increment,
  `Author` int(11) NOT NULL default '0',
  `EffectiveDate` date NOT NULL default '0000-00-00',
  `Duration` int(11) default NULL,
  `EndDate` date default NULL,
  `NoExpiry` tinyint(4) default NULL,
  `Announcement` varchar(255) collate utf8_general_ci NOT NULL default '',
  `LastUpdated` date NOT NULL default '0000-00-00',
  `Enabled` tinyint(4) NOT NULL default '1',
  `WebLink` varchar(255) collate utf8_general_ci default NULL,
  `CalendarID` int(11) default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS archive_data;
CREATE TABLE archive_data (
  `ID` int(11) NOT NULL auto_increment,
  `Module` char(200) collate utf8_general_ci NOT NULL default '',
  `StartDate` date NOT NULL default '0000-00-00',
  `EndDate` date NOT NULL default '0000-00-00',
  `ArchivedDate` date NOT NULL default '0000-00-00',
  `UserID` int(11) NOT NULL default '0',
  `FileName` char(200) collate utf8_general_ci NOT NULL default '',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ban_ip;
CREATE TABLE ban_ip (
  `ID` int(11) NOT NULL auto_increment,
  `IP` char(50) collate utf8_general_ci default NULL,
  `Added` date default NULL,
  `Description` char(200) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `IP` (`IP`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS client;
CREATE TABLE client (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Name` char(50) collate utf8_general_ci default NULL,
  `Code` char(50) collate utf8_general_ci default NULL,
  `Comment` char(200) collate utf8_general_ci default NULL,
  `BillingRateSign` int(11) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  `BillingRateDescription` char(50) collate utf8_general_ci default NULL,
  `Address1` char(50) collate utf8_general_ci default NULL,
  `Address2` char(50) collate utf8_general_ci default NULL,
  `City` char(50) collate utf8_general_ci default NULL,
  `State` char(50) collate utf8_general_ci default NULL,
  `Country` char(3) collate utf8_general_ci default NULL,
  `Telephone` char(20) collate utf8_general_ci default NULL,
  `Fax` char(20) collate utf8_general_ci default NULL,
  `Website` char(50) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Code` (`Code`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS config;
CREATE TABLE config (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(200) collate utf8_general_ci default NULL,
  `Default_Name` char(200) collate utf8_general_ci default NULL,
  `Version` char(10) collate utf8_general_ci default NULL,
  `Support` char(200) collate utf8_general_ci default NULL,
  `URL_Contact` char(200) collate utf8_general_ci default NULL,
  `InstallDate` date default NULL,
  `Database_Name` char(100) collate utf8_general_ci default NULL,
  `Table_Prefix` char(100) collate utf8_general_ci default NULL,
  `ROOTDIR` char(200) collate utf8_general_ci default NULL,
  `MAX_FILE_SIZE` int(11) NOT NULL default '1024000',
  `Logging` tinyint(1) default NULL,
  `SessionFile` tinyint(1) NOT NULL default '0',
  `AnnouncementTicker` int(10) unsigned NOT NULL default '3',
  `LogNumber` int(11) NOT NULL default '10',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS country;
CREATE TABLE country (
  `Code` char(3) collate utf8_general_ci default NULL,
  `Name` char(50) collate utf8_general_ci default NULL,
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS currency;
CREATE TABLE currency (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(20) collate utf8_general_ci default NULL,
  `Symbol` char(10) collate utf8_general_ci default NULL,
  `Rate` double(255,2) unsigned default NULL,
  `Enable` tinyint(1) default NULL,
  `DefaultCurrency` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Symbol` (`Symbol`),
  KEY `Enable` (`Enable`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(40) collate utf8_general_ci default NULL,
  `Code` char(20) collate utf8_general_ci default NULL,
  `HourlyCostSign` tinyint(4) default NULL,
  `HourlyCostValue` double(255,2) unsigned default NULL,
  `Comment` char(200) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS email_admin;
CREATE TABLE email_admin (
  `ID` int(11) NOT NULL auto_increment,
  `admin_useradded_user` char(10) collate utf8_general_ci default NULL,
  `admin_useradded_admin` char(10) collate utf8_general_ci default NULL,
  `admin_useradded_supervisor` char(10) collate utf8_general_ci default NULL,
  `admin_userupdated_user` char(10) collate utf8_general_ci default NULL,
  `admin_userupdated_admin` char(10) collate utf8_general_ci default NULL,
  `admin_userupdated_supervisor` char(10) collate utf8_general_ci default NULL,
  `admin_userdeleted_user` char(10) collate utf8_general_ci default NULL,
  `admin_userdeleted_admin` char(10) collate utf8_general_ci default NULL,
  `admin_userdeleted_supervisor` char(10) collate utf8_general_ci default NULL,
  `admin_userdisabled_user` char(10) collate utf8_general_ci default NULL,
  `admin_userdisabled_admin` char(10) collate utf8_general_ci default NULL,
  `admin_userdisabled_supervisor` char(10) collate utf8_general_ci default NULL,
  `admin_userpassword_user` char(10) collate utf8_general_ci default NULL,
  `admin_userpassword_admin` char(10) collate utf8_general_ci default NULL,
  `admin_userpassword_supervisor` char(10) collate utf8_general_ci default NULL,
  `project_added_team` char(10) collate utf8_general_ci default NULL,
  `project_added_pm` char(10) collate utf8_general_ci default NULL,
  `project_updated_team` char(10) collate utf8_general_ci default NULL,
  `project_updated_pm` char(10) collate utf8_general_ci default NULL,
  `project_deleted_team` char(10) collate utf8_general_ci default NULL,
  `project_deleted_pm` char(10) collate utf8_general_ci default NULL,
  `project_started_team` char(10) collate utf8_general_ci default NULL,
  `project_started_pm` char(10) collate utf8_general_ci default NULL,
  `project_closed_team` char(10) collate utf8_general_ci default NULL,
  `project_closed_pm` char(10) collate utf8_general_ci default NULL,
  `timesheet_approval_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_approval_spr` char(10) collate utf8_general_ci default NULL,
  `timesheet_approval_pm` char(10) collate utf8_general_ci default NULL,
  `timesheet_approved_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_approved_spr` char(10) collate utf8_general_ci default NULL,
  `timesheet_approved_pm` char(10) collate utf8_general_ci default NULL,
  `timesheet_rejected_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_rejected_spr` char(10) collate utf8_general_ci default NULL,
  `timesheet_rejected_pm` char(10) collate utf8_general_ci default NULL,
  `timesheet_undoreq_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_undoreq_admin` char(10) collate utf8_general_ci default NULL,
  `timesheet_undocancel_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_undocancel_admin` char(10) collate utf8_general_ci default NULL,
  `timesheet_undoapproved_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_undoapproved_admin` char(10) collate utf8_general_ci default NULL,
  `timesheet_due_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_due_spr` char(10) collate utf8_general_ci default NULL,
  `timesheet_overdue_user` char(10) collate utf8_general_ci default NULL,
  `timesheet_overdue_spr` char(10) collate utf8_general_ci default NULL,
  `expenses_approval_user` char(10) collate utf8_general_ci default NULL,
  `expenses_approval_pm` char(10) collate utf8_general_ci default NULL,
  `expenses_approval_spr` char(10) collate utf8_general_ci default NULL,
  `expenses_approved_user` char(10) collate utf8_general_ci default NULL,
  `expenses_approved_pm` char(10) collate utf8_general_ci default NULL,
  `expenses_approved_spr` char(10) collate utf8_general_ci default NULL,
  `expenses_rejected_user` char(10) collate utf8_general_ci default NULL,
  `expenses_rejected_pm` char(10) collate utf8_general_ci default NULL,
  `expenses_rejected_spr` char(10) collate utf8_general_ci default NULL,
  `expenses_undoreq_user` char(10) collate utf8_general_ci default NULL,
  `expenses_undoreq_admin` char(10) collate utf8_general_ci default NULL,
  `expenses_undocancel_user` char(10) collate utf8_general_ci default NULL,
  `expenses_undocancel_admin` char(10) collate utf8_general_ci default NULL,
  `expenses_undoapproved_user` char(10) collate utf8_general_ci default NULL,
  `expenses_undoapproved_admin` char(10) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS email_settings;
CREATE TABLE email_settings (
  `ID` int(11) NOT NULL auto_increment,
  `DefaultMail` varchar(100) collate utf8_general_ci NOT NULL default 'local',
  `SenderName` varchar(250) collate utf8_general_ci default NULL,
  `MailServer` varchar(250) collate utf8_general_ci default NULL,
  `MailPort` int(11) NOT NULL default '25',
  `Authentication` tinyint(1) NOT NULL default '1',
  `MailLogin` varchar(250) collate utf8_general_ci default NULL,
  `MailPassword` varchar(250) collate utf8_general_ci default NULL,
  `MailFormat` varchar(4) collate utf8_general_ci NOT NULL default 'HTML',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS email_template;
CREATE TABLE email_template (
  `ID` int(11) NOT NULL auto_increment,
  `Name` varchar(200) collate utf8_general_ci NOT NULL default '',
  `Email` varchar(200) collate utf8_general_ci NOT NULL default '',
  `Subject` varchar(250) collate utf8_general_ci NOT NULL default '',
  `Content` text collate utf8_general_ci NOT NULL,
  `Type` varchar(100) collate utf8_general_ci NOT NULL default '',
  `Title` varchar(200) collate utf8_general_ci NOT NULL default '',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS employee_type;
CREATE TABLE employee_type (
  `ID` smallint(3) unsigned NOT NULL auto_increment,
  `Name` char(50) collate utf8_general_ci default NULL,
  `Description` char(250) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS expense;
CREATE TABLE expense (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(50) collate utf8_general_ci default NULL,
  `Code` char(50) collate utf8_general_ci default NULL,
  `Description` char(250) collate utf8_general_ci default NULL,
  `Enable` tinyint(1) default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS file_upload;
CREATE TABLE file_upload (
  `ID` int(11) NOT NULL auto_increment,
  `OriName` char(200) collate utf8_general_ci NOT NULL default '',
  `NewName` char(200) collate utf8_general_ci NOT NULL default '',
  `Ext` char(10) collate utf8_general_ci NOT NULL default '',
  `Date` datetime NOT NULL default '0000-00-00 00:00:00',
  `MimeType` char(200) collate utf8_general_ci NOT NULL default 'application/octet-stream',
  `Size` int(11) NOT NULL default '0',
  `FullPath` char(250) collate utf8_general_ci NOT NULL default '',
  `ProjectID` int(11) default NULL,
  `TaskID` int(11) default NULL,
  `ExID` int(11) default NULL,
  `UserID` int(11) unsigned default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS last_updated;
CREATE TABLE last_updated (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `TableName` varchar(255) collate utf8_general_ci NOT NULL default '',
  `LastUpdated` date default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS name_format;
CREATE TABLE name_format (
  `ID` int(11) NOT NULL default '0',
  `NameFormat` char(100) collate utf8_general_ci default NULL,
  `Display` char(50) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `ProjectID` int(11) unsigned default NULL,
  `TaskID` int(11) unsigned default NULL,
  `UserID` int(11) unsigned default NULL,
  `DateTime` datetime NOT NULL default '0000-00-00 00:00:00',
  `Notes` text NOT NULL,
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`,`TaskID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS period;
CREATE TABLE period (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `FirstDay` int(11) unsigned default NULL,
  `EffectiveDate` date default NULL,
  `System` int(11) default NULL,
  `EmployeeType` int(11) default NULL,
  `Department` int(11) default NULL,
  `DayStart` time default '09:00:00',
  `DayEnd` time default '17:00:00',
  `MinimumWeek` double(255,2) unsigned default '40.00',
  `MinimumDay` double(255,2) unsigned default '8.00',
  `SubmitOverdue` int(1) default '6',
  `PrjCloseDisable` tinyint(1) default NULL,
  `OffDays` varchar(50) collate utf8_general_ci NOT NULL default '0:6:',
  `OverdueDay` tinyint(1) NOT NULL default '0',
  `DueWeek` tinyint(1) NOT NULL default '1',
  `OverdueWeek` tinyint(1) NOT NULL default '1',
  `EnableUndoTimesheet` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS permission;
CREATE TABLE permission (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(30) collate utf8_general_ci default NULL,
  `Selection` char(30) collate utf8_general_ci default NULL,
  `Description` char(100) collate utf8_general_ci default NULL,
  `Enable` tinyint(1) default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Selection` (`Selection`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS phase;
CREATE TABLE phase (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(30) collate utf8_general_ci default NULL,
  `Enable` tinyint(1) default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `Enable` (`Enable`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_billing;
CREATE TABLE project_billing (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectID` int(10) default NULL,
  `RoleID` smallint(5) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`),
  KEY `RoleID` (`RoleID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_billing_rate;
CREATE TABLE project_billing_rate (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectBillingID` int(11) default NULL,
  `EffectiveDate` date default NULL,
  `BillingRateSign` int(11) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  KEY `ProjectBillingID` (`ProjectBillingID`),
  KEY `EffectiveDate` (`EffectiveDate`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_config;
CREATE TABLE project_config (
  `ID` int(11) NOT NULL default '0',
  `ConsolidatedHours` tinyint(1) NOT NULL default '0',
  `ParentTaskEnableHours` tinyint(1) NOT NULL default '1',
  `ShowUserDetails` tinyint(1) NOT NULL default '0',
  `PrjPrefix` varchar(50) collate utf8_general_ci NOT NULL default 'PRJ',
  `PrjDigit` int(10) NOT NULL default '5',
  `PrjSuffix` varchar(50) collate utf8_general_ci default NULL,
  `TaskPrefix` varchar(50) collate utf8_general_ci NOT NULL default 'TASK',
  `TaskDigit` int(10) NOT NULL default '5',
  `TaskSuffix` varchar(50) collate utf8_general_ci default NULL,
  `TaskTreeField` varchar(45) collate utf8_general_ci NOT NULL default 'Name',
  `TaskTreeSort` varchar(45) collate utf8_general_ci NOT NULL default 'ASC',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_info;
CREATE TABLE project_info (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Name` varchar(50) collate utf8_general_ci default NULL,
  `Code` varchar(20) collate utf8_general_ci default NULL,
  `Description` text collate utf8_general_ci,
  `ProjectCreatorID` int(11) default NULL,
  `ProjectLeaderID` int(11) default NULL,
  `ClientID` int(11) default NULL,
  `StartDate` date default NULL,
  `EndDate` date default NULL,
  `BillingRateSign` int(11) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  `Phase` int(11) default NULL,
  `EstimatedHour` double(255,2) unsigned default NULL,
  `EstimatedCostSign` int(11) default NULL,
  `EstimatedCostValue` double(255,2) unsigned default NULL,
  `EstimatedExpenseSign` int(11) default NULL,
  `EstimatedExpenseValue` double(255,2) unsigned default NULL,
  `LeaderApprove` tinyint(1) default NULL,
  `TimeEntry` tinyint(1) default NULL,
  `ExpenseEntry` tinyint(1) default NULL,
  `Open` tinyint(1) default NULL,
  `Billable` tinyint(1) default NULL,
  `NonBillable` tinyint(1) default NULL,
  `ProjectLeaderID2` int(11) default NULL,
  `Template` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Code` (`Code`),
  KEY `ProjectLeaderID` (`ProjectLeaderID`),
  KEY `ClientID` (`ClientID`),
  KEY `Name` (`Name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_member;
CREATE TABLE project_member (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectID` int(11) default NULL,
  `UserID` int(11) default '0',
  `DepartmentID` tinyint(4) default '0',
  `AllMember` tinyint(1) default '0',
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_member_rate;
CREATE TABLE project_member_rate (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectMemberID` int(11) default NULL,
  `ProjectRate` tinyint(1) default NULL,
  `DepartmentRate` tinyint(1) default NULL,
  `UserRate` tinyint(1) default NULL,
  `RoleRate` tinyint(1) default NULL,
  `RoleID` smallint(6) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `ProjectMemberID` (`ProjectMemberID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_permission;
CREATE TABLE project_permission (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectID` int(11) default NULL,
  `UserID` int(11) default NULL,
  `DepartmentID` smallint(6) default NULL,
  `AllMember` tinyint(1) default NULL,
  `Allow` tinyint(1) default NULL,
  `Deny` tinyint(1) default NULL,
  `Available` tinyint(1) default NULL,
  `EstimatedHours` double(255,2) NOT NULL default '0.00',
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS project_team_rate;
CREATE TABLE project_team_rate (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectID` int(11) default NULL,
  `UserID` int(11) default NULL,
  `DepartmentID` smallint(6) default NULL,
  `EffectiveDate` date default NULL,
  `BillingRateSign` tinyint(4) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS quicklinks;
CREATE TABLE quicklinks (
  `ID` int(11) NOT NULL auto_increment,
  `LinkName` varchar(250) collate utf8_general_ci NOT NULL default '',
  `LinkURL` varchar(250) collate utf8_general_ci NOT NULL default '',
  `Description` varchar(250) collate utf8_general_ci NOT NULL default '',
  `UserID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS report_saved;
CREATE TABLE report_saved (
  `ID` int(11) NOT NULL auto_increment,
  `ReportName` varchar(250) collate utf8_general_ci NOT NULL default '',
  `ReportLink` varchar(250) collate utf8_general_ci NOT NULL default '',
  `OwnerID` int(11) NOT NULL default '0',
  `DateCreated` date NOT NULL default '0000-00-00',
  `Saved` tinyint(1) NOT NULL default '0',
  `Shared` tinyint(1) NOT NULL default '0',
  `ReportData` text NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS report_shared;
CREATE TABLE report_shared (
  `ID` int(11) NOT NULL auto_increment,
  `ReportID` int(11) NOT NULL default '0',
  `UserID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS role;
CREATE TABLE role (
  `ID` smallint(5) unsigned NOT NULL auto_increment,
  `Name` char(50) collate utf8_general_ci default NULL,
  `Description` char(250) collate utf8_general_ci default NULL,
  `BillingRateSign` int(11) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  `Enable` tinyint(1) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS syslog;
CREATE TABLE syslog (
  `ID` bigint(20) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `LogDate` date NOT NULL default '0000-00-00',
  `LogTime` time NOT NULL default '00:00:00',
  `LogTypeID` int(11) NOT NULL default '0',
  `LogType` varchar(100) collate utf8_general_ci NOT NULL default '',
  `LogAction` varchar(100) collate utf8_general_ci NOT NULL default '',
  `LogDescription` varchar(255) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS task_info;
CREATE TABLE task_info (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Name` varchar(50) collate utf8_general_ci default NULL,
  `Code` varchar(20) collate utf8_general_ci default NULL,
  `Description` text collate utf8_general_ci,
  `ProjectID` int(11) default NULL,
  `TaskParentID` int(11) default NULL,
  `TaskCreatorID` int(11) default NULL,
  `StartDate` date default NULL,
  `EndDate` date default NULL,
  `Phase` int(11) default NULL,
  `EstimatedHour` double(255,2) unsigned default NULL,
  `EstimatedCostSign` int(11) default NULL,
  `EstimatedCostValue` double(255,2) unsigned default NULL,
  `LeaderApprove` tinyint(1) default NULL,
  `TimeEntry` tinyint(1) default NULL,
  `Open` tinyint(1) default NULL,
  `Billable` tinyint(1) default NULL,
  `NonBillable` tinyint(1) default NULL,
  `EstimatedExpenseSign` tinyint(1) default NULL,
  `EstimatedExpenseValue` double(255,2) unsigned default NULL,
  `BillingRateSign` tinyint(1) default NULL,
  `BillingRateValue` double(255,2) unsigned default NULL,
  `Progress` int(3) unsigned NOT NULL default '0',
  `MileStone` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`),
  KEY `TaskParentID` (`TaskParentID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS task_permission;
CREATE TABLE task_permission (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `ProjectID` int(11) default NULL,
  `TaskID` int(11) default NULL,
  `UserID` int(11) default NULL,
  `DepartmentID` smallint(6) default NULL,
  `AllMember` tinyint(1) default NULL,
  `Allow` tinyint(1) default NULL,
  `Deny` tinyint(1) default NULL,
  `Available` tinyint(1) default NULL,
  `EstimatedHours` double(255,2) NOT NULL default '0.00',
  PRIMARY KEY  (`ID`),
  KEY `ProjectID` (`ProjectID`),
  KEY `TaskID` (`TaskID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS template;
CREATE TABLE template (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(255) collate utf8_general_ci NOT NULL default '',
  `Path` char(50) collate utf8_general_ci NOT NULL default '',
  `Code` char(50) collate utf8_general_ci NOT NULL default '',
  `Lang` char(50) collate utf8_general_ci NOT NULL default '',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS time_off;
CREATE TABLE time_off (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `Name` char(50) collate utf8_general_ci default NULL,
  `Code` char(50) collate utf8_general_ci default NULL,
  `Description` char(250) collate utf8_general_ci default NULL,
  `Enable` tinyint(1) unsigned default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS timesheet_approval;
CREATE TABLE timesheet_approval (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `Activity` varchar(100) collate utf8_general_ci NOT NULL default '',
  `Role` varchar(100) collate utf8_general_ci NOT NULL default '',
  `RoleUserID` int(11) default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS timesheet_due;
CREATE TABLE timesheet_due (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `WeekDate` date NOT NULL default '0000-00-00',
  `LastUpdated` date NOT NULL default '0000-00-00',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS timesheet_overdue;
CREATE TABLE timesheet_overdue (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `WeekDate` date NOT NULL default '0000-00-00',
  `LastUpdated` date NOT NULL default '0000-00-00',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_detail;
CREATE TABLE ts_detail (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `TsID` int(11) default NULL,
  `Day` date default NULL,
  `Hour` double(255,2) unsigned default NULL,
  `Comment` char(250) collate utf8_general_ci default NULL,
  `TimeIn` time default NULL,
  `TimeOut` time default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `TsID` (`TsID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_detail_to;
CREATE TABLE ts_detail_to (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `TsToID` int(11) default NULL,
  `Day` date default NULL,
  `Hour` double(255,2) unsigned default NULL,
  `Comment` char(250) collate utf8_general_ci default NULL,
  `TimeIn` time default NULL,
  `TimeOut` time default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `TsToID` (`TsToID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_submit_current;
CREATE TABLE ts_submit_current (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `WeekDate` date default NULL,
  `TsID` int(11) NOT NULL default '0',
  `TsToID` int(11) NOT NULL default '0',
  `SubmitDate` date default NULL,
  `Pending` tinyint(1) NOT NULL default '0',
  `Approve` tinyint(1) NOT NULL default '0',
  `Reject` tinyint(1) NOT NULL default '0',
  `ActionID` int(11) default '0',
  `ActionDate` date default NULL,
  `ActionComment` char(250) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `WeekDate` (`WeekDate`),
  KEY `Pending` (`Pending`),
  KEY `Approve` (`Approve`),
  KEY `Reject` (`Reject`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_submit_overall;
CREATE TABLE ts_submit_overall (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `WeekDate` date default NULL,
  `Pending` tinyint(1) NOT NULL default '0',
  `Approve` tinyint(1) NOT NULL default '0',
  `Reject` tinyint(1) NOT NULL default '0',
  `Comment` char(250) collate utf8_general_ci default NULL,
  `ActionID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `WeekDate` (`WeekDate`),
  KEY `Pending` (`Pending`),
  KEY `Approve` (`Approve`),
  KEY `Reject` (`Reject`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_task;
CREATE TABLE ts_task (
  `ID` int(11) NOT NULL auto_increment,
  `WeekDate` date default NULL,
  `WeekEnd` date default NULL,
  `UserID` int(11) default NULL,
  `ProjectID` int(11) default '0',
  `TaskID` int(11) default NULL,
  `ParentID` int(11) default NULL,
  `Billable` tinyint(1) default '1',
  `DepartmentID` int(11) NOT NULL default '0',
  `ClientID` int(11) NOT NULL default '0',
  `EmployeeTypeID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `ProjectID` (`ProjectID`),
  KEY `TaskID` (`TaskID`),
  KEY `ParentID` (`ParentID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_task_rpt;
CREATE TABLE ts_task_rpt (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `WeekDate` date default NULL,
  `WeekEnd` date default NULL,
  `TsID` int(11) default NULL,
  `TsToID` int(11) default NULL,
  `ProjectID` int(11) default NULL,
  `TaskID` int(11) default NULL,
  `ParentID` int(11) default NULL,
  `Billable` tinyint(4) default '1',
  `ToID` int(11) default NULL,
  `MainProjectID` int(11) default NULL,
  `DepartmentID` int(11) NOT NULL default '0',
  `ClientID` int(11) NOT NULL default '0',
  `EmployeeTypeID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `TsID` (`TsID`),
  KEY `TsToID` (`TsToID`),
  KEY `WeekDate` (`WeekDate`),
  KEY `WeekEnd` (`WeekEnd`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS ts_task_to;
CREATE TABLE ts_task_to (
  `ID` int(11) NOT NULL auto_increment,
  `WeekDate` date default NULL,
  `WeekEnd` date default NULL,
  `UserID` int(11) default NULL,
  `ToID` int(11) default NULL,
  `DepartmentID` int(11) NOT NULL default '0',
  `ClientID` int(11) NOT NULL default '0',
  `EmployeeTypeID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `ToID` (`ToID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_approval_listing;
CREATE TABLE user_approval_listing (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `fieldTask` varchar(100) collate utf8_general_ci default NULL,
  `sortTypeTask` varchar(100) collate utf8_general_ci default NULL,
  `fieldTimeoff` varchar(100) collate utf8_general_ci default NULL,
  `sortTypeTimeoff` varchar(100) collate utf8_general_ci default NULL,
  `fieldOverall` varchar(100) collate utf8_general_ci default NULL,
  `sortTypeOverall` varchar(100) collate utf8_general_ci default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_dayoff;
CREATE TABLE user_dayoff (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `EffectiveDate` date default NULL,
  `Sunday` tinyint(1) default NULL,
  `Monday` tinyint(1) default NULL,
  `Tuesday` tinyint(1) default NULL,
  `Wednesday` tinyint(1) default NULL,
  `Thursday` tinyint(1) default NULL,
  `Friday` tinyint(1) default NULL,
  `Saturday` tinyint(1) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_listing;
CREATE TABLE user_listing (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `Listing` varchar(200) collate utf8_general_ci NOT NULL default '',
  `Settings` text collate utf8_general_ci NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_login;
CREATE TABLE user_login (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Login` char(20) collate utf8_general_ci default NULL,
  `Password` char(50) collate utf8_general_ci default NULL,
  `Disable` tinyint(1) default NULL,
  `ChangePassword` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `Login` (`Login`),
  KEY `Password` (`Password`),
  KEY `Disable` (`Disable`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_permission;
CREATE TABLE user_permission (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `PermissionID` int(11) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`),
  KEY `PermissionID` (`PermissionID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_preference;
CREATE TABLE user_preference (
  `UserID` int(10) NOT NULL default '0',
  `TaskName` tinyint(1) default '1',
  `TaskCode` tinyint(1) default NULL,
  `FullPathName` tinyint(1) default '1',
  `FullPathCode` tinyint(1) default NULL,
  `ClientName` tinyint(1) default '1',
  `ClientCode` tinyint(1) default NULL,
  `ProjectName` tinyint(1) default '1',
  `ProjectCode` tinyint(1) default NULL,
  `ExpenseClientName` tinyint(1) default '1',
  `ExpenseClientCode` tinyint(1) default NULL,
  `ExpenseProjectName` tinyint(1) default '1',
  `ExpenseProjectCode` tinyint(1) default NULL,
  `DateFormat` varchar(30) collate utf8_general_ci default 'd-m-Y',
  `DayOff` varchar(30) collate utf8_general_ci default '0:6:',
  `WeekView` tinyint(1) default '1',
  `ListNumber` int(11) default '5',
  `NameFormat` int(1) default '1',
  `CurrencyID` int(11) default '1',
  `FieldShow` tinyint(4) default '0',
  `TaskWrap` tinyint(4) default '1',
  `Navigator` tinyint(4) default NULL,
  `TimesheetList` varchar(100) collate utf8_general_ci default 'open',
  `PrjList` varchar(100) collate utf8_general_ci default 'open',
  `OpenTask` tinyint(1) NOT NULL default '0',
  `TaskShow` tinyint(1) NOT NULL default '0',
  `ThousandSeparator` varchar(5) collate utf8_general_ci NOT NULL default ',',
  `DecimalSeparator` varchar(5) collate utf8_general_ci NOT NULL default '.',
  `TruncateCalendarHeadline` int(10) unsigned NOT NULL default '17',
  PRIMARY KEY  (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_prj_listing;
CREATE TABLE user_prj_listing (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `ListType` char(200) collate utf8_general_ci default 'list_project',
  `FieldList` char(250) collate utf8_general_ci default 'name:1;task:1;code:1;leader:1;start:1;end:1;status:1;',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_properties;
CREATE TABLE user_properties (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `UserID` int(10) default NULL,
  `FName` char(50) collate utf8_general_ci default NULL,
  `LName` char(50) collate utf8_general_ci default NULL,
  `Department` int(11) default NULL,
  `Client` int(11) default NULL,
  `Type` smallint(3) default NULL,
  `EmployeeID` char(50) collate utf8_general_ci default NULL,
  `Email` char(50) collate utf8_general_ci default NULL,
  `SupervisorID` int(11) default NULL,
  `DateCreated` date default NULL,
  `DateActivated` date default NULL,
  `SupervisorID2` int(11) default NULL,
  PRIMARY KEY  (`ID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_quicklinks;
CREATE TABLE user_quicklinks (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `DateUpdated` datetime NOT NULL default '0000-00-00 00:00:00',
  `QuickLinksID` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_startup;
CREATE TABLE user_startup (
  `ID` int(11) unsigned NOT NULL auto_increment,
  `UserID` int(11) NOT NULL default '0',
  `StartupLink` varchar(100) collate utf8_general_ci NOT NULL default '',
  `LoginType` varchar(50) collate utf8_general_ci NOT NULL default '',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_timeoff;
CREATE TABLE user_timeoff (
  `ID` int(11) NOT NULL auto_increment,
  `UserID` int(11) default NULL,
  `TimeOffID` int(11) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS user_timesheet;
CREATE TABLE user_timesheet (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `UserID` int(10) default NULL,
  `ApprovalPath` int(11) default NULL,
  `ExpensePath` int(11) default NULL,
  `HourlyCostSign` int(11) default NULL,
  `HourlyCostValue` double(255,2) unsigned default NULL,
  `HoursPerDay` double(255,2) unsigned default NULL,
  `HoursPerWeek` double(255,2) unsigned default NULL,
  `MinimumHour` tinyint(1) default NULL,
  `MinimumWeek` tinyint(1) default NULL,
  `EmailNotification` tinyint(1) default NULL,
  `TimeOffEnable` tinyint(1) default NULL,
  `MandatoryTs` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`ID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS calendar_category;
CREATE TABLE calendar_category (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `Category` varchar(45) collate utf8_general_ci default NULL,
  `Enable` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS calendar_event;
CREATE TABLE calendar_event (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `StartDate` date NOT NULL default '0000-00-00',
  `EndDate` date default NULL,
  `Headline` varchar(250) collate utf8_general_ci default NULL,
  `Description` text,
  `Category` int(10) unsigned default NULL,
  `UserID` int(10) unsigned default NULL,
  `Enable` tinyint(1) unsigned default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS email_users;
CREATE TABLE email_users (
  `ID` int(10) unsigned NOT NULL auto_increment,
  `UserID` int(10) unsigned NOT NULL,
  `Enable` tinyint(1) unsigned default '1',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
