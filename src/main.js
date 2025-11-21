import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Variables globales
let scene, camera, renderer, terrainModel, pmremGenerator;
let isViewOne = true;
let animationId;
let cameraAngle = 0;
let currentCrop = null;
let currentYear = 2019;
let miniScene, miniCamera, miniRenderer, miniModel;
let zoomScene, zoomCamera, zoomRenderer, zoomModel;

// Configuración de cámara
let cameraConfig = {
    radius: 25,
    height: 12,
    rotationSpeed: 0.002
};

// Configuración de vistas
const viewConfig = {
    'two': {
        name: 'Territorio',
        leftImage: 'maps/Aguarague/terreno.png',
        rightImage: 'maps/Tarija/terreno.png',
        section1: {
            type: 'areaOnly',
            area: '108,307',
            unit: 'hectáreas',
            showColor: false
        },
        section2: {
            type: 'image',
            image: 'maps/geografia.jpg'
        }
    },
    'three': {
        name: 'Agua',
        leftImage: 'maps/Aguarague/agua.png',
        rightImage: 'maps/Tarija/agua.png',
        section1: {
            type: 'areaOnly',
            color: '#65a5c8',
            area: '265,46',
            unit: 'hectáreas',
            showColor: true // Agua SÍ muestra cuadrado de color
        },
        section2: {
            type: 'image',
            image: 'crops/agua.jpg'
        }
    },
    'four': {
        name: 'Vegetación',
        leftImage: 'maps/Aguarague/vegetacion.png',
        rightImage: 'maps/Tarija/vegetacion.png',
        section1: {
            type: 'areaOnly',
            color: '#77a56b',
            area: '101.35',
            unit: 'hectáreas',
            showColor: true
        },
        section2: {
            type: 'treeList',
            trees: [
                { name: 'Tajibo' },
                { name: 'Palo santo' },
                { name: 'Algarrobo' },
                { name: 'Quebracho colorado chaqueño' },
                { name: 'Lapacho rosado' },
                { name: 'Tipa' },
                { name: 'Cedro' },
                { name: 'Pacará' },
                { name: 'Urundel' },
                { name: 'Lapacho amarillo' },
                { name: 'Guayacán' },
                { name: 'Ceibo' },
            ]
        }
    },
    'five': {
        name: 'Caminos',
        leftImage: 'maps/Aguarague/caminos.png',
        rightImage: 'maps/Tarija/caminos.png',
        section1: {
            type: 'info',
            title: 'Rutas de Acceso',
            content: [
                '• <b>Carreteras principales:</b> La carretera Ruta 9 atraviesa parte de la zona a lo largo del flanco oriental (conecta Yacuiba, Villa Montes) y la carretera F-29 (Campo Pajoso – Cumbre del Aguaragüe) es un tramo importante para acceso vehicular.',
                '• <b>Caminos secundarios:</b> El tramo entre Yacuiba y Caraparí aún en parte es camino de tierra que atraviesa la cresta de la serranía, pendiente de mejoras.',
                '• <b>Senderos peatonales:</b> Existen antiguas trochas y senderos de herradura utilizados localmente para transitar entre comunidades y hacia zonas boscosas.'
            ]
        }
    },
    'six': {
        name: 'Siembra',
        leftImage: 'maps/Aguarague/maiz.png',
        rightImage: 'maps/Tarija/maiz.png',
        section1: {
            type: 'areaOnly',
            color: '#fcc000',
            area: '37378,23',
            unit: 'hectáreas',
            showColor: true // Siembra SÍ muestra cuadrado de color
        },
        section2: {
            type: 'cropList',
            crops: [
                {
                    id: 'maiz',
                    name: 'Maíz',
                    image: 'crops/maiz.jpeg',
                    info: {
                        title: 'Maíz',
                        content: [
                            '• pH: entre 5.5 y 7.0 (óptimo alrededor de 6.5).',
                            '• Textura: suelos franco-arenosos o francos, bien drenados.',
                            '• Materia orgánica: moderada a alta (C orgánico ≥ 1.5 %).',
                            '• Otros: evitar suelos compactos o con mal drenaje.'
                        ],
                        leftImage: 'maps/Aguarague/maiz.png',
                        rightImage: 'maps/Tarija/maiz.png',
                        legendData: {
                            color: '#fcc000',
                            area: '37378,23'
                        }
                    }
                },
                {
                    id: 'papa',
                    name: 'Papa',
                    image: 'crops/papa.jpeg',
                    info: {
                        title: 'Papa',
                        content: [
                            '• pH: entre 5.2 y 6.4 (prefiere suelos ligeramente ácidos).',
                            '• Textura: franco-arenosa o franco-limosa, suelta y con buena aireación.',
                            '• Materia orgánica: alta (C orgánico ≥ 2 %).',
                            '• Otros: sensible al exceso de cal o suelos alcalinos.'
                        ],
                        leftImage: 'maps/Aguarague/papa.png',
                        rightImage: 'maps/Tarija/papa.png',
                        legendData: {
                            color: '#e7b188',
                            area: '82856,71'
                        }
                    }
                },
                {
                    id: 'trigo',
                    name: 'Trigo',
                    image: 'crops/trigo.jpeg',
                    info: {
                        title: 'Trigo',
                        content: [
                            '• pH: entre 6.0 y 7.0 (ligeramente ácido a neutro).',
                            '• Textura: franca, franco-limosa o franco-arcillosa, profunda y fértil.',
                            '• Materia orgánica: media a alta (C orgánico ≥ 1.5 %).',
                            '• Otros: tolera algo de arcilla, pero requiere buen drenaje.'
                        ],
                        leftImage: 'maps/Aguarague/trigo.png',
                        rightImage: 'maps/Tarija/trigo.png',
                        legendData: {
                            color: '#ffd972',
                            area: '7026,72'
                        }
                    }
                }
            ],
            cropAreas: {
                'maiz': '37378,23',
                'papa': '82856,71', 
                'trigo': '7026,72'
            }
        }
    },
    'seven': {
        name: 'Incendios',
        leftImage: 'maps/Aguarague/2019.png',
        rightImage: 'maps/Tarija/2019.png',
        section1: {
            type: 'areaOnly',
            color: '#d8313a',
            area: '0',
            unit: 'hectáreas',
            showColor: true // Incendios SÍ muestra cuadrado de color
        },
        section2: {
            type: 'yearList',
            years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
            yearAreas: {
                2019: '0',
                2020: '2343.69', 
                2021: '0',
                2022: '341.79',
                2023: '0',
                2024: '0',
                2025: '24.41'
            }
        }
    }
};

