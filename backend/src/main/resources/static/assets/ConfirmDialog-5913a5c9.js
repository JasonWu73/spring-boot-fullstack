import{c as T,$ as z,r as o,_ as l,G as m,I as F,a3 as I,j as r,g as d,o as b}from"./index-990c888e.js";import{$ as g,n as M,o as L,p as q,q as H,r as G,s as u,t as V,v as B,w as J}from"./CustomFormField-52ac9235.js";/**
 * @license lucide-react v0.293.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=T("AlertOctagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h1p8hx"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),Q="AlertDialog",[U,ge]=z(Q,[g]),n=g(),W=e=>{const{__scopeAlertDialog:a,...t}=e,c=n(a);return o.createElement(B,l({},c,t,{modal:!0}))},X=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,s=n(t);return o.createElement(J,l({},s,c,{ref:a}))}),Y=e=>{const{__scopeAlertDialog:a,...t}=e,c=n(a);return o.createElement(V,l({},c,t))},Z=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,s=n(t);return o.createElement(M,l({},s,c,{ref:a}))}),A="AlertDialogContent",[ee,ae]=U(A),te=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,children:c,...s}=e,i=n(t),$=o.useRef(null),O=m(a,$),x=o.useRef(null);return o.createElement(L,{contentName:A,titleName:oe,docsSlug:"alert-dialog"},o.createElement(ee,{scope:t,cancelRef:x},o.createElement(q,l({role:"alertdialog"},i,s,{ref:O,onOpenAutoFocus:F(s.onOpenAutoFocus,f=>{var p;f.preventDefault(),(p=x.current)===null||p===void 0||p.focus({preventScroll:!0})}),onPointerDownOutside:f=>f.preventDefault(),onInteractOutside:f=>f.preventDefault()}),o.createElement(I,null,c),!1)))}),oe="AlertDialogTitle",re=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,s=n(t);return o.createElement(H,l({},s,c,{ref:a}))}),ce=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,s=n(t);return o.createElement(G,l({},s,c,{ref:a}))}),se=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,s=n(t);return o.createElement(u,l({},s,c,{ref:a}))}),le="AlertDialogCancel",ne=o.forwardRef((e,a)=>{const{__scopeAlertDialog:t,...c}=e,{cancelRef:s}=ae(le,t),i=n(t),$=m(a,s);return o.createElement(u,l({},i,c,{ref:$}))}),de=W,fe=X,ie=Y,D=Z,_=te,N=se,y=ne,v=re,R=ce,$e=de,pe=fe,be=ie,j=o.forwardRef(({className:e,...a},t)=>r.jsx(D,{className:d("fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80",e),...a,ref:t}));j.displayName=D.displayName;const w=o.forwardRef(({className:e,...a},t)=>r.jsxs(be,{children:[r.jsx(j,{}),r.jsx(_,{ref:t,className:d("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:border-slate-800 dark:bg-slate-950 sm:rounded-lg md:w-full",e),...a})]}));w.displayName=_.displayName;const E=({className:e,...a})=>r.jsx("div",{className:d("flex flex-col space-y-2 text-center sm:text-left",e),...a});E.displayName="AlertDialogHeader";const h=({className:e,...a})=>r.jsx("div",{className:d("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});h.displayName="AlertDialogFooter";const C=o.forwardRef(({className:e,...a},t)=>r.jsx(v,{ref:t,className:d("text-lg font-semibold",e),...a}));C.displayName=v.displayName;const P=o.forwardRef(({className:e,...a},t)=>r.jsx(R,{ref:t,className:d("text-sm text-slate-500 dark:text-slate-400",e),...a}));P.displayName=R.displayName;const S=o.forwardRef(({className:e,...a},t)=>r.jsx(N,{ref:t,className:d(b(),e),...a}));S.displayName=N.displayName;const k=o.forwardRef(({className:e,...a},t)=>r.jsx(y,{ref:t,className:d(b({variant:"outline"}),"mt-2 sm:mt-0",e),...a}));k.displayName=y.displayName;function ue({open:e,onOpenChange:a,trigger:t,title:c,onConfirm:s}){return r.jsxs($e,{open:e,onOpenChange:a,children:[r.jsx(pe,{asChild:!0,children:t}),r.jsxs(w,{children:[r.jsxs(E,{children:[r.jsx(C,{children:c}),r.jsxs(P,{className:"flex items-center",children:[r.jsx(K,{className:"mr-1 h-4 w-4 text-amber-500 dark:text-amber-600"}),"此操作无法撤消，请谨慎操作！"]})]}),r.jsxs(h,{children:[r.jsx(k,{children:"取消"}),r.jsx(S,{onClick:s,className:b({variant:"destructive"}),children:"确认"})]})]})]})}export{ue as C};
