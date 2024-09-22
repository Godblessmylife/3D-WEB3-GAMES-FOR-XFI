import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'


import { useStore, storeVariable } from '../useStore/useStore'

const STARTING_GAME_SPEED = 0.8

export default function State() {
    const dogeShip = useStore(state => state.dogeShip)
    const gameStart = useStore(state => state.gameStart)
    const isScore = useStore(state => state.isScore)
    const increaseSpeed = useStore(state => state.increaseSpeed)
    const isGameOver = useStore(state => state.isGameOver)

    useEffect(() => {
        if (gameStart) {
            storeVariable.setSpeed = STARTING_GAME_SPEED
        }
    }, [gameStart])

    useFrame((state, delta) => {

        //acceleration
        const deltaV = 1 * delta * 0.15
        if (gameStart && !storeVariable.gameOver) {
            if (storeVariable.gameSpeed < storeVariable.setSpeed) {
                increaseSpeed(true)
                if (storeVariable.gameSpeed + deltaV > storeVariable.setSpeed) {
                    storeVariable.gameSpeed = storeVariable.setSpeed
                } else {
                    storeVariable.gameSpeed += deltaV
                }
            } else {
                increaseSpeed(false)
            }
        }

        if (dogeShip.current) {
            storeVariable.gameScore = Math.abs(dogeShip.current.position.z) + (storeVariable.coinCount) - 10
        }

        if (gameStart && storeVariable.gameOver) {
            isScore(storeVariable.gameScore)
            isGameOver(true)
        }
    })

    return null
}