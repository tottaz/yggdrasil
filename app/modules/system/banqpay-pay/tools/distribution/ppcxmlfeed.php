<?php

// ----- Config ----------------------------------------------------------------

$ppc_format      = '<a class="menu" href="%%url%%">%%title%%</a><br />%%descr%%<br />';
$ppc_multipliers = Array("free" => 1.3, "nonprofit" => 1.3, "$" => 0.8);

// ----- XML API ---------------------------------------------------------------

// ----- Enclose -----

function ppc_xml_enclose($start, $end1, $end2)
{
  return "$start((?:[^$end1]|$end1(?!$end2))*)$end1$end2";
}

function ppc_xml_parse($xml_str)
{
  $pstring1 = "'[^']*'";
  $pstring2 = '"[^"]*"';
  $pnstring = "[^'\"\\/>]";
  $pintag   = "(?:$pstring1|$pstring2|$pnstring)*";
  $node1    = ppc_xml_enclose("<(\\w+)($pintag)>", "<", "\\/\\1>");
  $node2    = "<(\\w+)($pintag)\\/>()";

  $xml_str = preg_split("/$node1|$node2/iX", $xml_str, -1, PREG_SPLIT_DELIM_CAPTURE);

  $xml_doc = Array();

  for ($i = 0; $i < count($xml_str); $i += 4)
  {
    if (trim($xml_str[$i])) $xml_doc[] = trim($xml_str[$i]);

    if (isset($xml_str[$i+1]))
    {
      if (!$xml_str[$i+1]) $i += 3;

      $pstring1 = "(?:'(?:[^'\\\\]|\\\\(?:')|\\\\')*')";
      $pstring2 = '(?:"(?:[^"\\\\]|\\\\(?:")|\\\\")*")';
      preg_match_all("/(\w+)=($pstring1|$pstring2)/iX", $xml_str[$i+2], $matches);

      $attrs = Array();
      foreach ($matches[0] as $j => $x)
        $attrs[strtolower($matches[1][$j])] = substr($matches[2][$j], 1, -1);

      $xml_doc[] = Array("name" => strtolower($xml_str[$i+1]),
                         "attr" => $attrs,
                         "data" => ppc_xml_parse($xml_str[$i+3]));
    }
  }

  return $xml_doc;
}

// ----- GetChildByName -----

function ppc_xml_getChildByName($xml_doc, $name, $n = 0)
{
  for ($i = 0; $i < count($xml_doc); $i++)
    if (is_array($xml_doc[$i]) && $xml_doc[$i]["name"] == $name)
      if ($n) $n--; else return $xml_doc[$i]["data"];
  return false;
}

// ----- AllFeeds -----

function ppc_xml_allFeeds($xml_str)
{
  $result = Array();

  $xml_doc = ppc_xml_parse($xml_str);
  $xml_doc = ppc_xml_GetChildByName($xml_doc, 'result');
  if (!$xml_doc) return $result;

  for ($i = 0; $i < count($xml_doc); $i++)
    if (is_array($xml_doc[$i]) && $xml_doc[$i]["name"] == 'record')
    {
      $title  = ppc_xml_GetChildByName($xml_doc[$i]["data"], 'title');
      $domain = ppc_xml_GetChildByName($xml_doc[$i]["data"], 'url');
      $url    = ppc_xml_GetChildByName($xml_doc[$i]["data"], 'clickurl');
      $descr  = ppc_xml_GetChildByName($xml_doc[$i]["data"], 'desc');
      $bid    = ppc_xml_GetChildByName($xml_doc[$i]["data"], 'bid');
      if (!$title || !$domain || !$url || !$descr || !$bid) continue;

      $result[] = Array('title'  => $title [0],
                        'domain' => preg_replace("/^\w+:\\/\\//", "", $domain[0]),
                        'url'    => $url   [0],
                        'descr'  => $descr [0],
                        'bid'    => $bid   [0]);
    }

  return $result;
}

