/* 
//NOTES ON "THIS"
// I have an unknown # of arguments, so I need to use call or apply to create objects in here.
// this means I need something to pass as "this."  
// if I create makeAnyThing as a method of ThingModel, "this" refers to ThingModel
// if I create makeAnyThing as a regular function, "this" refers to window.
// tried various things: this["Thing"], window["Thing"], Thing, Thing.prototype, 
// Thing.prototype.constructor. "this" always refers to undefined
// I think the thing passed as "this" has to be an actual object, 
// not a pointer to a constructor function.  That would make sense.  
// so now I'm making an empty Thing-like object (had to go back and make parameters optional)
// then applying the constructor function to it.  Seems to be working.
*/


/********** DOM MANIPULATORS/VIEW **********/


function ThingView() {}

//initializes the Grid using all objects currently in ThingModel.allThings
ThingView.prototype.makeGrid = function(thingModel) {
    var $parentNode = $("div#select ul");
    var $newNode = $('<li class= "thing one columns"></li>');

    //go throuh all objects in thingModel 
    for (propertyName in thingModel.allThings) {
        this.addGridSquare(thingModel.allThings[propertyName]);
    }
};

//adds a grid square to the SelectThing window.  It will refer to the Passed Thing.
ThingView.prototype.addGridSquare = function(thing) {
    $parentNode = $("div#select ul");
    $newNode = $('<li class="thing two columns"></li>'); //add a new li for each Thing in model
    $newNode.attr("data", thing.name); //add the object's name to the li's data attribute, 
    if (thing._isPet)
        $newNode.text(thing.humanName + " the " + thing.name);
    else
        $newNode.text(thing.name); //put object's "name" property in the li as text
    $parentNode.append($newNode);

    //re-sets event handler so it will apply to newly-generated elements
    $("div#select ul li").unbind("click", selectButtonHandler);
    $("div#select ul li").on("click", selectButtonHandler);
};


//Prints the Stats and Actions of passed thing in the "ThingStats" window
ThingView.prototype.printThing = function(thing) {
    var $h2, h2contents, $ul;
    var $parentNode = $("#status");
    var $listItems = [];

    $parentNode.empty();

    //create + add h2 

    h2contents = thing._getHeader();
    $h2 = $("<h2>" + h2contents + "</h2>");
    $parentNode.append($h2);

    //create thingStats ul
    $ul = $('<ul id="thingStats"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    //adds thingStats ul to parentNode
    $parentNode.append($ul);

    //Adds Stats
    for (property in thing) {
        //if property is an "essential stat"
        //And property is not a method, or marked as "private"
        if (typeof thing[property] != "function" && property.indexOf("_") < 0) {
            $ul.append($("<li><strong>" + property + ":</strong> " + thing[property] + "</li>"));
        }
    }

    //adds action window to parentNode
    $parentNode.append('<p id="actionWindow"></p>');

    //create thingActions ul
    $ul = $('<ul id="thingActions" class="container"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    //adds thingActions ul to parentNode after thingStats ul
    $parentNode.append($ul);

    for (property in thing) {
        //if property is a function, not the constructor method, and not a private method (indicated by an underscore)
        if (typeof thing[property] === "function" && property != "constructor" && property.indexOf("_") < 0) {
            var $button = $('<button class="two columns">' + property + '</button>');
            $button.on("click", thingActionHandler);
            $ul.append($button);
        }
    }

};

//when form is open, hides/shows fields depending on which Thing Type
//is selected, and whether it is a Pet
ThingView.prototype.refreshForm = function() {
    var type = $("select#typeSelector").val();
    // get thingType from select box

    $("#variableFields").children().hide();

    $("#variableFields  input#name").show();
    $("#variableFields label[for=name]").show();
    $("#variableFields button").show();

    if (type === "Mineral")
        $(".mineral").show();
    else if (type === "LivingThing" || type === "Animal" || type === "Plant") {
        $(".livingThing").show();

        if (type === "Plant")
            $(".plant").show();
        else if (type === "Animal")
            $(".animal").show();
    }

    if ($('#petRadio input:checked').val() && $('#petRadio input:checked').val().indexOf("true") >= 0) {
        //long conditional and indexOf necessary because .val() returns a string, not a boolean
        $("#petFields").show();
    }

};

//erases everything in the thingStatus window
ThingView.prototype.clearStatus = function() {
    $("div#status").children().remove();
};

//I KNOW there's a better way to do this... just not sure how yet.
//JSON maybe?
ThingView.prototype.generateForm = function() {
    var $parentNode = $("div#status");

    var $makeThingWrapper = $("<fieldset>").attr("id", "makeThingForm");

    //adds h2
    var $heading = $("<h2>").text("Make a New Thing!");
    $makeThingWrapper.append($heading);

    //adds type selector select box
    var $typeSelectorDiv = $('<div>');
    var $typeSelector = $('<select>').attr("id", "typeSelector")
        .append($('<option selected value="Thing">Thing</option>'),
            $('<option value="Mineral">Mineral</option>'),
            $('<option value="LivingThing">Living Thing</option>'),
            $('<option value="Plant">Plant</option>'),
            $('<option value="Animal">Animal</option>'));
    $makeThingWrapper.append($typeSelectorDiv.append($typeSelector));

    //adds "is this a pet?" radio buttons
    $petSelectorDiv = $("<div>").attr("id", "petRadio");
    $petSelectorDiv.append($('<label for="isPet">Is this thing a pet?</label>'),
        $('<input type="radio" name="isPet" value="true">'),
        $('<label for="isPet">Yes!</label>'),
        $('<input type="radio" name="isPet" value="false">'),
        $('<label for="isPet">No</label>')
    );

    $makeThingWrapper.append($petSelectorDiv);

    //adds all possible fields
    var $variableFieldset = $('<fieldset>').attr("id", "variableFields"),
        $petFieldset = $("<fieldset>").attr("id", "petFields");

    $petFieldset.append($("<label for='humanName'>What is this Pet's human name?</label>"),
        $('<input id="humanName" type="text">'));
    $variableFieldset.append($petFieldset);

    $variableFieldset.append(
        $('<label for="name">Name: </label>'),
        $('<input id="name" type="text">'),
        $('<label for="shape" class="mineral">Shape: </label>'),
        $('<input id="shape" class="mineral" type="text">'),
        $('<label for="food" class="livingThing">Food: </label>'),
        $('<input id="food" class="livingThing" type="text">'),
        $('<label for="height" class="plant" >How tall is this thing?  (in inches)</label>'),
        $('<input id="height" class="plant" type="text">'),
        $('<label for="movement" class="animal">How does this thing move?</label>'),
        $('<input id="movement"  class="animal" type="text">'),
        $('<label for="habitat" class="animal">Where does this thing live?</label>'),
        $('<input id="habitat" class="animal" type="text">'),
        $('<label for="sound" class="animal">What sound does this thing make?</label>'),
        $('<input id="sound" class="animal" type="text">'));

    // $petFieldset = $("<fieldset>").attr("id", "petFields");
    // $petFieldset.append($("<label for='humanName'>What is this Pet's human name?</label>"),
    //     $('<input id="humanName" type="text">'));
    // $variableFieldset.append($petFieldset);
    $variableFieldset.append($('<button type="submit" id="makeThingButton">Make This Thing!</button>'));

    $makeThingWrapper.append($variableFieldset);

    $parentNode.append($makeThingWrapper);
    $variableFieldset.children().hide();
    this.refreshForm(); //to hide all non-applicable fields
};