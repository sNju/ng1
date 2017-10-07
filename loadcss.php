<?php
header("Content-type: text/css; charset: UTF-8");
$expires = 2678400; // 1 month in seconds
header("Pragma: public");
header("Cache-Control: maxage=".$expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');


$files = $_REQUEST["files"];
$arr= explode(",", $files);
foreach($arr as $key=>$value) {
    include $value;
}

	
?>
