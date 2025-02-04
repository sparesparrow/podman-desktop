import{N as i,r as p,D as j}from"./DocsRenderer-CFRXHY34-DX9wd5-3.js";import{g as T}from"./_commonjsHelpers-CqkleIqs.js";import"./iframe-Ce-8tUxB.js";import"./index-Cu4lwwaE.js";import"./index-7SSfYZ8z.js";import"./index-ogSvIofg.js";var b="DARK_MODE",y,E;function M(){return E||(E=1,y=function t(r,e){if(r===e)return!0;if(r&&e&&typeof r=="object"&&typeof e=="object"){if(r.constructor!==e.constructor)return!1;var n,a,o;if(Array.isArray(r)){if(n=r.length,n!=e.length)return!1;for(a=n;a--!==0;)if(!t(r[a],e[a]))return!1;return!0}if(r.constructor===RegExp)return r.source===e.source&&r.flags===e.flags;if(r.valueOf!==Object.prototype.valueOf)return r.valueOf()===e.valueOf();if(r.toString!==Object.prototype.toString)return r.toString()===e.toString();if(o=Object.keys(r),n=o.length,n!==Object.keys(e).length)return!1;for(a=n;a--!==0;)if(!Object.prototype.hasOwnProperty.call(e,o[a]))return!1;for(a=n;a--!==0;){var u=o[a];if(!t(r[u],e[u]))return!1}return!0}return r!==r&&e!==e}),y}var I=M();const w=T(I);function l(t){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},l(t)}var d;function D(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),e.push.apply(e,n)}return e}function P(t){for(var r=1;r<arguments.length;r++){var e=arguments[r]!=null?arguments[r]:{};r%2?D(Object(e),!0).forEach(function(n){R(t,n,e[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):D(Object(e)).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))})}return t}function R(t,r,e){return r=q(r),r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function q(t){var r=x(t,"string");return l(r)==="symbol"?r:String(r)}function x(t,r){if(l(t)!=="object"||t===null)return t;var e=t[Symbol.toPrimitive];if(e!==void 0){var n=e.call(t,r||"default");if(l(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(t)}function f(t){return L(t)||B(t)||N(t)||K()}function K(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(t,r){if(t){if(typeof t=="string")return g(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);if(e==="Object"&&t.constructor&&(e=t.constructor.name),e==="Map"||e==="Set")return Array.from(t);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return g(t,r)}}function B(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function L(t){if(Array.isArray(t))return g(t)}function g(t,r){(r==null||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}const{global:U}=__STORYBOOK_MODULE_GLOBAL__;__STORYBOOK_MODULE_CORE_EVENTS__;var A=U,Y=A.document,c=A.window,C="sb-addon-themes-3";(d=c.matchMedia)===null||d===void 0||d.call(c,"(prefers-color-scheme: dark)");var m={classTarget:"body",dark:i.dark,darkClass:["dark"],light:i.light,lightClass:["light"],stylePreview:!1,userHasExplicitlySetTheTheme:!1},k=function(r){c.localStorage.setItem(C,JSON.stringify(r))},F=function(r,e){var n=e.current,a=e.darkClass,o=a===void 0?m.darkClass:a,u=e.lightClass,v=u===void 0?m.lightClass:u;if(n==="dark"){var O,h;(O=r.classList).remove.apply(O,f(s(v))),(h=r.classList).add.apply(h,f(s(o)))}else{var S,_;(S=r.classList).remove.apply(S,f(s(o))),(_=r.classList).add.apply(_,f(s(v)))}},s=function(r){var e=[];return e.concat(r).map(function(n){return n})},V=function(r){var e=Y.querySelector(r.classTarget);e&&F(e,r)},G=function(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=c.localStorage.getItem(C);if(typeof e=="string"){var n=JSON.parse(e);return r&&(r.dark&&!w(n.dark,r.dark)&&(n.dark=r.dark,k(n)),r.light&&!w(n.light,r.light)&&(n.light=r.light,k(n))),n}return P(P({},m),r)};V(G());__STORYBOOK_MODULE_PREVIEW_API__;const X={parameters:{controls:{matchers:{color:/(background|color)$/i,date:/Date$/i}},darkMode:{current:"light",darkClass:"dark",lightClass:"light",dark:{...i.dark,appPreviewBg:"transparent"},light:{...i.light,appPreviewBg:"transparent"},stylePreview:!0},docs:{container:t=>{const[r,e]=p.useState(!0);p.useEffect(()=>(t.context.channel.on(b,e),()=>t.context.channel.removeListener(b,e)),[t.context.channel]);const n={...t};return n.theme=r?i.dark:i.light,p.createElement(j,n)}}}};export{X as default};
