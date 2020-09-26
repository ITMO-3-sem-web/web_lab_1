const $ = window.$;


$(document).ready(function(){

    let x, y, r;
    let messageContentIsPositive, messageBoxIsShown;


    // Handle submit-button clicked action to check the form inputs' values   .
    $("#submit-button").click(function() {
        isValidData();
    });


    // Handle form confirmation action to check the form inputs' values.
    $("#form").on("submit", function(e) {
        e.preventDefault();
        main();

    });
    
    
    // Makes request to PHP-server and handles it's response. If response if positive, 
    // this function changes the table.
    function main() {
        
        if ( isValidData() ){

            $("#form").trigger("reset");

            makeMessagePositive();
            showMessage("Форма успешно отправлена." +
                "<br>Вы хорошо поработали." +
                "<br>Похвалите себя: сходите в бар с друзьями, покатайтесь на велосипеде и тп...");


            let request = "x=" + x + "&y=" + y + "&r=" + r;


            $.get("./php/php.php", request, function(data) {

                data = JSON.parse(data);

                let $responseStatus = data["status"];
                let $responseContent = data["content"];


                if ($responseStatus === "OK") {
                    $("#result-table tr:first").after($responseContent);
                } else if ($responseStatus === "ERROR") {
                    makeMessageNegative();
                    showMessage($responseContent);
                }

            })
        }
    }
    
    
    // Checks whether all the form's inputs have valid data (input).
    function isValidData() {
    
        clearAndHideMessage();
        return  (isValidX() & isValidY() & isValidR()) ;
    }
        
    
    // Checks whether the 'X' value is valid.
    function isValidX() {

        x = $(".checkbox-values.x input:checked").val();
        
        if (x === undefined) {
            makeMessageNegative();
            showAddMessage("Выберете значение X .<br>");
            return false;
        } else {
            return true;
        }
    }
    
    
    // Checks whether the 'Y' value is valid.
    function isValidY() {

        let tmpY = $(".checkbox-values.y").val().replace(",", ".");

        if ( ! $.isNumeric(tmpY)) {
            console.log("y is NOT numeric")
            makeMessageNegative();
            showAddMessage("Введите значение Y в диапазоне от -5 до 5. В Качестве дробного разделителя используйте точку или запятую.<br>");
            return false;
        }

        let tmpArr = tmpY.split(".");

        let intPart = parseInt(tmpArr[0]);
        let fracPart = 0;

        if (tmpArr.length === 2) {
            fracPart = parseInt(tmpArr[1]);
        }

        y = parseFloat(tmpY);

        if ( ! isCorrectValueY(intPart, fracPart) ) {
            makeMessageNegative();
            showAddMessage("Введите значение Y в диапазоне от -5 до 5. В Качестве дробного разделителя используйте точку или запятую.<br>");
            return false;
            
        } else {
            console.log("Y = " + y);
            return true;
        }
    }
    
    
    // Checks whether the specified 'y' numeric value is in the range {-5...5}.
    function isCorrectValueY(intPart, fracPart) {
        let leftLimit = -5;
        let rightLimit = +5;


        if ( ((intPart === leftLimit) || (intPart === rightLimit)) && (fracPart === 0) ) {
            return true;
        } else {
            return ( (intPart > leftLimit) && (intPart < rightLimit) );
        }
    }

    
    // Checks whether the 'R' value is valid.
    function isValidR() {

        r = $(".checkbox-values.r input:checked").val();
        
        if (r === undefined) {
            makeMessageNegative();
            showAddMessage("Выберете значение R .<br>");
            return false;
            
        } else {
            return true;
        }
    }

    
    // Inserts 'test' below content in message-box.
    function showAddMessage(text) {

        let oldContent = $(".message-box .message-box-content").html();
        
        if (oldContent.indexOf(text) == -1) {
            showMessage(oldContent + text);
        }
    };


    // Sets text to message-box and makes the last one visible.
    function showMessage(text) {

        messageBoxIsShown = true;
        $(".message-box").css("display", "block");
        $(".message-box .message-box-content").html(text);

    };


    // Hides the message-box.
    function hideMessage() {
        messageBoxIsShown = false;
        $(".message-box").css("display", "none");
    };

    
    // Clears the contet inside message-box and hides the last one.
    function clearAndHideMessage() {
        clearMessage();
        hideMessage();
    }

    
    // Clears the message-box content.
    function clearMessage() {
        $(".message-box .message-box-content").html("");
    };


    // Changes message-box css to 'positive' style.
    function makeMessagePositive() {
        messageContentIsPositive = true;
        $(".message-box").css("background-color", "rgba(115, 230, 0, .6)");
        $(".message-box").css("border", "solid rgb(0, 179, 0)");

    };


    // Changes message-box css to 'negative' style.
    function makeMessageNegative() {
        messageContentIsPositive = false;
        $(".message-box").css("background-color", "rgba(255, 77, 140, .6)");
        $(".message-box").css("border", "solid rgb(255, 77, 140)");

    }


    // Allows choosing only one "X" checkbox.
    $(".checkbox-values.x input").on('change', function() {
       $(this).siblings(".checkbox-values.x input").prop('checked', false);
    });
    
    
    // Allows choosing only one "R" checkbox.
    $(".checkbox-values.r input").on('change', function() {
       $(this).siblings(".checkbox-values.r input").prop('checked', false);
    });


    $("form :input").change(function() {
        if (messageContentIsPositive) {
            clearAndHideMessage();
        }
    });

    
});