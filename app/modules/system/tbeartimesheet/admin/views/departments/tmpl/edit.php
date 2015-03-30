<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

defined('_JEXEC') or die('Restricted access');

?>
<form action="index.php" method="post" name="adminForm" id="adminForm">
	<fieldset class="adminform">
		<legend><?php echo JText::_('Edit Department');?></legend>
		<table class="admintable">
        <?php if($this->row->id > 0) : ?>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('ID');?>
				</td>
				<td>
					<?php echo $this->row->id;?>
				</td>
			</tr>
         <?php endif; ?>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Deparment Name');?>
				</td>
				<td>
					<input class="text_area" type="text" name="name" id="name" size="80" maxlength="250" value="<?php echo $this->row->name;?>" />
				</td>
			</tr>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Primary Contact Name');?>
				</td>
				<td>
					<input class="text_area" type="text" name="contact_name" id="contact_name" size="80" maxlength="250" value="<?php echo $this->row->contact_name;?>" />
				</td>
			</tr>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Contact Email');?>
				</td>
				<td>
					<input class="text_area" type="text" name="contact_email" id="contact_email" size="80" maxlength="250" value="<?php echo $this->row->contact_email;?>" />
				</td>
			</tr>
		</table>
	</fieldset>
    <fieldset class="adminform">
		<legend><?php echo JText::_('Email Notifications');?></legend>
		<table class="admintable">
        <?php if($this->row->id == 0) : ?>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify Job Board Admin');?>
				</td>
				<td>
                    <select name="notify_admin" id="notify_admin">
                       <option value="1" <?php if($this->config->dept_notify_admin == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                       <option value="0" <?php if($this->config->dept_notify_admin == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify Department Contact');?>
				</td>
				<td>
                    <select name="notify" id="notify">
                      <option value="1" <?php if($this->config->dept_notify_contact == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                      <option value="0" <?php if($this->config->dept_notify_contact == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
            <?php else : ?>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify Job Board Admin');?>
				</td>
				<td>
                    <select name="notify_admin" id="notify_admin">
                       <option value="1" <?php if($this->row->notify_admin == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                       <option value="0" <?php if($this->row->notify_admin == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify Department Contact');?>
				</td>
				<td>
                    <select name="notify" id="notify">
                      <option value="1" <?php if($this->row->notify == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                      <option value="0" <?php if($this->row->notify == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
        <?php endif; ?>
        </table>
	</fieldset>
    <fieldset class="adminform">
		<legend><?php echo JText::_('Job Applicant Notifications');?></legend>
		<table class="admintable">
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify job applicant if application successful');?>
				</td>
				<td>
                    <select name="acceptance_notify" id="acceptance_notify">
                       <option value="1" <?php if($this->row->acceptance_notify == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                       <option value="0" <?php if($this->row->acceptance_notify == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
			<tr>
				<td align="right" class="key">
					<?php echo JText::_('Notify job applicant if application rejected');?>
				</td>
				<td>
                    <select name="rejection_notify" id="rejection_notify">
                      <option value="1" <?php if($this->row->rejection_notify == 1) echo 'selected="selected"'; ?>><?php echo JText::_('yes'); ?></option>
                      <option value="0" <?php if($this->row->rejection_notify == 0) echo 'selected="selected"'; ?>><?php echo JText::_('no'); ?></option>
					</select>
				</td>
			</tr>
        </table>
	</fieldset>
	<input type="hidden" name="id" value="<?php echo $this->row->id;?>" />
	<input type="hidden" name="option" value="<?php echo $option;?>" />
	<input type="hidden" name="view" value="<?php echo JRequest::getVar('view',''); ?>" />
	<input type="hidden" name="task" value="<?php echo JRequest::getVar('task',''); ?>" />
	<?php echo JHTML::_('form.token'); ?>
</form>
