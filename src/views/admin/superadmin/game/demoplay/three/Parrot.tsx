import React, {useRef} from 'react';
import { OrbitControls } from '@react-three/drei'
import Pirate from '../three/ModelViewer/Pirate'

export const Parrot = () => {
    const groupRef = useRef();           

    return (
        <>
            {/* <OrbitControls /> */}
            <Pirate />
        </>
    )
}

