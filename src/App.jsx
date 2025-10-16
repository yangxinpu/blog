import { Suspense,lazy } from "react"

import Loading from './components/layout/Loading/Loading';

const Container = lazy(() => import('./components/layout/Container/Container'));
function App() {
  return (
    <>
      <Suspense fallback={<Loading></Loading>}>
        <Container />    
      </Suspense>
    </>
  )
}

export default App
