function init() {
  const scene = new THREE.Scene()
  const clock = new THREE.Clock()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )

  camera.position.z = 100
  camera.position.x = 0
  camera.position.y = 0
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  var geometry = new THREE.SphereGeometry(18, 32, 32)

  function color(v) {
    var c = new THREE.Color()
    c.r = (10 + v.y) / 20
    c.g = (10 + v.y) / 20 + Math.sin((v.x / 100) * Math.PI) - 0.5
    c.b = 1 - (10 + v.y) / 20
    return c
  }

  for (var i = 0; i < geometry.faces.length; ++i) {
    var face = geometry.faces[i]
    face.vertexColors[0] = color(geometry.vertices[face.a])
    face.vertexColors[1] = color(geometry.vertices[face.b])
    face.vertexColors[2] = color(geometry.vertices[face.c])
  }

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    vertexColors: THREE.FaceColors,
    transparent: true
  })
  var sphere = new THREE.Mesh(geometry, material)
  var wireframe = new THREE.WireframeGeometry(geometry)
  var line = new THREE.LineSegments(
    wireframe,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    })
  )

  scene.add(sphere)

  const particleMaterial = new THREE.PointsMaterial({
    color: 'rgb(255, 255, 255)',
    size: 0.25,
    map: new THREE.TextureLoader().load('/assets/textures/particle.jpg'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particleGeometry = new THREE.TorusGeometry(25, 10, 120, 120)

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  particleSystem.position.x = -20
  particleSystem.name = 'particleSystem'

  scene.add(particleSystem)

  var light = new THREE.AmbientLight(0xffffff, 1) 
  scene.add(light)


  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('#020202')
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.sortObjects = false
  document.getElementById('webGL').appendChild(renderer.domElement)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize, false)


  const render = () => {
    let timeElapsed = clock.getElapsedTime()

    sphere.rotation.y += 0.005

    sphere.geometry.vertices.forEach((vertex, i) => {
      const x = timeElapsed + i
      vertex.x += Math.sin(timeElapsed + i) * 0.01
    })
    sphere.geometry.verticesNeedUpdate = true

    const particleSystem = scene.getObjectByName('particleSystem')

    particleGeometry.vertices.forEach((vertex, i) => {
      const x = timeElapsed + i
      vertex.y += Math.sin(timeElapsed + i) * 0.01
    })
    particleGeometry.verticesNeedUpdate = true
    particleSystem.rotation.z -= 0.0005
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()
  return scene
}

const scene = init()
