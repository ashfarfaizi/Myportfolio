/* ==========================================================================
   Ashfar Faizi — Portfolio · 3D hero scene (Three.js)
   An iridescent, noise-displaced sculpture surrounded by orbit rings and a
   particle field. Reacts to the mouse and to scrolling.
   ========================================================================== */

import * as THREE from 'three';

const canvas = document.getElementById('webgl');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
}

if (!canvas || !webglAvailable()) {
    document.documentElement.classList.add('no-webgl');
} else {
    try { init(); } catch (err) {
        console.warn('3D scene disabled:', err);
        document.documentElement.classList.add('no-webgl');
    }
}

function init() {
    /* ---------- Renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070b, 0.045);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const root = new THREE.Group();          // follows layout + scroll
    const tiltGroup = new THREE.Group();     // follows the mouse
    root.add(tiltGroup);
    scene.add(root);

    /* ---------- Shared GLSL: simplex noise (Ashima Arts / Ian McEwan) ---------- */
    const noiseGLSL = /* glsl */`
        vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
            const vec2 C=vec2(1.0/6.0,1.0/3.0);
            const vec4 D=vec4(0.0,0.5,1.0,2.0);
            vec3 i=floor(v+dot(v,C.yyy));
            vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz);
            vec3 l=1.0-g;
            vec3 i1=min(g.xyz,l.zxy);
            vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx;
            vec3 x2=x0-i2+C.yyy;
            vec3 x3=x0-D.yyy;
            i=mod289(i);
            vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
            float n_=0.142857142857;
            vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.0*floor(p*ns.z*ns.z);
            vec4 x_=floor(j*ns.z);
            vec4 y_=floor(j-7.0*x_);
            vec4 x=x_*ns.x+ns.yyyy;
            vec4 y=y_*ns.x+ns.yyyy;
            vec4 h=1.0-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy);
            vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.0+1.0;
            vec4 s1=floor(b1)*2.0+1.0;
            vec4 sh=-step(h,vec4(0.0));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
            vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x);
            vec3 p1=vec3(a0.zw,h.y);
            vec3 p2=vec3(a1.xy,h.z);
            vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
            m=m*m;
            return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }
    `;

    /* ---------- The sculpture ---------- */
    const blobUniforms = {
        uTime: { value: 0 },
        uAmp: { value: 0.32 },
        uFreq: { value: 0.95 },
        uIntensity: { value: 1 },
        uMouse: { value: new THREE.Vector2() },
    };

    const isSmall = window.innerWidth < 760;
    const blobGeo = new THREE.IcosahedronGeometry(1.55, isSmall ? 40 : 72);

    const blobMat = new THREE.ShaderMaterial({
        uniforms: blobUniforms,
        vertexShader: /* glsl */`
            uniform float uTime;
            uniform float uAmp;
            uniform float uFreq;
            uniform vec2 uMouse;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            varying float vDisp;
            ${noiseGLSL}

            float displacement(vec3 p){
                float t = uTime * 0.22;
                float n  = snoise(p * uFreq + vec3(t, t * 0.6, -t * 0.4));
                float n2 = snoise(p * uFreq * 2.4 + vec3(-t * 0.8, t, t * 0.3)) * 0.35;
                float m  = dot(normalize(p), normalize(vec3(uMouse, 0.6))) * 0.08;
                return (n + n2) * uAmp + m;
            }

            void main(){
                vec3 p = position;
                vec3 n = normalize(normal);
                float d = displacement(p);
                vec3 displaced = p + n * d;

                // Recompute normal from neighbouring points
                vec3 up = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                vec3 tangent = normalize(cross(n, up));
                vec3 bitangent = normalize(cross(n, tangent));
                float e = 0.01;
                vec3 pA = p + tangent * e;   pA = pA + normalize(pA) * displacement(pA);
                vec3 pB = p + bitangent * e; pB = pB + normalize(pB) * displacement(pB);
                vec3 newNormal = normalize(cross(pA - displaced, pB - displaced));
                if (dot(newNormal, n) < 0.0) newNormal = -newNormal;

                vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
                vNormal = normalize(normalMatrix * newNormal);
                vViewDir = normalize(-mv.xyz);
                vDisp = d;
                gl_Position = projectionMatrix * mv;
            }
        `,
        fragmentShader: /* glsl */`
            uniform float uTime;
            uniform float uIntensity;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            varying float vDisp;

            // Inigo Quilez cosine palette — iridescent champagne / violet / aqua
            vec3 palette(float t){
                vec3 a = vec3(0.55, 0.50, 0.55);
                vec3 b = vec3(0.45, 0.40, 0.45);
                vec3 c = vec3(1.0, 1.0, 1.0);
                vec3 d = vec3(0.00, 0.15, 0.35);
                return a + b * cos(6.28318 * (c * t + d));
            }

            void main(){
                vec3 N = normalize(vNormal);
                vec3 V = normalize(vViewDir);
                float fres = pow(1.0 - max(dot(N, V), 0.0), 2.2);

                vec3 irid = palette(fres * 0.9 + vDisp * 1.2 + uTime * 0.03);

                // Soft key light + rim
                vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
                float diff = max(dot(N, L), 0.0);
                vec3 H = normalize(L + V);
                float spec = pow(max(dot(N, H), 0.0), 60.0);

                vec3 base = vec3(0.035, 0.032, 0.05);
                vec3 col = base + irid * (0.18 + diff * 0.35) + irid * fres * 1.1;
                col += vec3(1.0, 0.92, 0.8) * spec * 0.55;
                col += vec3(0.886, 0.769, 0.561) * pow(fres, 4.0) * 0.6;   // champagne rim

                gl_FragColor = vec4(col * uIntensity, 1.0);
            }
        `,
    });
    const blob = new THREE.Mesh(blobGeo, blobMat);
    tiltGroup.add(blob);

    /* ---------- Wireframe shell ---------- */
    const shell = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.35, 1)),
        new THREE.LineBasicMaterial({ color: 0xe2c48f, transparent: true, opacity: 0.12 })
    );
    tiltGroup.add(shell);

    /* ---------- Orbit rings with satellites ---------- */
    const rings = new THREE.Group();
    const ringData = [
        { r: 2.9, tilt: [1.15, 0.2, 0], color: 0xe2c48f, opacity: 0.35, speed: 0.25 },
        { r: 3.4, tilt: [1.45, -0.5, 0.3], color: 0xa99bff, opacity: 0.25, speed: -0.18 },
        { r: 3.9, tilt: [0.9, 0.7, -0.2], color: 0x7fe0d6, opacity: 0.16, speed: 0.12 },
    ];
    const satellites = [];
    ringData.forEach((d) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(...d.tilt);

        const ringGeo = new THREE.BufferGeometry().setFromPoints(
            new THREE.EllipseCurve(0, 0, d.r, d.r, 0, Math.PI * 2).getPoints(180).map((p) => new THREE.Vector3(p.x, p.y, 0))
        );
        const ring = new THREE.LineLoop(ringGeo, new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: d.opacity }));
        pivot.add(ring);

        const sat = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 16, 16),
            new THREE.MeshBasicMaterial({ color: d.color })
        );
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 16, 16),
            new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        sat.add(glow);
        pivot.add(sat);
        satellites.push({ mesh: sat, r: d.r, speed: d.speed, offset: Math.random() * Math.PI * 2 });

        rings.add(pivot);
    });
    tiltGroup.add(rings);

    /* ---------- Particle field ---------- */
    const COUNT = isSmall ? 900 : 2200;
    const pos = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
        const r = 4 + Math.pow(Math.random(), 0.6) * 16;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
        pos[i * 3 + 2] = r * Math.cos(ph) - 4;
        seeds[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const pMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() },
        },
        vertexShader: /* glsl */`
            uniform float uTime;
            uniform float uPixelRatio;
            attribute float aSeed;
            varying float vSeed;
            varying float vAlpha;
            void main(){
                vec3 p = position;
                p.y += sin(uTime * 0.2 + aSeed * 40.0) * 0.25;
                p.x += cos(uTime * 0.15 + aSeed * 25.0) * 0.2;
                vec4 mv = modelViewMatrix * vec4(p, 1.0);
                gl_Position = projectionMatrix * mv;
                float size = mix(1.2, 3.6, aSeed * aSeed);
                gl_PointSize = size * uPixelRatio * (12.0 / -mv.z);
                vSeed = aSeed;
                vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 60.0));
            }
        `,
        fragmentShader: /* glsl */`
            varying float vSeed;
            varying float vAlpha;
            void main(){
                float d = length(gl_PointCoord - 0.5);
                if (d > 0.5) discard;
                float a = smoothstep(0.5, 0.0, d);
                vec3 gold = vec3(0.886, 0.769, 0.561);
                vec3 violet = vec3(0.663, 0.608, 1.0);
                vec3 white = vec3(0.93, 0.92, 0.9);
                vec3 col = vSeed < 0.15 ? gold : (vSeed < 0.3 ? violet : white);
                gl_FragColor = vec4(col, a * vAlpha * 0.75);
            }
        `,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ---------- Layout: place sculpture right on desktop, centred on mobile ---------- */
    const layout = { x: 0, y: 0, scale: 1, parkX: 0 };
    function computeLayout() {
        const w = window.innerWidth;
        if (w < 760) { layout.x = 0.25; layout.y = 1.45; layout.scale = 0.6; layout.parkX = 1.8; }
        else if (w < 1100) { layout.x = 1.5; layout.y = 0.15; layout.scale = 0.82; layout.parkX = 4.6; }
        else { layout.x = 2.15; layout.y = 0.05; layout.scale = 0.95; layout.parkX = 6.2; }
    }
    computeLayout();
    root.position.set(layout.x, layout.y, 0);
    root.scale.setScalar(layout.scale);

    /* ---------- Input ---------- */
    const mouse = new THREE.Vector2();
    const mouseSmooth = new THREE.Vector2();
    window.addEventListener('pointermove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    let scrollProgress = 0;   // 0 at top → 1 after one viewport
    let pageProgress = 0;     // 0 → 1 over whole page
    const onScroll = () => {
        const vh = window.innerHeight;
        scrollProgress = Math.min(window.scrollY / vh, 1);
        const max = document.documentElement.scrollHeight - vh;
        pageProgress = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        pMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
        computeLayout();
    });

    /* ---------- Intro: grow in once the loader lifts ---------- */
    let intro = 0;

    /* ---------- Loop ---------- */
    const clock = new THREE.Clock();
    const speed = reduceMotion ? 0.25 : 1;
    let smoothScroll = 0;

    function frame() {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime * speed;

        if (document.body.classList.contains('is-ready')) intro = Math.min(intro + dt * 0.7, 1);
        const introEase = 1 - Math.pow(1 - intro, 4);

        mouseSmooth.lerp(mouse, 0.05);
        smoothScroll += (scrollProgress - smoothScroll) * 0.08;

        blobUniforms.uTime.value = t;
        blobUniforms.uMouse.value.copy(mouseSmooth);
        blobUniforms.uAmp.value = 0.26 + smoothScroll * 0.18 + Math.sin(t * 0.5) * 0.03;
        blobUniforms.uIntensity.value = 1 - smoothScroll * 0.8;
        const lineFade = 1 - smoothScroll * 0.65;
        shell.material.opacity = 0.12 * lineFade;
        rings.children.forEach((pivot, i) => { pivot.children[0].material.opacity = ringData[i].opacity * lineFade; });
        pMat.uniforms.uTime.value = t;

        // Mouse tilt
        tiltGroup.rotation.y = mouseSmooth.x * 0.35 + t * 0.08;
        tiltGroup.rotation.x = -mouseSmooth.y * 0.25;

        // Scroll: once past the hero the sculpture recedes and parks at the edge,
        // dimmed, so it stays atmospheric without competing with the content
        const s = smoothScroll;
        root.position.x = THREE.MathUtils.lerp(layout.x, layout.parkX, s);
        root.position.y = THREE.MathUtils.lerp(layout.y, Math.sin(pageProgress * Math.PI * 2) * 0.8, s);
        root.position.z = THREE.MathUtils.lerp(0, -4.5, s);
        root.rotation.z = pageProgress * Math.PI * 0.6;
        root.scale.setScalar(layout.scale * (0.6 + 0.4 * introEase));

        shell.rotation.y = -t * 0.05;
        shell.rotation.x = t * 0.03;
        rings.rotation.y = t * 0.04;

        satellites.forEach((sat) => {
            const a = t * sat.speed + sat.offset;
            sat.mesh.position.set(Math.cos(a) * sat.r, Math.sin(a) * sat.r, 0);
        });

        particles.rotation.y = t * 0.012 + mouseSmooth.x * 0.08;
        particles.rotation.x = mouseSmooth.y * 0.05;
        particles.position.y = pageProgress * 3;

        camera.position.x += (mouseSmooth.x * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseSmooth.y * 0.2 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
}
