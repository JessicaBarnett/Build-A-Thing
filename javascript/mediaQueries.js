//JS Media Queries awesome reference: http://www.sitepoint.com/javascript-media-queries/
var mq900px = window.matchMedia("(max-width: 900px)");

//matchMediaObject.matches returns a true or false depending on query result

$(window).ready(resizeHandler).resize(resizeHandler);

function resizeHandler() {
    browserWidth = $(document).width();
    console.log(browserWidth);
    if (mq900px.matches) {
        $(".frame").removeClass("half-screen");
        $(".frame").addClass("full-screen");


        //$("#select").css("background-color", "orange"); //temporary test to see if media query is working
    } else {
        $(".frame").removeClass("full-screen");
        $(".frame").addClass("half-screen");


        //$("#select").css("background-color", "lightgreen"); //temporary test to see if media query is working
    }
}