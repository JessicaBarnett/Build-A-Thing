//drawer example at: http://www.savthecoder.com/blog/drawer-ui-jquery
var browserWidth = $(document).width();
var drawerIsOpen = false;

function openDrawer() {
    $(".status.frame").animate({
        left: 0
    }, 500);
    drawerIsOpen = true;
}

function closeDrawer() {
    $(".status.frame").animate({
        left: browserWidth
    }, 500);
    drawerIsOpen = false;
}

function toggleDrawer() {
    if (drawerIsOpen) {
        closeDrawer();
    } else {
        openDrawer();
    }
}