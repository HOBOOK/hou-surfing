<template>
    <client-only>
        <div class="scene-container"  @mouseover="onHover" @mouseleave="onLeave">

            <v-overlay v-if="loading" zIndex="10000" style="backdrop-filter: blur(3px);" :opacity="0.2" absolute>
                <v-col cols="12">
                    <v-row no-gutters align="center" justify="center" class="jumping ">
                        <v-icon large class="rotating" color="#e0e2e7">mdi-cube-outline</v-icon>
                    </v-row>
                    <v-progress-linear indeterminate color="#e0e2e7" class="mb-2" reverse/>
                    <div class="">
                        {{$t('load_data_message')}}
                    </div>
                </v-col>
            </v-overlay>

            <div class="space" @mousedown="onClick"/>
        </div>
    </client-only>
</template>
<script>

import * as THREE from 'three';
Cache.enabled = true;


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

let camera, scene, renderer, controls, raycaster, mouse, space, light,componentGroup, transformControls, box3, box3Helper, gridHelper;
let outlinePass, composer, shaderPass;
let cameras = [];
let objects = [];
let animationIds = [];
let selectedModel, hoveredModel;

let lastTime =0; 
let deltaTime = 1

const loadingManager = new THREE.LoadingManager();
let ktx2Loader = new KTX2Loader(loadingManager)
let gltfLoader = new GLTFLoader(loadingManager)
let dracoLoader = new DRACOLoader(loadingManager)

ktx2Loader.setTranscoderPath('/ktx2/')
dracoLoader.setDecoderPath('/draco/')

