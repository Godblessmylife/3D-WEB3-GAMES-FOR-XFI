import * as React from 'react'

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '4rem',
        justifyContent: 'center',
        transition: 'opacity 300ms ease',
        zIndex: 1000,
    },
    inner: {
        width: 306,
        height: 46,
        textAlign: 'center',
        borderRadius: '5px',
        boxShadow: '0 0 20px 0px #fe2079',
        border: '3px solid #e1b303'
    },
    bar: {
        width: '100%',
        height: 40,
        background: '#e1b303',
        transition: 'transform 200ms',
        transformOrigin: 'left center',
        boxShadow: '0 0 20px 0px #e1b303'
    },
    data: {
        textAlign: 'center',
        marginTop: '2rem',
        color: '#e1b303',
        fontSize: '2em',
        fontFamily: `Orbitron`,
        whiteSpace: 'nowrap',
        textShadow: '0 0 32px '
    },
}
const defaultDataInterpolation = (p) => `Initializing: ${p.toFixed(0)}%`

export default function Loader({ active, progress, dataInterpolation = defaultDataInterpolation }) {
    const LoadingRef = React.useRef(0)
    const rafRef = React.useRef(0)
    const LoadedRef = React.useRef(null)

    const updateProgress = React.useCallback(() => {
        if (!LoadedRef.current) return
        LoadingRef.current += (progress - LoadingRef.current) / 2
        if (LoadingRef.current > 0.95 * progress || progress === 100) LoadingRef.current = progress
        LoadedRef.current.innerText = dataInterpolation(LoadingRef.current)
        if (LoadingRef.current < progress) rafRef.current = requestAnimationFrame(updateProgress)
    }, [dataInterpolation, progress])

    React.useEffect(() => {
        updateProgress()
        return () => cancelAnimationFrame(rafRef.current)
    }, [updateProgress])

    return (
        <div style={{ ...styles.container, opacity: active ? 1 : 0 }}>
            <div>
                <div style={{ ...styles.inner }}>
                    <div style={{ ...styles.bar, transform: `scaleX(${progress / 100})` }}></div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <span ref={LoadedRef} style={{ ...styles.data }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
