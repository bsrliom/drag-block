!function(t){var e={};function o(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";o.r(e);o(1);e.default=class{constructor(t,e){this.ctn=document.querySelector("#"+t),this.config=Object.assign({col:4,height:60,margin:[10,10],mode:"y"},e);let o=this.ctn.offsetWidth-this.config.margin[0]*(this.config.col+1);this.config.width=Math.floor(o/this.config.col),this.occupiedList=[],this.dragStart={row:0,col:0},this.bookList=[],this.movingCount=0,this.blockId=1,this.init(),this.bindEvent()}divideArea(){}init(){this.ctn.classList.add("drag-ctn");const t=Array.from(this.ctn.children);let e=0;for(let o of t)o.dataset.row=o.dataset.row?o.dataset.row:Math.floor(e/this.config.col)+1,o.dataset.col=o.dataset.col?o.dataset.col:e%this.config.col+1,o.id="block"+this.blockId++,this.occupiedList.push(o.dataset.row+","+o.dataset.col),o.classList.add("drag-block"),o.style.width=this.config.width+"px",o.style.height=this.config.height+"px",o.style.left=(o.dataset.col-1)*(this.config.width+this.config.margin[0])+this.config.margin[0]+"px",o.style.top=(o.dataset.row-1)*(this.config.height+this.config.margin[1])+this.config.margin[1]+"px",e++}bindEvent(){this.ctn.addEventListener("mousedown",t=>{let e=t.target,o=t.x,n=t.y,i=parseFloat(e.style.left),r=parseFloat(e.style.top);e.classList.contains("drag-block")&&(e.classList.add("dragging"),this.removeOccupied(e),this.dragStart=e.dataset,this.ctn.onmousemove=(t=>{let s=i+t.x-o,a=r+t.y-n,c=this.ctn.offsetWidth-this.config.width,l=this.ctn.offsetHeight-this.config.height;s=(s=s<0?0:s)>c?c:s,a=(a=a<0?0:a)>l?l:a,e.style.left=s+"px",e.style.top=a+"px"}))},!1),this.ctn.addEventListener("mouseup",()=>{this.ctn.onmousemove=null;let t=event.target;if(!t.classList.contains("drag-block"))return!1;let e=this.calcPos(t);this.dragStart.row!=e.row||this.dragStart.col!=e.col?(this.moveIn(t.id,e),("x"===this.config.mode&&e.row!=t.dataset.row||"y"===this.config.mode&&e.col!=t.dataset.col)&&this.moveOut(t.id,t.dataset)):this.moveTo(t.id,e),t.classList.remove("dragging")},!1)}calcPos(t){let e=parseFloat(t.style.left),o=parseFloat(t.style.top),n=Math.round(e/(this.config.width+this.config.margin[0]))+1;return{row:Math.round(o/(this.config.height+this.config.margin[1]))+1,col:n}}bookPos(t,e){this.bookList.push([t,e])}setPos(){for(let t of this.bookList){let e=document.getElementById(t[0]);e.dataset.col=t[1].col,e.dataset.row=t[1].row}this.bookList=[],this.occupiedList=[];let t=document.querySelectorAll(".drag-block");for(let e=0;e<t.length;e++)this.occupiedList.push(t[e].dataset.row+","+t[e].dataset.col)}moveTo(t,e){let o=document.getElementById(t),n=(e.col-1)*(this.config.width+this.config.margin[0])+this.config.margin[0],i=(e.row-1)*(this.config.height+this.config.margin[1])+this.config.margin[1],r={};r.x=(n-parseFloat(o.style.left))/30,r.y=(i-parseFloat(o.style.top))/30,this.bookPos(o.id,e);let s={block:o,step:r,frame:30};window.requestAnimationFrame(this.moveAnimation(s))}moveAnimation(t){let e=this;e.movingCount++;let{block:o,step:n,frame:i}=t;return function t(){i>0?(o.style.left=parseFloat(o.style.left)+n.x+"px",o.style.top=parseFloat(o.style.top)+n.y+"px",i--,window.requestAnimationFrame(t)):(e.movingCount--,0===e.movingCount&&e.setPos())}}removeOccupied(t){let e=t.dataset.row+","+t.dataset.col;for(let t=0;t<this.occupiedList.length;t++)if(this.occupiedList[t]===e){this.occupiedList.splice(t,1);break}}blockSort(t,e){let o=[],n=null;if("x"===this.config.mode){n=document.querySelectorAll('.drag-block[data-row="'+e.row+'"]');for(let e of[...n])e.id!==t&&(o[e.dataset.col-1]=e.id)}else if("y"===this.config.mode){n=document.querySelectorAll('.drag-block[data-col="'+e.col+'"]');for(let e of[...n])e.id!==t&&(o[e.dataset.row-1]=e.id)}else if("left"===this.config.mode){n=document.querySelectorAll(".drag-block");for(let e of[...n])e.id!==t&&(o[(e.dataset.row-1)*this.config.col+(e.dataset.col-1)]=e.id)}return this.removeEmpty(o)}moveIn(t,e){e.row,e.col;let o=this.blockSort(t,e);if("x"===this.config.mode){o.splice(e.col-1,0,t);let n=1;for(let t of o)t&&this.moveTo(t,{row:e.row,col:n++})}else if("y"===this.config.mode){o.splice(e.row-1,0,t);let n=1;for(let t of o)t&&this.moveTo(t,{row:n++,col:e.col})}else if("left"===this.config.mode){let n=(e.row-1)*this.config.col+(e.col-1);o.splice(n,0,t);let i=0;for(let t of o)t&&(this.moveTo(t,{row:Math.floor(i/this.config.col)+1,col:i%this.config.col+1}),i++)}}moveOut(t,e){let o=this.blockSort(t,e);if("x"===this.config.mode){let t=1;for(let n of o)n&&this.moveTo(n,{row:e.row,col:t++})}else if("y"===this.config.mode){let t=1;for(let n of o)n&&this.moveTo(n,{row:t++,col:e.col})}}removeEmpty(t){let e=[];for(let o of t)void 0!==o&&e.push(o);return e}addBlock(t){this.ctn.insertAdjacentHTML("beforeend",t);let e=this.ctn.lastElementChild;e.id="block"+this.blockId++,e.classList.add("drag-block"),e.style.width=this.config.width+"px",e.style.height=this.config.height+"px",e.dataset.col=e.dataset.col?e.dataset.col:1,e.dataset.row=e.dataset.row?e.dataset.row:1,e.style.left=this.config.margin[0]+"px",e.style.top=this.config.margin[1]+"px",this.moveIn(e.id,e.dataset)}removeBlock(t){let e=document.getElementById(t);if(e){let o=e.dataset;this.ctn.removeChild(e),this.moveOut(t,o)}}}},function(t,e,o){var n=o(2);"string"==typeof n&&(n=[[t.i,n,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};o(4)(n,i);n.locals&&(t.exports=n.locals)},function(t,e,o){(t.exports=o(3)(!1)).push([t.i,".drag-ctn {\r\n    position: relative;\r\n}\r\n.drag-block {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    z-index: 2;\r\n}\r\n\r\n.dragging {\r\n    z-index: 9;\r\n}",""])},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var o=function(t,e){var o=t[1]||"",n=t[3];if(!n)return o;if(e&&"function"==typeof btoa){var i=(s=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),r=n.sources.map(function(t){return"/*# sourceURL="+n.sourceRoot+t+" */"});return[o].concat(r).concat([i]).join("\n")}var s;return[o].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(t,o){"string"==typeof t&&(t=[[null,t,""]]);for(var n={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(n[r]=!0)}for(i=0;i<t.length;i++){var s=t[i];"number"==typeof s[0]&&n[s[0]]||(o&&!s[2]?s[2]=o:o&&(s[2]="("+s[2]+") and ("+o+")"),e.push(s))}},e}},function(t,e,o){var n,i,r={},s=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=n.apply(this,arguments)),i}),a=function(t){var e={};return function(t,o){if("function"==typeof t)return t();if(void 0===e[t]){var n=function(t,e){return e?e.querySelector(t):document.querySelector(t)}.call(this,t,o);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}}(),c=null,l=0,f=[],d=o(5);function u(t,e){for(var o=0;o<t.length;o++){var n=t[o],i=r[n.id];if(i){i.refs++;for(var s=0;s<i.parts.length;s++)i.parts[s](n.parts[s]);for(;s<n.parts.length;s++)i.parts.push(y(n.parts[s],e))}else{var a=[];for(s=0;s<n.parts.length;s++)a.push(y(n.parts[s],e));r[n.id]={id:n.id,refs:1,parts:a}}}}function h(t,e){for(var o=[],n={},i=0;i<t.length;i++){var r=t[i],s=e.base?r[0]+e.base:r[0],a={css:r[1],media:r[2],sourceMap:r[3]};n[s]?n[s].parts.push(a):o.push(n[s]={id:s,parts:[a]})}return o}function p(t,e){var o=a(t.insertInto);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=f[f.length-1];if("top"===t.insertAt)n?n.nextSibling?o.insertBefore(e,n.nextSibling):o.appendChild(e):o.insertBefore(e,o.firstChild),f.push(e);else if("bottom"===t.insertAt)o.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=a(t.insertAt.before,o);o.insertBefore(e,i)}}function g(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=f.indexOf(t);e>=0&&f.splice(e,1)}function m(t){var e=document.createElement("style");if(void 0===t.attrs.type&&(t.attrs.type="text/css"),void 0===t.attrs.nonce){var n=function(){0;return o.nc}();n&&(t.attrs.nonce=n)}return v(e,t.attrs),p(t,e),e}function v(t,e){Object.keys(e).forEach(function(o){t.setAttribute(o,e[o])})}function y(t,e){var o,n,i,r;if(e.transform&&t.css){if(!(r="function"==typeof e.transform?e.transform(t.css):e.transform.default(t.css)))return function(){};t.css=r}if(e.singleton){var s=l++;o=c||(c=m(e)),n=x.bind(null,o,s,!1),i=x.bind(null,o,s,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(o=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",v(e,t.attrs),p(t,e),e}(e),n=function(t,e,o){var n=o.css,i=o.sourceMap,r=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||r)&&(n=d(n));i&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var s=new Blob([n],{type:"text/css"}),a=t.href;t.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}.bind(null,o,e),i=function(){g(o),o.href&&URL.revokeObjectURL(o.href)}):(o=m(e),n=function(t,e){var o=e.css,n=e.media;n&&t.setAttribute("media",n);if(t.styleSheet)t.styleSheet.cssText=o;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(o))}}.bind(null,o),i=function(){g(o)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else i()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=s()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var o=h(t,e);return u(o,e),function(t){for(var n=[],i=0;i<o.length;i++){var s=o[i];(a=r[s.id]).refs--,n.push(a)}t&&u(h(t,e),e);for(i=0;i<n.length;i++){var a;if(0===(a=n[i]).refs){for(var c=0;c<a.parts.length;c++)a.parts[c]();delete r[a.id]}}}};var b,w=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function x(t,e,o,n){var i=o?"":n.css;if(t.styleSheet)t.styleSheet.cssText=w(e,i);else{var r=document.createTextNode(i),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(r,s[e]):t.appendChild(r)}}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var o=e.protocol+"//"+e.host,n=o+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var i,r=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(r)?t:(i=0===r.indexOf("//")?r:0===r.indexOf("/")?o+r:n+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")})}}]);