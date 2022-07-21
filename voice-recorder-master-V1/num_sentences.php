<?php

/**
 * Returns number of sentences of given dataset
 */

include 'conn.php';
$conn = OpenCon();

$ds = $_GET['ds'];

$sql = "select count(valueText) from ". $ds;
$result = $conn->query($sql);

foreach ($result as $value) {   
    echo $value["count(valueText)"];
}

CloseCon($conn);

?>    