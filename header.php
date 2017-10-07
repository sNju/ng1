<script>
	window.cachedata = new Object();
</script>
<?php
//die(print_r($_SERVER));
//ini_set('display_errors', 1);
require_once 'mobiledetect.php';
require_once 'supported_locations.php';
$content = "Party,Profile,GoParties,PartySpot,Hot Party Spot,Trending,Parties,DJs,Bands,Artists,PartyMon,Deals,Party with Deals,Party Without Deals, Clubs";
$detect = new Mobile_Detect;
$url = parse_url($_SERVER['REQUEST_URI']);
$path = $url['path'];
$redirect = "";
$curldata = [];
$apibaseurl = "https://api.goparties.com";
$module = '';
$checktype=array("/party/","/partyspot/","/artist/","/band/","/dj/","/profile/","/blog/","/blogdetail/","/close","/get","/apps", "/deal/","/work/");

if(strpos($_SERVER['SERVER_NAME'], 'www.goparties.com') !== false) {
	$apibaseurl = "https://api.goparties.com";
} else {
	$apibaseurl = "http://staging.goparties.com:1234";
}

foreach($checktype as $index=>$type){
	global $path;
	if((strpos($path,$type))!==false) {
		$id=get_module_id($type);
		$module=str_replace('/', '', $type);
		break;
	}
}

// if we are yet to find our module, we try to get it from the locations we support
if($module=='') {
	$path = str_replace('/', '', $path);
	foreach($locations as $index=>$type){
		global $path;
		if((strpos($index,$path))!==false) {
			$module=str_replace('/', '', $index);
			break;
		}
	}
}
if($module=='') {
	$module = $path;
}

function get_module_id($type) {
	global $path;
	$len_type=strlen($type);
	$pos=strpos($path,$type);
	$id=substr($path,$pos+$len_type);
	return $id;
}
?>
<script type="text/javascript">
	var test=window.location.href;
	remove_hash(test);
	var flag=false;

	function remove_hash(url) {
		/*Checks if index.html exists in url*/
		if(url.indexOf('index.html')>=0) {
			var first=url.indexOf('index.html');
			/*Replace it with empty chars*/
			url=url.replace('/index.html','');
			/*If thre are futher # repeat*/
			if(url.indexOf('#')>=0) {
				remove_hash(url);
			} else {
				/*Go to modified URL*/
				window.location.href=url;
			}
		}
		/*If there exists # in url*/
		else if(url.indexOf('#')>=0) {
			var pos=(url.indexOf('#'))-1;       /*Find the element before #*/
			if((url.substr(pos,1))!='/') {
				/*For urls of form .com#/ */
				url=url.replace('#','');
				window.location.href=url;
			} else {
				/*For urls of form /#/ */
				url=url.replace('/#','');
				window.location.href=url;
			}
		}
	}
</script>

<?php
function inflate_meta($data) {
	global $content;
	if ($data['description'] == "") {
		$data['description'] = "Download GoParties | Your Party App";
		$data['title'] = $data['title']."\tGoParties - Your Party App";
		$data['url'] = "https://www.goparties.com";
	}
	else
	{
		$data['title']=$data['title']."\tGoParties | Your Party App";
	}

	echo '<title>' . $data['title'] .'</title>';
	/* For facebook metadata*/
	echo '<meta property="og:url" content="' . $data['url'] . '">';
	echo '<meta property="og:type" content="website -GoParties">';
	echo '<meta name="og:keywords" content="' . $content . '">';
	echo '<meta property="og:title" content="' . $data['title'] . '">';
	echo '<meta property="og:description" content="' . $data['description'] . '">';
	echo '<meta property="og:image" content="' . $data['banner'] . '">';
	echo '<meta property="og:image:secure_url" content="' . $data['banner'] . '">';
	/*For twitter metadata*/
	echo '<meta name="twitter:card" content="summary">';
	echo '<meta name="twitter:site" content="@goparties">';
	echo '<meta name="twitter:keywords" content="' . $content . '">';
	echo '<meta name="twitter:url" content="' . $data['url'] . '">';
	echo '<meta name="twitter:title" content="' . $data['title'] . '">';
	echo '<meta name="twitter:description" content="' . $data['description'] . '">';
	echo '<meta name="twitter:image" content="' . $data['banner'] . '">';
	/*For our website metadata*/
	echo '<meta name="website" content="https://www.goparties.com">';
	echo '<meta name="keywords" content="' . $content . '">';
	echo '<meta name="description" content="' . $data['description'] . '">';
	echo '<meta name="image" content="' . $data['banner'] . '">';
	echo '<meta name="secure_url" content="' . $data['banner'] . '">';
	echo '<meta name="card" content="GoParties | Your Party App">';
	echo '<meta name="site" content="www.goparties.com">';
	echo '<meta name="url" content="' . $data['url'] . '">';
	echo '<meta name="title" content="' . $data['title'] . '">';
	echo '<meta name="description" content="' . $data['description'] . '">';
}

