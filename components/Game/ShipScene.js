import { degToRad } from "three/src/math/MathUtils";

import { ModelQuaterniusFishingShark } from "@/components/Models/Shark";
import Tree from "@/components/Models/Tree";
import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";
import { ModelKennyNLPirateShipWreck } from "@/components/Models/ship_wreck";
import Pier from "../Models/Pier";
import Crate from "../Models/Crate";
import Fence from "../Models/Fence";
import FishBucket from "../Models/FishBucket";
import { ModelKennyNLGraveyardRocksTall } from "@/components/Models/rocks-tall";
import { useStore } from "@/hooks/useStore";

export default function ShipScene() {
    return (
        <group>
            <Tree
                scale={1}
                position={[0, 0.25, -35]}
            />

            <Tree
                scale={1}
                position={[-20, 0.25, -35]}
            />

            <Tree
                scale={1}
                position={[20, 0.25, -35]}
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

            <group>
                <Pier
                    position={[-10, 2, 0]}
                    flipTexture={true}
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
                    flipTexture={true}
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

            <Fence
                position={[0, 2.25, -30]}
                args={[80, 4]}
            />

            <FishBucket
                position={[-6, 3.2, -1]}
            />

            <Crate
                position={[0, 1, 10]}
                rotation={[degToRad(15), degToRad(45), 0]}
            />

            <Crate
                position={[3, 1, 18]}
                rotation={[degToRad(15), degToRad(45), 0]}
            />
        </group>
    )
}

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