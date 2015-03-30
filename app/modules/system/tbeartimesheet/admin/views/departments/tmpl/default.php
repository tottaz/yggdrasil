<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/


defined('_JEXEC') or die('Restricted access');
?>
<script language="javascript" type="text/javascript">
	function createFilter(filter) {
		document.getElementById('filter').value = filter;
		submitform();
	}
	
	function eraseFilter() {
		document.getElementById('filter').value = '';
		submitform();
	}
</script>
<b><?php echo JText::_('TBEARJOBS_MANAGE_DEPARTMENTS');?></b><p> </p>

<form action="index.php" method="post" name="adminForm">
	<table class="adminform">
		<tr>
			<td width="100%">
				<?php echo JText::_('TBEARJOBS_FILTER'); ?> <input type="text" name="tb_filter" id="tb_filter" onchange="createFilter(document.getElementById('tb_filter').value);" class="text_area" value="<?php echo $this->filter; ?>"/> <input type="button" value="<?php echo JText::_('TBEARJOBS_FILTER'); ?>" onclick="createFilter(document.getElementById('tb_filter').value);return false;" /> <input type="button" onclick="eraseFilter();" value="<?php echo JText::_('TBEARJOBS_CLEAR_FILTER'); ?> " />
			</td>
		</tr>
	</table>

	<table class="adminlist">
		<thead>
			<tr>
				<th width="20">
					<input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->rows); ?>);" />
				</th>
				<th>
					<?php
						$msg=JText::_('TBEARJOBS_DEPARTMENT');
						echo JHTML::_('grid.sort',$msg,'name',$this->sortOrder,$this->sortColumn);
					?>
				</th>					
				<th>
					<?php
						$msg=JText::_('TBEARJOBS_DEPARTMENT_CONTACT');
						echo JHTML::_('grid.sort',$msg,'contact_name',$this->sortOrder,$this->sortColumn);
					?>
				</th>					
				<th>
					<?php
						$msg=JText::_('TBEARJOBS_DEPARTMENT_EMAIL');
						echo JHTML::_('grid.sort',$msg,'contact_email',$this->sortOrder,$this->sortColumn);
					?>
				</th>									
			</tr>
		<?php 
		$k = 0;
		for($i=0,$n=count($this->rows); $i<$n; $i++) {
			$row =& $this->rows[$i];
			$checked = JHTML::_('grid.id', $i, $row->id);
			$link = JFilterOutput::ampReplace('index.php?option=com_tbearjobs&view=departments&task=editdep&cid[]=' . $row->id);
			?>
			
			<tr class="<?php echo "row$k"; ?>">
				<td><?php echo $checked; ?></td>
				<td><a href="<?php echo $link; ?>"><?php echo $row->name; ?></a></td>
				<td><?php echo $row->contact_name; ?></td>
				<td><?php echo $row->contact_email; ?></td>
			</tr>
			<?php 
			$k = 1 - $k;
		}
		?>
		<tfoot>
			<tr>
				<td class="" colspan="11"><?php echo $this->pagination->getListFooter();?></td>
			</tr>
		</tfoot>		
	</table>
	<?php echo JHTML::_('form.token'); ?>	
	<input type="hidden" name="controller" value="education" />
	<input type="hidden" name="boxchecked" value="0" />
	<input type="hidden" name="task" value="departments" />
	<input type="hidden" name="option" value="com_tbearjobs" />
	<input type="hidden" name="view" value="departments" />
	<input type="hidden" name="filter_order" value="<?php echo $this->sortColumn; ?>" />
	<input type="hidden" name="filter_order_Dir" value="<?php echo $this->sortOrder; ?>" />
	<input type="hidden" name="tb_filter" value="" id="filter" />
</form>