(()=>{"use strict";var e={n:t=>{var i=t&&t.__esModule?()=>t.default:()=>t;return e.d(i,{a:i}),i},d:(t,i)=>{for(var n in i)e.o(i,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:i[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=jQuery;var i=e.n(t),__=function(e,t){return"undefined"!=typeof window&&window.wp&&window.wp.i18n?window.wp.i18n.__(e,t):e};i()(document).ready((function(){var e=new function(){this.started=!1,this.interval_count=0};if(!n())return;var t=wp.data.select("core/editor");wp.data.subscribe((function(){var i,n=t.getCurrentPost();if(n&&n!=={}){e.first_modified||(e.first_modified=n.modified);var a=n.modified,o=n.status,r=n.id;r&&(e.post_id=r);var d=null===(i=document.querySelector("[name=send_sib_push_notification]"))||void 0===i?void 0:i.checked,l=a!==e.first_modified,u="publish"===o;!e.started&&l&&d&&u&&(e.interval=setInterval(s,3e3),e.started=!0)}}));var s=function(){if(window.ajaxurl&&e.post_id){var t={action:"sib_push_get_post_metadata",post_id:e.post_id};window.brevo_push_notice&&(t.nonce=window.brevo_push_notice.nonce),i().get(window.ajaxurl,t,(function(e){var t=e.info_message,i=e.error_message;window.DEBUG_MODE&&console.log(e),t&&a(t),i&&o(i),(t||i)&&r()})),e.interval_count>20&&r(),e.interval_count+=1}},a=function(e){wp.data.dispatch("core/notices").createNotice("info",e,{id:"wonderpush-notice",isDismissible:!0})},o=function(e){wp.data.dispatch("core/notices").createNotice("error",e,{isDismissible:!0,id:"wonderpush-error"})},r=function(){e.interval&&clearInterval(e.interval),e.interval=void 0,e.interval_count=0,e.started=!1,e.first_modified=void 0}}));var n=function(){return!!("undefined"!=typeof wp&&wp&&wp.data&&wp.data.select("core/editor"))||("undefined"!=typeof wp&&wp?wp.data?wp.data.select("core/editor")||'wp.data.select("core/editor")':"wp.data":"wp",!1)},s=function(){function e(e,t){this.element=e,this.editor=t,this.spinner=e.querySelector("span.spinner")||void 0,this.activatingMessageSpan=e.querySelector("span.sib_push_activating_message")||void 0,this.activationButton=e.querySelector("button#sib_push_activation_button")||void 0,this.setLoading(!1)}return e.prototype.setLoading=function(e){var t=this;this.activatingMessageSpan&&(this.activatingMessageSpan.style.display=e?"":"none"),this.spinner&&(e?this.spinner.classList.add("is-active"):this.spinner.classList.remove("is-active")),this.activationButton&&(this.activationButton.disabled=e,this.activationButton.addEventListener("click",(function(){t.activate().then((function(){t.setPushActive(!0)})).catch((function(){t.setPushActive(!1)}))})))},e.prototype.setPushActive=function(e){this.editor.setEnabled(e),this.element.style.display=e?"none":""},e.prototype.activate=function(){var e=this;return this.setLoading(!0),new Promise((function(t,n){var s,a={action:"sib_push_set_push_activated",activated:"true",nonce:null===(s=window.brevo_push_notice)||void 0===s?void 0:s.nonce};window.ajaxurl&&i().post(window.ajaxurl,a,(function(i){e.setLoading(!1),i.error?(console.error(i.error),n(i.error)):(e.setPushActive(!0),t())}))}))},e}(),a=function(){function e(e,t){var n,s,a,o,r,d,l,u=this;this.element=e,this.enabled=!0,this.audienceRadios=[],this.utmParametersSummary=document.createElement("div"),this.showUtmParameters=!1,this.utmParametersSummary.className="sib_push_utm_summary",this.utmParametersContainer=e.querySelector(".sib_push_utm_parameters")||void 0,this.allContainer=e.querySelector("div.sib_push_all")||void 0,this.segmentsContainer=e.querySelector("div.sib_push_segments")||void 0,this.listsContainer=e.querySelector("div.sib_push_lists")||void 0,this.tagsContainer=e.querySelector("div.sib_push_tags")||void 0,this.delaySelect=e.querySelector("select[name=sib_push_send_notification_delay_seconds]")||void 0,this.sendCheckbox=e.querySelector("input[name=send_sib_push_notification]")||void 0;var c=null===(n=this.tagsContainer)||void 0===n?void 0:n.querySelector("#sib_push_target_tags");this.tagsSelect2=c?i()(c).select2({width:"inherit",placeholder:"Select tag(s)"}):void 0,this.allContent=(null===(s=this.allContainer)||void 0===s?void 0:s.querySelector("div.sib_push_target"))||void 0,this.segmentsContent=(null===(a=this.segmentsContainer)||void 0===a?void 0:a.querySelector("div.sib_push_target"))||void 0;var h=null===(o=this.segmentsContainer)||void 0===o?void 0:o.querySelector("#sib_push_target_brevo_segment_ids");this.segmentsSelect2=h?i()(h).select2({width:"inherit",placeholder:"Select segment(s)"}):void 0,this.listsContent=(null===(r=this.listsContainer)||void 0===r?void 0:r.querySelector("div.sib_push_target"))||void 0;var v=null===(d=this.listsContainer)||void 0===d?void 0:d.querySelector("#sib_push_target_brevo_list_ids");this.listsSelect2=v?i()(v).select2({width:"inherit",placeholder:"Select list(s)"}):void 0,this.tagsContent=(null===(l=this.tagsContainer)||void 0===l?void 0:l.querySelector("div.sib_push_target"))||void 0,this.audienceRadios=Array.from(e.querySelectorAll("input[name=sib_push_audience]")),this.audienceRadios.forEach((function(e){return e.addEventListener("change",(function(){return u.updateAudience()}))})),this.updateAudience(),this.updateUtmParams(),this.setEnabled(t)}return e.prototype.setEnabled=function(e){var t,i,n,s,a,o;this.enabled=e,this.element.style.opacity=e?"":"0.6",e?(null===(t=this.delaySelect)||void 0===t||t.removeAttribute("disabled"),null===(i=this.sendCheckbox)||void 0===i||i.removeAttribute("disabled"),null===(n=this.sendCheckbox)||void 0===n||n.setAttribute("checked","checked"),this.audienceRadios.forEach((function(e){return e.removeAttribute("disabled")}))):(this.audienceRadios.forEach((function(e){return e.setAttribute("disabled","disabled")})),null===(s=this.delaySelect)||void 0===s||s.setAttribute("disabled","disabled"),null===(a=this.sendCheckbox)||void 0===a||a.removeAttribute("checked"),null===(o=this.sendCheckbox)||void 0===o||o.setAttribute("disabled","disabled"))},e.prototype.updateUtmParams=function(){var e,t=this;if(this.utmParametersContainer)if(this.showUtmParameters)null===(e=this.utmParametersSummary.parentNode)||void 0===e||e.removeChild(this.utmParametersSummary),this.utmParametersContainer.style.display="";else{this.utmParametersContainer.style.display="none";var i=this.utmParametersContainer.parentNode;if(!i)return void console.warn("UTM container not attached");i.insertBefore(this.utmParametersSummary,this.utmParametersContainer),this.utmParametersSummary.innerHTML="";for(var n={},s=0,a=Array.from(this.utmParametersContainer.querySelectorAll("input[type=text]"));s<a.length;s++){var o=a[s],r=o.name.replace("sib_push_","");o.value&&(n[r]=o.value)}if(Object.keys(n).length){var d=document.createElement("code");d.innerText=Object.entries(n).map((function(e){var t=e[0],i=e[1];return"".concat(t,": ").concat(i)})).join(", "),this.utmParametersSummary.appendChild(d)}else this.utmParametersSummary.innerText=__("No utm parameter configured","post-editor");var l=document.createElement("a");l.href="#",l.innerText=__("Configure","post-editor"),l.className="sib_push_configure",l.addEventListener("click",(function(e){e.preventDefault(),t.enabled&&(t.showUtmParameters=!0,t.updateUtmParams())})),this.utmParametersSummary.appendChild(l)}},e.prototype.updateAudience=function(){var e,t,i,n,s,a,o,r,d,l,u,c;switch(null===(t=null===(e=this.segmentsContent)||void 0===e?void 0:e.parentNode)||void 0===t||t.removeChild(this.segmentsContent),null===(n=null===(i=this.listsContent)||void 0===i?void 0:i.parentNode)||void 0===n||n.removeChild(this.listsContent),null===(a=null===(s=this.tagsContent)||void 0===s?void 0:s.parentNode)||void 0===a||a.removeChild(this.tagsContent),null===(r=null===(o=this.allContent)||void 0===o?void 0:o.parentNode)||void 0===r||r.removeChild(this.allContent),this.audience){case"all":this.allContent&&(null===(d=this.allContainer)||void 0===d||d.appendChild(this.allContent));break;case"brevo_lists":this.listsContent&&(null===(l=this.listsContainer)||void 0===l||l.appendChild(this.listsContent));break;case"brevo_segments":this.segmentsContent&&(null===(u=this.segmentsContainer)||void 0===u||u.appendChild(this.segmentsContent));break;case"tags":this.tagsContent&&(null===(c=this.tagsContainer)||void 0===c||c.appendChild(this.tagsContent))}},Object.defineProperty(e.prototype,"audience",{get:function(){for(var e=0,t=this.audienceRadios;e<t.length;e++){var i=t[e];if(i.checked&&["all","tags","brevo_segments","brevo_lists"].indexOf(i.value)>=0)return i.value}return"all"},enumerable:!1,configurable:!0}),e}();window.addEventListener("load",(function(){var e=document.getElementById("sib_push_activation"),t=!e,i=document.querySelector("div#sib_push_editor");if(i instanceof HTMLDivElement){var n=new a(i,t);e instanceof HTMLDivElement&&new s(e,n)}}))})();