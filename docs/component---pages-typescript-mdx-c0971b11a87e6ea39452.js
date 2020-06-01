(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{uago:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return i})),n.d(t,"default",(function(){return l}));n("5hJT"),n("W1QL"),n("K/PF"),n("t91x"),n("75LO"),n("PJhk");var a=n("/FXl"),r=n("TjRS");n("aD51");function o(){return(o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var i={};void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"pages/typescript.mdx"}});var s={_frontmatter:i},c=r.a;function l(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,["components"]);return Object(a.b)(c,o({},s,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"typescript"},"Typescript"),Object(a.b)("p",null,"Typescript is supported without any additional configuration. StateRx relies heavily on type inference and often times you don't have to do anything to support typesafety."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"import { createValue } from 'staterx';\n\nconst myState = createValue(0);\n\nmyState.get(); // number\n\nmyState.state$.subscribe(val => val); // number\n\nmyState.set('test'); // ERROR\n")),Object(a.b)("h2",{id:"casting-to-type"},"Casting to Type"),Object(a.b)("p",null,"While Typescript's inference engine is incredibly powerful, the current version of it also ships with a long running ",Object(a.b)("em",{parentName:"p"},"bug"),". You can only infer everything or nothing... To get around this with StateRx, instead of passing in a generic type, we cast the initial value to whatever we want."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"import { createValue } from 'staterx';\n\n// What if we want myState to be a number or a string?\nconst myState = createValue(0 as number | string);\n\nmyState.get(); // number | string\n\nmyState.state$.subscribe(val => val); // number | string\n\nmyState.set('test'); // OK\n")),Object(a.b)("p",null,"This becomes extra necessary when dealing with ",Object(a.b)("inlineCode",{parentName:"p"},"createItems")," and ",Object(a.b)("inlineCode",{parentName:"p"},"createArray"),"."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"import { createArray } from 'staterx';\n\ntype Todo = {\n  id: string;\n  text: string;\n  completed: boolean;\n}\n\nconst myState = createArray([] as Todo[]);\n")),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"import { createItems } from 'staterx';\n\ntype Todo = {\n  id: string;\n  text: string;\n  completed: boolean;\n}\n\nconst myState = createItems({} as {[id: string]: Todo});\n")),Object(a.b)("p",null,"Alternatively, you can just declare your initial state with a type."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"import { createArray } from 'staterx';\n\ntype Todo = {\n  id: string;\n  text: string;\n  completed: boolean;\n}\n\nconst initialState: Todo[] = [];\n\nconst myState = createArray(initialState);\n")),Object(a.b)("p",null,"Lastly, DON'T do this!!! Ideally, this is what you would want to do, but for now due to the bug in TS, it won't work."),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-ts"}),"// DON'T DO THIS!\n// While it is perfectly valid Typescript\n// it breaks inference of other generics\nconst myState = createArray<Todo>([]);\n// If you did this, you just broke a lot of your typesafety\n")))}void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"pages/typescript.mdx"}}),l.isMDXComponent=!0}}]);
//# sourceMappingURL=component---pages-typescript-mdx-c0971b11a87e6ea39452.js.map