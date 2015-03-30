<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

    defined('_JEXEC') or die('Restricted access');  // {}
?>
<?php $layout = JRequest::getVar('lyt', ''); ?>
<?php if($this->errors > 0) : ?>
   <?php global $mainframe, $option; ?>
   <?php $fields = $mainframe->getUserState('fields');   ?>
<?php endif; ?>
<?php $req_marker = '*'; ?>
         <?php $path = 'index.php?option='. $option.'&view=upload&task=uload'; ?>
		  <form method="post" action="<?php echo JRoute::_($path); ?>" id="applFRM" name="applFRM" enctype="multipart/form-data">
          <div id="aplpwrapper">
              <?php echo JText::_('Upload your CV/Resume'); ?>
              <h3><?php echo JText::_('Unsolicited Submission'); ?></h3>
              <div id="contleft">
                 <p><strong><?php echo JText::_('Note') ?>: </strong><?php echo JText::_('You have selected to upload an unsolicited CV/Resume. To submit your CV/Resume in response to a job adverised on this website, please go to the job you\'re interested in and click "Apply Now" in that job advertisement\'s details screen.'); ?></p>
                 <div class="controw">
                    <label for="first_name"><?php echo JText::_('First Name'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                    <input class="inputbox" maxlength="20" id="first_name" name="first_name" size="50" value="<?php echo ($this->errors > 0)? $fields->first_name: ''; ?>" type="text" />
                 </div>
                 <div class="controw">
                    <label for="last_name"><?php echo JText::_('Last Name'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                    <input class="inputbox" maxlength="20" id="last_name" name="last_name" size="50" value="<?php echo ($this->errors > 0)? $fields->last_name: ''; ?>" type="text" />
                 </div>
                 <div class="controw">
                    <label for="email"><?php echo JText::_('Email Address'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                    <input class="inputbox" maxlength="50" id="email" name="email" size="50" value="<?php echo ($this->errors > 0)? $fields->email: ''; ?>" type="text" />
                 </div>
                 <div class="controw">
                    <label for="tel"><?php echo JText::_('Telephone'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                    <input class="inputbox" maxlength="50" id="tel" name="tel" size="50" value="<?php echo ($this->errors > 0)? $fields->tel: ''; ?>" type="text" />
                 </div>
                 <div class="controw">
                    <label for="title"><?php echo JText::_('CV/Resume Title'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                    <input class="inputbox" id="title" name="title" size="50" maxlength="50" value="<?php echo ($this->errors > 0)? $fields->title: ''; ?>" type="text" />
                 </div>
                 <div class="rowsep">&nbsp;</div>
                 <div class="controw">
                    <div class="uplrow">
                      <label for="cv"><?php echo JText::_('CV/Resume'); ?><span class="fieldreq"><?php echo $req_marker; ?></span></label>
                      <input class="inputbox" maxlength="199" name="cv" id="cv" size="38" type="file" />
                    </div>
                    <div id="fslabel">
                      <small><strong><?php echo JText::_('NB'); ?>:</strong><?php echo '&nbsp;'.JText::_('Upload only MS Word / PDF / Txt format - 1MB or smaller'); ?></small>
                    </div>
                 </div>
                 <div class="rowsep"> <h4><?php echo JText::_('Optional') ?></h4>
                    <label for="cover_text"><?php echo JText::_('Cover Note') ?></label> <br /><small><?php echo JText::_('Enter a cover letter here'); ?>:</small>
                    <textarea rows="4" id="cover_text" cols="" name="cover_text" style="float: right; margin-right: 12%; width: 47%;padding-top:5px" ><?php echo ($this->errors > 0)? $fields->cover_note: ''; ?></textarea>
                 </div>
                 <div align="center" style="clear: both; padding-top: 15px">
                      <span id="loadr" class="hidel"></span><input id="applsubmt" name="submit_application" value="&nbsp;&nbsp;&nbsp;&nbsp;Submit your application&nbsp;&nbsp;&nbsp;&nbsp;" class="button" type="Submit">
                      <?php $show_list='index.php?option='. $option.'&view=list&catid=1&lyt='.$layout; ?>
                      &nbsp;&nbsp;&nbsp;&nbsp;<a href="<?php echo JRoute::_($show_list); ?>"><?php echo JText::_('back'); ?></a>
                 </div>
              </div>
          </div>
		  <input name="form_submit" value="submitted" type="hidden">
		  <input name="catid" value="<?php echo $this->catid; ?>" type="hidden">
	      <?php echo JHTML::_('form.token'); ?>
		  </form>
