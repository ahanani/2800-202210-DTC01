function populateRows(data) {
    var past4Weeks = []
    var recent2Weeks = []
    var weeklySum = 0
    var weeklySum2 = 0
    var future4Weeks = []

    data.reverse()
    console.log(data)
    dataFor4WeeksGraph = data
    for (i = 0; i < dataFor4WeeksGraph.length; i++) {
        weeklySum += Math.abs(dataFor4WeeksGraph[i]["SUM(Cad)"])
        past4Weeks.push(weeklySum)
    }

    for (i = 2; i < 4; i++) {
        weeklySum2 += Math.abs(data[i]["SUM(Cad)"])
        console.log(weeklySum2)

        recent2Weeks.push(weeklySum2)
    }
    console.log(past4Weeks)
    console.log(recent2Weeks)

    recentSlope = Math.abs(recent2Weeks[1]) - Math.abs(recent2Weeks[0])
    pastSlope = Math.abs(past4Weeks[1]) - Math.abs(past4Weeks[0])

    expectation = recent2Weeks[1] + recentSlope * 2
    console.log(recentSlope)

    future4Weeks = Array.from(recent2Weeks)


    estimated = recent2Weeks[1]
    for (i = 0; i < 2; i++) {
        estimated += recentSlope
        future4Weeks.push(estimated)
    }
    console.log(future4Weeks)


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
}


$(document).ready(setup);