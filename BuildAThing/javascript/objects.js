//(function (){  //took this out because I wanted to use a couple different js files to keep things organized

//so, using this thingy, if I add another js file to keep stuff organized, I won't be able to access it, right?
//I like keeping all of my stuff out of the global scope, 
//but I'm seeing lots of problems with this "best practice."  
//I'm probably missing something...

//thinking it might be a good idea to separate constructors into another file at this point though.  
//scrolling through all this is getting to be a hassle.

	/********  	PROTOTYPES   ********/

		function Thing(name){ 
			this.name = name || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
			this.type = "Thing"; 
			return this; //to bypass "new" and construct with call/apply
		}

		Thing.prototype.print = function(){
			return "This is a " + this.name + ". It is a " + this.type  + ".";
		};

		Thing.prototype.kick= function(){
			return "You kicked the " + this.name + "!  Thunk!";
		};

		// Thing.prototype.getPrintableProperties = function(){
		// 	return ["name: "+this.name, "type: "+this.type];
		// };

		//will not be modified/extended by any Thing descendants
		//WILL be modified by Pet
		Thing.prototype._getHeader = function(){ 
			return "This is a " + this.name;
		};

		//for near future: 
			//add a button property to map each "thing" to the li elements on the page
			//add an id property?




	//Mineral inherits Thing
		function Mineral(name, shape){
			Thing.call(this, name);
			this.type = "Mineral";
			this.shape = shape || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
			return this; //to bypass "new" and construct with call/apply
		}

		Mineral.prototype.print = function(){
			//Thing.prototype.print.apply(this);
			return Thing.prototype.print.apply(this) + "\nIt has a " + this.shape + " shape.";
		};

		Mineral.prototype = clone(Thing.prototype);
		Mineral.prototype.constructor = Mineral;

		// Mineral.prototype.getPrintableProperties = function(){
		// 	//return Thing.prototype.getPropertyStrings.apply(this).concat(["shape: "+this.shape]); //too much work...
		// 	return ["name: "+this.name, "type: "+this.type, "shape: "+this.shape]; //mush easier to read if I just retype the whole thing
		// };


	//livingThing inherits Thing

		function LivingThing(name, food){
			Thing.call(this, name);
			this.type = "LivingThing";
			this.food = food || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
			this.energy = 10 || 0;
			return this; //to bypass "new" and construct with call/apply
		}
		LivingThing.prototype = clone(Thing.prototype);
		LivingThing.prototype.constructor = LivingThing;


		LivingThing.prototype.kick = function(){
			return "You kicked the " + this.name + "!  Squish!!";
		};

		LivingThing.prototype.eat= function(){
			this.energy++;
			return "The " + this.name + " is eating " + this.food + "!";
		};

		LivingThing.prototype._printEnergy = function(){
			return "The " + this.name + " has " + this.energy + " energy";
			//return this.energy;
		};

		LivingThing.prototype.print= function(){
			//Thing.prototype.print.apply(this);//extending Thing.print
			return Thing.prototype.print.apply(this) + "\nIt eats " + this.food + " and has " + this.energy + " energy.";
		};

		// LivingThing.prototype.getPrintableProperties = function(){
		// 	return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy];
		// };

	//Plant inherits LivingThing (And thus Thing)

		function Plant(name, food, height){
			LivingThing.call(this, name, food);
			this.type = "Plant";
			this.height = parseInt(height, 10) || 0; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
			return this; //to bypass "new" and construct with call/apply
		}
		Plant.prototype = clone(LivingThing.prototype); 
		Plant.prototype.constructor = Plant;

		Plant.prototype.grow= function(){
			this.height++; 
			this.energy--;
			return "This " + this.name + " has grown a little bit!";	
		};

		Plant.prototype.printHeight = function(){
			return "It is " +this.height+ " inches tall";
		};

		Plant.prototype.print= function(){
			LivingThing.prototype.print.apply(this); //Extends LivingThing.print
			return LivingThing.prototype.print.apply(this) + this.printHeight();
		};

		// Plant.prototype.getPrintableProperties = function(){
		// 	return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy, "height: "+this.height];
		// };


	//Animal inherits LivingThing (and thus Thing)

		function Animal(name, food, movement, habitat, sound){
			LivingThing.call(this, name, food);
			this.type = "Animal";
			this.movement = movement || "";//makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
			this.habitat = habitat || "";
			this.sound = sound || "";
			return this; //to bypass "new" and construct with call/apply
		}
		Animal.prototype = clone(LivingThing.prototype);
		Animal.prototype.constructor = Animal;


		//Extends LivingThing.print
		Animal.prototype.print = function(){
			//LivingThing.prototype.print.apply(this); //Extends LivingThing.print
			return LivingThing.prototype.print.apply(this) + "\nIt lives in the "+this.habitat+", moves by "+this.movement+"ing and makes a " +this.sound+ " sound.";
		};

		//Overrides LivingThing.kick
		Animal.prototype.kick =function(){
			return "You kicked the " + this.name + ".  It bites you!!";
		};

		Animal.prototype.move = function(){
			this.energy-= 2;
			return "The " + this.name + " is " + this.movement + " around!";
		};

		Animal.prototype.makeSound = function(){
			return "You hear a mysterious \'" + this.sound + "\' coming from the " + this.habitat +".";
		};

		// Animal.prototype.getPrintableProperties = function(){
		// 	return ["name: "+this.name, "type: "+this.type, "food: "+this.food, "energy: "+this.energy, 
		// 			"movement: "+this.movement+"ing", "habitat: "+this.habitat, "sound: "+this.sound];
		// };


	//Pet can mix with ANY object, but ideally something related to thing
		function Pet(humanName, happy){
			this.happy = happy;
			this.humanName = humanName;
			//this.type = "Pet " + this.type; //coming up as undefined??
		}

		//Extends Animal.print or Plant.print
		Pet.prototype.print = function(){
			return "This is " + this.humanName + ".\n" +
			Object.getPrototypeOf(this).print.apply(this) +
			"\n" + this.humanName + this.isHappy();
		};

		//functions for Animal Prototype base

		//Extends prototype.print
		Pet.prototype.eat = function(){
			this.happy = true;
			Object.getPrototypeOf(this).eat.apply(this);
		};

		//functions for Plant Prototype Base

		Pet.prototype.grow = function(){
			this.happy = true;
			Object.getPrototypeOf(this).grow.apply(this);
		};

		//functions for any Thing Prototype Base

		Pet.prototype.kick = function(){
			this.happy = false;
			Object.getPrototypeOf(this).kick.apply(this);
		};

		// Pet.prototype.getPrintableProperties = function(){
		// 	return ["human Name: "+this.humanName, "happiness: "+this.isHappy()].concat(Object.getPrototypeOf(this).getPrintableProperties.apply(this));
		// };

		Pet.prototype._getHeader = function(){
			return "This is " + this.humanName + " the " + this.name; 
		}

		//functions that will be added to all Pet Objects

		Pet.prototype.pet = function(){
			this.happy = true;
			return "You are petting " + this.humanName + ". It is happy!";
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

//})();



