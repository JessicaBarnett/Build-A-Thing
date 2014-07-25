/********** DOM MANIPULATORS/VIEW **********/


function ThingView() {}

//erases everything in the thingStatus window
ThingView.prototype.clearStatus = function() {
    $("div#status").children().remove();
};


//initializes the Grid using all objects currently in ThingModel.allThings
ThingView.prototype.makeGrid = function(thingModel) {
    var $parentNode = $("div#select ul");
    var $newNode = $('<li class= "thing blockColumn"></li>');

    //go throuh all objects in thingModel 
    for (propertyName in thingModel.allThings) {
        this.addGridSquare(thingModel.allThings[propertyName]);
    }
};

//adds a grid square to the SelectThing window.  It will refer to the Passed Thing.
ThingView.prototype.addGridSquare = function(thing) {
    $parentNode = $("div#select ul");
    $newNode = $('<li class="thing blockColumn"></li>'); //add a new li for each Thing in model
    $newNode.attr("data", thing.name); //add the object's name to the li's data attribute, 

    if (thing._isPet)
        $newNode.append('<p>' + thing.humanName + " the " + thing.name + '</p>');
    else
        $newNode.append('<p>' + thing.name + '</p>'); //put object's "name" property in the li as text

    $img = $('<div class="svgContainer"><img src="images/' + thing.type + '.svg" alt="' + thing.name + ' icon"></div>');
    $newNode.prepend($img);

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

    //create back drawer tab button for mobile view
    $parentNode.append($('<button id="closeDrawer"><img src="images/Arrow.svg" alt="back"></button>'));

    //create + add h2 

    h2contents = thing._getHeader();
    $h2 = $('<h2>' + h2contents + '</h2>');
    $parentNode.append($h2);

    //Creates picture & Stats

    $thingStatsWrapper = $('<div class="container"></div>');

    //create thing image
    $img = $('<div class="svgContainer three columns alpha"><img src="images/' + thing.type + '.svg" alt="' + thing.name + ' icon"></div>');

    //create thingStats ul
    $ul = $('<ul id="thingStats" class="three columns omega"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    this.refreshStats(thing, $ul); //adds thingStats to passed $ul

    //adds thingStats img and ul to thingStatsWrapper
    $thingStatsWrapper.append($img, $ul);
    //$thingStatsWrapper.append($ul);

    //adds thingStatsWrapper to parentNode
    $parentNode.append($thingStatsWrapper);


    //adds action window to parentNode
    $parentNode.append('<p id="actionWindow"></p>');

    //create thingActions ul
    $ul = $('<ul id="thingActions" class="blockContainer"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    //adds thingActions ul to parentNode after thingStats ul
    $parentNode.append($ul);

    for (property in thing) {
        //if property is a function, not the constructor method, and not a private method (indicated by an underscore)
        if (typeof thing[property] === "function" && property != "constructor" && property.indexOf("_") < 0) {
            var $button = $('<button class="blockColumn">' + property + '</button>');
            $button.on("click", thingActionHandler);
            $ul.append($button);
        }
    }

};

//removes and reprints stats in "ul#thingStats"
//prevents having to re-print all elements in 
//div#status everytime an action button is pressed
ThingView.prototype.refreshStats = function(thing, $parentNode) {
    var $ul = $parentNode || $("ul#thingStats"); //allows passing of a not-yet-in-dom ul
    $ul.empty(); //empties anything in ul already

    //gets stats as an array of $li elements, loops through and appends them to $ul
    forEach(this.getEssentialStats(thing), function($element) {
        $ul.append($element);
    });

    return $ul; //also returns ul, in case of not-yet-in-dom ul
};

//returns an array of jQuery li elements, each containing one of the passed Thing's stats
ThingView.prototype.getAllStats = function(thing) {
    var $allStats = [];

    //Adds Stats
    for (property in thing) {
        //And property is not a method, or marked as "private"
        if (typeof thing[property] != "function" && property.indexOf("_") < 0) {
            $allStats.push($("<li><p><strong>" + property + ":</strong> " + thing[property] + "</p></li>"));
        }
    }
    return $allStats;
};


//returns an array of jQuery elements containing the passed Thing's essential/updatable stats
ThingView.prototype.getEssentialStats = function(thing) {
    var $essentialStats = [];

    //Adds Stats
    for (property in thing) {
        //And property is not a method, or marked as "private"
        if (typeof thing[property] != "function" && property.indexOf("_") < 0 && thingModel.isEssentialStat(property)) {
            $essentialStats.push($("<li><p><strong>" + property + ":</strong> " + thing[property] + "</p></li>"));
        }
    }

    return $essentialStats;
};

ThingView.prototype.printProfile = function(thing) {
    $statsList = $("<ul></ul>");
    $statsList.append(this.getAllStats(thing));
    this.printToPopout($statsList);
}

ThingView.prototype.printAction = function(thing, action) {
    var actionText = thing[action](); //updates any status stuff that will be changed in the action
    thingView.refreshStats(thingModel.allThings[$("ul#thingStats").attr("data")], null); //prints updated/changed status
    $("p#actionWindow").text(actionText); //prints message AFTER stats have been changed, so it doesn't get erased by printThing
};

ThingView.prototype.printActionPopout = function(thing, action) {
    var actionText = thing[action](); //gets text to be printed 
    thingView.refreshStats(thingModel.allThings[$("ul#thingStats").attr("data")], null); //prints updated/changed status
    this.printToPopout($("<p>" + actionText + "</p>")); //sends text to printToPopout for printing
};

//takes a jquery element.  adds a popout window to thingStats and appends those elements to it. 
//saves state of page before appendint.  adds a click handler for the okay button, which will restore the page.  
ThingView.prototype.printToPopout = function($elements) {
    var $statusWindow = $("div#status"),
        $savedWindow,
        $popOut;

    //saves state of statusWindow to use when okay button is hit
    $savedWindow = $statusWindow.children().not($("h2")).not($("button#closeDrawer")).detach();

    $popOut = $('<div id="profile" class="group"></div>');

    $popOut.append($elements);

    //creates okay button.  adds handler which reverts page back to state saved in $savedWindow
    $popOut.append('<button autofocus>Okay!</button>').click(function() {
        $statusWindow.children().not($("h2")).not($("button#closeDrawer")).remove();
        $statusWindow.append($savedWindow);
    });

    $statusWindow.append($popOut);
}


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

//I KNOW there's a better way to do this... just not sure how yet.
//JSON maybe?
ThingView.prototype.generateForm = function() {
    var $parentNode = $("div#status");

    var $makeThingWrapper = $("<fieldset>").attr("id", "makeThingForm");

    //create back drawer tab button for mobile view
    $parentNode.append($('<button id="closeDrawer"><img src="images/Arrow.svg" alt="back"></button>'));

    //adds h2
    var $heading = $('<h2>Make A New Thing!</h2>');
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