/********  	PROTOTYPES   ********/

function Thing(name) {
    this.name = name || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
    this.type = "Thing";
    return this; //to bypass "new" and construct with call/apply
}

Thing.prototype._print = function() {
    return "This is a " + this.name + ". It is a " + this.type + ".";
};

Thing.prototype.kick = function() {
    return "You kicked the " + this.name + "!  Thunk!";
};


//will not be modified/extended by any Thing descendants
//WILL be modified by Pet
Thing.prototype._getHeader = function() {
    return "This is a " + this.name;
};

Thing.prototype.profile = function() {
    //meant as a placeholder.  The View Object will latch onto 
    //this Method's button and generate/print a listing of non-essential thing stats
};



//Mineral inherits Thing
function Mineral(name, shape) {
    Thing.call(this, name);
    this.type = "Mineral";
    this.shape = shape || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
    return this; //to bypass "new" and construct with call/apply
}

Mineral.prototype._print = function() {
    return Thing.prototype._print.apply(this) + "\nIt has a " + this.shape + " shape.";
};

Mineral.prototype = clone(Thing.prototype);
Mineral.prototype.constructor = Mineral;


//livingThing inherits Thing

function LivingThing(name, food) {
    Thing.call(this, name);
    this.type = "LivingThing";
    this.food = food || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
    this.energy = 10 || 0;
    return this; //to bypass "new" and construct with call/apply
}
LivingThing.prototype = clone(Thing.prototype);
LivingThing.prototype.constructor = LivingThing;


LivingThing.prototype.kick = function() {
    return "You kicked the " + this.name + "!  Squish!!";
};

LivingThing.prototype.eat = function() {
    this.energy++;
    return "The " + this.name + " is eating " + this.food + "!";
};

LivingThing.prototype._printEnergy = function() {
    return "The " + this.name + " has " + this.energy + " energy";
    //return this.energy;
};

LivingThing.prototype._print = function() {
    return Thing.prototype._print.apply(this) + "\nIt eats " + this.food + " and has " + this.energy + " energy.";
};


//Plant inherits LivingThing (And thus Thing)

function Plant(name, food, height) {
    LivingThing.call(this, name, food);
    this.type = "Plant";
    this.height = parseInt(height, 10) || 0; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
    return this; //to bypass "new" and construct with call/apply
}
Plant.prototype = clone(LivingThing.prototype);
Plant.prototype.constructor = Plant;

Plant.prototype.grow = function() {
    this.height++;
    this.energy--;
    return "This " + this.name + " has grown a little bit!";
};

Plant.prototype._printHeight = function() {
    return "It is " + this.height + " inches tall";
};

Plant.prototype._print = function() {
    LivingThing.prototype._print.apply(this); //Extends LivingThing._print
    return LivingThing.prototype._print.apply(this) + this._printHeight();
};


//Animal inherits LivingThing (and thus Thing)

function Animal(name, food, movement, habitat, sound) {
    LivingThing.call(this, name, food);
    this.type = "Animal";
    this.movement = movement || ""; //makes it possible to call constructor/make object w/o correct "this." (see makeAnyThing function)
    this.habitat = habitat || "";
    this.sound = sound || "";
    return this; //to bypass "new" and construct with call/apply
}
Animal.prototype = clone(LivingThing.prototype);
Animal.prototype.constructor = Animal;


//Extends LivingThing._print
Animal.prototype._print = function() {
    return LivingThing.prototype._print.apply(this) + "\nIt lives in the " + this.habitat + ", moves by " + this.movement + "ing and makes a " + this.sound + " sound.";
};

//Overrides LivingThing.kick
Animal.prototype.kick = function() {
    return "You kicked the " + this.name + ".  It bites you!!";
};

Animal.prototype.move = function() {
    this.energy -= 2;
    return "The " + this.name + " is " + this.movement + " around!";
};

Animal.prototype.listen = function() {
    return "You hear a mysterious \'" + this.sound + "\' coming from the " + this.habitat + ".";
};




//Pet can mix with ANY object, but ideally something related to thing
function Pet(humanName, happy) {
    this.happy = happy;
    this.humanName = humanName;
    this._isPet = true;
    //this.type = "Pet " + this.type; //coming up as undefined??
}

//Extends Animal._print or Plant._print
Pet.prototype._print = function() {
    return "This is " + this.humanName + ".\n" +
        Object.getPrototypeOf(this)._print.apply(this) +
        "\n" + this.humanName + this._isHappy();
};

//functions for Animal Prototype base

//Extends prototype._print
Pet.prototype.eat = function() {
    this.happy = true;
    return Object.getPrototypeOf(this).eat.apply(this);
};

//functions for Plant Prototype Base

Pet.prototype.grow = function() {
    this.happy = true;
    return Object.getPrototypeOf(this).grow.apply(this);
};

//functions for any Thing Prototype Base

Pet.prototype.kick = function() {
    this.happy = false;
    return Object.getPrototypeOf(this).kick.apply(this);
};


Pet.prototype._getHeader = function() {
    return "This is " + this.humanName + " the " + this.name;
}

//functions that will be added to all Pet Objects

Pet.prototype.pet = function() {
    this.happy = true;
    return "You are petting " + this.humanName + ". It is happy!";
};

Pet.prototype._isHappy = function() {
    return this.happy ? this.humanName + " is very happy!" : this.humanName + " is not happy : (";
};

//returns true if propertyname passed is a property specific to the Pet "class"
//only needed in the mixing process, not elsewhere
Pet.prototype._isPetProperty = function(propertyName) {
    return (propertyName == "happy" || propertyName == "humanName" || propertyName == "pet" || propertyName == "_isHappy" || propertyName == "_isPet");
};
