import{g as x,h,a as p,j as s,B as j,R as g,i as b}from"./index-f29c37fe.js";import{a as f}from"./use-refresh-e248a172.js";import{u as w}from"./use-title-bfe6ef72.js";const N="https://dummyjson.com";async function R(a){const{status:t,data:e,error:r}=await x({...a,url:`${N}${a.url}`});return r?{status:t,error:typeof r=="string"?r:r.message}:{status:t,data:e}}function _(){w("随机商品");const[a,t]=h.useState(0),{data:e,loading:r,error:o,requestData:i,discardRequest:m}=p(R),l=`/products/${Math.floor(Math.random()*110)}`;f(()=>{const d=Date.now();return c().then(),()=>m({url:l},d)});async function c(){const{data:d}=await i({url:l});d&&t(u=>u+1)}return s.jsxs("div",{className:"mx-auto grid max-w-md grid-cols-1 grid-rows-[2rem_8rem_3rem_2rem] place-items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-950 lg:max-w-2xl",children:[s.jsxs("div",{className:"row-span-1",children:[r&&s.jsx(n,{label:"加载中..."}),!r&&o&&s.jsx(n,{label:o,isError:!0}),!r&&!o&&e&&s.jsx(n,{label:`${e.id} - ${e.title}`})]}),s.jsxs("div",{className:"row-span-1",children:[!e&&s.jsx("div",{className:"h-32 w-32 rounded-full border border-gray-300 bg-gradient-to-r from-slate-100 to-slate-300 object-cover shadow-sm"}),!r&&!o&&e&&s.jsx("img",{src:e.thumbnail,alt:e.title,className:"h-32 w-32 rounded-full border border-gray-300 object-cover shadow-sm"})]}),s.jsx("div",{className:"row-span-1",children:s.jsxs(j,{onClick:c,className:"my-4",disabled:r,children:[r&&s.jsx(g,{className:"mr-2 h-4 w-4 animate-spin"}),"获取商品"]})}),s.jsx("div",{className:"row-span-1",children:s.jsxs("p",{children:["已加载 ",s.jsx("strong",{children:a})," 个商品"]})})]})}function n({label:a,isError:t=!1}){return s.jsx("h1",{className:b(t&&"text-red-500 dark:text-red-600"),children:a})}export{_ as default};
