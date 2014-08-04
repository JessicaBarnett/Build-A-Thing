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
        thingForm = new ThingForm();
        thingForm.newForm($('div#status'));


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


/***********  Form View/Controller  *************/

function ThingForm(){
    this.thingData = { "name": "",
                "type": "" ,
                "shape": "" ,
                "food": "",
                "height": "",
                "movement": "",
                "habitat": "",
                "sound": "" ,
                "humanName": null
            };
    this.$parentNode = ""; 
    this.type= "Thing";
}

//created a new parent note in thingForm and calls formController
ThingForm.prototype.newForm = function($parentNode){
    this.$parentNode = $parentNode; 
    this.formController.apply(this);
    this.type="Thing";
};

//this starts the from-making process, and is added as a handler to both next buttons
ThingForm.prototype.formController = function() {

    this.collectThingData.apply(this); 

    if ($('[id*="form"]').length <= 0) { //if no form exists yet
        if (mqPhone.matches || !mqPhone.matches && !mqTab.matches) { //if phone or web view
            this.$parentNode.empty().append(this.formPage1.call(this)); 
        } else { //if tab view
            this.$parentNode.empty().append(this.formPage1.call(this));
            this.$parentNode.append(this.formPage2.call(this));
        }
    } else if ($("div#formPage1").length  > 0 && !$("div#formPage2").length) { //if phone or web view page 1
        this.$parentNode.empty().append(this.formPage2.call(this));
    } else if ($("div#formPage2").length  > 0) { //if phone/web view page 2 or tab view.  either way we're going to page 3
        this.$parentNode.empty().append(this.formPage3.call(this));
        this.filterFields();
    } 

    if($("div#formPage3").length  > 0) //if this is form page 3
        this.$parentNode.append(this.formButtons.call(this, true));
    else
        this.$parentNode.append(this.formButtons.call(this, false));

    //adds button for mobile.  hidden by default, unless in mobile view
    this.$parentNode.prepend($('<button id="closeDrawer"><img src="images/Arrow.svg" alt="back"></button>'));
    this.$parentNode.find("#closeDrawer").unbind("click", toggleDrawer).click(toggleDrawer);
}; 

//appends next and make buttons and adds handlers
ThingForm.prototype.formButtons = function(isLastPage) {
    var $formContainer = $('<div id="formButtons" class="group"></div>');

    $formContainer.append($('<button id="cancel">cancel</button>'));
    $formContainer.children("button#cancel").click($.proxy(this.cancelButtonHandler, this));

    if (isLastPage) {
        $formContainer.append($('<button id="make" disabled>Make!</button>'));
        $formContainer.children("button#make").click($.proxy(this.makeButtonHandler, this));
    } else {
        $formContainer.append($('<button id="next" disabled>next!</button>'));
        $formContainer.children("button#next").click($.proxy(this.formController, this));
    }

    return $formContainer;
};

//returns jQuery tree for select a thing type buttons, including handlers
ThingForm.prototype.formPage1 = function() {

    var $formContainer = $('<div id="formPage1"><div>');

    var types = ["Thing", "Mineral", "Living Thing", "Plant", "Animal"];
    var $tempLi, $typesUl;

    if(mqPhone.matches)
        $formContainer.append($('<h2>What type of '+this.type + '?</h2>'));
    else
        $formContainer.append($('<h2>What type of '+this.type + ' would you like to make?</h2>'));

    $typesUl = $('<ul id="types" class="group"></ul>');

    for (var i = 0; i < types.length; i++) {
        $tempLi = $('<li data="' + types[i] + '">' +
            '<div class="svgContainer">' +
            '<img src="images/' + types[i].replace(/\s/g, '') + '.svg" alt="' + types[i] + '">' +
            '</div>' +
            '</li>');

        $text = types[i] === "Animal" ? "An " + types[i] + "?" : "A " + types[i] + "?";
        if(mqPhone.matches){
            //$text = types[i];
            $text = "";
        }


        $tempLi.append('<p>'+ $text +'</p>');
        $typesUl.append($tempLi);
    }

    $formContainer.append($typesUl);

    
    $formContainer.find("#types li").on("click", this.typePickerHandler);
    $formContainer.find('input[type="text"]').change($.proxy(this.refreshButtons, this)); 

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

    $formContainer.find('input[type="radio"]').click($.proxy(this.togglePetHandler, this)); 
    $formContainer.find('input[type="text"]').change($.proxy(this.refreshButtons, this)); 

    return $formContainer;
};

