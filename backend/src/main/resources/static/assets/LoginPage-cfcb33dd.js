import{c as S,u as v,a as E,b as F,d as N,j as e,N as m,B as L,R as P,P as u}from"./index-a82a2232.js";import{t as R,z as r}from"./index-9b6ca6c3.js";import{u as T,C as k,a as A,b as D,c as I,d as U,F as B,e as p}from"./CustomFormField-b6666a44.js";import{u as M}from"./use-title-71d2f9de.js";import{e as h}from"./rsa-fd848fa5.js";/**
 * @license lucide-react v0.293.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=S("ShieldPlus",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}],["path",{d:"M8 11h8",key:"vwpz6n"}],["path",{d:"M12 15V7",key:"1ycneb"}]]),_="/admin",q=r.object({username:r.string().min(1,"必须输入用户名"),password:r.string().min(1,"必须输入密码")}),z={username:"",password:""};function G(){var i,l,c;M("登录");const t=T({resolver:R(q),defaultValues:z}),x=v(),{auth:f,requestApi:j,setAuth:g}=E(),{loading:o,requestData:w}=F(j),{toast:b}=N(),n=((i=x.state)==null?void 0:i.from)||_;if(f)return e.jsx(m,{to:n,replace:!0});async function y(s,a){return await w({url:"/api/v1/auth/login",method:"POST",bodyData:{username:h(u,s),password:h(u,a)}})}async function C(s){const{data:a,error:d}=await y(s.username,s.password);if(d){b({title:"登录失败",description:d,variant:"destructive"});return}return g(a),e.jsx(m,{to:n,replace:!0})}return e.jsxs(k,{className:"mx-auto mt-8 w-96 md:w-[22rem] lg:mt-24 lg:w-[30rem]",children:[e.jsxs(A,{children:[e.jsx(D,{children:"登录"}),e.jsxs(I,{className:"flex items-center text-green-500 dark:text-green-600",children:[e.jsx(V,{className:"mr-1 h-4 w-4"}),"用户名和密码进行加密传输，且不会被保存在本地"]})]}),e.jsx(U,{children:e.jsx(B,{...t,children:e.jsxs("form",{onSubmit:t.handleSubmit(C),autoComplete:"off",className:"flex flex-col gap-4",children:[e.jsx(p,{control:t.control,name:"username",type:"text",label:"用户名",labelWidth:100,placeholder:"用户名",isError:(l=t.getFieldState("username"))==null?void 0:l.invalid}),e.jsx(p,{control:t.control,name:"password",type:"password",label:"密码",labelWidth:100,placeholder:"密码",isError:(c=t.getFieldState("password"))==null?void 0:c.invalid}),e.jsxs(L,{type:"submit",disabled:o,children:[o&&e.jsx(P,{className:"mr-2 h-4 w-4 animate-spin"}),"登录"]})]})})})]})}export{G as default};