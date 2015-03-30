<?php
session_start();
$account_number = $_GET['acnum'];
$_SESSION['account_number'] = $account_number;
?>
<html>
<body bgcolor="#ffffff">
<script language="JavaScript">window.location.href = "main.php?load=customer&type=module";</script>
</body>
</html>
