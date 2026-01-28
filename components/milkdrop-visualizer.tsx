import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import type { MilkdropSettings } from '@/lib/settings-storage';

interface MilkdropVisualizerProps {
  settings: MilkdropSettings;
  audioData?: Float32Array;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  className?: string;
}

export function MilkdropVisualizer({
  settings,
  audioData,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className,
}: MilkdropVisualizerProps) {
  const glRef = useRef<any>(null);
  const [zoom, setZoom] = useState(1.0);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    glRef.current = gl;

    // Set up WebGL context
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    // Set up geometry (fullscreen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const zoomLocation = gl.getUniformLocation(program, 'u_zoom');
    const decayLocation = gl.getUniformLocation(program, 'u_decay');
    const waveColorLocation = gl.getUniformLocation(program, 'u_waveColor');
    const audioLocation = gl.getUniformLocation(program, 'u_audio');

    gl.useProgram(program);

    // Animation loop
    const render = () => {
      timeRef.current += 0.016; // ~60fps

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update uniforms
      gl.uniform1f(timeLocation, timeRef.current);
      gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(zoomLocation, zoom * settings.zoom);
      gl.uniform1f(decayLocation, settings.fDecay);
      gl.uniform3f(waveColorLocation, settings.wave_r, settings.wave_g, settings.wave_b);
      
      // Pass audio data if available
      if (audioData && audioData.length > 0) {
        gl.uniform1f(audioLocation, audioData[0] || 0.0);
      } else {
        gl.uniform1f(audioLocation, 0.5);
      }

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.endFrameEXP();
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Gesture handlers
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onTap?.();
    });

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      if (Math.abs(velocityX) > 500) {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        if (velocityX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      setZoom(Math.max(0.5, Math.min(3.0, event.scale)));
    })
    .onEnd(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  const composed = Gesture.Race(
    tapGesture,
    Gesture.Simultaneous(panGesture, pinchGesture)
  );

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container} className={className}>
        <GLView
          style={styles.glView}
          onContextCreate={onContextCreate}
        />
      </View>
    </GestureDetector>
  );
}

// Shader sources
const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform float u_decay;
uniform vec3 u_waveColor;
uniform float u_audio;

// Simple waveform visualization with audio reactivity
void main() {
  vec2 uv = v_uv;
  uv = (uv - 0.5) * u_zoom + 0.5;
  
  // Create animated waveform
  float wave = sin(uv.x * 10.0 + u_time * 2.0) * 0.1 * u_audio;
  wave += sin(uv.x * 20.0 - u_time * 3.0) * 0.05 * u_audio;
  
  // Distance from waveform
  float dist = abs(uv.y - 0.5 - wave);
  
  // Glow effect
  float glow = 0.01 / dist;
  glow = pow(glow, 1.5) * u_decay;
  
  // Color based on position and time
  vec3 color = u_waveColor;
  color.r += sin(uv.x * 5.0 + u_time) * 0.3;
  color.g += sin(uv.x * 7.0 - u_time * 1.5) * 0.3;
  color.b += sin(uv.x * 9.0 + u_time * 2.0) * 0.3;
  
  // Add radial gradient
  float radial = length(uv - 0.5);
  color *= (1.0 - radial * 0.5);
  
  // Apply glow
  vec3 finalColor = color * glow;
  
  // Add some background color
  finalColor += vec3(0.02, 0.01, 0.03);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Helper functions
function createShader(gl: any, type: number, source: string): any {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  
  console.error('Shader compile error:', gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: any, vertexShader: any, fragmentShader: any): any {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  
  console.error('Program link error:', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
});
