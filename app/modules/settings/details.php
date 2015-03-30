<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Settings module
 *
 * Ananas  
 *
 * A simple, fast, development framework for web applications and software licenses software
 *
 * @package		Ananas
 * @author		Ananas Dev Team
// ------------------------------------------------------------------------
*/
class Module_Settings extends Module {

	public $version = '1.0';

	public function info()
	{
		return array(
			'name' => array(
				'en' => 'Settings',
				'ar' => 'الإعدادات',
				'br' => 'Configurações',
				'pt' => 'Configurações',
				'cs' => 'Nastavení',
				'da' => 'Indstillinger',
				'de' => 'Einstellungen',
				'el' => 'Ρυθμίσεις',
				'es' => 'Configuraciones',
				'fi' => 'Asetukset',
				'fr' => 'Paramètres',
				'he' => 'הגדרות',
				'id' => 'Pengaturan',
				'it' => 'Impostazioni',
				'lt' => 'Nustatymai',
				'nl' => 'Instellingen',
				'pl' => 'Ustawienia',
				'ru' => 'Настройки',
				'sl' => 'Nastavitve',
				'zh' => '網站設定',
				'hu' => 'Beállítások',
				'th' => 'ตั้งค่า',
                                'se' => 'Inställningar'
			),
			'description' => array(
				'en' => 'Allows administrators to update settings like Site Name, messages and email address, etc.',
				'ar' => 'تمكن المدراء من تحديث الإعدادات كإسم الموقع، والرسائل وعناوين البريد الإلكتروني، .. إلخ.',
				'br' => 'Permite com que administradores e a equipe consigam trocar as configurações do website incluindo o nome e descrição.',
				'pt' => 'Permite com que os administradores consigam alterar as configurações do website incluindo o nome e descrição.',
				'cs' => 'Umožňuje administrátorům měnit nastavení webu jako jeho jméno, zprávy a emailovou adresu apod.',
				'da' => 'Lader administratorer opdatere indstillinger som sidenavn, beskeder og email adresse, etc.',
				'de' => 'Erlaubt es Administratoren die Einstellungen der Seite wie Name und Beschreibung zu ändern.',
				'el' => 'Επιτρέπει στους διαχειριστές να τροποποιήσουν ρυθμίσεις όπως το Όνομα του Ιστοτόπου, τα μηνύματα και τις διευθύνσεις email, κ.α.',
				'es' => 'Permite a los administradores y al personal configurar los detalles del sitio como el nombre del sitio y la descripción del mismo.',
				'fi' => 'Mahdollistaa sivuston asetusten muokkaamisen, kuten sivuston nimen, viestit ja sähköpostiosoitteet yms.',
				'fr' => 'Permet aux admistrateurs et au personnel de modifier les paramètres du site : nom du site et description',
				'he' => 'ניהול הגדרות שונות של האתר כגון: שם האתר, הודעות, כתובות דואר וכו',
				'id' => 'Memungkinkan administrator untuk dapat memperbaharui pengaturan seperti nama situs, pesan dan alamat email, dsb.',
				'it' => 'Permette agli amministratori di aggiornare impostazioni quali Nome del Sito, messaggi e indirizzo email, etc.',
				'lt' => 'Leidžia administratoriams keisti puslapio vavadinimą, žinutes, administratoriaus el. pašta ir kitą.',
				'nl' => 'Maakt het administratoren en medewerkers mogelijk om websiteinstellingen zoals naam en beschrijving te veranderen.',
				'pl' => 'Umożliwia administratorom zmianę ustawień strony jak nazwa strony, opis, e-mail administratora, itd.',
				'ru' => 'Управление настройками сайта - Имя сайта, сообщения, почтовые адреса и т.п.',
				'sl' => 'Dovoljuje administratorjem posodobitev nastavitev kot je Ime strani, sporočil, email naslova itd.',
				'zh' => '網站管理者可更新的重要網站設定。例如：網站名稱、訊息、電子郵件等。',
				'hu' => 'Lehetővé teszi az adminok számára a beállítások frissítését, mint a weboldal neve, üzenetek, e-mail címek, stb...',
				'th' => 'ให้ผู้ดูแลระบบสามารถปรับปรุงการตั้งค่าเช่นชื่อเว็บไซต์ ข้อความและอีเมล์เป็นต้น',
                                'se' => 'Administratören kan uppdatera webbplatsens titel, meddelanden och E-postadress etc.'
			),
			'frontend' => false,
			'backend' => true,
			'skip_xss' => true,
			'menu' => 'settings',
			'roles'     => array('create', 'view', 'edit', 'change_status'),
                    );
	}
        
        public function admin_menu(&$menu)
	{
		unset($menu['lang:cp:nav_settings']);

		$menu['lang:cp:nav_settings'] = 'admin/settings';

		add_admin_menu_place('lang:cp:nav_settings', 7);
	}
}