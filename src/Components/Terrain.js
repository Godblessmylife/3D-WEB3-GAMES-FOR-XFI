import { MirroredRepeatWrapping, BackSide, DoubleSide, FrontSide } from 'three'
import React, { useRef, Suspense, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useStore, storeVariable } from '../useStore/useStore'



const PLANE_SIZE = 1000
const GAME_SPEED_MULTIPLIER = 0.2


const TEXTURE_SIZE = PLANE_SIZE * 0.05 // 0.075
const MOVE_DISTANCE = PLANE_SIZE * 2



function Terrain() {
    const ground = useRef()
    const groundTwo = useRef()

    const planeTop = useRef()
    const planeBot = useRef()
    const planeLeft = useRef()
    const planeRight = useRef()

    const planeTwoTop = useRef()
    const planeTwoBot = useRef()
    const planeTwoLeft = useRef()
    const planeTwoRight = useRef()

    const dogeShip = useStore(s => s.dogeShip)
    const difficultyScale = useStore(s => s.difficultyScale)



    const moveCounter = useRef(1)
    const lastMove = useRef(0)

    useFrame(() => {

        if (dogeShip.current) {
            if (Math.round(dogeShip.current.position.z) + PLANE_SIZE * moveCounter.current + 10 < -10) {
                if (moveCounter.current === 1 || Math.abs(dogeShip.current.position.z) - Math.abs(lastMove.current) <= 10) {
                    if (moveCounter.current % 4 === 0) {
                        difficultyScale()
                        storeVariable.nextLevel++
                        storeVariable.setSpeed += GAME_SPEED_MULTIPLIER
                    }

                    if (moveCounter.current % 2 === 0) {
                        planeTwoBot.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeTwoBot.current.position.z

                        planeTwoTop.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeTwoTop.current.position.z

                        planeTwoLeft.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeTwoLeft.current.position.z

                        planeTwoRight.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeTwoRight.current.position.z

                    } else {
                        planeBot.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeBot.current.position.z

                        planeTop.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeTop.current.position.z

                        planeLeft.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeLeft.current.position.z

                        planeRight.current.position.z -= MOVE_DISTANCE
                        lastMove.current = planeRight.current.position.z

                    }
                }

                moveCounter.current++
            }
        }
    })
    return (
        <>
            <group ref={ground}  >
                <mesh // bottom wall
                    ref={planeBot}
                    receiveShadow
                    visible
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, -(PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[600, PLANE_SIZE, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={DoubleSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.1}
                        wireframe={true}

                    />
                </mesh>

                <mesh // Top wall
                    ref={planeTop}
                    receiveShadow
                    visible
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 300, -(PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[600, PLANE_SIZE, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={DoubleSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>

                <mesh // Left wall
                    ref={planeLeft}
                    receiveShadow
                    visible
                    rotation={[0, -Math.PI / 2, 0]}
                    position={[-300, 150, -(PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, 300, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={BackSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>
                <mesh // Right wall
                    ref={planeRight}
                    receiveShadow
                    visible
                    rotation={[0, -Math.PI / 2, 0]}
                    position={[300, 150, -(PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, 300, 300, 8,]} />
                    <meshStandardMaterial
                        receiveShadow
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={DoubleSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />

                </mesh>
            </group>

            <group ref={groundTwo} >
                <mesh // Bottom wall
                    ref={planeTwoBot}
                    receiveShadow
                    visible
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, -PLANE_SIZE - (PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[600, PLANE_SIZE, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        // emissiveMap={textures[1]}
                        // map={textures[0]}
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={DoubleSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>
                <mesh //Top wall 
                    ref={planeTwoTop}
                    receiveShadow
                    visible
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 300, -PLANE_SIZE - (PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[600, PLANE_SIZE, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        // emissiveMap={textures[1]}
                        // map={textures[0]}
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={BackSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>
                <mesh // left wall
                    ref={planeTwoLeft}
                    receiveShadow
                    visible
                    rotation={[0, -Math.PI / 2, 0]}
                    position={[-300, 150, -PLANE_SIZE - (PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, 300, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        // emissiveMap={textures[1]}
                        // map={textures[0]}
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={BackSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>
                <mesh // right wall
                    ref={planeTwoRight}
                    receiveShadow
                    visible
                    rotation={[0, -Math.PI / 2, 0]}
                    position={[300, 150, -PLANE_SIZE - (PLANE_SIZE / 2)]}
                >
                    <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, 300, 300, 8, 8]} />
                    <meshStandardMaterial
                        receiveShadow
                        // emissiveMap={textures[1]}
                        // map={textures[0]}
                        attach="material"
                        roughness={1}
                        metalness={0}
                        side={DoubleSide}
                        color="blue"
                        // transparent={true}
                        // opacity={0.4}
                        wireframe={true}
                    />
                </mesh>
            </group>
        </>
    )
}

function LoadingGround() {
    return (
        <mesh
            receiveShadow
            visible
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
        >
            <planeBufferGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
            <meshStandardMaterial
                receiveShadow
                attach="material"
                color={`black`}
                roughness={1}
                metalness={0}
            />
        </mesh>
    )
}

export default function TerrainGround() {

    return (
        <Suspense fallback={<LoadingGround />}>
            <Terrain />
        </Suspense>
    )
}