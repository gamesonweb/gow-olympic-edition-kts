import Level from "./Level.js";

export default class ShotPut extends Level{

    constructor(canvas) {
        super(canvas);
        this.createScene(canvas);
        this.end = false;
    }


    createScene(canvas) {
        let size = 100;
        this.engine = new BABYLON.Engine(canvas, true)
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(5, 3, -5));
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width:size, height:size});
        this.ground.rotation.y = Math.PI / 4;
        this.ground.position.z = 65
        this.scene.enablePhysics();
        this.savePoint = [this.ground.position.x,this.ground.position.y]

        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3.Green();
        this.ground.material = groundMat;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, this.scene);
    }

    collision(shot){
        if(shot.position.y<1){
            shot.position.y =0.5;
        }
    }

    shotPut(mainCharacter, scene, inputMap){

        let shot = new BABYLON.MeshBuilder.CreateSphere("sphere", {width:20, height:20});
        shot.position.x=0;
        shot.position.y=2;
        shot.position.z=5;
        let trajectory = new BABYLON.Vector3(0, 1, 0);

        var line = BABYLON.MeshBuilder.CreateTube("line", {
            path: [mainCharacter.sphere.position, shot.position],
            radius: 0.1, // Épaisseur de la ligne
            cap: BABYLON.Mesh.CAP_ROUND, // Extrémités arrondies
            sideOrientation: BABYLON.Mesh.DOUBLESIDE // Orientation double face pour éviter les problèmes de visibilité
        }, scene);

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
        outputplaneTexture2.drawText("Appuyer sur espace au bon moment", null, 140, "bold 20px verdana", "white", "#00000000");

        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.useAlphaFromDiffuseTexture = true;
        outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.backFaceCulling = false;
        outputplane.position.x = mainCharacter.sphere.position.x+5;
        outputplane.position.y = mainCharacter.sphere.position.y+4;
        outputplane.position.z = 0
        outputplane2.material.diffuseTexture = outputplaneTexture2;
        outputplane2.material.diffuseTexture.hasAlpha = true;
        outputplane2.useAlphaFromDiffuseTexture = true;
        outputplane2.material.specularColor = new BABYLON.Color3(0, 0, 0);
        outputplane2.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane2.material.backFaceCulling = false;
        outputplane2.position.x = mainCharacter.sphere.position.x+5;
        outputplane2.position.y = mainCharacter.sphere.position.y+3.5;
        outputplane2.position.z = 0

        let state = 1;

        let up = false;
        let down = true;
        let gravity = false;
        let speed = 0.1;
        let speedTrajUpDown = 0.02;
        let moove = false;
        let maxUp = 5;
        let mawDown = 1;
        let addTrajectory = false;
        let objective = 40;

        let addTrajUp = maxUp - 1;
        let addTrajDown = mawDown + 2.5;
        let finState2 = false;
        let finState3 = false;

        let statFail = true;
        scene.onBeforeRenderObservable.add(() => {
            const ctx = outputplaneTexture.getContext();
            ctx.clearRect(0, 0, 1000, 1000);
            outputplaneTexture.drawText(parseInt(shot.position.z-5) +" /"+objective, null, 140, "bold 20px verdana", "white", "#00000000");

            line.dispose();
            if(!moove){
                statFail = true;
                if(shot.position.y<addTrajUp && shot.position.y>addTrajDown){
                    line = BABYLON.MeshBuilder.CreateTube("line", {
                        path: [mainCharacter.sphere.position, shot.position],
                        radius: 0.1,
                        cap: BABYLON.Mesh.CAP_ROUND,
                        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                    }, scene);
                    const lineMat = new BABYLON.StandardMaterial("lineMat");
                    lineMat.diffuseColor = new BABYLON.Color3.Green();
                    line.material = lineMat;
                    addTrajectory = true;
                }
                else{
                    line = BABYLON.MeshBuilder.CreateTube("line", {
                        path: [mainCharacter.sphere.position, shot.position],
                        radius: 0.1,
                        cap: BABYLON.Mesh.CAP_ROUND,
                        sideOrientation: BABYLON.Mesh.DOUBLESIDE
                    }, scene);
                    addTrajectory = false;
                }
            }

            if(shot.position.y>mawDown && down){
                shot.position.y -=speedTrajUpDown;
                trajectory.y -=speedTrajUpDown;
            }
            if(shot.position.y<mawDown){
                up = true;
                down = false;
            }
            if(shot.position.y<maxUp && up){
                shot.position.y +=speedTrajUpDown;
                trajectory.y +=speedTrajUpDown;
            }
            if(shot.position.y>maxUp){
                up = false;
                down = true;
            }
            if ((inputMap[" "])) {
                moove = true;
            }
            if(moove){
                down  = false;
                up = false
                if(!gravity){
                    shot.physicsImpostor = new BABYLON.PhysicsImpostor(shot,BABYLON.PhysicsImpostor.SphereImpostor,{ mass: 1, restitution: 0},scene);
                    gravity = true;
                }
                if(shot.position.y>0.53){
                    shot.position.z +=speed;
                    if(addTrajectory){
                        shot.position.y += trajectory.y/50;
                    }
                    speed+=0.01
                }
            }

            if(shot.position.y<0.53){
                setTimeout(()=>{
                    if(shot.position.z>=objective-5){
                        if(state == 2){finState2 = true;}
                        if(state == 3){finState3 = true;}
                        if(state == 1){
                            state = 2;
                            objective = 55;
                            maxUp = 6;
                            addTrajUp = maxUp - 1.5;
                            addTrajDown = mawDown + 3;
                        }
                        if(state == 2 && finState2){
                            state = 3;
                            objective = 60;
                            maxUp = 6;
                            addTrajUp = maxUp - 1;
                            addTrajDown = mawDown + 3.5;
                        }
                        if(state == 3 && finState3){
                            this.end = true;
                        }
                    }
                    if(this.end == false){
                        shot.dispose();
                        shot = new BABYLON.MeshBuilder.CreateSphere("sphere", {width:20, height:20});
                        trajectory = new BABYLON.Vector3(0, 1, 0);
                        shot.position.x=0;
                        shot.position.y=2;
                        shot.position.z=5;
                        down = true;
                        up = false;
                        moove = false;
                        gravity = false;
                        speed = 0.1;
                        addTrajectory = false;
                    }
                },500);
            }

            /*
            console.log("z "+shot.position.z);
            console.log("y "+shot.position.y);*/
            this.collision(shot);
        });
    }
}
