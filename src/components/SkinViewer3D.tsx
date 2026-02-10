import { useEffect, useRef } from 'react';
import { SkinViewer, WalkingAnimation } from 'skinview3d';

interface SkinViewer3DProps {
  username: string;
  width?: number;
  height?: number;
  animation?: 'idle' | 'walk' | 'run';
  rotateSpeed?: number;
}

export default function SkinViewer3D({ 
  username, 
  width = 300, 
  height = 400,
  animation = 'walk',
  rotateSpeed = 0.5
}: SkinViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create skin viewer
    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width,
      height,
      skin: `https://mc-heads.net/skin/${username}`,
    });

    viewerRef.current = viewer;

    // Enable controls
    viewer.controls.enableZoom = false;
    viewer.controls.enablePan = false;

    // Set initial rotation
    viewer.playerObject.rotation.y = 0.5;

    // Add walking animation
    if (animation === 'walk') {
      viewer.animation = new WalkingAnimation();
      viewer.animation.speed = rotateSpeed;
    }

    // Add auto-rotation animation
    let animationId: number;
    const animate = () => {
      viewer.playerObject.rotation.y += 0.005 * rotateSpeed;
      viewer.render();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      viewer.dispose();
    };
  }, [username, width, height, animation, rotateSpeed]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className="rounded-lg"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))',
        }}
      />
    </div>
  );
}
