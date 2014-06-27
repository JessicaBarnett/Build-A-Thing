(function (){
//so, using this thingy, if I add another js file to keep stuff organized, I won't be able to access it, right?
//I like keeping all of my stuff out of the global scope, 
//but I'm seeing lots of problems with this "best practice."  
//I'm probably missing something...

//thinking it might be a good idea to separate constructors into another file at this point though.  
//scrolling through all this is getting to be a hassle. 

	/****** UTILITIES ******/

	function bind(func, object){
	  //used to bind a particular "this" to a function which will be passed down to other contexts later
	  //returns bound function
	  return function(){
	    return func.apply(object, arguments); //object is presumably the "this" keyword
	  };
	}

	//makes the old prototype object the prototype of the new prototype object
	//hence all its properties/methods get passed down
	function clone(object){
	  function OneShotConstructor(){}
	  OneShotConstructor.prototype = object;
	  return new OneShotConstructor();
	}

	//for each property in an object, do this action
	function forEachIn(object, action) {
	  for (var propertyName in object){
	    //if (object.hasOwnProperty.call(object, propertyName))  
	      action(propertyName, object[propertyName]);
	  }
	}

	//for multiple inheritance
	//Adds properties/methods of mixin to object
	//*** Now Using mixIntoPet instead ***
	function mixInto(object, mixIn){
	  forEachIn(mixIn, function(propertyName, value){
	    object[propertyName] = value;
	  });
	}


	//for multiple inheritance
	//Adds properties/methods of mixin to object if 
	//if they are shared by both Pet and Base Constructor, 
	//or are unique to the Pet constructor
	//allows All kinds of things to be mixed into Pet 
	function mixIntoPet(object, mixIn){
		forEachIn(mixIn, function(propertyName, value){
			if(object[propertyName] || mixIn.isPetProperty(propertyName))
	    		object[propertyName] = value;
	 	});
	}

	/*cycles through an array doing function action to each. 
	does same as a for loop, but is reusable.*/
	function forEach(array, action){
	  for (var i = 0; i < array.length; i++)
	    action(array[i]);
	}


	/********  	PROTOTYPES   ********/

		function Thing(name){
			this.name = name;
			this.type = "Thing";
		}

		Thing.prototype.print = function(){
			console.log("This is a " + this.name + ". It is a " + this.type  + ".");
		};

		Thing.prototype.kick= function(){
			console.log("You kicked the " + this.name + "!  Thunk!");
		};

		Thing.prototype.getProperties = function(){
			return [this.name, this.type];
		};

		Thing.prototype.getPrintableProperties = function(){
			return ["name: "+this.name, "type: "+this.type];
		};

		Thing.prototype.getHeader = function(){
			return "This is a " + this.name;
		};


	//Mineral inherits Thing
		function Mineral(name, shape){
			Thing.call(this, name);
			this.type = "Mineral";
			this.shape = shape;
		}

		Mineral.prototype.print = function(){
			Thing.prototype.print.apply(this);
			console.log("It has a " + this.shape + " shape.");
		};

		Mineral.prototype = clone(Thing.prototype);
		Mineral.prototype.constructor = Mineral;

		Mineral.prototype.getProperties = function(){
			return Thing.prototype.getProperties.apply(this).concat([this.shape]);
		};

		Mineral.prototype.getPrintableProperties = function(){
			//return Thing.prototype.getPropertyStrings.apply(this).concat(["shape: "+this.shape]);
			return ["name: "+this.name, "type: "+this.type, "shape: "+this.shape]; //mush easier to read
		};


	//livingThing inherits Thing

		function LivingThing(name, food){
			Thing.call(this, name);
			this.type = "LivingThing";
			this.food = food;
			this.energy = 10;
		}
		LivingThing.prototype = clone(Thing.prototype);
		LivingThing.prototype.constructor = LivingThing;


		LivingThing.prototype.kick = function(){
			console.log("You kicked the " + this.name + "!  Squish!!");
		};

		LivingThing.prototype.eat= function(){
			this.energy++;
			console.log("The " + this.name + " is eating " + this.food + "!")
		};

		LivingThing.prototype.printEnergy = function(){
			console.log("it has " + this.energy + " energy");
			return this.energy;
		};

		LivingThing.prototype.print= function(){
			Thing.prototype.print.apply(this);//extending Thing.print
			console.log("It eats " + this.food + " and has " + this.energy + " energy.");
		};

		LivingThing.prototype.getProperties = function(){
			return [this.name, this.type, this.food, this.energy];
		};

		LivingThing.prototype.getPrintableProperties = function(){
			return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy];
		};

	//Plant inherits LivingThing (And thus Thing)

		function Plant(name, food, height){
			LivingThing.call(this, name, food);
			this.type = "Plant";
			this.height = height;
		}
		Plant.prototype = clone(LivingThing.prototype);
		Plant.prototype.constructor = Plant;

		Plant.prototype.grow= function(){
			this.height++;
			this.energy--;
			console.log("This " + this.name + " has grown a little bit!");	
		};

		Plant.prototype.printHeight = function(){
			console.log("It is " +this.height+ " inches tall");
		};

		Plant.prototype.print= function(){
			LivingThing.prototype.print.apply(this); //Extends LivingThing.print
			this.printHeight();
		};

		Plant.prototype.getProperties = function(){
			return [this.name, this.type, this.food, this.energy, this.height];
		};

		Plant.prototype.getPrintableProperties = function(){
			return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy, "height: "+this.height];
		};

	//Animal inherits LivingThing (and thus Thing)

		function Animal(name, food, movement, habitat, sound){
			LivingThing.call(this, name, food);
			this.type = "Animal";
			this.movement = movement;
			this.habitat = habitat;
			this.sound = sound;
		}
		Animal.prototype = clone(LivingThing.prototype);
		Animal.prototype.constructor = Animal;


		//Extends LivingThing.print
		Animal.prototype.print = function(){
			LivingThing.prototype.print.apply(this); //Extends LivingThing.print
			console.log("It lives in the "+this.habitat+", moves by "+this.movement+"ing and makes a " +this.sound+ " sound.");
		};

		//Overrides LivingThing.kick
		Animal.prototype.kick =function(){
			console.log("You kicked the " + this.name + ".  It bites you!!");
		};

		Animal.prototype.move = function(){
			this.energy-= 2;
			console.log("The " + this.name + " is " + this.movement + "ing around!");
		};

		Animal.prototype.makeSound = function(){
			console.log("You hear a mysterious \'" + this.sound + "\' coming from the " + this.habitat +".");
		};

		Animal.prototype.getProperties = function(){
			return [this.name, this.type, this.food, this.energy, this.movement, this.habitat, this.sound];
		};

		Animal.prototype.getPrintableProperties = function(){
			return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy, 
					"movement: "+this.movement+"ing", "habitat: "+this.habitat, "sound: "+this.sound];
		};


	//Pet can mix with ANY object, but ideally something related to thing
		function Pet(humanName, happy){
			this.happy = happy;
			this.humanName = humanName;
			//this.type = "Pet " + this.type; //coming up as undefined?
		}

		//Extends Animal.print or Plant.print
		Pet.prototype.print = function(){
			console.log("This is " + this.humanName + ".");

			Object.getPrototypeOf(this).print.apply(this);
			console.log(this.humanName + this.isHappy());
		};

		//functions for Animal Prototype base

		//Extends prototype.print
		Pet.prototype.eat = function(){
			Object.getPrototypeOf(this).eat.apply(this);
			this.happy = true;
		};

		//functions for Plant Prototype Base

		Pet.prototype.grow = function(){
			Object.getPrototypeOf(this).grow.apply(this);
			this.happy = true;
		};

		//functions for any Thing Prototype Base

		Pet.prototype.kick = function(){
			Object.getPrototypeOf(this).kick.apply(this);
			this.happy = false;
		};

		Pet.prototype.getProperties = function(){
			return [this.humanName, this.happy].concat(Object.getPrototypeOf(this).getProperties.apply(this));
		};

		Pet.prototype.getPrintableProperties = function(){
			return ["human Name: "+this.humanName, "happiness: "+this.isHappy()].concat(Object.getPrototypeOf(this).getPrintableProperties.apply(this));
		};

		Pet.prototype.getHeader = function(){
			return "This is " + this.humanName + " the " + this.name; 
		}

		//functions that will be added to all Pet Objects

		Pet.prototype.pet = function(){
			this.happy = true;
			console.log("You are petting " + this.humanName + ". It is happy!");
		};

		Pet.prototype.isHappy = function(){
			return this.happy ? this.humanName+" is very happy!" : this.humanName+" is not happy : (";
		};

		Pet.prototype.isPet = function(){
			return true;
		};

		//returns true if propertyname passed is a property specific to the Pet "class"
		//only needed in the mixing process, not elsewhere
		Pet.prototype.isPetProperty = function(propertyName){
			return (propertyName == "happy" || propertyName == "humanName" || propertyName == "pet" || propertyName == "isHappy");
		};


	//******** CLICK EVENTS *********//

	$("li.thing").on("click", function(){
		//go through each li in ul.  if it has an "active" class, remove it
		$("ul").find("li").each(function(/*index, element*/){
			if ($(this).hasClass("active")) //element.hasClass instead of "this"?
				$(this).removeClass("active");
		});

		//add "active" class to current li
		$(this).addClass("active");
	});

	function ThingModel(){



	}

	/****** DICTIONARY OBJECT *********/
	/***** (from Eloquent JS) *******/

	function Dictionary (startValues){
	  this.values = startValues || {}; //startValues is optional
	}

	Dictionary.prototype.store = function(name, value){
	  return this.values[name] = value;
	};

	Dictionary.prototype.lookup = function(name) {
	  return this.values[name];
	};

	Dictionary.prototype.contains = function(name){
	  return Object.prototype.propertyIsEnumerable.call(this.values, name);
	};

	Dictionary.prototype.each = function(action){
	  forEachIn(this.values, action);
	};

	Dictionary.prototype.names = function(){
	  var names = [];
	  this.each(function(name, value) {   names.push(name);   });
	  return names;
	};

