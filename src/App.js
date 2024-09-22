import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Preload } from '@react-three/drei'
import { useStore } from './useStore/useStore'

import State from './Components/State'


import GameControls from './Components/GameControls'
import Skybox from './Components/SkyBox'
import Ship from './Components/Ship'
import MapBoundary from './Components/MapBoundary'
import Obstacles from './Components/Obstacles'
import Hud from './Components/Hud'
import GameMenu from './Components/GameMenu'
import GameOver from './Components/GameOver'
import Terrain from './Components/Terrain'
import Bloom from './Components/Bloom'
import Coin from './Components/Coin'

function App() {
  const directionalLight = useStore((s) => s.directionalLight)
  const directionalLight2 = useStore((s) => s.directionalLight2)
  return (
    <>
      <Canvas mode="concurrent" dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <State />
          <Bloom />
          <Skybox />
          <directionalLight
            ref={directionalLight}
            position={[Math.PI, Math.PI, 0]}
            intensity={3}
            color={'#5aaccc'}
          />
          <directionalLight
            ref={directionalLight2}
            position={[-Math.PI, -Math.PI, 0]}
            intensity={3}
            color={'#5aaccc'}
          />
          <ambientLight
            intensity={0.5}
            color={'#5aaccc'}
          />
          <Ship />
          < MapBoundary />
          <Obstacles />
          <Coin />
          <Terrain />
          <GameControls />
          <Preload all />
        </Suspense>
      </Canvas>
      <Hud />
      <GameMenu />
      <GameOver />
    </>
  );
}

export default App;
