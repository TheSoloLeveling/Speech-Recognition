<?php

/**
 * Returns number of sentences of given dataset
 */

$ds = $_GET['ds'];

$file = 'datasets/' . $ds;
$linecount = 0;
$handle = fopen($file, "r");
while(!feof($handle)){
  $line = fgets($handle);
  $linecount++;
}

fclose($handle);
if (!file_exists($file))
    echo 'ERROR: dataset does not exists!';
else
    echo $linecount + 1;

?>    