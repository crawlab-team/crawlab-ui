const THREE = window.THREE;

class ThreeJSApp {
  constructor() {
    this.frameId = null;
    this.fps = 60;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.cameraRange = 3;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      500
    );

    this.sceneGroup = new THREE.Object3D();
    this.particularGroup = new THREE.Object3D();
    this.modularGroup = new THREE.Object3D();

    this.mouse = new THREE.Vector2();
    this.INTERSECTED = null;
    this.cameraValue = false;
    this.uSpeed = 0.1;

    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initLights();
    this.initObjects();
    this.initRaycaster();
    this.animate();
  }

  initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    let container = document.querySelector('#login-canvas');
    container.appendChild(this.renderer.domElement);
  }

  initScene() {
    const setColor = 0x000000;
    this.scene.background = new THREE.Color(setColor);
    this.scene.fog = new THREE.Fog(setColor, 2.5, 3.5);
    this.scene.add(this.sceneGroup);
    this.scene.add(this.modularGroup);
  }

  initCamera() {
    this.camera.position.set(0, 0, this.cameraRange);
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initLights() {
    const light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(5, 5, 2);
    light.castShadow = true;
    light.shadow.mapSize.width = 10000;
    light.shadow.mapSize.height = 10000;
    light.penumbra = 0.5;

    const lightBack = new THREE.PointLight(0x409eff, 1);
    lightBack.position.set(0, -3, -1);

    const rectLight = new THREE.RectAreaLight(0x409eff, 50, 1, 1);
    rectLight.position.set(0, 0, 1);
    rectLight.lookAt(0, 0, 0);

    this.scene.add(light);
    this.scene.add(lightBack);
    this.scene.add(rectLight);
  }

  generateParticle(num, amp = 2) {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const geometry = new THREE.CircleGeometry(0.2, 5);

    for (let i = 1; i < num; i++) {
      const pScale = 0.001 + Math.abs(this.mathRandom(0.03));
      const particular = new THREE.Mesh(geometry, material);
      particular.position.set(
        this.mathRandom(amp),
        this.mathRandom(amp),
        this.mathRandom(amp)
      );
      particular.rotation.set(
        this.mathRandom(),
        this.mathRandom(),
        this.mathRandom()
      );
      particular.scale.set(pScale, pScale, pScale);
      particular.speedValue = this.mathRandom(1);
      this.particularGroup.add(particular);
    }
  }

  mathRandom(num = 1) {
    return -Math.random() * num + Math.random() * num;
  }

  initObjects() {
    this.generateParticle(500, 2);
    this.sceneGroup.add(this.particularGroup);

    for (let i = 0; i < 10; i++) {
      const geometry = new THREE.IcosahedronGeometry(1);
      const material = new THREE.MeshStandardMaterial({
        flatShading: THREE.SmoothShading,
        color: 0x111111,
        transparent: false,
        opacity: 1,
        wireframe: false,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.speedRotation = Math.random() * 0.2;
      cube.positionX = this.mathRandom();
      cube.positionY = this.mathRandom();
      cube.positionZ = this.mathRandom();
      cube.castShadow = true;
      cube.receiveShadow = true;

      const newScaleValue = this.mathRandom(0.1);
      cube.scale.set(newScaleValue, newScaleValue, newScaleValue);
      cube.rotation.set(
        this.mathRandom((180 * Math.PI) / 180),
        this.mathRandom((180 * Math.PI) / 180),
        this.mathRandom((180 * Math.PI) / 180)
      );
      cube.position.set(cube.positionX, cube.positionY, cube.positionZ);
      this.modularGroup.add(cube);
    }
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
  }

  addEventListeners() {
    window.addEventListener(
      'mousedown',
      event => this.onMouseDown(event),
      false
    );
    window.addEventListener('mouseup', event => this.onMouseUp(event), false);
    window.addEventListener(
      'mousemove',
      event => this.onMouseMove(event),
      false
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseDown(event) {
    event.preventDefault();
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.modularGroup.children
    );
    if (intersects.length > 0) {
      this.cameraValue = false;
      if (this.INTERSECTED !== intersects[0].object) {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(
            this.INTERSECTED.currentHex
          );
        }
        this.INTERSECTED = intersects[0].object;
        this.INTERSECTED.currentHex =
          this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xffff00);

        TweenMax.to(this.camera.position, 1, {
          x: this.INTERSECTED.position.x,
          y: this.INTERSECTED.position.y,
          z: this.INTERSECTED.position.z + 3,
          ease: Power2.easeInOut,
        });
      } else {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(
            this.INTERSECTED.currentHex
          );
        }
        this.INTERSECTED = null;
      }
    }
  }

  onMouseUp(event) {
    // Add your onMouseUp logic if needed
  }

  animate() {
    const time = performance.now() * 0.0003;
    this.frameId = requestAnimationFrame(() => this.animate());

    for (const object of this.particularGroup.children) {
      object.rotation.x += object.speedValue / 10;
      object.rotation.y += object.speedValue / 10;
      object.rotation.z += object.speedValue / 10;
    }

    const ratio = 0.1;

    for (const cube of this.modularGroup.children) {
      cube.rotation.x += 0.008 * ratio;
      cube.rotation.y += 0.005 * ratio;
      cube.rotation.z += 0.003 * ratio;
      cube.position.x = Math.sin(time * cube.positionZ) * cube.positionY;
      cube.position.y = Math.cos(time * cube.positionX) * cube.positionZ;
      cube.position.z = Math.sin(time * cube.positionY) * cube.positionX;
    }

    this.particularGroup.rotation.y += 0.005 * ratio;
    this.modularGroup.rotation.y -=
      (this.mouse.x * 4 + this.modularGroup.rotation.y) * this.uSpeed * ratio;
    this.modularGroup.rotation.x -=
      (-this.mouse.y * 4 + this.modularGroup.rotation.x) * this.uSpeed * ratio;
    this.camera.lookAt(this.scene.position);

    // this.logoGroup.rotation.x += 0.01;
    // this.logoGroup.rotation.y += 0.01;

    const now = Date.now();
    const elapsed = now - this.then;
    if (elapsed > this.fpsInterval) {
      this.then = now - (elapsed % this.fpsInterval);
      this.renderer.render(this.scene, this.camera);
    }
  }

  stopAnimation() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId); // 使用frameId来停止动画
      this.frameId = null; // 清空frameId
    }
  }

  dispose() {
    this.stopAnimation(); // 停止动画
    this.scene.traverse(object => {
      if (object.material) {
        object.material.dispose();
      }
      if (object.geometry) {
        object.geometry.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

window.initCanvas = function () {
  window.threeJSApp = new ThreeJSApp();
};
window.resetCanvas = function () {
  if (window.threeJSApp) {
    window.threeJSApp.dispose();
    window.threeJSApp = null;
  }
};
