<?php
global $order_detail;
global $orderid;
global $paymentlink;
global $payment_redirect_url;

$X_apikey = "c920e477e1b2c79993bc80a1db09eb3c";
$X_authtoken = "170f25bdc8c03e884ab3a2b6e82e0cd2";


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.instamojo.com/api/1.1/payment-requests/');
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER,
        array("X-Api-Key:".$X_apikey,
            "X-Auth-Token:".$X_authtoken));
    $payload = Array(
        'purpose' => 'Book tickets',
        'amount' => $order_detail["amount"],
        'phone' => $order_detail["from"]["mobile"],
        'buyer_name' => $order_detail["from"]["name"],
        'redirect_url' => $payment_redirect_url,
        'send_email' => false,
        'webhook' => 'https://api.goparties.com/webhook/',
        'send_sms' => false,
        'email' => $order_detail["from"]["email"],
        'allow_repeated_payments' => false
    );
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
    $response = curl_exec($ch);
    curl_close($ch);
    $responseData = json_decode($response, TRUE);

    // check if it was successful
    if($responseData["success"]==true) {
        $paymentrequest = $responseData["payment_request"];
        $paymentlink = $paymentrequest["longurl"];
    }
    // request was not successful
    else {
        redirectToError();
    }
?>