<?php
$apiBaseUrl="http://staging.goparties.com:1234";
//$apiBaseUrl="http://testing.goparties.com:1723";
//$apiBaseUrl="http://localhost:1234";
$url=($_SERVER['REQUEST_URI']);
$server=$_SERVER['SERVER_NAME'];
if(strpos($server,"www.goparties.com")!==false){
  $apiBaseUrl="https://api.goparties.com";
}

function getrequest($url){
  $ch=curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch,CURLOPT_HEADER,0);
  $output=curl_exec($ch);
  curl_close($ch);
  return $output;
}

function postrequest($url){
  $ch=curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_POST, 1);
  $out=curl_exec($ch);
  curl_close($ch);
  return json_decode($out,true);
}

$output=postrequest($apiBaseUrl.$url);
$status=false;
$title="";
$message="";
if($output["data"]!="undefined"){
  $status=$output["data"]["task"]["status"];
  
}
$title=$output["data"]["task"]["title"];
$message=$output["data"]["task"]["message"];

?>