<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/


defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.application.component.view');
jimport( 'joomla.application.component.model' );
jimport('joomla.html.pane');

class TbeartimesheetViewtbeartimesheet extends JView {
	function display( $tpl = null ) {	
		global $mainframe;
		$db =& JFactory::getDBO();
		$task = JRequest::getVar('task','','request');
		
		JHTML::_('behavior.tooltip', '.hasTip');
		jimport('joomla.html.pane');
		$pane	=& JPane::getInstance('sliders');
		
		$product = $this->get( 'Productinfo' );
		$stats	= $this->get( 'Guide' );

		JToolBarHelper::title(JText::_('TBEARTIMESHEET_PRODUCT'),'tbeartimesheet');
		JToolBarHelper::custom('tbeartimesheet','preview.png','preview_f2.png',JText::_('TBEARTIMESHEET_PRODUCT'),false);
		
		$this->assignRef( 'product', $product );
		$this->assignRef( 'pane', $pane );
		$this->assignRef( 'guide', $guide );
		
		parent::display($tpl);
	}
	
	function addIcon( $image , $url , $text , $newWindow = false ) {
		$lang =& JFactory::getLanguage();
		$newWindow = ( $newWindow ) ? ' target="_blank"' : '';
?>
		<div style="float:<?php echo ($lang->isRTL()) ? 'right' : 'left'; ?>;">
			<div class="icon">
				<a href="<?php echo $url; ?>"<?php echo $newWindow; ?>>
					<?php echo JHTML::_('image', 'administrator/components/com_tbeartimesheet/assets/icons/' . $image , NULL, NULL, $text ); ?>
					<span><?php echo $text; ?></span></a>
			</div>
		</div>
<?php
	}	

}