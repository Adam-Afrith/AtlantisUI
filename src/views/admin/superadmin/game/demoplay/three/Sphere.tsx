import React, { Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Button, Icon, Img, position } from '@chakra-ui/react'
import { motion, useAnimation } from 'framer-motion';
import { Canvas, useLoader, useFrame  } from 'react-three-fiber';
import { Environment } from '@react-three/drei'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Sample from '../../../../assets/img/games/Character_sample.glb';



interface props {
    position: any,
    size: any,
    color: any,
}




const Sphere: React.FC<props> = ({position, size, color}) => {    
    const ref = useRef<any>();
    const [isHovered, setIsHovered] = useState<any>(false);
  
    useFrame((state, delta)=> {
      const speed  = isHovered ? 2 : 0.2
      ref.current.rotation.y += delta * speed
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime) * 2
  
      console.log('ref$$',ref);
    })
  
    function handleClick() {
      console.log('Sphere Click!')
    }
    return (
        <>            
            <mesh position={position} ref={ref} onPointerEnter={()=> setIsHovered(true)} onPointerLeave={()=> setIsHovered(false)} onClick={handleClick}>
                <sphereGeometry args={size} />
                <meshStandardMaterial color={isHovered ? 'orange' : 'lightblue'} wireframe />
            </mesh>
        </>
    )
  
  }


  export default Sphere;