<?php


$x = "";
$y = "";
$r = "";
$response = "";


initialize();
main();


function initialize() {
    date_default_timezone_set("Europe/Moscow");
}


function main() {

    if ( isValidRequest() ) {

        initializeValues();

        if ( isValidX() && isValidY() && isValidR() ) {
            sendResponse(prepareResponse(), "OK");
        } else {
            sendResponse("Request is not valid. Some of the arguments are incorrect.", "ERROR");
        }

    } else {
        sendResponse("Request is not valid. Not all of the necessary arguments are present.", "ERROR");
    }
}


function isValidRequest() {

    return ( isset($_GET["x"]) && isset($_GET["y"]) && isset($_GET["r"]) );
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

    return ( ($x >= -4) && ($x <= 4) );

}


function isValidY() {

    global $y;

    str_replace(",", ".", $y);

    if ( ! is_numeric($y) ) {
        return false;
    }

    $tmpArr = explode(".", $y);

    $intPart = $tmpArr[0];
    $fracPart = 0;

    if ( count($tmpArr) == 2) {
        $fracPart = $tmpArr[1];
    }

    $y = floatval($y);

    return isCorrectValueY($intPart, $fracPart);

}


function isCorrectValueY($intPart, $fracPart) {

    $leftLimit = -5;
    $rightLimit = 5;

    if ( ( ($intPart == $leftLimit) || ($intPart == $rightLimit) ) && ($fracPart == 0) ) {
        return true;
    } else {
        return ( ($intPart > $leftLimit) && ($intPart < $rightLimit) );
    }
}


function isValidR() {

    global $r;

    if ( ! isIntString($r) ) {
        return false;
    }


    $r = intval($r);

    return ( ($r >= 1) && ($r <= 5) );

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
    $runTime = round( (microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"] ) * 1000 , 3);


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
        (  ( ($x >= (-1) * $r) && ($x <= 0) && ($y <= (0.5 * $x + 0.5 * $r)) )
        || ( ($x >= 0) && ($x <= $r/2) && ($y >= 0) && ($y <= $r) )
        || ( ($x >= 0) && ($x <= $r/2) && ($y**2 <= ($r**2 - $x**2)) && ($y <= 0) ) );
}


function sendResponse($responseContent, $responseStatus) {

    // Good way to send data
//    echo json_encode(array("content" => $responseContent, "status" => $responseStatus));

    // This stupid json transformation is used because jason_encode() is NOT installed on HELIOS
    echo '{"content":' . '"' . $responseContent . '"' . ',' . '"status":' . '"' . $responseStatus . '"' . '}';
}


function isIntString($arg) {

    return is_numeric(str_replace(".", "A", $arg));
}

?>