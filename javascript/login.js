window.onload = () => {
    document.getElementById("userId").value = "";
}


document.getElementById("submit").addEventListener("click", function() {
    let userId = (document.getElementById("userId").value);
    let userPassword = document.getElementById("userPassword").value;

    let xhttp =  new XMLHttpRequest();

    xhttp.onload = () => {
    }

    xhttp.open("GET", "/users?id=" + userId + "&password=" + userPassword, true);
    xhttp.send();
});