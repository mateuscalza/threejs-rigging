import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useMeasure, useAsync } from 'react-use'
import * as THREE from 'three'
import useGLTF from '../../hooks/gtlf'

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

  const [wrapperRef, { width, height }] = useMeasure()

  const camera = useMemo(() => {
    if (!width || !height) {
      return null
    }
    const currentCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
    currentCamera.position.z = 8
    return currentCamera
  }, [width, height])

  const scene = useMemo(() => {
    const currentScene = new THREE.Scene()

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    currentScene.add(mesh)
    return currentScene
  }, [])

  const gltf = useGLTF('/avatar.glb', scene)

  const clock = useMemo(() => new THREE.Clock(), [])

  const renderer = useMemo(() => {
    const currentRenderer = new THREE.WebGLRenderer({ antialias: false })
    currentRenderer.setPixelRatio(window.devicePixelRatio)
    return currentRenderer
  }, [])

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

  return (
    <Wrapper ref={wrapperRef}>
      <div className='board' style={{ width, height }} ref={boardRef} />
    </Wrapper>
  )
}
