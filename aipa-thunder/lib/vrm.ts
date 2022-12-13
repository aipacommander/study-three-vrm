import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const vrmLoader = async (divRef: any) => {
    // canvasの取得
    const div = divRef.value

    // シーンの生成
    const scene = new THREE.Scene()

    // カメラの生成
    const camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0.0, 1.0, 5.0)
    // camera.position.set(0, 0.75, -3)
    // camera.rotation.set(0, Math.PI, 0)

    // レンダラーの生成
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.setClearColor(0x7fbfff, 1.0)
    div.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement )
    controls.screenSpacePanning = true
    controls.target.set( 0.0, 1.0, 0.0 )
    controls.update()

    // ライトの生成
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    // VRMの読み込み
    const loader = new PromiseGLTFLoader()
    loader.register((parser: any) => {
        return new VRMLoaderPlugin(parser);
    })
    const gltf = await loader.promiseLoad('/vrm/droid-vrm.vrm',
        (progress: any) => {
            console.log(
                "Loading model...",
                100.0 * (progress.loaded / progress.total),
                "%"
            )
        }
    )
    const vrm = gltf.userData.vrm
    // add the loaded vrm to the scene
    scene.add(vrm.scene)
    vrm.scene.rotation.y = Math.PI
    // deal with vrm features
    console.log(vrm)

    // フレーム毎に呼ばれる
    const clock = new THREE.Clock();
    clock.start()
    const update = () => {
        requestAnimationFrame(update)
        if (vrm !== null) {
            vrm.update(clock.getDelta())
        }
        renderer.render(scene, camera)
    }
    update()
}

class PromiseGLTFLoader extends GLTFLoader {
    promiseLoad(
        url: string,
        onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined,
    ) {
        return new Promise<GLTF>((resolve, reject) => {
            super.load(url, resolve, onProgress, reject)

        })
    }
}