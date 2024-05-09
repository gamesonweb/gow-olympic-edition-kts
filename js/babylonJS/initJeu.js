import MainCharacter from "./MainCharacter.js";
import Hub from "./Hub.js";
import Diving from "./Diving.js";
import Running from "./Running.js";
import Tire from "./Tire.js";
import ShotPut from "./ShotPut.js";
import End from "./End.js";

var engine;
var canvas = document.getElementById("renderCanvas");
var camera;
var mainCharacter;
var savePoint;
var hub;
var diving;
var run;
var tire;
var shotPut;
var end;
var inputMap;

const creatMainCharacter = function(scene,camera,ifSetTarget){
    mainCharacter = new MainCharacter(0,0.5,20,20);
    mainCharacter.draw(scene);
    if(ifSetTarget){
        camera.setTarget(mainCharacter.sphere);
    }
    // Gestion des entrées clavier
    inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
}

const createHub = function(canvas) {
    hub = new Hub(canvas);
    var scene = hub.scene;
    engine = hub.engine;
    camera = hub.camera;
    savePoint = hub.savePoint;
    creatMainCharacter(scene,camera,true);
    mainCharacter.move(inputMap,scene,savePoint,hub)

    return scene;
}

const createDiving = function(canvas) {
    diving = new Diving(canvas);
    var scene = diving.scene;
    engine = diving.engine;
    camera = diving.camera;
    savePoint = diving.savePoint;
    creatMainCharacter(scene,camera,true);
    mainCharacter.sphere.position.y = savePoint[1]+0.5;

    return scene;
}

const createRunning = function(canvas) {
    run = new Running(canvas);
    var scene = run.scene;
    engine = run.engine;
    camera = run.camera;
    savePoint = run.savePoint;
    creatMainCharacter(scene,camera,true);
    mainCharacter.sphere.position.x = savePoint[0];
    //mainCharacter.move(inputMap,scene,savePoint,run)

    return scene;
}

const createTire = function(canvas) {
    tire = new Tire(canvas);
    var scene = tire.scene;
    engine = tire.engine;
    camera = tire.camera;
    savePoint = tire.savePoint;
    creatMainCharacter(scene,camera,false);
    //mainCharacter.sphere.position.z = savePoint[2];
    return scene;
}

const createShotPut = function(canvas) {
    shotPut = new ShotPut(canvas);
    var scene = shotPut.scene;
    engine = shotPut.engine;
    camera = shotPut.camera;
    savePoint = shotPut.savePoint;
    creatMainCharacter(scene,camera,false);

    return scene;
}

const createEnd = function(canvas) {
    end = new End(canvas);
    var scene = end.scene;
    engine = end.engine;
    camera = end.camera;
    savePoint = end.savePoint;
    creatMainCharacter(scene,camera,true);
    mainCharacter.move(inputMap,scene,savePoint,end)

    return scene;
}

var ifHub = true;
var ifDiving = false;
var sceneToRender = createHub(canvas);
var renderLoop = engine.runRenderLoop(function(){
    sceneToRender.render();

    if(ifHub){
        hub.starting(mainCharacter,sceneToRender,inputMap);
        ifHub = false;
        ifDiving = true;
    }
    if(ifDiving && hub.end){
        engine.stopRenderLoop(renderLoop);
        startDiving();
    }

});

const startDiving = function(){
    var ifDiving = true;
    var ifRun = false;
    var sceneToRenderDiving = createDiving(canvas);
    var renderLoopDiving = engine.runRenderLoop(function(){
        sceneToRenderDiving.render();

        if(ifDiving) {
            diving.diving(mainCharacter,sceneToRenderDiving,inputMap);
            ifDiving = false;
            ifRun = true;
        }
        if(ifRun&& diving.end) {
            engine.stopRenderLoop(renderLoopDiving);
            startRunning();
        }
    });
}

const startRunning = function(){
    var ifRun = true;
    var ifTire = false;
    var sceneToRenderRunning = createRunning(canvas);
    var renderLoopRunning = engine.runRenderLoop(function(){
        sceneToRenderRunning.render();

        if(ifRun) {
            run.running(mainCharacter,sceneToRenderRunning,inputMap);
            ifRun = false;
            ifTire = true;
        }
        if(ifTire && run.end) {
            engine.stopRenderLoop(renderLoopRunning);
            startTire();
        }
    });
}

const startTire = function(){
    var ifShotPut = false;
    var ifTire = true;
    var sceneToRenderTire = createTire(canvas);
    var renderLoopTire = engine.runRenderLoop(function(){
        sceneToRenderTire.render();

        if(ifTire) {
            tire.tire(mainCharacter,sceneToRenderTire,inputMap);
            ifTire = false;
            ifShotPut = true;
        }
        if(ifShotPut && tire.end){
            engine.stopRenderLoop(renderLoopTire);
            startShotPut();
        }
    });
}

const startShotPut = function(){
    var ifFin = false;
    var ifShotPut = true;
    var sceneToRenderShotPut = createShotPut(canvas);
    var renderLoopShotPut = engine.runRenderLoop(function(){
        sceneToRenderShotPut.render();

        if(ifShotPut){
            shotPut.shotPut(mainCharacter,sceneToRenderShotPut,inputMap);
            ifShotPut = false;
            ifFin = true;
        }
        if(ifFin && shotPut.end){
            engine.stopRenderLoop(renderLoopShotPut);
            startEnd();
        }
    });
}

const startEnd = function(){
    var ifEnd = true;
    var ifDiving = false;
    var sceneToRenderEnd = createEnd(canvas);
    var renderLoopEnd = engine.runRenderLoop(function(){
        sceneToRenderEnd.render();

        if(ifEnd){
            end.ending(mainCharacter,sceneToRenderEnd,inputMap);
            ifEnd = false;
            ifDiving = true;
        }/*
        if(ifDiving && end.end){
            engine.stopRenderLoop(renderLoopEnd);
            startDiving();
        }*/

    });
}

window.addEventListener("resize", function () {
    engine.resize();
});
