-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
-- PLEASE USE MYISAM AND NEVER INNODB. THIS IS UTTERLY IMPORTANT.
--
-- Please make sure that you do NOT use InnoDB. We have had complaints
-- of data corruption when using InnoDB tables. I don't care if it is 
-- a unique server-specific thing that'll never happen again, 
-- we cannot allow ANYONE to have ANY problems of ANY kind with Yggdrasil.
--
-- So please, stick to InnoDB. 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- split --

INSERT INTO `{DBPREFIX}groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User');

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}hidden_notifications` (
  `user_id` int(11) NOT NULL,
  `notification_id` varchar(255) NOT NULL,
  KEY `user_id` (`user_id`,`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(40) NOT NULL,
  `level` int(2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `date_created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}login_attempts` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varbinary(16) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `module` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `roles` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
('admin_force_https', 'Force HTTPS for admin?', 'Allow only the HTTPS protocol when using the admin functions?', 'radio', '0', '', '1=Yes|0=No', 1, 1, '', 0),
('admin_name', 'Administrator Name', 'The Administrators Name', 'text', '', 'Torbjorn Zetterlund', '', 0, 0, '', 0),
('admin_theme', 'Backend Theme', 'Select the theme for the backend.', '', 'default', 'totta', 'func:get_themes', 1, 1, '', 0),
('alchemy', 'Alchemy ', 'Do you want to use Alchemy', 'radio', '0', '1', '0=Disabled|1=Enabled', 0, 1, 'API', 1),
('alchemy_news_api', 'Alchemy', 'The API key for Alchemy', 'text', '', 'c4332ff6da5747de8b616347c0da6ffc9069bd88', '', 0, 1, 'API', 2),
('alchemy_url', 'Alchemy URL', 'The URL of the Alchemy service', 'text', '', 'http://access.alchemyapi.com/', '', 0, 1, 'API', 3),
('allowed_extensions', 'Allowed extensions', '', '', '', 'pdf,png,psd,jpg,jpeg,bmp,ai,txt,zip,rar,7z,gzip,bzip,gz,gif,doc,docx,ppt,pptx,xls,xlsx,csv', '', 0, 0, '', 0),
('application_debug', 'Application Debug', 'Debug Application - requires - $this->output->enable_profiler($this->settings->application_debug) in your controller', 'radio', '0', '0', '1=True|0=False', 0, 1, '', 0),
('auto_update', '', '', '', '', '0', '', 0, 0, '', 0),
('auto_username', 'Auto Username', 'Create the username automatically, meaning users can skip making one on registration.', 'radio', '1', '1', '1=Enabled|0=Disabled', 0, 1, 'users', 964),
('backend_css', '', '', '', '', '', '', 0, 0, '', 0),
('custom_css', 'Custom CSS', '', '', '', '', '', 0, 0, '', 0),
('dashboard_rss_count', 'Dashboard RSS Items', 'How many RSS items would you like to display on the dashboard?', 'text', '5', '5', '', 1, 1, '', 989),
('date_format', 'Date Format', 'How should dates be displayed across the website and control panel? Using the <a target="_blank" href="http://php.net/manual/en/function.date.php">date format</a> from PHP - OR - Using the format of <a target="_blank" href="http://php.net/manual/en/function.strftime.php">strings formatted as date</a> from PHP.', 'text', 'Y-m-d', 'Y/m/d', '', 1, 1, '', 995),
('default_theme', 'Default Theme', 'Select the theme you want users to see by default.', '', 'default', 'yggdrasil', 'func:get_themes', 1, 0, '', 0),
('default_user_group', 'Default User Group', 'Here you set the default user group', 'text', 'regular', 'regular', '', 1, 1, 'users', 0),
('enable_profiles', 'Enable profiles', 'Allow users to add and edit profiles.', 'radio', '1', '1', '1=Enabled|0=Disabled', 1, 1, 'users', 963),
('enable_registration', 'Enable user registration', 'Allow users to register in your site.', 'radio', '1', '0', '1=Enabled|0=Disabled', 0, 1, 'users', 961),
('frontend_css', 'Frontend CSS', 'Add additional CSS', 'textarea', '', '', '', 0, 0, '', 0),
('frontend_enabled', 'Site Status', 'Use this option to the user-facing part of the site on or off. Useful when you want to take the site down for maintenance.', 'radio', '1', '', '1=Open|0=Closed', 1, 1, '', 988),
('items_per_page', 'Items per page', '', '', '', '10', '', 0, 0, '', 0),
('language', '', '', '', '', 'english', '', 0, 0, '', 0),
('latest_version', '', '', '', '', '1.0.1', '', 0, 0, '', 0),
('latest_version_fetch', '', '', '', '', '1354438437', '', 0, 0, '', 0),
('ldap_auth', 'LDAP Auth', 'Enable to allow for LDAP Authentication', 'select', '', '1', '0=Disabled|1=Enabled', 1, 1, 'authentication', 0),
('ldap_connect', 'LDAP IP', 'LDAP URL or IP', 'text', '', '', '', 1, 1, 'authentication', 0),
('ldap_dc', 'LDAP DC', 'SET you LDAP DC parameters', 'text', '', '', '', 1, 1, 'authentication', 0),
('ldap_port', 'LDAP Port', 'LDAP Port Number', 'text', '', '', '', 1, 1, 'authentication', 0),
('ldap_protocol', 'LDAP Protocol', '', 'text', '', '', '', 1, 1, 'authentication', 0),
('local_auth', 'Local Auth', 'Enable to allow for local autherisation', 'select', '', '1', '0=Disabled|1=Enabled', 1, 1, 'authentication', 0),
('logo_url', 'Logo URL', '', '', '', 'uploads/branding/yggdrasil.jpg', '', 0, 0, '', 0),
('meta_topic', 'Meta Topic', 'Two or three words describing this type of company/website.', 'text', 'Content Management', 'Add your slogan here', '', 0, 1, '', 998),
('notify_email', '', '', '', '', 'admin@localhost', '', 0, 0, '', 0),
('rss_feed_items', 'Feed item count', 'How many items should we show in RSS/blog feeds?', 'select', '25', '', '10=10|25=25|50=50|100=100', 1, 1, '', 991),
('rss_password', 'RSS Password', 'RSS Password', 'text', '', '6Ohh44pWRsuz', '', 0, 0, '', 1001),
('send_multipart', '', '', '', '', '1', '', 0, 0, '', 0),
('send_x_days_before', '', '', '', '', '7', '', 0, 0, '', 0),
('server_email', 'Server E-mail', 'All e-mails to users will come from this e-mail address.', 'text', 'admin@localhost', '', '', 1, 1, 'email', 978),
('set_time_limit', 'Set Time Limit', 'Set time limit to retrieve html page from originated url or a pdf screenshoot from originated url- the value is in seconds', 'text', '120', '120', '120 ', 0, 1, 'Media', 0),
('show_text', 'Text to show', 'How many characters of main text to show', 'text', '100', '100', '', 0, 1, 'Feed', 0),
('site_lang', 'Site Language', 'The native language of the website, used to choose templates of e-mail notifications, contact form, and other features that should not depend on the language of a user.', 'select', 'en', 'en', 'func:get_supported_lang', 1, 1, '', 997),
('site_name', 'Site Name', 'The name of the website for page titles and for use around the site.', 'text', 'Un-named Website', 'Greengarden', '', 1, 1, '', 1000),
('site_public_lang', 'Public Languages', 'Which are the languages really supported and offered on the front-end of your website?', 'checkbox', 'en', 'en', 'func:get_supported_lang', 1, 1, '', 996),
('site_slogan', 'Site Slogan', 'The slogan of the website for page titles and for use around the site', 'text', '', 'One news at time', '', 0, 1, '', 999),
('smtp_host', '', '', '', '', '', '', 0, 0, '', 0),
('smtp_pass', '', '', '', '', '', '', 0, 0, '', 0),
('smtp_port', '', '', '', '', '25', '', 0, 0, '', 0),
('test_rss', 'Dashboard RSS Feed', 'Link to an RSS feed that will be displayed on the dashboard.', 'text', 'http://my.memonews.com/archive/feed/atom/2625/SwissMediaStream?count=100', '', '', 0, 1, '', 990),
('theme', 'Front End Theme', 'Select the theme you want users to see on the front end.', '', '', 'totta', 'func:get_themes', 1, 1, '', 0),
('timezone', 'Time Zone', 'Select your timezone', '', '', 'Europe/Berlin', '', 1, 1, '', 997),
('time_format', 'Time Format', 'How should time be displayed', '', '', 'H:i', '', 1, 1, '', 996),
('version', '', '', '', '', '1.0.1', '', 0, 0, '', 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}modules` (`id`, `name`, `slug`, `version`, `type`, `description`, `skip_xss`, `is_frontend`, `is_backend`, `menu`, `enabled`, `installed`, `is_core`, `updated_on`) VALUES
(1, 'a:2:{s:2:"en";s:8:"Analysis";s:2:"se";s:7:"Analyst";}', 'analysis', '1.0.0', NULL, 'a:2:{s:2:"en";s:14:"Analyzing data";s:2:"se";s:9:"Analyzing";}', 0, 0, 0, '0', 1, 1, 1, 1422891927),
(2, 'a:1:{s:2:"en";s:6:"Apikey";}', 'apikey', '1.0', NULL, 'a:1:{s:2:"en";s:25:"Module to get an API Key.";}', 0, 1, 1, 'admin', 1, 1, 1, 1422546883),
(3, 'a:1:{s:2:"en";s:8:"Calendar";}', 'calendar', '1.0', NULL, 'a:1:{s:2:"en";s:8:"Calendar";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(4, 'a:1:{s:2:"en";s:5:"Chart";}', 'chart', '1.0', NULL, 'a:1:{s:2:"en";s:5:"Chart";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(5, 'a:1:{s:2:"en";s:9:"Dashboard";}', 'dashboard', '1.0', NULL, 'a:1:{s:2:"en";s:19:"Main page dashboard";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(6, 'a:23:{s:2:"en";s:6:"Groups";s:2:"ar";s:18:"المجموعات";s:2:"br";s:6:"Grupos";s:2:"pt";s:6:"Grupos";s:2:"cs";s:7:"Skupiny";s:2:"da";s:7:"Grupper";s:2:"de";s:7:"Gruppen";s:2:"el";s:12:"Ομάδες";s:2:"es";s:6:"Grupos";s:2:"fi";s:7:"Ryhmät";s:2:"fr";s:7:"Groupes";s:2:"he";s:12:"קבוצות";s:2:"id";s:4:"Grup";s:2:"it";s:6:"Gruppi";s:2:"lt";s:7:"Grupės";s:2:"nl";s:7:"Groepen";s:2:"ru";s:12:"Группы";s:2:"sl";s:7:"Skupine";s:2:"tw";s:6:"群組";s:2:"cn";s:6:"群组";s:2:"hu";s:9:"Csoportok";s:2:"th";s:15:"กลุ่ม";s:2:"se";s:7:"Grupper";}', 'groups', '1.0.0', NULL, 'a:23:{s:2:"en";s:54:"Users can be placed into groups to manage permissions.";s:2:"ar";s:100:"يمكن وضع المستخدمين في مجموعات لتسهيل إدارة صلاحياتهم.";s:2:"br";s:72:"Usuários podem ser inseridos em grupos para gerenciar suas permissões.";s:2:"pt";s:74:"Utilizadores podem ser inseridos em grupos para gerir as suas permissões.";s:2:"cs";s:77:"Uživatelé mohou být rozřazeni do skupin pro lepší správu oprávnění.";s:2:"da";s:49:"Brugere kan inddeles i grupper for adgangskontrol";s:2:"de";s:85:"Benutzer können zu Gruppen zusammengefasst werden um diesen Zugriffsrechte zu geben.";s:2:"el";s:168:"Οι χρήστες μπορούν να τοποθετηθούν σε ομάδες και έτσι να διαχειριστείτε τα δικαιώματά τους.";s:2:"es";s:75:"Los usuarios podrán ser colocados en grupos para administrar sus permisos.";s:2:"fi";s:84:"Käyttäjät voidaan liittää ryhmiin, jotta käyttöoikeuksia voidaan hallinnoida.";s:2:"fr";s:82:"Les utilisateurs peuvent appartenir à des groupes afin de gérer les permissions.";s:2:"he";s:62:"נותן אפשרות לאסוף משתמשים לקבוצות";s:2:"id";s:68:"Pengguna dapat dikelompokkan ke dalam grup untuk mengatur perizinan.";s:2:"it";s:69:"Gli utenti possono essere inseriti in gruppi per gestirne i permessi.";s:2:"lt";s:67:"Vartotojai gali būti priskirti grupei tam, kad valdyti jų teises.";s:2:"nl";s:73:"Gebruikers kunnen in groepen geplaatst worden om rechten te kunnen geven.";s:2:"ru";s:134:"Пользователей можно объединять в группы, для управления правами доступа.";s:2:"sl";s:64:"Uporabniki so lahko razvrščeni v skupine za urejanje dovoljenj";s:2:"tw";s:45:"用戶可以依群組分類並管理其權限";s:2:"cn";s:45:"用户可以依群组分类并管理其权限";s:2:"hu";s:73:"A felhasználók csoportokba rendezhetőek a jogosultságok kezelésére.";s:2:"th";s:84:"สามารถวางผู้ใช้ลงในกลุ่มเพื่";s:2:"se";s:76:"Användare kan delas in i grupper för att hantera roller och behörigheter.";}', 0, 0, 1, 'users', 1, 1, 1, 1422891927),
(7, 'a:1:{s:2:"en";s:10:"It Reports";}', 'itreports', '1.0.0', NULL, 'a:1:{s:2:"en";s:46:"Exprimental Module for IT Dashboards & Reports";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(8, 'a:17:{s:2:"en";s:8:"Keywords";s:2:"ar";s:21:"كلمات البحث";s:2:"br";s:14:"Palavras-chave";s:2:"pt";s:14:"Palavras-chave";s:2:"da";s:9:"Nøgleord";s:2:"el";s:27:"Λέξεις Κλειδιά";s:2:"fa";s:21:"کلمات کلیدی";s:2:"fr";s:10:"Mots-Clés";s:2:"id";s:10:"Kata Kunci";s:2:"nl";s:14:"Sleutelwoorden";s:2:"tw";s:6:"鍵詞";s:2:"cn";s:6:"键词";s:2:"hu";s:11:"Kulcsszavak";s:2:"fi";s:10:"Avainsanat";s:2:"sl";s:15:"Ključne besede";s:2:"th";s:15:"คำค้น";s:2:"se";s:9:"Nyckelord";}', 'keywords', '1.1.0', NULL, 'a:17:{s:2:"en";s:71:"Maintain a central list of keywords to label and organize your content.";s:2:"ar";s:124:"أنشئ مجموعة من كلمات البحث التي تستطيع من خلالها وسم وتنظيم المحتوى.";s:2:"br";s:85:"Mantém uma lista central de palavras-chave para rotular e organizar o seu conteúdo.";s:2:"pt";s:85:"Mantém uma lista central de palavras-chave para rotular e organizar o seu conteúdo.";s:2:"da";s:72:"Vedligehold en central liste af nøgleord for at organisere dit indhold.";s:2:"el";s:181:"Συντηρεί μια κεντρική λίστα από λέξεις κλειδιά για να οργανώνετε μέσω ετικετών το περιεχόμενό σας.";s:2:"fa";s:110:"حفظ و نگهداری لیست مرکزی از کلمات کلیدی برای سازماندهی محتوا";s:2:"fr";s:87:"Maintenir une liste centralisée de Mots-Clés pour libeller et organiser vos contenus.";s:2:"id";s:71:"Memantau daftar kata kunci untuk melabeli dan mengorganisasikan konten.";s:2:"nl";s:91:"Beheer een centrale lijst van sleutelwoorden om uw content te categoriseren en organiseren.";s:2:"tw";s:64:"集中管理可用於標題與內容的鍵詞(keywords)列表。";s:2:"cn";s:64:"集中管理可用于标题与内容的键词(keywords)列表。";s:2:"hu";s:65:"Ez egy központi kulcsszó lista a cimkékhez és a tartalmakhoz.";s:2:"fi";s:92:"Hallinnoi keskitettyä listaa avainsanoista merkitäksesi ja järjestelläksesi sisältöä.";s:2:"sl";s:82:"Vzdržuj centralni seznam ključnih besed za označevanje in ogranizacijo vsebine.";s:2:"th";s:189:"ศูนย์กลางการปรับปรุงคำค้นในการติดฉลากและจัดระเบียบเนื้อหาของคุณ";s:2:"se";s:61:"Hantera nyckelord för att organisera webbplatsens innehåll.";}', 0, 0, 1, 'data', 1, 1, 1, 1422891927),
(9, 'a:25:{s:2:"en";s:11:"Permissions";s:2:"ar";s:18:"الصلاحيات";s:2:"br";s:11:"Permissões";s:2:"pt";s:11:"Permissões";s:2:"cs";s:12:"Oprávnění";s:2:"da";s:14:"Adgangskontrol";s:2:"de";s:14:"Zugriffsrechte";s:2:"el";s:20:"Δικαιώματα";s:2:"es";s:8:"Permisos";s:2:"fa";s:15:"اجازه ها";s:2:"fi";s:16:"Käyttöoikeudet";s:2:"fr";s:11:"Permissions";s:2:"he";s:12:"הרשאות";s:2:"id";s:9:"Perizinan";s:2:"it";s:8:"Permessi";s:2:"lt";s:7:"Teisės";s:2:"nl";s:15:"Toegangsrechten";s:2:"pl";s:11:"Uprawnienia";s:2:"ru";s:25:"Права доступа";s:2:"sl";s:10:"Dovoljenja";s:2:"tw";s:6:"權限";s:2:"cn";s:6:"权限";s:2:"hu";s:14:"Jogosultságok";s:2:"th";s:18:"สิทธิ์";s:2:"se";s:13:"Behörigheter";}', 'permissions', '1.0.0', NULL, 'a:25:{s:2:"en";s:68:"Control what type of users can see certain sections within the site.";s:2:"ar";s:127:"التحكم بإعطاء الصلاحيات للمستخدمين للوصول إلى أقسام الموقع المختلفة.";s:2:"br";s:68:"Controle quais tipos de usuários podem ver certas seções no site.";s:2:"pt";s:75:"Controle quais os tipos de utilizadores podem ver certas secções no site.";s:2:"cs";s:93:"Spravujte oprávnění pro jednotlivé typy uživatelů a ke kterým sekcím mají přístup.";s:2:"da";s:72:"Kontroller hvilken type brugere der kan se bestemte sektioner på sitet.";s:2:"de";s:70:"Regelt welche Art von Benutzer welche Sektion in der Seite sehen kann.";s:2:"el";s:180:"Ελέγξτε τα δικαιώματα χρηστών και ομάδων χρηστών όσο αφορά σε διάφορες λειτουργίες του ιστοτόπου.";s:2:"es";s:81:"Controla que tipo de usuarios pueden ver secciones específicas dentro del sitio.";s:2:"fa";s:59:"مدیریت اجازه های گروه های کاربری";s:2:"fi";s:72:"Hallitse minkä tyyppisiin osioihin käyttäjät pääsevät sivustolla.";s:2:"fr";s:104:"Permet de définir les autorisations des groupes d''utilisateurs pour afficher les différentes sections.";s:2:"he";s:75:"ניהול הרשאות כניסה לאיזורים מסוימים באתר";s:2:"id";s:76:"Mengontrol tipe pengguna mana yang dapat mengakses suatu bagian dalam situs.";s:2:"it";s:78:"Controlla che tipo di utenti posssono accedere a determinate sezioni del sito.";s:2:"lt";s:72:"Kontroliuokite kokio tipo varotojai kokią dalį puslapio gali pasiekti.";s:2:"nl";s:71:"Bepaal welke typen gebruikers toegang hebben tot gedeeltes van de site.";s:2:"pl";s:79:"Ustaw, którzy użytkownicy mogą mieć dostęp do odpowiednich sekcji witryny.";s:2:"ru";s:209:"Управление правами доступа, ограничение доступа определённых групп пользователей к произвольным разделам сайта.";s:2:"sl";s:85:"Uredite dovoljenja kateri tip uporabnika lahko vidi določena področja vaše strani.";s:2:"tw";s:81:"用來控制不同類別的用戶，設定其瀏覽特定網站內容的權限。";s:2:"cn";s:81:"用来控制不同类别的用户，设定其浏览特定网站内容的权限。";s:2:"hu";s:129:"A felhasználók felügyelet alatt tartására, hogy milyen típusú felhasználók, mit láthatnak, mely szakaszain az oldalnak.";s:2:"th";s:117:"ควบคุมว่าผู้ใช้งานจะเห็นหมวดหมู่ไหนบ้าง";s:2:"se";s:27:"Hantera gruppbehörigheter.";}', 0, 0, 1, 'users', 1, 1, 1, 1422891927),
(10, 'a:1:{s:2:"en";s:12:"Service Desk";}', 'servicedesk', '1.0.0', NULL, 'a:1:{s:2:"en";s:38:"Exprimental Module for IT Service Desk";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),
(11, 'a:23:{s:2:"en";s:8:"Settings";s:2:"ar";s:18:"الإعدادات";s:2:"br";s:15:"Configurações";s:2:"pt";s:15:"Configurações";s:2:"cs";s:10:"Nastavení";s:2:"da";s:13:"Indstillinger";s:2:"de";s:13:"Einstellungen";s:2:"el";s:18:"Ρυθμίσεις";s:2:"es";s:15:"Configuraciones";s:2:"fi";s:9:"Asetukset";s:2:"fr";s:11:"Paramètres";s:2:"he";s:12:"הגדרות";s:2:"id";s:10:"Pengaturan";s:2:"it";s:12:"Impostazioni";s:2:"lt";s:10:"Nustatymai";s:2:"nl";s:12:"Instellingen";s:2:"pl";s:10:"Ustawienia";s:2:"ru";s:18:"Настройки";s:2:"sl";s:10:"Nastavitve";s:2:"zh";s:12:"網站設定";s:2:"hu";s:14:"Beállítások";s:2:"th";s:21:"ตั้งค่า";s:2:"se";s:14:"Inställningar";}', 'settings', '1.0', NULL, 'a:23:{s:2:"en";s:89:"Allows administrators to update settings like Site Name, messages and email address, etc.";s:2:"ar";s:161:"تمكن المدراء من تحديث الإعدادات كإسم الموقع، والرسائل وعناوين البريد الإلكتروني، .. إلخ.";s:2:"br";s:120:"Permite com que administradores e a equipe consigam trocar as configurações do website incluindo o nome e descrição.";s:2:"pt";s:113:"Permite com que os administradores consigam alterar as configurações do website incluindo o nome e descrição.";s:2:"cs";s:102:"Umožňuje administrátorům měnit nastavení webu jako jeho jméno, zprávy a emailovou adresu apod.";s:2:"da";s:90:"Lader administratorer opdatere indstillinger som sidenavn, beskeder og email adresse, etc.";s:2:"de";s:92:"Erlaubt es Administratoren die Einstellungen der Seite wie Name und Beschreibung zu ändern.";s:2:"el";s:230:"Επιτρέπει στους διαχειριστές να τροποποιήσουν ρυθμίσεις όπως το Όνομα του Ιστοτόπου, τα μηνύματα και τις διευθύνσεις email, κ.α.";s:2:"es";s:131:"Permite a los administradores y al personal configurar los detalles del sitio como el nombre del sitio y la descripción del mismo.";s:2:"fi";s:105:"Mahdollistaa sivuston asetusten muokkaamisen, kuten sivuston nimen, viestit ja sähköpostiosoitteet yms.";s:2:"fr";s:105:"Permet aux admistrateurs et au personnel de modifier les paramètres du site : nom du site et description";s:2:"he";s:116:"ניהול הגדרות שונות של האתר כגון: שם האתר, הודעות, כתובות דואר וכו";s:2:"id";s:112:"Memungkinkan administrator untuk dapat memperbaharui pengaturan seperti nama situs, pesan dan alamat email, dsb.";s:2:"it";s:109:"Permette agli amministratori di aggiornare impostazioni quali Nome del Sito, messaggi e indirizzo email, etc.";s:2:"lt";s:104:"Leidžia administratoriams keisti puslapio vavadinimą, žinutes, administratoriaus el. pašta ir kitą.";s:2:"nl";s:114:"Maakt het administratoren en medewerkers mogelijk om websiteinstellingen zoals naam en beschrijving te veranderen.";s:2:"pl";s:103:"Umożliwia administratorom zmianę ustawień strony jak nazwa strony, opis, e-mail administratora, itd.";s:2:"ru";s:135:"Управление настройками сайта - Имя сайта, сообщения, почтовые адреса и т.п.";s:2:"sl";s:98:"Dovoljuje administratorjem posodobitev nastavitev kot je Ime strani, sporočil, email naslova itd.";s:2:"zh";s:99:"網站管理者可更新的重要網站設定。例如：網站名稱、訊息、電子郵件等。";s:2:"hu";s:125:"Lehetővé teszi az adminok számára a beállítások frissítését, mint a weboldal neve, üzenetek, e-mail címek, stb...";s:2:"th";s:232:"ให้ผู้ดูแลระบบสามารถปรับปรุงการตั้งค่าเช่นชื่อเว็บไซต์ ข้อความและอีเมล์เป็นต้น";s:2:"se";s:84:"Administratören kan uppdatera webbplatsens titel, meddelanden och E-postadress etc.";}', 1, 0, 1, 'settings', 1, 1, 1, 1422891927),
(12, 'a:12:{s:2:"en";s:6:"System";s:2:"pt";s:12:"Manutenção";s:2:"ar";s:14:"الصيانة";s:2:"el";s:18:"Συντήρηση";s:2:"hu";s:13:"Karbantartás";s:2:"fi";s:9:"Ylläpito";s:2:"fr";s:6:"system";s:2:"id";s:12:"Pemeliharaan";s:2:"se";s:10:"Underhåll";s:2:"sl";s:12:"Vzdrževanje";s:2:"th";s:39:"การบำรุงรักษา";s:2:"zh";s:6:"維護";}', 'system', '1.0', NULL, 'a:12:{s:2:"en";s:63:"Manage the site cache and export information from the database.";s:2:"pt";s:68:"Gerir o cache do seu site e exportar informações da base de dados.";s:2:"ar";s:81:"حذف عناصر الذاكرة المخبأة عبر واجهة الإدارة.";s:2:"el";s:142:"Διαγραφή αντικειμένων προσωρινής αποθήκευσης μέσω της περιοχής διαχείρισης.";s:2:"id";s:60:"Mengatur cache situs dan mengexport informasi dari database.";s:2:"fr";s:71:"Gérer le cache du site et exporter les contenus de la base de données";s:2:"fi";s:59:"Hallinoi sivuston välimuistia ja vie tietoa tietokannasta.";s:2:"hu";s:66:"Az oldal gyorsítótár kezelése és az adatbázis exportálása.";s:2:"se";s:76:"Underhåll webbplatsens cache och exportera data från webbplatsens databas.";s:2:"sl";s:69:"Upravljaj s predpomnilnikom strani (cache) in izvozi podatke iz baze.";s:2:"th";s:150:"การจัดการแคชเว็บไซต์และข้อมูลการส่งออกจากฐานข้อมูล";s:2:"zh";s:45:"經由管理介面手動刪除暫存資料。";}', 0, 0, 1, 'utilities', 1, 1, 1, 1422891927),
(13, 'a:23:{s:2:"en";s:5:"Users";s:2:"ar";s:20:"المستخدمون";s:2:"br";s:9:"Usuários";s:2:"pt";s:12:"Utilizadores";s:2:"cs";s:11:"Uživatelé";s:2:"da";s:7:"Brugere";s:2:"de";s:8:"Benutzer";s:2:"el";s:14:"Χρήστες";s:2:"es";s:8:"Usuarios";s:2:"fi";s:12:"Käyttäjät";s:2:"fr";s:12:"Utilisateurs";s:2:"he";s:14:"משתמשים";s:2:"id";s:8:"Pengguna";s:2:"it";s:6:"Utenti";s:2:"lt";s:10:"Vartotojai";s:2:"nl";s:10:"Gebruikers";s:2:"pl";s:12:"Użytkownicy";s:2:"ru";s:24:"Пользователи";s:2:"sl";s:10:"Uporabniki";s:2:"zh";s:6:"用戶";s:2:"hu";s:14:"Felhasználók";s:2:"th";s:27:"ผู้ใช้งาน";s:2:"se";s:10:"Användare";}', 'users', '1.0', NULL, 'a:23:{s:2:"en";s:81:"Let users register and log in to the site, and manage them via the control panel.";s:2:"ar";s:133:"تمكين المستخدمين من التسجيل والدخول إلى الموقع، وإدارتهم من لوحة التحكم.";s:2:"br";s:125:"Permite com que usuários se registrem e entrem no site e também que eles sejam gerenciáveis apartir do painel de controle.";s:2:"pt";s:125:"Permite com que os utilizadores se registem e entrem no site e também que eles sejam geriveis apartir do painel de controlo.";s:2:"cs";s:103:"Umožňuje uživatelům se registrovat a přihlašovat a zároveň jejich správu v Kontrolním panelu.";s:2:"da";s:89:"Lader brugere registrere sig og logge ind på sitet, og håndtér dem via kontrolpanelet.";s:2:"de";s:108:"Erlaube Benutzern das Registrieren und Einloggen auf der Seite und verwalte sie über die Admin-Oberfläche.";s:2:"el";s:208:"Παρέχει λειτουργίες εγγραφής και σύνδεσης στους επισκέπτες. Επίσης από εδώ γίνεται η διαχείριση των λογαριασμών.";s:2:"es";s:138:"Permite el registro de nuevos usuarios quienes podrán loguearse en el sitio. Estos podrán controlarse desde el panel de administración.";s:2:"fi";s:126:"Antaa käyttäjien rekisteröityä ja kirjautua sisään sivustolle sekä mahdollistaa niiden muokkaamisen hallintapaneelista.";s:2:"fr";s:112:"Permet aux utilisateurs de s''enregistrer et de se connecter au site et de les gérer via le panneau de contrôle";s:2:"he";s:62:"ניהול משתמשים: רישום, הפעלה ומחיקה";s:2:"id";s:102:"Memungkinkan pengguna untuk mendaftar dan masuk ke dalam situs, dan mengaturnya melalui control panel.";s:2:"it";s:95:"Fai iscrivere de entrare nel sito gli utenti, e gestiscili attraverso il pannello di controllo.";s:2:"lt";s:106:"Leidžia vartotojams registruotis ir prisijungti prie puslapio, ir valdyti juos per administravimo panele.";s:2:"nl";s:88:"Laat gebruikers registreren en inloggen op de site, en beheer ze via het controlepaneel.";s:2:"pl";s:87:"Pozwól użytkownikom na logowanie się na stronie i zarządzaj nimi za pomocą panelu.";s:2:"ru";s:155:"Управление зарегистрированными пользователями, активирование новых пользователей.";s:2:"sl";s:96:"Dovoli uporabnikom za registracijo in prijavo na strani, urejanje le teh preko nadzorne plošče";s:2:"zh";s:87:"讓用戶可以註冊並登入網站，並且管理者可在控制台內進行管理。";s:2:"th";s:210:"ให้ผู้ใช้ลงทะเบียนและเข้าสู่เว็บไซต์และจัดการกับพวกเขาผ่านทางแผงควบคุม";s:2:"hu";s:120:"Hogy a felhasználók tudjanak az oldalra regisztrálni és belépni, valamint lehessen őket kezelni a vezérlőpulton.";s:2:"se";s:111:"Låt dina besökare registrera sig och logga in på webbplatsen. Hantera sedan användarna via kontrollpanelen.";}', 0, 0, 1, '0', 1, 1, 1, 1422891927),

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}updates` (
  `version` varchar(255) NOT NULL,
  `hashes` longtext NOT NULL,
  `suzip` longtext NOT NULL,
  `changed_files` longtext NOT NULL,
  `processed_changelog` longtext NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- split --

CREATE TABLE IF NOT EXISTS `{DBPREFIX}update_files` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `filename` text NOT NULL,
  `data` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- split --

CREATE TABLE `{DBPREFIX}users` (
`id` mediumint(8) unsigned NOT NULL,
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
  `ldap_data` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- split --

INSERT INTO `{DBPREFIX}users` (`id`, `group_id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `remember_code`, `created_on`, `last_login`, `active`, `office`, `via_ldap`, `ldap_data`) VALUES
(1, 1, '0.0.0.0', '{USERNAME}', '7{PASSWORD}', '5{SALT}', '{EMAIL}', '', '', '2ce1d120d1e0919f8f8ba560d54133d2910a4ac2', 1360925298, 1427735771, 1, 0, 'local', '');

-- split --