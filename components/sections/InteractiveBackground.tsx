'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InteractiveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    // 2. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Luxury Gold Warm Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc59b4a, 2.5);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x075da8, 2, 20);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // 4. Create 3D Floating Logo Mesh
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/logo-3d.jpg');

    // Cylinder geometry for 3D coin/medallion effect
    const geometry = new THREE.CylinderGeometry(3.5, 3.5, 0.3, 64);

    // Gold metallic edges material
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xc59b4a,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Face texture material
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.4,
      roughness: 0.3,
    });

    const materials = [
      sideMaterial, // Side ring
      faceMaterial, // Top face
      faceMaterial, // Bottom face
    ];

    const logoMesh = new THREE.Mesh(geometry, materials);
    logoMesh.rotation.x = Math.PI / 3;
    logoMesh.rotation.z = Math.PI / 8;
    logoMesh.position.set(3.5, 0, -2); // Positioned slightly to the right in background
    scene.add(logoMesh);

    // 5. 3D Floating Gold Particles
    const particlesCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const goldColor = new THREE.Color(0xc59b4a);
    const botanicalColor = new THREE.Color(0x087a4b);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      const mixColor = Math.random() > 0.5 ? goldColor : botanicalColor;
      colors[i] = mixColor.r;
      colors[i + 1] = mixColor.g;
      colors[i + 2] = mixColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window Resize Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Slow smooth 3D rotation
      logoMesh.rotation.y += elapsedTime * 0.3;
      logoMesh.position.y = Math.sin(currentTime * 0.0012) * 0.4; // Floating up and down

      particlesMesh.rotation.y += elapsedTime * 0.05;

      // Mouse Parallax Smooth Interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      scene.rotation.y = targetX;
      scene.rotation.x = targetY;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full opacity-40" />

      {/* Ambient Gradient Glow overlay */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-nile/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
