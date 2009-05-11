YUI.add("dom",function(Y){var NODE_TYPE="nodeType",OWNER_DOCUMENT="ownerDocument",DOCUMENT_ELEMENT="documentElement",DEFAULT_VIEW="defaultView",PARENT_WINDOW="parentWindow",TAG_NAME="tagName",PARENT_NODE="parentNode",FIRST_CHILD="firstChild",LAST_CHILD="lastChild",PREVIOUS_SIBLING="previousSibling",NEXT_SIBLING="nextSibling",CONTAINS="contains",COMPARE_DOCUMENT_POSITION="compareDocumentPosition",INNER_TEXT="innerText",TEXT_CONTENT="textContent",LENGTH="length",UNDEFINED=undefined;var re_tag=/<([a-z]+)/i;var templateCache={};Y.DOM={byId:function(id,doc){return Y.DOM._getDoc(doc).getElementById(id);},getText:function(element){var text=element?element[TEXT_CONTENT]:"";if(text===UNDEFINED&&INNER_TEXT in element){text=element[INNER_TEXT];}return text||"";},firstChild:function(element,fn){return Y.DOM._childBy(element,null,fn);},firstChildByTag:function(element,tag,fn){return Y.DOM._childBy(element,tag,fn);},lastChild:function(element,fn){return Y.DOM._childBy(element,null,fn,true);},lastChildByTag:function(element,tag,fn){return Y.DOM._childBy(element,tag,fn,true);},childrenByTag:function(){if(document[DOCUMENT_ELEMENT].children){return function(element,tag,fn,toArray){tag=(tag&&tag!=="*")?tag:null;var elements=[];if(element){elements=(tag)?element.children.tags(tag):element.children;if(fn||toArray){elements=Y.DOM.filterElementsBy(elements,fn);}}return elements;};}else{return function(element,tag,fn){tag=(tag&&tag!=="*")?tag.toUpperCase():null;var elements=[],wrapFn=fn;if(element){elements=element.childNodes;if(tag){wrapFn=function(el){return el[TAG_NAME].toUpperCase()===tag&&(!fn||fn(el));};}elements=Y.DOM.filterElementsBy(elements,wrapFn);}return elements;};}}(),children:function(element,fn){return Y.DOM.childrenByTag(element,null,fn);},previous:function(element,fn,all){return Y.DOM.elementByAxis(element,PREVIOUS_SIBLING,fn,all);},next:function(element,fn,all){return Y.DOM.elementByAxis(element,NEXT_SIBLING,fn,all);},ancestor:function(element,fn,all){return Y.DOM.elementByAxis(element,PARENT_NODE,fn,all);},elementByAxis:function(element,axis,fn,all){while(element&&(element=element[axis])){if((all||element[TAG_NAME])&&(!fn||fn(element))){return element;}}return null;},byTag:function(tag,root,fn){root=root||Y.config.doc;var elements=root.getElementsByTagName(tag),retNodes=[];for(var i=0,len=elements[LENGTH];i<len;++i){if(!fn||fn(elements[i])){retNodes[retNodes[LENGTH]]=elements[i];}}return retNodes;},firstByTag:function(tag,root,fn){root=root||Y.config.doc;var elements=root.getElementsByTagName(tag),ret=null;for(var i=0,len=elements[LENGTH];i<len;++i){if(!fn||fn(elements[i])){ret=elements[i];break;}}return ret;},filterElementsBy:function(elements,fn,firstOnly){var ret=(firstOnly)?null:[];for(var i=0,len=elements[LENGTH];i<len;++i){if(elements[i][TAG_NAME]&&(!fn||fn(elements[i]))){if(firstOnly){ret=elements[i];break;}else{ret[ret[LENGTH]]=elements[i];}}}return ret;},contains:function(element,needle){var ret=false;if(!needle||!element||!needle[NODE_TYPE]||!element[NODE_TYPE]){ret=false;}else{if(element[CONTAINS]){if(Y.UA.opera||needle[NODE_TYPE]===1){ret=element[CONTAINS](needle);}else{ret=Y.DOM._bruteContains(element,needle);}}else{if(element[COMPARE_DOCUMENT_POSITION]){if(element===needle||!!(element[COMPARE_DOCUMENT_POSITION](needle)&16)){ret=true;}}}}return ret;},inDoc:function(element,doc){doc=doc||Y.config.doc;return Y.DOM.contains(doc.documentElement,element);},create:function(html,doc){doc=doc||Y.config.doc;var m=re_tag.exec(html);var create=Y.DOM._create,custom=Y.DOM.creators,tag,ret;if(m&&custom[m[1]]){if(typeof custom[m[1]]==="function"){create=custom[m[1]];}else{tag=custom[m[1]];}}ret=create(html,doc,tag);return(ret.childNodes.length>1)?ret.childNodes:ret.childNodes[0];},CUSTOM_ATTRIBUTES:(!document.documentElement.hasAttribute)?{"for":"htmlFor","class":"className"}:{"htmlFor":"for","className":"class"},setAttribute:function(el,attr,val){attr=Y.DOM.CUSTOM_ATTRIBUTES[attr]||attr;el.setAttribute(attr,val);},getAttribute:function(el,attr){attr=Y.DOM.CUSTOM_ATTRIBUTES[attr]||attr;var ret=el.getAttribute(attr);if(!document.documentElement.hasAttribute){if(el.getAttributeNode){ret=el.getAttributeNode(attr);ret=(ret)?ret.value:null;}else{ret=el.getAttribute(attr);}}if(ret===null){ret="";}return ret;},_create:function(html,doc,tag){tag=tag||"div";var frag=templateCache[tag]||doc.createElement(tag);frag.innerHTML=Y.Lang.trim(html);return frag;},_bruteContains:function(element,needle){while(needle){if(element===needle){return true;}needle=needle.parentNode;}return false;},_getRegExp:function(str,flags){flags=flags||"";Y.DOM._regexCache=Y.DOM._regexCache||{};if(!Y.DOM._regexCache[str+flags]){Y.DOM._regexCache[str+flags]=new RegExp(str,flags);}return Y.DOM._regexCache[str+flags];},_getDoc:function(element){element=element||{};return(element[NODE_TYPE]===9)?element:element[OWNER_DOCUMENT]||element.document||Y.config.doc;},_getWin:function(element){var doc=Y.DOM._getDoc(element);return doc[DEFAULT_VIEW]||doc[PARENT_WINDOW]||Y.config.win;},_childBy:function(element,tag,fn,rev){var ret=null,root,axis;if(element){if(rev){root=element[LAST_CHILD];axis=PREVIOUS_SIBLING;}else{root=element[FIRST_CHILD];axis=NEXT_SIBLING;}if(Y.DOM._testElement(root,tag,fn)){ret=root;}else{ret=Y.DOM.elementByAxis(root,axis,fn);}}return ret;},_testElement:function(element,tag,fn){tag=(tag&&tag!=="*")?tag.toUpperCase():null;return(element&&element[TAG_NAME]&&(!tag||element[TAG_NAME].toUpperCase()===tag)&&(!fn||fn(element)));},creators:{},_IESimpleCreate:function(html,doc){doc=doc||Y.config.doc;return doc.createElement(html);}};(function(){var creators=Y.DOM.creators,create=Y.DOM.create,re_tbody=/(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/;var TABLE_OPEN="<table>",TABLE_CLOSE="</table>";if(Y.UA.gecko||Y.UA.ie){Y.mix(creators,{option:function(html,doc){var frag=create("<select>"+html+"</select>");return frag;},tr:function(html,doc){var frag=creators.tbody("<tbody>"+html+"</tbody>",doc);return frag.firstChild;},td:function(html,doc){var frag=creators.tr("<tr>"+html+"</tr>",doc);
return frag.firstChild;},tbody:function(html,doc){var frag=create(TABLE_OPEN+html+TABLE_CLOSE,doc);return frag;},legend:"fieldset"});creators.col=creators.tbody;}if(Y.UA.ie){creators.col=creators.script=creators.link=Y.DOM._IESimpleCreate;creators.tbody=function(html,doc){var frag=create(TABLE_OPEN+html+TABLE_CLOSE,doc);var tb=frag.children.tags("tbody")[0];if(frag.children.length>1&&tb&&!re_tbody.test(html)){tb.parentNode.removeChild(tb);}return frag;};}if(Y.UA.gecko||Y.UA.ie){Y.mix(creators,{th:creators.td,thead:creators.tbody,tfoot:creators.tbody,caption:creators.tbody,colgroup:creators.tbody,col:creators.tbody,optgroup:creators.option});}})();var CLASS_NAME="className";Y.mix(Y.DOM,{hasClass:function(node,className){var re=Y.DOM._getRegExp("(?:^|\\s+)"+className+"(?:\\s+|$)");return re.test(node[CLASS_NAME]);},addClass:function(node,className){if(!Y.DOM.hasClass(node,className)){node[CLASS_NAME]=Y.Lang.trim([node[CLASS_NAME],className].join(" "));}},removeClass:function(node,className){if(className&&Y.DOM.hasClass(node,className)){node[CLASS_NAME]=Y.Lang.trim(node[CLASS_NAME].replace(Y.DOM._getRegExp("(?:^|\\s+)"+className+"(?:\\s+|$)")," "));if(Y.DOM.hasClass(node,className)){Y.DOM.removeClass(node,className);}}},replaceClass:function(node,oldC,newC){Y.DOM.addClass(node,newC);Y.DOM.removeClass(node,oldC);},toggleClass:function(node,className){if(Y.DOM.hasClass(node,className)){Y.DOM.removeClass(node,className);}else{Y.DOM.addClass(node,className);}}});var DOCUMENT_ELEMENT="documentElement",DEFAULT_VIEW="defaultView",OWNER_DOCUMENT="ownerDocument",STYLE="style",FLOAT="float",CSS_FLOAT="cssFloat",STYLE_FLOAT="styleFloat",TRANSPARENT="transparent",VISIBLE="visible",WIDTH="width",HEIGHT="height",BORDER_TOP_WIDTH="borderTopWidth",BORDER_RIGHT_WIDTH="borderRightWidth",BORDER_BOTTOM_WIDTH="borderBottomWidth",BORDER_LEFT_WIDTH="borderLeftWidth",GET_COMPUTED_STYLE="getComputedStyle",DOCUMENT=Y.config.doc,UNDEFINED=undefined,re_color=/color$/i;Y.mix(Y.DOM,{CUSTOM_STYLES:{},setStyle:function(node,att,val,style){style=node[STYLE],CUSTOM_STYLES=Y.DOM.CUSTOM_STYLES;if(style){if(att in CUSTOM_STYLES){if(CUSTOM_STYLES[att].set){CUSTOM_STYLES[att].set(node,val,style);return;}else{if(typeof CUSTOM_STYLES[att]==="string"){att=CUSTOM_STYLES[att];}}}style[att]=val;}},getStyle:function(node,att){var style=node[STYLE],CUSTOM_STYLES=Y.DOM.CUSTOM_STYLES,val="";if(style){if(att in CUSTOM_STYLES){if(CUSTOM_STYLES[att].get){return CUSTOM_STYLES[att].get(node,att,style);}else{if(typeof CUSTOM_STYLES[att]==="string"){att=CUSTOM_STYLES[att];}}}val=style[att];if(val===""){val=Y.DOM[GET_COMPUTED_STYLE](node,att);}}return val;},setStyles:function(node,hash){Y.each(hash,function(v,n){Y.DOM.setStyle(node,n,v);},Y.DOM);},getComputedStyle:function(node,att){var val="",doc=node[OWNER_DOCUMENT];if(node[STYLE]){val=doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node,"")[att];}return val;}});if(DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT]!==UNDEFINED){Y.DOM.CUSTOM_STYLES[FLOAT]=CSS_FLOAT;}else{if(DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT]!==UNDEFINED){Y.DOM.CUSTOM_STYLES[FLOAT]=STYLE_FLOAT;}}if(Y.UA.opera){Y.DOM[GET_COMPUTED_STYLE]=function(node,att){var view=node[OWNER_DOCUMENT][DEFAULT_VIEW],val=view[GET_COMPUTED_STYLE](node,"")[att];if(re_color.test(att)){val=Y.Color.toRGB(val);}return val;};}if(Y.UA.webkit){Y.DOM[GET_COMPUTED_STYLE]=function(node,att){var view=node[OWNER_DOCUMENT][DEFAULT_VIEW],val=view[GET_COMPUTED_STYLE](node,"")[att];if(val==="rgba(0, 0, 0, 0)"){val=TRANSPARENT;}return val;};}var OFFSET_TOP="offsetTop",DOCUMENT_ELEMENT="documentElement",COMPAT_MODE="compatMode",OFFSET_LEFT="offsetLeft",OFFSET_PARENT="offsetParent",POSITION="position",FIXED="fixed",RELATIVE="relative",LEFT="left",TOP="top",SCROLL_LEFT="scrollLeft",SCROLL_TOP="scrollTop",_BACK_COMPAT="BackCompat",MEDIUM="medium",HEIGHT="height",WIDTH="width",BORDER_LEFT_WIDTH="borderLeftWidth",BORDER_TOP_WIDTH="borderTopWidth",GET_BOUNDING_CLIENT_RECT="getBoundingClientRect",GET_COMPUTED_STYLE="getComputedStyle",RE_TABLE=/^t(?:able|d|h)$/i;Y.mix(Y.DOM,{winHeight:function(node){var h=Y.DOM._getWinSize(node)[HEIGHT];return h;},winWidth:function(node){var w=Y.DOM._getWinSize(node)[WIDTH];return w;},docHeight:function(node){var h=Y.DOM._getDocSize(node)[HEIGHT];return Math.max(h,Y.DOM._getWinSize(node)[HEIGHT]);},docWidth:function(node){var w=Y.DOM._getDocSize(node)[WIDTH];return Math.max(w,Y.DOM._getWinSize(node)[WIDTH]);},docScrollX:function(node){var doc=Y.DOM._getDoc(node);return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT],doc.body[SCROLL_LEFT]);},docScrollY:function(node){var doc=Y.DOM._getDoc(node);return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP],doc.body[SCROLL_TOP]);},getXY:function(){if(document[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]){return function(node){if(!node){return false;}var scrollLeft=Y.DOM.docScrollX(node),scrollTop=Y.DOM.docScrollY(node),box=node[GET_BOUNDING_CLIENT_RECT](),doc=Y.DOM._getDoc(node),xy=[Math.floor(box[LEFT]),Math.floor(box[TOP])];if(Y.UA.ie){var off1=2,off2=2,mode=doc[COMPAT_MODE],bLeft=Y.DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT],BORDER_LEFT_WIDTH),bTop=Y.DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT],BORDER_TOP_WIDTH);if(Y.UA.ie===6){if(mode!==_BACK_COMPAT){off1=0;off2=0;}}if((mode==_BACK_COMPAT)){if(bLeft!==MEDIUM){off1=parseInt(bLeft,10);}if(bTop!==MEDIUM){off2=parseInt(bTop,10);}}xy[0]-=off1;xy[1]-=off2;}if((scrollTop||scrollLeft)){xy[0]+=scrollLeft;xy[1]+=scrollTop;}xy[0]=Math.floor(xy[0]);xy[1]=Math.floor(xy[1]);return xy;};}else{return function(node){var xy=[node[OFFSET_LEFT],node[OFFSET_TOP]],parentNode=node,bCheck=((Y.UA.gecko||Y.UA.webkit>519)?true:false);while((parentNode=parentNode[OFFSET_PARENT])){xy[0]+=parentNode[OFFSET_LEFT];xy[1]+=parentNode[OFFSET_TOP];if(bCheck){xy=Y.DOM._calcBorders(parentNode,xy);}}if(Y.DOM.getStyle(node,POSITION)!=FIXED){parentNode=node;var scrollTop,scrollLeft;while((parentNode=parentNode.parentNode)){scrollTop=parentNode[SCROLL_TOP];scrollLeft=parentNode[SCROLL_LEFT];if(Y.UA.gecko&&(Y.DOM.getStyle(parentNode,"overflow")!=="visible")){xy=Y.DOM._calcBorders(parentNode,xy);
}if(scrollTop||scrollLeft){xy[0]-=scrollLeft;xy[1]-=scrollTop;}}xy[0]+=Y.DOM.docScrollX(node);xy[1]+=Y.DOM.docScrollY(node);}else{if(Y.UA.opera){xy[0]-=Y.DOM.docScrollX(node);xy[1]-=Y.DOM.docScrollY(node);}else{if(Y.UA.webkit||Y.UA.gecko){xy[0]+=Y.DOM.docScrollX(node);xy[1]+=Y.DOM.docScrollY(node);}}}xy[0]=Math.floor(xy[0]);xy[1]=Math.floor(xy[1]);return xy;};}}(),getX:function(node){return Y.DOM.getXY(node)[0];},getY:function(node){return Y.DOM.getXY(node)[1];},setXY:function(node,xy,noRetry){var pos=Y.DOM.getStyle(node,POSITION),setStyle=Y.DOM.setStyle,delta=[parseInt(Y.DOM[GET_COMPUTED_STYLE](node,LEFT),10),parseInt(Y.DOM[GET_COMPUTED_STYLE](node,TOP),10)];if(pos=="static"){pos=RELATIVE;setStyle(node,POSITION,pos);}var currentXY=Y.DOM.getXY(node);if(currentXY===false){return false;}if(isNaN(delta[0])){delta[0]=(pos==RELATIVE)?0:node[OFFSET_LEFT];}if(isNaN(delta[1])){delta[1]=(pos==RELATIVE)?0:node[OFFSET_TOP];}if(xy[0]!==null){setStyle(node,LEFT,xy[0]-currentXY[0]+delta[0]+"px");}if(xy[1]!==null){setStyle(node,TOP,xy[1]-currentXY[1]+delta[1]+"px");}if(!noRetry){var newXY=Y.DOM.getXY(node);if((xy[0]!==null&&newXY[0]!=xy[0])||(xy[1]!==null&&newXY[1]!=xy[1])){Y.DOM.setXY(node,xy,true);}}},setX:function(node,x){return Y.DOM.setXY(node,[x,null]);},setY:function(node,y){return Y.DOM.setXY(node,[null,y]);},_calcBorders:function(node,xy2){var t=parseInt(Y.DOM[GET_COMPUTED_STYLE](node,BORDER_TOP_WIDTH),10)||0,l=parseInt(Y.DOM[GET_COMPUTED_STYLE](node,BORDER_LEFT_WIDTH),10)||0;if(Y.UA.gecko){if(RE_TABLE.test(node.tagName)){t=0;l=0;}}xy2[0]+=l;xy2[1]+=t;return xy2;},_getWinSize:function(node){var doc=Y.DOM._getDoc(),win=doc.defaultView||doc.parentWindow,mode=doc[COMPAT_MODE],h=win.innerHeight,w=win.innerWidth,root=doc[DOCUMENT_ELEMENT];if(mode&&!Y.UA.opera){if(mode!="CSS1Compat"){root=doc.body;}h=root.clientHeight;w=root.clientWidth;}return{height:h,width:w};},_getDocSize:function(node){var doc=Y.DOM._getDoc(),root=doc[DOCUMENT_ELEMENT];if(doc[COMPAT_MODE]!="CSS1Compat"){root=doc.body;}return{height:root.scrollHeight,width:root.scrollWidth};}});var OFFSET_WIDTH="offsetWidth",OFFSET_HEIGHT="offsetHeight",TOP="top",RIGHT="right",BOTTOM="bottom",LEFT="left",TAG_NAME="tagName";var getOffsets=function(r1,r2){var t=Math.max(r1[TOP],r2[TOP]),r=Math.min(r1[RIGHT],r2[RIGHT]),b=Math.min(r1[BOTTOM],r2[BOTTOM]),l=Math.max(r1[LEFT],r2[LEFT]),ret={};ret[TOP]=t;ret[RIGHT]=r;ret[BOTTOM]=b;ret[LEFT]=l;return ret;};var DOM=DOM||Y.DOM;Y.mix(DOM,{region:function(node){var x=DOM.getXY(node),ret=false;if(x){ret={"0":x[0],"1":x[1],top:x[1],right:x[0]+node[OFFSET_WIDTH],bottom:x[1]+node[OFFSET_HEIGHT],left:x[0],height:node[OFFSET_HEIGHT],width:node[OFFSET_WIDTH]};}return ret;},intersect:function(node,node2,altRegion){var r=altRegion||DOM.region(node),region={};var n=node2;if(n[TAG_NAME]){region=DOM.region(n);}else{if(Y.Lang.isObject(node2)){region=node2;}else{return false;}}var off=getOffsets(region,r);return{top:off[TOP],right:off[RIGHT],bottom:off[BOTTOM],left:off[LEFT],area:((off[BOTTOM]-off[TOP])*(off[RIGHT]-off[LEFT])),yoff:((off[BOTTOM]-off[TOP])),xoff:(off[RIGHT]-off[LEFT]),inRegion:DOM.inRegion(node,node2,false,altRegion)};},inRegion:function(node,node2,all,altRegion){var region={},r=altRegion||DOM.region(node);var n=node2;if(n[TAG_NAME]){region=DOM.region(n);}else{if(Y.Lang.isObject(node2)){region=node2;}else{return false;}}if(all){return(r[LEFT]>=region[LEFT]&&r[RIGHT]<=region[RIGHT]&&r[TOP]>=region[TOP]&&r[BOTTOM]<=region[BOTTOM]);}else{var off=getOffsets(region,r);if(off[BOTTOM]>=off[TOP]&&off[RIGHT]>=off[LEFT]){return true;}else{return false;}}},inViewportRegion:function(node,all,altRegion){return DOM.inRegion(node,DOM.viewportRegion(node),all,altRegion);},viewportRegion:function(node){node=node||Y.config.doc.documentElement;var r={};r[TOP]=DOM.docScrollY(node);r[RIGHT]=DOM.winWidth(node)+DOM.docScrollX(node);r[BOTTOM]=(DOM.docScrollY(node)+DOM.winHeight(node));r[LEFT]=DOM.docScrollX(node);return r;}});var CLIENT_TOP="clientTop",CLIENT_LEFT="clientLeft",PARENT_NODE="parentNode",RIGHT="right",HAS_LAYOUT="hasLayout",PX="px",FILTER="filter",FILTERS="filters",OPACITY="opacity",AUTO="auto",CURRENT_STYLE="currentStyle";if(document[DOCUMENT_ELEMENT][STYLE][OPACITY]===UNDEFINED&&document[DOCUMENT_ELEMENT][FILTERS]){Y.DOM.CUSTOM_STYLES[OPACITY]={get:function(node){var val=100;try{val=node[FILTERS]["DXImageTransform.Microsoft.Alpha"][OPACITY];}catch(e){try{val=node[FILTERS]("alpha")[OPACITY];}catch(err){}}return val/100;},set:function(node,val,style){if(typeof style[FILTER]=="string"){style[FILTER]="alpha("+OPACITY+"="+val*100+")";if(!node[CURRENT_STYLE]||!node[CURRENT_STYLE][HAS_LAYOUT]){style.zoom=1;}}}};}var re_size=/^width|height$/,re_unit=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;var ComputedStyle={CUSTOM_STYLES:{},get:function(el,property){var value="",current=el[CURRENT_STYLE][property];if(property===OPACITY){value=Y.DOM.CUSTOM_STYLES[OPACITY].get(el);}else{if(!current||(current.indexOf&&current.indexOf(PX)>-1)){value=current;}else{if(Y.DOM.IE.COMPUTED[property]){value=Y.DOM.IE.COMPUTED[property](el,property);}else{if(re_unit.test(current)){value=Y.DOM.IE.ComputedStyle.getPixel(el,property);}else{value=current;}}}}return value;},getOffset:function(el,prop){var current=el[CURRENT_STYLE][prop],capped=prop.charAt(0).toUpperCase()+prop.substr(1),offset="offset"+capped,pixel="pixel"+capped,value="";if(current==AUTO){var actual=el[offset];if(actual===UNDEFINED){value=0;}value=actual;if(re_size.test(prop)){el[STYLE][prop]=actual;if(el[offset]>actual){value=actual-(el[offset]-actual);}el[STYLE][prop]=AUTO;}}else{if(!el[STYLE][pixel]&&!el[STYLE][prop]){el[STYLE][prop]=current;}value=el[STYLE][pixel];}return value+PX;},getBorderWidth:function(el,property){var value=null;if(!el[CURRENT_STYLE][HAS_LAYOUT]){el[STYLE].zoom=1;}switch(property){case BORDER_TOP_WIDTH:value=el[CLIENT_TOP];break;case BORDER_BOTTOM_WIDTH:value=el.offsetHeight-el.clientHeight-el[CLIENT_TOP];break;case BORDER_LEFT_WIDTH:value=el[CLIENT_LEFT];
break;case BORDER_RIGHT_WIDTH:value=el.offsetWidth-el.clientWidth-el[CLIENT_LEFT];break;}return value+PX;},getPixel:function(node,att){var val=null,styleRight=node[CURRENT_STYLE][RIGHT],current=node[CURRENT_STYLE][att];node[STYLE][RIGHT]=current;val=node[STYLE].pixelRight;node[STYLE][RIGHT]=styleRight;return val+PX;},getMargin:function(node,att){var val;if(node[CURRENT_STYLE][att]==AUTO){val=0+PX;}else{val=Y.DOM.IE.ComputedStyle.getPixel(node,att);}return val;},getVisibility:function(node,att){var current;while((current=node[CURRENT_STYLE])&&current[att]=="inherit"){node=node[PARENT_NODE];}return(current)?current[att]:VISIBLE;},getColor:function(node,att){var current=node[CURRENT_STYLE][att];if(!current||current===TRANSPARENT){Y.DOM.elementByAxis(node,PARENT_NODE,null,function(parent){current=parent[CURRENT_STYLE][att];if(current&&current!==TRANSPARENT){node=parent;return true;}});}return Y.Color.toRGB(current);},getBorderColor:function(node,att){var current=node[CURRENT_STYLE];var val=current[att]||current.color;return Y.Color.toRGB(Y.Color.toHex(val));}};var IEComputed={};IEComputed[WIDTH]=IEComputed[HEIGHT]=ComputedStyle.getOffset;IEComputed.color=IEComputed.backgroundColor=ComputedStyle.getColor;IEComputed[BORDER_TOP_WIDTH]=IEComputed[BORDER_RIGHT_WIDTH]=IEComputed[BORDER_BOTTOM_WIDTH]=IEComputed[BORDER_LEFT_WIDTH]=ComputedStyle.getBorderWidth;IEComputed.marginTop=IEComputed.marginRight=IEComputed.marginBottom=IEComputed.marginLeft=ComputedStyle.getMargin;IEComputed.visibility=ComputedStyle.getVisibility;IEComputed.borderColor=IEComputed.borderTopColor=IEComputed.borderRightColor=IEComputed.borderBottomColor=IEComputed.borderLeftColor=ComputedStyle.getBorderColor;if(!Y.config.win[GET_COMPUTED_STYLE]){Y.DOM[GET_COMPUTED_STYLE]=ComputedStyle.get;}Y.namespace("DOM.IE");Y.DOM.IE.COMPUTED=IEComputed;Y.DOM.IE.ComputedStyle=ComputedStyle;
/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,done=0,toString=Object.prototype.toString,hasDuplicate=false;var Sizzle=function(selector,context,results,seed){results=results||[];var origContext=context=context||document;if(context.nodeType!==1&&context.nodeType!==9){return[];}if(!selector||typeof selector!=="string"){return results;}var parts=[],m,set,checkSet,check,mode,extra,prune=true,contextXML=isXML(context);chunker.lastIndex=0;while((m=chunker.exec(selector))!==null){parts.push(m[1]);if(m[2]){extra=RegExp.rightContext;break;}}if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context);}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);while(parts.length){selector=parts.shift();if(Expr.relative[selector]){selector+=parts.shift();}set=posProcess(selector,set);}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){var ret=Sizzle.find(parts.shift(),context,contextXML);context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0];}if(context){var ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;if(parts.length>0){checkSet=makeArray(set);}else{prune=false;}while(parts.length){var cur=parts.pop(),pop=cur;if(!Expr.relative[cur]){cur="";}else{pop=parts.pop();}if(pop==null){pop=context;}Expr.relative[cur](checkSet,pop,contextXML);}}else{checkSet=parts=[];}}if(!checkSet){checkSet=set;}if(!checkSet){throw"Syntax error, unrecognized expression: "+(cur||selector);}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet);}else{if(context&&context.nodeType===1){for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&contains(context,checkSet[i]))){results.push(set[i]);}}}else{for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i]);}}}}}else{makeArray(checkSet,results);}if(extra){Sizzle(extra,origContext,results,seed);Sizzle.uniqueSort(results);}return results;};Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=false;results.sort(sortOrder);if(hasDuplicate){for(var i=1;i<results.length;i++){if(results[i]===results[i-1]){results.splice(i--,1);}}}}};Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set);};Sizzle.find=function(expr,context,isXML){var set,match;if(!expr){return[];}for(var i=0,l=Expr.order.length;i<l;i++){var type=Expr.order[i],match;if((match=Expr.match[type].exec(expr))){var left=RegExp.leftContext;if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(/\\/g,"");set=Expr.find[type](match,context,isXML);if(set!=null){expr=expr.replace(Expr.match[type],"");break;}}}}if(!set){set=context.getElementsByTagName("*");}return{set:set,expr:expr};};Sizzle.filter=function(expr,set,inplace,not){var old=expr,result=[],curLoop=set,match,anyFound,isXMLFilter=set&&set[0]&&isXML(set[0]);while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.match[type].exec(expr))!=null){var filter=Expr.filter[type],found,item;anyFound=false;if(curLoop==result){result=[];}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);if(!match){anyFound=found=true;}else{if(match===true){continue;}}}if(match){for(var i=0;(item=curLoop[i])!=null;i++){if(item){found=filter(item,match,i,curLoop);var pass=not^!!found;if(inplace&&found!=null){if(pass){anyFound=true;}else{curLoop[i]=false;}}else{if(pass){result.push(item);anyFound=true;}}}}}if(found!==undefined){if(!inplace){curLoop=result;}expr=expr.replace(Expr.match[type],"");if(!anyFound){return[];}break;
}}}if(expr==old){if(anyFound==null){throw"Syntax error, unrecognized expression: "+expr;}else{break;}}old=expr;}return curLoop;};var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href");}},relative:{"+":function(checkSet,part,isXML){var isPartStr=typeof part==="string",isTag=isPartStr&&!/\W/.test(part),isPartStrNotTag=isPartStr&&!isTag;if(isTag&&!isXML){part=part.toUpperCase();}for(var i=0,l=checkSet.length,elem;i<l;i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName===part?elem||false:elem===part;}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true);}},">":function(checkSet,part,isXML){var isPartStr=typeof part==="string";if(isPartStr&&!/\W/.test(part)){part=isXML?part:part.toUpperCase();for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var parent=elem.parentNode;checkSet[i]=parent.nodeName===part?parent:false;}}}else{for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part;}}if(isPartStr){Sizzle.filter(part,checkSet,true);}}},"":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();checkFn=dirNodeCheck;}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML);},"~":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();checkFn=dirNodeCheck;}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML);}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?[m]:[];}},NAME:function(match,context,isXML){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);for(var i=0,l=results.length;i<l;i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i]);}}return ret.length===0?null:ret;}},TAG:function(match,context){return context.getElementsByTagName(match[1]);}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(/\\/g,"")+" ";if(isXML){return match;}for(var i=0,elem;(elem=curLoop[i])!=null;i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").indexOf(match)>=0)){if(!inplace){result.push(elem);}}else{if(inplace){curLoop[i]=false;}}}}return false;},ID:function(match){return match[1].replace(/\\/g,"");},TAG:function(match,curLoop){for(var i=0;curLoop[i]===false;i++){}return curLoop[i]&&isXML(curLoop[i])?match[1]:match[1].toUpperCase();},CHILD:function(match){if(match[1]=="nth"){var test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2]=="even"&&"2n"||match[2]=="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);match[2]=(test[1]+(test[2]||1))-0;match[3]=test[3]-0;}match[0]=done++;return match;},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1].replace(/\\/g,"");if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name];}if(match[2]==="~="){match[4]=" "+match[4]+" ";}return match;},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if(match[3].match(chunker).length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop);}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);if(!inplace){result.push.apply(result,ret);}return false;}}else{if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true;}}return match;},POS:function(match){match.unshift(true);return match;}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden";},disabled:function(elem){return elem.disabled===true;},checked:function(elem){return elem.checked===true;},selected:function(elem){elem.parentNode.selectedIndex;return elem.selected===true;},parent:function(elem){return !!elem.firstChild;},empty:function(elem){return !elem.firstChild;},has:function(elem,i,match){return !!Sizzle(match[3],elem).length;},header:function(elem){return/h\d/i.test(elem.nodeName);},text:function(elem){return"text"===elem.type;},radio:function(elem){return"radio"===elem.type;},checkbox:function(elem){return"checkbox"===elem.type;},file:function(elem){return"file"===elem.type;},password:function(elem){return"password"===elem.type;},submit:function(elem){return"submit"===elem.type;},image:function(elem){return"image"===elem.type;},reset:function(elem){return"reset"===elem.type;},button:function(elem){return"button"===elem.type||elem.nodeName.toUpperCase()==="BUTTON";},input:function(elem){return/input|select|textarea|button/i.test(elem.nodeName);}},setFilters:{first:function(elem,i){return i===0;},last:function(elem,i,match,array){return i===array.length-1;},even:function(elem,i){return i%2===0;},odd:function(elem,i){return i%2===1;},lt:function(elem,i,match){return i<match[3]-0;},gt:function(elem,i,match){return i>match[3]-0;},nth:function(elem,i,match){return match[3]-0==i;},eq:function(elem,i,match){return match[3]-0==i;}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];if(filter){return filter(elem,i,match,array);}else{if(name==="contains"){return(elem.textContent||elem.innerText||"").indexOf(match[3])>=0;}else{if(name==="not"){var not=match[3];for(var i=0,l=not.length;i<l;i++){if(not[i]===elem){return false;}}return true;}}}},CHILD:function(elem,match){var type=match[1],node=elem;
switch(type){case"only":case"first":while(node=node.previousSibling){if(node.nodeType===1){return false;}}if(type=="first"){return true;}node=elem;case"last":while(node=node.nextSibling){if(node.nodeType===1){return false;}}return true;case"nth":var first=match[2],last=match[3];if(first==1&&last==0){return true;}var doneName=match[0],parent=elem.parentNode;if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;for(node=parent.firstChild;node;node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count;}}parent.sizcache=doneName;}var diff=elem.nodeIndex-last;if(first==0){return diff==0;}else{return(diff%first==0&&diff/first>=0);}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match;},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName===match;},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1;},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!=check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false;},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];if(filter){return filter(elem,i,match,array);}}}};var origPOS=Expr.match.POS;for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+/(?![^\[]*\])(?![^\(]*\))/.source);}var makeArray=function(array,results){array=Array.prototype.slice.call(array);if(results){results.push.apply(results,array);return results;}return array;};try{Array.prototype.slice.call(document.documentElement.childNodes);}catch(e){makeArray=function(array,results){var ret=results||[];if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array);}else{if(typeof array.length==="number"){for(var i=0,l=array.length;i<l;i++){ret.push(array[i]);}}else{for(var i=0;array[i];i++){ret.push(array[i]);}}}return ret;};}var sortOrder;if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){var ret=a.compareDocumentPosition(b)&4?-1:a===b?0:1;if(ret===0){hasDuplicate=true;}return ret;};}else{if("sourceIndex" in document.documentElement){sortOrder=function(a,b){var ret=a.sourceIndex-b.sourceIndex;if(ret===0){hasDuplicate=true;}return ret;};}else{if(document.createRange){sortOrder=function(a,b){var aRange=a.ownerDocument.createRange(),bRange=b.ownerDocument.createRange();aRange.selectNode(a);aRange.collapse(true);bRange.selectNode(b);bRange.collapse(true);var ret=aRange.compareBoundaryPoints(Range.START_TO_END,bRange);if(ret===0){hasDuplicate=true;}return ret;};}}}(function(){var form=document.createElement("div"),id="script"+(new Date).getTime();form.innerHTML="<a name='"+id+"'/>";var root=document.documentElement;root.insertBefore(form,root.firstChild);if(!!document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[];}};Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return elem.nodeType===1&&node&&node.nodeValue===match;};}root.removeChild(form);root=form=null;})();(function(){var div=document.createElement("div");div.appendChild(document.createComment(""));if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);if(match[1]==="*"){var tmp=[];for(var i=0;results[i];i++){if(results[i].nodeType===1){tmp.push(results[i]);}}results=tmp;}return results;};}div.innerHTML="<a href='#'></a>";if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2);};}div=null;})();if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div");div.innerHTML="<p class='TEST'></p>";if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return;}Sizzle=function(query,context,extra,seed){context=context||document;if(!seed&&context.nodeType===9&&!isXML(context)){try{return makeArray(context.querySelectorAll(query),extra);}catch(e){}}return oldSizzle(query,context,extra,seed);};for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop];}div=null;})();}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var div=document.createElement("div");div.innerHTML="<div class='test e'></div><div class='test'></div>";if(div.getElementsByClassName("e").length===0){return;}div.lastChild.className="e";if(div.getElementsByClassName("e").length===1){return;}Expr.order.splice(1,0,"CLASS");Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1]);}};div=null;})();}function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;elem.sizset=i;}elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break;}if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;elem.sizset=i;}if(elem.nodeName===cur){match=elem;break;}elem=elem[dir];}checkSet[i]=match;}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;for(var i=0,l=checkSet.length;i<l;
i++){var elem=checkSet[i];if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;elem.sizset=i;}elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break;}if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;elem.sizset=i;}if(typeof cur!=="string"){if(elem===cur){match=true;break;}}else{if(Sizzle.filter(cur,[elem]).length>0){match=elem;break;}}}elem=elem[dir];}checkSet[i]=match;}}}var contains=document.compareDocumentPosition?function(a,b){return a.compareDocumentPosition(b)&16;}:function(a,b){return a!==b&&(a.contains?a.contains(b):true);};var isXML=function(elem){return elem.nodeType===9&&elem.documentElement.nodeName!=="HTML"||!!elem.ownerDocument&&elem.ownerDocument.documentElement.nodeName!=="HTML";};var posProcess=function(selector,context){var tmpSet=[],later="",match,root=context.nodeType?[context]:context;while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];selector=selector.replace(Expr.match.PSEUDO,"");}selector=Expr.relative[selector]?selector+"*":selector;for(var i=0,l=root.length;i<l;i++){Sizzle(selector,root[i],tmpSet);}return Sizzle.filter(later,tmpSet);};window.Sizzle=Sizzle;})();Y.Selector={query:function(selector,root,firstOnly){var ret=firstOnly?null:[];root=root||Y.config.doc;if(typeof root==="string"){root=Y.DOM.byId(root);}if(root){if(firstOnly){ret=Sizzle(selector+":first",root)[0]||null;}else{ret=Sizzle(selector,root);}}return ret;},test:function(node,selector){var matches,ret=false;if(node&&selector){matches=Sizzle.matches(selector,[node]);if(matches.length){ret=(matches[0]===node);}}else{}return ret;},filter:function(nodes,selector){nodes=nodes||[];return Sizzle.matches(selector,nodes);}};var TO_STRING="toString",PARSE_INT=parseInt,RE=RegExp;Y.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(val){if(!Y.Color.re_RGB.test(val)){val=Y.Color.toHex(val);}if(Y.Color.re_hex.exec(val)){val="rgb("+[PARSE_INT(RE.$1,16),PARSE_INT(RE.$2,16),PARSE_INT(RE.$3,16)].join(", ")+")";}return val;},toHex:function(val){val=Y.Color.KEYWORDS[val]||val;if(Y.Color.re_RGB.exec(val)){var r=(RE.$1.length===1)?"0"+RE.$1:Number(RE.$1),g=(RE.$2.length===1)?"0"+RE.$2:Number(RE.$2),b=(RE.$3.length===1)?"0"+RE.$3:Number(RE.$3);val=[r[TO_STRING](16),g[TO_STRING](16),b[TO_STRING](16)].join("");}if(val.length<6){val=val.replace(Y.Color.re_hex3,"$1$1");}if(val!=="transparent"&&val.indexOf("#")<0){val="#"+val;}return val.toLowerCase();}};},"@VERSION@");