<?php

//$a = $_GET[""];
//session_start();
//if ( ! isset($_SESSION["tableData"])) {
//    $tableData = array();
//    $_SESSION["tableData"] &= $tableData;
//}
//
//$tableData = 12;
//
//echo $tableData;

print_r($_GET . "\n" . isValidRequest());

$x = "";
$y = "";
$r = "";
$response = "";


// Run the server request handler function
initialize();
main();


function initialize() {
    date_default_timezone_set("Europe/Moscow");
}


function main() {

    $errorMessage = "Error: form request is damaged.";

    if ( isValidRequest() ) {

        initializeValues();

        if ( isValidX() && isValidY() && isValidR() ) {
            sendResponse(prepareResponse(), "OK",);
        } else {
            sendResponse($errorMessage, "ERROR");
        }

    } else {
        sendResponse($errorMessage, "ERROR");
    }
}


function isValidRequest() {
    return ( isset($_GET["x"]) && $_GET["y"] && $_GET["r"] );
}


function initializeValues() {

    global $x, $y, $r;

    $x = $_GET["x"];
    $y = $_GET["y"];
    $r = $_GET["r"];
}

function isValidX() {

    global $x;

    if ( ! isIntString($x) ) {
        return false;
    }

    $x = intval($x);

    if ( ($x > -4) && ($x < 4)) {
        return true;
    } else {
        return false;
    }
}


function isValidY() {

    global $y;

//    str_replace(",", ".",$y);

    if ( ! is_numeric($y) ) {
        return false;
    }


    $tmpArray = explode(".", $y);

    if (count($tmpArray) == 2) {
        $integerPart = $tmpArray[0];
        $fractionalPart = $tmpArray[1];
    } elseif (count($tmpArray) == 1) {
        $integerPart = $tmpArray[0];
        $fractionalPart = "0";
    } else {
        return false;
    }

//    if ( ! ( is_numeric($integerPart) || is_numeric($fractionalPart) ) ) {
//        return false;
//    }

    $integerPart = intval($integerPart);
    $fractionalPart = intVal($fractionalPart);

    $y = floatval($y);

    return isCorrectY($integerPart, $fractionalPart);

}


function isCorrectY($intPart, $fracPart) {

    $leftLimit = -5;
    $rightLimit = 5;

    if ( ( ($intPart == $leftLimit) || ($intPart == $rightLimit) ) && $fracPart == 0) {
        return true;
    } else if ( ($intPart > $leftLimit) && ($intPart < $rightLimit) ) {
        return true;
    } else {
        return false;
    }
}


function isValidR() {

    global $r;

    if ( ! isIntString($r) ) {
        return false;
    }

    $r = intval($r);

    if ( ($r > 1) && ($r < 5)) {
        return true;
    } else {
        return false;
    }
}


function prepareResponse() {

    global $x, $y, $r, $response;

    $resultRepresentation = "";
    $resultRepresentationClass = "";

    if ( pointIsInArea() ) {
        $resultRepresentation = "да";
        $resultRepresentationClass = "server-answer-yes";
    } else {
        $resultRepresentation = "нет";
        $resultRepresentationClass = "server-answer-no";
    }


    $currentTime = date("H : i : s");
    $runTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];


    $response =
        "<tr>" .
            "<td>" . $x . "</td>>" .
            "<td>" . $y . "</td>>" .
            "<td>" . $r . "</td>>" .
            "<td class='" . $resultRepresentationClass . "'>" . $resultRepresentation . "</td>>" .
            "<td>" . $currentTime . "</td>>" .
            "<td>" . $runTime . "</td>>";

    return $response;

}


function pointIsInArea() {

    global $x, $y, $r;

    return
        (  ( ($x > -$r) && ($x < 0) && ($y < (0.5 * $x - $r)) )
        || ( ($x > 0) && ($x < $r/2) && ($y > 0) && ($y < $r) )
        || ( ($x > 0) && ($x < $r/2) && ($y**2 < ($r**2 - $x**2)) && ($y < 0) ) );
}


function sendResponse($responseContent, $responseStatus) {

//    if ($responseStatus != "")
    echo array("content" => $responseContent, "status" => $responseStatus);
}


function isIntString($arg) {

    return is_numeric(str_replace(".", "A", $arg));
}

?>