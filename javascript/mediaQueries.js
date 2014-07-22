//Note: JS Media Queries awesome reference: http://www.sitepoint.com/javascript-media-queries/
//Note: matchMediaObject.matches returns a true or false depending on query result 
var mqBreakOne = window.matchMedia("(max-width: 930px)");

$(window).ready(resizeHandler).resize(resizeHandler);
$(".thing").click(selectButtonHandler);

function resizeHandler() {
    browserWidth = $(document).width();
    if (mqBreakOne.matches) {
        $(".frame").removeClass("half-screen");
        $(".frame").addClass("full-screen");

        //if drawer is open, show status window.  Otherwise, hide it.  
        $(".status").css("left", function() {
            if (drawerIsOpen) {
                return 0;
            } else {
                //return browserWidth;
                return -browserWidth;
            }
        });

    } else {

        $(".frame").removeClass("full-screen");
        $(".frame").addClass("half-screen");

    }
}

function selectButtonHandler() {
    if (mqBreakOne.matches) {
        toggleDrawer();
        $("#closeDrawer").click(selectButtonHandler);
    }
}