// Inicializar la aplicación
function init() {
    setupScene();
    setupCamera();
    setupRenderer();
    setupPMREMGenerator();
    loadHDRI();
    setupEventListeners();
    setupMini3D();
    setupZoom3D(); // ← Agregar esta línea
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 20, 50);
}

function setupCamera() {
    const container = document.getElementById('model3d-container');
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    updateCameraPosition();
}

function setupRenderer() {
    const container = document.getElementById('model3d-container');
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);
}

function setupPMREMGenerator() {
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
}

function loadHDRI() {
    const hdriLoader = new RGBELoader();

    const hdriURL = 'environment.hdr';

    hdriLoader.load(
        hdriURL,
        function (texture) {
            console.log('HDRI cargado exitosamente');

            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;

            pmremGenerator.dispose();

            loadCustomModel();
            animate();
        },
        function (xhr) {
            const progress = (xhr.loaded / xhr.total * 100);
            console.log('Cargando HDRI: ' + progress.toFixed(2) + '% loaded');
        },
        function (error) {
            console.warn('Error cargando HDRI, usando iluminación por defecto:', error);
            setupDefaultLighting();
            loadCustomModel();
            animate();
        }
    );
}

function setupDefaultLighting() {
    console.log('Configurando iluminación por defecto');

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 15, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x4cc9f0, 0.6);
    fillLight.position.set(-8, 10, -8);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-5, 5, -15);
    scene.add(backLight);
}

function loadCustomModel() {
    const loader = new GLTFLoader();
    
    // Configurar DRACOLoader para el GLTFLoader
    const dracoLoader = setupDRACOLoader();
    loader.setDRACOLoader(dracoLoader);

    console.log('Cargando modelo 3D desde: terreno.glb');

    loader.load(
        'terreno.glb',
        onModelLoaded,
        onModelProgress,
        onModelError
    );
}

