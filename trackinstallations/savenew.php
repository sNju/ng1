<?php
// save the cookie
setcookie("gp_url", $_REQUEST["source"], time() + (86400 * 1));
// redirect to app store
header("Location:http://goparties.com/apps");
?>
