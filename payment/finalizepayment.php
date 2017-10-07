<?php

$payment_id = $_REQUEST["payment_id"];
$payment_request_id = $_REQUEST["payment_request_id"];

$X_apikey = "c920e477e1b2c79993bc80a1db09eb3c";
$X_authtoken = "170f25bdc8c03e884ab3a2b6e82e0cd2";

// we got a payment redirected
if($payment_request_id!="" && $payment_id!="") {
    $orderstatus="pending";
    // getting the status of the payment
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.instamojo.com/api/1.1/payment-requests/'.$payment_request_id.'/'.$payment_id.'/');
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER,
        array("X-Api-Key:".$X_apikey,
            "X-Auth-Token:".$X_authtoken));
    $response = curl_exec($ch);
    curl_close($ch);
    $responseData = json_decode($response, TRUE);
    if($responseData["success"]==true) {
        $payment_request = $responseData["payment_request"];
        $status = $payment_request["status"];
        $payment = $payment_request["payment"];
        $paymentstatus = $payment["status"];

        if($status=="Completed" && $paymentstatus=="Credit") {
            $orderstatus="confirmed";
        }
    }
    // update the order status
    updateOrderStatus($orderid, $orderstatus);
    redirectUser();
} else {
    
}

?>