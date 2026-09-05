// H10.6.23 — Monster Hunt embedded Mixer D100 table.
// Self-contained canvas renderer: true kite-face D10 geometry, browser-side roll,
// containment, overhead result view, and authoritative percentile result returned
// to the Monster Hunt Activity.

const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=(a,b)=>a+Math.random()*(b-a);
const V=(x=0,y=0,z=0)=>({x,y,z});
const add=(a,b)=>V(a.x+b.x,a.y+b.y,a.z+b.z);
const sub=(a,b)=>V(a.x-b.x,a.y-b.y,a.z-b.z);
const mul=(a,s)=>V(a.x*s,a.y*s,a.z*s);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>V(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const len=a=>Math.hypot(a.x,a.y,a.z);
const norm=a=>{const l=len(a)||1;return mul(a,1/l)};
const qNorm=q=>{const l=Math.hypot(q.x,q.y,q.z,q.w)||1;return {x:q.x/l,y:q.y/l,z:q.z/l,w:q.w/l}};
const qMul=(a,b)=>({
  w:a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z,
  x:a.w*b.x+a.x*b.w+a.y*b.z-a.z*b.y,
  y:a.w*b.y-a.x*b.z+a.y*b.w+a.z*b.x,
  z:a.w*b.z+a.x*b.y-a.y*b.x+a.z*b.w
});
const qAxis=(axis,angle)=>{const n=norm(axis),s=Math.sin(angle/2);return qNorm({x:n.x*s,y:n.y*s,z:n.z*s,w:Math.cos(angle/2)})};
const qRotate=(q,v)=>{
  const u=V(q.x,q.y,q.z),s=q.w;
  return add(add(mul(u,2*dot(u,v)),mul(v,s*s-dot(u,u))),mul(cross(u,v),2*s));
};
function qFromUnitVectors(a,b){
  const v1=norm(a),v2=norm(b);let r=dot(v1,v2)+1;
  if(r<1e-6){const axis=Math.abs(v1.x)>.9?V(0,1,0):V(1,0,0);const c=norm(cross(v1,axis));return {x:c.x,y:c.y,z:c.z,w:0};}
  const c=cross(v1,v2);return qNorm({x:c.x,y:c.y,z:c.z,w:r});
}
function qSlerp(a,b,t){
  let cos=a.x*b.x+a.y*b.y+a.z*b.z+a.w*b.w,bb=b;
  if(cos<0){cos=-cos;bb={x:-b.x,y:-b.y,z:-b.z,w:-b.w};}
  if(cos>.9995)return qNorm({x:a.x+(bb.x-a.x)*t,y:a.y+(bb.y-a.y)*t,z:a.z+(bb.z-a.z)*t,w:a.w+(bb.w-a.w)*t});
  const th=Math.acos(clamp(cos,-1,1)),sin=Math.sin(th);const s0=Math.sin((1-t)*th)/sin,s1=Math.sin(t*th)/sin;
  return {x:a.x*s0+bb.x*s1,y:a.y*s0+bb.y*s1,z:a.z*s0+bb.z*s1,w:a.w*s0+bb.w*s1};
}
function randomQuat(){return qNorm(qMul(qMul(qAxis(V(1,0,0),rnd(0,TAU)),qAxis(V(0,1,0),rnd(0,TAU))),qAxis(V(0,0,1),rnd(0,TAU))));}

function makeD10Geometry(scale=1){
  const waistY=.16,poleY=waistY*(5+2*Math.sqrt(5)),ringRadius=1,verts=[];
  for(let i=0;i<5;i++){const a=TAU*i/5;verts.push(V(ringRadius*Math.cos(a)*1.05,waistY,ringRadius*Math.sin(a)*1.05));}
  for(let i=0;i<5;i++){const a=TAU*i/5+Math.PI/5;verts.push(V(ringRadius*Math.cos(a)*1.05,-waistY,ringRadius*Math.sin(a)*1.05));}
  verts.push(V(0,poleY,0),V(0,-poleY,0));
  const faces=[];for(let i=0;i<5;i++){const next=(i+1)%5;faces.push([10,i,5+i,next]);faces.push([11,5+i,next,5+next]);}
  const center=verts.reduce((a,v)=>add(a,v),V());const c=mul(center,1/verts.length);
  const oriented=faces.map(face=>{
    let f=[...face];const a=verts[f[0]],b=verts[f[1]],d=verts[f[2]];let n=cross(sub(b,a),sub(d,a));const fc=f.reduce((s,i)=>add(s,verts[i]),V());const faceCenter=mul(fc,1/f.length);
    if(dot(n,sub(faceCenter,c))<0)f=f.reverse();return f;
  });
  const normals=oriented.map(f=>norm(cross(sub(verts[f[1]],verts[f[0]]),sub(verts[f[2]],verts[f[0]]))));
  const centers=oriented.map(f=>mul(f.reduce((s,i)=>add(s,verts[i]),V()),1/f.length));
  return {verts:verts.map(v=>mul(v,scale)),faces:oriented,normals,centers:centers.map(v=>mul(v,scale))};
}
const GEO=makeD10Geometry(.88);

function createOverlay(){
  const root=document.createElement('div');root.id='mh-d100-overlay';
  root.innerHTML=`<style>
  #mh-d100-overlay{position:fixed;inset:0;z-index:2147483000;background:#05070c;display:flex;flex-direction:column;color:#f5f7ff;font-family:Inter,system-ui,sans-serif;animation:mhDiceIn .18s ease-out;overflow:hidden}
  #mh-d100-overlay .mh-dice-bg{position:absolute;inset:0;background:linear-gradient(rgba(3,7,18,.18),rgba(3,7,18,.28)),url('/.proxy/assets/dice/dice-table-background.png') center/cover no-repeat;filter:saturate(.92) brightness(.78)}
  #mh-d100-overlay .mh-dice-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:18px 24px;background:linear-gradient(180deg,rgba(2,5,12,.82),rgba(2,5,12,0));pointer-events:none}
  #mh-d100-overlay .eyebrow{font-size:11px;letter-spacing:.22em;color:#a8c7f2;font-weight:800}.mh-dice-top h2{margin:3px 0 0;font-size:26px}.mh-dice-badge{border:1px solid rgba(166,203,255,.35);background:rgba(8,24,50,.72);padding:8px 12px;border-radius:999px;font-weight:900;letter-spacing:.08em}
  #mh-d100-overlay canvas{position:absolute;inset:0;width:100%;height:100%;z-index:1}
  #mh-d100-overlay .mh-dice-result{position:absolute;z-index:3;left:50%;top:15%;transform:translateX(-50%);min-width:min(360px,86vw);text-align:center;background:rgba(4,10,24,.80);border:1px solid rgba(157,197,255,.28);border-radius:20px;padding:14px 24px;box-shadow:0 20px 70px rgba(0,0,0,.35);backdrop-filter:blur(10px)}
  #mh-d100-overlay .mh-dice-label{font-size:11px;letter-spacing:.18em;color:#a9c8f7;font-weight:900}.mh-dice-number{font-size:64px;line-height:.98;font-weight:950;margin:5px 0}.mh-dice-sub{font-size:14px;color:#d9e6ff;min-height:20px}.mh-dice-chance{font-size:12px;color:#aab8d2;margin-top:4px}
  #mh-d100-overlay .mh-dice-footer{position:absolute;z-index:3;bottom:18px;left:50%;transform:translateX(-50%);font-size:12px;color:#c7d6ef;background:rgba(3,8,18,.72);padding:8px 14px;border-radius:999px;white-space:nowrap}
  @keyframes mhDiceIn{from{opacity:0;transform:scale(1.015)}to{opacity:1;transform:none}}@keyframes mhDiceOut{to{opacity:0;transform:scale(.99)}}
  </style><div class="mh-dice-bg"></div><div class="mh-dice-top"><div><div class="eyebrow">MONSTER HUNT • MIXER DICE</div><h2>Physical D100 Capture Roll</h2></div><div class="mh-dice-badge" id="mh-dice-state">ROLLING</div></div><canvas></canvas><div class="mh-dice-result"><div class="mh-dice-label">D100 RESULT</div><div class="mh-dice-number" id="mh-dice-number">…</div><div class="mh-dice-sub" id="mh-dice-sub">The percentile dice are in motion.</div><div class="mh-dice-chance" id="mh-dice-chance"></div></div><div class="mh-dice-footer">00–90 percentile die + 0–9 ones die • 00 + 0 = 100</div>`;
  document.body.appendChild(root);return root;
}

function makeDie(x,values){
  return {pos:V(x,4.3,rnd(-.6,.6)),vel:V(x<0?rnd(4.4,6.4):rnd(-6.4,-4.4),rnd(1.2,2.5),rnd(-2.6,2.6)),q:randomQuat(),ang:V(rnd(-9,9),rnd(-12,12),rnd(-9,9)),values,topIndex:0,targetQ:null};
}
function updateDie(d,dt,elapsed){
  if(elapsed<2200){
    d.vel.y-=10.8*dt;d.pos=add(d.pos,mul(d.vel,dt));
    if(d.pos.y<1.05){d.pos.y=1.05;d.vel.y=Math.abs(d.vel.y)*.46;d.vel.x*=.86;d.vel.z*=.86;d.ang=mul(d.ang,.84);}
    const BX=4.3,BZ=2.8;if(Math.abs(d.pos.x)>BX){d.pos.x=clamp(d.pos.x,-BX,BX);d.vel.x*=-.62;d.ang.y*=-.8;}if(Math.abs(d.pos.z)>BZ){d.pos.z=clamp(d.pos.z,-BZ,BZ);d.vel.z*=-.62;}
    const a=len(d.ang);if(a>.001)d.q=qNorm(qMul(qAxis(d.ang,a*dt),d.q));d.ang=mul(d.ang,Math.pow(.992,dt*60));
  }else if(!d.targetQ){
    let best=-Infinity,idx=0;GEO.normals.forEach((n,i)=>{const score=dot(qRotate(d.q,n),V(0,1,0));if(score>best){best=score;idx=i;}});d.topIndex=idx;const worldN=qRotate(d.q,GEO.normals[idx]);d.targetQ=qNorm(qMul(qFromUnitVectors(worldN,V(0,1,0)),d.q));d.pos.y=1.05;d.vel=V();
  }else{
    d.q=qSlerp(d.q,d.targetQ,1-Math.pow(.0009,dt));d.pos.y+=(1.05-d.pos.y)*(1-Math.pow(.001,dt));
  }
}
function project(p,w,h,camBlend){
  const scale=Math.min(w/10.6,h/7.8);const cx=w/2,cy=h*.60;
  const obliqueY=(-p.y*.52+p.z*.64),topY=p.z*.92;
  return {x:cx+p.x*scale,y:cy+(obliqueY*(1-camBlend)+topY*camBlend)*scale,depth:p.z*.65-p.y*.15};
}
function renderDie(ctx,d,w,h,camBlend){
  const worldVerts=GEO.verts.map(v=>add(qRotate(d.q,v),d.pos));
  const worldNormals=GEO.normals.map(n=>qRotate(d.q,n));
  const faces=GEO.faces.map((f,i)=>({f,i,depth:f.reduce((s,vi)=>s+project(worldVerts[vi],w,h,camBlend).depth,0)/f.length})).sort((a,b)=>a.depth-b.depth);
  for(const row of faces){
    const n=worldNormals[row.i];if(n.y<-.45 && camBlend>.7)continue;
    const pts=row.f.map(vi=>project(worldVerts[vi],w,h,camBlend));
    const light=clamp(.38+n.y*.34+n.z*.10,.18,.86);const blue=Math.round(105+light*100);ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();ctx.fillStyle=`rgba(${Math.round(15+light*18)},${Math.round(48+light*42)},${blue},.96)`;ctx.fill();ctx.strokeStyle='rgba(186,216,255,.58)';ctx.lineWidth=1.5;ctx.stroke();
    if(n.y>.05 || camBlend<.65){const c=project(add(qRotate(d.q,GEO.centers[row.i]),d.pos),w,h,camBlend);ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle='#f7fbff';ctx.strokeStyle='rgba(0,0,0,.78)';ctx.lineWidth=5;const val=String(d.values[row.i]);ctx.font=`900 ${val.length>1?22:26}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.strokeText(val,0,0);ctx.fillText(val,0,0);ctx.restore();}
  }
}
function resultFor(dice){
  const tens=dice[0].values[dice[0].topIndex],ones=Number(dice[1].values[dice[1].topIndex]);const tensBase=tens==='00'?0:Number(tens);const result=(tens==='00'&&ones===0)?100:tensBase+ones;return {result,tens:String(tens).padStart(2,'0'),ones};
}

export async function rollD100({chance=null,reason='Capture Roll'}={}){
  document.getElementById('mh-d100-overlay')?.remove();const root=createOverlay(),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),numberEl=root.querySelector('#mh-dice-number'),subEl=root.querySelector('#mh-dice-sub'),stateEl=root.querySelector('#mh-dice-state'),chanceEl=root.querySelector('#mh-dice-chance');
  if(chance!=null)chanceEl.textContent=`Catch chance: ${Number(chance)}% • Need ${Number(chance)} or lower (100 is Critical Catch)`;
  const dice=[makeDie(-2.8,['00',10,20,30,40,50,60,70,80,90]),makeDie(2.8,[0,1,2,3,4,5,6,7,8,9])];let raf,start=performance.now(),last=start,done=false;
  return await new Promise(resolve=>{
    function frame(now){const dt=Math.min(.035,(now-last)/1000||.016);last=now;const elapsed=now-start;const dpr=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();const W=Math.max(1,Math.floor(rect.width*dpr)),H=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);dice.forEach(d=>updateDie(d,dt,elapsed));const camBlend=clamp((elapsed-2050)/700,0,1);renderDie(ctx,dice[0],rect.width,rect.height,camBlend);renderDie(ctx,dice[1],rect.width,rect.height,camBlend);
      if(elapsed>2850&&!done){done=true;const r=resultFor(dice);numberEl.textContent=r.result;subEl.textContent=`${r.tens} + ${r.ones} = ${r.result} • ${reason}`;stateEl.textContent='RESULT';stateEl.style.background='rgba(18,70,45,.82)';setTimeout(()=>{root.style.animation='mhDiceOut .22s ease-in forwards';setTimeout(()=>{cancelAnimationFrame(raf);root.remove();resolve(r);},230);},1250);}
      if(!done||elapsed<4500)raf=requestAnimationFrame(frame);
    }raf=requestAnimationFrame(frame);
  });
}

window.MonsterHuntDice={rollD100};
