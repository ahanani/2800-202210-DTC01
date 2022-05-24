const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {
    if(xhttp.status == 200 && xhttp.readyState == 4) {
        // Received csv file
        let csv_data = xhttp.responseText;
        
        csv_data = csv_data.split("\n");
        csv_data = csv_data.map(line => line.split(",")).slice(1);
        let obj = {};
        for(let i = 0; i < csv_data.length; i++) {
            if(csv_data[i][0]) {
                if(csv_data[i][0] in obj) {
                    obj[csv_data[i][0]] +=  Math.abs((csv_data[i][3]));
                } else obj[csv_data[i][0]] =  Math.abs((csv_data[i][3]));
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