function setupDRACOLoader() {
    const dracoLoader = new DRACOLoader();
    
    // Configurar la ruta a los archivos del decoder de Draco
    // Si estás usando un bundler como Vite, puedes colocar los archivos en public/
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    
    // O si prefieres usar archivos locales:
    // dracoLoader.setDecoderPath('/draco/');
    
    return dracoLoader;
}



function onModelLoaded(gltf) {
    console.log('Modelo cargado exitosamente:', gltf);

    terrainModel = gltf.scene;
    scene.add(terrainModel);

    adjustModelScaleAndPosition();
    enableShadows();
    setupMaterialProperties();

    console.log('Modelo configurado y listo');
}

function onModelProgress(xhr) {
    const progress = (xhr.loaded / xhr.total * 100);
    console.log('Cargando modelo: ' + progress.toFixed(2) + '% loaded');
}

function onModelError(error) {
    console.error('Error cargando el modelo:', error);
    createFallbackModel();
}

function adjustModelScaleAndPosition() {
    if (!terrainModel) return;

    const box = new THREE.Box3().setFromObject(terrainModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('Tamaño original del modelo:', size);
    console.log('Centro del modelo:', center);

    terrainModel.position.x = -center.x;
    terrainModel.position.y = -center.y;
    terrainModel.position.z = -center.z;

    adjustModelScale(size);

    const scaledSize = new THREE.Vector3().copy(size).multiplyScalar(terrainModel.scale.x);
    adjustCameraForModel(scaledSize);
}

function adjustModelScale(modelSize) {
    // Tu escala personalizada aquí
    terrainModel.scale.set(20, 20, 20);
    console.log('Escala aplicada manualmente: x20');
}

function adjustCameraForModel(modelSize) {
    const maxSize = Math.max(modelSize.x, modelSize.y, modelSize.z);

    cameraConfig.radius = Math.max(5, maxSize * 0.6);
    cameraConfig.height = Math.max(5, maxSize * 0.1);

    camera.fov = 25;
    camera.updateProjectionMatrix();

    console.log('Configuración de cámara ajustada:', cameraConfig);

    scene.fog.near = cameraConfig.radius * 0.2;
    scene.fog.far = cameraConfig.radius * 2.2;

    updateCameraPosition();
}

function enableShadows() {
    if (!terrainModel) return;

    terrainModel.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

function setupMaterialProperties() {
    if (!terrainModel) return;

    terrainModel.traverse(function (child) {
        if (child.isMesh && child.material) {
            child.material.needsUpdate = true;

            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                child.material.envMapIntensity = 1.0;
                child.material.needsUpdate = true;
            }
        }
    });
}

function createFallbackModel() {
    console.log('Creando modelo de fallback (cubo grande)...');

    const geometry = new THREE.BoxGeometry(8, 8, 8);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
        envMapIntensity: 1.0
    });

    terrainModel = new THREE.Mesh(geometry, material);
    terrainModel.castShadow = true;
    terrainModel.receiveShadow = true;

    scene.add(terrainModel);

    adjustCameraForModel(new THREE.Vector3(8, 8, 8));
}

function setupMini3D() {
    const container = document.getElementById('mini-3d-container');

    miniScene = new THREE.Scene();
    miniScene.background = new THREE.Color(0x1a1a2e);

    miniCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    // Acercar más la cámara y ajustar ángulo
    miniCamera.position.set(0, 5, 7); // Más cerca que antes
    miniCamera.lookAt(0, 0, 0);

    miniRenderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance" // Mejorar rendimiento
    });
    
    // Mejorar calidad del renderizado
    miniRenderer.setPixelRatio(window.devicePixelRatio); // Usar pixel ratio del dispositivo
    miniRenderer.setSize(container.clientWidth, container.clientHeight);
    miniRenderer.outputEncoding = THREE.sRGBEncoding;
    miniRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    miniRenderer.toneMappingExposure = 1.0; // Aumentar exposición para mejor visibilidad
    miniRenderer.shadowMap.enabled = true;
    miniRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild(miniRenderer.domElement);

    // Usar el mismo HDRI que la escena principal
    setupMiniLighting();
}

