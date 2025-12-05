// Wait for DOM to be ready and Three.js to load
function initializePortfolio() {
// CURSOR
const cursor = document.querySelector('.cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
}

// PARTICLES
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let particleTheme = 'default';

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            
            if (particleTheme === 'sparks') {
                this.speedY = Math.random() * -3 - 1;
                this.speedX = Math.random() * 2 - 1;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            } else if (particleTheme === 'snow') {
                this.speedY = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
            }
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (particleTheme === 'sparks') {
                this.life -= this.decay;
                if (this.life <= 0) this.reset();
            }
            
            if (this.x < 0 || this.x > canvas.width) this.reset();
            if (this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.fillStyle = particleTheme === 'sparks' ? 
                `rgba(255, 136, 0, ${this.life})` : 
                particleTheme === 'snow' ? 
                'rgba(255, 255, 255, 0.8)' : 
                'rgba(0, 255, 136, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function setParticleTheme(theme) {
        particleTheme = theme;
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        document.querySelectorAll('.particle-btn').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }
    window.setParticleTheme = setParticleTheme;
}

// THREE.JS BACKGROUND
let scene, camera, renderer, torusKnot;
const threeScene = document.getElementById('three-scene');
if (threeScene && typeof THREE !== 'undefined') {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: threeScene, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
    torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    function animateThree() {
        requestAnimationFrame(animateThree);
        if (torusKnot) {
            torusKnot.rotation.x += 0.001;
            torusKnot.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    }
    animateThree();
}

// 3D MODEL VIEWER
let modelScene, modelCamera, modelRenderer, cube;
const modelCanvas = document.getElementById('model-canvas');
if (modelCanvas && typeof THREE !== 'undefined') {
    modelScene = new THREE.Scene();
    modelCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    modelRenderer = new THREE.WebGLRenderer({ canvas: modelCanvas, antialias: true });
    modelRenderer.setSize(modelCanvas.offsetWidth, 500);
    modelCamera.position.z = 5;

    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    modelScene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    modelScene.add(light);
    modelScene.add(new THREE.AmbientLight(0x404040));

    let modelMode = 'textured';
    function animateModel() {
        requestAnimationFrame(animateModel);
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
        modelRenderer.render(modelScene, modelCamera);
    }
    animateModel();

    function setModelMode(mode) {
        modelMode = mode;
        if (cube) {
            if (mode === 'wireframe') {
                cube.material.wireframe = true;
            } else if (mode === 'debug') {
                cube.material = new THREE.MeshNormalMaterial();
            } else {
                cube.material = new THREE.MeshPhongMaterial({ color: 0x00ff88, wireframe: false });
            }
        }
        document.querySelectorAll('.model-btn').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }
    window.setModelMode = setModelMode;
}

// SKILL RADAR CHART
const skillCanvas = document.getElementById('skill-chart');
if (skillCanvas) {
    const skillCtx = skillCanvas.getContext('2d');
    skillCanvas.width = 600;
    skillCanvas.height = 500;

    const skills = {
        'Shaders': 90,
        'Scripting': 85,
        'Rigging': 75,
        'Lighting': 80,
        'Optimization': 95,
        'Tools': 88,
        'Game Dev': 82
    };

    function drawRadarChart() {
        const centerX = skillCanvas.width / 2;
        const centerY = skillCanvas.height / 2;
        const radius = 150;
        const skillNames = Object.keys(skills);
        const skillValues = Object.values(skills);
        const angleStep = (Math.PI * 2) / skillNames.length;

        // Grid
        skillCtx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
        skillCtx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            skillCtx.beginPath();
            for (let j = 0; j <= skillNames.length; j++) {
                const angle = j * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * i / 5);
                const y = centerY + Math.sin(angle) * (radius * i / 5);
                if (j === 0) skillCtx.moveTo(x, y);
                else skillCtx.lineTo(x, y);
            }
            skillCtx.closePath();
            skillCtx.stroke();
        }

        // Lines
        skillCtx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        for (let i = 0; i < skillNames.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            skillCtx.beginPath();
            skillCtx.moveTo(centerX, centerY);
            skillCtx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            skillCtx.stroke();
        }

        // Data
        skillCtx.fillStyle = 'rgba(0, 255, 136, 0.3)';
        skillCtx.strokeStyle = '#00ff88';
        skillCtx.lineWidth = 3;
        skillCtx.beginPath();
        for (let i = 0; i < skillNames.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = skillValues[i] / 100;
            const x = centerX + Math.cos(angle) * radius * value;
            const y = centerY + Math.sin(angle) * radius * value;
            if (i === 0) skillCtx.moveTo(x, y);
            else skillCtx.lineTo(x, y);
        }
        skillCtx.closePath();
        skillCtx.fill();
        skillCtx.stroke();

        // Labels
        skillCtx.fillStyle = '#fff';
        skillCtx.font = '14px Rajdhani, sans-serif';
        skillCtx.textAlign = 'center';
        for (let i = 0; i < skillNames.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius + 30);
            const y = centerY + Math.sin(angle) * (radius + 30);
            skillCtx.fillText(skillNames[i], x, y);
            skillCtx.fillStyle = '#00ff88';
            skillCtx.fillText(skillValues[i] + '%', x, y + 18);
            skillCtx.fillStyle = '#fff';
        }
    }
    drawRadarChart();
}

