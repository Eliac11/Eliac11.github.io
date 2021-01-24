dwnnf.insertAdjacentHTML("afterend",`
<link rel="stylesheet" href="styls/cssicons.css">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="container">

<canvas style="z-index: -1; position:absolute"></canvas>
<script src="js/scriptDowninfo.js"></script>

    <div class="social">
        <a href="https://github.com/Eliac11" class="social__item git">
            <div class="fa fa-github"></div>
        </a>
    </div>
    <div class="social">
        <a href="https://vk.com/id0" class="social__item vk">
            <div class="fa fa-vk"></div>
        </a>
    </div>
    <div class="social">
        <a href="https://www.google.ru/search?newwindow=1&safe=strict&sxsrf=ALeKk03DfU_ibDVL72Pg5MCXdg7U8os5gA%3A1610302773844&source=hp&ei=NUX7X_nvMOmRrgTj3b2wBQ&q=facebook+%D0%B4%D0%BB%D1%8F+%D1%82%D1%83%D0%BF%D1%8B%D1%85&oq=facebook+%D0%B4%D0%BB%D1%8F+%D1%82%D1%83%D0%BF%D1%8B%D1%85&gs_lcp=CgZwc3ktYWIQAzoHCCMQ6gIQJzoJCCMQ6gIQJxATUIsOWIsOYK0eaAFwAHgAgAFNiAFNkgEBMZgBAKABAqABAaoBB2d3cy13aXqwAQo&sclient=psy-ab&ved=0ahUKEwi53sCm_ZHuAhXpiIsKHeNuD1YQ4dUDCAc&uact=5" class="social__item faceb">
            <div class="fa fa-facebook"></div>
        </a>
    </div>
    <div class="social">
        <a href="https://www.instagram.com/_postik_" class="social__item insta">
            <div class="fa fa-instagram"></div>
        </a>
    </div>
</div>
<div class="maincon">
        <p>
        <div class="compname" data-name = "ddd" id="RS">RS</div>
        <div class="compname" id="RI">RI</div> <div> & </div>   
        <div class="compname" id="PE">PE</div>
        <div class="compname" id="PA">PA</div>
        </p>
        
    </div>
    <div class="maincon" style="height: 30px;">
        <p style="font-size: 12px;"><b style="font-size: 14px;">©</b>Все права защищены 2021</p>
    </div>`); 

var rs = document.getElementById("RS");
rs.onmouseover = function () {
    rs.innerHTML = "RebuffedStudios"

}
rs.onmouseout = function () {
    rs.innerHTML = "RS"

}

var ri = document.getElementById("RI");
ri.onmouseover = function () {
    ri.innerHTML = "Rebuffed Inc."

}
ri.onmouseout = function () {
    ri.innerHTML = "RI"

}

var pe = document.getElementById("PE");
pe.onmouseover = function () {
    pe.innerHTML = "Posti Entertaiment"

}
pe.onmouseout = function () {
    pe.innerHTML = "PE"

}

var pa = document.getElementById("PA");
pa.onmouseover = function () {
    pa.innerHTML = "Posti Arts"

}
pa.onmouseout = function () {
    pa.innerHTML = "PA"

}

//var now = new Date().getTime();
//alert(now);