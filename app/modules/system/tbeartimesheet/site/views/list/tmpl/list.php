<?php
/**
 * @package JobBoard
 * @copyright Copyright (c)2010 Tandolin
 * @license GNU General Public License version 2, or later
 */

defined('_JEXEC') or die('Restricted access');
?>

<?php $sortlink = JRoute::_('index.php?option=com_jobboard&view=list&Itemid='.JRequest::getVar('Itemid','')); ?>
<?php $document =& JFactory::getDocument(); ?>

<!--sort order-->
<?php $sort = $mainframe->getUserStateFromRequest('jb_list.sort','sort','d'); ?>
<?php $order = $mainframe->getUserStateFromRequest('jb_list.order','order','date'); ?>
<?php $sortlink = ($sort=='a')? $sortlink.'&sort=d' : $sortlink.'&sort=a'; ?>
<?php if($sort=='a') : ?>
	<?php $sortimage = 'sup';  ?>
<?php else :  ?>
	<?php $sortimage = 'sdown';  ?>
<?php endif;  ?>

<?php $daterange = $this->daterange; ?>

<!--Pagination-->
<?php $pagination =& $this->get('Pagination'); ?>
<?php $this->assignRef('pagination', $pagination); ?>

<!--display page title if configured-->
<?php $params =& $mainframe->getParams('com_content'); ?>
<?php $this->assignRef('params' , $params); ?>
<?php $selcat = $this->selcat; ?>      
<?php $seldesc = ''; ?>
<?php $link = 'index.php?option=com_jobboard&view=list'; ?>
  <form id="category_list" name="category_list" method="post" action="<?php echo JRoute::_($link); ?>">
          <?php $all_jobs = 'index.php?option=com_jobboard&view=list&catid=1&daterange=&search=&keysrch=&locsrch='; ?>
                <div style="padding-bottom:5px;margin-left:19px" align="left">
                <select name="catid" id="fcats" onchange="this.form.submit()" class="inputbox">
                    <?php foreach($this->categories as $cat) : ?>
                      <option class="catitem" value="<?php echo $cat->id; ?>" <?php if($cat->id == $this->selcat) {$selcat = $cat->id; $seldesc = $cat->type; echo ' selected="selected"';}?>>
                          <?php echo $cat->type;?>
                      </option>
                    <?php endforeach; ?>
                    <?php  $feed_title = $seldesc.' '.JText::_('Feed'); ?>
                    <?php  $rss = array('type' => 'application/rss+xml', 'title' => $feed_title.' (RSS)' ); ?>
                    <?php  $atom = array('type' => 'application/atom+xml', 'title' => $feed_title. ' (Atom)' ); ?>
                    <?php $all_cat_feedlink = 'index.php?option=com_jobboard&view=list&catid=1&format=feed'; ?>
                    <?php $feedlink = 'index.php?option=com_jobboard&view=list&catid='.$selcat.'&format=feed'; ?>
                    <!-- add the header links -->
                     <?php $document->addHeadLink(JRoute::_($feedlink.'&type=rss'), 'alternate', 'rel', $rss); $document->addHeadLink(JRoute::_($feedlink.'&type=atom'), 'alternate', 'rel', $atom); ?>
                    <?php $document->setTitle(JText::_('Jobs in').': '.$seldesc); ?>
                    <?php $document->setMetaData('keywords', 'job listings, jobs, '.$seldesc); ?>
                    <?php $document->setMetaData('description', 'Browse job postings in category: '.$seldesc); ?>
                  </select><label for="daterange" id="drcapt"><small><?php echo JText::_('Jobs from') ?></small></label>
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

                  <?php $unsolicited_link = 'index.php?option=com_jobboard&view=unsolicited&catid='.$selcat; ?>
                  <a style="margin-left:10px" href="<?php echo JRoute::_($unsolicited_link); ?>"><button class="button" style="font-size:0.86em"><?php echo JText::_('Submit CV/Resume');?></button></a>
                  </div><br style="clear:both" />
        		<div align="center">
        				<div class="filterset"><label for="search"><small><?php echo JText::_('Job Title');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="search" value="<?php echo $this->search ?>" id="search" /></div>
        				<div class="filterset"><label for="keysrch"><small><?php echo JText::_('Skills/knowledge,etc.');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="keysrch" value="<?php echo $this->keysrch ?>" id="keysrch" /></div>
        				<div class="filterset"><label for="locsrch"><small><?php echo JText::_('Location');?>&nbsp;</small></label><br /> <input class="inputbox" type="text" name="locsrch" value="<?php echo $this->locsrch ?>" id="locsrch" /></div>
        				<div class="filterset"><input style="margin-top:8px" class="button filterSub" type="submit" id="filtrsubmt" value="<?php echo JText::_('Show jobs');?>" /><span id="loadr" class="hidel"></span></div>
        			</div>
                    <?php if ($selcat <> 1) : ?>
                      <div align="center">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small><a id="jall" href="<?php echo JRoute::_($all_jobs); ?>" class="JobLink" target="_top"><strong><?php echo JText::_('View All Jobs'); ?></strong></a></small>
                      </div>
                    <?php endif; ?>

  <?php $count = count($this->data); ?>

  <div id="jobtable">
     <?php $tbl_view_link = 'index.php?option=com_jobboard&view=list&catid='.$selcat.'&layout=table'; ?>
    <div style="width:100%" class="pagination" align="right" ><?php echo $this->pagination->getResultsCounter();?>&nbsp;&nbsp;<a href="<?php echo JRoute::_($tbl_view_link) ?>" title="Table view" id="tableView" class="tableView"></a><a title="List view (current)" class="listView"></a></div><br style="clear:both" />
    <table width="100%" cellspacing="0" cellpadding="5" align="center" class="text">
      <tbody>
        <tr valign="top" class="headbg">
          <?php $date_sort = $sortlink.'&order=date' ?>
          <td align="right" style="width: 70%;" >
            <span style="float:right"><small><?php echo JText::_('Sort by').'&nbsp;' ?></small>
            <select name="order" id="sort_selct" onchange="this.form.submit()">
              <option value="date" <?php if($order == 'date') echo 'selected="selected"'; ?> ><?php echo JText::_('Date posted').'&nbsp;' ?></option>
              <option value="title" <?php if($order == 'title') echo 'selected="selected"'; ?> ><?php echo JText::_('Job title').'&nbsp;' ?></option>
              <option value="level" <?php if($order == 'level') echo 'selected="selected"'; ?> ><?php echo JText::_('Career level').'&nbsp;' ?></option>
              <option value="city" <?php if($order == 'city') echo 'selected="selected"'; ?> ><?php echo JText::_('Location').'&nbsp;' ?></option>
              <option value="type" <?php if($order == 'type') echo 'selected="selected"'; ?> ><?php echo JText::_('Job category').'&nbsp;' ?></option>
            </select></span>
          </td>
          <td height="18" align="left" class="jtitle" style="width:30%">
            <small><?php echo JText::_('Order').'&nbsp;' ?></small>
            <select onchange="this.form.submit()" id="order_selct" name="sort">
              <option value="a" <?php if($sort == 'a') echo 'selected="selected"'; ?> ><?php echo JText::_('Lowest / Oldest first').'&nbsp;' ?></option>
              <option value="d" <?php if($sort == 'd') echo 'selected="selected"'; ?> ><?php echo JText::_('Highest / Latest first').'&nbsp;' ?></option>
            </select>
          </td>

        </tr><?php if ($count < 1) : ?>

        <tr valign="top">
          <td><?php echo JText::_('No jobs listed'); ?></td>
        </tr><?php else: ?><? $rt = 0; ?>
        <?php foreach($this->data as $row) : ?>
            <?php $row_style = ($rt == 0)? 'bgwhite' : 'bggrey'; ?>
            <?php $rt = ($rt == 0)? 1 : 0; ?>

            <tr valign="top">
              <td style="width: 70%" class="<?php echo $row_style?>">
                    <?php $full_desc =   preg_replace("/(<\/?)(\w+)([^>]*>)/e", "", strip_tags($row->description, '<p><div><span><a><br /><br><ul><li>')); ?>
                    <?php if(strlen($full_desc) > 70) {$chopped_desc = substr($full_desc, 0, 70).'... ';} else $chopped_desc = $full_desc; ?>
                    <?php if(strlen($full_desc) > 140) $chopped_desc .= substr($full_desc, 71, 140).'... '; ?>
                    <?php if(strlen($full_desc) > 210) $chopped_desc .= substr($full_desc, 141, 210).'... '; ?>
                    <?php if(strlen($this->search) > 0) : ?>
                        <?php $pattern = $this->search; $replacement = '<span class="highlight">'.$this->search.'</span>'; ?>
                        <?php $job_title_h = str_ireplace ( $pattern, $replacement, $row->job_title); ?>
                        <?php $chopped_desc_h = str_ireplace ( $pattern, $replacement, $chopped_desc); ?>
                    <?php else : ?>
                        <?php $job_title_h = $row->job_title; ?>
                        <?php $chopped_desc_h = $chopped_desc; ?>
                    <?php endif; ?>
                    <?php $city_h = $row->city; ?>
                    <?php if(strlen($this->keysrch) > 0) : ?>
                        <?php $skillsets = explode(',', $this->keysrch); ?>
                        <?php foreach ($skillsets as $keywd) : ?>
                          <?php $pattern = $keywd; $replacement = '<span class="highlight">'.$keywd.'</span>'; ?>
                          <?php $job_title_h = str_ireplace ( $pattern, $replacement, $job_title_h); ?>
                          <?php $chopped_desc_h = str_ireplace ( $pattern, $replacement, $chopped_desc_h); ?>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    <?php if(strlen($this->locsrch) > 0) : ?>
                        <?php $pattern = $this->locsrch; $replacement = '<span class="highlight">'.$this->locsrch.'</span>'; ?>
                        <?php $job_title_h = str_ireplace ( $pattern, $replacement, $job_title_h); ?>
                        <?php $city_h = str_ireplace ( $pattern, $replacement, $city_h); ?>
                        <?php $chopped_desc_h = str_ireplace ( $pattern, $replacement, $chopped_desc_h); ?>
                    <?php endif; ?>
                        <?php $job_link = 'index.php?option=com_jobboard&view=job&id='.$row->id.'&catid='.$this->selcat.'&lyt=list'; ?>
                        <h3><a href="<?php echo JRoute::_($job_link); ?>" class="JobLink" target="_top"> <?php echo $job_title_h.' - '.$city_h; ?></a></h3>
                   <?php if($order=='city') echo '<span class="'.$sortimage.' plusmargn">'.JText::_('Sort by').' <strong>'.JText::_('Location').'</strong></span><br style="clear:both" />';?>
                   <?php if($order=='title') echo '<span class="'.$sortimage.' plusmargn">'.JText::_('Sort by').' <strong>'.JText::_('Job Title').'</strong></span><br style="clear:both" />';?>
                   <?php echo $chopped_desc_h; ?>
              </td>
              <td style="width:30%" class="<?php echo $row_style?>">
                <ul style="list-style: none">
                    <li style="list-style-type: none;background: transparent;border-bottom: 1px dotted #777" class="lstsumm"><?php if($order=='date') echo '<span class="'.$sortimage.'">&nbsp;</span>';?><?php $date = new JDate($row->post_date); ?><b><?php echo JText::_('Posted on').' '.$date->toFormat("%B %d, %Y"); ?></b></li>
                    <li style="list-style-type: none;border-bottom: 1px dotted #777; background: transparent" class="lstsumm"><?php echo (strlen($row->salary) < 1)? JText::_('Salary negotiable') : $row->salary; ?></li>
                    <li style="list-style-type: none;background: transparent;border-bottom: 1px dotted #777" class="lstsumm"><?php if($order=='type') echo '<span class="'.$sortimage.'">&nbsp;</span>';?><?php echo $row->category; ?></li>
                    <li style="list-style-type: none;background: transparent;" class="lstsumm"><?php if($order=='level') echo '<span class="'.$sortimage.'">&nbsp;</span>';?><?php echo $row->job_level; ?></li>
                    <li class="lstsumm" style="list-style-type: none;background: transparent; padding-top:10px; margin-left: 15%"><small><a class="button" style="margin-top:5px" href="<?php echo JRoute::_($job_link); ?>"><?php echo JText::_('See details'); ?></a></small></li>
                </ul>
              </td>
            </tr>
        <?php endforeach; ?><?php endif; ?>
      </tbody>
    </table>
    <div class="pagination" align="right" style="padding-top:7px"><?php echo $this->pagination->getPagesLinks().'<br />'.JText::_('Results per page').':&nbsp;&nbsp;'.$this->pagination->getLimitBox();?></div>
    <div align="center" id="feedarea">
       <?php echo '<b>'.JText::_('RSS'). ' </b>' .JText::_('feed'); ?>: <a class="feedicon" href="<?php echo JRoute::_($feedlink) ?>"><?php echo $seldesc; ?></a>
       <?php if (intval($selcat) <> 1) : ?>
        &nbsp;&nbsp;<a class="feedicon" href="<?php echo JRoute::_($all_cat_feedlink) ?>"><?php echo JText::_('All categories'); ?></a>
      <?php endif; ?>
    </div>
  </div>
  <input type="hidden" name="layout" value="list" />
  <?php echo JHTML::_('form.token'); ?>
 </form>