//Note: JS Media Queries awesome reference: http://www.sitepoint.com/javascript-media-queries/
//Note: matchMediaObject.matches returns a true or false depending on query result 

/* queries declared at top of controller.js */

$(window).ready(resizeHandler).resize(resizeHandler);
$(".thing").click(selectButtonHandler);

//changes layout depending on how big the viewport is
//runs on page load, and whenever the window resizes
function resizeHandler() {
    browserWidth = $(document).width();
    //console.log(browserWidth);

    //if this is a tablet width or smaller
    if (mqTab.matches) {
        thingView.convertLayoutToTablet();
    } else {
        thingView.convertLayoutFromTablet();
    }

    //if this is a phone landscape layout...
    if (mqPhoneWide.matches) {
        thingView.convertLayoutToWidePhone();
    } else {
        thingView.convertLayoutFromWidePhone();
    }
}

//adds drawer listener if this is a tablet viewport size or smaller
function selectButtonHandler() {
    if (mqTab.matches) {
        toggleDrawer();
        $("#closeDrawer").click(selectButtonHandler); //re-adding handler because button was re-written to dom
    } else {
        $("#closeDrawer").click(selectButtonHandler);
    }
}