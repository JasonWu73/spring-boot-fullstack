import{i as U,f as h,s as H,$ as W,r as i,k as R,_,l as V,m as F,j as e,h as b,n as Y,o as N,t as z,L as G,p as J,q as L,U as j,v as S,u as X,b as Z,d as ee,g as ae,S as se,R as te,E as re,w as ne,x as ce,y as oe,B as le,O as de,z as ie,A as ue}from"./index-a82a2232.js";import{u as k}from"./use-title-71d2f9de.js";import{A as v,a as y,b as w}from"./Alert-f5f14249.js";import{I as me,C as fe}from"./CustomFormField-b6666a44.js";import{C as p}from"./Code-37b130dd.js";import{C as pe}from"./ConfirmDialog-0010a022.js";import{T as he,a as xe,b as ge,c as je}from"./Tooltip-dcbe9ee6.js";import{A as be,a as $e,b as ve,c as ye}from"./Accordion-e6b0723e.js";function A({key:a,modifiers:s=[]},t){const r=U({key:a,modifiers:s,callback:t});h.useEffect(()=>{function n(c){var u;const{key:l,modifiers:o,callback:d}=r.current;((u=c.key)==null?void 0:u.toLowerCase())===l.toLowerCase()&&o.every(f=>c[f])&&d()}return document.addEventListener("keydown",n),()=>document.removeEventListener("keydown",n)},[r])}const we=`${window.location.origin}`;async function Ae(a){const{status:s,data:t,error:r}=await H({...a,url:`${we}${a.url}`});return r?{status:s,error:r}:{status:s,data:t}}const C="Avatar",[Re,We]=W(C),[_e,I]=Re(C),Ne=i.forwardRef((a,s)=>{const{__scopeAvatar:t,...r}=a,[n,c]=i.useState("idle");return i.createElement(_e,{scope:t,imageLoadingStatus:n,onImageLoadingStatusChange:c},i.createElement(R.span,_({},r,{ref:s})))}),Se="AvatarImage",Ee=i.forwardRef((a,s)=>{const{__scopeAvatar:t,src:r,onLoadingStatusChange:n=()=>{},...c}=a,l=I(Se,t),o=ke(r),d=V(u=>{n(u),l.onImageLoadingStatusChange(u)});return F(()=>{o!=="idle"&&d(o)},[o,d]),o==="loaded"?i.createElement(R.img,_({},c,{ref:s,src:r})):null}),Fe="AvatarFallback",Le=i.forwardRef((a,s)=>{const{__scopeAvatar:t,delayMs:r,...n}=a,c=I(Fe,t),[l,o]=i.useState(r===void 0);return i.useEffect(()=>{if(r!==void 0){const d=window.setTimeout(()=>o(!0),r);return()=>window.clearTimeout(d)}},[r]),l&&c.imageLoadingStatus!=="loaded"?i.createElement(R.span,_({},n,{ref:s})):null});function ke(a){const[s,t]=i.useState("idle");return F(()=>{if(!a){t("error");return}let r=!0;const n=new window.Image,c=l=>()=>{r&&t(l)};return t("loading"),n.onload=c("loaded"),n.onerror=c("error"),n.src=a,()=>{r=!1}},[a]),s}const D=Ne,T=Ee,P=Le,M=i.forwardRef(({className:a,...s},t)=>e.jsx(D,{ref:t,className:b("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",a),...s}));M.displayName=D.displayName;const O=i.forwardRef(({className:a,...s},t)=>e.jsx(T,{ref:t,className:b("aspect-square h-full w-full",a),...s}));O.displayName=T.displayName;const q=i.forwardRef(({className:a,...s},t)=>e.jsx(P,{ref:t,className:b("flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800",a),...s}));q.displayName=P.displayName;function Ce({friend:a,onDeleteFriend:s}){const t=Y(),{dispatch:r}=N(),n=Number(t.friendId),c=a.id===n;function l(){r({type:"SHOW_ADD_FRIEND_FORM",payload:!1})}const o=z(a.name,5),d=window.location.search;return e.jsxs("li",{className:b("group relative flex items-center justify-between gap-2 rounded px-4 py-2 hover:bg-amber-100 dark:hover:text-slate-700",c&&"bg-amber-100 dark:text-night"),children:[e.jsx(pe,{trigger:e.jsx("button",{className:"absolute left-2 top-1 hidden cursor-pointer text-xs group-hover:block",children:"❌"}),title:e.jsxs("span",{children:["您确定要删除好友 ",e.jsx(p,{children:a.name})," 吗？"]}),onConfirm:()=>s(a)}),e.jsxs(M,{children:[e.jsx(O,{src:a.image,alt:o}),e.jsx(q,{children:o})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx(he,{children:e.jsxs(xe,{children:[e.jsx(ge,{asChild:!0,children:e.jsxs("span",{className:"text-lg font-bold",children:[o," 🎂 ",a.birthday]})}),e.jsx(je,{children:a.name})]})}),a.balance>0&&e.jsxs("p",{className:"text-green-500",children:[e.jsx(p,{children:o})," 欠您 $",a.balance]}),a.balance<0&&e.jsxs("p",{className:"text-red-500 dark:text-red-600",children:["您欠 ",e.jsx(p,{children:o})," $",Math.abs(a.balance)]}),a.balance===0&&e.jsxs("p",{children:["你和 ",e.jsx(p,{children:o})," 互不相欠"]})]}),e.jsx(G,{to:c?`/split-bill${d}`:`/split-bill/${a.id}${d}`,state:{noRefresh:!0},onClick:l,className:J({variant:"default"}),children:c?"关闭":"选择"})]})}function Ie(){return e.jsx(be,{type:"single",collapsible:!0,children:e.jsxs($e,{value:"item-1",children:[e.jsx(ve,{children:"查看可用快捷键"}),e.jsx(ye,{children:e.jsxs("ul",{className:"space-y-2",children:[e.jsxs("li",{children:[e.jsx(p,{children:"Ctrl+\\"}),"：定位到搜索框"]}),e.jsxs("li",{children:[e.jsx(p,{children:"Esc"}),"：清空搜索框，并仅展示应用主界面"]})]})})]})})}function De(){const a=h.useRef(null),[s,t]=L(),[r,n]=h.useState(s.get(j)||""),c=S();A({key:"\\",modifiers:["ctrlKey"]},()=>{var d;document.activeElement!==a.current&&((d=a.current)==null||d.focus())}),A({key:"Escape"},()=>{n("")});function l(d){s.delete(j);const u=d.target.value;n(u);const f=u.trim();return f&&s.set(j,f),t(s,{replace:!0,state:{noRefresh:!0}})}function o(){c(`/split-bill${window.location.search}`,{replace:!0,state:{noRefresh:!0}})}return e.jsxs(e.Fragment,{children:[e.jsx(Ie,{}),e.jsx(me,{value:r,onChange:l,onFocus:o,ref:a,placeholder:"搜索好友...",className:"my-4 dark:border-amber-500"})]})}function Te(){k("好友列表");const[a]=L(),s=X(),t=S(),{friends:r,dispatch:n}=N(),{error:c,loading:l,requestData:o,discardRequest:d}=Z(Ae),{toast:u}=ee(),f=a.get(j)||"",$=f?r.filter(m=>m.name.toLowerCase().includes(f.toLowerCase())):r,E="/data/friends.json";ae(()=>{var x;if(((x=s.state)==null?void 0:x.noRefresh)===!0){s.state&&(s.state.noRefresh=!1);return}n({type:"SHOW_ADD_FRIEND_FORM",payload:!1});const m=Date.now();return B().then(({data:g,error:Q})=>{if(Q){n({type:"SET_FRIENDS",payload:[]});return}g&&n({type:"SET_FRIENDS",payload:g})}),()=>d({url:E},m)});async function B(){return await o({url:E})}function K(m){n({type:"DELETE_FRIEND",payload:m.id}),u({title:"删除好友",description:e.jsxs("span",{children:["成功删除好友 ",e.jsx(p,{children:m.name})]})}),t(`/split-bill${window.location.search}`,{replace:!0,state:{noRefresh:!0}})}return e.jsxs(e.Fragment,{children:[e.jsx(De,{}),e.jsx(fe,{children:e.jsx(se,{className:"h-96 w-96 md:h-[30rem] md:w-[22rem] lg:h-[24rem] lg:w-[30rem]",children:e.jsxs("div",{className:"space-y-4 p-4",children:[l&&e.jsxs(v,{children:[e.jsx(te,{className:"mr-2 h-4 w-4 animate-spin"}),e.jsx(y,{children:"加载中..."}),e.jsx(w,{children:"好友列表加载中"})]}),!l&&c&&e.jsxs(v,{variant:"destructive",children:[e.jsx(re,{className:"h-4 w-4"}),e.jsx(y,{children:"错误"}),e.jsx(w,{children:c})]}),!l&&!c&&$.length===0&&e.jsxs(v,{children:[e.jsx(ne,{className:"h-4 w-4"}),e.jsx(y,{children:"温馨提示！"}),e.jsx(w,{children:"还没有好友，添加好友即可分摊账单"})]}),!l&&!c&&$.length>0&&e.jsx("ul",{children:$.map((m,x,g)=>e.jsxs(h.Fragment,{children:[e.jsx(Ce,{friend:m,onDeleteFriend:K}),x<g.length-1&&e.jsx(ce,{className:"my-2"})]},m.id))})]})})})]})}const Pe=h.lazy(()=>ie(2).then(()=>ue(()=>import("./AddFriend-c8805bc3.js"),["assets/AddFriend-c8805bc3.js","assets/index-a82a2232.js","assets/index-34098410.css","assets/index-9b6ca6c3.js","assets/CustomFormField-b6666a44.js","assets/use-title-71d2f9de.js"]).then(a=>({default:a.AddFriend}))));function Ve(){k("分摊账单");const a=S(),{showAddFriend:s,dispatch:t}=N();A({key:"Escape"},()=>{t({type:"SHOW_ADD_FRIEND_FORM",payload:!1}),a("/split-bill",{state:{noRefresh:!0}})});function r(){t({type:"SHOW_ADD_FRIEND_FORM",payload:!s})}return e.jsxs("div",{className:"grid grid-flow-row items-center justify-center gap-6 md:grid-cols-2",children:[e.jsx("div",{className:"md:col-span-1 md:row-span-1 md:justify-self-end",children:e.jsx(Te,{})}),e.jsxs("div",{className:"flex flex-col gap-6 self-start md:col-span-1 md:row-start-2 md:row-end-3 md:justify-self-end",children:[e.jsx(h.Suspense,{fallback:e.jsx(oe,{}),children:s&&e.jsx(Pe,{})}),e.jsx("div",{className:"self-end",children:e.jsx(le,{onClick:r,children:s?"关闭":"添加好友"})})]}),e.jsx("div",{className:"md:col-start-2 md:col-end-3 md:row-span-1",children:e.jsx(de,{})})]})}export{Ve as default};
