<?php
/**
* @version 1.0
* @package TEAR:JOBS 1.0
* @copyright (C) 2009 by ThunderBear Design - All rights reserved!
* @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/


defined('_JEXEC') or die('Restricted access');
?>
<table width="100%" border="0">
	<tr>
		<td width="55%" valign="top">
			<div id="cpanel">
				<?php echo $this->addIcon('dashboard.png','index.php?option=com_tbearjobs&task=jobs', JText::_('Jobs'));?>			
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=applicants', JText::_('Applicants'));?>				
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=messages', JText::_('Messages'));?>
 				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=category', JText::_('Category'));?>
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=careerlevels', JText::_('Career Levels'));?>				
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=education', JText::_('Education'));?>
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=departments', JText::_('Departments'));?>				
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=statuses', JText::_('Statuses'));?>				
				<?php echo $this->addIcon('settings.png','index.php?option=com_tbearjobs&task=editsettings', JText::_('Settings'));?>				
				<?php echo $this->addIcon('feedback.png','http://thunderbear.uservoice.com/pages/32649', JText::_('Feedback'));?>
			</div>
		</td>
		</td>
		<td width="45%" valign="top">
			<?php
				echo $this->pane->startPane( 'stat-pane' );
				echo $this->pane->startPanel( JText::_('Welcome to TBEAR:JOBS') , 'welcome' );
			?>
			<table class="adminlist">
			  <tr class="thisform"><td bgcolor="#FFFFFF"><br />
		        <div style="width=100%" align="center">
		         <img src="<?php echo JURI::root(); ?>administrator/components/com_tbearjobs/assets/icons/logo.png" align="middle" alt="ThunderBear Design Logo"/>
		         <br /><br />
			    </div>
		        </td>
			  </tr>
			  <tr>
					<td>
						<div style="font-weight:700;">
							<?php echo JText::_('Another great component brought to you by ThunderBear Design');?>
						</div>
						<p>
							If you require professional support just head on to the forums at 
							<a href="http://www.thunderbeardesign.com/forum/" target="_blank">
							http://www.thunderbeardesign.com/forum
							</a>
							For developers, you can browse through the documentations at 
							<a href="http://www.thunderbeardesign.com/docs.html" target="_blank">http://www.thunderbeardesign.com/docs.html</a>
						</p>
						<p>
							If you found any bugs, just drop us an email at bugs@thunderbeardesign.com
						</p>
					</td>
				</tr>
			</table>
			<?php
				echo $this->pane->endPanel();
				echo $this->pane->startPanel( JText::_('Guide') , 'guide' );
			?>
				<table class="adminlist">
					<tr>
					<td>
						<legend><?php echo JText::_( 'Setup TBEAR:JOBS' ); ?></legend>
						For TBEAR:JOBS to work, you require Migthy Resources version 1.3 or above installed and to have at least one section and one type defined in Mighty Resources.<br><br>The TBEAR:FILL utilized the following fields to map RSS data to JoomSuite Resources:<br>
						url field - RSS Link<br>textarea field - RSS description<br>html field - RSS description<br>TBEAR:FILL also set automatically the following fields:<br><br>social_bookmarks field = set to yes<br>mail field = set to zero<br /><br />
					</td>		
					</tr>	
					<tr>
						<td>
							<h2>
								<?php echo JText::_( 'Step 1' ); ?>:
							</h2>
							To set up a new feed, you need to first select dashboard view and then select New from the menu bar.<br /><br /> 
						</td>
					</tr>
					<tr>
						<td>
							<h2>
								<?php echo JText::_( 'Step 2' ); ?>:
							</h2>
						</td>
					</tr>
					<tr>
						<td>
							<h2>
								<?php echo JText::_( 'Step 3' ); ?>:
							</h2>
						</td>
					</tr>
					<tr>
						<td>
							<h2>
								<?php echo JText::_( 'Step 4' ); ?>:
							</h2>
						</td>
					</tr>																							
				</table>

			<?php
				echo $this->pane->endPanel();				
				echo $this->pane->startPanel( JText::_('TBEAR:FILL Product Info'), 'product' );
			?>
		    <table border="1" width="100%" class="thisform">
				<tr class="thisform">
		            <th class="cpanel" colspan="2"><?php echo JText::_('TBEARJOBS_PRODUCT') . JText::_('TBEARJOBS_VERSION').' rev '.JText::_('TBEARJOBS_REVISION');?></th></td>
		         </tr>

		         <tr class="thisform">
		            <td width="120" bgcolor="#FFFFFF"><?php echo JText::_( 'TBEARJOBS_INSTALLED_VERSION_LABEL' ); ?></td>
		            <td bgcolor="#FFFFFF"><?php echo JText::_( 'TBEARJOBS_VERSION' );?></td>
		         </tr>
		         <tr class="thisform">
		            <td bgcolor="#FFFFFF"><?php echo JText::_( 'TBEARJOBS_COPYRIGHT_LABEL' ); ?></td>
		            <td bgcolor="#FFFFFF"><?php echo JText::_('TBEARJOBS_COPYRIGHT');?></td>
		         </tr>
		         <tr class="thisform">
		            <td valign="top" bgcolor="#FFFFFF"><?php echo JText::_( 'TBEARJOBS_AUTHOR_LABEL' ); ?></td>
		            <td bgcolor="#FFFFFF">
		            <?php echo JText::_('TBEARJOBS_AUTHOR');?>
					</td>
		         </tr>				 
		      </table>
			<?php
				echo $this->pane->endPanel();
				echo $this->pane->startPanel( JText::_('ThunderBear Design - News'), 'news' );
			?>
				<table class="adminlist">
					<tr>
						<td>
							<div>Recent news</div>
						</td>
					</tr>
				</table>
			<?php
				echo $this->pane->endPanel();
				echo $this->pane->endPane();
			?>
		</td>		
	   </tr>
	</table>