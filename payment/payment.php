<html>
<head>
<script type="text/javascript" src="https://goparties.com/libjs/jquery.min.js"></script>
<script>
	window.onload = function() {
		document.getElementById('paymentdata').submit();
	  // var jsonData;
  	//   var access_code="AVDW65DD08CK35WDKC" // shared by CCAVENUE 
	  // var amount="6000.00";
  	//   var currency="INR";
  	  
   //    $.ajax({
   //         url:'https://secure.ccavenue.com/transaction/transaction.do?command=getJsonData&access_code='+access_code+'&currency='+currency+'&amount='+amount,
   //         dataType: 'jsonp',
   //         jsonp: false,
   //         jsonpCallback: 'processData',
   //         success: function (data) { 
   //               jsonData = data;
   //               console.log(JSON.stringify(jsonData));
   //               // processData method for reference
   //               // processData(data); 
   //         },
   //         error: function(xhr, textStatus, errorThrown) {
   //             alert('An error occurred! ' + ( errorThrown ? errorThrown :xhr.status ));
   //             //console.log("Error occured");
   //         }
   // 		});
	};
</script>
</head>
<body>
	<form method="post" name="paymentdata" id="paymentdata" action="initpayment.php" style="display:none;">
		<table width="40%" height="100" border='1' align="center"><caption><font size="4" color="blue"><b>Integration Kit</b></font></caption></table>
			<table width="40%" height="100" border='1' align="center">
				<tr>
					<td>Parameter Name:</td><td>Parameter Value:</td>
				</tr>
				<tr>
					<td colspan="2"> Compulsory information</td>
				</tr>
				<tr>
					<td>TID	:</td><td><input type="text" name="tid" id='tid' value='<?php echo $_REQUEST['tid']; ?>' readonly /></td>
				</tr>
				<tr>
					<td>Merchant Id	:</td><td><input type="text" name="merchant_id" value="97508"/></td>
				</tr>
				<tr>
					<td>Order Id	:</td><td><input type="text" name="order_id" value='<?php echo $_REQUEST['order_id']; ?>' /></td>
				</tr>
				<tr>
					<td>Amount	:</td><td><input type="text" name="amount" value='<?php echo $_REQUEST['amount']; ?>' /></td>
				</tr>
				<tr>
					<td>Currency	:</td><td><input type="text" name="currency" value="INR"/></td>
				</tr>
				<tr>
					<td>Redirect URL	:</td><td><input type="text" name="redirect_url" value="http://goparties.com/payment/verifypayment.php"/></td>
				</tr>
			 	<tr>
			 		<td>Cancel URL	:</td><td><input type="text" name="cancel_url" value="http://goparties.com/payment/verifypayment.php"/></td>
			 	</tr>
			 	<tr>
					<td>Language	:</td><td><input type="text" name="language" value="EN"/></td>
				</tr>
		     	<tr>
		     		<td colspan="2">Billing information(optional):</td>
		     	</tr>
		        <tr>
		        	<td>Billing Name	:</td><td><input type="text" name="billing_name" value='<?php echo $_REQUEST['billing_name']; ?>' /></td>
		        </tr>
		        <tr>
		        	<td>Billing Address	:</td><td><input type="text" name="billing_address" value='<?php echo $_REQUEST['billing_address'] ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing City	:</td><td><input type="text" name="billing_city" value='<?php echo $_REQUEST['billing_city']; ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing State	:</td><td><input type="text" name="billing_state" value='<?php echo $_REQUEST['billing_state']; ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing Zip	:</td><td><input type="text" name="billing_zip" value='<?php echo $_REQUEST['billing_zip']; ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing Country	:</td><td><input type="text" name="billing_country" value='<?php echo $_REQUEST['billing_country']; ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing Tel	:</td><td><input type="text" name="billing_tel" value='<?php echo $_REQUEST['billing_tel']; ?>'/></td>
		        </tr>
		        <tr>
		        	<td>Billing Email	:</td><td><input type="text" name="billing_email" value='<?php echo $_REQUEST['billing_email']; ?>'/></td>
		        </tr>
<!--		        <tr>
		        	<td>Payment Option	:</td><td><input type="text" id="payment_option" name="payment_option" value="OPTNBK" readonly="readonly"/></td>
		        </tr>
		        <tr>
		        	<td>Card Type	:</td><td><input type="text" id="card_type" name="card_type" value="NBK" readonly="readonly"/></td>
		        </tr>
		        <tr>
		        	<td>Card Name	:</td><td><input type="text" id="card_name" name="card_name" value="HDFC Bank" readonly="readonly"/></td>
		        </tr>
		        <tr>
		        	<td>Issuing Bank	:</td><td><input type="text" id="issuing_bank" name="issuing_bank" value="HDFC Bank" readonly="readonly"/></td>
		        </tr>
		        <tr>
		        	<td colspan="2">Shipping information(optional)</td>
		        </tr>
		        <tr>
		        	<td>Shipping Name	:</td><td><input type="text" name="delivery_name" value="Chaplin"/></td>
		        </tr>
		        <tr>
		        	<td>Shipping Address	:</td><td><input type="text" name="delivery_address" value="room no.701 near bus stand"/></td>
		        </tr>
		        <tr>
		        	<td>shipping City	:</td><td><input type="text" name="delivery_city" value="Hyderabad"/></td>
		        </tr>
		        <tr>
		        	<td>shipping State	:</td><td><input type="text" name="delivery_state" value="Andhra"/></td>
		        </tr>
		        <tr>
		        	<td>shipping Zip	:</td><td><input type="text" name="delivery_zip" value="425001"/></td>
		        </tr>
		        <tr>
		        	<td>shipping Country	:</td><td><input type="text" name="delivery_country" value="India"/></td>
		        </tr>
		        <tr>
		        	<td>Shipping Tel	:</td><td><input type="text" name="delivery_tel" value="9876543210"/></td>
		        </tr>
		        <tr>
		        	<td>Merchant Param1	:</td><td><input type="text" name="merchant_param1" value="additional Info."/></td>
		        </tr>
		        <tr>
		        	<td>Merchant Param2	:</td><td><input type="text" name="merchant_param2" value="additional Info."/></td>
		        </tr>
				<tr>
					<td>Merchant Param3	:</td><td><input type="text" name="merchant_param3" value="additional Info."/></td>
				</tr>
				<tr>
					<td>Merchant Param4	:</td><td><input type="text" name="merchant_param4" value="additional Info."/></td>
				</tr>
				<tr>
					<td>Merchant Param5	:</td><td><input type="text" name="merchant_param5" value="additional Info."/></td>
				</tr>
				<tr>
					<td>Promo Code	:</td><td><input type="text" name="promo_code" value=""/></td>
				</tr>
				<tr>
					<td>Vault Info.	:</td><td><input type="text" name="customer_identifier" value=""/></td>
				</tr> -->
		        <tr>
		        	<td></td><td><INPUT TYPE="submit" value="CheckOut"></td>
		        </tr>
	      	</table>
	      </form>
	</body>
</html>


