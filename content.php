
<div style="display: none;">
<?php

function renderUrls($result) {
	foreach($result as $key => $value) {
		if ($key == 'party') {
			party_array($value);
		}
		elseif ($key == 'profile') {
			profile_array($value);
		}
		elseif ($key == 'blog') {
			blog_array($value);
		}
		elseif (is_array($value)) {
			renderUrls($value);
		}
	}
}

function blog_array($value) {
	if (!is_null($value['gpurl'])) {
		echo "<a href='/" . $value["gpurl"] . "'>" . $value["title"] . "</a>";
	}
	elseif(!is_null($value['_id'])) {
		echo "<a href='/" . $value["_id"] . "'>" . $value["title"] . "</a>";

	}
}

function profile_array($value) {
	if (!is_null($value['gpurl'])) {
		echo "<a href='/" . $value["gpurl"] . "'>" . $value["name"] . " | " . $value["profile_type"] . "</a>";
	}
	elseif (!is_null($value['_id'])) {
		echo "<a href='/" . $value["_id"] . "'>" . $value["name"] . " | " . $value["profile_type"] . "</a>";
	}
}

function party_array($value) {
	if (!is_null($value['gpurl'])) {
		echo "<a href='/" . $value["gpurl"] . "'>" . $value["title"] . " | " . $value["location"] . "</a>";
	}
	elseif (!is_null($value['_id'])) {
		echo "<a href='/" . $value["_id"] . "'>" . $value["title"] . " | " . $value["location"] . "</a>";
	}
	
}
// setting the data as accessing global $curldata variable, the array has got the value from header.php
renderUrls($curldata);
?>

<h1>GoParties-Your Party App | Perfect Place for <strong>PARTYMONS</strong></h1>
<div itemscope itemtype="http://schema.org/LocalBusiness">
	<div itemprop="name">GoParties India Pvt. Ltd</div>
	<div>Email: <span itemprop="email"><a href='mailto:support@goparties.com'>support@goparties.com</a></span></div>
	<div>Phone: <span itemprop="telephone">9711-9712-44</span></div>
	<div>Url: <span itemprop="url"><a href='https://www.goparties.com'>https://www.goparties.com</a></span></div>

	<div itemprop="paymentAccepted"  style='display: none' >cash, credit card</div>
	<meta itemprop="openingHours"  style='display: none'  datetime="Tu,We,Th,Fr,Sa 09:00-18:00" />
	<div itemtype="http://schema.org/PostalAddress" itemscope="" itemprop="address">
		<div itemprop="streetAddress">B-10/8, DLF Phase I, Gurgaon, Haryana, Gurgaon</div>
		<div><span itemprop="addressLocality">Delhi-NCR</span>, <span itemprop="addressRegion">Haryana</span> <span itemprop="postalCode">122002</span></div>
	</div>
</div>
</div>
