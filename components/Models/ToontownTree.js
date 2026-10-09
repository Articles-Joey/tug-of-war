import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";

export default function ToontownTree({ height = 20, ...props }) {
    const groupRef = useRef();
    const billboardRef = useRef();
    const cameraPosition = useMemo(() => new Vector3(), []);
    const texture = useTexture("/img/toontown/tree_big.png");
    const width = height * (texture.image.width / texture.image.height);

    useFrame(({ camera }) => {
        if (!groupRef.current || !billboardRef.current) return;

        camera.getWorldPosition(cameraPosition);
        groupRef.current.worldToLocal(cameraPosition);

        // Face the camera through a full circle without pitching or rolling.
        if (cameraPosition.x ** 2 + cameraPosition.z ** 2 > 0.000001) {
            billboardRef.current.rotation.y = Math.atan2(
                cameraPosition.x,
                cameraPosition.z,
            );
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <group ref={billboardRef}>
                <mesh position={[0, height / 2, 0]}>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        alphaTest={0.5}
                        side={DoubleSide}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </group>
    );
}
