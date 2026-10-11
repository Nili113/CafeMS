/* ---------- Food illustrations (original flat drawings, 96x96) ---------- */
const STEAM='<path d="M41 24c-4-5 4-7 0-12M53 24c-4-5 4-7 0-12" fill="none" stroke="#B7A58E" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>';
const plate=(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#E3DCCF" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="${r-7}" fill="none" stroke="#EFE8DA"/>`;
const cup=(foam,cof)=>`<ellipse cx="48" cy="72" rx="30" ry="6" fill="#fff" stroke="#E3DCCF"/><path d="M68 46h3a6.5 6.5 0 0 1 0 13h-5" fill="none" stroke="#fff" stroke-width="5"/><path d="M22 40h46v10a23 23 0 0 1-23 23 23 23 0 0 1-23-23z" fill="#fff" stroke="#E3DCCF"/><ellipse cx="45" cy="40" rx="23" ry="5.5" fill="${cof}"/><ellipse cx="45" cy="39.5" rx="17" ry="3.8" fill="${foam}"/>${STEAM}`;
const glass=(fill,top)=>`<path d="M32 28h32l-3 40a6 6 0 0 1-6 5H41a6 6 0 0 1-6-5z" fill="#FFFDF8" stroke="#E3DCCF"/><path d="M33.4 ${top}h29.2l-2 ${68-top}a5 5 0 0 1-5 4.2H40.6a5 5 0 0 1-5-4.2z" fill="${fill}"/><ellipse cx="48" cy="76" rx="22" ry="4" fill="#fff" stroke="#E3DCCF"/>`;
const momo=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-12 5C-12-9 12-9 12 5C7 11-7 11-12 5z" fill="#FFF7E8" stroke="#E5D0AA"/><path d="M-6-3v7M0-5v9M6-3v7" stroke="#E5D0AA" stroke-width="1.2" stroke-linecap="round"/></g>`;
const A={
 pour:()=>`<rect x="22" y="74" width="52" height="5" rx="2.5" fill="#7A5638"/><path d="M33 54h30l2 17a4 4 0 0 1-4 4H35a4 4 0 0 1-4-4z" fill="#C9E4EA" stroke="#8FBECB"/><path d="M32.4 62h31.2l1.4 9a3 3 0 0 1-3 4H34a3 3 0 0 1-3-4z" fill="#5A3A22"/><path d="M26 28h44L58 50H38z" fill="#F4EEE3" stroke="#D5C8B3"/><rect x="40" y="50" width="16" height="4" rx="1" fill="#D5C8B3"/><circle cx="48" cy="58" r="1.8" fill="#5A3A22"/>`,
 cappu:()=>cup('#F4E6D3','#B9825A'),
 latte:()=>cup('#E8C79A','#C9935F')+'<circle cx="44" cy="39.5" r="2.4" fill="#C9935F"/>',
 iced:()=>`<path d="M32 26h32l-4 46H36z" fill="#EAF3F6" stroke="#BCD3DA"/><path d="M34 38h28l-3 34H37z" fill="#4A2E1B"/><rect x="38" y="40" width="10" height="10" rx="2" fill="#fff" opacity=".5" transform="rotate(12 43 45)"/><rect x="50" y="48" width="9" height="9" rx="2" fill="#fff" opacity=".45" transform="rotate(-10 54 52)"/><path d="M56 12l-5 40" stroke="#E9A23B" stroke-width="3.2" stroke-linecap="round"/>`,
 teapot:()=>`<path d="M23 50h-4a8 8 0 0 0 0 16h6" fill="none" stroke="#2F6B52" stroke-width="4.5"/><path d="M68 52l13-12" stroke="#2F6B52" stroke-width="6" stroke-linecap="round"/><ellipse cx="46" cy="58" rx="24" ry="19" fill="#2F6B52"/><ellipse cx="46" cy="40" rx="13" ry="4.5" fill="#245442"/><circle cx="46" cy="35" r="3.4" fill="#E9A23B"/><path d="M30 56c6 4 26 4 32 0" fill="none" stroke="#E9A23B" stroke-width="2" stroke-linecap="round"/>`,
 chiya:()=>glass('#C98A4B',40)+STEAM,
 lemon:()=>glass('#E8B13E',40)+'<circle cx="61" cy="32" r="10" fill="#F6DA4C" stroke="#E7C02D" stroke-width="1.5"/><path d="M61 24v16M53 32h16M55.5 26.5l11 11M66.5 26.5l-11 11" stroke="#FBEFA0" stroke-width="1.2"/>',
 breadegg:()=>plate(48,52,34)+'<circle cx="41" cy="50" r="21" fill="#E3A546"/><circle cx="34" cy="44" r="3" fill="#C98A3F"/><circle cx="46" cy="56" r="3.4" fill="#C98A3F"/><circle cx="40" cy="62" r="2.4" fill="#C98A3F"/><path d="M54 42c9-5 21 2 19 12s-15 13-21 6-5-14 2-18z" fill="#fff"/><circle cx="62" cy="52" r="6" fill="#F4B63B"/>',
 sandwich:()=>`<rect x="20" y="28" width="56" height="13" rx="6.5" fill="#E3B26B"/><path d="M18 44q7 6 13 0t13 0 13 0 13 0 6 0v6H18z" fill="#7DB65A"/><rect x="20" y="50" width="56" height="7" rx="3.5" fill="#E4573D"/><rect x="20" y="57" width="56" height="5" fill="#F3C84B"/><rect x="20" y="62" width="56" height="13" rx="6.5" fill="#E3B26B"/><path d="M48 14v30" stroke="#C99A5B" stroke-width="2.4" stroke-linecap="round"/><circle cx="48" cy="14" r="3" fill="#D9432B"/>`,
 paratha:()=>plate(48,52,35)+'<circle cx="48" cy="52" r="26" fill="#E8B766"/><circle cx="38" cy="44" r="4" fill="#C98A3F" opacity=".8"/><circle cx="56" cy="40" r="3" fill="#C98A3F" opacity=".8"/><circle cx="58" cy="60" r="4.5" fill="#C98A3F" opacity=".8"/><circle cx="38" cy="62" r="3" fill="#C98A3F" opacity=".8"/><rect x="42" y="46" width="14" height="10" rx="2" fill="#FFF1A8" transform="rotate(-12 49 51)"/>',
 momo:()=>plate(48,50,36)+momo(36,40,-20)+momo(60,38,15)+momo(30,58,10)+momo(52,56,-8)+momo(70,58,25)+'<circle cx="48" cy="72" r="0" fill="none"/><circle cx="46" cy="75" r="0"/>'+'<ellipse cx="76" cy="26" rx="8" ry="5" fill="#D9432B"/>',
 jhol:()=>`<ellipse cx="48" cy="46" rx="33" ry="9" fill="#E8A24A"/><circle cx="36" cy="44" r="8" fill="#FFF7E8" stroke="#E5D0AA"/><circle cx="52" cy="42" r="8" fill="#FFF7E8" stroke="#E5D0AA"/><circle cx="64" cy="47" r="7" fill="#FFF7E8" stroke="#E5D0AA"/><path d="M15 46a33 9 0 0 0 66 0 33 30 0 0 1-66 0z" fill="#fff" stroke="#E3DCCF"/><path d="M32 52a16 8 0 0 0 32 0" fill="none" stroke="#EFE8DA"/><circle cx="46" cy="40" r="1.6" fill="#6E9A3C"/><circle cx="58" cy="44" r="1.6" fill="#6E9A3C"/>`+STEAM,
 sekuwa:()=>[0,1].map(i=>`<g transform="rotate(${i?-28:-28} 48 48) translate(0 ${i?10:-10})"><line x1="8" y1="48" x2="90" y2="48" stroke="#C99A5B" stroke-width="2.4" stroke-linecap="round"/>${[22,36,50,64].map((x,j)=>`<rect x="${x-7}" y="40" width="15" height="16" rx="5" fill="${j%2?'#8F3F20':'#B5542B'}"/>`).join('')}<circle cx="29" cy="48" r="1.4" fill="#3A1B0E"/><circle cx="57" cy="48" r="1.4" fill="#3A1B0E"/></g>`).join('')+'<circle cx="74" cy="76" r="8" fill="#9B5BB5" opacity=".75"/>',
 fries:()=>`<g>${[30,35,40,45,50,55,60,65].map((x,i)=>`<rect x="${x}" y="${22+(i%3)*6}" width="6" height="40" rx="2" fill="#F2C94C" transform="rotate(${(i-3.5)*3} ${x+3} 60)"/>`).join('')}</g><path d="M26 52h44l-5 28a3 3 0 0 1-3 2H34a3 3 0 0 1-3-2z" fill="#D9432B"/><rect x="38" y="62" width="20" height="8" rx="4" fill="#fff" opacity=".85"/>`,
 sel:()=>'<circle cx="38" cy="46" r="17" fill="none" stroke="#D98F3A" stroke-width="10"/><circle cx="54" cy="52" r="17" fill="none" stroke="#C97F2E" stroke-width="10" opacity=".95"/><circle cx="70" cy="74" r="12" fill="#fff" stroke="#E3DCCF"/><circle cx="70" cy="74" r="8" fill="#F6EBD0"/><circle cx="68" cy="72" r="1.5" fill="#B88A45"/><circle cx="72" cy="76" r="1.5" fill="#B88A45"/>',
 brownie:()=>plate(48,52,35)+'<rect x="22" y="40" width="34" height="30" rx="5" fill="#4A2A1C" transform="rotate(-8 39 55)"/><rect x="25" y="42" width="28" height="7" rx="3" fill="#6B3E27" transform="rotate(-8 39 45)"/><circle cx="32" cy="46" r="4" fill="#C8A06B"/><circle cx="46" cy="42" r="3.4" fill="#C8A06B"/><circle cx="62" cy="52" r="12" fill="#FBF4E6" stroke="#EADFC8"/><circle cx="62" cy="40" r="3.4" fill="#D9432B"/>',
 lassi:()=>glass('#FFF6E4',36)+'<circle cx="42" cy="38" r="2" fill="#8DBB5E"/><circle cx="50" cy="40" r="2" fill="#8DBB5E"/><circle cx="56" cy="37" r="2" fill="#8DBB5E"/><path d="M58 10l-6 34" stroke="#E56E98" stroke-width="3.2" stroke-linecap="round"/>'
};
const CATBG={'Coffee':'#F0DFCB','Tea':'#DCEBD9','Breakfast':'#FBE6B4','Momo and snacks':'#F7D8CD','Desserts':'#F5DCE3'};
const art=m=>`<svg viewBox="0 0 96 96" role="img" aria-label="${m.name}" preserveAspectRatio="xMidYMid slice"><rect width="96" height="96" fill="${CATBG[m.cat]}"/>${A[m.art]()}</svg>`;

/* ---------- Data ---------- */
const O_COFFEE=[['Extra shot',40],['Oat milk',50],['Less sugar',0]];
const O_TEA=[['Less sugar',0],['Extra ginger',0],['Pot for two',80]];
const O_FOOD=[['Make it spicy',0],['Extra achar',20]];
const MENU=[
 {id:'c1',cat:'Coffee',art:'pour',name:'Ilam pour-over',desc:'Single-origin beans, brewed by hand at the table.',price:220,veg:1,prep:8,spice:0,badge:'Chef pick',al:[],opts:O_COFFEE},
 {id:'c2',cat:'Coffee',art:'cappu',name:'Cappuccino',desc:'Double shot under silky steamed milk.',price:190,veg:1,prep:5,spice:0,badge:'Bestseller',al:['Dairy'],opts:O_COFFEE},
 {id:'c3',cat:'Coffee',art:'iced',name:'Iced americano',desc:'Two shots over ice, no sugar.',price:170,veg:1,prep:4,spice:0,al:[],opts:O_COFFEE},
 {id:'c4',cat:'Coffee',art:'latte',name:'Masala latte',desc:'Espresso with cardamom, clove and ginger.',price:210,veg:1,prep:6,spice:1,badge:'New',al:['Dairy'],opts:O_COFFEE},
 {id:'t1',cat:'Tea',art:'teapot',name:'Ilam orthodox tea',desc:'First-flush leaves from the hills, served by the pot.',price:250,veg:1,prep:7,spice:0,al:[],opts:O_TEA},
 {id:'t2',cat:'Tea',art:'chiya',name:'Masala chiya',desc:'Milk tea with cardamom and fresh ginger.',price:90,veg:1,prep:4,spice:1,badge:'Bestseller',al:['Dairy'],opts:O_TEA},
 {id:'t3',cat:'Tea',art:'lemon',name:'Lemon honey ginger',desc:'Hot and bright, no milk.',price:140,veg:1,prep:4,spice:1,al:[],opts:O_TEA},
 {id:'b1',cat:'Breakfast',art:'breadegg',name:'Tibetan bread and egg',desc:'Fried bread with a masala omelette.',price:260,veg:0,prep:12,spice:1,al:['Egg','Gluten'],opts:O_FOOD},
 {id:'b2',cat:'Breakfast',art:'sandwich',name:'Veg sandwich',desc:'Grilled, with cheese and mint chutney.',price:240,veg:1,prep:10,spice:0,al:['Gluten','Dairy'],opts:O_FOOD},
 {id:'b3',cat:'Breakfast',art:'paratha',name:'Aloo paratha',desc:'Stuffed flatbread with curd and pickle.',price:200,veg:1,prep:12,spice:1,al:['Gluten','Dairy'],opts:O_FOOD},
 {id:'m1',cat:'Momo and snacks',art:'momo',name:'Chicken steam momo',desc:'Ten pieces with roasted tomato achar.',price:320,veg:0,prep:15,spice:1,badge:'Bestseller',al:['Gluten'],opts:O_FOOD},
 {id:'m2',cat:'Momo and snacks',art:'jhol',name:'Veg jhol momo',desc:'Ten pieces in warm sesame soup.',price:280,veg:1,prep:15,spice:2,badge:'Chef pick',al:['Gluten','Sesame'],opts:O_FOOD},
 {id:'m3',cat:'Momo and snacks',art:'sekuwa',name:'Chicken sekuwa',desc:'Charcoal skewers, six pieces.',price:380,veg:0,prep:20,spice:2,al:[],opts:O_FOOD},
 {id:'m4',cat:'Momo and snacks',art:'fries',name:'Masala fries',desc:'Hot and crisp, tossed in timur salt.',price:180,veg:1,prep:8,spice:1,al:[],opts:O_FOOD},
 {id:'d1',cat:'Desserts',art:'sel',name:'Sel roti and kheer',desc:'Two rings with warm rice pudding.',price:160,veg:1,prep:6,spice:0,al:['Dairy','Nuts'],opts:[]},
 {id:'d2',cat:'Desserts',art:'brownie',name:'Walnut brownie',desc:'Served warm with a scoop of ice cream.',price:210,veg:1,prep:6,spice:0,al:['Gluten','Egg','Nuts','Dairy'],opts:[]},
 {id:'d3',cat:'Desserts',art:'lassi',name:'Sweet lassi',desc:'Thick curd drink with pistachio.',price:150,veg:1,prep:3,spice:0,al:['Dairy','Nuts'],opts:[]}
];
const CATS=[...new Set(MENU.map(m=>m.cat))];
const REASONS=['Ready to order','Water refill','Cutlery','Napkins','Help with my order','Something is wrong'];
const TAGS=['Fast service','Friendly staff','Great coffee','Good value','Too noisy','Slow food'];
/* Fonepay settings. Replace these with the details from your Fonepay merchant account.
   qrPayload() is the one place to plug in the QR string your Fonepay merchant API returns for each bill.
   If you only have a fixed shop QR image, put its path or data URL in staticQrImage instead. */
const FONEPAY={merchantName:'Chiya Ghar',merchantCode:'REPLACE_WITH_YOUR_MERCHANT_CODE',staticQrImage:''};
function qrPayload(amount,ref){
  return 'fonepay-demo://pay?merchant='+encodeURIComponent(FONEPAY.merchantCode)+'&table=7&amount='+amount+'&ref='+ref;
}
const FLOW=['new','preparing','ready','served'];
const ORDER_NEXT={new:'Start preparing',preparing:'Mark ready',ready:'Mark served'};
const ORDER_LABEL={new:'Received',preparing:'Preparing',ready:'Ready',served:'Served'};
const ICONS={
 menu:'<path d="M4 6h16M4 12h16M4 18h10"/>',
 waiter:'<path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17zM10 20h4"/>',
 bill:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6"/>',
 feedback:'<path d="M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z"/>'};
const TABLABEL={menu:'Menu',waiter:'Waiter',bill:'Pay',feedback:'Feedback'};
const STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>';
const CHECK='<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.6 2.6L10 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ago=m=>new Date(Date.now()-m*60000);
const S={
 started:false,guest:'',tab:'menu',cat:CATS[0],q:'',sheet:null,
 orders:[{id:'A-101',table:7,mine:true,name:'',lines:[{name:'Chicken steam momo',q:2,price:320,opts:[]},{name:'Masala chiya',q:2,price:90,opts:[]},{name:'Sweet lassi',q:1,price:150,opts:[]}],status:'served',t:ago(25),eta:15}],seq:102,
 calls:[],callSeq:1,
 reason:REASONS[0],
 payClaimed:false,paid:false,receipt:null,paidAt:null,
 fb:{food:0,service:0,ambience:0,tags:[]},feedbackList:[],
 sold:new Set(['m3'])
};

/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rs=n=>'Rs '+n.toLocaleString('en-IN');
const hm=d=>d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
const item=id=>MENU.find(m=>m.id===id);
const mineOrders=()=>S.orders.filter(o=>o.mine);
const mineCalls=()=>S.calls.filter(c=>c.mine);
function bill(){
  const sub=mineOrders().reduce((a,o)=>a+o.lines.reduce((x,l)=>x+l.price*l.q,0),0);
  const sc=Math.round(sub*0.10),vat=Math.round((sub+sc)*0.13);
  return{sub,sc,vat,total:sub+sc+vat};
}
const payRef=()=>'CG-T7-'+S.seq+'-'+bill().total;
let toastTimer;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('on'),2400)}
const peppers=n=>n?`<span title="Spice level">${'&#9679;'.repeat(n)}<span style="opacity:.3">${'&#9679;'.repeat(3-n)}</span> spice</span>`:'';

