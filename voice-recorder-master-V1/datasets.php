<?php

/**
 * Returns list of datasets
 */

include 'conn.php';
$conn = OpenCon();

$sql = "show tables from test";
$result = $conn->query($sql);

$cpt = 0;
$values = []; 
foreach ($result as $value) {
    $cpt = $cpt + 1;
    array_push($values, $value["Tables_in_test"]);
}

$one_item = $values[rand(0, $cpt - 1)];

echo '<option selected>' . $one_item. '</option>';

foreach ($result as $value) {
    if($one_item == $value["Tables_in_test"]) {
        continue;
    }
    echo '<option>' . $value["Tables_in_test"]. '</option>';
}

CloseCon($conn);


?>