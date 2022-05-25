function populateRows(data) {
    var past4Weeks = []
    var recent2Weeks = []
    var weeklySum = 0
    var weeklySum2 = 0
    var future4Weeks = []

    data.reverse()
    dataFor4WeeksGraph = data
    for (i = 0; i < dataFor4WeeksGraph.length; i++) {
        weeklySum += Math.abs(dataFor4WeeksGraph[i]["SUM(Cad)"])
        past4Weeks.push(weeklySum)
    }

    for (i = 2; i < 4; i++) {
        weeklySum2 += Math.abs(data[i]["SUM(Cad)"])
        recent2Weeks.push(weeklySum2)
    }

    recentSlope = Math.abs(recent2Weeks[1]) - Math.abs(recent2Weeks[0])
    pastSlope = Math.abs(past4Weeks[1]) - Math.abs(past4Weeks[0])

    expectation = recent2Weeks[1] + recentSlope * 2;

    future4Weeks = Array.from(recent2Weeks)


    estimated = recent2Weeks[1]
    for (i = 0; i < 2; i++) {
        estimated += recentSlope
        future4Weeks.push(estimated)
    }


    var xValues = ["week1", "week2", "week3", "week4"];

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Last 4w',
                data: past4Weeks,
                borderColor: "red",
                fill: true
            }, {
                label: 'Current',
                data: recent2Weeks,
                borderColor: "green",
                fill: true
            }, {
                label: 'Estimation',
                data: future4Weeks,
                borderColor: "blue",
                fill: true
            }]
        },
        options: {
            legend: {
                display: true
            }
        }
    });


    if (recentSlope > pastSlope) {

        $("#insightReport").html(
            "Based on your recent expenditure trend, you are spending more money for this period. Why don't you save more for this week?"
        )
    } else {
        $("#insightReport").html(
            `You are saving now! you are expected to spend $${expectation} by end of next 2 weeks`
        )
    }
}


async function getTransactions() {
    await $.ajax({
        type: "GET",
        url: "/insight/data",
        success: populateRows
    });

}


function setup() {
    getTransactions();
    $("#easter").dblclick(function () {
        absSum = Math.abs(sum)
        alert(`"Budgeting is your financial blueprint so you can successfully save money."- Evangeline Felix
        \n \n Your spending amount for this period is: $${absSum} 
        \n\n\n
              Know more, Save more`);
        window.open('https://www.youtube.com/watch?v=7TqWaeuFQhE', '_blank');
    });


    var open = false;

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
    })
}


$(document).ready(setup);