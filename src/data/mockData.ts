import ana from '../assets/ana-carolina.png'
import rafael from '../assets/rafael.png'
import camila from '../assets/camila.png'
import juliana from '../assets/juliana.png'
import lucas from '../assets/lucas.png'
import julia from '../assets/julia.png'

export type Psychologist = {
  id: string; name: string; crp: string; specialties: string[]; rating: number; reviews: number;
  sessions: number; mode: string; price: number; match: number; image: string; experience: number;
}

export const psychologists: Psychologist[] = [
  { id:'ana-carolina', name:'Ana Carolina Silva', crp:'06/765432', specialties:['Ansiedade','Autoestima','Relacionamentos'], rating:4.9, reviews:120, sessions:398, mode:'Online', price:140, match:94, image:ana, experience:6 },
  { id:'rafael-martins', name:'Rafael Martins', crp:'06/876543', specialties:['Ansiedade','Depressão','Estresse'], rating:4.8, reviews:457, sessions:724, mode:'Online e presencial', price:200, match:89, image:rafael, experience:9 },
  { id:'julia-ferreira', name:'Júlia Ferreira', crp:'06/987654', specialties:['Autoestima','Burnout','Traumas'], rating:4.9, reviews:134, sessions:512, mode:'Online', price:120, match:86, image:julia, experience:5 },
  { id:'camila-souza', name:'Camila Souza', crp:'06/654321', specialties:['TDAH','Relacionamentos','Luto'], rating:4.9, reviews:168, sessions:612, mode:'Online', price:140, match:82, image:camila, experience:7 },
  { id:'juliana-martins', name:'Juliana Martins', crp:'06/123456', specialties:['Ansiedade','Autoestima','Depressão'], rating:4.9, reviews:287, sessions:876, mode:'Online e presencial', price:150, match:80, image:juliana, experience:10 },
  { id:'lucas-ferreira', name:'Lucas Ferreira', crp:'06/112233', specialties:['Ansiedade','Traumas','Burnout'], rating:4.9, reviews:137, sessions:507, mode:'Online e presencial', price:170, match:78, image:lucas, experience:8 }
]

export const appointments = [
  ['09:00','Mariana Santos','Online','Confirmada'], ['10:30','Carlos Eduardo','Online','Confirmada'],
  ['11:30','Juliana Pereira','Presencial','Pendente'], ['13:30','Rafael Lima','Online','Confirmada'], ['15:00','Carla Moreira','Presencial','Confirmada']
]

export const requests = [
  ['Beatriz Oliveira','Hoje, 09:21',camila], ['Lucas Fernandes','Ontem, 16:43',lucas],
  ['Fernanda Almeida','Ontem, 11:02',juliana], ['Alice Silva','Segunda, 18:10',julia]
]
