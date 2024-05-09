import Level from "./Level.js";

export default class Hub extends Level{

    constructor(canvas) {
        super(canvas);
        this.createScene(canvas);  
        this.end = false;  
    }
      

    createScene(canvas) {
        this.engine = new BABYLON.Engine(canvas, true)
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 5, -5));
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width:20, height:20});
        this.scene.enablePhysics();
        this.savePoint = [this.ground.position.x,this.ground.position.y]

        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3.Green();
        this.ground.material = groundMat;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);

        this.start = BABYLON.MeshBuilder.CreateGround("start", {width:10, height:10});
        this.start.position.z = 15;
        const startMat = new BABYLON.StandardMaterial("groundMat");
        startMat.diffuseColor = new BABYLON.Color3.Blue();
        this.start.material = startMat;
        this.start.physicsImpostor = new BABYLON.PhysicsImpostor(this.start, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);

        var outputplane = BABYLON.Mesh.CreatePlane("outputplane", 25, this.scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.material = new BABYLON.StandardMaterial("outputplane",  this.scene);
        outputplane.position = new BABYLON.Vector3(-12, 7, 12);
        outputplane.scaling.y = 0.4;

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512,  this.scene, true);
        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.useAlphaFromDiffuseTexture = true;
        outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.backFaceCulling = false;
        outputplane.position.y = this.start.position.y;
        outputplane.position.x = this.start.position.x
        outputplane.position.z = this.start.position.z;
        outputplaneTexture.drawText("start", null, 140, "bold 140px verdana", "white", "#00000000");

    }

    collision(mainCharacter){

    }

    starting(mainCharacter, scene, inputMap){
        scene.onBeforeRenderObservable.add(() => {
            if(mainCharacter.sphere.position.z >= this.start.position.z-5){
                setTimeout(() => {
                    this.end=true;
                },100);
            }
    
        });

    }
}
