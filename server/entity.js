var Component = require('./Component');

class Entity{

    constructor(tag){
        this.tag = tag,
        this.id = this.getUniqueId(),
        this.x = 250,
        this.y = 250,
        this.spdX = 0,
        this.spdY = 0
        this.components = []
    }

    update(){
        self.updatePosition();
    }
    
    updatePosition(spdX, spdY){
        this.x += spdX;
        this.y += spdY;
    }

    getInitPack() {
        return {
            id: this.tag,
            x: this.x,
            y: this.y,

        }
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

    addComponent(componentType) {

    }

    hasComponent(componentType){
        var c = getComponent(componentType);
        if (c != null)
            return true;
    }

    getComponent(componentType){
        var component = this.component.filter(function(c) {
            return (c instanceof componentType);
        }
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
