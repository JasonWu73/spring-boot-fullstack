import{p as c,j as e,B as b}from"./index-f29c37fe.js";import{z as r,t as h}from"./index-a1d6eb7d.js";import{u as p,C as x,a as g,b as u,d as y,F as f,e as d,V as j,m as F}from"./CustomFormField-a6762e0b.js";import{u as D}from"./use-title-bfe6ef72.js";const N=r.object({name:r.string().min(1,"必须输入姓名").trim(),image:r.string().url({message:"图片必须是有效的 URL"}).trim(),birthday:r.date({required_error:"必须选择好友生日"}).max(new Date,"生日不能是未来的日期")}),S={name:"",image:"https://i.pravatar.cc/150",birthday:void 0};function W(){var l,i,n;D("添加好友");const a=p({resolver:h(N),defaultValues:S}),{dispatch:s}=c();function m(t){const o=Date.now();s({type:"ADD_FRIEND",payload:{id:o,name:t.name,image:`${t.image}?u=${o}`,birthday:F(t.birthday,"yyyy-MM-dd"),balance:0,creditRating:0}}),s({type:"SHOW_ADD_FRIEND_FORM",payload:!1})}return e.jsxs(x,{className:"bg-amber-100 text-slate-950 dark:bg-amber-100 dark:text-slate-950",children:[e.jsx(g,{children:e.jsx(u,{children:"添加好友"})}),e.jsx(y,{children:e.jsx(f,{...a,children:e.jsxs("form",{onSubmit:a.handleSubmit(m),className:"flex flex-col gap-4",children:[e.jsx(d,{control:a.control,name:"name",type:"text",label:"👫 好友名字",labelWidth:100,placeholder:"好友名字",isError:(l=a.getFieldState("name"))==null?void 0:l.invalid,className:"bg-slate-50"}),e.jsx(d,{control:a.control,name:"image",type:"text",label:"🌄 图片网址",labelWidth:100,placeholder:"图片网址",isError:(i=a.getFieldState("image"))==null?void 0:i.invalid,className:"bg-slate-50"}),e.jsx(j,{control:a.control,name:"birthday",label:"🎂 好友生日",labelWidth:100,placeholder:"选择好友生日",disabledWhen:t=>t>new Date||t<new Date("1900-01-01"),isError:(n=a.getFieldState("birthday"))==null?void 0:n.invalid,className:"bg-slate-50"}),e.jsx(b,{type:"submit",className:"self-end",children:"添加"})]})})})]})}export{W as AddFriend};
