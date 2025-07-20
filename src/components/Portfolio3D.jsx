import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Stars, Trail } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function Planet({ position, size, color, name, value, amount }) {
  const meshRef = useRef();
  const textRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.01;
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={position}>
      <Trail
        width={5}
        length={10}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.8}
            />
          </Sphere>
        </mesh>
      </Trail>
      
      <Text
        ref={textRef}
        position={[0, size + 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        ₹{value.toLocaleString()}
      </Text>
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.2}
        color="#8b5cf6"
        anchorX="center"
        anchorY="middle"
      >
        {amount} units
      </Text>
    </group>
  );
}

const Portfolio3D = ({ portfolio, credits }) => {
  const positions = useMemo(() => {
    const count = portfolio.length;
    const positions = [];
    const radius = 5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, [portfolio.length]);

  const totalValue = portfolio.reduce((sum, holding) => 
    sum + (holding.price * holding.amount), 0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Your Galaxy Portfolio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Total Value</p>
            <p className="text-3xl font-bold text-purple-400">
              ₹{totalValue.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Available Credits</p>
            <p className="text-3xl font-bold text-green-400">
              ₹{credits.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Total Assets</p>
            <p className="text-3xl font-bold text-blue-400">
                            {portfolio.length}
            </p>
          </div>
        </div>

        <div className="h-96 bg-black/50 rounded-2xl overflow-hidden">
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            
            {portfolio.map((holding, index) => (
              <Planet
                key={holding.id}
                position={positions[index] || [0, 0, 0]}
                size={Math.min(1 + (holding.amount * holding.price) / 10000, 2)}
                color={holding.color ? holding.color.split(' ')[1] : '#8b5cf6'}
                name={holding.symbol}
                value={holding.price * holding.amount}
                amount={holding.amount}
              />
            ))}
            
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              maxDistance={20}
              minDistance={5}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Asset Distribution</h3>
          <div className="space-y-3">
            {portfolio.map((holding) => {
              const percentage = (holding.price * holding.amount) / totalValue * 100;
              return (
                <div key={holding.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{holding.name}</span>
                    <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${holding.color || 'from-purple-500 to-pink-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio3D;