//returns JQuery tree for thing Detail fields, including handlers
ThingForm.prototype.formPage3 = function() {
    var $formContainer = $('<div id="formPage3"><div>');
    var noun = mqPhone.matches ? "it" : "this " +  this.type ;

    $formContainer.append($('<h2>What is this ' + this.type + ' like?</h2>'));

    //each has a class that will be used as a handle for hiding/showing
    $formContainer.append(
        $('<label class="Thing" for="name">What is ' + noun + ' called?</label>'),
        $('<input class="Thing" id="name" type="text">'),
        $('<label class="Mineral" for="shape">How is ' + noun + ' shaped?</label>'),
        $('<input class="Mineral" id="shape" type="text">'),
        $('<label class="LivingThing" for="food" >What does ' + noun + ' eat?</label>'),
        $('<input class="LivingThing" id="food" type="text">'),
        $('<label class="Plant" for="height">How tall is ' + noun + '?</label>'),
        $('<input class="Plant" id="height" type="text">'),
        $('<label class="Animal" for="movement">How does ' + noun + ' move?</label>'),
        $('<input class="Animal" id="movement" type="text">'),
        $('<label class="Animal" for="habitat">Where does ' + noun + ' live?</label>'),
        $('<input class="Animal" id="habitat" type="text">'),
        $('<label class="Animal" for="sound">What sound does ' + noun + ' make?</label>'),
        $('<input class="Animal" id="sound" type="text">')
    );


    $formContainer.find('input[type="text"]').change($.proxy(this.refreshButtons, this)); 
    return $formContainer;
};

//handles when a type button is clicked
ThingForm.prototype.typePickerHandler = function(){
    //adds class that is a hook for the css and for the data collector
    $("#types li").removeClass("checked");
    $(this).addClass("checked");

    //using thingForm instead of calling with a proxy because I need 
    //access to the clicked element
    thingForm.refreshButtons();
    thingForm.refreshThingLabels($("#types .checked").attr("data"));
};

//takes input from typePickerHandler and updates thingForm.type with it
//chnges thing type presented in labels depending on the new type
ThingForm.prototype.refreshThingLabels = function(type){
    //refreshes text on page to reflect selected type
    this.type = type; 
    if (!mqPhone.matches){
        $("#formPage2 h2").text("Is this " + this.type + " a Pet?");
    }
};

//hides/shows form fields depending on the value stored in thingForm.type
ThingForm.prototype.filterFields = function(){

    $('#formPage3 label, #formPage3 input').hide();

    $(".Thing").show();

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
    }
    else{
        $("#humanName").show();
        $('label[for="humanName"]').show();
    }

    this.refreshButtons();
};

//removes/adds disabled attribute to make/next/complete buttons
//depends on outcome of isFormComplete method
ThingForm.prototype.refreshButtons = function(){
    var isComplete = this.isFormComplete.apply(this);

    if (isComplete){
        if($('button#make').length > 0) {
            $('button#make').removeAttr("disabled");
            $("button#make").focus(); //makes it possible to hit tab/enter instead of hitting make button
        }
        if($('button#next').length > 0) {
            $('button#next').removeAttr("disabled"); //enables next button  
        } 
    }
    else{
        if($('button#make').length > 0) {
            $('button#make').attr("disabled", "disabled");
        }
        if($('button#next').length > 0){
            $('button#next').attr("disabled", "disabled"); //disables next button
        }
    }
};

