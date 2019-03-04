var Component = require('./Component.js');


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
        return {
            Component: this.components
        };
    }

    getUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    getId(){
        return this.id;
    }

    destroy(){
        return null;
    }

    addComponent(type) {
        var c;

        switch (type) {
            case "Transform":
                c = new Component.Transform(); break;

            case "Lifespan":
                c = new Component.LifeSpan(); break;

            case "Stats":
                c = new Component.Stats(); break;

            case "Input":
                c = new Component.Input(); break;

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
            switch (type) {
            case "Transform":
                return (c instanceof Component.Transform);

            case "Lifespan":
                return (c instanceof Component.Lifespan);

            case "Stats":
                return (c instanceof Component.Stats);

            case "Input":
                return (c instanceof Component.Input);

            default:
                console.log("Type: ", type , " not found");
                return null;

            }
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
// console.log(e);
// var c = e.getComponent("Transform");
// console.log(c.pos.x);
// var pack = e.getInitPack();
// console.log(pack);


