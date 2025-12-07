import { Billboard, Image } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";

function FishBucket({ position }) {
    return (
        <group position={position}>
            <Billboard 
            // lockX={true} 
            // lockY={false} 
            // lockZ={true}
            follow={true}
            >
                <Image
                    url="/img/fish-bucket.png"
                    scale={2}
                    transparent={true}
                    doubleSided={true}
                    rotation={[degToRad(0), 0, 0]}
                />
                {/* <Image
                    url="/img/fish-bucket.png"
                    scale={2}
                    transparent={true}
                    doubleSided={true}
                    rotation={[degToRad(180), 0, degToRad(180)]}
                /> */}
            </Billboard>
        </group>
    )
}

export default FishBucket;