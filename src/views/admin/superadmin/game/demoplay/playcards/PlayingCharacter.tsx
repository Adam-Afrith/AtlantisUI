import React, { Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Button, Icon, Img, position } from '@chakra-ui/react'
import { motion, useAnimation } from 'framer-motion';
import { Canvas, useLoader, useFrame  } from 'react-three-fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Sample from 'assets/img/games/Character_sample.glb';

const PlayingChracter: React.FC = () => {
    const groupRef = useRef<any>();
    const gltf = useLoader(GLTFLoader, Sample);  
    const [isHovered, setIsHovered] = useState<any>(false);       
    const mixer = useRef<THREE.AnimationMixer>();
    
    useEffect(() => {
      if(gltf.animations.length > 0){
        mixer.current = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.current.clipAction(gltf.animations[0]);
        action.play();
        return () => {
          mixer.current.stopAllAction();
        };
      }
    }, [gltf]);

  
    useFrame((state, delta) => {
      // Rotate the model on the Y-axis
      
      if (groupRef.current) {      
        groupRef.current.castShadow = true;
        if (mixer.current) {
          mixer.current.update(delta);    
        }
      }
  
    });
  
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
        child.material.color.set(0xffccaaf0); // Set your desired color
        child.material.roughness = 0.4; // Adjust roughness as needed
        child.material.metalness = 0.8; // Adjust metalness as needed
        // child.material.map.format = THREE.RGBAFormat;
      }
    });
  
    function handleClick() {
      console.log('Character Click!')
    }
  
    return (    
      <motion.div initial={{ opacity: 0, background: '#000' }} animate={{ opacity: 1, background: '#0000' }} transition={{ delay: 0.5, duration: 1 }}>
        <group ref={groupRef}>      
          {/* <primitive object={gltf.scene} position={[3, 0 , 0]} /> */}        
          <primitive object={gltf.scene} position={[0, -2.5 , 0]} scale={[1,1,2.5]}/>   {/* For Single view */} 
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 5, 0]} receiveShadow onClick={handleClick} onPointerEnter={()=> setIsHovered(true)} onPointerLeave={()=> setIsHovered(false)} >            
            <planeGeometry args={[100, 500]} />
            <shadowMaterial color={isHovered ? 'orange' : 'lightblue'} opacity={0.5} />
          </mesh>    
        </group>
      </motion.div>
    )
  };


  export default PlayingChracter;