import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const vrmLoader = (canvasRef: any) => {
    // canvasの取得
    const canvas = canvasRef.value

    // シーンの生成
    const scene = new THREE.Scene()

    // カメラの生成
    const camera = new THREE.PerspectiveCamera(
        45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.set(0.0, 1.0, 5.0)
    // camera.position.set(0, 0.75, -3)
    // camera.rotation.set(0, Math.PI, 0)

    // レンダラーの生成
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    // renderer.setClearColor(0x7fbfff, 1.0)
    canvas.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement )
    controls.screenSpacePanning = true
    controls.target.set( 0.0, 1.0, 0.0 )
    controls.update()

    // ライトの生成
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    // VRMの読み込み
    const loader = new GLTFLoader()
    loader.register((parser: any) => {
        return new VRMLoaderPlugin(parser);
    })
    let vrm:any = null
    // loader.load('/vrm/droid-vrm.vrm',
    loader.load('https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm',
        (gltf: any) => {
            vrm = gltf.userData.vrm
            // add the loaded vrm to the scene
            scene.add(vrm.scene)
            vrm.scene.rotation.y = Math.PI
            // deal with vrm features
            console.log(vrm)
        },
        (progress: any) => {
            console.log(
                "Loading model...",
                100.0 * (progress.loaded / progress.total),
                "%"
            )
        },
        (error: any) => {
            console.log(error)
        }
    )

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