<?php
	
	$method = $_SERVER['REQUEST_METHOD'];
	//$x = $_REQUEST['x'];$y = $_REQUEST['y'];
	//$x = $_GET['x'];$y = $_GET['y'];
	$x = $_POST['x'];$y = $_POST['y'];
	//$x = 1;$y = 1;
	
	echo '{"id":0,"name":"'.$method.'","x":'.$x.',"y":'.$y.',"marked_id":0}';
?>