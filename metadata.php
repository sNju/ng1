
<?php

$url=parse_url($_SERVER['PHP_SELF']);
    $path=$url['path'];
    $redirect = "";
    $path=explode("/",$path);
    $module=$path[3];
    $id=$path[4];

    switch ($module){
        
    case 'party':
    
       $url="https://api.goparties.com/party?id=".$id;
       $data=curl_request($url);
       die(print_r($data));
      $data=$data['data']['detail']['party'];
      $party['url']="http://www.goparties.com/party/".$id;
      $redirect=$party['url'];
      $party['type']="party";
      $party['title']=$data['title'];
      $party['description']=$data['description'];
      $party['banner']=$data['banner'];
      inflate_meta($party);
      break;
    case 'deal':
      $url="https://api.goparties.com/deal?id=".$id;
      $data=curl_request($url);
            $data=$data['data']['detail']['deal'];
      $deal['url']="http://www.goparties.com/deal/".$id;
      $redirect=$deal['url'];
      $deal['type']="deal";
      $deal['title']=$data['title'];
      $deal['description']=$data['title'];
      $deal['banner']=$data['thumburl'];
      inflate_meta($deal);
      break;
    case 'work':
      $url="https://api.goparties.com/work?id=".$id;
      $data=curl_request($url);
      $data=$data['data']['detail']['work'];
      $work['url']=$data['fileurl'];
      $redirect=$work['url'];
      $work['type']="work";
      $work['title']=$data['title'];
      $work['description']=$data['title'];
      $work['banner']=$data['thumburl'];
      inflate_meta($work);
      break;
    case 'blog':
    echo "Inside Blog";
      $url="http://staging.goparties.com:1234/blog?id=".$id;
      $data=curl_request($url);
      $data=$data['data']['detail']['blog'];
      $blog['url']="http://www.goparties.com/blog/".$id;
      $redirect=$blog['url'];
      $blog['type']="blog";
      $blog['title']=$data['title'];
      $blog['description']=$data['description'];
      $blog['banner']=$data['cover'];
      inflate_meta($blog);
      break;
    case 'profile':
            $url="https://api.goparties.com/profile?id=".$id;
            $data=curl_request($url);
            $data=$data['data']['detail']['profile'];
      $profile['url']="http://www.goparties.com/profile/".$id;
      $redirect=$profile['url'];
      $profile['type']="profile";
      $profile['title']=$data['name'];
      $profile['description']=$data['description'];
      $profile['banner']=$data['cover'];
      inflate_meta($profile);
      break;
    default:
    echo "inside default";
      $url="http://staging.goparties.com:1234/tinytolong?tinyurl=".$module;
      $data=curl_request($url);
      if(isset($data['data'])&&isset($data['data']['tinyurl'])&&$data['data']['tinyurl']['active']!=false) {
        $redirect=$data['data']['tinyurl']['longurl'];
        // header("Location:".$data['data']['tinyurl']['longurl']);
      } else {
        $redirect="http://goparties.com";
        // header("Location:http://goparties.com");
      }
    }


    function inflate_meta($data){
        if($data['description']=="") {
            $data['description'] = "Download GoParties | Your Party App";
        }
      echo '<meta property="og:url" content="'.$data['url'].'">';
      echo '<meta property="og:type" content="website">';
      echo '<meta property="og:title" content="'.$data['title'].'">';


      echo '<meta property="og:description" content="'.$data['description'].'">';
      echo '<meta property="og:image" content="'.$data['banner'].'">';
      echo '<meta property="og:image:secure_url" content="'.$data['banner'].'">';

          echo '<meta name="twitter:card" content="summary">';
      echo '<meta name="twitter:site" content="@goparties">';
      echo '<meta name="twitter:url" content="'.$data['url'].'">';
      echo '<meta name="twitter:title" content="'.$data['title'].'">';
      echo '<meta name="twitter:description" content="'.$data['description'].'">';
      echo '<meta name="twitter:image" content="'.$data['banner'].'">';
    }

  function curl_request($url){
  $ch = curl_init($url);
  curl_setopt_array($ch, array(
              CURLOPT_HTTPHEADER  => array('Authorization: public'),
              CURLOPT_RETURNTRANSFER  =>true,
              CURLOPT_VERBOSE     => 1
  ));
  $out = curl_exec($ch);
  curl_close($ch);
  $result=json_decode($out,true);
  return $result;
    }
 ?>


