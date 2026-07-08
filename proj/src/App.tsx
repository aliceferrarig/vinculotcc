import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthLayout } from './components/layouts/AuthLayout'
import { ClientLayout } from './components/layouts/ClientLayout'
import { PsychologistLayout } from './components/layouts/PsychologistLayout'
import { Landing } from './pages/Landing'
import { Login, Register } from './pages/auth/AuthPages'
import { ProfilePhotoSetup } from './pages/auth/ProfilePhotoSetup'
import { Discovery } from './pages/client/Discovery'
import { Screening } from './pages/client/Screening'
import { Results } from './pages/client/Results'
import { PsychologistProfile } from './pages/client/PsychologistProfile'
import { Booking } from './pages/client/Booking'
import { ClientUtilityPage } from './pages/client/ClientUtilityPage'
import { Dashboard } from './pages/psychologist/Dashboard'
import { Availability } from './pages/psychologist/Availability'
import { EditProfile } from './pages/psychologist/EditProfile'
import { Plan } from './pages/psychologist/Plan'
import { ProfessionalUtilityPage } from './pages/psychologist/ProfessionalUtilityPage'

export default function App(){return <Routes>
  <Route path="/" element={<Landing/>}/>
  <Route element={<AuthLayout/>}><Route path="/entrar" element={<Login/>}/><Route path="/cadastro/:role" element={<Register/>}/><Route path="/completar-perfil" element={<ProfilePhotoSetup/>}/></Route>
  <Route element={<ProtectedRoute role="cliente"/>}>
  <Route path="/cliente" element={<ClientLayout/>}>
    <Route index element={<Navigate to="descobrir" replace/>}/><Route path="descobrir" element={<Discovery/>}/><Route path="triagem" element={<Screening/>}/><Route path="resultados" element={<Results/>}/><Route path="psicologos/:id" element={<PsychologistProfile/>}/><Route path="agendar/:id" element={<Booking/>}/>
    <Route path="favoritos" element={<ClientUtilityPage type="favoritos"/>}/><Route path="agendamentos" element={<ClientUtilityPage type="agendamentos"/>}/><Route path="mensagens" element={<ClientUtilityPage type="mensagens"/>}/><Route path="perfil" element={<ClientUtilityPage type="perfil"/>}/>
  </Route>
  </Route>
  <Route element={<ProtectedRoute role="psicologo"/>}>
  <Route path="/psicologo" element={<PsychologistLayout/>}>
    <Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="perfil" element={<EditProfile/>}/><Route path="disponibilidade" element={<Availability/>}/><Route path="plano" element={<Plan/>}/>
    <Route path=":type" element={<ProfessionalUtilityPage/>}/>
  </Route>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes>}
