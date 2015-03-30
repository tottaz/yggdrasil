<?php

include "ppcxmlfeed.php";

$ppc_format = '<a class="menu" href="%%url%%">%%domain%%</a> - %%descr%%<br />';
// %%domain%% - domain of the advertiser
// %%title%%  - ad title
// %%descr%%  - ad description
// %%url%%    - url for href attribute

$ppc_multipliers = Array("free" => 1.3, "nonprofit" => 1.3, "$" => 0.8);
// These multipliers will increase the effective cost of the ads.
// This way you can assist/suppress ads that contain certain words of your choice.

// Note: you can define $ppc_format & $ppc_multipliers once and for all in ppcxmlfeed.php

//$ads = ppc_allFeeds($user_id, $site_id, $keywords, $number_of_results);
$ads = ppc_revenuePilot($user_id, $keywords, $number_of_results);

ppc_sort($ads, $ppc_multipliers);
echo ppc_format($ads, $ppc_format,
                $min_number_of_results,
                $max_number_of_results,
                $min_cpc);

// The script will display at least $min_number_of_results regardless of their cost
// The script will display up to $max_number_of_results with cost > $min_cpc

// Note: $number_of_results should be little higher than $max_number_of_results

?>
