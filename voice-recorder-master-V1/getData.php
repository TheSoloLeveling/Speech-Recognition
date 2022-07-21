
<?php

include 'conn.php';
$conn = OpenCon();

//$ds = $_GET['ds'];
//$sen = $_GET['sen'];

$ds = "الجهة";
$sen = "الشرق";

$sql = "select cpt from `". $ds . "` where valueText = '".$sen."'";
$result = $conn->query($sql);

foreach ($result as $value) {   
    echo $value["cpt"];
}

CloseCon($conn);
?>