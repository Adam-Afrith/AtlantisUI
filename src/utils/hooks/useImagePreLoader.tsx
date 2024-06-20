import  { useEffect, useState } from 'react';
import {assetImageSrc} from 'utils/hooks/imageSrc';

function preloadImage (src: string='') {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      resolve(img)
    }
    img.onerror = img.onabort = function() {
      reject(src)
    }
    img.src = src
  })
}


export default function useImagePreloader(imageList: any) {
    const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);
    const imagesPromiseList : any= {}; // Define imagesPromiseList as an object with string keys
    
    useEffect(() => {
      let isCancelled = false;
      async function preloadImages() {
        for (const image of imageList) {
          imagesPromiseList[image.assetType] = preloadImage(image.src); // Store promises in an object keyed by assetType
        }
        
        try {
          await Promise.all(Object.values(imagesPromiseList)); // Wait for all promises to resolve
          if (!isCancelled) {
            setImagesPreloaded(true);
          }
        } catch (error) {
          console.error('Failed to preload images:', error);
        }
      }

      preloadImages();
  
      return () => {
        isCancelled = true;
      };
    }, [imageList]);

    return { imagesPromiseList, imagesPreloaded };
  }