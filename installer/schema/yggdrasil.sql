
-- --------------------------------------------------------

--
-- Table structure for table `action_logs`
--

CREATE TABLE `{DBPREFIX}action_logs` (
`id` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE `{DBPREFIX}groups` (
`id` mediumint(8) unsigned NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- split --

INSERT INTO `{DBPREFIX}groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User');

-- split --

CREATE TABLE `{DBPREFIX}hidden_notifications` (
  `user_id` int(11) NOT NULL,
  `notification_id` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE `{DBPREFIX}ci_sessions` (
  `id` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `ip_address` varchar(16) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `timestamp` int(10) unsigned NOT NULL DEFAULT '0',
  `data` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

CREATE TABLE `{DBPREFIX}itdatas` (
`cdn_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_mb` decimal(20,2) NOT NULL,
  `m95_mbps` decimal(20,2) NOT NULL,
  `peak_mbps` decimal(20,2) NOT NULL,
  `total_hits` int(20) NOT NULL,
  `http_total_mb` decimal(20,2) NOT NULL,
  `stream_total_mb` decimal(10,2) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}itdatas` (`cdn_id`, `date`, `total_mb`, `m95_mbps`, `peak_mbps`, `total_hits`, `http_total_mb`, `stream_total_mb`, `last_modified`) VALUES
(3, '2013-01-07', 0.00, 0.00, 0.00, 0, 0.00, 0.00, '2013-03-04 09:21:06'),
(4, '2013-01-14', 1828978.86, 29.48, 54.73, 99690523, 1828978.64, 0.22, '2013-03-04 09:21:10'),
(7, '2013-01-21', 0.00, 0.00, 0.00, 0, 0.00, 0.00, '2013-03-04 09:21:13'),
(8, '2013-01-28', 0.00, 0.00, 0.00, 0, 0.00, 0.00, '2013-03-04 09:21:16'),
(9, '2013-02-04', 6149798.08, 29.79, 55.24, 350329649, 6149797.76, 0.32, '2013-03-04 09:21:22'),
(10, '2013-02-11', 6149798.08, 29.79, 55.24, 350329649, 6149797.76, 0.32, '2013-03-04 09:21:27'),
(11, '2013-02-18', 3219117.40, 28.78, 54.73, 175909290, 3219117.04, 0.36, '2013-03-04 09:21:35'),
(12, '2013-02-25', 4658994.77, 28.66, 54.73, 259806964, 4658994.35, 0.42, '2013-03-04 09:21:43'),
(15, '2013-03-04', 5901064.81, 30.53, 54.73, 330050825, 5901064.32, 0.49, '2013-03-04 09:22:22'),
(17, '2013-03-12', 2014310.13, 31.80, 44.86, 115340997, 2014310.07, 0.06, '2013-04-02 14:18:29'),
(18, '2013-03-18', 3629066.79, 32.02, 72.06, 208571313, 3629066.64, 0.15, '2013-04-02 14:18:34'),
(19, '2013-03-27', 5326333.71, 33.37, 72.06, 304247873, 5326333.51, 0.20, '2013-04-02 14:18:39'),
(20, '2013-04-02', 7115643.96, 33.08, 72.06, 400698553, 7115643.72, 0.24, '2013-04-02 14:24:16'),
(21, '2013-04-07', 1534720.01, 33.64, 116.74, 86310802, 1534719.98, 0.04, '2013-04-09 15:36:56'),
(22, '2013-04-15', 3555991.40, 38.53, 125.54, 203382436, 3555991.31, 0.01, '2013-04-22 10:05:23'),
(23, '2013-04-22', 7605889.95, 39.08, 125.54, 434241802, 7605889.74, 0.21, '2013-05-01 12:15:53'),
(24, '2013-05-13', 2472781.26, 28.60, 37.31, 139730024, 2472781.20, 0.06, '2013-05-13 10:39:46'),
(25, '2013-05-06', 538537.75, 26.64, 35.71, 31124830, 538537.73, 0.02, '2013-05-13 10:39:50'),
(26, '2013-05-02', 8348503.14, 38.59, 125.54, 477515454, 8348502.92, 0.22, '2013-05-13 10:41:17'),
(27, '2013-05-20', 4244402.47, 31.72, 51.13, 244886430, 4244411.68, 0.09, '2013-05-21 09:29:26'),
(28, '2013-05-27', 6048725.86, 32.97, 92.60, 347314553, 6048725.74, 0.12, '2013-06-03 13:29:41'),
(29, '2013-06-04', 7613647.19, 33.42, 92.60, 444099475, 7613647.04, 0.15, '2013-06-07 08:25:23'),
(30, '2013-06-06', 190200.10, 22.01, 29.87, 10857416, 190200.10, 0.00, '2013-06-07 08:29:28'),
(31, '2013-06-17', 3548001.29, 31.76, 89.49, 206115606, 3548001.21, 0.08, '2013-06-17 09:44:18'),
(32, '2013-06-10', 1972716.32, 33.55, 89.49, 116982446, 1972716.29, 0.04, '2013-06-17 09:44:54'),
(33, '2013-06-24', 5.00, 32.85, 89.49, 298, 5258192.00, 0.11, '2013-07-01 15:28:57'),
(34, '2013-07-02', 7033254.91, 31.85, 116.38, 409793786, 7033254.76, 0.15, '2013-07-11 13:37:02'),
(35, '2013-07-11', 1335385.63, 30.11, 46.11, 82418015, 1335385.60, 0.04, '2013-07-11 13:33:53'),
(36, '2013-07-15', 2725214.19, 28.42, 52.62, 159267770, 2725214.12, 0.07, '2013-07-22 14:40:55'),
(37, '2013-07-22', 4088537.99, 27.62, 52.62, 240976484, 4088537.87, 0.12, '2013-07-22 14:46:59'),
(38, '2013-07-29', 5586506.78, 28.19, 52.62, 316737261, 5586506.58, 0.19, '2013-08-01 14:33:47'),
(39, '2013-08-02', 6427820.89, 28.07, 52.62, 361849053, 6427820.67, 0.22, '2013-08-05 08:39:48'),
(40, '2013-08-09', 620152.88, 27.81, 33.72, 31609719, 620152.86, 0.01, '2013-08-09 11:11:09'),
(41, '2013-10-02', 9283490.09, 48.00, 215.82, 485236576, 9283489.95, 0.14, '2013-10-08 07:49:09'),
(42, '2013-10-07', 1974691.75, 61.66, 81.77, 121094600, 1974691.73, 0.02, '2013-10-08 07:49:28'),
(43, '2013-09-30', 8970161.26, 48.00, 215.82, 467561730, 8881811.71, 0.14, '2013-10-08 09:48:33'),
(44, '2013-10-21', 6519657.19, 51.22, 81.77, 385146415, 6519657.09, 0.01, '2013-11-18 10:50:35'),
(45, '2013-10-28', 9422621.32, 57.36, 162.10, 522321286, 9422621.19, 0.13, '2013-11-18 10:52:53'),
(46, '2013-11-05', 532012.28, 35.01, 40.40, 29852973, 532012.27, 0.01, '2013-11-18 10:55:23'),
(47, '2013-11-13', 2774211.20, 43.32, 118.38, 157884034, 2774211.15, 0.05, '2013-11-18 10:57:01'),
(48, '2013-11-18', 4644108.20, 40.37, 118.38, 262446389, 4644108.13, 0.06, '2013-11-18 10:58:49'),
(49, '2013-11-25', 7910598.35, 49.57, 118.38, 450890351, 7910598.24, 0.11, '2013-11-25 14:03:42'),
(50, '2013-12-03', 10154537.99, 48.53, 118.38, 578274430, 10084107.06, 0.12, '2013-12-13 14:10:48'),
(51, '2013-12-09', 1991710.34, 35.67, 45.46, 105646914, 1991710.30, 0.04, '2013-12-13 14:12:18'),
(52, '2014-01-28', 7329111.21, 47.52, 135.78, 299697433, 7329111.13, 0.08, '2014-01-28 14:31:06');

-- split --

CREATE TABLE `{DBPREFIX}it_servicedesk_data` (
`servicedesk_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `asset_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `asset_type` int(11) NOT NULL,
  `asset_price` decimal(20,2) NOT NULL,
  `asset_serial_no` int(20) NOT NULL,
  `asset_vendor` int(11) NOT NULL,
  `asset_department` int(11) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}it_servicedesk_data` (`servicedesk_id`, `date`, `asset_name`, `asset_type`, `asset_price`, `asset_serial_no`, `asset_vendor`, `asset_department`, `last_modified`) VALUES
(3, '2013-01-07', 'Macbook Air', 2, 800.00, 0, 1, 2, '2014-03-29 11:47:16'),
(4, '2014-03-24', 'HP Laptop', 2, 400.00, 2147483647, 1, 2, '2014-03-29 11:45:01');

-- split --

CREATE TABLE `{DBPREFIX}keys` (
`id` int(11) NOT NULL,
  `key` varchar(40) NOT NULL,
  `level` int(2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `date_created` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- split --

INSERT INTO `{DBPREFIX}keys` (`id`, `key`, `level`, `note`, `date_created`) VALUES
(1, 'ixZePbqTLpCfiVvkTwLPEHb8kmekJeGJiQRAIAoQ', 0, 'test', 1427753576);

-- split --

CREATE TABLE `{DBPREFIX}keywords` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

CREATE TABLE `{DBPREFIX}login_attempts` (
`id` mediumint(8) unsigned NOT NULL,
  `ip_address` varbinary(16) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- split --

CREATE TABLE `{DBPREFIX}logs` (
`id` int(11) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `method` varchar(6) NOT NULL,
  `params` text,
  `api_key` varchar(40) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `time` int(11) NOT NULL,
  `rtime` float DEFAULT NULL,
  `authorized` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE `{DBPREFIX}meta` (
`id` mediumint(8) unsigned NOT NULL,
  `user_id` mediumint(8) unsigned NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8 DEFAULT '',
  `last_name` varchar(50) CHARACTER SET utf8 DEFAULT '',
  `company` varchar(100) CHARACTER SET utf8 DEFAULT '',
  `phone` varchar(20) CHARACTER SET utf8 DEFAULT '',
  `last_visited_version` varchar(48) CHARACTER SET utf8 DEFAULT ''
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}meta` (`id`, `user_id`, `first_name`, `last_name`, `company`, `phone`, `last_visited_version`) VALUES
(1, 1, 'mis', 'demo', '', '', '');

-- split --

CREATE TABLE `{DBPREFIX}migrations` (
  `version` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- split --

INSERT INTO `{DBPREFIX}migrations` (`version`) VALUES
(0);

-- split --

CREATE TABLE `{DBPREFIX}modules` (
`id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `version` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `skip_xss` tinyint(1) NOT NULL,
  `is_frontend` tinyint(1) NOT NULL,
  `is_backend` tinyint(1) NOT NULL,
  `menu` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `installed` tinyint(1) NOT NULL,
  `is_core` tinyint(1) NOT NULL,
  `updated_on` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}modules` (`id`, `name`, `slug`, `version`, `type`, `description`, `skip_xss`, `is_frontend`, `is_backend`, `menu`, `enabled`, `installed`, `is_core`, `updated_on`) VALUES
(1, 'a:1:{s:2:"en";s:6:"Apikey";}', 'apikey', '1.0', NULL, 'a:1:{s:2:"en";s:25:"Module to get an API Key.";}', 0, 1, 1, 'admin', 1, 1, 1, 1422546883),
(2, 'a:1:{s:2:"en";s:8:"Calendar";}', 'calendar', '1.0', NULL, 'a:1:{s:2:"en";s:8:"Calendar";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(3, 'a:25:{s:2:"en";s:7:"Contact";s:2:"ar";s:14:"الإتصال";s:2:"br";s:7:"Contato";s:2:"pt";s:8:"Contacto";s:2:"cs";s:7:"Kontakt";s:2:"da";s:7:"Kontakt";s:2:"de";s:7:"Kontakt";s:2:"el";s:22:"Επικοινωνία";s:2:"es";s:8:"Contacto";s:2:"fa";s:18:"تماس با ما";s:2:"fi";s:13:"Ota yhteyttä";s:2:"fr";s:7:"Contact";s:2:"he";s:17:"יצירת קשר";s:2:"id";s:6:"Kontak";s:2:"it";s:10:"Contattaci";s:2:"lt";s:18:"Kontaktinė formą";s:2:"nl";s:7:"Contact";s:2:"pl";s:7:"Kontakt";s:2:"ru";s:27:"Обратная связь";s:2:"sl";s:7:"Kontakt";s:2:"tw";s:12:"聯絡我們";s:2:"cn";s:12:"联络我们";s:2:"hu";s:9:"Kapcsolat";s:2:"th";s:18:"ติดต่อ";s:2:"se";s:7:"Kontakt";}', 'contact', '1.0.0', NULL, 'a:25:{s:2:"en";s:112:"Adds a form to your site that allows visitors to send emails to you without disclosing an email address to them.";s:2:"ar";s:157:"إضافة استمارة إلى موقعك تُمكّن الزوّار من مراسلتك دون علمهم بعنوان البريد الإلكتروني.";s:2:"br";s:139:"Adiciona um formulário para o seu site permitir aos visitantes que enviem e-mails para voce sem divulgar um endereço de e-mail para eles.";s:2:"pt";s:116:"Adiciona um formulário ao seu site que permite aos visitantes enviarem e-mails sem divulgar um endereço de e-mail.";s:2:"cs";s:149:"Přidá na web kontaktní formulář pro návštěvníky a uživatele, díky kterému vás mohou kontaktovat i bez znalosti vaší e-mailové adresy.";s:2:"da";s:123:"Tilføjer en formular på din side som tillader besøgende at sende mails til dig, uden at du skal opgive din email-adresse";s:2:"de";s:119:"Fügt ein Formular hinzu, welches Besuchern erlaubt Emails zu schreiben, ohne die Kontakt Email-Adresse offen zu legen.";s:2:"el";s:273:"Προσθέτει μια φόρμα στον ιστότοπό σας που επιτρέπει σε επισκέπτες να σας στέλνουν μηνύμα μέσω email χωρίς να τους αποκαλύπτεται η διεύθυνση του email σας.";s:2:"fa";s:239:"فرم تماس را به سایت اضافه می کند تا مراجعین بتوانند بدون اینکه ایمیل شما را بدانند برای شما پیغام هایی را از طریق ایمیل ارسال نمایند.";s:2:"es";s:156:"Añade un formulario a tu sitio que permitirá a los visitantes enviarte correos electrónicos a ti sin darles tu dirección de correo directamente a ellos.";s:2:"fi";s:128:"Luo lomakkeen sivustollesi, josta kävijät voivat lähettää sähköpostia tietämättä vastaanottajan sähköpostiosoitetta.";s:2:"fr";s:122:"Ajoute un formulaire à votre site qui permet aux visiteurs de vous envoyer un e-mail sans révéler votre adresse e-mail.";s:2:"he";s:155:"מוסיף תופס יצירת קשר לאתר על מנת לא לחסוף כתובת דואר האלקטרוני של האתר למנועי פרסומות";s:2:"id";s:149:"Menambahkan formulir ke dalam situs Anda yang memungkinkan pengunjung untuk mengirimkan email kepada Anda tanpa memberikan alamat email kepada mereka";s:2:"it";s:119:"Aggiunge un modulo al tuo sito che permette ai visitatori di inviarti email senza mostrare loro il tuo indirizzo email.";s:2:"lt";s:124:"Prideda jūsų puslapyje formą leidžianti lankytojams siūsti jums el. laiškus neatskleidžiant jūsų el. pašto adreso.";s:2:"nl";s:125:"Voegt een formulier aan de site toe waarmee bezoekers een email kunnen sturen, zonder dat u ze een emailadres hoeft te tonen.";s:2:"pl";s:126:"Dodaje formularz kontaktowy do Twojej strony, który pozwala użytkownikom wysłanie maila za pomocą formularza kontaktowego.";s:2:"ru";s:234:"Добавляет форму обратной связи на сайт, через которую посетители могут отправлять вам письма, при этом адрес Email остаётся скрыт.";s:2:"sl";s:113:"Dodaj obrazec za kontakt da vam lahko obiskovalci pošljejo sporočilo brez da bi jim razkrili vaš email naslov.";s:2:"tw";s:147:"為您的網站新增「聯絡我們」的功能，對訪客是較為清楚便捷的聯絡方式，也無須您將電子郵件公開在網站上。";s:2:"cn";s:147:"为您的网站新增“联络我们”的功能，对访客是较为清楚便捷的联络方式，也无须您将电子邮件公开在网站上。";s:2:"th";s:316:"เพิ่มแบบฟอร์มในเว็บไซต์ของคุณ ช่วยให้ผู้เยี่ยมชมสามารถส่งอีเมลถึงคุณโดยไม่ต้องเปิดเผยที่อยู่อีเมลของพวกเขา";s:2:"hu";s:156:"Létrehozható vele olyan űrlap, amely lehetővé teszi a látogatók számára, hogy e-mailt küldjenek neked úgy, hogy nem feded fel az e-mail címedet.";s:2:"se";s:53:"Lägger till ett kontaktformulär till din webbplats.";}', 0, 0, 0, '0', 1, 1, 1, 1431093230),
(4, 'a:1:{s:2:"en";s:9:"Dashboard";}', 'dashboard', '1.0', NULL, 'a:1:{s:2:"en";s:9:"Dashboard";}', 0, 0, 1, '0', 1, 1, 1, 1432044934),
(5, 'a:23:{s:2:"en";s:6:"Groups";s:2:"ar";s:18:"المجموعات";s:2:"br";s:6:"Grupos";s:2:"pt";s:6:"Grupos";s:2:"cs";s:7:"Skupiny";s:2:"da";s:7:"Grupper";s:2:"de";s:7:"Gruppen";s:2:"el";s:12:"Ομάδες";s:2:"es";s:6:"Grupos";s:2:"fi";s:7:"Ryhmät";s:2:"fr";s:7:"Groupes";s:2:"he";s:12:"קבוצות";s:2:"id";s:4:"Grup";s:2:"it";s:6:"Gruppi";s:2:"lt";s:7:"Grupės";s:2:"nl";s:7:"Groepen";s:2:"ru";s:12:"Группы";s:2:"sl";s:7:"Skupine";s:2:"tw";s:6:"群組";s:2:"cn";s:6:"群组";s:2:"hu";s:9:"Csoportok";s:2:"th";s:15:"กลุ่ม";s:2:"se";s:7:"Grupper";}', 'groups', '1.0.0', NULL, 'a:23:{s:2:"en";s:54:"Users can be placed into groups to manage permissions.";s:2:"ar";s:100:"يمكن وضع المستخدمين في مجموعات لتسهيل إدارة صلاحياتهم.";s:2:"br";s:72:"Usuários podem ser inseridos em grupos para gerenciar suas permissões.";s:2:"pt";s:74:"Utilizadores podem ser inseridos em grupos para gerir as suas permissões.";s:2:"cs";s:77:"Uživatelé mohou být rozřazeni do skupin pro lepší správu oprávnění.";s:2:"da";s:49:"Brugere kan inddeles i grupper for adgangskontrol";s:2:"de";s:85:"Benutzer können zu Gruppen zusammengefasst werden um diesen Zugriffsrechte zu geben.";s:2:"el";s:168:"Οι χρήστες μπορούν να τοποθετηθούν σε ομάδες και έτσι να διαχειριστείτε τα δικαιώματά τους.";s:2:"es";s:75:"Los usuarios podrán ser colocados en grupos para administrar sus permisos.";s:2:"fi";s:84:"Käyttäjät voidaan liittää ryhmiin, jotta käyttöoikeuksia voidaan hallinnoida.";s:2:"fr";s:82:"Les utilisateurs peuvent appartenir à des groupes afin de gérer les permissions.";s:2:"he";s:62:"נותן אפשרות לאסוף משתמשים לקבוצות";s:2:"id";s:68:"Pengguna dapat dikelompokkan ke dalam grup untuk mengatur perizinan.";s:2:"it";s:69:"Gli utenti possono essere inseriti in gruppi per gestirne i permessi.";s:2:"lt";s:67:"Vartotojai gali būti priskirti grupei tam, kad valdyti jų teises.";s:2:"nl";s:73:"Gebruikers kunnen in groepen geplaatst worden om rechten te kunnen geven.";s:2:"ru";s:134:"Пользователей можно объединять в группы, для управления правами доступа.";s:2:"sl";s:64:"Uporabniki so lahko razvrščeni v skupine za urejanje dovoljenj";s:2:"tw";s:45:"用戶可以依群組分類並管理其權限";s:2:"cn";s:45:"用户可以依群组分类并管理其权限";s:2:"hu";s:73:"A felhasználók csoportokba rendezhetőek a jogosultságok kezelésére.";s:2:"th";s:84:"สามารถวางผู้ใช้ลงในกลุ่มเพื่";s:2:"se";s:76:"Användare kan delas in i grupper för att hantera roller och behörigheter.";}', 0, 0, 1, 'users', 1, 1, 1, 1422891927),
(6, 'a:1:{s:2:"en";s:10:"It Reports";}', 'itreports', '1.0.0', NULL, 'a:1:{s:2:"en";s:46:"Exprimental Module for IT Dashboards & Reports";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(7, 'a:17:{s:2:"en";s:8:"Keywords";s:2:"ar";s:21:"كلمات البحث";s:2:"br";s:14:"Palavras-chave";s:2:"pt";s:14:"Palavras-chave";s:2:"da";s:9:"Nøgleord";s:2:"el";s:27:"Λέξεις Κλειδιά";s:2:"fa";s:21:"کلمات کلیدی";s:2:"fr";s:10:"Mots-Clés";s:2:"id";s:10:"Kata Kunci";s:2:"nl";s:14:"Sleutelwoorden";s:2:"tw";s:6:"鍵詞";s:2:"cn";s:6:"键词";s:2:"hu";s:11:"Kulcsszavak";s:2:"fi";s:10:"Avainsanat";s:2:"sl";s:15:"Ključne besede";s:2:"th";s:15:"คำค้น";s:2:"se";s:9:"Nyckelord";}', 'keywords', '1.1.0', NULL, 'a:17:{s:2:"en";s:71:"Maintain a central list of keywords to label and organize your content.";s:2:"ar";s:124:"أنشئ مجموعة من كلمات البحث التي تستطيع من خلالها وسم وتنظيم المحتوى.";s:2:"br";s:85:"Mantém uma lista central de palavras-chave para rotular e organizar o seu conteúdo.";s:2:"pt";s:85:"Mantém uma lista central de palavras-chave para rotular e organizar o seu conteúdo.";s:2:"da";s:72:"Vedligehold en central liste af nøgleord for at organisere dit indhold.";s:2:"el";s:181:"Συντηρεί μια κεντρική λίστα από λέξεις κλειδιά για να οργανώνετε μέσω ετικετών το περιεχόμενό σας.";s:2:"fa";s:110:"حفظ و نگهداری لیست مرکزی از کلمات کلیدی برای سازماندهی محتوا";s:2:"fr";s:87:"Maintenir une liste centralisée de Mots-Clés pour libeller et organiser vos contenus.";s:2:"id";s:71:"Memantau daftar kata kunci untuk melabeli dan mengorganisasikan konten.";s:2:"nl";s:91:"Beheer een centrale lijst van sleutelwoorden om uw content te categoriseren en organiseren.";s:2:"tw";s:64:"集中管理可用於標題與內容的鍵詞(keywords)列表。";s:2:"cn";s:64:"集中管理可用于标题与内容的键词(keywords)列表。";s:2:"hu";s:65:"Ez egy központi kulcsszó lista a cimkékhez és a tartalmakhoz.";s:2:"fi";s:92:"Hallinnoi keskitettyä listaa avainsanoista merkitäksesi ja järjestelläksesi sisältöä.";s:2:"sl";s:82:"Vzdržuj centralni seznam ključnih besed za označevanje in ogranizacijo vsebine.";s:2:"th";s:189:"ศูนย์กลางการปรับปรุงคำค้นในการติดฉลากและจัดระเบียบเนื้อหาของคุณ";s:2:"se";s:61:"Hantera nyckelord för att organisera webbplatsens innehåll.";}', 0, 0, 1, 'data', 1, 1, 1, 1431093230),
(8, 'N;', 'modules', '1.0', NULL, 'N;', 0, 0, 0, '0', 1, 1, 1, 1422891927),
(9, 'a:25:{s:2:"en";s:11:"Permissions";s:2:"ar";s:18:"الصلاحيات";s:2:"br";s:11:"Permissões";s:2:"pt";s:11:"Permissões";s:2:"cs";s:12:"Oprávnění";s:2:"da";s:14:"Adgangskontrol";s:2:"de";s:14:"Zugriffsrechte";s:2:"el";s:20:"Δικαιώματα";s:2:"es";s:8:"Permisos";s:2:"fa";s:15:"اجازه ها";s:2:"fi";s:16:"Käyttöoikeudet";s:2:"fr";s:11:"Permissions";s:2:"he";s:12:"הרשאות";s:2:"id";s:9:"Perizinan";s:2:"it";s:8:"Permessi";s:2:"lt";s:7:"Teisės";s:2:"nl";s:15:"Toegangsrechten";s:2:"pl";s:11:"Uprawnienia";s:2:"ru";s:25:"Права доступа";s:2:"sl";s:10:"Dovoljenja";s:2:"tw";s:6:"權限";s:2:"cn";s:6:"权限";s:2:"hu";s:14:"Jogosultságok";s:2:"th";s:18:"สิทธิ์";s:2:"se";s:13:"Behörigheter";}', 'permissions', '1.0.0', NULL, 'a:25:{s:2:"en";s:68:"Control what type of users can see certain sections within the site.";s:2:"ar";s:127:"التحكم بإعطاء الصلاحيات للمستخدمين للوصول إلى أقسام الموقع المختلفة.";s:2:"br";s:68:"Controle quais tipos de usuários podem ver certas seções no site.";s:2:"pt";s:75:"Controle quais os tipos de utilizadores podem ver certas secções no site.";s:2:"cs";s:93:"Spravujte oprávnění pro jednotlivé typy uživatelů a ke kterým sekcím mají přístup.";s:2:"da";s:72:"Kontroller hvilken type brugere der kan se bestemte sektioner på sitet.";s:2:"de";s:70:"Regelt welche Art von Benutzer welche Sektion in der Seite sehen kann.";s:2:"el";s:180:"Ελέγξτε τα δικαιώματα χρηστών και ομάδων χρηστών όσο αφορά σε διάφορες λειτουργίες του ιστοτόπου.";s:2:"es";s:81:"Controla que tipo de usuarios pueden ver secciones específicas dentro del sitio.";s:2:"fa";s:59:"مدیریت اجازه های گروه های کاربری";s:2:"fi";s:72:"Hallitse minkä tyyppisiin osioihin käyttäjät pääsevät sivustolla.";s:2:"fr";s:104:"Permet de définir les autorisations des groupes d''utilisateurs pour afficher les différentes sections.";s:2:"he";s:75:"ניהול הרשאות כניסה לאיזורים מסוימים באתר";s:2:"id";s:76:"Mengontrol tipe pengguna mana yang dapat mengakses suatu bagian dalam situs.";s:2:"it";s:78:"Controlla che tipo di utenti posssono accedere a determinate sezioni del sito.";s:2:"lt";s:72:"Kontroliuokite kokio tipo varotojai kokią dalį puslapio gali pasiekti.";s:2:"nl";s:71:"Bepaal welke typen gebruikers toegang hebben tot gedeeltes van de site.";s:2:"pl";s:79:"Ustaw, którzy użytkownicy mogą mieć dostęp do odpowiednich sekcji witryny.";s:2:"ru";s:209:"Управление правами доступа, ограничение доступа определённых групп пользователей к произвольным разделам сайта.";s:2:"sl";s:85:"Uredite dovoljenja kateri tip uporabnika lahko vidi določena področja vaše strani.";s:2:"tw";s:81:"用來控制不同類別的用戶，設定其瀏覽特定網站內容的權限。";s:2:"cn";s:81:"用来控制不同类别的用户，设定其浏览特定网站内容的权限。";s:2:"hu";s:129:"A felhasználók felügyelet alatt tartására, hogy milyen típusú felhasználók, mit láthatnak, mely szakaszain az oldalnak.";s:2:"th";s:117:"ควบคุมว่าผู้ใช้งานจะเห็นหมวดหมู่ไหนบ้าง";s:2:"se";s:27:"Hantera gruppbehörigheter.";}', 0, 0, 1, 'users', 1, 1, 1, 1431093230),
(10, 'a:23:{s:2:"en";s:8:"Settings";s:2:"ar";s:18:"الإعدادات";s:2:"br";s:15:"Configurações";s:2:"pt";s:15:"Configurações";s:2:"cs";s:10:"Nastavení";s:2:"da";s:13:"Indstillinger";s:2:"de";s:13:"Einstellungen";s:2:"el";s:18:"Ρυθμίσεις";s:2:"es";s:15:"Configuraciones";s:2:"fi";s:9:"Asetukset";s:2:"fr";s:11:"Paramètres";s:2:"he";s:12:"הגדרות";s:2:"id";s:10:"Pengaturan";s:2:"it";s:12:"Impostazioni";s:2:"lt";s:10:"Nustatymai";s:2:"nl";s:12:"Instellingen";s:2:"pl";s:10:"Ustawienia";s:2:"ru";s:18:"Настройки";s:2:"sl";s:10:"Nastavitve";s:2:"zh";s:12:"網站設定";s:2:"hu";s:14:"Beállítások";s:2:"th";s:21:"ตั้งค่า";s:2:"se";s:14:"Inställningar";}', 'settings', '1.0', NULL, 'a:23:{s:2:"en";s:89:"Allows administrators to update settings like Site Name, messages and email address, etc.";s:2:"ar";s:161:"تمكن المدراء من تحديث الإعدادات كإسم الموقع، والرسائل وعناوين البريد الإلكتروني، .. إلخ.";s:2:"br";s:120:"Permite com que administradores e a equipe consigam trocar as configurações do website incluindo o nome e descrição.";s:2:"pt";s:113:"Permite com que os administradores consigam alterar as configurações do website incluindo o nome e descrição.";s:2:"cs";s:102:"Umožňuje administrátorům měnit nastavení webu jako jeho jméno, zprávy a emailovou adresu apod.";s:2:"da";s:90:"Lader administratorer opdatere indstillinger som sidenavn, beskeder og email adresse, etc.";s:2:"de";s:92:"Erlaubt es Administratoren die Einstellungen der Seite wie Name und Beschreibung zu ändern.";s:2:"el";s:230:"Επιτρέπει στους διαχειριστές να τροποποιήσουν ρυθμίσεις όπως το Όνομα του Ιστοτόπου, τα μηνύματα και τις διευθύνσεις email, κ.α.";s:2:"es";s:131:"Permite a los administradores y al personal configurar los detalles del sitio como el nombre del sitio y la descripción del mismo.";s:2:"fi";s:105:"Mahdollistaa sivuston asetusten muokkaamisen, kuten sivuston nimen, viestit ja sähköpostiosoitteet yms.";s:2:"fr";s:105:"Permet aux admistrateurs et au personnel de modifier les paramètres du site : nom du site et description";s:2:"he";s:116:"ניהול הגדרות שונות של האתר כגון: שם האתר, הודעות, כתובות דואר וכו";s:2:"id";s:112:"Memungkinkan administrator untuk dapat memperbaharui pengaturan seperti nama situs, pesan dan alamat email, dsb.";s:2:"it";s:109:"Permette agli amministratori di aggiornare impostazioni quali Nome del Sito, messaggi e indirizzo email, etc.";s:2:"lt";s:104:"Leidžia administratoriams keisti puslapio vavadinimą, žinutes, administratoriaus el. pašta ir kitą.";s:2:"nl";s:114:"Maakt het administratoren en medewerkers mogelijk om websiteinstellingen zoals naam en beschrijving te veranderen.";s:2:"pl";s:103:"Umożliwia administratorom zmianę ustawień strony jak nazwa strony, opis, e-mail administratora, itd.";s:2:"ru";s:135:"Управление настройками сайта - Имя сайта, сообщения, почтовые адреса и т.п.";s:2:"sl";s:98:"Dovoljuje administratorjem posodobitev nastavitev kot je Ime strani, sporočil, email naslova itd.";s:2:"zh";s:99:"網站管理者可更新的重要網站設定。例如：網站名稱、訊息、電子郵件等。";s:2:"hu";s:125:"Lehetővé teszi az adminok számára a beállítások frissítését, mint a weboldal neve, üzenetek, e-mail címek, stb...";s:2:"th";s:232:"ให้ผู้ดูแลระบบสามารถปรับปรุงการตั้งค่าเช่นชื่อเว็บไซต์ ข้อความและอีเมล์เป็นต้น";s:2:"se";s:84:"Administratören kan uppdatera webbplatsens titel, meddelanden och E-postadress etc.";}', 1, 0, 1, 'settings', 1, 1, 1, 1432044934),
(11, 'a:12:{s:2:"en";s:6:"System";s:2:"pt";s:12:"Manutenção";s:2:"ar";s:14:"الصيانة";s:2:"el";s:18:"Συντήρηση";s:2:"hu";s:13:"Karbantartás";s:2:"fi";s:9:"Ylläpito";s:2:"fr";s:6:"system";s:2:"id";s:12:"Pemeliharaan";s:2:"se";s:10:"Underhåll";s:2:"sl";s:12:"Vzdrževanje";s:2:"th";s:39:"การบำรุงรักษา";s:2:"zh";s:6:"維護";}', 'system', '1.0', NULL, 'a:12:{s:2:"en";s:63:"Manage the site cache and export information from the database.";s:2:"pt";s:68:"Gerir o cache do seu site e exportar informações da base de dados.";s:2:"ar";s:81:"حذف عناصر الذاكرة المخبأة عبر واجهة الإدارة.";s:2:"el";s:142:"Διαγραφή αντικειμένων προσωρινής αποθήκευσης μέσω της περιοχής διαχείρισης.";s:2:"id";s:60:"Mengatur cache situs dan mengexport informasi dari database.";s:2:"fr";s:71:"Gérer le cache du site et exporter les contenus de la base de données";s:2:"fi";s:59:"Hallinoi sivuston välimuistia ja vie tietoa tietokannasta.";s:2:"hu";s:66:"Az oldal gyorsítótár kezelése és az adatbázis exportálása.";s:2:"se";s:76:"Underhåll webbplatsens cache och exportera data från webbplatsens databas.";s:2:"sl";s:69:"Upravljaj s predpomnilnikom strani (cache) in izvozi podatke iz baze.";s:2:"th";s:150:"การจัดการแคชเว็บไซต์และข้อมูลการส่งออกจากฐานข้อมูล";s:2:"zh";s:45:"經由管理介面手動刪除暫存資料。";}', 0, 0, 1, 'utilities', 1, 1, 1, 1422891927),
(12, 'a:2:{s:2:"en";s:6:"Themes";s:2:"se";s:5:"Teman";}', 'themes', '1.0', NULL, 'a:2:{s:2:"en";s:66:"Allows admins and staff to switch themes and manage theme options.";s:2:"se";s:73:"Hantera webbplatsens utseende genom teman och hantera temainställningar.";}', 0, 0, 1, 'design', 1, 1, 1, 1422891927),
(13, 'a:23:{s:2:"en";s:5:"Users";s:2:"ar";s:20:"المستخدمون";s:2:"br";s:9:"Usuários";s:2:"pt";s:12:"Utilizadores";s:2:"cs";s:11:"Uživatelé";s:2:"da";s:7:"Brugere";s:2:"de";s:8:"Benutzer";s:2:"el";s:14:"Χρήστες";s:2:"es";s:8:"Usuarios";s:2:"fi";s:12:"Käyttäjät";s:2:"fr";s:12:"Utilisateurs";s:2:"he";s:14:"משתמשים";s:2:"id";s:8:"Pengguna";s:2:"it";s:6:"Utenti";s:2:"lt";s:10:"Vartotojai";s:2:"nl";s:10:"Gebruikers";s:2:"pl";s:12:"Użytkownicy";s:2:"ru";s:24:"Пользователи";s:2:"sl";s:10:"Uporabniki";s:2:"zh";s:6:"用戶";s:2:"hu";s:14:"Felhasználók";s:2:"th";s:27:"ผู้ใช้งาน";s:2:"se";s:10:"Användare";}', 'users', '1.0', NULL, 'a:23:{s:2:"en";s:81:"Let users register and log in to the site, and manage them via the control panel.";s:2:"ar";s:133:"تمكين المستخدمين من التسجيل والدخول إلى الموقع، وإدارتهم من لوحة التحكم.";s:2:"br";s:125:"Permite com que usuários se registrem e entrem no site e também que eles sejam gerenciáveis apartir do painel de controle.";s:2:"pt";s:125:"Permite com que os utilizadores se registem e entrem no site e também que eles sejam geriveis apartir do painel de controlo.";s:2:"cs";s:103:"Umožňuje uživatelům se registrovat a přihlašovat a zároveň jejich správu v Kontrolním panelu.";s:2:"da";s:89:"Lader brugere registrere sig og logge ind på sitet, og håndtér dem via kontrolpanelet.";s:2:"de";s:108:"Erlaube Benutzern das Registrieren und Einloggen auf der Seite und verwalte sie über die Admin-Oberfläche.";s:2:"el";s:208:"Παρέχει λειτουργίες εγγραφής και σύνδεσης στους επισκέπτες. Επίσης από εδώ γίνεται η διαχείριση των λογαριασμών.";s:2:"es";s:138:"Permite el registro de nuevos usuarios quienes podrán loguearse en el sitio. Estos podrán controlarse desde el panel de administración.";s:2:"fi";s:126:"Antaa käyttäjien rekisteröityä ja kirjautua sisään sivustolle sekä mahdollistaa niiden muokkaamisen hallintapaneelista.";s:2:"fr";s:112:"Permet aux utilisateurs de s''enregistrer et de se connecter au site et de les gérer via le panneau de contrôle";s:2:"he";s:62:"ניהול משתמשים: רישום, הפעלה ומחיקה";s:2:"id";s:102:"Memungkinkan pengguna untuk mendaftar dan masuk ke dalam situs, dan mengaturnya melalui control panel.";s:2:"it";s:95:"Fai iscrivere de entrare nel sito gli utenti, e gestiscili attraverso il pannello di controllo.";s:2:"lt";s:106:"Leidžia vartotojams registruotis ir prisijungti prie puslapio, ir valdyti juos per administravimo panele.";s:2:"nl";s:88:"Laat gebruikers registreren en inloggen op de site, en beheer ze via het controlepaneel.";s:2:"pl";s:87:"Pozwól użytkownikom na logowanie się na stronie i zarządzaj nimi za pomocą panelu.";s:2:"ru";s:155:"Управление зарегистрированными пользователями, активирование новых пользователей.";s:2:"sl";s:96:"Dovoli uporabnikom za registracijo in prijavo na strani, urejanje le teh preko nadzorne plošče";s:2:"zh";s:87:"讓用戶可以註冊並登入網站，並且管理者可在控制台內進行管理。";s:2:"th";s:210:"ให้ผู้ใช้ลงทะเบียนและเข้าสู่เว็บไซต์และจัดการกับพวกเขาผ่านทางแผงควบคุม";s:2:"hu";s:120:"Hogy a felhasználók tudjanak az oldalra regisztrálni és belépni, valamint lehessen őket kezelni a vezérlőpulton.";s:2:"se";s:111:"Låt dina besökare registrera sig och logga in på webbplatsen. Hantera sedan användarna via kontrollpanelen.";}', 0, 0, 1, '0', 1, 1, 1, 1432044934),
(14, 'a:1:{s:2:"en";s:9:"Frontpage";}', 'frontpage', '1.0', NULL, 'a:1:{s:2:"en";s:20:"The Static Home Page";}', 0, 0, 0, '0', 1, 1, 1, 1432044934),
(15, 'a:2:{s:2:"en";s:11:"Search News";s:2:"se";s:11:"Sok Nyheter";}', 'newssearch', '1.0.0', NULL, 'a:2:{s:2:"en";s:11:"Search News";s:2:"se";s:11:"Sok Nyheter";}', 0, 0, 0, '0', 1, 1, 1, 1432044934);

-- split --

CREATE TABLE `{DBPREFIX}permissions` (
`id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `module` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `roles` text COLLATE utf8_unicode_ci
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

CREATE TABLE `{DBPREFIX}settings` (
  `slug` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `title` varchar(100) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `type` set('text','textarea','password','select','select-multiple','radio','checkbox') CHARACTER SET utf8 NOT NULL,
  `default` text CHARACTER SET utf8 NOT NULL,
  `value` text CHARACTER SET utf8,
  `options` varchar(255) CHARACTER SET utf8 NOT NULL,
  `is_required` int(1) NOT NULL,
  `is_gui` int(1) NOT NULL,
  `module` varchar(50) CHARACTER SET utf8 NOT NULL,
  `order` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}settings` (`slug`, `title`, `description`, `type`, `default`, `value`, `options`, `is_required`, `is_gui`, `module`, `order`) VALUES
('activation_email', 'Activation Email', 'Send out an e-mail with an activation link when a user signs up. Disable this so that admins must manually activate each account.', 'radio', '1', '0', '1=Enabled|0=Disabled', 0, 1, 'users', 961),
('admin_force_https', 'Force HTTPS for admin?', 'Allow only the HTTPS protocol when using the admin functions?', 'radio', '0', '0', '1=Yes|0=No', 1, 1, '', 0),
('admin_name', 'Administrator Name', 'The Administrators Name', 'text', '', 'Torbjorn Zetterlund', '', 0, 0, '', 0),
('admin_theme', 'Backend Theme', 'Select the theme for the backend.', '', 'default', 'totta', 'func:get_themes', 1, 1, '', 0),
('alchemy', 'Alchemy ', 'Do you want to use Alchemy', 'radio', '0', '1', '0=Disabled|1=Enabled', 0, 1, 'API', 1),
('alchemy_get_news', 'Alchemy API Get News', 'The specific Alchemy API function ', 'text', '', 'calls/data/GetNews', '', 1, 1, 'API', 5),
('alchemy_news_api', 'Alchemy', 'The API key for Alchemy', 'text', '', '', '', 0, 1, 'API', 2),
('alchemy_url', 'Alchemy URL', 'The URL of the Alchemy service', 'text', '', 'http://access.alchemyapi.com/', '', 0, 1, 'API', 3),
('allowed_extensions', 'Allowed extensions', '', '', '', 'pdf,png,psd,jpg,jpeg,bmp,ai,txt,zip,rar,7z,gzip,bzip,gz,gif,doc,docx,ppt,pptx,xls,xlsx,csv', '', 0, 0, '', 0),
('application_debug', 'Application Debug', 'Debug Application - requires - $this->output->enable_profiler($this->settings->application_debug) in your controller', 'radio', '0', '0', '1=True|0=False', 0, 1, '', 0),
('auto_update', '', '', '', '', '0', '', 0, 0, '', 0),
('auto_username', 'Auto Username', 'Create the username automatically, meaning users can skip making one on registration.', 'radio', '1', '1', '1=Enabled|0=Disabled', 0, 1, 'users', 964),
('backend_css', '', '', '', '', '', '', 0, 0, '', 0),
('custom_css', 'Custom CSS', '', '', '', '', '', 0, 0, '', 0),
('dashboard_rss_count', 'Dashboard RSS Items', 'How many RSS items would you like to display on the dashboard?', 'text', '5', '5', '', 1, 1, '', 989),
('date_format', 'Date Format', 'How should dates be displayed across the website and control panel? Using the <a target="_blank" href="http://php.net/manual/en/function.date.php">date format</a> from PHP - OR - Using the format of <a target="_blank" href="http://php.net/manual/en/function.strftime.php">strings formatted as date</a> from PHP.', 'text', 'Y-m-d', 'Y/m/d', '', 1, 1, '', 995),
('default_theme', 'Default Theme', 'Select the theme you want users to see by default.', '', 'default', 'totta', 'func:get_themes', 1, 0, '', 0),
('default_user_group', 'Default User Group', 'Here you set the default user group', 'text', 'regular', 'regular', '', 1, 1, 'users', 0),
('enable_profiles', 'Enable profiles', 'Allow users to add and edit profiles.', 'radio', '1', '1', '1=Enabled|0=Disabled', 1, 1, 'users', 963),
('enable_registration', 'Enable user registration', 'Allow users to register in your site.', 'radio', '1', '0', '1=Enabled|0=Disabled', 0, 1, 'users', 961),
('frontend_css', 'Frontend CSS', 'Add additional CSS', 'textarea', ' ', ' ', '', 0, 0, '', 0),
('frontend_enabled', 'Site Status', 'Use this option to the user-facing part of the site on or off. Useful when you want to take the site down for maintenance.', 'radio', '1', '1', '1=Open|0=Closed', 1, 1, '', 988),
('items_per_page', 'Items per page', '', '', '', '10', '', 0, 0, '', 0),
('language', '', '', '', '', 'english', '', 0, 0, '', 0),
('latest_version', '', '', '', '', '1.0.1', '', 0, 0, '', 0),
('latest_version_fetch', '', '', '', '', '1354438437', '', 0, 0, '', 0),
('local_auth', 'Local Auth', 'Enable to allow for local autherisation', 'select', '1', '1', '0=Disabled|1=Enabled', 1, 1, 'authentication', 0),
('logo_url', 'Logo URL', '', '', '', 'http://localhost/yggdrasil/assets/img/yggdrasil.jpg', '', 0, 0, '', 0),
('mail_protocol', 'Mail Protocol', 'All e-mails will be sent with this method.', 'text', 'sendmail', 'sendmail', '', 1, 1, 'email', 950),
('mail_sendmail_path', 'Mail Sendmail Path', 'All e-mails will be sent with this method.', 'text', '', '', '', 0, 1, 'email', 951),
('mail_smtp_host', 'SMTP Host', 'All e-mails will be sent with this method.', 'text', 'sendmail', 'sendmail', '', 1, 1, 'email', 952),
('mail_smtp_pass', 'SMTP Password', 'All e-mails will be sent with this method.', 'text', '', '', '', 0, 1, 'email', 954),
('mail_smtp_port', 'SMTP port number', 'All e-mails will be sent with this method.', 'text', '', '', '', 0, 1, 'email', 955),
('mail_smtp_user', 'SMTP username', 'All e-mails will be sent with this method.', 'text', '', '', '', 0, 1, 'email', 953),
('meta_topic', 'Meta Topic', 'Two or three words describing this type of company/website.', 'text', 'Content Management', 'Add your slogan here', '', 0, 1, '', 998),
('notify_email', '', '', '', '', 'tzetter@thunderbeardesign.com', '', 0, 0, '', 0),
('records_per_page', 'Records Per Page', 'How many records should we show per page in the admin section?', 'select', '25', '10', '10=10|25=25|50=50|100=100', 1, 1, '', 992),
('rss_feed_items', 'Feed item count', 'How many items should we show in RSS/blog feeds?', 'select', '25', '25', '10=10|25=25|50=50|100=100', 1, 1, '', 991),
('rss_password', 'RSS Password', 'RSS Password', 'text', '', '6Ohh44pWRsuz', '', 0, 0, '', 1001),
('send_multipart', '', '', '', '', '1', '', 0, 0, '', 0),
('send_x_days_before', '', '', '', '', '7', '', 0, 0, '', 0),
('server_email', 'Server E-mail', 'All e-mails to users will come from this e-mail address.', 'text', 'admin@localhost', '', '', 1, 1, 'email', 978),
('set_time_limit', 'Set Time Limit', 'Set time limit to retrieve html page from originated url or a pdf screenshoot from originated url- the value is in seconds', 'text', '120', '120', '120 ', 0, 1, 'Media', 0),
('show_text', 'Text to show', 'How many characters of main text to show', 'text', '100', '10', '', 0, 1, 'Feed', 0),
('site_lang', 'Site Language', 'The native language of the website, used to choose templates of e-mail notifications, contact form, and other features that should not depend on the language of a user.', 'select', 'en', 'en', 'func:get_supported_lang', 1, 1, '', 997),
('site_name', 'Site Name', 'The name of the website for page titles and for use around the site.', 'text', 'Un-named Website', 'Yggdrasil', '', 1, 1, '', 1000),
('site_public_lang', 'Public Languages', 'Which are the languages really supported and offered on the front-end of your website?', 'checkbox', 'en', 'en', 'func:get_supported_lang', 1, 1, '', 996),
('site_slogan', 'Site Slogan', 'The slogan of the website for page titles and for use around the site', 'text', '', 'One news at time', '', 0, 1, '', 999),
('smtp_host', '', '', '', '', '', '', 0, 0, '', 0),
('smtp_pass', '', '', '', '', '', '', 0, 0, '', 0),
('smtp_port', '', '', '', '', '25', '', 0, 0, '', 0),
('theme', 'Front End Theme', 'Select the theme you want users to see on the front end.', '', '', 'totta', 'func:get_themes', 1, 1, '', 0),
('timezone', 'Time Zone', 'Select your timezone', '', '', 'Europe/Berlin', '', 1, 1, '', 997),
('time_format', 'Time Format', 'How should time be displayed', '', '', 'H:i', '', 1, 1, '', 996),
('version', '', '', '', '', '1.0.1', '', 0, 0, '', 0);

-- split --

CREATE TABLE `{DBPREFIX}theme_options` (
`id` int(11) NOT NULL,
  `slug` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `type` set('text','textarea','password','select','select-multiple','radio','checkbox') COLLATE utf8_unicode_ci NOT NULL,
  `default` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `options` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_required` int(1) NOT NULL,
  `theme` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}theme_options` (`id`, `slug`, `title`, `description`, `type`, `default`, `value`, `options`, `is_required`, `theme`) VALUES
(1, 'show_breadcrumbs', 'Do you want to show breadcrumbs?', 'If selected it shows a string of breadcrumbs at the top of the page.', 'radio', 'Yes', 'Yes', 'yes=Yes|no=No', 1, 'totta');

-- --------------------------------------------------------

-- split --

CREATE TABLE `{DBPREFIX}updates` (
  `version` varchar(255) NOT NULL,
  `hashes` longtext NOT NULL,
  `suzip` longtext NOT NULL,
  `changed_files` longtext NOT NULL,
  `processed_changelog` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE `{DBPREFIX}update_files` (
`id` int(255) NOT NULL,
  `version` varchar(255) NOT NULL,
  `filename` text NOT NULL,
  `data` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- split --

CREATE TABLE `users` (
  `id` mediumint(8) unsigned NOT NULL,
  `client_id` int(10) NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  `ip_address` char(16) CHARACTER SET utf8 NOT NULL,
  `username` varchar(200) CHARACTER SET utf8 NOT NULL,
  `password` varchar(40) CHARACTER SET utf8 NOT NULL,
  `salt` varchar(40) CHARACTER SET utf8 DEFAULT '',
  `email` varchar(40) CHARACTER SET utf8 NOT NULL,
  `activation_code` varchar(40) CHARACTER SET utf8 DEFAULT '',
  `forgotten_password_code` varchar(40) CHARACTER SET utf8 DEFAULT '',
  `remember_code` varchar(40) CHARACTER SET utf8 DEFAULT '',
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT '1',
  `office` int(10) NOT NULL,
  `via_ldap` varchar(20) CHARACTER SET utf8 NOT NULL DEFAULT '0',
  `ldap_data` text CHARACTER SET utf8 NOT NULL,
  `tw_user_id` bigint(25) NOT NULL,
  `gmt` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `gmt_zone` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Europe/Amsterdam'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `users` (`id`, `client_id`, `group_id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `remember_code`, `created_on`, `last_login`, `active`, `office`, `via_ldap`, `ldap_data`, `tw_user_id`, `gmt`, `gmt_zone`) VALUES
(1, 0, 1, '0.0.0.0', '{USERNAME}', '{PASSWORD}', '{SALT}', '{EMAIL}', '', '', '', 1360925298, 1432045467, 1, 0, 'local', '', 0, '', '');

-- split --

ALTER TABLE `{DBPREFIX}users`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}action_logs`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}ci_sessions`
 ADD PRIMARY KEY (`id`), ADD KEY `last_activity_idx` (`timestamp`);
 
-- split --

ALTER TABLE `{DBPREFIX}groups`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}hidden_notifications`
 ADD KEY `user_id` (`user_id`,`notification_id`);

-- split --

ALTER TABLE `{DBPREFIX}itdatas`
 ADD PRIMARY KEY (`cdn_id`);

-- split --

ALTER TABLE `{DBPREFIX}it_servicedesk_data`
 ADD PRIMARY KEY (`servicedesk_id`);

-- split --

ALTER TABLE `{DBPREFIX}keys`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}keywords`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}login_attempts`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}logs`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}meta`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}modules`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `slug` (`slug`), ADD KEY `enabled` (`enabled`);

-- split --

ALTER TABLE `{DBPREFIX}permissions`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}settings`
 ADD PRIMARY KEY (`slug`), ADD KEY `slug` (`slug`);

-- split --

ALTER TABLE `{DBPREFIX}theme_options`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}updates`
 ADD PRIMARY KEY (`version`);

-- split --

ALTER TABLE `{DBPREFIX}update_files`
 ADD PRIMARY KEY (`id`);

-- split --

ALTER TABLE `{DBPREFIX}action_logs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}groups`
MODIFY `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}itdatas`
MODIFY `cdn_id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}it_servicedesk_data`
MODIFY `servicedesk_id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}keys`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}keywords`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}login_attempts`
MODIFY `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}logs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}meta`
MODIFY `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}modules`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}permissions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}theme_options`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- split --

ALTER TABLE `{DBPREFIX}update_files`
MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

-- split --