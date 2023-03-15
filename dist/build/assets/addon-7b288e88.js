const N={methods:{actionStarted(){this.loading=!0},actionCompleted(s=null,e){this.loading=!1,s!==!1&&(this.$events.$emit("clear-selections"),this.$events.$emit("reset-action-modals"),e.callback&&Statamic.$callbacks.call(e.callback[0],...e.callback.slice(1)),e.message!==!1&&this.$toast.success(e.message||__("Action completed")),this.afterActionSuccessfullyCompleted())},afterActionSuccessfullyCompleted(){this.request()}}},L={data(){return{activePreset:null,activePresetPayload:{},searchQuery:"",activeFilters:{},activeFilterBadges:{}}},computed:{activeFilterCount(){let s=Object.keys(this.activeFilters).length;return this.activeFilters.hasOwnProperty("fields")&&(s=s+Object.keys(this.activeFilters.fields).filter(e=>e!="badge").length-1),s},hasActiveFilters(){return this.activeFilterCount>0}},methods:{searchChanged(s){this.searchQuery=s},hasFields(s){for(const e in s)if(s[e])return!0;return!1},filterChanged({handle:s,values:e},t=!0){e&&this.hasFields(e)?Vue.set(this.activeFilters,s,e):Vue.delete(this.activeFilters,s),t&&this.unselectAllItems()},filtersChanged(s){this.activeFilters={};for(const e in s){const t=s[e];this.filterChanged({handle:e,values:t},!1)}this.unselectAllItems()},filtersReset(){this.activePreset=null,this.activePresetPayload={},this.searchQuery="",this.activeFilters={},this.activeFilterBadges={}},unselectAllItems(){this.$refs.toggleAll&&this.$refs.toggleAll.uncheckAllItems()},selectPreset(s,e){this.activePreset=s,this.activePresetPayload=e,this.searchQuery=e.query,this.filtersChanged(e.filters)},autoApplyFilters(s){if(!s)return;let e={};s.filter(t=>!_.isEmpty(t.auto_apply)).forEach(t=>{e[t.handle]=t.auto_apply}),this.activeFilters=e}}},Q={props:{initialPerPage:{type:Number,default(){return Statamic.$config.get("paginationSize")}}},data(){return{perPage:this.initialPerPage,page:1}},mounted(){this.setInitialPerPage()},methods:{setInitialPerPage(){this.hasPreferences&&(this.perPage=this.getPreference("per_page")||this.initialPerPage)},changePerPage(s){s=parseInt(s),(this.hasPreferences?this.setPreference("per_page",s!=this.initialPerPage?s:null):Promise.resolve()).then(t=>{this.perPage=s,this.resetPage()})},selectPage(s){this.page=s},resetPage(){this.page=1}}},B={data(){return{preferencesPrefix:null}},computed:{hasPreferences(){return this.preferencesPrefix!==null}},methods:{preferencesKey(s){return`${this.preferencesPrefix}.${s}`},getPreference(s){return this.$preferences.get(this.preferencesKey(s))},setPreference(s,e){return this.$preferences.set(this.preferencesKey(s),e)},removePreference(s,e=null){return this.$preferences.remove(this.preferencesKey(s),e)}}};function w(s,e,t,i,r,o,l,a){var n=typeof s=="function"?s.options:s;e&&(n.render=e,n.staticRenderFns=t,n._compiled=!0),i&&(n.functional=!0),o&&(n._scopeId="data-v-"+o);var c;if(l?(c=function(h){h=h||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!h&&typeof __VUE_SSR_CONTEXT__<"u"&&(h=__VUE_SSR_CONTEXT__),r&&r.call(this,h),h&&h._registeredComponents&&h._registeredComponents.add(l)},n._ssrRegister=c):r&&(c=a?function(){r.call(this,(n.functional?this.parent:this).$root.$options.shadowRoot)}:r),c)if(n.functional){n._injectStyles=c;var u=n.render;n.render=function(y,x){return c.call(x),u(y,x)}}else{var m=n.beforeCreate;n.beforeCreate=m?[].concat(m,c):[c]}return{exports:s,options:n}}const H={mixins:[N,L,Q,B],props:{initialSortColumn:String,initialSortDirection:String,initialColumns:{type:Array,default:()=>[]},filters:Array,actionUrl:String},data(){return{source:null,initializing:!0,loading:!0,items:[],columns:this.initialColumns,visibleColumns:this.initialColumns.filter(s=>s.visible),sortColumn:this.initialSortColumn,sortDirection:this.initialSortDirection,meta:null}},computed:{parameters(){return Object.assign({sort:this.sortColumn,order:this.sortDirection,page:this.page,perPage:this.perPage,search:this.searchQuery,filters:this.activeFilterParameters,columns:this.visibleColumns.map(s=>s.field).join(",")},this.additionalParameters)},activeFilterParameters(){return utf8btoa(JSON.stringify(this.activeFilters))},additionalParameters(){return{}},shouldRequestFirstPage(){return this.page>1&&this.items.length===0?(this.page=1,!0):!1}},created(){this.autoApplyFilters(this.filters),this.request()},watch:{parameters:{deep:!0,handler(s,e){e.search===s.search&&JSON.stringify(e)!==JSON.stringify(s)&&this.request()}},loading:{immediate:!0,handler(s){this.$progress.loading(this.listingKey,s)}},searchQuery(s){this.sortColumn=null,this.sortDirection=null,this.resetPage(),this.request()}},methods:{request(){if(!this.requestUrl){this.loading=!1;return}this.loading=!0,this.source&&this.source.cancel(),this.source=this.$axios.CancelToken.source(),this.$axios.get(this.requestUrl,{params:this.parameters,cancelToken:this.source.token}).then(s=>{if(this.columns=s.data.meta.columns,this.activeFilterBadges={...s.data.meta.activeFilterBadges},this.items=Object.values(s.data.data),this.meta=s.data.meta,this.shouldRequestFirstPage)return this.request();this.loading=!1,this.initializing=!1,this.afterRequestCompleted()}).catch(s=>{this.$axios.isCancel(s)||(this.loading=!1,this.initializing=!1,this.$toast.error(s.response?s.response.data.message:__("Something went wrong"),{duration:null}))})},afterRequestCompleted(s){},sorted(s,e){this.sortColumn=s,this.sortDirection=e},removeRow(s){let e=s.id,t=_.indexOf(this.rows,_.findWhere(this.rows,{id:e}));this.rows.splice(t,1),this.rows.length===0&&location.reload()}}},V=null,K=null;var W=w(H,V,K,!1,null,null,null,null);const G=W.exports,J={mixins:[G],props:{listingKey:String},data(){return{preferencesPrefix:"mb_members",requestUrl:cp_url("memberbox")}},methods:{filterActions(s){return s.filter(e=>["delete"].includes(e.handle))}}};var X=function(){var e=this,t=e._self._c;return t("div",[e.initializing?t("div",{staticClass:"card loading"},[t("loading-graphic")],1):e._e(),e.initializing?e._e():t("data-list",{attrs:{columns:e.columns,rows:e.items,sort:!1,"sort-column":e.sortColumn,"sort-direction":e.sortDirection},scopedSlots:e._u([{key:"default",fn:function({hasSelections:i}){return t("div",{},[t("div",{staticClass:"card p-0 relative"},[t("div",{staticClass:"data-list-header"},[t("data-list-search",{model:{value:e.searchQuery,callback:function(r){e.searchQuery=r},expression:"searchQuery"}})],1),t("div",{directives:[{name:"show",rawName:"v-show",value:e.items.length===0,expression:"items.length === 0"}],staticClass:"jstw-p-6 text-center jstw-text-gray-500",domProps:{textContent:e._s(e.__("No members found"))}}),t("data-list-bulk-actions",{staticClass:"rounded",attrs:{url:e.actionUrl},on:{started:e.actionStarted,completed:e.actionCompleted}}),t("data-list-table",{directives:[{name:"show",rawName:"v-show",value:e.items.length,expression:"items.length"}],attrs:{"allow-bulk-actions":!1,"allow-column-picker":!0,"column-preferences-key":e.preferencesKey("columns")},on:{sorted:e.sorted},scopedSlots:e._u([{key:"cell-email",fn:function({row:r,value:o}){return[t("a",{attrs:{href:e.cp_url(`memberbox/${r.id}`)}},[e._v(" "+e._s(o)+" ")])]}},{key:"cell-groups",fn:function({row:r,value:o}){return e._l(o||[],function(l){return t("span",{staticClass:"badge-pill-sm jstw-mr-1"},[e._v(e._s(l.title))])})}},{key:"actions",fn:function({row:r,index:o}){return[t("dropdown-list",[r.editable?t("dropdown-item",{attrs:{text:e.__("Edit"),redirect:e.cp_url(`memberbox/${r.id}`)}}):e._e(),t("data-list-inline-actions",{attrs:{item:r.id,url:e.actionUrl,actions:e.filterActions(r.actions)},on:{started:e.actionStarted,completed:e.actionCompleted}})],1)]}}],null,!0)})],1),t("data-list-pagination",{staticClass:"jstw-mt-6",attrs:{"show-totals":!0,"resource-meta":e.meta,"per-page":e.perPage},on:{"page-selected":e.selectPage,"per-page-changed":e.changePerPage}})],1)}}],null,!1,1514602787)})],1)},Z=[],Y=w(J,X,Z,!1,null,null,null,null);const ee=Y.exports;function te(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var S={},se={get exports(){return S},set exports(s){S=s}},b={},re={get exports(){return b},set exports(s){b=s}};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;function t(r){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?t=function(l){return typeof l}:t=function(l){return l&&typeof Symbol=="function"&&l.constructor===Symbol&&l!==Symbol.prototype?"symbol":typeof l},t(r)}function i(r){var o=typeof r=="string"||r instanceof String;if(!o){var l=t(r);throw r===null?l="null":l==="object"&&(l=r.constructor.name),new TypeError("Expected a string but received a ".concat(l))}}s.exports=e.default,s.exports.default=e.default})(re,b);var C={},ae={get exports(){return C},set exports(s){C=s}};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t;function t(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;for(var o in r)typeof i[o]>"u"&&(i[o]=r[o]);return i}s.exports=e.default,s.exports.default=e.default})(ae,C);var F={},ie={get exports(){return F},set exports(s){F=s}};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var t=i(b);function i(l){return l&&l.__esModule?l:{default:l}}function r(l){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?r=function(n){return typeof n}:r=function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},r(l)}function o(l,a){(0,t.default)(l);var n,c;r(a)==="object"?(n=a.min||0,c=a.max):(n=arguments[1],c=arguments[2]);var u=encodeURI(l).split(/%..|./).length-1;return u>=n&&(typeof c>"u"||u<=c)}s.exports=e.default,s.exports.default=e.default})(ie,F);var $={},ne={get exports(){return $},set exports(s){$=s}};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=l;var t=r(b),i=r(C);function r(a){return a&&a.__esModule?a:{default:a}}var o={require_tld:!0,allow_underscores:!1,allow_trailing_dot:!1,allow_numeric_tld:!1,allow_wildcard:!1};function l(a,n){(0,t.default)(a),n=(0,i.default)(n,o),n.allow_trailing_dot&&a[a.length-1]==="."&&(a=a.substring(0,a.length-1)),n.allow_wildcard===!0&&a.indexOf("*.")===0&&(a=a.substring(2));var c=a.split("."),u=c[c.length-1];return n.require_tld&&(c.length<2||!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(u)||/\s/.test(u))||!n.allow_numeric_tld&&/^\d+$/.test(u)?!1:c.every(function(m){return!(m.length>63||!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(m)||/[\uff01-\uff5e]/.test(m)||/^-|-$/.test(m)||!n.allow_underscores&&/_/.test(m))})}s.exports=e.default,s.exports.default=e.default})(ne,$);var j={},le={get exports(){return j},set exports(s){j=s}};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=c;var t=i(b);function i(u){return u&&u.__esModule?u:{default:u}}var r="(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])",o="(".concat(r,"[.]){3}").concat(r),l=new RegExp("^".concat(o,"$")),a="(?:[0-9a-fA-F]{1,4})",n=new RegExp("^("+"(?:".concat(a,":){7}(?:").concat(a,"|:)|")+"(?:".concat(a,":){6}(?:").concat(o,"|:").concat(a,"|:)|")+"(?:".concat(a,":){5}(?::").concat(o,"|(:").concat(a,"){1,2}|:)|")+"(?:".concat(a,":){4}(?:(:").concat(a,"){0,1}:").concat(o,"|(:").concat(a,"){1,3}|:)|")+"(?:".concat(a,":){3}(?:(:").concat(a,"){0,2}:").concat(o,"|(:").concat(a,"){1,4}|:)|")+"(?:".concat(a,":){2}(?:(:").concat(a,"){0,3}:").concat(o,"|(:").concat(a,"){1,5}|:)|")+"(?:".concat(a,":){1}(?:(:").concat(a,"){0,4}:").concat(o,"|(:").concat(a,"){1,6}|:)|")+"(?::((?::".concat(a,"){0,5}:").concat(o,"|(?::").concat(a,"){1,7}|:))")+")(%[0-9a-zA-Z-.:]{1,})?$");function c(u){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";if((0,t.default)(u),m=String(m),!m)return c(u,4)||c(u,6);if(m==="4"){if(!l.test(u))return!1;var h=u.split(".").sort(function(y,x){return y-x});return h[3]<=255}return m==="6"?!!n.test(u):!1}s.exports=e.default,s.exports.default=e.default})(le,j);(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=T;var t=a(b),i=a(C),r=a(F),o=a($),l=a(j);function a(f){return f&&f.__esModule?f:{default:f}}var n={allow_display_name:!1,require_display_name:!1,allow_utf8_local_part:!0,require_tld:!0,blacklisted_chars:"",ignore_max_length:!1,host_blacklist:[]},c=/^([^\x00-\x1F\x7F-\x9F\cX]+)</i,u=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i,m=/^[a-z\d]+$/,h=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i,y=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i,x=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i,z=254;function M(f){var d=f.replace(/^"(.+)"$/,"$1");if(!d.trim())return!1;var P=/[\.";<>]/.test(d);if(P){if(d===f)return!1;var v=d.split('"').length===d.split('\\"').length;if(!v)return!1}return!0}function T(f,d){if((0,t.default)(f),d=(0,i.default)(d,n),d.require_display_name||d.allow_display_name){var P=f.match(c);if(P){var v=P[1];if(f=f.replace(v,"").replace(/(^<|>$)/g,""),v.endsWith(" ")&&(v=v.substr(0,v.length-1)),!M(v))return!1}else if(d.require_display_name)return!1}if(!d.ignore_max_length&&f.length>z)return!1;var D=f.split("@"),g=D.pop(),k=g.toLowerCase();if(d.host_blacklist.includes(k))return!1;var p=D.join("@");if(d.domain_specific_validation&&(k==="gmail.com"||k==="googlemail.com")){p=p.toLowerCase();var q=p.split("+")[0];if(!(0,r.default)(q.replace(/\./g,""),{min:6,max:30}))return!1;for(var U=q.split("."),E=0;E<U.length;E++)if(!m.test(U[E]))return!1}if(d.ignore_max_length===!1&&(!(0,r.default)(p,{max:64})||!(0,r.default)(g,{max:254})))return!1;if(!(0,o.default)(g,{require_tld:d.require_tld})){if(!d.allow_ip_domain)return!1;if(!(0,l.default)(g)){if(!g.startsWith("[")||!g.endsWith("]"))return!1;var R=g.substr(1,g.length-2);if(R.length===0||!(0,l.default)(R))return!1}}if(p[0]==='"')return p=p.slice(1,p.length-1),d.allow_utf8_local_part?x.test(p):h.test(p);for(var I=d.allow_utf8_local_part?y:u,O=p.split("."),A=0;A<O.length;A++)if(!I.test(O[A]))return!1;return!(d.blacklisted_chars&&p.search(new RegExp("[".concat(d.blacklisted_chars,"]+"),"g"))!==-1)}s.exports=e.default,s.exports.default=e.default})(se,S);const oe=te(S),ce={data(){return{currentStep:0}},computed:{onFirstStep(){return this.currentStep===0},onLastStep(){return this.currentStep===this.steps.length-1},canContinue(){return this.canGoToStep(this.currentStep+1)}},methods:{goToStep(s){this.canGoToStep(s)&&(this.currentStep=s)},next(){this.onLastStep||this.goToStep(this.currentStep+1)},previous(){this.onFirstStep||this.goToStep(this.currentStep-1)}}},ue={mixins:[ce],props:{publishContainer:String,initialFieldset:Object,initialFields:Array,initialValues:Object,initialMeta:Object,route:{type:String},usersCreateUrl:{type:String},usersIndexUrl:{type:String},activationExpiry:{type:Number}},data(){return{fieldset:_.clone(this.initialFieldset),fields:_.clone(this.initialFields),values:_.clone(this.initialValues),meta:_.clone(this.initialMeta),error:null,errors:{},steps:[__("Member Information"),__("Customize Invitation")],invitation:{send:!0,subject:__("statamic-memberbox::messages.invitation_subject",{site:window.location.hostname}),message:__("statamic-memberbox::messages.invitation_body",{site:window.location.hostname,expiry:this.activationExpiry})},completed:!1,activationUrl:null,editUrl:null}},computed:{finishButtonText(){return this.invitation.send?__("Create and Send Email"):__("Create Member")},isValidEmail(){return this.values.email&&oe(this.values.email)},hasErrors(){return this.error||Object.keys(this.errors).length}},methods:{canGoToStep(s){return this.completed?!1:s>=1?this.isValidEmail:!0},clearErrors(){this.error=null,this.errors={}},submit(){this.clearErrors();let s={...this.values,invitation:this.invitation};this.$axios.post(this.route,s).then(e=>{this.completed=!0,this.editUrl=e.data.redirect,this.activationUrl=e.data.activationUrl}).catch(e=>{this.currentStep=0,this.$nextTick(()=>{if(e.response&&e.response.status===422){const{message:t,errors:i}=e.response.data;this.error=t,this.errors=i,this.$toast.error(t)}else this.$toast.error(e.response.data.message)})})}},mounted(){this.$keys.bindGlobal(["command+return"],s=>{this.next()}),this.$keys.bindGlobal(["command+delete"],s=>{this.previous()})}};var de=function(){var e=this,t=e._self._c;return t("div",{staticClass:"max-w-xl mx-auto rounded shadow bg-white"},[t("div",{staticClass:"max-w-lg mx-auto jstw-pt-16 relative"},[t("div",{staticClass:"wizard-steps"},e._l(e.steps,function(i,r){return t("a",{staticClass:"step",class:{complete:e.currentStep>=r},on:{click:function(o){return e.goToStep(r)}}},[t("div",{staticClass:"ball"},[e._v(e._s(r+1))]),t("div",{staticClass:"label"},[e._v(e._s(i))])])}),0)]),!e.completed&&e.currentStep===0?t("div",[t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-py-16 jstw-pb-10 text-center"},[t("h1",{staticClass:"jstw-mb-6"},[e._v(e._s(e.__("Create Member")))]),t("p",{staticClass:"jstw-text-gray",domProps:{textContent:e._s(e.__("statamic-memberbox::messages.member_wizard_intro"))}})]),t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-pb-16"},[t("div",[e.fields.length?t("publish-container",{ref:"container",attrs:{name:e.publishContainer,blueprint:e.fieldset,values:e.values,meta:e.meta,errors:e.errors},on:{updated:function(i){e.values=i}},scopedSlots:e._u([{key:"default",fn:function({setFieldValue:i,setFieldMeta:r}){return t("publish-fields",{attrs:{fields:e.fields},on:{updated:i,"meta-updated":r}})}}],null,!1,1196063591)}):e._e()],1)])]):e._e(),!e.completed&&e.currentStep===1?t("div",[t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-py-16 text-center"},[t("h1",{staticClass:"jstw-mb-6"},[e._v(e._s(e.__("Invitation")))]),t("p",{staticClass:"jstw-text-gray",domProps:{textContent:e._s(e.__("statamic-memberbox::messages.member_wizard_invitation_intro"))}})]),t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-mb-6 flex items-center justify-center"},[t("toggle-input",{model:{value:e.invitation.send,callback:function(i){e.$set(e.invitation,"send",i)},expression:"invitation.send"}}),t("label",{staticClass:"font-bold jstw-ml-2"},[e._v(e._s(e.__("Send Email Invitation")))])],1),e.invitation.send?t("div",{staticClass:"max-w-lg mx-auto jstw-bg-gray-100 jstw-py-10 jstw-mb-20 border rounded-lg"},[t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-pb-10"},[t("label",{staticClass:"font-bold text-base jstw-mb-1",attrs:{for:"email"}},[e._v(e._s(e.__("Email Subject")))]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.invitation.subject,expression:"invitation.subject"}],staticClass:"input-text bg-white",attrs:{type:"text"},domProps:{value:e.invitation.subject},on:{input:function(i){i.target.composing||e.$set(e.invitation,"subject",i.target.value)}}})]),t("div",{staticClass:"max-w-md mx-auto jstw-px-4"},[t("label",{staticClass:"font-bold text-base jstw-mb-1",attrs:{for:"email"}},[e._v(e._s(e.__("Email Content")))]),t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.invitation.message,expression:"invitation.message"},{name:"elastic",rawName:"v-elastic"}],staticClass:"input-text jstw-min-h-40 jstw-p-4 bg-white",domProps:{value:e.invitation.message},on:{input:function(i){i.target.composing||e.$set(e.invitation,"message",i.target.value)}}})])]):t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-pb-20 text-center"},[t("p",{staticClass:"jstw-mb-2",domProps:{innerHTML:e._s(e.__("statamic-memberbox::messages.member_wizard_invitation_share_before",{email:e.values.email}))}})])]):e._e(),e.completed?t("div",[t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-py-16 text-center"},[t("h1",{staticClass:"jstw-mb-6"},[e._v(e._s(e.__("Member Created")))]),t("p",{staticClass:"jstw-text-gray",domProps:{innerHTML:e._s(e.__("statamic-memberbox::messages.member_wizard_account_created"))}})]),e.invitation.send?e._e():t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-pb-20 text-center"},[t("p",{staticClass:"jstw-mb-2",domProps:{innerHTML:e._s(e.__("statamic-memberbox::messages.member_wizard_invitation_share",{email:e.values.email}))}}),t("textarea",{directives:[{name:"elastic",rawName:"v-elastic"}],staticClass:"input-text",attrs:{readonly:"",onclick:"this.select()"}},[e._v(e._s(e.__("Activation URL"))+": "+e._s(e.activationUrl)+" "+e._s(e.__("Username"))+": "+e._s(e.values.email)+" ")])]),e.invitation.send?t("div",{staticClass:"max-w-md mx-auto jstw-px-4 jstw-pb-20 text-center"},[t("p",{staticClass:"jstw-mb-2",domProps:{innerHTML:e._s(e.__("statamic-memberbox::messages.member_wizard_invitation_sent",{email:e.values.email}))}})]):e._e()]):e._e(),t("div",{staticClass:"border-t jstw-p-4"},[t("div",{staticClass:"max-w-md mx-auto flex items-center justify-center"},[!e.completed&&!e.onFirstStep?t("button",{staticClass:"btn jstw-mx-4 w-32",attrs:{tabindex:"3"},on:{click:e.previous}},[e._v(" ← "+e._s(e.__("Previous"))+" ")]):e._e(),!e.completed&&!e.onLastStep?t("button",{staticClass:"btn jstw-mx-4 w-32",attrs:{tabindex:"4",disabled:!e.canContinue},on:{click:e.next}},[e._v(" "+e._s(e.__("Next"))+" → ")]):e._e(),!e.completed&&e.onLastStep?t("button",{staticClass:"btn-primary jstw-mx-4",attrs:{tabindex:"4"},on:{click:e.submit}},[e._v(" "+e._s(e.finishButtonText)+" ")]):e._e(),e.completed?t("a",{staticClass:"btn jstw-mx-4",attrs:{href:e.usersIndexUrl}},[e._v(" "+e._s(e.__("Back to Members"))+" ")]):e._e(),e.completed?t("a",{staticClass:"btn-primary jstw-mx-4",attrs:{href:e.usersCreateUrl}},[e._v(" "+e._s(e.__("Create Another"))+" ")]):e._e()])])])},me=[],fe=w(ue,de,me,!1,null,null,null,null);const _e=fe.exports,he={props:{saveUrl:String},data(){return{saving:!1,error:null,errors:{},password:null,confirmation:null,reveal:!1}},computed:{hasErrors(){return this.error||Object.keys(this.errors).length},inputType(){return this.reveal?"text":"password"}},methods:{clearErrors(){this.error=null,this.errors={}},save(){this.clearErrors(),this.saving=!0,this.$axios.patch(this.saveUrl,{password:this.password,password_confirmation:this.confirmation}).then(s=>{this.$toast.success(__("Password changed")),this.$refs.popper.close(),this.saving=!1,this.password=null,this.confirmation=null}).catch(s=>{if(s.response&&s.response.status===422){const{message:e,errors:t}=s.response.data;this.error=e,this.errors=t,this.$toast.error(e),this.saving=!1}else this.$toast.error(__("Unable to change password")),this.saving=!1})}}};var pe=function(){var e=this,t=e._self._c;return t("popover",{ref:"popper",attrs:{placement:"bottom"}},[t("button",{staticClass:"btn",attrs:{slot:"trigger"},domProps:{textContent:e._s(e.__("Change Password"))},slot:"trigger"}),e.saving?t("div",{staticClass:"saving flex justify-center text-center"},[t("loading-graphic",{attrs:{text:e.__("Saving")}})],1):e._e(),t("div",{staticClass:"publish-fields p-2 pb-0 w-96"},[t("form-group",{staticClass:"p-0 mb-3",attrs:{handle:"password",display:e.__("Password"),errors:e.errors.password,config:{input_type:this.inputType}},model:{value:e.password,callback:function(i){e.password=i},expression:"password"}}),t("form-group",{staticClass:"p-0 mb-3",attrs:{handle:"confirmation",display:e.__("Password Confirmation"),config:{input_type:this.inputType}},model:{value:e.confirmation,callback:function(i){e.confirmation=i},expression:"confirmation"}})],1),t("div",{staticClass:"flex items-center bg-grey-21 border-t rounded-b px-2 py-1"},[t("button",{staticClass:"btn-primary",on:{click:function(i){return i.preventDefault(),e.save.apply(null,arguments)}}},[e._v(e._s(e.__("Change Password")))]),t("label",{staticClass:"ml-2"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.reveal,expression:"reveal"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.reveal)?e._i(e.reveal,null)>-1:e.reveal},on:{change:function(i){var r=e.reveal,o=i.target,l=!!o.checked;if(Array.isArray(r)){var a=null,n=e._i(r,a);o.checked?n<0&&(e.reveal=r.concat([a])):n>-1&&(e.reveal=r.slice(0,n).concat(r.slice(n+1)))}else e.reveal=l}}}),e._v(" "+e._s(e.__("Reveal Password"))+" ")])])])},ve=[],ge=w(he,pe,ve,!1,null,null,null,null);const be=ge.exports,xe={components:{ChangePassword:be},props:{publishContainer:String,initialFieldset:Object,initialValues:Object,initialMeta:Object,initialReference:String,initialTitle:String,actions:Object,method:String,canEditPassword:Boolean},data(){return{fieldset:_.clone(this.initialFieldset),values:_.clone(this.initialValues),meta:_.clone(this.initialMeta),error:null,errors:{},title:this.initialTitle}},computed:{hasErrors(){return this.error||Object.keys(this.errors).length}},methods:{clearErrors(){this.error=null,this.errors={}},save(){this.clearErrors(),this.$axios[this.method](this.actions.save,this.values).then(s=>{this.title=s.data.title,this.isCreating||this.$toast.success(__("Saved")),this.$refs.container.saved(),this.$nextTick(()=>this.$emit("saved",s))}).catch(s=>{if(s.response&&s.response.status===422){const{message:e,errors:t}=s.response.data;this.error=e,this.errors=t,this.$toast.error(e)}else this.$toast.error(__("Something went wrong"))})}},mounted(){this.$keys.bindGlobal(["mod+s"],s=>{s.preventDefault(),this.save()})}};var we=function(){var e=this,t=e._self._c;return t("div",[t("header",{staticClass:"jstw-mb-6"},[t("breadcrumb",{attrs:{url:e.cp_url("memberbox"),title:e.__("Members")}}),t("div",{staticClass:"flex items-center"},[t("h1",{staticClass:"flex-1",domProps:{textContent:e._s(e.title)}}),e.canEditPassword?t("change-password",{staticClass:"jstw-mr-4",attrs:{"save-url":e.actions.password}}):e._e(),t("button",{staticClass:"btn-primary",domProps:{textContent:e._s(e.__("Save"))},on:{click:function(i){return i.preventDefault(),e.save.apply(null,arguments)}}}),e._t("action-buttons-right")],2)],1),e.fieldset?t("publish-container",{ref:"container",attrs:{name:e.publishContainer,blueprint:e.fieldset,values:e.values,reference:e.initialReference,meta:e.meta,errors:e.errors},on:{updated:function(i){e.values=i}},scopedSlots:e._u([{key:"default",fn:function({container:i,setFieldValue:r,setFieldMeta:o}){return t("div",{},[t("publish-sections",{attrs:{"enable-sidebar":!1,"can-toggle-labels":!0},on:{updated:r,"meta-updated":o,focus:function(l){return i.$emit("focus",l)},blur:function(l){return i.$emit("blur",l)}}})],1)}}],null,!1,2801405004)}):e._e()],1)},ye=[],Ce=w(xe,we,ye,!1,null,null,null,null);const Pe=Ce.exports,Se={mixins:[Listing],props:{paginate:Boolean,listingKey:String},data(){return{cols:[{label:"Email",field:"email",visible:!0},{label:"Name",field:"name",visible:!0}],requestUrl:cp_url("memberbox")}}};var Fe=function(){var e=this,t=e._self._c;return t("div",[e.initializing?t("div",{staticClass:"loading"},[t("loading-graphic")],1):e._e(),!e.initializing&&e.items.length?t("data-list",{attrs:{rows:e.items,columns:e.cols,sort:!1,"sort-column":e.sortColumn,"sort-direction":e.sortDirection},scopedSlots:e._u([{key:"default",fn:function({}){return t("div",{},[t("data-list-table",{attrs:{loading:e.loading},scopedSlots:e._u([{key:"cell-email",fn:function({row:i,value:r}){return[t("a",{attrs:{href:e.cp_url(`memberbox/${i.id}`)}},[e._v(" "+e._s(r)+" ")])]}},{key:"cell-name",fn:function({row:i,value:r}){return[e._v(" "+e._s(r)+" ")]}}],null,!0)}),e.paginate&&e.meta.last_page!=1?t("data-list-pagination",{staticClass:"jstw-py-2 border-t jstw-bg-gray-200 rounded-b-lg text-sm",attrs:{"resource-meta":e.meta,"scroll-to-top":!1},on:{"page-selected":e.selectPage}}):e._e()],1)}}],null,!1,3601618221)}):!e.initializing&&!e.items.length?t("p",{staticClass:"jstw-p-4 jstw-pt-2 text-sm jstw-text-gray-500"},[e._v(" "+e._s(e.__("There are no members"))+" ")]):e._e()],1)},$e=[],je=w(Se,Fe,$e,!1,null,null,null,null);const ke=je.exports;Statamic.booting(()=>{Statamic.component("memberbox-members-listing",ee),Statamic.component("memberbox-members-wizard",_e),Statamic.component("memberbox-members-publish-form",Pe),Statamic.component("memberbox-members-widget",ke)});