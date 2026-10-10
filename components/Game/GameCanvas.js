import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls, Stats } from "@react-three/drei";
import { useStore } from "@/hooks/useStore";
import WaterPlane from "./WaterPlane";
import ShipScene from "./ShipScene";
import People from "./People";

function GameCanvas({ landingAnimationMode = false }) {
    const darkMode = useStore((state) => state.darkMode);
    const showStats = useStore((state) => state?.debugConfig?.showStats);

    return (
        <Canvas
            camera={{
                position: [0, 15, 30],
                fov: 50,
            }}
            onCreated={({ camera }) => camera.lookAt(0, 5, 0)}
        >
            {showStats && (
                <>
                    <Stats className="stats-overlay" />
                </>
            )}

            {!landingAnimationMode && <OrbitControls target={[0, 5, 0]} />}

            <Sky sunPosition={[0, darkMode ? -1 : 1, 0]} />

            {!darkMode ? (
                <>
                    <ambientLight intensity={2} />
                    <spotLight
                        intensity={30000}
                        position={[-50, 90, 0]}
                        angle={5}
                        penumbra={1}
                    />
                </>
            ) : (
                <>
                    <ambientLight intensity={0.25} />
                    <spotLight
                        intensity={2000}
                        position={[0, 40, -10]}
                        angle={-10}
                        penumbra={1}
                        color={"white"}
                    />
                </>
            )}

            <Suspense>
                <WaterPlane position={[0, 0, 0]} />
            </Suspense>

            <Suspense>
                <People landingAnimationMode={landingAnimationMode} />
            </Suspense>

            <Suspense>
                <ShipScene />
            </Suspense>
        </Canvas>
    );
}

export default memo(GameCanvas);