function ThingModel(startThings){
	Dictionary.call(this, startThings);
}

ThingModel.prototype.makeNewThing(){
	
	
}



	function makeStatList(thing, parent){
		var $h2, h2contents,  $ul;
		var $parent = $("div#status");
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

	//********  TESTS  ********//


	//runInheritanceTests();
	runDOMtests();

	function runDOMtests(){
		var happy = new Plant("Cactus", "sunlight and nutrients in the soil", "8");
		PetMixin = new Pet("Happy", true);
		mixIntoPet(happy, PetMixin);

		var flower = new Plant("rose", "sunlight and nutrients in the soil", "20");

		makeStatList(happy, $("div#status"));
		makeStatList(flower, $("div#status"));
	}

	function runInheritanceTests(){

		/*******  LINE BREAK FUNCTION TO MAKE THINGS PRETTY IN THE CONSOLE!  *******/

		function lineBreak(text){
			console.log("******************  "+text+"  ********************");
		}

		/******* NOW TO MAKE SOME THINGS  *******/

		lineBreak("rock");

		var something = new Thing("Best Thing Ever");
		something.print(); //from Thing
		something.kick(); //from Thing

		var rock = new Mineral("rock", "spider-like");
		rock.print(); //from Thing
		rock.kick(); //from Thing

		lineBreak("bacteria");

		var bacteria = new LivingThing("bacteria", "microscopic yumminess");
		bacteria.print();//from LivingThing.  extends Thing.print
		bacteria.kick();//redefined in LivingThing

		lineBreak("flower");

		var flower = new Plant("rose", "sunlight and nutrients in the soil", "20");
		flower.print() //from Plant.  Extends LivingThing.print (which extends Thing.print)
		flower.grow(); //from Plant
		flower.printHeight();//from Plant
		flower.printEnergy();//inherited from LivingThing 
		flower.kick(); //inherited from LivingThing (from Thing)


		lineBreak("tiger");

		var tiger = new Animal("Tiger", "little children", "Leap", "jungle", "Rawr", true);
		tiger.print(); //from Animal.  Extends LivingThing.print (which extends Thing.print)
		tiger.kick(); //redefined in Animal 
		tiger.move(); //from Animal
		tiger.printEnergy();//inherited from LivingThing
		tiger.eat(); //inherited from LivingThing

		lineBreak("cody the cat");

		var cody = new Animal("Cat", "Cat food", "walk", "house", "mreow");
		var PetMixin = new Pet("Cody", true);

		mixIntoPet(cody, PetMixin);

		cody.print(); //from Pet.  Extends Animal.print (which extends LivingThing.print/Thing.print)
		cody.eat();//from Pet.  Extends LivingThing.eat
		console.log(cody.isHappy());
		cody.kick(); //from Pet.  Extends Animal.kick
		console.log(cody.isHappy()); //from Pet
		cody.move(); //from Animal
		cody.pet(); //from Pet

		lineBreak("honey the rabbit");

		var honey = new Animal("Rabbit", "vegetables and hay", "hopp", "house", "thump");
		PetMixin = new Pet("Honey", true);

		mixIntoPet(honey, PetMixin);

		honey.print();//from Pet. Extends Animal.print (which extends LivingThing.print/Thing.print)
		honey.kick();//from Pet.  Extends Animal.kick
		honey.move();//from Animal
		honey.eat();//from Pet.  Extends LivingThing.eat
		honey.pet();//from Pet
		honey.printEnergy();//inherited from livingThing


		lineBreak("happy the cactus");

		var happy = new Plant("Cactus", "sunlight and nutrients in the soil", "8");
		PetMixin = new Pet("Happy", true);

		mixIntoPet(happy, PetMixin);

		happy.print(); //from Pet.  Extends Plant.print (which extends LivingThing.print/Thing.print)
		happy.kick();//from Pet.  Extends Plant.kick
		console.log("Happy" + happy.isHappy()); //from Pet
		happy.printHeight(); //from Plant
		happy.grow(); //from Plant
		happy.printHeight();//from Plant
		happy.printEnergy();//inherited from LivingThing
		happy.pet = function(){
			console.log("OUCH!!!!  Why did you pet a cactus?!!");
			Pet.prototype.pet.apply(this);
			console.log("...and probably evil.");
		};
		happy.pet(); //from Pet

		lineBreak("my Pet Rock");

		var myPetRock = new Mineral("rock", "upside-down");
		PetMixin = new Pet("Stormageddon", true);

		mixIntoPet(myPetRock, PetMixin);

		myPetRock.print(); //from Thing
		myPetRock.kick(); //from Thing
		console.log(myPetRock.humanName + myPetRock.isHappy()); //from Pet
		myPetRock.pet(); //from Pet
	}

})();



