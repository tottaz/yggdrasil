<?php 
if($urls && checkImage())
{
	$urls = str_replace("\r\n","\n",$urls);
	$urls = explode("\n",$urls);

	$results = array();
	foreach($urls as $link)
	{
		$link = preg_match("#\\w+://#",$link) ? $link : "http://".$link;
		$start = microtime(true);
		$content = @file_get_contents($link);
		if($content===FALSE)
		{
			continue;
		}
		$result['domain'] = $link;
		$result['time'] = sprintf("%01.3f",microtime(true)-$start);
		$result['size'] = sprintf("%01.2f", strlen($content) / 1000);
		$result['average'] = sprintf("%01.3f",$result['time'] / $result['size']);

		$results[] = $result;
	}

	if($results)
	{
		echo "<table cellpadding=\"3\" cellspacing=\"3\"><tr bgcolor=\"#E6E6E6\"><td>Size</td><td>Load time (secs)</td><td>Average speed per KB</td></tr>";
		foreach($results as $k=>$r)
		{
			echo "<tr bgcolor=\"#FFEAEA\"><td align=\"center\">$r[size] KB</td><td align=\"center\">$r[time]</td><td align=\"center\">$r[average]</td></tr>";
		}
		echo "</table>";
	}
}
 ?>
						</td>
                         </tr>

                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Title</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['title']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Description</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['description']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Meta Keywords</strong></th>
                           <td style="width: 35px"><?php echo $res['meta_tags']['keywords']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 74px"><strong> Texts</strong></th>
                           <td style="width: 35px"><?php echo $res['text']?></td>
                         </tr>
                         <tr>
                           <th class="spec" style="width: 74px"><strong>No. of 
                             Words </strong></th>
                           <td style="width: 35px"><?php echo $res['no_words']?></td>
                         </tr>
                         <tr>
                           <th class="spec" style="width: 74px"><strong> Distinct Words</strong></th>
                           <td style="width: 35px"><?php echo $res['no_distinct_words']?></td>
                         </tr>
                         <tr>
                           <th valign="top" class="spec" style="width: 92px"><strong> View Source Code</strong></th>
                           <td style="width: 110px"><textarea name="textfield" rows="20" class="input-box-up" onfocus="event.srcElement.className='input-box-down';" onblur="event.srcElement.className='input-box-up';" style="width: 343px"><?php echo htmlentities($res['html']);?></textarea></td>
                         </tr>
                         <tr>
  <td style="width: 35px"><span class="spec" style="width: 74px"><strong>Keyword Density</strong></span></td><td style="width: 35px"><table border="0" cellspacing="1" width="151%">
    <td width = "auto" valign="top"><table border="0" cellspacing="1" width="100%">
      <tr valign="top">
        <td><strong>Word</strong></td>
        <td><strong>Count</strong></td>
        <td><strong>Density</strong></td>
      </tr>
      <?php
										$nr_total=count($res['keywords']['1']);
										$x=1;$i=0;
										foreach($res['keywords']['1'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
      <tr>
        <td><?php echo $k?></td>
        <td><?php echo $t?></td>
        <td><?php printf("%.2f",$density)?></td>
      </tr>
      <?php
											}
											else
											{
												?>
      <tr>
        <td><?php echo $k?></td>
        <td><?php echo $t?></td>
        <td><?php printf("%.2f",$density)?></td>
      </tr>
      <?php
											}
											$i++;
										}
									?>
    </table></td>
            <td valign="top" width = "auto"><table border="0" cellspacing="1" width="100%">
                <tr align="center" valign="top">
                  <td><strong>Words</strong></td>
                  <td><strong>Count</strong></td>
                  <td><strong>Density</strong></td>
                </tr>
                <?php
										$nr_total=count($res['keywords']['2']);
										$x=1;$i=0;
										foreach($res['keywords']['2'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											else
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											$i++;
										}
									?>
                <tr>
                  <td><strong>Multi Words</strong></td>
                  <td><strong>Count</strong></td>
                  <td><strong>Density</strong></td>
                </tr>
                <?php
										$nr_total=count($res['keywords']['3']);
										$x=1;$i=0;
										foreach($res['keywords']['3'] as $k=>$t)
										{
											$density=$t*100/$res['no_words'];
											if($i%2==0)
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											else
											{
												?>
                <tr>
                  <td><?php echo $k?></td>
                  <td><?php echo $t?></td>
                  <td><?php printf("%.2f",$density)?></td>
                </tr>
                <?php
											}
											$i++;
										}
									?>
            </table></td>
    </table></td>
  </tr>
                       </table></td>							
				   </tr>
				   </table>
				 </td>
			   </tr>
</table>