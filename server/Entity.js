var Component = require('./Component.js');
const components = require('./ComponentEnum.js');

class Entity{

    constructor(tag){
        this.tag = tag,
        this.id = this.getUniqueId(),
        this.components = new Array();
    }

    // Init Pack for Entities.
    // For now everything is packed into components.
    getInitPack() {
        var param = {};

        this.components.forEach(function(component) {

            if (component.ofType(components.TRANSFORM)) {
                param.pos = component.pos;
                param.prevPos = component.prevPos;
                param.scale = component.scale;
                param.speed = component.speed;
                param.speedMax = component.speedMax;
                param.angle = component.angle;
                param.gravity = component.gravity;
            }
            else if (component.ofType(components.LIFESPAN)) {
                param.lifespan = component.lifespan;
            }
            else if (component.ofType(components.STATS)) {
                param.score = component.score;
                param.hp = component.hp;
                param.lives = component.lives;
                param.alive = component.alive;
            }
            else if (component.ofType(components.DIMENSION)) {
                param.width = component.width;
                param.height = component.height;
            }
            else if (component.ofType(components.INPUT)) {
                // Not needed now!
            }
            else {
                // Do nothing;
            }
        });
        return param;
    }

    getUpdatePack() {
        var param = {};

        this.components.forEach(function(component) {
            if (component.ofType(components.TRANSFORM)) {
                param.pos = component.pos;
                param.scale = component.scale;
                param.speed = component.speed;
                param.angle = component.angle;
                //param.gravity = component.gravity;
            }
            else if (component.ofType(components.STATS)) {
                param.score = component.score;
                param.hp = component.hp;
                param.lives = component.lives;
                param.alive = component.alive;
            }
            else {
                // Do nothing;
            }
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
            case components.TRANSFORM:
                c = new Component.Transform(); break;

            case components.LIFESPAN:
                c = new Component.Lifespan(); break;

            case components.STATS:
                c = new Component.Stats(); break;

            case components.INPUT:
                c = new Component.Input(); break;

            case components.DIMENSION:
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