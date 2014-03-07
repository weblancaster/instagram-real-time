<?php

$attachment =  array(
'client_id' => $client_id,
'client_secret' => $client_secret,
'object' => $object,
'object_id' => $object_id,
'aspect' => $aspect,
'verify_token' => $verify_token,
'callback_url'=>$callback_url
);

$url = "https://api.instagram.com/v1/subscriptions/";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output
$result = curl_exec($ch);
curl_close ($ch);

print_r($result);

$challenge = $_GET['hub_challenge'];
echo $challenge;

?>