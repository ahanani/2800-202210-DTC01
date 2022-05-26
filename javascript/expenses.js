var touchtime = 0;

function populateRows(data) {

    sum = 0


    result = "";

    for (i = 0; i < data.length; i++) {
        cardName = data[i].Accounttype
        transDate = data[i].Transactiondate.slice(0, 10)
        store = data[i].Description1.slice(0, 20)
        cad = data[i].Cad

        result += `<div class="divExpenses"><p>${cardName} </p>`
        result += `<p> ${transDate} </p>`
        result += `<p> ${store} </p>`
        result += `<p class="price"> ${cad} </p>`
        result += "</div>"

        sum += data[i].Cad

        $(`#div${i}`).css({
            'display': 'grid',
            'grid-template-columns': '20% 20% 40% 20%'
        });
    }

    result += "</table>"
    $(".transactionRecord").html(result)
}


async function getTransactions() {
    await $.ajax({
        type: "GET",
        url: "/expenses/data",
        success: populateRows
    })

}


function setup() {
    $("#opt1").click(() => {
        $(location).attr("href", "/userProfile");
    });

    $("#opt2").click(() => {
        $(location).attr("href", "/insight");
    })

    $("#opt3").click(() => {
        $(location).attr("href", "/chart");
    });

    $("#opt4").click(() => {
        $(location).attr("href", "/expenses");
    });

    var open = false;

    $("main").append(`<div id="cardsMenu"></div>`);
    $("#cardsMenu").css({
        'height': '0%',
        'width': '100%',
        'background-color': 'rgb(224, 224, 224)',
        'z-index': '2',
        'position': 'fixed',
        'overflow': 'hidden',
        'grid-column': '1 / span 3',
        'grid-row': '1 / span 4',
        'display': 'grid',
        'grid-template-columns': '30% 40% 30%',
        'grid-template-rows': '10% 5% 2% 5% 68% 10%',
    });

    $("#cardsMenu").ready(() => {
        $("#cardsMenu").append(`<div id="addCards"><p id="addCardsP">Add Cards</p></div>`);
        $("#cardsMenu").append(`<div id="logout"><p id="logoutP">Log Out</p></div>`);
        $("#addCards").css({
            'background-color': 'white',
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

        $("#logout").css({
            'background-color': 'rgb(87, 128, 87)',
            'color': 'white',
            'text-align': 'center',
            'grid-column': '2',
            'grid-row': '4',
            'border-radius': '25px',
            'display': 'grid',
            'grid-template-rows': '20% 60% 20%'
        });
        $("#logoutP").css({
            'grid-row': '2',
            'margin': 'auto'
        });

        $("#logout").click(() => {
            $(location).attr("href", "/logout");
        });

        $("#addCards").click(() => {
            $(location).attr("href", "/addCard");
        });
    });

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


    getTransactions();
    $("#easter").dblclick(function () {
        absSum = Math.abs(sum)
        alert(`"Budgeting is your financial blueprint so you can successfully save money."- Evangeline Felix
        \n \n Your spending amount for this period is: $${absSum} 
        \n\n
        Do you want to know more about our service?`);
        window.open('https://www.youtube.com/watch?v=7TqWaeuFQhE', '_blank');
    }); //for desktop

    /**
     * Performs the double click in mobile. 
     * I found this code on stackoverflow.com.
     *
     * @author https://stackoverflow.com/questions
     * @see https://stackoverflow.com/questions/27560653/jquery-on-double-click-event-dblclick-for-mobile
     */

    $("#easter").on("click", function () {
        if (touchtime == 0) {
            touchtime = new Date().getTime();
        } else {
            if (((new Date().getTime()) - touchtime) < 800) {
                absSum = Math.abs(sum)
                alert(`"Budgeting is your financial blueprint so you can successfully save money."- Evangeline Felix
                 \n \n Your spending amount for this period is: $${absSum} 
                 \n\n
                 Do you want to know more about our service?`);
                window.open('https://www.youtube.com/watch?v=7TqWaeuFQhE', '_blank');
                touchtime = 0;
            } else {
                touchtime = new Date().getTime();
            }
        }
    });
}

$(document).ready(setup);