function addCahceData($url, $data) {
	return;
	?>
	<script>
		window.cachedata['<?php echo $url;?>'] = <?php echo $data;?>
	</script>
	<?php
}

function curl_request($url, $checkerror,$timeout=2000) {
	global $curldata;
	$ch = curl_init($url);
	curl_setopt_array($ch, array(
		CURLOPT_HTTPHEADER => array(
			'Authorization: public'
			) ,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT_MS=>$timeout,
		CURLOPT_VERBOSE => 1
		));
	$out = curl_exec($ch);
	curl_close($ch);
	$result = json_decode($out, true);
	// saving the result in global $curldata to be used in other php files
	$curldata = $result;
	if(!isset($curldata['data']) && $checkerror) {
		//serverError();
	}
	addCahceData($url, $out);
	
	return $curldata;
}

function serverError() {
	include 'error-server.html';
	die();
}

function redirectTo($redirect, $timeout) {
	?>
	<title>GoParties - Your Party App</title>
	<link rel="shortcut icon" type="image/x-icon" href="./images/favicon.ico">
	<link href="/css/redirect-page.css" rel="stylesheet">
	<script>
		window.setTimeout(function() {
			document.getElementById("redirect").click();
			window.setTimeout(function(){
				document.getElementById("redirect1").click();
			}, <?php echo $timeout + 2000; ?>)
		}, <?php echo $timeout; ?>);

		function resize() {
			var heights = window.innerHeight;
			document.getElementById("setHeight").style.height = heights + "px";
		}
		resize();

		window.onresize = function() {
			resize();
		};
	</script>
</head>
<body ng-controller="iosController">';
	<a id="redirect" href="<?php echo $redirect ?>"></a>
	<a id="redirect1" href="<?php echo $redirect ?>"></a>
	<div class="full-screen-wrapper" id="setHeight">
		<div class="content-panel">
			<img class="gp-logo" src="http://www.goparties.com/images/goparties-logo-big.png">
			<h1 class="logo-txt">GoParties</h1>
			<p class="logo-subline">Your Party App</p>
			<p class="subtext">Redirecting you in few seconds...</p>
		</div>
	</div>
</body>
</html>
<?php
die();
}

