let n,i=Object,r=Proxy,h=i.assign,u="\r\n",e="Get_Supported_Events",s="Has_Event",a="has_event",o="get_simple_caller_of_event",t="trivial_clone",_="default_info",l="substring",c="length",g="entries",f="proxy",v="then",p="",d=(t,e)=>{var s=t.indexOf(e);return[t[l](0,s),t[l](s+e[c])]},w=r=>(t,e)=>{var s;if(!r.t||!r.t(t,e))return(s=i(e)instanceof String?r.i&&r.i(t,e):r.h&&r.h(t,e))!==n?s:r.o?r.o(t,e):(s=t[e])instanceof Function?s.bind(t):s},y=!!globalThis.window,m=t=>"http://localhost:"+(t??9801),b=y?location.origin:m(process.env.PORT),S=/^\w+:\/\/localhost/.test(b)?"local":"external";class x{get keys(){return i.keys(this)}get values(){return i.values(this)}get entries(){return i[g](this)}get length(){return this.keys[c]}forEach(s){return this[g].forEach(([t,e])=>{this[t]=s(e,t)||e})}get trivial_clone(){return h(E(),this)}flat_map(s){let r=[];return this[g].map(([t,e])=>{e instanceof x?r.push(...e.flat_map(s.bind(s,t))):r.push(s(t,e))}),r}map(s){return this[g].map(([t,e])=>s(e,t))}push(t){return t.forEach(t=>t?this[t[0]]=t[1]:n),this}}let E=()=>new x;class O extends x{#t;#h;constructor(t,e,s={}){super(),this.#t=p+t,s[c]&&(this.#h=s),h(this,e)}get unknown_lines(){return this.#h||[]}get head(){return this.#t}toString(){return[this.#t,...this.unknown_lines,...this[g].map(([t,e])=>t+": "+e),p,p].join(u)}to_string(){return p+this}toJSON(){return{head:this.#t,unknown_lines:this.#h,body:this[t]}}get status_code(){return+this.#t.split(" ").find(t=>(t=+t)==t)}}let T="X-SSTP-PassThru-";class N extends O{constructor(t,e,s={}){return super(t,e,s),new r(this,{get:w({i:(t,e)=>T+e in t?t.get_passthrough(e):n})})}static from_string(t){let e,[s,...r]=t.split(u),n={},i=[];r[c]-=2;for(var h of r){var[a,o]=d(h,": ");/^\w[^\s]*$/.test(a)?n[e=a]=o:e?n[e]+=u+h:i.push(h)}return new N(s,n,i)}get_passthrough(t){return this[T+t]}#o;get passthroughs(){return this.#o??=E().push(this.map((t,e)=>e.startsWith(T)?[e.slice(16),t]:n))}get raw(){return this}}class P extends O{constructor(t){var e,s,r,n,[t,...i]=t.split(u);super(t,{});for(e of i)e&&([r,s]=d(e,""),[r,n]=d(r,"."),this[r]||=E(),this[r][n]=s)}get_uuid_by(e,s){return this.uuids.find(t=>this[t][e]==s)}get_list_of(e){return this.uuids.map(t=>this[t][e])}get uuids(){return this.keys}get available(){return!!this[c]}toString(){return[this.head,p,...this.flat_map((t,e,s)=>t+"."+e+""+s),p,p].join(u)}toJSON(){return{head:this.head,fmo_infos:this[t]}}}class q{#u;#_;#l;#g;#v;constructor(t){this.#u=t}async check_event(t,e=S){return this.#l?this.#g[e].includes(t):!!this.#_&&(this.#v[e][t]??=await this.#u[a](t))}get available(){return this.#_}get fast_query_available(){return this.#l}async reset(){this.clear();var t=this.#u;return this.#_=await t[a](s),this.#l=this.#_&&await t[a](e),this.#l&&(this.#g=await t.get_supported_events()),this}async init(){return this.reset()}clear(){this.#_=this.#l=!1,this.#v={local:{},external:{}}}}let C={SEND:1.4,NOTIFY:1.1,COMMUNICATE:1.1,EXECUTE:1.2,GIVE:1.1},j="SEND";class k{#p;proxy;RequestHeader;default_info;static sstp_version_table=C;static default_security_level=S;constructor(t,e){return this.RequestHeader={Origin:b},this[_]={Charset:"UTF-8"},this.host=e,this.sendername=t,this[f]=new r(this,{get:w({i:(t,e)=>e in C?t.get_caller_of_method(e):/^On/.test(e)?t[o]("_"==(t=e)[2]?t[l](3):t):n})})}set host(t){this.#p=t||m()+"/api/sstp/v1"}get host(){return this.#p}set sendername(t){this[_].Sender=t||"jsstp-client"}get sendername(){return this[_].Sender}row_send(r){return new Promise((e,s)=>{return fetch(this.host,{method:"POST",headers:this.RequestHeader,body:(t=r,p+t)})[v](t=>200!=t.status?s(t.status):t.text()[v](e)).catch(s);var t})}costom_text_send(t,e){return this.row_send(new N(t,{...this.default_info,...e}))}async costom_send(t,e){return this.costom_text_send(t,e)[v](t=>N.from_string(t))}get_caller_of_method(t){let e=t+" SSTP/"+C[t];return h(t=>this.costom_send(e,t),{get_raw:t=>this.costom_text_send(e,t)})}get_caller_of_event(e,s=j){return t=>this[f][s](h({Event:e},t))}get_simple_caller_of_event(r,n=j){return(...t)=>{let e=0,s={};return t.forEach(t=>s["Reference"+e++]=t),this.get_caller_of_event(r,n)(s)}}get event(){return new r({},{get:(t,e)=>this[o](e)})}async has_event(t,e=S){return this.event[s](t,e)[v](({Result:t})=>1==t)}async get_supported_events(){return this.event[e]()[v](({local:t,external:e})=>({local:(t||void_string).split(","),external:(e||void_string).split(",")}))}async get_fmo_infos(){return this[f].EXECUTE.get_raw({Command:"GetFMO"}).then(t=>new P(t))}async available(){return this.get_fmo_infos()[v](t=>t.available).catch(()=>!1)}async new_event_queryer(){return new q(this).init()}}h(k.prototype,{type:k,base_sstp_info_t:O,sstp_info_t:N,fmo_info_t:P,ghost_events_queryer_t:q});var F=new k;export{O as base_sstp_info_t,F as default,P as fmo_info_t,q as ghost_events_queryer_t,F as jsstp,k as jsstp_t,N as sstp_info_t}
