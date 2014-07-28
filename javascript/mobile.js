//Note: JS Media Queries awesome reference: http://www.sitepoint.com/javascript-media-queries/
//Note: matchMediaObject.matches returns a true or false depending on query result 

//********  Drawer  *********/

var browserWidth = $(document).width();
var drawerIsOpen = false;

//drawer example at: http://www.savthecoder.com/blog/drawer-ui-jquery

function openDrawer() {
    $(".status.frame").animate({
        left: 0
    }, 500, function() {
        $("div.select").hide();
    });
    drawerIsOpen = true;
}

function closeDrawer() {
    $("div.select").show();
    $(".status.frame").animate({
        left: -browserWidth
    }, 500);
    drawerIsOpen = false;
}

function toggleDrawer() {
    if (drawerIsOpen) {
        closeDrawer();
    } else {
        openDrawer();
    }

    //$("#closeDrawer").click(thingView.selectButtonHandler);
}


//******** Mobile specific handlers ********//

$(window).ready(resizeHandler).resize(resizeHandler);
$(".thing").on("click", mobileSelectButtonHandler); //buttons should have 2 select handlers now

//changes layout depending on how big the viewport is
//runs on page load, and whenever the window resizes
function resizeHandler() {
    browserWidth = $(document).width();
    //console.log(browserWidth);

    //if this is a tablet width or smaller
    if (mqTab.matches) {
        thingView.convertLayoutToTablet();

        //removes old mobile handlers and adds new one
        $('.thing').unbind("click", mobileSelectButtonHandler);
        $('.thing').click(mobileSelectButtonHandler);
    } else {
        thingView.convertLayoutFromTablet();
        $(".thing").unbind("click", mobileSelectButtonHandler);
    }

    //if this is a phone landscape layout...
    if (mqPhoneWide.matches) {
        thingView.convertLayoutToWidePhone();
    } else {
        thingView.convertLayoutFromWidePhone();
    }
}


//adds drawer listener if this is a tablet viewport size or smaller
function mobileSelectButtonHandler() {
    if (mqTab.matches) { //this mq check is a little redundant
        toggleDrawer();

        //re-adding handler because, if this thing was just selected, 
        //the back button was re-written during thingView.printThing,
        //and wont have a handler
        $("#closeDrawer").unbind("click", toggleDrawer); //removes all click listeners if there is already are some
        $("#closeDrawer").on("click", toggleDrawer);
    }
}