function edit() {
    $("#cancel").val("Cancel");
    $("#firstName").attr("disabled", false);
    $("#lastName").attr("disabled", false);
    $("#password").attr("disabled", false);
}

function editDataBase() {
    $.ajax({
        type: "post",
        url: "/editDataBase",
        data: {
            firstName: `${$("#firstName").val()}`,
            lastName: `${$("#lastName").val()}`,
            password: `${$("#password").val()}`
        },
        dataType: "json",
        success: function(response) {
            console.log("Successfully updated!");
        }
    })
}


function setup() {
    $.ajax({
        type: "get",
        url: "/userProfileDetails",
        success: function(response) {
            $("#firstName").val(response.firstname).attr("disabled", true);
            $("#lastName").val(response.lastname).attr("disabled", true);
            $("#email").val(response.username).attr("disabled", true);
            $("#password").val(response.password).attr("disabled", true);
        }
    });

    $("#cancel").click(edit);
    $("#save").click(editDataBase);
}




$(document).ready(setup);