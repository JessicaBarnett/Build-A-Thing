//********* CONTROLLER **********/
var thingModel = new ThingModel();
var thingView = new ThingView();
var thingForm = new ThingForm();

thingModel.makeStarterThings();
thingView.makeGrid(thingModel);

//**********  	event handlers   ************//



//handles when user picks a button on the grid
//$("div#select ul li").on("click", selectButtonHandler);
//don't need this ^ ^  Handler is being added in makeGrid/AddGridSquare functions 
//(so that they can be unbound and reattached as new things are added)

//handles when user clicks on a button in the select-a-thing grid
//directs to either make-a-thing functions or print-thing functions
function selectButtonHandler() {
    var self = this;

    makeButtonActive(self); //highlights this button

    thingView.clearStatus(); //clears whatever's in the status window 

    //if this is the makeNewThing button, show the makeThing form
    if ($(this).hasClass("makeNewThing")) { //generates a new form
        thingForm.newForm($('div#status'));

        if (mqTab.matches)
            toggleDrawer();


        //code for old form:
        //thingView.generateForm();
        //adds Form Event Listeners 
        // $("#typeSelector").change(thingView.refreshForm); //adds listener to refresh form when user chooses a new Thing Type
        // $("#petRadio input").change(thingView.refreshForm); //adds listener to refresh form when is/isn't pet changes
        // $("#makeThingForm button").on("click", makeThingButtonHandler);

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
    //$("#makeThingForm").hide();

    //removes "active" class from makeNewThing Button
    $("ul li.makeNewThing").removeClass("active");

    //create new select button for the new Thing
    thingView.addGridSquare(newThing);

    //add active class to it
    $('li[data="' + newThing.name + '"]').addClass("active");

    //print's new thing's Status
    thingView.printThing(newThing);

    //has access to toggleDrawer, even though mobile.js (which has toggleDrawer in it) is loaded after view in index.html
    //this is because these functions are only being called later on, in controller
    if (mqTab.matches) {
        $("#closeDrawer").on("click", toggleDrawer);
    }

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




/***********  Form Controller  *************/

function ThingForm(){
    this.thingData = { "name": "",
                "type": "",
                "shape": "",
                "food": "",
                "height": "",
                "movement": "",
                "habitat": "",
                "sound": "",
                "happy": "",
                "humanName": ""
            };
        this.$parentNode = ""; 
        this.type= "Thing";
}

ThingForm.prototype.newForm = function($parentNode){
    this.$parentNode = $parentNode; 
    this.formController();
};

//this starts the from-making process, and is added as a handler to both next buttons
ThingForm.prototype.formController = function() {

    this.collectThingData();

    if ($('[id*="form"]').length <= 0) { //if no form exists yet
        if (mqPhone.matches) {
            this.$parentNode.empty().append(this.formPage1()); 
        } else {
            this.$parentNode.empty().append(this.formPage1());
            this.$parentNode.append(this.formPage2());
        }
    } else if ($("div#formPage1").length  > 0 && !$("div#formPage2").length) { //if phone view page 1
        this.$parentNode.empty().append(this.formPage2());
    } else if ($("div#formPage2").length  > 0) { //if phone view page 2 or tab/web view.  either way we're going to page 3
        this.$parentNode.empty().append(this.formPage3());
        this.filterFields();
    } 

    if($("div#formPage3").length  > 0) //have my jQuery selectors been returning arrays this whole time????  How didn't I notice??
        this.$parentNode.append(this.formButtons(true));
    else
        this.$parentNode.append(this.formButtons(false));
};

//appends next and make buttons and adds handlers 
ThingForm.prototype.formButtons = function(isLastPage) {
    var $formContainer = $('<div id="formButtons" class="group"></div>');

    $formContainer.append($('<button id="cancel">cancel</button>'));
    $formContainer.children("button#cancel").click($.proxy(this.cancelButtonHandler, this));

    if (isLastPage) {
        $formContainer.append($('<button id="make">Make!</button>'));
        $formContainer.children("button#make").click($.proxy(this.makeButtonHandler, this));
    } else {
        $formContainer.append($('<button id="next">next!</button>'));
        $formContainer.children("button#next").click($.proxy(this.formController, this));
    }

    return $formContainer;
};

//returns jQuery tree for select a thing type buttons, including handlers
ThingForm.prototype.formPage1 = function() {

    var $formContainer = $('<div id="formPage1"><div>');

    var types = ["Thing", "Mineral", "Living Thing", "Plant", "Animal"];
    var $tempLi, $typesUl;

    $formContainer.append($('<h2>What type of '+this.type + ' would you like to make?</h2>'));

    $typesUl = $('<ul id="types" class="group"></ul>');

    for (var i = 0; i < types.length; i++) {
        $tempLi = $('<li data="' + types[i] + '">' +
            '<div class="svgContainer">' +
            '<img src="images/' + types[i].replace(/\s/g, '') + '.svg" alt="' + types[i] + '">' +
            '</div>' +
            '</li>');

        $text = types[i] === "Animal" ? "An " + types[i] + "?" : "A " + types[i] + "?";;

        $tempLi.append($text);
        $typesUl.append($tempLi);
    }

    $formContainer.append($typesUl);

    
    $formContainer.find("#types li").on("click", this.typePickerHandler);


    return $formContainer;
};

//returns jQuery tree for is pet and pet Name fields/buttons, including handlers
ThingForm.prototype.formPage2 = function() {
    var $formContainer = $('<div id="formPage2"><div>');

    $formContainer.append($("<h2>Is this " + this.type + " a Pet?</h2>"));

    $formContainer.append($('<div id="relativeWrap"><fieldset id="togglePet" class="group"></fieldset></div>'));

    $formContainer.find("#togglePet").append(
        $('<input type="radio" name="isPet" value="true">'),
        $('<label for="isPet">Yes!!</label>'),
        $('<input type="radio" name="isPet" value="false">'),
        $('<label for="isPet">No</label>')
    );

    $formContainer.append($('<label for="humanName">What is this Pet\'s Name?</label>'));
    $formContainer.append($('<input id="humanName" class="petField" type="text">'))

    $formContainer.find('#togglePet input[type="radio"]').click($.proxy(this.togglePetHandler, this)); 

    return $formContainer;
};

//returns JQuery tree for thing Detail fields, including handlers
ThingForm.prototype.formPage3 = function() {
    var $formContainer = $('<div id="formPage3"><div>');

    $formContainer.append($('<h2>What is this ' + this.type + ' like?</h2>'));

    //each has a class that will be used as a handle for hiding/showing
    $formContainer.append(
        $('<label class="Thing" for="name">What is this ' + this.type + ' called?</label>'),
        $('<input class="Thing" id="name" type="text">'),
        $('<label class="Mineral" for="shape" class="mineral">How is this ' + this.type + ' shaped?</label>'),
        $('<input class="Mineral" id="shape" class="mineral" type="text">'),
        $('<label class="LivingThing" for="food" class="livingThing">What does this ' + this.type + ' eat?</label>'),
        $('<input class="LivingThing" id="food" class="livingThing" type="text">'),
        $('<label class="Plant" for="height" class="plant" >How tall is this ' + this.type + '?</label>'),
        $('<input class="Plant" id="height" class="plant" type="text">'),
        $('<label class="Animal" for="movement" class="animal">How does this ' + this.type + ' move?</label>'),
        $('<input class="Animal" id="movement"  class="animal" type="text">'),
        $('<label class="Animal" for="habitat" class="animal">Where does this ' + this.type + ' live?</label>'),
        $('<input class="Animal" id="habitat" class="animal" type="text">'),
        $('<label class="Animal" for="sound" class="animal">What sound does this ' + this.type + ' make?</label>'),
        $('<input class="Animal" id="sound" class="animal" type="text">')
    );

    return $formContainer;
};

//handles when a type button is clicked
ThingForm.prototype.typePickerHandler = function(){
    //adds class that is a hook for the css and for the data collector
    $("#types li").removeClass("checked");
    $(this).addClass("checked");

    thingForm.refreshThingLabels($("#types .checked").attr("data"));
};

ThingForm.prototype.refreshThingLabels = function(type){
    //refreshes text on page to reflect selected type
    this.type = type; 
    if (!mqPhone.matches){
        $("#formPage2 h2").text("Is this " + this.type + " a Pet?");
    }
};

ThingForm.prototype.filterFields = function(){

    $('#formPage3 label, #formPage3 input').hide();

    if (this.type === "Mineral")
        $(".Mineral").show();
    else if (this.type === "LivingThing" || this.type === "Animal" || this.type === "Plant") {
        $(".LivingThing").show();

        if (this.type === "Plant")
            $(".Plant").show();
        else if (this.type === "Animal")
            $(".Animal").show();
    }
};

//enables pet name field when petRadio is set to yes
ThingForm.prototype.togglePetHandler = function() {
    //if petradio isn't empty, and the value is true, show pet fields
    if ($('#togglePet input:checked').val() === "false") { 
        //note that .val() returns a string, not a boolean.
        $("#humanName").hide();
        $('label[for="humanName"]').hide();
        //$("#humanName").css("background-color", "lightGray").attr("disabled", "disabled");
    }
    else{
        $("#humanName").show();
        $('label[for="humanName"]').show();
        //$("#humanName").css("background-color", "white").removeAttr("disabled");
    }
};

//handles cancel button events
ThingForm.prototype.cancelButtonHandler = function() {
    if (mqTab.matches) //close drawer on cancel
        toggleDrawer();
    else
        thingView.backToStart(); //revert to first-page form layout

    this.constructor(); //to clear data and start fresh with a new form
};


ThingForm.prototype.makeButtonHandler = function() {
    this.collectThingData();



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
    //$("#makeThingForm").hide();

    //removes "active" class from makeNewThing Button
    $("ul li.makeNewThing").removeClass("active");

    //create new select button for the new Thing
    thingView.addGridSquare(newThing);

    //add active class to it
    $('li[data="' + newThing.name + '"]').addClass("active");

    //print's new thing's Status
    thingView.printThing(newThing);

    //has access to toggleDrawer, even though mobile.js (which has toggleDrawer in it) is loaded after view in index.html
    //this is because these functions are only being called later on, in controller
    if (mqTab.matches) {
        $("#closeDrawer").on("click", toggleDrawer);
    }
};

//collects data from fields in $parentNode and stores them in thingData
ThingForm.prototype.collectThingData = function() {
    //iterates IDs in thingData
    //if/when an element matching a thingData ID is found, 
    //it's value is added to the object as the value of that id
    $.each(this.thingData, $.proxy(matchFieldsID, this));

    this.thingData.type = $("#types .checked").attr("data"); 

    function matchFieldsID(property, value) {
        if (this.$parentNode.find("#".concat(property)).length > 0){ //if property exists in $source 
            this.thingData[property] = this.$parentNode.find(property).val();
        }
    }

    return this.thingData;
}



