<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/


defined('_JEXEC') or die('Restricted access');

?>

<!-- tab -->
<script type="text/javascript">
function submitbutton(pressbutton)
{
	if (pressbutton == 'save')
	{
		var dt = $('content-pane').getElements('dt');

		for (var i=0; i<dt.length; i++)
		{
			if (dt[i].className == 'open')
			$('tabposition').value = i;
		}
	}
	
	submitform(pressbutton);
}
</script>
<form action="index.php" method="post" name="adminForm">
<?php echo $this->pane->startPane('content-pane'); ?>
<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_SETTINGS_GENERAL'),"settings-general"); ?>
	<table cellspacing="0" cellpadding="0" border="0" width="100%">
		<tr>
			<td valign="top">
				<table  class="adminform">
					<tr>
						<td width="200">
							<label for="enable.getwith">
								<?php echo JText::_( 'TBEARJOBS_ORGANISATION' ).':'; ?>
							</label>
						</td>
						<td>
							<input type="text" name="organisation" id="organisation" class="inputbox" size="50" maxlength="50" value="<?php echo $this->data['organisation'];?>" />
						</td>
					</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_DEPARTMENT');?>
					</td>
					<td>
						<?php echo $this->lists['default.dept'];?>						
					</td>
				</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_JOB_CITY');?>
					</td>
					<td>
						<input type="text" name="city" id="city" class="inputbox" size="50" maxlength="50" value="<?php echo $this->data['default.city'];?>" />
					</td>
				</tr>
				<tr>
					<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_COUNTRY');?>
					</td>
					<td>
						<?php echo $this->lists['default.country'];?>						
					</td>
				</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_JOB_TYPE');?>
					</td>
					<td>
						<?php echo $this->lists['default.jobtype'];?>						
					</td>
				</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_CAREER_LEVEL');?>
					</td>
					<td>
						<?php echo $this->lists['default.career'];?>						
					</td>
				</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_EDUCATION_LEVEL');?>
					</td>
					<td>
						<?php echo $this->lists['default.education'];?>						
					</td>
				</tr>
				<tr>
						<td width="200">
						<?php echo JText::_('TBEARJOBS_DEFAULT_CATEGORY');?>
					</td>
					<td>
						<?php echo $this->lists['default.category'];?>						
					</td>
				</tr>
				<tr>
					<td width="200">
						<label for="allow.unsolicited">
							<?php echo JText::_( 'TBEARJOBS_ALLOW_UNSOLICITED' ).':'; ?>
						</label>
					</td>
					<td>
						<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[allow.unsolicited]','class="inputbox"',$this->data['allow.unsolicited']); ?>
					</td>					
				</tr>
				<tr>
					<td width="200">
						<label for="dept.notify.admin">
							<?php echo JText::_( 'TBEARJOBS_DEPARTMENT_ADMIN' ).':'; ?>
						</label>					
					</td>
					<td>
						<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[dept.notify.admin]','class="inputbox"',$this->data['dept.notify.admin']); ?>
					</td>
				</tr>
				<tr>
					<td width="200">
						<label for="dept.notify.contact">
							<?php echo JText::_( 'TBEARJOBS_DEPARTMENT_CONTACT' ).':'; ?>
						</label>
					</td>
					<td>
						<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[dept.notify.contact]','class="inputbox"',$this->data['dept.notify.contact']); ?>
					</td>					
				</tr>
					<tr>
						<td width="200">
							<label for="debug">
								<?php echo JText::_( 'TBEARJOBS_DEBUG' ).':'; ?>
							</label>
						</td>
						<td>
							<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[enable.debug]','class="inputbox"',$this->data['enable.debug']); ?>
						</td>
					</tr>					
				</table>
			</td>
		</tr>
	</table>