function loadMiniModel(view, cropId = null) {
    if (miniModel) {
        miniScene.remove(miniModel);
        miniModel = null;
    }

    let modelPath = '';
    
    // Determinar qué modelo cargar según la vista
    switch(view) {
        case 'three': // Agua
            modelPath = 'agua.glb';
            break;
        case 'six': // Siembra
            if (cropId) {
                modelPath = `${cropId}.glb`;
            } else if (currentCrop) {
                modelPath = `${currentCrop.id}.glb`;
            } else {
                modelPath = 'maiz.glb';
            }
            break;
        case 'seven': // Incendios
            modelPath = `${currentYear}.glb`;
            break;
        default:
            return;
    }

    if (!modelPath) return;

    const loader = new GLTFLoader();
    const dracoLoader = setupDRACOLoader(); // ← AÑADIR
    loader.setDRACOLoader(dracoLoader); // ← AÑADIR
    
    loader.load(
        modelPath,
        function(gltf) {
            console.log('Modelo miniatura cargado:', modelPath);
            miniModel = gltf.scene;
            miniScene.add(miniModel);

            // Ajustar escala y posición del modelo
            const box = new THREE.Box3().setFromObject(miniModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            miniModel.position.x = -center.x;
            miniModel.position.y = -center.y;
            miniModel.position.z = -center.z;

            // Escala uniforme para que quepa en la vista
            const maxSize = Math.max(size.x, size.y, size.z);
            const scale = 15 / maxSize;
            miniModel.scale.setScalar(scale);

            // Configurar materiales
            miniModel.traverse(function(child) {
                if (child.isMesh && child.material) {
                    child.material.envMapIntensity = 1.0;
                }
            });

        },
        function(xhr) {
            console.log('Cargando miniatura: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        function(error) {
            console.error('Error cargando modelo miniatura:', error);
            createFallbackMiniModel();
        }
    );
}

function createFallbackMiniModel() {
    // Verificar que miniScene existe antes de usarlo
    if (!miniScene) {
        console.warn('miniScene no está inicializado');
        return;
    }
    
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x4cc9f0,
        roughness: 0.3,
        metalness: 0.2
    });

    miniModel = new THREE.Mesh(geometry, material);
    miniScene.add(miniModel);
}

function animateMini() {
    if (miniModel) {
        miniModel.rotation.y += 0.005; // Rotación suave
    }

    if (miniRenderer && miniScene && miniCamera) {
        miniRenderer.render(miniScene, miniCamera);
    }
}

function updateCameraPosition() {
    camera.position.x = Math.cos(cameraAngle) * cameraConfig.radius;
    camera.position.z = Math.sin(cameraAngle) * cameraConfig.radius;
    camera.position.y = cameraConfig.height;
    camera.lookAt(0, 0, 0);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (isViewOne && terrainModel) {
        cameraAngle += cameraConfig.rotationSpeed;
        updateCameraPosition();
    }

    renderer.render(scene, camera);
    animateMini();
}

