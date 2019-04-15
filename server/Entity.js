var Component = require('./Component.js');
const components = require('./ComponentEnum.js');

class Entity{

    constructor(tag){
        this.tag = tag;
        this.id = this.getUniqueId();
        this.components = new Array();
    }

    // Init Pack for Entities.
    // For now everything is packed into components.
    getInitPack() {
        var param = {};
        param.tag = this.tag;
        param.id = this.id;

        this.components.forEach(function(component) {

            if (component.ofType(components.TRANSFORM)) {
                param.pos = component.pos;
                param.prevPos = component.prevPos;
                param.scale = component.scale;
                param.speed = component.speed;
                param.speedMax = component.speedMax;
                param.angle = component.angle;
            }
            if (component.ofType(components.GRAVITY)) {
                param.gravity = component.gravity;
            }

            if (component.ofType(components.LIFESPAN)) {
                param.lifespan = component.lifespan;
            }

            if (component.ofType(components.STATS)) {
                param.score = component.score;
                param.hp = component.hp;
                param.hpMax = component.hpMax;
                param.lives = component.lives;
                param.alive = component.alive;
            }

            if (component.ofType(components.DIMENSION)) {
                param.width = component.width;
                param.height = component.height;
            }

            if (component.ofType(components.INPUT)) {
                param.jump = component.jump;
                param.left = component.left;
                param.right = component.right;
                param.shoot = component.shoot;
                param.canShoot = component.canShoot;
            }

            if (component.ofType(components.FOLLOWPLAYER)) {
                param.followSpeed = component.followSpeed;
                param.delay = 0;
            }

            if (component.ofType(components.PATROL)) {
                param.patrolSpeed = component.speed;
                param.posArray = component.positons;
            }
            if (component.ofType(components.SPRITE)) {
                param.fileLocation = component.location;

                if (component.frame_sets) {
                    param.frame_sets = component.frame_sets;
                }
                if (component.jumpLoc) {
                    param.jump_sets = component.jump_sets;
                    param.jumpImage = component.jumpLoc;
                }
            }

            if (component.ofType(components.WEAPON)) {
                param.weaponClock = component.clock;
                param.weaponName = component.name;
                param.weaponMap = component.map;
                param.weaponInterval = component.coolDown;
                param.bulletFile = component.imageLoc.normal;
                
                if (component.imageLoc.laser)
                    param.laserFile = component.imageLoc.laser;
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

    addComponent(type, param) {
        var c;

        switch (type) {
            case components.TRANSFORM:
                c = new Component.Transform(param); break;

            case components.GRAVITY:
                c = new Component.Gravity(); break;

            case components.LIFESPAN:
                c = new Component.Lifespan(); break;

            case components.STATS:
                c = new Component.Stats(param); break;

            case components.INPUT:
                c = new Component.Input(); break;

            case components.DIMENSION:
                c = new Component.Dimension(param); break;

            case components.FOLLOWPLAYER:
                c = new Component.FollowPlayer(param); break;

            case components.PATROL:
                c = new Component.Patrol(param); break;

            case components.SPRITE:
                c = new Component.Sprite(param); break;

            case components.WEAPON:
                c = new Component.Weapon(param); break;


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