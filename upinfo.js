upnf.insertAdjacentHTML("afterend",`<div style="color: #b6ff00; font-size: 100%">Совершенно новый прорывной хоррор от молодой инди студии</div>

    <h1 style=" color: #b6ff00; display: flex;justify-content: center; align-items: center; font-size: 40px"><b id="gamename">RAFN 2</b></h1>`);


var clics = 0
var b = document.getElementById("gamename");
b.onclick = function () {
    clics += 1;
    if (clics == 10) {
        b.innerHTML = "Run Away From the Nigger 2"
    }
    
}

b.onmouseout = function () {
    b.innerHTML = "RAFN 2"
    clics = 0
}