// ----- RevenuePilot -----

function ppc_xml_revenuePilot($xml_str)
{
  $result = Array();
  $xml_doc = ppc_xml_parse($xml_str);
  $xml_doc = ppc_xml_GetChildByName($xml_doc, 'results');
  if (!$xml_doc) return $result;

  for ($i = 0; $i < count($xml_doc); $i++)
    if (is_array($xml_doc[$i]) && $xml_doc[$i]["name"] == 'listing')
      $result[] = Array('title'  => $xml_doc[$i]["attr"]["title"],
                        'domain' => $xml_doc[$i]["attr"]["domain"],
                        'url'    => $xml_doc[$i]["attr"]["link"],
                        'descr'  => $xml_doc[$i]["attr"]["description"],
                        'bid'    => $xml_doc[$i]["attr"]["bid"]);

  return $result;
}


// ----- Ads API ---------------------------------------------------------------

// ----- AllFeeds -----

function ppc_allFeeds($uid, $sid, $terms, $count = 1)
{
  $allFeeds = "http://xml.allfeeds.com/?aff_id=$uid&sid=$sid" .
              "&keyword=" . urlencode($terms) .
              "&ip_addr=" . $_SERVER['REMOTE_ADDR'] .
              "&limit=$count&no_cdata=true";

  $error_reporting = error_reporting(E_ERROR | E_PARSE);
  $xml = file_get_contents($allFeeds);
  error_reporting($error_reporting);

  return $xml ? ppc_xml_allFeeds($xml) : Array();
}

// ----- RevenuePilot -----

function ppc_revenuePilot($id, $terms, $count = 1)
{
  $revenuePilot = "http://search.revenuepilot.com/servlet/search?mode=xml" .
                  "&id=$id&tid=0&perpage=$count&filter=on&skip=0&related=off" .
                  "&ip=" . $_SERVER['REMOTE_ADDR'] .
                  "&keyword=" . urlencode($terms);

  $error_reporting = error_reporting(E_ERROR | E_PARSE);
  $xml = file_get_contents($revenuePilot);
  error_reporting($error_reporting);

  return $xml ? ppc_xml_revenuePilot($xml) : Array();
}

// ----- Sort -----

function ppc_sort_aux($x, $y) { return $x['bid'] < $y['bid']; }

function ppc_sort(&$data, $multipliers)
{
  foreach ($data as $i => $d)
    foreach ($multipliers as $j => $m)
    {
      $count = preg_match_all("/" . preg_quote($j) . "/i", $d['title'] . $d['descr'], $matches);
      for ($k = 0; $k < $count; $k++) $data[$i]['bid'] *= $m;
    }

  usort($data, "ppc_sort_aux");
}

// ----- Format -----

function ppc_format($adsList, $format, $min_count = 1, $max_count = 5, $min_bid = 0, $js = true)
{
  $result = "";

  for ($i = 0; $i < count($adsList); $i++)
  {
    if ($i >= $min_count && $adsList[$i]['bid'] < $min_bid) break;
    if ($i >= $max_count) break;

    $trans = Array("%%title%%"  => $adsList[$i]['title'],
                   "%%domain%%" => $adsList[$i]['domain'],
                   "%%url%%"    => $adsList[$i]['url'],
                   "%%descr%%"  => $adsList[$i]['descr'],
                   "%%bid%%"    => $adsList[$i]['bid']);
    $result .= strtr($format, $trans);
  }

  if (!$js) return $result;

  $trans  = Array("'" => "\\'", "\r" => "\\r", "\n" => "");

  $result = str_split($result, 16);
  for ($i = 0; $i < count($result); $i++)
    $result[$i] = strtr($result[$i], $trans);
  $result = "'" . implode("'+'", $result) . "'";
  $result = '<script type="text/javascript">document.write(' . $result . ');</script>';

  return $result;
}

?>
