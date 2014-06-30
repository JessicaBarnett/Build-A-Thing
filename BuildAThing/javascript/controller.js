/********* THING MODEL **********/
// contains all of the things currently created as properties
// can add and remove things


// methods: store, lookup, contains
function ThingModel(startThings){
	this.allThings = {};
}

//note: if you give a new thing the same name as an old thing, 
//old thing will be overwritten
ThingModel.prototype.addThing = function(name, Thing){
	  return this.allThings[name] = Thing;
}

ThingModel.prototype.removeThing = function(name){
		var temp = this.allThings[name]
	  	delete this.allThings[name];
	  	return temp; //returns deleted Thing
}

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

//parent is optional
ThingView.prototype.printThing = function (thing, parent){
		var $h2, h2contents,  $ul;
		var $parent = parent || $("div#status");
		var $listItems = [];

		$parent.empty();

		//create + add h2 

		h2contents = thing.getHeader();
		$h2 = $("<h2>" + h2contents + "</h2>");
		$parent.append($h2);

		//create ul
		$ul = $("<ul></ul>");

		//adds ul to parent
		$parent.append($ul);

		//pull printable properties from Thing Objects
		//convert them into html elements and append them to the statList(ul)
		$listItems = thing.getPrintableProperties();

		console.log($listItems);

		forEach($listItems, function(element){
			$ul.append($("<li>" + element + "</li>")); 
		});
	}

ThingView.prototype.refreshForm = function(){
	var type = $("select#typeSelector").val();
	// get thingType from select box
	
	$("#variableFields").children().hide();

	$("#variableFields #name").show();
	$("#variableFields label[for=name]").show();
	$(".makeThing button").show()

	if(type === "Mineral")
		$(".mineral").show();
	else if (type === "LivingThing" || type === "Animal" || type === "Plant")
	{	$(".livingThing").show();

		if(type === "Plant")
			$(".plant").show();
		else if(type === "Animal")
			$(".animal").show();
	}
}

ThingView.prototype.clearStatus = function(){
	$("div#status").children().remove();
}

//I KNOW there's a better way to do this... just not sure how yet.
ThingView.prototype.generateForm = function(){
	var $parent = $("div#status");

	var $makeThingWrapper = $("<fieldset>").attr("class", "#makeThingForm");

	//adds h2
	var $heading = $("<h2>").text("Make a New Thing!");
	$makeThingWrapper.append($heading);

	//adds type selector select box
	var $typeSelectorDiv = $('<div>').attr("class", "makeThing")
	var $typeSelector = $('<select>').attr("class", "typeSelector")
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

		$parent.append($makeThingWrapper);



}


//********* CONTROLLER **********/

var thingModel = new ThingModel();
var thingView = new ThingView();
$("#makeThingForm").hide();

//******** CLICK EVENTS *********//

//handles when user picks a button on the grid
$("li.thing").on("click", function(){
	//go through each li in ul.  if it has an "active" class, remove it
	$("ul").find("li").each(function(/*index, element*/){
		if ($(this).hasClass("active")) //element.hasClass instead of "this"?
			$(this).removeClass("active");
	});

	//add "active" class to current li
	$(this).addClass("active");

	//thingView.clearStatus();//clears whatever's in the status window 

	//if this is the newThing button, show the makeThing form
	if ($(this).hasClass("newThing"))
	{	
		thingView.generateForm();
		thingView.refreshForm();
	}
	else
		$("#makeThingForm").hide();

});

//Form events

//refreshes forms and shows only appropriate fields
//when user chooses a different Thing to create
$("select#typeSelector").change(thingView.refreshForm);


//handles submit event when user makes a new Thing
$("#makeThingForm button").on("click", function(){
	var thingType = $("#makeThingForm select#typeSelector").val(), thingIsPet = false, thingName = $("input#name").val();

	var thingArgs = []; //collects arguments from the text fields to use to make a new thing

	$("#makeThingForm #variableFields").children("input:visible").each(function(){ //adds value of text field only if field is visible
		//if ($(this).val() != "")//if the text field has a value, push it to the args array
			thingArgs.push($(this).val());
	});

	var newThing = thingModel.makeAnyThing(thingType, thingIsPet, thingArgs);
	thingModel.addThing(thingName, newThing);
	$(".makeThing").hide();
	thingView.printThing(newThing);

	//removes "active" class from newThing Button
	$("ul li.newThing").removeClass("active");
});



/*
	PARAMETERS CHEATSHEET 
	I wrote them, but even I can't even remember what they all are

	Thing: name
	Mineral: name, shape
	LivingThing: name, food
	Plant: name, food, height (in inches)
	Animal: name, food, movement, habitat, sound 
	Pet: humanName, isHappy? 
*/


