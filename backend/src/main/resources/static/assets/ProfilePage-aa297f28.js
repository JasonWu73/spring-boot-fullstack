import{a as D,b as j,d as T,e as I,j as s,E as q,B as R,R as W,P as g}from"./index-a82a2232.js";import{t as B,z as n}from"./index-9b6ca6c3.js";import{u as _,C as z,a as H,b as K,c as L,d as V,F as Y,e as o}from"./CustomFormField-b6666a44.js";import{A as G,a as J,b as M,c as O}from"./Accordion-e6b0723e.js";import{A as Q,a as X,b as Z}from"./Alert-f5f14249.js";import{S as l}from"./Skeleton-96c5c436.js";import{u as $}from"./use-title-71d2f9de.js";import{e as b}from"./rsa-fd848fa5.js";const ss=n.object({nickname:n.string().min(1,"必须输入昵称").trim(),oldPassword:n.string().trim(),newPassword:n.string().trim(),confirmPassword:n.string().trim()}).refine(({oldPassword:e,newPassword:r})=>e&&r||!e&&!r,{message:"新旧密码必须同时存在或不存在",path:["newPassword"]}).refine(({newPassword:e,confirmPassword:r})=>e===r,{message:"新密码和确认密码必须相同",path:["confirmPassword"]}),es={nickname:"",oldPassword:"",newPassword:"",confirmPassword:""};function ms(){var f,h,x,w;$("个人资料");const e=_({resolver:B(ss),defaultValues:es}),{requestApi:r,deleteAuth:P,updateAuth:N}=D(),{data:y,error:c,loading:d,requestData:A,discardRequest:v}=j(r),{loading:m,requestData:k}=j(r),{toast:u}=T(),p="/api/v1/users/me";I(()=>{const a=Date.now();return S().then(({data:t})=>{t&&C(t)}),()=>v({url:p},a)});async function S(){return await A({url:p})}function C(a){e.reset({nickname:a.nickname,oldPassword:"",newPassword:"",confirmPassword:""})}async function F({nickname:a,oldPassword:t,newPassword:i}){return await k({url:"/api/v1/users/me",method:"PUT",bodyData:{nickname:a,oldPassword:t?b(g,t):null,newPassword:i?b(g,i):null}})}async function U(a){if(!y)return;const{status:t,error:i}=await F({nickname:a.nickname,oldPassword:a.oldPassword,newPassword:a.newPassword});if(t!==204){u({title:"更新资料失败",description:i,variant:"destructive"});return}u({title:"更新资料成功",description:s.jsx("span",{children:"您已成功更新个人资料。"})}),a.newPassword&&P(),N(E=>({...E,nickname:a.nickname}))}return s.jsxs(z,{className:"mx-auto w-full md:w-4/5 lg:w-2/3",children:[s.jsxs(H,{children:[s.jsx(K,{children:"个人资料"}),s.jsx(L,{children:"您的个人资料"})]}),s.jsxs(V,{children:[d&&s.jsx(as,{}),!d&&s.jsx(Y,{...e,children:s.jsxs("form",{onSubmit:e.handleSubmit(U),className:"flex flex-col gap-4",children:[c&&s.jsxs(Q,{variant:"destructive",children:[s.jsx(q,{className:"h-4 w-4"}),s.jsx(X,{children:"获取个人资料失败"}),s.jsx(Z,{children:c})]}),s.jsx(o,{control:e.control,name:"nickname",type:"text",label:"昵称",labelWidth:60,placeholder:"昵称",isError:(f=e.getFieldState("nickname"))==null?void 0:f.invalid}),s.jsx(G,{type:"single",collapsible:!0,children:s.jsxs(J,{value:"item-1",children:[s.jsx(M,{children:"修改密码"}),s.jsxs(O,{className:"space-y-2 pt-2",children:[s.jsx(o,{control:e.control,name:"oldPassword",type:"password",label:"旧密码",labelWidth:60,placeholder:"旧密码，不需要修改密码则不用填",isError:(h=e.getFieldState("oldPassword"))==null?void 0:h.invalid}),s.jsx(o,{control:e.control,name:"newPassword",type:"password",label:"新密码",labelWidth:60,placeholder:"新密码，不需要修改密码则不用填",isError:(x=e.getFieldState("newPassword"))==null?void 0:x.invalid}),s.jsx(o,{control:e.control,name:"confirmPassword",type:"password",label:"确认密码",labelWidth:60,placeholder:"确认密码，不需要修改密码则不用填",isError:(w=e.getFieldState("confirmPassword"))==null?void 0:w.invalid})]})]})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsxs(R,{type:"submit",className:"self-end",disabled:m,children:[m&&s.jsx(W,{className:"mr-2 h-4 w-4 animate-spin"}),"提交"]})})]})})]})]})}function as(){return s.jsxs("div",{className:"flex flex-col gap-4",children:[Array.from({length:1},(e,r)=>s.jsx("div",{className:"flex flex-col gap-4",children:s.jsxs("div",{className:"grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]",children:[s.jsx(l,{className:"h-9 w-32"}),s.jsx(l,{className:"h-9"})]})},r)),s.jsx("div",{className:"border-b pb-4",children:s.jsx(l,{className:"h-9 w-full"})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsx(l,{className:"h-9 w-20 self-end"})})]})}export{ms as default};
