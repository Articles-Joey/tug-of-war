import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Physics, useBox, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

import { ModelKennyNLGraveyardRocksTall } from "@/components/Models/rocks-tall";
import WaterPlane from "./WaterPlane";

import { Model as ModelSoldierWoman } from "@/components/Models/Soldier";
import { Model as ModelKingMen } from "@/components/Models/King";
import { ModelQuaterniusFishingShark } from "@/components/Models/Shark";
import Tree from "@/components/Models/Tree";

import { ModelKennyNLPirateShipWreck } from "@/components/Models/ship_wreck";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = ({ position }) => {

    const width = 200; // Set the width of the plane
    const height = 150; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    // const {
    //     playerRotation,
    //     setPlayerRotation
    // } = useCannonStore(state => ({
    //     playerRotation: state.playerRotation,
    //     setPlayerRotation: state.setPlayerRotation
    // }));

    const {
        handleCameraChange,
        gameState,
        players,
        move,
        cameraInfo,
        server
    } = props;

    const [[a, b, c, d, e]] = useState(() => [...Array(5)].map(createRef))

    return (
        <Canvas
            camera={{
                position: [0, 20, 50],
                fov: 50,
            }}
        >

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <Sky
                // distance={450000}
                sunPosition={[0, 10, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            />

            <ambientLight intensity={2} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            {/* <pointLight position={[-10, -10, -10]} /> */}

            {/* <FlatRing
                args={[3, 5, 32]}
                color={"gold"}
            />

            <FlatRing
                args={[6, 8, 32]}
                color={"white"}
            /> */}

            <Tree
                scale={1}
                position={[0, 0.25, -30]}
            />

            <Tree
                scale={1}
                position={[-20, 0.25, -30]}
            />

            <Tree
                scale={1}
                position={[20, 0.25, -30]}
            />

            <ModelQuaterniusFishingShark
                position={[-5, 0.25, -10]}
                rotation={[0, degToRad(45), 0]}
            />

            <ModelQuaterniusFishingShark
                position={[5, 0.25, -10]}
                rotation={[0, degToRad(-45), 0]}
            />

            <ModelKennyNLPirateShipWreck
                position={[0, -5, 30]}
                rotation={[0, degToRad(45), 0]}
                scale={5}
            />

            <GrassPlane
                position={[0, 0.25, 100]}
            />

            <GrassPlane
                position={[0, 0.25, -100]}
            />

            <Rocks />

            <WaterPlane
                position={[0, 0, 0]}
            />

            <People />

            {/* <group ref={peopleRef}>
                <ModelSoldierWoman
                    scale={3}
                    rotation={[0, degToRad(90), 0]}
                    position={[-10, 2.25, 0]}
                />

                <ModelKingMen
                    scale={3}
                    rotation={[0, degToRad(-90), 0]}
                    position={[10, 2.25, 0]}
                />

                <Rope
                    position={[0, 5, -0.6]}
                />
            </group> */}

            <group>
                <Pier
                    position={[-10, 2, 0]}
                />

                <Pier
                    position={[-17.5, 2, 2.5]}
                    rotation={[0, degToRad(-90), 0]}
                />

                <Pier
                    position={[-17.5, 2, 12.5]}
                    rotation={[0, degToRad(-90), 0]}
                />

                <Pier
                    position={[-17.5, 2, 22.5]}
                    rotation={[0, degToRad(-90), 0]}
                />
            </group>

            <group>
                <Pier
                    position={[10, 2, 0]}
                />

                <Pier
                    position={[17.5, 2, 2.5]}
                    rotation={[0, degToRad(-90), 0]}
                />

                <Pier
                    position={[17.5, 2, 12.5]}
                    rotation={[0, degToRad(-90), 0]}
                />

                <Pier
                    position={[17.5, 2, 22.5]}
                    rotation={[0, degToRad(-90), 0]}
                />
            </group>

            {/* <Walls /> */}

        </Canvas>
    )
}

export default memo(GameCanvas)

function People({ position, rotation }) {

    const peopleRef = useRef();
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const speed = 0.05; // Adjust speed as needed
    const bounds = 5;

    useFrame(() => {
        if (peopleRef.current) {
            // Get the current position of the group
            const currentX = peopleRef.current.position.x;

            // Check if it needs to change direction
            if (currentX >= bounds) setDirection(-1);
            else if (currentX <= -bounds) setDirection(1);

            // Update position
            peopleRef.current.position.x += speed * direction;
        }
    });

    return (
        <group ref={peopleRef}>
            <ModelSoldierWoman
                scale={3}
                rotation={[0, degToRad(90), 0]}
                position={[-10, 2.25, 0]}
            />

            <ModelKingMen
                scale={3}
                rotation={[0, degToRad(-90), 0]}
                position={[10, 2.25, 0]}
            />

            <Rope
                position={[0, 5, -0.6]}
            />
        </group>
    )
}

const FlatRing = ({ args, color }) => {
    return (
        <mesh
            rotation={[degToRad(-90), 0, 0]}
            position={[0, 0.28, 0]}
        >
            <ringGeometry args={args} /> {/* Inner radius, outer radius, segments */}
            <meshStandardMaterial color={color} /> {/* side={2} makes it visible on both sides */}
        </mesh>
    );
};

function Pier({ position, rotation }) {

    // const [ref, api] = useBox(() => ({
    //     mass: 0,
    //     type: 'Static',
    //     args: [100, 0.5, 100],
    //     position: [0, 0, 0],
    // }))

    return (
        <group
            position={position}
            rotation={rotation}
        >

            <mesh castShadow>
                <boxGeometry args={[10, 0.5, 5]} />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

            <mesh
                castShadow
                position={[5, -2, 2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5]}
                />
                <meshStandardMaterial color="black" />
            </mesh>

            <mesh
                castShadow
                position={[5, -2, -2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5]}
                />
                <meshStandardMaterial color="black" />
            </mesh>

            <mesh
                castShadow
                position={[-5, -2, 2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5]}
                />
                <meshStandardMaterial color="black" />
            </mesh>

            <mesh
                castShadow
                position={[-5, -2, -2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5]}
                />
                <meshStandardMaterial color="black" />
            </mesh>

        </group>
    )

}

function Rope({ position }) {

    // const [ref, api] = useBox(() => ({
    //     mass: 0,
    //     type: 'Static',
    //     args: [100, 0.5, 100],
    //     position: [0, 0, 0],
    // }))

    return (
        <group
            position={position}
            rotation={[0, 0, degToRad(-90)]}
        >

            <mesh
                castShadow
            >
                <cylinderGeometry
                    args={[0.05, 0.05, 20]}
                />
                <meshStandardMaterial color="yellow" />
            </mesh>

        </group>
    )

}

function Rocks() {

    return (
        <group>
            <ModelKennyNLGraveyardRocksTall
                scale={30}
                position={[-100, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[-50, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={100}
                position={[0, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[50, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={30}
                position={[100, 0, -100]}
            />
        </group>
    )

}

function Walls() {

    return (
        <group>

            {/* Top */}
            <Wall
                args={[20, 2, 1]}
                position={[-40, 1, -50]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[40, 1, -50]}
            />

            {/* Bottom */}
            <Wall
                args={[20, 2, 1]}
                position={[-40, 1, 50]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[40, 1, 50]}
            />

            {/* Left */}
            <Wall
                args={[20, 2, 1]}
                position={[-50, 1, 40]}
                rotation={[0, degToRad(90), 0]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[-50, 1, -40]}
                rotation={[0, degToRad(90), 0]}
            />

            {/* Right */}
            <Wall
                args={[20, 2, 1]}
                position={[50, 1, 40]}
                rotation={[0, degToRad(90), 0]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[50, 1, -40]}
                rotation={[0, degToRad(90), 0]}
            />

        </group>
    )

}

function Wall({ args, position, rotation }) {

    // const [ref, api] = useBox(() => ({
    //     mass: 0,
    //     type: 'Static',
    //     args: args,
    //     position: position,
    //     rotation: rotation
    // }))

    return (
        <mesh castShadow>
            <boxGeometry args={args} />
            {/* <BeachBall /> */}
            <meshStandardMaterial color="gray" />
        </mesh>
    )

}