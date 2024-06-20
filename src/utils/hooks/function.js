export async function preloadedImages(imageList) {
  const preloadedImages = {};
    // Function to preload a single image
  async function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img.src);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

 await Promise.all(
    imageList.map(async (item) => {
      try {
        const preloadedUrl = await preloadImage(item.src);
        preloadedImages[item.assetType] = preloadedUrl;
      } catch (error) {
        console.error(error);
      }
    })
  );

  return preloadedImages;
}


export async function preloadedGLBFiles(glbList) {
  const preloadedGLBFiles = {};

  // Function to preload a single GLB file
  async function preloadGLB(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load GLB file: ${url}`);
      }
      const buffer = await response.arrayBuffer();
      return URL.createObjectURL(new Blob([buffer]));
    } catch (error) {
      throw error;
    }
  }

  await Promise.all(
    glbList.map(async (item) => {
      try {
        const preloadedData = await preloadGLB(item.src);
        preloadedGLBFiles[item.assetType] = preloadedData;
      } catch (error) {
        console.error(error);
      }
    })
  );

  return preloadedGLBFiles;
}