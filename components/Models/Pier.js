import { useGameStore } from "@/hooks/useGameStore"
import { NearestFilter, RepeatWrapping, TextureLoader } from "three"

const texture = new TextureLoader().load(`img/boardwalk_floor.png`)

texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.repeat.set(2, 1);
texture.magFilter = NearestFilter;

const textureFlipped = new TextureLoader().load(`img/boardwalk_floor.png`)

textureFlipped.wrapS = RepeatWrapping;
textureFlipped.wrapT = RepeatWrapping;
textureFlipped.repeat.set(2, 1);
textureFlipped.magFilter = NearestFilter;

function Pier({ position, rotation, flipTexture }) {

    const toontownMode = useGameStore(state => state.toontownMode)

    if (!flipTexture) {

    }

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
                <meshStandardMaterial
                    // color="saddlebrown" 
                    map={flipTexture ? textureFlipped : texture}
                />
            </mesh>

            <mesh
                castShadow
                position={[5, -2, 2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5, 6]}
                />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

            <mesh
                castShadow
                position={[5, -2, -2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5, 6]}
                />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

            <mesh
                castShadow
                position={[-5, -2, 2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5, 6]}
                />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

            <mesh
                castShadow
                position={[-5, -2, -2.5]}
            >
                <cylinderGeometry
                    args={[0.25, 0.25, 5, 6]}
                />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>

        </group>
    )

}

export default Pier