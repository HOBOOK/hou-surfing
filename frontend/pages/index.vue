<template >
	<div>
		<page-body class="index-container">
			<div class="three-background">
				<div id="container"></div>
			</div>

			<v-row no-gutters align="center" justify="center">
				<v-col cols="12" style="position: relative;">

					<v-card class="index-content" color="transparent" min-width="360" style="width:100%;" flat>
						<v-card-title>
							<v-list-item two-line class="pa-0 ma-0">
								<v-list-item-content>

									<v-list-item-subtitle class="index-subtitle grey--text fade_up_animation delay_600">
										#프로페셔널
									</v-list-item-subtitle>


									<v-list-item-title class="index-title bold fade_up_animation delay_600 delay-300">
										안녕하세요.
									</v-list-item-title>

									<v-list-item-title class="index-title fade_up_animation delay_600 delay-600">
										개발자 <span class="bold">박경호입니다.</span>
									</v-list-item-title>

									<v-list-item-action-text class="mt-12">
										<v-btn @click="setSkill()" :elevation="0">
											스킬
										</v-btn>
										<v-btn @click="setProject()" :elevation="0">
											프로젝트
										</v-btn>
										<v-btn @click="setLink()" :elevation="0">
											마이링크
										</v-btn>
									</v-list-item-action-text>
								</v-list-item-content>
							</v-list-item>
						</v-card-title>
					</v-card>


				</v-col>


			</v-row>

			<v-navigation-drawer
				:value="isSelected"
				right
				absolute
			>
				{{ selectedContent }}

			</v-navigation-drawer>

		</page-body>
	</div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from '@tweenjs/tween.js'
import { TrackballControls } from 'three/examples/jsm//controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';


let gltfLoader = new GLTFLoader()

let scene, renderer, space, light, camera, controls;
let animationIds = []




const objects = [];

