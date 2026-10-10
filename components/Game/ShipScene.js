import { degToRad } from "three/src/math/MathUtils";

import { ModelQuaterniusFishingShark } from "@/components/Models/Shark";
import Tree from "@/components/Models/Tree";
import ToontownTree from "@/components/Models/ToontownTree";
import GrassTerrain from "./GrassTerrain";
import { ModelKennyNLPirateShipWreck } from "@/components/Models/ship_wreck";
import Pier from "../Models/Pier";
import Crate from "../Models/Crate";
import Fence from "../Models/Fence";
import FishBucket from "../Models/FishBucket";
import { ModelKennyNLGraveyardRocksTall } from "@/components/Models/rocks-tall";
import { useStore } from "@/hooks/useStore";
import { ModelDonaldsBoat } from "../Models/DonaldsBoat";
import { ModelDonaldDuck } from "../Models/DonaldDuck";

export default function ShipScene() {
    const toontownMode = useStore((state) => state.toontownMode);
    const TreeModel = toontownMode ? ToontownTree : Tree;

    return (
        <group>
            {[-40, -20, 0, 20, 40].map((x) => (
                <TreeModel
                    key={x}
                    scale={1}
                    position={[x, 0.25, -35]}
                />
            ))}

            <ModelQuaterniusFishingShark
                position={[-5, 0.25, -10]}
                rotation={[0, degToRad(45), 0]}
            />

            <ModelQuaterniusFishingShark
                position={[5, 0.25, -10]}
                rotation={[0, degToRad(-45), 0]}
            />

            {toontownMode ? (
                <>
                    <ModelDonaldsBoat
                        position={[40, 2, 0]}
                        rotation={[0, degToRad(45), 0]}
                        scale={100}
                    />
                    <ModelDonaldDuck
                        position={[35, 5.95, -7]}
                        rotation={[0, degToRad(-45), 0]}
                        scale={400}
                    />
                </>
            ) : (
                <ModelKennyNLPirateShipWreck
                    position={[0, -5, 30]}
                    rotation={[0, degToRad(45), 0]}
                    scale={5}
                />
            )}

            <GrassTerrain position={[0, 0.9, 0]} />

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
                position={[0, 3.15, -30]}
                args={[160, 4]}
            />

            <FishBucket position={[-6, 3.2, -1]} />

            <Crate
                position={[9, 1, 10]}
                rotation={[degToRad(15), degToRad(45), 0]}
            />

            <Crate
                position={[6, 1, 18]}
                rotation={[degToRad(15), degToRad(45), 0]}
            />
        </group>
    );
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
    );
}
