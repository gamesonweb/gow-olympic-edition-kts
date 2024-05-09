import ObjetGraphique from "./ObjetGraphique.js";

export default class MainCharacter extends ObjetGraphique{

    constructor(z,y,x,width,height,size) {
        super(x,y,width,height);
        this.isDispose=false;
        this.z = z;
        this.size = size;
        this.draw();
        this.isFailed = false;
      }

    draw(){
        this.sphere = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: this.size});
        this.hitbox = new BABYLON.MeshBuilder.CreateSphere("hitbox", {diameter: this.size*1.5});
        var material = new BABYLON.StandardMaterial("transparentMaterial");
        material.alpha = 0; // Définit le niveau de transparence (0 = totalement transparent, 1 = totalement opaque)

        // Applique le matériau transparent à la sphère
        this.hitbox.material = material;
        this.sphere.position.x=this.x;
        this.sphere.position.y=this.y;
        this.sphere.position.z=this.z;
        this.hitbox.position.x=this.x;
        this.hitbox.position.y=this.y;
        this.hitbox.position.z=this.z;
    }

    move(x,y,z){
        this.sphere.position.x +=x;
        this.sphere.position.y +=y;
        this.hitbox.position.x +=x;
        this.hitbox.position.y +=y
    }

    moveZ(z){
        this.sphere.position.z -=z;
        this.hitbox.position.z -=z;
    }

    limit(x,isSup){
        let cpt = 0
        if(isSup){
            if(this.sphere.position.x>x && !this.isDispose){
                console.log("pop");
                this.sphere.dispose();
                this.isDispose = true;
                cpt = 1;
            }
        } else{
            if(this.sphere.position.x<x && !this.isDispose){
                console.log("pop");
                this.sphere.dispose();
                this.isDispose = true;
                cpt = 1;
            }
        }
        return cpt;
    }

    limitZ(z){
        let cpt =0;
        if(this.sphere.position.z<z && !this.isDispose){
            console.log("pop");
            this.sphere.dispose();
            this.isDispose = true;
            cpt = 1;
        }

        return cpt;
    }

}