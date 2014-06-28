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


ThingModel.prototype.makeAnyThing = function (type, isPet /*args*/){

	var args = Array.prototype.slice.call(arguments, 1); 
	//why this Array.prototype nonsense?  because arguments is only "array-like" 

	//Would prefer to avoid this giant, repetitive if-statement...

	var newThing;  
	
	//note: I have an unknown # of arguments, so I have to use the apply method.  
	if (type.indexOf("Thing") >= 0){
		newThing = new Thing(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Thing.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Mineral") >= 0){
		newThing = new Mineral(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Mineral.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("LivingThing") >= 0){
		newThing = new LivingThing(); //created w/o arguments.  Needed to pass as context to apply
		newThing = LivingThing.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Plant") >= 0){
		newThing = new Plant(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Plant.prototype.constructor.apply(newThing, args);
	}
	else if (type.indexOf("Animal") >= 0){
		newThing = new Animal(); //created w/o arguments.  Needed to pass as context to apply
		newThing = Animal.prototype.constructor.apply(newThing, args);
	}
	else throw new Error("passed an incompatible type: " + type);
	
//	if (isPet){}

	return newThing;

}

/********** DOM MANIPULATORS/VIEW **********/


function View(){}

View.prototype.printThing = function (thing, parent){
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

View.prototype.showForm = function(){

}



//******** CLICK EVENTS *********//

$("li.thing").on("click", function(){
	//go through each li in ul.  if it has an "active" class, remove it
	$("ul").find("li").each(function(/*index, element*/){
		if ($(this).hasClass("active")) //element.hasClass instead of "this"?
			$(this).removeClass("active");
	});

	//add "active" class to current li
	$(this).addClass("active");

//	if ($(this).hasClass("newThing"))


});


//********* EVERYTHING ELSE **********/

var newView = new View();

	