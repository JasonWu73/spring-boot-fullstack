import{R as u,b as s}from"./index-132372d4.js";function f(e){const t=u.useRef(e);return u.useLayoutEffect(()=>{t.current=e},[e]),t}function r(e){const t=u.useRef(e);return u.useLayoutEffect(()=>{t.current=e},[e]),t}function a(e){const t=s(),n=f(e);u.useEffect(()=>{const c=n.current();return()=>c&&c()},[t.key,n])}function i(e){u.useEffect(()=>{const t=document.title;return e&&(document.title=e),()=>{document.title=t}},[e])}export{a,r as b,i as u};
