<?php
// Your ID and token
$mobile=0;
$name='';
$email='';
$address='';
$nop=0;
$status='';
$orderid='';
$amount='';
$redirect_url = "https://api.goparties.com/close";

// if order id is there
if(isset($_REQUEST['o'])) {
    $authorization = 'public';
    // Setup cURL
    $ch = curl_init('https://api.goparties.com/order/'.$_REQUEST['o']);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HTTPHEADER => array(
            'Authorization: '.$authorization
        )
    ));

    // Send the request
    $response = curl_exec($ch);
    // Check for errors
    if($response == TRUE) {
        // Decode the response
        $responseData = json_decode($response, TRUE);
        // print_r($responseData);

        if(isset($responseData["data"])); {
            $data = $responseData["data"]["order"];
            $status = $data["status"];
            $user = $data["from"];
            // echo "ok";
            // print_r($data);
            // echo "ok";
            // print_r($status);
            // echo "ok";
            // print_r($user);
            // echo "ok";
            // die();
            $mobile = $user["phone"];
            $name = $user["name"];
            $email = $user["email"];
            $address = $user["address"];
            $nop = $data["nop"];
            $orderid = $data["orderid"];
            $amount = $data["amount"];

            if($status=='confirmed') {
                header("Location: ".$redirect_url);
                exit();
            } else {
                $url = "http://goparties.com/payment/payment.php?tid=".time()."&order_id=".$orderid."&amount=".$amount."&billing_name=".$name."&billing_address=".$address."&billing_city=Delhi%20NCR&billing_state=Delhi&billing_zip=110030&billing_country=India&billing_tel=".$mobile."&billing_email=".$email."";
                // echo $url;
                header("Location: ".$url);
                exit();
            }
        }
    } else {
        print_r($responseData);
    }
} 
// header("Location: ".$redirect_url);
exit();
?>