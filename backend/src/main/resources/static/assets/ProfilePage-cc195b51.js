import{a as D,b as j,d as T,a4 as I,j as s,E as R,B as W,R as _,e as g}from"./index-2df15143.js";import{z as n,t as B}from"./index-baf8e82b.js";import{u as z,C as q,a as H,b as K,c as L,d as V,F as Y,e as o}from"./CustomFormField-3e2fddec.js";import{A as G,a as J,b as M,c as O}from"./Accordion-40cacf92.js";import{A as Q,a as X,b as Z}from"./Alert-365d3aec.js";import{S as l}from"./Skeleton-1a4223dc.js";import{u as $}from"./use-title-0288608e.js";import{e as b}from"./rsa-fd848fa5.js";const ss=n.object({nickname:n.string().min(1,"必须输入昵称").trim(),oldPassword:n.string().trim(),newPassword:n.string().trim(),confirmPassword:n.string().trim()}).refine(({oldPassword:e,newPassword:r})=>e&&r||!e&&!r,{message:"新旧密码必须同时存在或不存在",path:["newPassword"]}).refine(({newPassword:e,confirmPassword:r})=>e===r,{message:"新密码和确认密码必须相同",path:["confirmPassword"]}),es={nickname:"",oldPassword:"",newPassword:"",confirmPassword:""};function ms(){var h,p,x,w;$("个人资料");const e=z({resolver:B(ss),defaultValues:es}),{requestApi:r,deleteAuth:P,updateAuth:N}=D(),{data:y,error:c,loading:d,fetchData:A,discardFetch:v}=j(r),{loading:m,fetchData:k}=j(r),{toast:u}=T(),f="/api/v1/users/me";I(()=>{const a=Date.now();return S().then(({data:t})=>{t&&F(t)}),()=>v({url:f},a)});async function S(){return await A({url:f})}function F(a){e.reset({nickname:a.nickname,oldPassword:"",newPassword:"",confirmPassword:""})}async function C({nickname:a,oldPassword:t,newPassword:i}){return await k({url:"/api/v1/users/me",method:"PUT",bodyData:{nickname:a,oldPassword:t?b(g,t):null,newPassword:i?b(g,i):null}})}async function U(a){if(!y)return;const{status:t,error:i}=await C({nickname:a.nickname,oldPassword:a.oldPassword,newPassword:a.newPassword});if(t!==204){u({title:"更新资料失败",description:i,variant:"destructive"});return}u({title:"更新资料成功",description:s.jsx("span",{children:"您已成功更新个人资料。"})}),a.newPassword&&P(),N(E=>({...E,nickname:a.nickname}))}return s.jsxs(q,{className:"mx-auto w-full md:w-4/5 lg:w-2/3",children:[s.jsxs(H,{children:[s.jsx(K,{children:"个人资料"}),s.jsx(L,{children:"您的个人资料"})]}),s.jsxs(V,{children:[d&&s.jsx(as,{}),!d&&s.jsx(Y,{...e,children:s.jsxs("form",{onSubmit:e.handleSubmit(U),className:"flex flex-col gap-4",children:[c&&s.jsxs(Q,{variant:"destructive",children:[s.jsx(R,{className:"h-4 w-4"}),s.jsx(X,{children:"获取个人资料失败"}),s.jsx(Z,{children:c})]}),s.jsx(o,{control:e.control,name:"nickname",type:"text",label:"昵称",labelWidth:60,placeholder:"昵称",isError:(h=e.getFieldState("nickname"))==null?void 0:h.invalid}),s.jsx(G,{type:"single",collapsible:!0,children:s.jsxs(J,{value:"item-1",children:[s.jsx(M,{children:"修改密码"}),s.jsxs(O,{className:"space-y-2 pt-2",children:[s.jsx(o,{control:e.control,name:"oldPassword",type:"password",label:"旧密码",labelWidth:60,placeholder:"旧密码，不需要修改密码则不用填",isError:(p=e.getFieldState("oldPassword"))==null?void 0:p.invalid}),s.jsx(o,{control:e.control,name:"newPassword",type:"password",label:"新密码",labelWidth:60,placeholder:"新密码，不需要修改密码则不用填",isError:(x=e.getFieldState("newPassword"))==null?void 0:x.invalid}),s.jsx(o,{control:e.control,name:"confirmPassword",type:"password",label:"确认密码",labelWidth:60,placeholder:"确认密码，不需要修改密码则不用填",isError:(w=e.getFieldState("confirmPassword"))==null?void 0:w.invalid})]})]})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsxs(W,{type:"submit",className:"self-end",disabled:m,children:[m&&s.jsx(_,{className:"mr-2 h-4 w-4 animate-spin"}),"提交"]})})]})})]})]})}function as(){return s.jsxs("div",{className:"flex flex-col gap-4",children:[Array.from({length:1},(e,r)=>s.jsx("div",{className:"flex flex-col gap-4",children:s.jsxs("div",{className:"grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]",children:[s.jsx(l,{className:"h-9 w-32"}),s.jsx(l,{className:"h-9"})]})},r)),s.jsx("div",{className:"border-b pb-4",children:s.jsx(l,{className:"h-9 w-full"})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsx(l,{className:"h-9 w-20 self-end"})})]})}export{ms as default};
