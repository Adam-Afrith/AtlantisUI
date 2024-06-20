import React, { Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame  } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Animal from '../../../../assets/img/games/T-Rex.glb';
import Photo from 'assets/img/games/Rampaging T-Rex.png'
import { Button } from '@chakra-ui/react';
import { Circle } from '@react-three/drei';


interface props {
    position: any,
    size: any,
    color: string,

}

let pass: any;

const Trex: React.FC<props> = ({position, size, color}) => {
    const groupRef = useRef<any>();
    const gltf = useLoader(GLTFLoader, Animal);  
    const [isHovered, setIsHovered] = useState<any>(false);    
    const [textureImg, setTextureImg] = useState<any>();    
    
    
    const mixer = new THREE.AnimationMixer(gltf.scene);  
    const action = mixer.clipAction(gltf.animations[0]);    
  
    console.log('glb11$$', gltf);
    console.log('glb12$$', action);
  
    useFrame((state, delta) => {
      // Rotate the model on the Y-axis
      
      if (groupRef.current) {      
        // groupRef.current.rotation.y += delta;
        // groupRef.current.rotation.x += delta;
        // groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 2;        
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
        child.material.roughness = 0.4; // Adjust roughness as needed
        child.material.metalness = 0.8; // Adjust metalness as needed
        //  child.material.map.format = THREE.RGBAFormat;

         console.log('child',child)
      }
    });

    
    
   
    console.log('pass',pass);     

    function handleClick() {
      console.log('Trex Click!')
    }

  return (
    <>
        <group ref={groupRef}>   
            {/* <primitive object={gltf.scene} position={[-2, 0 , 0]} /> */}
            <primitive object={gltf.scene} position={[0, -2.5 , 0]} />   {/* For Single view */} 
            <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={handleClick} onPointerEnter={()=> setIsHovered(true)} onPointerLeave={()=> setIsHovered(false)}>              
              <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={size} />
                {/* <meshBasicMaterial map={pass} attach="material" color={isHovered ? color : 'lightblue'} /> */}
                <shadowMaterial color={pass} opacity={1} />
              </Circle>
            </mesh>         
        </group>
    </>
  )
}

export default Trex