$loc = getUserCurrentLocation();
// check for the areas
if(isset($area[$loc['region']])) {
	setHomePageLink($area[$loc['region']]);
}
// set delhi-nrc if user's area not found
else {
	setHomePageLink("delhi-ncr");
}
switch ($module) {
	case 'close':
	include_once ("./close.html");
	exit();
	case 'get':
	case 'apps':
	case 'download':
	case 'dwnld':
	case 'app':
	if ($detect->isAndroidOS()) $redirect = "https://play.google.com/store/apps/details?id=com.goparties.gpuser&hl=en";
	else
		if ($detect->isiOS()) $redirect = "https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1084955093&mt=8";
	else $redirect = "/";
	redirectTo($redirect, 1500);
	break;
	case 'party':
	$url = $apibaseurl."/party?id=" . $id;
	$data = curl_request($url, true);
	$data = $data['data']['detail']['party'];
	$party['url'] = "http://www.goparties.com/party/" . $id;
	// $redirect=$party['url'];
	$party['type'] = "party";
	$party['title'] = $data['title']."-".$data['address'];
	$party['description'] = $data['description'];
	$party['banner'] = $data['banner'];
	inflate_meta($party);
	break;

	case 'deal':
	$url = $apibaseurl."/deal?id=" . $id;
	$data = curl_request($url, true);
	$data = $data['data']['detail']['deal'];
	$deal['url'] = "http://www.goparties.com/deal/" . $id;
	// $redirect=$deal['url'];
	$deal['type'] = "deal";
	$deal['title'] = $data['title'];
	$deal['description'] = $data['title'];
	$deal['banner'] = $data['thumburl'];
	inflate_meta($deal);
	break;

	case 'work':
	$url = $apibaseurl."/work?id=" . $id;
	$data = curl_request($url, true);
	$data = $data['data']['detail']['work'];
	$work['url'] = $data['fileurl'];
	// $redirect=$work['url'];
	$work['type'] = "work";
	$work['title'] = $data['title'];
	$work['description'] = $data['title'];
	$work['banner'] = $data['thumburl'];
	inflate_meta($work);
	break;

	case 'blogdetail':
	case 'blog':
	$url = $apibaseurl."/blogdetail?id=" . $id;
	$data = curl_request($url, true);
	$data = $data['data']['detail']['blog'];
	$blog['url'] = "http://www.goparties.com/blog/" . $id;
	// $redirect=$blog['url'];
	$blog['type'] = "blog";
	$blog['title'] = $data['title'];
	$blog['description'] = $data['description'];
	$blog['banner'] = $data['cover'];
	inflate_meta($blog);
	break;

	case 'profile':
	case 'artist':
	case 'band':
	case 'dj':
	case 'partyspot':
	$url = $apibaseurl."/profile?id=" . $id;
	$data = curl_request($url, true);
	$data = $data['data']['detail']['profile'];
	$profile['url'] = "http://www.goparties.com/profile/" . $id;
	// $redirect=$profile['url'];
	$profile['type'] = "profile";
	
	if($module!='partyspot'){
		$profile['title'] = $data['name']."-".$data['profile_type'];
	}
	else{
		$profile['title'] = $data['name']."-".$data['address'];
	}
	$profile['description'] = $data['description'];
	$profile['banner'] = $data['cover'];
	inflate_meta($profile);
	break;

	default:
	$url = $apibaseurl."/tinytolong?tinyurl=" . $module;
	$data = curl_request($url, false);
	if (isset($data['data']) && isset($data['data']['tinyurl']) && $data['data']['tinyurl']['active'] != false) {
		$redirect = $data['data']['tinyurl']['longurl'];
		redirectTo($redirect, 1500);
	}
	else {
		if($path!="/"&&$path!=""&&!isset($locations[$module])) {
			return;
		}
		$feedurl = $apibaseurl."/feed";
		$cawebhomeurl = $apibaseurl."/cawebhome";
		// check if the location user does exists
		if(isset($locations[$module])) {
		    // $loc = $locations[$module];
		    // $data=curl_request($cawebhomeurl."?latitude=$loc[0]&longitude=$loc[1]");
            // addCahceData($cawebhomeurl, json_encode($data));
		}
		// try to find the location of the user...and redirect
		else {
  		    // $loc = getUserCurrentLocation();
		    // // check for the areas
		    // if(isset($area[$loc['region']])) {
            //     header("Location: ".$_SERVER['REQUEST_SCHEME']."://".$_SERVER['SERVER_NAME']."/".$area[$loc['region']], true, 302);
		    // }
		    // // load delhi-nrc if user's area not found
		    // else {
            //     header("Location: ".$_SERVER['REQUEST_SCHEME']."://".$_SERVER['SERVER_NAME']."/delhi-ncr", 302);
		    // }
            // die();
		}
		inflate_meta($data);
	}
}
?>