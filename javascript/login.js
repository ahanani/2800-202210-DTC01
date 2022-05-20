function setup() {
    $("span").click(() => {
        $.ajax({
            type: "get",
            url: "/signUpPage",
            dataType: "html",
            success: function(response) {
                console.log(response);
            }
        })
    });
}




$(document).ready(setup);