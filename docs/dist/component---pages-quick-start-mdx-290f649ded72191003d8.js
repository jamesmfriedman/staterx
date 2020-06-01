(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{DSOV:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return u})),n.d(t,"default",(function(){return p}));n("5hJT"),n("W1QL"),n("K/PF"),n("t91x"),n("75LO"),n("PJhk");var a=n("/FXl"),o=n("TjRS"),c=n("ZFoC"),r=n("M3Oh"),s=n("ci+y");n("aD51");function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var u={};void 0!==u&&u&&u===Object(u)&&Object.isExtensible(u)&&!u.hasOwnProperty("__filemeta")&&Object.defineProperty(u,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"pages/quick-start.mdx"}});var i={_frontmatter:u},b=o.a;function p(e){var t,n=e.components,p=function(e,t){if(null==e)return{};var n,a,o={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["components"]);return Object(a.b)(b,l({},i,p,{components:n,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"quick-start"},"Quick Start"),Object(a.b)("h2",{id:"install"},"Install"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"npm i staterx rxjs"),"\nor\n",Object(a.b)("inlineCode",{parentName:"p"},"yarn add staterx rxjs")),Object(a.b)("h2",{id:"counter-example"},"Counter Example"),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-js"}),"import { createValue } from 'staterx';\n\n// create a counter\n// counter holds a value and a basic api\n// get, set, reset, and state$\nconst counter = createValue(0);\n\nconsole.log(counter.get()); // logs 0\ncounter.set(1); // update the value\nconsole.log(counter.get()); // logs 1\n")),Object(a.b)("p",null,"In the most basic example, we have a single value that we are creating and updating imperatively. RxJS natives are probably thinking \"isn't this just a Behavior Subject?\" Obviously in this contrived example, it's not obvious that we have any benefit over using a regular variable."),Object(a.b)("p",null,"The real power of this example is that we actualy just created a stateful stream we can hook into by using RxJS as well as an idiomatic api for basic functionality like getting and setting. We can also specify ",Object(a.b)("inlineCode",{parentName:"p"},"effects")," to indicate how we want this variable to change over time."),Object(a.b)("h2",{id:"effects"},"Effects"),Object(a.b)("p",null,"Noun: ",Object(a.b)("em",{parentName:"p"},"a change which is a result or consequence of an action or other cause."),Object(a.b)("br",null),"\nVerb: ",Object(a.b)("em",{parentName:"p"},"cause (something) to happen; bring about.")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},'One of this inspirations for this library was an article (that I can no longer find to link to...) that talked about how state management in JS has gotten out of control over the years. After years of doing Redux we\'ve ended up with Stores, Dispatchers, Actions, Selectors, Thunks, Epics, Sagas, Side Effects, and Actors. For StateRx, these concepts are just called "effects".')),Object(a.b)("p",null,'Effects allow us to specify how we want to change one of our stateful values, and also how we would like to read them through computed changes. If you\'re coming from Redux, you might have heard them referred to as "actions" and "selectors".'),Object(a.b)("p",null,"Lets update our example to be a bit more useful and include some effects."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-js"}),"import { createValue } from 'staterx';\nimport { scan } from 'rxjs/operators';\n\nconst counter = createValue(0, {\n  effects: ({ state$ }) => ({\n    // here we create two functions that describe how we want to change our value\n    increment: () => counter.set(val => val + 1),\n    decrement: () => counter.set(val => val - 1),\n    // here we create an observable that can keep count of the total number of\n    // times our counter has changed, regardless of direction\n    callCount$: state$.pipe(scan(acc => acc + 1, -1))\n  })\n});\n\ncounter.state$.subscribe(val => console.log(val)); // logs 0\ncounter.increment(); // logs 1\ncounter.decrement(); // logs 0\n\n// we can also subscribe to our callCount$ effect\ncounter.callCount$.subscribe(val => console.log(val));\n")),Object(a.b)("h2",{id:"react-example"},"React Example"),Object(a.b)("p",null,"StateRx ships with a hooks for React so you can directly consume your state in your components. Just import ",Object(a.b)("inlineCode",{parentName:"p"},"useRx")," and pass your variable's state$ to the hook. ",Object(a.b)("inlineCode",{parentName:"p"},"useRx")," actually works with more than just StateRx, you can pass any RxJS Observable."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-js"}),"import { createValue, useRx } from 'staterx';\n")),Object(a.b)(c.c,{__position:0,__code:"() => {\n  const [count] = useRx(counter.state$)\n  const [numCalls] = useRx(counter.callCount$)\n  return (\n    <>\n      <button onClick={counter.decrement}>- Decrement</button>\n      <button onClick={counter.increment}>+ Increment</button>\n      <button onClick={counter.reset}>Reset</button>\n      <ul>\n        <li>Count: {count}</li>\n        <li>Num Calls: {numCalls}</li>\n      </ul>\n    </>\n  )\n}",__scope:(t={props:p,DefaultLayout:o.a,Playground:c.c,useRx:r.c,counter:s.e},t.DefaultLayout=o.a,t._frontmatter=u,t),mdxType:"Playground"},(function(){var e=Object(r.c)(s.e.state$)[0],t=Object(r.c)(s.e.callCount$)[0];return Object(a.b)(React.Fragment,null,Object(a.b)("button",{onClick:s.e.decrement},"- Decrement"),Object(a.b)("button",{onClick:s.e.increment},"+ Increment"),Object(a.b)("button",{onClick:s.e.reset},"Reset"),Object(a.b)("ul",null,Object(a.b)("li",null,"Count: ",e),Object(a.b)("li",null,"Num Calls: ",t)))})))}void 0!==p&&p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"pages/quick-start.mdx"}}),p.isMDXComponent=!0}}]);
//# sourceMappingURL=component---pages-quick-start-mdx-290f649ded72191003d8.js.map