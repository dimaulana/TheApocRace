
class Entity{

    var components = []

    constructor(tag){
        this.tag = tag,
        this.id = this.getUniqueId(),
        this.x = 250,
        this.y = 250,
        this.spdX = 0,
        this.spdY = 0
    }

    update(){
        self.updatePosition();
    }
    
    updatePosition(spdX, spdY){
        this.x += spdX;
        this.y += spdY;
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

    hasComponent(){
        return true;
    }

    getComponent(Component component){
        return component;
    }

    removeComponent(Component component){
        delete components[component]
    }

    updateComponent(Component component){
        //TODO
    }


}




