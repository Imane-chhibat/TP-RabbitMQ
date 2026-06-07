<?php

$reservations=[];

$data=json_decode(
file_get_contents("php://input"),
true
);

$reservation=[
"id"=>uniqid(),
"id_film"=>$data["id_film"],
"id_utilisateur"=>$data["id_utilisateur"]
];

echo json_encode($reservation);