/* ---------- Renderers ---------- */
function renderTabs(){
  const badges={menu:0,waiter:mineCalls().filter(c=>c.status!=='done').length,bill:0,feedback:0};
  $('#tabs').innerHTML=Object.keys(TABLABEL).map(k=>`<button data-act="tab" data-tab="${k}" ${S.tab===k?'aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>${TABLABEL[k]}${badges[k]?`<span class="badge">${badges[k]}</span>`:''}</button>`).join('');
  for(const k in TABLABEL)$('#v-'+k).hidden=S.tab!==k;
  $('#splash').hidden=S.started;
}
function renderMenu(){
  const h=new Date().getHours();
  $('#hello').textContent=(h<12?'Good morning':h<17?'Good afternoon':'Good evening')+(S.guest?', '+S.guest:'');
  const q=S.q.trim().toLowerCase();
  $('#popWrap').hidden=!!q;
  $('#popular').innerHTML=MENU.filter(m=>m.badge==='Bestseller'||m.badge==='Chef pick').map(m=>`<button class="pop" data-act="open" data-id="${m.id}"><div class="tile">${art(m)}${m.badge?`<span class="tag">${m.badge}</span>`:''}</div><b>${m.name}</b><span class="mono" style="font-size:12px;color:var(--muted)">${rs(m.price)}</span></button>`).join('');
  $('#cats').innerHTML=CATS.map(c=>`<button class="chipbtn" data-act="cat" data-cat="${c}" aria-pressed="${!q&&S.cat===c}">${c}</button>`).join('');
  const items=q?MENU.filter(m=>(m.name+' '+m.desc).toLowerCase().includes(q)):MENU.filter(m=>m.cat===S.cat);
  $('#menuList').innerHTML=items.length?items.map(m=>{
    const sold=S.sold.has(m.id);
    return `<div class="dish ${sold?'sold':''}"><button class="imgbtn" data-act="open" data-id="${m.id}" aria-label="Details for ${esc(m.name)}"><div class="tile">${art(m)}${m.badge&&!sold?`<span class="tag">${m.badge}</span>`:''}</div></button><div class="info"><button class="nmbtn" data-act="open" data-id="${m.id}"><i class="vd ${m.veg?'v':'n'}" title="${m.veg?'Vegetarian':'Contains meat or egg'}"></i>${m.name}</button><div class="ds">${m.desc}</div><div class="meta"><span class="pr">${rs(m.price)}</span><span>${m.prep} min</span>${peppers(m.spice)}${sold?'<span class="soldpill">Sold out</span>':''}</div></div></div>`;
  }).join(''):`<div class="empty">No dish matches &ldquo;${esc(S.q)}&rdquo;.<br>Try another word.</div>`;
  const os=mineOrders();
  $('#orderStrip').innerHTML=os.map(o=>{
    const i=FLOW.indexOf(o.status);
    return `<div class="ocard"><div class="h"><b class="mono">${o.id}</b><span class="pill ${o.status==='served'?'good':o.status==='ready'?'warn':''}">${ORDER_LABEL[o.status]}${i<2?' &middot; about '+o.eta+' min':''}</span></div><div class="l">${o.lines.map(l=>l.q+'&times; '+esc(l.name)).join(', ')}</div><div class="prog">${FLOW.map((f,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}</div><div class="progl"><span>Received</span><span>Preparing</span><span>Ready</span><span>Served</span></div></div>`;
  }).join('');
}
function renderSheet(){
  const sh=S.sheet;$('#sheet').hidden=$('#scrim').hidden=!sh;
  if(!sh)return;
  const m=item(sh.id),sold=S.sold.has(m.id);
  $('#shArt').innerHTML=art(m)+(m.badge?`<span class="tag">${m.badge}</span>`:'');
  $('#shName').innerHTML=`<i class="vd ${m.veg?'v':'n'}" style="margin-right:8px;vertical-align:2px"></i>${m.name}`;
  $('#shDesc').textContent=m.desc;
  $('#shFacts').innerHTML=`<span class="pill">${m.prep} min</span>${m.spice?`<span class="pill">${['Mild','Medium','Hot'][m.spice-1]} spice</span>`:''}${sold?'<span class="pill bad">Sold out</span>':''}${m.al.map(a=>`<span class="pill warn">${a}</span>`).join('')}${m.al.length?'':'<span class="pill good">No common allergens</span>'}`;
  $('#shOptsWrap').hidden=!m.opts.length;
  $('#shOpts').innerHTML=m.opts.map(o=>`<div class="addons"><span>${o[0]}</span><span class="mono">${o[1]?'+'+rs(o[1]):'Free'}</span></div>`).join('');
  $('#shPrice').textContent=rs(m.price);
}
function renderWaiter(){
  $('#reasons').innerHTML=REASONS.map(r=>`<button class="chipbtn" data-act="reason" data-r="${r}" aria-pressed="${S.reason===r}">${r}</button>`).join('');
  const active=mineCalls().some(c=>c.reason===S.reason&&c.status!=='done');
  const b=$('#callBtn');b.disabled=active;b.textContent=active?'Already requested':'Call waiter';
  const cs=mineCalls().slice().reverse();
  $('#myCalls').innerHTML=cs.length?cs.map(c=>{
    const st=c.status==='waiting'?['Waiting','warn']:c.status==='coming'?['Sita is on the way','good']:['Done',''];
    return `<div class="status"><span>${esc(c.reason)}<br><small class="mono" style="color:var(--muted)">${hm(c.t)}</small></span><span style="display:flex;gap:8px;align-items:center"><span class="pill ${st[1]}">${st[0]}</span>${c.status==='waiting'&&!c.bill?`<button class="btn ghost small" data-act="cancelcall" data-id="${c.id}">Cancel</button>`:''}</span></div>`;
  }).join(''):`<div class="sub" style="margin:6px 0 0">Nothing requested yet.</div>`;
}
function drawQr(){
  const box=$('#qrBox');if(!box)return;
  const b=bill();
  if(FONEPAY.staticQrImage){box.innerHTML='<img src="'+esc(FONEPAY.staticQrImage)+'" alt="Fonepay QR for '+esc(FONEPAY.merchantName)+'">';return}
  box.innerHTML='';
  if(typeof QRCode==='undefined'){box.innerHTML='<div class="ds" style="line-height:1.4;width:200px;padding:20px 0">The QR code needs an internet connection to draw.</div>';return}
  new QRCode(box,{text:qrPayload(b.total,payRef()),width:200,height:200,colorDark:'#111111',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
}
function renderBill(){
  const os=mineOrders(),el=$('#billBody');
  if(!os.length){el.innerHTML=`<div class="empty">Nothing to pay yet.<br>Once your order is placed, the QR code appears here.<br><br><button class="btn small" data-act="tab" data-tab="menu">Browse the menu</button></div>`;return}
  const b=bill();
  const lines=os.map(o=>o.lines.map(l=>`<div class="tot"><span>${l.q}&times; ${esc(l.name)}</span><span>${rs(l.price*l.q)}</span></div>`).join('')).join('');
  const summary=`<div class="card">${lines}<div class="tot mut"><span>Subtotal</span><span>${rs(b.sub)}</span></div><div class="tot mut"><span>Service charge 10%</span><span>${rs(b.sc)}</span></div><div class="tot mut"><span>VAT 13%</span><span>${rs(b.vat)}</span></div><div class="tot grand"><span>Total</span><span>${rs(b.total)}</span></div></div>`;
  if(S.paid){
    el.innerHTML=`<div class="paid"><b>Payment received. Thank you${S.guest?', '+esc(S.guest):''}.</b><br><span class="mono">Fonepay QR</span></div><div class="receipt">RECEIPT ${S.receipt}<br>${esc(FONEPAY.merchantName)} &middot; Table 7<br>${S.paidAt.toLocaleDateString([],{day:'numeric',month:'short',year:'numeric'})} ${hm(S.paidAt)}<br>Paid ${rs(b.total)}</div>`+summary+`<button class="btn block" data-act="tab" data-tab="feedback">Leave feedback</button>`;
    return;
  }
  if(S.payClaimed){
    el.innerHTML=`<div class="paid" style="background:var(--warnbg);color:var(--warn)"><b>Waiting for the cafe to confirm.</b><br>We are checking Fonepay for your payment of ${rs(b.total)}. This usually takes a moment.</div><div class="demonote" style="margin:0 0 12px">Demo only. In the live app, Fonepay confirms the payment to the cafe.</div>`+summary+`<button class="btn ghost block" data-act="unclaim">Show the QR code again</button>`;
    return;
  }
  el.innerHTML=summary+`<div class="qrcard"><div class="qrtop"><b>Fonepay QR</b><span class="pill">${esc(FONEPAY.merchantName)}</span></div><div class="qrframe" id="qrBox"></div><div class="qramt mono">${rs(b.total)}</div><div class="qrref"><span>Ref ${payRef()}</span><button class="btn ghost small" data-act="copyref">Copy</button></div><div class="demonote">Demo QR. It is not linked to a real Fonepay account yet, so a banking app will not complete a payment from it. Add your merchant details in the code to make it live.</div></div>`
  +`<ol class="steps"><li>Open your Fonepay-enabled banking or wallet app.</li><li>Scan the QR code above.</li><li>Check that the amount is ${rs(b.total)}, then confirm.</li><li>Come back here and tap the button below.</li></ol>`
  +`<button class="btn block" data-act="claim">I have paid</button>`;
  drawQr();
}
function renderFeedback(){
  document.querySelectorAll('.stars').forEach(el=>{
    const k=el.dataset.k;
    el.innerHTML=[1,2,3,4,5].map(v=>`<button data-act="star" data-k="${k}" data-v="${v}" aria-label="${k} ${v} of 5" aria-pressed="${S.fb[k]>=v}">${STAR}</button>`).join('');
  });
  $('#fbTags').innerHTML=TAGS.map(t=>`<button class="chipbtn" data-act="tag" data-t="${t}" aria-pressed="${S.fb.tags.includes(t)}">${t}</button>`).join('');
}
function renderAll(){renderTabs();renderMenu();renderSheet();renderWaiter();renderBill();renderFeedback()}

/* ---------- Actions ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act,id=el.dataset.id,k=el.dataset.k;
  if(a==='theme'){const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';return}
  if(a==='reload'){location.reload();return}
  if(a==='start'){S.started=true;S.guest=$('#guestName').value.trim()}
  else if(a==='tab'){S.tab=el.dataset.tab;$('#screen').scrollTop=0}
  else if(a==='cat'){S.cat=el.dataset.cat;S.q='';$('#search').value=''}
  else if(a==='open'){S.sheet={id};$('#sheet').scrollTop=0}
  else if(a==='closesheet'){S.sheet=null}
  else if(a==='ordercall'){S.sheet=null;S.tab='waiter';S.reason='Ready to order';$('#screen').scrollTop=0}
  else if(a==='reason'){S.reason=el.dataset.r}
  else if(a==='call'){
    S.calls.push({id:S.callSeq++,table:7,mine:true,reason:S.reason,note:$('#callNote').value.trim(),status:'waiting',t:new Date()});
    const cid=S.callSeq-1;
    setTimeout(()=>{const c=S.calls.find(c=>c.id===cid);if(c&&c.status==='waiting'){c.status='coming';renderAll()}},4000);
    $('#callNote').value='';toast('Waiter called. Please stay seated.');
  }
  else if(a==='cancelcall'){S.calls=S.calls.filter(c=>String(c.id)!==id);toast('Request cancelled')}
  else if(a==='claim'){
    S.payClaimed=true;toast('Thanks. We are checking your payment.');
    setTimeout(()=>{if(S.payClaimed&&!S.paid){S.paid=true;S.paidAt=new Date();S.receipt='R-'+(2040+S.seq);toast('Payment received. Thank you!');renderAll()}},3000);
  }
  else if(a==='unclaim'){S.payClaimed=false}
  else if(a==='copyref'){const r=payRef();try{navigator.clipboard.writeText(r).then(()=>toast('Reference copied'),()=>toast('Reference: '+r))}catch(_){toast('Reference: '+r)}}
  else if(a==='star'){const kk=el.dataset.k,v=+el.dataset.v;S.fb[kk]=S.fb[kk]===v?0:v;$('#fbErr').hidden=true}
  else if(a==='tag'){const t=el.dataset.t,i=S.fb.tags.indexOf(t);i>=0?S.fb.tags.splice(i,1):S.fb.tags.push(t)}
  else if(a==='sendfb'){
    if(!(S.fb.food||S.fb.service||S.fb.ambience)){$('#fbErr').hidden=false;return}
    S.feedbackList.unshift({name:S.guest,food:S.fb.food,service:S.fb.service,ambience:S.fb.ambience,tags:S.fb.tags.slice(),comment:$('#fbComment').value.trim()});
    $('#fbForm').hidden=true;$('#fbDone').hidden=false;
  }
  else if(a==='fbagain'){S.fb={food:0,service:0,ambience:0,tags:[]};$('#fbComment').value='';$('#fbForm').hidden=false;$('#fbDone').hidden=true}
  renderAll();
});
document.addEventListener('input',e=>{
  if(e.target.id==='search'){S.q=e.target.value;renderMenu()}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.sheet){S.sheet=null;renderAll()}});
$('#splashArt').innerHTML='<svg viewBox="0 0 96 96" aria-hidden="true"><rect width="96" height="96" fill="#F0DFCB"/>'+A.cappu()+'</svg>';
renderAll();
