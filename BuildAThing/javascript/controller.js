/********* THING MODEL **********/
// contains all of the things currently created as properties
// can add and remove things


// methods: store, lookup, contains
function ThingModel(){
	this.allThings = {};
	this.numThings = 0;
};

ThingModel.prototype.makeStarterThings = function(){
	// PARAMETERS CHEATSHEET 
	// Thing: name
	// Mineral: name, shape
	// LivingThing: name, food
	// Plant: name, food, height (in inches)
	// Animal: name, food, movement, habitat, sound 
	// Pet: humanName, isHappy? 
	
	//NOTE:  Name and thing's "name" property must match EXACTLY!  This is a bug for the moment...
	this.addThing("Quartz", this.makeAnyThing("Mineral", false, "Quartz", "Octoganal"));
	this.addThing("Paramecium", this.makeAnyThing("LivingThing", false, "Paramecium", "you don't want to know"));
	this.addThing("Venus Fly Trap", this.makeAnyThing("Plant", false, "Venus Fly Trap", "hamburgers", "300"));
	this.addThing("Squirrel", this.makeAnyThing("Animal", false, "Squirrel", "my tomatoes", "climbing", "the backyard", "Eeek!!"));
	this.addThing("Copper", this.makeAnyThing("Mineral", false, "Copper", "like abe lincoln's head"));
	this.addThing("Juniper Tree", this.makeAnyThing("Plant", false, "Juniper Tree", "severed heads", "180"));
	this.addThing("Toe Fungus", this.makeAnyThing("LivingThing", false, "Toe Fungus", "Soles"));
	this.addThing("Seagull", this.makeAnyThing("Animal", false, "Seagull", "funnelcake and fish", "flying", "the seaside", "kee!  kee!"));
	// this.addThing("Rose", this.makeAnyThing("Plant", false, "Rose", "sunlight and nutrients in the soil", "20"));
	// this.addThing("Tiger", this.makeAnyThing("Animal", false, "Tiger", "little children", "Leap", "jungle", "Rawr"));	
	// this.addThing("Bacteria", this.makeAnyThing("Living Thing", false, "Bacteria", "microscopic yumminess"));
	// this.addThing("Best Thing Ever", this.makeAnyThing("Thing", false, "Best Thing Ever"));
	// this.addThing("Cat", this.makeAnyThing("Animal", true, "Cat", "Cat food", "walk", "house", "mreow"));
	// this.addThing("Rabbit", this.makeAnyThing("Animal", true, "Rabbit", "vegetables and hay", "hopp", "house", "thump"));
	// this.addThing("Cactus", this.makeAnyThing("Plant", true, "Cactus", "sunlight and nutrients in the soil", "8"));
	// this.addThing("Rock", this.makeAnyThing("Mineral", true, "Rock", "upside-down"));
};

//note: if you give a new thing the same name as an old thing, 
//old thing will be overwritten
ThingModel.prototype.addThing = function(name, Thing){
	this.numThings++;
	return this.allThings[name] = Thing;
};

ThingModel.prototype.removeThing = function(name){
		var temp = this.allThings[name]
	  	delete this.allThings[name];
	  	this.numThings--;
	  	return temp; //returns deleted Thing
};

ThingModel.prototype.thingNames = function(){
  var names = [];
  for (property in this.allThings)
  		names[names.length] = property;
  return names.toString();
};

ThingModel.prototype.getThing = function(name){
	return this.allThings(name);
};

//because I can't find a better way to convert a string into a function call
//don't want to use window["string"]...
ThingModel.prototype.stringToThing = function (thingName){
		if (thingName === "Thing")
			return new Thing();
		else if (thingName === "Mineral")
			return new Mineral();
		else if (thingName === "LivingThing")
			return new LivingThing();
		else if (thingName === "Plant")
			return new Plant();
		else if (thingName === "Animal")
			return new Animal();
		else
			throw new Error("incorrect thingName: " + thingName);	
};

