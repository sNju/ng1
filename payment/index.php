<?php
// the order detail contains the entire detail of the edge, from and to
// we can retrieve the information of the user who did the booking
// the info of the party/partyspot which has been booked

$order_detail= [];
$orderid = "";
$status = "";
// redirect url for the payment gateway
$payment_redirect_url = "";
// the payment link to be used in the iframe
$payment_link = "";
// the url to which the user will be redirected in case of the process being completed
// irrespective of failure or success...which will handled by the status_message in the order object
$redirect_url = $httpsuffix.$host."/order/".$orderid;

$error_url = $httpsuffix.$host."/close.html";

$api_baseurl = "";

$isProduction = false;

function redirect($url) {
    header("Location: ".$url);
    exit();
}

function redirectUser() {
    global $redirect_url;
    redirect($redirect_url);
}

function redirectToError() {
    global $error_url;
    redirect($error_url);
}

function getCurlRequest($url, $header) {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_HTTPHEADER => $header,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT_MS=>1000,
        CURLOPT_VERBOSE => 1
    ));
    $out = curl_exec($ch);
    curl_close($ch);
    $response = json_decode($out, true);
    return $response;
}

function updateOrderStatus($orderid, $status){
    global $api_baseurl;
    $postData = array(
        'status' => $status,
        'id' => $orderid
    );
    $ch = curl_init($api_baseurl."/updateorderstatus");
    curl_setopt_array($ch, array(
        CURLOPT_POST => TRUE,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HTTPHEADER => array(
            'Authorization: '."public",
            'Content-Type: application/json'
        ),
        CURLOPT_POSTFIELDS => json_encode($postData)
    ));
    // Send the request
    $response = curl_exec($ch);
    return $response;
}

require 'configure.php';
// if we are here, we either need to process a payment or do a payment
require 'finalizepayment.php';
// if we are here, we need to initiate a payment
require 'initializepayment.php';

require 'payment_design.php';
?>