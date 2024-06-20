import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Sample from 'assets/img/games/Character_sample.glb';
import collector from 'assets/img/games/collector.glb';

const Player: React.FC<{currentScreenId?: number}> = ({currentScreenId}) => {
  const groupRef = useRef<any>();
  const gltf = useLoader(GLTFLoader, collector);
  const [isHovered, setIsHovered] = useState<any>(false);

  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[1]);

  useFrame((state, delta) => {
    // Rotate the model on the Y-axis
    if (groupRef.current) {
      groupRef.current.castShadow = true;
    }
    mixer.update(delta);
  });
  action.play();

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }
  }, []);

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // child.material.color.set(0xffccaaf0); // Set your desired color
      child.material.color.set(0xffffff); // Set your desired color
      child.material.roughness = 0.4; // Adjust roughness as needed
      child.material.metalness = 0.8; // Adjust metalness as needed
      // child.material.map.format = THREE.RGBAFormat;
    }
  });

  function handleClick() {
    console.log('Character Click!');
  }

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene}
        position={[2,9].includes(currentScreenId) ? [2, -6.2, -2.5] : [5, -5, 0]}
        rotation={[0, -1, 0]}
        scale={2.8}
      />{' '}
    </group>
  );
};

export default Player;
