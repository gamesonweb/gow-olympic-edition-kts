import Level from "./Level.js";

export default class Running extends Level{

    constructor(canvas) {
        super(canvas);
        this.createScene(canvas);
        this.end = false;
    }


    createScene(canvas) {
        this.walls = [];
        this.size = 2500;
        this.engine = new BABYLON.Engine(canvas, true)
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 5, -5));
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: this.size });
        this.ground.position.z = this.size/2 -5;

        let wallPositionZ = 20;
        for(let i = 0; i < 25; i++){
            let wall = BABYLON.MeshBuilder.CreateBox("ground", { width: 2, height: 2 });
            wall.position.z += wallPositionZ;
            wallPositionZ += 100;
            //wall.physicsImpostor = new BABYLON.PhysicsImpostor(mainCharacter.sphere, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, this.scene);
            //console.log(wall.getBoundingInfo().boundingBox.maximum);
            this.walls.push(wall);
        }

        this.scene.enablePhysics();
        this.savePoint = [0,this.ground.position.y]

        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3.Green();
        this.ground.material = groundMat;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);
    }

    collision(mainCharacter, speed){
        this.walls.forEach(wall => {
            if(mainCharacter.sphere.position.y < wall.position.y+2 && (mainCharacter.sphere.position.z > wall.position.z-0.5 && mainCharacter.sphere.position.z < wall.position.z+0.5)){
                speed = 0.01;
            }
        });
        return speed;
    }

    running(mainCharacter, scene, inputMap){
        var outputplaneRules = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplaneRules.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplaneRules.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplaneRules.position = new BABYLON.Vector3(-12, 7, 12);
        outputplaneRules.scaling.y = 0.4;

        var outputplaneTextureRules = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplaneRules.material.diffuseTexture = outputplaneTextureRules;
        outputplaneRules.material.diffuseTexture.hasAlpha = true;
        outputplaneRules.useAlphaFromDiffuseTexture = true;
        outputplaneRules.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplaneRules.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplaneRules.material.backFaceCulling = false;

        var outputplaneRules2 = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplaneRules2.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplaneRules2.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplaneRules2.position = new BABYLON.Vector3(-12, 7, 12);
        outputplaneRules2.scaling.y = 0.4;
        var outputplaneTextureRules2 = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplaneRules2.material.diffuseTexture = outputplaneTextureRules2;
        outputplaneRules2.material.diffuseTexture.hasAlpha = true;
        outputplaneRules2.useAlphaFromDiffuseTexture = true;
        outputplaneRules2.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplaneRules2.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplaneRules2.material.backFaceCulling = false;
        outputplaneTextureRules.drawText("intervale Q D pour avancer", null, 140, "bold 9px verdana", "black", "#00000000");
        outputplaneTextureRules2.drawText("espace pour sauter", null, 140, "bold 9px verdana", "black", "#00000000");

        var outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane.position = new BABYLON.Vector3(-12, 7, 12);
        outputplane.scaling.y = 0.4;

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.useAlphaFromDiffuseTexture = true;
        outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.backFaceCulling = false;

        let veriEnd = false;
        let time = 50
        let tmp = time;
        outputplaneTexture.drawText(tmp, null, 140, "bold 50px verdana", "white", "#00000000");
        setInterval(() =>{
            if(!this.end){
                if(!veriEnd){
                    tmp-=1;
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    if(tmp<0){
                        outputplaneTexture.drawText("PERDU", null, 140, "bold 50px verdana", "red", "#00000000");
                        mainCharacter.sphere.position.z = 0;
                        tmp=time;
                    }
                    else{
                        outputplaneTexture.drawText(tmp, null, 140, "bold 50px verdana", "white", "#00000000");
                    }
                }
                else{
                    outputplaneTexture.drawText("GAGNE", null, 140, "bold 50px verdana", "green", "#00000000");
                    this.end = true
                }
            }
        },1000)



        let speed = 0.01;
        let jump=0;
        let d = true;
        let q = true;
        let cpt = 0;
        outputplane.position.x = mainCharacter.sphere.position.x;

        outputplaneRules.position.x = mainCharacter.sphere.position.x;
        outputplaneRules.position.y = mainCharacter.sphere.position.y;
        outputplaneRules.position.z = mainCharacter.sphere.position.z;

        outputplaneRules2.position.x = mainCharacter.sphere.position.x;
        outputplaneRules2.position.y = mainCharacter.sphere.position.y;
        outputplaneRules2.position.z = outputplaneRules.position.z-1;
        scene.onBeforeRenderObservable.add(() => {

            outputplane.position.y = mainCharacter.sphere.position.y+3;
            outputplane.position.z = mainCharacter.sphere.position.z;

            if(mainCharacter.sphere.position.z < this.size-10){
                mainCharacter.sphere.position.z +=speed;
            }
            if(jump>0.01){
                mainCharacter.sphere.position.y+=jump
                jump-=0.03
            }

            if (d==true && speed < 2 && (inputMap["D"] || inputMap["d"])) {
                speed+=0.02;
                d = false;
                q = true
                cpt = 0;
            }
            else if (q==true && speed < 2 && (inputMap["Q"] || inputMap["q"])) {
                speed+=0.02;
                q = false;
                d = true
                cpt = 0
            }
            else if ((inputMap[" "]) && mainCharacter.sphere.position.y < 1) {
                jump += 0.2;
            }
            else if(cpt > 50 && speed-0.10 > 0.01){
                speed -= 0.10;
                cpt = 0
            }
            cpt += 1;
            speed=this.collision(mainCharacter, speed);
            if(mainCharacter.sphere.position.z >= this.size-10 && tmp >0){
                const ctx = outputplaneTexture.getContext();
                ctx.clearRect(0, 0, 1000, 1000);
                veriEnd = true;
            }
        });
    }

}
