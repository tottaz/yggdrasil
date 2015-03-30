<?php
/**
 * @package tests
 * @subpackage others
 * @author VxR <vxr@vxr.it>
 * @version $Revision: 1.1 $
 * @since 0.6
 */

echo chunk_split(serialize(LoggerManager::getLoggerRepository()));
 
?>