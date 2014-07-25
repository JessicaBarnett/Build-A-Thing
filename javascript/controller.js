//Media Queries

var mqTab = window.matchMedia("(max-width: 930px)");
var mqPhone = window.matchMedia("screen and (max-width: 550px)");
var mqPhoneWide = window.matchMedia("screen and (max-width: 550px) and (orientation:landscape)");


//********* CONTROLLER **********/
var thingModel = new ThingModel();
var thingView = new ThingView();

thingModel.makeStarterThings();
thingView.makeGrid(thingModel);

//**********  	event handlers   ************//

//handles when user picks a button on the grid
$("div#select ul li").on("click", selectButtonHandler);

//handles when user clicks on a button in the select-a-thing grid
function selectButtonHandler() {
    var self = this;

    makeButtonActive(self);

    thingView.clearStatus(); //clears whatever's in the status window 

    //if this is the makeNewThing button, show the makeThing form
    if ($(this).hasClass("makeNewThing")) { //generates a new form
        thingView.generateForm();

        //adds Form Event Listeners 
        $("#typeSelector").change(thingView.refreshForm); //adds listener to refresh form when user chooses a new Thing Type
        $("#petRadio input").change(thingView.refreshForm); //adds listener to refresh form when is/isn't pet changes
        $("#makeThingForm button").on("click", makeThingButtonHandler);
    } else //get object current li relates to, print status of that object
    { //console.log("selectButtonHandler: " + thingModel.allThings[$(this).attr("data")].name);
        thingView.printThing(thingModel.allThings[$(this).attr("data")]);
    }
}

//when user clicks on a button in div#select, remove "active" class
//from whichever button has it, and add "active" to current target
function makeButtonActive(self) {
    //go through each li in ul.  if it has an "active" class, remove it
    $("ul").find("li").each(function( /*index, element*/ ) {
        if ($(this).hasClass("active")) //element.hasClass instead of "this"?
            $(this).removeClass("active");
    });

    //add "active" class to current li
    $(self).addClass("active");
}

//handles when a user clicks on the "Make This Thing!" button
function makeThingButtonHandler() {
    //console.log("button clicked");
    var thingType = $("#typeSelector").val(),
        thingName = $("#makeThingForm input#name").val();
    var petName = $('input#humanName').val() || null;

    var thingArgs = []; //collects arguments from the text fields to use to make a new thing

    $("#variableFields").children("input:visible").each(function() { //adds value of text field only if field is visible
        thingArgs.push($(this).val());
    });

    //makes new Thing with thingArgs array
    var newThing = thingModel.makeAnyThing(thingType, petName, thingArgs);
    //adds it to the model
    thingModel.addThing(newThing);

    //hides form
    $("#makeThingForm").hide();

    //removes "active" class from makeNewThing Button
    $("ul li.makeNewThing").removeClass("active");

    //create new select button for the new Thing
    thingView.addGridSquare(newThing);

    //add active class to it
    $('li[data="' + newThing.name + '"]').addClass("active");

    //print's new thing's Status
    thingView.printThing(newThing);
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