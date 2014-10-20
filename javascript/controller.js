//********* CONTROLLER (kind of?) **********/
var thingModel = new ThingModel();
var thingView = new ThingView();
var thingForm = new ThingForm();

thingModel.makeStarterThings();
thingView.makeGrid(thingModel);

//**********  	event handlers   ************//

//handles when user clicks on a button in the select-a-thing grid
//directs to either make-a-thing functions or print-thing functions
function selectButtonHandler() {
    var self = this;

    makeButtonActive(self); //highlights this button

    thingView.clearStatus(); //clears whatever's in the status window 

    //if this is the makeNewThing button, show the makeThing form
    if ($(this).hasClass("makeNewThing")) { //generates a new form
        thingForm = new ThingForm();
        thingForm.newForm($('div#status'));

    } else //get object current li relates to, print status of that object
    {
        thingView.printThing(thingModel.allThings[$(this).attr("data")]);
    }

}

//when user clicks on a button in div#select, remove "active" class
//from whichever button has it, and add "active" to current target
function makeButtonActive(self) {
    //go through each li in ul.  if it has an "active" class, remove it
    $("#select ul").find("li").each(function( /*index, element*/ ) {
        if ($(this).hasClass("active")) //element.hasClass instead of "this"?
            $(this).removeClass("active");
    });

    //add "active" class to current li
    $(self).addClass("active");
}


function thingActionHandler() {
    var thingObject = thingModel.allThings[$("ul#thingStats").attr("data")]; //gets name of thing from data attribute in thingStats
    var methodName = $(this).text(); //gets text in button clicked
    if (methodName === "profile") { //if this is the profile action...
        thingView.printProfile(thingObject);
    } else { //if this is any other action...
        if (mqPhone.matches) {
            thingView.printActionPopout(thingObject, methodName);
        } else {
            thingView.printAction(thingObject, methodName);
        }
    }
}

