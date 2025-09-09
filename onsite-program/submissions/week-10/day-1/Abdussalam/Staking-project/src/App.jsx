import { useState } from 'react'
import AppLayout from './components/Layout'
import StakeDashboard from './components/StakeDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <AppLayout>
    <StakeDashboard />
   </AppLayout>
   </>
  )
}

export default App
