var touchtime = 0;

function populateRows(data) {

    sum = 0


    result = ""
    result += "<table>"
    result += `<tr>
    <th>Card</th>
    <th>Date</th>
    <th>Description</th>
    <th>Amount</th>
    </tr>
    `
    result += "<tr>"

    for (i = 0; i < data.length; i++) {
        console.log(data[i].Purchaseid)
        // cardName = $(".Accounttype").html(data[i].Accounttype)
        // transDate = $(".Transactiondate").html(data[i].Transactiondate)
        // store = $(".Description1").html(data[i].Description1)
        // cad = $(".Cad").html(data[i].Cad)

        cardName = data[i].Accounttype
        transDate = data[i].Transactiondate.slice(0, 10)
        store = data[i].Description1.slice(0, 20)
        cad = data[i].Cad

        result += `<td> ${cardName} </td>`
        result += `<td> ${transDate} </td>`
        result += `<td> ${store} </td>`
        result += `<td> ${cad} </td>`
        result += "</tr>"

        sum += data[i].Cad
    }

    result += "</table>"
    console.log(result)
    $(".transactionRecord").html(result)

    // $(".transactionRecord").append(`

    // <tr>
    // <td>${cardName}</td>
    // <td>${transDate}</td>
    // <td>${store}</td>
    // <td>${cad}</td>
    // <tr>

    // `)
    // }
}


async function getTransactions() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:3000/expenses/data",
        success: populateRows
    })

}


function setup() {
    getTransactions();
    $("#easter").dblclick(function() {
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

     $("#easter").on("click", function() {
         if (touchtime == 0) {
             // set first click
             touchtime = new Date().getTime();
         } else {
             // compare first click to this click and see if they occurred within double click threshold
             if (((new Date().getTime()) - touchtime) < 800) {
                 // double click occurred
                 absSum = Math.abs(sum)
                 alert(`"Budgeting is your financial blueprint so you can successfully save money."- Evangeline Felix
                 \n \n Your spending amount for this period is: $${absSum} 
                 \n\n
                 Do you want to know more about our service?`);
                 window.open('https://www.youtube.com/watch?v=7TqWaeuFQhE', '_blank');
                 touchtime = 0;
             } else {
                 // not a double click so set as a new first click
                 touchtime = new Date().getTime();
             }
         }
     });
}


$(document).ready(setup);