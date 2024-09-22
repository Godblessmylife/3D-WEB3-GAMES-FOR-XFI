import { DoubleSide, FrontSide, MirroredRepeatWrapping, Object3D } from 'three'
import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

import blockTexture from '../Assets/Texture/blockchain.jpg'

import { storeVariable, useStore } from '../useStore/useStore'


const PLANE_SIZE = 1000
const LEFT_BOUND = (-PLANE_SIZE / 2) * 0.6
const RIGHT_BOUND = (PLANE_SIZE / 2) * 0.6
const CUBE_SIZE = 25
// 18
const OBJECT_COUNT = 400
// 500
const WALL_RADIUS = 40

const randomInRange = (from, to) => Math.floor(Math.random() * (to - from + 1)) - to

function ThreeDistance(p1x, p1y, p1z, p2x, p2y, p2z) {
    const a = p2x - p1x;
    const b = p2y - p1y;
    const c = p2z - p1z

    return Math.sqrt(a * a + b * b + c * c);
}

const negativeBound = LEFT_BOUND + WALL_RADIUS / 2
const positiveBound = RIGHT_BOUND - WALL_RADIUS / 2


export default function GenerateBlock() {
    const mesh = useRef()

    const texture = useTexture(blockTexture)

    useLayoutEffect(() => {
        texture.wrapS = texture.wrapT = MirroredRepeatWrapping
        texture.repeat.set(0.9, 1.1)
        texture.anistropy = 16
        texture.rotation = 0.4
    }, [texture])

    const dogeShip = useStore(s => s.dogeShip)


    const initial = useMemo(() => new Object3D(), [])
    const block = useMemo(() => {

        const temp = []
        for (let i = 0; i < OBJECT_COUNT; i++) {
            const x = randomInRange(negativeBound, positiveBound)
            const y = randomInRange(-50, -300)
            const z = -750 + randomInRange(-400, 400)

            temp.push({ x, y, z })
        }
        return temp
    }, [])


    useFrame((state, delta) => {

        block.forEach((b, i) => {
            if (dogeShip.current) {
                if (b.z - dogeShip.current.position.z > -15) {
                    if (b.x - dogeShip.current.position.x > -15 ||
                        b.x - dogeShip.current.position.x < 15 ||
                        b.y - dogeShip.current.position.y > -15 ||
                        b.y - dogeShip.current.position.y < 15) {

                        const shipDistance = ThreeDistance(
                            dogeShip.current.position.x,
                            dogeShip.current.position.y,
                            dogeShip.current.position.z,
                            b.x, b.y, b.z)

                        if (shipDistance < 15) {
                            storeVariable.cubeSpeed = 0
                            storeVariable.gameSpeed = 0
                            storeVariable.gameOver = true
                        }
                    }
                }

                if (b.z - dogeShip.current.position.z > 15) {

                    b.z = dogeShip.current.position.z - PLANE_SIZE + randomInRange(-200, 0)
                    b.y = randomInRange(-50, -300)
                    b.x = randomInRange(negativeBound, positiveBound)

                }

                if (b.y < CUBE_SIZE / 2) {
                    if (b.y + delta * 100 > CUBE_SIZE / 2) {
                        b.y = CUBE_SIZE / 2
                    } else {
                        b.y += delta * 100
                    }
                }
            }

            if (Math.random() < 0.5) {
                b.x += Math.random() < .04 ? Math.sin(storeVariable.cubeSpeed * delta) * 400 : 0
            } else {
                b.x -= Math.random() < .04 ? Math.sin(storeVariable.cubeSpeed * delta) * 400 : 0
            }

            if (Math.random() < 0.5) {
                b.y += Math.random() < .04 ? Math.sin(storeVariable.cubeSpeed * delta) * 400 : 0
            } else {
                b.y -= Math.random() < .04 ? Math.sin(storeVariable.cubeSpeed * delta) * 400 : 0
            }

            initial.position.set(
                b.x,
                b.y,
                b.z
            )

            initial.updateMatrix()
            mesh.current.setMatrixAt(i, initial.matrix)
        })

        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, OBJECT_COUNT]}>
            <boxBufferGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
            <meshBasicMaterial ref={texture} color={'#ADD8E6'} map={texture} side={DoubleSide} />
        </instancedMesh>
    )
}