export default {
	components: {
	},
	data() {
		return {
			targets: { table: [], sphere: [], helix: [], grid: [] },
			selectedPosition: null,
			selectedObject: null,
			selectedElement: null,
			selectedRotation: null,
			selectedContent: null,
			isSelected:false,
			
			contents:[],
			isSkillContetns: false,
			isProjectContents: false,
			isLinkContetns: false,
			skillContents: [
			{
				title:'아니',
				year:'2023',
				month:'9',
				content:'ff',
				category:'',
			},{
				title:'아니',
				year:'2023',
				month:'9',
				content:'ff'
			},{
				title:'아니',
				year:'2023',
				month:'9',
				content:'ff'
			}],
			projectContents : [
				{
					title:'프프',
					year:'2023',
					month:'9',
					content:'ff',
					category:'',
				},{
					title:'프프',
					year:'2023',
					month:'9',
					content:'ff'
				},{
					title:'프프',
					year:'2023',
					month:'9',
					content:'ff'
				}],

			linkContents : [
				{
					title:'링크',
					year:'2023',
					month:'9',
					content:'ff',
					category:'',
				},{
					title:'링크',
					year:'2023',
					month:'9',
					content:'ff'
				},{
					title:'링크',
					year:'2023',
					month:'9',
					content:'ff'
				}],
		}
	},
	mounted() {
		this.init()
		this.drawBackground()
	},
	watch:{
		// isSelected() {
		// 	if(this.isSelected) {
		// 		controls.enabled = false
		// 	} else {
		// 		controls.enabled = true
		// 	}
		// }
	},
	methods: {

		/**
		 * 3D Render
		 */

		init() {
			space = document.getElementsByClassName('three-background')[0]
			scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2(0xe0e0e0, 0.01);

			const width = window.innerWidth// space.parentElement.clientWidth
			const height = window.innerHeight //space.parentElement.clientHeight


			renderer = new CSS3DRenderer();
			//renderer = window.renderer = new THREE.WebGLRenderer({alpha: true, antialias: this.$store.state.three?.graphic?.antialias === true, powerPreference: 'high-performance'  });

			renderer.setSize(width, height);
			space.appendChild(renderer.domElement);

			light = new THREE.DirectionalLight(0xffffff, 1);
			light.castShadow = true;
			light.shadow.mapSize.x = 2048
			light.shadow.mapSize.y = 2048
			light.shadow.camera.left = -30;
			light.shadow.camera.right = 30;
			light.shadow.camera.top = 35;
			light.shadow.camera.bottom = -30;
			light.shadow.camera.near = 0.1;
			light.shadow.camera.far = 1000;
			scene.add(light);
			light.position.set(0, 20, 10);


			const ambientLight = new THREE.AmbientLight(0x555555, 1);
			scene.add(ambientLight);

			camera = new THREE.PerspectiveCamera(47, width / height, 0.1, 1000);
			// camera.position.set(0,0,0)
			
			camera.position.z = 1200
			camera.position.y = -300
			camera.position.x = -300

			controls = new OrbitControls(camera, renderer.domElement);
			controls.minDistance = 800;
			controls.maxDistance = 3000;
			controls.minPolarAngle = Math.PI / 5;
            controls.maxPolarAngle = Math.PI / 1.25;
			controls.mouseButtons.LEFT = THREE.MOUSE.NONE;
            controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
            controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
			controls.addEventListener('change', this.render);
		},

		

        focusCameraToObject(object, distance = 5){
            controls.enabled = false
            object.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(object);
            const center = new THREE.Vector3();
            box.getCenter(center);


            controls.target.set(center.x, center.y, center.z);

            let direction = new THREE.Vector3().subVectors(new THREE.Vector3(20, 20, 20), center);
            direction.normalize().multiplyScalar(distance);

            let newCameraPos = new THREE.Vector3().addVectors(center, direction);

            let step = 0
			let animations = []
            function animate() {
                if(step < 1) {
                    step += 0.015; 
                    camera.position.lerpVectors(camera.position, newCameraPos, step);
                    animations.push(requestAnimationFrame(animate));
                } else {
                    controls.enabled = true
					animations.forEach(id => cancelAnimationFrame(id))
                }
            }

            animations.push(requestAnimationFrame(animate));
        },

		loadObject(url) {
            return new Promise((resolve, reject) => {
                gltfLoader.load(url, (object) => {
                    const obj = object.scene || object.scenes[0]
                    obj.traverse((node) => {
                        if(node.isMesh) {
                            //node.castShadow = true
                            node.receiveShadow = true

                        }
                    })
                    resolve(obj)
                }, undefined, reject)
            })
        },

		drawBackground(transformType = 'helix') {
			//this.stats = new Stats()
			//this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
			//document.body.appendChild(this.stats.dom);

			
			this.targets = { table: [], sphere: [], helix: [], grid: [] }
			/**
			 * 내 정보
			 */
			const profileElement = document.createElement('div');

			const details = document.createElement('div');
			details.innerHTML = 'Gyeongho Park'
			details.style.fontSize = '5rem';
			details.style.fontFamily = 'Daughter_handwriting';
			profileElement.appendChild(details);

			const profileImage =  document.createElement('img')
			profileImage. src = 'https://avatars.githubusercontent.com/u/37508173?v=4';
			profileImage.style.borderRadius = '100%';
			profileImage.style.userSelect = 'none'
			profileImage.style.webkitUserDrag = 'none'
			profileElement.style.userSelect = 'none'
			profileElement.appendChild(profileImage)

			const objectCSS = new CSS3DObject(profileElement);
			objectCSS.position.x = 0
			objectCSS.position.y = 0
			objectCSS.position.z = 0

			scene.add(objectCSS);

			// table

			for (let i = 0; i < this.contents.length; i ++) {
				const content = this.contents[i]

				const element = document.createElement('div');
				element.className = 'element';
				element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

				const number = document.createElement('div');
				number.className = 'number';
				number.textContent = content.year
				element.appendChild(number);

				const symbol = document.createElement('div');
				symbol.className = 'symbol';
				symbol.textContent = content.title;
				element.appendChild(symbol);

				const details = document.createElement('div');
				details.className = 'details';
				details.innerHTML = content.content + '<br>' + content.month;
				element.appendChild(details);

				const closeButton = document.createElement('div')
				closeButton.className = 'close'
				closeButton.addEventListener('pointerdown', () => {

					
					this.unsetTarget()
				})

				element.appendChild(closeButton)


				const objectCSS = new CSS3DObject(element);
				// objectCSS.position.x = Math.random() * 4000 - 2000;
				// objectCSS.position.y = Math.random() * 4000 - 2000;
				// objectCSS.position.z = Math.random() * 4000 - 2000;

				element.addEventListener('pointerdown', () => {
					if(this.selectedObject === objectCSS) {
						return
					}

					this.setTarget(objectCSS, element)
					this.selectedContent = content
				})

				scene.add(objectCSS);

				objects.push(objectCSS);

				const object = new THREE.Object3D();
				object.position.x = (i * 140) - 1330;
				object.position.y = - (i * 180) + 990;

				this.targets.table.push(object);

			}

			// sphere

			const vector = new THREE.Vector3();

			// for (let i = 0, l = objects.length; i < l; i++) {

			// 	const phi = Math.acos(- 1 + (2 * i) / l);
			// 	const theta = Math.sqrt(l * Math.PI) * phi;

			// 	const object = new THREE.Object3D();

			// 	object.position.setFromSphericalCoords(800, phi, theta);

			// 	vector.copy(object.position).multiplyScalar(2);

			// 	object.lookAt(vector);

			// 	this.targets.sphere.push(object);

			// }

			// helix

			for (let i = 0, l = objects.length; i < l; i++) {

				const theta = i * 0.175 + Math.PI;
				const y = - (i * 8) + 450;

				const object = new THREE.Object3D();

				object.position.setFromCylindricalCoords(900, theta, y);

				vector.x = object.position.x * 2;
				vector.y = object.position.y;
				vector.z = object.position.z * 2;

				object.lookAt(vector);

				this.targets.helix.push(object);

			}

			// grid

			// for (let i = 0; i < objects.length; i++) {

			// 	const object = new THREE.Object3D();

			// 	object.position.x = ((i % 5) * 400) - 800;
			// 	object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
			// 	object.position.z = (Math.floor(i / 25)) * 1000 - 2000;

			// 	this.targets.grid.push(object);

			// }
	
			this.transform(this.targets[transformType]);


			window.addEventListener('resize', this.onWindowResize);

			this.animate()

		},

		transform(targets, duration = 1000) {

			TWEEN.removeAll();

			for (let i = 0; i < objects.length; i++) {

				const object = objects[i];
				const target = targets[i];

				new TWEEN.Tween(object.position)
					.to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
					.easing(TWEEN.Easing.Exponential.InOut)
					.start();

				new TWEEN.Tween(object.rotation)
					.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
					.easing(TWEEN.Easing.Exponential.InOut)
					.start();

			}

			new TWEEN.Tween(this)
				.to({}, duration * 2)
				.onUpdate(this.render)
				.start();

		},
		onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

			this.render();
		},

		render() {
			renderer.render(scene, camera);
		},

		animate() {
			TWEEN.update();
			controls.update();

			for(let obj of objects) {
				obj.lookAt(camera.position)
			}

			if(this.selectedObject) {

				let direction = new THREE.Vector3();
				camera.getWorldDirection(direction);

				let objectPosition = new THREE.Vector3();
				objectPosition.addVectors(camera.position, direction.multiplyScalar(600));
				this.selectedObject.position.set(objectPosition.x, objectPosition.y, objectPosition.z);
				this.selectedObject.lookAt(camera.position)
			}

			animationIds.push(requestAnimationFrame(this.animate))
		},

		setSkill(){
			if(!this.isSkillContetns) {
				this.contents.push(...this.skillContents)
				this.isSkillContetns = true
				this.drawBackground()
			}
		},

		setProject(){
			if(!this.isProjectContents) {
				this.contents.push(...this.projectContents)
				this.isProjectContents = true
				this.drawBackground()
			}
		},

		setLink(){
			if(!this.isLinkContetns) {
				this.contents.push(...this.linkContents)
				this.isLinkContetns = true
				this.drawBackground()
			}
		},

		/**
		 * Event
		 */

		setTarget(objectCSS, element){
			this.unsetTarget()

			this.selectedObject = objectCSS
			this.selectedElement = element

			this.selectedPosition = JSON.parse(JSON.stringify(objectCSS.position))
			this.selectedRotation = objectCSS.rotation

			element.classList.add('selected')

			let direction = new THREE.Vector3();
			camera.getWorldDirection(direction);

			let objectPosition = new THREE.Vector3();
			objectPosition.addVectors(camera.position, direction.multiplyScalar(600));

			new TWEEN.Tween(objectCSS.position)
				.to({ x: objectPosition.x, y: objectPosition.y, z: objectPosition.z }, 1000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.start();

			new TWEEN.Tween(objectCSS.rotation)
				.to({ x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }, 1000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.start();


			new TWEEN.Tween(this)
				.to({}, 1000)
				.onUpdate(this.render)
				.start();

			this.isSelected = true
		},

		unsetTarget(){
			if(this.selectedObject) {
				new TWEEN.Tween(this.selectedObject.position)
					.to({ x: this.selectedPosition.x, y: this.selectedPosition.y, z: this.selectedPosition.z }, 1000)
					.easing(TWEEN.Easing.Exponential.InOut)
					.start();

				new TWEEN.Tween(this.selectedObject.rotation)
					.to({ x: this.selectedRotation.x, y: this.selectedRotation.y, z: this.selectedRotation.z }, 1000)
					.easing(TWEEN.Easing.Exponential.InOut)
					.start();

				this.selectedElement.classList.remove('selected')

				new TWEEN.Tween(this)
					.to({}, 1000)
					.onUpdate(this.render)
					.start();

				this.isSelected = false
			}
		},
	}
}
</script>

<style lang="scss">
.index-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	position: relative;
	user-select: none;

	.index-title {
		font-size: 2.6rem;

	}

	.bold{
		font-family: Pretendard-Bold !important;
	}

	.index-subtitle {
		font-size: 1.3rem;
		font-family: Pretendard-Medium !important;
		margin:8px 0;
	}

	.index-item {

		* {
			font-family: Pretendard-Medium !important;
		}
	}

	.three-background {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;

		canvas {
			width: 100%;
			height: 100%;
		}

	}

}
</style>

