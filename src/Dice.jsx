import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const faces = [
  { label: 'Dashboard', color: '#1a1a1a' },
  { label: 'Portfolio', color: '#1a1a1a' },
  { label: 'Strategy', color: '#1a1a1a' },
  { label: 'Invest', color: '#1a1a1a' },
  { label: 'About', color: '#1a1a1a' },
  { label: 'Chat', color: '#1a1a1a' },
]

function makeFaceTexture(label) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, 472, 472)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 64px Inter, Helvetica Neue, Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 256, 256)
  return new THREE.CanvasTexture(canvas)
}

export default function Dice({ onFaceClick }) {
  const mountRef = useRef(null)
  const sceneRef = useRef({})

  useEffect(() => {
    const w = mountRef.current.clientWidth
    const h = mountRef.current.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.z = 5

    const materials = faces.map(f => new THREE.MeshStandardMaterial({ map: makeFaceTexture(f.label) }))
    const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2)
    const dice = new THREE.Mesh(geometry, materials)
    scene.add(dice)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    let targetX = 0, targetY = 0
    let scrollY = 0

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.5
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.5
    }

    const onScroll = (e) => {
      scrollY += e.deltaY * 0.005
    }

    const onClick = (e) => {
      const rect = mountRef.current.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(dice)
      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2)
        onFaceClick && onFaceClick(faces[faceIndex].label)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('wheel', onScroll)
    mountRef.current.addEventListener('click', onClick)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      dice.rotation.x += (targetY + scrollY - dice.rotation.x) * 0.05
      dice.rotation.y += (targetX - dice.rotation.y) * 0.05
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = { renderer, animId }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('wheel', onScroll)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}