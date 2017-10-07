<?php
// die("ok");
require_once '../mobiledetect.php';
$detect = new Mobile_Detect;
$httpsuffix="http://";

$mobile=0;
$name='';
$email='';
$address='';
$nop=0;
$status='';
$orderid='';
$amount='';
$paymentrequest = [];
$paymentlink = "";
$status_url = "https://www.goparties.com/close";
$error_url = "https://www.goparties.com/close";
$order_url = "https://www.goparties.com/order/";

// logic started

// ini_set('display_errors','1');
$url=parse_url($_SERVER['REQUEST_URI']);
$path=$url['path'];
$redirect_url = $httpsuffix.$_SERVER["HTTP_HOST"].$path;
// die($redirect_url);

$path=explode("/",$path);
$orderid=$path[count($path)-1];
if($orderid=="")
$orderid=$path[count($path)-2];
// die($orderid);

$payment_request_id = $_REQUEST["payment_request_id"];
$payment_id = $_REQUEST["payment_id"];


// if order id is there
if($orderid!="") {
    $authorization = 'public';
    // Setup cURL
    $ch = curl_init('https://api.goparties.com/order/'.$orderid);
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
            $to = $data["to"];
            if($data["byweb"]!=true) {
              // changing the order url if it is from the application/mobile devices
              $order_url = $status_url;
            }
            // the booking made from the web application, so append the orderid into the url
            else {
              $order_url = $order_url.$orderid;
            }
            $mobile = $user["phone"];
            if($mobile=="") {
            	$mobile="9711971244";
            }
            $email = $user["email"];
            if($email=="") {
            	$email="webmaster@goparties.com";
            }
            $name = $user["name"];
            if($name=="") {
            	$name="Tarun";
            }
            $address = $user["address"];
            if($address=="") {
            	$address="Gurgaon";
            }
            $nop = $data["nop"];
            $orderid = $data["orderid"];
            $amount = $data["amount"];
//////////////////////////////////////////////////////////////////////////////////////////////////////

			// if we have got a redirect to validate the payment
			if($payment_request_id!=""&&$payment_id!="") {

				$orderstatus="cancelled";
				// getting the status of the payment
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, 'https://www.instamojo.com/api/1.1/payment-requests/'.$payment_request_id.'/'.$payment_id.'/');
				curl_setopt($ch, CURLOPT_HEADER, FALSE);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
				curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
				curl_setopt($ch, CURLOPT_HTTPHEADER,
			            array("X-Api-Key:c920e477e1b2c79993bc80a1db09eb3c",
			                  "X-Auth-Token:170f25bdc8c03e884ab3a2b6e82e0cd2"));
				$response = curl_exec($ch);
				curl_close($ch);
				$responseData = json_decode($response, TRUE);
				// echo $responseData;
				if($responseData["success"]==true) {
					$payment_request = $responseData["payment_request"];
					$status = $payment_request["status"];
					// echo $status;
					$payment = $payment_request["payment"];
					$paymentstatus = $payment["status"];
					// echo $paymentstatus;

					if($status=="Completed"&&$paymentstatus=="Credit") {
						$orderstatus="confirmed";
					}
				} else {
					$orderstatus="cancelled";
				}
				// updating the status
				$authorization = 'public';
			    // The data to send to the API
			    $postData = array(
			        'status' => $orderstatus,
			        'id' => $orderid
			    );

				$ch = curl_init('https://api.goparties.com/updateorderstatus');
			    curl_setopt_array($ch, array(
			        CURLOPT_POST => TRUE,
			        CURLOPT_RETURNTRANSFER => TRUE,
			        CURLOPT_HTTPHEADER => array(
			            'Authorization: '.$authorization,
			            'Content-Type: application/json'
			        ),
			        CURLOPT_POSTFIELDS => json_encode($postData)
			    ));

			    // Send the request

			    $response = curl_exec($ch);
			    if($orderstatus=="confirmed") {
					// creating the transaction
					$factor = 5;
					$value = $amount - ($amount*factor/100) - $factor;
				    $postData = array(
				        'status' => $orderstatus,
				        '_key' => $orderid,
				        'amount' => $amount,
				        'value' => $value,
				        'factor' => $factor,
				        'mode' => 'online',
				        'transcationid' => $orderid,
				        'payment_request_id' => $payment_request_id,
				        'payment_id' => $payment_id,
				        'name' => $name,
				        'towards' => $to["title"],
				        'type' => 1,
				        'user' => 37988,
				    );

					$ch = curl_init('https://api.goparties.com/transaction');
				    curl_setopt_array($ch, array(
				        CURLOPT_POST => TRUE,
				        CURLOPT_RETURNTRANSFER => TRUE,
				        CURLOPT_HTTPHEADER => array(
				            'Authorization: '.$authorization,
				            'Content-Type: application/json'
				        ),
				        CURLOPT_POSTFIELDS => json_encode($postData)
				    ));

				    // Send the request
				    $response = curl_exec($ch);
				}

		    // redirecting the user
				header("Location: ".$order_url);
				exit();
			}

//////////////////////////////////////////////////////////////////////////////////////////////////////
            // if already paid or it's not online mode
            if($data["status"]=='confirmed' || $data["mode"]!="online") {
                header("Location: ".$order_url);
                exit();
            }

//////////////////////////////////////////////////////////////////////////////////////////////////////
            // create payment request

            $ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, 'https://www.instamojo.com/api/1.1/payment-requests/');
			curl_setopt($ch, CURLOPT_HEADER, FALSE);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
			curl_setopt($ch, CURLOPT_HTTPHEADER,
			            array("X-Api-Key:c920e477e1b2c79993bc80a1db09eb3c",
			                  "X-Auth-Token:170f25bdc8c03e884ab3a2b6e82e0cd2"));
			$payload = Array(
			    'purpose' => 'Book tickets',
			    'amount' => $amount,
			    'phone' => $mobile,
			    'buyer_name' => $name,
			    'redirect_url' => $redirect_url,
			    'send_email' => false,
			    'webhook' => 'https://api.goparties.com/webhook/',
			    'send_sms' => false,
			    'email' => $email,
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
				// print_r($responseData);
				// die("1 ".$orderid);
				header("Location: ".$error_url);
			}
        }
    }
    // response was not good
    else {
		// die("2 ".$orderid);
		header("Location: ".$error_url);
    }
} else {
	// die("3 ".$orderid);
	header("Location: ".$error_url);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="./../css/main.css">
</head>
<body>

    <!-- <embed class="embed-item" style="background-color:#eee;" width="400" src="https://www.google.com"> -->
    <!-- <embed src="https://www.instamojo.com/@goparties/1ee916e73b7b4a7b818066a54aab7d90?embed=form"> -->
	<div class="iframe">
	    <embed src="<?php echo $paymentlink;?>?embed=form" frameborder="0"></embed>
	</div>
<!--
	<header class="page-header">
		<img class="gp-logo" src="https://goparties.com/images/ticket-header-logo.png">
	</header>
-->
	<footer class="page-footer">
		You Pay INR <?php echo $amount; ?>
	</footer>

    <!-- Javascript
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
     <script>
	     $(document).ready(function() {
     		$(window).on('resize', function(){
     			var window_height = $(window).height();
     			var page_header_height = $('.page-header').innerHeight();
	     		$('.iframe').css({'height': (window_height - page_header_height) });
			 	console.log(window_height - page_header_height);
			 }).trigger('resize');
	     });
     </script>-->
</body>
</html>
