<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

    defined('_JEXEC') or die('Restricted access');
    $itemid = JRequest::getVar('Itemid', '');
?>
<?php $layout = JRequest::getVar('lyt', ''); ?>
<?php $this->errors = JRequest::getVar('errors', '');?>
<?php if($this->errors > 0) : ?>
   <?php global $mainframe; ?>
   <?php $afields = $mainframe->getUserState('sfields');   ?> 
<?php endif; ?>
<?php $req_marker = '*'; ?>
<?php $path = 'index.php?option=com_jobboard&view=job&task=share'; ?>
<form method="post" action="<?php echo JRoute::_($path); ?>" id="shareFRM" name="shareFRM" enctype="multipart/form-data">
  <div id="aplpwrapper">
    <h3><?php echo JText::_('Email this job-posting to someone in mind'); ?></h3>
    <div id="contleft">
        <fieldset>
          <legend>Your details</legend>
          <div class="controw">
            <label for="sender_email"><?php echo JText::_('Your Email'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
            <input class="inputbox" maxlength="60" id="sender_email" name="sender_email" size="50" value="<?php echo ($this->errors > 0)? $afields->sender_email: ''; ?>" type="text" />
          </div>
          <div class="controw">
            <label for="sender_name"><?php echo JText::_('Your full name'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
            <input class="inputbox" maxlength="60" id="sender_name" name="sender_name" size="50" value="<?php echo ($this->errors > 0)? $afields->sender_name: ''; ?>" type="text" />
          </div>
         <div class="rowsep">&nbsp;</div>
        <legend>Your message</legend>
          <div class="controw">
            <label for="rec_emails"><?php echo JText::_('To email address(es)'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
            <br />
            <small><?php echo JText::_('(separate multiple addresses with commas)'); ?></small>
            <textarea class="inputbox" cols="53" rows="4" id="rec_emails" name="rec_emails"><?php echo ($this->errors > 0)? $afields->rec_emails: ''; ?></textarea>
          </div>
          <div class="controw" style="padding-top: 15px">
            <label for="personal_message"><?php echo JText::_('Enter brief message'); ?></label>
            <textarea class="inputbox" style="padding:-top:5px" cols="53" rows="4" id="personal_message" name="personal_message"><?php echo ($this->errors > 0)? $afields->personal_message: $this->msg; ?></textarea>
          </div>
        </fieldset>
        <div align="center" style="clear: both; padding-top: 15px">
            <input name="sendsubmit" value="&nbsp;&nbsp;&nbsp;&nbsp;Send message&nbsp;&nbsp;&nbsp;&nbsp;" class="button" type="submit">
                      <?php $sel_job='index.php?option=com_jobboard&view=job&id='.$this->id.'&catid='.$this->catid.'&lyt='.$layout.'&Itemid='.$itemid; ?>
                      &nbsp;&nbsp;&nbsp;&nbsp;<a href="<?php echo JRoute::_($sel_job); ?>"><?php echo JText::_('cancel'); ?></a>
        </div>
   </div>
      <div id="contright">
         <small>
           <h3><?php echo JText::_('Job Summary'); ?></h3>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Job Title').':</span><br />'.$this->data->job_title; ?>
           </div>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Location').':</span><br />'.$this->data->city.', '.$this->data->country_name.', '.$this->data->country_region; ?>
           </div>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Career Level').':</span><br />'.$this->data->job_level; ?>
           </div>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Education').':</span><br />'.$this->data->education; ?>
           </div>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Job Type').':</span><br />'.$this->data->job_type; ?>
           </div>
           <div class="jsrow">
              <?php echo '<span class="summtitle">'.JText::_('Positions').':</span><br />'.$this->data->positions; ?>
           </div>
           <div class="jsrow lrow">
              <?php $this_salary = (strlen($this->data->salary) < 1)? JText::_('Negotiable') : $this->data->salary; ?>
              <?php echo '<span class="summtitle">'.JText::_('Salary').':</span><br /><b>'.$this_salary.'</b>'; ?>
           </div>
         </small>
      </div>
   </div>
  <input name="job_id" value="<?php echo $this->id; ?>" type="hidden">
  <input name="catid" value="<?php echo $this->catid; ?>" type="hidden">
  <input name="job_title" value="<?php echo $this->data->job_title; ?>" type="hidden">
  <input name="job_city" value="<?php echo $this->data->city; ?>" type="hidden">
  <input name="job_path" value="<?php echo JUri::Base().($sel_job); ?>" type="hidden">
  <?php echo JHTML::_('form.token'); ?>
`</form>

