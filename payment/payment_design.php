<?php
global $order_detail;
global $paymentlink;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="./../css/payment-panel.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900" rel="stylesheet">    
</head>
<body>   
    <div class="container">
        <div class="payment-content">  
            <div class="col-lg-8 col-md-8 content-panel">
                <!--Cover Image-->
                <h4 class="main-title">Booking Details</h4>
                <div class="booking-figure" style="background-image: url('<?php echo $order_detail['to']['banner'];?>');" >
                    <h4 class="payment-party-title"><?php echo $order_detail['to']['title'];?></h4>
                    <div class="ticket-count">
                        <span class="counting"><?php echo $order_detail['nop'];?></span><br><span class="type">Tickets</span>
                    </div>
                </div>
                <!--Booking Content-->
                <p class="details-section">
                    <span class="p-title">Venue:</span>
                    <span class="p-type"><?php echo $order_detail['to']['address'];?></span>
                </p>
                <p class="details-section">
                    <span class="p-title">Date &amp; Time:</span>
                    <span class="p-type">05 May 2017, 10:00 AM</span>
                </p>
                <p class="details-section">
                    <span class="p-title">Booking Id:</span>
                    <span class="p-type"><?php echo $order_detail['orderid'];?></span>
                </p>
                <p class="details-section">
                    <span class="p-title">Ticket Type:</span>
                    <span class="payment-heading price-panel"><span><?php echo $order_detail['segment'];?></span> <img src="https://s3.ap-south-1.amazonaws.com/gpcaweb/images/icon_image/rupee-icon-g.jpg" class="fa-icn"><?php echo $order_detail['price'];?></span>
                </p>
                <p class="details-section">
                    <span class="p-title">User Info:</span>
                    <span class="p-type">
                    <?php
                    if($order_detail['nop_male']>0) {
                        ?>
                        <span><?php echo $order_detail['nop_male'];?> Male</span>
                        <?php
                    }
                    ?>
                    <?php
                    if($order_detail['nop_female']>0 && $order_detail['nop_female']!=0) {
                        ?>
                        <span><?php echo $order_detail['nop_female'];?> Female</span>
                        <?php
                    }
                    ?>
                    <?php
                    if($order_detail['nop_couple']>0) {
                        ?>
                        <span><?php echo $order_detail['nop_couple'];?> Couple</span>
                        <?php
                    }
                    ?>
                    <span><?php echo $order_detail['nop_female'];?> Female</span>
                    <span><?php echo $order_detail['nop_couple'];?> Couple</span>
                    </span>
                </p>
                <hr>
                <div class="p-fotter">
                    <div class="payment-heading">Amount Payable</div>
                    <div class="payment-heading"><img src="https://s3.ap-south-1.amazonaws.com/gpcaweb/images/icon_image/rupee-icon.jpg" class="fa-icn"><?php echo $order_detail['amount'];?></div>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 payment-container">
                <embed src="<?php echo $paymentlink;?>?embed=true" frameborder="0" class="payment-box"></embed>
            </div>           
        </div>
    </div>
</body>
</html>