import React, { useRef, useLayoutEffect, useEffect, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { Vector3 } from 'three'
import { useStore, storeVariable } from '../useStore/useStore'

import dogeShipModel from '../Assets/Models/DogeShipV3.gltf'

const vector = new Vector3()

function DogeshipModel(props) {
    const { nodes, materials } = useGLTF(dogeShipModel)

    const view = useStore((state) => state.view)
    const dogeShip = useStore((state) => state.dogeShip)

    const { clock } = useThree()

    const controlsRef = useRef(useStore.getState().controlRef)

    useEffect(() => useStore.subscribe(
        controlRef => (controlsRef.current = controlRef),
        state => state.controlRef
    ), [])

    useLayoutEffect(() => {
        dogeShip.current.position.set(0, 150, 0)
        view.current.rotation.set(0, Math.PI, 0)
        view.current.position.set(0, 154, -9)
        view.current.lookAt(vector.set(
            dogeShip.current.position.x,
            dogeShip.current.position.y,
            dogeShip.current.position.z
            + 20))

        view.current.rotation.z = Math.PI
        dogeShip.current.rotation.y = Math.PI
    }, [dogeShip, view])

    useFrame((state, delta) => {
        const deltaV = 1 * delta * 2
        const time = clock.getElapsedTime()
        const SineOne = Math.sin(time * 5)

        const { left, right, up, down } = controlsRef.current


        //Move forward
        dogeShip.current.position.z -= storeVariable.gameSpeed * delta * 165
        //Move Lateral
        if (storeVariable.gameOver) {
            storeVariable.horizontalV = 0
        }
        dogeShip.current.position.x += storeVariable.horizontalV * delta * 165

        if (storeVariable.gameOver) {
            storeVariable.verticalV = 0
        }
        //Move Up and down
        dogeShip.current.position.y += storeVariable.verticalV * delta * 165

        //ship curve when turning
        dogeShip.current.rotation.z = storeVariable.horizontalV * 1.5
        dogeShip.current.rotation.y = Math.PI - storeVariable.horizontalV * 0.4
        dogeShip.current.rotation.x = Math.abs(storeVariable.horizontalV) / 10


        //ship tilt when going up or down
        dogeShip.current.rotation.x = Math.PI - Math.PI + (storeVariable.verticalV) * 0.4

        //ship hovering
        dogeShip.current.position.y -= SineOne / 250
        dogeShip.current.rotation.x += SineOne / 100
        dogeShip.current.rotation.z += Math.sin(time * 4) / 100

        // camera
        view.current.position.z = dogeShip.current.position.z + 13.5 //default is 13.5
        view.current.position.y = dogeShip.current.position.y + 10 //default is 5
        view.current.position.x = dogeShip.current.position.x
        view.current.rotation.y = Math.PI

        if ((left && right) || (!left && !right)) {
            if (storeVariable.horizontalV < 0) {
                if (storeVariable.horizontalV + deltaV > 0) {
                    storeVariable.horizontalV = 0
                } else {
                    storeVariable.horizontalV += deltaV
                }
            }

            if (storeVariable.horizontalV > 0) {
                if (storeVariable.horizontalV - deltaV < 0) {
                    storeVariable.horizontalV = 0
                } else {
                    storeVariable.horizontalV -= deltaV
                }
            }
        }

        // up and down 
        if ((up && down) || (!up && !down)) {
            if (storeVariable.verticalV < 0) {
                if (storeVariable.verticalV + deltaV > 0) {
                    storeVariable.verticalV = 0
                } else {
                    storeVariable.verticalV += deltaV
                }
            }

            if (storeVariable.verticalV > 0) {
                if (storeVariable.verticalV - deltaV < 0) {
                    storeVariable.verticalV = 0
                } else {
                    storeVariable.verticalV -= deltaV
                }
            }
        }


        // Turn Left & Right
        if (!storeVariable.gameOver && storeVariable.gameSpeed > 0) {
            if ((left && !right)) {
                storeVariable.horizontalV = Math.max(-0.7, storeVariable.horizontalV - deltaV)
            }

            if ((!left && right)) {
                storeVariable.horizontalV = Math.min(0.7, storeVariable.horizontalV + deltaV)
            }
        }
        //Turn Up and Down+
        if (!storeVariable.gameOver && storeVariable.gameSpeed > 0) {
            if ((!up && down)) {
                storeVariable.verticalV = Math.max(-0.7, storeVariable.verticalV - deltaV)
            }

            if ((up && !down)) {
                storeVariable.verticalV = Math.min(0.7, storeVariable.verticalV + deltaV)
            }
        }

    })

    return (
        <>
            <PerspectiveCamera
                makeDefault
                ref={view}
                fov={90}
                rotation={[0, Math.PI, 0]}
                position={[0, 50, -20]}
            />
            <group ref={dogeShip} {...props} dispose={null}>
                <group position={[0, 5.13, 0]} rotation={[-1.7, 0, 0]} scale={[0.01, 0.01, 0.01]}>
                    <mesh geometry={nodes.Object_2001.geometry} material={materials['Material__27.001']} />
                    <mesh geometry={nodes.Object_2001_1.geometry} material={materials['default.001']} />
                    <mesh geometry={nodes.Object_2001_2.geometry} material={materials['default.002']} />
                    <mesh geometry={nodes.Object_2001_3.geometry} material={materials['default.003']} />
                    <mesh geometry={nodes.Object_2001_4.geometry} material={materials['Material__25.001']} />
                    <mesh geometry={nodes.Object_2001_5.geometry} material={materials['Material__26.001']} />
                    <mesh geometry={nodes.Object_2001_6.geometry} material={materials['Material__28.001']} />
                    <mesh geometry={nodes.Object_2001_7.geometry} material={materials['Material__29.001']} />
                    <mesh geometry={nodes.Object_2001_8.geometry} material={materials['Material__30.001']} />
                    <mesh geometry={nodes.Object_2001_9.geometry} material={materials['Tex_0230_0_dds.001']} />
                </group>
            </group>
        </>
    )
}


useGLTF.preload(dogeShipModel)

function Loading() {
    return (
        <mesh visible position={[0, 0.87, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry attach="geometry" args={[1, 16, 16]} />
            <meshStandardMaterial
                attach="material"
                color="black"
                transparent
                opacity={1}
                roughness={1}
                metalness={0}
            />
        </mesh>
    )
}

export default function Ship() {

    return (
        <Suspense fallback={<Loading />}>
            <DogeshipModel>

            </DogeshipModel>
        </Suspense>
    )
}
