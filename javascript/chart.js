const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
    if(xhttp.status == 200 && xhttp.readyState == 4) {
        // Received csv file
        let csv_data = xhttp.responseText;
        
        // Break up CSV by lines
        csv_data = csv_data.split("\n");
        // Now break up each individual line by commas
        csv_data = csv_data.map(line => line.split(",")).slice(1);

        // Now csv_data contains the CSV data of my_transactions in the following format:
        /**
         * [[MasterCard, 4/17/2022, -3.36],
         *  [MasterCard, 4/18/2022, -12.85],
         *  ...
         *  [MasterCard, 5/4/2022, -79.79]]
         * */
        /**
         * { MasterCard: [total spendings of MasterCard], VISA}
         */
        let obj = {};
        for(let i = 0; i < csv_data.length; i++) {
            if(csv_data[i][0]) {
                if(csv_data[i][0] in obj) {
                    obj[csv_data[i][0]] += Number(csv_data[i][3]);
                } else obj[csv_data[i][0]] = Number(csv_data[i][3]);
            }
        }

        let conv_arr = Object.keys(obj).map(m => [m, obj[m]]);
        drawChart(conv_arr);
    }
}

google.charts.setOnLoadCallback(() => {
    xhttp.open("GET", "Jesp.csv");
    xhttp.send();

    setInterval(() => {
        xhttp.open("GET", "Jesp.csv");
        xhttp.send();
    }, 2000);
})