<style lang="scss">

.index-container {
	a {
		color: #8ff;
	}

	#menu {
		position: absolute;
		bottom: 20px;
		width: 100%;
		text-align: center;
	}

	.element {
		width: 120px;
		height: 160px;
		box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
		border: 1px solid rgba(127, 255, 255, 0.25);
		font-family: Helvetica, sans-serif;
		text-align: center;
		line-height: normal;
		cursor: default;

		

		
		&.selected {
			.close{
				position: absolute;
				top:4px;
				left:4px;
				height:20px;
				width:20px;
				z-index:5;
				border-radius: 100%;
				cursor: pointer;

				&::after{
					content:'\F0156';
					font: normal normal normal 24px/1 "Material Design Icons";
					font-size: 12px;
					width:20px;
					height:20px;
					vertical-align: middle;
					text-align: center;
				}

				&:hover{
					box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
				}

				&:active{
					box-shadow: 0px 0px 18px rgba(0, 255, 255, 0.75);
				}
			}
		}

		&:not(.selected) {
			&:hover{
				box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
				border: 1px solid rgba(127, 255, 255, 0.75);
				cursor: pointer;
			}

			&:active{
				box-shadow: 0px 0px 18px rgba(0, 255, 255, 0.75);
			}

		}

		

		.number {
			position: absolute;
			top: 20px;
			right: 20px;
			font-size: 12px;
			color: rgba(127, 255, 255, 0.75);
		}

		.symbol {
			position: absolute;
			top: 40px;
			left: 0px;
			right: 0px;
			font-size: 42px;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.75);
			text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
		}

		.details {
			position: absolute;
			bottom: 15px;
			left: 0px;
			right: 0px;
			font-size: 12px;
			color: rgba(127, 255, 255, 0.75);
		}
	}
}

</style>
