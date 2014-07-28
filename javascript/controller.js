//Media Queries

var mqTab = window.matchMedia("(max-width: 1000px)");
var mqPhone = window.matchMedia("screen and (min-width: 200px) and (max-width: 750px)");
var mqPhoneWide = window.matchMedia("screen and (min-width: 300px) and (max-width: 750px) and (orientation: landscape)");


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
    console.log(self);

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
    $("#select ul").find("li").each(function( /*index, element*/ ) {
        if ($(this).hasClass("active")) //element.hasClass instead of "this"?
            $(this).removeClass("active");
    });

    //add "active" class to current li
    $(self).addClass("active");
}

//handles when a user clicks on the "Make This Thing!" button
function makeThingButtonHandler() {
    var thingType = $("#typeSelector").val(),
        thingName = $("#makeThingForm input#name").val();
    var petName = $('input#humanName').val() || null;

    var thingArgs = []; //will contain arguments from the text fields to use to make a new thing

    //adds value of text field only if field is visible 
    //(which it will be if it's not necessary for this type of thing)
    $("#variableFields").children("input:visible").each(function() {
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