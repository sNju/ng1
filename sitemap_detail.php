<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php
header('Content-type: application/xml');
$baseurl = "https://www.goparties.com/";
$urls = [];
$total=0;
$j = 0;
$categories = array("dj","band","artist","party","spot");
$categories = array("party");
$page = array(
	"https://api.goparties.com/search?latitude=13.087542&longitude=80.284492&since=0&limit=1000",
	"https://api.goparties.com/search?latitude=17.384125&longitude=78.493177&since=0&limit=1000",
	"https://api.goparties.com/search?latitude=28.735485&longitude=77.220116&since=0&limit=1000",
	"https://api.goparties.com/search?latitude=19.078876&longitude=72.873639&since=0&limit=1000",
	"https://api.goparties.com/search?latitude=18.521961&longitude=73.850595&since=0&limit=1000",
	"https://api.goparties.com/search?latitude=12.971246&longitude=77.589690&since=0&limit=1000"
	
);

foreach ($categories as $index => $category) {
	foreach($page as $key => $value) {
		generate_request($value."&category=".$category);
	}
}

//echo $total;

function getvalue($data)
{
	if(!is_null($data['gpurl'])) {
		return $data['gpurl'];
	}
	else if(!is_null($data['_id'])) {
		return $data['_id'];
	}

}

function self_array($result) {
	global $urls;
	foreach($result as $key => $value) {
		if(isset($value['_id'])) {
			$urls[] = getvalue($value);
		}
		else if(is_array($value)){
			self_array($value);
		}

	}
}

function generate_request($url) {
	global $urls;
	global $baseurl;
	global $total;
	$ch = curl_init($url);
	curl_setopt_array($ch, array(
		CURLOPT_HTTPHEADER => array(
			'Authorization: public'
		) ,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_VERBOSE => 1
	));
	$out = curl_exec($ch);
	curl_close($ch);
	$result = json_decode($out, true);
	$urls = [];
	self_array($result);
	$j = count($urls);
	for ($k = 0; $k < $j; $k++) { //$total++;
?>
		<url>
			<loc><?php echo $baseurl . $urls[$k] ;?> </loc>
			<changefreq>daily</changefreq>
		</url>
<?php
	}
}
?>
</urlset>
