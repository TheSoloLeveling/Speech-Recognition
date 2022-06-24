<?php

/**
 * Returns num-th sentence of given dataset
 */

include 'conn.php';
$conn = OpenCon();

$ds = $_GET['ds'];

$file = 'datasets/' . $ds;


$sql = "SELECT valueText FROM". " " . $ds . " where cpt < 3";
$result = $conn->query($sql);


$cpt = 0;
$values = []; 
foreach ($result as $value) {
    $cpt = $cpt + 1;
    array_push($values, $value["valueText"]);
}

$one_item = $values[rand(0, $cpt - 1)];

echo $one_item ;


CloseCon($conn);

?>