<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
?>

<?php $document =& JFactory::getDocument(); ?>
<?php $daterange = $this->daterange; ?>
<?php $selcat = $this->selcat; ?>

<?php $seldesc = ''; ?>
<?php $link = 'index.php?option=com_jobboard&view=list'; ?>
  <form id="category_list" name="category_list" method="post" action="<?php echo JRoute::_($link); ?>">
          <?php $all_jobs = 'index.php?option=com_jobboard&view=list&catid=1&daterange=&search=&keysrch=&locsrch='; ?>
          <?php $link = 'index.php?option=com_jobboard&view=list'; ?>
               <div align="center" style="width:auto">
                <div valign="top" style="padding-bottom:5px;margin-left:19px" align="left"><select name="catid" onchange="this.form.submit()" class="inputbox">
                    <?php foreach($this->categories as $cat) : ?>
                      <option class="catitem" value="<?php echo $cat->id; ?>" <?php if($cat->id == $this->selcat) {$selcat = $cat->id; $seldesc = $cat->type; echo ' selected="selected"';}?>>
                          <?php echo $cat->type;?>
                      </option>
                    <?php endforeach; ?>
                    <!-- add the header links -->
                    <?php $document->setTitle(JText::_('Jobs in').': '.$seldesc); ?>
                    <?php $document->setMetaData('keywords', 'job listings, jobs, '.$seldesc); ?>
                    <?php $document->setMetaData('description', 'Browse job postings in category: '.$seldesc); ?>
                  </select><label for="daterange" id="drcapt"><small><?php echo JText::_('Posted from') ?></small></label>
                  <select id="daterange" name="daterange" onchange="this.form.submit()" class="inputbox">
                      <option class="catitem" value="0" <?php if($daterange == 0) echo ' selected="selected"';?>>
                          <?php echo JText::_('All post dates');?>
                      </option>
                      <option class="catitem" value="1" <?php if($daterange == 1) echo ' selected="selected"';?>>
                          <?php echo JText::_('Today');?>
                      </option>
                      <option class="catitem" value="2" <?php if($daterange == 2) echo ' selected="selected"';?>>
                          <?php echo JText::_('Yesterday');?>
                      </option>
                      <option class="catitem" value="3" <?php if($daterange == 3) echo ' selected="selected"';?>>
                          <?php echo JText::_('Last 3 days');?>
                      </option>
                      <option class="catitem" value="7" <?php if($daterange == 7) echo ' selected="selected"';?>>
                          <?php echo JText::_('Last 7 days');?>
                      </option>
                      <option class="catitem" value="14" <?php if($daterange == 14) echo ' selected="selected"';?>>
                          <?php echo JText::_('Last 14 days');?>
                      </option>
                      <option class="catitem" value="30" <?php if($daterange == 30) echo ' selected="selected"';?>>
                          <?php echo JText::_('Last 30 days');?>
                      </option>
                      <option class="catitem" value="60" <?php if($daterange == 60) echo ' selected="selected"';?>>
                          <?php echo JText::_('Last 60 days');?>
                      </option>
                  </select>
                  </div><br style="clear:both" />
        		<div align="center">
        				<div class="filterset"><label for="search"><small><?php echo JText::_('Job Title');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="search" value="<?php echo $this->search ?>" id="search" /></div>
        				<div class="filterset"><label for="keysrch"><small><?php echo JText::_('Skills/keywords');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="keysrch" value="<?php echo $this->keysrch ?>" id="keysrch" /></div>
        				<div class="filterset"><label for="locsrch"><small><?php echo JText::_('Location');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="locsrch" value="<?php echo $this->locsrch ?>" id="locsrch" /></div>
        				<div class="filterset"><input style="margin-top:8px" class="button" class="filterSub" type="submit" value="<?php echo JText::_('Show jobs');?>" /></div>
        			</div>
                    <div valign="bottom" align="center">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small><a href="<?php echo JRoute::_($all_jobs); ?>" class="JobLink" target="_top"><strong><?php echo JText::_('View All Jobs'); ?></strong></a></small>
                    </div>
             </div>
  <input type="hidden" name="layout" value="<?php echo $this->layout; ?>" />
  <?php echo JHTML::_('form.token'); ?>
 </form>