function onWindowResize() {
    const container = document.getElementById('model3d-container');
    const miniContainer = document.getElementById('mini-3d-container');

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

    if (miniCamera && miniRenderer && miniContainer) {
        miniCamera.aspect = miniContainer.clientWidth / miniContainer.clientHeight;
        miniCamera.updateProjectionMatrix();
        miniRenderer.setSize(miniContainer.clientWidth, miniContainer.clientHeight);
    }

    // Para el zoom
    if (zoomCamera && zoomRenderer) {
        zoomCamera.aspect = window.innerWidth / window.innerHeight;
        zoomCamera.updateProjectionMatrix();
        zoomRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}


function setupViewSelector() {
    const viewSelector = document.getElementById('viewSelector');
    const body = document.body;
    const title = document.querySelector('.title-container');
    const modelContainer = document.getElementById('model3d-container');

    viewSelector.addEventListener('change', function () {
        const selectedView = this.value;
        updateView(selectedView, body, title, modelContainer);
        updateRightPanelContent(selectedView);
    });
}

function updateView(selectedView, body, title, modelContainer) {
    const zoomButton = document.getElementById('mini-zoom-button');
    
    // Remover todas las clases de vista
    body.classList.remove('view-one', 'view-two', 'view-three', 'view-four', 'view-five', 'view-six', 'view-seven');

    // Añadir la clase correspondiente
    body.classList.add('view-' + selectedView);

    if (selectedView === 'one') {
        title.style.display = 'flex';
        modelContainer.style.display = 'block';
        isViewOne = true;
        zoomButton.style.display = 'none';
    } else {
        title.style.display = 'none';
        modelContainer.style.display = 'none';
        isViewOne = false;

        // Mostrar botón zoom solo para vistas específicas
        if (selectedView === 'three' || selectedView === 'six' || selectedView === 'seven') {
            zoomButton.style.display = 'block';
            setTimeout(() => {
                if (selectedView === 'six') {
                    const cropId = currentCrop ? currentCrop.id : 'maiz';
                    loadMiniModel('six', cropId);
                } else {
                    loadMiniModel(selectedView);
                }
            }, 100);
        } else {
            zoomButton.style.display = 'none';
        }
    }

    // Controlar visibilidad de section2
    toggleSection2(selectedView);

    setTimeout(() => {
        onWindowResize();
    }, 500);
}

function updateRightPanelContent(view) {
    const config = viewConfig[view];

    if (!config) return;

    // Actualizar imágenes del panel izquierdo y sección 3
    const leftImage = document.getElementById('left-image');
    const rightImage = document.getElementById('right-image');

    if (view === 'six' && currentCrop) {
        // Vista siembra con cultivo seleccionado
        leftImage.src = currentCrop.info.leftImage;
        rightImage.src = currentCrop.info.rightImage;
    } else if (view === 'seven') {
        // Vista incendios
        leftImage.src = `maps/Aguarague/${currentYear}.png`;
        rightImage.src = `maps/Tarija/${currentYear}.png`;
    } else {
        // Vistas normales
        leftImage.src = config.leftImage;
        rightImage.src = config.rightImage;
    }

    leftImage.alt = `${config.name} - Aguaraque`;
    rightImage.alt = `${config.name} - Tarija`;

    // Actualizar secciones 1 y 2
    updateSection1Content(view);
    updateSection2Content(view);

    // Controlar visibilidad de section2 (por si acaso)
    toggleSection2(view);

    // Seleccionar el primer cultivo por defecto si no hay uno seleccionado
    if (view === 'six' && !currentCrop) {
        const config = viewConfig['six'];
        currentCrop = config.section2.crops[0]; // Maíz por defecto
        updateSection1Content('six');

        const leftImage = document.getElementById('left-image');
        const rightImage = document.getElementById('right-image');
        leftImage.src = currentCrop.info.leftImage;
        rightImage.src = currentCrop.info.rightImage;

        // Marcar visualmente como activo
        const firstItem = document.querySelector(`.crop-item[data-crop-id="${currentCrop.id}"]`);
        if (firstItem) firstItem.classList.add('active');
    }
}

function updateSection1Content(view) {
    const section1Card = document.getElementById('section1-card');
    const config = viewConfig[view];

    if (!config) return;

    let contentHTML = '';

    if (view === 'six' && currentCrop) {
        // Vista siembra con cultivo seleccionado
        const legendData = currentCrop.info.legendData;
        contentHTML = `
            <h2>${config.name}</h2>
            <div class="area-only">
                <div class="color-square" style="background-color: ${legendData.color};"></div>
                <div class="area-value">${legendData.area}</div>
                <div class="area-label">hectáreas</div>
            </div>
        `;
    } else if (view === 'seven') {
        // Vista incendios
        const yearArea = config.section2.yearAreas[currentYear];
        contentHTML = `
            <h2>${config.name} - ${currentYear}</h2>
            <div class="area-only">
                <div class="color-square" style="background-color: ${config.section1.color};"></div>
                <div class="area-value">${yearArea}</div>
                <div class="area-label">hectáreas</div>
            </div>
        `;
    } else if (view === 'two') {
        // Vista territorio - SIN cuadrado de color
        contentHTML = `
            <h2>${config.name}</h2>
            <div class="area-only">
                <div class="area-value">${config.section1.area}</div>
                <div class="area-label">${config.section1.unit}</div>
            </div>
        `;
    } else if (config.section1.type === 'info') {
        // Vista caminos - información textual
        contentHTML = `
            <h2>${config.section1.title}</h2>
            <div class="info-content">
                ${config.section1.content.map(item => `<p>${item}</p>`).join('')}
            </div>
        `;
    } else {
        // Todas las demás vistas - CON cuadrado de color
        contentHTML = `
            <h2>${config.name}</h2>
            <div class="area-only">
                <div class="color-square" style="background-color: ${config.section1.color};"></div>
                <div class="area-value">${config.section1.area}</div>
                <div class="area-label">${config.section1.unit}</div>
            </div>
        `;
    }

    section1Card.innerHTML = contentHTML;
}

function updateSection2Content(view) {
    const section2Card = document.getElementById('section2-card');
    const config = viewConfig[view];

    if (!config || !config.section2) {
        section2Card.innerHTML = '';
        return;
    }

    let contentHTML = '';

    switch (config.section2.type) {
        case 'image':
            contentHTML = `
                <div class="image-container">
                    <img src="${config.section2.image}" alt="${config.name}" class="section2-image">
                </div>
            `;
            break;

        case 'treeList':
            contentHTML = `
                <h3>Especies de Árboles</h3>
                <div class="tree-list">
                    ${config.section2.trees.map(tree => `
                        <div class="tree-item">
                            <span class="tree-name">${tree.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            break;

        case 'cropList':
            contentHTML = `
                <h3>Cultivos</h3>
                <div class="crop-list">
                    ${config.section2.crops.map(crop => `
                        <div class="crop-item ${currentCrop && currentCrop.id === crop.id ? 'active' : ''}" 
                             data-crop-id="${crop.id}">
                            <img src="${crop.image}" alt="${crop.name}" class="crop-image">
                            <span class="crop-name">${crop.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            break;

        case 'yearList':
            contentHTML = `
                <h3>Años de Incendios</h3>
                <div class="year-list">
                    ${config.section2.years.map(year => `
                        <div class="year-item ${year === currentYear ? 'active' : ''}" 
                             data-year="${year}">
                            ${year}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
    }

    section2Card.innerHTML = contentHTML;

    // Agregar event listeners para elementos interactivos
    if (config.section2.type === 'cropList') {
        addCropEventListeners();
    } else if (config.section2.type === 'yearList') {
        addYearEventListeners();
    }
}

function addCropEventListeners() {
    const cropItems = document.querySelectorAll('.crop-item');

    cropItems.forEach(item => {
        item.addEventListener('click', function() {
            const cropId = this.getAttribute('data-crop-id');
            const config = viewConfig['six'];
            currentCrop = config.section2.crops.find(crop => crop.id === cropId);

            // Actualizar clases activas
            cropItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Actualizar contenido de section1
            updateSection1Content('six');

            // Actualizar imágenes
            const leftImage = document.getElementById('left-image');
            const rightImage = document.getElementById('right-image');
            leftImage.src = currentCrop.info.leftImage;
            rightImage.src = currentCrop.info.rightImage;

            // Actualizar modelo 3D en miniatura CON EL CULTIVO ESPECÍFICO
            loadMiniModel('six', cropId);
        });
    });
}

function addYearEventListeners() {
    const yearItems = document.querySelectorAll('.year-item');

    yearItems.forEach(item => {
        item.addEventListener('click', function () {
            const year = parseInt(this.getAttribute('data-year'));
            currentYear = year;

            // Actualizar clases activas
            yearItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Actualizar imágenes
            const leftImage = document.getElementById('left-image');
            const rightImage = document.getElementById('right-image');
            leftImage.src = `maps/Aguarague/${year}.png`;
            rightImage.src = `maps/Tarija/${year}.png`;

            // Actualizar section1 con el área del año seleccionado
            updateSection1Content('seven');

            // Actualizar modelo 3D en miniatura
            const currentView = document.getElementById('viewSelector').value;
            if (currentView === 'seven') {
                loadMiniModel('seven');
            }
        });
    });
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    setupViewSelector();

    // Botones del zoom
    const zoomButton = document.getElementById('mini-zoom-button');
    const backButton = document.getElementById('zoom-back-button');
    
    if (zoomButton) {
        zoomButton.addEventListener('click', activateZoom);
    }
    
    if (backButton) {
        backButton.addEventListener('click', deactivateZoom);
    }

    // También permitir salir con ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.getElementById('zoom-3d-container').classList.contains('active')) {
            deactivateZoom();
        }
    });

    window.addEventListener('beforeunload', cleanup);
}

