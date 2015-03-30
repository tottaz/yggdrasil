<?php
/**
* @version 1.1
* @package TEAR:FILL 1.1
 * @copyright (C) 2009 by ThunderBear Design - All rights reserved!
 * @license http://www.thunderbeardesign.com Copyrighted Commercial Software
*/

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class tbeartimesheetControllerFeeds extends tbeartimesheetController {

	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {
		parent::__construct();

		// Register Extra tasks
		$this->registerTask( 'add' , 'edit' );
		$this->registerTask('apply' ,  'save');
		$this->registerTask( 'unpublish' , 'publish');
		$this->registerTask( 'orderup' , 'move');
		$this->registerTask( 'orderdown' , 'move');	
		$this->registerTask( 'processfeed' , 'processfeed');		
	}
		
	/**
	 * save a record (and redirect to main page)
	 * @return void
	 */
	function save() {

	// Check for request forgeries
		JRequest::checkToken() or die( 'Invalid Token' );

     	$model = $this->getModel('feeds');

		$id=JRequest::getVar('id','','post','int');		
		$post=JRequest::get('post',JREQUEST_ALLOWRAW);
		$row= & JTable::getInstance('Tbearfill','Table');

		if(!$row->bind($post)) {
			return JError::raiseWarning(500, $row->getError());
		}

		$row->feed_url = str_replace('&amp;','&',$row->feed_url);
		$row->feed_url = str_replace('&','&amp;',$row->feed_url);

		$row->checked_out = 1;
		
		if(isset($post['restoreoriginal']) && $post['restoreoriginal'] == 1) {
			$row->checked_out = 0 ;
		}
		
		if ($row->store()) {
			$msg = JText::_('TBEARFILL_FEEDS_SAVE' );
		} else {
			JError::raiseWarning(500, $row->getError());
			$msg = JText::_('TBEARFILL_FEEDS_SAVE_ERROR' );
		}

		switch(JRequest::getCmd('task')) {
			case 'apply' :
					$link = 'index.php?option=com_tbeartimesheet&task=editfeeds&cid='.$row->id;
			break;
			
			case 'save' :
					$link = 'index.php?option=com_tbeartimesheet&task=listfeeds';
			break;
		}
		$this->setRedirect($link, $msg);
	}

	/**
	 * remove record(s)
	 * @return void
	 */
	function remove() {
		$db = & JFactory::getDBO();
		$model = $this->getModel('feeds');
		$row =& JTable::getInstance('Tbearfill','Table');
		$cids=JRequest::getVar('cid',array(0),'post','array');
		foreach($cids as $i=>$cid)
			if($cid==1) unset($cids[$i]);
		$db->setQuery("SELECT COUNT(*) AS cnt FROM #__tbeartimesheet_entries WHERE id IN ('".implode("','",$cids)."')");
		$pagesFound = $db->loadResult();
		
		if(!empty($pagesFound)) {
			$db->setQuery("DELETE FROM #__tbeartimesheet_entries WHERE id IN ('".implode("','",$cids)."')");
			$db->query();
			$msg= JText::sprintf('TBEARFILL_FEEDS_DELETE',count($cids));
			$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=listfeeds', $msg );
		}
		else 
		
		$msg = JText::_('TBEARFILL_FEEDS_DELETE_ERROR' );
		$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=listfeeds', $msg , 'error'); 
	}	
	
	function publish() {
		global $mainframe;

		$db 	=& JFactory::getDBO();

		$cid		= JRequest::getVar( 'cid', array(), '', 'array' );
		$publish	= ( $this->getTask() == 'publish' ? 1 : 0 );

		JArrayHelper::toInteger($cid);
		//echo $cid; die();
		if (count( $cid ) < 1) {
			$action = $publish ? 'publish' : 'unpublish';
			JError::raiseError(500, JText::_('TBEARFILL_FEEDS_PUBLISHED_ERROR' .$action, true ) );
		}

		$cids = implode( ',', $cid );
		
		$query = 'UPDATE #__tbeartimesheet_entries'
		. ' SET published = ' . (int) $publish
		. ' WHERE id IN ( '. $cids .' )'
		;
		$db->setQuery( $query );
		if (!$db->query()) {
			JError::raiseError(500, $db->getErrorMsg() );
		}

		$mainframe->redirect( 'index.php?option=com_tbeartimesheet&task=listfeeds' );
	}
	
	
	/**
	 * cancel editing a record
	 * @return void
	 */
	function cancel() {
		$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=listfeeds');
	}
	
	function processfeed() {
		
		jimport( 'joomla.application.component.model' );
		
		global $mainframe , $option;
   
		//titlu
	 
		ob_implicit_flush(true);
		
		$cids=JRequest::getVar( 'cid', array(), 'post', 'array' );
		$content=JRequest::getVar( 'contents', '', 'post','string', JREQUEST_ALLOWRAW );
		$id=JRequest::getVar('id','','post','int');

		$tbeartimesheetConfig = $mainframe->getUserState('tbeartimesheetConfig');	
		$db 	= & JFactory::getDBO();
     	$model = $this->getModel('feeds');

		$user	= & JFactory::getUser();
				
		$row_feed= & JTable::getInstance('Tbearfill','Table');
		$row_feed->load($id);		//id has to match what is in the table strcuture
				
		$tweetcount=0;
		$tweets=$row_feed->tweets;
		$tweetcount=$row_feed->tweets;	

		 if (is_array($content) && is_array($cids)) {
			if(!empty($cids)) {
				foreach ($cids as $iden) {  
					$item=$content[$iden];
					$parts1=split("\|",$item);
					$parts=array_map ('rawurldecode',$parts1);
					if ($tbeartimesheetConfig['avoid.duplicate']!=254) {
						$sec_avoid=($tbeartimesheetConfig['avoid.duplicate']==128);
						$parts[1] .= $row_feed->texttitle;
					if (checkduptitles($parts[1])) 
						$itemToSave[]=$item; //new code to avoid duplicating a news...
					} else {
						$itemToSave[]=$item;
					}
				}
				$nullDate = $db->getNullDate();
			
				if(!empty($itemToSave)) {
					foreach (array_reverse($itemToSave) as $item) {
						$parts1=split("\|",$item);
						$parts=array_map('rawurldecode',$parts1);
						$link=$parts[0];
						$title=html_entity_decode($parts[1]);
						$date=$parts[2];
						$content=$parts[4];
						$guid=$parts[5];
						$author=$parts[6];
						$introText=stripslashes($parts[3]);
						$fullText=$content;
						$fullText.=($row_feed->origdate==1)? "<br/>\n".JText::_("Posted").": $date":"";
						   
						if($introText == '') {
							$introText = $title;
						}

						// remove links
						if ($row_feed->linkremove==1) {
							$introText = preg_replace('/<a target=\"(.*?)\">(.*?)<\/a>/', "\\2", $introText);  
							$fullText = preg_replace('/<a target=\"(.*?)\">(.*?)<\/a>/', "\\2", $fullText);
							if (preg_match("/\bsave job, email, more...\b/", $introText)) {
								$introText = str_replace("save job, email, more...", "", $introText);
								$fullText = str_replace("save job, email, more...", "", $fullText);
							} else {
								$introText = str_replace("save job, email, more...", "", $introText);
								$fullText = str_replace("save job, email, more...", "", $fullText);
							} 				
						}

						// remove image
						if ($row_feed->imgremove==1) {
							$introText = preg_replace('/<img src=\"(.*?)\">(.*?)<\/img>/', "\\2", $introText);  
							$fullText = preg_replace('/<img src=\"(.*?)\">(.*?)<\/img>/', "\\2", $fullText);
						}
								
						// remove text
						foreach (split(",",$row_feed->removetext) as $removetext) {
						
							//valid date if exist
							if ($removetext != "") {
								$introText = str_replace($removetext, "", $introText);
								$fullText = str_replace($removetext, "", $fullText);
								$title = str_replace($removetext, "", $title);
							}
						}
								
						// append text to title
						$title .= $row_feed->texttitle;					
												
						// Check for request forgeries
						JRequest::checkToken() or die( 'Invalid Token' );

						jimport('joomla.utilities.date');

						// Initialize variables
						$row = &JTable::getInstance('JsResRecord', 'Table');
						$config =& JFactory::getConfig();
						$tzoffset = $config->getValue('config.offset');
						$tmpdate=new JDate($row->ctime,$tzoffset);

						$row->checkout($user->get('id'));	//checkit out by me.
						if ($row_feed->createddate==1) {
							$date_cr=strtotime($date);
							if ($date_cr===-1) {
								$created=$tmpdate->toMySQL();
							} else {
								$created=$date;
							}
						} else {
							$created=$tmpdate->toMySQL();
						}

						$row->published = 1;	
						$row->access=$row_feed->acgroup;
						$row->params = "tmpl_article=
							item_edit=
							item_title=
							item_link=
							item_intro=
							item_hits=
							item_ctime=
							item_mtime=
							item_time_format=
							item_navigation=
							item_readon=
							item_readon_label=
							item_icons=
							item_button=
							item_pdf=
							item_print=
							item_send=
							rating=
							tmpl_rating=
							rating_access=
							rate_alert=
							rate_email_alert=
							new_days=
							favorite=
							item_tag=
							item_itemid=
							comments=
							comment_id=
							tmpl_comment=
							comments_lang_mode=
							comments_access=
							comments_access_view=
							comments_sort=
							comments_alert=
							author_alert=
							user_alert=
							email_alert=
							comments_author=
							comments_avatar=
							comments_avatar_link=
							comments_author_itemid=
							comments_approve=
							comment_captcha=
							comment_time_format=";
						$row->checked_out = 0;
						$row->checked_out_time = "0000-00-00 00:00:00";	
						$row->ctime = $created;
						$row->extime = $created;
						$row->type_id = $row_feed->sectionid;
						$row->hits = 0;
						$row->ordering = 0;
						$row->featured = 0;
						$row->archive = 0;
						$row->ucatid = 0;
						$row->langs = "en-GB";
						$row->client = "resource";
						$row->client_id = 0;
								 
								 //Set the unpublish time
						if ($row_feed->autounpublish==1) {
							$publish_down 	=  time() + $row_feed->validfor;
							$date = new JDate($publish_down, $tzoffset);
							$row->extime = $date->toMySQL();
						} else {
							$row->extime = $nullDate;
						}
									  
						//set the start publishing time.
						$publish_up = ($row_feed->delay>0) ?  time() + $row_feed->delay * 60 : time();
//						$publish_up = date("Y-m-d");
						$dateup = new JDate($publish_up, $tzoffset);
						$row->mtime = $dateup->toMySQL();

						$row->user_id = $row_feed->posterid;

						$row->meta_descr = $title;
								   
						$row->alias = JRoute::_(html_entity_decode($title));
						$row->title = JRoute::_(html_entity_decode($title),true); // SEO aware
						if (strlen(trim($row->title))<=0) {
							$row->title=$row_feed->title." - ".Date("Y-m-d H:i:s");
						}
								
						// parmeterize this so for each feed you have parameters   
						$row->meta_key = $row_feed->tags;
									   
						if (!$row->check()) {
							JError::raiseError( 500, $db->stderr() );
							return false;
						}

						// Store the content to the database
						if (!$row->store()) {
							JError::raiseError( 501, $db->stderr() );
							return false;
						}
							
						$lastId = $row->id;

						// Check the article and update item order
						$row->checkin();
						$row->reorder('type_id = '.(int) $row->type_id.'');

						// add record to record_category table
						$rescat = &JTable::getInstance('JsResRecordCategory', 'Table');
						   
						$rescat->catid = $row_feed->catid;
						$rescat->record_id = $lastId;
								
						if (!$rescat->check()) {
							JError::raiseError( 500, $db->stderr() );
							return false;
						}

						// Store the content to the database
						if (!$rescat->store()) {
							JError::raiseError( 501, $db->stderr() );
							return false;
						}

						// Get fields
						$query="Select id, type, title, params FROM #__js_res_fields WHERE type_id=$row_feed->sectionid";
						$db->setQuery($query);
						$group_list = $db->loadObjectList();

						foreach ($group_list as $lrow) {

							// do some selection based of field type
							$resvalue = &JTable::getInstance('JsResRecordValue', 'Table');

							// set last record
							$resvalue->record_id=$lastId;
									
							if(preg_match("/url/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value=$link;
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;

							}  elseif(preg_match("/textarea/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value=$introText;
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;

							}  elseif(preg_match("/html/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value=$introText;
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;

							} elseif(preg_match("/address/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value='';
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;
									   
							} elseif(preg_match("/social_bookmarks/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value="y";
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;
										 
							}  elseif(preg_match("/checkbox/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value='';
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;
									   
							}  elseif(preg_match("/mail/", $lrow->type)) {
							   $resvalue->field_id=$lrow->id;
							   $resvalue->field_value=0;
							   $resvalue->record_id=$lastId;
							   $resvalue->params=null;
							}			
									
								// write record to record value
								if($resvalue->field_value != '') {
									
								if (!$resvalue->check()) {
									JError::raiseError( 500, $db->stderr() );
									return false;
								}

								// Store the content to the database
								if (!$resvalue->store()) {
									JError::raiseError( 501, $db->stderr() );
									return false;
								}
							}
						}

						// add tags
						foreach (split(",",$row_feed->tags) as $tag) {
								
							//valid date if exist
							if ($tag != "") {
										
								$lastTagsId = checkduptags($tag);

								if($lastTagsId == '') {

								// add record to record_category table
									$restags = &JTable::getInstance('JsResTags', 'Table');

									$restags->tag = $tag;
											
									// create current date if blank
									if($date == '0000-00-00 00:00:00') {
										$publish_down 	=  time();
										$date = new JDate($publish_down, $tzoffset);
									}

									$restags->ctime = $date->toMySQL();
												
									if (!$restags->check()) {
										JError::raiseError( 500, $db->stderr() );
										return false;
									}

									// Store the content to the database
									if (!$restags->store()) {
										JError::raiseError( 501, $db->stderr() );
										return false;
									}
											
									$lastTagsId = $restags->id;
											
								}
								//add tag_history
											
								$restags_history = &JTable::getInstance('JsResTagsHistory', 'Table');
								   
								$restags_history->record_id = $lastId;
								$restags_history->tag_id=$lastTagsId;
								$restags_history->user_id=$row_feed->posterid;
								$restags_history->ctime=$date->toMySQL();
								$restags_history->section_id=2;

								if (!$restags_history->check()) {
									JError::raiseError( 500, $db->stderr() );
									return false;
								}

								// Store the content to the database
								if (!$restags_history->store()) {
									JError::raiseError( 501, $db->stderr() );
									return false;
								}
							}
						}

						if ($tbeartimesheetConfig['microsoft.server'] == 0) {  // if not microsoft server assume linux and check load	
							$load = sys_getloadavg();
							if ($load[0] > $tbeartimesheetConfig['server.maxload']) {
								sleep($tbeartimesheetConfig['sleep.time']);
							}	
							//echo "Busy server - sleep $sleep seconds<br>";
						}
							
						// here call Twitter to update listing
						if ($row_feed->twitter == 1) {
						// check how many tweets/feed, 0=unlimted 
							if($tweets == 0 || $tweetcount > 0) {					
								$results=twitter($row_feed->catid,$lastId,$row_feed->username,$row_feed->password, $title, $row_feed->twittertext);
							}
							$tweetcount--;
						}
					} //end foreach
					$mainframe->redirect('index.php?option=com_tbeartimesheet&task=listfeeds',"Items saved");
				} else {
					$mainframe->redirect('index.php?option=com_tbeartimesheet&task=listfeeds',"No Items saved");
				}
			}
		} // end function
	}
	

	function checkpage() {
		$cid=JRequest::getVar('cid',array(0),'request','array');
		if(is_array($cid)) $cid=intval($cid[0]);
		
		$newPage = tbeartimesheetHelper::checkPage($cid,$cid);
		$newPage->DatePageCrawled = time();
		$newPage->store();
	
		$this->setRedirect( 'index.php?option=com_tbeartimesheet&task=editfeeds&cid='.$cid);
	}
}