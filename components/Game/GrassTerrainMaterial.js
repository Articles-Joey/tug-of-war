import { useEffect, useMemo } from "react";
import { Color, MeshStandardMaterial } from "three";

const SAND_SHADER = /* glsl */ `
    varying vec3 vTerrainPosition;
    varying float vRiverBankDistance;
    uniform float uRiverHalfWidth;
    uniform float uSandBlendWidth;
    uniform float uGroundHeight;
    uniform vec3 uDrySandColor;
    uniform vec3 uWetSandColor;

    float sandHash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float sandNoise(vec2 p) {
        vec2 cell = floor(p);
        vec2 local = fract(p);
        vec2 blend = local * local * (3.0 - 2.0 * local);
        return mix(
            mix(sandHash(cell), sandHash(cell + vec2(1.0, 0.0)), blend.x),
            mix(sandHash(cell + vec2(0.0, 1.0)),
                sandHash(cell + vec2(1.0, 1.0)), blend.x),
            blend.y
        );
    }
`;

const SAND_BLEND = /* glsl */ `
    #include <map_fragment>

    vec2 sandPosition = vTerrainPosition.xz;
    float edgeNoise = sandNoise(sandPosition * 0.45) - 0.5;
    float bankDistance = vRiverBankDistance + edgeNoise * uSandBlendWidth;
    float sandAmount = 1.0 - smoothstep(
        uRiverHalfWidth - uSandBlendWidth,
        uRiverHalfWidth + uSandBlendWidth,
        bankDistance
    );

    float dampness = 1.0 - smoothstep(-0.5, uGroundHeight, vTerrainPosition.y);
    vec3 sandColor = mix(uDrySandColor, uWetSandColor, dampness);
    float patches = sandNoise(sandPosition * 0.8);
    float grains = sandNoise(sandPosition * 24.0);
    sandColor *= 0.88 + patches * 0.16 + grains * 0.12;

    diffuseColor.rgb = mix(diffuseColor.rgb, sandColor, sandAmount);
`;

export default function GrassTerrainMaterial({
    map,
    riverHalfWidth,
    groundHeight,
    sandBlendWidth = 2,
}) {
    const material = useMemo(() => {
        const terrainMaterial = new MeshStandardMaterial({ map, roughness: 1 });
        terrainMaterial.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, {
                uRiverHalfWidth: { value: riverHalfWidth },
                uSandBlendWidth: { value: Math.max(0.001, sandBlendWidth) },
                uGroundHeight: { value: groundHeight },
                uDrySandColor: { value: new Color("#d9bb82") },
                uWetSandColor: { value: new Color("#9b8359") },
            });
            shader.vertexShader = shader.vertexShader
                .replace(
                    "#include <common>",
                    "#include <common>\nvarying vec3 vTerrainPosition;\nattribute float riverBankDistance;\nvarying float vRiverBankDistance;",
                )
                .replace(
                    "#include <begin_vertex>",
                    "#include <begin_vertex>\nvTerrainPosition = position;\nvRiverBankDistance = riverBankDistance;",
                );
            shader.fragmentShader = shader.fragmentShader
                .replace(
                    "#include <common>",
                    `#include <common>\n${SAND_SHADER}`,
                )
                .replace("#include <map_fragment>", SAND_BLEND);
        };
        terrainMaterial.customProgramCacheKey = () => "grass-terrain-sand-v2";
        return terrainMaterial;
    }, [map, riverHalfWidth, groundHeight, sandBlendWidth]);

    useEffect(() => () => material.dispose(), [material]);

    return (
        <primitive
            object={material}
            attach="material"
        />
    );
}
