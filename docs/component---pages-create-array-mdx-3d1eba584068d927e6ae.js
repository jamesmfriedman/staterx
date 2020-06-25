(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{lMxr:function(e,t,a){"use strict";a.r(t),a.d(t,"_frontmatter",(function(){return s})),a.d(t,"default",(function(){return o}));a("5hJT"),a("W1QL"),a("K/PF"),a("t91x"),a("75LO"),a("PJhk");var n=a("/FXl"),r=a("TjRS");a("aD51");function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var s={};void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!s.hasOwnProperty("__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"pages/create-array.mdx"}});var b={_frontmatter:s},c=r.a;function o(e){var t=e.components,a=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,["components"]);return Object(n.b)(c,l({},b,a,{components:t,mdxType:"MDXLayout"}),Object(n.b)("h1",{id:"createarray"},"createArray"),Object(n.b)("p",null,"Creates an observable array. The methods implemented mi"),Object(n.b)("blockquote",null,Object(n.b)("p",{parentName:"blockquote"},"To avoid any confusion with immutable methods like map and reduce, StateRx has only implemented the mutable properties of arrays. Additionally, methods such as pop don't immediately return values. You should subscribe to state$ to get newly emitted values.")),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"createArray(opts: DefaultOptions);\n")),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"const myState = createArray({default: [1, 2, 3]});\n")),Object(n.b)("h2",{id:"get"},"get"),Object(n.b)("p",null,"Returns the current array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.get(); // returns [1, 2, 3]\n")),Object(n.b)("h2",{id:"set"},"set"),Object(n.b)("p",null,"Sets the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.set([1, 2]);\nmyState.set(currentValue => [1, 2]);\n")),Object(n.b)("h2",{id:"reset"},"reset"),Object(n.b)("p",null,"Reset to initial value."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.reset();\n")),Object(n.b)("h2",{id:"push"},"push"),Object(n.b)("p",null,"Adds one or more elements to the end of the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.push(4);\nmyState.push(4,5);\n")),Object(n.b)("h2",{id:"pop"},"pop"),Object(n.b)("p",null,"Removes the last element from the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.pop();\n")),Object(n.b)("h2",{id:"shift"},"shift"),Object(n.b)("p",null,"Removes the first element from the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.shift();\n")),Object(n.b)("h2",{id:"unshift"},"unshift"),Object(n.b)("p",null,"Adds one or more elements to the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.shift();\n")),Object(n.b)("h2",{id:"reverse"},"reverse"),Object(n.b)("p",null,"Reverses the array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.reverse();\n")),Object(n.b)("h2",{id:"sort"},"sort"),Object(n.b)("p",null,"Sorts the array based on the compare function provided."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.sort((a, b) => a - b);\n")),Object(n.b)("h2",{id:"splice"},"splice"),Object(n.b)("p",null,"Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.splice(0, 1);\n")),Object(n.b)("h2",{id:"state"},"state$"),Object(n.b)("p",null,"An Observable of the current array,"),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"myState.state$.subscribe(val => console.log(val)); // returns [1, 2, 3]\n")),Object(n.b)("h2",{id:"byindex"},"byIndex"),Object(n.b)("p",null,"Creates an observable that emits an element by index."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"// always emit whatever the second index is anytime the array changes\nmyState.byIndex(2).subscribe(val => console.log(val))\n")),Object(n.b)("h2",{id:"slice"},"slice"),Object(n.b)("p",null,"Creates an observable that emits a new section of an array. This takes all of the same arguments as the native slice function."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"// emits whatever the first 2 items are anytime the array changes.\nmyState.slice(0, 2).subscribe(val => console.log(val))\n")),Object(n.b)("h2",{id:"immutable-functions"},"Immutable Functions"),Object(n.b)("p",null,"What about immutable functions like ",Object(n.b)("inlineCode",{parentName:"p"},"map")," and ",Object(n.b)("inlineCode",{parentName:"p"},"reduce"),"? As stated in the intro, that have been purposely left out to avoid confusion. But you can still use the native built in ones with the set method if you would like to modify the existing array."),Object(n.b)("pre",null,Object(n.b)("code",l({parentName:"pre"},{className:"language-js"}),"// Map over the current array and set a new value\nmyState.set(currVal => currVal.map(val => val + 1));\n\n// Map over the current array and return it. This will not impact the current state of myState at all.\nconst newArr = myState.get().map(val => val + 1));\n")))}void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&!o.hasOwnProperty("__filemeta")&&Object.defineProperty(o,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"pages/create-array.mdx"}}),o.isMDXComponent=!0}}]);
//# sourceMappingURL=component---pages-create-array-mdx-3d1eba584068d927e6ae.js.map