(this["webpackJsonpstaterx-pong"]=this["webpackJsonpstaterx-pong"]||[]).push([[0],{39:function(e,t,n){e.exports=n(45)},44:function(e,t,n){},45:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(34),i=n.n(a),o=(n(44),n(37)),u=n(38),s=n(49),l=n(54),f=n(48),h=n(35),d=(n(50),function(e){return function(t){return e.next(t),t}}),g=function(e){return e.type.split("/",2).join("/")},v=n(36),m=function(){return(m=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var c in t=arguments[n])Object.prototype.hasOwnProperty.call(t,c)&&(e[c]=t[c]);return e}).apply(this,arguments)},p=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(r=Object.getOwnPropertySymbols(e);c<r.length;c++)t.indexOf(r[c])<0&&Object.prototype.propertyIsEnumerable.call(e,r[c])&&(n[r[c]]=e[r[c]])}return n},b=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),c=0;for(t=0;t<n;t++)for(var a=arguments[t],i=0,o=a.length;i<o;i++,c++)r[c]=a[i];return r},w=["SET","RESET"],y=function e(t,n,r){var c,a=n.name,i=void 0===a?Math.random().toString(36).substring(2,10):a,o=n.autoRun,g=void 0===o||o,y=n.reducer,E=void 0===y?function(e){return e}:y,O=r.state$,j=r.constants,x=r.createReducer,$=r.createActions,M=r.createSelectors,S=function(e,t){return t.reduce((function(t,n){return t[n]=function(e,t){return e+"/"+t}(e,n),t}),{})}(i,b(w,j)),R=function(){return O.getValue()},k=function(e){var t=e.constant,n=e.get,r=new u.a,c=new u.a,a=Object(l.a)(r,c.pipe(Object(v.a)((function(e){return e})))),i=d(r);return{action$:a,set:function(e){return e="function"===typeof e?e(n()):e,i({type:t.SET,data:e})},reset:function(){return i({type:t.RESET})},dispatch:i,_dispatchers$:c}}({constant:S,get:R}),N=k.action$,P=k.dispatch,D=p(k,["action$","dispatch"]),T=p($({constant:S,get:R,dispatch:P}),[]),Y=null===M||void 0===M?void 0:M(O),A=function(e){var t=e.initialState,n=e.constant,r=e.reducer,c=e.userReducer;return function(e,a){switch(a.type.split("/",2).join("/")){case n.SET:return a.data;case n.RESET:return t;default:var i=r(e,a);return i===e?c(e,a):i}}}({constant:S,initialState:t,reducer:x({constant:S}),userReducer:E}),I=N.pipe(Object(h.a)((function(e){return A(O.getValue(),e)})),Object(f.a)()),V=function(){return I.subscribe(O)},W=m(m(m(m({},T),Y),D),{name:i,state$:O,action$:N,constant:S,run:V,get:R,clone:function(t){return void 0===t&&(t=R()),e(t,n,m(m({},r),{state$:new s.a(t)}))},dispatch:P,_reducer$:I}),X=null===(c=n.effects)||void 0===c?void 0:c.call(n,W);return g&&V(),m(m({},W),X)},E=function(){return(E=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var c in t=arguments[n])Object.prototype.hasOwnProperty.call(t,c)&&(e[c]=t[c]);return e}).apply(this,arguments)},O=function(e){var t=e.constant,n=e.dispatch;return{merge:function(e){return n({type:t.MERGE,data:e})}}},j=function(e){var t=e.constant;return function(e,n){switch(g(n)){case t.MERGE:return E(E({},e),n.data);default:return e}}},x=function(e,t){return void 0===t&&(t={}),y(e,t,{state$:new s.a(e),constants:["MERGE"],createActions:O,createReducer:j})};function $(e,t){var n=Object(r.useMemo)((function(){return"function"===typeof e?e():e}),t),c=Object(r.useState)("getValue"in n?n.getValue():void 0),a=c[0],i=c[1];return Object(r.useLayoutEffect)((function(){var e=n.subscribe(i,(function(e){i((function(){throw e}))}));return function(){e.unsubscribe()}}),[n]),a}var M,S,R=n(25),k=n(55),N=n(51),P=n(52),D=n(56),T=n(32),Y=n(57),A=n(53),I=function(e,t){var n=2*Math.max(0,t.y-e.y-t.height+t.height/2)/e.height-1;return Math.max(-1,Math.min(1,n))},V=function(e,t){return Math.random()*(t-e)+e},W=function(){return Math.random()>=.5},X=Object(k.a)(1/60*1e3),G=Object(N.a)(document,"keydown"),z=Object(N.a)(document,"keyup"),B=Object(N.a)(window,"resize").pipe(Object(P.a)(200)),C=(void 0===(S={effects:function(e){var t=e.set;return{increase:function(){return t((function(e){return 1.1*e}))}}}})&&(S={}),y(M=500/60,S,{state$:new s.a(M),constants:[],createActions:function(){return{}},createReducer:function(){return function(e){return e}}})),H=x({width:window.innerWidth,height:window.innerHeight}),J=x({x:H.get().width/2-16,y:H.get().height/2-16,width:32,height:32,dirX:W()?1:-1,dirY:V(-1,1)},{effects:function(){return{serve:function(){C.reset(),J.merge({x:H.get().width/2-16,y:H.get().height/2-16,dirX:W()?1:-1,dirY:V(-1,1)})},tick:function(){for(var e,t,n=C.get(),r=_.get(),c=F.get(),a=J.get(),i=H.get(),o=i.width,u=i.height,s=a.x,l=a.y,f=a.dirX,h=a.dirY,d=l+h*n,g={x:s+f*n,y:d,dirY:d<0||d>u?-1*h:h,width:a.width,height:a.height},v=0,m=[r,c];v<m.length;v++){var p=m[v];if(t=g,!((e=p).y+e.height<t.y||e.y>t.y+t.height||e.x+e.width<t.x||e.x>t.x+t.width))return C.increase(),J.merge(Object(R.a)(Object(R.a)({},g),{},{dirX:-1*f,dirY:I(p,a)}))}if(s<0||s>o)return s<0&&_.scorePoint(),s>o&&F.scorePoint(),J.serve();J.merge(g)}}}}),U=x({x:0,y:0,width:0,height:0,moveDir:0,score:0},{effects:function(e){return{score$:e.state$.pipe(Object(D.a)("score"),Object(T.a)((function(e){return e.score}))),moveUp:function(){return e.merge({moveDir:-1})},moveDown:function(){return e.merge({moveDir:1})},stopMove:function(){return e.merge({moveDir:0})},scorePoint:function(){return e.set((function(e){return Object(R.a)(Object(R.a)({},e),{},{score:e.score+1})}))},tick:function(){var t=e.get(),n=t.moveDir,r=t.y,c=t.height,a=C.get();n&&e.merge({y:1===n?Math.min(H.get().height-c,r+a):Math.max(0,r-a)})}}}}),_=U.clone({x:128,y:H.get().height/2-64,width:16,height:128,moveDir:0,score:0}),F=U.clone({x:H.get().width-128,y:H.get().height/2-64,width:16,height:128,moveDir:0,score:0});function L(){var e=Object(r.useRef)(null);return Object(r.useEffect)((function(){var t=e.current,n=t.getContext("2d"),r=function(e){var t=e.get(),r=t.x,c=t.y,a=t.width,i=t.height;n.fillRect(r,c,a,i)};J.state$.subscribe((function(){!function(){var e=H.get();t.width=e.width,t.height=e.height,n.clearRect(0,0,t.width,t.height),n.fillStyle="greenyellow"}(),function(){var e=J.get(),t=e.x,r=e.y,c=e.width/2,a=t+c,i=r+c,o=c;n.beginPath(),n.arc(a,i,o,0,2*Math.PI,!1),n.fill()}(),r(_),r(F)}))}),[]),c.a.createElement("canvas",{className:"canvas",ref:e})}function q(){var e=$(_.score$),t=$(F.score$);return c.a.createElement("div",{className:"scores"},c.a.createElement("div",{className:"score"},e),c.a.createElement("div",{className:"score"},t))}var K=function(){return c.a.createElement("div",{className:"board"},c.a.createElement(q,null),c.a.createElement(L,null))};function Q(e){var t=$(e.state.state$);return c.a.createElement("div",{className:"paddle",style:{transform:"translate(".concat(t.x,"px, ").concat(t.y,"px)")}})}function Z(){var e=$(J.state$);return c.a.createElement("div",{className:"ball",style:{transform:"translate(".concat(e.x,"px, ").concat(e.y,"px)")}})}function ee(){var e=$(_.score$),t=$(F.score$);return c.a.createElement("div",{className:"scores"},c.a.createElement("div",{className:"score"},e),c.a.createElement("div",{className:"score"},t))}var te=function(){return c.a.createElement("div",{className:"board"},c.a.createElement(ee,null),c.a.createElement(Q,{state:_}),c.a.createElement(Q,{state:F}),c.a.createElement(Z,null))};var ne=function(){var e=Object(r.useState)("html"),t=Object(o.a)(e,2),n=t[0],a=t[1];return Object(r.useEffect)((function(){!function(){var e=X.pipe(Object(Y.a)((function(){J.tick(),_.tick(),F.tick()}))).subscribe(),t=G.pipe(Object(T.a)((function(e){return e.which})),Object(T.a)((function(e){var t=[38,40].includes(e)?F:_;switch(e){case 38:case 87:t.moveUp();break;case 40:case 83:t.moveDown()}return t})),Object(A.a)((function(e){return z.pipe(Object(Y.a)((function(){return e.stopMove()})))}))).subscribe(),n=B.subscribe((function(){H.set({width:window.innerWidth,height:window.innerHeight}),F.merge({x:H.get().width-128})}))}()}),[]),c.a.createElement(c.a.Fragment,null,c.a.createElement("button",{style:{zIndex:9,position:"absolute"},onClick:function(){return a("canvas"===n?"html":"canvas")}},"Toggle"),"canvas"===n?c.a.createElement(K,null):c.a.createElement(te,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(ne,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[39,1,2]]]);
//# sourceMappingURL=main.899a8529.chunk.js.map