// SHADER SANDBOX
let shaderScene, shaderCamera, shaderRenderer, sphere, sphereMat;
const shaderCanvas = document.getElementById('shader-canvas');
if (shaderCanvas && typeof THREE !== 'undefined') {
    shaderScene = new THREE.Scene();
    shaderCamera = new THREE.PerspectiveCamera(75, shaderCanvas.offsetWidth / 400, 0.1, 1000);
    shaderRenderer = new THREE.WebGLRenderer({ canvas: shaderCanvas, antialias: true });
    shaderRenderer.setSize(shaderCanvas.offsetWidth, 400);
    shaderCamera.position.z = 3;

    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    
    // Custom Dissolve Shader
    const dissolveVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform bool vertexAnim;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            vec3 pos = position;
            if (vertexAnim) {
                pos.y += sin(pos.x * 3.0 + time) * 0.1;
                pos.x += cos(pos.y * 3.0 + time) * 0.1;
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;
    
    const dissolveFragmentShader = `
        uniform float roughness;
        uniform float metalness;
        uniform float dissolveAmount;
        uniform float fresnelPower;
        uniform bool useReflection;
        uniform bool useFresnel;
        uniform bool useDissolve;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simple noise function
        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
            vec3 baseColor = vec3(0.0, 1.0, 0.533);
            
            // Lighting
            vec3 lightDir = normalize(vec3(5.0, 5.0, 5.0));
            float diff = max(dot(vNormal, lightDir), 0.0);
            vec3 color = baseColor * (0.3 + 0.7 * diff);
            
            // Metallic/Roughness
            float metalFactor = metalness;
            float roughFactor = roughness;
            color = mix(color, color * 1.5, metalFactor);
            color *= (1.0 - roughFactor * 0.5);
            
            // Fresnel effect
            if (useFresnel) {
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), fresnelPower);
                color += vec3(0.0, 0.8, 1.0) * fresnel * 0.5;
            }
            
            // Reflection
            if (useReflection) {
                float reflectionStrength = 1.0 - roughness;
                color += vec3(1.0) * reflectionStrength * 0.2;
            }
            
            // Dissolve effect
            if (useDissolve) {
                float dissolveNoise = noise(vUv * 10.0 + vPosition.xy);
                if (dissolveNoise < dissolveAmount) {
                    discard;
                }
                // Dissolve edge glow
                if (dissolveNoise < dissolveAmount + 0.1) {
                    color = vec3(1.0, 0.5, 0.0) * 2.0;
                }
            }
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    
    sphereMat = new THREE.ShaderMaterial({
        vertexShader: dissolveVertexShader,
        fragmentShader: dissolveFragmentShader,
        uniforms: {
            roughness: { value: 0.5 },
            metalness: { value: 0.5 },
            dissolveAmount: { value: 0.0 },
            fresnelPower: { value: 2.0 },
            time: { value: 0.0 },
            useReflection: { value: true },
            useFresnel: { value: true },
            useDissolve: { value: false },
            vertexAnim: { value: false }
        }
    });
    
    sphere = new THREE.Mesh(sphereGeo, sphereMat);
    shaderScene.add(sphere);

    const shaderLight = new THREE.DirectionalLight(0xffffff, 1);
    shaderLight.position.set(5, 5, 5);
    shaderScene.add(shaderLight);
    shaderScene.add(new THREE.AmbientLight(0x404040));

    let dissolveAmount = 0;

    function animateShader() {
        requestAnimationFrame(animateShader);
        if (sphere) {
            sphere.rotation.y += 0.005;
        }
        if (sphereMat) {
            sphereMat.uniforms.time.value += 0.05;
            
            const vertexAnimCheck = document.getElementById('vertex-anim');
            if (vertexAnimCheck) {
                sphereMat.uniforms.vertexAnim.value = vertexAnimCheck.checked;
            }
            
            const dissolveCheck = document.getElementById('dissolve');
            if (dissolveCheck && dissolveCheck.checked) {
                dissolveAmount += 0.005;
                if (dissolveAmount > 1.0) dissolveAmount = 0;
                sphereMat.uniforms.dissolveAmount.value = dissolveAmount;
            } else {
                dissolveAmount = 0;
                sphereMat.uniforms.dissolveAmount.value = 0;
            }
        }
        shaderRenderer.render(shaderScene, shaderCamera);
    }
    animateShader();

    const roughnessSlider = document.getElementById('roughness');
    if (roughnessSlider) {
        roughnessSlider.addEventListener('input', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.roughness.value = parseFloat(e.target.value);
            }
            const val = document.getElementById('roughness-val');
            if (val) val.textContent = e.target.value;
        });
    }

    const metallicSlider = document.getElementById('metallic');
    if (metallicSlider) {
        metallicSlider.addEventListener('input', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.metalness.value = parseFloat(e.target.value);
            }
            const val = document.getElementById('metallic-val');
            if (val) val.textContent = e.target.value;
        });
    }

    const normalSlider = document.getElementById('normal-strength');
    if (normalSlider) {
        normalSlider.addEventListener('input', (e) => {
            const val = document.getElementById('normal-val');
            if (val) val.textContent = e.target.value;
        });
    }

    const fresnelSlider = document.getElementById('fresnel');
    if (fresnelSlider) {
        fresnelSlider.addEventListener('input', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.fresnelPower.value = parseFloat(e.target.value);
            }
            const val = document.getElementById('fresnel-val');
            if (val) val.textContent = e.target.value;
        });
    }

    const reflectionCheck = document.getElementById('reflection');
    if (reflectionCheck) {
        reflectionCheck.addEventListener('change', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.useReflection.value = e.target.checked;
            }
        });
    }

    const fresnelCheck = document.getElementById('fresnel-effect');
    if (fresnelCheck) {
        fresnelCheck.addEventListener('change', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.useFresnel.value = e.target.checked;
            }
        });
    }

    const dissolveCheck = document.getElementById('dissolve');
    if (dissolveCheck) {
        dissolveCheck.addEventListener('change', (e) => {
            if (sphereMat) {
                sphereMat.uniforms.useDissolve.value = e.target.checked;
                if (!e.target.checked) {
                    sphereMat.uniforms.dissolveAmount.value = 0;
                }
            }
        });
    }
}

// MINI GAME
const gameCanvas = document.getElementById('game-canvas');
if (gameCanvas) {
    const gameCtx = gameCanvas.getContext('2d');
    gameCanvas.width = gameCanvas.offsetWidth || 800;
    gameCanvas.height = 500;

    let score = 0;
    let targets = [];
    let targetsHit = 0;

    class Target {
        constructor() {
            this.x = Math.random() * (gameCanvas.width - 50);
            this.y = Math.random() * (gameCanvas.height - 50);
            this.size = 30;
            this.speed = Math.random() * 2 + 1;
            this.dx = (Math.random() - 0.5) * this.speed;
            this.dy = (Math.random() - 0.5) * this.speed;
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < 0 || this.x > gameCanvas.width - this.size) this.dx *= -1;
            if (this.y < 0 || this.y > gameCanvas.height - this.size) this.dy *= -1;
        }
        draw() {
            gameCtx.strokeStyle = '#ff0055';
            gameCtx.lineWidth = 3;
            gameCtx.beginPath();
            gameCtx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
            gameCtx.stroke();
            gameCtx.beginPath();
            gameCtx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 4, 0, Math.PI * 2);
            gameCtx.stroke();
        }
        checkHit(mx, my) {
            const dx = mx - (this.x + this.size / 2);
            const dy = my - (this.y + this.size / 2);
            return Math.sqrt(dx * dx + dy * dy) < this.size / 2;
        }
    }

    function spawnTargets() {
        targets = [];
        for (let i = 0; i < 5; i++) {
            targets.push(new Target());
        }
    }
    spawnTargets();

    gameCanvas.addEventListener('click', (e) => {
        const rect = gameCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        targets = targets.filter(target => {
            if (target.checkHit(mx, my)) {
                score += 100;
                targetsHit++;
                const scoreEl = document.getElementById('score');
                const targetsEl = document.getElementById('targets');
                if (scoreEl) scoreEl.textContent = score;
                if (targetsEl) targetsEl.textContent = targetsHit;
                return false;
            }
            return true;
        });
        
        if (targets.length === 0) {
            spawnTargets();
        }
    });

    function animateGame() {
        requestAnimationFrame(animateGame);
        gameCtx.fillStyle = '#000';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        gameCtx.strokeStyle = 'rgba(255, 0, 85, 0.1)';
        gameCtx.lineWidth = 1;
        for (let i = 0; i < gameCanvas.width; i += 50) {
            gameCtx.beginPath();
            gameCtx.moveTo(i, 0);
            gameCtx.lineTo(i, gameCanvas.height);
            gameCtx.stroke();
        }
        for (let i = 0; i < gameCanvas.height; i += 50) {
            gameCtx.beginPath();
            gameCtx.moveTo(0, i);
            gameCtx.lineTo(gameCanvas.width, i);
            gameCtx.stroke();
        }
        
        targets.forEach(target => {
            target.update();
            target.draw();
        });
    }
    animateGame();

    function restartGame() {
        score = 0;
        targetsHit = 0;
        const scoreEl = document.getElementById('score');
        const targetsEl = document.getElementById('targets');
        if (scoreEl) scoreEl.textContent = score;
        if (targetsEl) targetsEl.textContent = targetsHit;
        spawnTargets();
    }
    window.restartGame = restartGame;
}

// PROJECT TOGGLES
function toggleBreakdown(btn, mode) {
    const card = btn.closest('.project-card');
    if (!card) return;
    const breakdown = card.querySelector('.tech-breakdown');
    const buttons = card.querySelectorAll('.toggle-btn');
    
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (mode === 'developer') {
        breakdown.classList.add('active');
    } else {
        breakdown.classList.remove('active');
    }
};

// MODE TOGGLE
window.setMode = function(mode) {
    if (mode === 'recruiter') {
        document.body.classList.add('recruiter-mode');
    } else {
        document.body.classList.remove('recruiter-mode');
    }
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
};

// RESIZE
window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (gameCanvas) {
        gameCanvas.width = gameCanvas.offsetWidth || 800;
    }
    if (shaderRenderer && shaderCanvas) {
        shaderRenderer.setSize(shaderCanvas.offsetWidth, 400);
    }
    if (modelRenderer && modelCanvas) {
        modelRenderer.setSize(modelCanvas.offsetWidth, 500);
    }
});

// PARALLAX SCROLL
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax background
    if (torusKnot) {
        torusKnot.rotation.y = scrollY * 0.001;
        torusKnot.position.y = scrollY * 0.002;
    }
    
    // Parallax hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
        heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
    }
    
    // Parallax sections
    document.querySelectorAll('.section').forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        
        if (scrollPercent > 0 && scrollPercent < 1) {
            section.style.transform = `translateY(${(1 - scrollPercent) * 50}px)`;
            section.style.opacity = scrollPercent;
        }
    });
    
    // Parallax project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        
        if (scrollPercent > 0 && scrollPercent < 1) {
            const offset = (index % 2 === 0 ? 1 : -1) * 30;
            card.style.transform = `translateY(${(1 - scrollPercent) * offset}px)`;
        }
    });
});

// Wait for DOM and Three.js to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof THREE !== 'undefined') {
            initializePortfolio();
        } else {
            window.addEventListener('load', function() {
                setTimeout(initializePortfolio, 100);
            });
        }
    });
} else {
    if (typeof THREE !== 'undefined') {
        initializePortfolio();
    } else {
        window.addEventListener('load', function() {
            setTimeout(initializePortfolio, 100);
        });
    }
}

