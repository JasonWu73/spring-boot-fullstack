import{v as F,a as v,b as C,d as P,j as e,B as j,R as T,Q as E,T as N,P as A}from"./index-a82a2232.js";import{t as I,z as a}from"./index-9b6ca6c3.js";import{u as U,C as W,a as R,b as D,c as O,d as B,F as q,e as t,x as H,y as L}from"./CustomFormField-b6666a44.js";import{C as M}from"./Code-37b130dd.js";import{u as Y}from"./use-title-71d2f9de.js";import{e as _}from"./rsa-fd848fa5.js";const z=[E,N],K=a.object({username:a.string().min(1,"必须输入用户名").trim(),nickname:a.string().min(1,"必须输入昵称").trim(),password:a.string().min(1,"必须输入密码"),confirmPassword:a.string().min(1,"必须输入确认密码"),authorities:a.array(a.record(a.string().trim())),remark:a.string().trim()}).refine(({password:r,confirmPassword:i})=>r===i,{message:"密码和确认密码必须相同",path:["confirmPassword"]}),Q={username:"",nickname:"",password:"",confirmPassword:"",authorities:[],remark:""};function ee(){var u,p,h,x,f,b;Y("新增用户");const r=U({resolver:I(K),defaultValues:Q}),i=F(),{requestApi:g}=v(),{loading:o,requestData:w}=C(g),{toast:m}=P();async function k({username:s,nickname:n,password:l,authorities:d,remark:y}){return await w({url:"/api/v1/users",method:"POST",bodyData:{username:s,nickname:n,password:_(A,l),authorities:d,remark:y}})}async function S(s){const{status:n,error:l}=await k({username:s.username,nickname:s.nickname,password:s.password,authorities:s.authorities.map(d=>d.value),remark:s.remark});if(n!==204){m({title:"新增用户失败",description:l,variant:"destructive"});return}m({title:"新增用户成功",description:e.jsxs("span",{children:["成功新增用户 ",e.jsx(M,{children:s.username})]})}),c()}function c(){return i("/users")}return e.jsxs(W,{className:"mx-auto w-full md:w-4/5 lg:w-2/3",children:[e.jsxs(R,{children:[e.jsx(D,{children:"新增用户"}),e.jsx(O,{children:"创建可登录系统的账号"})]}),e.jsx(B,{children:e.jsx(q,{...r,children:e.jsxs("form",{onSubmit:r.handleSubmit(S),className:"flex flex-col gap-4",children:[e.jsx(t,{control:r.control,name:"username",type:"text",label:"用户名",labelWidth:60,placeholder:"用户名",isError:(u=r.getFieldState("username"))==null?void 0:u.invalid}),e.jsx(t,{control:r.control,name:"nickname",type:"text",label:"昵称",labelWidth:60,placeholder:"昵称",isError:(p=r.getFieldState("nickname"))==null?void 0:p.invalid}),e.jsx(t,{control:r.control,name:"password",type:"password",label:"密码",labelWidth:60,placeholder:"密码",isError:(h=r.getFieldState("password"))==null?void 0:h.invalid}),e.jsx(t,{control:r.control,name:"confirmPassword",type:"password",label:"确认密码",labelWidth:60,placeholder:"确认密码",isError:(x=r.getFieldState("confirmPassword"))==null?void 0:x.invalid}),e.jsx(H,{control:r.control,name:"authorities",label:"功能权限",labelWidth:60,placeholder:"请选择功能权限",options:z,isError:(f=r.getFieldState("authorities"))==null?void 0:f.invalid}),e.jsx(L,{control:r.control,name:"remark",label:"备注",labelWidth:60,placeholder:"备注",isError:(b=r.getFieldState("remark"))==null?void 0:b.invalid}),e.jsxs("div",{className:"flex gap-2 sm:justify-end",children:[e.jsx(j,{onClick:c,type:"button",variant:"outline",disabled:o,children:"返回"}),e.jsxs(j,{type:"submit",className:"self-end",disabled:o,children:[o&&e.jsx(T,{className:"mr-2 h-4 w-4 animate-spin"}),"提交"]})]})]})})})]})}export{ee as default};
