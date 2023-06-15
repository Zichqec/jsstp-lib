let t=Object,r=t.assign,o="\r\n",n,e="Get_Supported_Events",s="Has_Event",i=(e,"has_event"),h="get_simple_caller_of_event",a="trivial_clone",_="default_info",[u,l,c,g]=["blocker","string_key_handler","symbol_key_handler","default_handler"],f=(t,e)=>{var s=t.indexOf(e);return[t.substring(0,s),t.substring(s+e.length)]},d=r=>(e,s)=>{if(!r[u]||!r[u](e,s)){let t;return(t=Object(s)instanceof String?r[l]&&r[l](e,s):r[c]&&r[c](e,s))!==n?t:r[g]?r[g](e,s):(t=e[s])instanceof Function?t.bind(e):t}};let p=!!globalThis.window?location.origin:"http://localhost:"+process.env.PORT??9801,v=/^\w+:\/\/localhost/.test(p)?"local":"external";class y{get keys(){return t.keys(this)}get values(){return t.values(this)}get entries(){return t.entries(this)}get length(){return this.keys.length}forEach(s){return this.entries.forEach(([t,e])=>{this[t]=s(e,t)||e})}get trivial_clone(){return r(w(),this)}flat_map(s){let r=[];return this.entries.map(([t,e])=>{e instanceof y?r.push(...e.flat_map(s.bind(s,t))):r.push(s(t,e))}),r}map(s){return this.entries.map(([t,e])=>s(e,t))}push(t){return t.forEach(t=>t?this[t[0]]=t[1]:n),this}}let w=()=>new y;class m extends y{#t;#i;constructor(t,e,s={}){super(),this.#t=""+t,s.length&&(this.#i=s),r(this,e)}get unknown_lines(){return this.#i||[]}get head(){return this.#t}toString(){return[this.#t,...this.unknown_lines,...this.entries.map(([t,e])=>t+": "+e),"",""].join(o)}to_string(){return this.toString()}toJSON(){return{head:this.#t,unknown_lines:this.#i,body:this[a]}}get status_code(){return+this.#t.split(" ").find(t=>{return(t=+t)==t})}}let b="X-SSTP-PassThru-";class x extends m{constructor(t,e,s={}){return super(t,e,s),new Proxy(this,{get:d({string_key_handler:(t,e)=>e in t==0&&b+e in t?t.get_passthrough(e):n})})}static from_string(t){var e,[t,...s]=t.split(o),r={},n=[];let i;s.length-=2;for(e of s){var[h,a]=f(e,": ");/^\w[^\s]*$/.test(h)?r[i=h]=a:i?r[i]+=o+e:n.push(e)}return new x(t,r,n)}get_passthrough(t){return this[b+t]}#h;get passthroughs(){return this.#h??=w().push(this.map((t,e)=>e.startsWith(b)?[e.slice(16),t]:n))}}class S extends m{constructor(t){var e,s,r,n,[t,...i]=t.split(o);super(t,{});for(e of i)e&&([r,s]=f(e,""),[r,n]=f(r,"."),this[r]||=w(),this[r][n]=s)}get_uuid_by(e,s){return this.uuids.find(t=>this[t][e]==s)}get_list_of(e){return this.uuids.map(t=>this[t][e])}get uuids(){return this.keys}get available(){return!!this.length}toString(){return[this.head,"",...this.flat_map((t,e,s)=>t+"."+e+""+s),"",""].join(o)}toJSON(){return{head:this.head,fmo_infos:this[a]}}}class E{#o;#_;#u;#l;#g;constructor(t){this.#o=t}async check_event(t,e=v){return this.#u?this.#l[e].includes(t):!!this.#_&&(this.#g[e][t]??=await this.#o[i](t))}get available(){return this.#_}get fast_query_available(){return this.#u}async reset(){this.clear();var t=this.#o;return this.#_=await t[i](s),this.#u=this.#_&&await t[i](e),this.#u&&(this.#l=await t.get_supported_events()),this}async init(){return this.reset()}clear(){this.#_=this.#u=!1,this.#g={local:{},external:{}}}}let k={SEND:1.4,NOTIFY:1.1,COMMUNICATE:1.1,EXECUTE:1.2,GIVE:1.1};class O{#p;proxy;RequestHeader;default_info;static sstp_version_table=k;static default_security_level=v;constructor(t,e){return this.RequestHeader={"Content-Type":"text/plain",Origin:p},this[_]={Charset:"UTF-8"},this.host=e,this.sendername=t,this.proxy=new Proxy(this,{get:d({string_key_handler:(t,e)=>{return e in k?t.get_caller_of_method(e):/^On/.test(e)?t[h]("_"==(t=e)[2]?t.substring(3):t):void 0}})}),this.proxy}set host(t){this.#p=t||"http://localhost:9801/api/sstp/v1"}get host(){return this.#p}set sendername(t){this[_].Sender=t||"jsstp-client"}get sendername(){return this[_].Sender}row_send(t){return new Promise((e,s)=>fetch(this.host,{method:"POST",headers:this.RequestHeader,body:""+t}).then(t=>200!=t.status?s(t.status):t.text().then(e)).catch(s))}costom_text_send(t,e){return this.row_send(new x(t,{...this.default_info,...e}))}async costom_send(t,e){return this.costom_text_send(t,e).then(t=>x.from_string(t))}get_caller_of_method(t){let e=(t=t)+" SSTP/"+k[t];return r(t=>this.costom_send(e,t),{get_row:t=>this.costom_text_send(e,t)})}get_caller_of_event(e,s="SEND"){return t=>this.proxy[s](r({Event:e},t))}get_simple_caller_of_event(r,n="SEND"){return(...t)=>{let e=0,s={};return t.forEach(t=>s["Reference"+e++]=t),this.get_caller_of_event(r,n)(s)}}get event(){return new Proxy({},{get:(t,e)=>this[h](e)})}async has_event(t,e=v){return this.event[s](t,e).then(({Result:t})=>"1"==t)}async get_supported_events(){return this.event[e]().then(({local:t,external:e})=>({local:(t||"").split(","),external:(e||"").split(",")}))}async get_fmo_infos(){return this.proxy.EXECUTE.get_row({Command:"GetFMO"}).then(t=>new S(t))}async available(){return this.get_fmo_infos().then(t=>t.available).catch(()=>!1)}async new_event_queryer(){return new E(this).init()}}r(O.prototype,{type:O,base_sstp_info_t:m,sstp_info_t:x,fmo_info_t:S,ghost_events_queryer_t:E});var T=new O;export{m as base_sstp_info_t,T as default,S as fmo_info_t,E as ghost_events_queryer_t,T as jsstp,O as jsstp_t,x as sstp_info_t};