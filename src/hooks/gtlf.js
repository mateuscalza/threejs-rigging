import { useAsync } from 'react-use'
import * as THREE from 'three'
import * as GLTF from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTF.GLTFLoader()

export default function useGLTF(url, scene) {
  const result = useAsync(
    () =>
      new Promise((resolve, reject) => {
        const handleError = error => {
          console.error(error)
          alert(error.message)
        }

        const handleProgress = () => undefined

        const handleSuccess = gltf => {
          gltf.scene.traverse(child => {
            if (child.material) {
              let material = new THREE.MeshBasicMaterial()
              material.map = child.material.map
              material.alphaTest = 0.5
              material.skinning = true
              material.side = THREE.DoubleSide
              child.material = material
              child.material.needsUpdate = true
            }
          })

          scene.add(gltf.scene)

          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene)
            for (var i = 0; i < gltf.animations.length; i++) {
              var animation = gltf.animations[i]
              mixer.clipAction(animation).play()
            }
          }
        }

        loader.load(url, handleSuccess, handleProgress, handleError)
      }),
    [],
  )

  return result.value
}
