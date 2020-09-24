<?php
// echo 'Write your code here';
$val = "130000000000000000000000000000000000000000001";

echo "Int value = " . intval($val);

$tmpArray = explode(".", $val);

print_r($tmpArray);

if (is_numeric($val)) {
    echo "\nval is int";
} else {
    echo "\nval is NOT int";

}

//echo "\n\n" . 7/9;

function isIntString($arg) {

    return is_numeric(str_replace(".", "A", $arg));
}
?>
