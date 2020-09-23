const $ = window.$;


$(document).ready(function(){
    
    
    
    console.log("The page has been loaded");
    
    $("#submit-button").click(function() {
        isValidData();
    });
    
    $("form").on("submit", function(e) {
        e.preventDefault();
        main();

    });
    
    
    // Makes request to PHP-server and handles it's response. If response if positive, 
    // this function changes the table.
    function main() {
        
        console.log("Submitted");
        if ( isValidData() ){

            makeMessagePositive();
            showMessage("Форма успешно отправлена.");
            console.log("Correct values");
            
            $.get("php/php.php", function(data) {
                alert("Gort data : " + data);
            })
        }
    };
    
    
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

    };
    
    
    // Checks whether the 'Y' value is valid.
    function isValidY() {
        
        y = parseFloat($(".checkbox-values.y").val().replace(",", "."));
        
        if (isNaN(y) || ( ! isCorrectValueY(y))) {
            makeMessageNegative();
            showAddMessage("Введите значение Y в диапазоне от -5 до 5. В Качестве дробного разделителя используйте точку или запятую.<br>");
            return false;
            
        } else {
            return true;
        }
    };
    
    
    // Checks whether the specified 'y' numeric value is in the range {-5...5}.
    function isCorrectValueY(y) {
        return (y > -5) && (y < 5);
    }

    
    // Checks whether the 'R' value is valid.
    function isValidR() {
        
        r = $(".checkbox-values.r input:checked").val();
        
        if (r === undefined) {
            makeMessageNegative();
            showAddMessage("Выберете значение R .<br>");
            console.log("R isn't chosen!")
            return false;
            
        } else {
            return true;
        }
    };
    
    
    // Inserts 'test' below content in message-box.
    function showAddMessage(text) {

        oldContent = $(".message-box .message-box-content").html();
        
        if (oldContent.indexOf(text) == -1) {
                
            showMessage(oldContent + text);
        }
    };
    
    
    // Sets text to message-box and makes the last one visible.
    function showMessage(text) {

        $(".message-box").css("display", "block");


        $(".message-box .message-box-content").html(text);
    
    };
    
    
    // Changes message-box css to 'positive' style.
    function makeMessagePositive() {
        $(".message-box").css("background-color", "rgba(115, 230, 0, .6)");
        $(".message-box").css("border", "solid rgb(0, 179, 0)");

    };
    
    
    // Changes message-box css to 'negative' style.
    function makeMessageNegative() {
        $(".message-box").css("background-color", "rgba(255, 77, 140, .6)");
        $(".message-box").css("border", "solid rgb(255, 77, 140)");

    }
    
    
    // Clears the contet inside message-box and hides the last one.
    function clearAndHideMessage() {
        clearMessage();
        hideMessage();
    }
    
    
    // Hides the message-box.
    function hideMessage() {
        $(".message-box").css("display", "none");
    };
    
    
    // Clears the message-box content.
    function clearMessage() {
        $(".message-box .message-box-content").html("");
    };
    
    
    // Allows choosing only one "X" checkbox.
    $(".checkbox-values.x input").on('change', function() {
       $(this).siblings(".checkbox-values.x input").prop('checked', false);
    });
    
    
    // Allows choosing only one "R" checkbox.
    $(".checkbox-values.r input").on('change', function() {
       $(this).siblings(".checkbox-values.r input").prop('checked', false);
    });
    
});