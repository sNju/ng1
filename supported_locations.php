<?php
$locations = array();
$area = array();
$static_loc=array("as"=>"TRIPLE PLAY BROADBAND PRIVATE LIMITED","city"=>"Gurgaon","country"=>"India","countryCode"=>"IN","isp"=>"Gurgaon Consultancy","lat"=>"28.4667","lon"=>"77.0333","org"=>"Triple Play Broadband Private Limited","query"=>"150.129.182.184","region"=>"HR","regionName"=>"Haryana","status"=>"success","timezone"=>"Asia/Kolkata","zip"=>"122001");

function addLocation($city, $lat, $lon) {
    global $locations;
    $geo = array();
    array_push($geo, $lat);
    array_push($geo, $lon);
    $locations[$city] = $geo;
}

addLocation("bengaluru", 12.9716, 77.5946);
addLocation("delhi-ncr", 28.7041, 77.1025);
addLocation("pune", 18.5204, 73.8567);
addLocation("mumbai", 19.0760, 72.8777);
addLocation("hyderabad", 17.3850, 78.4867);
addLocation("chennai", 13.0827, 80.2707);

$area['HR'] = "delhi-ncr";
$area['DL'] = "delhi-ncr";
$area['PB'] = "delhi-ncr";

function setHomePageLink($homepagelink) {
    ?>
    <script>
        if(window.sessionStorage.cityname==undefined||window.sessionStorage.cityname=="") {
            window.sessionStorage.cityname = "<?php echo $homepagelink;?>";
        }
    </script>
    <?php
}

function getUserCurrentLocation() {
    return $static_loc;
    // $userip = $_SERVER['REMOTE_ADDR'];
    // if($userip=="127.0.0.1") {
    //     $userip = "150.129.182.184";
    // }
    // $locationapi = "http://ip-api.com/json/";
    // $locationurl = $locationapi.$userip;
    // $loc = curl_request($locationurl,false,1000);
    // if(isset($loc)&&isset($loc["region"])) {
	// 	return $loc;
    //  } else{
	// 	return $static_loc;
    //  }
}
?>
