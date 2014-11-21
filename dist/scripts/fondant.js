/*! fondant 0.0.8 | MIT License | github.com/zedgu/fondant */"use strict";angular.module("fondant",["angularFileUpload"]).factory("fondantGroup",[function(){var a={},b=function(){this.$items={trigger:[],target:[]},this.$current=null,this.$off=angular.noop};return b.prototype.get=function(a,b){var c=this.$items[a]||this.set(a);return angular.isNumber(b)&&(c=angular.element(c).eq(b)),c},b.prototype.set=function(a,b){return this.$items[a]=angular.isDefined(b)?b:[],this.$items[a]},b.prototype.add=function(a,b){return this.get(a).push(b)-1},b.prototype.index=function(a,b){return this.get(a).indexOf(b)},b.prototype.current=function(a){return angular.isDefined(a)?void(this.$current=a):this.$current},b.prototype.off=function(a){return angular.isFunction(a)&&(this.$off=a),this.$off},b.prototype.target=function(a){return this.get("target",a)},b.prototype.rotate=function(a,b,c){c=c||"show",b=b||"target",null===this.current()&&this.current(0),a!==this.current()&&(this.get(b,this.current()).removeClass(c),"target"!==b&&this.get("target",this.current()).removeClass("show")),this.get(b,a).addClass(c),"target"!==b&&this.get("target",a).addClass("show"),this.current(a)},{get:function(b,c){var d=a[b];return d?d:this.set(b,c)},set:function(c,d){return a[c]=new b(d),a[c]},create:function(a){return new b(a)}}}]).directive("fd",["$q",function(){return{scope:!0,restrict:"C",controller:function(){}}}]).directive("filefield",[function(){return{restrict:"C",scope:!0,require:"^fd",controller:function(a,b){angular.forEach(b.find("input"),function(a){var b=this;"file"===a.type?(this.fileInput=angular.element(a),angular.isUndefined(this.fileInput.attr("fd-multiple"))&&angular.element(a).bind("change",function(){b.inputForShow.val(this.value.split("\\").pop())})):"text"===a.type&&(this.inputForShow=angular.element(a))},a)}}}]).directive("fdDropdown",["$document","$timeout","fondantGroup",function(a,b,c){return{restrict:"A",scope:{ev:"@fdDropdown",group:"@"},controller:function(d,e,f){d.groupName=f.fdDropdown||"$$"+d.$parent.$id+".dropdown";var g=c.get(d.groupName),h=e.hasClass("dropdown")?"target":"trigger",i=g.add(h,e[0]);d.$watch("$location.path",g.off()),"trigger"===h&&e.bind("mouseenter",function(c){c.preventDefault(),c.stopPropagation(),d.isOpened?b.cancel(d.timeout):e.hasClass("disabled")||e.prop("disabled")||(g.off(function(){a.unbind("click",g.off()),g.target(i).removeClass("show"),g.off(angular.noop),d.isOpened=!1}),console.log(g),g.target(i).addClass("show"),d.isOpened=!0,a.bind("click",g.off()))})}}}]).directive("fdTab",["fondantGroup",function(a){var b={hover:"mouseenter",click:"click",hold:"mouseenter"};return{scope:!0,restrict:"A",require:"^fd",controller:function(c,d,e){c.groupName=e.fdTab||"$$"+c.$parent.$id+".tab";var f=a.get(c.groupName),g=void 0===e.fdContent?"trigger":"target",h=b[e.fdEvent]||b.click,i=f.add(g,d[0]);"trigger"===g&&(d.hasClass("active")&&f.current(i),d.bind(h,function(a){a.preventDefault(),a.stopPropagation(),f.current()!==i&&(d.hasClass("disabled")||d.prop("disabled")||f.rotate(i,"trigger","active"))}))}}}]).directive("fdMultiple",[function(){return{scope:!0,restrict:"A",require:"^fd",controller:function(a,b,c){console.log(a),"INPUT"===b[0].tagName&&(console.log(c),b.attr("multiple","multiple"),b.on("change",function(a){for(var b=a.target.files,c=b.length-1,d=b[c];c>=0;c--)console.log(d)}))}}}]).directive("fdMultipleDrop",["$fileUploader","$compile",function(a,b){return{scope:!0,restrict:"A",require:"^fd",controller:function(c,d,e){b("<div ng-file-drop><div ng-file-over>"+d.text()+'</div><output><ul><li ng-repeat="item in uploader.queue"><div>Name: {{ item.file.name }}</div><div>Size: {{ item.file.size/1024/1024|number:2 }} Mb</div></li></ul></output></div>')(c,function(a){d.empty().append(a)}),c.uploader=a.create({scope:c,url:e.fdAction||""})}}}]).directive("fdMenu",["fondantGroup","$document",function(a,b){return{scope:!0,restrict:"A",controller:function(c,d,e){var f=c.groupName?"mouseenter":"click";c.groupName=e.fdMenu||c.groupName?c.groupName+".sub":"$$"+c.$parent.$id+".menu",this.action=function(c,d){var e=a.get(c.groupName),g=d.hasClass("menu")?"target":"trigger",h=e.add(g,d[0]);"trigger"===g&&(d.bind(f,function(a){a.preventDefault(),a.stopPropagation(),null===e.current()&&(e.current(h),e.target(h).addClass("show"),e.off(function(){b.unbind("click",e.off()),e.target(e.current()).removeClass("show"),e.current(null),e.off(angular.noop)}),b.bind("click",e.off()))}),d.bind("mouseenter",function(){angular.element(d.parent()[0].getElementsByClassName("show")).removeClass("show"),!angular.isNumber(e.current())||d.hasClass("disabled")||d.prop("disabled")||e.rotate(h)}))}},link:function(a,b,c,d){d.action(a,b)}}}]);