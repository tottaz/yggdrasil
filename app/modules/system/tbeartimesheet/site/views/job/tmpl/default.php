<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
?>
<?php $layout = JRequest::getVar('lyt', ''); ?>
<?php $this->catid = (!is_int($this->catid) || $this->catid <1)? 1 : $this->catid; ?>
<?php $applink = 'index.php?option=com_jobboard&view=apply&job_id='.$this->id.'&catid='.$this->catid.'&lyt='.$layout; ?>
<?php $back = 'index.php?option=com_jobboard&view=list&catid='.$this->catid.'&layout='.$layout; ?>
<?php $share = 'index.php?option=com_jobboard&view=share&job_id='.$this->id.'&catid='.$this->catid.'&lyt='.$layout; ?>

<?php $registry =& JFactory::getConfig(); ?>
<?php $sitename = $registry->getValue( 'config.sitename' ); ?>

<?php $uri = JRoute::_('http://' . urlencode($_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']));    ?>

<?php $title_prefix = urlencode('Job opening: ');    ?>
<?php $LinkedIn_long = 'http://www.linkedin.com/shareArticle?mini=true&url='.$uri.'&title='.$title_prefix.$this->data->job_title.'&source='.$sitename; ?>
<?php $Twitter_long = 'http://twitter.com/home?status='.$title_prefix.$this->data->job_title.' - '.$uri; ?>
<?php $FB_long = 'http://www.facebook.com/sharer.php?u='.$uri.'&t='.$title_prefix.$this->data->job_title.'&src='.$sitename; ?>

<?php if(strlen($this->data->description) > 250) : ?>
<?php $article_summary = substr($this->data->description, 0, 250) . '...'; ?>
<?php else : $article_summary = '';  ?>
<?php endif; ?>
<?php $return = JText::_("Return to list"); ?>
<div id="jobcont">
  <div id="jobsumm">
     <small>
       <h3><?php echo JText::_('Job Summary'); ?></h3>
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
       <div class="jsrow">
          <?php $this_salary = (strlen($this->data->salary) < 1)? JText::_('Negotiable') : $this->data->salary; ?>
          <?php echo '<span class="summtitle">'.JText::_('Salary').':</span><br /><b>'.$this_salary.'</b>'; ?>
       </div>
       <div align="center" style="padding: 5px; margin-top: 5px">
          <a href="<?php echo JRoute::_($applink); ?>"> <div class="button applbut">&nbsp;&nbsp;<?php echo JText::_('Apply Now'); ?>&nbsp;&nbsp;</div></a>
          <a href="<?php echo JRoute::_($share); ?>">
            <div class="button applbut"><?php echo JText::_('Email to a friend'); ?></div>
         </a><br />
          <small><a href="<?php echo JRoute::_($back) ?>"><b>&#171;&nbsp;</b><?php echo $return; ?></a></small>
       </div>
     </small>
  </div>
  <div id="jobdet">
    <h3><?php echo $this->data->job_title; ?></h3>
    <div style="width: 100%">
      <div id="hitsumm">
        <small>
            <?php if($this->data->num_applications == 1) : ?>
              <?php echo '<b>*</b> '.JText::_('There has been'). ' <span class="hit">'. $this->data->num_applications . '</span>  '. JText::_('application for this position'); ?>
            <?php else : ?>
              <?php echo '<b>*</b> '.JText::_('There have been'). ' <span class="hit">'. $this->data->num_applications . '</span>  '. JText::_('applications for this position'); ?>
            <?php endif; ?>
            <br />
            <?php echo '<b>*</b> '.JText::_('This job opening has been viewed'). ' <span class="hit">'. $this->data->hits . '</span>  '. JText::_('times'); ?>
        </small>
        <small id="hsback"><a href="<?php echo JRoute::_($back) ?>"><b>&#171;&nbsp;</b><?php echo $return; ?></a></small>
      </div>
      <div style="padding-top: 10px; clear: both; padding-bottom: 15px">
      <?php echo '<b>'.JText::_('About this job').'</b>'; ?>
      </div>
      <?php echo $this->data->description; ?> <br />
      <div align="center" id="divbottom">
         <a href="<?php echo JRoute::_($applink); ?>">
            <div class="button applbut" style="width: 20%">&nbsp;&nbsp;<?php echo JText::_('Apply Now'); ?>&nbsp;&nbsp;</div>
         </a>&nbsp;&nbsp;&nbsp;&nbsp;
         <small><a href="<?php echo JRoute::_($back) ?>"><b>&#171;&nbsp;</b><?php echo $return; ?></a></small>
            <a target="_blank" href="<?php echo $LinkedIn_long; ?>" title="share on linkedin"><div id="linkedin">&nbsp;</div></a>
            <a target="_blank" href="<?php echo $Twitter_long; ?>" title="share on twitter"><div id="twitter">&nbsp;</div></a>
            <a target="_blank" href="<?php echo $FB_long; ?>" title="share on facebook"><div id="facebook">&nbsp;</div></a>
      </div>
    </div>
  </div>
</div>