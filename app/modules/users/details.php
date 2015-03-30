<?php defined('BASEPATH') or exit('No direct script access allowed');

class Module_Users extends Module {

	public $version = '1.0';
	
	public $author 		=	'Torbjorn Zetterlund';
	public $author_url	=	'http://torbjornzetterlund.com';

	public function info()
	{
		return array(
			'name' => array(
				'en' => 'Users',
				'ar' => 'المستخدمون',
				'br' => 'Usuários',
				'pt' => 'Utilizadores',
				'cs' => 'Uživatelé',
				'da' => 'Brugere',
				'de' => 'Benutzer',
				'el' => 'Χρήστες',
				'es' => 'Usuarios',
				'fi' => 'Käyttäjät',
				'fr' => 'Utilisateurs',
				'he' => 'משתמשים',
				'id' => 'Pengguna',
				'it' => 'Utenti',
				'lt' => 'Vartotojai',
				'nl' => 'Gebruikers',
				'pl' => 'Użytkownicy',
				'ru' => 'Пользователи',
				'sl' => 'Uporabniki',
				'zh' => '用戶',
				'hu' => 'Felhasználók',
				'th' => 'ผู้ใช้งาน',
                                'se' => 'Användare'
			),
			'description' => array(
				'en' => 'Let users register and log in to the site, and manage them via the control panel.',
				'ar' => 'تمكين المستخدمين من التسجيل والدخول إلى الموقع، وإدارتهم من لوحة التحكم.',
				'br' => 'Permite com que usuários se registrem e entrem no site e também que eles sejam gerenciáveis apartir do painel de controle.',
				'pt' => 'Permite com que os utilizadores se registem e entrem no site e também que eles sejam geriveis apartir do painel de controlo.',
				'cs' => 'Umožňuje uživatelům se registrovat a přihlašovat a zároveň jejich správu v Kontrolním panelu.',
				'da' => 'Lader brugere registrere sig og logge ind på sitet, og håndtér dem via kontrolpanelet.',
				'de' => 'Erlaube Benutzern das Registrieren und Einloggen auf der Seite und verwalte sie über die Admin-Oberfläche.',
				'el' => 'Παρέχει λειτουργίες εγγραφής και σύνδεσης στους επισκέπτες. Επίσης από εδώ γίνεται η διαχείριση των λογαριασμών.',
				'es' => 'Permite el registro de nuevos usuarios quienes podrán loguearse en el sitio. Estos podrán controlarse desde el panel de administración.',
				'fi' => 'Antaa käyttäjien rekisteröityä ja kirjautua sisään sivustolle sekä mahdollistaa niiden muokkaamisen hallintapaneelista.',
				'fr' => 'Permet aux utilisateurs de s\'enregistrer et de se connecter au site et de les gérer via le panneau de contrôle',
				'he' => 'ניהול משתמשים: רישום, הפעלה ומחיקה',
				'id' => 'Memungkinkan pengguna untuk mendaftar dan masuk ke dalam situs, dan mengaturnya melalui control panel.',
				'it' => 'Fai iscrivere de entrare nel sito gli utenti, e gestiscili attraverso il pannello di controllo.',
				'lt' => 'Leidžia vartotojams registruotis ir prisijungti prie puslapio, ir valdyti juos per administravimo panele.',
				'nl' => 'Laat gebruikers registreren en inloggen op de site, en beheer ze via het controlepaneel.',
				'pl' => 'Pozwól użytkownikom na logowanie się na stronie i zarządzaj nimi za pomocą panelu.',
				'ru' => 'Управление зарегистрированными пользователями, активирование новых пользователей.',
				'sl' => 'Dovoli uporabnikom za registracijo in prijavo na strani, urejanje le teh preko nadzorne plošče',
				'zh' => '讓用戶可以註冊並登入網站，並且管理者可在控制台內進行管理。',
				'th' => 'ให้ผู้ใช้ลงทะเบียนและเข้าสู่เว็บไซต์และจัดการกับพวกเขาผ่านทางแผงควบคุม',
                'hu' => 'Hogy a felhasználók tudjanak az oldalra regisztrálni és belépni, valamint lehessen őket kezelni a vezérlőpulton.',
                'se' => 'Låt dina besökare registrera sig och logga in på webbplatsen. Hantera sedan användarna via kontrollpanelen.'
			),
			'frontend' 	=> false,
			'backend'  	=> true,
			'menu'	  	=> false,
			'roles'     => array('create', 'view', 'edit', 'change_status'),
			
			'sections' => array(
                    'groups' => array(
					    'name' => 'groups:groups',
					    'uri' => 'admin/users/groups',
					    'shortcuts' => array(
							array(
								'name' => 'groups:create',
							 	'uri' => 'admin/users/groups/add',
							 	'class' => 'btn btn-success btn-sm'
							),
						),
					),
                    'users' => array(
					    'name' => 'global:overview',
					    'uri' => 'admin/users',
					    'shortcuts' => array(
							array(
							    'name' => 'users:create_user',
							    'uri' => 'admin/users/create',
							    'class' => 'btn btn-success btn-sm'
							),
					    ),
			    	),
		    ),
		);
	}
        
      
}
/* End of file details.php */