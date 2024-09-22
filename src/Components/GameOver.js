import { useState, useEffect } from 'react'
import { useStore } from '../useStore/useStore'
import '../Styles/gameOver.scss'
import dogeCoin from '../Assets/Texture/dogeCoinIcon.svg'



const GameOver = () => {
    const previousScores = localStorage.getItem('postScores') ? JSON.parse(localStorage.getItem('postScores')) :
        [...Array(3).fill(0)]
    const [display, setDisplay] = useState(false)
    const [postScores, setPostScores] = useState(previousScores)

    const gameOver = useStore(state => state.gameOver)
    const gameScore = useStore(state => state.gameScore)

    useEffect(() => {
        gameOver ? setDisplay(true) : setDisplay(false)
    }, [gameOver])

    useEffect(() => {
        if (gameOver) {
            if (postScores.some(previousScores => previousScores < gameScore)) {
                const compareScores = postScores.sort((a, b) => a - b)
                compareScores[0] = gameScore.toFixed(0)
                const descendingScores = compareScores.sort((a, b) => b - a)

                setPostScores(descendingScores)
                localStorage.setItem('postScores', JSON.stringify(descendingScores))
            }
        }
    }, [gameScore, gameOver, postScores])

    const handleRefresh = () => {
        window.location.reload()
    }


    return display ? (
        <div className="over" >
            <div className="over__container">
                <h1 className="over__title">GAME OVER</h1>
                <div className="over__score-container">
                    <div className='over__score-top'>
                        <h2 className="over__current-score">Your Score</h2>
                        <h2 className="over__current-value pulsate-fwd"> {gameScore.toFixed(0)}</h2>
                    </div>
                    <div className="over__score-bottom">
                        <h2 className="over__leaderboards">LEADERBOARDS</h2>
                        {postScores.map((p, i) => (
                            <div className="over__leaderboards-list">
                                <div className="over__leaderboards-value">{`${i + 1}:`}</div>
                                <div className="over__leaderboards-score">{p > 0 ? p : '-'}
                                </div>
                            </div>
                        ))}
                        <div className="over__restart-container">
                            <img onClick={handleRefresh} src={dogeCoin} alt="doge coin " className="over__restart-button flip-vertical-right"></img>
                            <h2 className='over__restart-title'>PLAY AGAIN?</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default GameOver