//returns true if all visible and necessary input fields are completed
ThingForm.prototype.isFormComplete = function(){

    var textFieldsComplete = true;

    if ($('div#status input[type="text"]').length > 0){
        //for each text input in $parentNode
        $('div#status input[type="text"]:visible').each(function(index, $element){
            $element = $($element); //makes it a jQuery object
            
            if ($element.val() === "")//if an empty field is encountered
                if ($element.attr("id") !== "humanName")//excluding humanName field
                    textFieldsComplete = false;
            });
    }

    if (textFieldsComplete === false)
        return false;

    //if there is a type selector and no type is selected
    if($('#types').length >= 1 && $('#types .checked').length < 1) 
        return false;

    //if it is a pet, but you didn't give it a name.
    if($('#togglePet input:checked').val() === "true" &&  $('#humanName').val() === "")
        return false;

    return true;
};

//handles cancel button events
ThingForm.prototype.cancelButtonHandler = function() {
    if (mqTab.matches) //close drawer on cancel
        toggleDrawer();
    else
        thingView.backToStart(); //revert to first-page form layout

    this.constructor(); //to clear data and start fresh with a new form
};

ThingForm.prototype.backButtonHandler = function(){} //Make this!!!

//handles make Button event.  makes new thing depending on data collected in thingForm.data, 
//adds it to the dom, and does necessary resetting of things.
ThingForm.prototype.makeButtonHandler = function() {
    this.collectThingData();

    var thingArgs = [this.thingData.name]; //will contain arguments from the text fields to use to make a new thing

    //definitely not as elegant as the old solution, 
    //but I can't pull from an object in order, so it can't be helped

    if (this.type === "Mineral")
        thingArgs.push(this.thingData.shape);
    else if (this.type === "LivingThing" || this.type === "Animal" || this.type === "Plant") {
        thingArgs.push(this.thingData.food)

        if (this.type === "Plant")
            thingArgs.push(this.thingData.height)
        else if (this.type === "Animal"){
            thingArgs.push(this.thingData.movement)
            thingArgs.push(this.thingData.habitat)
            thingArgs.push(this.thingData.sound)
        }
            
    }

    console.log(this.thingData["type"] + " ***** " + this.thingData["humanName"]  + " ***** " +  thingArgs);
    //makes new Thing with thingArgs array and adds it to the model
    var newThing = thingModel.makeAnyThing(this.thingData["type"], this.thingData["humanName"], thingArgs);
    thingModel.addThing(newThing);

    //removes "active" class from makeNewThing Button/makes new select button for the new Thing
    $("ul li.makeNewThing").removeClass("active");
    thingView.addGridSquare(newThing);

    //adds active clss to it
    $('li[data="' + newThing.name + '"]').addClass("active");

    //print's new thing's Status
    thingView.printThing(newThing);

    //adds listener for back button on small screens
    if (mqTab.matches) {
        $("#closeDrawer").on("click", toggleDrawer);
    }
};

//collects data from fields in $parentNode and stores them in thingData
ThingForm.prototype.collectThingData = function() {
    //iterates IDs in thingData
    //if/when an element matching a thingData ID is found, 
    //it's value is added to the object as the value of that id
    function matchFieldsID(property, value) {
        if (this.$parentNode.find("#".concat(property)).length > 0){ //if property exists in $parentNode
            this.thingData[property] = this.$parentNode.find("#".concat(property)).val();
        }
    }

    $.each(this.thingData, bind(matchFieldsID, this));
    //$(this.thingData).each(matchFieldsID.apply(this)); //this construct seems to only work for arrays

    if($("#types .checked").length > 0)
        this.thingData["type"] = $("#types .checked").attr("data"); 

    return this.thingData;
};


