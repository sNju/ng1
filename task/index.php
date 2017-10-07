<!DOCTYPE html>
<html>
<?php 
include "index.helper.php";
?>
<head>
  <title>Welcome to GoParties</title>


  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="style">
  <link rel="stylesheet" href="/task/css/task.css">

</head>

<body id="intetIssue">
<div class="responsiveRow">

  <div class="taskbox">	

    <!--Start Cross Sign-->
    <?php 
    if($status==true) {
      ?>
      <div class="icon icon--order-success svg col-xs-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
          <g fill="none" stroke="#8EC343" stroke-width="2">
            <circle cx="36" cy="36" r="35" style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px;"></circle>
            <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;"></path>
          </g>
        </svg>
      </div>
      <?php
    } else {
      ?>
      <svg class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="crossmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />
      </svg>
      <?php
    }
    ?>
    <!--End Cross Sign-->
    <h2 class="task-title"><?php echo $title;?></h2>
    <p class="task-type"><?php echo $message?></p>
    <a href="/" class="btn-task">Go To Home Page</a>
  </div>

</div>


</body>
</html>