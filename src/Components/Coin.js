// import { MirroredRepeatWrapping, Object3D, clock } from 'three'
import * as THREE from 'three'
import { useRef, useMemo, useLayoutEffect } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { Circle, useTexture } from '@react-three/drei'

import coinTexture from '../Assets/Texture/doge_coin.png'
import { storeVariable, useStore } from '../useStore/useStore'
import GameOver from './GameOver'


const PLANE_SIZE = 1000
const LEFT_BOUND = (-PLANE_SIZE / 2) * 0.6
const RIGHT_BOUND = (PLANE_SIZE / 2) * 0.6
const Coin_SIZE = 10
const Coin_AMOUNT = 6
const WALL_RADIUS = 40

const randomInRange = (from, to) => Math.floor(Math.random() * (to - from + 1)) - to

function ThreeDistance(p1x, p1y, p1z, p2x, p2y, p2z) {
    const a = p2x - p1x;
    const b = p2y - p1y;
    const c = p2z - p1z

    return Math.sqrt(a * a + b * b + c * c);
}

const negativeBound = LEFT_BOUND + WALL_RADIUS / 2.1
const positiveBound = RIGHT_BOUND - WALL_RADIUS / 2.1


export default function GenerateCoin() {
    const mesh = useRef()
    const coinRef = useRef()

    const texture = useTexture(coinTexture)

    const gameOver = useStore(state => state.gameOver)
    const setDisplayCoin = useStore(s => s.setDisplayCoin)

    useLayoutEffect(() => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
        texture.repeat.set(1, 1)
        texture.anistropy = 16
        texture.rotation = 0
    }, [texture])

    const dogeShip = useStore(s => s.dogeShip)


    const initial = useMemo(() => new THREE.Object3D(), [])
    const coin = useMemo(() => {

        const temp = []
        for (let i = 0; i < Coin_AMOUNT; i++) {
            const x = randomInRange(negativeBound, positiveBound)
            const y = randomInRange(-50, -250)
            const z = -750 + randomInRange(-400, 400)

            temp.push({ x, y, z })
        }
        return temp
    }, [])


    useFrame(({ state, delta, clock }) => {

        // mesh.current.scale.y += Math.sin(clock.getElapsedTime()) / 1200



        coin.forEach((c, i,) => {
            if (dogeShip.current) {
                if (c.z - dogeShip.current.position.z > -15) { // distance function if the ship is too far away
                    if (c.x - dogeShip.current.position.x > -15 ||
                        c.x - dogeShip.current.position.x < 15 ||
                        c.y - dogeShip.current.position.y > -15 ||
                        c.y - dogeShip.current.position.y < 15) {
                        const shipDistance = ThreeDistance(
                            dogeShip.current.position.x,
                            dogeShip.current.position.y,
                            dogeShip.current.position.z,
                            c.x, c.y, c.z)

                        if (shipDistance < 20) {

                            if (storeVariable.gameSpeed <= 1.3) {

                                setDisplayCoin(true)
                                storeVariable.coinCount += 1000
                                storeVariable.coinValue = 1000
                                setTimeout(() => {
                                    setDisplayCoin(false)
                                }, 1000)
                            }

                            else if (storeVariable.gameSpeed >= 1.8) {
                                setDisplayCoin(true)
                                storeVariable.coinCount += 10000
                                storeVariable.coinValue = 10000
                                setTimeout(() => {
                                    setDisplayCoin(false)
                                }, 1000)
                            }
                            else if (storeVariable.gameSpeed <= 1.4) {
                                setDisplayCoin(true)
                                storeVariable.coinCount += 5000
                                storeVariable.coinValue = 5000
                                setTimeout(() => {
                                    setDisplayCoin(false)
                                }, 1000)
                            }


                        }



                        if (shipDistance < 19) {
                            c.x = (storeVariable.cubeSpeed * delta) * 1000

                        }

                        if (gameOver) {
                            storeVariable.coinCount = 1
                        }
                    }
                }


                if (c.z - dogeShip.current.position.z > 15) {

                    c.z = dogeShip.current.position.z - PLANE_SIZE + randomInRange(-200, 0)
                    c.y = randomInRange(-50, -300)
                    c.x = randomInRange(negativeBound, positiveBound)

                }

                if (c.y < Coin_SIZE / 2) {
                    if (c.y + delta * 100 > Coin_SIZE / 2) {
                        c.y = Coin_SIZE / 2
                    } else {
                        c.y += delta * 100
                    }
                }
            }


            initial.position.set(
                c.x,
                c.y,
                c.z
            )

            initial.updateMatrix()
            mesh.current.setMatrixAt(i, initial.matrix)


        })

        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, Coin_AMOUNT]}>
            {/* <boxBufferGeometry args={[Coin_SIZE, Coin_SIZE, Coin_SIZE]} />
            <meshBasicMaterial ref={texture} color={'white'} map={texture} /> */}
            <circleBufferGeometry args={[10, 16, 0]} />
            <meshBasicMaterial ref={texture} color={'#FFD700'} map={texture} />
        </instancedMesh>
    )
}