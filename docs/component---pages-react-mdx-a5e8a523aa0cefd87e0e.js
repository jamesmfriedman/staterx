(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{jiOu:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return p})),n.d(t,"default",(function(){return f}));n("2Tod"),n("ABKx"),n("5hJT"),n("W1QL"),n("K/PF"),n("t91x"),n("75LO"),n("PJhk");var o=n("/FXl"),a=n("TjRS"),r=n("ZFoC"),c=n("M3Oh"),s=n("ci+y");n("aD51");function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function b(){return(b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var p={};void 0!==p&&p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"pages/react.mdx"}});var d={_frontmatter:p},m=a.a;function f(e){var t,n,l,u=e.components,f=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,["components"]);return Object(o.b)(m,b({},d,f,{components:u,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"react"},"React"),Object(o.b)("p",null,"StateRx has built in React support through hooks. The ",Object(o.b)("inlineCode",{parentName:"p"},"useRx")," hook actually work with ANY Observable, not just StateRx Objects. The following example creates a value and consumes both the ",Object(o.b)("inlineCode",{parentName:"p"},"state$")," and the custom ",Object(o.b)("inlineCode",{parentName:"p"},"callCount$")," Observable."),Object(o.b)("p",null,"First, lets create a StateRx Objects to consume in our React component."),Object(o.b)("pre",null,Object(o.b)("code",b({parentName:"pre"},{className:"language-js"}),"import { createValue, useRx } from 'staterx';\nimport { scan } from 'rxjs/operators';\n\nconst counter = createValue(0, {\n  effects: ({ state$ }) => ({\n    // here we create two functions that describe how we want to change our value\n    increment: () => counter.set(val => val + 1),\n    decrement: () => counter.set(val => val - 1),\n    // here we create an observable that can keep count of the total number of\n    // times our counter has changed, regardless of direction\n    callCount$: state$.pipe(scan(acc => acc + 1, -1))\n  })\n});\n")),Object(o.b)("h2",{id:"userx"},"useRx"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"useRx")," takes two arguments, an Observable and an optional dependencies list for memoization."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Attention")," Since Observables don't always have default values, be aware that your state's value might initially be ",Object(o.b)("inlineCode",{parentName:"p"},"undefined")," on the first render since subscriptions in RxJS are async. Typescript will alert you of this potential issue, but for non Typescript users be aware that having a default value fallback is always a safe idea."),Object(o.b)(r.c,{__position:0,__code:"() => {\n  const count = useRx(counter.state$)\n  const numCalls = useRx(counter.callCount$)\n  return (\n    <>\n      <button onClick={counter.decrement}>- Decrement</button>\n      <button onClick={counter.increment}>+ Increment</button>\n      <button onClick={counter.reset}>Reset</button>\n      <ul>\n        <li>Count: {count}</li>\n        <li>Num Calls: {numCalls}</li>\n      </ul>\n    </>\n  )\n}",__scope:(t={props:f,DefaultLayout:a.a,Playground:r.c,useRx:c.c,counter:s.e,todos:s.f,colors:s.d,ComponentA:s.a,ComponentB:s.b,SetColors:s.c},t.DefaultLayout=a.a,t._frontmatter=p,t),mdxType:"Playground"},(function(){var e=Object(c.c)(s.e.state$),t=Object(c.c)(s.e.callCount$);return Object(o.b)(React.Fragment,null,Object(o.b)("button",{onClick:s.e.decrement},"- Decrement"),Object(o.b)("button",{onClick:s.e.increment},"+ Increment"),Object(o.b)("button",{onClick:s.e.reset},"Reset"),Object(o.b)("ul",null,Object(o.b)("li",null,"Count: ",e),Object(o.b)("li",null,"Num Calls: ",t)))})),Object(o.b)("h2",{id:"memoization-and-observable-factories"},"Memoization and Observable Factories"),Object(o.b)("p",null,"There are plenty of situations where consuming an effect requires passing some parameters to create an Observable. A basic use case is selecting an item by id. For these situations the ",Object(o.b)("inlineCode",{parentName:"p"},"useRx")," hook can handle memoization. Just pass a function that returns an Observable and a list of dependencies."),Object(o.b)("p",null,"The example below uses ",Object(o.b)("inlineCode",{parentName:"p"},"createItems")," to create a list of todos. ",Object(o.b)("inlineCode",{parentName:"p"},"createItems")," comes with a bunch of useful built in effects, in this case we're going to use the ",Object(o.b)("inlineCode",{parentName:"p"},"byId")," effect. The example below is editable, you can modify the id and ",Object(o.b)("inlineCode",{parentName:"p"},"useRx")," will respond accordingly."),Object(o.b)("pre",null,Object(o.b)("code",b({parentName:"pre"},{className:"language-js"}),"import { creatItems, useRx } from 'staterx';\n\nconst todos = createItems({\n  '1': {id: '1', text: 'First Todo', completed: false},\n  '2': {id: '2', text: 'Second Todo', completed: false},\n  '3': {id: '3', text: 'Third Todo', completed: false},\n});\n")),Object(o.b)(r.c,{__position:1,__code:"() => {\n  const id = '1'\n  const todo = useRx(() => todos.byId(id), [id])\n\n  if (!todo) {\n    return <>Todo Not Found</>\n  }\n\n  return (\n    <label htmlFor={todo.id}>\n      <input\n        id={todo.id}\n        type=\"checkbox\"\n        value={todo.checked}\n        onChange={evt =>\n          todos.merge({\n            ...todo,\n            completed: evt.currentTarget.checked,\n          })\n        }\n      />\n      {todo.text}\n    </label>\n  )\n}",__scope:(n={props:f,DefaultLayout:a.a,Playground:r.c,useRx:c.c,counter:s.e,todos:s.f,colors:s.d,ComponentA:s.a,ComponentB:s.b,SetColors:s.c},n.DefaultLayout=a.a,n._frontmatter=p,n),mdxType:"Playground"},(function(){var e=Object(c.c)((function(){return s.f.byId("1")}),["1"]);return e?Object(o.b)("label",{htmlFor:e.id},Object(o.b)("input",{id:e.id,type:"checkbox",value:e.checked,onChange:function(t){return s.f.merge(i(i({},e),{},{completed:t.currentTarget.checked}))}}),e.text):Object(o.b)(React.Fragment,null,"Todo Not Found")})),Object(o.b)("h2",{id:"cross-component-communication"},"Cross Component Communication"),Object(o.b)("p",null,"There are many different ways to share state between components such as Context, Providers, Lifted State, Global Stores. StateRx makes this behavior dummy proof. As long as you are using the ",Object(o.b)("inlineCode",{parentName:"p"},"useRx")," hook, it just ",Object(o.b)("em",{parentName:"p"},"works"),". "),Object(o.b)("p",null,"Here is a contrived example. We have three components, we can use the set method of our StateRx Objects to update the value, and two other components can respond accordingly. To make the example a little more dynamic, we've added a delay to the second observable so ComponentB will change color slightly after ComponentA."),Object(o.b)("p",null,"Components do not have to be parents, children, siblings, or even in the same files. They will re-render whenever the Observable emits a new value."),Object(o.b)("pre",null,Object(o.b)("code",b({parentName:"pre"},{className:"language-js"}),"import { useRx } from 'staterx';\nimport { delay } from 'rxjs/operators';\n\nconst colors = createValue('red');\n\nexport function ComponentA() {\n  const backgroundColor = useRx(colors.state$);\n  return (\n    <div\n      className=\"colorExample\"\n      style={{\n        backgroundColor\n      }}\n    >\n      A\n    </div>\n  );\n}\n\nexport function ComponentB() {\n  const backgroundColor = useRx(() => colors.state$.pipe(delay(500)));\n  return (\n    <div\n      className=\"colorExample\"\n      style={{\n        backgroundColor\n      }}\n    >\n      B\n    </div>\n  );\n}\n\nexport function SetColors() {\n  return (\n    <>\n      <button onClick={() => colors.set('red')}>Make it Red</button>\n      <button onClick={() => colors.set('blue')}>Make it Blue</button>\n    </>\n  );\n}\n")),Object(o.b)(r.c,{__position:2,__code:"<SetColors />\n<ComponentA />\n<ComponentB />",__scope:(l={props:f,DefaultLayout:a.a,Playground:r.c,useRx:c.c,counter:s.e,todos:s.f,colors:s.d,ComponentA:s.a,ComponentB:s.b,SetColors:s.c},l.DefaultLayout=a.a,l._frontmatter=p,l),mdxType:"Playground"},Object(o.b)(s.c,{mdxType:"SetColors"}),Object(o.b)(s.a,{mdxType:"ComponentA"}),Object(o.b)(s.b,{mdxType:"ComponentB"})))}void 0!==f&&f&&f===Object(f)&&Object.isExtensible(f)&&!f.hasOwnProperty("__filemeta")&&Object.defineProperty(f,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"pages/react.mdx"}}),f.isMDXComponent=!0}}]);
//# sourceMappingURL=component---pages-react-mdx-a5e8a523aa0cefd87e0e.js.map