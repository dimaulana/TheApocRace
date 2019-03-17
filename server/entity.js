var Component = require('./Component.js');
var AssetManager = require('./AssetManager.js');

class Entity{

    constructor(tag){
        this.tag = tag,
        this.id = this.getUniqueId(),
        this.components = new Array();
    }

    update(){
        self.updatePosition();
    }
    
    updatePosition(spdX, spdY){
        this.x += spdX;
        this.y += spdY;
    }


    // Init Pack for Entities.
    // For now everything is packed into components.
    getInitPack() {
        var param = {};
        var manager = new AssetManager();
        manager.loadAssets();
        
        this.components.forEach(function(component) {
            if (component.ofType("Transform")) {
                param.pos = component.pos;
                param.prevPos = component.prevPos;
                param.scale = component.scale;
                param.speed = component.speed;
                param.speedMax = component.speedMax;
                param.angle = component.angle;
                param.gravity = component.gravity;
            }
            else if (component.ofType("Lifespan")) {
                param.lifespan = component.lifespan;
            }
            else if (component.ofType("Stats")) {
                param.score = component.score;
                param.hp = component.hp;
                param.lives = component.lives;
                param.alive = component.alive;
            }
            else if (component.ofType("Dimension")) {
                param.width = component.width;
                param.height = component.height;
            }
            else if (component.ofType("Input")) {
                // Not needed now!
            }
            else {
                // Do nothing;
            }
            param.fileLocation = manager.getTexture("Player");
        });
        return param;
    }

    getUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    getId(){
        return this.id;
    }

    destroy() {
        return null;
    }

    addComponent(type) {
        var c;

        switch (type) {
            case "Transform":
                c = new Component.Transform(); break;

            case "Lifespan":
                c = new Component.Lifespan(); break;

            case "Stats":
                c = new Component.Stats(); break;

            case "Input":
                c = new Component.Input(); break;

            case "Dimension":
                c = new Component.Dimension(); break;

            default:
                console.log("Type: ", type , " not found");
                break;

        }

        this.components.push(c);
        return c;
    }

    hasComponent(type){
        var c = getComponent(type);

        if (c != null)
            return true;
    }

    getComponent(type){
        var component = this.components.find(function(c) {
            return c.ofType(type);
        });

        return component;
    }

    removeComponent(component){
        delete components[component]
    }

    updateComponent(component){
        //TODO
    }


}

module.exports = Entity;


// Example of using Entity Class;
//
// var e = new Entity("nothing");
// e.addComponent("Transform");
// e.addComponent("Lifespan");
// e.addComponent("Input");
// e.addComponent("Stats");
// //console.log(e);
// var c = e.getComponent("Transform");
// var d = e.getComponent("Lifespan");
// console.log(c.pos.x);
// console.log(d);
// var pack = e.getInitPack();
// console.log(pack);


