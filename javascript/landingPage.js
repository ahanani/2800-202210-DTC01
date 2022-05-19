function populateLandingPage() {
    let date = new Date();
    $.ajax({
        type: "get",
        url: `/userDetails/${date.toJSON(date).slice(0, 10)}`,
        success: function (response) {
            response.forEach(obj => {
                $("#brands").append((`<div class="item"><p class="items">${obj.Description1}</p><p class="itemsPrice">${obj.Cad}</p></div>`));
            });
        }
    });
}



function setup() {
    var open = false;

    $("#opt3").click(() => {
        $.ajax({
            type: "get",
            url: "/report",
            success: function (response) {
                console.log(response);
            }
        });
    })

    $("#logo").click(() => {
        if (open) {
            open = false;
            $("#cardsMenu").animate({
                height: '0%'
            }, 500);
            $("#addCards").animate({
                height: '0%'
            }, 400);
            $("#addCardsP").hide();
        } else {
            open = true;
            $("#addCardsP").show();
            $("#cardsMenu").animate({
                height: '100%'
            }, 500);
            $("#addCards").animate({
                height: '100%'
            }, 600);
        }
    });

    $("main").append(`<div id="cardsMenu"></div>`);
    $("#cardsMenu").css({
        'height': '0%',
        'width': '100%',
        'background-color': 'rgb(224, 224, 224)',
        'z-index': '2',
        'position': 'fixed',
        'overflow': 'hidden',
        'grid-column': '1 / span 4',
        'grid-row': '1 / span 4',
        'display': 'grid',
        'grid-template-columns': '30% 40% 30%',
        'grid-template-rows': '10% 10% 70% 10%',
    });

    $("#cardsMenu").ready(() => {
        $("#cardsMenu").append(`<div id="addCards"><p id="addCardsP">Add Cards</p></div>`);
        $("#addCards").css({
            'background-color': 'white',
            // 'margin': 'auto',
            'text-align': 'center',
            'grid-column': '2',
            'grid-row': '2',
            'border-radius': '25px',
            'display': 'grid',
            'grid-template-rows': '20% 60% 20%'
        });
        $("#addCardsP").css({
            'grid-row': '2',
            'margin': 'auto'
        });

        $("#addCards").click(() => {
            $.ajax({
                type: "get",
                url: "/addCard",
                success: function (response) {
                    console.log(response);
                }
            });
        });
    });

    $("#opt1").click(() => {
        $.ajax({
            type: "get",
            url: "/userProfile",
            success: function(response) {

            }
        })
    })

    populateLandingPage();
}

$(document).ready(setup);