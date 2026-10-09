import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import GrassTerrainMaterial from "./GrassTerrainMaterial";
import {
    BufferAttribute,
    NearestFilter,
    PlaneGeometry,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";

const GRASS_TEXTURE = `${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`;

export default function GrassTerrain({
    width = 200,
    depth = 350,
    widthSegments = 100,
    depthSegments = 350,
    groundHeight = 0.25,
    sandBlendWidth = 2,
    riverHalfWidth = 25,
    bankWidth = 12,
    riverDepth = 3,
    shorelineVariation = 2.5,
    bankBumpHeight = 0.35,
    ...props
}) {
    const source = useTexture(GRASS_TEXTURE);
    const texture = useMemo(() => {
        const map = source.clone();
        map.magFilter = NearestFilter;
        map.wrapS = map.wrapT = RepeatWrapping;
        map.colorSpace = SRGBColorSpace;
        // Match the old planes' 40-by-30-unit grass tiles across one surface.
        map.repeat.set(width / 40, depth / 30);
        map.needsUpdate = true;
        return map;
    }, [source, width, depth]);

    const geometry = useMemo(() => {
        const terrain = new PlaneGeometry(
            width,
            depth,
            widthSegments,
            depthSegments,
        );
        terrain.rotateX(-Math.PI / 2);
        const vertices = terrain.attributes.position;
        const riverbedHalfWidth = Math.max(0, riverHalfWidth - bankWidth);
        const slopeWidth = Math.max(0.001, riverHalfWidth - riverbedHalfWidth);
        const bankDistances = new Float32Array(vertices.count);
        const variation = Math.min(
            Math.max(0, shorelineVariation),
            riverbedHalfWidth * 0.5,
        );

        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getZ(i);
            const side = z < 0 ? -1 : 1;
            // Layer different wavelengths, with independent shapes on each bank.
            const shorelineOffset = variation * (
                0.6 * Math.sin(x * 0.11 + side * 1.7) +
                0.28 * Math.sin(x * 0.29 - side * 2.3) +
                0.12 * Math.sin(x * 0.67 + side * 0.8)
            );
            const distance = Math.abs(z) - shorelineOffset;
            bankDistances[i] = distance;
            const t = Math.min(
                1,
                Math.max(0, (distance - riverbedHalfWidth) / slopeWidth),
            );
            const bankHeight = t * t * (3 - 2 * t);
            // Fade bumps out at the flat ground and riverbed boundaries.
            const bankInfluence = 4 * t * (1 - t);
            const bumps = bankBumpHeight * bankInfluence * (
                0.6 * Math.sin(x * 0.43 + z * 0.37) +
                0.4 * Math.sin(x * 0.71 - z * 0.61)
            );
            vertices.setY(
                i,
                -riverDepth + (groundHeight + riverDepth) * bankHeight + bumps,
            );
        }

        // Share the shoreline shape with the sand shader so both stay aligned.
        terrain.setAttribute("riverBankDistance", new BufferAttribute(bankDistances, 1));
        vertices.needsUpdate = true;
        terrain.computeVertexNormals();
        terrain.computeBoundingBox();
        terrain.computeBoundingSphere();
        return terrain;
    }, [
        width,
        depth,
        widthSegments,
        depthSegments,
        groundHeight,
        riverHalfWidth,
        bankWidth,
        riverDepth,
        shorelineVariation,
        bankBumpHeight,
    ]);

    useEffect(() => () => geometry.dispose(), [geometry]);
    useEffect(() => () => texture.dispose(), [texture]);

    return (
        <mesh {...props} geometry={geometry} receiveShadow>
            <GrassTerrainMaterial
                map={texture}
                riverHalfWidth={riverHalfWidth}
                groundHeight={groundHeight}
                sandBlendWidth={sandBlendWidth}
            />
        </mesh>
    );
}
