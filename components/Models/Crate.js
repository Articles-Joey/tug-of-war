import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, useGLTF } from "@react-three/drei";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three"
// import { useGameStore } from "@/hooks/useGameStore";

const texture = new TextureLoader().load(`img/box.png`)
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.repeat.set(1, 1);
texture.magFilter = NearestFilter;

export default function Crate(props) {

    // const toontownMode = useStore(state => state.toontownMode)
    
    // bobbing parameters
    const amplitude = props.bobAmplitude ?? 0.25 // vertical range in world units
    const speed = props.bobSpeed ?? 1.2 // cycles per second

    // local ref to the mesh so we can animate position
    const meshRef = useRef()

    // per-instance phase offset so multiple crates don't bob exactly in sync
    const phase = useMemo(() => Math.random() * Math.PI * 2, [])

    // useFrame updates every animation frame; animate Y position with a sine wave
    useFrame((state, delta) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()
        meshRef.current.position.y = (props.position?.[1] ?? 0) + Math.sin((t * speed + phase)) * amplitude
    })

    return (
        <mesh ref={meshRef} {...props} castShadow receiveShadow  >
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial
                color="white"
                map={texture}
            />
        </mesh>
    );
}

useGLTF.preload(`img/box.png`);