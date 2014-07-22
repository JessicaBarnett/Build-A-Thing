//drawer example at: http://www.savthecoder.com/blog/drawer-ui-jquery
var browserWidth = $(document).width();
var drawerIsOpen = false;


function openDrawer() {
    $(".status.frame").animate({
        position: "absolute",
        left: 0
    }, 800);
    drawerIsOpen = true;
}

function closeDrawer() {
    $(".status.frame").animate({
        position: "relative"

    }, 800);
    drawerIsOpen = false;
}

function toggleDrawer() {
    if (drawerIsOpen) {
        closeDrawer();
        drawerIsOpen = false;
    } else {
        openDrawer();
        drawerIsOpen = true;
    }
}