import{s as h,f as x,b as j,g as p,j as s,B as f,R as b,h as g}from"./index-9c64216f.js";import{u as w}from"./use-title-267496f4.js";const N="https://dummyjson.com";async function v(t){const{status:a,data:r,error:e}=await h({...t,url:`${N}${t.url}`});return e?typeof e=="string"?{status:a,error:e}:{status:a,error:e.message}:{status:a,data:r}}function k(){w("随机商品");const[t,a]=x.useState(0),{data:r,loading:e,error:o,fetchData:i,discardFetch:m}=j(v),c=`/products/${Math.floor(Math.random()*110)}`;p(()=>{const d=Date.now();return l().then(),()=>m({url:c},d)});async function l(){const{data:d}=await i({url:c});d&&a(u=>u+1)}return s.jsxs("div",{className:"mx-auto grid w-[500px] grid-cols-1 grid-rows-[2rem_8rem_3rem_2rem] place-items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-950",children:[s.jsxs("div",{className:"row-span-1",children:[e&&s.jsx(n,{label:"加载中..."}),!e&&o&&s.jsx(n,{label:o,isError:!0}),!e&&!o&&r&&s.jsx(n,{label:`${r.id} - ${r.title}`})]}),s.jsxs("div",{className:"row-span-1",children:[!r&&s.jsx("div",{className:"h-32 w-32 rounded-full border border-gray-300 bg-gradient-to-r from-slate-100 to-slate-300 object-cover shadow-sm"}),!e&&!o&&r&&s.jsx("img",{src:r.thumbnail,alt:r.title,className:"h-32 w-32 rounded-full border border-gray-300 object-cover shadow-sm"})]}),s.jsx("div",{className:"row-span-1",children:s.jsxs(f,{onClick:l,className:"my-4",disabled:e,children:[e&&s.jsx(b,{className:"mr-2 h-4 w-4 animate-spin"}),"获取商品"]})}),s.jsx("div",{className:"row-span-1",children:s.jsxs("p",{children:["已加载 ",s.jsx("strong",{children:t})," 个商品"]})})]})}function n({label:t,isError:a=!1}){return s.jsx("h1",{className:g(a&&"text-red-500 dark:text-red-600"),children:t})}export{k as default};
