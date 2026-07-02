import { Camera, Check, LoaderCircle, Upload, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import placeholderAvatar from '../../assets/avatar-placeholder.svg'
import { Button, Card } from '../../components/ui'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { uploadProfilePhoto } from '../../services/profilePhoto'
import { PhotoAdjuster } from '../../components/PhotoAdjuster'

export function ProfilePhotoSetup(){
  const profile=useCurrentProfile(); const navigate=useNavigate(); const [file,setFile]=useState<File|null>(null); const [editingFile,setEditingFile]=useState<File|null>(null); const [preview,setPreview]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('')
  const isPsychologist=profile?.role==='psicologo'
  useEffect(()=>{if(!file){setPreview('');return}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file])
  const destination=()=>navigate(isPsychologist?'/psicologo/dashboard':'/cliente/descobrir')
  async function continueFlow(){
    if(!file&&isPsychologist&&!profile?.avatarUrl){setError('A foto profissional é obrigatória para continuar.');return}
    if(!file){destination();return}
    setLoading(true);setError('')
    try{await uploadProfilePhoto(file);destination()}catch(exception){setError(exception instanceof Error?exception.message:'Não foi possível enviar a foto.')}finally{setLoading(false)}
  }

  if(!profile)return <Card className="grid min-h-72 place-items-center"><LoaderCircle className="animate-spin text-sage-500" size={30}/></Card>
  return <Card className="p-6 text-center sm:p-9"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-100 text-sage-700"><Camera size={22}/></span><h1 className="mt-5 text-2xl font-semibold text-sage-700">{isPsychologist?'Adicione sua foto profissional':'Quer adicionar uma foto?'}</h1><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-sage-500">{isPsychologist?'Ela ajuda os clientes a reconhecerem você e é obrigatória para publicar o perfil.':'A foto deixa sua experiência mais pessoal, mas você também pode fazer isso depois.'}</p>
    <div className="mx-auto mt-7 w-fit"><div className="relative"><img src={preview||profile?.avatarUrl||placeholderAvatar} alt="Prévia da foto" className="h-36 w-36 rounded-[36px] border-4 border-white object-cover object-top shadow-soft"/>{file&&<span className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-sage-600 text-white"><Check size={17}/></span>}</div></div>
    <label className="focus-ring mx-auto mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-sage-300 bg-white px-5 text-sm font-semibold text-sage-700 hover:bg-sage-50"><Upload size={17}/>{file?'Escolher outra foto':'Selecionar foto'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event=>{setError('');setEditingFile(event.target.files?.[0]||null);event.target.value='' }}/></label><p className="mt-2 text-xs text-sage-400">JPG, PNG ou WebP · máximo de 5 MB</p>
    {error&&<p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <Button full className="mt-6" disabled={loading||!profile} onClick={continueFlow}>{loading?<LoaderCircle className="animate-spin" size={17}/>:<UserRound size={17}/>}Continuar</Button>
    {!isPsychologist&&<button type="button" disabled={!profile||loading} onClick={destination} className="mt-4 text-sm font-semibold text-sage-500 hover:text-sage-700">Pular por enquanto</button>}
    {isPsychologist&&<p className="mt-4 text-xs text-sage-500">Seu perfil só será exibido na busca depois que tiver uma foto.</p>}<PhotoAdjuster file={editingFile} onCancel={()=>setEditingFile(null)} onConfirm={adjusted=>{setFile(adjusted);setEditingFile(null)}}/>
  </Card>
}
