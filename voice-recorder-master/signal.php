
<?php

    include 'conn.php';
    $conn = OpenCon();

    $ds = $_GET['ds'];
    $sen = $_GET['sen'];


    $sql = "update `". $ds ."` set cpt = cpt + 1 where valueText = '".$sen."'";
    
    $result = $conn->query($sql);

    echo $ds . " | ". $sen;
    

    CloseCon($conn);
?>