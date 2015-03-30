<?php 

if (!file_exists(FCPATH.'uploads/dompdf/')) {mkdir(FCPATH.'uploads/dompdf/');}

define("DOMPDF_FONT_CACHE", FCPATH.'uploads/dompdf/');
define("DOMPDF_ENABLE_REMOTE", true);
define("DOMPDF_LOG_OUTPUT_FILE", FCPATH."uploads/dompdf/log.htm");