//can accept arguments as an array, or as a split list
ThingModel.prototype.makeAnyThing = function (type, isPet /*args*/){

	var args = Array.prototype.slice.call(arguments, 2); 
	//why this Array.prototype nonsense?  because arguments is only "array-like" 

	//if first argument in args is an array, then the args were passed as an array originally. 
	if (args[0] instanceof Array) 
		args = args[0];//reassigns args array to the originally-passed argument array 

	//Would prefer to avoid this giant, repetitive if-statement...

	var newThing;  
	
	//note: I have an unknown # of arguments, so I have to use the apply method.  
	if (type.indexOf("Animal") >= 0){
		newThing = new Animal(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Animal.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Plant") >= 0){
		newThing = new Plant(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Plant.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("LivingThing") >= 0){
		newThing = new LivingThing(); //created w/o arguments.  Needed to pass as context to apply
		newThing = LivingThing.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Mineral") >= 0){
		newThing = new Mineral(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Mineral.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Thing") >= 0){
		newThing = new Thing(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Thing.prototype.constructor.apply(newThing, args);
	}

	else throw new Error("passed an incompatible type: " + type);
	
//	if (isPet){}

	return newThing;

}

/* 
//NOTES ON "THIS"
// I have an unknown # of arguments, so I need to use call or apply to create objects in here.
// this means I need something to pass as "this."  
// if I create makeAnyThing as a method of ThingModel, "this" refers to ThingModel
// if I create makeAnyThing as a regular function, "this" refers to window.
// tried various things this["Thing"], window["Thing"], Thing, Thing.prototype, 
// Thing.prototype.constructor. "this" always refers to undefined
// I think the thing passed as "this" has to be an actual object, 
// not a pointer to a constructor function.  That would make sense.  
// so now I'm making an empty Thing-like object (had to go back and make parameters optional)
// then applying the constructor function to it.  Seems to be working.
*/

/********** DOM MANIPULATORS/VIEW **********/


function ThingView(){}

ThingView.prototype.makeGrid = function(thingModel){
	var $parentNode = $("div#select ul");
	var $newNode = $('<li class= "thing one columns"></li>');

	//go throuh all objects in thingModel 
	for(propertyName in thingModel.allThings) 
	{	
		this.addGridSquare(thingModel.allThings[propertyName]);
	}
};

ThingView.prototype.addGridSquare = function(Thing){
	$parentNode = $("div#select ul");
	$newNode = $('<li class="thing one columns"></li>'); //add a new li for each Thing in model
	$newNode.attr("data", Thing.name); //add the object's name to the li's data attribute, 
	$newNode.text(Thing.name); //put object's "name" property in the li as text
	$parentNode.append($newNode);

	//re-sets event handler so it will apply to newly-generated elements
	$("div#select ul li").unbind("click", selectButtonHandler);
	$("div#select ul li").on("click", selectButtonHandler);
};

//parentNode is optional
ThingView.prototype.printThing = function (thing, parentNode){
		var $h2, h2contents,  $ul;
		var $parentNode = $parentNode || $("div#status");
		var $listItems = [];

		$parentNode.empty();

		//create + add h2 

		h2contents = thing._getHeader();
		$h2 = $("<h2>" + h2contents + "</h2>");
		$parentNode.append($h2);

		//create ul
		$ul = $("<ul></ul>");

		//adds ul to parentNode
		$parentNode.append($ul);

		// //pull printable properties from Thing Objects
		// //convert them into html elements and append them to the statList(ul)
		// $listItems = thing.getPrintableProperties();

		// forEach($listItems, function(element){
		// 	$ul.append($("<li>" + element + "</li>")); 
		// });

		for (property in thing){
			console.log(property);
			if (typeof thing[property] != "function"){
				$ul.append($("<li>" + thing[property] + "</li>")); 
			}
		}

		for (property in thing){
			console.log(property);
			//if property is a function, not the constructor method, and not a private method (indicated by n underscore)
			if (typeof thing[property] === "function" && property != "constructor" && property.indexOf("_") < 0){
				$ul.append($("<button>" + property + "</button>"));
			}

		}

		//pull methods from Thing object

		//print a button for each method

		//add event listeners elsewhere that will execute the proper method when the button is clicked.

};

ThingView.prototype.refreshForm = function(){
	var type = $("select#typeSelector").val();
	// get thingType from select box
	
	$("#variableFields").children().hide();

	$("#variableFields  input#name").show();
	$("#variableFields label[for=name]").show();
	$("#variableFields button").show();

	if(type === "Mineral")
		$(".mineral").show();
	else if (type === "LivingThing" || type === "Animal" || type === "Plant")
	{	$(".livingThing").show();

		if(type === "Plant")
			$(".plant").show();
		else if(type === "Animal")
			$(".animal").show();
	}

	//console.log("form refreshed!!");
};

ThingView.prototype.clearStatus = function(){
	$("div#status").children().remove();
};

//I KNOW there's a better way to do this... just not sure how yet.
//JSON maybe?
ThingView.prototype.generateForm = function(){
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
	$petSelectorDiv.append( $('<label for="isPet">Is this thing a pet?</label>'),
						    $('<input type="radio" name="isPet" value="pet">'),
							$('<label for="isPet">Yes!</label>'),
							$('<input type="radio" name="isPet" value="notPet">'),
							$('<label for="isPet">No</label>')
						  );
	$makeThingWrapper.append($petSelectorDiv);

	//adds all possible fields
	var $variableFieldset = $('<fieldset>').attr("id", "variableFields");
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

		$petFieldset = $("<fieldset>").attr("id", "petFields");
		$petFieldset.append($("<label for='humanName'>What is this Pet's human name?</label>"),
							$('<input id="humanName" type="text">'));

		$happyRadioDiv = $('<div class="pet" id="happyRadio">')
		$happyRadioDiv.append(	$('<label for="isHappy" class="pet">Is this a happy Pet?</label>'),
								$('<input type="radio" name="isHappy" value="happy">'),
								$('<label for="isHappy">Yes!</label>'),
								$('<input type="radio" name="isHappy" value="notHappy">'),
								$('<label for="isHappy">No... :(</label>)')
							);
		$petFieldset.append($happyRadioDiv);
		$variableFieldset.append($petFieldset);
		$variableFieldset.append($('<button type="submit">Make This Thing!</button>'));

		$makeThingWrapper.append($variableFieldset);

		$parentNode.append($makeThingWrapper);
		$variableFieldset.children().hide();
		this.refreshForm();
};


//********* CONTROLLER **********/

// function ThingController(){}

// ThingController.prototype.init = function(){

	var thingModel = new ThingModel();
	var thingView = new ThingView();

	thingModel.makeStarterThings();

	//**********  	event handlers   ************//

	//handles when user picks a button on the grid
	$("div#select ul li").on("click", selectButtonHandler);

	//handles when user clicks on a button in the select-a-thing grid
	function selectButtonHandler(){
		var self = this;
		//console.log("in selectButtonHandler.  this: " + this);

		makeButtonActive(self);

		thingView.clearStatus();//clears whatever's in the status window 

		//if this is the newThing button, show the makeThing form
		if ($(this).hasClass("newThing"))
		{	//generates a new form
			thingView.generateForm();

			//adds Form Event Listeners 
			//adds listener to refresh form when user chooses a new Thing Type
			$("#typeSelector").change(thingView.refreshForm);//adds listener to refresh form when user chooses a new Thing Type
			$("#makeThingForm button").on("click", makeThingButtonHandler);
		}
		else //get object current li relates to, print status of that object
		{	thingView.printThing(thingModel.allThings[$(this).attr("data")]);
			//console.log(thingModel.allThings[$(this).attr("data")]);
		}
	}

	//when user clicks on a button in div#select, remove "active" class
	//from whichever button has it, and add "active" to current target
	function makeButtonActive(self){
		//go through each li in ul.  if it has an "active" class, remove it
		$("ul").find("li").each(function(/*index, element*/){
			if ($(this).hasClass("active")) //element.hasClass instead of "this"?
				$(this).removeClass("active");
		});

		//add "active" class to current li
		$(self).addClass("active");
	}

	//handles when a user clicks on the "Make This Thing!" button
	function makeThingButtonHandler(self){
		//console.log("button clicked");
		var thingType = $("#typeSelector").val(), thingName = $("#makeThingForm input#name").val();
		var thingIsPet = false;
		var thingArgs = []; //collects arguments from the text fields to use to make a new thing

		$("#variableFields").children("input:visible").each(function(){ //adds value of text field only if field is visible
			thingArgs.push($(this).val());
		});

		//makes new Thing with thingArgs array
		var newThing = thingModel.makeAnyThing(thingType, thingIsPet, thingArgs);
		//adds it to the model
		thingModel.addThing(thingName, newThing);
		
		//hides form
		$("#makeThingForm").hide();

		//removes "active" class from newThing Button
		$("ul li.newThing").removeClass("active");

		//create new select button for the new Thing
		thingView.addGridSquare(newThing);

		//add active class to it
		$('li[data="'+newThing.name+'"]').addClass("active");

		//print's new thing's Status
		thingView.printThing(newThing);

	}

// }


// var controller = new ThingController();
// controller.init();

