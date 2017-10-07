<?php

global $order_detail;
global $orderid;
global $isProduction;
global $httpsuffix;
global $host ;
$host= $_SERVER["HTTP_HOST"];
$httpsuffix= $_SERVER["REQUEST_SCHEME"];

function getOrderDetail($orderid) {
    global $api_baseurl;
    $url = $api_baseurl."/order/".$orderid;
    $order_detail = getCurlRequest($url, array('Authorization: public'));
    return $order_detail;
}

if(strpos($_SERVER['SERVER_NAME'], 'www.goparties.com') !== false) {
    $isProduction = true;
} else {
    $isProduction = false;
}

// set apibaseurl
if($isProduction||true) {
    $api_baseurl = "https://api.goparties.com";
} else {
    $api_baseurl = "http://testing.goparties.com";
}

$path = parse_url($_SERVER['REQUEST_URI']);
parse_str($path['query'], $_REQUEST);
$path = $path['path'];

global $payment_redirect_url;
$payment_redirect_url = $httpsuffix."://".$_SERVER["HTTP_HOST"].$path;
// checking the order id
if(substr($path,strlen($path)-1,1)=='/'){
    $path=substr($path,0,strlen($path)-1);
}
$path=explode("/",$path);
$orderid=$path[count($path)-1];

// orderid is not there
if($orderid=="") {
    redirectToError();
}

// getting the order details
$order_detail = getOrderDetail($orderid);
if(isset($order_detail["data"])) {
    $order_detail = $order_detail["data"]["order"];
} else {
    redirectToError();
}

// set redirect_url
if($order_detail["byweb"]) {
// as per the "byweb"
    $redirect_url = $httpsuffix."://".$host."/order/".$orderid;
} else {
    $redirect_url = $httpsuffix."://".$host."/close.html";
}

if($order_detail["status"]!="pending" || $order_detail["mode"]!="online") {
    redirectUser();
}
// filling the order information
$order_detail["amount"] = $isProduction==true?$order_detail["amount"]:10;
$order_detail["from"]["mobile"] = $order_detail["from"]["mobile"]==""?"9711971244":$order_detail["from"]["mobile"];
$order_detail["from"]["name"] = $order_detail["from"]["name"]==""?"Tarun":$order_detail["from"]["name"];
$order_detail["from"]["email"] = $order_detail["from"]["email"]==""?"webmaster@goparties.com":$order_detail["from"]["email"];
$order_detail["from"]["address"] = $order_detail["from"]["address"]==""?"Gurugram":$order_detail["from"]["address"];


?>