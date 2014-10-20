//*******  Media Queries  *******//
var mqTab = window.matchMedia("(max-width: 900px)");
var mqPhone = window.matchMedia("screen and (min-width: 200px) and (max-width: 750px)");

var mqPhoneWide = window.matchMedia("screen and (min-width: 300px) and (max-width: 748px) and (orientation: landscape)");

/********** DOM MANIPULATORS/VIEW **********/

function ThingView() {}

//*********  Select Thing Grid  **********//

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

    //changing display text on button if a pet 
    if (thing._isPet)
        $newNode.append('<p>' + thing.humanName + " the " + thing.name + '</p>');
    else
        $newNode.append('<p>' + thing.name + '</p>'); //put object's "name" property in the li as text

    //creating/adding image
    $img = $('<div class="svgContainer"><img src="images/' + thing.type + '.svg" alt="' + thing.name + ' icon"></div>');
    $newNode.prepend($img);

    $parentNode.append($newNode);

    //re-sets event handler on ALL #select li elements
    //so it will apply to any newly-generated elements too
    $(".thing").unbind("click", selectButtonHandler);
    $(".thing").click(selectButtonHandler);

    //also resets mobile selectButton handlers
    $('.thing').unbind("click", mobileSelectButtonHandler);
    $('.thing').click(mobileSelectButtonHandler);

};

//********* Thing Status *********//

//erases everything in the thingStatus window
ThingView.prototype.clearStatus = function() {
    $("div#status").children().remove();
};


ThingView.prototype.backToStart = function() {
    $("div#status").children().remove();
    $("div#status").append('<h2>Choose a Thing to get started!!</h2>');
};

//Prints the Stats and Actions of passed thing in the "ThingStats" window
ThingView.prototype.printThing = function(thing) {
    var $h2, h2contents, $ul;
    var $parentNode = $("#status");
    var $listItems = [];

    $parentNode.empty();
    $parentNode.attr("data", thing.name);

    //create back drawer tab button for mobile view
    $parentNode.append($('<button id="closeDrawer"><img src="images/Arrow.svg" alt="back"></button>'));

    //create + add h2 

    h2contents = thing._getHeader();
    $h2 = $('<h2>' + h2contents + '</h2>');
    $parentNode.append($h2);

    //Creates picture & Stats

    $thingStatsWrapper = $('<div class="container"></div>');

    //create thing image
    $img = $('<div id="svgContainer" class="svgContainer three columns alpha"><img src="images/' + thing.type + '.svg" alt="' + thing.name + ' icon"></div>');

    //create thingStats ul
    $ul = $('<ul id="thingStats"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    this.refreshStats(thing, $ul); //adds thingStats to passed $ul

    //#statsContainer div is for use in Phone landscape view
    $ulWrapper = $('<div id="statsContainer" class="three columns omega"></div>')
    $ulWrapper.append($ul);

    //adds thingStats img and ul to thingStatsWrapper
    $thingStatsWrapper.append($img, $ulWrapper);

    //adds thingStatsWrapper to parentNode
    $parentNode.append($thingStatsWrapper);


    //adds action window to parentNode
    $parentNode.append('<p id="actionWindow"></p>');

    //create thingActions ul
    $ul = $('<ul id="thingActions" class="blockContainer"></ul>');
    $ul.attr("data", thing.name); //adds thing name as data to ul, so action buttons can access it

    //adds thingActions ul to parentNode after thingStats ul
    $parentNode.append($ul);

    //adds thingAction buttons to $ul
    for (property in thing) {
        //if property is a function, not the constructor method, and not a private method (indicated by an underscore)
        if (typeof thing[property] === "function" && property != "constructor" && property.indexOf("_") < 0) {
            var $button = $('<button class="blockColumn">' + property + '</button>');
            $button.on("click", thingActionHandler);
            $ul.append($button);
        }
    }

    if (mqPhoneWide.matches) {
        this.convertLayoutToWidePhone();
    }

    if (mqPhone.matches) {
        this.convertToShortHeader(thing);
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

//********  Action and Profile Popout *********//

//print profile to a popout window
ThingView.prototype.printProfile = function(thing) {
    $statsList = $('<ul id="profile"></ul>');
    $statsList.append(this.getAllStats(thing));
    this.printToPopout($statsList);
};

//print action to embedded window.  Web View and Tablet landscape view
ThingView.prototype.printAction = function(thing, action) {
    var actionText = thing[action](); //updates any status stuff that will be changed in the action
    thingView.refreshStats(thingModel.allThings[$("ul#thingStats").attr("data")], null); //prints updated/changed status
    $("p#actionWindow").text(actionText); //prints message AFTER stats have been changed, so it doesn't get erased by printThing
};

//print action in a popout window
ThingView.prototype.printActionPopout = function(thing, action) {
    var actionText = thing[action](); //gets text to be printed 
    thingView.refreshStats(thingModel.allThings[$("ul#thingStats").attr("data")], null); //prints updated/changed status
    this.printToPopout($('<p id="action">' + actionText + '</p>')); //sends text to printToPopout for printing
};

//takes a jquery element.  adds a popout window to thingStats and appends those elements to it. 
//saves state of page before appending.  adds a click handler for the okay button, which will restore the page.  
ThingView.prototype.printToPopout = function($elements) {
    var $statusWindow = $("div#status"),
        $savedWindow,
        $popOut;

    //saves state of statusWindow to use when okay button is hit
    $savedWindow = $statusWindow.children().not($("h2")).not($("button#closeDrawer")).detach();

    $popOut = $('<div id="popOut" class="group"></div>');

    $popOut.append($elements);

    //creates okay button.  adds handler which reverts page back to state saved in $savedWindow
    $popOut.append('<button autofocus>Okay!</button>').click(function() {
        $statusWindow.children().not($("h2")).not($("button#closeDrawer")).remove();
        $statusWindow.append($savedWindow);
    });

    $statusWindow.append($popOut);
}

/*******  Mobile Layout Conversion  ******/

ThingView.prototype.convertLayoutToTablet = function() {
    $(".frame").removeClass("half-screen");
    $(".frame").addClass("full-screen");

    //if drawer is open, show status window.  Otherwise, hide it.  
    $(".status").css("left", function() {
        if (drawerIsOpen) {
            return 0;
        } else {
            //return browserWidth;
            return -browserWidth;
        }
    });
};

ThingView.prototype.convertLayoutFromTablet = function() {
    $(".frame").removeClass("full-screen");
    $(".frame").addClass("half-screen");
};

ThingView.prototype.convertLayoutToWidePhone = function() {
    var $thingActions = $("#thingActions").detach();
    $("#statsContainer").append($thingActions);
};

ThingView.prototype.convertLayoutFromWidePhone = function() {
    var $thingActions = $("#thingActions").detach();
    $("#status").append($thingActions);
};

ThingView.prototype.convertToShortHeader = function(thing) {
    var header = $("#status h2");
    if (thing._isPet) {
        header.text(thing.humanName + " (" + thing.name + ")");
    } else {
        header.text(thing.name);
    }
};

ThingView.prototype.convertToLongHeader = function(thing) {
    var header = $("#status h2");
    if (thing.isPet) {
        header.text("This is " + thing.humanName + " the " + thing.name);
    } else {
        header.text("This is a " + thing.name);
    }
};



