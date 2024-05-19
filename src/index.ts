import * as BABYLON from "babylonjs";
import { AbstractMesh } from "babylonjs";
import { Environment } from "../environment";

// Some global handles for graphics
const theCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(
    theCanvas, 
    true, 
    {
        preserveDrawingBuffer: true,
        stencil: true,
    });

if (!engine) throw "Unable to create an engine!";

// -------------------------------------------------------------------------------
// Create scene
// -------------------------------------------------------------------------------
var createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(theCanvas, true);

    // Add a light
    var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;
    var cannonPlugin = new CannonJSPlugin(true,10,cannon);
    scene.enablePhysics(new Vector3(0,-3,0), cannonPlugin);
    // Add an object
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;
       
    const environment = new Environment(scene, engine);
    environment.init();
    // Create a floor in the scene and position it to the center
    var gymFloor = MeshBuilder.CreateGround("ground", { width: 60, height: 60 }, scene);
    gymFloor.position = new Vector3(0, -3.5, 0);

    // Create wood materials and texture in the scene
    var woodMaterial = new StandardMaterial("woodMaterial", scene);
    var woodTexture = new WoodProceduralTexture("text", 1024, scene);

    // Adjust the texture to look more realistic 
    woodTexture.ampScale = 80.0;

    // Apply the texture to the material
    woodMaterial.diffuseTexture = woodTexture;

    // Apply the material to the gym floor mesh object
    gymFloor.material = woodMaterial;

    // Add physics that simulates the ground
    gymFloor.physicsImpostor = new PhysicsImpostor(gymFloor, PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 1 }, scene);
        if(!env) return null;
    // Create PhotoDome with a .png image and add it to the scene
    var dome = new PhotoDome(
        "mydome",
        "https://sjanlassets.blob.core.windows.net/assets/Looney-Court.png",
        {
            resolution: 32,
            size: 100
        },
        scene
    );    
    await scene.createDefaultXRExperienceAsync({
        floorMeshes: [gymFloor],
    });

    return scene;
};

// Create a default engine to load the scene
try {
    engine = createDefaultEngine();
  } catch (e) {
    console.log(
      "the available createEngine function failed. Creating the default engine instead"
    );
    engine = createDefaultEngine();
  }
  if (!engine) throw "engine should not be null.";
  
  // Create the scene
  createScene().then((returnedScene) => {
    sceneToRender = returnedScene;
  });
  
  // Render the scene by using the engine
  engine.runRenderLoop(function () {
    if (sceneToRender) {
      sceneToRender.render();
    }
  });
  
  // Resize the engine to fit the scene
  window.addEventListener("resize", function () {
    engine.resize();
  });
// -------------------------------------------------------------------------------
// Run the game
// -------------------------------------------------------------------------------
(async function () {
    const sceneToRender = await createScene();
    if(!sceneToRender) throw "Unable to create a scene!";

    window.addEventListener("resize", () => { engine.resize(); });
    engine.runRenderLoop(() => sceneToRender.render())
})()

