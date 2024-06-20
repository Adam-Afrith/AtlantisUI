import { Box } from '@chakra-ui/react'
import React from 'react'
import { Canvas } from 'react-three-fiber'
import CharacterModal from './CharacterModal'
import Model from './Model'

interface SelectedNPCType {
    preloadedAssets: any;
    isStartsAnimationPlay?: boolean;
    isSpeaking?: boolean;
    selectedNpc?: boolean;
}


const SelectedNPCs: React.FC<SelectedNPCType> = React.memo(({preloadedAssets, isStartsAnimationPlay, isSpeaking, selectedNpc}) => {
  
    return (
        <>
    {selectedNpc ? (
        <Box className={'player_character_image got'}>
          <Canvas camera={{ position: [0, 1, 9] }} > {/* For Single view */}
            {/* <Environment preset={"park"} background />   */}
            <directionalLight position={[2.0, 78.0, 100]} intensity={0.8} color={'ffffff'} castShadow />
            <ambientLight intensity={0.5} />
            {/* <OrbitControls   />  */}
            <pointLight position={[1.0, 4.0, 0.0]} color={'ffffff'} />

            {/* COMPONENTS */}
              <CharacterModal preloadedAssets={preloadedAssets} isStartsAnimationPlay={isStartsAnimationPlay}/>
              <Model position={[-3, -1.5, 4]} rotation={[0, 1, 0]} isSpeaking={false} />
          </Canvas>
        </Box>
      )
    : null}
    </>
  )
});

export default SelectedNPCs;
export type { SelectedNPCType };