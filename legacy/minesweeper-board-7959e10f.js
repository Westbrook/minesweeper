System.register(["./chunk-263e54a9.js"],function(e,t){"use strict";var r,s,n,o,a,i,u,c,h,l,d,f,m,g,v;return{setters:[function(e){r=e.k,s=e.l,n=e.m,o=e.a,a=e.b,i=e.c,u=e.d,c=e.e,h=e.f,l=e.g,d=e.h,f=e.i,m=e.j,g=e.n,v=e.o}],execute:function(){var e=Symbol("value");var t={initial:"INIT",states:{INIT:{on:{MINE:"MINE",NOT_MINE:"NOT_MINE"}},NOT_MINE:{on:{MARKED:"MARKED",PLAYED:"PLAYED"}},MINE:{on:{MARKED:"MARKED_MINE",PLAYED:"TRIPPED"}},MARKED:{on:{UNMARKED:"NOT_MINE"}},PLAYED:{on:{}},MARKED_MINE:{on:{UNMARKED:"MINE"}},TRIPPED:{on:{}}}},b=function(e,r){return e?t.states[e].on[r]||e:t.initial},y=new WeakMap,p=r(function(e){return function(t){if(!(t instanceof s)||t instanceof n||"class"!==t.committer.name||t.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");var r=t.committer,o=r.element;y.has(t)||(o.className=r.strings.join(" "));var a=o.classList,i=y.get(t);for(var u in i)u in e||a.remove(u);for(var c in e){var h=e[c];if(!i||h!==i[c])a[h?"add":"remove"](c)}y.set(t,e)}});function E(){var e=f([":host{display:flex;line-height:var(--minesweeper-square-size,25px);text-align:center}.square{cursor:pointer;box-sizing:border-box;width:100%;height:100%;border:4px outset;background:var(--color-square-background,#cecece);font-weight:700;font-family:monospace;font-size:2em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.square:focus{transform:translateZ(0);outline:2px solid var(--color-square-focus,#00f);outline-offset:-10px}.played{border:1px solid var(--color-square-border,#999)}.played:focus{outline-offset:-5px}.low{color:var(--color-danger-low,#00f)}.medium{color:var(--color-danger-medium,green)}.high{color:var(--color-danger-high,red)}.worry{color:var(--color-danger-worry,#8b0000)}.dead{background:var(--color-dead,red)}"]);return E=function(){return e},e}function w(){var e=f(["<button class="," tabindex="," @click="," @contextmenu="," aria-label=",">","</button>"]);return w=function(){return e},e}var M=function(e){function t(){var e;return i(this,t),(e=u(this,c(t).call(this))).state="INIT",e.neighbors=0,e.column=0,e.row=0,e}return o(t,d),a(t,null,[{key:"properties",get:function(){return{canFocus:{type:Boolean,attribute:"can-focus"},neighbors:{type:Number},state:{type:String},column:{type:Number},row:{type:Number}}}}]),a(t,[{key:"_dangerLevel",value:function(){switch(this.state){case"MARKED":case"MARKED_MINE":return"m";case"TRIPPED":return"x";case"PLAYED":return this.neighbors||"";case"MINE":case"NOT_MINE":default:return""}}},{key:"play",value:function(){["MARKED","MARKED_MINE"].includes(this.state)||this.dispatchEvent(new CustomEvent("minesweeper-played"))}},{key:"mark",value:function(e){e.preventDefault(),"PLAYED"!==this.state?this.dispatchEvent(new CustomEvent("minesweeper-marked",{detail:{marked:["MARKED","MARKED_MINE"].includes(this.state)}})):this.play()}},{key:"focus",value:function(){this.shadowRoot.querySelector("button").focus()}},{key:"testDangerLevel",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return"PLAYED"===this.state&&e>t}},{key:"render",value:function(){var e=this._dangerLevel();return h(w(),p({square:!0,played:["PLAYED","TRIPPED"].includes(this.state),low:this.testDangerLevel(e),medium:this.testDangerLevel(e,1),high:this.testDangerLevel(e,2),worry:this.testDangerLevel(e,5),dead:"TRIPPED"===this.state}),this.canFocus?"0":"-1",this.play,this.mark,"".concat(this.squareType," Square: Column ").concat(this.column+1,", Row ").concat(this.column+1),e)}},{key:"squareType",get:function(){switch(this.state){case"PLAYED":return"Played";case"MARKED":case"MARKED_MINE":return"Marked";default:return"Playable"}}}],[{key:"styles",get:function(){return[l(E())]}}]),t}();function N(){var e=f([":host{position:relative;display:grid;flex-grow:1;grid-auto-flow:column;grid-template-columns:repeat(var(--columns),1fr);grid-template-rows:repeat(var(--rows),1fr)}.status{position:absolute;bottom:100%;right:0;line-height:48px}"]);return N=function(){return e},e}function D(){var e=f(["<minesweeper-square .state="," .neighbors="," column="," row="," ?can-focus="," @minesweeper-played="," @minesweeper-marked="," @focus="," @blur=","></minesweeper-square>"]);return D=function(){return e},e}function k(){var e=f(["<div class=status>","/","</div>",""]);return k=function(){return e},e}customElements.define("minesweeper-square",M);var A={DEAD:"dead",PLAYING:"playing"},I=[0,0],R=function(t){function r(){var e;return i(this,r),(e=u(this,c(r).call(this))).board=m,e.moves=0,e.marks=0,e.mines=0,e.status=A.PLAYING,e.focusedSquare=I,e.handleKeydown=e.handleKeydown.bind(g(e)),e}return o(r,d),a(r,null,[{key:"properties",get:function(){return{moves:{type:Number},board:{type:Array},marks:{type:Number},mines:{type:Number},status:{type:String},focusedSquare:{type:Array}}}}]),a(r,[{key:"_getNeighbors",value:function(e,t){for(var r,s=0,n=arguments.length,o=new Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a];for(var i=-1;i<=1;i+=1)if(this.board[e+i])for(var u=-1;u<=1;u+=1)(r=this.board[e+i][t+u])&&(0===i&&0===u||o.includes(r.state)&&(s+=1));return s}},{key:"_getNeighboringMines",value:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return this._getNeighbors.apply(this,t.concat(["MINE","MARKED_MINE","TRIPPED"]))}},{key:"_getNeighboringMarks",value:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return this._getNeighbors.apply(this,t.concat(["MARKED","MARKED_MINE"]))}},{key:"_playNeighbors",value:function(e,t,r){for(var s=-1;s<=1;s+=1)if(this.board[e+s])for(var n=-1;n<=1;n+=1){var o=this.board[e+s][t+n];o&&(r||"NOT_MINE"===o.state)&&(o.state=b(o.state,"PLAYED"),"TRIPPED"===o.state?this.status=A.DEAD:["MARKED","MARKED_MINE"].includes(o.state)||0!==this.memoizedGetNeighboringMines(e+s,t+n)||this._playNeighbors(e+s,t+n))}this.moves+=1}},{key:"_played",value:function(e){if(this.status!==A.DEAD){var t=e.target,r=t.column,s=t.row,n=this.board[r][s];if(this.focusedSquare=[r,s],"PLAYED"===n.state){if(this.memoizedGetNeighboringMines(r,s)!==this._getNeighboringMarks(r,s))return;this._playNeighbors(r,s,!0)}else"MINE"===n.state?this.status=A.DEAD:this.memoizedGetNeighboringMines(r,s)||this._playNeighbors(r,s);n.state=b(n.state,"PLAYED"),this.moves+=1}}},{key:"_marked",value:function(e){var t=e.target,r=t.column,s=t.row,n=this.board[r][s];this.focusedSquare=[r,s],n.state=b(n.state,e.detail.marked?"UNMARKED":"MARKED"),this.marks+="MARKED"===n.state||"MARKED_MINE"===n.state?1:-1,this.moves+=1}},{key:"handleKeydown",value:function(e){var t=e.composedPath()[0].getRootNode().host,r=t.column,s=t.row,n=e.shiftKey?5:1;switch(e.key){case"ArrowDown":s=this.board[0].length+s+n;break;case"ArrowUp":s=this.board[0].length+s-n;break;case"ArrowLeft":r=this.board.length+r-n;break;case"ArrowRight":r=this.board.length+r+n;break;case"m":this.shadowRoot.querySelector('[column="'.concat(r,'"][row="').concat(s,'"]')).mark(e)}this.focusedSquare=[r%this.board.length,s%this.board[0].length]}},{key:"focusBoard",value:function(){window.addEventListener("keydown",this.handleKeydown)}},{key:"blurBoard",value:function(){window.removeEventListener("keydown",this.handleKeydown)}},{key:"isFocusedSquare",value:function(e,t){return this.focusedSquare===I?0===e&&0===t:e===this.focusedSquare[0]&&t===this.focusedSquare[1]}},{key:"render",value:function(){var e=this;return h(k(),this.marks,this.mines,this.board.map(function(t,r){return t.map(function(t,s){return h(D(),t.state,e.memoizedGetNeighboringMines(r,s),r,s,e.isFocusedSquare(r,s),e._played,e._marked,e.focusBoard,e.blurBoard)})}))}},{key:"updated",value:function(e){if(e.has("status")&&this.status===A.DEAD)this.dispatchEvent(new CustomEvent("minesweeper-game-over",{bubbles:!0,composed:!0}));else if(e.has("mines"))this.marks=0,this.status=A.PLAYING,this.focusedSquare=I;else{var t=this.shadowRoot.querySelector(this.focusedSquareSelector);t.updateComplete.then(function(){t.focus()})}}},{key:"board",get:function(){return this._board},set:function(t){if(t!==this.board){var r,s,n=this.board;this._board=t,this.memoizedGetNeighboringMines=(r=this._getNeighboringMines.bind(this),s=new Map,function(){for(var t=s,n=0,o=arguments.length;t.has(n<0||arguments.length<=n?void 0:arguments[n])&&n<o-1;)t=t.get(n<0||arguments.length<=n?void 0:arguments[n]),n+=1;if(n===o-1&&t.has(e))t=t.get(e);else{for(;n<o;)t.set(n<0||arguments.length<=n?void 0:arguments[n],new Map),t=t.get(n<0||arguments.length<=n?void 0:arguments[n]),n+=1;t.set(e,r.apply(void 0,arguments)),t=t.get(e)}return t}),this.requestUpdate("board",n)}}},{key:"focusedSquareSelector",get:function(){var e=v(this.focusedSquare,2),t=e[0],r=e[1];return'[column="'.concat(t,'"][row="').concat(r,'"]')}}],[{key:"styles",get:function(){return[l(N())]}}]),r}();customElements.define("minesweeper-board",R)}}});
//# sourceMappingURL=minesweeper-board-7959e10f.js.map