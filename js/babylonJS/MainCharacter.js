import ObjetGraphique from "./ObjetGraphique.js";


export default class MainCharacter extends ObjetGraphique{

    constructor(x, y,width,height) {
        super(x,y,width,height);
      }
      
    draw(scene){
        this.sphere = new BABYLON.MeshBuilder.CreateSphere("sphere", {width:this.width, height:this.height});
        this.sphere.position.x=this.x;
        this.sphere.position.y=this.y;
        this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(this.sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1}, scene);

        
    }

    move(inputMap,scene,savePoint,level){
        var mainCharacterSpeed = 0.1; // Vitesse de déplacement du cube
        var mainCharacterDirection = new BABYLON.Vector3(0, 0, 0); // Direction du cube
    
        // Gestion de la boucle de rendu
        scene.onBeforeRenderObservable.add(() => {
            // Gestion des déplacements
            mainCharacterDirection.x = 0;
            mainCharacterDirection.z = 0;
            mainCharacterDirection.y = 0;
            if (inputMap["s"] || inputMap["S"]) {
                mainCharacterDirection.z = -1;
            }
            if (inputMap["z"] || inputMap["Z"]) {
                mainCharacterDirection.z = 1;
            }
            if (inputMap["d"] || inputMap["D"]) {
                mainCharacterDirection.x = 1;
            }
            if (inputMap["q"] || inputMap["q"]) {
                mainCharacterDirection.x = -1;
            }
            if (inputMap[" "]) {
                mainCharacterDirection.y = 1;
            }
            // Mise à jour de la position du cube et de la caméra
            this.sphere.position.addInPlace(mainCharacterDirection.scale(mainCharacterSpeed));
            if(this.sphere.position.y < -25){
                this.sphere.position.x = savePoint[0]
                this.sphere.position.y = savePoint[1]+1.5;
                this.sphere.position.z = 0;
            }
            level.collision(this);
        });
    }

}
