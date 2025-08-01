import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const faceToLocalNormal = {
  1: new THREE.Vector3(0, 1, 0),
  2: new THREE.Vector3(0, -1, 0),
  3: new THREE.Vector3(-1, 0, 0),
  4: new THREE.Vector3(1, 0, 0),
  5: new THREE.Vector3(0, 0, 1),
  6: new THREE.Vector3(0, 0, -1),
};

function Cube({ face = 1, isRolling }) {
  const meshRef = useRef();

  const textures = useLoader(THREE.TextureLoader, [
    '/textures/dice4.png',
    '/textures/dice3.png',
    '/textures/dice1.png',
    '/textures/dice2.png',
    '/textures/dice5.png',
    '/textures/dice6.png',
  ]);

  const materials = useMemo(
    () =>
      textures.map(
        tex => new THREE.MeshStandardMaterial({ map: tex, side: THREE.FrontSide })
      ),
    [textures]
  );

  const rollDuration = 1;
  const elapsedRef = useRef(0);
  const startQuat = useRef(new THREE.Quaternion());
  const endQuat = useRef(new THREE.Quaternion());
  const tmpQuat = useRef(new THREE.Quaternion());
  const rolling = useRef(false);

  // Orientation initiale
  useEffect(() => {
    if (!meshRef.current) return;
    const targetNormal = (faceToLocalNormal[face] || faceToLocalNormal[1])
      .clone()
      .normalize();
    const forward = new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion().setFromUnitVectors(targetNormal, forward);
    meshRef.current.quaternion.copy(q);
    endQuat.current.copy(q);
  }, [face]);

  // Changement de face / démarrage du roll
  useEffect(() => {
    if (!meshRef.current) return;
    const targetNormal = (faceToLocalNormal[face] || faceToLocalNormal[1])
      .clone()
      .normalize();
    const forward = new THREE.Vector3(0, 0, 1);
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(targetNormal, forward);

    if (isRolling) {
      rolling.current = true;
      elapsedRef.current = 0;
      startQuat.current.copy(meshRef.current.quaternion);
      endQuat.current.copy(targetQuat);
    } else {
      endQuat.current.copy(targetQuat);
    }
  }, [face, isRolling]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (rolling.current) {
      elapsedRef.current += delta;
      const t = Math.min(elapsedRef.current / rollDuration, 1);

      if (t < 0.7) {
        meshRef.current.rotation.x += delta * 10;
        meshRef.current.rotation.y += delta * 10;
        meshRef.current.rotation.z += delta * 10;
      } else {
        const localT = (t - 0.7) / 0.3;
        const eased = easeOutCubic(localT);
        tmpQuat.current.copy(startQuat.current);
        tmpQuat.current.slerp(endQuat.current, eased);
        meshRef.current.quaternion.copy(tmpQuat.current);
      }

      if (t >= 1) {
        meshRef.current.quaternion.copy(endQuat.current);
        rolling.current = false;
      }
    } else {
      meshRef.current.quaternion.copy(endQuat.current);
    }
  });

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

export default Cube;
