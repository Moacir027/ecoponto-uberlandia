const map=L.map('map').setView([-18.918,-48.277],12);
L.maplibreGL({style:'https://tiles.openfreemap.org/styles/liberty',attribution:'© OpenFreeMap © OpenStreetMap contributors'}).addTo(map);
const icon=L.divIcon({html:'♻️',className:'',iconSize:[28,28],style:''});
let userPos=null;
const rota=p=>`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
ECOPONTOS.forEach(p=>{p.marker=L.marker([p.lat,p.lng],{icon:L.divIcon({html:'<div style="font-size:26px">♻️</div>',className:'',iconSize:[30,30]})})
 .addTo(map).bindPopup(`<div class="popup"><b>${p.nome}</b><br>${p.bairro}<br><a href="${rota(p)}" target="_blank">Como chegar</a></div>`)});
function dist(a,b){const R=6371,r=x=>x*Math.PI/180,dLa=r(b.lat-a.lat),dLo=r(b.lng-a.lng);
 const h=Math.sin(dLa/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function carousel(){let arr=ECOPONTOS.map(p=>({...p,d:userPos?dist(userPos,p):null}));if(userPos)arr.sort((a,b)=>a.d-b.d);
 document.getElementById('carousel').innerHTML=arr.map((p,i)=>`<div class="chip" data-i="${ECOPONTOS.findIndex(e=>e.nome===p.nome)}"><b>${p.nome.replace('Ecoponto ','')}</b><span>${p.d!=null?p.d.toFixed(1)+' km · ':''}${p.bairro}</span><a href="${rota(p)}" target="_blank">Rota</a></div>`).join('');
 document.querySelectorAll('.chip').forEach(c=>c.onclick=e=>{if(e.target.tagName==='A')return;const p=ECOPONTOS[c.dataset.i];map.setView([p.lat,p.lng],15);p.marker.openPopup()})}
function render(){carousel();const q=document.getElementById('search').value.toLowerCase();
 let arr=ECOPONTOS.filter(p=>(p.nome+p.bairro).toLowerCase().includes(q));
 if(userPos)arr=arr.map(p=>({...p,d:dist(userPos,p)})).sort((a,b)=>a.d-b.d);
 document.getElementById('list').innerHTML=arr.map(p=>`<li class="item">${p.d!=null?`<span class="dist">${p.d.toFixed(1)} km</span>`:''}<h3>${p.nome}</h3><p>Bairro ${p.bairro}</p><a href="${rota(p)}" target="_blank">Como chegar</a></li>`).join('')}
document.getElementById('search').oninput=render;
function go(v){document.querySelector(`.tab[data-view=${v}]`).click()}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
const DICAS=['Separe papel, plástico, vidro e metal antes de descartar.','Lave as embalagens antes de reciclar.','Óleo de cozinha usado vai em garrafa PET, nunca na pia.','Amasse latas e garrafas para ocupar menos espaço.','Entulho de pequenas obras pode ir ao ecoponto.','Pilhas e baterias têm pontos de coleta próprios.'];
document.getElementById('dica-btn').onclick=()=>{document.getElementById('dica-js').textContent=DICAS[Math.floor(Math.random()*DICAS.length)]};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab,.view').forEach(e=>e.classList.remove('active'));
 t.classList.add('active');document.getElementById(t.dataset.view+'-view').classList.add('active');if(t.dataset.view==='map')map.invalidateSize()});
document.getElementById('locate').onclick=()=>{if(!navigator.geolocation)return alert('Localização indisponível');
 navigator.geolocation.getCurrentPosition(pos=>{userPos={lat:pos.coords.latitude,lng:pos.coords.longitude};
  L.circleMarker([userPos.lat,userPos.lng],{radius:8,color:'#1565c0'}).addTo(map).bindPopup('Você está aqui');
  const n=ECOPONTOS.reduce((a,b)=>dist(userPos,a)<dist(userPos,b)?a:b);map.setView([n.lat,n.lng],15);n.marker.openPopup();render()},
  ()=>alert('Não foi possível obter sua localização'))};
document.getElementById("count").textContent=ECOPONTOS.length;
render();