function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (renderer) {
        renderer.dispose();
    }

    if (miniRenderer) {
        miniRenderer.dispose();
    }

    if (zoomRenderer) {
        zoomRenderer.dispose();
    }

    if (pmremGenerator) {
        pmremGenerator.dispose();
    }

    // Limpiar escenas...
    if (scene) {
        scene.traverse(function(object) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    if (miniScene) {
        miniScene.traverse(function(object) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    if (zoomScene) {
        zoomScene.traverse(function(object) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// Función para mostrar/ocultar section2 según la vista
function toggleSection2(view) {
    const section2 = document.querySelector('.section2');
    const topHalf = document.querySelector('.top-half');
    const section1 = document.querySelector('.section1');
    
    // Vistas que deben mostrar section2: Vegetación (four), Siembra (six), Incendios (seven)
    const showSection2Views = ['four', 'six', 'seven'];
    
    if (showSection2Views.includes(view)) {
        section2.style.display = 'flex';
        section2.style.flex = '1';
        section1.style.flex = '1';
        // Ambas secciones comparten el espacio horizontalmente
        topHalf.style.flexDirection = 'row';
        
        // Agregar separación visual entre las secciones
        section1.style.borderRight = '1px solid #e1e5eb';
        section2.style.borderRight = 'none';
    } else {
        section2.style.display = 'none';
        section1.style.flex = '1';
        // section1 ocupa todo el ancho cuando section2 está oculta
        topHalf.style.flexDirection = 'row';
        
        // Quitar borde derecho cuando section2 no está visible
        section1.style.borderRight = 'none';
    }
}

function setupMiniLighting() {
    // Cargar el mismo HDRI que usa la escena principal
    const hdriLoader = new RGBELoader();
    
    hdriLoader.load(
        'environment.hdr',
        function (texture) {
            console.log('HDRI cargado para miniatura');
            
            // Crear PMREMGenerator para la miniatura
            const miniPmremGenerator = new THREE.PMREMGenerator(miniRenderer);
            miniPmremGenerator.compileEquirectangularShader();
            
            const envMap = miniPmremGenerator.fromEquirectangular(texture).texture;
            miniScene.environment = envMap;
            //miniScene.background = envMap; // Opcional: usar HDRI como fondo
            
            miniPmremGenerator.dispose();
            
            // Agregar luz ambiental adicional para mejor visibilidad
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            miniScene.add(ambientLight);
            
            // Luz direccional principal
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
            directionalLight.position.set(5, 10, 7);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 512;
            directionalLight.shadow.mapSize.height = 512;
            miniScene.add(directionalLight);
            
            // Luz de relleno
            const fillLight = new THREE.DirectionalLight(0x4cc9f0, 0.6);
            fillLight.position.set(-5, 5, -5);
            miniScene.add(fillLight);
            
        },
        function (xhr) {
            console.log('Cargando HDRI para miniatura: ' + (xhr.loaded / xhr.total * 100).toFixed(2) + '%');
        },
        function (error) {
            console.warn('Error cargando HDRI para miniatura, usando iluminación por defecto:', error);
            setupDefaultMiniLighting();
        }
    );
}

function setupDefaultMiniLighting() {
    console.log('Configurando iluminación por defecto para miniatura');

    // Iluminación más intensa para la miniatura
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    miniScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 12, 6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    miniScene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x4cc9f0, 0.8);
    fillLight.position.set(-6, 8, -6);
    miniScene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-3, 5, -10);
    miniScene.add(backLight);
}

function setupZoom3D() {
    const container = document.getElementById('zoom-3d-container');

    zoomScene = new THREE.Scene();
    zoomScene.background = new THREE.Color(0x1a1a2e);

    zoomCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    zoomCamera.position.set(0, 15, 25);
    zoomCamera.lookAt(0, 0, 0);

    zoomRenderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });
    
    zoomRenderer.setPixelRatio(window.devicePixelRatio);
    zoomRenderer.setSize(window.innerWidth, window.innerHeight);
    zoomRenderer.outputEncoding = THREE.sRGBEncoding;
    zoomRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    zoomRenderer.toneMappingExposure = 1.0;
    zoomRenderer.shadowMap.enabled = true;
    zoomRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild(zoomRenderer.domElement);

    setupZoomLighting();
}

function setupZoomLighting() {
    // Iluminación para el zoom
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    zoomScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    zoomScene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x4cc9f0, 0.8);
    fillLight.position.set(-8, 10, -8);
    zoomScene.add(fillLight);
}

function loadZoomModel() {
    // Limpiar modelo anterior
    if (zoomModel) {
        zoomScene.remove(zoomModel);
        zoomModel = null;
    }

    let modelPath = '';
    const currentView = document.getElementById('viewSelector').value;

    switch(currentView) {
        case 'three': // Agua
            modelPath = 'agua.glb';
            break;
        case 'six': // Siembra
            if (currentCrop) {
                modelPath = `${currentCrop.id}.glb`;
            } else {
                modelPath = 'maiz.glb';
            }
            break;
        case 'seven': // Incendios
            modelPath = `${currentYear}.glb`;
            break;
        default:
            modelPath = 'maiz.glb';
    }

    if (!modelPath) return;

    const loader = new GLTFLoader();
    const dracoLoader = setupDRACOLoader(); // ← AÑADIR
    loader.setDRACOLoader(dracoLoader); // ← AÑADIR
    
    loader.load(
        modelPath,
        function(gltf) {
            console.log('Modelo zoom cargado:', modelPath);
            zoomModel = gltf.scene;
            zoomScene.add(zoomModel);

            // Ajustar escala y posición del modelo
            const box = new THREE.Box3().setFromObject(zoomModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            zoomModel.position.x = -center.x;
            zoomModel.position.y = -center.y;
            zoomModel.position.z = -center.z;

            // Escala para vista fullscreen
            const maxSize = Math.max(size.x, size.y, size.z);
            const scale = 25 / maxSize;
            zoomModel.scale.setScalar(scale);

            // Configurar materiales
            zoomModel.traverse(function(child) {
                if (child.isMesh && child.material) {
                    child.material.envMapIntensity = 1.2;
                }
            });

        },
        function(xhr) {
            console.log('Cargando zoom: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        function(error) {
            console.error('Error cargando modelo zoom:', error);
        }
    );
}

function animateZoom() {
    if (zoomModel) {
        zoomModel.rotation.y += 0.005;
    }

    if (zoomRenderer && zoomScene && zoomCamera) {
        zoomRenderer.render(zoomScene, zoomCamera);
    }
    
    if (document.getElementById('zoom-3d-container').classList.contains('active')) {
        requestAnimationFrame(animateZoom);
    }
}

function activateZoom() {
    const zoomContainer = document.getElementById('zoom-3d-container');
    const zoomButton = document.getElementById('mini-zoom-button');
    
    // Cargar el modelo para zoom
    loadZoomModel();
    
    // Mostrar contenedor de zoom
    zoomContainer.classList.add('active');
    zoomButton.style.display = 'none';
    
    // Iniciar animación
    animateZoom();
    
    console.log('Zoom activado');
}

function deactivateZoom() {
    const zoomContainer = document.getElementById('zoom-3d-container');
    const zoomButton = document.getElementById('mini-zoom-button');
    const currentView = document.getElementById('viewSelector').value;
    
    // Ocultar contenedor de zoom
    zoomContainer.classList.remove('active');
    
    // Mostrar botón zoom solo si estamos en vista válida
    if (currentView === 'three' || currentView === 'six' || currentView === 'seven') {
        zoomButton.style.display = 'block';
    }
    
    console.log('Zoom desactivado');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

