import { Cone } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'


import { useStore, storeVariable } from '../useStore/useStore'

const PLANE_SIZE = 1000
const WALL_RADIUS = 40
const LEFT_BOUND = (-PLANE_SIZE / 2) * 0.6
const RIGHT_BOUND = (PLANE_SIZE / 2) * 0.6
const UP_BOUND = 300
const DOWN_BOUND = -25

export default function MapBoundary() {
    const dogeShip = useStore((s) => s.dogeShip)

    const rightWall = useRef()
    const leftWall = useRef()
    const upWall = useRef()
    const downWall = useRef()

    //GOLD =#e1b303
    //RED = #FF3131;
    //BLUE = #1F51FF;

    useFrame((state, delta) => {
        if (dogeShip.current) {
            rightWall.current.position.z = dogeShip.current.position.z
            leftWall.current.position.z = dogeShip.current.position.z
            upWall.current.position.z = dogeShip.current.position.z
            downWall.current.position.z = dogeShip.current.position.z

            if (dogeShip.current.position.x <= LEFT_BOUND + (WALL_RADIUS / 2) ||
                dogeShip.current.position.x >= RIGHT_BOUND - (WALL_RADIUS / 2) ||
                dogeShip.current.position.y <= DOWN_BOUND + (WALL_RADIUS / 2) ||
                dogeShip.current.position.y >= UP_BOUND + (WALL_RADIUS / 2)) {

                storeVariable.gameSpeed = 0
                storeVariable.gameOver = true
            }
        }
    })

    return (
        <>

            <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[LEFT_BOUND, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={leftWall}>
                <meshBasicMaterial attach="material" color={'#FF3131'} visible={false} transparent={true} opacity={1} />
            </Cone>
            <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[RIGHT_BOUND, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={rightWall}>
                <meshBasicMaterial attach="material" color={'#FF3131'} visible={false} transparent={true} opacity={1} />
            </Cone>
            <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[RIGHT_BOUND, UP_BOUND, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={downWall}>
                <meshBasicMaterial attach="material" color={'#FF3131'} visible={false} transparent={true} opacity={1} />
            </Cone>
            <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[LEFT_BOUND, UP_BOUND, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={upWall}>
                <meshBasicMaterial attach="material" color={'#FF3131'} visible={false} transparent={true} opacity={1} />
            </Cone>
        </>
    )
}