export default{
    name:'Scene',
    layout:'empty',
    props:{
        simple: Boolean,
        cameraDistance: {
            type: Number,
            default: 25
        },
    },
    data() {
        return {
        }
    },
    mounted(){
        this.initConfiguration()
        this.initScene()
        
        window.addEventListener('resize', this.onWindowResize)
        window.addEventListener('keydown', this.keyEvent)
        window.addEventListener('keyup', this.keyupEvent)
    },
    
    beforeDestroy() {
        this.initializeResource()
        window.removeEventListener('resize', this.onWindowResize)
        window.removeEventListener('keydown', this.keyEvent)
        window.addEventListener('keyup', this.keyupEvent)
    },
    computed:{
    },
    watch:{
   
    },
    methods:{
        
        initializeResource() {
            if(scene) {
                scene = null
            }
            if(camera) {
                camera = null
            }
            if(renderer) {
                renderer.dispose()
                renderer = null
            }
            if(composer) {
                composer = null
            }
            if(componentGroup) {
                componentGroup = null
            }
            this.cancelAllAnimationFrames()
        },

        async initScene() {
            if(this.loading) return

            console.log('[Scene] :: init scene')
            this.loading = true

            this.initializeResource()

            setTimeout(async () => {
                space = document.getElementsByClassName('space')[0]
                if(space) {
                    while (space.firstChild) {
                        space.removeChild(space.firstChild);
                    }

                    scene = new Scene();
                    var fogExp = new FogExp2(0x777777, 0.005);
                    //scene.fog = fogExp;

                    componentGroup = new Group();
                    componentGroup.name = 'Environment'
                    componentGroup.type = 'group'
                    componentGroup.unselectable = true

                    scene.add(componentGroup)



                    let width = space.clientWidth
                    let height = space.clientHeight
                    const aspect = width / height

                    // TODO: WebGPU 호환성 체크
                    // if(WebGPU.isAvailable()){
                    //     renderer = window.renderer = new WebGPURenderer({alpha: true, antialias: this.$store.state.three?.antialias === true, powerPreference: 'high-performance'  });
                    // }
                    renderer = window.renderer = new WebGLRenderer({alpha: true, antialias: this.$store.state.three?.graphic?.antialias === true, powerPreference: 'high-performance'  });
                    
                    renderer.setClearColor(0xffffff, 0)
                    renderer.setSize( width, height );
                    renderer.setPixelRatio( window.devicePixelRatio );
                    renderer.shadowMap.enabled = true;
                    renderer.shadowMap.soft = true;
                    renderer.shadowMap.type = PCFSoftShadowMap
                    renderer.toneMapping = ACESFilmicToneMapping;
				    renderer.toneMappingExposure = 1;

                    renderer.domElement.addEventListener('mouseup', (e) => {
                        this.$store.state.three.camera.target = controls.target
                        this.$store.state.three.camera.matrix = controls.object.matrixWorld.elements
                        this.$store.commit('setThree', this.$store.state.three)
                    })

                    renderer.domElement.addEventListener('webglcontextlost', (e) => {
                        if(this.$refs.warningDialog)
                            this.$refs.warningDialog.dialog = true
                    }, false)

                    
                    space.appendChild( renderer.domElement );

                    light = new DirectionalLight(0xffffff, 0.3);
                    light.castShadow = true;
                    light.shadow.mapSize.x = 512
                    light.shadow.mapSize.y = 512
                    light.shadow.camera.top = 100;
                    light.shadow.camera.bottom = 0.01;
                    light.shadow.camera.near = 0;
                    light.shadow.camera.far = 1000;
                    light.shadow.mapSize.width = 1024;
                    light.shadow.mapSize.height = 1024;
                    light.shadow.bias = - 0.0001;
                    light.position.set(0, 30, 5)

                    //const dirLightHelper = new DirectionalLightHelper( light, 10 );
                    //componentGroup.add( dirLightHelper );

                    componentGroup.add(light);

                    const ambientLight = new AmbientLight( 0xffffff, 1);
                    componentGroup.add( ambientLight );

                    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 0.5 );
                    hemiLight.position.set( 0, 20, 0 );
                    componentGroup.add( hemiLight );

                    this.initCamera()

                    raycaster = new Raycaster()
                    mouse = new Vector2()


                    // 라이트 디버깅
                    // const helper = new THREE.CameraHelper( light.shadow.camera );
                    // scene.add( helper );

                    composer = new EffectComposer(renderer);
                    let renderPass = new RenderPass(scene, camera);
                    composer.addPass(renderPass);

                    shaderPass = new ShaderPass(FXAAShader);
                    let pixelRatio = window.devicePixelRatio;
                    width  = Math.floor(space.clientWidth * pixelRatio);
                    height = Math.floor(space.clientHeight * pixelRatio);
                    
                    shaderPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
                    shaderPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
                    composer.addPass(shaderPass);

                    outlinePass = new OutlinePass(new Vector2(space.clientWidth, space.clientHeight), scene, camera);
                    outlinePass.edgeStrength = 20; // 외곽선 두께
                    outlinePass.visibleEdgeColor.set('#1E88E5'); // 외곽선 색상
                    composer.addPass(outlinePass);

                    weldingOutlinePass = new OutlinePass(new Vector2(space.clientWidth, space.clientHeight), scene, camera);
                    weldingOutlinePass.edgeStrength = 20; // 외곽선 두께
                    weldingOutlinePass.visibleEdgeColor.set('#1E88E5'); // 외곽선 색상
                    composer.addPass(weldingOutlinePass);

                    ktx2Loader.detectSupport(renderer)

                    gltfLoader.setDRACOLoader(dracoLoader)
                    gltfLoader.setKTX2Loader(ktx2Loader)
                    gltfLoader.setMeshoptDecoder(MeshoptDecoder);

                    lastTime = 0
                    const startRendering = (currentTime) => {
                        animationIds.push(requestAnimationFrame( startRendering ));
                        currentTime *= 0.001;
                        deltaTime = currentTime - lastTime; 
                        lastTime = currentTime; 
                        controls.update()
                        composer.render()
                    }

                    this.renderSkybox()

                    startRendering()

                    
                    this.loading = false
                }
            }, 0)
            
            
        },

        scrollElementById(id){
            this.$nextTick(() => {
                const commandPanel = document.getElementById(id)
                if(commandPanel) {
                    commandPanel.scrollTop = commandPanel.scrollHeight;
                }
            })
        },

        focusCameraToObject(object, distance = 5){
            controls.enabled = false
           
            object.updateMatrixWorld(true);
            const box = new Box3().setFromObject(object);
            const center = new Vector3();
            box.getCenter(center);


            controls.target.set(center.x, center.y, center.z);

            let direction = new Vector3().subVectors(new Vector3(this.cameraDistance, this.cameraDistance, this.cameraDistance), center);
            direction.normalize().multiplyScalar(distance);

            let newCameraPos = new Vector3().addVectors(center, direction);

            let step = 0

           
            

            function animate() {
                if(step < 1) {
                    step += 0.015; 
                    camera.position.lerpVectors(camera.position, newCameraPos, step);
                    requestAnimationFrame(animate);
                } else {
                    controls.enabled = true
                }
            }

            animate()
            controls.update();

        },

        initCamera() {

            const width = space.clientWidth// space.parentElement.clientWidth
            const height = space.clientHeight //space.parentElement.clientHeight
            const aspect = width / height;

            if(this.$store.state.three?.camera?.projection === 0) {
                camera = new PerspectiveCamera( (0.8 * 180) / Math.PI, aspect, 0.01, 1000 );
                camera.position.set(this.cameraDistance, this.cameraDistance, this.cameraDistance)

            } else {
                camera = new OrthographicCamera( - this.cameraDistance * aspect, this.cameraDistance * aspect, this.cameraDistance, - this.cameraDistance, 0.1, 1000 );
                camera.position.set(this.cameraDistance * 10, this.cameraDistance * 10, this.cameraDistance * 10)
            }
            
            camera.rotation.order = 'XYZ';
            camera.rotation.y = - Math.PI / 2;
            camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );

            // 카메라 위치
            let savedCameraMatrix = this.$store.state.three?.camera?.matrix
            
            if( savedCameraMatrix && savedCameraMatrix.length === 16){
                this.$threeUtils.setTransformFromMatrix(camera, savedCameraMatrix)
            }


            this.setCameraLayers()
            
            controls = new OrbitControls(camera, renderer.domElement)
            controls.minZoom  = 0.01;
            controls.maxZoom  = 2;
            controls.maxDistance = 80
            controls.minDistance = 1
            controls.minPolarAngle = Math.PI / 5;
            controls.maxPolarAngle = Math.PI / 2;

            controls.mouseButtons.LEFT = MOUSE.NONE;
            controls.mouseButtons.MIDDLE = MOUSE.PAN;
            controls.mouseButtons.RIGHT = MOUSE.ROTATE

            let controlsTarget = this.$store.state.three?.camera?.target
            if(controlsTarget) {
                controls.target.copy(controlsTarget)
            }



            if(transformControls) {
                scene.remove(transformControls)
            }

            transformControls = new TransformControls( camera, renderer.domElement )
            transformControls.name = 'TransformControls'
            transformControls.type = 'TransformControls'
            transformControls.unselectable = true

            transformControls.addEventListener('change', () => {
                this.$nextTick(() => {
                    if(selectedModel) {
                        if(selectedModel.limit && selectedModel._jointType && selectedModel._jointType !== 'fixed') {
                            let transformType = this.transformMode === 'rotate' ? 'rotation' : 'position'
                            let transformAxis = this.$threeUtils.getTransformAxis(selectedModel.axis)
                            let originPos = selectedModel.origPosition[transformAxis]

                            let minLimit = selectedModel.limit.min
                            let maxLimit = selectedModel.limit.max

                            if( maxLimit < minLimit) {
                                selectedModel[transformType][transformAxis] = Math.max(selectedModel[transformType][transformAxis], maxLimit)
                                selectedModel[transformType][transformAxis] = Math.min(selectedModel[transformType][transformAxis], minLimit)

                            } else {
                                selectedModel[transformType][transformAxis] = Math.max(selectedModel[transformType][transformAxis], minLimit)
                                selectedModel[transformType][transformAxis] = Math.min(selectedModel[transformType][transformAxis], maxLimit)
                            }

                        }
                    }
                })
                
            })
            transformControls.addEventListener('dragging-changed', (event) => {
                controls.enabled = !event.value

                if(event.value) {
                    this.transforming = true
                    
                } else {
                    if(selectedModel && selectedModel.position) {
                        this.saveTransform(selectedModel)
                    }
                    this.$emit('update:transform', selectedModel)

                    setTimeout(()=>{
                        this.transforming = false

                    },500)
                }
            })
            componentGroup.add(transformControls)

            if(composer && composer.passes) {
                composer.passes[0].camera = camera

                for(let passes of composer.passes) {
                    if(passes.renderCamera) {
                        passes.renderCamera = camera
                    }
                }
            }
        },


        cancelAllAnimationFrames(){
            animationIds.forEach(id => cancelAnimationFrame(id))
        },
        keyupEvent(e){
            if(this.transforming) {
                this.selectedModelDetailTransformKey++
                this.transforming = false
            }
        },

        keyEvent(e) {
            
            if(!this.preventSceneEvent) {
                if(e.keyCode >= 48 && e.keyCode < 58) {
                    if(e.altKey) {
                        if(selectedModel) {
                            const selectedURDF = this.findObjectToParentByType(selectedModel, 'URDFJoint')
                            if(selectedURDF) {
                                units[e.keyCode - 48] = selectedURDF
                            }
                        }
                    } else {
                        if(units[e.keyCode - 48]) {
                            this.setModel(units[e.keyCode - 48], true)
                        }
                    }

                    
                } else if(e.keyCode === 192) {
                    this.toggleTransformMode()
                } else if(e.keyCode === 27) {
                    this.unsetModel()
                } else if(e.keyCode === 70) {
                    if(selectedModel) {
                        this.focusCameraToObject(selectedModel)
                    }
                }


                if(e.key === '+' || e.key === '-') {
                    this.transforming = true
                    this.directTransforming(selectedModel, e.key)
                    this.selectedModelDetail = this.$threeUtils.threeObjectToJson(selectedModel)
                }

            } else {
                if (e.key === "Escape") {
                    this.disactiveAllPanel()
                }
            }
            

        },


        onClick(event) {
            if(this.preventSceneEvent || this.transforming  || this.selectedRobotDetail || event.button !== 0) {
                return
            }
            event.preventDefault();

            
            let spaceX = space.clientWidth
            let spaceY = space.clientHeight
            mouse.x = (event.offsetX / spaceX) * 2 - 1;
            mouse.y = -(event.offsetY / spaceY) * 2 + 1;

            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);
            raycaster.layers.enable(1);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(objects);

            let isDoubleClick = false
            if(this.clickCount === 0){
                this.clickCount = 1
                setTimeout(() => {
                    this.clickCount = 0
                }, 200)
            } else {
                isDoubleClick = true
            }



            for (let i = 0; i < intersects.length; i++) {
                let intersectObject = intersects[i].object
                if(intersects[i].object.isMesh) {
                    intersectObject = intersects[i].object.parent
                }

                let model;
                let modelType = intersectObject.modelType

                if(isDoubleClick) {
                    model = this.findObjectToParentByType(intersects[i].object, modelType)
                }

                if(!model) {
                    if(modelType === 'robot') {
                        model = this.findObjectToParentByType(intersects[i].object, 'URDFJoint')
                    } else if(modelType === 'asset') {
                        model = this.findObjectToParentByType(intersects[i].object, modelType)
                    } else {
                        model = intersectObject
                    }
                }

                this.setModel(model)
                break
            }

            

            
        },

        onHover(e) {
            this.sceneMouseHover = true
        },

        onLeave(e) {
            this.sceneMouseHover = false
        },


        setModel(model){
            try{
                if(!model || model instanceof Scene || model?.unselectable) {
                    return
                }

                if(this.selectedModelDetail && model.id == this.selectedModelDetail.id) {
                    this.unsetModel()
                    return
                }

                selectedModel = model

                if(selectedModel) {
                    this.selectedModelDetail = this.$threeUtils.threeObjectToJson(selectedModel)
                    this.setTransformControls(selectedModel)

                    this.$emit('update:model', this.selectedModelDetail)

                    this.setOutline()
                }
            }catch(err){
                console.log('setModel :: 오류', err, model)
            }
        },

        unsetModel(){
            if(selectedModel){
                // if(selectedModel.material)
                //     selectedModel.material.wireframe = false

                transformControls.detach(selectedModel)
                selectedModel = null
            }
            this.removeSelectBox()
            this.setOutline()
            this.selectedModelDetail = null
            this.selectedRobotDetail = null
            this.$emit('update:model', null)
        },

        setOutline() {
            outlinePass.selectedObjects = []
            let objects = []
            
            if(hoveredModel) {
                objects.push(hoveredModel)
            } else if(selectedModel) {
                objects.push(selectedModel)
            }
            outlinePass.selectedObjects = objects
        },



        resizeScene(){
            if(!this.loading) {
                space = document.getElementsByClassName('space')[0]
                if(space) {
                    let width = space.clientWidth
                    let height = space.clientHeight

                    const aspect = width / height
                    camera.aspect = aspect;
                    camera.updateProjectionMatrix();
                    renderer.setSize( width, height );

                    let pixelRatio = window.devicePixelRatio;
                    width  = Math.floor(space.clientWidth * pixelRatio);
                    height = Math.floor(space.clientHeight * pixelRatio);

                     shaderPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
                    shaderPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
                }
                
                
               
            }
        },

        onWindowResize() {
            this.resizeScene()
        },

        loadModel(url, type='asset', groupId, layer=1) {
            return new Promise((resolve, reject) => {
                const baseUrl = this.$axios.defaults.baseURL + '/resources'

                if(url[0] !== '/') {
                    url = '/' + url
                }

                gltfLoader.load(baseUrl + url, (object) => {
                    const model = object.scene || object.scenes[0]
                    model.groupId= groupId
                    model.modelType = type
                    model.type = type
                    model.traverse((node) => {
                        node.modelType = type
                        node.groupId
                        node.layers.set(layer)
                        if(node.isMesh) {
                            //node.castShadow = true
                            node.receiveShadow = true

                        }
                    })
                    resolve(model)
                }, undefined, reject)
            })
        },

        renderSkybox() {
            let materialArray = [];
            let texture_ft = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_ft.jpg');
            let texture_bk = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_bk.jpg');
            let texture_up = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_up.jpg');
            let texture_dn = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_dn.jpg');
            let texture_rt = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_rt.jpg');
            let texture_lf = new TextureLoader().load( 'https://cdn.vridgeai.com/resources/skybox/yonder_lf.jpg');
            
            materialArray.push(new MeshBasicMaterial( { map: texture_ft }));
            materialArray.push(new MeshBasicMaterial( { map: texture_bk }));
            materialArray.push(new MeshBasicMaterial( { map: texture_up }));
            materialArray.push(new MeshBasicMaterial( { map: texture_dn }));
            materialArray.push(new MeshBasicMaterial( { map: texture_rt }));
            materialArray.push(new MeshBasicMaterial( { map: texture_lf }));
            
            for (let i = 0; i < 6; i++){
                materialArray[i].side = BackSide;

            }
            
            let skyboxGeo = new BoxGeometry( 500, 500, 500);
            let skybox = new Mesh( skyboxGeo, materialArray );
            skybox.type = 'skybox'
            skybox.layers.set(3)
            componentGroup.add( skybox );


            //const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

            let groundTexture =  new TextureLoader().load(this.$axios.defaults.baseURL + '/resources/assets/texture/map.png'); // Replace with the path to your texture
            
            groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
            groundTexture.repeat.set(1, 1); 
            //groundTexture.anisotropy = maxAnisotropy
            // 64

            const geometry = new PlaneGeometry(256, 256); 
            const material = new MeshBasicMaterial({ map: groundTexture, transparent: true, opacity: 1 });
            const ground = new Mesh(geometry, material);
            ground.rotation.x = -Math.PI / 2; 
            ground.receiveShadow = true
            ground.position.y = -0.1
            ground.type = 'ground'
            ground.layers.set(3)

            const groundBody = new CANNON.Body({
                mass: 0, 
                shape: new CANNON.Plane(),
                material: new CANNON.Material({ friction: 0.5, restitution: 0.7 })
            });
            this.addPhysics(ground, groundBody)
            componentGroup.add(ground);
        },
    },
}

</script>

<style lang="scss">
.scene-container{
    width:100%;
    height:100%;
    max-height:100%;
    position: relative;
    overflow:hidden;

    .space{
        width:100%;
        height:100%;
        aspect-ratio: 9 / 16 !important;
        
        canvas{
            width:100%;
            height:100%;
        }
    }
    
}
</style>