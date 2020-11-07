import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useKey, useMeasure } from 'react-use'
import styled from 'styled-components'
import * as THREE from 'three'
import useGLTF from '../../hooks/gltf'

const Wrapper = styled.main`
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;

  .board {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }
`

export default function Board() {
  const boardRef = useRef()

  // Time scale
  const [timeScale, setTimeScale] = useState(0)

  const [wrapperRef, { width, height }] = useMeasure()

  const camera = useMemo(() => {
    if (!width || !height) {
      return null
    }
    const currentCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
    currentCamera.position.z = 8
    return currentCamera
  }, [width, height])

  const gltf = useGLTF('/avatar.glb')

  const scene = useMemo(() => {
    if (!gltf) {
      return null
    }

    const currentScene = new THREE.Scene()
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new THREE.Vector3())

    gltf.scene.position.x = gltf.scene.position.x - center.x
    gltf.scene.position.y = gltf.scene.position.y - center.y
    currentScene.add(gltf.scene)

    return currentScene
  }, [gltf])

  const mixer = useMemo(() => {
    if (!gltf || !gltf.animations || !gltf.animations.length) {
      return null
    }

    const currentMixer = new THREE.AnimationMixer(gltf.scene)
    for (let index = 0; index < gltf.animations.length; index++) {
      const animation = gltf.animations[index]
      currentMixer.clipAction(animation).play()
    }

    return currentMixer
  }, [gltf])

  const clock = useMemo(() => new THREE.Clock(), [])

  const renderer = useMemo(() => {
    const currentRenderer = new THREE.WebGLRenderer({ antialias: false })
    currentRenderer.setPixelRatio(window.devicePixelRatio)
    return currentRenderer
  }, [])

  // On press key
  useKey('s', () => setTimeScale(0))
  useKey('w', () => setTimeScale(1.2))
  useKey('r', () => setTimeScale(1.8))
  useKey('f', () => setTimeScale(3))

  // Responsive renderer
  useEffect(() => {
    if (!width || !height || !renderer) {
      return
    }

    renderer.setSize(width, height)
  }, [renderer, width, height])

  // Attach to DOM
  useEffect(() => {
    if (!boardRef.current || !renderer) {
      return
    }

    boardRef.current.innerHTML = ''
    boardRef.current.appendChild(renderer.domElement)
  }, [boardRef, renderer])

  // Render
  useEffect(() => {
    if (!camera || !scene || !renderer) {
      return
    }
    renderer.render(scene, camera)
  }, [renderer, camera, scene])

  // Animation
  const requestRef = useRef()
  const animate = useCallback(() => {
    if (mixer) {
      mixer.timeScale = timeScale
      mixer.update(clock.getDelta() * mixer.timeScale)
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
    requestRef.current = requestAnimationFrame(animate)
  }, [mixer, scene, camera, renderer, timeScale, clock])
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [animate, mixer, scene, camera, renderer, timeScale])

  return (
    <Wrapper ref={wrapperRef}>
      <div className='board' style={{ width, height }} ref={boardRef} />
    </Wrapper>
  )
}
