import Level from "./Level.js";

export default class Diving extends Level {

    constructor(canvas) {
        super(canvas);
        this.createScene(canvas);
        this.DI = false;
        this.VI = false;
        this.NG = false;
        this.end = false;
    }

    createScene(canvas) {
        this.engine = new BABYLON.Engine(canvas, true)
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 5, -5));
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        this.divingBoard = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
        this.divingBoard.position.y = 100;
        this.scene.enablePhysics();
        this.savePoint = [this.divingBoard.position.x, this.divingBoard.position.y]

        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3.Green();
        this.divingBoard.material = groundMat;
        this.divingBoard.physicsImpostor = new BABYLON.PhysicsImpostor(this.divingBoard, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);

        this.pool = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 10 });
        this.pool.position.x = 10;
        this.pool.position.y = -100
        this.pool.material = groundMat;
        this.pool.physicsImpostor = new BABYLON.PhysicsImpostor(this.pool, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);
    }

    collision(mainCharacter) {
        if (mainCharacter.sphere.position.y < this.divingBoard.position.y + 1.5 && mainCharacter.sphere.position.x == this.divingBoard.position.x) {
            mainCharacter.sphere.position.y = this.divingBoard.position.y + 1.5
        }
        if (mainCharacter.sphere.position.y < this.pool.position.y + 2.5) {
            mainCharacter.sphere.position.y = this.pool.position.y + 1.5
        }
        if(mainCharacter.sphere.position.y < -101){
            mainCharacter.sphere.position.y = -98;
            mainCharacter.sphere.position.z = 0;
        }
    }
    qteD(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("D", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["D"] || inputMap["d"])) {
            return true;
        }
    }

    qteV(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("V", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["V"] || inputMap["v"])) {
            return true;
        }
    }

    qteN(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("N", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["N"] || inputMap["n"])) {
            return true;
        }
    }

    qteDI(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("D+I", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["D"] || inputMap["d"]) && (inputMap["I"] || inputMap["i"])) {
            return true;
        }
    }

    qteVI(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("V+I", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["V"] || inputMap["v"]) && (inputMap["I"] || inputMap["i"])) {
            return true;
        }
    }

    qteNG(mainCharacter, inputMap, outputplane, outputplaneTexture) {
        const ctx = outputplaneTexture.getContext();
        ctx.clearRect(0, 0, 1000, 1000); //
        outputplaneTexture.drawText("N+G", null, 140, "bold 140px verdana", "white", "#00000000");
        if ((inputMap["N"] || inputMap["n"]) && (inputMap["G"] || inputMap["g"])) {
            return true;
        }
    }

    diving(mainCharacter, scene, inputMap) {
        var D = false;
        var V = false;
        var N = false;
        var DI = false;
        var VI = false;
        var NG = false;

        var D2 = false;
        var N2 = false;
        var DI2 = false;
        var VI2 = false;

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

        outputplaneTexture.drawText("", null, 140, "bold 140px verdana", "white", "#00000000");

        var step=1;


        scene.onBeforeRenderObservable.add(() => {
            outputplane.position.x = mainCharacter.sphere.position.x;
            outputplane.position.y = mainCharacter.sphere.position.y;
            const ctx = outputplaneTexture.getContext();
            ctx.clearRect(0, 0, 1000, 1000); //
            if(mainCharacter.sphere.position.y > 90){
                outputplaneTexture.drawText("ETAPE "+step, null, 140, "bold 100px verdana", "white", "#00000000");

            }
            if (mainCharacter.sphere.position.x < 15) {
                mainCharacter.sphere.position.x += 0.25;
                if (mainCharacter.sphere.position.x > 5) {
                    mainCharacter.sphere.position.y += 0.1;
                }
            }

            if(step == 1){
                if (!D && mainCharacter.sphere.position.y < 90 && mainCharacter.sphere.position.y > 30) {
                    D = this.qteD(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!V && mainCharacter.sphere.position.y < 30 && mainCharacter.sphere.position.y > -30) {
                    V = this.qteV(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!N && mainCharacter.sphere.position.y < -30 && mainCharacter.sphere.position.y > -90) {
                    N = this.qteN(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (D && V && N) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("GAGNÉ", null, 140, "bold 130px verdana", "green", "#00000000");
                }
                else if (mainCharacter.sphere.position.y < -90 && (!D || !V || !N)) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("PERDU", null, 140, "bold 130px verdana", "red", "#00000000");
                }
                if (mainCharacter.sphere.position.y < -98 && D && V && N) {
                    mainCharacter.sphere.position.x = 0;
                    mainCharacter.sphere.position.y = 101.5;
                    step = 2;
                }
                else if (mainCharacter.sphere.position.y < -98 && (!D || !V || !N)) {
                    mainCharacter.sphere.position.x = 0;
                    mainCharacter.sphere.position.y = 101.5;
                    D = false;
                    V = false;
                    N = false;
                }
            }
            if(step == 2) {
                if (!DI && mainCharacter.sphere.position.y < 90 && mainCharacter.sphere.position.y > 30) {
                    DI = this.qteDI(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!VI && mainCharacter.sphere.position.y < 30 && mainCharacter.sphere.position.y > -30) {
                    VI = this.qteVI(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!NG && mainCharacter.sphere.position.y < -30 && mainCharacter.sphere.position.y > -90) {
                    NG = this.qteNG(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (DI && VI && NG) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("GAGNÉ", null, 140, "bold 130px verdana", "green", "#00000000");
                }
                else if (mainCharacter.sphere.position.y < -90 && (!DI || !VI || !NG)) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("PERDU", null, 140, "bold 130px verdana", "red", "#00000000");
                }
                if (mainCharacter.sphere.position.y < -98 && DI && VI && NG) {
                    step = 3;
                }
                else if (mainCharacter.sphere.position.y < -98 && (!DI || !VI || !NG)) {
                    mainCharacter.sphere.position.x = 0;
                    mainCharacter.sphere.position.y = 101.5;
                    DI = false;
                    VI = false;
                    NG = false;
                }
            }
            if(step == 3){
                if (!D2 && mainCharacter.sphere.position.y < 90 && mainCharacter.sphere.position.y > 55) {
                    D2 = this.qteD(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!DI2 && mainCharacter.sphere.position.y < 55 && mainCharacter.sphere.position.y > -5) {
                    DI2 = this.qteDI(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!N2 && mainCharacter.sphere.position.y < -5 && mainCharacter.sphere.position.y > -55) {
                    N2 = this.qteN(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (!VI2 && mainCharacter.sphere.position.y < -55 && mainCharacter.sphere.position.y > -90) {
                    VI2 = this.qteVI(mainCharacter, inputMap, outputplane, outputplaneTexture);
                }
                if (D2 && N2 && DI2 && VI2) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("GAGNÉ", null, 140, "bold 130px verdana", "green", "#00000000");
                }
                else if (mainCharacter.sphere.position.y < -90 && (!D2 || !N2 || !DI2 || !VI2 )) {
                    const ctx = outputplaneTexture.getContext();
                    ctx.clearRect(0, 0, 1000, 1000); //
                    outputplaneTexture.drawText("PERDU", null, 140, "bold 130px verdana", "red", "#00000000");
                }
                if (mainCharacter.sphere.position.y < -98 && D2 && N2 && DI2 && VI2 ) {
                    step ==0;
                    this.end = true;
                }
                else if (mainCharacter.sphere.position.y < -98 && (!D2 || !N2 ||!DI2 || !VI2 )) {
                    mainCharacter.sphere.position.x = 0;
                    mainCharacter.sphere.position.y = 101.5;
                    D2= false;
                    N2 = false;
                    DI2 = false;
                    VI2 = false;
                }
            }
            this.collision(mainCharacter);
        });
    }



}
