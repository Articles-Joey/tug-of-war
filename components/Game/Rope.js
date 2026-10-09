import RopeMesh from "./RopeMesh";

export default function Rope({
    position,
    rotation = [0, 0, -Math.PI / 2],
    length = 20,
    radius = 0.15,
    ...props
}) {
    return (
        <group {...props} position={position} rotation={rotation}>
            <RopeMesh length={length} radius={radius} />
        </group>
    );
}
