import { LoaderCircle, Move, RotateCcw, ZoomIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Modal } from './ui'

type PhotoAdjusterProps={file:File|null;onCancel:()=>void;onConfirm:(file:File)=>void}

async function createCroppedFile(file:File,zoom:number,x:number,y:number){
  const source=URL.createObjectURL(file)
  try{
    const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const element=new Image();element.onload=()=>resolve(element);element.onerror=reject;element.src=source})
    const size=800;const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size
    const context=canvas.getContext('2d');if(!context)throw new Error('Não foi possível preparar a imagem.')
    const baseScale=Math.max(size/image.naturalWidth,size/image.naturalHeight);const scale=baseScale*zoom
    const width=image.naturalWidth*scale;const height=image.naturalHeight*scale
    const offsetX=(size-width)*(x/100);const offsetY=(size-height)*(y/100)
    context.fillStyle='#ffffff';context.fillRect(0,0,size,size);context.drawImage(image,offsetX,offsetY,width,height)
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('Não foi possível recortar a imagem.')),'image/jpeg',0.9))
    return new File([blob],`foto-perfil-${Date.now()}.jpg`,{type:'image/jpeg'})
  }finally{URL.revokeObjectURL(source)}
}

export function PhotoAdjuster({file,onCancel,onConfirm}:PhotoAdjusterProps){
  const [url,setUrl]=useState('');const [zoom,setZoom]=useState(1);const [x,setX]=useState(50);const [y,setY]=useState(50);const [processing,setProcessing]=useState(false);const [error,setError]=useState('')
  useEffect(()=>{if(!file){setUrl('');return}const next=URL.createObjectURL(file);setUrl(next);setZoom(1);setX(50);setY(50);return()=>URL.revokeObjectURL(next)},[file])
  async function apply(){if(!file)return;setProcessing(true);setError('');try{onConfirm(await createCroppedFile(file,zoom,x,y))}catch{setError('Não foi possível ajustar esta imagem. Tente outro arquivo.')}finally{setProcessing(false)}}
  return <Modal open={Boolean(file)} onClose={onCancel} className="max-w-lg"><div className="text-center"><h2 className="text-2xl font-semibold text-sage-700">Ajustar foto</h2><p className="mt-2 text-sm text-sage-500">Enquadre seu rosto dentro do quadrado.</p></div><div className="mx-auto mt-6 h-64 w-64 overflow-hidden rounded-[36px] bg-sage-100 shadow-inner"><img src={url} alt="Prévia do recorte" className="h-full w-full object-cover transition-transform" style={{objectPosition:`${x}% ${y}%`,transform:`scale(${zoom})`,transformOrigin:`${x}% ${y}%`}}/></div><div className="mt-7 space-y-5"><label className="block"><span className="mb-2 flex items-center justify-between text-sm font-semibold"><span className="flex items-center gap-2"><ZoomIn size={16}/>Zoom</span><span className="text-sage-500">{zoom.toFixed(1)}×</span></span><input aria-label="Zoom da foto" type="range" min="1" max="3" step="0.1" value={zoom} onChange={event=>setZoom(Number(event.target.value))} className="w-full accent-sage-600"/></label><label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Move size={16}/>Mover para os lados</span><input aria-label="Posição horizontal" type="range" min="0" max="100" value={x} onChange={event=>setX(Number(event.target.value))} className="w-full accent-sage-600"/></label><label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Move className="rotate-90" size={16}/>Mover para cima ou para baixo</span><input aria-label="Posição vertical" type="range" min="0" max="100" value={y} onChange={event=>setY(Number(event.target.value))} className="w-full accent-sage-600"/></label></div><button type="button" onClick={()=>{setZoom(1);setX(50);setY(50)}} className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-sage-600"><RotateCcw size={15}/>Restaurar posição</button>{error&&<p className="mt-4 rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-700">{error}</p>}<div className="mt-7 grid grid-cols-2 gap-3"><Button variant="outline" onClick={onCancel}>Cancelar</Button><Button disabled={processing} onClick={apply}>{processing&&<LoaderCircle className="animate-spin" size={17}/>}Usar esta foto</Button></div></Modal>
}
