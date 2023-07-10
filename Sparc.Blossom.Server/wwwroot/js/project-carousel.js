document.getElementById("carousel-backward").onmouseover = function () {
    document.getElementById("project-wrapper").style.animation = "scrollReverse 10s linear infinite !important";
}

document.getElementById("carousel-forward").onmouseover = function () {
    document.getElementById("project-wrapper").style.animation = "scroll 10s linear infinite !important";
}