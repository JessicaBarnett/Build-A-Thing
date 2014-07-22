//Note: JS Media Queries awesome reference: http://www.sitepoint.com/javascript-media-queries/
//Note: matchMediaObject.matches returns a true or false depending on query result 
var mq900px = window.matchMedia("(max-width: 900px)");

$(window).ready(resizeHandler).resize(resizeHandler);
$(".thing").click(selectButtonHandler);

function resizeHandler() {
    browserWidth = $(document).width();
    if (mq900px.matches) {
        $(".frame").removeClass("half-screen");
        $(".frame").addClass("full-screen");

        //if drawer is open, show status window.  Otherwise, hide it.  
        $(".status").css("left", function() {
            if (drawerIsOpen) {
                return 0;
            } else {
                return browserWidth;
            }
        });

    } else {

        $(".frame").removeClass("full-screen");
        $(".frame").addClass("half-screen");

    }
}

function selectButtonHandler() {
    if (mq900px.matches) {
        toggleDrawer();
        $("#closeDrawer").click(selectButtonHandler);
    }
}