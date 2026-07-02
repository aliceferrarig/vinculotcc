import { Outlet, Link } from 'react-router-dom'
import { Logo } from '../ui'

export function AuthLayout(){
  return <main className="relative min-h-screen overflow-hidden bg-cream px-4 py-8">
    <div className="leaf -left-4 top-1/4"/><div className="leaf -right-8 bottom-10 rotate-180"/>
    <Link to="/" className="relative z-10 mx-auto block w-fit"><Logo/></Link>
    <div className="relative z-10 mx-auto mt-8 w-full max-w-xl"><Outlet/></div>
  </main>
}
