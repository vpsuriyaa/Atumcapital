let search = $("#livesearch");
 
function showresult(str){
    if (str.length === 0) {
        search.addClass("hide");
    } else {
        search.removeClass("hide")
    }

    $.ajax({
        url: "/",
        contentType: "applicatio/json",
        method: "POST",
        data: JSON.stringify({
            query: str
        }),
        success: function(result){
            search.html(result.response)
        }
    })
}