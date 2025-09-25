import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const texture = new TextureLoader().load(`img/wall_fence_wood.png`)

export default function Fence({ args, position, rotation }) {

    const width = 200; // Set the width of the plane
    const height = 150; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(10, 1)

    return (

        <mesh
            castShadow
            position={position}
            rotation={rotation}
        >
            <planeGeometry
                args={args}
            />
            <meshStandardMaterial
                // color="saddlebrown" 
                map={texture}
            />
        </mesh>
    )

}