import Level from "./Level.js";
import Target from "./Target.js";

export default class Tire extends Level{

    constructor(canvas) {
        super(canvas);
        this.createScene(canvas);
        this.cptTarget = 0;
        this.end = false;
    }


    createScene(canvas) {
        this.engine = new BABYLON.Engine(canvas, true)
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.6, 10, new BABYLON.Vector3(0, 1, 5));
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1,0));
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width:50, height:5});
        this.ground.position.z = -2
        this.scene.enablePhysics();
        this.savePoint = [this.ground.position.x,this.ground.position.y,this.ground.position.z]

        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3.Green();
        this.ground.material = groundMat;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);
        console.log(document.querySelector("cursor"));
    }

    collision(mainCharacter){

    }

    createTarget(posZ,posY,posX,numberTarger,scene){
        let that = this; // Sauvegarde de la référence à l'instance de la classe
        let target = new Target(posZ,posY,posX,10,10,2)

        target.hitbox.actionManager = new BABYLON.ActionManager(scene);
        target.hitbox.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                function() {
                    console.log("Target "+ numberTarger +" cliquée !");
                    target.sphere.dispose();
                    target.hitbox.dispose();
                    that.cptTarget+=1;
                    target.isDispose=true
                }
            )
        );
        return target;
    }


    tire(mainCharacter, scene, inputMap){

        var outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane.position = new BABYLON.Vector3(-12, 7, 12);
        outputplane.scaling.y = 0.4;
        var outputplane2 = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplane2.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane2.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane2.position = new BABYLON.Vector3(-12, 7, 12);
        outputplane2.scaling.y = 0.4;

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        var outputplaneTexture2 = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplaneTexture2.drawText("Cliquer sur les cibles", null, 140, "bold 30px verdana", "white", "#00000000");

        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.useAlphaFromDiffuseTexture = true;
        outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.backFaceCulling = false;
        outputplane.position.x = mainCharacter.sphere.position.x;
        outputplane.position.y = mainCharacter.sphere.position.y;
        outputplane.position.z = 36
        outputplane2.material.diffuseTexture = outputplaneTexture2;
        outputplane2.material.diffuseTexture.hasAlpha = true;
        outputplane2.useAlphaFromDiffuseTexture = true;
        outputplane2.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane2.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane2.material.backFaceCulling = false;
        outputplane2.position.x = mainCharacter.sphere.position.x;
        outputplane2.position.y =  outputplane.position.y-1;
        outputplane2.position.z = 36

        let target = this.createTarget(20,-10,-45,1,scene);
        let target2 = this.createTarget(15,0,-45,2,scene);
        let target3 = this.createTarget(5,0,45,3,scene);
        let target4 = this.createTarget(35,0,50,4,scene);
        let target5 = this.createTarget(20,5,-50,5,scene);

        let cptFail = 0;
        let state = 1;

        scene.onBeforeRenderObservable.add(() => {
            const ctx = outputplaneTexture.getContext();
            ctx.clearRect(0, 0, 1000, 1000);
            if(cptFail + this.cptTarget == 5 && this.cptTarget != 5){
                if(state == 1){ // rate etape 1
                    target = this.createTarget(20,-10,-45,1,scene);
                    target2 = this.createTarget(15,0,-45,2,scene);
                    target3 = this.createTarget(5,0,45,3,scene);
                    target4 = this.createTarget(35,0,50,4,scene);
                    target5 = this.createTarget(20,5,-50,5,scene);
                }
                if(state == 2){ // rate etape 2
                    target = this.createTarget(20,0,50,scene);
                    target2 = this.createTarget(15,-15,-45,scene);
                    target3 = this.createTarget(10,0,-45,scene);
                    target4 = this.createTarget(15,15,50,scene);
                    target5 = this.createTarget(1,2,-45,scene);
                }
                if(state == 3){ // rate etape 3
                    target = this.createTarget(20,-20,-45,1,scene);
                    target2 = this.createTarget(20,10,-45,1,scene);
                    target3 = this.createTarget(20,-20,45,1,scene);
                    target4 = this.createTarget(20,10,45,1,scene);
                    target5 = this.createTarget(65,-5,0,1,scene);
                }
                this.cptTarget = 0;
                cptFail = 0;
            }
            else if(this.cptTarget != 5){
                outputplaneTexture.drawText("étape " +state+" : " +this.cptTarget+" /5", null, 140, "bold 50px verdana", "white", "#00000000");
            }
            else if (this.cptTarget == 5){
                if(state==1) { // reussi etape 1
                    target = this.createTarget(20,0,50,scene);
                    target2 = this.createTarget(15,-15,-45,scene);
                    target3 = this.createTarget(10,0,-45,scene);
                    target4 = this.createTarget(15,15,50,scene);
                    target5 = this.createTarget(1,2,-45,scene);
                    state = 2;
                    this.cptTarget = 0;
                    cptFail = 0;
                    return;
                }
                if(state==2){ // reussi etape 2
                    target = this.createTarget(20,-20,-45,1,scene);
                    target2 = this.createTarget(20,10,-45,1,scene);
                    target3 = this.createTarget(20,-20,45,1,scene);
                    target4 = this.createTarget(20,10,45,1,scene);
                    target5 = this.createTarget(65,-5,0,1,scene);
                    state = 3;
                    this.cptTarget = 0;
                    cptFail = 0;
                    return
                }
                if(state==3){
                    this.end = true
                }

            }
            if(state == 1){ //etape 1
                target.move(0.1,0.005);
                console.log(target.sphere.scaling + " " + target.hitbox.scaling)

                target2.move(0.1,0.005);
                target3.move(-0.1,0.005);
                target4.move(-0.1,-0.05);
                target5.move(0.1,-0.005);

                cptFail += target.limit(40,true);
                cptFail += target2.limit(40,true);
                cptFail += target3.limit(-40,false);
                cptFail += target4.limit(-20,false);
                cptFail += target5.limit(40,true);
            }
            if(state == 2){ //etape 2
                target.move(-0.125,-0.010);
                target2.move(0.125,0.050);
                target3.move(0.125,-0.01);
                target4.move(-0.125,-0.050);
                target5.move(0.1,0);


                cptFail += target.limit(-40,false);
                cptFail += target2.limit(40,true);
                cptFail += target3.limit(40,true);
                cptFail += target4.limit(-40,false);
                cptFail += target5.limit(40,true);
            }
            if(state == 3){ //etape 3
                target.move(0.125,0.04);
                target2.move(0.125,-0.04);
                target3.move(-0.125,0.04);
                target4.move(-0.125,-0.04);
                target5.moveZ(0.125);

                cptFail += target.limit(40,true);
                cptFail += target2.limit(40,true);
                cptFail += target3.limit(-40,false);
                cptFail += target4.limit(-40,false);
                cptFail += target5.limitZ(0);
            }


        });
    }

}
