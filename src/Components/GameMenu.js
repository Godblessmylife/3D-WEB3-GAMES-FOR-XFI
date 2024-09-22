import { useState, useEffect } from 'react'
import { useStore } from '../useStore/useStore'
import dogeBackground from '../Assets/Texture/dogeBackgroundRevised.png'
import '../Styles/gameMenu.scss'
import wasdControls from '../Assets/Texture/wasdKeys.png'
import arrowControls from '../Assets/Texture/arrowKeys.png'
import { useProgress } from '@react-three/drei'

import Loading from './Loading'

const GameMenu = () => {

    const [display, setDisplay] = useState(true)
    const [opaque, setOpaque] = useState(true)
    const [hasLoaded, setHasLoaded] = useState(false)
    const { active, progress } = useProgress()


    const gameStart = useStore(state => state.gameStart)
    const gameOver = useStore(state => state.gameOver)
    const isGameStart = useStore(state => state.isGameStart)

    const [controlInfo, setControlInfo] = useState(false)

    useEffect(() => {
        if (gameStart || gameOver) {
            setDisplay(false)
        } else if (!gameStart) {
            setDisplay(true)
        }
    }, [gameOver, gameStart, active])

    useEffect(() => {
        let t
        if (hasLoaded === opaque) t = setTimeout(() => setOpaque(!hasLoaded), 300)
        return () => clearTimeout(t)
    }, [hasLoaded, opaque])

    useEffect(() => {
        if (progress >= 100) {
            setHasLoaded(true)
        }
    }, [progress])

    const handleGameStart = () => {
        isGameStart(true)
    }

    const handleControlInfo = () => {
        if (!controlInfo) {
            setControlInfo(true)
        } else if (controlInfo) {
            setControlInfo(false)
        }
    }

    return display ? (

        <>
            <div className="menu">
                <div className='menu__layer'>
                    <img className="menu__logo" src={dogeBackground} alt="Logo"></img>
                    {!hasLoaded ? (
                        <Loading active={active} progress={progress} />
                    ) : (
                        <div className="menu__container">
                            <div className="menu__content">
                                <div className="menu__controls">
                                    <button className="menu__start" onClick={handleGameStart}>START GAME</button>
                                    <button className="menu__controls-description" onClick={handleControlInfo}> VIEW CONTROLS TOGGLE</button>
                                </div>
                                <div className="menu__controls-container">
                                    <div className='menu__controls-image'>
                                        {controlInfo ? <img className="menu__controls-wasd" src={wasdControls} alt="wasd controls" /> :
                                            <img className="menu__controls-arrow" src={arrowControls} alt="arrow keys controls" />
                                        }
                                    </div>
                                    <div className='menu__controls-text'>
                                        {controlInfo ? <pre className='menu__controls-wasd-layout'>  W / S   FOR   &#8593;  / &#8595; <br />  A / D   FOR   &#8592; / &#8594; </pre> :
                                            <pre className='menu__controls-arrow-layout'>USE ARROW KEYS</pre>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="footer">
                                <div className="footer__content">
                                    <h3> Created by Andy Song </h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    ) : null

}

export default GameMenu