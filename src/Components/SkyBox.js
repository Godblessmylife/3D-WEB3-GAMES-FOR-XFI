import { Suspense, useRef, useLayoutEffect, useMemo, useEffect } from 'react'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { BackSide, MirroredRepeatWrapping } from 'three'

import backgroundTexture from '../Assets/Texture/neonGalaxy.jpg'
import dogeMoon from '../Assets/Texture/DogecoinLogo.jfif'

import { storeVariable, useStore } from '../useStore/useStore'



function Space() {
    const spaceTexture = useTexture(backgroundTexture)
    const space = useRef()
    const stars = useRef()

    const dogeShip = useStore((s) => s.dogeShip)

    useLayoutEffect(() => {
        spaceTexture.wrapS = spaceTexture.wrapT = MirroredRepeatWrapping
        spaceTexture.repeat.set(1.8, 1.8)
        spaceTexture.anistropy = 16
    }, [spaceTexture])

    useFrame((state, delta) => {
        space.current.rotation.z += delta * 0.02 * storeVariable.gameSpeed
        stars.current.rotation.z += delta * 0.02 * storeVariable.gameSpeed

        if (dogeShip.current) {
            space.current.position.x = dogeShip.current.position.x
            stars.current.position.x = dogeShip.current.position.x
            space.current.position.z = dogeShip.current.position.z
            stars.current.position.z = dogeShip.current.position.z
        }
    })

    return (
        <>
            <mesh ref={space} position={[0, 10, -50]} rotation={[0, 0, Math.PI]}>
                <hemisphereLight intensity={0.4} />
                <sphereGeometry
                    attach='geometry'
                    args={[2000, 10, 10]}
                />
                <meshPhongMaterial
                    emissive={'red'}
                    emissiveIntensity={0.1}
                    fog={false}
                    side={BackSide}
                    attach='material'
                    map={spaceTexture}
                />
            </mesh>
            <Stars
                ref={stars}
                radius={800}
                depth={100}
                count={10000}
                factor={40}
                saturation={1}
                fade
            />
        </>
    )
}



function Moon() {
    const { clock } = useThree()

    const moon = useStore((s) => s.moon)
    const dogeShip = useStore((s) => s.dogeShip)
    const moonTexture = useTexture(dogeMoon)

    useLayoutEffect(() => {
        moonTexture.wrapS = moonTexture.wrapT = MirroredRepeatWrapping
        moonTexture.repeat.set(1, 1.2)
        moonTexture.anistropy = 16
        moonTexture.rotation = 0.35
    }, [moonTexture])

    useFrame((state, delta) => {
        if (dogeShip.current) {
            moon.current.position.z = dogeShip.current.position.z - 1700
            moon.current.position.x = dogeShip.current.position.x
        }

        moon.current.scale.x += Math.sin(clock.getElapsedTime() * 3) / 3000
        moon.current.scale.y += Math.sin(clock.getElapsedTime() * 3) / 3000
    })

    return (
        <mesh ref={moon} position={[0, 500, -2000]}>
            <sphereGeometry
                attach="geometry"
                args={[500, 30, 30]} />
            <meshStandardMaterial
                fog={false}
                emissive={'#fa26a0'}
                emissiveIntensity={0.8}
                attach="material"
                map={moonTexture}
                color={new THREE.Color('#e1b303')}
            />
        </mesh>
    )
}

function Fog() {
    const fog = useRef()

    useFrame((state, delta) => {
        fog.current.near = 500
        fog.current.far = 800
    })

    return (
        <fog ref={fog} attach="fog" args={['#5aaccc', 500, 800]} />
    )
}


export default function Skybox() {

    return (
        <Suspense fallback={null}>
            <Moon />
            <Space />
            <Fog />
        </Suspense>
    )
}