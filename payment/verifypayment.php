<?php include('Crypto.php')?>
<?php

	$redirect_url = "https://api.goparties.com/close";
	error_reporting(0);
	
	$workingKey='83852E47226BB141304963460B0BDF26';		//Working Key should be provided here.
	$encResponse=$_POST["encResp"];			//This is the response sent by the CCAvenue Server
	$rcvdString=decrypt($encResponse,$workingKey);		//Crypto Decryption used as per the specified working key.
	$order_status="";
	$status="pending";
	$tid="";
	$decryptValues=explode('&', $rcvdString);
	// print_r($decryptValues);
	$dataSize=sizeof($decryptValues);
	echo "<center>";
	$orderid=$decryptedValues["order_id"];
	$tid=$decryptedValues["tracking_id"];
	for($i = 0; $i < $dataSize; $i++) 
	{
		$information=explode('=',$decryptValues[$i]);
		if($information[0]=="order_id")
			$orderid = $information[1];
		if($information[0]=="tracking_id")
			$tid = $information[1];
		if($i==3)	$order_status=$information[1];

	}
// echo $orderid.' '.$tid.' '.$order_status;
	if($order_status==="Success") {
		$status = "confirmed";
	}
	else if($order_status==="Aborted") {
		$status = "cancelled";
	}
	else if($order_status==="Failure") {
		$status = "pending";
	}
	else {
		// echo "<br>Security Error. Illegal access detected";
	}

	$authorization = 'public';
    // The data to send to the API
    $postData = array(
        'status' => $status,
        'id' => $orderid,
        'tid' => $tid
    );

    // Setup cURL
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
    // print_r($response);
	header("Location: ".$redirect_url);
	exit();




	// echo "<br><br>";

	// echo "<table cellspacing=4 cellpadding=4>";
	// for($i = 0; $i < $dataSize; $i++) 
	// {
	// 	$information=explode('=',$decryptValues[$i]);
	//     	echo '<tr><td>'.$information[0].'</td><td>'.$information[1].'</td></tr>';
	// }

	// echo "</table><br>";
	// echo "</center>";
?>
