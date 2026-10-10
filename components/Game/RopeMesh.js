import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CylinderGeometry, Vector3 } from "three";
import RopeMaterial from "./RopeMaterial";

const STRAND_COUNT = 3;
const STRAND_GROOVE_DEPTH = 0.14;
const TWIST_PITCH_IN_RADII = 6;
const RADIAL_SEGMENTS = 48;
const SEGMENTS_PER_TURN = 24;

export default function RopeMesh({ length, radius, position, curve = null }) {
    const geometry = useMemo(() => {
        const pitch = radius * TWIST_PITCH_IN_RADII;
        const heightSegments = Math.max(
            1,
            Math.min(512, Math.ceil((length / pitch) * SEGMENTS_PER_TURN)),
        );
        const meshGeometry = new CylinderGeometry(
            radius,
            radius,
            length,
            RADIAL_SEGMENTS,
            heightSegments,
            false,
        );
        const vertices = meshGeometry.attributes.position;
        const uv = meshGeometry.attributes.uv;
        const sideVertexCount = (heightSegments + 1) * (RADIAL_SEGMENTS + 1);

        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const y = vertices.getY(i);
            const z = vertices.getZ(i);
            const twist = (y / pitch) * Math.PI * 2;
            const angle = Math.atan2(x, z);
            // Three rounded strands wind around a solid core. The outer radius
            // stays within the existing cylinder collider, including the end caps.
            const profile =
                1 -
                STRAND_GROOVE_DEPTH +
                STRAND_GROOVE_DEPTH * Math.cos(STRAND_COUNT * (angle - twist));
            vertices.setXYZ(i, x * profile, y, z * profile);

            if (i < sideVertexCount) {
                // Keep fibers aligned with the spiral instead of stretching a
                // diagonal stripe around an otherwise straight cylinder.
                uv.setX(i, STRAND_COUNT * (uv.getX(i) - y / pitch));
            }
        }

        meshGeometry.computeVertexNormals();
        return meshGeometry;
    }, [length, radius]);

    // Keep the original twisted surface and UVs while bending its centerline.
    const restPositions = useMemo(
        () => geometry.attributes.position.array.slice(),
        [geometry],
    );
    const heightSegments = geometry.parameters.heightSegments;
    const centers = useMemo(
        () => Array.from({ length: heightSegments + 1 }, () => new Vector3()),
        [heightSegments],
    );
    const lastCurveVersion = useRef(-1);

    useLayoutEffect(() => {
        lastCurveVersion.current = -1;
        // Removing a curve restores the original straight rope.
        if (!curve) {
            geometry.attributes.position.array.set(restPositions);
            geometry.attributes.position.needsUpdate = true;
            geometry.computeVertexNormals();
            geometry.computeBoundingSphere();
        }
    }, [curve, geometry, restPositions]);

    useFrame(() => {
        if (!curve || lastCurveVersion.current === curve.version) return;
        const frames = curve.computeFrenetFrames(heightSegments, false);
        for (let ring = 0; ring <= heightSegments; ring++) {
            curve.getPoint(ring / heightSegments, centers[ring]);
        }

        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const offset = i * 3;
            const x = restPositions[offset];
            const y = restPositions[offset + 1];
            const z = restPositions[offset + 2];
            const ring = Math.max(
                0,
                Math.min(
                    heightSegments,
                    Math.round((y / length + 0.5) * heightSegments),
                ),
            );
            const center = centers[ring];
            const normal = frames.normals[ring];
            const binormal = frames.binormals[ring];
            vertices.setXYZ(
                i,
                center.x + normal.x * x + binormal.x * z,
                center.y + normal.y * x + binormal.y * z,
                center.z + normal.z * x + binormal.z * z,
            );
        }
        vertices.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
        lastCurveVersion.current = curve.version;
    });

    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <mesh
            position={position}
            geometry={geometry}
            castShadow
            receiveShadow
        >
            <RopeMaterial
                length={length}
                radius={radius}
            />
        </mesh>
    );
}
