import{a as E,b as j,d as D,a4 as T,j as s,E as I,B as W,R as B,P as g}from"./index-990c888e.js";import{z as n,t as R}from"./index-e8c517f4.js";import{u as _,C as z,a as q,b as H,c as K,d as L,F as V,e as o}from"./CustomFormField-52ac9235.js";import{A as Y,a as G,b as J,c as M}from"./Accordion-5c4bad60.js";import{A as O,a as Q,b as X}from"./Alert-dbe85c13.js";import{S as l}from"./Skeleton-68e2d402.js";import{u as Z}from"./use-title-28640cc3.js";import{e as b}from"./rsa-fd848fa5.js";const $=n.object({nickname:n.string().min(1,"必须输入昵称").trim(),oldPassword:n.string().trim(),newPassword:n.string().trim(),confirmPassword:n.string().trim()}).refine(({oldPassword:e,newPassword:r})=>e&&r||!e&&!r,{message:"新旧密码必须同时存在或不存在",path:["newPassword"]}).refine(({newPassword:e,confirmPassword:r})=>e===r,{message:"新密码和确认密码必须相同",path:["confirmPassword"]}),ss={nickname:"",oldPassword:"",newPassword:"",confirmPassword:""};function ds(){var u,p,x,w;Z("个人资料");const e=_({resolver:R($),defaultValues:ss}),{requestApi:r,deleteAuth:P,refreshAuth:N}=E(),{data:v,error:c,loading:d,fetchData:y,discardFetch:A}=j(r),{loading:m,fetchData:F}=j(r),{toast:f}=D(),h="/api/v1/users/me";T(()=>{const a=Date.now();return S().then(({data:t})=>{t&&k(t)}),()=>A({url:h},a)});async function S(){return await y({url:h})}function k(a){e.reset({nickname:a.nickname,oldPassword:"",newPassword:"",confirmPassword:""})}async function C({nickname:a,oldPassword:t,newPassword:i}){return await F({url:"/api/v1/users/me",method:"PUT",bodyData:{nickname:a,oldPassword:t?b(g,t):null,newPassword:i?b(g,i):null}})}async function U(a){if(!v)return;const{status:t,error:i}=await C({nickname:a.nickname,oldPassword:a.oldPassword,newPassword:a.newPassword});if(t!==204){f({title:"更新资料失败",description:i,variant:"destructive"});return}if(f({title:"更新资料成功",description:s.jsx("span",{children:"您已成功更新个人资料。"})}),a.newPassword){P();return}await N()}return s.jsxs(z,{className:"mx-auto w-full md:w-4/5 lg:w-2/3",children:[s.jsxs(q,{children:[s.jsx(H,{children:"个人资料"}),s.jsx(K,{children:"您的个人资料"})]}),s.jsxs(L,{children:[d&&s.jsx(es,{}),!d&&s.jsx(V,{...e,children:s.jsxs("form",{onSubmit:e.handleSubmit(U),className:"flex flex-col gap-4",children:[c&&s.jsxs(O,{variant:"destructive",children:[s.jsx(I,{className:"h-4 w-4"}),s.jsx(Q,{children:"获取个人资料失败"}),s.jsx(X,{children:c})]}),s.jsx(o,{control:e.control,name:"nickname",type:"text",label:"昵称",labelWidth:60,placeholder:"昵称",isError:(u=e.getFieldState("nickname"))==null?void 0:u.invalid}),s.jsx(Y,{type:"single",collapsible:!0,children:s.jsxs(G,{value:"item-1",children:[s.jsx(J,{children:"修改密码"}),s.jsxs(M,{className:"space-y-2 pt-2",children:[s.jsx(o,{control:e.control,name:"oldPassword",type:"password",label:"旧密码",labelWidth:60,placeholder:"旧密码，不需要修改密码则不用填",isError:(p=e.getFieldState("oldPassword"))==null?void 0:p.invalid}),s.jsx(o,{control:e.control,name:"newPassword",type:"password",label:"新密码",labelWidth:60,placeholder:"新密码，不需要修改密码则不用填",isError:(x=e.getFieldState("newPassword"))==null?void 0:x.invalid}),s.jsx(o,{control:e.control,name:"confirmPassword",type:"password",label:"确认密码",labelWidth:60,placeholder:"确认密码，不需要修改密码则不用填",isError:(w=e.getFieldState("confirmPassword"))==null?void 0:w.invalid})]})]})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsxs(W,{type:"submit",className:"self-end",disabled:m,children:[m&&s.jsx(B,{className:"mr-2 h-4 w-4 animate-spin"}),"提交"]})})]})})]})]})}function es(){return s.jsxs("div",{className:"flex flex-col gap-4",children:[Array.from({length:1},(e,r)=>s.jsx("div",{className:"flex flex-col gap-4",children:s.jsxs("div",{className:"grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]",children:[s.jsx(l,{className:"h-9 w-32"}),s.jsx(l,{className:"h-9"})]})},r)),s.jsx("div",{className:"border-b pb-4",children:s.jsx(l,{className:"h-9 w-full"})}),s.jsx("div",{className:"flex gap-2 sm:justify-end",children:s.jsx(l,{className:"h-9 w-20 self-end"})})]})}export{ds as default};
