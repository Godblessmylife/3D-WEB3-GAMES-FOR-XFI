import { useEffect } from 'react'
import { useStore } from '../useStore/useStore'

const keypress = []

function useKeys(target, event, up = true) {
    useEffect(() => {
        const downHandler = (e) => {
            if (target.indexOf(e.key) !== -1) {
                const setRepeat = !!keypress[e.keyCode]
                keypress[e.keyCode] = true
                if (up || !setRepeat) event(true)
            }
        }

        const upHandler = (e) => {
            if (target.indexOf(e.key) !== -1) {
                keypress[e.keyCode] = false
                if (up) event(false)
            }
        }

        window.addEventListener('keydown', downHandler, { passive: true })
        window.addEventListener('keyup', upHandler, { passive: true })
        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    }, [target, event, up])
}


export default function GameControls() {
    const set = useStore((state) => state.set)
    useKeys(['ArrowLeft', 'a', 'A'], (left) => set((state) => ({ ...state, controlRef: { ...state.controlRef, left } })))
    useKeys(['ArrowRight', 'd', 'D'], (right) => set((state) => ({ ...state, controlRef: { ...state.controlRef, right } })))
    useKeys(['ArrowUp', 'w', 'W'], (up) => set((state) => ({ ...state, controlRef: { ...state.controlRef, up } })))
    useKeys(['ArrowDown', 's', 'S'], (down) => set((state) => ({ ...state, controlRef: { ...state.controlRef, down } })))
    return null
}