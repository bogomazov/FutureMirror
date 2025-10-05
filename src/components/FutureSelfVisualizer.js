import React, { useState, useRef, useCallback, useEffect } from 'react';

const FutureSelfVisualizer = ({ simulationResult, inputs, onImageGenerated }) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Visual mapping logic based on simulation outcomes
  const getSceneConfig = useCallback(() => {
    if (!simulationResult) return null;

    const { avgStress, avgHealth, finalWealth, sleeplessYears } = simulationResult;
    const yearsToEnd = inputs.ageEnd - inputs.ageStart;
    const wealthTarget = inputs.goalAmount;

    // Determine scene type based on outcomes
    let sceneType, mood, lighting, setting, expression, tagline;

    if (avgStress >= 70 || sleeplessYears >= yearsToEnd * 0.3) {
      // Degen Mode - High stress, poor health
      sceneType = 'degen';
      mood = 'burned_out';
      lighting = 'dark_computer_glow';
      setting = 'cluttered_trading_desk';
      expression = 'tired_eyes_stress_lines';
      tagline = 'Always online. Always chasing.';
    } else if (finalWealth >= wealthTarget && avgHealth >= 80 && avgStress <= 40) {
      // Peace Mode - Achieved goals with great health
      sceneType = 'peace';
      mood = 'calm_confidence';
      lighting = 'natural_sunlight';
      setting = 'luxury_villa_no_screens';
      expression = 'relaxed_smile_bright_eyes';
      tagline = 'You don\'t chase signals anymore. You are the signal.';
    } else if (finalWealth >= wealthTarget * 0.7 && avgHealth >= 60) {
      // Balanced Mode - Good wealth with decent health
      sceneType = 'balanced';
      mood = 'controlled_success';
      lighting = 'soft_window_light';
      setting = 'modern_office_organized';
      expression = 'confident_calm_posture';
      tagline = 'Discipline is the final luxury.';
    } else {
      // Struggling Mode - Low wealth or health issues
      sceneType = 'struggling';
      mood = 'anxious_uncertain';
      lighting = 'harsh_fluorescent';
      setting = 'cramped_apartment';
      expression = 'worried_frown_tension';
      tagline = 'Real alpha sleeps eight hours.';
    }

    return {
      sceneType,
      mood,
      lighting,
      setting,
      expression,
      tagline,
      prompt: generatePrompt(sceneType, mood, lighting, setting, expression),
      visualCues: getVisualCues(avgStress, avgHealth, finalWealth, wealthTarget)
    };
  }, [simulationResult, inputs]);

  const generatePrompt = (sceneType, mood, lighting, setting, expression) => {
    const basePrompts = {
      degen: "Transform background into cluttered trading setup with multiple glowing monitors showing crypto charts, empty energy drink cans scattered around, harsh blue computer screen lighting, dim room atmosphere. Add subtle stress lines around eyes, slightly tired expression, disheveled appearance",
      peace: "Transform background into minimalist luxury villa with floor-to-ceiling windows, warm golden hour sunlight, plants and leather books visible, meditation area. Add healthy glow to skin, bright alert eyes, relaxed smile, perfect posture",
      balanced: "Transform background into modern organized home office with soft natural lighting, clean desk with closed laptop, family photo, ergonomic chair, subtle luxury touches. Add confident calm expression, good posture, slight signs of focused work",
      struggling: "Transform background into cramped apartment with harsh fluorescent lighting, cluttered desk with bills scattered around, old cracked laptop, instant ramen containers. Add worried expression, tense posture, tired eyes with slight dark circles"
    };

    return basePrompts[sceneType];
  };

  const getVisualCues = (stress, health, wealth, target) => {
    return {
      stressLevel: stress,
      healthLevel: health,
      wealthRatio: wealth / target,
      eyeBrightness: Math.max(20, 100 - stress),
      skinGlow: health,
      posture: stress < 50 ? 'upright_confident' : 'slouched_tired',
      environment: wealth >= target ? 'luxurious_organized' : 'modest_cluttered'
    };
  };

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 512 },
          height: { ideal: 512 },
          facingMode: 'user'
        }
      });
      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert(`Camera access failed: ${error.message}. Please allow camera access and try again.`);
    }
  };

  // Effect to connect stream to video element
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      console.log('Setting video source:', cameraStream);
      videoRef.current.srcObject = cameraStream;

      // Ensure video plays
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 512;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, 512, 512);

    // Convert to blob and store both blob and URL
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage({ blob, url: imageUrl });
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const generateFutureScene = async () => {
    if (!capturedImage) return;

    setIsGenerating(true);
    const sceneConfig = getSceneConfig();

    try {
      let generatedImageUrl = capturedImage.url; // Fallback to original

      // Try OpenAI DALL-E API first
      try {
        const response = await generateWithOpenAI(capturedImage.blob, sceneConfig.prompt);
        if (response?.data?.[0]?.url) {
          generatedImageUrl = response.data[0].url;
        }
      } catch (openaiError) {
        console.log('OpenAI failed, trying Replicate...', openaiError);

        // Fallback to Replicate API
        try {
          const replicateResponse = await generateWithReplicate(capturedImage.blob, sceneConfig.prompt);
          if (replicateResponse?.output?.[0]) {
            generatedImageUrl = replicateResponse.output[0];
          }
        } catch (replicateError) {
          console.log('Replicate failed, using original image', replicateError);
        }
      }

      const generatedScene = {
        imageUrl: generatedImageUrl,
        sceneType: sceneConfig.sceneType,
        description: sceneConfig.prompt,
        tagline: sceneConfig.tagline,
        visualCues: sceneConfig.visualCues,
        isGenerated: generatedImageUrl !== capturedImage.url
      };

      setGeneratedScenes(prev => ({
        ...prev,
        [sceneConfig.sceneType]: generatedScene
      }));

      if (onImageGenerated) {
        onImageGenerated(generatedScene);
      }

    } catch (error) {
      console.error('Image generation failed:', error);
      // Fallback to showing original image with description
      const fallbackScene = {
        imageUrl: capturedImage.url,
        sceneType: sceneConfig.sceneType,
        description: sceneConfig.prompt,
        tagline: sceneConfig.tagline,
        visualCues: sceneConfig.visualCues,
        isGenerated: false
      };

      setGeneratedScenes(prev => ({
        ...prev,
        [sceneConfig.sceneType]: fallbackScene
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // OpenAI DALL-E API integration for image editing
  const generateWithOpenAI = async (imageBlob, prompt) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    // Create a transparent mask for editing (edit background/environment while preserving face)
    const maskBlob = await createEditingMask(imageBlob);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', imageBlob, 'image.png');
    formData.append('mask', maskBlob, 'mask.png');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '512x512');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error details:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  };

  // Create a mask for editing - transparent areas will be edited, opaque areas preserved
  const createEditingMask = async (imageBlob) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 512;

      // Create a simple mask that preserves the center (face area) and allows editing of edges/background
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Opaque black = preserve
      ctx.fillRect(0, 0, 512, 512);

      // Create transparent areas around edges for environment editing
      ctx.globalCompositeOperation = 'destination-out';

      // Top and bottom edges for environment
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, 512, 120); // Top area
      ctx.fillRect(0, 392, 512, 120); // Bottom area

      // Side edges for environment
      ctx.fillRect(0, 120, 80, 272); // Left edge
      ctx.fillRect(432, 120, 80, 272); // Right edge

      // Allow subtle facial expression editing in outer face area
      const centerX = 256;
      const centerY = 200;
      const outerRadius = 140;
      const innerRadius = 100;

      // Create ring around face for expression editing
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
      ctx.fill();

      canvas.toBlob(resolve, 'image/png');
    });
  };

  // Replicate API integration with face-preserving model
  const generateWithReplicate = async (imageBlob, prompt) => {
    const apiToken = process.env.REACT_APP_REPLICATE_API_TOKEN;
    if (!apiToken) throw new Error('Replicate API token not configured');

    // Convert image to base64
    const base64Image = await imageBlob.arrayBuffer().then(buffer => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      bytes.forEach(byte => binary += String.fromCharCode(byte));
      return btoa(binary);
    });

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68a3",
        input: {
          image: `data:image/jpeg;base64,${base64Image}`,
          prompt: `${prompt}, preserve original person's face and identity, photorealistic`,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 25
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Replicate API error details:', errorData);
      throw new Error(`Replicate API error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
    }

    const prediction = await response.json();

    // Poll for completion
    return await pollReplicateResult(prediction.id, apiToken);
  };

  // Helper function to poll Replicate results
  const pollReplicateResult = async (predictionId, apiToken) => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${apiToken}`,
        },
      });

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction;
      } else if (prediction.status === 'failed') {
        throw new Error('Replicate generation failed');
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Replicate generation timeout');
  };


  const sceneConfig = getSceneConfig();

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        📸 Future Self Mirror
      </h3>

      <div className="text-center mb-4">
        <p className="text-slate-300 text-sm mb-2">
          Capture yourself now to see your future based on your choices
        </p>
        <p className="text-xs text-slate-400">
          Generate your Future Self visualization instantly
        </p>
      </div>

      {!cameraStream && !capturedImage && (
        <div className="text-center">
          <button
            onClick={startCamera}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            📷 Start Camera
          </button>
        </div>
      )}

      {cameraStream && (
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width="256"
              height="256"
              className="w-64 h-64 object-cover rounded-lg border-2 border-slate-600 bg-slate-700"
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onError={(e) => console.error('Video error:', e)}
              onCanPlay={() => console.log('Video can play')}
            />
            <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-lg pointer-events-none"></div>
          </div>
          <div className="space-x-3">
            <button
              onClick={capturePhoto}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              📸 Capture
            </button>
            <button
              onClick={stopCamera}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="text-center">
          <div className="mb-4">
            <img
              src={capturedImage.url}
              alt="Captured selfie"
              className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600 mx-auto"
            />
          </div>

          {sceneConfig && (
            <div className="bg-slate-700/50 p-4 rounded-lg mb-4">
              <h4 className="text-white font-semibold mb-2">Your Future Scene Preview:</h4>
              <p className="text-slate-300 text-sm mb-2">{sceneConfig.tagline}</p>
              <div className="text-xs text-slate-400">
                <div>Stress Level: {sceneConfig.visualCues.stressLevel}/100</div>
                <div>Health Level: {sceneConfig.visualCues.healthLevel}/100</div>
                <div>Scene Type: {sceneConfig.sceneType}</div>
              </div>
            </div>
          )}

          <div className="space-x-3">
            <button
              onClick={generateFutureScene}
              disabled={isGenerating}
              className={`${
                isGenerating
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } text-white font-bold py-2 px-4 rounded-lg transition-all duration-200`}
            >
              {isGenerating ? '🔄 Generating...' : '🔮 Generate Future Self'}
            </button>
            <button
              onClick={() => {
                setCapturedImage(null);
                setGeneratedScenes({});
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {Object.keys(generatedScenes).length > 0 && (
        <div className="mt-6">
          <h4 className="text-white font-semibold mb-4 text-center">Your Future Mirrors:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(generatedScenes).map(([sceneType, scene]) => (
              <div key={sceneType} className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-center mb-2">
                  {scene.imageUrl ? (
                    <div className="relative">
                      <img
                        src={scene.imageUrl}
                        alt={`${sceneType} future self`}
                        className="w-32 h-32 mx-auto mb-2 object-cover rounded-lg border-2 border-slate-600"
                      />
                      {scene.isGenerated && (
                        <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          AI Generated
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-2 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">
                        {sceneType === 'degen' ? '😵' :
                         sceneType === 'peace' ? '😌' :
                         sceneType === 'balanced' ? '😊' : '😰'}
                      </span>
                    </div>
                  )}
                  <h5 className="text-white font-medium capitalize">{sceneType} Path</h5>
                </div>
                <p className="text-xs text-slate-300 text-center italic mb-2">
                  "{scene.tagline}"
                </p>
                {scene.visualCues && (
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Stress: {scene.visualCues.stressLevel}/100</div>
                    <div>Health: {scene.visualCues.healthLevel}/100</div>
                    <div>Wealth: {(scene.visualCues.wealthRatio * 100).toFixed(0)}% of goal</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default FutureSelfVisualizer;