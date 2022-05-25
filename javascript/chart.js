google.charts.load('current', {
    'packages': ['corechart']
});

function setup() {
    var open = false;

    function drawChart(arr) {
        var data_info = [
            ['ContrCy', 'Car'],
            ...arr
        ];

        let sum = 0;
        for (let i = 0; i < arr.length; i++) sum += arr[i][1];

        sum = Math.round(sum * 100) / 100;

        document.getElementById("price").innerHTML = "$" + sum;

        var data = google.visualization.arrayToDataTable(
            data_info
        );

        var options = {
            title: 'Current Month',
            is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('myChart'));
        chart.draw(data, options);
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.status == 200 && xhttp.readyState == 4) {
            // Received csv file
            let csv_data = JSON.parse(xhttp.responseText);
            let obj = {};

            for (let i = 0; i < csv_data.length; i++) {
                if (csv_data[i].Accounttype) {
                    if (csv_data[i].Accounttype in obj) {
                        obj[csv_data[i].Accounttype] += Math.abs((csv_data[i].Cad));
                    } else obj[csv_data[i].Accounttype] = Math.abs((csv_data[i].Cad));
                }
            }

            let conv_arr = Object.keys(obj).map(m => [m, obj[m]]);
            drawChart(conv_arr);
        }
    }

    google.charts.setOnLoadCallback(() => {
        xhttp.open("GET", "/chartData");
        xhttp.send();
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

    $("body").append(`<div id="cardsMenu"></div>`);
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
    });
}

$(document).ready(setup);