<?php echo $this->pane->endPanel(); ?>
<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_NOTIFICATION'),"notification"); ?>
	<table cellspacing="0" cellpadding="0" border="0" width="100%">
		<tr>
			<td valign="top">
				<table  class="adminform">
					<tr>
						<td width="200">
							<?php echo JText::_( 'TBEARJOBS_SEND_TO' ).':'; ?>
						</td>
						<td>
							<input type="text" name="from" id="from" class="inputbox" size="50" maxlength="50" value="<?php echo $this->data['from.mail'];?>" />
						</td>
					</tr>
					<tr>
						<td width="200">
							<?php echo JText::_( 'TBEARJOBS_REPLY_TO' ).':'; ?>
						</td>
						<td>
							<input type="text" name="reply" id="reply" class="inputbox" size="50" maxlength="50" value="<?php echo $this->data['reply.to'];?>" />
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
<?php echo $this->pane->endPanel(); ?>
<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_SETTINGS_SERVER'),"settings-server"); ?>
<table cellspacing="0" cellpadding="0" border="0" width="100%" class="adminform">
	<tr>
		<td width="200">
				<?php echo JText::_( 'TBEARJOBS_SELECT_MIROSOFT_SERVER' ).':'; ?>
		</td>
		<td>
				<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[microsoft.server]','class="inputbox"',$this->data['microsoft.server']); ?>
		</td>
	</tr>
	<tr>
		<td width="200">
				<?php echo JText::_( 'TBEARJOBS_SELECT_SLEEP_TIME' ).':'; ?>
		</td>
		<td>
			<?php echo $this->lists['sleep.time'];?>
		</td>
	</tr>
	<tr>
		<td width="200">
				<?php echo JText::_( 'TBEARJOBS_SELECT_SERVER_MAXLOAD' ).':'; ?>
		</td>
		<td>
			<?php echo $this->lists['server.maxload'];?>
		</td>
	</tr>
</table>
<?php echo $this->pane->endPanel(); ?>
<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_SETTINGS_DB'),"settings-duplicate"); ?>
	<table cellspacing="0" cellpadding="0" border="0" width="100%">
		<tr>
			<td valign="top">
				<table  class="adminform">
					<tr>
						<td width="300">
								<?php echo JText::_( 'TBEARJOBS_SETTINGS_DUPLICATES' ).':'; ?>
						</td>
						<td>
							<?php echo $this->lists['avoid.duplicate'];?>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
<?php echo $this->pane->endPanel(); ?>
<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_SETTINGS_FETCH'),"settings-fetch"); ?>
	<table cellspacing="0" cellpadding="0" border="0" width="100%">
		<tr>
			<td valign="top">
				<table  class="adminform">
					<tr>
						<td width="200">
							<label for="enable.getwith">
								<?php echo JText::_( 'TBEARJOBS_ENABLE_CURL' ).':'; ?>
							</label>
						</td>
						<td>
							<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[enable.getwith]','class="inputbox"',$this->data['enable.getwith']); ?>
						</td>
					</tr>
					<tr>
						<td width="200">
							<label for="enable.getwith">
								<?php echo JText::_( 'TBEARJOBS_ENABLE_INCLUDE_LINK' ).':'; ?>
							</label>
						</td>
						<td>
							<?php echo JHTML::_('select.booleanlist','tbearjobsConfig[include.link]','class="inputbox"',$this->data['include.link']); ?>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
<?php echo $this->pane->endPanel(); ?>

<?php echo $this->pane->startPanel(JText::_('TBEARJOBS_JOB_LISTING'),"general-job_listing"); ?>
	<table cellspacing="0" cellpadding="0" border="0" width="100%">
		<tr>
			<td valign="top">
				<table  class="adminform">
					<tr>
						<td width="200">
							<label for="enable.getwith">
								<?php echo JText::_( 'TBEARJOBS_ELAPSED_DAYS' ).':'; ?>
							</label>
						</td>
						<td>
							<?php echo $this->lists['elapsed.days']; ?>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>	
<?php echo $this->pane->endPanel(); ?>
<?php echo $this->pane->endPane(); ?>
<input type="hidden" name="boxchecked" value="0" />
<input type="hidden" name="task" value="editSettings" />
<input type="hidden" name="option" value="com_tbearjobs" />
<input type="hidden" name="view" value="settings" />
<input type="hidden" name="controller" value="settings" />
<input type="hidden" name="tabposition" value="0" id="tabposition" />
</form>

<?php
//keep session alive while editing
JHTML::_('behavior.keepalive');
?>