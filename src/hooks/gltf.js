import { useAsync } from 'react-use'
import * as THREE from 'three'
import * as GLTF from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTF.GLTFLoader()

export default function useGLTF(url) {
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

          resolve(gltf)
        }

        loader.load(url, handleSuccess, handleProgress, handleError)
      }),
    [],
  )

  return result.value || null
}
