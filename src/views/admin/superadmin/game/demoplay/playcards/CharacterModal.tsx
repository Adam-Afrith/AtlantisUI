// CharacterModal.js
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/** may pass via props in future */
const cameraPosition = [1, -1.5, 5.2];
const rotation = { x: 0, y: 11.5, z: 0 }; //degree to rotate
const animationsArray = [1, 0, 1, 1, 0];
const audioDuration = 15;
/**End */

/**** ###props:
 **   isAnimationsCompleted: boolean  => want to handle if the sequence of animations are completed
 **   isIntrupted: boolean => this state hanldes if loading content is skipped, then animation playback also stopped when this state became true
 **   animationsArray: [] => this holds the sequence of animation index value to be play
 **   characterGlb: string(url)
 **   isStartsAnimationPlay: boolean => if true, then only starts playing animations
 **   cameraPosition: [0: {position:[x,y,z], duration:millisecond}, 1:{position:[x,y,z], duration:millisecond} ...]
 **   rotation:[0: {angle: {x:0, y:11.5, z:0}, duration:milliseconds}, 1: {angle: {x:0, y:11.5, z:0}, duration:milliseconds}, ...]
 **   audioDuration: number => it needs to sync audio and animation playback
 ******/
const CharacterModal: React.FC<{
  preloadedAssets: any;
  isStartsAnimationPlay?: boolean;
}> = ({ preloadedAssets, isStartsAnimationPlay=false }) => {
  const clock = new THREE.Clock();
  const groupRef = useRef<any>();
  const [gltf, setGltf] = useState(null);
  var mixer = useRef(null);
  const renderer = new THREE.WebGLRenderer();

  useEffect(() => {
    let animationFrameId:any = null;
    const loadGltf = async () => {
      try {
        const response = await fetch(
          preloadedAssets?.preloadedGLBs?.characterGlb,
        );
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const loader = new GLTFLoader();
        loader.load(
          objectUrl,
          async (gltf) => {
            setGltf(gltf);
            groupRef.current = gltf.scene;
            groupRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
            const newMixer = new THREE.AnimationMixer(gltf.scene);
            mixer.current = newMixer;
            const animations = gltf.animations;
            if (animations && animations.length > 0) {
              const syncAudioAndAnimationDuration = async (
                audioDuration: number,
                animationsArray: number[],
                animations: any[],
              ) => {
                let totalPlayTime = 0;
                let isFinished = false;
                let totalCycleArray = [];
                do {
                  const resultArray = animationsArray.map(
                    (animationIndex: number) => {
                      if (isFinished === false) {
                        if (
                          totalPlayTime === 0 &&
                          animations[animationIndex].duration >= audioDuration
                        ) {
                          isFinished = true;
                          return {
                            animationIndex: animationIndex,
                            actionTimeOut: audioDuration,
                          };
                        } else {
                          if (totalPlayTime === 0) {
                            totalPlayTime +=
                              animations[animationIndex].duration;
                            return {
                              animationIndex: animationIndex,
                              actionTimeOut: null,
                            };
                          } else if (
                            totalPlayTime > 0 &&
                            totalPlayTime +
                              animations[animationIndex].duration >=
                              audioDuration
                          ) {
                            isFinished = true;
                            return {
                              animationIndex: animationIndex,
                              actionTimeOut: audioDuration - totalPlayTime,
                            };
                          } else {
                            totalPlayTime +=
                              animations[animationIndex].duration;
                            return {
                              animationIndex: animationIndex,
                              actionTimeOut: null,
                            };
                          }
                        }
                      } else {
                        return null;
                      }
                    },
                  );
                  const filteredArray = resultArray.filter(
                    (item) => item !== null && item !== undefined,
                  );
                  totalCycleArray.push(...filteredArray);
                } while (isFinished === false);
                return totalCycleArray;
              };

              const animationPlayArray = await syncAudioAndAnimationDuration(
                audioDuration,
                animationsArray,
                animations,
              );
              let i = 0;
              let isPlaybackInProgress = true;
              var currentPlayingTime:number|null = null;
              // do {
              const playAnimation = (index: number, isClampAction = false) => {
                const existingAction = mixer.current._actions.findIndex(
                  (actionValue: any) =>
                    actionValue.getClip() ===
                    animations[animationsArray[index]],
                );

                let action;
                if (existingAction !== -1) {
                  action = mixer.current._actions[existingAction];
                } else {
                  action = mixer.current.clipAction(
                    animations[animationsArray[index]],
                  );
                }

                action.loop = THREE.LoopOnce;
                action.reset();
                // Perform crossfade if there's a previous animation
                if (i > 0) {
                  const prevAction = mixer.current.clipAction(
                    animations[animationsArray[i - 1]],
                  );
                  prevAction.crossFadeTo(action, 0.1, true);
                }

                action.zeroSlopeAtEnd = true;
                action.zeroSlopeAtStart = true;
                action.reset().play();

                if (isClampAction) {
                  action.clampWhenFinished = true;
                }
              };

              const update = () => {
                const delta = clock.getDelta()
                if (i < animationPlayArray.length) {
                  if (animationPlayArray[i].actionTimeOut === null) {
                    mixer.current.update(delta);
                    requestAnimationFrame(update);
                  } else {
                    currentPlayingTime+=delta; 
                    if (
                      currentPlayingTime >= animationPlayArray[i].actionTimeOut
                    ) {
                      const currentAction = mixer.current._actions.find((action:any)=> action.isRunning());
                     
                      // if (i > 0) {
                      //   const prevAction = mixer.current.clipAction(
                      //     animations[animationsArray[i - 1]],
                      //   );
                      //   prevAction.fadeOut(currentAction, 0.5, true);
                      // }
                      if (currentAction) {
                        // currentAction.reset();
                        // mixer.current.stopAllAction();
                        stopAnimation()
                        /**setIsAnimationsCompleted(true) */
                      }                      
                    } else {
                      mixer.current.update(delta);
                      requestAnimationFrame(update);
                    }
                  }
                }
              };
              
              // Call animations to play
              if (mixer.current && animationPlayArray[i] !== undefined) {
                playAnimation(animationPlayArray[i].animationIndex);
                currentPlayingTime=0;
                update();
                
                mixer.current.addEventListener('finished', () => {
                  if (isPlaybackInProgress===false) {
                    const currentAction = mixer.current._actions.find((action:any)=> action.isRunning());
                    currentAction.reset();
                    mixer.current.stopAllAction();
                  }
                  if (i < animationPlayArray.length - 1) {
                    playAnimation(animationPlayArray[++i].animationIndex);
                    currentPlayingTime=0;
                    update();
                  } else {           
                    isPlaybackInProgress = false; // Mark playback as complete
                  }
                });
              }
            }
          },
          undefined,
          (error) => {
            console.error('Error loading GLB:', error);
          },
        );
      } catch (error) {
        console.error('Error loading GLTF:', error);
      }
    };
    loadGltf();

    return ()=>{
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      } 
    };
  }, [isStartsAnimationPlay]);

  useEffect(() => {
    return () => {
      // Dispose the loaded GLTF model when unmounting
      gltf?.scene.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
    };
  }, [gltf]);

  const calculateAnimationsPlayTimeForASequence = (
    animations: any,
    seqArray: number[],
  ) => {
    let total: number = 0;
    for (let ind of seqArray) {
      total += animations[ind].duration;
    }
    return total;
  };

  const syncVoiceAndAnimation = (
    audioDuration: number,
    animationsArray: number[],
    animations: any,
  ) => {
    const animationsCycleDuration = calculateAnimationsPlayTimeForASequence(
      animations,
      animationsArray,
    );

    // Calculate the number of times the animation cycle needs to be repeated
    const cycleRepeats = Math.ceil(audioDuration / animationsCycleDuration);

    // Calculate the remaining duration after completing the animation cycles
    const remainingDuration =
      audioDuration - animationsCycleDuration * (cycleRepeats - 1);

    // Control animation play duration to ensure it does not exceed audioDuration
    const animationPlayDuration =
      remainingDuration > animationsCycleDuration
        ? animationsCycleDuration
        : remainingDuration;

    return {
      oneCycleAnimationDuration: animationPlayDuration,
      noOfCycles: cycleRepeats,
      lastCycleDuration: remainingDuration,
    };
  };

const stopAnimation=()=>{
  const currentAction = mixer.current._actions.find((action:any)=> action.isRunning());
  if(currentAction)
    {
      currentAction.reset();
      mixer.current.stopAllAction();
    }
}
/***handle intruption in animation playing */
/*
useEffect(()=>{
if(isIntrupted){
  {
    stopAnimation();
  }
}
},[isIntrupted])
**/
/***End of handle intruption in animation playing */

  return (
    gltf?.scene && (
      <primitive
        object={gltf?.scene}
        ref={groupRef}
        position={cameraPosition}
        scale={1}
      />
    )
  );
};
export default CharacterModal;
