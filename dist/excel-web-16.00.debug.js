/* Excel-Online-specific API library */
/* Version: 16.0.9020.3000 */

/* Office.js Version: 16.0.8916.1000 */ 
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

/*
* @overview es6-promise - a tiny implementation of Promises/A+.
* @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
* @license   Licensed under MIT license
*            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
* @version   2.3.0
*/

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var OfficeExt;
(function (OfficeExt) {
	var MicrosoftAjaxFactory=(function () {
		function MicrosoftAjaxFactory() {
		}
		MicrosoftAjaxFactory.prototype.isMsAjaxLoaded=function () {
			if (typeof (Sys) !=='undefined' && typeof (Type) !=='undefined' &&
				Sys.StringBuilder && typeof (Sys.StringBuilder)==="function" &&
				Type.registerNamespace && typeof (Type.registerNamespace)==="function" &&
				Type.registerClass && typeof (Type.registerClass)==="function" &&
				typeof (Function._validateParams)==="function" &&
				Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof (Sys.Serialization.JavaScriptSerializer.serialize)==="function") {
				return true;
			}
			else {
				return false;
			}
		};
		MicrosoftAjaxFactory.prototype.loadMsAjaxFull=function (callback) {
			var msAjaxCDNPath=(window.location.protocol.toLowerCase()==='https:' ? 'https:' : 'http:')+'//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js';
			OSF.OUtil.loadScript(msAjaxCDNPath, callback);
		};
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxError", {
			get: function () {
				if (this._msAjaxError==null && this.isMsAjaxLoaded()) {
					this._msAjaxError=Error;
				}
				return this._msAjaxError;
			},
			set: function (errorClass) {
				this._msAjaxError=errorClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxString", {
			get: function () {
				if (this._msAjaxString==null && this.isMsAjaxLoaded()) {
					this._msAjaxString=String;
				}
				return this._msAjaxString;
			},
			set: function (stringClass) {
				this._msAjaxString=stringClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxDebug", {
			get: function () {
				if (this._msAjaxDebug==null && this.isMsAjaxLoaded()) {
					this._msAjaxDebug=Sys.Debug;
				}
				return this._msAjaxDebug;
			},
			set: function (debugClass) {
				this._msAjaxDebug=debugClass;
			},
			enumerable: true,
			configurable: true
		});
		return MicrosoftAjaxFactory;
	})();
	OfficeExt.MicrosoftAjaxFactory=MicrosoftAjaxFactory;
})(OfficeExt || (OfficeExt={}));
var OsfMsAjaxFactory=new OfficeExt.MicrosoftAjaxFactory();
var OSF=OSF || {};
var OfficeExt;
(function (OfficeExt) {
	var SafeStorage=(function () {
		function SafeStorage(_internalStorage) {
			this._internalStorage=_internalStorage;
		}
		SafeStorage.prototype.getItem=function (key) {
			try {
				return this._internalStorage && this._internalStorage.getItem(key);
			}
			catch (e) {
				return null;
			}
		};
		SafeStorage.prototype.setItem=function (key, data) {
			try {
				this._internalStorage && this._internalStorage.setItem(key, data);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.clear=function () {
			try {
				this._internalStorage && this._internalStorage.clear();
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.removeItem=function (key) {
			try {
				this._internalStorage && this._internalStorage.removeItem(key);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.getKeysWithPrefix=function (keyPrefix) {
			var keyList=[];
			try {
				var len=this._internalStorage && this._internalStorage.length || 0;
				for (var i=0; i < len; i++) {
					var key=this._internalStorage.key(i);
					if (key.indexOf(keyPrefix)===0) {
						keyList.push(key);
					}
				}
			}
			catch (e) {
			}
			return keyList;
		};
		return SafeStorage;
	})();
	OfficeExt.SafeStorage=SafeStorage;
})(OfficeExt || (OfficeExt={}));
OSF.XdmFieldName={
	ConversationUrl: "ConversationUrl",
	AppId: "AppId"
};
OSF.WindowNameItemKeys={
	BaseFrameName: "baseFrameName",
	HostInfo: "hostInfo",
	XdmInfo: "xdmInfo",
	SerializerVersion: "serializerVersion",
	AppContext: "appContext"
};
OSF.OUtil=(function () {
	var _uniqueId=-1;
	var _xdmInfoKey='&_xdm_Info=';
	var _serializerVersionKey='&_serializer_version=';
	var _xdmSessionKeyPrefix='_xdm_';
	var _serializerVersionKeyPrefix='_serializer_version=';
	var _fragmentSeparator='#';
	var _fragmentInfoDelimiter='&';
	var _classN="class";
	var _loadedScripts={};
	var _defaultScriptLoadingTimeout=30000;
	var _safeSessionStorage=null;
	var _safeLocalStorage=null;
	var _rndentropy=new Date().getTime();
	function _random() {
		var nextrand=0x7fffffff * (Math.random());
		nextrand ^=_rndentropy ^ ((new Date().getMilliseconds()) << Math.floor(Math.random() * (31 - 10)));
		return nextrand.toString(16);
	}
	;
	function _getSessionStorage() {
		if (!_safeSessionStorage) {
			try {
				var sessionStorage=window.sessionStorage;
			}
			catch (ex) {
				sessionStorage=null;
			}
			_safeSessionStorage=new OfficeExt.SafeStorage(sessionStorage);
		}
		return _safeSessionStorage;
	}
	;
	function _reOrderTabbableElements(elements) {
		var bucket0=[];
		var bucketPositive=[];
		var i;
		var len=elements.length;
		var ele;
		for (i=0; i < len; i++) {
			ele=elements[i];
			if (ele.tabIndex) {
				if (ele.tabIndex > 0) {
					bucketPositive.push(ele);
				}
				else if (ele.tabIndex===0) {
					bucket0.push(ele);
				}
			}
			else {
				bucket0.push(ele);
			}
		}
		bucketPositive=bucketPositive.sort(function (left, right) {
			var diff=left.tabIndex - right.tabIndex;
			if (diff===0) {
				diff=bucketPositive.indexOf(left) - bucketPositive.indexOf(right);
			}
			return diff;
		});
		return [].concat(bucketPositive, bucket0);
	}
	;
	return {
		set_entropy: function OSF_OUtil$set_entropy(entropy) {
			if (typeof entropy=="string") {
				for (var i=0; i < entropy.length; i+=4) {
					var temp=0;
					for (var j=0; j < 4 && i+j < entropy.length; j++) {
						temp=(temp << 8)+entropy.charCodeAt(i+j);
					}
					_rndentropy ^=temp;
				}
			}
			else if (typeof entropy=="number") {
				_rndentropy ^=entropy;
			}
			else {
				_rndentropy ^=0x7fffffff * Math.random();
			}
			_rndentropy &=0x7fffffff;
		},
		extend: function OSF_OUtil$extend(child, parent) {
			var F=function () { };
			F.prototype=parent.prototype;
			child.prototype=new F();
			child.prototype.constructor=child;
			child.uber=parent.prototype;
			if (parent.prototype.constructor===Object.prototype.constructor) {
				parent.prototype.constructor=parent;
			}
		},
		setNamespace: function OSF_OUtil$setNamespace(name, parent) {
			if (parent && name && !parent[name]) {
				parent[name]={};
			}
		},
		unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent) {
			if (parent && name && parent[name]) {
				delete parent[name];
			}
		},
		serializeSettings: function OSF_OUtil$serializeSettings(settingsCollection) {
			var ret={};
			for (var key in settingsCollection) {
				var value=settingsCollection[key];
				try {
					if (JSON) {
						value=JSON.stringify(value, function dateReplacer(k, v) {
							return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix+this[k].getTime()+OSF.DDA.SettingsManager.DataJSONSuffix : v;
						});
					}
					else {
						value=Sys.Serialization.JavaScriptSerializer.serialize(value);
					}
					ret[key]=value;
				}
				catch (ex) {
				}
			}
			return ret;
		},
		deserializeSettings: function OSF_OUtil$deserializeSettings(serializedSettings) {
			var ret={};
			serializedSettings=serializedSettings || {};
			for (var key in serializedSettings) {
				var value=serializedSettings[key];
				try {
					if (JSON) {
						value=JSON.parse(value, function dateReviver(k, v) {
							var d;
							if (typeof v==='string' && v && v.length > 6 && v.slice(0, 5)===OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1)===OSF.DDA.SettingsManager.DataJSONSuffix) {
								d=new Date(parseInt(v.slice(5, -1)));
								if (d) {
									return d;
								}
							}
							return v;
						});
					}
					else {
						value=Sys.Serialization.JavaScriptSerializer.deserialize(value, true);
					}
					ret[key]=value;
				}
				catch (ex) {
				}
			}
			return ret;
		},
		loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs) {
			if (url && callback) {
				var doc=window.document;
				var _loadedScriptEntry=_loadedScripts[url];
				if (!_loadedScriptEntry) {
					var script=doc.createElement("script");
					script.type="text/javascript";
					_loadedScriptEntry={ loaded: false, pendingCallbacks: [callback], timer: null };
					_loadedScripts[url]=_loadedScriptEntry;
					var onLoadCallback=function OSF_OUtil_loadScript$onLoadCallback() {
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						_loadedScriptEntry.loaded=true;
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					var onLoadError=function OSF_OUtil_loadScript$onLoadError() {
						delete _loadedScripts[url];
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					if (script.readyState) {
						script.onreadystatechange=function () {
							if (script.readyState=="loaded" || script.readyState=="complete") {
								script.onreadystatechange=null;
								onLoadCallback();
							}
						};
					}
					else {
						script.onload=onLoadCallback;
					}
					script.onerror=onLoadError;
					timeoutInMs=timeoutInMs || _defaultScriptLoadingTimeout;
					_loadedScriptEntry.timer=setTimeout(onLoadError, timeoutInMs);
					script.setAttribute("crossOrigin", "anonymous");
					script.src=url;
					doc.getElementsByTagName("head")[0].appendChild(script);
				}
				else if (_loadedScriptEntry.loaded) {
					callback();
				}
				else {
					_loadedScriptEntry.pendingCallbacks.push(callback);
				}
			}
		},
		loadCSS: function OSF_OUtil$loadCSS(url) {
			if (url) {
				var doc=window.document;
				var link=doc.createElement("link");
				link.type="text/css";
				link.rel="stylesheet";
				link.href=url;
				doc.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		parseEnum: function OSF_OUtil$parseEnum(str, enumObject) {
			var parsed=enumObject[str.trim()];
			if (typeof (parsed)=='undefined') {
				OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:"+str);
				throw OsfMsAjaxFactory.msAjaxError.argument("str");
			}
			return parsed;
		},
		delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache() {
			var obj={ calc: arguments[0] };
			return function () {
				if (obj.calc) {
					obj.val=obj.calc.apply(this, arguments);
					delete obj.calc;
				}
				return obj.val;
			};
		},
		getUniqueId: function OSF_OUtil$getUniqueId() {
			_uniqueId=_uniqueId+1;
			return _uniqueId.toString();
		},
		formatString: function OSF_OUtil$formatString() {
			var args=arguments;
			var source=args[0];
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10)+1;
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		},
		generateConversationId: function OSF_OUtil$generateConversationId() {
			return [_random(), _random(), (new Date()).getTime().toString()].join('_');
		},
		getFrameName: function OSF_OUtil$getFrameName(cacheKey) {
			return _xdmSessionKeyPrefix+cacheKey+this.generateConversationId();
		},
		addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue) {
			return OSF.OUtil.addInfoAsHash(url, _xdmInfoKey, xdmInfoValue, false);
		},
		addSerializerVersionAsHash: function OSF_OUtil$addSerializerVersionAsHash(url, serializerVersion) {
			return OSF.OUtil.addInfoAsHash(url, _serializerVersionKey, serializerVersion, true);
		},
		addInfoAsHash: function OSF_OUtil$addInfoAsHash(url, keyName, infoValue, encodeInfo) {
			url=url.trim() || '';
			var urlParts=url.split(_fragmentSeparator);
			var urlWithoutFragment=urlParts.shift();
			var fragment=urlParts.join(_fragmentSeparator);
			var newFragment;
			if (encodeInfo) {
				newFragment=[keyName, encodeURIComponent(infoValue), fragment].join('');
			}
			else {
				newFragment=[fragment, keyName, infoValue].join('');
			}
			return [urlWithoutFragment, _fragmentSeparator, newFragment].join('');
		},
		parseHostInfoFromWindowName: function OSF_OUtil$parseHostInfoFromWindowName(skipSessionStorage, windowName) {
			return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.HostInfo);
		},
		parseXdmInfo: function OSF_OUtil$parseXdmInfo(skipSessionStorage) {
			var xdmInfoValue=OSF.OUtil.parseXdmInfoWithGivenFragment(skipSessionStorage, window.location.hash);
			if (!xdmInfoValue) {
				xdmInfoValue=OSF.OUtil.parseXdmInfoFromWindowName(skipSessionStorage, window.name);
			}
			return xdmInfoValue;
		},
		parseXdmInfoFromWindowName: function OSF_OUtil$parseXdmInfoFromWindowName(skipSessionStorage, windowName) {
			return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.XdmInfo);
		},
		parseXdmInfoWithGivenFragment: function OSF_OUtil$parseXdmInfoWithGivenFragment(skipSessionStorage, fragment) {
			return OSF.OUtil.parseInfoWithGivenFragment(_xdmInfoKey, _xdmSessionKeyPrefix, false, skipSessionStorage, fragment);
		},
		parseSerializerVersion: function OSF_OUtil$parseSerializerVersion(skipSessionStorage) {
			var serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(skipSessionStorage, window.location.hash);
			if (isNaN(serializerVersion)) {
				serializerVersion=OSF.OUtil.parseSerializerVersionFromWindowName(skipSessionStorage, window.name);
			}
			return serializerVersion;
		},
		parseSerializerVersionFromWindowName: function OSF_OUtil$parseSerializerVersionFromWindowName(skipSessionStorage, windowName) {
			return parseInt(OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.SerializerVersion));
		},
		parseSerializerVersionWithGivenFragment: function OSF_OUtil$parseSerializerVersionWithGivenFragment(skipSessionStorage, fragment) {
			return parseInt(OSF.OUtil.parseInfoWithGivenFragment(_serializerVersionKey, _serializerVersionKeyPrefix, true, skipSessionStorage, fragment));
		},
		parseInfoFromWindowName: function OSF_OUtil$parseInfoFromWindowName(skipSessionStorage, windowName, infoKey) {
			try {
				var windowNameObj=JSON.parse(windowName);
				var infoValue=windowNameObj !=null ? windowNameObj[infoKey] : null;
				var osfSessionStorage=_getSessionStorage();
				if (!skipSessionStorage && osfSessionStorage && windowNameObj !=null) {
					var sessionKey=windowNameObj[OSF.WindowNameItemKeys.BaseFrameName]+infoKey;
					if (infoValue) {
						osfSessionStorage.setItem(sessionKey, infoValue);
					}
					else {
						infoValue=osfSessionStorage.getItem(sessionKey);
					}
				}
				return infoValue;
			}
			catch (Exception) {
				return null;
			}
		},
		parseInfoWithGivenFragment: function OSF_OUtil$parseInfoWithGivenFragment(infoKey, infoKeyPrefix, decodeInfo, skipSessionStorage, fragment) {
			var fragmentParts=fragment.split(infoKey);
			var infoValue=fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
			if (decodeInfo && infoValue !=null) {
				if (infoValue.indexOf(_fragmentInfoDelimiter) >=0) {
					infoValue=infoValue.split(_fragmentInfoDelimiter)[0];
				}
				infoValue=decodeURIComponent(infoValue);
			}
			var osfSessionStorage=_getSessionStorage();
			if (!skipSessionStorage && osfSessionStorage) {
				var sessionKeyStart=window.name.indexOf(infoKeyPrefix);
				if (sessionKeyStart > -1) {
					var sessionKeyEnd=window.name.indexOf(";", sessionKeyStart);
					if (sessionKeyEnd==-1) {
						sessionKeyEnd=window.name.length;
					}
					var sessionKey=window.name.substring(sessionKeyStart, sessionKeyEnd);
					if (infoValue) {
						osfSessionStorage.setItem(sessionKey, infoValue);
					}
					else {
						infoValue=osfSessionStorage.getItem(sessionKey);
					}
				}
			}
			return infoValue;
		},
		getConversationId: function OSF_OUtil$getConversationId() {
			var searchString=window.location.search;
			var conversationId=null;
			if (searchString) {
				var index=searchString.indexOf("&");
				conversationId=index > 0 ? searchString.substring(1, index) : searchString.substr(1);
				if (conversationId && conversationId.charAt(conversationId.length - 1)==='=') {
					conversationId=conversationId.substring(0, conversationId.length - 1);
					if (conversationId) {
						conversationId=decodeURIComponent(conversationId);
					}
				}
			}
			return conversationId;
		},
		getInfoItems: function OSF_OUtil$getInfoItems(strInfo) {
			var items=strInfo.split("$");
			if (typeof items[1]=="undefined") {
				items=strInfo.split("|");
			}
			if (typeof items[1]=="undefined") {
				items=strInfo.split("%7C");
			}
			return items;
		},
		getXdmFieldValue: function OSF_OUtil$getXdmFieldValue(xdmFieldName, skipSessionStorage) {
			var fieldValue='';
			var xdmInfoValue=OSF.OUtil.parseXdmInfo(skipSessionStorage);
			if (xdmInfoValue) {
				var items=OSF.OUtil.getInfoItems(xdmInfoValue);
				if (items !=undefined && items.length >=3) {
					switch (xdmFieldName) {
						case OSF.XdmFieldName.ConversationUrl:
							fieldValue=items[2];
							break;
						case OSF.XdmFieldName.AppId:
							fieldValue=items[1];
							break;
					}
				}
			}
			return fieldValue;
		},
		validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback) {
			var e=Function._validateParams(arguments, [{ name: "params", type: Object, mayBeNull: false },
				{ name: "expectedProperties", type: Object, mayBeNull: false },
				{ name: "callback", type: Function, mayBeNull: true }
			]);
			if (e)
				throw e;
			for (var p in expectedProperties) {
				e=Function._validateParameter(params[p], expectedProperties[p], p);
				if (e)
					throw e;
			}
		},
		writeProfilerMark: function OSF_OUtil$writeProfilerMark(text) {
			if (window.msWriteProfilerMark) {
				window.msWriteProfilerMark(text);
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		outputDebug: function OSF_OUtil$outputDebug(text) {
			if (typeof (OsfMsAjaxFactory) !=='undefined' && OsfMsAjaxFactory.msAjaxDebug && OsfMsAjaxFactory.msAjaxDebug.trace) {
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes) {
			descriptor=descriptor || {};
			for (var nd in attributes) {
				var attribute=attributes[nd];
				if (descriptor[attribute]==undefined) {
					descriptor[attribute]=true;
				}
			}
			Object.defineProperty(obj, prop, descriptor);
			return obj;
		},
		defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes) {
			descriptors=descriptors || {};
			for (var prop in descriptors) {
				OSF.OUtil.defineNondefaultProperty(obj, prop, descriptors[prop], attributes);
			}
			return obj;
		},
		defineEnumerableProperty: function OSF_OUtil$defineEnumerableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["enumerable"]);
		},
		defineEnumerableProperties: function OSF_OUtil$defineEnumerableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["enumerable"]);
		},
		defineMutableProperty: function OSF_OUtil$defineMutableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["writable", "enumerable", "configurable"]);
		},
		defineMutableProperties: function OSF_OUtil$defineMutableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["writable", "enumerable", "configurable"]);
		},
		finalizeProperties: function OSF_OUtil$finalizeProperties(obj, descriptor) {
			descriptor=descriptor || {};
			var props=Object.getOwnPropertyNames(obj);
			var propsLength=props.length;
			for (var i=0; i < propsLength; i++) {
				var prop=props[i];
				var desc=Object.getOwnPropertyDescriptor(obj, prop);
				if (!desc.get && !desc.set) {
					desc.writable=descriptor.writable || false;
				}
				desc.configurable=descriptor.configurable || false;
				desc.enumerable=descriptor.enumerable || true;
				Object.defineProperty(obj, prop, desc);
			}
			return obj;
		},
		mapList: function OSF_OUtil$MapList(list, mapFunction) {
			var ret=[];
			if (list) {
				for (var item in list) {
					ret.push(mapFunction(list[item]));
				}
			}
			return ret;
		},
		listContainsKey: function OSF_OUtil$listContainsKey(list, key) {
			for (var item in list) {
				if (key==item) {
					return true;
				}
			}
			return false;
		},
		listContainsValue: function OSF_OUtil$listContainsElement(list, value) {
			for (var item in list) {
				if (value==list[item]) {
					return true;
				}
			}
			return false;
		},
		augmentList: function OSF_OUtil$augmentList(list, addenda) {
			var add=list.push ? function (key, value) { list.push(value); } : function (key, value) { list[key]=value; };
			for (var key in addenda) {
				add(key, addenda[key]);
			}
		},
		redefineList: function OSF_Outil$redefineList(oldList, newList) {
			for (var key1 in oldList) {
				delete oldList[key1];
			}
			for (var key2 in newList) {
				oldList[key2]=newList[key2];
			}
		},
		isArray: function OSF_OUtil$isArray(obj) {
			return Object.prototype.toString.apply(obj)==="[object Array]";
		},
		isFunction: function OSF_OUtil$isFunction(obj) {
			return Object.prototype.toString.apply(obj)==="[object Function]";
		},
		isDate: function OSF_OUtil$isDate(obj) {
			return Object.prototype.toString.apply(obj)==="[object Date]";
		},
		addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener) {
			if (element.addEventListener) {
				element.addEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.attachEvent) {
				element.attachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=listener;
			}
		},
		removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener) {
			if (element.removeEventListener) {
				element.removeEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.detachEvent) {
				element.detachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=null;
			}
		},
		getCookieValue: function OSF_OUtil$getCookieValue(cookieName) {
			var tmpCookieString=RegExp(cookieName+"[^;]+").exec(document.cookie);
			return tmpCookieString.toString().replace(/^[^=]+./, "");
		},
		xhrGet: function OSF_OUtil$xhrGet(url, onSuccess, onError) {
			var xmlhttp;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp.responseText);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		xhrGetFull: function OSF_OUtil$xhrGetFull(url, oneDriveFileName, onSuccess, onError) {
			var xmlhttp;
			var requestedFileName=oneDriveFileName;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp, requestedFileName);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		encodeBase64: function OSF_Outil$encodeBase64(input) {
			if (!input)
				return input;
			var codex="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/=";
			var output=[];
			var temp=[];
			var index=0;
			var c1, c2, c3, a, b, c;
			var i;
			var length=input.length;
			do {
				c1=input.charCodeAt(index++);
				c2=input.charCodeAt(index++);
				c3=input.charCodeAt(index++);
				i=0;
				a=c1 & 255;
				b=c1 >> 8;
				c=c2 & 255;
				temp[i++]=a >> 2;
				temp[i++]=((a & 3) << 4) | (b >> 4);
				temp[i++]=((b & 15) << 2) | (c >> 6);
				temp[i++]=c & 63;
				if (!isNaN(c2)) {
					a=c2 >> 8;
					b=c3 & 255;
					c=c3 >> 8;
					temp[i++]=a >> 2;
					temp[i++]=((a & 3) << 4) | (b >> 4);
					temp[i++]=((b & 15) << 2) | (c >> 6);
					temp[i++]=c & 63;
				}
				if (isNaN(c2)) {
					temp[i - 1]=64;
				}
				else if (isNaN(c3)) {
					temp[i - 2]=64;
					temp[i - 1]=64;
				}
				for (var t=0; t < i; t++) {
					output.push(codex.charAt(temp[t]));
				}
			} while (index < length);
			return output.join("");
		},
		getSessionStorage: function OSF_Outil$getSessionStorage() {
			return _getSessionStorage();
		},
		getLocalStorage: function OSF_Outil$getLocalStorage() {
			if (!_safeLocalStorage) {
				try {
					var localStorage=window.localStorage;
				}
				catch (ex) {
					localStorage=null;
				}
				_safeLocalStorage=new OfficeExt.SafeStorage(localStorage);
			}
			return _safeLocalStorage;
		},
		convertIntToCssHexColor: function OSF_Outil$convertIntToCssHexColor(val) {
			var hex="#"+(Number(val)+0x1000000).toString(16).slice(-6);
			return hex;
		},
		attachClickHandler: function OSF_Outil$attachClickHandler(element, handler) {
			element.onclick=function (e) {
				handler();
			};
			element.ontouchend=function (e) {
				handler();
				e.preventDefault();
			};
		},
		getQueryStringParamValue: function OSF_Outil$getQueryStringParamValue(queryString, paramName) {
			var e=Function._validateParams(arguments, [{ name: "queryString", type: String, mayBeNull: false },
				{ name: "paramName", type: String, mayBeNull: false }
			]);
			if (e) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: Parameters cannot be null.");
				return "";
			}
			var queryExp=new RegExp("[\\?&]"+paramName+"=([^&#]*)", "i");
			if (!queryExp.test(queryString)) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: The parameter is not found.");
				return "";
			}
			return queryExp.exec(queryString)[1];
		},
		isiOS: function OSF_Outil$isiOS() {
			return (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
		},
		isChrome: function OSF_Outil$isChrome() {
			return (window.navigator.userAgent.indexOf("Chrome") > 0) && !OSF.OUtil.isEdge();
		},
		isEdge: function OSF_Outil$isEdge() {
			return window.navigator.userAgent.indexOf("Edge") > 0;
		},
		isIE: function OSF_Outil$isIE() {
			return window.navigator.userAgent.indexOf("Trident") > 0;
		},
		isFirefox: function OSF_Outil$isFirefox() {
			return window.navigator.userAgent.indexOf("Firefox") > 0;
		},
		shallowCopy: function OSF_Outil$shallowCopy(sourceObj) {
			if (sourceObj==null) {
				return null;
			}
			else if (!(sourceObj instanceof Object)) {
				return sourceObj;
			}
			else if (Array.isArray(sourceObj)) {
				var copyArr=[];
				for (var i=0; i < sourceObj.length; i++) {
					copyArr.push(sourceObj[i]);
				}
				return copyArr;
			}
			else {
				var copyObj=sourceObj.constructor();
				for (var property in sourceObj) {
					if (sourceObj.hasOwnProperty(property)) {
						copyObj[property]=sourceObj[property];
					}
				}
				return copyObj;
			}
		},
		createObject: function OSF_Outil$createObject(properties) {
			var obj=null;
			if (properties) {
				obj={};
				var len=properties.length;
				for (var i=0; i < len; i++) {
					obj[properties[i].name]=properties[i].value;
				}
			}
			return obj;
		},
		addClass: function OSF_OUtil$addClass(elmt, val) {
			if (!OSF.OUtil.hasClass(elmt, val)) {
				var className=elmt.getAttribute(_classN);
				if (className) {
					elmt.setAttribute(_classN, className+" "+val);
				}
				else {
					elmt.setAttribute(_classN, val);
				}
			}
		},
		removeClass: function OSF_OUtil$removeClass(elmt, val) {
			if (OSF.OUtil.hasClass(elmt, val)) {
				var className=elmt.getAttribute(_classN);
				var reg=new RegExp('(\\s|^)'+val+'(\\s|$)');
				className=className.replace(reg, '');
				elmt.setAttribute(_classN, className);
			}
		},
		hasClass: function OSF_OUtil$hasClass(elmt, clsName) {
			var className=elmt.getAttribute(_classN);
			return className && className.match(new RegExp('(\\s|^)'+clsName+'(\\s|$)'));
		},
		focusToFirstTabbable: function OSF_OUtil$focusToFirstTabbable(all, backward) {
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findNextPos=function (allLen, currPos, backward) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && backward) {
					return -1;
				}
				else if (currPos===allLen - 1 && !backward) {
					return -1;
				}
				if (backward) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			next=backward ? all.length - 1 : 0;
			if (all.length===0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				window.focus();
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, backward);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		},
		focusToNextTabbable: function OSF_OUtil$focusToNextTabbable(all, curr, shift) {
			var currPos;
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findCurrPos=function (all, curr) {
				var i=0;
				for (; i < all.length; i++) {
					if (all[i]===curr) {
						return i;
					}
				}
				return -1;
			};
			var findNextPos=function (allLen, currPos, shift) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && shift) {
					return -1;
				}
				else if (currPos===allLen - 1 && !shift) {
					return -1;
				}
				if (shift) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			currPos=findCurrPos(all, curr);
			next=findNextPos(all.length, currPos, shift);
			if (next < 0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, shift);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		}
	};
})();
OSF.OUtil.Guid=(function () {
	var hexCode=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	return {
		generateNewGuid: function OSF_Outil_Guid$generateNewGuid() {
			var result="";
			var tick=(new Date()).getTime();
			var index=0;
			for (; index < 32 && tick > 0; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[tick % 16];
				tick=Math.floor(tick / 16);
			}
			for (; index < 32; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[Math.floor(Math.random() * 16)];
			}
			return result;
		}
	};
})();
window.OSF=OSF;
OSF.OUtil.setNamespace("OSF", window);
OSF.MessageIDs={
	"FetchBundleUrl": 0,
	"LoadReactBundle": 1,
	"LoadBundleSuccess": 2,
	"LoadBundleError": 3
};
OSF.AppName={
	Unsupported: 0,
	Excel: 1,
	Word: 2,
	PowerPoint: 4,
	Outlook: 8,
	ExcelWebApp: 16,
	WordWebApp: 32,
	OutlookWebApp: 64,
	Project: 128,
	AccessWebApp: 256,
	PowerpointWebApp: 512,
	ExcelIOS: 1024,
	Sway: 2048,
	WordIOS: 4096,
	PowerPointIOS: 8192,
	Access: 16384,
	Lync: 32768,
	OutlookIOS: 65536,
	OneNoteWebApp: 131072,
	OneNote: 262144,
	ExcelWinRT: 524288,
	WordWinRT: 1048576,
	PowerpointWinRT: 2097152,
	OutlookAndroid: 4194304,
	OneNoteWinRT: 8388608,
	ExcelAndroid: 8388609,
	VisioWebApp: 8388610,
	OneNoteIOS: 8388611,
	WordAndroid: 8388613,
	PowerpointAndroid: 8388614
};
OSF.InternalPerfMarker={
	DataCoercionBegin: "Agave.HostCall.CoerceDataStart",
	DataCoercionEnd: "Agave.HostCall.CoerceDataEnd"
};
OSF.HostCallPerfMarker={
	IssueCall: "Agave.HostCall.IssueCall",
	ReceiveResponse: "Agave.HostCall.ReceiveResponse",
	RuntimeExceptionRaised: "Agave.HostCall.RuntimeExecptionRaised"
};
OSF.AgaveHostAction={
	"Select": 0,
	"UnSelect": 1,
	"CancelDialog": 2,
	"InsertAgave": 3,
	"CtrlF6In": 4,
	"CtrlF6Exit": 5,
	"CtrlF6ExitShift": 6,
	"SelectWithError": 7,
	"NotifyHostError": 8,
	"RefreshAddinCommands": 9,
	"PageIsReady": 10,
	"TabIn": 11,
	"TabInShift": 12,
	"TabExit": 13,
	"TabExitShift": 14,
	"EscExit": 15,
	"F2Exit": 16,
	"ExitNoFocusable": 17,
	"ExitNoFocusableShift": 18,
	"MouseEnter": 19,
	"MouseLeave": 20
};
OSF.SharedConstants={
	"NotificationConversationIdSuffix": '_ntf'
};
OSF.DialogMessageType={
	DialogMessageReceived: 0,
	DialogParentMessageReceived: 1,
	DialogClosed: 12006
};
OSF.OfficeAppContext=function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix, hostCustomMessage, hostFullVersion, clientWindowHeight, clientWindowWidth, addinName, appDomains, dialogRequirementMatrix) {
	this._id=id;
	this._appName=appName;
	this._appVersion=appVersion;
	this._appUILocale=appUILocale;
	this._dataLocale=dataLocale;
	this._docUrl=docUrl;
	this._clientMode=clientMode;
	this._settings=settings;
	this._reason=reason;
	this._osfControlType=osfControlType;
	this._eToken=eToken;
	this._correlationId=correlationId;
	this._appInstanceId=appInstanceId;
	this._touchEnabled=touchEnabled;
	this._commerceAllowed=commerceAllowed;
	this._appMinorVersion=appMinorVersion;
	this._requirementMatrix=requirementMatrix;
	this._hostCustomMessage=hostCustomMessage;
	this._hostFullVersion=hostFullVersion;
	this._isDialog=false;
	this._clientWindowHeight=clientWindowHeight;
	this._clientWindowWidth=clientWindowWidth;
	this._addinName=addinName;
	this._appDomains=appDomains;
	this._dialogRequirementMatrix=dialogRequirementMatrix;
	this.get_id=function get_id() { return this._id; };
	this.get_appName=function get_appName() { return this._appName; };
	this.get_appVersion=function get_appVersion() { return this._appVersion; };
	this.get_appUILocale=function get_appUILocale() { return this._appUILocale; };
	this.get_dataLocale=function get_dataLocale() { return this._dataLocale; };
	this.get_docUrl=function get_docUrl() { return this._docUrl; };
	this.get_clientMode=function get_clientMode() { return this._clientMode; };
	this.get_bindings=function get_bindings() { return this._bindings; };
	this.get_settings=function get_settings() { return this._settings; };
	this.get_reason=function get_reason() { return this._reason; };
	this.get_osfControlType=function get_osfControlType() { return this._osfControlType; };
	this.get_eToken=function get_eToken() { return this._eToken; };
	this.get_correlationId=function get_correlationId() { return this._correlationId; };
	this.get_appInstanceId=function get_appInstanceId() { return this._appInstanceId; };
	this.get_touchEnabled=function get_touchEnabled() { return this._touchEnabled; };
	this.get_commerceAllowed=function get_commerceAllowed() { return this._commerceAllowed; };
	this.get_appMinorVersion=function get_appMinorVersion() { return this._appMinorVersion; };
	this.get_requirementMatrix=function get_requirementMatrix() { return this._requirementMatrix; };
	this.get_dialogRequirementMatrix=function get_dialogRequirementMatrix() { return this._dialogRequirementMatrix; };
	this.get_hostCustomMessage=function get_hostCustomMessage() { return this._hostCustomMessage; };
	this.get_hostFullVersion=function get_hostFullVersion() { return this._hostFullVersion; };
	this.get_isDialog=function get_isDialog() { return this._isDialog; };
	this.get_clientWindowHeight=function get_clientWindowHeight() { return this._clientWindowHeight; };
	this.get_clientWindowWidth=function get_clientWindowWidth() { return this._clientWindowWidth; };
	this.get_addinName=function get_addinName() { return this._addinName; };
	this.get_appDomains=function get_appDomains() { return this._appDomains; };
};
OSF.OsfControlType={
	DocumentLevel: 0,
	ContainerLevel: 1
};
OSF.ClientMode={
	ReadOnly: 0,
	ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Client", Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension", Microsoft.Office);
Microsoft.Office.WebExtension.InitializationReason={
	Inserted: "inserted",
	DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ValueFormat={
	Unformatted: "unformatted",
	Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType={
	All: "all"
};
Microsoft.Office.WebExtension.PlatformType={
	PC: "PC",
	OfficeOnline: "OfficeOnline",
	Mac: "Mac",
	iOS: "iOS",
	Android: "Android",
	Universal: "Universal"
};
Microsoft.Office.WebExtension.HostType={
	Word: "Word",
	Excel: "Excel",
	PowerPoint: "PowerPoint",
	Outlook: "Outlook",
	OneNote: "OneNote",
	Project: "Project",
	Access: "Access"
};
Microsoft.Office.WebExtension.Parameters={
	BindingType: "bindingType",
	CoercionType: "coercionType",
	ValueFormat: "valueFormat",
	FilterType: "filterType",
	Columns: "columns",
	SampleData: "sampleData",
	GoToType: "goToType",
	SelectionMode: "selectionMode",
	Id: "id",
	PromptText: "promptText",
	ItemName: "itemName",
	FailOnCollision: "failOnCollision",
	StartRow: "startRow",
	StartColumn: "startColumn",
	RowCount: "rowCount",
	ColumnCount: "columnCount",
	Callback: "callback",
	AsyncContext: "asyncContext",
	Data: "data",
	Rows: "rows",
	OverwriteIfStale: "overwriteIfStale",
	FileType: "fileType",
	EventType: "eventType",
	Handler: "handler",
	SliceSize: "sliceSize",
	SliceIndex: "sliceIndex",
	ActiveView: "activeView",
	Status: "status",
	PlatformType: "platformType",
	HostType: "hostType",
	ForceConsent: "forceConsent",
	ForceAddAccount: "forceAddAccount",
	AuthChallenge: "authChallenge",
	Reserved: "reserved",
	Xml: "xml",
	Namespace: "namespace",
	Prefix: "prefix",
	XPath: "xPath",
	Text: "text",
	ImageLeft: "imageLeft",
	ImageTop: "imageTop",
	ImageWidth: "imageWidth",
	ImageHeight: "imageHeight",
	TaskId: "taskId",
	FieldId: "fieldId",
	FieldValue: "fieldValue",
	ServerUrl: "serverUrl",
	ListName: "listName",
	ResourceId: "resourceId",
	ViewType: "viewType",
	ViewName: "viewName",
	GetRawValue: "getRawValue",
	CellFormat: "cellFormat",
	TableOptions: "tableOptions",
	TaskIndex: "taskIndex",
	ResourceIndex: "resourceIndex",
	CustomFieldId: "customFieldId",
	Url: "url",
	MessageHandler: "messageHandler",
	Width: "width",
	Height: "height",
	RequireHTTPs: "requireHTTPS",
	MessageToParent: "messageToParent",
	DisplayInIframe: "displayInIframe",
	MessageContent: "messageContent",
	HideTitle: "hideTitle",
	UseDeviceIndependentPixels: "useDeviceIndependentPixels",
	AppCommandInvocationCompletedData: "appCommandInvocationCompletedData",
	Base64: "base64"
};
OSF.OUtil.setNamespace("DDA", OSF);
OSF.DDA.DocumentMode={
	ReadOnly: 1,
	ReadWrite: 0
};
OSF.DDA.PropertyDescriptors={
	AsyncResultStatus: "AsyncResultStatus"
};
OSF.DDA.EventDescriptors={};
OSF.DDA.ListDescriptors={};
OSF.DDA.UI={};
OSF.DDA.getXdmEventName=function OSF_DDA$GetXdmEventName(id, eventType) {
	if (eventType==Microsoft.Office.WebExtension.EventType.BindingSelectionChanged ||
		eventType==Microsoft.Office.WebExtension.EventType.BindingDataChanged ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeDeleted ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeInserted ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeReplaced) {
		return id+"_"+eventType;
	}
	else {
		return eventType;
	}
};
OSF.DDA.MethodDispId={
	dispidMethodMin: 64,
	dispidGetSelectedDataMethod: 64,
	dispidSetSelectedDataMethod: 65,
	dispidAddBindingFromSelectionMethod: 66,
	dispidAddBindingFromPromptMethod: 67,
	dispidGetBindingMethod: 68,
	dispidReleaseBindingMethod: 69,
	dispidGetBindingDataMethod: 70,
	dispidSetBindingDataMethod: 71,
	dispidAddRowsMethod: 72,
	dispidClearAllRowsMethod: 73,
	dispidGetAllBindingsMethod: 74,
	dispidLoadSettingsMethod: 75,
	dispidSaveSettingsMethod: 76,
	dispidGetDocumentCopyMethod: 77,
	dispidAddBindingFromNamedItemMethod: 78,
	dispidAddColumnsMethod: 79,
	dispidGetDocumentCopyChunkMethod: 80,
	dispidReleaseDocumentCopyMethod: 81,
	dispidNavigateToMethod: 82,
	dispidGetActiveViewMethod: 83,
	dispidGetDocumentThemeMethod: 84,
	dispidGetOfficeThemeMethod: 85,
	dispidGetFilePropertiesMethod: 86,
	dispidClearFormatsMethod: 87,
	dispidSetTableOptionsMethod: 88,
	dispidSetFormatsMethod: 89,
	dispidExecuteRichApiRequestMethod: 93,
	dispidAppCommandInvocationCompletedMethod: 94,
	dispidCloseContainerMethod: 97,
	dispidGetAccessTokenMethod: 98,
	dispidOpenBrowserWindow: 102,
	dispidCreateDocumentMethod: 105,
	dispidGetSelectedTaskMethod: 110,
	dispidGetSelectedResourceMethod: 111,
	dispidGetTaskMethod: 112,
	dispidGetResourceFieldMethod: 113,
	dispidGetWSSUrlMethod: 114,
	dispidGetTaskFieldMethod: 115,
	dispidGetProjectFieldMethod: 116,
	dispidGetSelectedViewMethod: 117,
	dispidGetTaskByIndexMethod: 118,
	dispidGetResourceByIndexMethod: 119,
	dispidSetTaskFieldMethod: 120,
	dispidSetResourceFieldMethod: 121,
	dispidGetMaxTaskIndexMethod: 122,
	dispidGetMaxResourceIndexMethod: 123,
	dispidCreateTaskMethod: 124,
	dispidAddDataPartMethod: 128,
	dispidGetDataPartByIdMethod: 129,
	dispidGetDataPartsByNamespaceMethod: 130,
	dispidGetDataPartXmlMethod: 131,
	dispidGetDataPartNodesMethod: 132,
	dispidDeleteDataPartMethod: 133,
	dispidGetDataNodeValueMethod: 134,
	dispidGetDataNodeXmlMethod: 135,
	dispidGetDataNodesMethod: 136,
	dispidSetDataNodeValueMethod: 137,
	dispidSetDataNodeXmlMethod: 138,
	dispidAddDataNamespaceMethod: 139,
	dispidGetDataUriByPrefixMethod: 140,
	dispidGetDataPrefixByUriMethod: 141,
	dispidGetDataNodeTextMethod: 142,
	dispidSetDataNodeTextMethod: 143,
	dispidMessageParentMethod: 144,
	dispidSendMessageMethod: 145,
	dispidMethodMax: 145
};
OSF.DDA.EventDispId={
	dispidEventMin: 0,
	dispidInitializeEvent: 0,
	dispidSettingsChangedEvent: 1,
	dispidDocumentSelectionChangedEvent: 2,
	dispidBindingSelectionChangedEvent: 3,
	dispidBindingDataChangedEvent: 4,
	dispidDocumentOpenEvent: 5,
	dispidDocumentCloseEvent: 6,
	dispidActiveViewChangedEvent: 7,
	dispidDocumentThemeChangedEvent: 8,
	dispidOfficeThemeChangedEvent: 9,
	dispidDialogMessageReceivedEvent: 10,
	dispidDialogNotificationShownInAddinEvent: 11,
	dispidDialogParentMessageReceivedEvent: 12,
	dispidObjectDeletedEvent: 13,
	dispidObjectSelectionChangedEvent: 14,
	dispidObjectDataChangedEvent: 15,
	dispidContentControlAddedEvent: 16,
	dispidActivationStatusChangedEvent: 32,
	dispidRichApiMessageEvent: 33,
	dispidAppCommandInvokedEvent: 39,
	dispidOlkItemSelectedChangedEvent: 46,
	dispidOlkRecipientsChangedEvent: 47,
	dispidOlkAppointmentTimeChangedEvent: 48,
	dispidTaskSelectionChangedEvent: 56,
	dispidResourceSelectionChangedEvent: 57,
	dispidViewSelectionChangedEvent: 58,
	dispidDataNodeAddedEvent: 60,
	dispidDataNodeReplacedEvent: 61,
	dispidDataNodeDeletedEvent: 62,
	dispidEventMax: 63
};
OSF.DDA.ErrorCodeManager=(function () {
	var _errorMappings={};
	return {
		getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode) {
			var errorArgs=_errorMappings[errorCode];
			if (!errorArgs) {
				errorArgs=_errorMappings[this.errorCodes.ooeInternalError];
			}
			else {
				if (!errorArgs.name) {
					errorArgs.name=_errorMappings[this.errorCodes.ooeInternalError].name;
				}
				if (!errorArgs.message) {
					errorArgs.message=_errorMappings[this.errorCodes.ooeInternalError].message;
				}
			}
			return errorArgs;
		},
		addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage) {
			_errorMappings[errorCode]=errorNameMessage;
		},
		errorCodes: {
			ooeSuccess: 0,
			ooeChunkResult: 1,
			ooeCoercionTypeNotSupported: 1000,
			ooeGetSelectionNotMatchDataType: 1001,
			ooeCoercionTypeNotMatchBinding: 1002,
			ooeInvalidGetRowColumnCounts: 1003,
			ooeSelectionNotSupportCoercionType: 1004,
			ooeInvalidGetStartRowColumn: 1005,
			ooeNonUniformPartialGetNotSupported: 1006,
			ooeGetDataIsTooLarge: 1008,
			ooeFileTypeNotSupported: 1009,
			ooeGetDataParametersConflict: 1010,
			ooeInvalidGetColumns: 1011,
			ooeInvalidGetRows: 1012,
			ooeInvalidReadForBlankRow: 1013,
			ooeUnsupportedDataObject: 2000,
			ooeCannotWriteToSelection: 2001,
			ooeDataNotMatchSelection: 2002,
			ooeOverwriteWorksheetData: 2003,
			ooeDataNotMatchBindingSize: 2004,
			ooeInvalidSetStartRowColumn: 2005,
			ooeInvalidDataFormat: 2006,
			ooeDataNotMatchCoercionType: 2007,
			ooeDataNotMatchBindingType: 2008,
			ooeSetDataIsTooLarge: 2009,
			ooeNonUniformPartialSetNotSupported: 2010,
			ooeInvalidSetColumns: 2011,
			ooeInvalidSetRows: 2012,
			ooeSetDataParametersConflict: 2013,
			ooeCellDataAmountBeyondLimits: 2014,
			ooeSelectionCannotBound: 3000,
			ooeBindingNotExist: 3002,
			ooeBindingToMultipleSelection: 3003,
			ooeInvalidSelectionForBindingType: 3004,
			ooeOperationNotSupportedOnThisBindingType: 3005,
			ooeNamedItemNotFound: 3006,
			ooeMultipleNamedItemFound: 3007,
			ooeInvalidNamedItemForBindingType: 3008,
			ooeUnknownBindingType: 3009,
			ooeOperationNotSupportedOnMatrixData: 3010,
			ooeInvalidColumnsForBinding: 3011,
			ooeSettingNameNotExist: 4000,
			ooeSettingsCannotSave: 4001,
			ooeSettingsAreStale: 4002,
			ooeOperationNotSupported: 5000,
			ooeInternalError: 5001,
			ooeDocumentReadOnly: 5002,
			ooeEventHandlerNotExist: 5003,
			ooeInvalidApiCallInContext: 5004,
			ooeShuttingDown: 5005,
			ooeUnsupportedEnumeration: 5007,
			ooeIndexOutOfRange: 5008,
			ooeBrowserAPINotSupported: 5009,
			ooeInvalidParam: 5010,
			ooeRequestTimeout: 5011,
			ooeInvalidOrTimedOutSession: 5012,
			ooeInvalidApiArguments: 5013,
			ooeTooManyIncompleteRequests: 5100,
			ooeRequestTokenUnavailable: 5101,
			ooeActivityLimitReached: 5102,
			ooeCustomXmlNodeNotFound: 6000,
			ooeCustomXmlError: 6100,
			ooeCustomXmlExceedQuota: 6101,
			ooeCustomXmlOutOfDate: 6102,
			ooeNoCapability: 7000,
			ooeCannotNavTo: 7001,
			ooeSpecifiedIdNotExist: 7002,
			ooeNavOutOfBound: 7004,
			ooeElementMissing: 8000,
			ooeProtectedError: 8001,
			ooeInvalidCellsValue: 8010,
			ooeInvalidTableOptionValue: 8011,
			ooeInvalidFormatValue: 8012,
			ooeRowIndexOutOfRange: 8020,
			ooeColIndexOutOfRange: 8021,
			ooeFormatValueOutOfRange: 8022,
			ooeCellFormatAmountBeyondLimits: 8023,
			ooeMemoryFileLimit: 11000,
			ooeNetworkProblemRetrieveFile: 11001,
			ooeInvalidSliceSize: 11002,
			ooeInvalidCallback: 11101,
			ooeInvalidWidth: 12000,
			ooeInvalidHeight: 12001,
			ooeNavigationError: 12002,
			ooeInvalidScheme: 12003,
			ooeAppDomains: 12004,
			ooeRequireHTTPS: 12005,
			ooeWebDialogClosed: 12006,
			ooeDialogAlreadyOpened: 12007,
			ooeEndUserAllow: 12008,
			ooeEndUserIgnore: 12009,
			ooeNotUILessDialog: 12010,
			ooeCrossZone: 12011,
			ooeNotSSOAgave: 13000,
			ooeSSOUserNotSignedIn: 13001,
			ooeSSOUserAborted: 13002,
			ooeSSOUnsupportedUserIdentity: 13003,
			ooeSSOInvalidResourceUrl: 13004,
			ooeSSOInvalidGrant: 13005,
			ooeSSOClientError: 13006,
			ooeSSOServerError: 13007,
			ooeAddinIsAlreadyRequestingToken: 13008,
			ooeSSOUserConsentNotSupportedByCurrentAddinCategory: 13009,
			ooeSSOConnectionLost: 13010
		},
		initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS) {
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType]={ name: stringNS.L_DataReadError, message: stringNS.L_GetSelectionNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotMatchBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRowColumnCounts };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType]={ name: stringNS.L_DataReadError, message: stringNS.L_SelectionNotSupportCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_NonUniformPartialGetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_FileTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataParametersConflict]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetColumns]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRows]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidReadForBlankRow]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidReadForBlankRow };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject]={ name: stringNS.L_DataWriteError, message: stringNS.L_UnsupportedDataObject };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_CannotWriteToSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData]={ name: stringNS.L_DataWriteError, message: stringNS.L_OverwriteWorksheetData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchBindingSize };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat]={ name: stringNS.L_InvalidFormat, message: stringNS.L_InvalidDataFormat };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported]={ name: stringNS.L_DataWriteError, message: stringNS.L_NonUniformPartialSetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetColumns]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetRows]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataParametersConflict]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_SelectionCannotBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist]={ name: stringNS.L_InvalidBindingError, message: stringNS.L_BindingNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection]={ name: stringNS.L_BindingCreationError, message: stringNS.L_BindingToMultipleSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidSelectionForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnThisBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_NamedItemNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_MultipleNamedItemFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidNamedItemForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType]={ name: stringNS.L_InvalidBinding, message: stringNS.L_UnknownBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnMatrixData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidColumnsForBinding]={ name: stringNS.L_InvalidBinding, message: stringNS.L_InvalidColumnsForBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist]={ name: stringNS.L_ReadSettingsError, message: stringNS.L_SettingNameNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave]={ name: stringNS.L_SaveSettingsError, message: stringNS.L_SettingsCannotSave };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale]={ name: stringNS.L_SettingsStaleError, message: stringNS.L_SettingsAreStale };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported]={ name: stringNS.L_HostError, message: stringNS.L_OperationNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError]={ name: stringNS.L_InternalError, message: stringNS.L_InternalErrorDescription };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly]={ name: stringNS.L_PermissionDenied, message: stringNS.L_DocumentReadOnly };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist]={ name: stringNS.L_EventRegistrationError, message: stringNS.L_EventHandlerNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext]={ name: stringNS.L_InvalidAPICall, message: stringNS.L_InvalidApiCallInContext };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown]={ name: stringNS.L_ShuttingDown, message: stringNS.L_ShuttingDown };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration]={ name: stringNS.L_UnsupportedEnumeration, message: stringNS.L_UnsupportedEnumerationMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBrowserAPINotSupported]={ name: stringNS.L_APINotSupported, message: stringNS.L_BrowserAPINotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTimeout]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTimeout };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidOrTimedOutSession]={ name: stringNS.L_InvalidOrTimedOutSession, message: stringNS.L_InvalidOrTimedOutSessionMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeTooManyIncompleteRequests]={ name: stringNS.L_APICallFailed, message: stringNS.L_TooManyIncompleteRequests };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTokenUnavailable]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTokenUnavailable };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeActivityLimitReached]={ name: stringNS.L_APICallFailed, message: stringNS.L_ActivityLimitReached };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiArguments]={ name: stringNS.L_APICallFailed, message: stringNS.L_InvalidApiArgumentsMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound]={ name: stringNS.L_InvalidNode, message: stringNS.L_CustomXmlNodeNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlExceedQuota]={ name: stringNS.L_CustomXmlExceedQuotaName, message: stringNS.L_CustomXmlExceedQuotaMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlOutOfDate]={ name: stringNS.L_CustomXmlOutOfDateName, message: stringNS.L_CustomXmlOutOfDateMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo]={ name: stringNS.L_CannotNavigateTo, message: stringNS.L_CannotNavigateTo };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist]={ name: stringNS.L_SpecifiedIdNotExist, message: stringNS.L_SpecifiedIdNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound]={ name: stringNS.L_NavOutOfBound, message: stringNS.L_NavOutOfBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellDataAmountBeyondLimits]={ name: stringNS.L_DataWriteReminder, message: stringNS.L_CellDataAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing]={ name: stringNS.L_MissingParameter, message: stringNS.L_ElementMissing };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidCellsValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidTableOptionValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidFormatValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_RowIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_ColIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_FormatValueOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellFormatAmountBeyondLimits]={ name: stringNS.L_FormattingReminder, message: stringNS.L_CellFormatAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMemoryFileLimit]={ name: stringNS.L_MemoryLimit, message: stringNS.L_CloseFileBeforeRetrieve };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNetworkProblemRetrieveFile]={ name: stringNS.L_NetworkProblem, message: stringNS.L_NetworkProblemRetrieveFile };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize]={ name: stringNS.L_InvalidValue, message: stringNS.L_SliceSizeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAlreadyOpened };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidWidth]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidHeight]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavigationError]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_NetworkProblem };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme]={ name: stringNS.L_DialogNavigateError, message: stringNS.L_DialogInvalidScheme };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAppDomains]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogRequireHTTPS };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_UserClickIgnore };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCrossZone]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_NewWindowCrossZoneErrorString };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNotSSOAgave]={ name: stringNS.L_APINotSupported, message: stringNS.L_InvalidSSOAddinMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUserNotSignedIn]={ name: stringNS.L_UserNotSignedIn, message: stringNS.L_UserNotSignedIn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUserAborted]={ name: stringNS.L_UserAborted, message: stringNS.L_UserAbortedMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUnsupportedUserIdentity]={ name: stringNS.L_UnsupportedUserIdentity, message: stringNS.L_UnsupportedUserIdentityMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOInvalidResourceUrl]={ name: stringNS.L_InvalidResourceUrl, message: stringNS.L_InvalidResourceUrlMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOInvalidGrant]={ name: stringNS.L_InvalidGrant, message: stringNS.L_InvalidGrantMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOClientError]={ name: stringNS.L_SSOClientError, message: stringNS.L_SSOClientErrorMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOServerError]={ name: stringNS.L_SSOServerError, message: stringNS.L_SSOServerErrorMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAddinIsAlreadyRequestingToken]={ name: stringNS.L_AddinIsAlreadyRequestingToken, message: stringNS.L_AddinIsAlreadyRequestingTokenMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUserConsentNotSupportedByCurrentAddinCategory]={ name: stringNS.L_SSOUserConsentNotSupportedByCurrentAddinCategory, message: stringNS.L_SSOUserConsentNotSupportedByCurrentAddinCategoryMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOConnectionLost]={ name: stringNS.L_SSOConnectionLostError, message: stringNS.L_SSOConnectionLostErrorMessage };
		}
	};
})();
var OfficeExt;
(function (OfficeExt) {
	var Requirement;
	(function (Requirement) {
		var RequirementVersion=(function () {
			function RequirementVersion() {
			}
			return RequirementVersion;
		})();
		Requirement.RequirementVersion=RequirementVersion;
		var RequirementMatrix=(function () {
			function RequirementMatrix(_setMap) {
				this.isSetSupported=function _isSetSupported(name, minVersion) {
					if (name==undefined) {
						return false;
					}
					if (minVersion==undefined) {
						minVersion=0;
					}
					var setSupportArray=this._setMap;
					var sets=setSupportArray._sets;
					if (sets.hasOwnProperty(name.toLowerCase())) {
						var setMaxVersion=sets[name.toLowerCase()];
						try {
							var setMaxVersionNum=this._getVersion(setMaxVersion);
							minVersion=minVersion+"";
							var minVersionNum=this._getVersion(minVersion);
							if (setMaxVersionNum.major > 0 && setMaxVersionNum.major > minVersionNum.major) {
								return true;
							}
							if (setMaxVersionNum.minor > 0 &&
								setMaxVersionNum.minor > 0 &&
								setMaxVersionNum.major==minVersionNum.major &&
								setMaxVersionNum.minor >=minVersionNum.minor) {
								return true;
							}
						}
						catch (e) {
							return false;
						}
					}
					return false;
				};
				this._getVersion=function (version) {
					var temp=version.split(".");
					var major=0;
					var minor=0;
					if (temp.length < 2 && isNaN(Number(version))) {
						throw "version format incorrect";
					}
					else {
						major=Number(temp[0]);
						if (temp.length >=2) {
							minor=Number(temp[1]);
						}
						if (isNaN(major) || isNaN(minor)) {
							throw "version format incorrect";
						}
					}
					var result={ "minor": minor, "major": major };
					return result;
				};
				this._setMap=_setMap;
				this.isSetSupported=this.isSetSupported.bind(this);
			}
			return RequirementMatrix;
		})();
		Requirement.RequirementMatrix=RequirementMatrix;
		var DefaultSetRequirement=(function () {
			function DefaultSetRequirement(setMap) {
				this._addSetMap=function DefaultSetRequirement_addSetMap(addedSet) {
					for (var name in addedSet) {
						this._sets[name]=addedSet[name];
					}
				};
				this._sets=setMap;
			}
			return DefaultSetRequirement;
		})();
		Requirement.DefaultSetRequirement=DefaultSetRequirement;
		var DefaultDialogSetRequirement=(function (_super) {
			__extends(DefaultDialogSetRequirement, _super);
			function DefaultDialogSetRequirement() {
				_super.call(this, {
					"dialogapi": 1.1
				});
			}
			return DefaultDialogSetRequirement;
		})(DefaultSetRequirement);
		Requirement.DefaultDialogSetRequirement=DefaultDialogSetRequirement;
		var ExcelClientDefaultSetRequirement=(function (_super) {
			__extends(ExcelClientDefaultSetRequirement, _super);
			function ExcelClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"excelapi": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelClientDefaultSetRequirement=ExcelClientDefaultSetRequirement;
		var ExcelClientV1DefaultSetRequirement=(function (_super) {
			__extends(ExcelClientV1DefaultSetRequirement, _super);
			function ExcelClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return ExcelClientV1DefaultSetRequirement;
		})(ExcelClientDefaultSetRequirement);
		Requirement.ExcelClientV1DefaultSetRequirement=ExcelClientV1DefaultSetRequirement;
		var OutlookClientDefaultSetRequirement=(function (_super) {
			__extends(OutlookClientDefaultSetRequirement, _super);
			function OutlookClientDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientDefaultSetRequirement=OutlookClientDefaultSetRequirement;
		var WordClientDefaultSetRequirement=(function (_super) {
			__extends(WordClientDefaultSetRequirement, _super);
			function WordClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1,
					"wordapi": 1.1
				});
			}
			return WordClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordClientDefaultSetRequirement=WordClientDefaultSetRequirement;
		var WordClientV1DefaultSetRequirement=(function (_super) {
			__extends(WordClientV1DefaultSetRequirement, _super);
			function WordClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2,
					"imagecoercion": 1.1
				});
			}
			return WordClientV1DefaultSetRequirement;
		})(WordClientDefaultSetRequirement);
		Requirement.WordClientV1DefaultSetRequirement=WordClientV1DefaultSetRequirement;
		var PowerpointClientDefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientDefaultSetRequirement, _super);
			function PowerpointClientDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointClientDefaultSetRequirement=PowerpointClientDefaultSetRequirement;
		var PowerpointClientV1DefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientV1DefaultSetRequirement, _super);
			function PowerpointClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return PowerpointClientV1DefaultSetRequirement;
		})(PowerpointClientDefaultSetRequirement);
		Requirement.PowerpointClientV1DefaultSetRequirement=PowerpointClientV1DefaultSetRequirement;
		var ProjectClientDefaultSetRequirement=(function (_super) {
			__extends(ProjectClientDefaultSetRequirement, _super);
			function ProjectClientDefaultSetRequirement() {
				_super.call(this, {
					"selection": 1.1,
					"textcoercion": 1.1
				});
			}
			return ProjectClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ProjectClientDefaultSetRequirement=ProjectClientDefaultSetRequirement;
		var ExcelWebDefaultSetRequirement=(function (_super) {
			__extends(ExcelWebDefaultSetRequirement, _super);
			function ExcelWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"file": 1.1
				});
			}
			return ExcelWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelWebDefaultSetRequirement=ExcelWebDefaultSetRequirement;
		var WordWebDefaultSetRequirement=(function (_super) {
			__extends(WordWebDefaultSetRequirement, _super);
			function WordWebDefaultSetRequirement() {
				_super.call(this, {
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"imagecoercion": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablecoercion": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordWebDefaultSetRequirement=WordWebDefaultSetRequirement;
		var PowerpointWebDefaultSetRequirement=(function (_super) {
			__extends(PowerpointWebDefaultSetRequirement, _super);
			function PowerpointWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"settings": 1.1
				});
			}
			return PowerpointWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointWebDefaultSetRequirement=PowerpointWebDefaultSetRequirement;
		var OutlookWebDefaultSetRequirement=(function (_super) {
			__extends(OutlookWebDefaultSetRequirement, _super);
			function OutlookWebDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookWebDefaultSetRequirement=OutlookWebDefaultSetRequirement;
		var SwayWebDefaultSetRequirement=(function (_super) {
			__extends(SwayWebDefaultSetRequirement, _super);
			function SwayWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"documentevents": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return SwayWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.SwayWebDefaultSetRequirement=SwayWebDefaultSetRequirement;
		var AccessWebDefaultSetRequirement=(function (_super) {
			__extends(AccessWebDefaultSetRequirement, _super);
			function AccessWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"partialtablebindings": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1
				});
			}
			return AccessWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.AccessWebDefaultSetRequirement=AccessWebDefaultSetRequirement;
		var ExcelIOSDefaultSetRequirement=(function (_super) {
			__extends(ExcelIOSDefaultSetRequirement, _super);
			function ExcelIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelIOSDefaultSetRequirement=ExcelIOSDefaultSetRequirement;
		var WordIOSDefaultSetRequirement=(function (_super) {
			__extends(WordIOSDefaultSetRequirement, _super);
			function WordIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordIOSDefaultSetRequirement=WordIOSDefaultSetRequirement;
		var WordIOSV1DefaultSetRequirement=(function (_super) {
			__extends(WordIOSV1DefaultSetRequirement, _super);
			function WordIOSV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2
				});
			}
			return WordIOSV1DefaultSetRequirement;
		})(WordIOSDefaultSetRequirement);
		Requirement.WordIOSV1DefaultSetRequirement=WordIOSV1DefaultSetRequirement;
		var PowerpointIOSDefaultSetRequirement=(function (_super) {
			__extends(PowerpointIOSDefaultSetRequirement, _super);
			function PowerpointIOSDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointIOSDefaultSetRequirement=PowerpointIOSDefaultSetRequirement;
		var OutlookIOSDefaultSetRequirement=(function (_super) {
			__extends(OutlookIOSDefaultSetRequirement, _super);
			function OutlookIOSDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookIOSDefaultSetRequirement=OutlookIOSDefaultSetRequirement;
		var RequirementsMatrixFactory=(function () {
			function RequirementsMatrixFactory() {
			}
			RequirementsMatrixFactory.initializeOsfDda=function () {
				OSF.OUtil.setNamespace("Requirement", OSF.DDA);
			};
			RequirementsMatrixFactory.getDefaultRequirementMatrix=function (appContext) {
				this.initializeDefaultSetMatrix();
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_requirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				}
				else {
					var appLocator=RequirementsMatrixFactory.getClientFullVersionString(appContext);
					if (RequirementsMatrixFactory.DefaultSetArrayMatrix !=undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] !=undefined) {
						defaultRequirementMatrix=new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
					}
					else {
						defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement({}));
					}
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.getDefaultDialogRequirementMatrix=function (appContext) {
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_dialogRequirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				}
				else {
					defaultRequirementMatrix=new RequirementMatrix(new DefaultDialogSetRequirement());
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.getClientFullVersionString=function (appContext) {
				var appMinorVersion=appContext.get_appMinorVersion();
				var appMinorVersionString="";
				var appFullVersion="";
				var appName=appContext.get_appName();
				var isIOSClient=appName==1024 ||
					appName==4096 ||
					appName==8192 ||
					appName==65536;
				if (isIOSClient && appContext.get_appVersion()==1) {
					if (appName==4096 && appMinorVersion >=15) {
						appFullVersion="16.00.01";
					}
					else {
						appFullVersion="16.00";
					}
				}
				else if (appContext.get_appName()==64) {
					appFullVersion=appContext.get_appVersion();
				}
				else {
					if (appMinorVersion < 10) {
						appMinorVersionString="0"+appMinorVersion;
					}
					else {
						appMinorVersionString=""+appMinorVersion;
					}
					appFullVersion=appContext.get_appVersion()+"."+appMinorVersionString;
				}
				return appContext.get_appName()+"-"+appFullVersion;
			};
			RequirementsMatrixFactory.initializeDefaultSetMatrix=function () {
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1600]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1600]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1600]=new PowerpointClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1601]=new ExcelClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1601]=new WordClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1601]=new PowerpointClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1600]=new OutlookClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1600]=new ExcelWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_WAC_1600]=new WordWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1600]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1601]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1600]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Access_WAC_1600]=new AccessWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_WAC_1600]=new PowerpointWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1600]=new ExcelIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.SWAY_WAC_1600]=new SwayWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1600]=new WordIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_16001]=new WordIOSV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1600]=new PowerpointIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_IOS_1600]=new OutlookIOSDefaultSetRequirement();
			};
			RequirementsMatrixFactory.Excel_RCLIENT_1600="1-16.00";
			RequirementsMatrixFactory.Excel_RCLIENT_1601="1-16.01";
			RequirementsMatrixFactory.Word_RCLIENT_1600="2-16.00";
			RequirementsMatrixFactory.Word_RCLIENT_1601="2-16.01";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1600="4-16.00";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1601="4-16.01";
			RequirementsMatrixFactory.Outlook_RCLIENT_1600="8-16.00";
			RequirementsMatrixFactory.Excel_WAC_1600="16-16.00";
			RequirementsMatrixFactory.Word_WAC_1600="32-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1600="64-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1601="64-16.01";
			RequirementsMatrixFactory.Project_RCLIENT_1600="128-16.00";
			RequirementsMatrixFactory.Access_WAC_1600="256-16.00";
			RequirementsMatrixFactory.PowerPoint_WAC_1600="512-16.00";
			RequirementsMatrixFactory.Excel_IOS_1600="1024-16.00";
			RequirementsMatrixFactory.SWAY_WAC_1600="2048-16.00";
			RequirementsMatrixFactory.Word_IOS_1600="4096-16.00";
			RequirementsMatrixFactory.Word_IOS_16001="4096-16.00.01";
			RequirementsMatrixFactory.PowerPoint_IOS_1600="8192-16.00";
			RequirementsMatrixFactory.Outlook_IOS_1600="65536-16.00";
			RequirementsMatrixFactory.DefaultSetArrayMatrix={};
			return RequirementsMatrixFactory;
		})();
		Requirement.RequirementsMatrixFactory=RequirementsMatrixFactory;
	})(Requirement=OfficeExt.Requirement || (OfficeExt.Requirement={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
var OfficeExt;
(function (OfficeExt) {
	var HostName;
	(function (HostName) {
		var Host=(function () {
			function Host() {
				this.getDiagnostics=function _getDiagnostics(version) {
					var diagnostics={
						host: this.getHost(),
						version: (version || this.getDefaultVersion()),
						platform: this.getPlatform()
					};
					return diagnostics;
				};
				this.platformRemappings={
					web: Microsoft.Office.WebExtension.PlatformType.OfficeOnline,
					winrt: Microsoft.Office.WebExtension.PlatformType.Universal,
					win32: Microsoft.Office.WebExtension.PlatformType.PC,
					mac: Microsoft.Office.WebExtension.PlatformType.Mac,
					ios: Microsoft.Office.WebExtension.PlatformType.iOS,
					android: Microsoft.Office.WebExtension.PlatformType.Android
				};
				this.camelCaseMappings={
					powerpoint: Microsoft.Office.WebExtension.HostType.PowerPoint,
					onenote: Microsoft.Office.WebExtension.HostType.OneNote
				};
				this.hostInfo=OSF._OfficeAppFactory.getHostInfo();
				this.getHost=this.getHost.bind(this);
				this.getPlatform=this.getPlatform.bind(this);
				this.getDiagnostics=this.getDiagnostics.bind(this);
			}
			Host.prototype.capitalizeFirstLetter=function (input) {
				if (input) {
					return (input[0].toUpperCase()+input.slice(1).toLowerCase());
				}
				return input;
			};
			Host.getInstance=function () {
				if (Host.hostObj===undefined) {
					Host.hostObj=new Host();
				}
				return Host.hostObj;
			};
			Host.prototype.getPlatform=function () {
				if (this.hostInfo.hostPlatform) {
					var hostPlatform=this.hostInfo.hostPlatform.toLowerCase();
					if (this.platformRemappings[hostPlatform]) {
						return this.platformRemappings[hostPlatform];
					}
				}
				return null;
			};
			Host.prototype.getHost=function () {
				if (this.hostInfo.hostType) {
					var hostType=this.hostInfo.hostType.toLowerCase();
					if (this.camelCaseMappings[hostType]) {
						return this.camelCaseMappings[hostType];
					}
					hostType=this.capitalizeFirstLetter(this.hostInfo.hostType);
					if (Microsoft.Office.WebExtension.HostType[hostType]) {
						return Microsoft.Office.WebExtension.HostType[hostType];
					}
				}
				return null;
			};
			Host.prototype.getDefaultVersion=function () {
				if (this.getHost()) {
					return "16.0.0000.0000";
				}
				return null;
			};
			return Host;
		})();
		HostName.Host=Host;
	})(HostName=OfficeExt.HostName || (OfficeExt.HostName={}));
})(OfficeExt || (OfficeExt={}));
Microsoft.Office.WebExtension.ApplicationMode={
	WebEditor: "webEditor",
	WebViewer: "webViewer",
	Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode={
	ReadOnly: "readOnly",
	ReadWrite: "readWrite"
};
OSF.NamespaceManager=(function OSF_NamespaceManager() {
	var _userOffice;
	var _useShortcut=false;
	return {
		enableShortcut: function OSF_NamespaceManager$enableShortcut() {
			if (!_useShortcut) {
				if (window.Office) {
					_userOffice=window.Office;
				}
				else {
					OSF.OUtil.setNamespace("Office", window);
				}
				window.Office=Microsoft.Office.WebExtension;
				_useShortcut=true;
			}
		},
		disableShortcut: function OSF_NamespaceManager$disableShortcut() {
			if (_useShortcut) {
				if (_userOffice) {
					window.Office=_userOffice;
				}
				else {
					OSF.OUtil.unsetNamespace("Office", window);
				}
				_useShortcut=false;
			}
		}
	};
})();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.useShortNamespace=function Microsoft_Office_WebExtension_useShortNamespace(useShortcut) {
	if (useShortcut) {
		OSF.NamespaceManager.enableShortcut();
	}
	else {
		OSF.NamespaceManager.disableShortcut();
	}
};
Microsoft.Office.WebExtension.select=function Microsoft_Office_WebExtension_select(str, errorCallback) {
	var promise;
	if (str && typeof str=="string") {
		var index=str.indexOf("#");
		if (index !=-1) {
			var op=str.substring(0, index);
			var target=str.substring(index+1);
			switch (op) {
				case "binding":
				case "bindings":
					if (target) {
						promise=new OSF.DDA.BindingPromise(target);
					}
					break;
			}
		}
	}
	if (!promise) {
		if (errorCallback) {
			var callbackType=typeof errorCallback;
			if (callbackType=="function") {
				var callArgs={};
				callArgs[Microsoft.Office.WebExtension.Parameters.Callback]=errorCallback;
				OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext, OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext));
			}
			else {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, callbackType);
			}
		}
	}
	else {
		promise.onFail=errorCallback;
		return promise;
	}
};
OSF.DDA.Context=function OSF_DDA_Context(officeAppContext, document, license, appOM, getOfficeTheme) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"contentLanguage": {
			value: officeAppContext.get_dataLocale()
		},
		"displayLanguage": {
			value: officeAppContext.get_appUILocale()
		},
		"touchEnabled": {
			value: officeAppContext.get_touchEnabled()
		},
		"commerceAllowed": {
			value: officeAppContext.get_commerceAllowed()
		},
		"host": {
			value: OfficeExt.HostName.Host.getInstance().getHost()
		},
		"platform": {
			value: OfficeExt.HostName.Host.getInstance().getPlatform()
		},
		"diagnostics": {
			value: OfficeExt.HostName.Host.getInstance().getDiagnostics(officeAppContext.get_hostFullVersion())
		}
	});
	if (license) {
		OSF.OUtil.defineEnumerableProperty(this, "license", {
			value: license
		});
	}
	if (officeAppContext.ui) {
		OSF.OUtil.defineEnumerableProperty(this, "ui", {
			value: officeAppContext.ui
		});
	}
	if (officeAppContext.auth) {
		OSF.OUtil.defineEnumerableProperty(this, "auth", {
			value: officeAppContext.auth
		});
	}
	if (officeAppContext.application) {
		OSF.OUtil.defineEnumerableProperty(this, "application", {
			value: officeAppContext.application
		});
	}
	if (officeAppContext.get_isDialog()) {
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultDialogRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this, "requirements", {
			value: requirements
		});
	}
	else {
		if (document) {
			OSF.OUtil.defineEnumerableProperty(this, "document", {
				value: document
			});
		}
		if (appOM) {
			var displayName=appOM.displayName || "appOM";
			delete appOM.displayName;
			OSF.OUtil.defineEnumerableProperty(this, displayName, {
				value: appOM
			});
		}
		if (getOfficeTheme) {
			OSF.OUtil.defineEnumerableProperty(this, "officeTheme", {
				get: function () {
					return getOfficeTheme();
				}
			});
		}
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this, "requirements", {
			value: requirements
		});
	}
};
OSF.DDA.OutlookContext=function OSF_DDA_OutlookContext(appContext, settings, license, appOM, getOfficeTheme) {
	OSF.DDA.OutlookContext.uber.constructor.call(this, appContext, null, license, appOM, getOfficeTheme);
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "roamingSettings", {
			value: settings
		});
	}
};
OSF.OUtil.extend(OSF.DDA.OutlookContext, OSF.DDA.Context);
OSF.DDA.OutlookAppOm=function OSF_DDA_OutlookAppOm(appContext, window, appReady) { };
OSF.DDA.Application=function OSF_DDA_Application(officeAppContext) {
};
OSF.DDA.Document=function OSF_DDA_Document(officeAppContext, settings) {
	var mode;
	switch (officeAppContext.get_clientMode()) {
		case OSF.ClientMode.ReadOnly:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadOnly;
			break;
		case OSF.ClientMode.ReadWrite:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadWrite;
			break;
	}
	;
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "settings", {
			value: settings
		});
	}
	;
	OSF.OUtil.defineMutableProperties(this, {
		"mode": {
			value: mode
		},
		"url": {
			value: officeAppContext.get_docUrl()
		}
	});
};
OSF.DDA.JsomDocument=function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings) {
	OSF.DDA.JsomDocument.uber.constructor.call(this, officeAppContext, settings);
	if (bindingFacade) {
		OSF.OUtil.defineEnumerableProperty(this, "bindings", {
			get: function OSF_DDA_Document$GetBindings() { return bindingFacade; }
		});
	}
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetSelectedDataAsync,
		am.SetSelectedDataAsync
	]);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
};
OSF.OUtil.extend(OSF.DDA.JsomDocument, OSF.DDA.Document);
OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension, "context", {
	get: function Microsoft_Office_WebExtension$GetContext() {
		var context;
		if (OSF && OSF._OfficeAppFactory) {
			context=OSF._OfficeAppFactory.getContext();
		}
		return context;
	}
});
OSF.DDA.License=function OSF_DDA_License(eToken) {
	OSF.OUtil.defineEnumerableProperty(this, "value", {
		value: eToken
	});
};
OSF.DDA.ApiMethodCall=function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var getInvalidParameterString=OSF.OUtil.delayExecutionAndCache(function () {
		return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters, displayName);
	});
	this.verifyArguments=function OSF_DDA_ApiMethodCall$VerifyArguments(params, args) {
		for (var name in params) {
			var param=params[name];
			var arg=args[name];
			if (param["enum"]) {
				switch (typeof arg) {
					case "string":
						if (OSF.OUtil.listContainsValue(param["enum"], arg)) {
							break;
						}
					case "undefined":
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration;
					default:
						throw getInvalidParameterString();
				}
			}
			if (param["types"]) {
				if (!OSF.OUtil.listContainsValue(param["types"], typeof arg)) {
					throw getInvalidParameterString();
				}
			}
		}
	};
	this.extractRequiredArguments=function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo) {
		if (userArgs.length < requiredCount) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
		}
		var requiredArgs=[];
		var index;
		for (index=0; index < requiredCount; index++) {
			requiredArgs.push(userArgs[index]);
		}
		this.verifyArguments(requiredParameters, requiredArgs);
		var ret={};
		for (index=0; index < requiredCount; index++) {
			var param=requiredParameters[index];
			var arg=requiredArgs[index];
			if (param.verify) {
				var isValid=param.verify(arg, caller, stateInfo);
				if (!isValid) {
					throw getInvalidParameterString();
				}
			}
			ret[param.name]=arg;
		}
		return ret;
	},
		this.fillOptions=function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo) {
			options=options || {};
			for (var optionName in supportedOptions) {
				if (!OSF.OUtil.listContainsKey(options, optionName)) {
					var value=undefined;
					var option=supportedOptions[optionName];
					if (option.calculate && requiredArgs) {
						value=option.calculate(requiredArgs, caller, stateInfo);
					}
					if (!value && option.defaultValue !==undefined) {
						value=option.defaultValue;
					}
					options[optionName]=value;
				}
			}
			return options;
		};
	this.constructCallArgs=function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo) {
		var callArgs={};
		for (var r in required) {
			callArgs[r]=required[r];
		}
		for (var o in options) {
			callArgs[o]=options[o];
		}
		for (var s in privateStateCallbacks) {
			callArgs[s]=privateStateCallbacks[s](caller, stateInfo);
		}
		if (checkCallArgs) {
			callArgs=checkCallArgs(callArgs, caller, stateInfo);
		}
		return callArgs;
	};
};
OSF.OUtil.setNamespace("AsyncResultEnum", OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties={
	Context: "Context",
	Value: "Value",
	Status: "Status",
	Error: "Error"
};
Microsoft.Office.WebExtension.AsyncResultStatus={
	Succeeded: "succeeded",
	Failed: "failed"
};
OSF.DDA.AsyncResultEnum.ErrorCode={
	Success: 0,
	Failed: 1
};
OSF.DDA.AsyncResultEnum.ErrorProperties={
	Name: "Name",
	Message: "Message",
	Code: "Code"
};
OSF.DDA.AsyncMethodNames={};
OSF.DDA.AsyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.AsyncMethodNames[entry]=am;
	}
};
OSF.DDA.AsyncMethodCall=function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+2) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				case "function":
					if (parameterCallback) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
					}
					else {
						parameterCallback=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		if (parameterCallback) {
			if (options[Microsoft.Office.WebExtension.Parameters.Callback]) {
				throw Strings.OfficeOM.L_RedundantCallbackSpecification;
			}
			else {
				options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
			}
		}
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
	this.processResponse=function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, caller, callArgs) {
		var payload;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			if (onSucceeded) {
				payload=onSucceeded(response, caller, callArgs);
			}
			else {
				payload=response;
			}
		}
		else {
			if (onFailed) {
				payload=onFailed(status, response);
			}
			else {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
		}
		return payload;
	};
	this.getCallArgs=function (suppliedArgs) {
		var options, parameterCallback;
		for (var i=suppliedArgs.length - 1; i >=requiredCount; i--) {
			var argument=suppliedArgs[i];
			switch (typeof argument) {
				case "object":
					options=argument;
					break;
				case "function":
					parameterCallback=argument;
					break;
			}
		}
		options=options || {};
		if (parameterCallback) {
			options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
		}
		return options;
	};
};
OSF.DDA.AsyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			var privateStateCallbacks=params.privateStateCallbacks ? OSF.OUtil.createObject(params.privateStateCallbacks) : [];
			return new OSF.DDA.AsyncMethodCall(params.requiredArguments || [], supportedOptions, privateStateCallbacks, params.onSucceeded, params.onFailed, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.AsyncMethodCalls={};
OSF.DDA.AsyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.AsyncMethodCalls[callDefinition.method.id]=OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.Error=function OSF_DDA_Error(name, message, code) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"name": {
			value: name
		},
		"message": {
			value: message
		},
		"code": {
			value: code
		}
	});
};
OSF.DDA.AsyncResult=function OSF_DDA_AsyncResult(initArgs, errorArgs) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"value": {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]
		},
		"status": {
			value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded
		}
	});
	if (initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]) {
		OSF.OUtil.defineEnumerableProperty(this, "asyncContext", {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]
		});
	}
	if (errorArgs) {
		OSF.OUtil.defineEnumerableProperty(this, "error", {
			value: new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])
		});
	}
};
OSF.DDA.issueAsyncResult=function OSF_DDA$IssueAsyncResult(callArgs, status, payload) {
	var callback=callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
	if (callback) {
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
		var errorArgs;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
		}
		else {
			errorArgs={};
			payload=payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
		}
		callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
	}
};
OSF.DDA.SyncMethodNames={};
OSF.DDA.SyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.SyncMethodNames[entry]=am;
	}
};
OSF.DDA.SyncMethodCall=function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+1) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
};
OSF.DDA.SyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			return new OSF.DDA.SyncMethodCall(params.requiredArguments || [], supportedOptions, params.privateStateCallbacks, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.SyncMethodCalls={};
OSF.DDA.SyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.SyncMethodCalls[callDefinition.method.id]=OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.ListType=(function () {
	var listTypes={};
	return {
		setListType: function OSF_DDA_ListType$AddListType(t, prop) { listTypes[t]=prop; },
		isListType: function OSF_DDA_ListType$IsListType(t) { return OSF.OUtil.listContainsKey(listTypes, t); },
		getDescriptor: function OSF_DDA_ListType$getDescriptor(t) { return listTypes[t]; }
	};
})();
OSF.DDA.HostParameterMap=function (specialProcessor, mappings) {
	var toHostMap="toHost";
	var fromHostMap="fromHost";
	var sourceData="sourceData";
	var self="self";
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]={
		toHost: function (data) {
			if (data !=null && data.rows !==undefined) {
				var tableData={};
				tableData[OSF.DDA.TableDataProperties.TableRows]=data.rows;
				tableData[OSF.DDA.TableDataProperties.TableHeaders]=data.headers;
				data=tableData;
			}
			return data;
		},
		fromHost: function (args) {
			return args;
		}
	};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.SampleData]=dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data];
	function mapValues(preimageSet, mapping) {
		var ret=preimageSet ? {} : undefined;
		for (var entry in preimageSet) {
			var preimage=preimageSet[entry];
			var image;
			if (OSF.DDA.ListType.isListType(entry)) {
				image=[];
				for (var subEntry in preimage) {
					image.push(mapValues(preimage[subEntry], mapping));
				}
			}
			else if (OSF.OUtil.listContainsKey(dynamicTypes, entry)) {
				image=dynamicTypes[entry][mapping](preimage);
			}
			else if (mapping==fromHostMap && specialProcessor.preserveNesting(entry)) {
				image=mapValues(preimage, mapping);
			}
			else {
				var maps=mappings[entry];
				if (maps) {
					var map=maps[mapping];
					if (map) {
						image=map[preimage];
						if (image===undefined) {
							image=preimage;
						}
					}
				}
				else {
					image=preimage;
				}
			}
			ret[entry]=image;
		}
		return ret;
	}
	;
	function generateArguments(imageSet, parameters) {
		var ret;
		for (var param in parameters) {
			var arg;
			if (specialProcessor.isComplexType(param)) {
				arg=generateArguments(imageSet, mappings[param][toHostMap]);
			}
			else {
				arg=imageSet[param];
			}
			if (arg !=undefined) {
				if (!ret) {
					ret={};
				}
				var index=parameters[param];
				if (index==self) {
					index=param;
				}
				ret[index]=specialProcessor.pack(param, arg);
			}
		}
		return ret;
	}
	;
	function extractArguments(source, parameters, extracted) {
		if (!extracted) {
			extracted={};
		}
		for (var param in parameters) {
			var index=parameters[param];
			var value;
			if (index==self) {
				value=source;
			}
			else if (index==sourceData) {
				extracted[param]=source.toArray();
				continue;
			}
			else {
				value=source[index];
			}
			if (value===null || value===undefined) {
				extracted[param]=undefined;
			}
			else {
				value=specialProcessor.unpack(param, value);
				var map;
				if (specialProcessor.isComplexType(param)) {
					map=mappings[param][fromHostMap];
					if (specialProcessor.preserveNesting(param)) {
						extracted[param]=extractArguments(value, map);
					}
					else {
						extractArguments(value, map, extracted);
					}
				}
				else {
					if (OSF.DDA.ListType.isListType(param)) {
						map={};
						var entryDescriptor=OSF.DDA.ListType.getDescriptor(param);
						map[entryDescriptor]=self;
						var extractedValues=new Array(value.length);
						for (var item in value) {
							extractedValues[item]=extractArguments(value[item], map);
						}
						extracted[param]=extractedValues;
					}
					else {
						extracted[param]=value;
					}
				}
			}
		}
		return extracted;
	}
	;
	function applyMap(mapName, preimage, mapping) {
		var parameters=mappings[mapName][mapping];
		var image;
		if (mapping=="toHost") {
			var imageSet=mapValues(preimage, mapping);
			image=generateArguments(imageSet, parameters);
		}
		else if (mapping=="fromHost") {
			var argumentSet=extractArguments(preimage, parameters);
			image=mapValues(argumentSet, mapping);
		}
		return image;
	}
	;
	if (!mappings) {
		mappings={};
	}
	this.addMapping=function (mapName, description) {
		var toHost, fromHost;
		if (description.map) {
			toHost=description.map;
			fromHost={};
			for (var preimage in toHost) {
				var image=toHost[preimage];
				if (image==self) {
					image=preimage;
				}
				fromHost[image]=preimage;
			}
		}
		else {
			toHost=description.toHost;
			fromHost=description.fromHost;
		}
		var pair=mappings[mapName];
		if (pair) {
			var currMap=pair[toHostMap];
			for (var th in currMap)
				toHost[th]=currMap[th];
			currMap=pair[fromHostMap];
			for (var fh in currMap)
				fromHost[fh]=currMap[fh];
		}
		else {
			pair=mappings[mapName]={};
		}
		pair[toHostMap]=toHost;
		pair[fromHostMap]=fromHost;
	};
	this.toHost=function (mapName, preimage) { return applyMap(mapName, preimage, toHostMap); };
	this.fromHost=function (mapName, image) { return applyMap(mapName, image, fromHostMap); };
	this.self=self;
	this.sourceData=sourceData;
	this.addComplexType=function (ct) { specialProcessor.addComplexType(ct); };
	this.getDynamicType=function (dt) { return specialProcessor.getDynamicType(dt); };
	this.setDynamicType=function (dt, handler) { specialProcessor.setDynamicType(dt, handler); };
	this.dynamicTypes=dynamicTypes;
	this.doMapValues=function (preimageSet, mapping) { return mapValues(preimageSet, mapping); };
};
OSF.DDA.SpecialProcessor=function (complexTypes, dynamicTypes) {
	this.addComplexType=function OSF_DDA_SpecialProcessor$addComplexType(ct) {
		complexTypes.push(ct);
	};
	this.getDynamicType=function OSF_DDA_SpecialProcessor$getDynamicType(dt) {
		return dynamicTypes[dt];
	};
	this.setDynamicType=function OSF_DDA_SpecialProcessor$setDynamicType(dt, handler) {
		dynamicTypes[dt]=handler;
	};
	this.isComplexType=function OSF_DDA_SpecialProcessor$isComplexType(t) {
		return OSF.OUtil.listContainsValue(complexTypes, t);
	};
	this.isDynamicType=function OSF_DDA_SpecialProcessor$isDynamicType(p) {
		return OSF.OUtil.listContainsKey(dynamicTypes, p);
	};
	this.preserveNesting=function OSF_DDA_SpecialProcessor$preserveNesting(p) {
		var pn=[];
		if (OSF.DDA.PropertyDescriptors)
			pn.push(OSF.DDA.PropertyDescriptors.Subset);
		if (OSF.DDA.DataNodeEventProperties) {
			pn=pn.concat([
				OSF.DDA.DataNodeEventProperties.OldNode,
				OSF.DDA.DataNodeEventProperties.NewNode,
				OSF.DDA.DataNodeEventProperties.NextSiblingNode
			]);
		}
		return OSF.OUtil.listContainsValue(pn, p);
	};
	this.pack=function OSF_DDA_SpecialProcessor$pack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].toHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
	this.unpack=function OSF_DDA_SpecialProcessor$unpack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].fromHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
};
OSF.DDA.getDecoratedParameterMap=function (specialProcessor, initialDefs) {
	var parameterMap=new OSF.DDA.HostParameterMap(specialProcessor);
	var self=parameterMap.self;
	function createObject(properties) {
		var obj=null;
		if (properties) {
			obj={};
			var len=properties.length;
			for (var i=0; i < len; i++) {
				obj[properties[i].name]=properties[i].value;
			}
		}
		return obj;
	}
	parameterMap.define=function define(definition) {
		var args={};
		var toHost=createObject(definition.toHost);
		if (definition.invertible) {
			args.map=toHost;
		}
		else if (definition.canonical) {
			args.toHost=args.fromHost=toHost;
		}
		else {
			args.toHost=toHost;
			args.fromHost=createObject(definition.fromHost);
		}
		parameterMap.addMapping(definition.type, args);
		if (definition.isComplexType)
			parameterMap.addComplexType(definition.type);
	};
	for (var id in initialDefs)
		parameterMap.define(initialDefs[id]);
	return parameterMap;
};
OSF.OUtil.setNamespace("DispIdHost", OSF.DDA);
OSF.DDA.DispIdHost.Methods={
	InvokeMethod: "invokeMethod",
	AddEventHandler: "addEventHandler",
	RemoveEventHandler: "removeEventHandler",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent",
	SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Delegates={
	ExecuteAsync: "executeAsync",
	RegisterEventAsync: "registerEventAsync",
	UnregisterEventAsync: "unregisterEventAsync",
	ParameterMap: "parameterMap",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent",
	SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Facade=function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap) {
	var dispIdMap={};
	var jsom=OSF.DDA.AsyncMethodNames;
	var did=OSF.DDA.MethodDispId;
	var methodMap={
		"GoToByIdAsync": did.dispidNavigateToMethod,
		"GetSelectedDataAsync": did.dispidGetSelectedDataMethod,
		"SetSelectedDataAsync": did.dispidSetSelectedDataMethod,
		"GetDocumentCopyChunkAsync": did.dispidGetDocumentCopyChunkMethod,
		"ReleaseDocumentCopyAsync": did.dispidReleaseDocumentCopyMethod,
		"GetDocumentCopyAsync": did.dispidGetDocumentCopyMethod,
		"AddFromSelectionAsync": did.dispidAddBindingFromSelectionMethod,
		"AddFromPromptAsync": did.dispidAddBindingFromPromptMethod,
		"AddFromNamedItemAsync": did.dispidAddBindingFromNamedItemMethod,
		"GetAllAsync": did.dispidGetAllBindingsMethod,
		"GetByIdAsync": did.dispidGetBindingMethod,
		"ReleaseByIdAsync": did.dispidReleaseBindingMethod,
		"GetDataAsync": did.dispidGetBindingDataMethod,
		"SetDataAsync": did.dispidSetBindingDataMethod,
		"AddRowsAsync": did.dispidAddRowsMethod,
		"AddColumnsAsync": did.dispidAddColumnsMethod,
		"DeleteAllDataValuesAsync": did.dispidClearAllRowsMethod,
		"RefreshAsync": did.dispidLoadSettingsMethod,
		"SaveAsync": did.dispidSaveSettingsMethod,
		"GetActiveViewAsync": did.dispidGetActiveViewMethod,
		"GetFilePropertiesAsync": did.dispidGetFilePropertiesMethod,
		"GetOfficeThemeAsync": did.dispidGetOfficeThemeMethod,
		"GetDocumentThemeAsync": did.dispidGetDocumentThemeMethod,
		"ClearFormatsAsync": did.dispidClearFormatsMethod,
		"SetTableOptionsAsync": did.dispidSetTableOptionsMethod,
		"SetFormatsAsync": did.dispidSetFormatsMethod,
		"GetAccessTokenAsync": did.dispidGetAccessTokenMethod,
		"ExecuteRichApiRequestAsync": did.dispidExecuteRichApiRequestMethod,
		"AppCommandInvocationCompletedAsync": did.dispidAppCommandInvocationCompletedMethod,
		"CloseContainerAsync": did.dispidCloseContainerMethod,
		"OpenBrowserWindow": did.dispidOpenBrowserWindow,
		"CreateDocumentAsync": did.dispidCreateDocumentMethod,
		"AddDataPartAsync": did.dispidAddDataPartMethod,
		"GetDataPartByIdAsync": did.dispidGetDataPartByIdMethod,
		"GetDataPartsByNameSpaceAsync": did.dispidGetDataPartsByNamespaceMethod,
		"GetPartXmlAsync": did.dispidGetDataPartXmlMethod,
		"GetPartNodesAsync": did.dispidGetDataPartNodesMethod,
		"DeleteDataPartAsync": did.dispidDeleteDataPartMethod,
		"GetNodeValueAsync": did.dispidGetDataNodeValueMethod,
		"GetNodeXmlAsync": did.dispidGetDataNodeXmlMethod,
		"GetRelativeNodesAsync": did.dispidGetDataNodesMethod,
		"SetNodeValueAsync": did.dispidSetDataNodeValueMethod,
		"SetNodeXmlAsync": did.dispidSetDataNodeXmlMethod,
		"AddDataPartNamespaceAsync": did.dispidAddDataNamespaceMethod,
		"GetDataPartNamespaceAsync": did.dispidGetDataUriByPrefixMethod,
		"GetDataPartPrefixAsync": did.dispidGetDataPrefixByUriMethod,
		"GetNodeTextAsync": did.dispidGetDataNodeTextMethod,
		"SetNodeTextAsync": did.dispidSetDataNodeTextMethod,
		"GetSelectedTask": did.dispidGetSelectedTaskMethod,
		"GetTask": did.dispidGetTaskMethod,
		"GetWSSUrl": did.dispidGetWSSUrlMethod,
		"GetTaskField": did.dispidGetTaskFieldMethod,
		"GetSelectedResource": did.dispidGetSelectedResourceMethod,
		"GetResourceField": did.dispidGetResourceFieldMethod,
		"GetProjectField": did.dispidGetProjectFieldMethod,
		"GetSelectedView": did.dispidGetSelectedViewMethod,
		"GetTaskByIndex": did.dispidGetTaskByIndexMethod,
		"GetResourceByIndex": did.dispidGetResourceByIndexMethod,
		"SetTaskField": did.dispidSetTaskFieldMethod,
		"SetResourceField": did.dispidSetResourceFieldMethod,
		"GetMaxTaskIndex": did.dispidGetMaxTaskIndexMethod,
		"GetMaxResourceIndex": did.dispidGetMaxResourceIndexMethod,
		"CreateTask": did.dispidCreateTaskMethod
	};
	for (var method in methodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=methodMap[method];
		}
	}
	jsom=OSF.DDA.SyncMethodNames;
	did=OSF.DDA.MethodDispId;
	var syncMethodMap={
		"MessageParent": did.dispidMessageParentMethod,
		"SendMessage": did.dispidSendMessageMethod
	};
	for (var method in syncMethodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=syncMethodMap[method];
		}
	}
	jsom=Microsoft.Office.WebExtension.EventType;
	did=OSF.DDA.EventDispId;
	var eventMap={
		"SettingsChanged": did.dispidSettingsChangedEvent,
		"DocumentSelectionChanged": did.dispidDocumentSelectionChangedEvent,
		"BindingSelectionChanged": did.dispidBindingSelectionChangedEvent,
		"BindingDataChanged": did.dispidBindingDataChangedEvent,
		"ActiveViewChanged": did.dispidActiveViewChangedEvent,
		"OfficeThemeChanged": did.dispidOfficeThemeChangedEvent,
		"DocumentThemeChanged": did.dispidDocumentThemeChangedEvent,
		"AppCommandInvoked": did.dispidAppCommandInvokedEvent,
		"DialogMessageReceived": did.dispidDialogMessageReceivedEvent,
		"DialogParentMessageReceived": did.dispidDialogParentMessageReceivedEvent,
		"ObjectDeleted": did.dispidObjectDeletedEvent,
		"ObjectSelectionChanged": did.dispidObjectSelectionChangedEvent,
		"ObjectDataChanged": did.dispidObjectDataChangedEvent,
		"ContentControlAdded": did.dispidContentControlAddedEvent,
		"RichApiMessage": did.dispidRichApiMessageEvent,
		"ItemChanged": did.dispidOlkItemSelectedChangedEvent,
		"RecipientsChanged": did.dispidOlkRecipientsChangedEvent,
		"AppointmentTimeChanged": did.dispidOlkAppointmentTimeChangedEvent,
		"TaskSelectionChanged": did.dispidTaskSelectionChangedEvent,
		"ResourceSelectionChanged": did.dispidResourceSelectionChangedEvent,
		"ViewSelectionChanged": did.dispidViewSelectionChangedEvent,
		"DataNodeInserted": did.dispidDataNodeAddedEvent,
		"DataNodeReplaced": did.dispidDataNodeReplacedEvent,
		"DataNodeDeleted": did.dispidDataNodeDeletedEvent
	};
	for (var event in eventMap) {
		if (jsom[event]) {
			dispIdMap[jsom[event]]=eventMap[event];
		}
	}
	function IsObjectEvent(dispId) {
		return (dispId==OSF.DDA.EventDispId.dispidObjectDeletedEvent ||
			dispId==OSF.DDA.EventDispId.dispidObjectSelectionChangedEvent ||
			dispId==OSF.DDA.EventDispId.dispidObjectDataChangedEvent ||
			dispId==OSF.DDA.EventDispId.dispidContentControlAddedEvent);
	}
	function onException(ex, asyncMethodCall, suppliedArgs, callArgs) {
		if (typeof ex=="number") {
			if (!callArgs) {
				callArgs=asyncMethodCall.getCallArgs(suppliedArgs);
			}
			OSF.DDA.issueAsyncResult(callArgs, ex, OSF.DDA.ErrorCodeManager.getErrorArgs(ex));
		}
		else {
			throw ex;
		}
	}
	;
	this[OSF.DDA.DispIdHost.Methods.InvokeMethod]=function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, caller, privateState) {
		var callArgs;
		try {
			var methodName=method.id;
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[methodName];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, privateState);
			var dispId=dispIdMap[methodName];
			var delegate=getDelegateMethods(methodName);
			var richApiInExcelMethodSubstitution=null;
			if (window.Excel && window.Office.context.requirements.isSetSupported("RedirectV1Api")) {
				window.Excel._RedirectV1APIs=true;
			}
			if (window.Excel && window.Excel._RedirectV1APIs && (richApiInExcelMethodSubstitution=window.Excel._V1APIMap[methodName])) {
				var preprocessedCallArgs=OSF.OUtil.shallowCopy(callArgs);
				delete preprocessedCallArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
				if (richApiInExcelMethodSubstitution.preprocess) {
					preprocessedCallArgs=richApiInExcelMethodSubstitution.preprocess(preprocessedCallArgs);
				}
				var ctx=new window.Excel.RequestContext();
				var result=richApiInExcelMethodSubstitution.call(ctx, preprocessedCallArgs);
				ctx.sync()
					.then(function () {
					var response=result.value;
					var status=response.status;
					delete response["status"];
					delete response["@odata.type"];
					if (richApiInExcelMethodSubstitution.postprocess) {
						response=richApiInExcelMethodSubstitution.postprocess(response, preprocessedCallArgs);
					}
					if (status !=0) {
						response=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, response);
				})["catch"](function (error) {
					OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeFailure, null);
				});
			}
			else {
				var hostCallArgs;
				if (parameterMap.toHost) {
					hostCallArgs=parameterMap.toHost(dispId, callArgs);
				}
				else {
					hostCallArgs=callArgs;
				}
				var startTime=(new Date()).getTime();
				delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
					"dispId": dispId,
					"hostCallArgs": hostCallArgs,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { },
					"onComplete": function (status, hostResponseArgs) {
						var responseArgs;
						if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
							if (parameterMap.fromHost) {
								responseArgs=parameterMap.fromHost(dispId, hostResponseArgs);
							}
							else {
								responseArgs=hostResponseArgs;
							}
						}
						else {
							responseArgs=hostResponseArgs;
						}
						var payload=asyncMethodCall.processResponse(status, responseArgs, caller, callArgs);
						OSF.DDA.issueAsyncResult(callArgs, status, payload);
						if (OSF.AppTelemetry) {
							OSF.AppTelemetry.onMethodDone(dispId, hostCallArgs, Math.abs((new Date()).getTime() - startTime), status);
						}
					}
				});
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.AddEventHandler]=function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, caller, isPopupWindow) {
		var callArgs;
		var eventType, handler;
		var isObjectEvent=false;
		function onEnsureRegistration(status) {
			if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				var added=!isObjectEvent ? eventDispatch.addEventHandler(eventType, handler) :
					eventDispatch.addObjectEventHandler(eventType, callArgs[Microsoft.Office.WebExtension.Parameters.Id], handler);
				if (!added) {
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed;
				}
			}
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			if (isPopupWindow) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
				return;
			}
			var dispId=dispIdMap[eventType];
			isObjectEvent=IsObjectEvent(dispId);
			var targetId=(isObjectEvent ? callArgs[Microsoft.Office.WebExtension.Parameters.Id] : (caller.id || ""));
			var count=isObjectEvent ? eventDispatch.getObjectEventHandlerCount(eventType, targetId) : eventDispatch.getEventHandlerCount(eventType);
			if (count==0) {
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": targetId,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration,
					"onEvent": function handleEvent(hostArgs) {
						var args=parameterMap.fromHost(dispId, hostArgs);
						if (!isObjectEvent)
							eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType, caller, args));
						else
							eventDispatch.fireObjectEvent(targetId, OSF.DDA.OMFactory.manufactureEventArgs(eventType, targetId, args));
					}
				});
			}
			else {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler]=function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var eventType, handler;
		var isObjectEvent=false;
		function onEnsureRegistration(status) {
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			var dispId=dispIdMap[eventType];
			isObjectEvent=IsObjectEvent(dispId);
			var targetId=(isObjectEvent ? callArgs[Microsoft.Office.WebExtension.Parameters.Id] : (caller.id || ""));
			var status, removeSuccess;
			if (handler===null) {
				removeSuccess=isObjectEvent ? eventDispatch.clearObjectEventHandlers(eventType, targetId) : eventDispatch.clearEventHandlers(eventType);
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
			}
			else {
				removeSuccess=isObjectEvent ? eventDispatch.removeObjectEventHandler(eventType, targetId, handler) : eventDispatch.removeEventHandler(eventType, handler);
				status=removeSuccess ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist;
			}
			var count=isObjectEvent ? eventDispatch.getObjectEventHandlerCount(eventType, targetId) : eventDispatch.getEventHandlerCount(eventType);
			if (removeSuccess && count==0) {
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": targetId,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration
				});
			}
			else {
				onEnsureRegistration(status);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.OpenDialog]=function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var targetId;
		var dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
		var dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
		function onEnsureRegistration(status) {
			var payload;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			else {
				var onSucceedArgs={};
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id]=targetId;
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data]=eventDispatch;
				var payload=asyncMethodCall.processResponse(status, onSucceedArgs, caller, callArgs);
				OSF.DialogShownStatus.hasDialogShown=true;
				eventDispatch.clearEventHandlers(dialogMessageEvent);
				eventDispatch.clearEventHandlers(dialogOtherEvent);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, payload);
		}
		try {
			if (dialogMessageEvent==undefined || dialogOtherEvent==undefined) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported);
			}
			if (OSF.DDA.AsyncMethodNames.DisplayDialogAsync==null) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				return;
			}
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
			targetId=JSON.stringify(callArgs);
			if (!OSF.DialogShownStatus.hasDialogShown) {
				eventDispatch.clearQueuedEvent(dialogMessageEvent);
				eventDispatch.clearQueuedEvent(dialogOtherEvent);
				eventDispatch.clearQueuedEvent(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived);
			}
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": onEnsureRegistration,
				"onEvent": function handleEvent(hostArgs) {
					var args=parameterMap.fromHost(dispId, hostArgs);
					var event=OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent, caller, args);
					if (event.type==dialogOtherEvent) {
						var payload=OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
						var errorArgs={};
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
						event.error=new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]);
					}
					eventDispatch.fireOrQueueEvent(event);
					if (args[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogClosed) {
						eventDispatch.clearEventHandlers(dialogMessageEvent);
						eventDispatch.clearEventHandlers(dialogOtherEvent);
						eventDispatch.clearEventHandlers(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived);
						OSF.DialogShownStatus.hasDialogShown=false;
					}
				}
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.CloseDialog]=function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller) {
		var callArgs;
		var dialogMessageEvent, dialogOtherEvent;
		var closeStatus=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
		function closeCallback(status) {
			closeStatus=status;
			OSF.DialogShownStatus.hasDialogShown=false;
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
			dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
			eventDispatch.clearEventHandlers(dialogMessageEvent);
			eventDispatch.clearEventHandlers(dialogOtherEvent);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": closeCallback
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
		if (closeStatus !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed, OSF.DDA.AsyncMethodNames.CloseAsync.displayName, closeStatus);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.MessageParent]=function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller) {
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
		return invoker({
			"dispId": dispId,
			"hostCallArgs": callArgs,
			"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
			"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
		});
	};
	this[OSF.DDA.DispIdHost.Methods.SendMessage]=function OSF_DDA_DispIdHost_Facade$SendMessage(suppliedArguments, eventDispatch, caller) {
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.SendMessage.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.SendMessage.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.SendMessage];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.SendMessage.id];
		return invoker({
			"dispId": dispId,
			"hostCallArgs": callArgs,
			"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
			"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
		});
	};
};
OSF.DDA.DispIdHost.addAsyncMethods=function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState) {
	for (var entry in asyncMethodNames) {
		var method=asyncMethodNames[entry];
		var name=method.displayName;
		if (!target[name]) {
			OSF.OUtil.defineEnumerableProperty(target, name, {
				value: (function (asyncMethod) {
					return function () {
						var invokeMethod=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
						invokeMethod(asyncMethod, arguments, target, privateState);
					};
				})(method)
			});
		}
	}
};
OSF.DDA.DispIdHost.addEventSupport=function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch, isPopupWindow) {
	var add=OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
	var remove=OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
	if (!target[add]) {
		OSF.OUtil.defineEnumerableProperty(target, add, {
			value: function () {
				var addEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
				addEventHandler(arguments, eventDispatch, target, isPopupWindow);
			}
		});
	}
	if (!target[remove]) {
		OSF.OUtil.defineEnumerableProperty(target, remove, {
			value: function () {
				var removeEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
				removeEventHandler(arguments, eventDispatch, target);
			}
		});
	}
};
OSF.ShowWindowDialogParameterKeys={
	Url: "url",
	Width: "width",
	Height: "height",
	DisplayInIframe: "displayInIframe",
	HideTitle: "hideTitle",
	UseDeviceIndependentPixels: "useDeviceIndependentPixels"
};
OSF.HostThemeButtonStyleKeys={
	ButtonBorderColor: "buttonBorderColor",
	ButtonBackgroundColor: "buttonBackgroundColor"
};
OSF.OmexPageParameterKeys={
	AppName: "client",
	AppVersion: "cv",
	AppUILocale: "ui",
	AppDomain: "appDomain",
	StoreLocator: "rs",
	AssetId: "assetid",
	NotificationType: "notificationType",
	AppCorrelationId: "corr",
	AuthType: "authType"
};
OSF.AuthType={
	Anonymous: 0,
	MSA: 1,
	OrgId: 2,
	ADAL: 3
};
OSF.OmexMessageKeys={
	MessageType: "messageType",
	MessageValue: "messageValue"
};
OSF.OmexRemoveAddinMessageKeys={
	RemoveAddinResultCode: "resultCode",
	RemoveAddinResultValue: "resultValue"
};
OSF.OmexRemoveAddinResultCode={
	Success: 0,
	ClientError: 400,
	ServerError: 500,
	UnknownError: 600
};
var OfficeExt;
(function (OfficeExt) {
	var WACUtils;
	(function (WACUtils) {
		var _trustedDomain="^https:\/\/[a-z0-9-]+\.(officeapps\.live|officeapps-df\.live|partner\.officewebapps)\.com\/";
		function parseAppContextFromWindowName(skipSessionStorage, windowName) {
			return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.AppContext);
		}
		WACUtils.parseAppContextFromWindowName=parseAppContextFromWindowName;
		function serializeObjectToString(response) {
			if (typeof (JSON) !=="undefined") {
				try {
					return JSON.stringify(response);
				}
				catch (ex) {
				}
			}
			return "";
		}
		WACUtils.serializeObjectToString=serializeObjectToString;
		function isHostTrusted() {
			return (new RegExp(_trustedDomain)).test(OSF.getClientEndPoint()._targetUrl.toLowerCase());
		}
		WACUtils.isHostTrusted=isHostTrusted;
		function addHostInfoAsQueryParam(url, hostInfoValue) {
			if (!url) {
				return null;
			}
			url=url.trim() || '';
			var questionMark="?";
			var hostInfo="_host_Info=";
			var ampHostInfo="&_host_Info=";
			var fragmentSeparator="#";
			var urlParts=url.split(fragmentSeparator);
			var urlWithoutFragment=urlParts.shift();
			var fragment=urlParts.join(fragmentSeparator);
			var querySplits=urlWithoutFragment.split(questionMark);
			var urlWithoutFragmentWithHostInfo;
			if (querySplits.length > 1) {
				urlWithoutFragmentWithHostInfo=urlWithoutFragment+ampHostInfo+hostInfoValue;
			}
			else if (querySplits.length > 0) {
				urlWithoutFragmentWithHostInfo=urlWithoutFragment+questionMark+hostInfo+hostInfoValue;
			}
			if (fragment) {
				return [urlWithoutFragmentWithHostInfo, fragmentSeparator, fragment].join('');
			}
			else {
				return urlWithoutFragmentWithHostInfo;
			}
		}
		WACUtils.addHostInfoAsQueryParam=addHostInfoAsQueryParam;
		function getDomainForUrl(url) {
			if (!url) {
				return null;
			}
			var url_parser=document.createElement('a');
			url_parser.href=url;
			return url_parser.protocol+"//"+url_parser.host;
		}
		WACUtils.getDomainForUrl=getDomainForUrl;
		function shouldUseLocalStorageToPassMessage() {
			try {
				var osList=[
					"Windows NT 6.1",
					"Windows NT 6.2",
					"Windows NT 6.3"
				];
				var userAgent=window.navigator.userAgent;
				for (var i=0, len=osList.length; i < len; i++) {
					if (userAgent.indexOf(osList[i]) > -1) {
						return isInternetExplorer();
					}
				}
				return false;
			}
			catch (e) {
				OsfMsAjaxFactory.msAjaxDebug.trace("Error happens in shouldUseLocalStorageToPassMessage: "+e);
				return false;
			}
		}
		WACUtils.shouldUseLocalStorageToPassMessage=shouldUseLocalStorageToPassMessage;
		function isInternetExplorer() {
			try {
				var userAgent=window.navigator.userAgent;
				return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
			}
			catch (e) {
				OsfMsAjaxFactory.msAjaxDebug.trace("Error happens in isInternetExplorer: "+e);
				return false;
			}
		}
		WACUtils.isInternetExplorer=isInternetExplorer;
	})(WACUtils=OfficeExt.WACUtils || (OfficeExt.WACUtils={}));
})(OfficeExt || (OfficeExt={}));
var OfficeExt;
(function (OfficeExt) {
	var MsAjaxTypeHelper=(function () {
		function MsAjaxTypeHelper() {
		}
		MsAjaxTypeHelper.isInstanceOfType=function (type, instance) {
			if (typeof (instance)==="undefined" || instance===null)
				return false;
			if (instance instanceof type)
				return true;
			var instanceType=instance.constructor;
			if (!instanceType || (typeof (instanceType) !=="function") || !instanceType.__typeName || instanceType.__typeName==='Object') {
				instanceType=Object;
			}
			return !!(instanceType===type) ||
				(instanceType.__typeName && type.__typeName && instanceType.__typeName===type.__typeName);
		};
		return MsAjaxTypeHelper;
	})();
	OfficeExt.MsAjaxTypeHelper=MsAjaxTypeHelper;
	var MsAjaxError=(function () {
		function MsAjaxError() {
		}
		MsAjaxError.create=function (message, errorInfo) {
			var err=new Error(message);
			err.message=message;
			if (errorInfo) {
				for (var v in errorInfo) {
					err[v]=errorInfo[v];
				}
			}
			err.popStackFrame();
			return err;
		};
		MsAjaxError.parameterCount=function (message) {
			var displayMessage="Sys.ParameterCountException: "+(message ? message : "Parameter count mismatch.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.ParameterCountException' });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argument=function (paramName, message) {
			var displayMessage="Sys.ArgumentException: "+(message ? message : "Value does not fall within the expected range.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentNull=function (paramName, message) {
			var displayMessage="Sys.ArgumentNullException: "+(message ? message : "Value cannot be null.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentOutOfRange=function (paramName, actualValue, message) {
			var displayMessage="Sys.ArgumentOutOfRangeException: "+(message ? message : "Specified argument was out of the range of valid values.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			if (typeof (actualValue) !=="undefined" && actualValue !==null) {
				displayMessage+="\n"+MsAjaxString.format("Actual value was {0}.", actualValue);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentOutOfRangeException",
				paramName: paramName,
				actualValue: actualValue
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentType=function (paramName, actualType, expectedType, message) {
			var displayMessage="Sys.ArgumentTypeException: ";
			if (message) {
				displayMessage+=message;
			}
			else if (actualType && expectedType) {
				displayMessage+=MsAjaxString.format("Object of type '{0}' cannot be converted to type '{1}'.", actualType.getName ? actualType.getName() : actualType, expectedType.getName ? expectedType.getName() : expectedType);
			}
			else {
				displayMessage+="Object cannot be converted to the required type.";
			}
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentTypeException",
				paramName: paramName,
				actualType: actualType,
				expectedType: expectedType
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentUndefined=function (paramName, message) {
			var displayMessage="Sys.ArgumentUndefinedException: "+(message ? message : "Value cannot be undefined.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.invalidOperation=function (message) {
			var displayMessage="Sys.InvalidOperationException: "+(message ? message : "Operation is not valid due to the current state of the object.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.InvalidOperationException' });
			err.popStackFrame();
			return err;
		};
		return MsAjaxError;
	})();
	OfficeExt.MsAjaxError=MsAjaxError;
	var MsAjaxString=(function () {
		function MsAjaxString() {
		}
		MsAjaxString.format=function (format) {
			var args=[];
			for (var _i=1; _i < arguments.length; _i++) {
				args[_i - 1]=arguments[_i];
			}
			var source=format;
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10);
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		};
		MsAjaxString.startsWith=function (str, prefix) {
			return (str.substr(0, prefix.length)===prefix);
		};
		return MsAjaxString;
	})();
	OfficeExt.MsAjaxString=MsAjaxString;
	var MsAjaxDebug=(function () {
		function MsAjaxDebug() {
		}
		MsAjaxDebug.trace=function (text) {
			if (typeof Debug !=="undefined" && Debug.writeln)
				Debug.writeln(text);
			if (window.console && window.console.log)
				window.console.log(text);
			if (window.opera && window.opera.postError)
				window.opera.postError(text);
			if (window.debugService && window.debugService.trace)
				window.debugService.trace(text);
			var a=document.getElementById("TraceConsole");
			if (a && a.tagName.toUpperCase()==="TEXTAREA") {
				a.innerHTML+=text+"\n";
			}
		};
		return MsAjaxDebug;
	})();
	OfficeExt.MsAjaxDebug=MsAjaxDebug;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		var registerTypeInternal=function registerTypeInternal(type, name, isClass) {
			if (type.__typeName===undefined) {
				type.__typeName=name;
			}
			if (type.__class===undefined) {
				type.__class=isClass;
			}
		};
		registerTypeInternal(Function, "Function", true);
		registerTypeInternal(Error, "Error", true);
		registerTypeInternal(Object, "Object", true);
		registerTypeInternal(String, "String", true);
		registerTypeInternal(Boolean, "Boolean", true);
		registerTypeInternal(Date, "Date", true);
		registerTypeInternal(Number, "Number", true);
		registerTypeInternal(RegExp, "RegExp", true);
		registerTypeInternal(Array, "Array", true);
		if (!Function.createCallback) {
			Function.createCallback=function Function$createCallback(method, context) {
				var e=Function._validateParams(arguments, [
					{ name: "method", type: Function },
					{ name: "context", mayBeNull: true }
				]);
				if (e)
					throw e;
				return function () {
					var l=arguments.length;
					if (l > 0) {
						var args=[];
						for (var i=0; i < l; i++) {
							args[i]=arguments[i];
						}
						args[l]=context;
						return method.apply(this, args);
					}
					return method.call(this, context);
				};
			};
		}
		if (!Function.createDelegate) {
			Function.createDelegate=function Function$createDelegate(instance, method) {
				var e=Function._validateParams(arguments, [
					{ name: "instance", mayBeNull: true },
					{ name: "method", type: Function }
				]);
				if (e)
					throw e;
				return function () {
					return method.apply(instance, arguments);
				};
			};
		}
		if (!Function._validateParams) {
			Function._validateParams=function (params, expectedParams, validateParameterCount) {
				var e, expectedLength=expectedParams.length;
				validateParameterCount=validateParameterCount || (typeof (validateParameterCount)==="undefined");
				e=Function._validateParameterCount(params, expectedParams, validateParameterCount);
				if (e) {
					e.popStackFrame();
					return e;
				}
				for (var i=0, l=params.length; i < l; i++) {
					var expectedParam=expectedParams[Math.min(i, expectedLength - 1)], paramName=expectedParam.name;
					if (expectedParam.parameterArray) {
						paramName+="["+(i - expectedLength+1)+"]";
					}
					else if (!validateParameterCount && (i >=expectedLength)) {
						break;
					}
					e=Function._validateParameter(params[i], expectedParam, paramName);
					if (e) {
						e.popStackFrame();
						return e;
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterCount) {
			Function._validateParameterCount=function (params, expectedParams, validateParameterCount) {
				var i, error, expectedLen=expectedParams.length, actualLen=params.length;
				if (actualLen < expectedLen) {
					var minParams=expectedLen;
					for (i=0; i < expectedLen; i++) {
						var param=expectedParams[i];
						if (param.optional || param.parameterArray) {
							minParams--;
						}
					}
					if (actualLen < minParams) {
						error=true;
					}
				}
				else if (validateParameterCount && (actualLen > expectedLen)) {
					error=true;
					for (i=0; i < expectedLen; i++) {
						if (expectedParams[i].parameterArray) {
							error=false;
							break;
						}
					}
				}
				if (error) {
					var e=MsAjaxError.parameterCount();
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!Function._validateParameter) {
			Function._validateParameter=function (param, expectedParam, paramName) {
				var e, expectedType=expectedParam.type, expectedInteger=!!expectedParam.integer, expectedDomElement=!!expectedParam.domElement, mayBeNull=!!expectedParam.mayBeNull;
				e=Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
				if (e) {
					e.popStackFrame();
					return e;
				}
				var expectedElementType=expectedParam.elementType, elementMayBeNull=!!expectedParam.elementMayBeNull;
				if (expectedType===Array && typeof (param) !=="undefined" && param !==null &&
					(expectedElementType || !elementMayBeNull)) {
					var expectedElementInteger=!!expectedParam.elementInteger, expectedElementDomElement=!!expectedParam.elementDomElement;
					for (var i=0; i < param.length; i++) {
						var elem=param[i];
						e=Function._validateParameterType(elem, expectedElementType, expectedElementInteger, expectedElementDomElement, elementMayBeNull, paramName+"["+i+"]");
						if (e) {
							e.popStackFrame();
							return e;
						}
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterType) {
			Function._validateParameterType=function (param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
				var e, i;
				if (typeof (param)==="undefined") {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentUndefined(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (param===null) {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentNull(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (expectedType && !OfficeExt.MsAjaxTypeHelper.isInstanceOfType(expectedType, param)) {
					e=OfficeExt.MsAjaxError.argumentType(paramName, typeof (param), expectedType);
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!window.Type) {
			window.Type=Function;
		}
		if (!Type.registerNamespace) {
			Type.registerNamespace=function (ns) {
				var namespaceParts=ns.split('.');
				var currentNamespace=window;
				for (var i=0; i < namespaceParts.length; i++) {
					currentNamespace[namespaceParts[i]]=currentNamespace[namespaceParts[i]] || {};
					currentNamespace=currentNamespace[namespaceParts[i]];
				}
			};
		}
		if (!Type.prototype.registerClass) {
			Type.prototype.registerClass=function (cls) { cls={}; };
		}
		if (typeof (Sys)==="undefined") {
			Type.registerNamespace('Sys');
		}
		if (!Error.prototype.popStackFrame) {
			Error.prototype.popStackFrame=function () {
				if (arguments.length !==0)
					throw MsAjaxError.parameterCount();
				if (typeof (this.stack)==="undefined" || this.stack===null ||
					typeof (this.fileName)==="undefined" || this.fileName===null ||
					typeof (this.lineNumber)==="undefined" || this.lineNumber===null) {
					return;
				}
				var stackFrames=this.stack.split("\n");
				var currentFrame=stackFrames[0];
				var pattern=this.fileName+":"+this.lineNumber;
				while (typeof (currentFrame) !=="undefined" &&
					currentFrame !==null &&
					currentFrame.indexOf(pattern)===-1) {
					stackFrames.shift();
					currentFrame=stackFrames[0];
				}
				var nextFrame=stackFrames[1];
				if (typeof (nextFrame)==="undefined" || nextFrame===null) {
					return;
				}
				var nextFrameParts=nextFrame.match(/@(.*):(\d+)$/);
				if (typeof (nextFrameParts)==="undefined" || nextFrameParts===null) {
					return;
				}
				this.fileName=nextFrameParts[1];
				this.lineNumber=parseInt(nextFrameParts[2]);
				stackFrames.shift();
				this.stack=stackFrames.join("\n");
			};
		}
		OsfMsAjaxFactory.msAjaxError=MsAjaxError;
		OsfMsAjaxFactory.msAjaxString=MsAjaxString;
		OsfMsAjaxFactory.msAjaxDebug=MsAjaxDebug;
	}
})(OfficeExt || (OfficeExt={}));
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Common", Microsoft.Office);
Microsoft.Office.Common.InvokeType={
	"async": 0,
	"sync": 1,
	"asyncRegisterEvent": 2,
	"asyncUnregisterEvent": 3,
	"syncRegisterEvent": 4,
	"syncUnregisterEvent": 5
};
OSF.SerializerVersion={
	MsAjax: 0,
	Browser: 1
};
var OfficeExt;
(function (OfficeExt) {
	function appSpecificCheckOriginFunction(allowed_domains, eventObj, origin, checkOriginFunction) {
		return false;
	}
	;
	OfficeExt.appSpecificCheckOrigin=appSpecificCheckOriginFunction;
})(OfficeExt || (OfficeExt={}));
Microsoft.Office.Common.InvokeType={ "async": 0,
	"sync": 1,
	"asyncRegisterEvent": 2,
	"asyncUnregisterEvent": 3,
	"syncRegisterEvent": 4,
	"syncUnregisterEvent": 5
};
Microsoft.Office.Common.InvokeResultCode={
	"noError": 0,
	"errorInRequest": -1,
	"errorHandlingRequest": -2,
	"errorInResponse": -3,
	"errorHandlingResponse": -4,
	"errorHandlingRequestAccessDenied": -5,
	"errorHandlingMethodCallTimedout": -6
};
Microsoft.Office.Common.MessageType={ "request": 0,
	"response": 1
};
Microsoft.Office.Common.ActionType={ "invoke": 0,
	"registerEvent": 1,
	"unregisterEvent": 2 };
Microsoft.Office.Common.ResponseType={ "forCalling": 0,
	"forEventing": 1
};
Microsoft.Office.Common.MethodObject=function Microsoft_Office_Common_MethodObject(method, invokeType, blockingOthers) {
	this._method=method;
	this._invokeType=invokeType;
	this._blockingOthers=blockingOthers;
};
Microsoft.Office.Common.MethodObject.prototype={
	getMethod: function Microsoft_Office_Common_MethodObject$getMethod() {
		return this._method;
	},
	getInvokeType: function Microsoft_Office_Common_MethodObject$getInvokeType() {
		return this._invokeType;
	},
	getBlockingFlag: function Microsoft_Office_Common_MethodObject$getBlockingFlag() {
		return this._blockingOthers;
	}
};
Microsoft.Office.Common.EventMethodObject=function Microsoft_Office_Common_EventMethodObject(registerMethodObject, unregisterMethodObject) {
	this._registerMethodObject=registerMethodObject;
	this._unregisterMethodObject=unregisterMethodObject;
};
Microsoft.Office.Common.EventMethodObject.prototype={
	getRegisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getRegisterMethodObject() {
		return this._registerMethodObject;
	},
	getUnregisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getUnregisterMethodObject() {
		return this._unregisterMethodObject;
	}
};
Microsoft.Office.Common.ServiceEndPoint=function Microsoft_Office_Common_ServiceEndPoint(serviceEndPointId) {
	var e=Function._validateParams(arguments, [
		{ name: "serviceEndPointId", type: String, mayBeNull: false }
	]);
	if (e)
		throw e;
	this._methodObjectList={};
	this._eventHandlerProxyList={};
	this._Id=serviceEndPointId;
	this._conversations={};
	this._policyManager=null;
	this._appDomains={};
	this._onHandleRequestError=null;
};
Microsoft.Office.Common.ServiceEndPoint.prototype={
	registerMethod: function Microsoft_Office_Common_ServiceEndPoint$registerMethod(methodName, method, invokeType, blockingOthers) {
		var e=Function._validateParams(arguments, [{ name: "methodName", type: String, mayBeNull: false },
			{ name: "method", type: Function, mayBeNull: false },
			{ name: "invokeType", type: Number, mayBeNull: false },
			{ name: "blockingOthers", type: Boolean, mayBeNull: false }
		]);
		if (e)
			throw e;
		if (invokeType !==Microsoft.Office.Common.InvokeType.async
			&& invokeType !==Microsoft.Office.Common.InvokeType.sync) {
			throw OsfMsAjaxFactory.msAjaxError.argument("invokeType");
		}
		var methodObject=new Microsoft.Office.Common.MethodObject(method, invokeType, blockingOthers);
		this._methodObjectList[methodName]=methodObject;
	},
	unregisterMethod: function Microsoft_Office_Common_ServiceEndPoint$unregisterMethod(methodName) {
		var e=Function._validateParams(arguments, [
			{ name: "methodName", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		delete this._methodObjectList[methodName];
	},
	registerEvent: function Microsoft_Office_Common_ServiceEndPoint$registerEvent(eventName, registerMethod, unregisterMethod) {
		var e=Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false }
		]);
		if (e)
			throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, Microsoft.Office.Common.InvokeType.syncRegisterEvent, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, Microsoft.Office.Common.InvokeType.syncUnregisterEvent, false));
		this._methodObjectList[eventName]=methodObject;
	},
	registerEventEx: function Microsoft_Office_Common_ServiceEndPoint$registerEventEx(eventName, registerMethod, registerMethodInvokeType, unregisterMethod, unregisterMethodInvokeType) {
		var e=Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "registerMethodInvokeType", type: Number, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethodInvokeType", type: Number, mayBeNull: false }
		]);
		if (e)
			throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, registerMethodInvokeType, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, unregisterMethodInvokeType, false));
		this._methodObjectList[eventName]=methodObject;
	},
	unregisterEvent: function (eventName) {
		var e=Function._validateParams(arguments, [
			{ name: "eventName", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		this.unregisterMethod(eventName);
	},
	registerConversation: function Microsoft_Office_Common_ServiceEndPoint$registerConversation(conversationId, conversationUrl, appDomains, serializerVersion) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false },
			{ name: "conversationUrl", type: String, mayBeNull: false, optional: true },
			{ name: "appDomains", type: Object, mayBeNull: true, optional: true },
			{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		;
		if (appDomains) {
			if (!(appDomains instanceof Array)) {
				throw OsfMsAjaxFactory.msAjaxError.argument("appDomains");
			}
			this._appDomains[conversationId]=appDomains;
		}
		this._conversations[conversationId]={ url: conversationUrl, serializerVersion: serializerVersion };
	},
	unregisterConversation: function Microsoft_Office_Common_ServiceEndPoint$unregisterConversation(conversationId) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		delete this._conversations[conversationId];
	},
	setPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$setPolicyManager(policyManager) {
		var e=Function._validateParams(arguments, [
			{ name: "policyManager", type: Object, mayBeNull: false }
		]);
		if (e)
			throw e;
		if (!policyManager.checkPermission) {
			throw OsfMsAjaxFactory.msAjaxError.argument("policyManager");
		}
		this._policyManager=policyManager;
	},
	getPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$getPolicyManager() {
		return this._policyManager;
	},
	dispose: function Microsoft_Office_Common_ServiceEndPoint$dispose() {
		this._methodObjectList=null;
		this._eventHandlerProxyList=null;
		this._Id=null;
		this._conversations=null;
		this._policyManager=null;
		this._appDomains=null;
		this._onHandleRequestError=null;
	}
};
Microsoft.Office.Common.ClientEndPoint=function Microsoft_Office_Common_ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion) {
	var e=Function._validateParams(arguments, [
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "targetWindow", mayBeNull: false },
		{ name: "targetUrl", type: String, mayBeNull: false },
		{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	try {
		if (!targetWindow.postMessage) {
			throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
		}
	}
	catch (ex) {
		if (!Object.prototype.hasOwnProperty.call(targetWindow, "postMessage")) {
			throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
		}
	}
	this._conversationId=conversationId;
	this._targetWindow=targetWindow;
	this._targetUrl=targetUrl;
	this._callingIndex=0;
	this._callbackList={};
	this._eventHandlerList={};
	if (serializerVersion !=null) {
		this._serializerVersion=serializerVersion;
	}
	else {
		this._serializerVersion=OSF.SerializerVersion.Browser;
	}
};
Microsoft.Office.Common.ClientEndPoint.prototype={
	invoke: function Microsoft_Office_Common_ClientEndPoint$invoke(targetMethodName, callback, param) {
		var e=Function._validateParams(arguments, [{ name: "targetMethodName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "param", mayBeNull: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		var callbackEntry={ "callback": callback, "createdOn": now.getTime() };
		if (param && typeof param==="object" && typeof param.__timeout__==="number") {
			callbackEntry.timeout=param.__timeout__;
			delete param.__timeout__;
		}
		this._callbackList[correlationId]=callbackEntry;
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetMethodName, Microsoft.Office.Common.ActionType.invoke, this._conversationId, correlationId, param);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null)
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	registerForEvent: function Microsoft_Office_Common_ClientEndPoint$registerForEvent(targetEventName, eventHandler, callback, data) {
		var e=Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "eventHandler", type: Function, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={ "callback": callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.registerEvent, this._conversationId, correlationId, data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
			this._eventHandlerList[targetEventName]=eventHandler;
		}
		catch (ex) {
			try {
				if (callback !==null) {
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
				}
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	unregisterForEvent: function Microsoft_Office_Common_ClientEndPoint$unregisterForEvent(targetEventName, callback, data) {
		var e=Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={ "callback": callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.unregisterEvent, this._conversationId, correlationId, data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null) {
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
				}
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
		finally {
			delete this._eventHandlerList[targetEventName];
		}
	}
};
Microsoft.Office.Common.XdmCommunicationManager=(function () {
	var _invokerQueue=[];
	var _lastMessageProcessTime=null;
	var _messageProcessingTimer=null;
	var _processInterval=10;
	var _blockingFlag=false;
	var _methodTimeoutTimer=null;
	var _methodTimeoutProcessInterval=2000;
	var _methodTimeoutDefault=65000;
	var _methodTimeout=_methodTimeoutDefault;
	var _serviceEndPoints={};
	var _clientEndPoints={};
	var _initialized=false;
	function _lookupServiceEndPoint(conversationId) {
		for (var id in _serviceEndPoints) {
			if (_serviceEndPoints[id]._conversations[conversationId]) {
				return _serviceEndPoints[id];
			}
		}
		OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
		throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
	}
	;
	function _lookupClientEndPoint(conversationId) {
		var clientEndPoint=_clientEndPoints[conversationId];
		if (!clientEndPoint) {
			OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
		}
		return clientEndPoint;
	}
	;
	function _lookupMethodObject(serviceEndPoint, messageObject) {
		var methodOrEventMethodObject=serviceEndPoint._methodObjectList[messageObject._actionName];
		if (!methodOrEventMethodObject) {
			OsfMsAjaxFactory.msAjaxDebug.trace("The specified method is not registered on service endpoint:"+messageObject._actionName);
			throw OsfMsAjaxFactory.msAjaxError.argument("messageObject");
		}
		var methodObject=null;
		if (messageObject._actionType===Microsoft.Office.Common.ActionType.invoke) {
			methodObject=methodOrEventMethodObject;
		}
		else if (messageObject._actionType===Microsoft.Office.Common.ActionType.registerEvent) {
			methodObject=methodOrEventMethodObject.getRegisterMethodObject();
		}
		else {
			methodObject=methodOrEventMethodObject.getUnregisterMethodObject();
		}
		return methodObject;
	}
	;
	function _enqueInvoker(invoker) {
		_invokerQueue.push(invoker);
	}
	;
	function _dequeInvoker() {
		if (_messageProcessingTimer !==null) {
			if (!_blockingFlag) {
				if (_invokerQueue.length > 0) {
					var invoker=_invokerQueue.shift();
					_executeCommand(invoker);
				}
				else {
					clearInterval(_messageProcessingTimer);
					_messageProcessingTimer=null;
				}
			}
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	}
	;
	function _executeCommand(invoker) {
		_blockingFlag=invoker.getInvokeBlockingFlag();
		invoker.invoke();
		_lastMessageProcessTime=(new Date()).getTime();
	}
	;
	function _checkMethodTimeout() {
		if (_methodTimeoutTimer) {
			var clientEndPoint;
			var methodCallsNotTimedout=0;
			var now=new Date();
			var timeoutValue;
			for (var conversationId in _clientEndPoints) {
				clientEndPoint=_clientEndPoints[conversationId];
				for (var correlationId in clientEndPoint._callbackList) {
					var callbackEntry=clientEndPoint._callbackList[correlationId];
					timeoutValue=callbackEntry.timeout ? callbackEntry.timeout : _methodTimeout;
					if (timeoutValue >=0 && Math.abs(now.getTime() - callbackEntry.createdOn) >=timeoutValue) {
						try {
							if (callbackEntry.callback) {
								callbackEntry.callback(Microsoft.Office.Common.InvokeResultCode.errorHandlingMethodCallTimedout, null);
							}
						}
						finally {
							delete clientEndPoint._callbackList[correlationId];
						}
					}
					else {
						methodCallsNotTimedout++;
					}
					;
				}
			}
			if (methodCallsNotTimedout===0) {
				clearInterval(_methodTimeoutTimer);
				_methodTimeoutTimer=null;
			}
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	}
	;
	function _postCallbackHandler() {
		_blockingFlag=false;
	}
	;
	function _registerListener(listener) {
		if (window.addEventListener) {
			window.addEventListener("message", listener, false);
		}
		else if ((navigator.userAgent.indexOf("MSIE") > -1) && window.attachEvent) {
			window.attachEvent("onmessage", listener);
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("Browser doesn't support the required API.");
			throw OsfMsAjaxFactory.msAjaxError.argument("Browser");
		}
	}
	;
	function _checkOrigin(url, origin) {
		var res=false;
		if (url===true) {
			return true;
		}
		if (!url || !origin || !url.length || !origin.length) {
			return res;
		}
		var url_parser, org_parser;
		url_parser=document.createElement('a');
		org_parser=document.createElement('a');
		url_parser.href=url;
		org_parser.href=origin;
		res=_urlCompare(url_parser, org_parser);
		delete url_parser, org_parser;
		return res;
	}
	function _checkOriginWithAppDomains(allowed_domains, origin) {
		var res=false;
		if (!origin || !origin.length || !(allowed_domains) || !(allowed_domains instanceof Array) || !allowed_domains.length) {
			return res;
		}
		var org_parser=document.createElement('a');
		var app_domain_parser=document.createElement('a');
		org_parser.href=origin;
		for (var i=0; i < allowed_domains.length && !res; i++) {
			if (allowed_domains[i].indexOf("://") !==-1) {
				app_domain_parser.href=allowed_domains[i];
				res=_urlCompare(org_parser, app_domain_parser);
			}
		}
		delete org_parser, app_domain_parser;
		return res;
	}
	function _urlCompare(url_parser1, url_parser2) {
		return ((url_parser1.hostname==url_parser2.hostname) &&
			(url_parser1.protocol==url_parser2.protocol) &&
			(url_parser1.port==url_parser2.port));
	}
	function _receive(e) {
		if (!OSF) {
			return;
		}
		if (e.data !='') {
			var messageObject;
			var serializerVersion=OSF.SerializerVersion.Browser;
			var serializedMessage=e.data;
			try {
				messageObject=Microsoft.Office.Common.MessagePackager.unenvelope(serializedMessage, OSF.SerializerVersion.Browser);
				serializerVersion=messageObject._serializerVersion !=null ? messageObject._serializerVersion : serializerVersion;
			}
			catch (ex) {
				return;
			}
			if (messageObject._messageType===Microsoft.Office.Common.MessageType.request) {
				var requesterUrl=(e.origin==null || e.origin=="null") ? messageObject._origin : e.origin;
				try {
					var serviceEndPoint=_lookupServiceEndPoint(messageObject._conversationId);
					;
					var conversation=serviceEndPoint._conversations[messageObject._conversationId];
					serializerVersion=conversation.serializerVersion !=null ? conversation.serializerVersion : serializerVersion;
					;
					var allowedDomains=[conversation.url].concat(serviceEndPoint._appDomains[messageObject._conversationId]);
					if (!_checkOriginWithAppDomains(allowedDomains, e.origin)) {
						if (!OfficeExt.appSpecificCheckOrigin(allowedDomains, e, messageObject._origin, _checkOriginWithAppDomains)) {
							throw "Failed origin check";
						}
					}
					var policyManager=serviceEndPoint.getPolicyManager();
					if (policyManager && !policyManager.checkPermission(messageObject._conversationId, messageObject._actionName, messageObject._data)) {
						throw "Access Denied";
					}
					var methodObject=_lookupMethodObject(serviceEndPoint, messageObject);
					var invokeCompleteCallback=new Microsoft.Office.Common.InvokeCompleteCallback(e.source, requesterUrl, messageObject._actionName, messageObject._conversationId, messageObject._correlationId, _postCallbackHandler, serializerVersion);
					var invoker=new Microsoft.Office.Common.Invoker(methodObject, messageObject._data, invokeCompleteCallback, serviceEndPoint._eventHandlerProxyList, messageObject._conversationId, messageObject._actionName, serializerVersion);
					var shouldEnque=true;
					if (_messageProcessingTimer==null) {
						if ((_lastMessageProcessTime==null || (new Date()).getTime() - _lastMessageProcessTime > _processInterval) && !_blockingFlag) {
							_executeCommand(invoker);
							shouldEnque=false;
						}
						else {
							_messageProcessingTimer=setInterval(_dequeInvoker, _processInterval);
						}
					}
					if (shouldEnque) {
						_enqueInvoker(invoker);
					}
				}
				catch (ex) {
					if (serviceEndPoint && serviceEndPoint._onHandleRequestError) {
						serviceEndPoint._onHandleRequestError(messageObject, ex);
					}
					var errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequest;
					if (ex=="Access Denied") {
						errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied;
					}
					var callResponse=new Microsoft.Office.Common.Response(messageObject._actionName, messageObject._conversationId, messageObject._correlationId, errorCode, Microsoft.Office.Common.ResponseType.forCalling, ex);
					var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(callResponse, serializerVersion);
					var canPostMessage=false;
					try {
						canPostMessage=!!(e.source && e.source.postMessage);
					}
					catch (ex) {
					}
					if (canPostMessage) {
						e.source.postMessage(envelopedResult, requesterUrl);
					}
				}
			}
			else if (messageObject._messageType===Microsoft.Office.Common.MessageType.response) {
				var clientEndPoint=_lookupClientEndPoint(messageObject._conversationId);
				if (!clientEndPoint) {
					return;
				}
				clientEndPoint._serializerVersion=serializerVersion;
				;
				if (!_checkOrigin(clientEndPoint._targetUrl, e.origin)) {
					throw "Failed orgin check";
				}
				if (messageObject._responseType===Microsoft.Office.Common.ResponseType.forCalling) {
					var callbackEntry=clientEndPoint._callbackList[messageObject._correlationId];
					if (callbackEntry) {
						try {
							if (callbackEntry.callback)
								callbackEntry.callback(messageObject._errorCode, messageObject._data);
						}
						finally {
							delete clientEndPoint._callbackList[messageObject._correlationId];
						}
					}
				}
				else {
					var eventhandler=clientEndPoint._eventHandlerList[messageObject._actionName];
					if (eventhandler !==undefined && eventhandler !==null) {
						eventhandler(messageObject._data);
					}
				}
			}
			else {
				return;
			}
		}
	}
	;
	function _initialize() {
		if (!_initialized) {
			_registerListener(_receive);
			_initialized=true;
		}
	}
	;
	return {
		connect: function Microsoft_Office_Common_XdmCommunicationManager$connect(conversationId, targetWindow, targetUrl, serializerVersion) {
			var clientEndPoint=_clientEndPoints[conversationId];
			if (!clientEndPoint) {
				_initialize();
				clientEndPoint=new Microsoft.Office.Common.ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion);
				_clientEndPoints[conversationId]=clientEndPoint;
			}
			return clientEndPoint;
		},
		getClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{ name: "conversationId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			return _clientEndPoints[conversationId];
		},
		createServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$createServiceEndPoint(serviceEndPointId) {
			_initialize();
			var serviceEndPoint=new Microsoft.Office.Common.ServiceEndPoint(serviceEndPointId);
			_serviceEndPoints[serviceEndPointId]=serviceEndPoint;
			return serviceEndPoint;
		},
		getServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getServiceEndPoint(serviceEndPointId) {
			var e=Function._validateParams(arguments, [
				{ name: "serviceEndPointId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			return _serviceEndPoints[serviceEndPointId];
		},
		deleteClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$deleteClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{ name: "conversationId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			delete _clientEndPoints[conversationId];
		},
		deleteServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$deleteServiceEndPoint(serviceEndPointId) {
			var e=Function._validateParams(arguments, [
				{ name: "serviceEndPointId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			delete _serviceEndPoints[serviceEndPointId];
		},
		checkUrlWithAppDomains: function Microsoft_Office_Common_XdmCommunicationManager$_checkUrlWithAppDomains(appDomains, origin) {
			return _checkOriginWithAppDomains(appDomains, origin);
		},
		_setMethodTimeout: function Microsoft_Office_Common_XdmCommunicationManager$_setMethodTimeout(methodTimeout) {
			var e=Function._validateParams(arguments, [
				{ name: "methodTimeout", type: Number, mayBeNull: false }
			]);
			if (e)
				throw e;
			_methodTimeout=(methodTimeout <=0) ? _methodTimeoutDefault : methodTimeout;
		},
		_startMethodTimeoutTimer: function Microsoft_Office_Common_XdmCommunicationManager$_startMethodTimeoutTimer() {
			if (!_methodTimeoutTimer) {
				_methodTimeoutTimer=setInterval(_checkMethodTimeout, _methodTimeoutProcessInterval);
			}
		}
	};
})();
Microsoft.Office.Common.Message=function Microsoft_Office_Common_Message(messageType, actionName, conversationId, correlationId, data) {
	var e=Function._validateParams(arguments, [{ name: "messageType", type: Number, mayBeNull: false },
		{ name: "actionName", type: String, mayBeNull: false },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "correlationId", mayBeNull: false },
		{ name: "data", mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._messageType=messageType;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._origin=window.location.href;
	if (typeof data=="undefined") {
		this._data=null;
	}
	else {
		this._data=data;
	}
};
Microsoft.Office.Common.Message.prototype={
	getActionName: function Microsoft_Office_Common_Message$getActionName() {
		return this._actionName;
	},
	getConversationId: function Microsoft_Office_Common_Message$getConversationId() {
		return this._conversationId;
	},
	getCorrelationId: function Microsoft_Office_Common_Message$getCorrelationId() {
		return this._correlationId;
	},
	getOrigin: function Microsoft_Office_Common_Message$getOrigin() {
		return this._origin;
	},
	getData: function Microsoft_Office_Common_Message$getData() {
		return this._data;
	},
	getMessageType: function Microsoft_Office_Common_Message$getMessageType() {
		return this._messageType;
	}
};
Microsoft.Office.Common.Request=function Microsoft_Office_Common_Request(actionName, actionType, conversationId, correlationId, data) {
	Microsoft.Office.Common.Request.uber.constructor.call(this, Microsoft.Office.Common.MessageType.request, actionName, conversationId, correlationId, data);
	this._actionType=actionType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Request, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Request.prototype.getActionType=function Microsoft_Office_Common_Request$getActionType() {
	return this._actionType;
};
Microsoft.Office.Common.Response=function Microsoft_Office_Common_Response(actionName, conversationId, correlationId, errorCode, responseType, data) {
	Microsoft.Office.Common.Response.uber.constructor.call(this, Microsoft.Office.Common.MessageType.response, actionName, conversationId, correlationId, data);
	this._errorCode=errorCode;
	this._responseType=responseType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Response, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Response.prototype.getErrorCode=function Microsoft_Office_Common_Response$getErrorCode() {
	return this._errorCode;
};
Microsoft.Office.Common.Response.prototype.getResponseType=function Microsoft_Office_Common_Response$getResponseType() {
	return this._responseType;
};
Microsoft.Office.Common.MessagePackager={
	envelope: function Microsoft_Office_Common_MessagePackager$envelope(messageObject, serializerVersion) {
		if (typeof (messageObject)==="object") {
			messageObject._serializerVersion=OSF.SerializerVersion.Browser;
		}
		return JSON.stringify(messageObject);
	},
	unenvelope: function Microsoft_Office_Common_MessagePackager$unenvelope(messageObject, serializerVersion) {
		return JSON.parse(messageObject);
	}
};
Microsoft.Office.Common.ResponseSender=function Microsoft_Office_Common_ResponseSender(requesterWindow, requesterUrl, actionName, conversationId, correlationId, responseType, serializerVersion) {
	var e=Function._validateParams(arguments, [{ name: "requesterWindow", mayBeNull: false },
		{ name: "requesterUrl", type: String, mayBeNull: false },
		{ name: "actionName", type: String, mayBeNull: false },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "correlationId", mayBeNull: false },
		{ name: "responsetype", type: Number, maybeNull: false },
		{ name: "serializerVersion", type: Number, maybeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._requesterWindow=requesterWindow;
	this._requesterUrl=requesterUrl;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._invokeResultCode=Microsoft.Office.Common.InvokeResultCode.noError;
	this._responseType=responseType;
	var me=this;
	this._send=function (result) {
		try {
			var response=new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
			var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
			me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
			;
		}
		catch (ex) {
			OsfMsAjaxFactory.msAjaxDebug.trace("ResponseSender._send error:"+ex.message);
		}
	};
};
Microsoft.Office.Common.ResponseSender.prototype={
	getRequesterWindow: function Microsoft_Office_Common_ResponseSender$getRequesterWindow() {
		return this._requesterWindow;
	},
	getRequesterUrl: function Microsoft_Office_Common_ResponseSender$getRequesterUrl() {
		return this._requesterUrl;
	},
	getActionName: function Microsoft_Office_Common_ResponseSender$getActionName() {
		return this._actionName;
	},
	getConversationId: function Microsoft_Office_Common_ResponseSender$getConversationId() {
		return this._conversationId;
	},
	getCorrelationId: function Microsoft_Office_Common_ResponseSender$getCorrelationId() {
		return this._correlationId;
	},
	getSend: function Microsoft_Office_Common_ResponseSender$getSend() {
		return this._send;
	},
	setResultCode: function Microsoft_Office_Common_ResponseSender$setResultCode(resultCode) {
		this._invokeResultCode=resultCode;
	}
};
Microsoft.Office.Common.InvokeCompleteCallback=function Microsoft_Office_Common_InvokeCompleteCallback(requesterWindow, requesterUrl, actionName, conversationId, correlationId, postCallbackHandler, serializerVersion) {
	Microsoft.Office.Common.InvokeCompleteCallback.uber.constructor.call(this, requesterWindow, requesterUrl, actionName, conversationId, correlationId, Microsoft.Office.Common.ResponseType.forCalling, serializerVersion);
	this._postCallbackHandler=postCallbackHandler;
	var me=this;
	this._send=function (result, responseCode) {
		if (responseCode !=undefined) {
			me._invokeResultCode=responseCode;
		}
		try {
			var response=new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
			var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
			me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
			me._postCallbackHandler();
		}
		catch (ex) {
			OsfMsAjaxFactory.msAjaxDebug.trace("InvokeCompleteCallback._send error:"+ex.message);
		}
	};
};
OSF.OUtil.extend(Microsoft.Office.Common.InvokeCompleteCallback, Microsoft.Office.Common.ResponseSender);
Microsoft.Office.Common.Invoker=function Microsoft_Office_Common_Invoker(methodObject, paramValue, invokeCompleteCallback, eventHandlerProxyList, conversationId, eventName, serializerVersion) {
	var e=Function._validateParams(arguments, [
		{ name: "methodObject", mayBeNull: false },
		{ name: "paramValue", mayBeNull: true },
		{ name: "invokeCompleteCallback", mayBeNull: false },
		{ name: "eventHandlerProxyList", mayBeNull: true },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "eventName", type: String, mayBeNull: false },
		{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._methodObject=methodObject;
	this._param=paramValue;
	this._invokeCompleteCallback=invokeCompleteCallback;
	this._eventHandlerProxyList=eventHandlerProxyList;
	this._conversationId=conversationId;
	this._eventName=eventName;
	this._serializerVersion=serializerVersion;
};
Microsoft.Office.Common.Invoker.prototype={
	invoke: function Microsoft_Office_Common_Invoker$invoke() {
		try {
			var result;
			switch (this._methodObject.getInvokeType()) {
				case Microsoft.Office.Common.InvokeType.async:
					this._methodObject.getMethod()(this._param, this._invokeCompleteCallback.getSend());
					break;
				case Microsoft.Office.Common.InvokeType.sync:
					result=this._methodObject.getMethod()(this._param);
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncRegisterEvent:
					var eventHandlerProxy=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					result=this._methodObject.getMethod()(eventHandlerProxy.getSend(), this._param);
					this._eventHandlerProxyList[this._conversationId+this._eventName]=eventHandlerProxy.getSend();
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncUnregisterEvent:
					var eventHandler=this._eventHandlerProxyList[this._conversationId+this._eventName];
					result=this._methodObject.getMethod()(eventHandler, this._param);
					delete this._eventHandlerProxyList[this._conversationId+this._eventName];
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.asyncRegisterEvent:
					var eventHandlerProxyAsync=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					this._methodObject.getMethod()(eventHandlerProxyAsync.getSend(), this._invokeCompleteCallback.getSend(), this._param);
					this._eventHandlerProxyList[this._callerId+this._eventName]=eventHandlerProxyAsync.getSend();
					break;
				case Microsoft.Office.Common.InvokeType.asyncUnregisterEvent:
					var eventHandlerAsync=this._eventHandlerProxyList[this._callerId+this._eventName];
					this._methodObject.getMethod()(eventHandlerAsync, this._invokeCompleteCallback.getSend(), this._param);
					delete this._eventHandlerProxyList[this._callerId+this._eventName];
					break;
				default:
					break;
			}
		}
		catch (ex) {
			this._invokeCompleteCallback.setResultCode(Microsoft.Office.Common.InvokeResultCode.errorInResponse);
			this._invokeCompleteCallback.getSend()(ex);
		}
	},
	getInvokeBlockingFlag: function Microsoft_Office_Common_Invoker$getInvokeBlockingFlag() {
		return this._methodObject.getBlockingFlag();
	},
	_createEventHandlerProxyObject: function Microsoft_Office_Common_Invoker$_createEventHandlerProxyObject(invokeCompleteObject) {
		return new Microsoft.Office.Common.ResponseSender(invokeCompleteObject.getRequesterWindow(), invokeCompleteObject.getRequesterUrl(), invokeCompleteObject.getActionName(), invokeCompleteObject.getConversationId(), invokeCompleteObject.getCorrelationId(), Microsoft.Office.Common.ResponseType.forEventing, this._serializerVersion);
	}
};
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.DDA.WAC.UniqueArguments={
	Data: "Data",
	Properties: "Properties",
	BindingRequest: "DdaBindingsMethod",
	BindingResponse: "Bindings",
	SingleBindingResponse: "singleBindingResponse",
	GetData: "DdaGetBindingData",
	AddRowsColumns: "DdaAddRowsColumns",
	SetData: "DdaSetBindingData",
	ClearFormats: "DdaClearBindingFormats",
	SetFormats: "DdaSetBindingFormats",
	SettingsRequest: "DdaSettingsMethod",
	BindingEventSource: "ddaBinding",
	ArrayData: "ArrayData"
};
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.Delegate.SpecialProcessor=function OSF_DDA_WAC_Delegate_SpecialProcessor() {
	var complexTypes=[
		OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
		OSF.DDA.WAC.UniqueArguments.BindingRequest,
		OSF.DDA.WAC.UniqueArguments.BindingResponse,
		OSF.DDA.WAC.UniqueArguments.GetData,
		OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
		OSF.DDA.WAC.UniqueArguments.SetData,
		OSF.DDA.WAC.UniqueArguments.ClearFormats,
		OSF.DDA.WAC.UniqueArguments.SetFormats,
		OSF.DDA.WAC.UniqueArguments.SettingsRequest,
		OSF.DDA.WAC.UniqueArguments.BindingEventSource
	];
	var dynamicTypes={};
	OSF.DDA.WAC.Delegate.SpecialProcessor.uber.constructor.call(this, complexTypes, dynamicTypes);
};
OSF.OUtil.extend(OSF.DDA.WAC.Delegate.SpecialProcessor, OSF.DDA.SpecialProcessor);
OSF.DDA.WAC.Delegate.ParameterMap=OSF.DDA.getDecoratedParameterMap(new OSF.DDA.WAC.Delegate.SpecialProcessor(), []);
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.getDelegateMethods=function OSF_DDA_WAC_getDelegateMethods() {
	var delegateMethods={};
	delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.WAC.Delegate.executeAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync]=OSF.DDA.WAC.Delegate.registerEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync]=OSF.DDA.WAC.Delegate.unregisterEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog]=OSF.DDA.WAC.Delegate.openDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent]=OSF.DDA.WAC.Delegate.messageParent;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.SendMessage]=OSF.DDA.WAC.Delegate.sendMessage;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog]=OSF.DDA.WAC.Delegate.closeDialog;
	return delegateMethods;
};
OSF.DDA.WAC.Delegate.version=1;
OSF.DDA.WAC.Delegate.executeAsync=function OSF_DDA_WAC_Delegate$executeAsync(args) {
	if (!args.hostCallArgs) {
		args.hostCallArgs={};
	}
	args.hostCallArgs["DdaMethod"]={
		"ControlId": OSF._OfficeAppFactory.getId(),
		"Version": OSF.DDA.WAC.Delegate.version,
		"DispatchId": args.dispId
	};
	args.hostCallArgs["__timeout__"]=-1;
	if (args.onCalling) {
		args.onCalling();
	}
	if (!OSF.getClientEndPoint()) {
		return;
	}
	OSF.getClientEndPoint().invoke("executeMethod", function OSF_DDA_WAC_Delegate$OMFacade$OnResponse(xdmStatus, payload) {
		if (args.onReceiving) {
			args.onReceiving();
		}
		var error;
		if (xdmStatus==Microsoft.Office.Common.InvokeResultCode.noError) {
			OSF.DDA.WAC.Delegate.version=payload["Version"];
			error=payload["Error"];
		}
		else {
			switch (xdmStatus) {
				case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
					error=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
					break;
				default:
					error=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					break;
			}
		}
		if (args.onComplete) {
			args.onComplete(error, payload);
		}
	}, args.hostCallArgs);
};
OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent=function OSF_DDA_WAC_Delegate$GetOnAfterRegisterEvent(register, args) {
	var startTime=(new Date()).getTime();
	return function OSF_DDA_WAC_Delegate$OnAfterRegisterEvent(xdmStatus, payload) {
		if (args.onReceiving) {
			args.onReceiving();
		}
		var status;
		if (xdmStatus !=Microsoft.Office.Common.InvokeResultCode.noError) {
			switch (xdmStatus) {
				case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
					break;
				default:
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					break;
			}
		}
		else {
			if (payload) {
				if (payload["Error"]) {
					status=payload["Error"];
				}
				else {
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
				}
			}
			else {
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			}
		}
		if (args.onComplete) {
			args.onComplete(status);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onRegisterDone(register, args.dispId, Math.abs((new Date()).getTime() - startTime), status);
		}
	};
};
OSF.DDA.WAC.Delegate.registerEventAsync=function OSF_DDA_WAC_Delegate$RegisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	if (!OSF.getClientEndPoint()) {
		return;
	}
	OSF.getClientEndPoint().registerForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), function OSF_DDA_WACOMFacade$OnEvent(payload) {
		if (args.onEvent) {
			args.onEvent(payload);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onEventDone(args.dispId);
		}
	}, OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args), {
		"controlId": OSF._OfficeAppFactory.getId(),
		"eventDispId": args.dispId,
		"targetId": args.targetId
	});
};
OSF.DDA.WAC.Delegate.unregisterEventAsync=function OSF_DDA_WAC_Delegate$UnregisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	if (!OSF.getClientEndPoint()) {
		return;
	}
	OSF.getClientEndPoint().unregisterForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args), {
		"controlId": OSF._OfficeAppFactory.getId(),
		"eventDispId": args.dispId,
		"targetId": args.targetId
	});
};
OSF.OUtil.setNamespace("WebApp", OSF);
OSF.WebApp.AddHostInfoAndXdmInfo=function OSF_WebApp$AddHostInfoAndXdmInfo(url) {
	if (OSF._OfficeAppFactory.getWindowLocationSearch && OSF._OfficeAppFactory.getWindowLocationHash) {
		return url+OSF._OfficeAppFactory.getWindowLocationSearch()+OSF._OfficeAppFactory.getWindowLocationHash();
	}
	else {
		return url;
	}
};
OSF.WebApp._UpdateLinksForHostAndXdmInfo=function OSF_WebApp$_UpdateLinksForHostAndXdmInfo() {
	var links=document.querySelectorAll("a[data-officejs-navigate]");
	for (var i=0; i < links.length; i++) {
		if (OSF.WebApp._isGoodUrl(links[i].href)) {
			links[i].href=OSF.WebApp.AddHostInfoAndXdmInfo(links[i].href);
		}
	}
	var forms=document.querySelectorAll("form[data-officejs-navigate]");
	for (var i=0; i < forms.length; i++) {
		var form=forms[i];
		if (OSF.WebApp._isGoodUrl(form.action)) {
			form.action=OSF.WebApp.AddHostInfoAndXdmInfo(form.action);
		}
	}
};
OSF.WebApp._isGoodUrl=function OSF_WebApp$_isGoodUrl(url) {
	if (typeof url=='undefined')
		return false;
	url=url.trim();
	var colonIndex=url.indexOf(':');
	var protocol=colonIndex > 0 ? url.substr(0, colonIndex) : null;
	var goodUrl=protocol !==null ? protocol.toLowerCase()==="http" || protocol.toLowerCase()==="https" : true;
	goodUrl=goodUrl && url !="#" && url !="/" && url !="" && url !=OSF._OfficeAppFactory.getWebAppState().webAppUrl;
	return goodUrl;
};
OSF.InitializationHelper=function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
	this._hostInfo=hostInfo;
	this._webAppState=webAppState;
	this._context=context;
	this._settings=settings;
	this._hostFacade=hostFacade;
	this._appContext={};
	this._tabbableElements="a[href]:not([tabindex='-1']),"+"area[href]:not([tabindex='-1']),"+"button:not([disabled]):not([tabindex='-1']),"+"input:not([disabled]):not([tabindex='-1']),"+"select:not([disabled]):not([tabindex='-1']),"+"textarea:not([disabled]):not([tabindex='-1']),"+"*[tabindex]:not([tabindex='-1']),"+"*[contenteditable]:not([disabled]):not([tabindex='-1'])";
	this._initializeSettings=function OSF_InitializationHelper$initializeSettings(appContext, refreshSupported) {
		var settings;
		var serializedSettings=appContext.get_settings();
		var osfSessionStorage=OSF.OUtil.getSessionStorage();
		if (osfSessionStorage) {
			var storageSettings=osfSessionStorage.getItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey());
			if (storageSettings) {
				serializedSettings=JSON.parse(storageSettings);
			}
			else {
				storageSettings=JSON.stringify(serializedSettings);
				osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
			}
		}
		var deserializedSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		if (refreshSupported) {
			settings=new OSF.DDA.RefreshableSettings(deserializedSettings);
		}
		else {
			settings=new OSF.DDA.Settings(deserializedSettings);
		}
		return settings;
	};
	var windowOpen=function OSF_InitializationHelper$windowOpen(windowObj) {
		var proxy=window.open;
		windowObj.open=function (strUrl, strWindowName, strWindowFeatures) {
			var windowObject=null;
			try {
				windowObject=proxy(strUrl, strWindowName, strWindowFeatures);
			}
			catch (ex) {
				if (OSF.AppTelemetry) {
					OSF.AppTelemetry.logAppCommonMessage("Exception happens at windowOpen."+ex);
				}
			}
			if (!windowObject) {
				var params={
					"strUrl": strUrl,
					"strWindowName": strWindowName,
					"strWindowFeatures": strWindowFeatures
				};
				if (OSF._OfficeAppFactory.getClientEndPoint()) {
					OSF._OfficeAppFactory.getClientEndPoint().invoke("ContextActivationManager_openWindowInHost", null, params);
				}
			}
			return windowObject;
		};
	};
	windowOpen(window);
};
OSF.InitializationHelper.prototype.saveAndSetDialogInfo=function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue) {
	var getAppIdFromWindowLocation=function OSF_InitializationHelper$getAppIdFromWindowLocation() {
		var xdmInfoValue=OSF.OUtil.parseXdmInfo(true);
		if (xdmInfoValue) {
			var items=xdmInfoValue.split("|");
			return items[1];
		}
		return null;
	};
	var osfSessionStorage=OSF.OUtil.getSessionStorage();
	if (osfSessionStorage) {
		if (!hostInfoValue) {
			hostInfoValue=OSF.OUtil.parseHostInfoFromWindowName(true, OSF._OfficeAppFactory.getWindowName());
		}
		if (hostInfoValue && hostInfoValue.indexOf("isDialog") > -1) {
			var appId=getAppIdFromWindowLocation();
			if (appId !=null) {
				osfSessionStorage.setItem(appId+"IsDialog", "true");
			}
			this._hostInfo.isDialog=true;
			return;
		}
		this._hostInfo.isDialog=osfSessionStorage.getItem(OSF.OUtil.getXdmFieldValue(OSF.XdmFieldName.AppId, false)+"IsDialog") !=null ? true : false;
	}
};
OSF.InitializationHelper.prototype.getAppContext=function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
	var me=this;
	var getInvocationCallbackWebApp=function OSF_InitializationHelper_getAppContextAsync$getInvocationCallbackWebApp(errorCode, appContext) {
		var settings;
		if (appContext._appName===OSF.AppName.ExcelWebApp) {
			var serializedSettings=appContext._settings;
			settings={};
			for (var index in serializedSettings) {
				var setting=serializedSettings[index];
				settings[setting[0]]=setting[1];
			}
		}
		else {
			settings=appContext._settings;
		}
		if (errorCode===0 && appContext._id !=undefined && appContext._appName !=undefined && appContext._appVersion !=undefined && appContext._appUILocale !=undefined && appContext._dataLocale !=undefined &&
			appContext._docUrl !=undefined && appContext._clientMode !=undefined && appContext._settings !=undefined && appContext._reason !=undefined) {
			me._appContext=appContext;
			var appInstanceId=(appContext._appInstanceId ? appContext._appInstanceId : appContext._id);
			var touchEnabled=false;
			var commerceAllowed=true;
			var minorVersion=0;
			if (appContext._appMinorVersion !=undefined) {
				minorVersion=appContext._appMinorVersion;
			}
			var requirementMatrix=undefined;
			if (appContext._requirementMatrix !=undefined) {
				requirementMatrix=appContext._requirementMatrix;
			}
			appContext.eToken=appContext.eToken ? appContext.eToken : "";
			var returnedContext=new OSF.OfficeAppContext(appContext._id, appContext._appName, appContext._appVersion, appContext._appUILocale, appContext._dataLocale, appContext._docUrl, appContext._clientMode, settings, appContext._reason, appContext._osfControlType, appContext._eToken, appContext._correlationId, appInstanceId, touchEnabled, commerceAllowed, minorVersion, requirementMatrix, appContext._hostCustomMessage, appContext._hostFullVersion, appContext._clientWindowHeight, appContext._clientWindowWidth, appContext._addinName, appContext._appDomains, appContext._dialogRequirementMatrix);
			returnedContext._wacHostEnvironment=appContext._wacHostEnvironment || "0";
			returnedContext._isFromWacAutomation=!!appContext._isFromWacAutomation;
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.initialize(returnedContext);
			}
			gotAppContext(returnedContext);
		}
		else {
			var errorMsg="Function ContextActivationManager_getAppContextAsync call failed. ErrorCode is "+errorCode+", exception: "+appContext;
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.logAppException(errorMsg);
			}
			throw errorMsg;
		}
	};
	try {
		if (this._hostInfo.isDialog && window.opener !=null) {
			var appContext=OfficeExt.WACUtils.parseAppContextFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
			getInvocationCallbackWebApp(0, appContext);
		}
		else {
			this._webAppState.clientEndPoint.invoke("ContextActivationManager_getAppContextAsync", getInvocationCallbackWebApp, this._webAppState.id);
		}
	}
	catch (ex) {
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.logAppException("Exception thrown when trying to invoke getAppContextAsync. Exception:["+ex+"]");
		}
		throw ex;
	}
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication=function OSF_InitializationHelper$setAgaveHostCommunication() {
	try {
		var me=this;
		var xdmInfoValue=OSF.OUtil.parseXdmInfoWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
		if (!xdmInfoValue && OSF._OfficeAppFactory.getWindowName) {
			xdmInfoValue=OSF.OUtil.parseXdmInfoFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
		}
		if (xdmInfoValue) {
			var xdmItems=OSF.OUtil.getInfoItems(xdmInfoValue);
			if (xdmItems !=undefined && xdmItems.length >=3) {
				me._webAppState.conversationID=xdmItems[0];
				me._webAppState.id=xdmItems[1];
				me._webAppState.webAppUrl=xdmItems[2].indexOf(":") >=0 ? xdmItems[2] : decodeURIComponent(xdmItems[2]);
			}
		}
		me._webAppState.wnd=window.opener !=null ? window.opener : window.parent;
		var serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
		if (isNaN(serializerVersion) && OSF._OfficeAppFactory.getWindowName) {
			serializerVersion=OSF.OUtil.parseSerializerVersionFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
		}
		me._webAppState.serializerVersion=serializerVersion;
		if (this._hostInfo.isDialog && window.opener !=null) {
			return;
		}
		me._webAppState.clientEndPoint=Microsoft.Office.Common.XdmCommunicationManager.connect(me._webAppState.conversationID, me._webAppState.wnd, me._webAppState.webAppUrl, me._webAppState.serializerVersion);
		me._webAppState.serviceEndPoint=Microsoft.Office.Common.XdmCommunicationManager.createServiceEndPoint(me._webAppState.id);
		var notificationConversationId=me._webAppState.conversationID+OSF.SharedConstants.NotificationConversationIdSuffix;
		me._webAppState.serviceEndPoint.registerConversation(notificationConversationId, me._webAppState.webAppUrl);
		var notifyAgave=function OSF__OfficeAppFactory_initialize$notifyAgave(actionId) {
			switch (actionId) {
				case OSF.AgaveHostAction.Select:
					me._webAppState.focused=true;
					break;
				case OSF.AgaveHostAction.UnSelect:
					me._webAppState.focused=false;
					break;
				case OSF.AgaveHostAction.TabIn:
				case OSF.AgaveHostAction.CtrlF6In:
					window.focus();
					var list=document.querySelectorAll(me._tabbableElements);
					var focused=OSF.OUtil.focusToFirstTabbable(list, false);
					if (!focused) {
						window.blur();
						me._webAppState.focused=false;
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusable]);
					}
					break;
				case OSF.AgaveHostAction.TabInShift:
					window.focus();
					var list=document.querySelectorAll(me._tabbableElements);
					var focused=OSF.OUtil.focusToFirstTabbable(list, true);
					if (!focused) {
						window.blur();
						me._webAppState.focused=false;
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusableShift]);
					}
					break;
				default:
					OsfMsAjaxFactory.msAjaxDebug.trace("actionId "+actionId+" notifyAgave is wrong.");
					break;
			}
		};
		me._webAppState.serviceEndPoint.registerMethod("Office_notifyAgave", notifyAgave, Microsoft.Office.Common.InvokeType.async, false);
		me.addOrRemoveEventListenersForWindow(true);
	}
	catch (ex) {
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.logAppException("Exception thrown in setAgaveHostCommunication. Exception:["+ex+"]");
		}
		throw ex;
	}
};
OSF.InitializationHelper.prototype.addOrRemoveEventListenersForWindow=function OSF_InitializationHelper$addOrRemoveEventListenersForWindow(isAdd) {
	var me=this;
	var onWindowFocus=function () {
		if (!me._webAppState.focused) {
			me._webAppState.focused=true;
		}
		me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.Select]);
	};
	var onWindowBlur=function () {
		if (!OSF) {
			return;
		}
		if (me._webAppState.focused) {
			me._webAppState.focused=false;
		}
		me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.UnSelect]);
	};
	var onWindowKeydown=function (e) {
		e.preventDefault=e.preventDefault || function () {
			e.returnValue=false;
		};
		if (e.keyCode==117 && (e.ctrlKey || e.metaKey)) {
			var actionId=OSF.AgaveHostAction.CtrlF6Exit;
			if (e.shiftKey) {
				actionId=OSF.AgaveHostAction.CtrlF6ExitShift;
			}
			me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, actionId]);
		}
		else if (e.keyCode==9) {
			e.preventDefault();
			var allTabbableElements=document.querySelectorAll(me._tabbableElements);
			var focused=OSF.OUtil.focusToNextTabbable(allTabbableElements, e.target || e.srcElement, e.shiftKey);
			if (!focused) {
				if (me._hostInfo.isDialog) {
					OSF.OUtil.focusToFirstTabbable(allTabbableElements, e.shiftKey);
				}
				else {
					if (e.shiftKey) {
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExitShift]);
					}
					else {
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExit]);
					}
				}
			}
		}
		else if (e.keyCode==27) {
			e.preventDefault();
			me.dismissDialogNotification && me.dismissDialogNotification();
			me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.EscExit]);
		}
		else if (e.keyCode==113) {
			e.preventDefault();
			me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.F2Exit]);
		}
	};
	var onWindowKeypress=function (e) {
		if (e.keyCode==117 && e.ctrlKey) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			else {
				e.returnValue=false;
			}
		}
	};
	if (isAdd) {
		OSF.OUtil.addEventListener(window, "focus", onWindowFocus);
		OSF.OUtil.addEventListener(window, "blur", onWindowBlur);
		OSF.OUtil.addEventListener(window, "keydown", onWindowKeydown);
		OSF.OUtil.addEventListener(window, "keypress", onWindowKeypress);
	}
	else {
		OSF.OUtil.removeEventListener(window, "focus", onWindowFocus);
		OSF.OUtil.removeEventListener(window, "blur", onWindowBlur);
		OSF.OUtil.removeEventListener(window, "keydown", onWindowKeydown);
		OSF.OUtil.removeEventListener(window, "keypress", onWindowKeypress);
	}
};
OSF.InitializationHelper.prototype.initWebDialog=function OSF_InitializationHelper$initWebDialog(appContext) {
	if (appContext.get_isDialog()) {
		if (OSF.DDA.UI.ChildUI) {
			var isPopupWindow=(window.opener !=null);
			appContext.ui=new OSF.DDA.UI.ChildUI(isPopupWindow);
			if (isPopupWindow) {
				this.registerMessageReceivedEventForWindowDialog && this.registerMessageReceivedEventForWindowDialog();
			}
		}
	}
	else {
		if (OSF.DDA.UI.ParentUI) {
			appContext.ui=new OSF.DDA.UI.ParentUI();
			if (OfficeExt.Container) {
				OSF.DDA.DispIdHost.addAsyncMethods(appContext.ui, [OSF.DDA.AsyncMethodNames.CloseContainerAsync]);
			}
		}
	}
};
OSF.InitializationHelper.prototype.initWebAuth=function OSF_InitializationHelper$initWebAuth(appContext) {
	if (OSF.DDA.Auth) {
		appContext.auth=new OSF.DDA.Auth();
		OSF.DDA.DispIdHost.addAsyncMethods(appContext.auth, [OSF.DDA.AsyncMethodNames.GetAccessTokenAsync]);
	}
};
OSF.getClientEndPoint=function OSF$getClientEndPoint() {
	var initializationHelper=OSF._OfficeAppFactory.getInitializationHelper();
	return initializationHelper._webAppState.clientEndPoint;
};
OSF.InitializationHelper.prototype.prepareRightAfterWebExtensionInitialize=function OSF_InitializationHelper$prepareRightAfterWebExtensionInitialize() {
	if (this._hostInfo.isDialog) {
		window.focus();
		var list=document.querySelectorAll(this._tabbableElements);
		var focused=OSF.OUtil.focusToFirstTabbable(list, false);
		if (!focused) {
			window.blur();
			this._webAppState.focused=false;
			if (this._webAppState.clientEndPoint) {
				this._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [this._webAppState.id, OSF.AgaveHostAction.ExitNoFocusable]);
			}
		}
	}
};
OSF.CommonUI={
	HostButtonBorderColor: "#86bfa0",
	HostButtonBackgroundColor: "#d3f0e0"
};
var OSFLog;
(function (OSFLog) {
	var BaseUsageData=(function () {
		function BaseUsageData(table) {
			this._table=table;
			this._fields={};
		}
		Object.defineProperty(BaseUsageData.prototype, "Fields", {
			get: function () {
				return this._fields;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BaseUsageData.prototype, "Table", {
			get: function () {
				return this._table;
			},
			enumerable: true,
			configurable: true
		});
		BaseUsageData.prototype.SerializeFields=function () {
		};
		BaseUsageData.prototype.SetSerializedField=function (key, value) {
			if (typeof (value) !=="undefined" && value !==null) {
				this._serializedFields[key]=value.toString();
			}
		};
		BaseUsageData.prototype.SerializeRow=function () {
			this._serializedFields={};
			this.SetSerializedField("Table", this._table);
			this.SerializeFields();
			return JSON.stringify(this._serializedFields);
		};
		return BaseUsageData;
	})();
	OSFLog.BaseUsageData=BaseUsageData;
	var AppActivatedUsageData=(function (_super) {
		__extends(AppActivatedUsageData, _super);
		function AppActivatedUsageData() {
			_super.call(this, "AppActivated");
		}
		Object.defineProperty(AppActivatedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppId", {
			get: function () { return this.Fields["AppId"]; },
			set: function (value) { this.Fields["AppId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppInstanceId", {
			get: function () { return this.Fields["AppInstanceId"]; },
			set: function (value) { this.Fields["AppInstanceId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppURL", {
			get: function () { return this.Fields["AppURL"]; },
			set: function (value) { this.Fields["AppURL"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AssetId", {
			get: function () { return this.Fields["AssetId"]; },
			set: function (value) { this.Fields["AssetId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Browser", {
			get: function () { return this.Fields["Browser"]; },
			set: function (value) { this.Fields["Browser"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "UserId", {
			get: function () { return this.Fields["UserId"]; },
			set: function (value) { this.Fields["UserId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Host", {
			get: function () { return this.Fields["Host"]; },
			set: function (value) { this.Fields["Host"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostVersion", {
			get: function () { return this.Fields["HostVersion"]; },
			set: function (value) { this.Fields["HostVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "ClientId", {
			get: function () { return this.Fields["ClientId"]; },
			set: function (value) { this.Fields["ClientId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeWidth", {
			get: function () { return this.Fields["AppSizeWidth"]; },
			set: function (value) { this.Fields["AppSizeWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeHeight", {
			get: function () { return this.Fields["AppSizeHeight"]; },
			set: function (value) { this.Fields["AppSizeHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "DocUrl", {
			get: function () { return this.Fields["DocUrl"]; },
			set: function (value) { this.Fields["DocUrl"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "OfficeJSVersion", {
			get: function () { return this.Fields["OfficeJSVersion"]; },
			set: function (value) { this.Fields["OfficeJSVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostJSVersion", {
			get: function () { return this.Fields["HostJSVersion"]; },
			set: function (value) { this.Fields["HostJSVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "WacHostEnvironment", {
			get: function () { return this.Fields["WacHostEnvironment"]; },
			set: function (value) { this.Fields["WacHostEnvironment"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "IsFromWacAutomation", {
			get: function () { return this.Fields["IsFromWacAutomation"]; },
			set: function (value) { this.Fields["IsFromWacAutomation"]=value; },
			enumerable: true,
			configurable: true
		});
		AppActivatedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("AppId", this.AppId);
			this.SetSerializedField("AppInstanceId", this.AppInstanceId);
			this.SetSerializedField("AppURL", this.AppURL);
			this.SetSerializedField("AssetId", this.AssetId);
			this.SetSerializedField("Browser", this.Browser);
			this.SetSerializedField("UserId", this.UserId);
			this.SetSerializedField("Host", this.Host);
			this.SetSerializedField("HostVersion", this.HostVersion);
			this.SetSerializedField("ClientId", this.ClientId);
			this.SetSerializedField("AppSizeWidth", this.AppSizeWidth);
			this.SetSerializedField("AppSizeHeight", this.AppSizeHeight);
			this.SetSerializedField("Message", this.Message);
			this.SetSerializedField("DocUrl", this.DocUrl);
			this.SetSerializedField("OfficeJSVersion", this.OfficeJSVersion);
			this.SetSerializedField("HostJSVersion", this.HostJSVersion);
			this.SetSerializedField("WacHostEnvironment", this.WacHostEnvironment);
			this.SetSerializedField("IsFromWacAutomation", this.IsFromWacAutomation);
		};
		return AppActivatedUsageData;
	})(BaseUsageData);
	OSFLog.AppActivatedUsageData=AppActivatedUsageData;
	var ScriptLoadUsageData=(function (_super) {
		__extends(ScriptLoadUsageData, _super);
		function ScriptLoadUsageData() {
			_super.call(this, "ScriptLoad");
		}
		Object.defineProperty(ScriptLoadUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ScriptId", {
			get: function () { return this.Fields["ScriptId"]; },
			set: function (value) { this.Fields["ScriptId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "StartTime", {
			get: function () { return this.Fields["StartTime"]; },
			set: function (value) { this.Fields["StartTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		ScriptLoadUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("ScriptId", this.ScriptId);
			this.SetSerializedField("StartTime", this.StartTime);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
		};
		return ScriptLoadUsageData;
	})(BaseUsageData);
	OSFLog.ScriptLoadUsageData=ScriptLoadUsageData;
	var AppClosedUsageData=(function (_super) {
		__extends(AppClosedUsageData, _super);
		function AppClosedUsageData() {
			_super.call(this, "AppClosed");
		}
		Object.defineProperty(AppClosedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "FocusTime", {
			get: function () { return this.Fields["FocusTime"]; },
			set: function (value) { this.Fields["FocusTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalWidth", {
			get: function () { return this.Fields["AppSizeFinalWidth"]; },
			set: function (value) { this.Fields["AppSizeFinalWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalHeight", {
			get: function () { return this.Fields["AppSizeFinalHeight"]; },
			set: function (value) { this.Fields["AppSizeFinalHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "OpenTime", {
			get: function () { return this.Fields["OpenTime"]; },
			set: function (value) { this.Fields["OpenTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "CloseMethod", {
			get: function () { return this.Fields["CloseMethod"]; },
			set: function (value) { this.Fields["CloseMethod"]=value; },
			enumerable: true,
			configurable: true
		});
		AppClosedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("FocusTime", this.FocusTime);
			this.SetSerializedField("AppSizeFinalWidth", this.AppSizeFinalWidth);
			this.SetSerializedField("AppSizeFinalHeight", this.AppSizeFinalHeight);
			this.SetSerializedField("OpenTime", this.OpenTime);
			this.SetSerializedField("CloseMethod", this.CloseMethod);
		};
		return AppClosedUsageData;
	})(BaseUsageData);
	OSFLog.AppClosedUsageData=AppClosedUsageData;
	var APIUsageUsageData=(function (_super) {
		__extends(APIUsageUsageData, _super);
		function APIUsageUsageData() {
			_super.call(this, "APIUsage");
		}
		Object.defineProperty(APIUsageUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIType", {
			get: function () { return this.Fields["APIType"]; },
			set: function (value) { this.Fields["APIType"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIID", {
			get: function () { return this.Fields["APIID"]; },
			set: function (value) { this.Fields["APIID"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "Parameters", {
			get: function () { return this.Fields["Parameters"]; },
			set: function (value) { this.Fields["Parameters"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ErrorType", {
			get: function () { return this.Fields["ErrorType"]; },
			set: function (value) { this.Fields["ErrorType"]=value; },
			enumerable: true,
			configurable: true
		});
		APIUsageUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("APIType", this.APIType);
			this.SetSerializedField("APIID", this.APIID);
			this.SetSerializedField("Parameters", this.Parameters);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
			this.SetSerializedField("ErrorType", this.ErrorType);
		};
		return APIUsageUsageData;
	})(BaseUsageData);
	OSFLog.APIUsageUsageData=APIUsageUsageData;
	var AppInitializationUsageData=(function (_super) {
		__extends(AppInitializationUsageData, _super);
		function AppInitializationUsageData() {
			_super.call(this, "AppInitialization");
		}
		Object.defineProperty(AppInitializationUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SuccessCode", {
			get: function () { return this.Fields["SuccessCode"]; },
			set: function (value) { this.Fields["SuccessCode"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		AppInitializationUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("SuccessCode", this.SuccessCode);
			this.SetSerializedField("Message", this.Message);
		};
		return AppInitializationUsageData;
	})(BaseUsageData);
	OSFLog.AppInitializationUsageData=AppInitializationUsageData;
})(OSFLog || (OSFLog={}));
var Logger;
(function (Logger) {
	"use strict";
	(function (TraceLevel) {
		TraceLevel[TraceLevel["info"]=0]="info";
		TraceLevel[TraceLevel["warning"]=1]="warning";
		TraceLevel[TraceLevel["error"]=2]="error";
	})(Logger.TraceLevel || (Logger.TraceLevel={}));
	var TraceLevel=Logger.TraceLevel;
	(function (SendFlag) {
		SendFlag[SendFlag["none"]=0]="none";
		SendFlag[SendFlag["flush"]=1]="flush";
	})(Logger.SendFlag || (Logger.SendFlag={}));
	var SendFlag=Logger.SendFlag;
	function allowUploadingData() {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			OSF.Logger.ulsEndpoint.loadProxyFrame();
		}
	}
	Logger.allowUploadingData=allowUploadingData;
	function sendLog(traceLevel, message, flag) {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			var jsonObj={ traceLevel: traceLevel, message: message, flag: flag, internalLog: true };
			var logs=JSON.stringify(jsonObj);
			OSF.Logger.ulsEndpoint.writeLog(logs);
		}
	}
	Logger.sendLog=sendLog;
	function creatULSEndpoint() {
		try {
			return new ULSEndpointProxy();
		}
		catch (e) {
			return null;
		}
	}
	var ULSEndpointProxy=(function () {
		function ULSEndpointProxy() {
			var _this=this;
			this.proxyFrame=null;
			this.telemetryEndPoint="https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
			this.buffer=[];
			this.proxyFrameReady=false;
			OSF.OUtil.addEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			setTimeout(function () {
				_this.loadProxyFrame();
			}, 3000);
		}
		ULSEndpointProxy.prototype.writeLog=function (log) {
			if (this.proxyFrameReady===true) {
				this.proxyFrame.contentWindow.postMessage(log, ULSEndpointProxy.telemetryOrigin);
			}
			else {
				if (this.buffer.length < 128) {
					this.buffer.push(log);
				}
			}
		};
		ULSEndpointProxy.prototype.loadProxyFrame=function () {
			if (this.proxyFrame==null) {
				this.proxyFrame=document.createElement("iframe");
				this.proxyFrame.setAttribute("style", "display:none");
				this.proxyFrame.setAttribute("src", this.telemetryEndPoint);
				document.head.appendChild(this.proxyFrame);
			}
		};
		ULSEndpointProxy.prototype.tellProxyFrameReady=function (e) {
			var _this=this;
			if (e.data==="ProxyFrameReadyToLog") {
				this.proxyFrameReady=true;
				for (var i=0; i < this.buffer.length; i++) {
					this.writeLog(this.buffer[i]);
				}
				this.buffer.length=0;
				OSF.OUtil.removeEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			}
			else if (e.data==="ProxyFrameReadyToInit") {
				var initJson={ appName: "Office APPs", sessionId: OSF.OUtil.Guid.generateNewGuid() };
				var initStr=JSON.stringify(initJson);
				this.proxyFrame.contentWindow.postMessage(initStr, ULSEndpointProxy.telemetryOrigin);
			}
		};
		ULSEndpointProxy.telemetryOrigin="https://telemetryservice.firstpartyapps.oaspapps.com";
		return ULSEndpointProxy;
	})();
	if (!OSF.Logger) {
		OSF.Logger=Logger;
	}
	Logger.ulsEndpoint=creatULSEndpoint();
})(Logger || (Logger={}));
var OSFAriaLogger;
(function (OSFAriaLogger) {
	var AriaLogger=(function () {
		function AriaLogger() {
		}
		AriaLogger.prototype.getAriaCDNLocation=function () {
			return (OSF._OfficeAppFactory.getLoadScriptHelper().getOfficeJsBasePath()+"/ariatelemetry/aria-web-telemetry.js");
		};
		AriaLogger.getInstance=function () {
			if (AriaLogger.AriaLoggerObj===undefined) {
				AriaLogger.AriaLoggerObj=new AriaLogger();
			}
			return AriaLogger.AriaLoggerObj;
		};
		AriaLogger.prototype.isIUsageData=function (arg) {
			return arg["Fields"] !==undefined;
		};
		AriaLogger.prototype.loadAriaScriptAndLog=function (tableName, telemetryData) {
			var startAfterMs=1000;
			OSF.OUtil.loadScript(this.getAriaCDNLocation(), function () {
				try {
					if (!this.ALogger) {
						var OfficeExtensibilityTenantID="db334b301e7b474db5e0f02f07c51a47-a1b5bc36-1bbe-482f-a64a-c2d9cb606706-7439";
						this.ALogger=AWTLogManager.initialize(OfficeExtensibilityTenantID);
					}
					var eventProperties=new AWTEventProperties();
					eventProperties.setName("Office.Extensibility.OfficeJS."+tableName);
					for (var key in telemetryData) {
						if (key.toLowerCase() !=="table") {
							eventProperties.setProperty(key, telemetryData[key]);
						}
					}
					var today=new Date();
					eventProperties.setProperty("Date", today.toISOString());
					this.ALogger.logEvent(eventProperties);
				}
				catch (e) {
				}
			}, startAfterMs);
		};
		AriaLogger.prototype.logData=function (data) {
			if (this.isIUsageData(data)) {
				this.loadAriaScriptAndLog(data["Table"], data["Fields"]);
			}
			else {
				this.loadAriaScriptAndLog(data["Table"], data);
			}
		};
		return AriaLogger;
	})();
	OSFAriaLogger.AriaLogger=AriaLogger;
})(OSFAriaLogger || (OSFAriaLogger={}));
var OSFAppTelemetry;
(function (OSFAppTelemetry) {
	"use strict";
	var appInfo;
	var sessionId=OSF.OUtil.Guid.generateNewGuid();
	var osfControlAppCorrelationId="";
	var omexDomainRegex=new RegExp("^https?://store\\.office(ppe|-int)?\\.com/", "i");
	OSFAppTelemetry.enableTelemetry=true;
	;
	var AppInfo=(function () {
		function AppInfo() {
		}
		return AppInfo;
	})();
	var Event=(function () {
		function Event(name, handler) {
			this.name=name;
			this.handler=handler;
		}
		return Event;
	})();
	var AppStorage=(function () {
		function AppStorage() {
			this.clientIDKey="Office API client";
			this.logIdSetKey="Office App Log Id Set";
		}
		AppStorage.prototype.getClientId=function () {
			var clientId=this.getValue(this.clientIDKey);
			if (!clientId || clientId.length <=0 || clientId.length > 40) {
				clientId=OSF.OUtil.Guid.generateNewGuid();
				this.setValue(this.clientIDKey, clientId);
			}
			return clientId;
		};
		AppStorage.prototype.saveLog=function (logId, log) {
			var logIdSet=this.getValue(this.logIdSetKey);
			logIdSet=((logIdSet && logIdSet.length > 0) ? (logIdSet+";") : "")+logId;
			this.setValue(this.logIdSetKey, logIdSet);
			this.setValue(logId, log);
		};
		AppStorage.prototype.enumerateLog=function (callback, clean) {
			var logIdSet=this.getValue(this.logIdSetKey);
			if (logIdSet) {
				var ids=logIdSet.split(";");
				for (var id in ids) {
					var logId=ids[id];
					var log=this.getValue(logId);
					if (log) {
						if (callback) {
							callback(logId, log);
						}
						if (clean) {
							this.remove(logId);
						}
					}
				}
				if (clean) {
					this.remove(this.logIdSetKey);
				}
			}
		};
		AppStorage.prototype.getValue=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			var value="";
			if (osfLocalStorage) {
				value=osfLocalStorage.getItem(key);
			}
			return value;
		};
		AppStorage.prototype.setValue=function (key, value) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				osfLocalStorage.setItem(key, value);
			}
		};
		AppStorage.prototype.remove=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				try {
					osfLocalStorage.removeItem(key);
				}
				catch (ex) {
				}
			}
		};
		return AppStorage;
	})();
	var AppLogger=(function () {
		function AppLogger() {
		}
		AppLogger.prototype.LogData=function (data) {
			if (!OSF.Logger || !OSFAppTelemetry.enableTelemetry) {
				return;
			}
			try {
				OSFAriaLogger.AriaLogger.getInstance().logData(data);
			}
			catch (e) {
			}
		};
		AppLogger.prototype.LogRawData=function (log) {
			if (!OSF.Logger || !OSFAppTelemetry.enableTelemetry) {
				return;
			}
			try {
				OSFAriaLogger.AriaLogger.getInstance().logData(JSON.parse(log));
			}
			catch (e) {
			}
		};
		return AppLogger;
	})();
	function trimStringToLowerCase(input) {
		if (input) {
			input=input.replace(/[{}]/g, "").toLowerCase();
		}
		return (input || "");
	}
	function initialize(context) {
		if (!OSF.Logger) {
			return;
		}
		if (appInfo) {
			return;
		}
		appInfo=new AppInfo();
		if (context.get_hostFullVersion()) {
			appInfo.hostVersion=context.get_hostFullVersion();
		}
		else {
			appInfo.hostVersion=context.get_appVersion();
		}
		appInfo.appId=context.get_id();
		appInfo.host=context.get_appName();
		appInfo.browser=window.navigator.userAgent;
		appInfo.correlationId=trimStringToLowerCase(context.get_correlationId());
		appInfo.clientId=(new AppStorage()).getClientId();
		appInfo.appInstanceId=context.get_appInstanceId();
		if (appInfo.appInstanceId) {
			appInfo.appInstanceId=appInfo.appInstanceId.replace(/[{}]/g, "").toLowerCase();
		}
		appInfo.message=context.get_hostCustomMessage();
		appInfo.officeJSVersion=OSF.ConstantNames.FileVersion;
		appInfo.hostJSVersion="16.0.8916.1000";
		if (context._wacHostEnvironment) {
			appInfo.wacHostEnvironment=context._wacHostEnvironment;
		}
		if (context._isFromWacAutomation !==undefined && context._isFromWacAutomation !==null) {
			appInfo.isFromWacAutomation=context._isFromWacAutomation.toString().toLowerCase();
		}
		var docUrl=context.get_docUrl();
		appInfo.docUrl=omexDomainRegex.test(docUrl) ? docUrl : "";
		var url=location.href;
		if (url) {
			url=url.split("?")[0].split("#")[0];
		}
		appInfo.appURL=url;
		(function getUserIdAndAssetIdFromToken(token, appInfo) {
			var xmlContent;
			var parser;
			var xmlDoc;
			appInfo.assetId="";
			appInfo.userId="";
			try {
				xmlContent=decodeURIComponent(token);
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(xmlContent, "text/xml");
				var cidNode=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid");
				var oidNode=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("oid");
				if (cidNode && cidNode.nodeValue) {
					appInfo.userId=cidNode.nodeValue;
				}
				else if (oidNode && oidNode.nodeValue) {
					appInfo.userId=oidNode.nodeValue;
				}
				appInfo.assetId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue;
			}
			catch (e) {
			}
			finally {
				xmlContent=null;
				xmlDoc=null;
				parser=null;
			}
		})(context.get_eToken(), appInfo);
		(function handleLifecycle() {
			var startTime=new Date();
			var lastFocus=null;
			var focusTime=0;
			var finished=false;
			var adjustFocusTime=function () {
				if (document.hasFocus()) {
					if (lastFocus==null) {
						lastFocus=new Date();
					}
				}
				else if (lastFocus) {
					focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
					lastFocus=null;
				}
			};
			var eventList=[];
			eventList.push(new Event("focus", adjustFocusTime));
			eventList.push(new Event("blur", adjustFocusTime));
			eventList.push(new Event("focusout", adjustFocusTime));
			eventList.push(new Event("focusin", adjustFocusTime));
			var exitFunction=function () {
				for (var i=0; i < eventList.length; i++) {
					OSF.OUtil.removeEventListener(window, eventList[i].name, eventList[i].handler);
				}
				eventList.length=0;
				if (!finished) {
					if (document.hasFocus() && lastFocus) {
						focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
						lastFocus=null;
					}
					OSFAppTelemetry.onAppClosed(Math.abs((new Date()).getTime() - startTime.getTime()), focusTime);
					finished=true;
				}
			};
			eventList.push(new Event("beforeunload", exitFunction));
			eventList.push(new Event("unload", exitFunction));
			for (var i=0; i < eventList.length; i++) {
				OSF.OUtil.addEventListener(window, eventList[i].name, eventList[i].handler);
			}
			adjustFocusTime();
		})();
		OSFAppTelemetry.onAppActivated();
	}
	OSFAppTelemetry.initialize=initialize;
	function onAppActivated() {
		if (!appInfo) {
			return;
		}
		(new AppStorage()).enumerateLog(function (id, log) { return (new AppLogger()).LogRawData(log); }, true);
		var data=new OSFLog.AppActivatedUsageData();
		data.SessionId=sessionId;
		data.AppId=appInfo.appId;
		data.AssetId=appInfo.assetId;
		data.AppURL=appInfo.appURL;
		data.UserId=appInfo.userId;
		data.ClientId=appInfo.clientId;
		data.Browser=appInfo.browser;
		data.Host=appInfo.host;
		data.HostVersion=appInfo.hostVersion;
		data.CorrelationId=trimStringToLowerCase(appInfo.correlationId);
		data.AppSizeWidth=window.innerWidth;
		data.AppSizeHeight=window.innerHeight;
		data.AppInstanceId=appInfo.appInstanceId;
		data.Message=appInfo.message;
		data.DocUrl=appInfo.docUrl;
		data.OfficeJSVersion=appInfo.officeJSVersion;
		data.HostJSVersion=appInfo.hostJSVersion;
		if (appInfo.wacHostEnvironment) {
			data.WacHostEnvironment=appInfo.wacHostEnvironment;
		}
		if (appInfo.isFromWacAutomation !==undefined && appInfo.isFromWacAutomation !==null) {
			data.IsFromWacAutomation=appInfo.isFromWacAutomation;
		}
		(new AppLogger()).LogData(data);
		setTimeout(function () {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.allowUploadingData();
		}, 100);
	}
	OSFAppTelemetry.onAppActivated=onAppActivated;
	function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId) {
		var data=new OSFLog.ScriptLoadUsageData();
		data.CorrelationId=trimStringToLowerCase(appCorrelationId);
		data.SessionId=sessionId;
		data.ScriptId=scriptId;
		data.StartTime=msStartTime;
		data.ResponseTime=msResponseTime;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onScriptDone=onScriptDone;
	function onCallDone(apiType, id, parameters, msResponseTime, errorType) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.APIUsageUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.APIType=apiType;
		data.APIID=id;
		data.Parameters=parameters;
		data.ResponseTime=msResponseTime;
		data.ErrorType=errorType;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onCallDone=onCallDone;
	;
	function onMethodDone(id, args, msResponseTime, errorType) {
		var parameters=null;
		if (args) {
			if (typeof args=="number") {
				parameters=String(args);
			}
			else if (typeof args==="object") {
				for (var index in args) {
					if (parameters !==null) {
						parameters+=",";
					}
					else {
						parameters="";
					}
					if (typeof args[index]=="number") {
						parameters+=String(args[index]);
					}
				}
			}
			else {
				parameters="";
			}
		}
		OSF.AppTelemetry.onCallDone("method", id, parameters, msResponseTime, errorType);
	}
	OSFAppTelemetry.onMethodDone=onMethodDone;
	function onPropertyDone(propertyName, msResponseTime) {
		OSF.AppTelemetry.onCallDone("property", -1, propertyName, msResponseTime);
	}
	OSFAppTelemetry.onPropertyDone=onPropertyDone;
	function onEventDone(id, errorType) {
		OSF.AppTelemetry.onCallDone("event", id, null, 0, errorType);
	}
	OSFAppTelemetry.onEventDone=onEventDone;
	function onRegisterDone(register, id, msResponseTime, errorType) {
		OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent", id, null, msResponseTime, errorType);
	}
	OSFAppTelemetry.onRegisterDone=onRegisterDone;
	function onAppClosed(openTime, focusTime) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.AppClosedUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.FocusTime=focusTime;
		data.OpenTime=openTime;
		data.AppSizeFinalWidth=window.innerWidth;
		data.AppSizeFinalHeight=window.innerHeight;
		(new AppStorage()).saveLog(sessionId, data.SerializeRow());
	}
	OSFAppTelemetry.onAppClosed=onAppClosed;
	function setOsfControlAppCorrelationId(correlationId) {
		osfControlAppCorrelationId=trimStringToLowerCase(correlationId);
	}
	OSFAppTelemetry.setOsfControlAppCorrelationId=setOsfControlAppCorrelationId;
	function doAppInitializationLogging(isException, message) {
		var data=new OSFLog.AppInitializationUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.SuccessCode=isException ? 1 : 0;
		data.Message=message;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.doAppInitializationLogging=doAppInitializationLogging;
	function logAppCommonMessage(message) {
		doAppInitializationLogging(false, message);
	}
	OSFAppTelemetry.logAppCommonMessage=logAppCommonMessage;
	function logAppException(errorMessage) {
		doAppInitializationLogging(true, errorMessage);
	}
	OSFAppTelemetry.logAppException=logAppException;
	OSF.AppTelemetry=OSFAppTelemetry;
})(OSFAppTelemetry || (OSFAppTelemetry={}));
Microsoft.Office.WebExtension.FileType={
	Text: "text",
	Compressed: "compressed",
	Pdf: "pdf"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FileProperties: "FileProperties",
	FileSliceProperties: "FileSliceProperties"
});
OSF.DDA.FileProperties={
	Handle: "FileHandle",
	FileSize: "FileSize",
	SliceSize: Microsoft.Office.WebExtension.Parameters.SliceSize
};
OSF.DDA.File=function OSF_DDA_File(handle, fileSize, sliceSize) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"size": {
			value: fileSize
		},
		"sliceCount": {
			value: Math.ceil(fileSize / sliceSize)
		}
	});
	var privateState={};
	privateState[OSF.DDA.FileProperties.Handle]=handle;
	privateState[OSF.DDA.FileProperties.SliceSize]=sliceSize;
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDocumentCopyChunkAsync,
		am.ReleaseDocumentCopyAsync
	], privateState);
};
OSF.DDA.FileSliceOffset="fileSliceoffset";
OSF.DDA.AsyncMethodNames.addNames({
	GetDocumentCopyAsync: "getFileAsync",
	GetDocumentCopyChunkAsync: "getSliceAsync",
	ReleaseDocumentCopyAsync: "closeAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.FileType,
			"enum": Microsoft.Office.WebExtension.FileType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SliceSize,
			value: {
				"types": ["number"],
				"defaultValue": 4 * 1024 * 1024
			}
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var sliceSize=callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize];
		if (sliceSize <=0 || sliceSize > (4 * 1024 * 1024)) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize;
		}
		return callArgs;
	},
	onSucceeded: function (fileDescriptor, caller, callArgs) {
		return new OSF.DDA.File(fileDescriptor[OSF.DDA.FileProperties.Handle], fileDescriptor[OSF.DDA.FileProperties.FileSize], callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize]);
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyChunkAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.SliceIndex,
			"types": ["number"]
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		},
		{
			name: OSF.DDA.FileProperties.SliceSize,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.SliceSize]; }
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var index=callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex];
		if (index < 0 || index >=caller.sliceCount) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange;
		}
		callArgs[OSF.DDA.FileSliceOffset]=parseInt((index * stateInfo[OSF.DDA.FileProperties.SliceSize]).toString());
		return callArgs;
	},
	onSucceeded: function (sliceDescriptor, caller, callArgs) {
		var slice={};
		OSF.OUtil.defineEnumerableProperties(slice, {
			"data": {
				value: sliceDescriptor[Microsoft.Office.WebExtension.Parameters.Data]
			},
			"index": {
				value: callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex]
			},
			"size": {
				value: sliceDescriptor[OSF.DDA.FileProperties.SliceSize]
			}
		});
		return slice;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ReleaseDocumentCopyAsync,
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		}
	]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("File", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_File_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_File_FilePropertiesKeys) {
	OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["Handle"]=0]="Handle";
	OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["FileSize"]=1]="FileSize";
})(OSF_DDA_Marshaling_File_FilePropertiesKeys || (OSF_DDA_Marshaling_File_FilePropertiesKeys={}));
;
OSF.DDA.Marshaling.File.FilePropertiesKeys=OSF_DDA_Marshaling_File_FilePropertiesKeys;
var OSF_DDA_Marshaling_File_SlicePropertiesKeys;
(function (OSF_DDA_Marshaling_File_SlicePropertiesKeys) {
	OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["Data"]=0]="Data";
	OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["SliceSize"]=1]="SliceSize";
})(OSF_DDA_Marshaling_File_SlicePropertiesKeys || (OSF_DDA_Marshaling_File_SlicePropertiesKeys={}));
;
OSF.DDA.Marshaling.File.SlicePropertiesKeys=OSF_DDA_Marshaling_File_SlicePropertiesKeys;
var OSF_DDA_Marshaling_File_FileType;
(function (OSF_DDA_Marshaling_File_FileType) {
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Text"]=0]="Text";
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Compressed"]=1]="Compressed";
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Pdf"]=2]="Pdf";
})(OSF_DDA_Marshaling_File_FileType || (OSF_DDA_Marshaling_File_FileType={}));
;
OSF.DDA.Marshaling.File.FileType=OSF_DDA_Marshaling_File_FileType;
var OSF_DDA_Marshaling_File_ParameterKeys;
(function (OSF_DDA_Marshaling_File_ParameterKeys) {
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["FileType"]=0]="FileType";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceSize"]=1]="SliceSize";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["Handle"]=2]="Handle";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceIndex"]=3]="SliceIndex";
})(OSF_DDA_Marshaling_File_ParameterKeys || (OSF_DDA_Marshaling_File_ParameterKeys={}));
;
OSF.DDA.Marshaling.File.ParameterKeys=OSF_DDA_Marshaling_File_ParameterKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileProperties);
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileSliceProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileProperties,
	fromHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.Handle },
		{ name: OSF.DDA.FileProperties.FileSize, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.FileSize }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileSliceProperties,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.Data },
		{ name: OSF.DDA.FileProperties.SliceSize, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.SliceSize }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.FileType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.FileType.Text, value: OSF.DDA.Marshaling.File.FileType.Text },
		{ name: Microsoft.Office.WebExtension.FileType.Compressed, value: OSF.DDA.Marshaling.File.FileType.Compressed },
		{ name: Microsoft.Office.WebExtension.FileType.Pdf, value: OSF.DDA.Marshaling.File.FileType.Pdf }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.FileType, value: OSF.DDA.Marshaling.File.ParameterKeys.FileType },
		{ name: Microsoft.Office.WebExtension.Parameters.SliceSize, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceSize }
	],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyChunkMethod,
	toHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle },
		{ name: Microsoft.Office.WebExtension.Parameters.SliceIndex, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceIndex }
	],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileSliceProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseDocumentCopyMethod,
	toHost: [{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle }]
});
Microsoft.Office.WebExtension.TableData=function Microsoft_Office_WebExtension_TableData(rows, headers) {
	function fixData(data) {
		if (data==null || data==undefined) {
			return null;
		}
		try {
			for (var dim=OSF.DDA.DataCoercion.findArrayDimensionality(data, 2); dim < 2; dim++) {
				data=[data];
			}
			return data;
		}
		catch (ex) {
		}
	}
	;
	OSF.OUtil.defineEnumerableProperties(this, {
		"headers": {
			get: function () { return headers; },
			set: function (value) {
				headers=fixData(value);
			}
		},
		"rows": {
			get: function () { return rows; },
			set: function (value) {
				rows=(value==null || (OSF.OUtil.isArray(value) && (value.length==0))) ?
					[] :
					fixData(value);
			}
		}
	});
	this.headers=headers;
	this.rows=rows;
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureTableData=function OSF_DDA_OMFactory$manufactureTableData(tableDataProperties) {
	return new Microsoft.Office.WebExtension.TableData(tableDataProperties[OSF.DDA.TableDataProperties.TableRows], tableDataProperties[OSF.DDA.TableDataProperties.TableHeaders]);
};
Microsoft.Office.WebExtension.CoercionType={
	Text: "text",
	Matrix: "matrix",
	Table: "table"
};
OSF.DDA.DataCoercion=(function OSF_DDA_DataCoercion() {
	return {
		findArrayDimensionality: function OSF_DDA_DataCoercion$findArrayDimensionality(obj) {
			if (OSF.OUtil.isArray(obj)) {
				var dim=0;
				for (var index=0; index < obj.length; index++) {
					dim=Math.max(dim, OSF.DDA.DataCoercion.findArrayDimensionality(obj[index]));
				}
				return dim+1;
			}
			else {
				return 0;
			}
		},
		getCoercionDefaultForBinding: function OSF_DDA_DataCoercion$getCoercionDefaultForBinding(bindingType) {
			switch (bindingType) {
				case Microsoft.Office.WebExtension.BindingType.Matrix: return Microsoft.Office.WebExtension.CoercionType.Matrix;
				case Microsoft.Office.WebExtension.BindingType.Table: return Microsoft.Office.WebExtension.CoercionType.Table;
				case Microsoft.Office.WebExtension.BindingType.Text:
				default:
					return Microsoft.Office.WebExtension.CoercionType.Text;
			}
		},
		getBindingDefaultForCoercion: function OSF_DDA_DataCoercion$getBindingDefaultForCoercion(coercionType) {
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Matrix: return Microsoft.Office.WebExtension.BindingType.Matrix;
				case Microsoft.Office.WebExtension.CoercionType.Table: return Microsoft.Office.WebExtension.BindingType.Table;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					return Microsoft.Office.WebExtension.BindingType.Text;
			}
		},
		determineCoercionType: function OSF_DDA_DataCoercion$determineCoercionType(data) {
			if (data==null || data==undefined)
				return null;
			var sourceType=null;
			var runtimeType=typeof data;
			if (data.rows !==undefined) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Table;
			}
			else if (OSF.OUtil.isArray(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Matrix;
			}
			else if (runtimeType=="string" || runtimeType=="number" || runtimeType=="boolean" || OSF.OUtil.isDate(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Text;
			}
			else {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject;
			}
			return sourceType;
		},
		coerceData: function OSF_DDA_DataCoercion$coerceData(data, destinationType, sourceType) {
			sourceType=sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
			if (sourceType && sourceType !=destinationType) {
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionBegin);
				data=OSF.DDA.DataCoercion._coerceDataFromTable(destinationType, OSF.DDA.DataCoercion._coerceDataToTable(data, sourceType));
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionEnd);
			}
			return data;
		},
		_matrixToText: function OSF_DDA_DataCoercion$_matrixToText(matrix) {
			if (matrix.length==1 && matrix[0].length==1)
				return ""+matrix[0][0];
			var val="";
			for (var i=0; i < matrix.length; i++) {
				val+=matrix[i].join("\t")+"\n";
			}
			return val.substring(0, val.length - 1);
		},
		_textToMatrix: function OSF_DDA_DataCoercion$_textToMatrix(text) {
			var ret=text.split("\n");
			for (var i=0; i < ret.length; i++)
				ret[i]=ret[i].split("\t");
			return ret;
		},
		_tableToText: function OSF_DDA_DataCoercion$_tableToText(table) {
			var headers="";
			if (table.headers !=null) {
				headers=OSF.DDA.DataCoercion._matrixToText([table.headers])+"\n";
			}
			var rows=OSF.DDA.DataCoercion._matrixToText(table.rows);
			if (rows=="") {
				headers=headers.substring(0, headers.length - 1);
			}
			return headers+rows;
		},
		_tableToMatrix: function OSF_DDA_DataCoercion$_tableToMatrix(table) {
			var matrix=table.rows;
			if (table.headers !=null) {
				matrix.unshift(table.headers);
			}
			return matrix;
		},
		_coerceDataFromTable: function OSF_DDA_DataCoercion$_coerceDataFromTable(coercionType, table) {
			var value;
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=table;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=OSF.DDA.DataCoercion._tableToMatrix(table);
					break;
				case Microsoft.Office.WebExtension.CoercionType.SlideRange:
					value=null;
					if (OSF.DDA.OMFactory.manufactureSlideRange) {
						value=OSF.DDA.OMFactory.manufactureSlideRange(OSF.DDA.DataCoercion._tableToText(table));
					}
					if (value==null) {
						value=OSF.DDA.DataCoercion._tableToText(table);
					}
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=OSF.DDA.DataCoercion._tableToText(table);
					break;
			}
			return value;
		},
		_coerceDataToTable: function OSF_DDA_DataCoercion$_coerceDataToTable(data, sourceType) {
			if (sourceType==undefined) {
				sourceType=OSF.DDA.DataCoercion.determineCoercionType(data);
			}
			var value;
			switch (sourceType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=data;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=new Microsoft.Office.WebExtension.TableData(data);
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=new Microsoft.Office.WebExtension.TableData(OSF.DDA.DataCoercion._textToMatrix(data));
					break;
			}
			return value;
		}
	};
})();
OSF.DDA.AsyncMethodNames.addNames({
	GetSelectedDataAsync: "getSelectedDataAsync",
	SetSelectedDataAsync: "setSelectedDataAsync"
});
(function () {
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.CoercionType,
				"enum": Microsoft.Office.WebExtension.CoercionType
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) {
						return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]);
					}
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageLeft,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageTop,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageWidth,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageHeight,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			}
		],
		privateStateCallbacks: []
	});
})();
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.GetData,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
		{ name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: "ValueFormat" },
		{ name: Microsoft.Office.WebExtension.Parameters.FilterType, value: "FilterType" },
		{ name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
		{ name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SetData,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data },
		{ name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageLeft, value: "ImageLeft" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageTop, value: "ImageTop" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageWidth, value: "ImageWidth" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageHeight, value: "ImageHeight" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SettingsManager={
	SerializedSettings: "serializedSettings",
	RefreshingSettings: "refreshingSettings",
	DateJSONPrefix: "Date(",
	DataJSONSuffix: ")",
	serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection) {
		return OSF.OUtil.serializeSettings(settingsCollection);
	},
	deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings) {
		return OSF.OUtil.deserializeSettings(serializedSettings);
	}
};
OSF.DDA.Settings=function OSF_DDA_Settings(settings) {
	settings=settings || {};
	var cacheSessionSettings=function (settings) {
		var osfSessionStorage=OSF.OUtil.getSessionStorage();
		if (osfSessionStorage) {
			var serializedSettings=OSF.DDA.SettingsManager.serializeSettings(settings);
			var storageSettings=JSON ? JSON.stringify(serializedSettings) : Sys.Serialization.JavaScriptSerializer.serialize(serializedSettings);
			osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
		}
	};
	OSF.OUtil.defineEnumerableProperties(this, {
		"get": {
			value: function OSF_DDA_Settings$get(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				var setting=settings[name];
				return typeof (setting)==='undefined' ? null : setting;
			}
		},
		"set": {
			value: function OSF_DDA_Settings$set(name, value) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false },
					{ name: "value", mayBeNull: true }
				]);
				if (e)
					throw e;
				settings[name]=value;
				cacheSessionSettings(settings);
			}
		},
		"remove": {
			value: function OSF_DDA_Settings$remove(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				delete settings[name];
				cacheSessionSettings(settings);
			}
		}
	});
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.SaveAsync], settings);
};
OSF.DDA.RefreshableSettings=function OSF_DDA_RefreshableSettings(settings) {
	OSF.DDA.RefreshableSettings.uber.constructor.call(this, settings);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.RefreshAsync], settings);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.SettingsChanged]));
};
OSF.OUtil.extend(OSF.DDA.RefreshableSettings, OSF.DDA.Settings);
Microsoft.Office.WebExtension.EventType={};
OSF.EventDispatch=function OSF_EventDispatch(eventTypes) {
	this._eventHandlers={};
	this._objectEventHandlers={};
	this._queuedEventsArgs={};
	if (eventTypes !=null) {
		for (var i=0; i < eventTypes.length; i++) {
			var eventType=eventTypes[i];
			var isObjectEvent=(eventType=="objectDeleted" || eventType=="objectSelectionChanged" || eventType=="objectDataChanged" || eventType=="contentControlAdded");
			if (!isObjectEvent)
				this._eventHandlers[eventType]=[];
			else
				this._objectEventHandlers[eventType]={};
			this._queuedEventsArgs[eventType]=[];
		}
	}
};
OSF.EventDispatch.prototype={
	getSupportedEvents: function OSF_EventDispatch$getSupportedEvents() {
		var events=[];
		for (var eventName in this._eventHandlers)
			events.push(eventName);
		for (var eventName in this._objectEventHandlers)
			events.push(eventName);
		return events;
	},
	supportsEvent: function OSF_EventDispatch$supportsEvent(event) {
		for (var eventName in this._eventHandlers) {
			if (event==eventName)
				return true;
		}
		for (var eventName in this._objectEventHandlers) {
			if (event==eventName)
				return true;
		}
		return false;
	},
	hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var i=0; i < handlers.length; i++) {
				if (handlers[i]===handler)
					return true;
			}
		}
		return false;
	},
	hasObjectEventHandler: function OSF_EventDispatch$hasObjectEventHandler(eventType, objectId, handler) {
		var handlers=this._objectEventHandlers[eventType];
		if (handlers !=null) {
			var _handlers=handlers[objectId];
			for (var i=0; _handlers !=null && i < _handlers.length; i++) {
				if (_handlers[i]===handler)
					return true;
			}
		}
		return false;
	},
	addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler) {
		if (typeof handler !="function") {
			return false;
		}
		var handlers=this._eventHandlers[eventType];
		if (handlers && !this.hasEventHandler(eventType, handler)) {
			handlers.push(handler);
			return true;
		}
		else {
			return false;
		}
	},
	addObjectEventHandler: function OSF_EventDispatch$addObjectEventHandler(eventType, objectId, handler) {
		if (typeof handler !="function") {
			return false;
		}
		var handlers=this._objectEventHandlers[eventType];
		if (handlers && !this.hasObjectEventHandler(eventType, objectId, handler)) {
			if (handlers[objectId]==null)
				handlers[objectId]=[];
			handlers[objectId].push(handler);
			return true;
		}
		return false;
	},
	addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		var isFirstHandler=handlers.length==0;
		var succeed=this.addEventHandler(eventType, handler);
		if (isFirstHandler && succeed) {
			this.fireQueuedEvent(eventType);
		}
		return succeed;
	},
	removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var index=0; index < handlers.length; index++) {
				if (handlers[index]===handler) {
					handlers.splice(index, 1);
					return true;
				}
			}
		}
		return false;
	},
	removeObjectEventHandler: function OSF_EventDispatch$removeObjectEventHandler(eventType, objectId, handler) {
		var handlers=this._objectEventHandlers[eventType];
		if (handlers !=null) {
			var _handlers=handlers[objectId];
			for (var i=0; _handlers !=null && i < _handlers.length; i++) {
				if (_handlers[i]===handler) {
					_handlers.splice(i, 1);
					return true;
				}
			}
		}
		return false;
	},
	clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType) {
		if (typeof this._eventHandlers[eventType] !="undefined" && this._eventHandlers[eventType].length > 0) {
			this._eventHandlers[eventType]=[];
			return true;
		}
		return false;
	},
	clearObjectEventHandlers: function OSF_EventDispatch$clearObjectEventHandlers(eventType, objectId) {
		if (this._objectEventHandlers[eventType] !=null && this._objectEventHandlers[eventType][objectId] !=null) {
			this._objectEventHandlers[eventType][objectId]=[];
			return true;
		}
		return false;
	},
	getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType) {
		return this._eventHandlers[eventType] !=undefined ? this._eventHandlers[eventType].length : -1;
	},
	getObjectEventHandlerCount: function OSF_EventDispatch$getObjectEventHandlerCount(eventType, objectId) {
		if (this._objectEventHandlers[eventType]==null || this._objectEventHandlers[eventType][objectId]==null)
			return 0;
		return this._objectEventHandlers[eventType][objectId].length;
	},
	fireEvent: function OSF_EventDispatch$fireEvent(eventArgs) {
		if (eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			for (var i=0; i < eventHandlers.length; i++) {
				eventHandlers[i](eventArgs);
			}
			return true;
		}
		else {
			return false;
		}
	},
	fireObjectEvent: function OSF_EventDispatch$fireObjectEvent(objectId, eventArgs) {
		if (eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if (eventType && this._objectEventHandlers[eventType]) {
			var eventHandlers=this._objectEventHandlers[eventType];
			var _handlers=eventHandlers[objectId];
			if (_handlers !=null) {
				for (var i=0; i < _handlers.length; i++)
					_handlers[i](eventArgs);
				return true;
			}
		}
		return false;
	},
	fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs) {
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length==0) {
				queuedEvents.push(eventArgs);
			}
			else {
				this.fireEvent(eventArgs);
			}
			return true;
		}
		else {
			return false;
		}
	},
	fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType) {
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length > 0) {
				var eventHandler=eventHandlers[0];
				while (queuedEvents.length > 0) {
					var eventArgs=queuedEvents.shift();
					eventHandler(eventArgs);
				}
				return true;
			}
		}
		return false;
	},
	clearQueuedEvent: function OSF_EventDispatch$clearQueuedEvent(eventType) {
		if (eventType && this._eventHandlers[eventType]) {
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (queuedEvents) {
				this._queuedEventsArgs[eventType]=[];
			}
		}
	}
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureEventArgs=function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties) {
	var args;
	switch (eventType) {
		case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
			args=new OSF.DDA.DocumentSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
			args=new OSF.DDA.BindingSelectionChangedEventArgs(this.manufactureBinding(eventProperties, target.document), eventProperties[OSF.DDA.PropertyDescriptors.Subset]);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
			args=new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties, target.document));
			break;
		case Microsoft.Office.WebExtension.EventType.SettingsChanged:
			args=new OSF.DDA.SettingsChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
			args=new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.OfficeThemeChanged:
			args=new OSF.DDA.Theming.OfficeThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DocumentThemeChanged:
			args=new OSF.DDA.Theming.DocumentThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
			args=OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.ObjectDeleted:
		case Microsoft.Office.WebExtension.EventType.ObjectSelectionChanged:
		case Microsoft.Office.WebExtension.EventType.ObjectDataChanged:
		case Microsoft.Office.WebExtension.EventType.ContentControlAdded:
			args=new OSF.DDA.ObjectEventArgs(eventType, eventProperties[Microsoft.Office.WebExtension.Parameters.Id]);
			break;
		case Microsoft.Office.WebExtension.EventType.RichApiMessage:
			args=new OSF.DDA.RichApiMessageEventArgs(eventType, eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
			args=new OSF.DDA.NodeInsertedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
			args=new OSF.DDA.NodeReplacedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
			args=new OSF.DDA.NodeDeletedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.TaskSelectionChanged:
			args=new OSF.DDA.TaskSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ResourceSelectionChanged:
			args=new OSF.DDA.ResourceSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ViewSelectionChanged:
			args=new OSF.DDA.ViewSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.DialogMessageReceived:
			args=new OSF.DDA.DialogEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived:
			args=new OSF.DDA.DialogParentEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.ItemChanged:
			if (OSF._OfficeAppFactory.getHostInfo()["hostType"]=="outlook") {
				args=new OSF.DDA.OlkItemSelectedChangedEventArgs(eventProperties);
				target.initialize(args["initialData"]);
				if (OSF._OfficeAppFactory.getHostInfo()["hostPlatform"]=="win32" || OSF._OfficeAppFactory.getHostInfo()["hostPlatform"]=="mac") {
					target.setCurrentItemNumber(args["itemNumber"].itemNumber);
				}
			}
			else {
				throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
			}
			break;
		case Microsoft.Office.WebExtension.EventType.RecipientsChanged:
			if (OSF._OfficeAppFactory.getHostInfo()["hostType"]=="outlook") {
				args=new OSF.DDA.OlkRecipientsChangedEventArgs(eventProperties);
			}
			else {
				throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
			}
			break;
		case Microsoft.Office.WebExtension.EventType.AppointmentTimeChanged:
			if (OSF._OfficeAppFactory.getHostInfo()["hostType"]=="outlook") {
				args=new OSF.DDA.OlkAppointmentTimeChangedEventArgs(eventProperties);
			}
			else {
				throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
			}
			break;
		default:
			throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
	}
	return args;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddHandlerAsync: "addHandlerAsync",
	RemoveHandlerAsync: "removeHandlerAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddHandlerAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			value: {
				"types": ["function", "object"],
				"defaultValue": null
			}
		}
	],
	privateStateCallbacks: []
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	SettingsChanged: "settingsChanged"
});
OSF.DDA.SettingsChangedEventArgs=function OSF_DDA_SettingsChangedEventArgs(settingsInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.SettingsChanged
		},
		"settings": {
			value: settingsInstance
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({
	RefreshAsync: "refreshAsync",
	SaveAsync: "saveAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RefreshAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.RefreshingSettings,
			value: function getRefreshingSettings(settingsInstance, settingsCollection) {
				return settingsCollection;
			}
		}
	],
	onSucceeded: function deserializeSettings(serializedSettingsDescriptor, refreshingSettings, refreshingSettingsArgs) {
		var serializedSettings=serializedSettingsDescriptor[OSF.DDA.SettingsManager.SerializedSettings];
		var newSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		var oldSettings=refreshingSettingsArgs[OSF.DDA.SettingsManager.RefreshingSettings];
		for (var setting in oldSettings) {
			refreshingSettings.remove(setting);
		}
		for (var setting in newSettings) {
			refreshingSettings.set(setting, newSettings[setting]);
		}
		return refreshingSettings;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.SaveAsync,
	requiredArguments: [],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.SerializedSettings,
			value: function serializeSettings(settingsInstance, settingsCollection) {
				return OSF.DDA.SettingsManager.serializeSettings(settingsCollection);
			}
		}
	]
});
OSF.DDA.WAC.SettingsTranslator=(function () {
	var keyIndex=0;
	var valueIndex=1;
	return {
		read: function OSF_DDA_WAC_SettingsTranslator$read(payload) {
			var serializedSettings={};
			var settingsPayload=payload.Settings;
			for (var index in settingsPayload) {
				var setting=settingsPayload[index];
				serializedSettings[setting[keyIndex]]=setting[valueIndex];
			}
			return serializedSettings;
		},
		write: function OSF_DDA_WAC_SettingsTranslator$write(serializedSettings) {
			var settingsPayload=[];
			for (var key in serializedSettings) {
				var setting=[];
				setting[keyIndex]=key;
				setting[valueIndex]=serializedSettings[key];
				settingsPayload.push(setting);
			}
			return settingsPayload;
		}
	};
})();
OSF.DDA.WAC.Delegate.ParameterMap.setDynamicType(OSF.DDA.SettingsManager.SerializedSettings, {
	toHost: OSF.DDA.WAC.SettingsTranslator.write,
	fromHost: OSF.DDA.WAC.SettingsTranslator.read
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SettingsRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale, value: "OverwriteIfStale" },
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
	],
	invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidLoadSettingsMethod,
	fromHost: [
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSaveSettingsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SettingsRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidSettingsChangedEvent });
Microsoft.Office.WebExtension.BindingType={
	Table: "table",
	Text: "text",
	Matrix: "matrix"
};
OSF.DDA.BindingProperties={
	Id: "BindingId",
	Type: Microsoft.Office.WebExtension.Parameters.BindingType
};
OSF.OUtil.augmentList(OSF.DDA.ListDescriptors, { BindingList: "BindingList" });
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	Subset: "subset",
	BindingProperties: "BindingProperties"
});
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.BindingList, OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.BindingPromise=function OSF_DDA_BindingPromise(bindingId, errorCallback) {
	this._id=bindingId;
	OSF.OUtil.defineEnumerableProperty(this, "onFail", {
		get: function () {
			return errorCallback;
		},
		set: function (onError) {
			var t=typeof onError;
			if (t !="undefined" && t !="function") {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, t);
			}
			errorCallback=onError;
		}
	});
};
OSF.DDA.BindingPromise.prototype={
	_fetch: function OSF_DDA_BindingPromise$_fetch(onComplete) {
		if (this.binding) {
			if (onComplete)
				onComplete(this.binding);
		}
		else {
			if (!this._binding) {
				var me=this;
				Microsoft.Office.WebExtension.context.document.bindings.getByIdAsync(this._id, function (asyncResult) {
					if (asyncResult.status==Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded) {
						OSF.OUtil.defineEnumerableProperty(me, "binding", {
							value: asyncResult.value
						});
						if (onComplete)
							onComplete(me.binding);
					}
					else {
						if (me.onFail)
							me.onFail(asyncResult);
					}
				});
			}
		}
		return this;
	},
	getDataAsync: function OSF_DDA_BindingPromise$getDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.getDataAsync.apply(binding, args); });
		return this;
	},
	setDataAsync: function OSF_DDA_BindingPromise$setDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.setDataAsync.apply(binding, args); });
		return this;
	},
	addHandlerAsync: function OSF_DDA_BindingPromise$addHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.addHandlerAsync.apply(binding, args); });
		return this;
	},
	removeHandlerAsync: function OSF_DDA_BindingPromise$removeHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.removeHandlerAsync.apply(binding, args); });
		return this;
	}
};
OSF.DDA.BindingFacade=function OSF_DDA_BindingFacade(docInstance) {
	this._eventDispatches=[];
	OSF.OUtil.defineEnumerableProperty(this, "document", {
		value: docInstance
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddFromSelectionAsync,
		am.AddFromNamedItemAsync,
		am.GetAllAsync,
		am.GetByIdAsync,
		am.ReleaseByIdAsync
	]);
};
OSF.DDA.UnknownBinding=function OSF_DDA_UknonwnBinding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": { value: docInstance },
		"id": { value: id }
	});
};
OSF.DDA.Binding=function OSF_DDA_Binding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": {
			value: docInstance
		},
		"id": {
			value: id
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDataAsync,
		am.SetDataAsync
	]);
	var et=Microsoft.Office.WebExtension.EventType;
	var bindingEventDispatches=docInstance.bindings._eventDispatches;
	if (!bindingEventDispatches[id]) {
		bindingEventDispatches[id]=new OSF.EventDispatch([
			et.BindingSelectionChanged,
			et.BindingDataChanged
		]);
	}
	var eventDispatch=bindingEventDispatches[id];
	OSF.DDA.DispIdHost.addEventSupport(this, eventDispatch);
};
OSF.DDA.generateBindingId=function OSF_DDA$GenerateBindingId() {
	return "UnnamedBinding_"+OSF.OUtil.getUniqueId()+"_"+new Date().getTime();
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureBinding=function OSF_DDA_OMFactory$manufactureBinding(bindingProperties, containingDocument) {
	var id=bindingProperties[OSF.DDA.BindingProperties.Id];
	var rows=bindingProperties[OSF.DDA.BindingProperties.RowCount];
	var cols=bindingProperties[OSF.DDA.BindingProperties.ColumnCount];
	var hasHeaders=bindingProperties[OSF.DDA.BindingProperties.HasHeaders];
	var binding;
	switch (bindingProperties[OSF.DDA.BindingProperties.Type]) {
		case Microsoft.Office.WebExtension.BindingType.Text:
			binding=new OSF.DDA.TextBinding(id, containingDocument);
			break;
		case Microsoft.Office.WebExtension.BindingType.Matrix:
			binding=new OSF.DDA.MatrixBinding(id, containingDocument, rows, cols);
			break;
		case Microsoft.Office.WebExtension.BindingType.Table:
			var isExcelApp=function () {
				return (OSF.DDA.ExcelDocument)
					&& (Microsoft.Office.WebExtension.context.document)
					&& (Microsoft.Office.WebExtension.context.document instanceof OSF.DDA.ExcelDocument);
			};
			var tableBindingObject;
			if (isExcelApp() && OSF.DDA.ExcelTableBinding) {
				tableBindingObject=OSF.DDA.ExcelTableBinding;
			}
			else {
				tableBindingObject=OSF.DDA.TableBinding;
			}
			binding=new tableBindingObject(id, containingDocument, rows, cols, hasHeaders);
			break;
		default:
			binding=new OSF.DDA.UnknownBinding(id, containingDocument);
	}
	return binding;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddFromSelectionAsync: "addFromSelectionAsync",
	AddFromNamedItemAsync: "addFromNamedItemAsync",
	GetAllAsync: "getAllAsync",
	GetByIdAsync: "getByIdAsync",
	ReleaseByIdAsync: "releaseByIdAsync",
	GetDataAsync: "getDataAsync",
	SetDataAsync: "setDataAsync"
});
(function () {
	function processBinding(bindingDescriptor) {
		return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document);
	}
	function getObjectId(obj) { return obj.id; }
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromSelectionAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromNamedItemAsync,
		requiredArguments: [{
				"name": Microsoft.Office.WebExtension.Parameters.ItemName,
				"types": ["string"]
			},
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.FailOnCollision,
				value: function () { return true; }
			}
		],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetAllAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.BindingList], processBinding); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.ReleaseByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response, caller, callArgs) {
			var id=callArgs[Microsoft.Office.WebExtension.Parameters.Id];
			delete caller._eventDispatches[id];
		}
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataAsync,
		requiredArguments: [],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs, binding) { return OSF.DDA.DataCoercion.getCoercionDefaultForBinding(binding.type); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.RowCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ColumnCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.RowCount]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.RowCount];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, { TableDataProperties: "TableDataProperties" });
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.TableDataProperties={
	TableRows: "TableRows",
	TableHeaders: "TableHeaders"
};
OSF.DDA.TableBinding=function OSF_DDA_TableBinding(id, docInstance, rows, cols, hasHeaders) {
	OSF.DDA.TableBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Table
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		},
		"hasHeaders": {
			value: hasHeaders ? hasHeaders : false
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddRowsAsync,
		am.AddColumnsAsync,
		am.DeleteAllDataValuesAsync
	]);
};
OSF.OUtil.extend(OSF.DDA.TableBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({
	AddRowsAsync: "addRowsAsync",
	AddColumnsAsync: "addColumnsAsync",
	DeleteAllDataValuesAsync: "deleteAllDataValuesAsync"
});
(function () {
	function getObjectId(obj) { return obj.id; }
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddRowsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddColumnsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.DeleteAllDataValuesAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.BindingRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.ItemName, value: "ItemName" },
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.BindingType, value: "BindingType" },
		{ name: Microsoft.Office.WebExtension.Parameters.PromptText, value: "PromptText" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.SampleData, value: "SampleData" },
		{ name: Microsoft.Office.WebExtension.Parameters.FailOnCollision, value: "FailOnCollision" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.BindingType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.BindingType.Text, value: 2 },
		{ name: Microsoft.Office.WebExtension.BindingType.Matrix, value: 3 },
		{ name: Microsoft.Office.WebExtension.BindingType.Table, value: 1 }
	],
	invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.BindingProperties,
	fromHost: [
		{ name: OSF.DDA.BindingProperties.Id, value: "Name" },
		{ name: OSF.DDA.BindingProperties.Type, value: "BindingType" },
		{ name: OSF.DDA.BindingProperties.RowCount, value: "RowCount" },
		{ name: OSF.DDA.BindingProperties.ColumnCount, value: "ColCount" },
		{ name: OSF.DDA.BindingProperties.HasHeaders, value: "HasHeaders" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: 0 }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromSelectionMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromNamedItemMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseBindingMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetAllBindingsMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.BindingList, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddRowsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddColumnsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidClearAllRowsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.Subset,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
		{ name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
	]
});
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.MatrixBinding=function OSF_DDA_MatrixBinding(id, docInstance, rows, cols) {
	OSF.DDA.MatrixBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Matrix
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		}
	});
};
OSF.OUtil.extend(OSF.DDA.MatrixBinding, OSF.DDA.Binding);
OSF.DDA.TextBinding=function OSF_DDA_TextBinding(id, docInstance) {
	OSF.DDA.TextBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperty(this, "type", {
		value: Microsoft.Office.WebExtension.BindingType.Text
	});
};
OSF.OUtil.extend(OSF.DDA.TextBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({ AddFromPromptAsync: "addFromPromptAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddFromPromptAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.BindingType,
			"enum": Microsoft.Office.WebExtension.BindingType
		}
	],
	supportedOptions: [{
			name: Microsoft.Office.WebExtension.Parameters.Id,
			value: {
				"types": ["string"],
				"calculate": OSF.DDA.generateBindingId
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.PromptText,
			value: {
				"types": ["string"],
				"calculate": function () { return Strings.OfficeOM.L_AddBindingFromPromptDefaultText; }
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.SampleData,
			value: {
				"types": ["object"],
				"defaultValue": null
			}
		}
	],
	privateStateCallbacks: [],
	onSucceeded: function (bindingDescriptor) { return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document); }
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromPromptMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { DocumentSelectionChanged: "documentSelectionChanged" });
OSF.DDA.DocumentSelectionChangedEventArgs=function OSF_DDA_DocumentSelectionChangedEventArgs(docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged
		},
		"document": {
			value: docInstance
		}
	});
};
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectDeleted: "objectDeleted" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectSelectionChanged: "objectSelectionChanged" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectDataChanged: "objectDataChanged" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ContentControlAdded: "contentControlAdded" });
OSF.DDA.ObjectEventArgs=function OSF_DDA_ObjectEventArgs(eventType, object) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": { value: eventType },
		"object": { value: object }
	});
};
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidDocumentSelectionChangedEvent });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	BindingSelectionChanged: "bindingSelectionChanged",
	BindingDataChanged: "bindingDataChanged"
});
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, { BindingSelectionChangedEvent: "BindingSelectionChangedEvent" });
OSF.DDA.BindingSelectionChangedEventArgs=function OSF_DDA_BindingSelectionChangedEventArgs(bindingInstance, subset) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingSelectionChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
	for (var prop in subset) {
		OSF.OUtil.defineEnumerableProperty(this, prop, {
			value: subset[prop]
		});
	}
};
OSF.DDA.BindingDataChangedEventArgs=function OSF_DDA_BindingDataChangedEventArgs(bindingInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingDataChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
};
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.BindingSelectionChangedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.WAC.UniqueArguments.BindingEventSource },
		{ name: OSF.DDA.PropertyDescriptors.Subset, value: OSF.DDA.PropertyDescriptors.Subset }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingDataChangedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.WAC.UniqueArguments.BindingEventSource }
	]
});
OSF.DDA.FilePropertiesDescriptor={
	Url: "Url"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FilePropertiesDescriptor: "FilePropertiesDescriptor"
});
Microsoft.Office.WebExtension.FileProperties=function Microsoft_Office_WebExtension_FileProperties(filePropertiesDescriptor) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"url": {
			value: filePropertiesDescriptor[OSF.DDA.FilePropertiesDescriptor.Url]
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({ GetFilePropertiesAsync: "getFilePropertiesAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: 0 }
	],
	requiredArguments: [],
	supportedOptions: [],
	onSucceeded: function (filePropertiesDescriptor, caller, callArgs) {
		return new Microsoft.Office.WebExtension.FileProperties(filePropertiesDescriptor);
	}
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
var OSF_DDA_Marshaling_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_FilePropertiesKeys) {
	OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Properties"]=0]="Properties";
	OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Url"]=1]="Url";
})(OSF_DDA_Marshaling_FilePropertiesKeys || (OSF_DDA_Marshaling_FilePropertiesKeys={}));
;
OSF.DDA.Marshaling.FilePropertiesKeys=OSF_DDA_Marshaling_FilePropertiesKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor,
	fromHost: [
		{ name: OSF.DDA.FilePropertiesDescriptor.Url, value: OSF.DDA.Marshaling.FilePropertiesKeys.Url }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetFilePropertiesMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: OSF.DDA.Marshaling.FilePropertiesKeys.Properties }
	]
});
Microsoft.Office.WebExtension.GoToType={
	Binding: "binding",
	NamedItem: "namedItem",
	Slide: "slide",
	Index: "index"
};
Microsoft.Office.WebExtension.SelectionMode={
	Default: "default",
	Selected: "selected",
	None: "none"
};
Microsoft.Office.WebExtension.Index={
	First: "first",
	Last: "last",
	Next: "next",
	Previous: "previous"
};
OSF.DDA.AsyncMethodNames.addNames({ GoToByIdAsync: "goToByIdAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GoToByIdAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.Id,
			"types": ["string", "number"]
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.GoToType,
			"enum": Microsoft.Office.WebExtension.GoToType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SelectionMode,
			value: {
				"enum": Microsoft.Office.WebExtension.SelectionMode,
				"defaultValue": Microsoft.Office.WebExtension.SelectionMode.Default
			}
		}
	]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.DDA.Marshaling.NavigationKeys={
	NavigationRequest: "DdaGoToByIdMethod",
	Id: "Id",
	GoToType: "GoToType",
	SelectionMode: "SelectionMode"
};
var OSF_DDA_Marshaling_GoToType;
(function (OSF_DDA_Marshaling_GoToType) {
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Binding"]=0]="Binding";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["NamedItem"]=1]="NamedItem";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Slide"]=2]="Slide";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Index"]=3]="Index";
})(OSF_DDA_Marshaling_GoToType || (OSF_DDA_Marshaling_GoToType={}));
;
OSF.DDA.Marshaling.GoToType=OSF_DDA_Marshaling_GoToType;
var OSF_DDA_Marshaling_SelectionMode;
(function (OSF_DDA_Marshaling_SelectionMode) {
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Default"]=0]="Default";
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Selected"]=1]="Selected";
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["None"]=2]="None";
})(OSF_DDA_Marshaling_SelectionMode || (OSF_DDA_Marshaling_SelectionMode={}));
;
OSF.DDA.Marshaling.SelectionMode=OSF_DDA_Marshaling_SelectionMode;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.Marshaling.NavigationKeys.NavigationRequest);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.NavigationKeys.Id },
		{ name: Microsoft.Office.WebExtension.Parameters.GoToType, value: OSF.DDA.Marshaling.NavigationKeys.GoToType },
		{ name: Microsoft.Office.WebExtension.Parameters.SelectionMode, value: OSF.DDA.Marshaling.NavigationKeys.SelectionMode }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.GoToType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.GoToType.Binding, value: OSF.DDA.Marshaling.GoToType.Binding },
		{ name: Microsoft.Office.WebExtension.GoToType.NamedItem, value: OSF.DDA.Marshaling.GoToType.NamedItem },
		{ name: Microsoft.Office.WebExtension.GoToType.Slide, value: OSF.DDA.Marshaling.GoToType.Slide },
		{ name: Microsoft.Office.WebExtension.GoToType.Index, value: OSF.DDA.Marshaling.GoToType.Index }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.SelectionMode,
	toHost: [
		{ name: Microsoft.Office.WebExtension.SelectionMode.Default, value: OSF.DDA.Marshaling.SelectionMode.Default },
		{ name: Microsoft.Office.WebExtension.SelectionMode.Selected, value: OSF.DDA.Marshaling.SelectionMode.Selected },
		{ name: Microsoft.Office.WebExtension.SelectionMode.None, value: OSF.DDA.Marshaling.SelectionMode.None }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidNavigateToMethod,
	toHost: [
		{ name: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.ExcelTableBinding=function OSF_DDA_ExcelTableBinding(id, docInstance, rows, cols, hasHeaders) {
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.ClearFormatsAsync,
		am.SetTableOptionsAsync,
		am.SetFormatsAsync
	]);
	OSF.DDA.ExcelTableBinding.uber.constructor.call(this, id, docInstance, rows, cols, hasHeaders);
	OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.ExcelTableBinding, OSF.DDA.TableBinding);
(function () {
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.CellFormat,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.TableOptions,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			}
		],
		privateStateCallbacks: []
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.CellFormat,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.TableOptions,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			var Parameters=Microsoft.Office.WebExtension.Parameters;
			if (callArgs[Parameters.StartRow]==0 &&
				callArgs[Parameters.StartColumn]==0 &&
				OSF.OUtil.isArray(callArgs[Parameters.CellFormat]) && callArgs[Parameters.CellFormat].length===0 &&
				OSF.OUtil.isArray(callArgs[Parameters.TableOptions]) && callArgs[Parameters.TableOptions].length===0) {
				delete callArgs[Parameters.StartRow];
				delete callArgs[Parameters.StartColumn];
				delete callArgs[Parameters.CellFormat];
				delete callArgs[Parameters.TableOptions];
			}
			if (callArgs[Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				((callArgs[Parameters.StartRow] && callArgs[Parameters.StartRow] !=0) ||
					(callArgs[Parameters.StartColumn] && callArgs[Parameters.StartColumn] !=0) ||
					callArgs[Parameters.CellFormat] ||
					callArgs[Parameters.TableOptions])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: function (obj) { return obj.id; }
			}
		]
	});
	OSF.DDA.BindingPromise.prototype.setTableOptionsAsync=function OSF_DDA_BindingPromise$setTableOptionsAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.setTableOptionsAsync.apply(binding, args); });
		return this;
	},
		OSF.DDA.BindingPromise.prototype.setFormatsAsync=function OSF_DDA_BindingPromise$setFormatsAsync() {
			var args=arguments;
			this._fetch(function onComplete(binding) { binding.setFormatsAsync.apply(binding, args); });
			return this;
		},
		OSF.DDA.BindingPromise.prototype.clearFormatsAsync=function OSF_DDA_BindingPromise$clearFormatsAsync() {
			var args=arguments;
			this._fetch(function onComplete(binding) { binding.clearFormatsAsync.apply(binding, args); });
			return this;
		};
})();
(function () {
	function getObjectId(obj) { return obj.id; }
	OSF.DDA.AsyncMethodNames.addNames({
		ClearFormatsAsync: "clearFormatsAsync",
		SetTableOptionsAsync: "setTableOptionsAsync",
		SetFormatsAsync: "setFormatsAsync"
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.ClearFormatsAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetTableOptionsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.TableOptions,
				"defaultValue": []
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetFormatsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.CellFormat,
				"defaultValue": []
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.DDA.Marshaling.FormatKeys={
	Id: "BindingId",
	CellFormat: "CellFormat",
	TableOptions: "TableOptions"
};
var OSF_DDA_Marshaling_TableOptionProperties;
(function (OSF_DDA_Marshaling_TableOptionProperties) {
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["headerRow"]=0]="headerRow";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["bandedRows"]=1]="bandedRows";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["firstColumn"]=2]="firstColumn";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["lastColumn"]=3]="lastColumn";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["bandedColumns"]=4]="bandedColumns";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["filterButton"]=5]="filterButton";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["style"]=6]="style";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["totalRow"]=7]="totalRow";
})(OSF_DDA_Marshaling_TableOptionProperties || (OSF_DDA_Marshaling_TableOptionProperties={}));
;
OSF.DDA.Marshaling.TableOptionProperties=OSF_DDA_Marshaling_TableOptionProperties;
var OSF_DDA_Marshaling_CellProperties;
(function (OSF_DDA_Marshaling_CellProperties) {
	OSF_DDA_Marshaling_CellProperties[OSF_DDA_Marshaling_CellProperties["row"]=0]="row";
	OSF_DDA_Marshaling_CellProperties[OSF_DDA_Marshaling_CellProperties["column"]=1]="column";
})(OSF_DDA_Marshaling_CellProperties || (OSF_DDA_Marshaling_CellProperties={}));
;
OSF.DDA.Marshaling.CellProperties=OSF_DDA_Marshaling_CellProperties;
var OSF_DDA_Marshaling_CellFormatProperties;
(function (OSF_DDA_Marshaling_CellFormatProperties) {
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["alignHorizontal"]=1]="alignHorizontal";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["alignVertical"]=2]="alignVertical";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["backgroundColor"]=101]="backgroundColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderStyle"]=201]="borderStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderColor"]=202]="borderColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderTopStyle"]=203]="borderTopStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderTopColor"]=204]="borderTopColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderBottomStyle"]=205]="borderBottomStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderBottomColor"]=206]="borderBottomColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderLeftStyle"]=207]="borderLeftStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderLeftColor"]=208]="borderLeftColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderRightStyle"]=209]="borderRightStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderRightColor"]=210]="borderRightColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderOutlineStyle"]=211]="borderOutlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderOutlineColor"]=212]="borderOutlineColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderInlineStyle"]=213]="borderInlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderInlineColor"]=214]="borderInlineColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontFamily"]=301]="fontFamily";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontStyle"]=302]="fontStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSize"]=303]="fontSize";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontUnderlineStyle"]=304]="fontUnderlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontColor"]=305]="fontColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontDirection"]=306]="fontDirection";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontStrikethrough"]=307]="fontStrikethrough";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSuperscript"]=308]="fontSuperscript";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSubscript"]=309]="fontSubscript";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontNormal"]=310]="fontNormal";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["indentLeft"]=401]="indentLeft";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["indentRight"]=402]="indentRight";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["numberFormat"]=501]="numberFormat";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["width"]=701]="width";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["height"]=702]="height";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["wrapping"]=703]="wrapping";
})(OSF_DDA_Marshaling_CellFormatProperties || (OSF_DDA_Marshaling_CellFormatProperties={}));
;
OSF.DDA.Marshaling.CellFormatProperties=OSF_DDA_Marshaling_CellFormatProperties;
var OSF_DDA_Marshaling_BorderStyleType;
(function (OSF_DDA_Marshaling_BorderStyleType) {
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["none"]=0]="none";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["thin"]=1]="thin";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["medium"]=2]="medium";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashed"]=3]="dashed";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dotted"]=4]="dotted";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["thick"]=5]="thick";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["double"]=6]="double";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["hair"]=7]="hair";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashed"]=8]="mediumDashed";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashDot"]=9]="dashDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashDot"]=10]="mediumDashDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashDotDot"]=11]="dashDotDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashDotDot"]=12]="mediumDashDotDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["slantDashDot"]=13]="slantDashDot";
})(OSF_DDA_Marshaling_BorderStyleType || (OSF_DDA_Marshaling_BorderStyleType={}));
;
OSF.DDA.Marshaling.BorderStyleType=OSF_DDA_Marshaling_BorderStyleType;
var OSF_DDA_Marshaling_ColorType;
(function (OSF_DDA_Marshaling_ColorType) {
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["none"]=0]="none";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["black"]=1]="black";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["blue"]=2]="blue";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["gray"]=3]="gray";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["green"]=4]="green";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["orange"]=5]="orange";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["pink"]=6]="pink";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["purple"]=7]="purple";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["red"]=8]="red";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["teal"]=9]="teal";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["turquoise"]=10]="turquoise";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["violet"]=11]="violet";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["white"]=12]="white";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["yellow"]=13]="yellow";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["automatic"]=14]="automatic";
})(OSF_DDA_Marshaling_ColorType || (OSF_DDA_Marshaling_ColorType={}));
;
OSF.DDA.Marshaling.ColorType=OSF_DDA_Marshaling_ColorType;
var OSF_DDA_Marshaling_AlignHorizontalType;
(function (OSF_DDA_Marshaling_AlignHorizontalType) {
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["general"]=0]="general";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["left"]=1]="left";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["center"]=2]="center";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["right"]=3]="right";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["fill"]=4]="fill";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["justify"]=5]="justify";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["centerAcrossSelection"]=6]="centerAcrossSelection";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["distributed"]=7]="distributed";
})(OSF_DDA_Marshaling_AlignHorizontalType || (OSF_DDA_Marshaling_AlignHorizontalType={}));
;
OSF.DDA.Marshaling.AlignHorizontalType=OSF_DDA_Marshaling_AlignHorizontalType;
var OSF_DDA_Marshaling_AlignVerticalType;
(function (OSF_DDA_Marshaling_AlignVerticalType) {
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["top"]=0]="top";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["center"]=1]="center";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["bottom"]=2]="bottom";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["justify"]=3]="justify";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["distributed"]=4]="distributed";
})(OSF_DDA_Marshaling_AlignVerticalType || (OSF_DDA_Marshaling_AlignVerticalType={}));
;
OSF.DDA.Marshaling.AlignVerticalType=OSF_DDA_Marshaling_AlignVerticalType;
var OSF_DDA_Marshaling_FontStyleType;
(function (OSF_DDA_Marshaling_FontStyleType) {
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["regular"]=0]="regular";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["italic"]=1]="italic";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["bold"]=2]="bold";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["boldItalic"]=3]="boldItalic";
})(OSF_DDA_Marshaling_FontStyleType || (OSF_DDA_Marshaling_FontStyleType={}));
;
OSF.DDA.Marshaling.FontStyleType=OSF_DDA_Marshaling_FontStyleType;
var OSF_DDA_Marshaling_FontUnderlineStyleType;
(function (OSF_DDA_Marshaling_FontUnderlineStyleType) {
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["none"]=0]="none";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["single"]=1]="single";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["double"]=2]="double";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["singleAccounting"]=3]="singleAccounting";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["doubleAccounting"]=4]="doubleAccounting";
})(OSF_DDA_Marshaling_FontUnderlineStyleType || (OSF_DDA_Marshaling_FontUnderlineStyleType={}));
;
OSF.DDA.Marshaling.FontUnderlineStyleType=OSF_DDA_Marshaling_FontUnderlineStyleType;
var OSF_DDA_Marshaling_FontDirectionType;
(function (OSF_DDA_Marshaling_FontDirectionType) {
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["context"]=0]="context";
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["leftToRight"]=1]="leftToRight";
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["rightToLeft"]=2]="rightToLeft";
})(OSF_DDA_Marshaling_FontDirectionType || (OSF_DDA_Marshaling_FontDirectionType={}));
;
OSF.DDA.Marshaling.FontDirectionType=OSF_DDA_Marshaling_FontDirectionType;
var OSF_DDA_Marshaling_WidthType;
(function (OSF_DDA_Marshaling_WidthType) {
	OSF_DDA_Marshaling_WidthType[OSF_DDA_Marshaling_WidthType["autoFit"]=-1]="autoFit";
})(OSF_DDA_Marshaling_WidthType || (OSF_DDA_Marshaling_WidthType={}));
;
OSF.DDA.Marshaling.WidthType=OSF_DDA_Marshaling_WidthType;
var OSF_DDA_Marshaling_HeightType;
(function (OSF_DDA_Marshaling_HeightType) {
	OSF_DDA_Marshaling_HeightType[OSF_DDA_Marshaling_HeightType["autoFit"]=-1]="autoFit";
})(OSF_DDA_Marshaling_HeightType || (OSF_DDA_Marshaling_HeightType={}));
;
OSF.DDA.Marshaling.HeightType=OSF_DDA_Marshaling_HeightType;
var AgaveFormatAPI;
(function (AgaveFormatAPI) {
	var alignHorizontalType=OSF.DDA.Marshaling.AlignHorizontalType;
	var alignVerticalType=OSF.DDA.Marshaling.AlignVerticalType;
	var borderStyleType=OSF.DDA.Marshaling.BorderStyleType;
	var cellFormatProperties=OSF.DDA.Marshaling.CellFormatProperties;
	var cellProperties=OSF.DDA.Marshaling.CellProperties;
	var colorType=OSF.DDA.Marshaling.ColorType;
	var fontDirectionType=OSF.DDA.Marshaling.FontDirectionType;
	var fontStyleType=OSF.DDA.Marshaling.FontStyleType;
	var fontUnderlineStyleType=OSF.DDA.Marshaling.FontUnderlineStyleType;
	var heightType=OSF.DDA.Marshaling.HeightType;
	var hostKeys=OSF.DDA.Marshaling.FormatKeys;
	var hostParameters=Microsoft.Office.WebExtension.Parameters;
	var ns=OSF.DDA.WAC.Delegate.ParameterMap;
	var tableOptionProperties=OSF.DDA.Marshaling.TableOptionProperties;
	var widthType=OSF.DDA.Marshaling.WidthType;
	Microsoft.Office.WebExtension.Table={
		All: 0,
		Data: 1,
		Headers: 2
	};
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.ClearFormats,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidClearFormatsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.ClearFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.SetFormats,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id },
			{ name: hostParameters.CellFormat, value: hostKeys.CellFormat },
			{ name: hostParameters.TableOptions, value: hostKeys.TableOptions }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetTableOptionsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetFormatsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.SetData,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id },
			{ name: hostParameters.CoercionType, value: "CoerceType" },
			{ name: hostParameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data },
			{ name: hostParameters.Rows, value: "Rows" },
			{ name: hostParameters.Columns, value: "Columns" },
			{ name: hostParameters.StartRow, value: "StartRow" },
			{ name: hostParameters.StartColumn, value: "StartCol" },
			{ name: hostParameters.CellFormat, value: hostKeys.CellFormat },
			{ name: hostParameters.TableOptions, value: hostKeys.TableOptions }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	var formatProperties={
		alignHorizontal: { text: "alignHorizontal", type: cellFormatProperties.alignHorizontal },
		alignVertical: { text: "alignVertical", type: cellFormatProperties.alignVertical },
		backgroundColor: { text: "backgroundColor", type: cellFormatProperties.backgroundColor },
		borderStyle: { text: "borderStyle", type: cellFormatProperties.borderStyle },
		borderColor: { text: "borderColor", type: cellFormatProperties.borderColor },
		borderTopStyle: { text: "borderTopStyle", type: cellFormatProperties.borderTopStyle },
		borderTopColor: { text: "borderTopColor", type: cellFormatProperties.borderTopColor },
		borderBottomStyle: { text: "borderBottomStyle", type: cellFormatProperties.borderBottomStyle },
		borderBottomColor: { text: "borderBottomColor", type: cellFormatProperties.borderBottomColor },
		borderLeftStyle: { text: "borderLeftStyle", type: cellFormatProperties.borderLeftStyle },
		borderLeftColor: { text: "borderLeftColor", type: cellFormatProperties.borderLeftColor },
		borderRightStyle: { text: "borderRightStyle", type: cellFormatProperties.borderRightStyle },
		borderRightColor: { text: "borderRightColor", type: cellFormatProperties.borderRightColor },
		borderOutlineStyle: { text: "borderOutlineStyle", type: cellFormatProperties.borderOutlineStyle },
		borderOutlineColor: { text: "borderOutlineColor", type: cellFormatProperties.borderOutlineColor },
		borderInlineStyle: { text: "borderInlineStyle", type: cellFormatProperties.borderInlineStyle },
		borderInlineColor: { text: "borderInlineColor", type: cellFormatProperties.borderInlineColor },
		fontFamily: { text: "fontFamily", type: cellFormatProperties.fontFamily },
		fontStyle: { text: "fontStyle", type: cellFormatProperties.fontStyle },
		fontSize: { text: "fontSize", type: cellFormatProperties.fontSize },
		fontUnderlineStyle: { text: "fontUnderlineStyle", type: cellFormatProperties.fontUnderlineStyle },
		fontColor: { text: "fontColor", type: cellFormatProperties.fontColor },
		fontDirection: { text: "fontDirection", type: cellFormatProperties.fontDirection },
		fontStrikethrough: { text: "fontStrikethrough", type: cellFormatProperties.fontStrikethrough },
		fontSuperscript: { text: "fontSuperscript", type: cellFormatProperties.fontSuperscript },
		fontSubscript: { text: "fontSubscript", type: cellFormatProperties.fontSubscript },
		fontNormal: { text: "fontNormal", type: cellFormatProperties.fontNormal },
		indentLeft: { text: "indentLeft", type: cellFormatProperties.indentLeft },
		indentRight: { text: "indentRight", type: cellFormatProperties.indentRight },
		numberFormat: { text: "numberFormat", type: cellFormatProperties.numberFormat },
		width: { text: "width", type: cellFormatProperties.width },
		height: { text: "height", type: cellFormatProperties.height },
		wrapping: { text: "wrapping", type: cellFormatProperties.wrapping }
	};
	var borderStyleSet=[
		{ name: "none", value: borderStyleType.none },
		{ name: "thin", value: borderStyleType.thin },
		{ name: "medium", value: borderStyleType.medium },
		{ name: "dashed", value: borderStyleType.dashed },
		{ name: "dotted", value: borderStyleType.dotted },
		{ name: "thick", value: borderStyleType.thick },
		{ name: "double", value: borderStyleType.double },
		{ name: "hair", value: borderStyleType.hair },
		{ name: "medium dashed", value: borderStyleType.mediumDashed },
		{ name: "dash dot", value: borderStyleType.dashDot },
		{ name: "medium dash dot", value: borderStyleType.mediumDashDot },
		{ name: "dash dot dot", value: borderStyleType.dashDotDot },
		{ name: "medium dash dot dot", value: borderStyleType.mediumDashDotDot },
		{ name: "slant dash dot", value: borderStyleType.slantDashDot },
	];
	var colorSet=[
		{ name: "none", value: colorType.none },
		{ name: "black", value: colorType.black },
		{ name: "blue", value: colorType.blue },
		{ name: "gray", value: colorType.gray },
		{ name: "green", value: colorType.green },
		{ name: "orange", value: colorType.orange },
		{ name: "pink", value: colorType.pink },
		{ name: "purple", value: colorType.purple },
		{ name: "red", value: colorType.red },
		{ name: "teal", value: colorType.teal },
		{ name: "turquoise", value: colorType.turquoise },
		{ name: "violet", value: colorType.violet },
		{ name: "white", value: colorType.white },
		{ name: "yellow", value: colorType.yellow },
		{ name: "automatic", value: colorType.automatic },
	];
	ns.define({
		type: formatProperties.alignHorizontal.text,
		toHost: [
			{ name: "general", value: alignHorizontalType.general },
			{ name: "left", value: alignHorizontalType.left },
			{ name: "center", value: alignHorizontalType.center },
			{ name: "right", value: alignHorizontalType.right },
			{ name: "fill", value: alignHorizontalType.fill },
			{ name: "justify", value: alignHorizontalType.justify },
			{ name: "center across selection", value: alignHorizontalType.centerAcrossSelection },
			{ name: "distributed", value: alignHorizontalType.distributed },
		]
	});
	ns.define({
		type: formatProperties.alignVertical.text,
		toHost: [
			{ name: "top", value: alignVerticalType.top },
			{ name: "center", value: alignVerticalType.center },
			{ name: "bottom", value: alignVerticalType.bottom },
			{ name: "justify", value: alignVerticalType.justify },
			{ name: "distributed", value: alignVerticalType.distributed },
		]
	});
	ns.define({
		type: formatProperties.backgroundColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderTopStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderTopColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderBottomStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderBottomColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderLeftStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderLeftColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderRightStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderRightColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderOutlineStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderOutlineColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderInlineStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderInlineColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.fontStyle.text,
		toHost: [
			{ name: "regular", value: fontStyleType.regular },
			{ name: "italic", value: fontStyleType.italic },
			{ name: "bold", value: fontStyleType.bold },
			{ name: "bold italic", value: fontStyleType.boldItalic },
		]
	});
	ns.define({
		type: formatProperties.fontUnderlineStyle.text,
		toHost: [
			{ name: "none", value: fontUnderlineStyleType.none },
			{ name: "single", value: fontUnderlineStyleType.single },
			{ name: "double", value: fontUnderlineStyleType.double },
			{ name: "single accounting", value: fontUnderlineStyleType.singleAccounting },
			{ name: "double accounting", value: fontUnderlineStyleType.doubleAccounting },
		]
	});
	ns.define({
		type: formatProperties.fontColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.fontDirection.text,
		toHost: [
			{ name: "context", value: fontDirectionType.context },
			{ name: "left-to-right", value: fontDirectionType.leftToRight },
			{ name: "right-to-left", value: fontDirectionType.rightToLeft },
		]
	});
	ns.define({
		type: formatProperties.width.text,
		toHost: [
			{ name: "auto fit", value: widthType.autoFit },
		]
	});
	ns.define({
		type: formatProperties.height.text,
		toHost: [
			{ name: "auto fit", value: heightType.autoFit },
		]
	});
	ns.define({
		type: hostParameters.TableOptions,
		toHost: [
			{ name: "headerRow", value: tableOptionProperties.headerRow },
			{ name: "bandedRows", value: tableOptionProperties.bandedRows },
			{ name: "firstColumn", value: tableOptionProperties.firstColumn },
			{ name: "lastColumn", value: tableOptionProperties.lastColumn },
			{ name: "bandedColumns", value: tableOptionProperties.bandedCoumns },
			{ name: "filterButton", value: tableOptionProperties.filterButton },
			{ name: "style", value: tableOptionProperties.style },
			{ name: "totalRow", value: tableOptionProperties.totalRow }
		]
	});
	ns.dynamicTypes[hostParameters.CellFormat]={
		toHost: function (data) {
			for (var entry in data) {
				if (data[entry].format) {
					data[entry].format=ns.doMapValues(data[entry].format, "toHost");
				}
			}
			return data;
		},
		fromHost: function (args) {
			return args;
		}
	};
	ns.setDynamicType(hostParameters.CellFormat, {
		toHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_CellFormat$toHost(cellFormats) {
			var textCells="cells";
			var textFormat="format";
			var posCells=0;
			var posFormat=1;
			var ret=[];
			for (var index in cellFormats) {
				var cfOld=cellFormats[index];
				var cfNew=[];
				if (typeof (cfOld[textCells]) !=="undefined") {
					var cellsOld=cfOld[textCells];
					var cellsNew;
					if (typeof cfOld[textCells]==="object") {
						cellsNew=[];
						for (var entry in cellsOld) {
							if (typeof (cellProperties[entry]) !=="undefined") {
								cellsNew[cellProperties[entry]]=cellsOld[entry];
							}
						}
					}
					else {
						cellsNew=cellsOld;
					}
					cfNew[posCells]=cellsNew;
				}
				if (cfOld[textFormat]) {
					var formatOld=cfOld[textFormat];
					var formatNew=[];
					for (var entry2 in formatOld) {
						if (typeof (formatProperties[entry2]) !=="undefined") {
							formatNew.push([
								formatProperties[entry2].type,
								formatOld[entry2]
							]);
						}
					}
					cfNew[posFormat]=formatNew;
				}
				ret[index]=cfNew;
			}
			return ret;
		},
		fromHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_CellFormat$fromHost(hostArgs) {
			return hostArgs;
		}
	});
	ns.setDynamicType(hostParameters.TableOptions, {
		toHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_TableOptions$toHost(tableOptions) {
			var ret=[];
			for (var entry in tableOptions) {
				if (typeof (tableOptionProperties[entry]) !="undefined") {
					ret[tableOptionProperties[entry]]=tableOptions[entry];
				}
			}
			return ret;
		},
		fromHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_TableOptions$fromHost(hostArgs) {
			return hostArgs;
		}
	});
	alignHorizontalType=null;
	alignVerticalType=null;
	borderStyleType=null;
	cellFormatProperties=null;
	colorType=null;
	fontDirectionType=null;
	fontStyleType=null;
	fontUnderlineStyleType=null;
	heightType=null;
	hostKeys=null;
	widthType=null;
})(AgaveFormatAPI || (AgaveFormatAPI={}));
OSF.DDA.AsyncMethodNames.addNames({
	ExecuteRichApiRequestAsync: "executeRichApiRequestAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync,
	requiredArguments: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Data,
			types: ["object"]
		}
	],
	supportedOptions: []
});
OSF.OUtil.setNamespace("RichApi", OSF.DDA);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidExecuteRichApiRequestMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.ArrayData }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { RichApiMessage: "richApiMessage" });
OSF.DDA.RichApiMessageEventArgs=function OSF_DDA_RichApiMessageEventArgs(eventType, eventProperties) {
	var entryArray=eventProperties[Microsoft.Office.WebExtension.Parameters.Data];
	var entries=[];
	if (entryArray) {
		for (var i=0; i < entryArray.length; i++) {
			var elem=entryArray[i];
			if (elem.toArray) {
				elem=elem.toArray();
			}
			entries.push({
				messageCategory: elem[0],
				messageType: elem[1],
				targetId: elem[2],
				message: elem[3],
				id: elem[4],
				isRemoteOverride: elem[5]
			});
		}
	}
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": { value: Microsoft.Office.WebExtension.EventType.RichApiMessage },
		"entries": { value: entries }
	});
};
var OfficeExt;
(function (OfficeExt) {
	var RichApiMessageManager=(function () {
		function RichApiMessageManager() {
			this._eventDispatch=null;
			this._eventDispatch=new OSF.EventDispatch([
				Microsoft.Office.WebExtension.EventType.RichApiMessage,
			]);
			OSF.DDA.DispIdHost.addEventSupport(this, this._eventDispatch);
		}
		return RichApiMessageManager;
	})();
	OfficeExt.RichApiMessageManager=RichApiMessageManager;
})(OfficeExt || (OfficeExt={}));
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidRichApiMessageEvent,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.ArrayData }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.ArrayData }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.FilterType, { OnlyVisible: "onlyVisible" });
var OfficeExt;
(function (OfficeExt) {
	var AppCommand;
	(function (AppCommand) {
		var AppCommandManager=(function () {
			function AppCommandManager() {
				var _this=this;
				this._pseudoDocument=null;
				this._eventDispatch=null;
				this._processAppCommandInvocation=function (args) {
					var verifyResult=_this._verifyManifestCallback(args.callbackName);
					if (verifyResult.errorCode !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						_this._invokeAppCommandCompletedMethod(args.appCommandId, verifyResult.errorCode, "");
						return;
					}
					var eventObj=_this._constructEventObjectForCallback(args);
					if (eventObj) {
						window.setTimeout(function () { verifyResult.callback(eventObj); }, 0);
					}
					else {
						_this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError, "");
					}
				};
			}
			AppCommandManager.initializeOsfDda=function () {
				OSF.DDA.AsyncMethodNames.addNames({
					AppCommandInvocationCompletedAsync: "appCommandInvocationCompletedAsync"
				});
				OSF.DDA.AsyncMethodCalls.define({
					method: OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
					requiredArguments: [{
							"name": Microsoft.Office.WebExtension.Parameters.Id,
							"types": ["string"]
						},
						{
							"name": Microsoft.Office.WebExtension.Parameters.Status,
							"types": ["number"]
						},
						{
							"name": Microsoft.Office.WebExtension.Parameters.AppCommandInvocationCompletedData,
							"types": ["string"]
						}
					]
				});
				OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
					AppCommandInvokedEvent: "AppCommandInvokedEvent"
				});
				OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
					AppCommandInvoked: "appCommandInvoked"
				});
				OSF.OUtil.setNamespace("AppCommand", OSF.DDA);
				OSF.DDA.AppCommand.AppCommandInvokedEventArgs=OfficeExt.AppCommand.AppCommandInvokedEventArgs;
			};
			AppCommandManager.prototype.initializeAndChangeOnce=function (callback) {
				AppCommand.registerDdaFacade();
				this._pseudoDocument={};
				OSF.DDA.DispIdHost.addAsyncMethods(this._pseudoDocument, [
					OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
				]);
				this._eventDispatch=new OSF.EventDispatch([
					Microsoft.Office.WebExtension.EventType.AppCommandInvoked,
				]);
				var onRegisterCompleted=function (result) {
					if (callback) {
						if (result.status=="succeeded") {
							callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
						}
						else {
							callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
						}
					}
				};
				OSF.DDA.DispIdHost.addEventSupport(this._pseudoDocument, this._eventDispatch);
				this._pseudoDocument.addHandlerAsync(Microsoft.Office.WebExtension.EventType.AppCommandInvoked, this._processAppCommandInvocation, onRegisterCompleted);
			};
			AppCommandManager.prototype._verifyManifestCallback=function (callbackName) {
				var defaultResult={ callback: null, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCallback };
				callbackName=callbackName.trim();
				try {
					var callList=callbackName.split(".");
					var parentObject=window;
					for (var i=0; i < callList.length - 1; i++) {
						if (parentObject[callList[i]] && (typeof parentObject[callList[i]]=="object" || typeof parentObject[callList[i]]=="function")) {
							parentObject=parentObject[callList[i]];
						}
						else {
							return defaultResult;
						}
					}
					var callbackFunc=parentObject[callList[callList.length - 1]];
					if (typeof callbackFunc !="function") {
						return defaultResult;
					}
				}
				catch (e) {
					return defaultResult;
				}
				return { callback: callbackFunc, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess };
			};
			AppCommandManager.prototype._invokeAppCommandCompletedMethod=function (appCommandId, resultCode, data) {
				this._pseudoDocument.appCommandInvocationCompletedAsync(appCommandId, resultCode, data);
			};
			AppCommandManager.prototype._constructEventObjectForCallback=function (args) {
				var _this=this;
				var eventObj=new AppCommandCallbackEventArgs();
				try {
					var jsonData=JSON.parse(args.eventObjStr);
					this._translateEventObjectInternal(jsonData, eventObj);
					Object.defineProperty(eventObj, 'completed', {
						value: function (completedContext) {
							eventObj.completedContext=completedContext;
							var jsonString=JSON.stringify(eventObj);
							_this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess, jsonString);
						},
						enumerable: true
					});
				}
				catch (e) {
					eventObj=null;
				}
				return eventObj;
			};
			AppCommandManager.prototype._translateEventObjectInternal=function (input, output) {
				for (var key in input) {
					if (!input.hasOwnProperty(key))
						continue;
					var inputChild=input[key];
					if (typeof inputChild=="object" && inputChild !=null) {
						OSF.OUtil.defineEnumerableProperty(output, key, {
							value: {}
						});
						this._translateEventObjectInternal(inputChild, output[key]);
					}
					else {
						Object.defineProperty(output, key, {
							value: inputChild,
							enumerable: true,
							writable: true
						});
					}
				}
			};
			AppCommandManager.prototype._constructObjectByTemplate=function (template, input) {
				var output={};
				if (!template || !input)
					return output;
				for (var key in template) {
					if (template.hasOwnProperty(key)) {
						output[key]=null;
						if (input[key] !=null) {
							var templateChild=template[key];
							var inputChild=input[key];
							var inputChildType=typeof inputChild;
							if (typeof templateChild=="object" && templateChild !=null) {
								output[key]=this._constructObjectByTemplate(templateChild, inputChild);
							}
							else if (inputChildType=="number" || inputChildType=="string" || inputChildType=="boolean") {
								output[key]=inputChild;
							}
						}
					}
				}
				return output;
			};
			AppCommandManager.instance=function () {
				if (AppCommandManager._instance==null) {
					AppCommandManager._instance=new AppCommandManager();
				}
				return AppCommandManager._instance;
			};
			AppCommandManager._instance=null;
			return AppCommandManager;
		})();
		AppCommand.AppCommandManager=AppCommandManager;
		var AppCommandInvokedEventArgs=(function () {
			function AppCommandInvokedEventArgs(appCommandId, callbackName, eventObjStr) {
				this.type=Microsoft.Office.WebExtension.EventType.AppCommandInvoked;
				this.appCommandId=appCommandId;
				this.callbackName=callbackName;
				this.eventObjStr=eventObjStr;
			}
			AppCommandInvokedEventArgs.create=function (eventProperties) {
				return new AppCommandInvokedEventArgs(eventProperties[AppCommand.AppCommandInvokedEventEnums.AppCommandId], eventProperties[AppCommand.AppCommandInvokedEventEnums.CallbackName], eventProperties[AppCommand.AppCommandInvokedEventEnums.EventObjStr]);
			};
			return AppCommandInvokedEventArgs;
		})();
		AppCommand.AppCommandInvokedEventArgs=AppCommandInvokedEventArgs;
		var AppCommandCallbackEventArgs=(function () {
			function AppCommandCallbackEventArgs() {
			}
			return AppCommandCallbackEventArgs;
		})();
		AppCommand.AppCommandCallbackEventArgs=AppCommandCallbackEventArgs;
		AppCommand.AppCommandInvokedEventEnums={
			AppCommandId: "appCommandId",
			CallbackName: "callbackName",
			EventObjStr: "eventObjStr"
		};
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.AppCommand.AppCommandManager.initializeOsfDda();
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("AppCommand", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys) {
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["AppCommandId"]=0]="AppCommandId";
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["CallbackName"]=1]="CallbackName";
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["EventObjStr"]=2]="EventObjStr";
})(OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys={}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys=OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
var OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys) {
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Id"]=0]="Id";
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Status"]=1]="Status";
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Data"]=2]="Data";
})(OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys={}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys=OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
var OfficeExt;
(function (OfficeExt) {
	var AppCommand;
	(function (AppCommand) {
		function registerDdaFacade() {
			if (OSF.DDA.WAC) {
				var parameterMap=OSF.DDA.WAC.Delegate.ParameterMap;
				parameterMap.define({
					type: OSF.DDA.MethodDispId.dispidAppCommandInvocationCompletedMethod,
					toHost: [
						{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Id },
						{ name: Microsoft.Office.WebExtension.Parameters.Status, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Status },
						{ name: Microsoft.Office.WebExtension.Parameters.AppCommandInvocationCompletedData, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Data }
					]
				});
				parameterMap.define({
					type: OSF.DDA.EventDispId.dispidAppCommandInvokedEvent,
					fromHost: [
						{ name: OSF.DDA.EventDescriptors.AppCommandInvokedEvent, value: parameterMap.self }
					]
				});
				parameterMap.addComplexType(OSF.DDA.EventDescriptors.AppCommandInvokedEvent);
				parameterMap.define({
					type: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
					fromHost: [
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.AppCommandId, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.AppCommandId },
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.CallbackName, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.CallbackName },
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.EventObjStr, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.EventObjStr },
					]
				});
			}
		}
		AppCommand.registerDdaFacade=registerDdaFacade;
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}));
})(OfficeExt || (OfficeExt={}));
OSF.DialogShownStatus={ hasDialogShown: false, isWindowDialog: false };
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
	DialogMessageReceivedEvent: "DialogMessageReceivedEvent"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	DialogMessageReceived: "dialogMessageReceived",
	DialogEventReceived: "dialogEventReceived"
});
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	MessageType: "messageType",
	MessageContent: "messageContent"
});
OSF.DDA.DialogEventType={};
OSF.OUtil.augmentList(OSF.DDA.DialogEventType, {
	DialogClosed: "dialogClosed",
	NavigationFailed: "naviationFailed"
});
OSF.DDA.AsyncMethodNames.addNames({
	DisplayDialogAsync: "displayDialogAsync",
	CloseAsync: "close"
});
OSF.DDA.SyncMethodNames.addNames({
	MessageParent: "messageParent",
	AddMessageHandler: "addEventHandler",
	SendMessage: "sendMessage"
});
OSF.DDA.UI.ParentUI=function OSF_DDA_ParentUI() {
	var eventDispatch=new OSF.EventDispatch([
		Microsoft.Office.WebExtension.EventType.DialogMessageReceived,
		Microsoft.Office.WebExtension.EventType.DialogEventReceived,
		Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
	]);
	var openDialogName=OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
	var target=this;
	if (!target[openDialogName]) {
		OSF.OUtil.defineEnumerableProperty(target, openDialogName, {
			value: function () {
				var openDialog=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
				openDialog(arguments, eventDispatch, target);
			}
		});
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DDA.UI.ChildUI=function OSF_DDA_ChildUI(isPopupWindow) {
	var messageParentName=OSF.DDA.SyncMethodNames.MessageParent.displayName;
	var target=this;
	if (!target[messageParentName]) {
		OSF.OUtil.defineEnumerableProperty(target, messageParentName, {
			value: function () {
				var messageParent=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
				return messageParent(arguments, target);
			}
		});
	}
	var addEventHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
	if (!target[addEventHandler] && typeof OSF.DialogParentMessageEventDispatch !="undefined") {
		OSF.DDA.DispIdHost.addEventSupport(target, OSF.DialogParentMessageEventDispatch, isPopupWindow);
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DialogHandler=function OSF_DialogHandler() { };
OSF.DDA.DialogEventArgs=function OSF_DDA_DialogEventArgs(message) {
	if (message[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogMessageReceived) {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived
			},
			"message": {
				value: message[OSF.DDA.PropertyDescriptors.MessageContent]
			}
		});
	}
	else {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogEventReceived
			},
			"error": {
				value: message[OSF.DDA.PropertyDescriptors.MessageType]
			}
		});
	}
};
OSF.DDA.DialogParentEventArgs=function OSF_DDA_DialogParentEventArgs(message) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
		},
		"message": {
			value: message[OSF.DDA.PropertyDescriptors.MessageContent]
		}
	});
};
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.Url,
			"types": ["string"]
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Width,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.Height,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.RequireHTTPs,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.DisplayInIframe,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.HideTitle,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.UseDeviceIndependentPixels,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		}
	],
	privateStateCallbacks: [],
	onSucceeded: function (args, caller, callArgs) {
		var targetId=args[Microsoft.Office.WebExtension.Parameters.Id];
		var eventDispatch=args[Microsoft.Office.WebExtension.Parameters.Data];
		var dialog=new OSF.DialogHandler();
		var closeDialog=OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, closeDialog, {
			value: function () {
				var closeDialogfunction=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
				closeDialogfunction(arguments, targetId, eventDispatch, dialog);
			}
		});
		var addHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, addHandler, {
			value: function () {
				var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
				var callArgs=syncMethodCall.verifyAndExtractCall(arguments, dialog, eventDispatch);
				var eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
				var handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
				return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType, handler);
			}
		});
		var sendMessage=OSF.DDA.SyncMethodNames.SendMessage.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, sendMessage, {
			value: function () {
				var execute=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.SendMessage];
				return execute(arguments, eventDispatch, dialog);
			}
		});
		return dialog;
	},
	checkCallArgs: function (callArgs, caller, stateInfo) {
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=1;
		}
		if (!callArgs[Microsoft.Office.WebExtension.Parameters.UseDeviceIndependentPixels] && callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=99;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=1;
		}
		if (!callArgs[Microsoft.Office.WebExtension.Parameters.UseDeviceIndependentPixels] && callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=99;
		}
		if (!callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs]) {
			callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs]=true;
		}
		return callArgs;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.CloseAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.MessageParent,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.MessageToParent,
			"types": ["string", "number", "boolean"]
		}
	],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.AddMessageHandler,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.SendMessage,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.MessageContent,
			"types": ["string"]
		}
	],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("Dialog", OSF.DDA.Marshaling);
OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys={
	MessageType: "messageType",
	MessageContent: "messageContent"
};
OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys={
	MessageType: "messageType",
	MessageContent: "messageContent"
};
OSF.DDA.Marshaling.MessageParentKeys={
	MessageToParent: "messageToParent"
};
OSF.DDA.Marshaling.DialogNotificationShownEventType={
	DialogNotificationShown: "dialogNotificationShown"
};
OSF.DDA.Marshaling.SendMessageKeys={
	MessageContent: "messageContent"
};
var OfficeExt;
(function (OfficeExt) {
	var WacCommonUICssManager;
	(function (WacCommonUICssManager) {
		var hostType={
			Excel: "excel",
			Word: "word",
			PowerPoint: "powerpoint",
			Outlook: "outlook"
		};
		function getDialogCssManager(applicationHostType) {
			switch (applicationHostType) {
				case hostType.Excel:
				case hostType.Word:
				case hostType.PowerPoint:
				case hostType.Outlook:
					return new DefaultDialogCSSManager();
				default:
					return new DefaultDialogCSSManager();
			}
			return null;
		}
		WacCommonUICssManager.getDialogCssManager=getDialogCssManager;
		var DefaultDialogCSSManager=(function () {
			function DefaultDialogCSSManager() {
				this.overlayElementCSS=[
					"position: absolute",
					"top: 0",
					"left: 0",
					"width: 100%",
					"height: 100%",
					"background-color: rgba(198, 198, 198, 0.5)",
					"z-index: 99998"
				];
				this.dialogNotificationPanelCSS=[
					"width: 100%",
					"height: 190px",
					"position: absolute",
					"z-index: 99999",
					"background-color: rgba(255, 255, 255, 1)",
					"left: 0px",
					"top: 50%",
					"margin-top: -95px"
				];
				this.newWindowNotificationTextPanelCSS=[
					"margin: 20px 14px",
					"font-family: Segoe UI,Arial,Verdana,sans-serif",
					"font-size: 14px",
					"height: 100px",
					"line-height: 100px"
				];
				this.newWindowNotificationTextSpanCSS=[
					"display: inline-block",
					"line-height: normal",
					"vertical-align: middle"
				];
				this.crossZoneNotificationTextPanelCSS=[
					"margin: 20px 14px",
					"font-family: Segoe UI,Arial,Verdana,sans-serif",
					"font-size: 14px",
					"height: 100px",
				];
				this.dialogNotificationButtonPanelCSS="margin:0px 9px";
				this.buttonStyleCSS=[
					"text-align: center",
					"width: 70px",
					"height: 25px",
					"font-size: 14px",
					"font-family: Segoe UI,Arial,Verdana,sans-serif",
					"margin: 0px 5px",
					"border-width: 1px",
					"border-style: solid"
				];
			}
			DefaultDialogCSSManager.prototype.getOverlayElementCSS=function () {
				return this.overlayElementCSS.join(";");
			};
			DefaultDialogCSSManager.prototype.getDialogNotificationPanelCSS=function () {
				return this.dialogNotificationPanelCSS.join(";");
			};
			DefaultDialogCSSManager.prototype.getNewWindowNotificationTextPanelCSS=function () {
				return this.newWindowNotificationTextPanelCSS.join(";");
			};
			DefaultDialogCSSManager.prototype.getNewWindowNotificationTextSpanCSS=function () {
				return this.newWindowNotificationTextSpanCSS.join(";");
			};
			DefaultDialogCSSManager.prototype.getCrossZoneNotificationTextPanelCSS=function () {
				return this.crossZoneNotificationTextPanelCSS.join(";");
			};
			DefaultDialogCSSManager.prototype.getDialogNotificationButtonPanelCSS=function () {
				return this.dialogNotificationButtonPanelCSS;
			};
			DefaultDialogCSSManager.prototype.getDialogButtonCSS=function () {
				return this.buttonStyleCSS.join(";");
			};
			return DefaultDialogCSSManager;
		})();
		WacCommonUICssManager.DefaultDialogCSSManager=DefaultDialogCSSManager;
	})(WacCommonUICssManager=OfficeExt.WacCommonUICssManager || (OfficeExt.WacCommonUICssManager={}));
})(OfficeExt || (OfficeExt={}));
var OfficeExt;
(function (OfficeExt) {
	var AddinNativeAction;
	(function (AddinNativeAction) {
		var Dialog;
		(function (Dialog) {
			var windowInstance=null;
			var handler=null;
			var overlayElement=null;
			var dialogNotificationPanel=null;
			var closeDialogKey="osfDialogInternal:action=closeDialog";
			var showDialogCallback=null;
			var hasCrossZoneNotification=false;
			var checkWindowDialogCloseInterval=-1;
			var messageParentKey="messageParentKey";
			var hostThemeButtonStyle=null;
			var commonButtonBorderColor="#ababab";
			var commonButtonBackgroundColor="#ffffff";
			var commonEventInButtonBackgroundColor="#ccc";
			var newWindowNotificationId="newWindowNotificaiton";
			var crossZoneNotificationId="crossZoneNotification";
			var configureBrowserLinkId="configureBrowserLink";
			var dialogNotificationTextPanelId="dialogNotificationTextPanel";
			var shouldUseLocalStorageToPassMessage=OfficeExt.WACUtils.shouldUseLocalStorageToPassMessage();
			var registerDialogNotificationShownArgs={
				"dispId": OSF.DDA.EventDispId.dispidDialogNotificationShownInAddinEvent,
				"eventType": OSF.DDA.Marshaling.DialogNotificationShownEventType.DialogNotificationShown,
				"onComplete": null
			};
			function setHostThemeButtonStyle(args) {
				var hostThemeButtonStyleArgs=args.input;
				if (hostThemeButtonStyleArgs !=null) {
					hostThemeButtonStyle={
						HostButtonBorderColor: hostThemeButtonStyleArgs[OSF.HostThemeButtonStyleKeys.ButtonBorderColor],
						HostButtonBackgroundColor: hostThemeButtonStyleArgs[OSF.HostThemeButtonStyleKeys.ButtonBackgroundColor]
					};
				}
				args.completed();
			}
			Dialog.setHostThemeButtonStyle=setHostThemeButtonStyle;
			function removeEventListenersForDialog(args) {
				OSF._OfficeAppFactory.getInitializationHelper().addOrRemoveEventListenersForWindow(false);
				args.completed();
			}
			Dialog.removeEventListenersForDialog=removeEventListenersForDialog;
			function handleNewWindowDialog(dialogInfo) {
				try {
					if (OSF._OfficeAppFactory.getInitializationHelper()._appContext._skipNewWindowNotification) {
						showDialog(dialogInfo);
						return;
					}
					hasCrossZoneNotification=false;
					var ignoreButtonKeyDownClick=false;
					var hostInfoObj=OSF._OfficeAppFactory.getInitializationHelper()._hostInfo;
					var dialogCssManager=OfficeExt.WacCommonUICssManager.getDialogCssManager(hostInfoObj.hostType);
					var notificationText=OSF.OUtil.formatString(Strings.OfficeOM.L_ShowWindowDialogNotification, OSF._OfficeAppFactory.getInitializationHelper()._appContext._addinName);
					overlayElement=createOverlayElement(dialogCssManager);
					document.body.insertBefore(overlayElement, document.body.firstChild);
					dialogNotificationPanel=createNotificationPanel(dialogCssManager, notificationText);
					dialogNotificationPanel.id=newWindowNotificationId;
					var dialogNotificationButtonPanel=createButtonPanel(dialogCssManager);
					var allowButton=createButtonControl(dialogCssManager, Strings.OfficeOM.L_ShowWindowDialogNotificationAllow);
					var ignoreButton=createButtonControl(dialogCssManager, Strings.OfficeOM.L_ShowWindowDialogNotificationIgnore);
					dialogNotificationButtonPanel.appendChild(allowButton);
					dialogNotificationButtonPanel.appendChild(ignoreButton);
					dialogNotificationPanel.appendChild(dialogNotificationButtonPanel);
					document.body.insertBefore(dialogNotificationPanel, document.body.firstChild);
					allowButton.onclick=function () {
						showDialog(dialogInfo);
						if (!hasCrossZoneNotification) {
							dismissDialogNotification();
						}
					};
					function ignoreButtonClickEventHandler() {
						function unregisterDialogNotificationShownEventCallback(status) {
							removeDialogNotificationElement();
							setFocusOnFirstElement(status);
							showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore);
						}
						registerDialogNotificationShownArgs.onComplete=unregisterDialogNotificationShownEventCallback;
						OSF.DDA.WAC.Delegate.unregisterEventAsync(registerDialogNotificationShownArgs);
					}
					ignoreButton.onclick=ignoreButtonClickEventHandler;
					allowButton.addEventListener("keydown", function (event) {
						if (event.shiftKey && event.keyCode==9) {
							handleButtonControlEventOut(allowButton);
							handleButtonControlEventIn(ignoreButton);
							ignoreButton.focus();
							event.preventDefault();
							event.stopPropagation();
						}
					}, false);
					ignoreButton.addEventListener("keydown", function (event) {
						if (!event.shiftKey && event.keyCode==9) {
							handleButtonControlEventOut(ignoreButton);
							handleButtonControlEventIn(allowButton);
							allowButton.focus();
							event.preventDefault();
							event.stopPropagation();
						}
						else if (event.keyCode==13) {
							ignoreButtonKeyDownClick=true;
							event.preventDefault();
							event.stopPropagation();
						}
					}, false);
					ignoreButton.addEventListener("keyup", function (event) {
						if (event.keyCode==13 && ignoreButtonKeyDownClick) {
							ignoreButtonKeyDownClick=false;
							ignoreButtonClickEventHandler();
							event.preventDefault();
							event.stopPropagation();
						}
					}, false);
					window.focus();
					function registerDialogNotificationShownEventCallback(status) {
						allowButton.focus();
					}
					registerDialogNotificationShownArgs.onComplete=registerDialogNotificationShownEventCallback;
					OSF.DDA.WAC.Delegate.registerEventAsync(registerDialogNotificationShownArgs);
				}
				catch (e) {
					if (OSF.AppTelemetry) {
						OSF.AppTelemetry.logAppException("Exception happens at new window dialog."+e);
					}
					showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				}
			}
			Dialog.handleNewWindowDialog=handleNewWindowDialog;
			function closeDialog(callback) {
				try {
					if (windowInstance !=null) {
						var appDomains=OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
						if (appDomains) {
							for (var i=0; i < appDomains.length && appDomains[i].indexOf("://") !==-1; i++) {
								windowInstance.postMessage(closeDialogKey, appDomains[i]);
							}
						}
						if (windowInstance !=null && !windowInstance.closed) {
							windowInstance.close();
						}
						if (shouldUseLocalStorageToPassMessage) {
							window.removeEventListener("storage", storageChangedHandler);
						}
						else {
							window.removeEventListener("message", receiveMessage);
						}
						window.clearInterval(checkWindowDialogCloseInterval);
						windowInstance=null;
						callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
					}
					else {
						callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
					}
				}
				catch (e) {
					if (OSF.AppTelemetry) {
						OSF.AppTelemetry.logAppException("Exception happens at close window dialog."+e);
					}
					callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				}
			}
			Dialog.closeDialog=closeDialog;
			function messageParent(params) {
				var message=params.hostCallArgs[Microsoft.Office.WebExtension.Parameters.MessageToParent];
				if (shouldUseLocalStorageToPassMessage) {
					try {
						var messageKey=OSF._OfficeAppFactory.getInitializationHelper()._webAppState.id+messageParentKey;
						window.localStorage.setItem(messageKey, message);
					}
					catch (e) {
						if (OSF.AppTelemetry) {
							OSF.AppTelemetry.logAppException("Error happened during messageParent method:"+e);
						}
					}
				}
				else {
					var appDomains=OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
					if (appDomains) {
						for (var i=0; i < appDomains.length && appDomains[i].indexOf("://") !==-1; i++) {
							window.opener.postMessage(message, appDomains[i]);
						}
					}
				}
			}
			Dialog.messageParent=messageParent;
			function sendMessage(params) {
				if (windowInstance !=null) {
					var message=params.hostCallArgs, appDomains=OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
					if (appDomains) {
						for (var i=0; i < appDomains.length && appDomains[i].indexOf("://") !==-1; i++) {
							if (typeof message !="string") {
								message=JSON.stringify(message);
							}
							windowInstance.postMessage(message, appDomains[i]);
						}
					}
				}
			}
			Dialog.sendMessage=sendMessage;
			function registerMessageReceivedEvent() {
				function receiveCloseDialogMessage(event) {
					if (event.source==window.opener) {
						if (typeof event.data==="string" && event.data.indexOf(closeDialogKey) > -1) {
							window.close();
						}
						else {
							var messageContent=event.data, type=typeof messageContent;
							if (messageContent && (type=="object" || type=="string")) {
								if (type=="string") {
									messageContent=JSON.parse(messageContent);
								}
								var eventArgs=OSF.DDA.OMFactory.manufactureEventArgs(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived, null, messageContent);
								OSF.DialogParentMessageEventDispatch.fireEvent(eventArgs);
							}
						}
					}
				}
				window.addEventListener("message", receiveCloseDialogMessage);
			}
			Dialog.registerMessageReceivedEvent=registerMessageReceivedEvent;
			function setHandlerAndShowDialogCallback(onEventHandler, callback) {
				handler=onEventHandler;
				showDialogCallback=callback;
			}
			Dialog.setHandlerAndShowDialogCallback=setHandlerAndShowDialogCallback;
			function escDismissDialogNotification() {
				try {
					if (dialogNotificationPanel && (dialogNotificationPanel.id==newWindowNotificationId) && showDialogCallback) {
						showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore);
					}
				}
				catch (e) {
					if (OSF.AppTelemetry) {
						OSF.AppTelemetry.logAppException("Error happened during executing displayDialogAsync callback."+e);
					}
				}
				dismissDialogNotification();
			}
			Dialog.escDismissDialogNotification=escDismissDialogNotification;
			function showCrossZoneNotification(windowUrl, hostType) {
				var okButtonKeyDownClick=false;
				var dialogCssManager=OfficeExt.WacCommonUICssManager.getDialogCssManager(hostType);
				overlayElement=createOverlayElement(dialogCssManager);
				document.body.insertBefore(overlayElement, document.body.firstChild);
				dialogNotificationPanel=createNotificationPanelForCrossZoneIssue(dialogCssManager, windowUrl);
				dialogNotificationPanel.id=crossZoneNotificationId;
				var dialogNotificationButtonPanel=createButtonPanel(dialogCssManager);
				var okButton=createButtonControl(dialogCssManager, Strings.OfficeOM.L_DialogOK ? Strings.OfficeOM.L_DialogOK : "OK");
				dialogNotificationButtonPanel.appendChild(okButton);
				dialogNotificationPanel.appendChild(dialogNotificationButtonPanel);
				document.body.insertBefore(dialogNotificationPanel, document.body.firstChild);
				hasCrossZoneNotification=true;
				okButton.onclick=function () {
					dismissDialogNotification();
				};
				okButton.addEventListener("keydown", function (event) {
					if (event.keyCode==9) {
						document.getElementById(configureBrowserLinkId).focus();
						event.preventDefault();
						event.stopPropagation();
					}
					else if (event.keyCode==13) {
						okButtonKeyDownClick=true;
						event.preventDefault();
						event.stopPropagation();
					}
				}, false);
				okButton.addEventListener("keyup", function (event) {
					if (event.keyCode==13 && okButtonKeyDownClick) {
						okButtonKeyDownClick=false;
						dismissDialogNotification();
						event.preventDefault();
						event.stopPropagation();
					}
				}, false);
				document.getElementById(configureBrowserLinkId).addEventListener("keydown", function (event) {
					if (event.keyCode==9) {
						okButton.focus();
						event.preventDefault();
						event.stopPropagation();
					}
				}, false);
				window.focus();
				okButton.focus();
			}
			Dialog.showCrossZoneNotification=showCrossZoneNotification;
			function receiveMessage(event) {
				if (event.source==windowInstance) {
					try {
						var dialogMessageReceivedArgs={};
						dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType]=OSF.DialogMessageType.DialogMessageReceived;
						dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent]=event.data;
						handler(dialogMessageReceivedArgs);
					}
					catch (e) {
						if (OSF.AppTelemetry) {
							OSF.AppTelemetry.logAppException("Error happened during receive message handler."+e);
						}
					}
				}
			}
			function storageChangedHandler(event) {
				var messageKey=OSF._OfficeAppFactory.getInitializationHelper()._webAppState.id+messageParentKey;
				if (event.key==messageKey) {
					try {
						var dialogMessageReceivedArgs={};
						dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType]=OSF.DialogMessageType.DialogMessageReceived;
						dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent]=event.newValue;
						handler(dialogMessageReceivedArgs);
					}
					catch (e) {
						if (OSF.AppTelemetry) {
							OSF.AppTelemetry.logAppException("Error happened during storage changed handler."+e);
						}
					}
				}
			}
			function showDialog(dialogInfo) {
				var hostInfoObj=OSF._OfficeAppFactory.getInitializationHelper()._hostInfo;
				var hostInfoVals=[
					hostInfoObj.hostType,
					hostInfoObj.hostPlatform,
					hostInfoObj.hostSpecificFileVersion,
					hostInfoObj.hostLocale,
					hostInfoObj.osfControlAppCorrelationId,
					"isDialog"
				];
				var hostInfo=hostInfoVals.join("|");
				var appContext=OSF._OfficeAppFactory.getInitializationHelper()._appContext;
				var windowUrl=dialogInfo[OSF.ShowWindowDialogParameterKeys.Url];
				windowUrl=OfficeExt.WACUtils.addHostInfoAsQueryParam(windowUrl, hostInfo);
				var windowName=JSON.parse(window.name);
				windowName[OSF.WindowNameItemKeys.HostInfo]=hostInfo;
				windowName[OSF.WindowNameItemKeys.AppContext]=appContext;
				var width=dialogInfo[OSF.ShowWindowDialogParameterKeys.Width] * screen.width / 100;
				var height=dialogInfo[OSF.ShowWindowDialogParameterKeys.Height] * screen.height / 100;
				var left=appContext._clientWindowWidth / 2 - width / 2;
				var top=appContext._clientWindowHeight / 2 - height / 2;
				var windowSpecs="width="+width+", height="+height+", left="+left+", top="+top+",channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no";
				windowInstance=window.open(windowUrl, OfficeExt.WACUtils.serializeObjectToString(windowName), windowSpecs);
				if (windowInstance==null) {
					OSF.AppTelemetry.logAppCommonMessage("Encountered cross zone issue in displayDialogAsync api.");
					removeDialogNotificationElement();
					showCrossZoneNotification(windowUrl, hostInfoObj.hostType);
					showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeCrossZone);
					return;
				}
				if (shouldUseLocalStorageToPassMessage) {
					window.addEventListener("storage", storageChangedHandler);
				}
				else {
					window.addEventListener("message", receiveMessage);
				}
				function checkWindowClose() {
					try {
						if (windowInstance==null || windowInstance.closed) {
							window.clearInterval(checkWindowDialogCloseInterval);
							if (shouldUseLocalStorageToPassMessage) {
								window.removeEventListener("storage", storageChangedHandler);
							}
							else {
								window.removeEventListener("message", receiveMessage);
							}
							var dialogClosedArgs={};
							dialogClosedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType]=OSF.DialogMessageType.DialogClosed;
							handler(dialogClosedArgs);
						}
					}
					catch (e) {
						if (OSF.AppTelemetry) {
							OSF.AppTelemetry.logAppException("Error happened during check or handle window close."+e);
						}
					}
				}
				checkWindowDialogCloseInterval=window.setInterval(checkWindowClose, 1000);
				if (showDialogCallback !=null) {
					showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
				}
				else {
					if (OSF.AppTelemetry) {
						OSF.AppTelemetry.logAppException("showDialogCallback can not be null.");
					}
				}
			}
			function createButtonControl(dialogCssManager, buttonValue) {
				var buttonControl=document.createElement("input");
				buttonControl.setAttribute("type", "button");
				buttonControl.style.cssText=dialogCssManager.getDialogButtonCSS();
				buttonControl.style.borderColor=commonButtonBorderColor;
				buttonControl.style.backgroundColor=commonButtonBackgroundColor;
				buttonControl.setAttribute("value", buttonValue);
				var buttonControlEventInHandler=function () {
					handleButtonControlEventIn(buttonControl);
				};
				var buttonControlEventOutHandler=function () {
					handleButtonControlEventOut(buttonControl);
				};
				buttonControl.addEventListener("mouseover", buttonControlEventInHandler);
				buttonControl.addEventListener("focus", buttonControlEventInHandler);
				buttonControl.addEventListener("mouseout", buttonControlEventOutHandler);
				buttonControl.addEventListener("focusout", buttonControlEventOutHandler);
				return buttonControl;
			}
			function handleButtonControlEventIn(buttonControl) {
				if (hostThemeButtonStyle !=null) {
					buttonControl.style.borderColor=hostThemeButtonStyle.HostButtonBorderColor;
					buttonControl.style.backgroundColor=hostThemeButtonStyle.HostButtonBackgroundColor;
				}
				else if (OSF.CommonUI && OSF.CommonUI.HostButtonBorderColor && OSF.CommonUI.HostButtonBackgroundColor) {
					buttonControl.style.borderColor=OSF.CommonUI.HostButtonBorderColor;
					buttonControl.style.backgroundColor=OSF.CommonUI.HostButtonBackgroundColor;
				}
				else {
					buttonControl.style.backgroundColor=commonEventInButtonBackgroundColor;
				}
			}
			function handleButtonControlEventOut(buttonControl) {
				buttonControl.style.borderColor=commonButtonBorderColor;
				buttonControl.style.backgroundColor=commonButtonBackgroundColor;
			}
			function dismissDialogNotification() {
				function unregisterDialogNotificationShownEventCallback(status) {
					removeDialogNotificationElement();
					setFocusOnFirstElement(status);
				}
				registerDialogNotificationShownArgs.onComplete=unregisterDialogNotificationShownEventCallback;
				OSF.DDA.WAC.Delegate.unregisterEventAsync(registerDialogNotificationShownArgs);
			}
			function removeDialogNotificationElement() {
				if (dialogNotificationPanel !=null) {
					document.body.removeChild(dialogNotificationPanel);
					dialogNotificationPanel=null;
				}
				if (overlayElement !=null) {
					document.body.removeChild(overlayElement);
					overlayElement=null;
				}
			}
			function createOverlayElement(dialogCssManager) {
				var overlayElement=document.createElement("div");
				overlayElement.style.cssText=dialogCssManager.getOverlayElementCSS();
				return overlayElement;
			}
			function createNotificationPanel(dialogCssManager, notificationString) {
				var dialogNotificationPanel=document.createElement("div");
				dialogNotificationPanel.style.cssText=dialogCssManager.getDialogNotificationPanelCSS();
				setAttributeForDialogNotificationPanel(dialogNotificationPanel);
				var dialogNotificationTextPanel=document.createElement("div");
				dialogNotificationTextPanel.style.cssText=dialogCssManager.getNewWindowNotificationTextPanelCSS();
				dialogNotificationTextPanel.id=dialogNotificationTextPanelId;
				if (document.documentElement.getAttribute("dir")=="rtl") {
					dialogNotificationTextPanel.style.paddingRight="30px";
				}
				else {
					dialogNotificationTextPanel.style.paddingLeft="30px";
				}
				var dialogNotificationTextSpan=document.createElement("span");
				dialogNotificationTextSpan.style.cssText=dialogCssManager.getNewWindowNotificationTextSpanCSS();
				dialogNotificationTextSpan.innerText=notificationString;
				dialogNotificationTextPanel.appendChild(dialogNotificationTextSpan);
				dialogNotificationPanel.appendChild(dialogNotificationTextPanel);
				return dialogNotificationPanel;
			}
			function createButtonPanel(dialogCssManager) {
				var dialogNotificationButtonPanel=document.createElement("div");
				dialogNotificationButtonPanel.style.cssText=dialogCssManager.getDialogNotificationButtonPanelCSS();
				if (document.documentElement.getAttribute("dir")=="rtl") {
					dialogNotificationButtonPanel.style.cssFloat="left";
				}
				else {
					dialogNotificationButtonPanel.style.cssFloat="right";
				}
				return dialogNotificationButtonPanel;
			}
			function setFocusOnFirstElement(status) {
				if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					var list=document.querySelectorAll(OSF._OfficeAppFactory.getInitializationHelper()._tabbableElements);
					OSF.OUtil.focusToFirstTabbable(list, false);
				}
			}
			function createNotificationPanelForCrossZoneIssue(dialogCssManager, windowUrl) {
				var dialogNotificationPanel=document.createElement("div");
				dialogNotificationPanel.style.cssText=dialogCssManager.getDialogNotificationPanelCSS();
				setAttributeForDialogNotificationPanel(dialogNotificationPanel);
				var dialogNotificationTextPanel=document.createElement("div");
				dialogNotificationTextPanel.style.cssText=dialogCssManager.getCrossZoneNotificationTextPanelCSS();
				dialogNotificationTextPanel.id=dialogNotificationTextPanelId;
				var configureBrowserLink=document.createElement("a");
				configureBrowserLink.id=configureBrowserLinkId;
				configureBrowserLink.href="#";
				configureBrowserLink.innerText=Strings.OfficeOM.L_NewWindowCrossZoneConfigureBrowserLink;
				configureBrowserLink.setAttribute("onclick", "window.open('https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings', '_blank', 'fullscreen=1')");
				var dialogNotificationTextSpan=document.createElement("span");
				if (Strings.OfficeOM.L_NewWindowCrossZone) {
					dialogNotificationTextSpan.innerHTML=OSF.OUtil.formatString(Strings.OfficeOM.L_NewWindowCrossZone, configureBrowserLink.outerHTML, OfficeExt.WACUtils.getDomainForUrl(windowUrl));
				}
				dialogNotificationTextPanel.appendChild(dialogNotificationTextSpan);
				dialogNotificationPanel.appendChild(dialogNotificationTextPanel);
				return dialogNotificationPanel;
			}
			function setAttributeForDialogNotificationPanel(dialogNotificationDiv) {
				dialogNotificationDiv.setAttribute("role", "dialog");
				dialogNotificationDiv.setAttribute("aria-describedby", dialogNotificationTextPanelId);
			}
		})(Dialog=AddinNativeAction.Dialog || (AddinNativeAction.Dialog={}));
	})(AddinNativeAction=OfficeExt.AddinNativeAction || (OfficeExt.AddinNativeAction={}));
})(OfficeExt || (OfficeExt={}));
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.DialogMessageReceivedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.MessageType, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType },
		{ name: OSF.DDA.PropertyDescriptors.MessageContent, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDialogParentMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.MessageType, value: OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys.MessageType },
		{ name: OSF.DDA.PropertyDescriptors.MessageContent, value: OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys.MessageContent }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidMessageParentMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.MessageToParent, value: OSF.DDA.Marshaling.MessageParentKeys.MessageToParent }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSendMessageMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.MessageContent, value: OSF.DDA.Marshaling.SendMessageKeys.MessageContent }
	]
});
OSF.DDA.WAC.Delegate.openDialog=function OSF_DDA_WAC_Delegate$OpenDialog(args) {
	var httpsIdentifyString="https://";
	var httpIdentifyString="http://";
	var dialogInfo=JSON.parse(args.targetId);
	var callback=OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args);
	function showDialogCallback(status) {
		var payload={ "Error": status };
		try {
			callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
		}
		catch (e) {
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.logAppException("Exception happens at showDialogCallback."+e);
			}
		}
	}
	if (OSF.DialogShownStatus.hasDialogShown) {
		showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened);
		return;
	}
	var dialogUrl=dialogInfo[OSF.ShowWindowDialogParameterKeys.Url].toLowerCase();
	if (dialogUrl==null || !(dialogUrl.substr(0, httpsIdentifyString.length)===httpsIdentifyString)) {
		if (dialogUrl.substr(0, httpIdentifyString.length)===httpIdentifyString) {
			showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS);
		}
		else {
			showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme);
		}
		return;
	}
	if (!dialogInfo[OSF.ShowWindowDialogParameterKeys.DisplayInIframe]) {
		OSF.DialogShownStatus.isWindowDialog=true;
		OfficeExt.AddinNativeAction.Dialog.setHandlerAndShowDialogCallback(function OSF_DDA_WACDelegate$RegisterEventAsync_OnEvent(payload) {
			if (args.onEvent) {
				args.onEvent(payload);
			}
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.onEventDone(args.dispId);
			}
		}, showDialogCallback);
		OfficeExt.AddinNativeAction.Dialog.handleNewWindowDialog(dialogInfo);
	}
	else {
		OSF.DialogShownStatus.isWindowDialog=false;
		OSF.DDA.WAC.Delegate.registerEventAsync(args);
	}
};
OSF.DDA.WAC.Delegate.messageParent=function OSF_DDA_WAC_Delegate$MessageParent(args) {
	if (window.opener !=null) {
		OfficeExt.AddinNativeAction.Dialog.messageParent(args);
	}
	else {
		OSF.DDA.WAC.Delegate.executeAsync(args);
	}
};
OSF.DDA.WAC.Delegate.sendMessage=function OSF_DDA_WAC_Delegate$SendMessage(args) {
	if (OSF.DialogShownStatus.hasDialogShown) {
		if (OSF.DialogShownStatus.isWindowDialog) {
			OfficeExt.AddinNativeAction.Dialog.sendMessage(args);
		}
		else {
			OSF.DDA.WAC.Delegate.executeAsync(args);
		}
	}
};
OSF.DDA.WAC.Delegate.closeDialog=function OSF_DDA_WAC_Delegate$CloseDialog(args) {
	var callback=OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args);
	function closeDialogCallback(status) {
		var payload={ "Error": status };
		try {
			callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
		}
		catch (e) {
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.logAppException("Exception happens at closeDialogCallback."+e);
			}
		}
	}
	if (!OSF.DialogShownStatus.hasDialogShown) {
		closeDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeWebDialogClosed);
	}
	else {
		if (OSF.DialogShownStatus.isWindowDialog) {
			if (args.onCalling) {
				args.onCalling();
			}
			OfficeExt.AddinNativeAction.Dialog.closeDialog(closeDialogCallback);
		}
		else {
			OSF.DDA.WAC.Delegate.unregisterEventAsync(args);
		}
	}
};
OSF.InitializationHelper.prototype.dismissDialogNotification=function OSF_InitializationHelper$dismissDialogNotification() {
	OfficeExt.AddinNativeAction.Dialog.escDismissDialogNotification();
};
OSF.InitializationHelper.prototype.registerMessageReceivedEventForWindowDialog=function OSF_InitializationHelper$registerMessageReceivedEventForWindowDialog() {
	OfficeExt.AddinNativeAction.Dialog.registerMessageReceivedEvent();
};
OSF.DDA.AsyncMethodNames.addNames({ GetAccessTokenAsync: "getAccessTokenAsync" });
OSF.DDA.Auth=function OSF_DDA_Auth() {
};
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetAccessTokenAsync,
	requiredArguments: [],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.ForceConsent,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.ForceAddAccount,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.AuthChallenge,
			value: {
				"types": ["string"],
				"defaultValue": ""
			}
		}
	],
	onSucceeded: function (dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		return data;
	}
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("SingleSignOn", OSF.DDA.Marshaling);
OSF.DDA.Marshaling.SingleSignOn.GetAccessTokenKeys={
	ForceConsent: "forceConsent",
	ForceAddAccount: "forceAddAccount",
	AuthChallenge: "authChallenge"
};
OSF.DDA.Marshaling.SingleSignOn.AccessTokenResultKeys={
	AccessToken: "accessToken"
};
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetAccessTokenMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.ForceConsent, value: OSF.DDA.Marshaling.SingleSignOn.GetAccessTokenKeys.ForceConsent },
		{ name: Microsoft.Office.WebExtension.Parameters.ForceAddAccount, value: OSF.DDA.Marshaling.SingleSignOn.GetAccessTokenKeys.ForceAddAccount },
		{ name: Microsoft.Office.WebExtension.Parameters.AuthChallenge, value: OSF.DDA.Marshaling.SingleSignOn.GetAccessTokenKeys.AuthChallenge }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.SingleSignOn.AccessTokenResultKeys.AccessToken }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.setDynamicType(Microsoft.Office.WebExtension.Parameters.Data, (function () {
	var tableRows="Rows";
	var tableHeaders="Headers";
	return {
		toHost: function OSF_DDA_XLS_Delegate_SpecialProcessor_Data$toHost(data) {
			if (typeof data !="string" && data[OSF.DDA.TableDataProperties.TableRows] !==undefined) {
				var tableData={};
				tableData[tableRows]=data[OSF.DDA.TableDataProperties.TableRows];
				tableData[tableHeaders]=data[OSF.DDA.TableDataProperties.TableHeaders];
				data=tableData;
			}
			else if (OSF.DDA.DataCoercion.determineCoercionType(data)==Microsoft.Office.WebExtension.CoercionType.Text) {
				data=[[data]];
			}
			return data;
		},
		fromHost: function OSF_DDA_XLS_Delegate_SpecialProcessor_Data$fromHost(hostArgs) {
			var ret;
			if (hostArgs[tableRows] !=undefined) {
				ret={};
				ret[OSF.DDA.TableDataProperties.TableRows]=hostArgs[tableRows];
				ret[OSF.DDA.TableDataProperties.TableHeaders]=hostArgs[tableHeaders];
			}
			else {
				ret=hostArgs;
			}
			return ret;
		}
	};
})());
OSF.DDA.ExcelDocument=function Microsoft_Office_WebExtension_ExcelDocument(officeAppContext, settings) {
	var bf=new OSF.DDA.BindingFacade(this);
	OSF.DDA.DispIdHost.addAsyncMethods(bf, [OSF.DDA.AsyncMethodNames.AddFromPromptAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GoToByIdAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync]);
	OSF.DDA.ExcelDocument.uber.constructor.call(this, officeAppContext, bf, settings);
	if (this.mode==OSF.ClientMode.ReadOnly) {
		this.url=document.URL;
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.ExcelDocument, OSF.DDA.JsomDocument);
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM=function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
	OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
	appContext.doc=new OSF.DDA.ExcelDocument(appContext, this._initializeSettings(appContext, true));
	OSF.DDA.DispIdHost.addAsyncMethods(OSF.DDA.RichApi, [OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync]);
	OSF.DDA.RichApi.richApiMessageManager=new OfficeExt.RichApiMessageManager();
	appReady();
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize=function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
	this.prepareApiSurface(appContext);
	Microsoft.Office.WebExtension.initialize(this.getInitializationReason(appContext));
};
OSF.InitializationHelper.prototype.prepareApiSurface=function OSF_InitializationHelper$prepareApiSurfaceAndInitialize(appContext) {
	OSF.WebApp._UpdateLinksForHostAndXdmInfo();
	var license=new OSF.DDA.License(appContext.get_eToken());
	this.initWebDialog(appContext);
	this.initWebAuth(appContext);
	OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license));
	var getDelegateMethods=OSF.DDA.WAC.getDelegateMethods;
	var parameterMap=OSF.DDA.WAC.Delegate.ParameterMap;
	OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods, parameterMap));
	var appCommandHandler=OfficeExt.AppCommand.AppCommandManager.instance();
	appCommandHandler.initializeAndChangeOnce();
};
OSF.InitializationHelper.prototype.getInitializationReason=function (appContext) { return appContext.get_reason(); };

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var OfficeExtension;
(function (OfficeExtension) {
	var Action=(function () {
		function Action(actionInfo, isWriteOperation, isRestrictedResourceAccess) {
			this.m_actionInfo=actionInfo;
			this.m_isWriteOperation=isWriteOperation;
			this.m_isRestrictedResourceAccess=isRestrictedResourceAccess;
		}
		Object.defineProperty(Action.prototype, "actionInfo", {
			get: function () {
				return this.m_actionInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Action.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Action.prototype, "isRestrictedResourceAccess", {
			get: function () {
				return this.m_isRestrictedResourceAccess;
			},
			enumerable: true,
			configurable: true
		});
		return Action;
	}());
	OfficeExtension.Action=Action;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var TraceMarkerActionResultHandler=(function () {
		function TraceMarkerActionResultHandler(callback) {
			this.m_callback=callback;
		}
		TraceMarkerActionResultHandler.prototype._handleResult=function (value) {
			if (this.m_callback) {
				this.m_callback();
			}
		};
		return TraceMarkerActionResultHandler;
	}());
	var ActionFactory=(function () {
		function ActionFactory() {
		}
		ActionFactory.createSetPropertyAction=function (context, parent, propertyName, value) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 4,
				Name: propertyName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var args=[value];
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			context._pendingRequest.ensureInstantiateObjectPaths(referencedArgumentObjectPaths);
			var ret=new OfficeExtension.Action(actionInfo, true, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			ret.referencedObjectPath=parent._objectPath;
			ret.referencedArgumentObjectPaths=referencedArgumentObjectPaths;
			return ret;
		};
		ActionFactory.createMethodAction=function (context, parent, methodName, operationType, args, isRestrictedResourceAccess) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 3,
				Name: methodName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			context._pendingRequest.ensureInstantiateObjectPaths(referencedArgumentObjectPaths);
			var isWriteOperation=operationType !=1;
			var ret=new OfficeExtension.Action(actionInfo, isWriteOperation, isRestrictedResourceAccess);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			ret.referencedObjectPath=parent._objectPath;
			ret.referencedArgumentObjectPaths=referencedArgumentObjectPaths;
			return ret;
		};
		ActionFactory.createQueryAction=function (context, parent, queryOption) {
			OfficeExtension.Utility.validateObjectPath(parent);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 2,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			actionInfo.QueryInfo=queryOption;
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			ret.referencedObjectPath=parent._objectPath;
			return ret;
		};
		ActionFactory.createRecursiveQueryAction=function (context, parent, query) {
			OfficeExtension.Utility.validateObjectPath(parent);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 6,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				RecursiveQueryInfo: query
			};
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			ret.referencedObjectPath=parent._objectPath;
			return ret;
		};
		ActionFactory.createQueryAsJsonAction=function (context, parent, queryOption) {
			OfficeExtension.Utility.validateObjectPath(parent);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 7,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			actionInfo.QueryInfo=queryOption;
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			ret.referencedObjectPath=parent._objectPath;
			return ret;
		};
		ActionFactory.createEnsureUnchangedAction=function (context, parent, objectState) {
			OfficeExtension.Utility.validateObjectPath(parent);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 8,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ObjectState: objectState
			};
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			ret.referencedObjectPath=parent._objectPath;
			return ret;
		};
		ActionFactory.createUpdateAction=function (context, parent, objectState) {
			OfficeExtension.Utility.validateObjectPath(parent);
			context._pendingRequest.ensureInstantiateObjectPath(parent._objectPath);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 9,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ObjectState: objectState
			};
			var ret=new OfficeExtension.Action(actionInfo, true, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			ret.referencedObjectPath=parent._objectPath;
			return ret;
		};
		ActionFactory.createInstantiateAction=function (context, obj) {
			OfficeExtension.Utility.validateObjectPath(obj);
			context._pendingRequest.ensureInstantiateObjectPath(obj._objectPath.parentObjectPath);
			context._pendingRequest.ensureInstantiateObjectPaths(obj._objectPath.argumentObjectPaths);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 1,
				Name: "",
				ObjectPathId: obj._objectPath.objectPathInfo.Id
			};
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			ret.referencedObjectPath=obj._objectPath;
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(obj._objectPath);
			context._pendingRequest.addActionResultHandler(ret, new OfficeExtension.InstantiateActionResultHandler(obj));
			return ret;
		};
		ActionFactory.createTraceAction=function (context, message, addTraceMessage) {
			var actionInfo={
				Id: context._nextId(),
				ActionType: 5,
				Name: "Trace",
				ObjectPathId: 0
			};
			var ret=new OfficeExtension.Action(actionInfo, false, false);
			context._pendingRequest.addAction(ret);
			if (addTraceMessage) {
				context._pendingRequest.addTrace(actionInfo.Id, message);
			}
			return ret;
		};
		ActionFactory.createTraceMarkerForCallback=function (context, callback) {
			var action=ActionFactory.createTraceAction(context, null, false);
			context._pendingRequest.addActionResultHandler(action, new TraceMarkerActionResultHandler(callback));
		};
		return ActionFactory;
	}());
	OfficeExtension.ActionFactory=ActionFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientObject=(function () {
		function ClientObject(context, objectPath) {
			OfficeExtension.Utility.checkArgumentNull(context, "context");
			this.m_context=context;
			this.m_objectPath=objectPath;
			if (this.m_objectPath) {
				if (!context._processingResult) {
					OfficeExtension.ActionFactory.createInstantiateAction(context, this);
					if ((context._autoCleanup) && (this._KeepReference)) {
						context.trackedObjects._autoAdd(this);
					}
				}
			}
		}
		Object.defineProperty(ClientObject.prototype, "context", {
			get: function () {
				return this.m_context;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_objectPath", {
			get: function () {
				return this.m_objectPath;
			},
			set: function (value) {
				this.m_objectPath=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "isNull", {
			get: function () {
				OfficeExtension.Utility.throwIfNotLoaded("isNull", this._isNull, null, this._isNull);
				return this._isNull;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "isNullObject", {
			get: function () {
				OfficeExtension.Utility.throwIfNotLoaded("isNullObject", this._isNull, null, this._isNull);
				return this._isNull;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_isNull", {
			get: function () {
				return this.m_isNull;
			},
			set: function (value) {
				this.m_isNull=value;
				if (value && this.m_objectPath) {
					this.m_objectPath._updateAsNullObject();
				}
			},
			enumerable: true,
			configurable: true
		});
		ClientObject.prototype._handleResult=function (value) {
			this._isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			this.context.trackedObjects._autoTrackIfNecessaryWhenHandleObjectResultValue(this, value);
		};
		ClientObject.prototype._handleIdResult=function (value) {
			this._isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			OfficeExtension.Utility.fixObjectPathIfNecessary(this, value);
			this.context.trackedObjects._autoTrackIfNecessaryWhenHandleObjectResultValue(this, value);
		};
		ClientObject.prototype._handleRetrieveResult=function (value, result) {
			this._handleIdResult(value);
		};
		ClientObject.prototype._recursivelySet=function (input, options, scalarWriteablePropertyNames, objectPropertyNames, notAllowedToBeSetPropertyNames) {
			var isClientObject=(input instanceof ClientObject);
			var originalInput=input;
			if (isClientObject) {
				if (Object.getPrototypeOf(this)===Object.getPrototypeOf(input)) {
					input=JSON.parse(JSON.stringify(input));
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError({
						argumentName: 'properties',
						errorLocation: this._className+".set"
					});
				}
			}
			try {
				var prop;
				for (var i=0; i < scalarWriteablePropertyNames.length; i++) {
					prop=scalarWriteablePropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						if (typeof input[prop] !=="undefined") {
							this[prop]=input[prop];
						}
					}
				}
				for (var i=0; i < objectPropertyNames.length; i++) {
					prop=objectPropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						if (typeof input[prop] !=="undefined") {
							var dataToPassToSet=isClientObject ? originalInput[prop] : input[prop];
							this[prop].set(dataToPassToSet, options);
						}
					}
				}
				var throwOnReadOnly=!isClientObject;
				if (options && !OfficeExtension.Utility.isNullOrUndefined(throwOnReadOnly)) {
					throwOnReadOnly=options.throwOnReadOnly;
				}
				for (var i=0; i < notAllowedToBeSetPropertyNames.length; i++) {
					prop=notAllowedToBeSetPropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						if (typeof input[prop] !=="undefined" && throwOnReadOnly) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.cannotApplyPropertyThroughSetMethod, prop),
								debugInfo: {
									errorLocation: prop
								}
							});
						}
					}
				}
				for (prop in input) {
					if (scalarWriteablePropertyNames.indexOf(prop) < 0 && objectPropertyNames.indexOf(prop) < 0) {
						var propertyDescriptor=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), prop);
						if (!propertyDescriptor) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.propertyDoesNotExist, prop),
								debugInfo: {
									errorLocation: prop
								}
							});
						}
						if (throwOnReadOnly && !propertyDescriptor.set) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.attemptingToSetReadOnlyProperty, prop),
								debugInfo: {
									errorLocation: prop
								}
							});
						}
					}
				}
			}
			catch (innerError) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidArgument,
					message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgument, 'properties'),
					debugInfo: {
						errorLocation: this._className+".set"
					},
					innerError: innerError
				});
			}
		};
		ClientObject.prototype._recursivelyUpdate=function (properties) {
			var shouldPolyfill=OfficeExtension._internalConfig.alwaysPolyfillClientObjectUpdateMethod;
			if (!shouldPolyfill) {
				shouldPolyfill=!OfficeExtension.Utility.isSetSupported("RichApiRuntime", "1.2");
			}
			try {
				var scalarPropNames=this[OfficeExtension.Constants.scalarPropertyNames];
				if (!scalarPropNames) {
					scalarPropNames=[];
				}
				var scalarPropUpdatable=this[OfficeExtension.Constants.scalarPropertyUpdateable];
				if (!scalarPropUpdatable) {
					scalarPropUpdatable=[];
					for (var i=0; i < scalarPropNames.length; i++) {
						scalarPropUpdatable.push(false);
					}
				}
				var navigationPropNames=this[OfficeExtension.Constants.navigationPropertyNames];
				if (!navigationPropNames) {
					navigationPropNames=[];
				}
				var scalarProps={};
				var navigationProps={};
				var scalarPropCount=0;
				for (var propName in properties) {
					var index=scalarPropNames.indexOf(propName);
					if (index >=0) {
						if (!scalarPropUpdatable[index]) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.attemptingToSetReadOnlyProperty, propName),
								debugInfo: {
									errorLocation: propName
								}
							});
						}
						scalarProps[propName]=properties[propName];
++scalarPropCount;
					}
					else if (navigationPropNames.indexOf(propName) >=0) {
						navigationProps[propName]=properties[propName];
					}
					else {
						throw new OfficeExtension._Internal.RuntimeError({
							code: OfficeExtension.ErrorCodes.invalidArgument,
							message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.propertyDoesNotExist, propName),
							debugInfo: {
								errorLocation: propName
							}
						});
					}
				}
				if (scalarPropCount > 0) {
					if (shouldPolyfill) {
						for (var i=0; i < scalarPropNames.length; i++) {
							var propName=scalarPropNames[i];
							var propValue=scalarProps[propName];
							if (!OfficeExtension.Utility.isUndefined(propValue)) {
								OfficeExtension.ActionFactory.createSetPropertyAction(this.context, this, propName, propValue);
							}
						}
					}
					else {
						OfficeExtension.ActionFactory.createUpdateAction(this.context, this, scalarProps);
					}
				}
				for (var propName in navigationProps) {
					var navigationPropProxy=this[propName];
					var navigationPropValue=navigationProps[propName];
					navigationPropProxy._recursivelyUpdate(navigationPropValue);
				}
			}
			catch (innerError) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidArgument,
					message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgument, 'properties'),
					debugInfo: {
						errorLocation: this._className+".update"
					},
					innerError: innerError
				});
			}
		};
		return ClientObject;
	}());
	OfficeExtension.ClientObject=ClientObject;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientRequest=(function () {
		function ClientRequest(context) {
			this.m_context=context;
			this.m_actions=[];
			this.m_actionResultHandler={};
			this.m_referencedObjectPaths={};
			this.m_instantiatedObjectPaths={};
			this.m_flags=0;
			this.m_traceInfos={};
			this.m_pendingProcessEventHandlers=[];
			this.m_pendingEventHandlerActions={};
			this.m_responseTraceIds={};
			this.m_responseTraceMessages=[];
			this.m_preSyncPromises=[];
		}
		Object.defineProperty(ClientRequest.prototype, "flags", {
			get: function () {
				return this.m_flags;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "traceInfos", {
			get: function () {
				return this.m_traceInfos;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_responseTraceMessages", {
			get: function () {
				return this.m_responseTraceMessages;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_responseTraceIds", {
			get: function () {
				return this.m_responseTraceIds;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype._setResponseTraceIds=function (value) {
			if (value) {
				for (var i=0; i < value.length; i++) {
					var traceId=value[i];
					this.m_responseTraceIds[traceId]=traceId;
					var message=this.m_traceInfos[traceId];
					if (!OfficeExtension.Utility.isNullOrUndefined(message)) {
						this.m_responseTraceMessages.push(message);
					}
				}
			}
		};
		ClientRequest.prototype.addAction=function (action) {
			var isSafeAction=false;
			if (action.actionInfo.ActionType===1 &&
				action.referencedObjectPath.objectPathInfo.ObjectPathType===4) {
				isSafeAction=true;
			}
			if (!isSafeAction) {
				this.m_context.ensureInProgressBatchIfBatchMode();
			}
			if (action.isWriteOperation) {
				this.m_flags=this.m_flags | 1;
			}
			if (action.isRestrictedResourceAccess) {
				this.m_flags=this.m_flags | 2;
			}
			this.m_actions.push(action);
			if (action.actionInfo.ActionType==1) {
				this.m_instantiatedObjectPaths[action.actionInfo.ObjectPathId]=action;
			}
		};
		Object.defineProperty(ClientRequest.prototype, "hasActions", {
			get: function () {
				return this.m_actions.length > 0;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype._getLastAction=function () {
			return this.m_actions[this.m_actions.length - 1];
		};
		ClientRequest.prototype.addTrace=function (actionId, message) {
			this.m_traceInfos[actionId]=message;
		};
		ClientRequest.prototype.ensureInstantiateObjectPath=function (objectPath) {
			if (objectPath) {
				if (this.m_instantiatedObjectPaths[objectPath.objectPathInfo.Id]) {
					return;
				}
				this.ensureInstantiateObjectPath(objectPath.parentObjectPath);
				this.ensureInstantiateObjectPaths(objectPath.argumentObjectPaths);
				if (!this.m_instantiatedObjectPaths[objectPath.objectPathInfo.Id]) {
					var actionInfo={
						Id: this.m_context._nextId(),
						ActionType: 1,
						Name: "",
						ObjectPathId: objectPath.objectPathInfo.Id
					};
					var instantiateAction=new OfficeExtension.Action(actionInfo, false, false);
					instantiateAction.referencedObjectPath=objectPath;
					this.addReferencedObjectPath(objectPath);
					this.addAction(instantiateAction);
				}
			}
		};
		ClientRequest.prototype.ensureInstantiateObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					this.ensureInstantiateObjectPath(objectPaths[i]);
				}
			}
		};
		ClientRequest.prototype.addReferencedObjectPath=function (objectPath) {
			if (this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]) {
				return;
			}
			if (!objectPath.isValid) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidObjectPath,
					message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, OfficeExtension.Utility.getObjectPathExpression(objectPath)),
					debugInfo: {
						errorLocation: OfficeExtension.Utility.getObjectPathExpression(objectPath)
					}
				});
			}
			while (objectPath) {
				if (objectPath.isWriteOperation) {
					this.m_flags=this.m_flags | 1;
				}
				if (objectPath.isRestrictedResourceAccess) {
					this.m_flags=this.m_flags | 2;
				}
				this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]=objectPath;
				if (objectPath.objectPathInfo.ObjectPathType==3) {
					this.addReferencedObjectPaths(objectPath.argumentObjectPaths);
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		ClientRequest.prototype.addReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					this.addReferencedObjectPath(objectPaths[i]);
				}
			}
		};
		ClientRequest.prototype.addActionResultHandler=function (action, resultHandler) {
			this.m_actionResultHandler[action.actionInfo.Id]=resultHandler;
		};
		ClientRequest.prototype.buildRequestMessageBody=function () {
			if (OfficeExtension._internalConfig.enableEarlyDispose) {
				ClientRequest._calculateLastUsedObjectPathIds(this.m_actions);
			}
			var objectPaths={};
			for (var i in this.m_referencedObjectPaths) {
				objectPaths[i]=this.m_referencedObjectPaths[i].objectPathInfo;
			}
			var actions=[];
			for (var index=0; index < this.m_actions.length; index++) {
				actions.push(this.m_actions[index].actionInfo);
			}
			var ret={
				AutoKeepReference: this.m_context._autoCleanup,
				Actions: actions,
				ObjectPaths: objectPaths
			};
			return ret;
		};
		ClientRequest.prototype.processResponse=function (actionResults) {
			if (actionResults) {
				for (var i=0; i < actionResults.length; i++) {
					var actionResult=actionResults[i];
					var handler=this.m_actionResultHandler[actionResult.ActionId];
					if (handler) {
						handler._handleResult(actionResult.Value);
					}
				}
			}
		};
		ClientRequest.prototype.invalidatePendingInvalidObjectPaths=function () {
			for (var i in this.m_referencedObjectPaths) {
				if (this.m_referencedObjectPaths[i].isInvalidAfterRequest) {
					this.m_referencedObjectPaths[i].isValid=false;
				}
			}
		};
		ClientRequest.prototype._addPendingEventHandlerAction=function (eventHandlers, action) {
			if (!this.m_pendingEventHandlerActions[eventHandlers._id]) {
				this.m_pendingEventHandlerActions[eventHandlers._id]=[];
				this.m_pendingProcessEventHandlers.push(eventHandlers);
			}
			this.m_pendingEventHandlerActions[eventHandlers._id].push(action);
		};
		Object.defineProperty(ClientRequest.prototype, "_pendingProcessEventHandlers", {
			get: function () {
				return this.m_pendingProcessEventHandlers;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype._getPendingEventHandlerActions=function (eventHandlers) {
			return this.m_pendingEventHandlerActions[eventHandlers._id];
		};
		ClientRequest.prototype._addPreSyncPromise=function (value) {
			this.m_preSyncPromises.push(value);
		};
		Object.defineProperty(ClientRequest.prototype, "_preSyncPromises", {
			get: function () {
				return this.m_preSyncPromises;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_actions", {
			get: function () {
				return this.m_actions;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_objectPaths", {
			get: function () {
				return this.m_referencedObjectPaths;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest._updateLastUsedActionIdOfObjectPathId=function (lastUsedActionIdOfObjectPathId, objectPath, actionId) {
			while (objectPath) {
				if (lastUsedActionIdOfObjectPathId[objectPath.objectPathInfo.Id]) {
					return;
				}
				lastUsedActionIdOfObjectPathId[objectPath.objectPathInfo.Id]=actionId;
				var argumentObjectPaths=objectPath.argumentObjectPaths;
				if (argumentObjectPaths) {
					var argumentObjectPathsLength=argumentObjectPaths.length;
					for (var i=0; i < argumentObjectPathsLength; i++) {
						ClientRequest._updateLastUsedActionIdOfObjectPathId(lastUsedActionIdOfObjectPathId, argumentObjectPaths[i], actionId);
					}
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		ClientRequest._calculateLastUsedObjectPathIds=function (actions) {
			var lastUsedActionIdOfObjectPathId={};
			var actionsLength=actions.length;
			for (var index=actionsLength - 1; index >=0; --index) {
				var action=actions[index];
				var actionId=action.actionInfo.Id;
				if (action.referencedObjectPath) {
					ClientRequest._updateLastUsedActionIdOfObjectPathId(lastUsedActionIdOfObjectPathId, action.referencedObjectPath, actionId);
				}
				var referencedObjectPaths=action.referencedArgumentObjectPaths;
				if (referencedObjectPaths) {
					var referencedObjectPathsLength=referencedObjectPaths.length;
					for (var refIndex=0; refIndex < referencedObjectPathsLength; refIndex++) {
						ClientRequest._updateLastUsedActionIdOfObjectPathId(lastUsedActionIdOfObjectPathId, referencedObjectPaths[refIndex], actionId);
					}
				}
			}
			var lastUsedObjectPathIdsOfAction={};
			for (var key in lastUsedActionIdOfObjectPathId) {
				var actionId=lastUsedActionIdOfObjectPathId[key];
				var objectPathIds=lastUsedObjectPathIdsOfAction[actionId];
				if (!objectPathIds) {
					objectPathIds=[];
					lastUsedObjectPathIdsOfAction[actionId]=objectPathIds;
				}
				objectPathIds.push(parseInt(key));
			}
			for (var index=0; index < actionsLength; index++) {
				var action=actions[index];
				var lastUsedObjectPathIds=lastUsedObjectPathIdsOfAction[action.actionInfo.Id];
				if (lastUsedObjectPathIds && lastUsedObjectPathIds.length > 0) {
					action.actionInfo.L=lastUsedObjectPathIds;
				}
				else if (action.actionInfo.L) {
					delete action.actionInfo.L;
				}
			}
		};
		return ClientRequest;
	}());
	OfficeExtension.ClientRequest=ClientRequest;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	OfficeExtension._internalConfig={
		showDisposeInfoInDebugInfo: false,
		enableEarlyDispose: true,
		alwaysPolyfillClientObjectUpdateMethod: false,
		alwaysPolyfillClientObjectRetrieveMethod: false
	};
	var SessionBase=(function () {
		function SessionBase() {
		}
		SessionBase.prototype._resolveRequestUrlAndHeaderInfo=function () {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		SessionBase.prototype._createRequestExecutorOrNull=function () {
			return null;
		};
		Object.defineProperty(SessionBase.prototype, "eventRegistration", {
			get: function () {
				return OfficeExtension._Internal.officeJsEventRegistration;
			},
			enumerable: true,
			configurable: true
		});
		return SessionBase;
	}());
	OfficeExtension.SessionBase=SessionBase;
	var ClientRequestContext=(function () {
		function ClientRequestContext(url) {
			this.m_customRequestHeaders={};
			this._onRunFinishedNotifiers=[];
			this.m_nextId=0;
			if (ClientRequestContext._overrideSession) {
				this.m_requestUrlAndHeaderInfoResolver=ClientRequestContext._overrideSession;
			}
			else {
				if (OfficeExtension.Utility.isNullOrUndefined(url) || typeof (url)==="string" && url.length===0) {
					url=ClientRequestContext.defaultRequestUrlAndHeaders;
					if (!url) {
						url={ url: OfficeExtension.Constants.localDocument, headers: {} };
					}
				}
				if (typeof (url)==="string") {
					this.m_requestUrlAndHeaderInfo={ url: url, headers: {} };
				}
				else if (ClientRequestContext.isRequestUrlAndHeaderInfoResolver(url)) {
					this.m_requestUrlAndHeaderInfoResolver=url;
				}
				else if (ClientRequestContext.isRequestUrlAndHeaderInfo(url)) {
					var requestInfo=url;
					this.m_requestUrlAndHeaderInfo={ url: requestInfo.url, headers: {} };
					OfficeExtension.Utility._copyHeaders(requestInfo.headers, this.m_requestUrlAndHeaderInfo.headers);
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("url");
				}
			}
			if (this.m_requestUrlAndHeaderInfoResolver instanceof SessionBase) {
				this.m_session=this.m_requestUrlAndHeaderInfoResolver;
			}
			this.m_batchQueue=new OfficeExtension._Internal.OfficePromise(function (resolve, reject) { resolve(); });
			this._processingResult=false;
			this._customData=OfficeExtension.Constants.iterativeExecutor;
			this.sync=this.sync.bind(this);
		}
		Object.defineProperty(ClientRequestContext.prototype, "session", {
			get: function () {
				return this.m_session;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "eventRegistration", {
			get: function () {
				if (this.m_session) {
					return this.m_session.eventRegistration;
				}
				return OfficeExtension._Internal.officeJsEventRegistration;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "_url", {
			get: function () {
				if (this.m_requestUrlAndHeaderInfo) {
					return this.m_requestUrlAndHeaderInfo.url;
				}
				return null;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "_pendingRequest", {
			get: function () {
				if (this.m_pendingRequest==null) {
					this.m_pendingRequest=new OfficeExtension.ClientRequest(this);
				}
				return this.m_pendingRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "debugInfo", {
			get: function () {
				var prettyPrinter=new OfficeExtension.RequestPrettyPrinter(this._rootObjectPropertyName, this._pendingRequest._objectPaths, this._pendingRequest._actions, OfficeExtension._internalConfig.showDisposeInfoInDebugInfo);
				var statements=prettyPrinter.process();
				return { pendingStatements: statements };
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "trackedObjects", {
			get: function () {
				if (!this.m_trackedObjects) {
					this.m_trackedObjects=new OfficeExtension.TrackedObjects(this);
				}
				return this.m_trackedObjects;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "requestHeaders", {
			get: function () {
				return this.m_customRequestHeaders;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequestContext.prototype.ensureInProgressBatchIfBatchMode=function () {
			if (this._inRunBody && !this.m_explicitBatchInProgress) {
				throw OfficeExtension.Utility.createRuntimeError(OfficeExtension.ErrorCodes.generalException, OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.notInsideBatch), null);
			}
		};
		ClientRequestContext.prototype.load=function (clientObj, option) {
			OfficeExtension.Utility.validateContext(this, clientObj);
			var queryOption=ClientRequestContext._parseQueryOption(option);
			var action=OfficeExtension.ActionFactory.createQueryAction(this, clientObj, queryOption);
			this._pendingRequest.addActionResultHandler(action, clientObj);
		};
		ClientRequestContext.isLoadOption=function (loadOption) {
			if (!OfficeExtension.Utility.isUndefined(loadOption.select) && (typeof (loadOption.select)==="string" || Array.isArray(loadOption.select)))
				return true;
			if (!OfficeExtension.Utility.isUndefined(loadOption.expand) && (typeof (loadOption.expand)==="string" || Array.isArray(loadOption.expand)))
				return true;
			if (!OfficeExtension.Utility.isUndefined(loadOption.top) && typeof (loadOption.top)==="number")
				return true;
			if (!OfficeExtension.Utility.isUndefined(loadOption.skip) && typeof (loadOption.skip)==="number")
				return true;
			for (var i in loadOption) {
				return false;
			}
			return true;
		};
		ClientRequestContext.parseStrictLoadOption=function (option) {
			var ret={ Select: [] };
			ClientRequestContext.parseStrictLoadOptionHelper(ret, "", "option", option);
			return ret;
		};
		ClientRequestContext.combineQueryPath=function (pathPrefix, key, separator) {
			if (pathPrefix.length===0) {
				return key;
			}
			else {
				return pathPrefix+separator+key;
			}
		};
		ClientRequestContext.parseStrictLoadOptionHelper=function (queryInfo, pathPrefix, argPrefix, option) {
			for (var key in option) {
				var value=option[key];
				if (key==="$all") {
					if (typeof (value) !=="boolean") {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(ClientRequestContext.combineQueryPath(argPrefix, key, "."));
					}
					if (value) {
						queryInfo.Select.push(ClientRequestContext.combineQueryPath(pathPrefix, "*", "/"));
					}
				}
				else if (key==="$top") {
					if (typeof (value) !=="number" || pathPrefix.length > 0) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(ClientRequestContext.combineQueryPath(argPrefix, key, "."));
					}
					queryInfo.Top=value;
				}
				else if (key==="$skip") {
					if (typeof (value) !=="number" || pathPrefix.length > 0) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(ClientRequestContext.combineQueryPath(argPrefix, key, "."));
					}
					queryInfo.Skip=value;
				}
				else {
					if (typeof (value)==="boolean") {
						if (value) {
							queryInfo.Select.push(ClientRequestContext.combineQueryPath(pathPrefix, key, "/"));
						}
					}
					else if (typeof (value)==="object") {
						ClientRequestContext.parseStrictLoadOptionHelper(queryInfo, ClientRequestContext.combineQueryPath(pathPrefix, key, "/"), ClientRequestContext.combineQueryPath(argPrefix, key, "."), value);
					}
					else {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(ClientRequestContext.combineQueryPath(argPrefix, key, "."));
					}
				}
			}
		};
		ClientRequestContext._parseQueryOption=function (option) {
			var queryOption={};
			if (typeof (option)=="string") {
				var select=option;
				queryOption.Select=OfficeExtension.Utility._parseSelectExpand(select);
			}
			else if (Array.isArray(option)) {
				queryOption.Select=option;
			}
			else if (typeof (option)==="object") {
				var loadOption=option;
				if (ClientRequestContext.isLoadOption(loadOption)) {
					if (typeof (loadOption.select)=="string") {
						queryOption.Select=OfficeExtension.Utility._parseSelectExpand(loadOption.select);
					}
					else if (Array.isArray(loadOption.select)) {
						queryOption.Select=loadOption.select;
					}
					else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.select)) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("option.select");
					}
					if (typeof (loadOption.expand)=="string") {
						queryOption.Expand=OfficeExtension.Utility._parseSelectExpand(loadOption.expand);
					}
					else if (Array.isArray(loadOption.expand)) {
						queryOption.Expand=loadOption.expand;
					}
					else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.expand)) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("option.expand");
					}
					if (typeof (loadOption.top)==="number") {
						queryOption.Top=loadOption.top;
					}
					else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.top)) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("option.top");
					}
					if (typeof (loadOption.skip)==="number") {
						queryOption.Skip=loadOption.skip;
					}
					else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.skip)) {
						throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("option.skip");
					}
				}
				else {
					queryOption=ClientRequestContext.parseStrictLoadOption(option);
				}
			}
			else if (!OfficeExtension.Utility.isNullOrUndefined(option)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("option");
			}
			return queryOption;
		};
		ClientRequestContext.prototype.loadRecursive=function (clientObj, options, maxDepth) {
			if (!OfficeExtension.Utility.isPlainJsonObject(options)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("options");
			}
			var quries={};
			for (var key in options) {
				quries[key]=ClientRequestContext._parseQueryOption(options[key]);
			}
			var action=OfficeExtension.ActionFactory.createRecursiveQueryAction(this, clientObj, { Queries: quries, MaxDepth: maxDepth });
			this._pendingRequest.addActionResultHandler(action, clientObj);
		};
		ClientRequestContext.prototype.trace=function (message) {
			OfficeExtension.ActionFactory.createTraceAction(this, message, true);
		};
		ClientRequestContext.prototype._processOfficeJsErrorResponse=function (officeJsErrorCode, response) {
		};
		ClientRequestContext.prototype.ensureRequestUrlAndHeaderInfo=function () {
			var _this=this;
			return OfficeExtension.Utility._createPromiseFromResult(null)
				.then(function () {
				if (!_this.m_requestUrlAndHeaderInfo) {
					return _this.m_requestUrlAndHeaderInfoResolver._resolveRequestUrlAndHeaderInfo()
						.then(function (value) {
						_this.m_requestUrlAndHeaderInfo=value;
						if (!_this.m_requestUrlAndHeaderInfo) {
							_this.m_requestUrlAndHeaderInfo={ url: OfficeExtension.Constants.localDocument, headers: {} };
						}
						if (OfficeExtension.Utility.isNullOrEmptyString(_this.m_requestUrlAndHeaderInfo.url)) {
							_this.m_requestUrlAndHeaderInfo.url=OfficeExtension.Constants.localDocument;
						}
						if (!_this.m_requestUrlAndHeaderInfo.headers) {
							_this.m_requestUrlAndHeaderInfo.headers={};
						}
						if (typeof (_this.m_requestUrlAndHeaderInfoResolver._createRequestExecutorOrNull)==="function") {
							var executor=_this.m_requestUrlAndHeaderInfoResolver._createRequestExecutorOrNull();
							if (executor) {
								_this._requestExecutor=executor;
							}
						}
					});
				}
			});
		};
		ClientRequestContext.prototype.syncPrivateMain=function () {
			var _this=this;
			return this.ensureRequestUrlAndHeaderInfo()
				.then(function () {
				var req=_this._pendingRequest;
				_this.m_pendingRequest=null;
				return _this.processPreSyncPromises(req)
					.then(function () { return _this.syncPrivate(req); });
			});
		};
		ClientRequestContext.prototype.syncPrivate=function (req) {
			var _this=this;
			if (!req.hasActions) {
				return this.processPendingEventHandlers(req);
			}
			var msgBody=req.buildRequestMessageBody();
			var requestFlags=req.flags;
			if (!this._requestExecutor) {
				if (OfficeExtension.Utility._isLocalDocumentUrl(this.m_requestUrlAndHeaderInfo.url)) {
					this._requestExecutor=new OfficeExtension.OfficeJsRequestExecutor(this);
				}
				else {
					this._requestExecutor=new OfficeExtension.HttpRequestExecutor();
				}
			}
			var requestExecutor=this._requestExecutor;
			var headers={};
			OfficeExtension.Utility._copyHeaders(this.m_requestUrlAndHeaderInfo.headers, headers);
			OfficeExtension.Utility._copyHeaders(this.m_customRequestHeaders, headers);
			var requestExecutorRequestMessage={
				Url: this.m_requestUrlAndHeaderInfo.url,
				Headers: headers,
				Body: msgBody
			};
			req.invalidatePendingInvalidObjectPaths();
			var errorFromResponse=null;
			var errorFromProcessEventHandlers=null;
			this._lastSyncStart=performance.now();
			return requestExecutor.executeAsync(this._customData, requestFlags, requestExecutorRequestMessage)
				.then(function (response) {
				_this._lastSyncEnd=performance.now();
				errorFromResponse=_this.processRequestExecutorResponseMessage(req, response);
				return _this.processPendingEventHandlers(req)
					.catch(function (ex) {
					OfficeExtension.Utility.log("Error in processPendingEventHandlers");
					OfficeExtension.Utility.log(JSON.stringify(ex));
					errorFromProcessEventHandlers=ex;
				});
			})
				.then(function () {
				if (errorFromResponse) {
					OfficeExtension.Utility.log("Throw error from response: "+JSON.stringify(errorFromResponse));
					throw errorFromResponse;
				}
				if (errorFromProcessEventHandlers) {
					OfficeExtension.Utility.log("Throw error from ProcessEventHandler: "+JSON.stringify(errorFromProcessEventHandlers));
					var transformedError=null;
					if (errorFromProcessEventHandlers instanceof OfficeExtension._Internal.RuntimeError) {
						transformedError=errorFromProcessEventHandlers;
						transformedError.traceMessages=req._responseTraceMessages;
					}
					else {
						var message=null;
						if (typeof (errorFromProcessEventHandlers)==="string") {
							message=errorFromProcessEventHandlers;
						}
						else {
							message=errorFromProcessEventHandlers.message;
						}
						if (OfficeExtension.Utility.isNullOrEmptyString(message)) {
							message=OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.cannotRegisterEvent);
						}
						transformedError=new OfficeExtension._Internal.RuntimeError({
							code: OfficeExtension.ErrorCodes.cannotRegisterEvent,
							message: message,
							traceMessages: req._responseTraceMessages
						});
					}
					throw transformedError;
				}
			});
		};
		ClientRequestContext.prototype.processRequestExecutorResponseMessage=function (req, response) {
			if (response.Body && response.Body.TraceIds) {
				req._setResponseTraceIds(response.Body.TraceIds);
			}
			var traceMessages=req._responseTraceMessages;
			var errorStatementInfo=null;
			if (response.Body) {
				if (response.Body.Error &&
					response.Body.Error.ActionIndex >=0) {
					var prettyPrinter=new OfficeExtension.RequestPrettyPrinter(this._rootObjectPropertyName, req._objectPaths, req._actions);
					errorStatementInfo=prettyPrinter.processForDebugStatementInfo(response.Body.Error.ActionIndex);
				}
				var actionResults=null;
				if (response.Body.Results) {
					actionResults=response.Body.Results;
				}
				else if (response.Body.ProcessedResults && response.Body.ProcessedResults.Results) {
					actionResults=response.Body.ProcessedResults.Results;
				}
				if (actionResults) {
					this._processingResult=true;
					try {
						req.processResponse(actionResults);
					}
					finally {
						this._processingResult=false;
					}
				}
			}
			if (!OfficeExtension.Utility.isNullOrEmptyString(response.ErrorCode)) {
				return new OfficeExtension._Internal.RuntimeError({
					code: response.ErrorCode,
					message: response.ErrorMessage,
					traceMessages: traceMessages
				});
			}
			else if (response.Body && response.Body.Error) {
				var debugInfo={
					errorLocation: response.Body.Error.Location
				};
				if (errorStatementInfo) {
					debugInfo.statement=errorStatementInfo.statement;
					debugInfo.surroundingStatements=errorStatementInfo.surroundingStatements;
				}
				return new OfficeExtension._Internal.RuntimeError({
					code: response.Body.Error.Code,
					message: response.Body.Error.Message,
					traceMessages: traceMessages,
					debugInfo: debugInfo
				});
			}
			return null;
		};
		ClientRequestContext.prototype.processPendingEventHandlers=function (req) {
			var ret=OfficeExtension.Utility._createPromiseFromResult(null);
			for (var i=0; i < req._pendingProcessEventHandlers.length; i++) {
				var eventHandlers=req._pendingProcessEventHandlers[i];
				ret=ret.then(this.createProcessOneEventHandlersFunc(eventHandlers, req));
			}
			return ret;
		};
		ClientRequestContext.prototype.createProcessOneEventHandlersFunc=function (eventHandlers, req) {
			return function () { return eventHandlers._processRegistration(req); };
		};
		ClientRequestContext.prototype.processPreSyncPromises=function (req) {
			var ret=OfficeExtension.Utility._createPromiseFromResult(null);
			for (var i=0; i < req._preSyncPromises.length; i++) {
				var p=req._preSyncPromises[i];
				ret=ret.then(this.createProcessOneProSyncFunc(p));
			}
			return ret;
		};
		ClientRequestContext.prototype.createProcessOneProSyncFunc=function (p) {
			return function () { return p; };
		};
		ClientRequestContext.prototype.sync=function (passThroughValue) {
			return this.syncPrivateMain().then(function () { return passThroughValue; });
		};
		ClientRequestContext.prototype.batch=function (batchBody) {
			var _this=this;
			if (this.m_explicitBatchInProgress) {
				return OfficeExtension._Internal.OfficePromise.reject(OfficeExtension.Utility.createRuntimeError(OfficeExtension.ErrorCodes.generalException, OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.pendingBatchInProgress), null));
			}
			if (OfficeExtension.Utility.isNullOrUndefined(batchBody)) {
				return OfficeExtension.Utility._createPromiseFromResult(null);
			}
			var request;
			var previousRequest=this.m_pendingRequest;
			this.m_batchQueue=this.m_batchQueue.then(function () {
				_this.m_explicitBatchInProgress=true;
			}).then(function () {
				_this.m_pendingRequest=new OfficeExtension.ClientRequest(_this);
				var batchBodyResult;
				try {
					batchBodyResult=batchBody(_this._rootObject, _this);
				}
				catch (ex) {
					_this.m_explicitBatchInProgress=false;
					_this.m_pendingRequest=previousRequest;
					return OfficeExtension._Internal.OfficePromise.reject(ex);
				}
				return batchBodyResult;
			}).catch(function (ex) {
				_this.m_explicitBatchInProgress=false;
				request=_this.m_pendingRequest;
				_this.m_pendingRequest=previousRequest;
				return OfficeExtension._Internal.OfficePromise.reject(ex);
			}).then(function (batchBodyResult) {
				_this.m_explicitBatchInProgress=false;
				request=_this.m_pendingRequest;
				_this.m_pendingRequest=previousRequest;
				return batchBodyResult;
			}).then(function (batchBodyResult) {
				return _this.ensureRequestUrlAndHeaderInfo().then(function () { return batchBodyResult; });
			}).then(function (batchBodyResult) {
				return _this.syncPrivate(request).then(function () { return batchBodyResult; });
			});
			return this.m_batchQueue;
		};
		ClientRequestContext.isRequestUrlAndHeaderInfo=function (value) {
			return (typeof (value)==="object" &&
				value !==null &&
				Object.getPrototypeOf(value)===Object.getPrototypeOf({}) &&
				!OfficeExtension.Utility.isNullOrUndefined(value.url));
		};
		ClientRequestContext.isRequestUrlAndHeaderInfoResolver=function (value) {
			return (typeof (value)==="object" &&
				value !==null &&
				typeof (value._resolveRequestUrlAndHeaderInfo)==="function");
		};
		ClientRequestContext._runExplicitBatch=function (functionName, receivedRunArgs, ctxInitializer, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (numCleanupAttempts===void 0) { numCleanupAttempts=3; }
			if (retryDelay===void 0) { retryDelay=5000; }
			var ctxRetriever;
			var batch;
			var requestInfo=null;
			var argOffset=0;
			if (receivedRunArgs.length > 0 &&
				(typeof (receivedRunArgs[0])==="string" ||
					ClientRequestContext.isRequestUrlAndHeaderInfo(receivedRunArgs[0]) ||
					ClientRequestContext.isRequestUrlAndHeaderInfoResolver(receivedRunArgs[0]))) {
				requestInfo=receivedRunArgs[0];
				argOffset=1;
			}
			if (receivedRunArgs.length==argOffset+1) {
				ctxRetriever=ctxInitializer;
				batch=receivedRunArgs[argOffset+0];
			}
			else if (receivedRunArgs.length==argOffset+2) {
				if (OfficeExtension.Utility.isNullOrUndefined(receivedRunArgs[argOffset+0])) {
					ctxRetriever=ctxInitializer;
				}
				else if (receivedRunArgs[argOffset+0] instanceof OfficeExtension.ClientObject) {
					ctxRetriever=function () { return receivedRunArgs[argOffset+0].context; };
				}
				else if (receivedRunArgs[argOffset+0] instanceof ClientRequestContext) {
					ctxRetriever=function () { return receivedRunArgs[argOffset+0]; };
				}
				else if (Array.isArray(receivedRunArgs[argOffset+0])) {
					var array=receivedRunArgs[argOffset+0];
					if (array.length==0) {
						return ClientRequestContext.createErrorPromise(functionName);
					}
					for (var i=0; i < array.length; i++) {
						if (!(array[i] instanceof OfficeExtension.ClientObject)) {
							return ClientRequestContext.createErrorPromise(functionName);
						}
						if (array[i].context !=array[0].context) {
							return ClientRequestContext.createErrorPromise(functionName, OfficeExtension.ResourceStrings.invalidRequestContext);
						}
					}
					ctxRetriever=function () { return array[0].context; };
				}
				else {
					return ClientRequestContext.createErrorPromise(functionName);
				}
				batch=receivedRunArgs[argOffset+1];
			}
			else {
				return ClientRequestContext.createErrorPromise(functionName);
			}
			return ClientRequestContext._runCommon(functionName, requestInfo, ctxRetriever, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure);
		};
		ClientRequestContext.createErrorPromise=function (functionName, code) {
			if (code===void 0) { code=OfficeExtension.ResourceStrings.invalidArgument; }
			return OfficeExtension._Internal.OfficePromise.reject(OfficeExtension.Utility.createRuntimeError(code, OfficeExtension.Utility._getResourceString(code), functionName));
		};
		ClientRequestContext._runCommon=function (functionName, requestInfo, ctxRetriever, runBody, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (ClientRequestContext._overrideSession) {
				requestInfo=ClientRequestContext._overrideSession;
			}
			var starterPromise=new OfficeExtension._Internal.OfficePromise(function (resolve, reject) { resolve(); });
			var ctx;
			var succeeded=false;
			var resultOrError;
			return starterPromise
				.then(function () {
				ctx=ctxRetriever(requestInfo);
				if (ctx._autoCleanup) {
					return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
						ctx._onRunFinishedNotifiers.push(function () {
							ctx._autoCleanup=true;
							resolve();
						});
					});
				}
				else {
					ctx._autoCleanup=true;
				}
			})
				.then(function () {
				if (typeof runBody !=='function') {
					return ClientRequestContext.createErrorPromise(functionName);
				}
				ctx._inRunBody=true;
				return runBody(ctx.batch.bind(ctx));
			})
				.then(function (result) {
				succeeded=true;
				ctx._inRunBody=false;
				resultOrError=result;
			})
				.catch(function (error) {
				ctx._inRunBody=false;
				resultOrError=error;
			})
				.then(function () {
				var itemsToRemove=ctx.trackedObjects._retrieveAndClearAutoCleanupList();
				ctx._autoCleanup=false;
				for (var key in itemsToRemove) {
					itemsToRemove[key]._objectPath.isValid=false;
				}
				var cleanupCounter=0;
				if (OfficeExtension.Utility._synchronousCleanup || ClientRequestContext.isRequestUrlAndHeaderInfoResolver(requestInfo)) {
					return attemptCleanup();
				}
				else {
					attemptCleanup();
				}
				function attemptCleanup() {
					cleanupCounter++;
					var savedPendingRequest=ctx.m_pendingRequest;
					var request=new OfficeExtension.ClientRequest(ctx);
					ctx.m_pendingRequest=request;
					try {
						for (var key in itemsToRemove) {
							ctx.trackedObjects.remove(itemsToRemove[key]);
						}
					}
					finally {
						ctx.m_pendingRequest=savedPendingRequest;
					}
					return ctx.syncPrivate(request)
						.then(function () {
						if (onCleanupSuccess) {
							onCleanupSuccess(cleanupCounter);
						}
					})
						.catch(function () {
						if (onCleanupFailure) {
							onCleanupFailure(cleanupCounter);
						}
						if (cleanupCounter < numCleanupAttempts) {
							setTimeout(function () {
								attemptCleanup();
							}, retryDelay);
						}
					});
				}
			})
				.then(function () {
				if (ctx._onRunFinishedNotifiers && ctx._onRunFinishedNotifiers.length > 0) {
					var func=ctx._onRunFinishedNotifiers.shift();
					func();
				}
				if (succeeded) {
					return resultOrError;
				}
				else {
					throw resultOrError;
				}
			});
		};
		ClientRequestContext.prototype._nextId=function () {
			return++this.m_nextId;
		};
		return ClientRequestContext;
	}());
	OfficeExtension.ClientRequestContext=ClientRequestContext;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientResult=(function () {
		function ClientResult(type) {
			this.m_type=type;
		}
		Object.defineProperty(ClientResult.prototype, "value", {
			get: function () {
				if (!this.m_isLoaded) {
					throw new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.valueNotLoaded,
						message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.valueNotLoaded),
						debugInfo: {
							errorLocation: "clientResult.value"
						}
					});
				}
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		ClientResult.prototype._handleResult=function (value) {
			this.m_isLoaded=true;
			if (typeof (value)==="object" && value && value._IsNull) {
				return;
			}
			if (this.m_type===1) {
				this.m_value=OfficeExtension.Utility.adjustToDateTime(value);
			}
			else {
				this.m_value=value;
			}
		};
		return ClientResult;
	}());
	OfficeExtension.ClientResult=ClientResult;
	var RetrieveResultImpl=(function () {
		function RetrieveResultImpl(m_proxy, m_shouldPolyfill) {
			this.m_proxy=m_proxy;
			this.m_shouldPolyfill=m_shouldPolyfill;
			var scalarPropertyNames=m_proxy[OfficeExtension.Constants.scalarPropertyNames];
			var navigationPropertyNames=m_proxy[OfficeExtension.Constants.navigationPropertyNames];
			var typeName=m_proxy[OfficeExtension.Constants.className];
			var isCollection=m_proxy[OfficeExtension.Constants.isCollection];
			if (scalarPropertyNames) {
				for (var i=0; i < scalarPropertyNames.length; i++) {
					OfficeExtension.Utility.definePropertyThrowUnloadedException(this, typeName, scalarPropertyNames[i]);
				}
			}
			if (navigationPropertyNames) {
				for (var i=0; i < navigationPropertyNames.length; i++) {
					OfficeExtension.Utility.definePropertyThrowUnloadedException(this, typeName, navigationPropertyNames[i]);
				}
			}
			if (isCollection) {
				OfficeExtension.Utility.definePropertyThrowUnloadedException(this, typeName, OfficeExtension.Constants.itemsLowerCase);
			}
		}
		Object.defineProperty(RetrieveResultImpl.prototype, "$proxy", {
			get: function () {
				return this.m_proxy;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RetrieveResultImpl.prototype, "$isNullObject", {
			get: function () {
				if (!this.m_isLoaded) {
					throw new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.valueNotLoaded,
						message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.valueNotLoaded),
						debugInfo: {
							errorLocation: "retrieveResult.$isNullObject"
						}
					});
				}
				return this.m_isNullObject;
			},
			enumerable: true,
			configurable: true
		});
		RetrieveResultImpl.prototype.toJSON=function () {
			if (!this.m_isLoaded) {
				return undefined;
			}
			if (this.m_isNullObject) {
				return null;
			}
			if (OfficeExtension.Utility.isUndefined(this.m_json)) {
				this.m_json=this.purifyJson(this.m_value);
			}
			return this.m_json;
		};
		RetrieveResultImpl.prototype.toString=function () {
			return JSON.stringify(this.toJSON());
		};
		RetrieveResultImpl.prototype._handleResult=function (value) {
			this.m_isLoaded=true;
			if (value===null || typeof (value)==="object" && value && value._IsNull) {
				this.m_isNullObject=true;
				value=null;
			}
			else {
				this.m_isNullObject=false;
			}
			if (this.m_shouldPolyfill) {
				value=this.changePropertyNameToCamelLowerCase(value);
			}
			this.m_value=value;
			this.m_proxy._handleRetrieveResult(value, this);
		};
		RetrieveResultImpl.prototype.changePropertyNameToCamelLowerCase=function (value) {
			var charCodeUnderscore=95;
			if (Array.isArray(value)) {
				var ret=[];
				for (var i=0; i < value.length; i++) {
					ret.push(this.changePropertyNameToCamelLowerCase(value[i]));
				}
				return ret;
			}
			else if (typeof (value)==="object" && value !==null) {
				var ret={};
				for (var key in value) {
					var propValue=value[key];
					if (key===OfficeExtension.Constants.items) {
						ret={};
						ret[OfficeExtension.Constants.itemsLowerCase]=this.changePropertyNameToCamelLowerCase(propValue);
						break;
					}
					else {
						var propName=OfficeExtension.Utility._toCamelLowerCase(key);
						ret[propName]=this.changePropertyNameToCamelLowerCase(propValue);
					}
				}
				return ret;
			}
			else {
				return value;
			}
		};
		RetrieveResultImpl.prototype.purifyJson=function (value) {
			var charCodeUnderscore=95;
			if (Array.isArray(value)) {
				var ret=[];
				for (var i=0; i < value.length; i++) {
					ret.push(this.purifyJson(value[i]));
				}
				return ret;
			}
			else if (typeof (value)==="object" && value !==null) {
				var ret={};
				for (var key in value) {
					if (key.charCodeAt(0) !==charCodeUnderscore) {
						var propValue=value[key];
						if (typeof (propValue)==="object" &&
							propValue !==null &&
							Array.isArray(propValue["items"])) {
							propValue=propValue["items"];
						}
						ret[key]=this.purifyJson(propValue);
					}
				}
				return ret;
			}
			else {
				return value;
			}
		};
		return RetrieveResultImpl;
	}());
	OfficeExtension.RetrieveResultImpl=RetrieveResultImpl;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Constants=(function () {
		function Constants() {
		}
		Constants.flags="flags";
		Constants.getItemAt="GetItemAt";
		Constants.id="Id";
		Constants.idLowerCase="id";
		Constants.idPrivate="_Id";
		Constants.index="_Index";
		Constants.items="_Items";
		Constants.iterativeExecutor="IterativeExecutor";
		Constants.localDocument="http://document.localhost/";
		Constants.localDocumentApiPrefix="http://document.localhost/_api/";
		Constants.processQuery="ProcessQuery";
		Constants.referenceId="_ReferenceId";
		Constants.isTracked="_IsTracked";
		Constants.sourceLibHeader="SdkVersion";
		Constants.embeddingPageOrigin="EmbeddingPageOrigin";
		Constants.embeddingPageSessionInfo="EmbeddingPageSessionInfo";
		Constants.eventMessageCategory=65536;
		Constants.eventWorkbookId="Workbook";
		Constants.eventSourceRemote="Remote";
		Constants.itemsLowerCase="items";
		Constants.proxy="$proxy";
		Constants.scalarPropertyNames="_scalarPropertyNames";
		Constants.navigationPropertyNames="_navigationPropertyNames";
		Constants.className="_className";
		Constants.isCollection="_isCollection";
		Constants.scalarPropertyUpdateable="_scalarPropertyUpdateable";
		return Constants;
	}());
	OfficeExtension.Constants=Constants;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var versionToken=1;
	var internalConfiguration={
		invokeRequestModifier: function (request) {
			request.DdaMethod.Version=versionToken;
			return request;
		},
		invokeResponseModifier: function (args) {
			versionToken=args.Version;
			if (args.Error) {
				args.error={};
				args.error.Code=args.Error;
			}
			return args;
		}
	};
	var EmbeddedApiStatus;
	(function (EmbeddedApiStatus) {
		EmbeddedApiStatus[EmbeddedApiStatus["Success"]=0]="Success";
		EmbeddedApiStatus[EmbeddedApiStatus["Timeout"]=1]="Timeout";
		EmbeddedApiStatus[EmbeddedApiStatus["InternalError"]=5001]="InternalError";
	})(EmbeddedApiStatus || (EmbeddedApiStatus={}));
	var CommunicationConstants;
	(function (CommunicationConstants) {
		CommunicationConstants.SendingId="sId";
		CommunicationConstants.RespondingId="rId";
		CommunicationConstants.CommandKey="command";
		CommunicationConstants.SessionInfoKey="sessionInfo";
		CommunicationConstants.ParamsKey="params";
		CommunicationConstants.ApiReadyCommand="apiready";
		CommunicationConstants.ExecuteMethodCommand="executeMethod";
		CommunicationConstants.GetAppContextCommand="getAppContext";
		CommunicationConstants.RegisterEventCommand="registerEvent";
		CommunicationConstants.UnregisterEventCommand="unregisterEvent";
		CommunicationConstants.FireEventCommand="fireEvent";
	})(CommunicationConstants || (CommunicationConstants={}));
	var EmbeddedSession=(function (_super) {
		__extends(EmbeddedSession, _super);
		function EmbeddedSession(url, options) {
			_super.call(this);
			this.m_chosenWindow=null;
			this.m_chosenOrigin=null;
			this.m_enabled=true;
			this.m_onMessageHandler=this._onMessage.bind(this);
			this.m_callbackList={};
			this.m_id=0;
			this.m_timeoutId=-1;
			this.m_appContext=null;
			this.m_url=url;
			this.m_options=options;
			if (!this.m_options) {
				this.m_options={ sessionKey: Math.random().toString() };
			}
			if (!this.m_options.sessionKey) {
				this.m_options.sessionKey=Math.random().toString();
			}
			if (!this.m_options.container) {
				this.m_options.container=document.body;
			}
			if (!this.m_options.timeoutInMilliseconds) {
				this.m_options.timeoutInMilliseconds=60000;
			}
			if (!this.m_options.height) {
				this.m_options.height="400px";
			}
			if (!this.m_options.width) {
				this.m_options.width="100%";
			}
		}
		EmbeddedSession.prototype._getIFrameSrc=function () {
			var origin=window.location.protocol+"//"+window.location.host;
			var toAppend=OfficeExtension.Constants.embeddingPageOrigin+"="+encodeURIComponent(origin)+"&"+OfficeExtension.Constants.embeddingPageSessionInfo+"="+encodeURIComponent(this.m_options.sessionKey);
			var useHash=false;
			if (this.m_url.toLowerCase().indexOf("/_layouts/preauth.aspx") > 0 ||
				this.m_url.toLowerCase().indexOf("/_layouts/15/preauth.aspx") > 0) {
				useHash=true;
			}
			var a=document.createElement("a");
			a.href=this.m_url;
			if (useHash) {
				if (a.hash.length===0 || a.hash==="#") {
					a.hash="#"+toAppend;
				}
				else {
					a.hash=a.hash+"&"+toAppend;
				}
			}
			else {
				if (a.search.length===0 || a.search==="?") {
					a.search="?"+toAppend;
				}
				else {
					a.search=a.search+"&"+toAppend;
				}
			}
			var iframeSrc=a.href;
			return iframeSrc;
		};
		EmbeddedSession.prototype.init=function () {
			var _this=this;
			window.addEventListener("message", this.m_onMessageHandler);
			var iframeSrc=this._getIFrameSrc();
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				var iframeElement=document.createElement("iframe");
				if (_this.m_options.id) {
					iframeElement.id=_this.m_options.id;
				}
				iframeElement.style.height=_this.m_options.height;
				iframeElement.style.width=_this.m_options.width;
				iframeElement.src=iframeSrc;
				_this.m_options.container.appendChild(iframeElement);
				_this.m_timeoutId=setTimeout(function () {
					_this.close();
					var err=OfficeExtension.Utility.createRuntimeError(OfficeExtension.ErrorCodes.timeout, OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.timeout), "EmbeddedSession.init");
					reject(err);
				}, _this.m_options.timeoutInMilliseconds);
				_this.m_promiseResolver=resolve;
			});
		};
		EmbeddedSession.prototype._invoke=function (method, callback, params) {
			if (!this.m_enabled) {
				callback(EmbeddedApiStatus.InternalError, null);
				return;
			}
			if (internalConfiguration.invokeRequestModifier) {
				params=internalConfiguration.invokeRequestModifier(params);
			}
			this._sendMessageWithCallback(this.m_id++, method, params, function (args) {
				if (internalConfiguration.invokeResponseModifier) {
					args=internalConfiguration.invokeResponseModifier(args);
				}
				var errorCode=args["Error"];
				delete args["Error"];
				callback(errorCode || EmbeddedApiStatus.Success, args);
			});
		};
		EmbeddedSession.prototype.close=function () {
			window.removeEventListener("message", this.m_onMessageHandler);
			window.clearTimeout(this.m_timeoutId);
			this.m_enabled=false;
		};
		Object.defineProperty(EmbeddedSession.prototype, "eventRegistration", {
			get: function () {
				if (!this.m_sessionEventManager) {
					this.m_sessionEventManager=new OfficeExtension.EventRegistration(this._registerEventImpl.bind(this), this._unregisterEventImpl.bind(this));
				}
				return this.m_sessionEventManager;
			},
			enumerable: true,
			configurable: true
		});
		EmbeddedSession.prototype._createRequestExecutorOrNull=function () {
			return new EmbeddedRequestExecutor(this);
		};
		EmbeddedSession.prototype._resolveRequestUrlAndHeaderInfo=function () {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		EmbeddedSession.prototype._registerEventImpl=function (eventId, targetId) {
			var _this=this;
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this._sendMessageWithCallback(_this.m_id++, CommunicationConstants.RegisterEventCommand, { EventId: eventId, TargetId: targetId }, function () {
					resolve(null);
				});
			});
		};
		EmbeddedSession.prototype._unregisterEventImpl=function (eventId, targetId) {
			var _this=this;
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this._sendMessageWithCallback(_this.m_id++, CommunicationConstants.UnregisterEventCommand, { EventId: eventId, TargetId: targetId }, function () {
					resolve();
				});
			});
		};
		EmbeddedSession.prototype._onMessage=function (event) {
			var _this=this;
			if (!this.m_enabled) {
				return;
			}
			if (this.m_chosenWindow
				&& (this.m_chosenWindow !==event.source || this.m_chosenOrigin !==event.origin)) {
				return;
			}
			var eventData=event.data;
			if (eventData && eventData[CommunicationConstants.CommandKey]===CommunicationConstants.ApiReadyCommand) {
				if (!this.m_chosenWindow
					&& this._isValidDescendant(event.source)
					&& eventData[CommunicationConstants.SessionInfoKey]===this.m_options.sessionKey) {
					this.m_chosenWindow=event.source;
					this.m_chosenOrigin=event.origin;
					this._sendMessageWithCallback(this.m_id++, CommunicationConstants.GetAppContextCommand, null, function (appContext) {
						_this._setupContext(appContext);
						window.clearTimeout(_this.m_timeoutId);
						_this.m_promiseResolver();
					});
				}
				return;
			}
			if (eventData && eventData[CommunicationConstants.CommandKey]===CommunicationConstants.FireEventCommand) {
				var msg=eventData[CommunicationConstants.ParamsKey];
				var eventId=msg["EventId"];
				var targetId=msg["TargetId"];
				var data=msg["Data"];
				if (this.m_sessionEventManager) {
					var handlers=this.m_sessionEventManager.getHandlers(eventId, targetId);
					for (var i=0; i < handlers.length; i++) {
						handlers[i](data);
					}
				}
				return;
			}
			if (eventData && eventData.hasOwnProperty(CommunicationConstants.RespondingId)) {
				var rId=eventData[CommunicationConstants.RespondingId];
				var callback=this.m_callbackList[rId];
				if (typeof callback==="function") {
					callback(eventData[CommunicationConstants.ParamsKey]);
				}
				delete this.m_callbackList[rId];
			}
		};
		EmbeddedSession.prototype._sendMessageWithCallback=function (id, command, data, callback) {
			this.m_callbackList[id]=callback;
			var message={};
			message[CommunicationConstants.SendingId]=id;
			message[CommunicationConstants.CommandKey]=command;
			message[CommunicationConstants.ParamsKey]=data;
			this.m_chosenWindow.postMessage(JSON.stringify(message), this.m_chosenOrigin);
		};
		EmbeddedSession.prototype._isValidDescendant=function (wnd) {
			var container=this.m_options.container || document.body;
			function doesFrameWindow(containerWindow) {
				if (containerWindow===wnd) {
					return true;
				}
				for (var i=0, len=containerWindow.frames.length; i < len; i++) {
					if (doesFrameWindow(containerWindow.frames[i])) {
						return true;
					}
				}
				return false;
			}
			var iframes=container.getElementsByTagName("iframe");
			for (var i=0, len=iframes.length; i < len; i++) {
				if (doesFrameWindow(iframes[i].contentWindow)) {
					return true;
				}
			}
			return false;
		};
		EmbeddedSession.prototype._setupContext=function (appContext) {
			if (!(this.m_appContext=appContext)) {
				return;
			}
		};
		return EmbeddedSession;
	}(OfficeExtension.SessionBase));
	OfficeExtension.EmbeddedSession=EmbeddedSession;
	var EmbeddedRequestExecutor=(function () {
		function EmbeddedRequestExecutor(session) {
			this.m_session=session;
		}
		EmbeddedRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var _this=this;
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, EmbeddedRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this.m_session._invoke(CommunicationConstants.ExecuteMethodCommand, function (status, result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (status==EmbeddedApiStatus.Success) {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBodyFromSafeArray(result.Data), OfficeExtension.RichApiMessageUtility.getResponseHeadersFromSafeArray(result.Data));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.Code, result.error.Message);
					}
					resolve(response);
				}, EmbeddedRequestExecutor._transformMessageArrayIntoParams(messageSafearray));
			});
		};
		EmbeddedRequestExecutor._transformMessageArrayIntoParams=function (msgArray) {
			return {
				ArrayData: msgArray,
				DdaMethod: {
					DispatchId: EmbeddedRequestExecutor.DispidExecuteRichApiRequestMethod
				}
			};
		};
		EmbeddedRequestExecutor.DispidExecuteRichApiRequestMethod=93;
		EmbeddedRequestExecutor.SourceLibHeaderValue="Embedded";
		return EmbeddedRequestExecutor;
	}());
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var RuntimeError=(function (_super) {
			__extends(RuntimeError, _super);
			function RuntimeError(error) {
				_super.call(this, (typeof error==="string") ? error : error.message);
				this.name="OfficeExtension.Error";
				if (typeof error==="string") {
					this.message=error;
				}
				else {
					this.code=error.code;
					this.message=error.message;
					this.traceMessages=error.traceMessages || [];
					this.innerError=error.innerError || null;
					this.debugInfo=this._createDebugInfo(error.debugInfo || {});
				}
			}
			RuntimeError.prototype.toString=function () {
				return this.code+': '+this.message;
			};
			RuntimeError.prototype._createDebugInfo=function (partialDebugInfo) {
				var debugInfo={
					code: this.code,
					message: this.message,
					toString: function () {
						return JSON.stringify(this);
					}
				};
				for (var key in partialDebugInfo) {
					debugInfo[key]=partialDebugInfo[key];
				}
				if (this.innerError) {
					if (this.innerError instanceof OfficeExtension._Internal.RuntimeError) {
						debugInfo.innerError=this.innerError.debugInfo;
					}
					else {
						debugInfo.innerError=this.innerError;
					}
				}
				return debugInfo;
			};
			RuntimeError._createInvalidArgError=function (error) {
				return new _Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidArgument,
					message: (OfficeExtension.Utility.isNullOrEmptyString(error.argumentName) ?
						OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgumentGeneric) :
						OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgument, error.argumentName)),
					debugInfo: error.errorLocation ? { errorLocation: error.errorLocation } : {},
					innerError: error.innerError
				});
			};
			return RuntimeError;
		}(Error));
		_Internal.RuntimeError=RuntimeError;
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	OfficeExtension.Error=_Internal.RuntimeError;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ErrorCodes=(function () {
		function ErrorCodes() {
		}
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.activityLimitReached="ActivityLimitReached";
		ErrorCodes.invalidObjectPath="InvalidObjectPath";
		ErrorCodes.propertyNotLoaded="PropertyNotLoaded";
		ErrorCodes.valueNotLoaded="ValueNotLoaded";
		ErrorCodes.invalidRequestContext="InvalidRequestContext";
		ErrorCodes.invalidArgument="InvalidArgument";
		ErrorCodes.runMustReturnPromise="RunMustReturnPromise";
		ErrorCodes.cannotRegisterEvent="CannotRegisterEvent";
		ErrorCodes.apiNotFound="ApiNotFound";
		ErrorCodes.connectionFailure="ConnectionFailure";
		ErrorCodes.timeout="Timeout";
		ErrorCodes.invalidOrTimedOutSession="InvalidOrTimedOutSession";
		ErrorCodes.cannotUpdateReadOnlyProperty="CannotUpdateReadOnlyProperty";
		return ErrorCodes;
	}());
	OfficeExtension.ErrorCodes=ErrorCodes;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var EventHandlers=(function () {
		function EventHandlers(context, parentObject, name, eventInfo) {
			var _this=this;
			this.m_id=context._nextId();
			this.m_context=context;
			this.m_name=name;
			this.m_handlers=[];
			this.m_registered=false;
			this.m_eventInfo=eventInfo;
			this.m_callback=function (args) {
				_this.m_eventInfo.eventArgsTransformFunc(args)
					.then(function (newArgs) { return _this.fireEvent(newArgs); });
			};
		}
		Object.defineProperty(EventHandlers.prototype, "_registered", {
			get: function () {
				return this.m_registered;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_id", {
			get: function () {
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_handlers", {
			get: function () {
				return this.m_handlers;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_context", {
			get: function () {
				return this.m_context;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_callback", {
			get: function () {
				return this.m_callback;
			},
			enumerable: true,
			configurable: true
		});
		EventHandlers.prototype.add=function (handler) {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: handler, operation: 0 });
			return new OfficeExtension.EventHandlerResult(this.m_context, this, handler);
		};
		EventHandlers.prototype.remove=function (handler) {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: handler, operation: 1 });
		};
		EventHandlers.prototype.removeAll=function () {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: null, operation: 2 });
		};
		EventHandlers.prototype._processRegistration=function (req) {
			var _this=this;
			var ret=OfficeExtension.Utility._createPromiseFromResult(null);
			var actions=req._getPendingEventHandlerActions(this);
			if (!actions) {
				return ret;
			}
			var handlersResult=[];
			for (var i=0; i < this.m_handlers.length; i++) {
				handlersResult.push(this.m_handlers[i]);
			}
			var hasChange=false;
			for (var i=0; i < actions.length; i++) {
				if (req._responseTraceIds[actions[i].id]) {
					hasChange=true;
					switch (actions[i].operation) {
						case 0:
							handlersResult.push(actions[i].handler);
							break;
						case 1:
							for (var index=handlersResult.length - 1; index >=0; index--) {
								if (handlersResult[index]===actions[i].handler) {
									handlersResult.splice(index, 1);
									break;
								}
							}
							break;
						case 2:
							handlersResult=[];
							break;
					}
				}
			}
			if (hasChange) {
				if (!this.m_registered && handlersResult.length > 0) {
					ret=ret
						.then(function () { return _this.m_eventInfo.registerFunc(_this.m_callback); })
						.then(function () { return (_this.m_registered=true); });
				}
				else if (this.m_registered && handlersResult.length==0) {
					ret=ret
						.then(function () { return _this.m_eventInfo.unregisterFunc(_this.m_callback); })
						.catch(function (ex) {
						OfficeExtension.Utility.log("Error when unregister event: "+JSON.stringify(ex));
					})
						.then(function () { return (_this.m_registered=false); });
				}
				ret=ret
					.then(function () { return (_this.m_handlers=handlersResult); });
			}
			return ret;
		};
		EventHandlers.prototype.fireEvent=function (args) {
			var promises=[];
			for (var i=0; i < this.m_handlers.length; i++) {
				var handler=this.m_handlers[i];
				var p=OfficeExtension.Utility._createPromiseFromResult(null)
					.then(this.createFireOneEventHandlerFunc(handler, args))
					.catch(function (ex) {
					OfficeExtension.Utility.log("Error when invoke handler: "+JSON.stringify(ex));
				});
				promises.push(p);
			}
			OfficeExtension._Internal.OfficePromise.all(promises);
		};
		EventHandlers.prototype.createFireOneEventHandlerFunc=function (handler, args) {
			return function () { return handler(args); };
		};
		return EventHandlers;
	}());
	OfficeExtension.EventHandlers=EventHandlers;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var EventHandlerResult=(function () {
		function EventHandlerResult(context, handlers, handler) {
			this.m_context=context;
			this.m_allHandlers=handlers;
			this.m_handler=handler;
		}
		Object.defineProperty(EventHandlerResult.prototype, "context", {
			get: function () {
				return this.m_context;
			},
			enumerable: true,
			configurable: true
		});
		EventHandlerResult.prototype.remove=function () {
			if (this.m_allHandlers && this.m_handler) {
				this.m_allHandlers.remove(this.m_handler);
				this.m_allHandlers=null;
				this.m_handler=null;
			}
		};
		return EventHandlerResult;
	}());
	OfficeExtension.EventHandlerResult=EventHandlerResult;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var OfficeJsEventRegistration=(function () {
			function OfficeJsEventRegistration() {
			}
			OfficeJsEventRegistration.prototype.register=function (eventId, targetId, handler) {
				switch (eventId) {
					case 4:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.addHandlerAsync(Office.EventType.BindingDataChanged, handler, callback); });
						});
					case 3:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.addHandlerAsync(Office.EventType.BindingSelectionChanged, handler, callback); });
						});
					case 2:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, handler, callback); });
					case 1:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.settings.addHandlerAsync(Office.EventType.SettingsChanged, handler, callback); });
					case 5:
						return OfficeExtension.Utility.promisify(function (callback) { return OSF.DDA.RichApi.richApiMessageManager.addHandlerAsync("richApiMessage", handler, callback); });
					case 13:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectDeleted, handler, { id: targetId }, callback); });
					case 14:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectSelectionChanged, handler, { id: targetId }, callback); });
					case 15:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectDataChanged, handler, { id: targetId }, callback); });
					case 16:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ContentControlAdded, handler, { id: targetId }, callback); });
					default:
						throw _Internal.RuntimeError._createInvalidArgError("eventId");
				}
			};
			OfficeJsEventRegistration.prototype.unregister=function (eventId, targetId, handler) {
				switch (eventId) {
					case 4:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.removeHandlerAsync(Office.EventType.BindingDataChanged, { handler: handler }, callback); });
						});
					case 3:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.removeHandlerAsync(Office.EventType.BindingSelectionChanged, { handler: handler }, callback); });
						});
					case 2:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, { handler: handler }, callback); });
					case 1:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.settings.removeHandlerAsync(Office.EventType.SettingsChanged, { handler: handler }, callback); });
					case 5:
						return OfficeExtension.Utility.promisify(function (callback) { return OSF.DDA.RichApi.richApiMessageManager.removeHandlerAsync("richApiMessage", { handler: handler }, callback); });
					case 13:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectDeleted, { id: targetId, handler: handler }, callback); });
					case 14:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectSelectionChanged, { id: targetId, handler: handler }, callback); });
					case 15:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectDataChanged, { id: targetId, handler: handler }, callback); });
					case 16:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ContentControlAdded, { id: targetId, handler: handler }, callback); });
					default:
						throw _Internal.RuntimeError._createInvalidArgError("eventId");
				}
			};
			return OfficeJsEventRegistration;
		}());
		_Internal.officeJsEventRegistration=new OfficeJsEventRegistration();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var EventRegistration=(function () {
		function EventRegistration(registerEventImpl, unregisterEventImpl) {
			this.m_handlersByEventByTarget={};
			this.m_registerEventImpl=registerEventImpl;
			this.m_unregisterEventImpl=unregisterEventImpl;
		}
		EventRegistration.prototype.getHandlers=function (eventId, targetId) {
			if (OfficeExtension.Utility.isNullOrUndefined(targetId)) {
				targetId="";
			}
			var handlersById=this.m_handlersByEventByTarget[eventId];
			if (!handlersById) {
				handlersById={};
				this.m_handlersByEventByTarget[eventId]=handlersById;
			}
			var handlers=handlersById[targetId];
			if (!handlers) {
				handlers=[];
				handlersById[targetId]=handlers;
			}
			return handlers;
		};
		EventRegistration.prototype.register=function (eventId, targetId, handler) {
			if (!handler) {
				throw _Internal.RuntimeError._createInvalidArgError("handler");
			}
			var handlers=this.getHandlers(eventId, targetId);
			handlers.push(handler);
			if (handlers.length===1) {
				return this.m_registerEventImpl(eventId, targetId);
			}
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		EventRegistration.prototype.unregister=function (eventId, targetId, handler) {
			if (!handler) {
				throw _Internal.RuntimeError._createInvalidArgError("handler");
			}
			var handlers=this.getHandlers(eventId, targetId);
			for (var index=handlers.length - 1; index >=0; index--) {
				if (handlers[index]===handler) {
					handlers.splice(index, 1);
					break;
				}
			}
			if (handlers.length===0) {
				return this.m_unregisterEventImpl(eventId, targetId);
			}
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		return EventRegistration;
	}());
	OfficeExtension.EventRegistration=EventRegistration;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var GenericEventRegistration=(function () {
		function GenericEventRegistration() {
			this.m_eventRegistration=new OfficeExtension.EventRegistration(this._registerEventImpl.bind(this), this._unregisterEventImpl.bind(this));
			this.m_richApiMessageHandler=this._handleRichApiMessage.bind(this);
		}
		GenericEventRegistration.prototype.ready=function () {
			var _this=this;
			if (!this.m_ready) {
				if (GenericEventRegistration._testReadyImpl) {
					this.m_ready=GenericEventRegistration._testReadyImpl()
						.then(function () {
						_this.m_isReady=true;
					});
				}
				else {
					this.m_ready=OfficeExtension._Internal.officeJsEventRegistration.register(5, "", this.m_richApiMessageHandler)
						.then(function () {
						_this.m_isReady=true;
					});
				}
			}
			return this.m_ready;
		};
		Object.defineProperty(GenericEventRegistration.prototype, "isReady", {
			get: function () {
				return this.m_isReady;
			},
			enumerable: true,
			configurable: true
		});
		GenericEventRegistration.prototype.register=function (eventId, targetId, handler) {
			var _this=this;
			return this.ready()
				.then(function () { return _this.m_eventRegistration.register(eventId, targetId, handler); });
		};
		GenericEventRegistration.prototype.unregister=function (eventId, targetId, handler) {
			var _this=this;
			return this.ready()
				.then(function () { return _this.m_eventRegistration.unregister(eventId, targetId, handler); });
		};
		GenericEventRegistration.prototype._registerEventImpl=function (eventId, targetId) {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		GenericEventRegistration.prototype._unregisterEventImpl=function (eventId, targetId) {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		GenericEventRegistration.prototype._handleRichApiMessage=function (msg) {
			if (msg && msg.entries) {
				for (var entryIndex=0; entryIndex < msg.entries.length; entryIndex++) {
					var entry=msg.entries[entryIndex];
					if (entry.messageCategory==OfficeExtension.Constants.eventMessageCategory) {
						if (OfficeExtension.Utility._logEnabled) {
							OfficeExtension.Utility.log(JSON.stringify(entry));
						}
						var funcs=this.m_eventRegistration.getHandlers(entry.messageType, entry.targetId);
						if (funcs.length > 0) {
							var arg=JSON.parse(entry.message);
							if (entry.isRemoteOverride) {
								arg.source=OfficeExtension.Constants.eventSourceRemote;
							}
							for (var i=0; i < funcs.length; i++) {
								funcs[i](arg);
							}
						}
					}
				}
			}
		};
		GenericEventRegistration.getGenericEventRegistration=function () {
			if (!GenericEventRegistration.s_genericEventRegistration) {
				GenericEventRegistration.s_genericEventRegistration=new GenericEventRegistration();
			}
			return GenericEventRegistration.s_genericEventRegistration;
		};
		GenericEventRegistration.richApiMessageEventCategory=65536;
		return GenericEventRegistration;
	}());
	function _testSetRichApiMessageReadyImpl(impl) {
		GenericEventRegistration._testReadyImpl=impl;
	}
	OfficeExtension._testSetRichApiMessageReadyImpl=_testSetRichApiMessageReadyImpl;
	function _testTriggerRichApiMessageEvent(msg) {
		GenericEventRegistration.getGenericEventRegistration()._handleRichApiMessage(msg);
	}
	OfficeExtension._testTriggerRichApiMessageEvent=_testTriggerRichApiMessageEvent;
	var GenericEventHandlers=(function (_super) {
		__extends(GenericEventHandlers, _super);
		function GenericEventHandlers(context, parentObject, name, eventInfo) {
			_super.call(this, context, parentObject, name, eventInfo);
			this.m_genericEventInfo=eventInfo;
		}
		GenericEventHandlers.prototype.add=function (handler) {
			var _this=this;
			if ((this._handlers.length==0) && this.m_genericEventInfo.registerFunc) {
				this.m_genericEventInfo.registerFunc();
			}
			if (!GenericEventRegistration.getGenericEventRegistration().isReady) {
				this._context._pendingRequest._addPreSyncPromise(GenericEventRegistration.getGenericEventRegistration().ready());
			}
			OfficeExtension.ActionFactory.createTraceMarkerForCallback(this._context, function () {
				_this._handlers.push(handler);
				if (_this._handlers.length==1) {
					GenericEventRegistration.getGenericEventRegistration().register(_this.m_genericEventInfo.eventType, _this.m_genericEventInfo.getTargetIdFunc(), _this._callback);
				}
			});
			return new OfficeExtension.EventHandlerResult(this._context, this, handler);
		};
		GenericEventHandlers.prototype.remove=function (handler) {
			var _this=this;
			if ((this._handlers.length==1) && this.m_genericEventInfo.unregisterFunc) {
				this.m_genericEventInfo.unregisterFunc();
			}
			OfficeExtension.ActionFactory.createTraceMarkerForCallback(this._context, function () {
				var handlers=_this._handlers;
				for (var index=handlers.length - 1; index >=0; index--) {
					if (handlers[index]===handler) {
						handlers.splice(index, 1);
						break;
					}
				}
				if (handlers.length==0) {
					GenericEventRegistration.getGenericEventRegistration().unregister(_this.m_genericEventInfo.eventType, _this.m_genericEventInfo.getTargetIdFunc(), _this._callback);
				}
			});
		};
		GenericEventHandlers.prototype.removeAll=function () {
		};
		return GenericEventHandlers;
	}(OfficeExtension.EventHandlers));
	OfficeExtension.GenericEventHandlers=GenericEventHandlers;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var HttpRequestExecutor=(function () {
		function HttpRequestExecutor() {
		}
		HttpRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var requestMessageText=JSON.stringify(requestMessage.Body);
			var url=requestMessage.Url;
			if (url.charAt(url.length - 1) !="/") {
				url=url+"/";
			}
			url=url+OfficeExtension.Constants.processQuery;
			url=url+"?"+OfficeExtension.Constants.flags+"="+requestFlags.toString();
			var requestInfo={
				method: "POST",
				url: url,
				headers: {},
				body: requestMessageText
			};
			requestInfo.headers[OfficeExtension.Constants.sourceLibHeader]=HttpRequestExecutor.SourceLibHeaderValue;
			requestInfo.headers["CONTENT-TYPE"]="application/json";
			if (requestMessage.Headers) {
				for (var key in requestMessage.Headers) {
					requestInfo.headers[key]=requestMessage.Headers[key];
				}
			}
			return OfficeExtension.HttpUtility.sendRequest(requestInfo)
				.then(function (responseInfo) {
				var response;
				if (responseInfo.statusCode===200) {
					response={ ErrorCode: null, ErrorMessage: null, Headers: responseInfo.headers, Body: JSON.parse(responseInfo.body) };
				}
				else {
					OfficeExtension.Utility.log("Error Response:"+responseInfo.body);
					var error=OfficeExtension.Utility._parseErrorResponse(responseInfo);
					response={
						ErrorCode: error.errorCode,
						ErrorMessage: error.errorMessage,
						Headers: responseInfo.headers,
						Body: null
					};
				}
				return response;
			});
		};
		HttpRequestExecutor.SourceLibHeaderValue="officejs-rest";
		return HttpRequestExecutor;
	}());
	OfficeExtension.HttpRequestExecutor=HttpRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var HttpUtility=(function () {
		function HttpUtility() {
		}
		HttpUtility.setCustomSendRequestFunc=function (func) {
			HttpUtility.s_customSendRequestFunc=func;
		};
		HttpUtility.xhrSendRequestFunc=function (request) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				var xhr=new XMLHttpRequest();
				xhr.open(request.method, request.url);
				xhr.onload=function () {
					var resp={
						statusCode: xhr.status,
						headers: OfficeExtension.Utility._parseHttpResponseHeaders(xhr.getAllResponseHeaders()),
						body: xhr.responseText
					};
					resolve(resp);
				};
				xhr.onerror=function () {
					reject(new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.connectionFailure,
						message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithStatus, xhr.statusText)
					}));
				};
				if (request.headers) {
					for (var key in request.headers) {
						xhr.setRequestHeader(key, request.headers[key]);
					}
				}
				xhr.send(request.body);
			});
		};
		HttpUtility.sendRequest=function (request) {
			HttpUtility.validateAndNormalizeRequest(request);
			var func=HttpUtility.s_customSendRequestFunc;
			if (!func) {
				func=HttpUtility.xhrSendRequestFunc;
			}
			return func(request);
		};
		HttpUtility.setCustomSendLocalDocumentRequestFunc=function (func) {
			HttpUtility.s_customSendLocalDocumentRequestFunc=func;
		};
		HttpUtility.sendLocalDocumentRequest=function (request) {
			HttpUtility.validateAndNormalizeRequest(request);
			var func;
			func=HttpUtility.s_customSendLocalDocumentRequestFunc || HttpUtility.officeJsSendLocalDocumentRequestFunc;
			return func(request);
		};
		HttpUtility.officeJsSendLocalDocumentRequestFunc=function (request) {
			request=OfficeExtension.Utility._validateLocalDocumentRequest(request);
			var requestSafeArray=OfficeExtension.Utility._buildRequestMessageSafeArray(request);
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				OSF.DDA.RichApi.executeRichApiRequestAsync(requestSafeArray, function (asyncResult) {
					var response;
					if (asyncResult.status=="succeeded") {
						response=							{
								statusCode: OfficeExtension.RichApiMessageUtility.getResponseStatusCode(asyncResult),
								headers: OfficeExtension.RichApiMessageUtility.getResponseHeaders(asyncResult),
								body: OfficeExtension.RichApiMessageUtility.getResponseBody(asyncResult)
							};
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildHttpResponseFromOfficeJsError(asyncResult.error.code, asyncResult.error.message);
					}
					OfficeExtension.Utility.log(JSON.stringify(response));
					resolve(response);
				});
			});
		};
		HttpUtility.validateAndNormalizeRequest=function (request) {
			if (OfficeExtension.Utility.isNullOrUndefined(request)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError({
					argumentName: "request"
				});
			}
			if (OfficeExtension.Utility.isNullOrEmptyString(request.method)) {
				request.method="GET";
			}
			request.method=request.method.toUpperCase();
		};
		HttpUtility.logRequest=function (request) {
			if (OfficeExtension.Utility._logEnabled) {
				OfficeExtension.Utility.log("---HTTP Request---");
				OfficeExtension.Utility.log(request.method+" "+request.url);
				if (request.headers) {
					for (var key in request.headers) {
						OfficeExtension.Utility.log(key+": "+request.headers[key]);
					}
				}
				if (HttpUtility._logBody) {
					OfficeExtension.Utility.log(request.body);
				}
			}
		};
		HttpUtility.logResponse=function (response) {
			if (OfficeExtension.Utility._logEnabled) {
				OfficeExtension.Utility.log("---HTTP Response---");
				OfficeExtension.Utility.log(""+response.statusCode);
				if (response.headers) {
					for (var key in response.headers) {
						OfficeExtension.Utility.log(key+": "+response.headers[key]);
					}
				}
				if (HttpUtility._logBody) {
					OfficeExtension.Utility.log(response.body);
				}
			}
		};
		HttpUtility._logBody=false;
		return HttpUtility;
	}());
	OfficeExtension.HttpUtility=HttpUtility;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var InstantiateActionResultHandler=(function () {
		function InstantiateActionResultHandler(clientObject) {
			this.m_clientObject=clientObject;
		}
		InstantiateActionResultHandler.prototype._handleResult=function (value) {
			this.m_clientObject._handleIdResult(value);
		};
		return InstantiateActionResultHandler;
	}());
	OfficeExtension.InstantiateActionResultHandler=InstantiateActionResultHandler;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var HostBridgeRequestExecutor=(function () {
		function HostBridgeRequestExecutor(session) {
			this.m_session=session;
		}
		HostBridgeRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var httpRequestInfo={
				url: OfficeExtension.Constants.processQuery,
				method: "POST",
				headers: requestMessage.Headers,
				body: requestMessage.Body
			};
			var message={
				id: HostBridgeSession.nextId(),
				type: 1,
				flags: requestFlags,
				message: httpRequestInfo
			};
			OfficeExtension.Utility.log(JSON.stringify(message));
			return this.m_session.sendMessageToHost(message)
				.then(function (nativeBridgeResponse) {
				OfficeExtension.Utility.log("Received response: "+JSON.stringify(nativeBridgeResponse));
				var responseInfo=nativeBridgeResponse.message;
				var response;
				if (responseInfo.statusCode===200) {
					response={ ErrorCode: null, ErrorMessage: null, Headers: responseInfo.headers, Body: responseInfo.body };
				}
				else {
					OfficeExtension.Utility.log("Error Response:"+responseInfo.body);
					var error=OfficeExtension.Utility._parseErrorResponse(responseInfo);
					response={
						ErrorCode: error.errorCode,
						ErrorMessage: error.errorMessage,
						Headers: responseInfo.headers,
						Body: null
					};
				}
				return response;
			});
		};
		return HostBridgeRequestExecutor;
	}());
	var HostBridgeSession=(function (_super) {
		__extends(HostBridgeSession, _super);
		function HostBridgeSession(bridge) {
			var _this=this;
			_super.call(this);
			this.m_promiseResolver={};
			this.m_bridge=bridge;
			this.m_bridge.onMessageFromHost=function (msg) {
				_this.onMessageFromHost(msg);
			};
		}
		HostBridgeSession.prototype._resolveRequestUrlAndHeaderInfo=function () {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		HostBridgeSession.prototype._createRequestExecutorOrNull=function () {
			OfficeExtension.Utility.log("NativeBridgeSession::CreateRequestExecutor");
			return new HostBridgeRequestExecutor(this);
		};
		Object.defineProperty(HostBridgeSession.prototype, "eventRegistration", {
			get: function () {
				return OfficeExtension._Internal.officeJsEventRegistration;
			},
			enumerable: true,
			configurable: true
		});
		HostBridgeSession.init=function (bridge) {
			if (bridge && typeof (bridge)==="object") {
				var session=new HostBridgeSession(bridge);
				OfficeExtension.ClientRequestContext._overrideSession=session;
				OfficeExtension.HttpUtility.setCustomSendLocalDocumentRequestFunc(function (request) {
					var bridgeMessage={
						id: HostBridgeSession.nextId(),
						type: 1,
						flags: 0,
						message: request
					};
					return session.sendMessageToHost(bridgeMessage)
						.then(function (bridgeResponse) {
						var responseInfo=bridgeResponse.message;
						return responseInfo;
					});
				});
			}
		};
		HostBridgeSession.prototype.sendMessageToHost=function (message) {
			var _this=this;
			this.m_bridge.sendMessageToHost(JSON.stringify(message));
			var ret=new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this.m_promiseResolver[message.id]=resolve;
			});
			return ret;
		};
		HostBridgeSession.prototype.onMessageFromHost=function (messageText) {
			if (messageText==="test") {
				if (HostBridgeTest._testFunc) {
					HostBridgeTest._testFunc();
				}
			}
			else {
				var message=JSON.parse(messageText);
				if (typeof (message.id)==="number") {
					var resolve=this.m_promiseResolver[message.id];
					if (resolve) {
						resolve(message);
					}
					delete this.m_promiseResolver[message.id];
				}
			}
		};
		HostBridgeSession.nextId=function () {
			return HostBridgeSession.s_nextId++;
		};
		HostBridgeSession.s_nextId=1;
		return HostBridgeSession;
	}(OfficeExtension.SessionBase));
	var HostBridge=(function () {
		function HostBridge() {
		}
		HostBridge.init=function (bridge) {
			HostBridgeSession.init(bridge);
		};
		return HostBridge;
	}());
	OfficeExtension.HostBridge=HostBridge;
	if (typeof (_richApiNativeBridge)==="object" && _richApiNativeBridge) {
		HostBridge.init(_richApiNativeBridge);
	}
	var HostBridgeTest=(function () {
		function HostBridgeTest() {
		}
		HostBridgeTest.setTestFunc=function (func) {
			HostBridgeTest._testFunc=func;
		};
		return HostBridgeTest;
	}());
	OfficeExtension.HostBridgeTest=HostBridgeTest;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPath=(function () {
		function ObjectPath(objectPathInfo, parentObjectPath, isCollection, isInvalidAfterRequest) {
			this.m_objectPathInfo=objectPathInfo;
			this.m_parentObjectPath=parentObjectPath;
			this.m_isWriteOperation=false;
			this.m_isCollection=isCollection;
			this.m_isInvalidAfterRequest=isInvalidAfterRequest;
			this.m_isValid=true;
		}
		Object.defineProperty(ObjectPath.prototype, "objectPathInfo", {
			get: function () {
				return this.m_objectPathInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			set: function (value) {
				this.m_isWriteOperation=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isRestrictedResourceAccess", {
			get: function () {
				return this.m_isRestrictedResourceAccess;
			},
			set: function (value) {
				this.m_isRestrictedResourceAccess=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isCollection", {
			get: function () {
				return this.m_isCollection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isInvalidAfterRequest", {
			get: function () {
				return this.m_isInvalidAfterRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "parentObjectPath", {
			get: function () {
				return this.m_parentObjectPath;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "argumentObjectPaths", {
			get: function () {
				return this.m_argumentObjectPaths;
			},
			set: function (value) {
				this.m_argumentObjectPaths=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isValid", {
			get: function () {
				return this.m_isValid;
			},
			set: function (value) {
				this.m_isValid=value;
				if (!value &&
					this.m_objectPathInfo.ObjectPathType===6 &&
					this.m_savedObjectPathInfo) {
					ObjectPath.copyObjectPathInfo(this.m_savedObjectPathInfo.pathInfo, this.m_objectPathInfo);
					this.m_parentObjectPath=this.m_savedObjectPathInfo.parent;
					this.m_isValid=true;
					this.m_savedObjectPathInfo=null;
				}
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "getByIdMethodName", {
			get: function () {
				return this.m_getByIdMethodName;
			},
			set: function (value) {
				this.m_getByIdMethodName=value;
			},
			enumerable: true,
			configurable: true
		});
		ObjectPath.prototype._updateAsNullObject=function () {
			this.m_isInvalidAfterRequest=false;
			this.m_isValid=true;
			this.m_objectPathInfo.ObjectPathType=7;
			this.m_objectPathInfo.Name="";
			this.m_objectPathInfo.ArgumentInfo={};
			this.m_parentObjectPath=null;
			this.m_argumentObjectPaths=null;
		};
		ObjectPath.prototype.updateUsingObjectData=function (value) {
			var referenceId=value[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				if (!this.m_savedObjectPathInfo &&
					!this.isInvalidAfterRequest &&
					ObjectPath.isRestorableObjectPath(this.m_objectPathInfo.ObjectPathType)) {
					var pathInfo={};
					ObjectPath.copyObjectPathInfo(this.m_objectPathInfo, pathInfo);
					this.m_savedObjectPathInfo={
						pathInfo: pathInfo,
						parent: this.m_parentObjectPath
					};
				}
				this.m_isInvalidAfterRequest=false;
				this.m_isValid=true;
				this.m_objectPathInfo.ObjectPathType=6;
				this.m_objectPathInfo.Name=referenceId;
				this.m_objectPathInfo.ArgumentInfo={};
				delete this.m_objectPathInfo.ParentObjectPathId;
				this.m_parentObjectPath=null;
				this.m_argumentObjectPaths=null;
				return;
			}
			var parentIsCollection=this.parentObjectPath && this.parentObjectPath.isCollection;
			var getByIdMethodName=this.getByIdMethodName;
			if (parentIsCollection || !OfficeExtension.Utility.isNullOrEmptyString(getByIdMethodName)) {
				var id=OfficeExtension.Utility.tryGetObjectIdFromLoadOrRetrieveResult(value);
				if (!OfficeExtension.Utility.isNullOrUndefined(id)) {
					this.m_isInvalidAfterRequest=false;
					this.m_isValid=true;
					if (!OfficeExtension.Utility.isNullOrEmptyString(getByIdMethodName)) {
						this.m_objectPathInfo.ObjectPathType=3;
						this.m_objectPathInfo.Name=getByIdMethodName;
						this.m_getByIdMethodName=null;
					}
					else {
						this.m_objectPathInfo.ObjectPathType=5;
						this.m_objectPathInfo.Name="";
					}
					this.isWriteOperation=false;
					this.m_objectPathInfo.ArgumentInfo={};
					this.m_objectPathInfo.ArgumentInfo.Arguments=[id];
					this.m_argumentObjectPaths=null;
					return;
				}
			}
		};
		ObjectPath.isRestorableObjectPath=function (objectPathType) {
			return (objectPathType===1 ||
				objectPathType===5 ||
				objectPathType===3 ||
				objectPathType===4);
		};
		ObjectPath.copyObjectPathInfo=function (src, dest) {
			dest.Id=src.Id;
			dest.ArgumentInfo=src.ArgumentInfo;
			dest.Name=src.Name;
			dest.ObjectPathType=src.ObjectPathType;
			dest.ParentObjectPathId=src.ParentObjectPathId;
		};
		return ObjectPath;
	}());
	OfficeExtension.ObjectPath=ObjectPath;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPathFactory=(function () {
		function ObjectPathFactory() {
		}
		ObjectPathFactory.createGlobalObjectObjectPath=function (context) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 1, Name: "" };
			return new OfficeExtension.ObjectPath(objectPathInfo, null, false, false);
		};
		ObjectPathFactory.createNewObjectObjectPath=function (context, typeName, isCollection, isRestrictedResourceAccess) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 2, Name: typeName };
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, null, isCollection, false);
			ret.isRestrictedResourceAccess=isRestrictedResourceAccess;
			return ret;
		};
		ObjectPathFactory.createPropertyObjectPath=function (context, parent, propertyName, isCollection, isInvalidAfterRequest, isRestrictedResourceAccess) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 4,
				Name: propertyName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
			ret.isRestrictedResourceAccess=isRestrictedResourceAccess;
			return ret;
		};
		ObjectPathFactory.createIndexerObjectPath=function (context, parent, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5,
				Name: "",
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createIndexerObjectPathUsingParentPath=function (context, parentObjectPath, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5,
				Name: "",
				ParentObjectPathId: parentObjectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parentObjectPath, false, false);
		};
		ObjectPathFactory.createMethodObjectPath=function (context, parent, methodName, operationType, args, isCollection, isInvalidAfterRequest, getByIdMethodName, isRestrictedResourceAccess) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3,
				Name: methodName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var argumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, objectPathInfo.ArgumentInfo, args);
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
			ret.argumentObjectPaths=argumentObjectPaths;
			ret.isWriteOperation=(operationType !=1);
			ret.getByIdMethodName=getByIdMethodName;
			ret.isRestrictedResourceAccess=isRestrictedResourceAccess;
			return ret;
		};
		ObjectPathFactory.createReferenceIdObjectPath=function (context, referenceId) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 6,
				Name: referenceId,
				ArgumentInfo: {}
			};
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, null, false, false);
			return ret;
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt=function (hasIndexerMethod, context, parent, childItem, index) {
			var id=OfficeExtension.Utility.tryGetObjectIdFromLoadOrRetrieveResult(childItem);
			if (hasIndexerMethod && !OfficeExtension.Utility.isNullOrUndefined(id)) {
				return ObjectPathFactory.createChildItemObjectPathUsingIndexer(context, parent, childItem);
			}
			else {
				return ObjectPathFactory.createChildItemObjectPathUsingGetItemAt(context, parent, childItem, index);
			}
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexer=function (context, parent, childItem) {
			var id=OfficeExtension.Utility.tryGetObjectIdFromLoadOrRetrieveResult(childItem);
			var objectPathInfo=objectPathInfo=				{
					Id: context._nextId(),
					ObjectPathType: 5,
					Name: "",
					ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
					ArgumentInfo: {}
				};
			objectPathInfo.ArgumentInfo.Arguments=[id];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createChildItemObjectPathUsingGetItemAt=function (context, parent, childItem, index) {
			var indexFromServer=childItem[OfficeExtension.Constants.index];
			if (indexFromServer) {
				index=indexFromServer;
			}
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3,
				Name: OfficeExtension.Constants.getItemAt,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=[index];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		return ObjectPathFactory;
	}());
	OfficeExtension.ObjectPathFactory=ObjectPathFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var OfficeJsRequestExecutor=(function () {
		function OfficeJsRequestExecutor(context) {
			this.m_context=context;
		}
		OfficeJsRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var _this=this;
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, OfficeJsRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				OSF.DDA.RichApi.executeRichApiRequestAsync(messageSafearray, function (result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (result.status=="succeeded") {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBody(result), OfficeExtension.RichApiMessageUtility.getResponseHeaders(result));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.code, result.error.message);
						_this.m_context._processOfficeJsErrorResponse(result.error.code, response);
					}
					resolve(response);
				});
			});
		};
		OfficeJsRequestExecutor.SourceLibHeaderValue="officejs";
		return OfficeJsRequestExecutor;
	}());
	OfficeExtension.OfficeJsRequestExecutor=OfficeJsRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		_Internal.OfficeRequire=function () {
			return null;
		}();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var _Internal;
	(function (_Internal) {
		var PromiseImpl;
		(function (PromiseImpl) {
			function Init() {
				return (function () {
					"use strict";
					function lib$es6$promise$utils$$objectOrFunction(x) {
						return typeof x==='function' || (typeof x==='object' && x !==null);
					}
					function lib$es6$promise$utils$$isFunction(x) {
						return typeof x==='function';
					}
					function lib$es6$promise$utils$$isMaybeThenable(x) {
						return typeof x==='object' && x !==null;
					}
					var lib$es6$promise$utils$$_isArray;
					if (!Array.isArray) {
						lib$es6$promise$utils$$_isArray=function (x) {
							return Object.prototype.toString.call(x)==='[object Array]';
						};
					}
					else {
						lib$es6$promise$utils$$_isArray=Array.isArray;
					}
					var lib$es6$promise$utils$$isArray=lib$es6$promise$utils$$_isArray;
					var lib$es6$promise$asap$$len=0;
					var lib$es6$promise$asap$$toString={}.toString;
					var lib$es6$promise$asap$$vertxNext;
					var lib$es6$promise$asap$$customSchedulerFn;
					var lib$es6$promise$asap$$asap=function asap(callback, arg) {
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len]=callback;
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len+1]=arg;
						lib$es6$promise$asap$$len+=2;
						if (lib$es6$promise$asap$$len===2) {
							if (lib$es6$promise$asap$$customSchedulerFn) {
								lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
							}
							else {
								lib$es6$promise$asap$$scheduleFlush();
							}
						}
					};
					function lib$es6$promise$asap$$setScheduler(scheduleFn) {
						lib$es6$promise$asap$$customSchedulerFn=scheduleFn;
					}
					function lib$es6$promise$asap$$setAsap(asapFn) {
						lib$es6$promise$asap$$asap=asapFn;
					}
					var lib$es6$promise$asap$$browserWindow=(typeof window !=='undefined') ? window : undefined;
					var lib$es6$promise$asap$$browserGlobal=lib$es6$promise$asap$$browserWindow || {};
					var lib$es6$promise$asap$$BrowserMutationObserver=lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
					var lib$es6$promise$asap$$isNode=typeof process !=='undefined' && {}.toString.call(process)==='[object process]';
					var lib$es6$promise$asap$$isWorker=typeof Uint8ClampedArray !=='undefined' &&
						typeof importScripts !=='undefined' &&
						typeof MessageChannel !=='undefined';
					function lib$es6$promise$asap$$useNextTick() {
						var nextTick=process.nextTick;
						var version=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
						if (Array.isArray(version) && version[1]==='0' && version[2]==='10') {
							nextTick=setImmediate;
						}
						return function () {
							nextTick(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useVertxTimer() {
						return function () {
							lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useMutationObserver() {
						var iterations=0;
						var observer=new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
						var node=document.createTextNode('');
						observer.observe(node, { characterData: true });
						return function () {
							node.data=(iterations=++iterations % 2);
						};
					}
					function lib$es6$promise$asap$$useMessageChannel() {
						var channel=new MessageChannel();
						channel.port1.onmessage=lib$es6$promise$asap$$flush;
						return function () {
							channel.port2.postMessage(0);
						};
					}
					function lib$es6$promise$asap$$useSetTimeout() {
						return function () {
							setTimeout(lib$es6$promise$asap$$flush, 1);
						};
					}
					var lib$es6$promise$asap$$queue=new Array(1000);
					function lib$es6$promise$asap$$flush() {
						for (var i=0; i < lib$es6$promise$asap$$len; i+=2) {
							var callback=lib$es6$promise$asap$$queue[i];
							var arg=lib$es6$promise$asap$$queue[i+1];
							callback(arg);
							lib$es6$promise$asap$$queue[i]=undefined;
							lib$es6$promise$asap$$queue[i+1]=undefined;
						}
						lib$es6$promise$asap$$len=0;
					}
					var lib$es6$promise$asap$$scheduleFlush;
					if (lib$es6$promise$asap$$isNode) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useNextTick();
					}
					else if (lib$es6$promise$asap$$BrowserMutationObserver) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMutationObserver();
					}
					else if (lib$es6$promise$asap$$isWorker) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMessageChannel();
					}
					else {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useSetTimeout();
					}
					function lib$es6$promise$$internal$$noop() { }
					var lib$es6$promise$$internal$$PENDING=void 0;
					var lib$es6$promise$$internal$$FULFILLED=1;
					var lib$es6$promise$$internal$$REJECTED=2;
					var lib$es6$promise$$internal$$GET_THEN_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$selfFullfillment() {
						return new TypeError("You cannot resolve a promise with itself");
					}
					function lib$es6$promise$$internal$$cannotReturnOwn() {
						return new TypeError('A promises callback cannot return that same promise.');
					}
					function lib$es6$promise$$internal$$getThen(promise) {
						try {
							return promise.then;
						}
						catch (error) {
							lib$es6$promise$$internal$$GET_THEN_ERROR.error=error;
							return lib$es6$promise$$internal$$GET_THEN_ERROR;
						}
					}
					function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
						try {
							then.call(value, fulfillmentHandler, rejectionHandler);
						}
						catch (e) {
							return e;
						}
					}
					function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
						lib$es6$promise$asap$$asap(function (promise) {
							var sealed=false;
							var error=lib$es6$promise$$internal$$tryThen(then, thenable, function (value) {
								if (sealed) {
									return;
								}
								sealed=true;
								if (thenable !==value) {
									lib$es6$promise$$internal$$resolve(promise, value);
								}
								else {
									lib$es6$promise$$internal$$fulfill(promise, value);
								}
							}, function (reason) {
								if (sealed) {
									return;
								}
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, reason);
							}, 'Settle: '+(promise._label || ' unknown promise'));
							if (!sealed && error) {
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, error);
							}
						}, promise);
					}
					function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
						if (thenable._state===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, thenable._result);
						}
						else if (thenable._state===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, thenable._result);
						}
						else {
							lib$es6$promise$$internal$$subscribe(thenable, undefined, function (value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function (reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
					}
					function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
						if (maybeThenable.constructor===promise.constructor) {
							lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
						}
						else {
							var then=lib$es6$promise$$internal$$getThen(maybeThenable);
							if (then===lib$es6$promise$$internal$$GET_THEN_ERROR) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
							}
							else if (then===undefined) {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
							else if (lib$es6$promise$utils$$isFunction(then)) {
								lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
							}
							else {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
						}
					}
					function lib$es6$promise$$internal$$resolve(promise, value) {
						if (promise===value) {
							lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
						}
						else if (lib$es6$promise$utils$$objectOrFunction(value)) {
							lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
						}
						else {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
					}
					function lib$es6$promise$$internal$$publishRejection(promise) {
						if (promise._onerror) {
							promise._onerror(promise._result);
						}
						lib$es6$promise$$internal$$publish(promise);
					}
					function lib$es6$promise$$internal$$fulfill(promise, value) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._result=value;
						promise._state=lib$es6$promise$$internal$$FULFILLED;
						if (promise._subscribers.length !==0) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
						}
					}
					function lib$es6$promise$$internal$$reject(promise, reason) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._state=lib$es6$promise$$internal$$REJECTED;
						promise._result=reason;
						lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
					}
					function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
						var subscribers=parent._subscribers;
						var length=subscribers.length;
						parent._onerror=null;
						subscribers[length]=child;
						subscribers[length+lib$es6$promise$$internal$$FULFILLED]=onFulfillment;
						subscribers[length+lib$es6$promise$$internal$$REJECTED]=onRejection;
						if (length===0 && parent._state) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
						}
					}
					function lib$es6$promise$$internal$$publish(promise) {
						var subscribers=promise._subscribers;
						var settled=promise._state;
						if (subscribers.length===0) {
							return;
						}
						var child, callback, detail=promise._result;
						for (var i=0; i < subscribers.length; i+=3) {
							child=subscribers[i];
							callback=subscribers[i+settled];
							if (child) {
								lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
							}
							else {
								callback(detail);
							}
						}
						promise._subscribers.length=0;
					}
					function lib$es6$promise$$internal$$ErrorObject() {
						this.error=null;
					}
					var lib$es6$promise$$internal$$TRY_CATCH_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$tryCatch(callback, detail) {
						try {
							return callback(detail);
						}
						catch (e) {
							lib$es6$promise$$internal$$TRY_CATCH_ERROR.error=e;
							return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
						}
					}
					function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
						var hasCallback=lib$es6$promise$utils$$isFunction(callback), value, error, succeeded, failed;
						if (hasCallback) {
							value=lib$es6$promise$$internal$$tryCatch(callback, detail);
							if (value===lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
								failed=true;
								error=value.error;
								value=null;
							}
							else {
								succeeded=true;
							}
							if (promise===value) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
								return;
							}
						}
						else {
							value=detail;
							succeeded=true;
						}
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
						}
						else if (hasCallback && succeeded) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						else if (failed) {
							lib$es6$promise$$internal$$reject(promise, error);
						}
						else if (settled===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
						else if (settled===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, value);
						}
					}
					function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
						try {
							resolver(function resolvePromise(value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function rejectPromise(reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
						catch (e) {
							lib$es6$promise$$internal$$reject(promise, e);
						}
					}
					function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
						var enumerator=this;
						enumerator._instanceConstructor=Constructor;
						enumerator.promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (enumerator._validateInput(input)) {
							enumerator._input=input;
							enumerator.length=input.length;
							enumerator._remaining=input.length;
							enumerator._init();
							if (enumerator.length===0) {
								lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
							}
							else {
								enumerator.length=enumerator.length || 0;
								enumerator._enumerate();
								if (enumerator._remaining===0) {
									lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
								}
							}
						}
						else {
							lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
						}
					}
					lib$es6$promise$enumerator$$Enumerator.prototype._validateInput=function (input) {
						return lib$es6$promise$utils$$isArray(input);
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._validationError=function () {
						return new _Internal.Error('Array Methods must be provided an Array');
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._init=function () {
						this._result=new Array(this.length);
					};
					var lib$es6$promise$enumerator$$default=lib$es6$promise$enumerator$$Enumerator;
					lib$es6$promise$enumerator$$Enumerator.prototype._enumerate=function () {
						var enumerator=this;
						var length=enumerator.length;
						var promise=enumerator.promise;
						var input=enumerator._input;
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							enumerator._eachEntry(input[i], i);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry=function (entry, i) {
						var enumerator=this;
						var c=enumerator._instanceConstructor;
						if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
							if (entry.constructor===c && entry._state !==lib$es6$promise$$internal$$PENDING) {
								entry._onerror=null;
								enumerator._settledAt(entry._state, i, entry._result);
							}
							else {
								enumerator._willSettleAt(c.resolve(entry), i);
							}
						}
						else {
							enumerator._remaining--;
							enumerator._result[i]=entry;
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._settledAt=function (state, i, value) {
						var enumerator=this;
						var promise=enumerator.promise;
						if (promise._state===lib$es6$promise$$internal$$PENDING) {
							enumerator._remaining--;
							if (state===lib$es6$promise$$internal$$REJECTED) {
								lib$es6$promise$$internal$$reject(promise, value);
							}
							else {
								enumerator._result[i]=value;
							}
						}
						if (enumerator._remaining===0) {
							lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt=function (promise, i) {
						var enumerator=this;
						lib$es6$promise$$internal$$subscribe(promise, undefined, function (value) {
							enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
						}, function (reason) {
							enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
						});
					};
					function lib$es6$promise$promise$all$$all(entries) {
						return new lib$es6$promise$enumerator$$default(this, entries).promise;
					}
					var lib$es6$promise$promise$all$$default=lib$es6$promise$promise$all$$all;
					function lib$es6$promise$promise$race$$race(entries) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (!lib$es6$promise$utils$$isArray(entries)) {
							lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
							return promise;
						}
						var length=entries.length;
						function onFulfillment(value) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						function onRejection(reason) {
							lib$es6$promise$$internal$$reject(promise, reason);
						}
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
						}
						return promise;
					}
					var lib$es6$promise$promise$race$$default=lib$es6$promise$promise$race$$race;
					function lib$es6$promise$promise$resolve$$resolve(object) {
						var Constructor=this;
						if (object && typeof object==='object' && object.constructor===Constructor) {
							return object;
						}
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$resolve(promise, object);
						return promise;
					}
					var lib$es6$promise$promise$resolve$$default=lib$es6$promise$promise$resolve$$resolve;
					function lib$es6$promise$promise$reject$$reject(reason) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$reject(promise, reason);
						return promise;
					}
					var lib$es6$promise$promise$reject$$default=lib$es6$promise$promise$reject$$reject;
					var lib$es6$promise$promise$$counter=0;
					function lib$es6$promise$promise$$needsResolver() {
						throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
					}
					function lib$es6$promise$promise$$needsNew() {
						throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
					}
					var lib$es6$promise$promise$$default=lib$es6$promise$promise$$Promise;
					function lib$es6$promise$promise$$Promise(resolver) {
						this._id=lib$es6$promise$promise$$counter++;
						this._state=undefined;
						this._result=undefined;
						this._subscribers=[];
						if (lib$es6$promise$$internal$$noop !==resolver) {
							if (!lib$es6$promise$utils$$isFunction(resolver)) {
								lib$es6$promise$promise$$needsResolver();
							}
							if (!(this instanceof lib$es6$promise$promise$$Promise)) {
								lib$es6$promise$promise$$needsNew();
							}
							lib$es6$promise$$internal$$initializePromise(this, resolver);
						}
					}
					lib$es6$promise$promise$$Promise.all=lib$es6$promise$promise$all$$default;
					lib$es6$promise$promise$$Promise.race=lib$es6$promise$promise$race$$default;
					lib$es6$promise$promise$$Promise.resolve=lib$es6$promise$promise$resolve$$default;
					lib$es6$promise$promise$$Promise.reject=lib$es6$promise$promise$reject$$default;
					lib$es6$promise$promise$$Promise._setScheduler=lib$es6$promise$asap$$setScheduler;
					lib$es6$promise$promise$$Promise._setAsap=lib$es6$promise$asap$$setAsap;
					lib$es6$promise$promise$$Promise._asap=lib$es6$promise$asap$$asap;
					lib$es6$promise$promise$$Promise.prototype={
						constructor: lib$es6$promise$promise$$Promise,
						then: function (onFulfillment, onRejection) {
							var parent=this;
							var state=parent._state;
							if (state===lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state===lib$es6$promise$$internal$$REJECTED && !onRejection) {
								return this;
							}
							var child=new this.constructor(lib$es6$promise$$internal$$noop);
							var result=parent._result;
							if (state) {
								var callback=arguments[state - 1];
								lib$es6$promise$asap$$asap(function () {
									lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
								});
							}
							else {
								lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
							}
							return child;
						},
						'catch': function (onRejection) {
							return this.then(null, onRejection);
						}
					};
					return lib$es6$promise$promise$$default;
				}).call(this);
			}
			PromiseImpl.Init=Init;
		})(PromiseImpl=_Internal.PromiseImpl || (_Internal.PromiseImpl={}));
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var _Internal;
	(function (_Internal) {
		function isEdgeLessThan14() {
			var userAgent=window.navigator.userAgent;
			var versionIdx=userAgent.indexOf("Edge/");
			if (versionIdx >=0) {
				userAgent=userAgent.substring(versionIdx+5, userAgent.length);
				if (userAgent < "14.14393")
					return true;
				else
					return false;
			}
			return false;
		}
		function determinePromise() {
			if (typeof (window)==="undefined" && typeof (Promise)==="function") {
				return Promise;
			}
			if (typeof (window) !=="undefined" && window.Promise) {
				if (isEdgeLessThan14()) {
					return _Internal.PromiseImpl.Init();
				}
				else {
					return window.Promise;
				}
			}
			else {
				return _Internal.PromiseImpl.Init();
			}
		}
		_Internal.OfficePromise=determinePromise();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var OfficePromise=_Internal.OfficePromise;
	OfficeExtension.Promise=OfficePromise;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var TrackedObjects=(function () {
		function TrackedObjects(context) {
			this._autoCleanupList={};
			this.m_context=context;
		}
		TrackedObjects.prototype.add=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._addCommon(item, true); });
			}
			else {
				this._addCommon(param, true);
			}
		};
		TrackedObjects.prototype._autoAdd=function (object) {
			this._addCommon(object, false);
			this._autoCleanupList[object._objectPath.objectPathInfo.Id]=object;
		};
		TrackedObjects.prototype._autoTrackIfNecessaryWhenHandleObjectResultValue=function (object, resultValue) {
			var shouldAutoTrack=(this.m_context._autoCleanup &&
				!object[OfficeExtension.Constants.isTracked] &&
				object !==this.m_context._rootObject &&
				resultValue &&
				!OfficeExtension.Utility.isNullOrEmptyString(resultValue[OfficeExtension.Constants.referenceId]));
			if (shouldAutoTrack) {
				this._autoCleanupList[object._objectPath.objectPathInfo.Id]=object;
				object[OfficeExtension.Constants.isTracked]=true;
			}
		};
		TrackedObjects.prototype._addCommon=function (object, isExplicitlyAdded) {
			if (object[OfficeExtension.Constants.isTracked]) {
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				return;
			}
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (OfficeExtension.Utility.isNullOrEmptyString(referenceId) && object._KeepReference) {
				object._KeepReference();
				OfficeExtension.ActionFactory.createInstantiateAction(this.m_context, object);
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				object[OfficeExtension.Constants.isTracked]=true;
			}
		};
		TrackedObjects.prototype.remove=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._removeCommon(item); });
			}
			else {
				this._removeCommon(param);
			}
		};
		TrackedObjects.prototype._removeCommon=function (object) {
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				var rootObject=this.m_context._rootObject;
				if (rootObject._RemoveReference) {
					rootObject._RemoveReference(referenceId);
				}
				delete object[OfficeExtension.Constants.isTracked];
			}
		};
		TrackedObjects.prototype._retrieveAndClearAutoCleanupList=function () {
			var list=this._autoCleanupList;
			this._autoCleanupList={};
			return list;
		};
		return TrackedObjects;
	}());
	OfficeExtension.TrackedObjects=TrackedObjects;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var RequestPrettyPrinter=(function () {
		function RequestPrettyPrinter(globalObjName, referencedObjectPaths, actions, showDispose) {
			if (!globalObjName) {
				globalObjName="root";
			}
			this.m_globalObjName=globalObjName;
			this.m_referencedObjectPaths=referencedObjectPaths;
			this.m_actions=actions;
			this.m_statements=[];
			this.m_variableNameForObjectPathMap={};
			this.m_variableNameToObjectPathMap={};
			this.m_declaredObjectPathMap={};
			this.m_showDispose=showDispose;
		}
		RequestPrettyPrinter.prototype.process=function () {
			if (this.m_showDispose) {
				OfficeExtension.ClientRequest._calculateLastUsedObjectPathIds(this.m_actions);
			}
			for (var i=0; i < this.m_actions.length; i++) {
				this.processOneAction(this.m_actions[i]);
			}
			return this.m_statements;
		};
		RequestPrettyPrinter.prototype.processForDebugStatementInfo=function (actionIndex) {
			if (this.m_showDispose) {
				OfficeExtension.ClientRequest._calculateLastUsedObjectPathIds(this.m_actions);
			}
			var surroundingCount=5;
			this.m_statements=[];
			var oneStatement="";
			var statementIndex=-1;
			for (var i=0; i < this.m_actions.length; i++) {
				this.processOneAction(this.m_actions[i]);
				if (actionIndex==i) {
					statementIndex=this.m_statements.length - 1;
				}
				if (statementIndex >=0 && this.m_statements.length > statementIndex+surroundingCount+1) {
					break;
				}
			}
			if (statementIndex < 0) {
				return null;
			}
			var startIndex=statementIndex - surroundingCount;
			if (startIndex < 0) {
				startIndex=0;
			}
			var endIndex=statementIndex+1+surroundingCount;
			if (endIndex > this.m_statements.length) {
				endIndex=this.m_statements.length;
			}
			var surroundingStatements=[];
			if (startIndex !=0) {
				surroundingStatements.push("...");
			}
			for (var i_1=startIndex; i_1 < statementIndex; i_1++) {
				surroundingStatements.push(this.m_statements[i_1]);
			}
			surroundingStatements.push("// >>>>>");
			surroundingStatements.push(this.m_statements[statementIndex]);
			surroundingStatements.push("// <<<<<");
			for (var i_2=statementIndex+1; i_2 < endIndex; i_2++) {
				surroundingStatements.push(this.m_statements[i_2]);
			}
			if (endIndex < this.m_statements.length) {
				surroundingStatements.push("...");
			}
			return {
				statement: this.m_statements[statementIndex],
				surroundingStatements: surroundingStatements
			};
		};
		RequestPrettyPrinter.prototype.processOneAction=function (action) {
			var actionInfo=action.actionInfo;
			switch (actionInfo.ActionType) {
				case 1:
					this.processInstantiateAction(action);
					break;
				case 3:
					this.processMethodAction(action);
					break;
				case 2:
					this.processQueryAction(action);
					break;
				case 7:
					this.processQueryAsJsonAction(action);
					break;
				case 6:
					this.processRecursiveQueryAction(action);
					break;
				case 4:
					this.processSetPropertyAction(action);
					break;
				case 5:
					this.processTraceAction(action);
					break;
				case 8:
					this.processEnsureUnchangedAction(action);
					break;
				case 9:
					this.processUpdateAction(action);
					break;
			}
		};
		RequestPrettyPrinter.prototype.processInstantiateAction=function (action) {
			var objId=action.actionInfo.ObjectPathId;
			var objPath=this.m_referencedObjectPaths[objId];
			var varName=this.getObjVarName(objId);
			if (!this.m_declaredObjectPathMap[objId]) {
				var statement="var "+varName+"="+this.buildObjectPathExpressionWithParent(objPath)+";";
				statement=this.appendDisposeCommentIfRelevant(statement, action);
				this.m_statements.push(statement);
				this.m_declaredObjectPathMap[objId]=varName;
			}
			else {
				var statement="// Instantiate {"+varName+"}";
				statement=this.appendDisposeCommentIfRelevant(statement, action);
				this.m_statements.push(statement);
			}
		};
		RequestPrettyPrinter.prototype.processMethodAction=function (action) {
			var methodName=action.actionInfo.Name;
			if (methodName==="_KeepReference") {
				methodName="track";
			}
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+"."+OfficeExtension.Utility._toCamelLowerCase(methodName)+"("+this.buildArgumentsExpression(action.actionInfo.ArgumentInfo)+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processQueryAction=function (action) {
			var queryExp=this.buildQueryExpression(action);
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+".load("+queryExp+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processQueryAsJsonAction=function (action) {
			var queryExp=this.buildQueryExpression(action);
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+".retrieve("+queryExp+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processRecursiveQueryAction=function (action) {
			var queryExp="";
			if (action.actionInfo.RecursiveQueryInfo) {
				queryExp=JSON.stringify(action.actionInfo.RecursiveQueryInfo);
			}
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+".loadRecursive("+queryExp+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processSetPropertyAction=function (action) {
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+"."+OfficeExtension.Utility._toCamelLowerCase(action.actionInfo.Name)+"="+this.buildArgumentsExpression(action.actionInfo.ArgumentInfo)+";";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processTraceAction=function (action) {
			var statement="context.trace();";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processEnsureUnchangedAction=function (action) {
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+".ensureUnchanged("+JSON.stringify(action.actionInfo.ObjectState)+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.processUpdateAction=function (action) {
			var statement=this.getObjVarName(action.actionInfo.ObjectPathId)+".update("+JSON.stringify(action.actionInfo.ObjectState)+");";
			statement=this.appendDisposeCommentIfRelevant(statement, action);
			this.m_statements.push(statement);
		};
		RequestPrettyPrinter.prototype.appendDisposeCommentIfRelevant=function (statement, action) {
			var _this=this;
			if (this.m_showDispose) {
				var lastUsedObjectPathIds=action.actionInfo.L;
				if (lastUsedObjectPathIds && lastUsedObjectPathIds.length > 0) {
					var objectNamesToDispose=lastUsedObjectPathIds.map(function (item) { return _this.getObjVarName(item); }).join(", ");
					return statement+" // And then dispose {"+objectNamesToDispose+"}";
				}
			}
			return statement;
		};
		RequestPrettyPrinter.prototype.buildQueryExpression=function (action) {
			if (action.actionInfo.QueryInfo) {
				var option={};
				option.select=action.actionInfo.QueryInfo.Select;
				option.expand=action.actionInfo.QueryInfo.Expand;
				option.skip=action.actionInfo.QueryInfo.Skip;
				option.top=action.actionInfo.QueryInfo.Top;
				if (typeof (option.top)==="undefined" && typeof (option.skip)==="undefined" && typeof (option.expand)==="undefined") {
					if (typeof (option.select)==="undefined") {
						return "";
					}
					else {
						return JSON.stringify(option.select);
					}
				}
				else {
					return JSON.stringify(option);
				}
			}
			return "";
		};
		RequestPrettyPrinter.prototype.buildObjectPathExpressionWithParent=function (objPath) {
			var hasParent=objPath.objectPathInfo.ObjectPathType==5 ||
				objPath.objectPathInfo.ObjectPathType==3 ||
				objPath.objectPathInfo.ObjectPathType==4;
			if (hasParent && objPath.objectPathInfo.ParentObjectPathId) {
				return this.getObjVarName(objPath.objectPathInfo.ParentObjectPathId)+"."+this.buildObjectPathExpression(objPath);
			}
			return this.buildObjectPathExpression(objPath);
		};
		RequestPrettyPrinter.prototype.buildObjectPathExpression=function (objPath) {
			switch (objPath.objectPathInfo.ObjectPathType) {
				case 1:
					return "context."+this.m_globalObjName;
				case 5:
					return "getItem("+this.buildArgumentsExpression(objPath.objectPathInfo.ArgumentInfo)+")";
				case 3:
					return OfficeExtension.Utility._toCamelLowerCase(objPath.objectPathInfo.Name)+"("+this.buildArgumentsExpression(objPath.objectPathInfo.ArgumentInfo)+")";
				case 2:
					return objPath.objectPathInfo.Name+".newObject()";
				case 7:
					return "null";
				case 4:
					return OfficeExtension.Utility._toCamelLowerCase(objPath.objectPathInfo.Name);
				case 6:
					return "context."+this.m_globalObjName+"._getObjectByReferenceId("+JSON.stringify(objPath.objectPathInfo.Name)+")";
			}
		};
		RequestPrettyPrinter.prototype.buildArgumentsExpression=function (args) {
			var ret="";
			if (!args.Arguments) {
				return ret;
			}
			for (var i=0; i < args.Arguments.length; i++) {
				if (i > 0) {
					ret=ret+", ";
				}
				ret=ret+this.buildArgumentLiteral(args.Arguments[i], args.ReferencedObjectPathIds ? args.ReferencedObjectPathIds[i] : null);
			}
			if (ret==="undefined") {
				ret="";
			}
			return ret;
		};
		RequestPrettyPrinter.prototype.buildArgumentLiteral=function (value, objectPathId) {
			if (typeof value=="number" && value===objectPathId) {
				return this.getObjVarName(objectPathId);
			}
			else {
				return JSON.stringify(value);
			}
		};
		RequestPrettyPrinter.prototype.getObjVarNameBase=function (objectPathId) {
			var ret="v";
			var objPath=this.m_referencedObjectPaths[objectPathId];
			if (objPath) {
				switch (objPath.objectPathInfo.ObjectPathType) {
					case 1:
						ret=this.m_globalObjName;
						break;
					case 4:
						ret=OfficeExtension.Utility._toCamelLowerCase(objPath.objectPathInfo.Name);
						break;
					case 3:
						var methodName=objPath.objectPathInfo.Name;
						if (methodName.length > 3 && methodName.substr(0, 3)==="Get") {
							methodName=methodName.substr(3);
						}
						ret=OfficeExtension.Utility._toCamelLowerCase(methodName);
						break;
					case 5:
						var parentName=this.getObjVarNameBase(objPath.objectPathInfo.ParentObjectPathId);
						if (parentName.charAt(parentName.length - 1)==="s") {
							ret=parentName.substr(0, parentName.length - 1);
						}
						else {
							ret=parentName+"Item";
						}
						break;
				}
			}
			return ret;
		};
		RequestPrettyPrinter.prototype.getObjVarName=function (objectPathId) {
			if (this.m_variableNameForObjectPathMap[objectPathId]) {
				return this.m_variableNameForObjectPathMap[objectPathId];
			}
			var ret=this.getObjVarNameBase(objectPathId);
			if (!this.m_variableNameToObjectPathMap[ret]) {
				this.m_variableNameForObjectPathMap[objectPathId]=ret;
				this.m_variableNameToObjectPathMap[ret]=objectPathId;
				return ret;
			}
			var i=1;
			while (this.m_variableNameToObjectPathMap[ret+i.toString()]) {
				i++;
			}
			ret=ret+i.toString();
			this.m_variableNameForObjectPathMap[objectPathId]=ret;
			this.m_variableNameToObjectPathMap[ret]=objectPathId;
			return ret;
		};
		return RequestPrettyPrinter;
	}());
	OfficeExtension.RequestPrettyPrinter=RequestPrettyPrinter;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ResourceStrings=(function () {
		function ResourceStrings() {
		}
		ResourceStrings.cannotRegisterEvent="CannotRegisterEvent";
		ResourceStrings.connectionFailureWithStatus="ConnectionFailureWithStatus";
		ResourceStrings.connectionFailureWithDetails="ConnectionFailureWithDetails";
		ResourceStrings.invalidObjectPath="InvalidObjectPath";
		ResourceStrings.invalidRequestContext="InvalidRequestContext";
		ResourceStrings.invalidArgument="InvalidArgument";
		ResourceStrings.invalidArgumentGeneric="InvalidArgumentGeneric";
		ResourceStrings.propertyNotLoaded="PropertyNotLoaded";
		ResourceStrings.runMustReturnPromise="RunMustReturnPromise";
		ResourceStrings.timeout="Timeout";
		ResourceStrings.propertyDoesNotExist="PropertyDoesNotExist";
		ResourceStrings.attemptingToSetReadOnlyProperty="AttemptingToSetReadOnlyProperty";
		ResourceStrings.moreInfoInnerError="MoreInfoInnerError";
		ResourceStrings.cannotApplyPropertyThroughSetMethod="CannotApplyPropertyThroughSetMethod";
		ResourceStrings.valueNotLoaded="ValueNotLoaded";
		ResourceStrings.invalidOrTimedOutSessionMessage="InvalidOrTimedOutSessionMessage";
		ResourceStrings.invalidOperationInCellEditMode="InvalidOperationInCellEditMode";
		ResourceStrings.customFunctionDefintionMissing="CustomFunctionDefintionMissing";
		ResourceStrings.customFunctionImplementationMissing="CustomFunctionImplementationMissing";
		ResourceStrings.customFunctionNameContainsBadChars="CustomFunctionNameContainsBadChars";
		ResourceStrings.customFunctionNameCannotSplit="CustomFunctionNameCannotSplit";
		ResourceStrings.customFunctionUnexpectedNumberOfEntriesInResultBatch="CustomFunctionUnexpectedNumberOfEntriesInResultBatch";
		ResourceStrings.customFunctionCancellationHandlerMissing="CustomFunctionCancellationHandlerMissing";
		ResourceStrings.apiNotFoundDetails="ApiNotFoundDetails";
		ResourceStrings.pendingBatchInProgress="PendingBatchInProgress";
		ResourceStrings.notInsideBatch="NotInsideBatch";
		ResourceStrings.cannotUpdateReadOnlyProperty="CannotUpdateReadOnlyProperty";
		return ResourceStrings;
	}());
	OfficeExtension.ResourceStrings=ResourceStrings;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ResourceStringValues=(function () {
		function ResourceStringValues() {
		}
		ResourceStringValues.CannotRegisterEvent="The event handler cannot be registered.";
		ResourceStringValues.ConnectionFailureWithStatus="The request failed with status code of {0}.";
		ResourceStringValues.ConnectionFailureWithDetails="The request failed with status code of {0}, error code {1} and the following error message: {2}";
		ResourceStringValues.InvalidArgument="The argument '{0}' doesn't work for this situation, is missing, or isn't in the right format.";
		ResourceStringValues.InvalidObjectPath="The object path '{0}' isn't working for what you're trying to do. If you're using the object across multiple \"context.sync\" calls and outside the sequential execution of a \".run\" batch, please use the \"context.trackedObjects.add()\" and \"context.trackedObjects.remove()\" methods to manage the object's lifetime.";
		ResourceStringValues.InvalidRequestContext="Cannot use the object across different request contexts.";
		ResourceStringValues.PropertyNotLoaded="The property '{0}' is not available. Before reading the property's value, call the load method on the containing object and call \"context.sync()\" on the associated request context.";
		ResourceStringValues.RunMustReturnPromise="The batch function passed to the \".run\" method didn't return a promise. The function must return a promise, so that any automatically-tracked objects can be released at the completion of the batch operation. Typically, you return a promise by returning the response from \"context.sync()\".";
		ResourceStringValues.Timeout="The operation has timed out.";
		ResourceStringValues.ValueNotLoaded="The value of the result object has not been loaded yet. Before reading the value property, call \"context.sync()\" on the associated request context.";
		ResourceStringValues.InvalidOrTimedOutSessionMessage="Your Office Online session has expired or is invalid. To continue, refresh the page.";
		ResourceStringValues.InvalidOperationInCellEditMode="Excel is in cell-editing mode. Please exit the edit mode by pressing ENTER or TAB or selecting another cell, and then try again.";
		ResourceStringValues.CustomFunctionDefintionMissing="A property with this name that represents the function's definition must exist on Excel.CustomFunctions.";
		ResourceStringValues.CustomFunctionImplementationMissing="The property with this name on Excel.CustomFunctions that represents the function's definition must contain a 'call' property that implements the function.";
		ResourceStringValues.CustomFunctionNameContainsBadChars="The function name may only contain letters, digits, underscores, and periods.";
		ResourceStringValues.CustomFunctionNameCannotSplit="The function name must contain a non-empty namespace and a non-empty short name.";
		ResourceStringValues.CustomFunctionUnexpectedNumberOfEntriesInResultBatch="The batching function returned a number of results that doesn't match the number of parameter value sets that were passed into it.";
		ResourceStringValues.CustomFunctionCancellationHandlerMissing="The cancellation handler onCanceled is missing in the function. The handler must be present as the function is defined as cancelable.";
		ResourceStringValues.ApiNotFoundDetails="The method or property {0} is part of the {1} requirement set, which is not available in your version of {2}.";
		ResourceStringValues.PendingBatchInProgress="There is a pending batch in progress. The batch method may not be called inside another batch, or simultaneously with another batch.";
		ResourceStringValues.NotInsideBatch="Operations may not be invoked outside of a batch method.";
		ResourceStringValues.CannotUpdateReadOnlyProperty="The property '{0}' is read-only and it cannot be updated.";
		return ResourceStringValues;
	}());
	OfficeExtension.ResourceStringValues=ResourceStringValues;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var RichApiMessageUtility=(function () {
		function RichApiMessageUtility() {
		}
		RichApiMessageUtility.buildMessageArrayForIRequestExecutor=function (customData, requestFlags, requestMessage, sourceLibHeaderValue) {
			var requestMessageText=JSON.stringify(requestMessage.Body);
			OfficeExtension.Utility.log("Request:");
			OfficeExtension.Utility.log(requestMessageText);
			var headers={};
			headers[OfficeExtension.Constants.sourceLibHeader]=sourceLibHeaderValue;
			var messageSafearray=RichApiMessageUtility.buildRequestMessageSafeArray(customData, requestFlags, "POST", "ProcessQuery", headers, requestMessageText);
			return messageSafearray;
		};
		RichApiMessageUtility.buildResponseOnSuccess=function (responseBody, responseHeaders) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.Body=JSON.parse(responseBody);
			response.Headers=responseHeaders;
			return response;
		};
		RichApiMessageUtility.buildResponseOnError=function (errorCode, message) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.ErrorCode=OfficeExtension.ErrorCodes.generalException;
			response.ErrorMessage=message;
			if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability) {
				response.ErrorCode=OfficeExtension.ErrorCodes.accessDenied;
			}
			else if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached) {
				response.ErrorCode=OfficeExtension.ErrorCodes.activityLimitReached;
			}
			else if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeInvalidOrTimedOutSession) {
				response.ErrorCode=OfficeExtension.ErrorCodes.invalidOrTimedOutSession;
				response.ErrorMessage=OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidOrTimedOutSessionMessage);
			}
			return response;
		};
		RichApiMessageUtility.buildHttpResponseFromOfficeJsError=function (errorCode, message) {
			var statusCode=500;
			var errorBody={};
			errorBody["error"]={};
			errorBody["error"]["code"]=OfficeExtension.ErrorCodes.generalException;
			errorBody["error"]["message"]=message;
			if (errorCode===RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability) {
				statusCode=403;
				errorBody["error"]["code"]=OfficeExtension.ErrorCodes.accessDenied;
			}
			else if (errorCode===RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached) {
				statusCode=429;
				errorBody["error"]["code"]=OfficeExtension.ErrorCodes.activityLimitReached;
			}
			return { statusCode: statusCode, headers: {}, body: JSON.stringify(errorBody) };
		};
		RichApiMessageUtility.buildRequestMessageSafeArray=function (customData, requestFlags, method, path, headers, body) {
			var headerArray=[];
			if (headers) {
				for (var headerName in headers) {
					headerArray.push(headerName);
					headerArray.push(headers[headerName]);
				}
			}
			var appPermission=0;
			var solutionId="";
			var instanceId="";
			var marketplaceType="";
			return [
				customData,
				method,
				path,
				headerArray,
				body,
				appPermission,
				requestFlags,
				solutionId,
				instanceId,
				marketplaceType
			];
		};
		RichApiMessageUtility.getResponseBody=function (result) {
			return RichApiMessageUtility.getResponseBodyFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseHeaders=function (result) {
			return RichApiMessageUtility.getResponseHeadersFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseBodyFromSafeArray=function (data) {
			var ret=data[2];
			if (typeof (ret)==="string") {
				return ret;
			}
			var arr=ret;
			return arr.join("");
		};
		RichApiMessageUtility.getResponseHeadersFromSafeArray=function (data) {
			var arrayHeader=data[1];
			if (!arrayHeader) {
				return null;
			}
			var headers={};
			for (var i=0; i < arrayHeader.length - 1; i+=2) {
				headers[arrayHeader[i]]=arrayHeader[i+1];
			}
			return headers;
		};
		RichApiMessageUtility.getResponseStatusCode=function (result) {
			return RichApiMessageUtility.getResponseStatusCodeFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseStatusCodeFromSafeArray=function (data) {
			return data[0];
		};
		RichApiMessageUtility.OfficeJsErrorCode_ooeInvalidOrTimedOutSession=5012;
		RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached=5102;
		RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability=7000;
		return RichApiMessageUtility;
	}());
	OfficeExtension.RichApiMessageUtility=RichApiMessageUtility;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Utility=(function () {
		function Utility() {
		}
		Utility.checkArgumentNull=function (value, name) {
			if (Utility.isNullOrUndefined(value)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(name);
			}
		};
		Utility.isNullOrUndefined=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isUndefined=function (value) {
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isNullOrEmptyString=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			if (value.length==0) {
				return true;
			}
			return false;
		};
		Utility.isPlainJsonObject=function (value) {
			if (Utility.isNullOrUndefined(value)) {
				return false;
			}
			if (typeof (value) !=="object") {
				return false;
			}
			return Object.getPrototypeOf(value)===Object.getPrototypeOf({});
		};
		Utility.trim=function (str) {
			return str.replace(new RegExp("^\\s+|\\s+$", "g"), "");
		};
		Utility.caseInsensitiveCompareString=function (str1, str2) {
			if (Utility.isNullOrUndefined(str1)) {
				return Utility.isNullOrUndefined(str2);
			}
			else {
				if (Utility.isNullOrUndefined(str2)) {
					return false;
				}
				else {
					return str1.toUpperCase()==str2.toUpperCase();
				}
			}
		};
		Utility.adjustToDateTime=function (value) {
			if (Utility.isNullOrUndefined(value)) {
				return null;
			}
			if (typeof (value)==="string") {
				return new Date(value);
			}
			if (Array.isArray(value)) {
				var arr=value;
				for (var i=0; i < arr.length; i++) {
					arr[i]=Utility.adjustToDateTime(arr[i]);
				}
				return arr;
			}
			throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("date");
		};
		Utility.isReadonlyRestRequest=function (method) {
			return Utility.caseInsensitiveCompareString(method, "GET");
		};
		Utility.setMethodArguments=function (context, argumentInfo, args) {
			if (Utility.isNullOrUndefined(args)) {
				return null;
			}
			var referencedObjectPaths=new Array();
			var referencedObjectPathIds=new Array();
			var hasOne=Utility.collectObjectPathInfos(context, args, referencedObjectPaths, referencedObjectPathIds);
			argumentInfo.Arguments=args;
			if (hasOne) {
				argumentInfo.ReferencedObjectPathIds=referencedObjectPathIds;
				return referencedObjectPaths;
			}
			return null;
		};
		Utility.collectObjectPathInfos=function (context, args, referencedObjectPaths, referencedObjectPathIds) {
			var hasOne=false;
			for (var i=0; i < args.length; i++) {
				if (args[i] instanceof OfficeExtension.ClientObject) {
					var clientObject=args[i];
					Utility.validateContext(context, clientObject);
					args[i]=clientObject._objectPath.objectPathInfo.Id;
					referencedObjectPathIds.push(clientObject._objectPath.objectPathInfo.Id);
					referencedObjectPaths.push(clientObject._objectPath);
					hasOne=true;
				}
				else if (Array.isArray(args[i])) {
					var childArrayObjectPathIds=new Array();
					var childArrayHasOne=Utility.collectObjectPathInfos(context, args[i], referencedObjectPaths, childArrayObjectPathIds);
					if (childArrayHasOne) {
						referencedObjectPathIds.push(childArrayObjectPathIds);
						hasOne=true;
					}
					else {
						referencedObjectPathIds.push(0);
					}
				}
				else {
					referencedObjectPathIds.push(0);
				}
			}
			return hasOne;
		};
		Utility.fixObjectPathIfNecessary=function (clientObject, value) {
			if (clientObject && clientObject._objectPath && value) {
				clientObject._objectPath.updateUsingObjectData(value);
			}
		};
		Utility.tryGetObjectIdFromLoadOrRetrieveResult=function (value) {
			var id=value[OfficeExtension.Constants.id];
			if (Utility.isNullOrUndefined(id)) {
				id=value[OfficeExtension.Constants.idLowerCase];
			}
			if (Utility.isNullOrUndefined(id)) {
				id=value[OfficeExtension.Constants.idPrivate];
			}
			return id;
		};
		Utility.validateObjectPath=function (clientObject) {
			var objectPath=clientObject._objectPath;
			while (objectPath) {
				if (!objectPath.isValid) {
					throw new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.invalidObjectPath,
						message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, Utility.getObjectPathExpression(objectPath)),
						debugInfo: {
							errorLocation: Utility.getObjectPathExpression(objectPath)
						}
					});
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		Utility.validateReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					var objectPath=objectPaths[i];
					while (objectPath) {
						if (!objectPath.isValid) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidObjectPath,
								message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, Utility.getObjectPathExpression(objectPath))
							});
						}
						objectPath=objectPath.parentObjectPath;
					}
				}
			}
		};
		Utility.validateContext=function (context, obj) {
			if (obj && obj.context !==context) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidRequestContext,
					message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidRequestContext)
				});
			}
		};
		Utility.log=function (message) {
			if (Utility._logEnabled && typeof (console) !=="undefined" && console.log) {
				console.log(message);
			}
		};
		Utility.retrieve=function (clientObj, option) {
			var shouldPolyfill=OfficeExtension._internalConfig.alwaysPolyfillClientObjectRetrieveMethod;
			if (!shouldPolyfill) {
				shouldPolyfill=!Utility.isSetSupported("RichApiRuntime", "1.1");
			}
			var result=new OfficeExtension.RetrieveResultImpl(clientObj, shouldPolyfill);
			var queryOption=OfficeExtension.ClientRequestContext._parseQueryOption(option);
			var action;
			if (shouldPolyfill) {
				action=OfficeExtension.ActionFactory.createQueryAction(clientObj.context, clientObj, queryOption);
			}
			else {
				action=OfficeExtension.ActionFactory.createQueryAsJsonAction(clientObj.context, clientObj, queryOption);
			}
			clientObj.context._pendingRequest.addActionResultHandler(action, result);
			return result;
		};
		Utility.retrieveAndSync=function (clientObj, option) {
			return OfficeExtension._Internal.OfficePromise.resolve(null);
		};
		Utility.isSetSupported=function (apiSetName, apiSetVersion) {
			if (typeof (window) !=="undefined" && window.Office && window.Office.context && window.Office.context.requirements) {
				return window.Office.context.requirements.isSetSupported(apiSetName, apiSetVersion);
			}
			return true;
		};
		Utility._parseSelectExpand=function (select) {
			var args=[];
			if (!Utility.isNullOrEmptyString(select)) {
				var propertyNames=select.split(",");
				for (var i=0; i < propertyNames.length; i++) {
					var propertyName=propertyNames[i];
					propertyName=sanitizeForAnyItemsSlash(propertyName.trim());
					if (propertyName.length > 0) {
						args.push(propertyName);
					}
				}
			}
			return args;
			function sanitizeForAnyItemsSlash(propertyName) {
				var propertyNameLower=propertyName.toLowerCase();
				if (propertyNameLower==="items" || propertyNameLower==="items/") {
					return '*';
				}
				var itemsSlashLength=6;
				var isItemsSlashOrItemsDot=propertyNameLower.substr(0, itemsSlashLength)==="items/" ||
					propertyNameLower.substr(0, itemsSlashLength)==="items.";
				if (isItemsSlashOrItemsDot) {
					propertyName=propertyName.substr(itemsSlashLength);
				}
				return propertyName.replace(new RegExp("[\/\.]items[\/\.]", "gi"), "/");
			}
		};
		Utility.toJson=function (clientObj, scalarProperties, navigationProperties, collectionItemsIfAny) {
			var result={};
			for (var prop in scalarProperties) {
				var value=scalarProperties[prop];
				if (typeof value !=="undefined") {
					result[prop]=value;
				}
			}
			for (var prop in navigationProperties) {
				var value=navigationProperties[prop];
				if (typeof value !=="undefined") {
					if (value[Utility.fieldName_isCollection] && (typeof value[Utility.fieldName_m__items] !=="undefined")) {
						result[prop]=value.toJSON()["items"];
					}
					else {
						result[prop]=value.toJSON();
					}
				}
			}
			if (collectionItemsIfAny) {
				result["items"]=collectionItemsIfAny.map(function (item) { return item.toJSON(); });
			}
			return result;
		};
		Utility.throwError=function (resourceId, arg, errorLocation) {
			throw new OfficeExtension._Internal.RuntimeError({
				code: resourceId,
				message: Utility._getResourceString(resourceId, arg),
				debugInfo: errorLocation ? { errorLocation: errorLocation } : undefined
			});
		};
		Utility.createRuntimeError=function (code, message, location) {
			return (new OfficeExtension._Internal.RuntimeError({
				code: code,
				message: message,
				debugInfo: { errorLocation: location }
			}));
		};
		Utility._getResourceString=function (resourceId, arg) {
			var ret;
			if (typeof (window) !=="undefined" && window.Strings && window.Strings.OfficeOM) {
				var stringName="L_"+resourceId;
				var stringValue=window.Strings.OfficeOM[stringName];
				if (stringValue) {
					ret=stringValue;
				}
			}
			if (!ret) {
				ret=OfficeExtension.ResourceStringValues[resourceId];
			}
			if (!ret) {
				ret=resourceId;
			}
			if (!Utility.isNullOrUndefined(arg)) {
				if (Array.isArray(arg)) {
					var arrArg=arg;
					ret=Utility._formatString(ret, arrArg);
				}
				else {
					ret=ret.replace("{0}", arg);
				}
			}
			return ret;
		};
		Utility._formatString=function (format, arrArg) {
			return format.replace(/\{\d\}/g, function (v) {
				var position=parseInt(v.substr(1, v.length - 2));
				if (position < arrArg.length) {
					return arrArg[position];
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("format");
				}
			});
		};
		Utility.throwIfNotLoaded=function (propertyName, fieldValue, entityName, isNull) {
			if (!isNull && Utility.isUndefined(fieldValue) && propertyName.charCodeAt(0) !=Utility.s_underscoreCharCode) {
				throw Utility.createPropertyNotLoadedException(entityName, propertyName);
			}
		};
		Utility.createPropertyNotLoadedException=function (entityName, propertyName) {
			return new OfficeExtension._Internal.RuntimeError({
				code: OfficeExtension.ErrorCodes.propertyNotLoaded,
				message: Utility._getResourceString(OfficeExtension.ResourceStrings.propertyNotLoaded, propertyName),
				debugInfo: entityName ? { errorLocation: entityName+"."+propertyName } : undefined
			});
		};
		Utility.createCannotUpdateReadOnlyPropertyException=function (entityName, propertyName) {
			return new OfficeExtension._Internal.RuntimeError({
				code: OfficeExtension.ErrorCodes.cannotUpdateReadOnlyProperty,
				message: Utility._getResourceString(OfficeExtension.ResourceStrings.cannotUpdateReadOnlyProperty, propertyName),
				debugInfo: entityName ? { errorLocation: entityName+"."+propertyName } : undefined
			});
		};
		Utility.throwIfApiNotSupported=function (apiFullName, apiSetName, apiSetVersion, hostName) {
			if (!Utility._doApiNotSupportedCheck) {
				return;
			}
			if (!Utility.isSetSupported(apiSetName, apiSetVersion)) {
				var message=Utility._getResourceString(OfficeExtension.ResourceStrings.apiNotFoundDetails, [apiFullName, apiSetName+" "+apiSetVersion, hostName]);
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.apiNotFound,
					message: message,
					debugInfo: { errorLocation: apiFullName }
				});
			}
		};
		Utility.getObjectPathExpression=function (objectPath) {
			var ret="";
			while (objectPath) {
				switch (objectPath.objectPathInfo.ObjectPathType) {
					case 1:
						ret=ret;
						break;
					case 2:
						ret="new()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 3:
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+"()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 4:
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+(ret.length > 0 ? "." : "")+ret;
						break;
					case 5:
						ret="getItem()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 6:
						ret="_reference()"+(ret.length > 0 ? "." : "")+ret;
						break;
				}
				objectPath=objectPath.parentObjectPath;
			}
			return ret;
		};
		Utility._createPromiseFromResult=function (value) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				resolve(value);
			});
		};
		Utility._createTimeoutPromise=function (timeout) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				setTimeout(function () {
					resolve(null);
				}, timeout);
			});
		};
		Utility.promisify=function (action) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				var callback=function (result) {
					if (result.status=="failed") {
						reject(result.error);
					}
					else {
						resolve(result.value);
					}
				};
				action(callback);
			});
		};
		Utility._addActionResultHandler=function (clientObj, action, resultHandler) {
			clientObj.context._pendingRequest.addActionResultHandler(action, resultHandler);
		};
		Utility._handleNavigationPropertyResults=function (clientObj, objectValue, propertyNames) {
			for (var i=0; i < propertyNames.length - 1; i+=2) {
				if (!Utility.isUndefined(objectValue[propertyNames[i+1]])) {
					clientObj[propertyNames[i]]._handleResult(objectValue[propertyNames[i+1]]);
				}
			}
		};
		Utility.normalizeName=function (name) {
			return name.substr(0, 1).toLowerCase()+name.substr(1);
		};
		Utility._isLocalDocumentUrl=function (url) {
			return Utility._getLocalDocumentUrlPrefixLength(url) > 0;
		};
		Utility._getLocalDocumentUrlPrefixLength=function (url) {
			var localDocumentPrefixes=["http://document.localhost", "https://document.localhost", "//document.localhost"];
			var urlLower=url.toLowerCase().trim();
			for (var i=0; i < localDocumentPrefixes.length; i++) {
				if (urlLower===localDocumentPrefixes[i]) {
					return localDocumentPrefixes[i].length;
				}
				else if (urlLower.substr(0, localDocumentPrefixes[i].length+1)===localDocumentPrefixes[i]+"/") {
					return localDocumentPrefixes[i].length+1;
				}
			}
			return 0;
		};
		Utility._validateLocalDocumentRequest=function (request) {
			var index=Utility._getLocalDocumentUrlPrefixLength(request.url);
			if (index <=0) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError({
					argumentName: "request"
				});
			}
			var path=request.url.substr(index);
			var pathLower=path.toLowerCase();
			if (pathLower==="_api") {
				path="";
			}
			else if (pathLower.substr(0, "_api/".length)==="_api/") {
				path=path.substr("_api/".length);
			}
			return {
				method: request.method,
				url: path,
				headers: request.headers,
				body: request.body
			};
		};
		Utility._buildRequestMessageSafeArray=function (request) {
			var requestFlags=0;
			if (!Utility.isReadonlyRestRequest(request.method)) {
				requestFlags=1;
			}
			if (request.url.substr(0, OfficeExtension.Constants.processQuery.length).toLowerCase()===OfficeExtension.Constants.processQuery.toLowerCase()) {
				var index=request.url.indexOf("?");
				if (index > 0) {
					var queryString=request.url.substr(index+1);
					var parts=queryString.split("&");
					for (var i=0; i < parts.length; i++) {
						var keyvalue=parts[i].split("=");
						if (keyvalue[0].toLowerCase()===OfficeExtension.Constants.flags) {
							var flags=parseInt(keyvalue[1]);
							requestFlags=flags;
							requestFlags=requestFlags & 1;
							break;
						}
					}
				}
			}
			return OfficeExtension.RichApiMessageUtility.buildRequestMessageSafeArray("", requestFlags, request.method, request.url, request.headers, request.body);
		};
		Utility._parseHttpResponseHeaders=function (allResponseHeaders) {
			var responseHeaders={};
			if (!Utility.isNullOrEmptyString(allResponseHeaders)) {
				var regex=new RegExp("\r?\n");
				var entries=allResponseHeaders.split(regex);
				for (var i=0; i < entries.length; i++) {
					var entry=entries[i];
					if (entry !=null) {
						var index=entry.indexOf(':');
						if (index > 0) {
							var key=entry.substr(0, index);
							var value=entry.substr(index+1);
							key=Utility.trim(key);
							value=Utility.trim(value);
							responseHeaders[key.toUpperCase()]=value;
						}
					}
				}
			}
			return responseHeaders;
		};
		Utility._parseErrorResponse=function (responseInfo) {
			var errorObj=null;
			if (Utility.isPlainJsonObject(responseInfo.body)) {
				errorObj=responseInfo.body;
			}
			else if (!Utility.isNullOrEmptyString(responseInfo.body)) {
				var errorResponseBody=Utility.trim(responseInfo.body);
				try {
					errorObj=JSON.parse(errorResponseBody);
				}
				catch (e) {
					Utility.log("Error when parse "+errorResponseBody);
				}
			}
			var errorMessage;
			var errorCode;
			if (!Utility.isNullOrUndefined(errorObj) && typeof (errorObj)==="object" && errorObj.error) {
				errorCode=errorObj.error.code;
				errorMessage=Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithDetails, [responseInfo.statusCode.toString(), errorObj.error.code, errorObj.error.message]);
			}
			else {
				errorMessage=Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithStatus, responseInfo.statusCode.toString());
			}
			if (Utility.isNullOrEmptyString(errorCode)) {
				errorCode=OfficeExtension.ErrorCodes.connectionFailure;
			}
			return { errorCode: errorCode, errorMessage: errorMessage };
		};
		Utility._copyHeaders=function (src, dest) {
			if (src && dest) {
				for (var key in src) {
					dest[key]=src[key];
				}
			}
		};
		Utility._toCamelLowerCase=function (name) {
			if (Utility.isNullOrEmptyString(name)) {
				return name;
			}
			var index=0;
			while (index < name.length && name.charCodeAt(index) >=65 && name.charCodeAt(index) <=90) {
				index++;
			}
			if (index < name.length) {
				return name.substr(0, index).toLowerCase()+name.substr(index);
			}
			else {
				return name.toLowerCase();
			}
		};
		Utility.definePropertyThrowUnloadedException=function (obj, typeName, propertyName) {
			Object.defineProperty(obj, propertyName, {
				configurable: true,
				enumerable: true,
				get: function () {
					throw Utility.createPropertyNotLoadedException(typeName, propertyName);
				},
				set: function () {
					throw Utility.createCannotUpdateReadOnlyPropertyException(typeName, propertyName);
				}
			});
		};
		Utility.defineReadOnlyPropertyWithValue=function (obj, propertyName, value) {
			Object.defineProperty(obj, propertyName, {
				configurable: true,
				enumerable: true,
				get: function () {
					return value;
				},
				set: function () {
					throw Utility.createCannotUpdateReadOnlyPropertyException(null, propertyName);
				}
			});
		};
		Utility.processRetrieveResult=function (proxy, value, result, childItemCreateFunc) {
			if (Utility.isNullOrUndefined(value)) {
				return;
			}
			if (childItemCreateFunc) {
				var data=value[OfficeExtension.Constants.itemsLowerCase];
				if (Array.isArray(data)) {
					var itemsResult=[];
					for (var i=0; i < data.length; i++) {
						var itemProxy=childItemCreateFunc(data[i], i);
						var itemResult={};
						itemResult[OfficeExtension.Constants.proxy]=itemProxy;
						itemProxy._handleRetrieveResult(data[i], itemResult);
						itemsResult.push(itemResult);
					}
					Utility.defineReadOnlyPropertyWithValue(result, OfficeExtension.Constants.itemsLowerCase, itemsResult);
				}
			}
			else {
				var scalarPropertyNames=proxy[OfficeExtension.Constants.scalarPropertyNames];
				var navigationPropertyNames=proxy[OfficeExtension.Constants.navigationPropertyNames];
				var typeName=proxy[OfficeExtension.Constants.className];
				if (scalarPropertyNames) {
					for (var i=0; i < scalarPropertyNames.length; i++) {
						var propName=scalarPropertyNames[i];
						var propValue=value[propName];
						if (Utility.isUndefined(propValue)) {
							Utility.definePropertyThrowUnloadedException(result, typeName, propName);
						}
						else {
							Utility.defineReadOnlyPropertyWithValue(result, propName, propValue);
						}
					}
				}
				if (navigationPropertyNames) {
					for (var i=0; i < navigationPropertyNames.length; i++) {
						var propName=navigationPropertyNames[i];
						var propValue=value[propName];
						if (Utility.isUndefined(propValue)) {
							Utility.definePropertyThrowUnloadedException(result, typeName, propName);
						}
						else {
							var propProxy=proxy[propName];
							var propResult={};
							propProxy._handleRetrieveResult(propValue, propResult);
							propResult[OfficeExtension.Constants.proxy]=propProxy;
							if (Array.isArray(propResult[OfficeExtension.Constants.itemsLowerCase])) {
								propResult=propResult[OfficeExtension.Constants.itemsLowerCase];
							}
							Utility.defineReadOnlyPropertyWithValue(result, propName, propResult);
						}
					}
				}
			}
		};
		Utility.fieldName_m__items="m__items";
		Utility.fieldName_isCollection="_isCollection";
		Utility._logEnabled=false;
		Utility._synchronousCleanup=false;
		Utility._doApiNotSupportedCheck=false;
		Utility.s_underscoreCharCode="_".charCodeAt(0);
		return Utility;
	}());
	OfficeExtension.Utility=Utility;
})(OfficeExtension || (OfficeExtension={}));

var __extends=(this && this.__extends) || (function () {
	var extendStatics=Object.setPrototypeOf ||
		({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__=b; }) ||
		function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p]; };
	return function (d, b) {
		extendStatics(d, b);
		function __() { this.constructor=d; }
		d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
	};
})();
var OfficeCore;
(function (OfficeCore) {
	var _hostName="OfficeCore";
	var _defaultApiSetName="AgaveVisualApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createEnsureUnchangedAction=OfficeExtension.ActionFactory.createEnsureUnchangedAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _load=OfficeExtension.Utility.load;
	var _loadAndSync=OfficeExtension.Utility.loadAndSync;
	var _retrieve=OfficeExtension.Utility.retrieve;
	var _retrieveAndSync=OfficeExtension.Utility.retrieveAndSync;
	var _toJson=OfficeExtension.Utility.toJson;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var _typeBiShim="BiShim";
	var BiShim=(function (_super) {
		__extends(BiShim, _super);
		function BiShim() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(BiShim.prototype, "_className", {
			get: function () {
				return "BiShim";
			},
			enumerable: true,
			configurable: true
		});
		BiShim.prototype.initialize=function (capabilities) {
			_createMethodAction(this.context, this, "Initialize", 0, [capabilities], false);
		};
		BiShim.prototype.uninitialize=function () {
			_createMethodAction(this.context, this, "Uninitialize", 0, [], false);
		};
		BiShim.prototype.getData=function () {
			var action=_createMethodAction(this.context, this, "getData", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		BiShim.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		BiShim.newObject=function (context) {
			var ret=new OfficeCore.BiShim(context, _createNewObjectObjectPath(context, "Microsoft.AgaveVisual.BiShim", false, false));
			return ret;
		};
		BiShim.prototype.toJSON=function () {
			return _toJson(this, {}, {});
		};
		return BiShim;
	}(OfficeExtension.ClientObject));
	OfficeCore.BiShim=BiShim;
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.generalException="GeneralException";
	})(ErrorCodes=OfficeCore.ErrorCodes || (OfficeCore.ErrorCodes={}));
})(OfficeCore || (OfficeCore={}));
var OfficeCore;
(function (OfficeCore) {
	var _hostName="OfficeCore";
	var _defaultApiSetName="AuthenticationApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createEnsureUnchangedAction=OfficeExtension.ActionFactory.createEnsureUnchangedAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _load=OfficeExtension.Utility.load;
	var _retrieve=OfficeExtension.Utility.retrieve;
	var _toJson=OfficeExtension.Utility.toJson;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var _processRetrieveResult=OfficeExtension.Utility.processRetrieveResult;
	var IdentityType;
	(function (IdentityType) {
		IdentityType.organizationAccount="OrganizationAccount";
		IdentityType.microsoftAccount="MicrosoftAccount";
	})(IdentityType=OfficeCore.IdentityType || (OfficeCore.IdentityType={}));
	var _typeAuthenticationService="AuthenticationService";
	var AuthenticationService=(function (_super) {
		__extends(AuthenticationService, _super);
		function AuthenticationService() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(AuthenticationService.prototype, "_className", {
			get: function () {
				return "AuthenticationService";
			},
			enumerable: true,
			configurable: true
		});
		AuthenticationService.prototype.getAccessToken=function (tokenParameters) {
			var action=_createMethodAction(this.context, this, "GetAccessToken", 1, [tokenParameters], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		AuthenticationService.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		AuthenticationService.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		AuthenticationService.newObject=function (context) {
			var ret=new OfficeCore.AuthenticationService(context, _createNewObjectObjectPath(context, "Microsoft.Authentication.AuthenticationService", false, false));
			return ret;
		};
		AuthenticationService.prototype.toJSON=function () {
			return _toJson(this, {}, {});
		};
		return AuthenticationService;
	}(OfficeExtension.ClientObject));
	OfficeCore.AuthenticationService=AuthenticationService;
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.generalException="GeneralException";
	})(ErrorCodes=OfficeCore.ErrorCodes || (OfficeCore.ErrorCodes={}));
})(OfficeCore || (OfficeCore={}));
var OfficeCore;
(function (OfficeCore) {
	var _hostName="OfficeCore";
	var _defaultApiSetName="ExperimentApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _load=OfficeExtension.Utility.load;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var FlightingService=(function (_super) {
		__extends(FlightingService, _super);
		function FlightingService() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(FlightingService.prototype, "_className", {
			get: function () {
				return "FlightingService";
			},
			enumerable: true,
			configurable: true
		});
		FlightingService.prototype.getClientSessionId=function () {
			var action=_createMethodAction(this.context, this, "GetClientSessionId", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		FlightingService.prototype.getDeferredFlights=function () {
			var action=_createMethodAction(this.context, this, "GetDeferredFlights", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		FlightingService.prototype.getFeature=function (featureName, type, defaultValue, possibleValues) {
			return new OfficeCore.ABType(this.context, _createMethodObjectPath(this.context, this, "GetFeature", 1, [featureName, type, defaultValue, possibleValues], false, false, null));
		};
		FlightingService.prototype.getFeatureGate=function (featureName, scope) {
			return new OfficeCore.ABType(this.context, _createMethodObjectPath(this.context, this, "GetFeatureGate", 1, [featureName, scope], false, false, null));
		};
		FlightingService.prototype.resetOverride=function (featureName) {
			_createMethodAction(this.context, this, "ResetOverride", 0, [featureName]);
		};
		FlightingService.prototype.setOverride=function (featureName, type, value) {
			_createMethodAction(this.context, this, "SetOverride", 0, [featureName, type, value]);
		};
		FlightingService.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		FlightingService.newObject=function (context) {
			var ret=new OfficeCore.FlightingService(context, _createNewObjectObjectPath(context, "Microsoft.Experiment.FlightingService", false));
			return ret;
		};
		FlightingService.prototype.toJSON=function () {
			return {};
		};
		return FlightingService;
	}(OfficeExtension.ClientObject));
	OfficeCore.FlightingService=FlightingService;
	var ABType=(function (_super) {
		__extends(ABType, _super);
		function ABType() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ABType.prototype, "_className", {
			get: function () {
				return "ABType";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ABType.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("value", this.m_value, "ABType", this._isNull);
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		ABType.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
		};
		ABType.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ABType.prototype.toJSON=function () {
			return {
				"value": this.m_value
			};
		};
		return ABType;
	}(OfficeExtension.ClientObject));
	OfficeCore.ABType=ABType;
	var FeatureType;
	(function (FeatureType) {
		FeatureType.boolean="Boolean";
		FeatureType.integer="Integer";
		FeatureType.string="String";
	})(FeatureType=OfficeCore.FeatureType || (OfficeCore.FeatureType={}));
	var ExperimentErrorCodes;
	(function (ExperimentErrorCodes) {
		ExperimentErrorCodes.generalException="GeneralException";
	})(ExperimentErrorCodes=OfficeCore.ExperimentErrorCodes || (OfficeCore.ExperimentErrorCodes={}));
})(OfficeCore || (OfficeCore={}));
var OfficeCore;
(function (OfficeCore) {
	var RequestContext=(function (_super) {
		__extends(RequestContext, _super);
		function RequestContext(url) {
			return _super.call(this, url) || this;
		}
		Object.defineProperty(RequestContext.prototype, "authentication", {
			get: function () {
				if (!this.m_authentication) {
					this.m_authentication=OfficeCore.AuthenticationService.newObject(this);
				}
				return this.m_authentication;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "flighting", {
			get: function () {
				return this.flightingService;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "telemetry", {
			get: function () {
				if (!this.m_telemetry) {
					this.m_telemetry=OfficeCore.TelemetryService.newObject(this);
				}
				return this.m_telemetry;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "flightingService", {
			get: function () {
				if (!this.m_flightingService) {
					this.m_flightingService=OfficeCore.FlightingService.newObject(this);
				}
				return this.m_flightingService;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "bi", {
			get: function () {
				if (!this.m_biShim) {
					this.m_biShim=OfficeCore.BiShim.newObject(this);
				}
				return this.m_biShim;
			},
			enumerable: true,
			configurable: true
		});
		return RequestContext;
	}(OfficeExtension.ClientRequestContext));
	OfficeCore.RequestContext=RequestContext;
})(OfficeCore || (OfficeCore={}));
var OfficeCore;
(function (OfficeCore) {
	var _hostName="OfficeCore";
	var _defaultApiSetName="TelemetryApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _load=OfficeExtension.Utility.load;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var _typeTelemetryService="TelemetryService";
	var TelemetryService=(function (_super) {
		__extends(TelemetryService, _super);
		function TelemetryService() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TelemetryService.prototype, "_className", {
			get: function () {
				return "TelemetryService";
			},
			enumerable: true,
			configurable: true
		});
		TelemetryService.prototype.sendTelemetryEvent=function (telemetryProperties, eventName, eventContract, eventFlags, value) {
			_createMethodAction(this.context, this, "SendTelemetryEvent", 1, [telemetryProperties, eventName, eventContract, eventFlags, value], false);
		};
		TelemetryService.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		TelemetryService.newObject=function (context) {
			var ret=new OfficeCore.TelemetryService(context, _createNewObjectObjectPath(context, "Microsoft.Telemetry.TelemetryService", false, false));
			return ret;
		};
		TelemetryService.prototype.toJSON=function () {
			return {};
		};
		return TelemetryService;
	}(OfficeExtension.ClientObject));
	OfficeCore.TelemetryService=TelemetryService;
	var TelemetryErrorCodes;
	(function (TelemetryErrorCodes) {
		TelemetryErrorCodes.generalException="GeneralException";
	})(TelemetryErrorCodes=OfficeCore.TelemetryErrorCodes || (OfficeCore.TelemetryErrorCodes={}));
})(OfficeCore || (OfficeCore={}));
var OfficeCore;
(function (OfficeCore) {
	var _hostName="Office";
	var _defaultApiSetName="OfficeSharedApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createEnsureUnchangedAction=OfficeExtension.ActionFactory.createEnsureUnchangedAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _load=OfficeExtension.Utility.load;
	var _loadAndSync=OfficeExtension.Utility.loadAndSync;
	var _retrieve=OfficeExtension.Utility.retrieve;
	var _retrieveAndSync=OfficeExtension.Utility.retrieveAndSync;
	var _toJson=OfficeExtension.Utility.toJson;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var _typeComment="Comment";
	var Comment=(function (_super) {
		__extends(Comment, _super);
		function Comment() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Comment.prototype, "_className", {
			get: function () {
				return "Comment";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "parent", {
			get: function () {
				if (!this._P) {
					this._P=new OfficeCore.Comment(this.context, _createPropertyObjectPath(this.context, this, "Parent", false, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "parentOrNullObject", {
			get: function () {
				if (!this._Pa) {
					this._Pa=new OfficeCore.Comment(this.context, _createPropertyObjectPath(this.context, this, "ParentOrNullObject", false, false, false));
				}
				return this._Pa;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "replies", {
			get: function () {
				if (!this._R) {
					this._R=new OfficeCore.CommentCollection(this.context, _createPropertyObjectPath(this.context, this, "Replies", true, false, false));
				}
				return this._R;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "author", {
			get: function () {
				_throwIfNotLoaded("author", this._A, _typeComment, this._isNull);
				return this._A;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "created", {
			get: function () {
				_throwIfNotLoaded("created", this._C, _typeComment, this._isNull);
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this._I, _typeComment, this._isNull);
				return this._I;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "level", {
			get: function () {
				_throwIfNotLoaded("level", this._L, _typeComment, this._isNull);
				return this._L;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "mentions", {
			get: function () {
				_throwIfNotLoaded("mentions", this._M, _typeComment, this._isNull);
				return this._M;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "resolved", {
			get: function () {
				_throwIfNotLoaded("resolved", this._Re, _typeComment, this._isNull);
				return this._Re;
			},
			set: function (value) {
				this._Re=value;
				_createSetPropertyAction(this.context, this, "Resolved", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Comment.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this._T, _typeComment, this._isNull);
				return this._T;
			},
			set: function (value) {
				this._T=value;
				_createSetPropertyAction(this.context, this, "Text", value);
			},
			enumerable: true,
			configurable: true
		});
		Comment.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["text", "resolved"], [], [
				"parent",
				"parentOrNullObject",
				"replies"
			]);
		};
		Comment.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Comment.prototype.getParentOrSelf=function () {
			return new OfficeCore.Comment(this.context, _createMethodObjectPath(this.context, this, "GetParentOrSelf", 1, [], false, false, null, false));
		};
		Comment.prototype.getRichText=function (format) {
			var action=_createMethodAction(this.context, this, "GetRichText", 1, [format], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Comment.prototype.reply=function (text, format) {
			return new OfficeCore.Comment(this.context, _createMethodObjectPath(this.context, this, "Reply", 0, [text, format], false, false, null, false));
		};
		Comment.prototype.setRichText=function (text, format) {
			var action=_createMethodAction(this.context, this, "SetRichText", 0, [text, format], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Comment.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Author"])) {
				this._A=obj["Author"];
			}
			if (!_isUndefined(obj["Created"])) {
				this._C=_adjustToDateTime(obj["Created"]);
			}
			if (!_isUndefined(obj["Id"])) {
				this._I=obj["Id"];
			}
			if (!_isUndefined(obj["Level"])) {
				this._L=obj["Level"];
			}
			if (!_isUndefined(obj["Mentions"])) {
				this._M=obj["Mentions"];
			}
			if (!_isUndefined(obj["Resolved"])) {
				this._Re=obj["Resolved"];
			}
			if (!_isUndefined(obj["Text"])) {
				this._T=obj["Text"];
			}
			_handleNavigationPropertyResults(this, obj, ["parent", "Parent", "parentOrNullObject", "ParentOrNullObject", "replies", "Replies"]);
		};
		Comment.prototype.load=function (option) {
			return _load(this, option);
		};
		Comment.prototype.loadAndSync=function (option) {
			return _loadAndSync(this, option);
		};
		Comment.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Comment.prototype.retrieveAndSync=function (option) {
			return _retrieveAndSync(this, option);
		};
		Comment.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		Comment.prototype.toJSON=function () {
			return _toJson(this, {
				"author": this._A,
				"created": this._C,
				"id": this._I,
				"level": this._L,
				"mentions": this._M,
				"resolved": this._Re,
				"text": this._T,
			}, {
				"replies": this._R,
			});
		};
		Comment.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Comment;
	}(OfficeExtension.ClientObject));
	OfficeCore.Comment=Comment;
	var _typeCommentCollection="CommentCollection";
	var CommentCollection=(function (_super) {
		__extends(CommentCollection, _super);
		function CommentCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CommentCollection.prototype, "_className", {
			get: function () {
				return "CommentCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommentCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeCommentCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		CommentCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		CommentCollection.prototype.getItem=function (id) {
			return new OfficeCore.Comment(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		CommentCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new OfficeCore.Comment(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		CommentCollection.prototype.load=function (option) {
			return _load(this, option);
		};
		CommentCollection.prototype.loadAndSync=function (option) {
			return _loadAndSync(this, option);
		};
		CommentCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CommentCollection.prototype.retrieveAndSync=function (option) {
			return _retrieveAndSync(this, option);
		};
		CommentCollection.prototype.toJSON=function () {
			return _toJson(this, {}, {}, this.m__items);
		};
		return CommentCollection;
	}(OfficeExtension.ClientObject));
	OfficeCore.CommentCollection=CommentCollection;
	var CommentTextFormat;
	(function (CommentTextFormat) {
		CommentTextFormat.plain="Plain";
		CommentTextFormat.markdown="Markdown";
		CommentTextFormat.delta="Delta";
	})(CommentTextFormat=OfficeCore.CommentTextFormat || (OfficeCore.CommentTextFormat={}));
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.generalException="GeneralException";
	})(ErrorCodes=OfficeCore.ErrorCodes || (OfficeCore.ErrorCodes={}));
})(OfficeCore || (OfficeCore={}));

var __extends=(this && this.__extends) || (function () {
	var extendStatics=Object.setPrototypeOf ||
		({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__=b; }) ||
		function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p]; };
	return function (d, b) {
		extendStatics(d, b);
		function __() { this.constructor=d; }
		d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
	};
})();
var Excel;
(function (Excel) {
	function lowerCaseFirst(str) {
		return str[0].toLowerCase()+str.slice(1);
	}
	var iconSets=["ThreeArrows",
		"ThreeArrowsGray",
		"ThreeFlags",
		"ThreeTrafficLights1",
		"ThreeTrafficLights2",
		"ThreeSigns",
		"ThreeSymbols",
		"ThreeSymbols2",
		"FourArrows",
		"FourArrowsGray",
		"FourRedToBlack",
		"FourRating",
		"FourTrafficLights",
		"FiveArrows",
		"FiveArrowsGray",
		"FiveRating",
		"FiveQuarters",
		"ThreeStars",
		"ThreeTriangles",
		"FiveBoxes"];
	var iconNames=[["RedDownArrow", "YellowSideArrow", "GreenUpArrow"],
		["GrayDownArrow", "GraySideArrow", "GrayUpArrow"],
		["RedFlag", "YellowFlag", "GreenFlag"],
		["RedCircleWithBorder", "YellowCircle", "GreenCircle"],
		["RedTrafficLight", "YellowTrafficLight", "GreenTrafficLight"],
		["RedDiamond", "YellowTriangle", "GreenCircle"],
		["RedCrossSymbol", "YellowExclamationSymbol", "GreenCheckSymbol"],
		["RedCross", "YellowExclamation", "GreenCheck"],
		["RedDownArrow", "YellowDownInclineArrow", "YellowUpInclineArrow", "GreenUpArrow"],
		["GrayDownArrow", "GrayDownInclineArrow", "GrayUpInclineArrow", "GrayUpArrow"],
		["BlackCircle", "GrayCircle", "PinkCircle", "RedCircle"],
		["OneBar", "TwoBars", "ThreeBars", "FourBars"],
		["BlackCircleWithBorder", "RedCircleWithBorder", "YellowCircle", "GreenCircle"],
		["RedDownArrow", "YellowDownInclineArrow", "YellowSideArrow", "YellowUpInclineArrow", "GreenUpArrow"],
		["GrayDownArrow", "GrayDownInclineArrow", "GraySideArrow", "GrayUpInclineArrow", "GrayUpArrow"],
		["NoBars", "OneBar", "TwoBars", "ThreeBars", "FourBars"],
		["WhiteCircleAllWhiteQuarters", "CircleWithThreeWhiteQuarters", "CircleWithTwoWhiteQuarters", "CircleWithOneWhiteQuarter", "BlackCircle"],
		["SilverStar", "HalfGoldStar", "GoldStar"],
		["RedDownTriangle", "YellowDash", "GreenUpTriangle"],
		["NoFilledBoxes", "OneFilledBox", "TwoFilledBoxes", "ThreeFilledBoxes", "FourFilledBoxes"],];
	Excel.icons={};
	iconSets.map(function (title, i) {
		var camelTitle=lowerCaseFirst(title);
		Excel.icons[camelTitle]=[];
		iconNames[i].map(function (iconName, j) {
			iconName=lowerCaseFirst(iconName);
			var obj={ set: title, index: j };
			Excel.icons[camelTitle].push(obj);
			Excel.icons[camelTitle][iconName]=obj;
		});
	});
	function setRangePropertiesInBulk(range, propertyName, values) {
		var maxCellCount=1500;
		if (Array.isArray(values) && values.length > 0 && Array.isArray(values[0]) && (values.length * values[0].length > maxCellCount) && isExcel1_3OrAbove()) {
			var maxRowCount=Math.max(1, Math.round(maxCellCount / values[0].length));
			range._ValidateArraySize(values.length, values[0].length);
			for (var startRowIndex=0; startRowIndex < values.length; startRowIndex+=maxRowCount) {
				var rowCount=maxRowCount;
				if (startRowIndex+rowCount > values.length) {
					rowCount=values.length - startRowIndex;
				}
				var chunk=range.getRow(startRowIndex).getBoundingRect(range.getRow(startRowIndex+rowCount - 1));
				var valueSlice=values.slice(startRowIndex, startRowIndex+rowCount);
				_createSetPropertyAction(chunk.context, chunk, propertyName, valueSlice);
			}
			return true;
		}
		return false;
	}
	function isExcel1_3OrAbove() {
		if (typeof (window) !=="undefined" && window.Office && window.Office.context && window.Office.context.requirements) {
			return window.Office.context.requirements.isSetSupported("ExcelApi", 1.3);
		}
		else {
			return true;
		}
	}
	var Session=(function () {
		function Session(workbookUrl, requestHeaders, persisted) {
			this.m_workbookUrl=workbookUrl;
			this.m_requestHeaders=requestHeaders;
			if (!this.m_requestHeaders) {
				this.m_requestHeaders={};
			}
			if (OfficeExtension.Utility.isNullOrUndefined(persisted)) {
				persisted=true;
			}
			this.m_persisted=persisted;
		}
		Session.prototype.close=function () {
			var _this=this;
			if (this.m_requestUrlAndHeaderInfo &&
				!OfficeExtension.Utility._isLocalDocumentUrl(this.m_requestUrlAndHeaderInfo.url)) {
				var url=this.m_requestUrlAndHeaderInfo.url;
				if (url.charAt(url.length - 1) !="/") {
					url=url+"/";
				}
				url=url+"closeSession";
				var headers=this.m_requestUrlAndHeaderInfo;
				var req={ method: "POST", url: url, headers: this.m_requestUrlAndHeaderInfo.headers, body: "" };
				this.m_requestUrlAndHeaderInfo=null;
				return OfficeExtension.HttpUtility.sendRequest(req)
					.then(function (resp) {
					if (resp.statusCode !=204) {
						var err=OfficeExtension.Utility._parseErrorResponse(resp);
						throw OfficeExtension.Utility.createRuntimeError(err.errorCode, err.errorMessage, "Session.close");
					}
					_this.m_requestUrlAndHeaderInfo=null;
					var foundSessionKey=null;
					for (var key in _this.m_requestHeaders) {
						if (key.toLowerCase()==Session.WorkbookSessionIdHeaderNameLower) {
							foundSessionKey=key;
							break;
						}
					}
					if (foundSessionKey) {
						delete _this.m_requestHeaders[foundSessionKey];
					}
				});
			}
			else {
				return OfficeExtension.Utility._createPromiseFromResult(null);
			}
		};
		Session.prototype._resolveRequestUrlAndHeaderInfo=function () {
			var _this=this;
			if (this.m_requestUrlAndHeaderInfo) {
				return OfficeExtension.Utility._createPromiseFromResult(this.m_requestUrlAndHeaderInfo);
			}
			if (OfficeExtension.Utility.isNullOrEmptyString(this.m_workbookUrl) ||
				OfficeExtension.Utility._isLocalDocumentUrl(this.m_workbookUrl)) {
				this.m_requestUrlAndHeaderInfo={ url: this.m_workbookUrl, headers: this.m_requestHeaders };
				return OfficeExtension.Utility._createPromiseFromResult(this.m_requestUrlAndHeaderInfo);
			}
			var foundSessionId=false;
			for (var key in this.m_requestHeaders) {
				if (key.toLowerCase()==Session.WorkbookSessionIdHeaderNameLower) {
					foundSessionId=true;
					break;
				}
			}
			if (foundSessionId) {
				this.m_requestUrlAndHeaderInfo={ url: this.m_workbookUrl, headers: this.m_requestHeaders };
				return OfficeExtension.Utility._createPromiseFromResult(this.m_requestUrlAndHeaderInfo);
			}
			var url=this.m_workbookUrl;
			if (url.charAt(url.length - 1) !="/") {
				url=url+"/";
			}
			url=url+"createSession";
			var headers={};
			OfficeExtension.Utility._copyHeaders(this.m_requestHeaders, headers);
			headers["Content-Type"]="application/json";
			var body={};
			body.persistChanges=this.m_persisted;
			var req={ method: "POST", url: url, headers: headers, body: JSON.stringify(body) };
			return OfficeExtension.HttpUtility.sendRequest(req)
				.then(function (resp) {
				if (resp.statusCode !==201) {
					var err=OfficeExtension.Utility._parseErrorResponse(resp);
					throw OfficeExtension.Utility.createRuntimeError(err.errorCode, err.errorMessage, "Session.resolveRequestUrlAndHeaderInfo");
				}
				var session=JSON.parse(resp.body);
				var sessionId=session.id;
				headers={};
				OfficeExtension.Utility._copyHeaders(_this.m_requestHeaders, headers);
				headers[Session.WorkbookSessionIdHeaderName]=sessionId;
				_this.m_requestUrlAndHeaderInfo={ url: _this.m_workbookUrl, headers: headers };
				return _this.m_requestUrlAndHeaderInfo;
			});
		};
		return Session;
	}());
	Session.WorkbookSessionIdHeaderName="Workbook-Session-Id";
	Session.WorkbookSessionIdHeaderNameLower="workbook-session-id";
	Excel.Session=Session;
	var RequestContext=(function (_super) {
		__extends(RequestContext, _super);
		function RequestContext(url) {
			var _this=_super.call(this, url) || this;
			_this.m_workbook=new Workbook(_this, OfficeExtension.ObjectPathFactory.createGlobalObjectObjectPath(_this));
			_this._rootObject=_this.m_workbook;
			_this._rootObjectPropertyName="workbook";
			return _this;
		}
		RequestContext.prototype._processOfficeJsErrorResponse=function (officeJsErrorCode, response) {
			var ooeInvalidApiCallInContext=5004;
			if (officeJsErrorCode==ooeInvalidApiCallInContext) {
				response.ErrorCode=ErrorCodes.invalidOperationInCellEditMode;
				response.ErrorMessage=OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidOperationInCellEditMode);
			}
		};
		Object.defineProperty(RequestContext.prototype, "workbook", {
			get: function () {
				return this.m_workbook;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "application", {
			get: function () {
				return this.workbook.application;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RequestContext.prototype, "runtime", {
			get: function () {
				return this.workbook._Runtime;
			},
			enumerable: true,
			configurable: true
		});
		return RequestContext;
	}(OfficeCore.RequestContext));
	Excel.RequestContext=RequestContext;
	function run(runnable) {
		return OfficeExtension.ClientRequestContext._runExplicitBatch("Excel.runBatch", arguments, function (requestInfo) {
			var ret=new Excel.RequestContext(requestInfo);
			return ret;
		});
	}
	Excel.run=run;
	Excel._RedirectV1APIs=false;
	Excel._V1APIMap={
		"GetDataAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingGetData(callArgs); },
			postprocess: getDataCommonPostprocess
		},
		"GetSelectedDataAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.getSelectedData(callArgs); },
			postprocess: getDataCommonPostprocess
		},
		"GoToByIdAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.gotoById(callArgs); }
		},
		"AddColumnsAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingAddColumns(callArgs); }
		},
		"AddFromSelectionAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingAddFromSelection(callArgs); },
			postprocess: postprocessBindingDescriptor
		},
		"AddFromNamedItemAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingAddFromNamedItem(callArgs); },
			postprocess: postprocessBindingDescriptor
		},
		"AddFromPromptAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingAddFromPrompt(callArgs); },
			postprocess: postprocessBindingDescriptor
		},
		"AddRowsAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingAddRows(callArgs); }
		},
		"GetByIdAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingGetById(callArgs); },
			postprocess: postprocessBindingDescriptor
		},
		"ReleaseByIdAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingReleaseById(callArgs); }
		},
		"GetAllAsync": {
			call: function (ctx) { return ctx.workbook._V1Api.bindingGetAll(); },
			postprocess: function (response) {
				return response.bindings.map(function (descriptor) { return postprocessBindingDescriptor(descriptor); });
			}
		},
		"DeleteAllDataValuesAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingDeleteAllDataValues(callArgs); }
		},
		"SetSelectedDataAsync": {
			preprocess: function (callArgs) {
				var preimage=callArgs["cellFormat"];
				if (typeof (window) !=="undefined" && window.OSF.DDA.SafeArray) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				else if (typeof (window) !=="undefined" && window.OSF.DDA.WAC) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				return callArgs;
			},
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.setSelectedData(callArgs); }
		},
		"SetDataAsync": {
			preprocess: function (callArgs) {
				var preimage=callArgs["cellFormat"];
				if (typeof (window) !=="undefined" && window.OSF.DDA.SafeArray) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				else if (typeof (window) !=="undefined" && window.OSF.DDA.WAC) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				return callArgs;
			},
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingSetData(callArgs); }
		},
		"SetFormatsAsync": {
			preprocess: function (callArgs) {
				var preimage=callArgs["cellFormat"];
				if (typeof (window) !=="undefined" && window.OSF.DDA.SafeArray) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.SafeArray.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				else if (typeof (window) !=="undefined" && window.OSF.DDA.WAC) {
					if (window.OSF.OUtil.listContainsKey(window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes, "cellFormat")) {
						callArgs["cellFormat"]=window.OSF.DDA.WAC.Delegate.ParameterMap.dynamicTypes["cellFormat"]["toHost"](preimage);
					}
				}
				return callArgs;
			},
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingSetFormats(callArgs); }
		},
		"SetTableOptionsAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingSetTableOptions(callArgs); }
		},
		"ClearFormatsAsync": {
			call: function (ctx, callArgs) { return ctx.workbook._V1Api.bindingClearFormats(callArgs); }
		},
		"GetFilePropertiesAsync": {
			call: function (ctx) { return ctx.workbook._V1Api.getFilePropertiesAsync(); }
		},
	};
	function postprocessBindingDescriptor(response) {
		var bindingDescriptor={
			BindingColumnCount: response.bindingColumnCount,
			BindingId: response.bindingId,
			BindingRowCount: response.bindingRowCount,
			bindingType: response.bindingType,
			HasHeaders: response.hasHeaders
		};
		return window.OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, window.Microsoft.Office.WebExtension.context.document);
	}
	function getDataCommonPostprocess(response, callArgs) {
		var isPlainData=response.headers==null;
		var data;
		if (isPlainData) {
			data=response.rows;
		}
		else {
			data=response;
		}
		data=window.OSF.DDA.DataCoercion.coerceData(data, callArgs[window.Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	function versionNumberIsEarlierThan(desiredMajor, desiredMinor, desiredBuild) {
		var hasOfficeVersion=typeof (window) !=="undefined" &&
			window.Office &&
			window.Office.context &&
			window.Office.context.diagnostics &&
			window.Office.context.diagnostics.version;
		if (!hasOfficeVersion) {
			return false;
		}
		var version=window.Office.context.diagnostics.version;
		var versionExtractor=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
		var result=versionExtractor.exec(version);
		if (result) {
			var major=parseInt(result[1]);
			var minor=parseInt(result[2]);
			var build=parseInt(result[3]);
			var revision=parseInt(result[4]);
			var devBuild=3000;
			if (major < desiredMajor) {
				return true;
			}
			if (major==desiredMajor && minor < desiredMinor) {
				return true;
			}
			if (major==desiredMajor && minor==desiredMinor && build < desiredBuild) {
				if (revision < devBuild) {
					return true;
				}
			}
		}
		return false;
	}
	var _hostName="Excel";
	var _defaultApiSetName="ExcelApi";
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createEnsureUnchangedAction=OfficeExtension.ActionFactory.createEnsureUnchangedAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _throwIfApiNotSupported=OfficeExtension.Utility.throwIfApiNotSupported;
	var _retrieve=OfficeExtension.Utility.retrieve;
	var _toJson=OfficeExtension.Utility.toJson;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var _processRetrieveResult=OfficeExtension.Utility.processRetrieveResult;
	var _typeRuntime="Runtime";
	var Runtime=(function (_super) {
		__extends(Runtime, _super);
		function Runtime() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Runtime.prototype, "_className", {
			get: function () {
				return "Runtime";
			},
			enumerable: true,
			configurable: true
		});
		Runtime.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return Runtime;
	}(OfficeExtension.ClientObject));
	Excel.Runtime=Runtime;
	var _typeApplication="Application";
	var Application=(function (_super) {
		__extends(Application, _super);
		function Application() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Application.prototype, "_className", {
			get: function () {
				return "Application";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Application.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["calculationMode"];
			},
			enumerable: true,
			configurable: true
		});
		Application.prototype.calculate=function (calculationType) {
			_createMethodAction(this.context, this, "Calculate", 0, [calculationType], false);
		};
		Application.prototype.suspendApiCalculationUntilNextSync=function () {
			_throwIfApiNotSupported("Application.suspendApiCalculationUntilNextSync", _defaultApiSetName, "1.6", _hostName);
			_createMethodAction(this.context, this, "SuspendApiCalculationUntilNextSync", 0, [], false);
		};
		Application.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Application.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Application.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Application;
	}(OfficeExtension.ClientObject));
	Excel.Application=Application;
	var _typeWorkbook="Workbook";
	var Workbook=(function (_super) {
		__extends(Workbook, _super);
		function Workbook() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Workbook.prototype, "_className", {
			get: function () {
				return "Workbook";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["worksheets", "names", "tables", "application", "bindings", "functions", "_V1Api", "pivotTables", "settings", "customXmlParts", "internalTest", "_Runtime"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "application", {
			get: function () {
				if (!this._A) {
					this._A=new Excel.Application(this.context, _createPropertyObjectPath(this.context, this, "Application", false, false, false));
				}
				return this._A;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "bindings", {
			get: function () {
				if (!this._B) {
					this._B=new Excel.BindingCollection(this.context, _createPropertyObjectPath(this.context, this, "Bindings", true, false, false));
				}
				return this._B;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "customXmlParts", {
			get: function () {
				_throwIfApiNotSupported("Workbook.customXmlParts", _defaultApiSetName, "1.5", _hostName);
				if (!this._C) {
					this._C=new Excel.CustomXmlPartCollection(this.context, _createPropertyObjectPath(this.context, this, "CustomXmlParts", true, false, false));
				}
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "functions", {
			get: function () {
				_throwIfApiNotSupported("Workbook.functions", _defaultApiSetName, "1.2", _hostName);
				if (!this._F) {
					this._F=new Excel.Functions(this.context, _createPropertyObjectPath(this.context, this, "Functions", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "internalTest", {
			get: function () {
				_throwIfApiNotSupported("Workbook.internalTest", _defaultApiSetName, "1.6", _hostName);
				if (!this._I) {
					this._I=new Excel.InternalTest(this.context, _createPropertyObjectPath(this.context, this, "InternalTest", false, false, false));
				}
				return this._I;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "names", {
			get: function () {
				if (!this._N) {
					this._N=new Excel.NamedItemCollection(this.context, _createPropertyObjectPath(this.context, this, "Names", true, false, false));
				}
				return this._N;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "pivotTables", {
			get: function () {
				_throwIfApiNotSupported("Workbook.pivotTables", _defaultApiSetName, "1.3", _hostName);
				if (!this._P) {
					this._P=new Excel.PivotTableCollection(this.context, _createPropertyObjectPath(this.context, this, "PivotTables", true, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "settings", {
			get: function () {
				_throwIfApiNotSupported("Workbook.settings", _defaultApiSetName, "1.4", _hostName);
				if (!this._S) {
					this._S=new Excel.SettingCollection(this.context, _createPropertyObjectPath(this.context, this, "Settings", true, false, false));
				}
				return this._S;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "tables", {
			get: function () {
				if (!this._T) {
					this._T=new Excel.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false, false));
				}
				return this._T;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "worksheets", {
			get: function () {
				if (!this._W) {
					this._W=new Excel.WorksheetCollection(this.context, _createPropertyObjectPath(this.context, this, "Worksheets", true, false, false));
				}
				return this._W;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "_Runtime", {
			get: function () {
				_throwIfApiNotSupported("Workbook._Runtime", _defaultApiSetName, "1.5", _hostName);
				if (!this.__R) {
					this.__R=new Excel.Runtime(this.context, _createPropertyObjectPath(this.context, this, "_Runtime", false, false, false));
				}
				return this.__R;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "_V1Api", {
			get: function () {
				_throwIfApiNotSupported("Workbook._V1Api", _defaultApiSetName, "1.3", _hostName);
				if (!this.__V) {
					this.__V=new Excel._V1Api(this.context, _createPropertyObjectPath(this.context, this, "_V1Api", false, false, false));
				}
				return this.__V;
			},
			enumerable: true,
			configurable: true
		});
		Workbook.prototype.getSelectedRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetSelectedRange", 1, [], false, true, null, false));
		};
		Workbook.prototype._GetObjectByReferenceId=function (bstrReferenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectByReferenceId", 1, [bstrReferenceId], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._GetObjectTypeNameByReferenceId=function (bstrReferenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectTypeNameByReferenceId", 1, [bstrReferenceId], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._GetReferenceCount=function () {
			var action=_createMethodAction(this.context, this, "_GetReferenceCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._RemoveAllReferences=function () {
			_createMethodAction(this.context, this, "_RemoveAllReferences", 1, [], false);
		};
		Workbook.prototype._RemoveReference=function (bstrReferenceId) {
			_createMethodAction(this.context, this, "_RemoveReference", 1, [bstrReferenceId], false);
		};
		Workbook.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Workbook.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Object.defineProperty(Workbook.prototype, "onSelectionChanged", {
			get: function () {
				var _this=this;
				_throwIfApiNotSupported("Workbook.onSelectionChanged", _defaultApiSetName, "1.3", _hostName);
				if (!this.m_selectionChanged) {
					this.m_selectionChanged=new OfficeExtension.EventHandlers(this.context, this, "SelectionChanged", {
						registerFunc: function (handlerCallback) {
							return _this.context.eventRegistration.register(2, "", handlerCallback);
						},
						unregisterFunc: function (handlerCallback) {
							return _this.context.eventRegistration.unregister(2, "", handlerCallback);
						},
						eventArgsTransformFunc: function (args) {
							return OfficeExtension.Utility._createPromiseFromResult({ workbook: _this });
						}
					});
				}
				return this.m_selectionChanged;
			},
			enumerable: true,
			configurable: true
		});
		Workbook.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Workbook;
	}(OfficeExtension.ClientObject));
	Excel.Workbook=Workbook;
	var _typeWorksheet="Worksheet";
	var Worksheet=(function (_super) {
		__extends(Worksheet, _super);
		function Worksheet() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Worksheet.prototype, "_className", {
			get: function () {
				return "Worksheet";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name", "id", "position", "visibility"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, false, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["charts", "tables", "protection", "pivotTables", "names"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "charts", {
			get: function () {
				if (!this._C) {
					this._C=new Excel.ChartCollection(this.context, _createPropertyObjectPath(this.context, this, "Charts", true, false, false));
				}
				this._C._ParentObject=this;
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "names", {
			get: function () {
				_throwIfApiNotSupported("Worksheet.names", _defaultApiSetName, "1.4", _hostName);
				if (!this._Na) {
					this._Na=new Excel.NamedItemCollection(this.context, _createPropertyObjectPath(this.context, this, "Names", true, false, false));
				}
				return this._Na;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "pivotTables", {
			get: function () {
				_throwIfApiNotSupported("Worksheet.pivotTables", _defaultApiSetName, "1.3", _hostName);
				if (!this._P) {
					this._P=new Excel.PivotTableCollection(this.context, _createPropertyObjectPath(this.context, this, "PivotTables", true, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "protection", {
			get: function () {
				_throwIfApiNotSupported("Worksheet.protection", _defaultApiSetName, "1.2", _hostName);
				if (!this._Pr) {
					this._Pr=new Excel.WorksheetProtection(this.context, _createPropertyObjectPath(this.context, this, "Protection", false, false, false));
				}
				return this._Pr;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Excel.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false, false));
				}
				this.m_tables._ParentObject=this;
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Worksheet.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		Worksheet.prototype.activate=function () {
			_createMethodAction(this.context, this, "Activate", 1, [], false);
		};
		Worksheet.prototype.calculate=function (markAllDirty) {
			_throwIfApiNotSupported("Worksheet.calculate", _defaultApiSetName, "1.6", _hostName);
			_createMethodAction(this.context, this, "Calculate", 0, [markAllDirty], false);
		};
		Worksheet.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Worksheet.prototype.getCell=function (row, column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetCell", 1, [row, column], false, true, null, false));
		};
		Worksheet.prototype.getNext=function (visibleOnly) {
			_throwIfApiNotSupported("Worksheet.getNext", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [visibleOnly], false, true, "_GetSheetById", false));
		};
		Worksheet.prototype.getNextOrNullObject=function (visibleOnly) {
			_throwIfApiNotSupported("Worksheet.getNextOrNullObject", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [visibleOnly], false, true, "_GetSheetById", false));
		};
		Worksheet.prototype.getPrevious=function (visibleOnly) {
			_throwIfApiNotSupported("Worksheet.getPrevious", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetPrevious", 1, [visibleOnly], false, true, "_GetSheetById", false));
		};
		Worksheet.prototype.getPreviousOrNullObject=function (visibleOnly) {
			_throwIfApiNotSupported("Worksheet.getPreviousOrNullObject", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetPreviousOrNullObject", 1, [visibleOnly], false, true, "_GetSheetById", false));
		};
		Worksheet.prototype.getRange=function (address) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [address], false, true, null, false));
		};
		Worksheet.prototype.getUsedRange=function (valuesOnly) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRange", 1, [valuesOnly], false, true, null, false));
		};
		Worksheet.prototype.getUsedRangeOrNullObject=function (valuesOnly) {
			_throwIfApiNotSupported("Worksheet.getUsedRangeOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRangeOrNullObject", 1, [valuesOnly], false, true, null, false));
		};
		Worksheet.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Worksheet.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		Worksheet.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Worksheet.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Worksheet;
	}(OfficeExtension.ClientObject));
	Excel.Worksheet=Worksheet;
	var _typeWorksheetCollection="WorksheetCollection";
	var WorksheetCollection=(function (_super) {
		__extends(WorksheetCollection, _super);
		function WorksheetCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(WorksheetCollection.prototype, "_className", {
			get: function () {
				return "WorksheetCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(WorksheetCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(WorksheetCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeWorksheetCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		WorksheetCollection.prototype.add=function (name) {
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [name], false, true, null, false));
		};
		WorksheetCollection.prototype.getActiveWorksheet=function () {
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetActiveWorksheet", 1, [], false, false, null, false));
		};
		WorksheetCollection.prototype.getCount=function (visibleOnly) {
			_throwIfApiNotSupported("WorksheetCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [visibleOnly], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		WorksheetCollection.prototype.getFirst=function (visibleOnly) {
			_throwIfApiNotSupported("WorksheetCollection.getFirst", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [visibleOnly], false, true, null, false));
		};
		WorksheetCollection.prototype.getItem=function (key) {
			return new Excel.Worksheet(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		WorksheetCollection.prototype.getItemOrNullObject=function (key) {
			_throwIfApiNotSupported("WorksheetCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [key], false, false, null, false));
		};
		WorksheetCollection.prototype.getLast=function (visibleOnly) {
			_throwIfApiNotSupported("WorksheetCollection.getLast", _defaultApiSetName, "1.5", _hostName);
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetLast", 1, [visibleOnly], false, true, null, false));
		};
		WorksheetCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		WorksheetCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.Worksheet(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return WorksheetCollection;
	}(OfficeExtension.ClientObject));
	Excel.WorksheetCollection=WorksheetCollection;
	var _typeWorksheetProtection="WorksheetProtection";
	var WorksheetProtection=(function (_super) {
		__extends(WorksheetProtection, _super);
		function WorksheetProtection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(WorksheetProtection.prototype, "_className", {
			get: function () {
				return "WorksheetProtection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(WorksheetProtection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["protected", "options"];
			},
			enumerable: true,
			configurable: true
		});
		WorksheetProtection.prototype.protect=function (options, password) {
			if (versionNumberIsEarlierThan(16, 0, 8716)) {
				_createMethodAction(this.context, this, "Protect", 0, [options], false);
				return;
			}
			_createMethodAction(this.context, this, "Protect", 0, [options, password], false);
		};
		WorksheetProtection.prototype.unprotect=function (password) {
			_createMethodAction(this.context, this, "Unprotect", 0, [password], false);
		};
		WorksheetProtection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		WorksheetProtection.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		WorksheetProtection.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return WorksheetProtection;
	}(OfficeExtension.ClientObject));
	Excel.WorksheetProtection=WorksheetProtection;
	var _typeRange="Range";
	var Range=(function (_super) {
		__extends(Range, _super);
		function Range() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Range.prototype, "_className", {
			get: function () {
				return "Range";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["numberFormat", "values", "text", "formulas", "formulasLocal", "rowIndex", "columnIndex", "rowCount", "columnCount", "address", "addressLocal", "cellCount", "_ReferenceId", "valueTypes", "formulasR1C1", "hidden", "rowHidden", "columnHidden"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, false, true, true, false, false, false, false, false, false, false, false, false, true, false, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format", "worksheet", "sort", "conditionalFormats"];
			},
			enumerable: true,
			configurable: true
		});
		Range.prototype._ensureInteger=function (num, methodName) {
			if (!(typeof num==="number" && isFinite(num) && Math.floor(num)===num)) {
				OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, num, methodName);
			}
		};
		Range.prototype._getAdjacentRange=function (functionName, count, referenceRange, rowDirection, columnDirection) {
			if (count==null) {
				count=1;
			}
			this._ensureInteger(count, functionName);
			var startRange;
			var rowOffset=0;
			var columnOffset=0;
			if (count > 0) {
				startRange=referenceRange.getOffsetRange(rowDirection, columnDirection);
			}
			else {
				startRange=referenceRange;
				rowOffset=rowDirection;
				columnOffset=columnDirection;
			}
			if (Math.abs(count)==1) {
				return startRange;
			}
			return startRange.getBoundingRect(referenceRange.getOffsetRange(rowDirection * count+rowOffset, columnDirection * count+columnOffset));
		};
		Object.defineProperty(Range.prototype, "conditionalFormats", {
			get: function () {
				_throwIfApiNotSupported("Range.conditionalFormats", _defaultApiSetName, "1.6", _hostName);
				if (!this._Con) {
					this._Con=new Excel.ConditionalFormatCollection(this.context, _createPropertyObjectPath(this.context, this, "ConditionalFormats", true, false, false));
				}
				return this._Con;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.RangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "sort", {
			get: function () {
				_throwIfApiNotSupported("Range.sort", _defaultApiSetName, "1.2", _hostName);
				if (!this._S) {
					this._S=new Excel.RangeSort(this.context, _createPropertyObjectPath(this.context, this, "Sort", false, false, false));
				}
				return this._S;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "worksheet", {
			get: function () {
				if (!this._W) {
					this._W=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false, false));
				}
				return this._W;
			},
			enumerable: true,
			configurable: true
		});
		Range.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		Range.prototype.calculate=function () {
			_throwIfApiNotSupported("Range.calculate", _defaultApiSetName, "1.6", _hostName);
			_createMethodAction(this.context, this, "Calculate", 0, [], false);
		};
		Range.prototype.clear=function (applyTo) {
			_createMethodAction(this.context, this, "Clear", 0, [applyTo], false);
		};
		Range.prototype.delete=function (shift) {
			_createMethodAction(this.context, this, "Delete", 0, [shift], false);
		};
		Range.prototype.getBoundingRect=function (anotherRange) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetBoundingRect", 1, [anotherRange], false, true, null, false));
		};
		Range.prototype.getCell=function (row, column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetCell", 1, [row, column], false, true, null, false));
		};
		Range.prototype.getColumn=function (column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetColumn", 1, [column], false, true, null, false));
		};
		Range.prototype.getColumnsAfter=function (count) {
			if (!isExcel1_3OrAbove()) {
				if (count==null) {
					count=1;
				}
				this._ensureInteger(count, "RowsAbove");
				if (count==0) {
					OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, "count", "RowsAbove");
				}
				return this._getAdjacentRange("getColumnsAfter", count, this.getLastColumn(), 0, 1);
			}
			_throwIfApiNotSupported("Range.getColumnsAfter", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetColumnsAfter", 1, [count], false, true, null, false));
		};
		Range.prototype.getColumnsBefore=function (count) {
			if (!isExcel1_3OrAbove()) {
				if (count==null) {
					count=1;
				}
				this._ensureInteger(count, "RowsAbove");
				if (count==0) {
					OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, "count", "RowsAbove");
				}
				return this._getAdjacentRange("getColumnsBefore", count, this.getColumn(0), 0, -1);
			}
			_throwIfApiNotSupported("Range.getColumnsBefore", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetColumnsBefore", 1, [count], false, true, null, false));
		};
		Range.prototype.getEntireColumn=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetEntireColumn", 1, [], false, true, null, false));
		};
		Range.prototype.getEntireRow=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetEntireRow", 1, [], false, true, null, false));
		};
		Range.prototype.getIntersection=function (anotherRange) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetIntersection", 1, [anotherRange], false, true, null, false));
		};
		Range.prototype.getIntersectionOrNullObject=function (anotherRange) {
			_throwIfApiNotSupported("Range.getIntersectionOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetIntersectionOrNullObject", 1, [anotherRange], false, true, null, false));
		};
		Range.prototype.getLastCell=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastCell", 1, [], false, true, null, false));
		};
		Range.prototype.getLastColumn=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastColumn", 1, [], false, true, null, false));
		};
		Range.prototype.getLastRow=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastRow", 1, [], false, true, null, false));
		};
		Range.prototype.getOffsetRange=function (rowOffset, columnOffset) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetOffsetRange", 1, [rowOffset, columnOffset], false, true, null, false));
		};
		Range.prototype.getResizedRange=function (deltaRows, deltaColumns) {
			if (!isExcel1_3OrAbove()) {
				this._ensureInteger(deltaRows, "getResizedRange");
				this._ensureInteger(deltaColumns, "getResizedRange");
				var referenceRange=(deltaRows >=0 && deltaColumns >=0) ? this : this.getCell(0, 0);
				return referenceRange.getBoundingRect(this.getLastCell().getOffsetRange(deltaRows, deltaColumns));
			}
			_throwIfApiNotSupported("Range.getResizedRange", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetResizedRange", 1, [deltaRows, deltaColumns], false, true, null, false));
		};
		Range.prototype.getRow=function (row) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRow", 1, [row], false, true, null, false));
		};
		Range.prototype.getRowsAbove=function (count) {
			if (!isExcel1_3OrAbove()) {
				if (count==null) {
					count=1;
				}
				this._ensureInteger(count, "RowsAbove");
				if (count==0) {
					OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, "count", "RowsAbove");
				}
				return this._getAdjacentRange("getRowsAbove", count, this.getRow(0), -1, 0);
			}
			_throwIfApiNotSupported("Range.getRowsAbove", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRowsAbove", 1, [count], false, true, null, false));
		};
		Range.prototype.getRowsBelow=function (count) {
			if (!isExcel1_3OrAbove()) {
				if (count==null) {
					count=1;
				}
				this._ensureInteger(count, "RowsAbove");
				if (count==0) {
					OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, "count", "RowsAbove");
				}
				return this._getAdjacentRange("getRowsBelow", count, this.getLastRow(), 1, 0);
			}
			_throwIfApiNotSupported("Range.getRowsBelow", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRowsBelow", 1, [count], false, true, null, false));
		};
		Range.prototype.getUsedRange=function (valuesOnly) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRange", 1, [valuesOnly], false, true, null, false));
		};
		Range.prototype.getUsedRangeOrNullObject=function (valuesOnly) {
			_throwIfApiNotSupported("Range.getUsedRangeOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRangeOrNullObject", 1, [valuesOnly], false, true, null, false));
		};
		Range.prototype.getVisibleView=function () {
			_throwIfApiNotSupported("Range.getVisibleView", _defaultApiSetName, "1.3", _hostName);
			return new Excel.RangeView(this.context, _createMethodObjectPath(this.context, this, "GetVisibleView", 1, [], false, false, null, false));
		};
		Range.prototype.insert=function (shift) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "Insert", 0, [shift], false, true, null, false));
		};
		Range.prototype.merge=function (across) {
			_throwIfApiNotSupported("Range.merge", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "Merge", 0, [across], false);
		};
		Range.prototype.select=function () {
			_createMethodAction(this.context, this, "Select", 1, [], false);
		};
		Range.prototype.unmerge=function () {
			_throwIfApiNotSupported("Range.unmerge", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "Unmerge", 0, [], false);
		};
		Range.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, [], false);
		};
		Range.prototype._ValidateArraySize=function (rows, columns) {
			_throwIfApiNotSupported("Range._ValidateArraySize", _defaultApiSetName, "1.3", _hostName);
			_createMethodAction(this.context, this, "_ValidateArraySize", 1, [rows, columns], false);
		};
		Range.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Range.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.__R=value["_ReferenceId"];
			}
		};
		Range.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Range.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Range.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Range.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Range;
	}(OfficeExtension.ClientObject));
	Excel.Range=Range;
	var _typeRangeView="RangeView";
	var RangeView=(function (_super) {
		__extends(RangeView, _super);
		function RangeView() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeView.prototype, "_className", {
			get: function () {
				return "RangeView";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeView.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["numberFormat", "values", "text", "formulas", "formulasLocal", "formulasR1C1", "valueTypes", "rowCount", "columnCount", "cellAddresses", "index"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeView.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, false, true, true, true, false, false, false, false, false];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeView.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["rows"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeView.prototype, "rows", {
			get: function () {
				if (!this._Ro) {
					this._Ro=new Excel.RangeViewCollection(this.context, _createPropertyObjectPath(this.context, this, "Rows", true, false, false));
				}
				return this._Ro;
			},
			enumerable: true,
			configurable: true
		});
		RangeView.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		RangeView.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		RangeView.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeView.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		RangeView.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return RangeView;
	}(OfficeExtension.ClientObject));
	Excel.RangeView=RangeView;
	var _typeRangeViewCollection="RangeViewCollection";
	var RangeViewCollection=(function (_super) {
		__extends(RangeViewCollection, _super);
		function RangeViewCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeViewCollection.prototype, "_className", {
			get: function () {
				return "RangeViewCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeViewCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeViewCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeRangeViewCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		RangeViewCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("RangeViewCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		RangeViewCollection.prototype.getItemAt=function (index) {
			return new Excel.RangeView(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		RangeViewCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeViewCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.RangeView(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, _this.context, _this, childItemData, index)); });
		};
		return RangeViewCollection;
	}(OfficeExtension.ClientObject));
	Excel.RangeViewCollection=RangeViewCollection;
	var _typeSettingCollection="SettingCollection";
	var SettingCollection=(function (_super) {
		__extends(SettingCollection, _super);
		function SettingCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(SettingCollection.prototype, "_className", {
			get: function () {
				return "SettingCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SettingCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SettingCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeSettingCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		SettingCollection.prototype.add=function (key, value) {
			value=Setting._replaceDateWithStringDate(value);
			return new Excel.Setting(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [key, value], false, true, null, false));
		};
		SettingCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		SettingCollection.prototype.getItem=function (key) {
			return new Excel.Setting(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		SettingCollection.prototype.getItemOrNullObject=function (key) {
			return new Excel.Setting(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [key], false, false, null, false));
		};
		SettingCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		SettingCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.Setting(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		Object.defineProperty(SettingCollection.prototype, "onSettingsChanged", {
			get: function () {
				var _this=this;
				if (!this.m_settingsChanged) {
					this.m_settingsChanged=new OfficeExtension.EventHandlers(this.context, this, "SettingsChanged", {
						registerFunc: function (handlerCallback) {
							return _this.context.eventRegistration.register(1, "", handlerCallback);
						},
						unregisterFunc: function (handlerCallback) {
							return _this.context.eventRegistration.unregister(1, "", handlerCallback);
						},
						eventArgsTransformFunc: function (args) {
							return OfficeExtension.Utility._createPromiseFromResult({ settings: _this });
						}
					});
				}
				return this.m_settingsChanged;
			},
			enumerable: true,
			configurable: true
		});
		return SettingCollection;
	}(OfficeExtension.ClientObject));
	Excel.SettingCollection=SettingCollection;
	var _typeSetting="Setting";
	var Setting=(function (_super) {
		__extends(Setting, _super);
		function Setting() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Setting.prototype, "_className", {
			get: function () {
				return "Setting";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Setting.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["key", "value"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Setting.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true];
			},
			enumerable: true,
			configurable: true
		});
		Setting.replaceStringDateWithDate=function (value) {
			var strValue=JSON.stringify(value);
			value=JSON.parse(strValue, function dateReviver(k, v) {
				var d;
				if (typeof v==='string' && v && v.length > 6 && v.slice(0, 5)===Setting.DateJSONPrefix && v.slice(-1)===Setting.DateJSONSuffix) {
					d=new Date(parseInt(v.slice(5, -1)));
					if (d) {
						return d;
					}
				}
				return v;
			});
			return value;
		};
		Setting._replaceDateWithStringDate=function (value) {
			var _this=this;
			var strValue=JSON.stringify(value, function (k, v) {
				return (_this[k] instanceof Date) ? (Setting.DateJSONPrefix+_this[k].getTime()+Setting.DateJSONSuffix) : v;
			});
			value=JSON.parse(strValue);
			return value;
		};
		Setting.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		Setting.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Setting.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Setting.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Setting.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Setting;
	}(OfficeExtension.ClientObject));
	Setting.DateJSONPrefix="Date(";
	Setting.DateJSONSuffix=")";
	Excel.Setting=Setting;
	var _typeNamedItemCollection="NamedItemCollection";
	var NamedItemCollection=(function (_super) {
		__extends(NamedItemCollection, _super);
		function NamedItemCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(NamedItemCollection.prototype, "_className", {
			get: function () {
				return "NamedItemCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItemCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItemCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeNamedItemCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		NamedItemCollection.prototype.add=function (name, reference, comment) {
			_throwIfApiNotSupported("NamedItemCollection.add", _defaultApiSetName, "1.4", _hostName);
			return new Excel.NamedItem(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [name, reference, comment], false, true, null, false));
		};
		NamedItemCollection.prototype.addFormulaLocal=function (name, formula, comment) {
			_throwIfApiNotSupported("NamedItemCollection.addFormulaLocal", _defaultApiSetName, "1.4", _hostName);
			return new Excel.NamedItem(this.context, _createMethodObjectPath(this.context, this, "AddFormulaLocal", 0, [name, formula, comment], false, false, null, false));
		};
		NamedItemCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("NamedItemCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		NamedItemCollection.prototype.getItem=function (name) {
			return new Excel.NamedItem(this.context, _createIndexerObjectPath(this.context, this, [name]));
		};
		NamedItemCollection.prototype.getItemOrNullObject=function (name) {
			_throwIfApiNotSupported("NamedItemCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.NamedItem(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [name], false, false, null, false));
		};
		NamedItemCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		NamedItemCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.NamedItem(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return NamedItemCollection;
	}(OfficeExtension.ClientObject));
	Excel.NamedItemCollection=NamedItemCollection;
	var _typeNamedItem="NamedItem";
	var NamedItem=(function (_super) {
		__extends(NamedItem, _super);
		function NamedItem() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(NamedItem.prototype, "_className", {
			get: function () {
				return "NamedItem";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name", "type", "value", "visible", "_Id", "comment", "scope"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, false, false, true, false, true, false];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["worksheet", "worksheetOrNullObject"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "worksheet", {
			get: function () {
				_throwIfApiNotSupported("NamedItem.worksheet", _defaultApiSetName, "1.4", _hostName);
				if (!this._W) {
					this._W=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false, false));
				}
				return this._W;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "worksheetOrNullObject", {
			get: function () {
				_throwIfApiNotSupported("NamedItem.worksheetOrNullObject", _defaultApiSetName, "1.4", _hostName);
				if (!this._Wo) {
					this._Wo=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "WorksheetOrNullObject", false, false, false));
				}
				return this._Wo;
			},
			enumerable: true,
			configurable: true
		});
		NamedItem.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		NamedItem.prototype.delete=function () {
			_throwIfApiNotSupported("NamedItem.delete", _defaultApiSetName, "1.4", _hostName);
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		NamedItem.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		NamedItem.prototype.getRangeOrNullObject=function () {
			_throwIfApiNotSupported("NamedItem.getRangeOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRangeOrNullObject", 1, [], false, true, null, false));
		};
		NamedItem.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		NamedItem.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_Id"])) {
				this.__I=value["_Id"];
			}
		};
		NamedItem.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		NamedItem.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return NamedItem;
	}(OfficeExtension.ClientObject));
	Excel.NamedItem=NamedItem;
	var _typeBinding="Binding";
	var Binding=(function (_super) {
		__extends(Binding, _super);
		function Binding() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Binding.prototype, "_className", {
			get: function () {
				return "Binding";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Binding.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["id", "type"];
			},
			enumerable: true,
			configurable: true
		});
		Binding.prototype.delete=function () {
			_throwIfApiNotSupported("Binding.delete", _defaultApiSetName, "1.3", _hostName);
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Binding.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, false, null, false));
		};
		Binding.prototype.getTable=function () {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "GetTable", 1, [], false, false, null, false));
		};
		Binding.prototype.getText=function () {
			var action=_createMethodAction(this.context, this, "GetText", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Binding.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Binding.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		Binding.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Object.defineProperty(Binding.prototype, "onDataChanged", {
			get: function () {
				var _this=this;
				_throwIfApiNotSupported("Binding.onDataChanged", _defaultApiSetName, "1.3", _hostName);
				if (!this.m_dataChanged) {
					this.m_dataChanged=new OfficeExtension.EventHandlers(this.context, this, "DataChanged", {
						registerFunc: function (handlerCallback) {
							return _this.context.eventRegistration.register(4, "TODO-COLBY", handlerCallback);
						},
						unregisterFunc: function (handlerCallback) {
							return _this.context.eventRegistration.unregister(4, "TODO-COLBY", handlerCallback);
						},
						eventArgsTransformFunc: function (args) {
							var evt={
								binding: _this
							};
							return OfficeExtension.Utility._createPromiseFromResult(evt);
						}
					});
				}
				return this.m_dataChanged;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Binding.prototype, "onSelectionChanged", {
			get: function () {
				var _this=this;
				_throwIfApiNotSupported("Binding.onSelectionChanged", _defaultApiSetName, "1.3", _hostName);
				if (!this.m_selectionChanged) {
					this.m_selectionChanged=new OfficeExtension.EventHandlers(this.context, this, "SelectionChanged", {
						registerFunc: function (handlerCallback) {
							return _this.context.eventRegistration.register(3, "TODO-COLBY", handlerCallback);
						},
						unregisterFunc: function (handlerCallback) {
							return _this.context.eventRegistration.unregister(3, "TODO-COLBY", handlerCallback);
						},
						eventArgsTransformFunc: function (args) {
							var evt={
								binding: _this,
								columnCount: args.columnCount,
								rowCount: args.rowCount,
								startColumn: args.startColumn,
								startRow: args.startRow
							};
							return OfficeExtension.Utility._createPromiseFromResult(evt);
						}
					});
				}
				return this.m_selectionChanged;
			},
			enumerable: true,
			configurable: true
		});
		Binding.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Binding;
	}(OfficeExtension.ClientObject));
	Excel.Binding=Binding;
	var _typeBindingCollection="BindingCollection";
	var BindingCollection=(function (_super) {
		__extends(BindingCollection, _super);
		function BindingCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(BindingCollection.prototype, "_className", {
			get: function () {
				return "BindingCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BindingCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BindingCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BindingCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeBindingCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		BindingCollection.prototype.add=function (range, bindingType, id) {
			_throwIfApiNotSupported("BindingCollection.add", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [range, bindingType, id], false, true, null, false));
		};
		BindingCollection.prototype.addFromNamedItem=function (name, bindingType, id) {
			_throwIfApiNotSupported("BindingCollection.addFromNamedItem", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "AddFromNamedItem", 0, [name, bindingType, id], false, false, null, false));
		};
		BindingCollection.prototype.addFromSelection=function (bindingType, id) {
			_throwIfApiNotSupported("BindingCollection.addFromSelection", _defaultApiSetName, "1.3", _hostName);
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "AddFromSelection", 0, [bindingType, id], false, false, null, false));
		};
		BindingCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("BindingCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		BindingCollection.prototype.getItem=function (id) {
			return new Excel.Binding(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		BindingCollection.prototype.getItemAt=function (index) {
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		BindingCollection.prototype.getItemOrNullObject=function (id) {
			_throwIfApiNotSupported("BindingCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [id], false, false, null, false));
		};
		BindingCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		BindingCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.Binding(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return BindingCollection;
	}(OfficeExtension.ClientObject));
	Excel.BindingCollection=BindingCollection;
	var _typeTableCollection="TableCollection";
	var TableCollection=(function (_super) {
		__extends(TableCollection, _super);
		function TableCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableCollection.prototype, "_className", {
			get: function () {
				return "TableCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "_ParentObject", {
			get: function () {
				return this.m__ParentObject;
			},
			set: function (value) {
				this.m__ParentObject=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeTableCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		TableCollection.prototype.add=function (address, hasHeaders) {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [address, hasHeaders], false, true, null, false));
		};
		TableCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("TableCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		TableCollection.prototype.getItem=function (key) {
			return new Excel.Table(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		TableCollection.prototype.getItemAt=function (index) {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		TableCollection.prototype.getItemOrNullObject=function (key) {
			_throwIfApiNotSupported("TableCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [key], false, false, null, false));
		};
		TableCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.Table(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return TableCollection;
	}(OfficeExtension.ClientObject));
	Excel.TableCollection=TableCollection;
	var _typeTable="Table";
	var Table=(function (_super) {
		__extends(Table, _super);
		function Table() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Table.prototype, "_className", {
			get: function () {
				return "Table";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["id", "name", "showHeaders", "showTotals", "style", "highlightFirstColumn", "highlightLastColumn", "showBandedRows", "showBandedColumns", "showFilterButton"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true, true, true, true, true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["columns", "rows", "sort", "worksheet"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "columns", {
			get: function () {
				if (!this._C) {
					this._C=new Excel.TableColumnCollection(this.context, _createPropertyObjectPath(this.context, this, "Columns", true, false, false));
				}
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "rows", {
			get: function () {
				if (!this._R) {
					this._R=new Excel.TableRowCollection(this.context, _createPropertyObjectPath(this.context, this, "Rows", true, false, false));
				}
				return this._R;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "sort", {
			get: function () {
				_throwIfApiNotSupported("Table.sort", _defaultApiSetName, "1.2", _hostName);
				if (!this._So) {
					this._So=new Excel.TableSort(this.context, _createPropertyObjectPath(this.context, this, "Sort", false, false, false));
				}
				return this._So;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "worksheet", {
			get: function () {
				_throwIfApiNotSupported("Table.worksheet", _defaultApiSetName, "1.2", _hostName);
				if (!this._W) {
					this._W=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false, false));
				}
				return this._W;
			},
			enumerable: true,
			configurable: true
		});
		Table.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		Table.prototype.clearFilters=function () {
			_throwIfApiNotSupported("Table.clearFilters", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "ClearFilters", 0, [], false);
		};
		Table.prototype.convertToRange=function () {
			_throwIfApiNotSupported("Table.convertToRange", _defaultApiSetName, "1.2", _hostName);
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "ConvertToRange", 0, [], false, true, null, false));
		};
		Table.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Table.prototype.getDataBodyRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetDataBodyRange", 1, [], false, true, null, false));
		};
		Table.prototype.getHeaderRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetHeaderRowRange", 1, [], false, true, null, false));
		};
		Table.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		Table.prototype.getTotalRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetTotalRowRange", 1, [], false, true, null, false));
		};
		Table.prototype.reapplyFilters=function () {
			_throwIfApiNotSupported("Table.reapplyFilters", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "ReapplyFilters", 0, [], false);
		};
		Table.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Table.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				value["Id"]=value["Id"].toString();
				this._I=value["Id"];
			}
		};
		Table.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Table.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Table;
	}(OfficeExtension.ClientObject));
	Excel.Table=Table;
	var _typeTableColumnCollection="TableColumnCollection";
	var TableColumnCollection=(function (_super) {
		__extends(TableColumnCollection, _super);
		function TableColumnCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableColumnCollection.prototype, "_className", {
			get: function () {
				return "TableColumnCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumnCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumnCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumnCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeTableColumnCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		TableColumnCollection.prototype.add=function (index, values, name) {
			return new Excel.TableColumn(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [index, values, name], false, true, null, false));
		};
		TableColumnCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("TableColumnCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		TableColumnCollection.prototype.getItem=function (key) {
			return new Excel.TableColumn(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		TableColumnCollection.prototype.getItemAt=function (index) {
			return new Excel.TableColumn(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		TableColumnCollection.prototype.getItemOrNullObject=function (key) {
			_throwIfApiNotSupported("TableColumnCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.TableColumn(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [key], false, false, null, false));
		};
		TableColumnCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableColumnCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.TableColumn(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return TableColumnCollection;
	}(OfficeExtension.ClientObject));
	Excel.TableColumnCollection=TableColumnCollection;
	var _typeTableColumn="TableColumn";
	var TableColumn=(function (_super) {
		__extends(TableColumn, _super);
		function TableColumn() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableColumn.prototype, "_className", {
			get: function () {
				return "TableColumn";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["id", "index", "values", "name"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, false, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["filter"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "filter", {
			get: function () {
				_throwIfApiNotSupported("TableColumn.filter", _defaultApiSetName, "1.2", _hostName);
				if (!this._F) {
					this._F=new Excel.Filter(this.context, _createPropertyObjectPath(this.context, this, "Filter", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		TableColumn.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		TableColumn.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		TableColumn.prototype.getDataBodyRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetDataBodyRange", 1, [], false, true, null, false));
		};
		TableColumn.prototype.getHeaderRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetHeaderRowRange", 1, [], false, true, null, false));
		};
		TableColumn.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		TableColumn.prototype.getTotalRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetTotalRowRange", 1, [], false, true, null, false));
		};
		TableColumn.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableColumn.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		TableColumn.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		TableColumn.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return TableColumn;
	}(OfficeExtension.ClientObject));
	Excel.TableColumn=TableColumn;
	var _typeTableRowCollection="TableRowCollection";
	var TableRowCollection=(function (_super) {
		__extends(TableRowCollection, _super);
		function TableRowCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableRowCollection.prototype, "_className", {
			get: function () {
				return "TableRowCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeTableRowCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		TableRowCollection.prototype.add=function (index, values) {
			return new Excel.TableRow(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [index, values], false, true, null, false));
		};
		TableRowCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("TableRowCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		TableRowCollection.prototype.getItemAt=function (index) {
			return new Excel.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		TableRowCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableRowCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.TableRow(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, _this.context, _this, childItemData, index)); });
		};
		return TableRowCollection;
	}(OfficeExtension.ClientObject));
	Excel.TableRowCollection=TableRowCollection;
	var _typeTableRow="TableRow";
	var TableRow=(function (_super) {
		__extends(TableRow, _super);
		function TableRow() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableRow.prototype, "_className", {
			get: function () {
				return "TableRow";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["index", "values"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true];
			},
			enumerable: true,
			configurable: true
		});
		TableRow.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		TableRow.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		TableRow.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		TableRow.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableRow.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		TableRow.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return TableRow;
	}(OfficeExtension.ClientObject));
	Excel.TableRow=TableRow;
	var _typeRangeFormat="RangeFormat";
	var RangeFormat=(function (_super) {
		__extends(RangeFormat, _super);
		function RangeFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeFormat.prototype, "_className", {
			get: function () {
				return "RangeFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["wrapText", "horizontalAlignment", "verticalAlignment", "columnWidth", "rowHeight"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["fill", "font", "borders", "protection"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "borders", {
			get: function () {
				if (!this._B) {
					this._B=new Excel.RangeBorderCollection(this.context, _createPropertyObjectPath(this.context, this, "Borders", true, false, false));
				}
				return this._B;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.RangeFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.RangeFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "protection", {
			get: function () {
				_throwIfApiNotSupported("RangeFormat.protection", _defaultApiSetName, "1.2", _hostName);
				if (!this._P) {
					this._P=new Excel.FormatProtection(this.context, _createPropertyObjectPath(this.context, this, "Protection", false, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		RangeFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		RangeFormat.prototype.autofitColumns=function () {
			_throwIfApiNotSupported("RangeFormat.autofitColumns", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "AutofitColumns", 0, [], false);
		};
		RangeFormat.prototype.autofitRows=function () {
			_throwIfApiNotSupported("RangeFormat.autofitRows", _defaultApiSetName, "1.2", _hostName);
			_createMethodAction(this.context, this, "AutofitRows", 0, [], false);
		};
		RangeFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		RangeFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return RangeFormat;
	}(OfficeExtension.ClientObject));
	Excel.RangeFormat=RangeFormat;
	var _typeFormatProtection="FormatProtection";
	var FormatProtection=(function (_super) {
		__extends(FormatProtection, _super);
		function FormatProtection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(FormatProtection.prototype, "_className", {
			get: function () {
				return "FormatProtection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FormatProtection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["locked", "formulaHidden"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FormatProtection.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true];
			},
			enumerable: true,
			configurable: true
		});
		FormatProtection.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		FormatProtection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		FormatProtection.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		FormatProtection.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return FormatProtection;
	}(OfficeExtension.ClientObject));
	Excel.FormatProtection=FormatProtection;
	var _typeRangeFill="RangeFill";
	var RangeFill=(function (_super) {
		__extends(RangeFill, _super);
		function RangeFill() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeFill.prototype, "_className", {
			get: function () {
				return "RangeFill";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFill.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["color"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFill.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		RangeFill.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		RangeFill.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		RangeFill.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeFill.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		RangeFill.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return RangeFill;
	}(OfficeExtension.ClientObject));
	Excel.RangeFill=RangeFill;
	var _typeRangeBorder="RangeBorder";
	var RangeBorder=(function (_super) {
		__extends(RangeBorder, _super);
		function RangeBorder() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeBorder.prototype, "_className", {
			get: function () {
				return "RangeBorder";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorder.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["sideIndex", "style", "weight", "color"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorder.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		RangeBorder.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		RangeBorder.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeBorder.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		RangeBorder.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return RangeBorder;
	}(OfficeExtension.ClientObject));
	Excel.RangeBorder=RangeBorder;
	var _typeRangeBorderCollection="RangeBorderCollection";
	var RangeBorderCollection=(function (_super) {
		__extends(RangeBorderCollection, _super);
		function RangeBorderCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeBorderCollection.prototype, "_className", {
			get: function () {
				return "RangeBorderCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorderCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorderCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorderCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeRangeBorderCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		RangeBorderCollection.prototype.getItem=function (index) {
			return new Excel.RangeBorder(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		RangeBorderCollection.prototype.getItemAt=function (index) {
			return new Excel.RangeBorder(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		RangeBorderCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeBorderCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.RangeBorder(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return RangeBorderCollection;
	}(OfficeExtension.ClientObject));
	Excel.RangeBorderCollection=RangeBorderCollection;
	var _typeRangeFont="RangeFont";
	var RangeFont=(function (_super) {
		__extends(RangeFont, _super);
		function RangeFont() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeFont.prototype, "_className", {
			get: function () {
				return "RangeFont";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name", "size", "color", "italic", "bold", "underline"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		RangeFont.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		RangeFont.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		RangeFont.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		RangeFont.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return RangeFont;
	}(OfficeExtension.ClientObject));
	Excel.RangeFont=RangeFont;
	var _typeChartCollection="ChartCollection";
	var ChartCollection=(function (_super) {
		__extends(ChartCollection, _super);
		function ChartCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartCollection.prototype, "_className", {
			get: function () {
				return "ChartCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartCollection.prototype, "_ParentObject", {
			get: function () {
				return this.m__ParentObject;
			},
			set: function (value) {
				this.m__ParentObject=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeChartCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		ChartCollection.prototype.add=function (type, sourceData, seriesBy) {
			if (!(sourceData instanceof Range)) {
				throw OfficeExtension.Utility.createRuntimeError(OfficeExtension.ResourceStrings.invalidArgument, "sourceData", "Charts.Add");
			}
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [type, sourceData, seriesBy], false, true, null, false));
		};
		ChartCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("ChartCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ChartCollection.prototype.getItem=function (name) {
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "GetItem", 1, [name], false, false, null, false));
		};
		ChartCollection.prototype.getItemAt=function (index) {
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		ChartCollection.prototype.getItemOrNullObject=function (name) {
			_throwIfApiNotSupported("ChartCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [name], false, false, null, false));
		};
		ChartCollection.prototype._GetItem=function (key) {
			return new Excel.Chart(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		ChartCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.Chart(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return ChartCollection;
	}(OfficeExtension.ClientObject));
	Excel.ChartCollection=ChartCollection;
	var _typeChart="Chart";
	var Chart=(function (_super) {
		__extends(Chart, _super);
		function Chart() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Chart.prototype, "_className", {
			get: function () {
				return "Chart";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name", "top", "left", "width", "height"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["title", "dataLabels", "legend", "series", "axes", "format", "worksheet"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "axes", {
			get: function () {
				if (!this._A) {
					this._A=new Excel.ChartAxes(this.context, _createPropertyObjectPath(this.context, this, "Axes", false, false, false));
				}
				return this._A;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "dataLabels", {
			get: function () {
				if (!this._D) {
					this._D=new Excel.ChartDataLabels(this.context, _createPropertyObjectPath(this.context, this, "DataLabels", false, false, false));
				}
				return this._D;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartAreaFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "legend", {
			get: function () {
				if (!this._Le) {
					this._Le=new Excel.ChartLegend(this.context, _createPropertyObjectPath(this.context, this, "Legend", false, false, false));
				}
				return this._Le;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "series", {
			get: function () {
				if (!this._S) {
					this._S=new Excel.ChartSeriesCollection(this.context, _createPropertyObjectPath(this.context, this, "Series", true, false, false));
				}
				return this._S;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "title", {
			get: function () {
				if (!this._T) {
					this._T=new Excel.ChartTitle(this.context, _createPropertyObjectPath(this.context, this, "Title", false, false, false));
				}
				return this._T;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "worksheet", {
			get: function () {
				_throwIfApiNotSupported("Chart.worksheet", _defaultApiSetName, "1.2", _hostName);
				if (!this._Wo) {
					this._Wo=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false, false));
				}
				return this._Wo;
			},
			enumerable: true,
			configurable: true
		});
		Chart.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		Chart.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		Chart.prototype.getImage=function (width, height, fittingMode) {
			_throwIfApiNotSupported("Chart.getImage", _defaultApiSetName, "1.2", _hostName);
			var action=_createMethodAction(this.context, this, "GetImage", 1, [width, height, fittingMode], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Chart.prototype.setData=function (sourceData, seriesBy) {
			if (!(sourceData instanceof Range)) {
				throw OfficeExtension.Utility.createRuntimeError(OfficeExtension.ResourceStrings.invalidArgument, "sourceData", "Chart.setData");
			}
			_createMethodAction(this.context, this, "SetData", 0, [sourceData, seriesBy], false);
		};
		Chart.prototype.setPosition=function (startCell, endCell) {
			_createMethodAction(this.context, this, "SetPosition", 0, [startCell, endCell], false);
		};
		Chart.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Chart.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Chart.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Chart;
	}(OfficeExtension.ClientObject));
	Excel.Chart=Chart;
	var _typeChartAreaFormat="ChartAreaFormat";
	var ChartAreaFormat=(function (_super) {
		__extends(ChartAreaFormat, _super);
		function ChartAreaFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAreaFormat.prototype, "_className", {
			get: function () {
				return "ChartAreaFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAreaFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["fill", "font"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAreaFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAreaFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		ChartAreaFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAreaFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAreaFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAreaFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAreaFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartAreaFormat=ChartAreaFormat;
	var _typeChartSeriesCollection="ChartSeriesCollection";
	var ChartSeriesCollection=(function (_super) {
		__extends(ChartSeriesCollection, _super);
		function ChartSeriesCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartSeriesCollection.prototype, "_className", {
			get: function () {
				return "ChartSeriesCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeChartSeriesCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		ChartSeriesCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("ChartSeriesCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ChartSeriesCollection.prototype.getItemAt=function (index) {
			return new Excel.ChartSeries(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		ChartSeriesCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartSeriesCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.ChartSeries(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, _this.context, _this, childItemData, index)); });
		};
		return ChartSeriesCollection;
	}(OfficeExtension.ClientObject));
	Excel.ChartSeriesCollection=ChartSeriesCollection;
	var _typeChartSeries="ChartSeries";
	var ChartSeries=(function (_super) {
		__extends(ChartSeries, _super);
		function ChartSeries() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartSeries.prototype, "_className", {
			get: function () {
				return "ChartSeries";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["points", "format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartSeriesFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "points", {
			get: function () {
				if (!this._P) {
					this._P=new Excel.ChartPointsCollection(this.context, _createPropertyObjectPath(this.context, this, "Points", true, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		ChartSeries.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartSeries.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartSeries.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartSeries.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartSeries;
	}(OfficeExtension.ClientObject));
	Excel.ChartSeries=ChartSeries;
	var _typeChartSeriesFormat="ChartSeriesFormat";
	var ChartSeriesFormat=(function (_super) {
		__extends(ChartSeriesFormat, _super);
		function ChartSeriesFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartSeriesFormat.prototype, "_className", {
			get: function () {
				return "ChartSeriesFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["fill", "line"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesFormat.prototype, "line", {
			get: function () {
				if (!this._L) {
					this._L=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false, false));
				}
				return this._L;
			},
			enumerable: true,
			configurable: true
		});
		ChartSeriesFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartSeriesFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartSeriesFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartSeriesFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartSeriesFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartSeriesFormat=ChartSeriesFormat;
	var _typeChartPointsCollection="ChartPointsCollection";
	var ChartPointsCollection=(function (_super) {
		__extends(ChartPointsCollection, _super);
		function ChartPointsCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartPointsCollection.prototype, "_className", {
			get: function () {
				return "ChartPointsCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointsCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointsCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointsCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeChartPointsCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		ChartPointsCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("ChartPointsCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ChartPointsCollection.prototype.getItemAt=function (index) {
			return new Excel.ChartPoint(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		ChartPointsCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartPointsCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.ChartPoint(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, _this.context, _this, childItemData, index)); });
		};
		return ChartPointsCollection;
	}(OfficeExtension.ClientObject));
	Excel.ChartPointsCollection=ChartPointsCollection;
	var _typeChartPoint="ChartPoint";
	var ChartPoint=(function (_super) {
		__extends(ChartPoint, _super);
		function ChartPoint() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartPoint.prototype, "_className", {
			get: function () {
				return "ChartPoint";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPoint.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["value"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPoint.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPoint.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartPointFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartPoint.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartPoint.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartPoint.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartPoint;
	}(OfficeExtension.ClientObject));
	Excel.ChartPoint=ChartPoint;
	var _typeChartPointFormat="ChartPointFormat";
	var ChartPointFormat=(function (_super) {
		__extends(ChartPointFormat, _super);
		function ChartPointFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartPointFormat.prototype, "_className", {
			get: function () {
				return "ChartPointFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["fill"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartPointFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartPointFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return ChartPointFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartPointFormat=ChartPointFormat;
	var _typeChartAxes="ChartAxes";
	var ChartAxes=(function (_super) {
		__extends(ChartAxes, _super);
		function ChartAxes() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAxes.prototype, "_className", {
			get: function () {
				return "ChartAxes";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["categoryAxis", "seriesAxis", "valueAxis"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "categoryAxis", {
			get: function () {
				if (!this._C) {
					this._C=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "CategoryAxis", false, false, false));
				}
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "seriesAxis", {
			get: function () {
				if (!this._S) {
					this._S=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "SeriesAxis", false, false, false));
				}
				return this._S;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "valueAxis", {
			get: function () {
				if (!this._V) {
					this._V=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "ValueAxis", false, false, false));
				}
				return this._V;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxes.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAxes.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAxes.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAxes.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAxes;
	}(OfficeExtension.ClientObject));
	Excel.ChartAxes=ChartAxes;
	var _typeChartAxis="ChartAxis";
	var ChartAxis=(function (_super) {
		__extends(ChartAxis, _super);
		function ChartAxis() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAxis.prototype, "_className", {
			get: function () {
				return "ChartAxis";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["majorUnit", "maximum", "minimum", "minorUnit"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["majorGridlines", "minorGridlines", "title", "format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartAxisFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "majorGridlines", {
			get: function () {
				if (!this._M) {
					this._M=new Excel.ChartGridlines(this.context, _createPropertyObjectPath(this.context, this, "MajorGridlines", false, false, false));
				}
				return this._M;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "minorGridlines", {
			get: function () {
				if (!this._Min) {
					this._Min=new Excel.ChartGridlines(this.context, _createPropertyObjectPath(this.context, this, "MinorGridlines", false, false, false));
				}
				return this._Min;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "title", {
			get: function () {
				if (!this._T) {
					this._T=new Excel.ChartAxisTitle(this.context, _createPropertyObjectPath(this.context, this, "Title", false, false, false));
				}
				return this._T;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxis.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAxis.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAxis.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAxis.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAxis;
	}(OfficeExtension.ClientObject));
	Excel.ChartAxis=ChartAxis;
	var _typeChartAxisFormat="ChartAxisFormat";
	var ChartAxisFormat=(function (_super) {
		__extends(ChartAxisFormat, _super);
		function ChartAxisFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAxisFormat.prototype, "_className", {
			get: function () {
				return "ChartAxisFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["font", "line"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisFormat.prototype, "font", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisFormat.prototype, "line", {
			get: function () {
				if (!this._L) {
					this._L=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false, false));
				}
				return this._L;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAxisFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAxisFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAxisFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAxisFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartAxisFormat=ChartAxisFormat;
	var _typeChartAxisTitle="ChartAxisTitle";
	var ChartAxisTitle=(function (_super) {
		__extends(ChartAxisTitle, _super);
		function ChartAxisTitle() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAxisTitle.prototype, "_className", {
			get: function () {
				return "ChartAxisTitle";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["text", "visible"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartAxisTitleFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisTitle.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAxisTitle.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAxisTitle.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAxisTitle.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAxisTitle;
	}(OfficeExtension.ClientObject));
	Excel.ChartAxisTitle=ChartAxisTitle;
	var _typeChartAxisTitleFormat="ChartAxisTitleFormat";
	var ChartAxisTitleFormat=(function (_super) {
		__extends(ChartAxisTitleFormat, _super);
		function ChartAxisTitleFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartAxisTitleFormat.prototype, "_className", {
			get: function () {
				return "ChartAxisTitleFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitleFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["font"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitleFormat.prototype, "font", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisTitleFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartAxisTitleFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartAxisTitleFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartAxisTitleFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartAxisTitleFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartAxisTitleFormat=ChartAxisTitleFormat;
	var _typeChartDataLabels="ChartDataLabels";
	var ChartDataLabels=(function (_super) {
		__extends(ChartDataLabels, _super);
		function ChartDataLabels() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartDataLabels.prototype, "_className", {
			get: function () {
				return "ChartDataLabels";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["position", "showValue", "showSeriesName", "showCategoryName", "showLegendKey", "showPercentage", "showBubbleSize", "separator"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartDataLabelFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartDataLabels.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartDataLabels.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartDataLabels.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartDataLabels.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartDataLabels;
	}(OfficeExtension.ClientObject));
	Excel.ChartDataLabels=ChartDataLabels;
	var _typeChartDataLabelFormat="ChartDataLabelFormat";
	var ChartDataLabelFormat=(function (_super) {
		__extends(ChartDataLabelFormat, _super);
		function ChartDataLabelFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartDataLabelFormat.prototype, "_className", {
			get: function () {
				return "ChartDataLabelFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabelFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["font", "fill"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabelFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabelFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		ChartDataLabelFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartDataLabelFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartDataLabelFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartDataLabelFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartDataLabelFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartDataLabelFormat=ChartDataLabelFormat;
	var _typeChartGridlines="ChartGridlines";
	var ChartGridlines=(function (_super) {
		__extends(ChartGridlines, _super);
		function ChartGridlines() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartGridlines.prototype, "_className", {
			get: function () {
				return "ChartGridlines";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlines.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["visible"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlines.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlines.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlines.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartGridlinesFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartGridlines.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartGridlines.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartGridlines.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartGridlines.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartGridlines;
	}(OfficeExtension.ClientObject));
	Excel.ChartGridlines=ChartGridlines;
	var _typeChartGridlinesFormat="ChartGridlinesFormat";
	var ChartGridlinesFormat=(function (_super) {
		__extends(ChartGridlinesFormat, _super);
		function ChartGridlinesFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartGridlinesFormat.prototype, "_className", {
			get: function () {
				return "ChartGridlinesFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlinesFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["line"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlinesFormat.prototype, "line", {
			get: function () {
				if (!this._L) {
					this._L=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false, false));
				}
				return this._L;
			},
			enumerable: true,
			configurable: true
		});
		ChartGridlinesFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartGridlinesFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartGridlinesFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartGridlinesFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartGridlinesFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartGridlinesFormat=ChartGridlinesFormat;
	var _typeChartLegend="ChartLegend";
	var ChartLegend=(function (_super) {
		__extends(ChartLegend, _super);
		function ChartLegend() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartLegend.prototype, "_className", {
			get: function () {
				return "ChartLegend";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["visible", "position", "overlay"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartLegendFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartLegend.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartLegend.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartLegend.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartLegend.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartLegend;
	}(OfficeExtension.ClientObject));
	Excel.ChartLegend=ChartLegend;
	var _typeChartLegendFormat="ChartLegendFormat";
	var ChartLegendFormat=(function (_super) {
		__extends(ChartLegendFormat, _super);
		function ChartLegendFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartLegendFormat.prototype, "_className", {
			get: function () {
				return "ChartLegendFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegendFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["font", "fill"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegendFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegendFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		ChartLegendFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartLegendFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartLegendFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartLegendFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartLegendFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartLegendFormat=ChartLegendFormat;
	var _typeChartTitle="ChartTitle";
	var ChartTitle=(function (_super) {
		__extends(ChartTitle, _super);
		function ChartTitle() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartTitle.prototype, "_className", {
			get: function () {
				return "ChartTitle";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["visible", "text", "overlay"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartTitleFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		ChartTitle.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartTitle.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartTitle.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartTitle.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartTitle;
	}(OfficeExtension.ClientObject));
	Excel.ChartTitle=ChartTitle;
	var _typeChartTitleFormat="ChartTitleFormat";
	var ChartTitleFormat=(function (_super) {
		__extends(ChartTitleFormat, _super);
		function ChartTitleFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartTitleFormat.prototype, "_className", {
			get: function () {
				return "ChartTitleFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitleFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["font", "fill"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitleFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitleFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		ChartTitleFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartTitleFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartTitleFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartTitleFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartTitleFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartTitleFormat=ChartTitleFormat;
	var _typeChartFill="ChartFill";
	var ChartFill=(function (_super) {
		__extends(ChartFill, _super);
		function ChartFill() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartFill.prototype, "_className", {
			get: function () {
				return "ChartFill";
			},
			enumerable: true,
			configurable: true
		});
		ChartFill.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		ChartFill.prototype.setSolidColor=function (color) {
			_createMethodAction(this.context, this, "SetSolidColor", 0, [color], false);
		};
		ChartFill.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return ChartFill;
	}(OfficeExtension.ClientObject));
	Excel.ChartFill=ChartFill;
	var _typeChartLineFormat="ChartLineFormat";
	var ChartLineFormat=(function (_super) {
		__extends(ChartLineFormat, _super);
		function ChartLineFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartLineFormat.prototype, "_className", {
			get: function () {
				return "ChartLineFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLineFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["color"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLineFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		ChartLineFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartLineFormat.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		ChartLineFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartLineFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartLineFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartLineFormat;
	}(OfficeExtension.ClientObject));
	Excel.ChartLineFormat=ChartLineFormat;
	var _typeChartFont="ChartFont";
	var ChartFont=(function (_super) {
		__extends(ChartFont, _super);
		function ChartFont() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ChartFont.prototype, "_className", {
			get: function () {
				return "ChartFont";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["bold", "color", "italic", "name", "size", "underline"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ChartFont.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ChartFont.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ChartFont.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ChartFont.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ChartFont;
	}(OfficeExtension.ClientObject));
	Excel.ChartFont=ChartFont;
	var _typeRangeSort="RangeSort";
	var RangeSort=(function (_super) {
		__extends(RangeSort, _super);
		function RangeSort() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(RangeSort.prototype, "_className", {
			get: function () {
				return "RangeSort";
			},
			enumerable: true,
			configurable: true
		});
		RangeSort.prototype.apply=function (fields, matchCase, hasHeaders, orientation, method) {
			_createMethodAction(this.context, this, "Apply", 0, [fields, matchCase, hasHeaders, orientation, method], false);
		};
		RangeSort.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return RangeSort;
	}(OfficeExtension.ClientObject));
	Excel.RangeSort=RangeSort;
	var _typeTableSort="TableSort";
	var TableSort=(function (_super) {
		__extends(TableSort, _super);
		function TableSort() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TableSort.prototype, "_className", {
			get: function () {
				return "TableSort";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableSort.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["matchCase", "method", "fields"];
			},
			enumerable: true,
			configurable: true
		});
		TableSort.prototype.apply=function (fields, matchCase, method) {
			_createMethodAction(this.context, this, "Apply", 0, [fields, matchCase, method], false);
		};
		TableSort.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		TableSort.prototype.reapply=function () {
			_createMethodAction(this.context, this, "Reapply", 0, [], false);
		};
		TableSort.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TableSort.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		TableSort.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return TableSort;
	}(OfficeExtension.ClientObject));
	Excel.TableSort=TableSort;
	var _typeFilter="Filter";
	var Filter=(function (_super) {
		__extends(Filter, _super);
		function Filter() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Filter.prototype, "_className", {
			get: function () {
				return "Filter";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Filter.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["criteria"];
			},
			enumerable: true,
			configurable: true
		});
		Filter.prototype.apply=function (criteria) {
			_createMethodAction(this.context, this, "Apply", 0, [criteria], false);
		};
		Filter.prototype.applyBottomItemsFilter=function (count) {
			_createMethodAction(this.context, this, "ApplyBottomItemsFilter", 0, [count], false);
		};
		Filter.prototype.applyBottomPercentFilter=function (percent) {
			_createMethodAction(this.context, this, "ApplyBottomPercentFilter", 0, [percent], false);
		};
		Filter.prototype.applyCellColorFilter=function (color) {
			_createMethodAction(this.context, this, "ApplyCellColorFilter", 0, [color], false);
		};
		Filter.prototype.applyCustomFilter=function (criteria1, criteria2, oper) {
			_createMethodAction(this.context, this, "ApplyCustomFilter", 0, [criteria1, criteria2, oper], false);
		};
		Filter.prototype.applyDynamicFilter=function (criteria) {
			_createMethodAction(this.context, this, "ApplyDynamicFilter", 0, [criteria], false);
		};
		Filter.prototype.applyFontColorFilter=function (color) {
			_createMethodAction(this.context, this, "ApplyFontColorFilter", 0, [color], false);
		};
		Filter.prototype.applyIconFilter=function (icon) {
			_createMethodAction(this.context, this, "ApplyIconFilter", 0, [icon], false);
		};
		Filter.prototype.applyTopItemsFilter=function (count) {
			_createMethodAction(this.context, this, "ApplyTopItemsFilter", 0, [count], false);
		};
		Filter.prototype.applyTopPercentFilter=function (percent) {
			_createMethodAction(this.context, this, "ApplyTopPercentFilter", 0, [percent], false);
		};
		Filter.prototype.applyValuesFilter=function (values) {
			_createMethodAction(this.context, this, "ApplyValuesFilter", 0, [values], false);
		};
		Filter.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		Filter.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		Filter.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		Filter.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return Filter;
	}(OfficeExtension.ClientObject));
	Excel.Filter=Filter;
	var _typeCustomXmlPartScopedCollection="CustomXmlPartScopedCollection";
	var CustomXmlPartScopedCollection=(function (_super) {
		__extends(CustomXmlPartScopedCollection, _super);
		function CustomXmlPartScopedCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CustomXmlPartScopedCollection.prototype, "_className", {
			get: function () {
				return "CustomXmlPartScopedCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomXmlPartScopedCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomXmlPartScopedCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeCustomXmlPartScopedCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		CustomXmlPartScopedCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		CustomXmlPartScopedCollection.prototype.getItem=function (id) {
			return new Excel.CustomXmlPart(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		CustomXmlPartScopedCollection.prototype.getItemOrNullObject=function (id) {
			return new Excel.CustomXmlPart(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [id], false, false, null, false));
		};
		CustomXmlPartScopedCollection.prototype.getOnlyItem=function () {
			return new Excel.CustomXmlPart(this.context, _createMethodObjectPath(this.context, this, "GetOnlyItem", 1, [], false, false, null, false));
		};
		CustomXmlPartScopedCollection.prototype.getOnlyItemOrNullObject=function () {
			return new Excel.CustomXmlPart(this.context, _createMethodObjectPath(this.context, this, "GetOnlyItemOrNullObject", 1, [], false, false, null, false));
		};
		CustomXmlPartScopedCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CustomXmlPartScopedCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.CustomXmlPart(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return CustomXmlPartScopedCollection;
	}(OfficeExtension.ClientObject));
	Excel.CustomXmlPartScopedCollection=CustomXmlPartScopedCollection;
	var _typeCustomXmlPartCollection="CustomXmlPartCollection";
	var CustomXmlPartCollection=(function (_super) {
		__extends(CustomXmlPartCollection, _super);
		function CustomXmlPartCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CustomXmlPartCollection.prototype, "_className", {
			get: function () {
				return "CustomXmlPartCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomXmlPartCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomXmlPartCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeCustomXmlPartCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		CustomXmlPartCollection.prototype.add=function (xml) {
			return new Excel.CustomXmlPart(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [xml], false, true, null, false));
		};
		CustomXmlPartCollection.prototype.getByNamespace=function (namespaceUri) {
			return new Excel.CustomXmlPartScopedCollection(this.context, _createMethodObjectPath(this.context, this, "GetByNamespace", 1, [namespaceUri], true, false, null, false));
		};
		CustomXmlPartCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		CustomXmlPartCollection.prototype.getItem=function (id) {
			return new Excel.CustomXmlPart(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		CustomXmlPartCollection.prototype.getItemOrNullObject=function (id) {
			return new Excel.CustomXmlPart(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [id], false, false, null, false));
		};
		CustomXmlPartCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CustomXmlPartCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.CustomXmlPart(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return CustomXmlPartCollection;
	}(OfficeExtension.ClientObject));
	Excel.CustomXmlPartCollection=CustomXmlPartCollection;
	var _typeCustomXmlPart="CustomXmlPart";
	var CustomXmlPart=(function (_super) {
		__extends(CustomXmlPart, _super);
		function CustomXmlPart() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CustomXmlPart.prototype, "_className", {
			get: function () {
				return "CustomXmlPart";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomXmlPart.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["id", "namespaceUri"];
			},
			enumerable: true,
			configurable: true
		});
		CustomXmlPart.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		CustomXmlPart.prototype.getXml=function () {
			var action=_createMethodAction(this.context, this, "GetXml", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		CustomXmlPart.prototype.setXml=function (xml) {
			_createMethodAction(this.context, this, "SetXml", 0, [xml], false);
		};
		CustomXmlPart.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CustomXmlPart.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		CustomXmlPart.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		CustomXmlPart.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return CustomXmlPart;
	}(OfficeExtension.ClientObject));
	Excel.CustomXmlPart=CustomXmlPart;
	var _type_V1Api="_V1Api";
	var _V1Api=(function (_super) {
		__extends(_V1Api, _super);
		function _V1Api() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(_V1Api.prototype, "_className", {
			get: function () {
				return "_V1Api";
			},
			enumerable: true,
			configurable: true
		});
		_V1Api.prototype.bindingAddColumns=function (input) {
			var action=_createMethodAction(this.context, this, "BindingAddColumns", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingAddFromNamedItem=function (input) {
			var action=_createMethodAction(this.context, this, "BindingAddFromNamedItem", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingAddFromPrompt=function (input) {
			var action=_createMethodAction(this.context, this, "BindingAddFromPrompt", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingAddFromSelection=function (input) {
			var action=_createMethodAction(this.context, this, "BindingAddFromSelection", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingAddRows=function (input) {
			var action=_createMethodAction(this.context, this, "BindingAddRows", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingClearFormats=function (input) {
			var action=_createMethodAction(this.context, this, "BindingClearFormats", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingDeleteAllDataValues=function (input) {
			var action=_createMethodAction(this.context, this, "BindingDeleteAllDataValues", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingGetAll=function () {
			var action=_createMethodAction(this.context, this, "BindingGetAll", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingGetById=function (input) {
			var action=_createMethodAction(this.context, this, "BindingGetById", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingGetData=function (input) {
			var action=_createMethodAction(this.context, this, "BindingGetData", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingReleaseById=function (input) {
			var action=_createMethodAction(this.context, this, "BindingReleaseById", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingSetData=function (input) {
			var action=_createMethodAction(this.context, this, "BindingSetData", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingSetFormats=function (input) {
			var action=_createMethodAction(this.context, this, "BindingSetFormats", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.bindingSetTableOptions=function (input) {
			var action=_createMethodAction(this.context, this, "BindingSetTableOptions", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.getFilePropertiesAsync=function () {
			_throwIfApiNotSupported("_V1Api.getFilePropertiesAsync", _defaultApiSetName, "1.6", _hostName);
			var action=_createMethodAction(this.context, this, "GetFilePropertiesAsync", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.getSelectedData=function (input) {
			var action=_createMethodAction(this.context, this, "GetSelectedData", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.gotoById=function (input) {
			var action=_createMethodAction(this.context, this, "GotoById", 1, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype.setSelectedData=function (input) {
			var action=_createMethodAction(this.context, this, "SetSelectedData", 0, [input], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		_V1Api.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return _V1Api;
	}(OfficeExtension.ClientObject));
	Excel._V1Api=_V1Api;
	var _typePivotTableCollection="PivotTableCollection";
	var PivotTableCollection=(function (_super) {
		__extends(PivotTableCollection, _super);
		function PivotTableCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(PivotTableCollection.prototype, "_className", {
			get: function () {
				return "PivotTableCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTableCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTableCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typePivotTableCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		PivotTableCollection.prototype.getCount=function () {
			_throwIfApiNotSupported("PivotTableCollection.getCount", _defaultApiSetName, "1.4", _hostName);
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		PivotTableCollection.prototype.getItem=function (name) {
			return new Excel.PivotTable(this.context, _createIndexerObjectPath(this.context, this, [name]));
		};
		PivotTableCollection.prototype.getItemOrNullObject=function (name) {
			_throwIfApiNotSupported("PivotTableCollection.getItemOrNullObject", _defaultApiSetName, "1.4", _hostName);
			return new Excel.PivotTable(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [name], false, false, null, false));
		};
		PivotTableCollection.prototype.refreshAll=function () {
			_createMethodAction(this.context, this, "RefreshAll", 0, [], false);
		};
		PivotTableCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		PivotTableCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.PivotTable(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return PivotTableCollection;
	}(OfficeExtension.ClientObject));
	Excel.PivotTableCollection=PivotTableCollection;
	var _typePivotTable="PivotTable";
	var PivotTable=(function (_super) {
		__extends(PivotTable, _super);
		function PivotTable() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(PivotTable.prototype, "_className", {
			get: function () {
				return "PivotTable";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTable.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["name", "id"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTable.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, false];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTable.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["worksheet"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PivotTable.prototype, "worksheet", {
			get: function () {
				if (!this._W) {
					this._W=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false, false));
				}
				return this._W;
			},
			enumerable: true,
			configurable: true
		});
		PivotTable.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		PivotTable.prototype.refresh=function () {
			_createMethodAction(this.context, this, "Refresh", 0, [], false);
		};
		PivotTable.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		PivotTable.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._I=value["Id"];
			}
		};
		PivotTable.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		PivotTable.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return PivotTable;
	}(OfficeExtension.ClientObject));
	Excel.PivotTable=PivotTable;
	var _typeConditionalFormatCollection="ConditionalFormatCollection";
	var ConditionalFormatCollection=(function (_super) {
		__extends(ConditionalFormatCollection, _super);
		function ConditionalFormatCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalFormatCollection.prototype, "_className", {
			get: function () {
				return "ConditionalFormatCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormatCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormatCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeConditionalFormatCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		ConditionalFormatCollection.prototype.add=function (type) {
			return new Excel.ConditionalFormat(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [type], false, true, null, false));
		};
		ConditionalFormatCollection.prototype.clearAll=function () {
			_createMethodAction(this.context, this, "ClearAll", 0, [], false);
		};
		ConditionalFormatCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, [], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ConditionalFormatCollection.prototype.getItem=function (id) {
			return new Excel.ConditionalFormat(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		ConditionalFormatCollection.prototype.getItemAt=function (index) {
			return new Excel.ConditionalFormat(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		ConditionalFormatCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalFormatCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.ConditionalFormat(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return ConditionalFormatCollection;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalFormatCollection=ConditionalFormatCollection;
	var _typeConditionalFormat="ConditionalFormat";
	var ConditionalFormat=(function (_super) {
		__extends(ConditionalFormat, _super);
		function ConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalFormat.prototype, "_className", {
			get: function () {
				return "ConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["stopIfTrue", "priority", "type", "id"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, false, false];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["dataBarOrNullObject", "dataBar", "customOrNullObject", "custom", "iconSet", "iconSetOrNullObject", "colorScale", "colorScaleOrNullObject", "topBottom", "topBottomOrNullObject", "preset", "presetOrNullObject", "textComparison", "textComparisonOrNullObject", "cellValue", "cellValueOrNullObject"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "cellValue", {
			get: function () {
				if (!this._C) {
					this._C=new Excel.CellValueConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "CellValue", false, false, false));
				}
				return this._C;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "cellValueOrNullObject", {
			get: function () {
				if (!this._Ce) {
					this._Ce=new Excel.CellValueConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "CellValueOrNullObject", false, false, false));
				}
				return this._Ce;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "colorScale", {
			get: function () {
				if (!this._Co) {
					this._Co=new Excel.ColorScaleConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "ColorScale", false, false, false));
				}
				return this._Co;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "colorScaleOrNullObject", {
			get: function () {
				if (!this._Col) {
					this._Col=new Excel.ColorScaleConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "ColorScaleOrNullObject", false, false, false));
				}
				return this._Col;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "custom", {
			get: function () {
				if (!this._Cu) {
					this._Cu=new Excel.CustomConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "Custom", false, false, false));
				}
				return this._Cu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "customOrNullObject", {
			get: function () {
				if (!this._Cus) {
					this._Cus=new Excel.CustomConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "CustomOrNullObject", false, false, false));
				}
				return this._Cus;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "dataBar", {
			get: function () {
				if (!this._D) {
					this._D=new Excel.DataBarConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "DataBar", false, false, false));
				}
				return this._D;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "dataBarOrNullObject", {
			get: function () {
				if (!this._Da) {
					this._Da=new Excel.DataBarConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "DataBarOrNullObject", false, false, false));
				}
				return this._Da;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "iconSet", {
			get: function () {
				if (!this._I) {
					this._I=new Excel.IconSetConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "IconSet", false, false, false));
				}
				return this._I;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "iconSetOrNullObject", {
			get: function () {
				if (!this._Ic) {
					this._Ic=new Excel.IconSetConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "IconSetOrNullObject", false, false, false));
				}
				return this._Ic;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "preset", {
			get: function () {
				if (!this._P) {
					this._P=new Excel.PresetCriteriaConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "Preset", false, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "presetOrNullObject", {
			get: function () {
				if (!this._Pr) {
					this._Pr=new Excel.PresetCriteriaConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "PresetOrNullObject", false, false, false));
				}
				return this._Pr;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "textComparison", {
			get: function () {
				if (!this._T) {
					this._T=new Excel.TextConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "TextComparison", false, false, false));
				}
				return this._T;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "textComparisonOrNullObject", {
			get: function () {
				if (!this._Te) {
					this._Te=new Excel.TextConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "TextComparisonOrNullObject", false, false, false));
				}
				return this._Te;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "topBottom", {
			get: function () {
				if (!this._To) {
					this._To=new Excel.TopBottomConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "TopBottom", false, false, false));
				}
				return this._To;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormat.prototype, "topBottomOrNullObject", {
			get: function () {
				if (!this._Top) {
					this._Top=new Excel.TopBottomConditionalFormat(this.context, _createPropertyObjectPath(this.context, this, "TopBottomOrNullObject", false, false, false));
				}
				return this._Top;
			},
			enumerable: true,
			configurable: true
		});
		ConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalFormat.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, [], false);
		};
		ConditionalFormat.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [], false, true, null, false));
		};
		ConditionalFormat.prototype.getRangeOrNullObject=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRangeOrNullObject", 1, [], false, true, null, false));
		};
		ConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalFormat.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["Id"])) {
				this._Id0=value["Id"];
			}
		};
		ConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalFormat=ConditionalFormat;
	var _typeDataBarConditionalFormat="DataBarConditionalFormat";
	var DataBarConditionalFormat=(function (_super) {
		__extends(DataBarConditionalFormat, _super);
		function DataBarConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(DataBarConditionalFormat.prototype, "_className", {
			get: function () {
				return "DataBarConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DataBarConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["showDataBarOnly", "barDirection", "axisFormat", "axisColor", "lowerBoundRule", "upperBoundRule"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DataBarConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DataBarConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["positiveFormat", "negativeFormat"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DataBarConditionalFormat.prototype, "negativeFormat", {
			get: function () {
				if (!this._N) {
					this._N=new Excel.ConditionalDataBarNegativeFormat(this.context, _createPropertyObjectPath(this.context, this, "NegativeFormat", false, false, false));
				}
				return this._N;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DataBarConditionalFormat.prototype, "positiveFormat", {
			get: function () {
				if (!this._P) {
					this._P=new Excel.ConditionalDataBarPositiveFormat(this.context, _createPropertyObjectPath(this.context, this, "PositiveFormat", false, false, false));
				}
				return this._P;
			},
			enumerable: true,
			configurable: true
		});
		DataBarConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		DataBarConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		DataBarConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		DataBarConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return DataBarConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.DataBarConditionalFormat=DataBarConditionalFormat;
	var _typeConditionalDataBarPositiveFormat="ConditionalDataBarPositiveFormat";
	var ConditionalDataBarPositiveFormat=(function (_super) {
		__extends(ConditionalDataBarPositiveFormat, _super);
		function ConditionalDataBarPositiveFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalDataBarPositiveFormat.prototype, "_className", {
			get: function () {
				return "ConditionalDataBarPositiveFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalDataBarPositiveFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["fillColor", "gradientFill", "borderColor"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalDataBarPositiveFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalDataBarPositiveFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalDataBarPositiveFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalDataBarPositiveFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalDataBarPositiveFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalDataBarPositiveFormat;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalDataBarPositiveFormat=ConditionalDataBarPositiveFormat;
	var _typeConditionalDataBarNegativeFormat="ConditionalDataBarNegativeFormat";
	var ConditionalDataBarNegativeFormat=(function (_super) {
		__extends(ConditionalDataBarNegativeFormat, _super);
		function ConditionalDataBarNegativeFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalDataBarNegativeFormat.prototype, "_className", {
			get: function () {
				return "ConditionalDataBarNegativeFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalDataBarNegativeFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["fillColor", "matchPositiveFillColor", "borderColor", "matchPositiveBorderColor"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalDataBarNegativeFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalDataBarNegativeFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalDataBarNegativeFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalDataBarNegativeFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalDataBarNegativeFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalDataBarNegativeFormat;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalDataBarNegativeFormat=ConditionalDataBarNegativeFormat;
	var _typeCustomConditionalFormat="CustomConditionalFormat";
	var CustomConditionalFormat=(function (_super) {
		__extends(CustomConditionalFormat, _super);
		function CustomConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CustomConditionalFormat.prototype, "_className", {
			get: function () {
				return "CustomConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["rule", "format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomConditionalFormat.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomConditionalFormat.prototype, "rule", {
			get: function () {
				if (!this._R) {
					this._R=new Excel.ConditionalFormatRule(this.context, _createPropertyObjectPath(this.context, this, "Rule", false, false, false));
				}
				return this._R;
			},
			enumerable: true,
			configurable: true
		});
		CustomConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		CustomConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CustomConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		CustomConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return CustomConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.CustomConditionalFormat=CustomConditionalFormat;
	var _typeConditionalFormatRule="ConditionalFormatRule";
	var ConditionalFormatRule=(function (_super) {
		__extends(ConditionalFormatRule, _super);
		function ConditionalFormatRule() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalFormatRule.prototype, "_className", {
			get: function () {
				return "ConditionalFormatRule";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormatRule.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["formula", "formulaLocal", "formulaR1C1"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalFormatRule.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalFormatRule.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalFormatRule.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalFormatRule.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalFormatRule.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalFormatRule;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalFormatRule=ConditionalFormatRule;
	var _typeIconSetConditionalFormat="IconSetConditionalFormat";
	var IconSetConditionalFormat=(function (_super) {
		__extends(IconSetConditionalFormat, _super);
		function IconSetConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(IconSetConditionalFormat.prototype, "_className", {
			get: function () {
				return "IconSetConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(IconSetConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["reverseIconOrder", "showIconOnly", "style", "criteria"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(IconSetConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		IconSetConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		IconSetConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		IconSetConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		IconSetConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return IconSetConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.IconSetConditionalFormat=IconSetConditionalFormat;
	var _typeColorScaleConditionalFormat="ColorScaleConditionalFormat";
	var ColorScaleConditionalFormat=(function (_super) {
		__extends(ColorScaleConditionalFormat, _super);
		function ColorScaleConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ColorScaleConditionalFormat.prototype, "_className", {
			get: function () {
				return "ColorScaleConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ColorScaleConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["threeColorScale", "criteria"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ColorScaleConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true];
			},
			enumerable: true,
			configurable: true
		});
		ColorScaleConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ColorScaleConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ColorScaleConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ColorScaleConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ColorScaleConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.ColorScaleConditionalFormat=ColorScaleConditionalFormat;
	var _typeTopBottomConditionalFormat="TopBottomConditionalFormat";
	var TopBottomConditionalFormat=(function (_super) {
		__extends(TopBottomConditionalFormat, _super);
		function TopBottomConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TopBottomConditionalFormat.prototype, "_className", {
			get: function () {
				return "TopBottomConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TopBottomConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["rule"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TopBottomConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TopBottomConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TopBottomConditionalFormat.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		TopBottomConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		TopBottomConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TopBottomConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		TopBottomConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return TopBottomConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.TopBottomConditionalFormat=TopBottomConditionalFormat;
	var _typePresetCriteriaConditionalFormat="PresetCriteriaConditionalFormat";
	var PresetCriteriaConditionalFormat=(function (_super) {
		__extends(PresetCriteriaConditionalFormat, _super);
		function PresetCriteriaConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(PresetCriteriaConditionalFormat.prototype, "_className", {
			get: function () {
				return "PresetCriteriaConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PresetCriteriaConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["rule"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PresetCriteriaConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PresetCriteriaConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(PresetCriteriaConditionalFormat.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		PresetCriteriaConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		PresetCriteriaConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		PresetCriteriaConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		PresetCriteriaConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return PresetCriteriaConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.PresetCriteriaConditionalFormat=PresetCriteriaConditionalFormat;
	var _typeTextConditionalFormat="TextConditionalFormat";
	var TextConditionalFormat=(function (_super) {
		__extends(TextConditionalFormat, _super);
		function TextConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(TextConditionalFormat.prototype, "_className", {
			get: function () {
				return "TextConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TextConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["rule"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TextConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TextConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TextConditionalFormat.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		TextConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		TextConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		TextConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		TextConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return TextConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.TextConditionalFormat=TextConditionalFormat;
	var _typeCellValueConditionalFormat="CellValueConditionalFormat";
	var CellValueConditionalFormat=(function (_super) {
		__extends(CellValueConditionalFormat, _super);
		function CellValueConditionalFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(CellValueConditionalFormat.prototype, "_className", {
			get: function () {
				return "CellValueConditionalFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CellValueConditionalFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["rule"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CellValueConditionalFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CellValueConditionalFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["format"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CellValueConditionalFormat.prototype, "format", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		CellValueConditionalFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		CellValueConditionalFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		CellValueConditionalFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		CellValueConditionalFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return CellValueConditionalFormat;
	}(OfficeExtension.ClientObject));
	Excel.CellValueConditionalFormat=CellValueConditionalFormat;
	var _typeConditionalRangeFormat="ConditionalRangeFormat";
	var ConditionalRangeFormat=(function (_super) {
		__extends(ConditionalRangeFormat, _super);
		function ConditionalRangeFormat() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalRangeFormat.prototype, "_className", {
			get: function () {
				return "ConditionalRangeFormat";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["numberFormat"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["fill", "font", "borders"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "borders", {
			get: function () {
				if (!this._B) {
					this._B=new Excel.ConditionalRangeBorderCollection(this.context, _createPropertyObjectPath(this.context, this, "Borders", true, false, false));
				}
				return this._B;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "fill", {
			get: function () {
				if (!this._F) {
					this._F=new Excel.ConditionalRangeFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false, false));
				}
				return this._F;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFormat.prototype, "font", {
			get: function () {
				if (!this._Fo) {
					this._Fo=new Excel.ConditionalRangeFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false, false));
				}
				return this._Fo;
			},
			enumerable: true,
			configurable: true
		});
		ConditionalRangeFormat.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalRangeFormat.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalRangeFormat.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalRangeFormat.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalRangeFormat;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalRangeFormat=ConditionalRangeFormat;
	var _typeConditionalRangeFont="ConditionalRangeFont";
	var ConditionalRangeFont=(function (_super) {
		__extends(ConditionalRangeFont, _super);
		function ConditionalRangeFont() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalRangeFont.prototype, "_className", {
			get: function () {
				return "ConditionalRangeFont";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFont.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["color", "italic", "bold", "underline", "strikethrough"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFont.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true, true, true, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalRangeFont.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalRangeFont.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		ConditionalRangeFont.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalRangeFont.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalRangeFont.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalRangeFont;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalRangeFont=ConditionalRangeFont;
	var _typeConditionalRangeFill="ConditionalRangeFill";
	var ConditionalRangeFill=(function (_super) {
		__extends(ConditionalRangeFill, _super);
		function ConditionalRangeFill() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalRangeFill.prototype, "_className", {
			get: function () {
				return "ConditionalRangeFill";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFill.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["color"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeFill.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalRangeFill.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalRangeFill.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, [], false);
		};
		ConditionalRangeFill.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalRangeFill.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalRangeFill.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalRangeFill;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalRangeFill=ConditionalRangeFill;
	var _typeConditionalRangeBorder="ConditionalRangeBorder";
	var ConditionalRangeBorder=(function (_super) {
		__extends(ConditionalRangeBorder, _super);
		function ConditionalRangeBorder() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalRangeBorder.prototype, "_className", {
			get: function () {
				return "ConditionalRangeBorder";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorder.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["sideIndex", "style", "color"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorder.prototype, "_scalarPropertyUpdateable", {
			get: function () {
				return [false, true, true];
			},
			enumerable: true,
			configurable: true
		});
		ConditionalRangeBorder.prototype.update=function (properties) {
			this._recursivelyUpdate(properties);
		};
		ConditionalRangeBorder.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalRangeBorder.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		ConditionalRangeBorder.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return ConditionalRangeBorder;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalRangeBorder=ConditionalRangeBorder;
	var _typeConditionalRangeBorderCollection="ConditionalRangeBorderCollection";
	var ConditionalRangeBorderCollection=(function (_super) {
		__extends(ConditionalRangeBorderCollection, _super);
		function ConditionalRangeBorderCollection() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "_className", {
			get: function () {
				return "ConditionalRangeBorderCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "_isCollection", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["count"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "_navigationPropertyNames", {
			get: function () {
				return ["top", "bottom", "left", "right"];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "bottom", {
			get: function () {
				if (!this._B) {
					this._B=new Excel.ConditionalRangeBorder(this.context, _createPropertyObjectPath(this.context, this, "Bottom", false, false, false));
				}
				return this._B;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "left", {
			get: function () {
				if (!this._L) {
					this._L=new Excel.ConditionalRangeBorder(this.context, _createPropertyObjectPath(this.context, this, "Left", false, false, false));
				}
				return this._L;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "right", {
			get: function () {
				if (!this._R) {
					this._R=new Excel.ConditionalRangeBorder(this.context, _createPropertyObjectPath(this.context, this, "Right", false, false, false));
				}
				return this._R;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "top", {
			get: function () {
				if (!this._T) {
					this._T=new Excel.ConditionalRangeBorder(this.context, _createPropertyObjectPath(this.context, this, "Top", false, false, false));
				}
				return this._T;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ConditionalRangeBorderCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, _typeConditionalRangeBorderCollection, this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		ConditionalRangeBorderCollection.prototype.getItem=function (index) {
			return new Excel.ConditionalRangeBorder(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		ConditionalRangeBorderCollection.prototype.getItemAt=function (index) {
			return new Excel.ConditionalRangeBorder(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1, [index], false, false, null, false));
		};
		ConditionalRangeBorderCollection.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		ConditionalRangeBorderCollection.prototype._handleRetrieveResult=function (value, result) {
			var _this=this;
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result, function (childItemData, index) { return new Excel.ConditionalRangeBorder(_this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, _this.context, _this, childItemData, index)); });
		};
		return ConditionalRangeBorderCollection;
	}(OfficeExtension.ClientObject));
	Excel.ConditionalRangeBorderCollection=ConditionalRangeBorderCollection;
	var _typeInternalTest="InternalTest";
	var InternalTest=(function (_super) {
		__extends(InternalTest, _super);
		function InternalTest() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(InternalTest.prototype, "_className", {
			get: function () {
				return "InternalTest";
			},
			enumerable: true,
			configurable: true
		});
		InternalTest.prototype.delay=function (seconds) {
			var action=_createMethodAction(this.context, this, "Delay", 0, [seconds], false);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		InternalTest.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return InternalTest;
	}(OfficeExtension.ClientObject));
	Excel.InternalTest=InternalTest;
	var BindingType;
	(function (BindingType) {
		BindingType.range="Range";
		BindingType.table="Table";
		BindingType.text="Text";
	})(BindingType=Excel.BindingType || (Excel.BindingType={}));
	var BorderIndex;
	(function (BorderIndex) {
		BorderIndex.edgeTop="EdgeTop";
		BorderIndex.edgeBottom="EdgeBottom";
		BorderIndex.edgeLeft="EdgeLeft";
		BorderIndex.edgeRight="EdgeRight";
		BorderIndex.insideVertical="InsideVertical";
		BorderIndex.insideHorizontal="InsideHorizontal";
		BorderIndex.diagonalDown="DiagonalDown";
		BorderIndex.diagonalUp="DiagonalUp";
	})(BorderIndex=Excel.BorderIndex || (Excel.BorderIndex={}));
	var BorderLineStyle;
	(function (BorderLineStyle) {
		BorderLineStyle.none="None";
		BorderLineStyle.continuous="Continuous";
		BorderLineStyle.dash="Dash";
		BorderLineStyle.dashDot="DashDot";
		BorderLineStyle.dashDotDot="DashDotDot";
		BorderLineStyle.dot="Dot";
		BorderLineStyle.double="Double";
		BorderLineStyle.slantDashDot="SlantDashDot";
	})(BorderLineStyle=Excel.BorderLineStyle || (Excel.BorderLineStyle={}));
	var BorderWeight;
	(function (BorderWeight) {
		BorderWeight.hairline="Hairline";
		BorderWeight.thin="Thin";
		BorderWeight.medium="Medium";
		BorderWeight.thick="Thick";
	})(BorderWeight=Excel.BorderWeight || (Excel.BorderWeight={}));
	var CalculationMode;
	(function (CalculationMode) {
		CalculationMode.automatic="Automatic";
		CalculationMode.automaticExceptTables="AutomaticExceptTables";
		CalculationMode.manual="Manual";
	})(CalculationMode=Excel.CalculationMode || (Excel.CalculationMode={}));
	var CalculationType;
	(function (CalculationType) {
		CalculationType.recalculate="Recalculate";
		CalculationType.full="Full";
		CalculationType.fullRebuild="FullRebuild";
	})(CalculationType=Excel.CalculationType || (Excel.CalculationType={}));
	var ClearApplyTo;
	(function (ClearApplyTo) {
		ClearApplyTo.all="All";
		ClearApplyTo.formats="Formats";
		ClearApplyTo.contents="Contents";
		ClearApplyTo.hyperlinks="Hyperlinks";
		ClearApplyTo.removeHyperlinks="RemoveHyperlinks";
	})(ClearApplyTo=Excel.ClearApplyTo || (Excel.ClearApplyTo={}));
	var ChartDataLabelPosition;
	(function (ChartDataLabelPosition) {
		ChartDataLabelPosition.invalid="Invalid";
		ChartDataLabelPosition.none="None";
		ChartDataLabelPosition.center="Center";
		ChartDataLabelPosition.insideEnd="InsideEnd";
		ChartDataLabelPosition.insideBase="InsideBase";
		ChartDataLabelPosition.outsideEnd="OutsideEnd";
		ChartDataLabelPosition.left="Left";
		ChartDataLabelPosition.right="Right";
		ChartDataLabelPosition.top="Top";
		ChartDataLabelPosition.bottom="Bottom";
		ChartDataLabelPosition.bestFit="BestFit";
		ChartDataLabelPosition.callout="Callout";
	})(ChartDataLabelPosition=Excel.ChartDataLabelPosition || (Excel.ChartDataLabelPosition={}));
	var ChartLegendPosition;
	(function (ChartLegendPosition) {
		ChartLegendPosition.invalid="Invalid";
		ChartLegendPosition.top="Top";
		ChartLegendPosition.bottom="Bottom";
		ChartLegendPosition.left="Left";
		ChartLegendPosition.right="Right";
		ChartLegendPosition.corner="Corner";
		ChartLegendPosition.custom="Custom";
	})(ChartLegendPosition=Excel.ChartLegendPosition || (Excel.ChartLegendPosition={}));
	var ChartSeriesBy;
	(function (ChartSeriesBy) {
		ChartSeriesBy.auto="Auto";
		ChartSeriesBy.columns="Columns";
		ChartSeriesBy.rows="Rows";
	})(ChartSeriesBy=Excel.ChartSeriesBy || (Excel.ChartSeriesBy={}));
	var ChartType;
	(function (ChartType) {
		ChartType.invalid="Invalid";
		ChartType.columnClustered="ColumnClustered";
		ChartType.columnStacked="ColumnStacked";
		ChartType.columnStacked100="ColumnStacked100";
		ChartType._3DColumnClustered="3DColumnClustered";
		ChartType._3DColumnStacked="3DColumnStacked";
		ChartType._3DColumnStacked100="3DColumnStacked100";
		ChartType.barClustered="BarClustered";
		ChartType.barStacked="BarStacked";
		ChartType.barStacked100="BarStacked100";
		ChartType._3DBarClustered="3DBarClustered";
		ChartType._3DBarStacked="3DBarStacked";
		ChartType._3DBarStacked100="3DBarStacked100";
		ChartType.lineStacked="LineStacked";
		ChartType.lineStacked100="LineStacked100";
		ChartType.lineMarkers="LineMarkers";
		ChartType.lineMarkersStacked="LineMarkersStacked";
		ChartType.lineMarkersStacked100="LineMarkersStacked100";
		ChartType.pieOfPie="PieOfPie";
		ChartType.pieExploded="PieExploded";
		ChartType._3DPieExploded="3DPieExploded";
		ChartType.barOfPie="BarOfPie";
		ChartType.xyscatterSmooth="XYScatterSmooth";
		ChartType.xyscatterSmoothNoMarkers="XYScatterSmoothNoMarkers";
		ChartType.xyscatterLines="XYScatterLines";
		ChartType.xyscatterLinesNoMarkers="XYScatterLinesNoMarkers";
		ChartType.areaStacked="AreaStacked";
		ChartType.areaStacked100="AreaStacked100";
		ChartType._3DAreaStacked="3DAreaStacked";
		ChartType._3DAreaStacked100="3DAreaStacked100";
		ChartType.doughnutExploded="DoughnutExploded";
		ChartType.radarMarkers="RadarMarkers";
		ChartType.radarFilled="RadarFilled";
		ChartType.surface="Surface";
		ChartType.surfaceWireframe="SurfaceWireframe";
		ChartType.surfaceTopView="SurfaceTopView";
		ChartType.surfaceTopViewWireframe="SurfaceTopViewWireframe";
		ChartType.bubble="Bubble";
		ChartType.bubble3DEffect="Bubble3DEffect";
		ChartType.stockHLC="StockHLC";
		ChartType.stockOHLC="StockOHLC";
		ChartType.stockVHLC="StockVHLC";
		ChartType.stockVOHLC="StockVOHLC";
		ChartType.cylinderColClustered="CylinderColClustered";
		ChartType.cylinderColStacked="CylinderColStacked";
		ChartType.cylinderColStacked100="CylinderColStacked100";
		ChartType.cylinderBarClustered="CylinderBarClustered";
		ChartType.cylinderBarStacked="CylinderBarStacked";
		ChartType.cylinderBarStacked100="CylinderBarStacked100";
		ChartType.cylinderCol="CylinderCol";
		ChartType.coneColClustered="ConeColClustered";
		ChartType.coneColStacked="ConeColStacked";
		ChartType.coneColStacked100="ConeColStacked100";
		ChartType.coneBarClustered="ConeBarClustered";
		ChartType.coneBarStacked="ConeBarStacked";
		ChartType.coneBarStacked100="ConeBarStacked100";
		ChartType.coneCol="ConeCol";
		ChartType.pyramidColClustered="PyramidColClustered";
		ChartType.pyramidColStacked="PyramidColStacked";
		ChartType.pyramidColStacked100="PyramidColStacked100";
		ChartType.pyramidBarClustered="PyramidBarClustered";
		ChartType.pyramidBarStacked="PyramidBarStacked";
		ChartType.pyramidBarStacked100="PyramidBarStacked100";
		ChartType.pyramidCol="PyramidCol";
		ChartType._3DColumn="3DColumn";
		ChartType.line="Line";
		ChartType._3DLine="3DLine";
		ChartType._3DPie="3DPie";
		ChartType.pie="Pie";
		ChartType.xyscatter="XYScatter";
		ChartType._3DArea="3DArea";
		ChartType.area="Area";
		ChartType.doughnut="Doughnut";
		ChartType.radar="Radar";
	})(ChartType=Excel.ChartType || (Excel.ChartType={}));
	var ChartUnderlineStyle;
	(function (ChartUnderlineStyle) {
		ChartUnderlineStyle.none="None";
		ChartUnderlineStyle.single="Single";
	})(ChartUnderlineStyle=Excel.ChartUnderlineStyle || (Excel.ChartUnderlineStyle={}));
	var ConditionalDataBarAxisFormat;
	(function (ConditionalDataBarAxisFormat) {
		ConditionalDataBarAxisFormat.automatic="Automatic";
		ConditionalDataBarAxisFormat.none="None";
		ConditionalDataBarAxisFormat.cellMidPoint="CellMidPoint";
	})(ConditionalDataBarAxisFormat=Excel.ConditionalDataBarAxisFormat || (Excel.ConditionalDataBarAxisFormat={}));
	var ConditionalDataBarDirection;
	(function (ConditionalDataBarDirection) {
		ConditionalDataBarDirection.context="Context";
		ConditionalDataBarDirection.leftToRight="LeftToRight";
		ConditionalDataBarDirection.rightToLeft="RightToLeft";
	})(ConditionalDataBarDirection=Excel.ConditionalDataBarDirection || (Excel.ConditionalDataBarDirection={}));
	var ConditionalFormatDirection;
	(function (ConditionalFormatDirection) {
		ConditionalFormatDirection.top="Top";
		ConditionalFormatDirection.bottom="Bottom";
	})(ConditionalFormatDirection=Excel.ConditionalFormatDirection || (Excel.ConditionalFormatDirection={}));
	var ConditionalFormatType;
	(function (ConditionalFormatType) {
		ConditionalFormatType.custom="Custom";
		ConditionalFormatType.dataBar="DataBar";
		ConditionalFormatType.colorScale="ColorScale";
		ConditionalFormatType.iconSet="IconSet";
		ConditionalFormatType.topBottom="TopBottom";
		ConditionalFormatType.presetCriteria="PresetCriteria";
		ConditionalFormatType.containsText="ContainsText";
		ConditionalFormatType.cellValue="CellValue";
	})(ConditionalFormatType=Excel.ConditionalFormatType || (Excel.ConditionalFormatType={}));
	var ConditionalFormatRuleType;
	(function (ConditionalFormatRuleType) {
		ConditionalFormatRuleType.invalid="Invalid";
		ConditionalFormatRuleType.automatic="Automatic";
		ConditionalFormatRuleType.lowestValue="LowestValue";
		ConditionalFormatRuleType.highestValue="HighestValue";
		ConditionalFormatRuleType.number="Number";
		ConditionalFormatRuleType.percent="Percent";
		ConditionalFormatRuleType.formula="Formula";
		ConditionalFormatRuleType.percentile="Percentile";
	})(ConditionalFormatRuleType=Excel.ConditionalFormatRuleType || (Excel.ConditionalFormatRuleType={}));
	var ConditionalFormatIconRuleType;
	(function (ConditionalFormatIconRuleType) {
		ConditionalFormatIconRuleType.invalid="Invalid";
		ConditionalFormatIconRuleType.number="Number";
		ConditionalFormatIconRuleType.percent="Percent";
		ConditionalFormatIconRuleType.formula="Formula";
		ConditionalFormatIconRuleType.percentile="Percentile";
	})(ConditionalFormatIconRuleType=Excel.ConditionalFormatIconRuleType || (Excel.ConditionalFormatIconRuleType={}));
	var ConditionalFormatColorCriterionType;
	(function (ConditionalFormatColorCriterionType) {
		ConditionalFormatColorCriterionType.invalid="Invalid";
		ConditionalFormatColorCriterionType.lowestValue="LowestValue";
		ConditionalFormatColorCriterionType.highestValue="HighestValue";
		ConditionalFormatColorCriterionType.number="Number";
		ConditionalFormatColorCriterionType.percent="Percent";
		ConditionalFormatColorCriterionType.formula="Formula";
		ConditionalFormatColorCriterionType.percentile="Percentile";
	})(ConditionalFormatColorCriterionType=Excel.ConditionalFormatColorCriterionType || (Excel.ConditionalFormatColorCriterionType={}));
	var ConditionalTopBottomCriterionType;
	(function (ConditionalTopBottomCriterionType) {
		ConditionalTopBottomCriterionType.invalid="Invalid";
		ConditionalTopBottomCriterionType.topItems="TopItems";
		ConditionalTopBottomCriterionType.topPercent="TopPercent";
		ConditionalTopBottomCriterionType.bottomItems="BottomItems";
		ConditionalTopBottomCriterionType.bottomPercent="BottomPercent";
	})(ConditionalTopBottomCriterionType=Excel.ConditionalTopBottomCriterionType || (Excel.ConditionalTopBottomCriterionType={}));
	var ConditionalFormatPresetCriterion;
	(function (ConditionalFormatPresetCriterion) {
		ConditionalFormatPresetCriterion.invalid="Invalid";
		ConditionalFormatPresetCriterion.blanks="Blanks";
		ConditionalFormatPresetCriterion.nonBlanks="NonBlanks";
		ConditionalFormatPresetCriterion.errors="Errors";
		ConditionalFormatPresetCriterion.nonErrors="NonErrors";
		ConditionalFormatPresetCriterion.yesterday="Yesterday";
		ConditionalFormatPresetCriterion.today="Today";
		ConditionalFormatPresetCriterion.tomorrow="Tomorrow";
		ConditionalFormatPresetCriterion.lastSevenDays="LastSevenDays";
		ConditionalFormatPresetCriterion.lastWeek="LastWeek";
		ConditionalFormatPresetCriterion.thisWeek="ThisWeek";
		ConditionalFormatPresetCriterion.nextWeek="NextWeek";
		ConditionalFormatPresetCriterion.lastMonth="LastMonth";
		ConditionalFormatPresetCriterion.thisMonth="ThisMonth";
		ConditionalFormatPresetCriterion.nextMonth="NextMonth";
		ConditionalFormatPresetCriterion.aboveAverage="AboveAverage";
		ConditionalFormatPresetCriterion.belowAverage="BelowAverage";
		ConditionalFormatPresetCriterion.equalOrAboveAverage="EqualOrAboveAverage";
		ConditionalFormatPresetCriterion.equalOrBelowAverage="EqualOrBelowAverage";
		ConditionalFormatPresetCriterion.oneStdDevAboveAverage="OneStdDevAboveAverage";
		ConditionalFormatPresetCriterion.oneStdDevBelowAverage="OneStdDevBelowAverage";
		ConditionalFormatPresetCriterion.twoStdDevAboveAverage="TwoStdDevAboveAverage";
		ConditionalFormatPresetCriterion.twoStdDevBelowAverage="TwoStdDevBelowAverage";
		ConditionalFormatPresetCriterion.threeStdDevAboveAverage="ThreeStdDevAboveAverage";
		ConditionalFormatPresetCriterion.threeStdDevBelowAverage="ThreeStdDevBelowAverage";
		ConditionalFormatPresetCriterion.uniqueValues="UniqueValues";
		ConditionalFormatPresetCriterion.duplicateValues="DuplicateValues";
	})(ConditionalFormatPresetCriterion=Excel.ConditionalFormatPresetCriterion || (Excel.ConditionalFormatPresetCriterion={}));
	var ConditionalTextOperator;
	(function (ConditionalTextOperator) {
		ConditionalTextOperator.invalid="Invalid";
		ConditionalTextOperator.contains="Contains";
		ConditionalTextOperator.notContains="NotContains";
		ConditionalTextOperator.beginsWith="BeginsWith";
		ConditionalTextOperator.endsWith="EndsWith";
	})(ConditionalTextOperator=Excel.ConditionalTextOperator || (Excel.ConditionalTextOperator={}));
	var ConditionalCellValueOperator;
	(function (ConditionalCellValueOperator) {
		ConditionalCellValueOperator.invalid="Invalid";
		ConditionalCellValueOperator.between="Between";
		ConditionalCellValueOperator.notBetween="NotBetween";
		ConditionalCellValueOperator.equalTo="EqualTo";
		ConditionalCellValueOperator.notEqualTo="NotEqualTo";
		ConditionalCellValueOperator.greaterThan="GreaterThan";
		ConditionalCellValueOperator.lessThan="LessThan";
		ConditionalCellValueOperator.greaterThanOrEqual="GreaterThanOrEqual";
		ConditionalCellValueOperator.lessThanOrEqual="LessThanOrEqual";
	})(ConditionalCellValueOperator=Excel.ConditionalCellValueOperator || (Excel.ConditionalCellValueOperator={}));
	var ConditionalIconCriterionOperator;
	(function (ConditionalIconCriterionOperator) {
		ConditionalIconCriterionOperator.invalid="Invalid";
		ConditionalIconCriterionOperator.greaterThan="GreaterThan";
		ConditionalIconCriterionOperator.greaterThanOrEqual="GreaterThanOrEqual";
	})(ConditionalIconCriterionOperator=Excel.ConditionalIconCriterionOperator || (Excel.ConditionalIconCriterionOperator={}));
	var ConditionalRangeBorderIndex;
	(function (ConditionalRangeBorderIndex) {
		ConditionalRangeBorderIndex.edgeTop="EdgeTop";
		ConditionalRangeBorderIndex.edgeBottom="EdgeBottom";
		ConditionalRangeBorderIndex.edgeLeft="EdgeLeft";
		ConditionalRangeBorderIndex.edgeRight="EdgeRight";
	})(ConditionalRangeBorderIndex=Excel.ConditionalRangeBorderIndex || (Excel.ConditionalRangeBorderIndex={}));
	var ConditionalRangeBorderLineStyle;
	(function (ConditionalRangeBorderLineStyle) {
		ConditionalRangeBorderLineStyle.none="None";
		ConditionalRangeBorderLineStyle.continuous="Continuous";
		ConditionalRangeBorderLineStyle.dash="Dash";
		ConditionalRangeBorderLineStyle.dashDot="DashDot";
		ConditionalRangeBorderLineStyle.dashDotDot="DashDotDot";
		ConditionalRangeBorderLineStyle.dot="Dot";
	})(ConditionalRangeBorderLineStyle=Excel.ConditionalRangeBorderLineStyle || (Excel.ConditionalRangeBorderLineStyle={}));
	var ConditionalRangeFontUnderlineStyle;
	(function (ConditionalRangeFontUnderlineStyle) {
		ConditionalRangeFontUnderlineStyle.none="None";
		ConditionalRangeFontUnderlineStyle.single="Single";
		ConditionalRangeFontUnderlineStyle.double="Double";
	})(ConditionalRangeFontUnderlineStyle=Excel.ConditionalRangeFontUnderlineStyle || (Excel.ConditionalRangeFontUnderlineStyle={}));
	var DeleteShiftDirection;
	(function (DeleteShiftDirection) {
		DeleteShiftDirection.up="Up";
		DeleteShiftDirection.left="Left";
	})(DeleteShiftDirection=Excel.DeleteShiftDirection || (Excel.DeleteShiftDirection={}));
	var DynamicFilterCriteria;
	(function (DynamicFilterCriteria) {
		DynamicFilterCriteria.unknown="Unknown";
		DynamicFilterCriteria.aboveAverage="AboveAverage";
		DynamicFilterCriteria.allDatesInPeriodApril="AllDatesInPeriodApril";
		DynamicFilterCriteria.allDatesInPeriodAugust="AllDatesInPeriodAugust";
		DynamicFilterCriteria.allDatesInPeriodDecember="AllDatesInPeriodDecember";
		DynamicFilterCriteria.allDatesInPeriodFebruray="AllDatesInPeriodFebruray";
		DynamicFilterCriteria.allDatesInPeriodJanuary="AllDatesInPeriodJanuary";
		DynamicFilterCriteria.allDatesInPeriodJuly="AllDatesInPeriodJuly";
		DynamicFilterCriteria.allDatesInPeriodJune="AllDatesInPeriodJune";
		DynamicFilterCriteria.allDatesInPeriodMarch="AllDatesInPeriodMarch";
		DynamicFilterCriteria.allDatesInPeriodMay="AllDatesInPeriodMay";
		DynamicFilterCriteria.allDatesInPeriodNovember="AllDatesInPeriodNovember";
		DynamicFilterCriteria.allDatesInPeriodOctober="AllDatesInPeriodOctober";
		DynamicFilterCriteria.allDatesInPeriodQuarter1="AllDatesInPeriodQuarter1";
		DynamicFilterCriteria.allDatesInPeriodQuarter2="AllDatesInPeriodQuarter2";
		DynamicFilterCriteria.allDatesInPeriodQuarter3="AllDatesInPeriodQuarter3";
		DynamicFilterCriteria.allDatesInPeriodQuarter4="AllDatesInPeriodQuarter4";
		DynamicFilterCriteria.allDatesInPeriodSeptember="AllDatesInPeriodSeptember";
		DynamicFilterCriteria.belowAverage="BelowAverage";
		DynamicFilterCriteria.lastMonth="LastMonth";
		DynamicFilterCriteria.lastQuarter="LastQuarter";
		DynamicFilterCriteria.lastWeek="LastWeek";
		DynamicFilterCriteria.lastYear="LastYear";
		DynamicFilterCriteria.nextMonth="NextMonth";
		DynamicFilterCriteria.nextQuarter="NextQuarter";
		DynamicFilterCriteria.nextWeek="NextWeek";
		DynamicFilterCriteria.nextYear="NextYear";
		DynamicFilterCriteria.thisMonth="ThisMonth";
		DynamicFilterCriteria.thisQuarter="ThisQuarter";
		DynamicFilterCriteria.thisWeek="ThisWeek";
		DynamicFilterCriteria.thisYear="ThisYear";
		DynamicFilterCriteria.today="Today";
		DynamicFilterCriteria.tomorrow="Tomorrow";
		DynamicFilterCriteria.yearToDate="YearToDate";
		DynamicFilterCriteria.yesterday="Yesterday";
	})(DynamicFilterCriteria=Excel.DynamicFilterCriteria || (Excel.DynamicFilterCriteria={}));
	var FilterDatetimeSpecificity;
	(function (FilterDatetimeSpecificity) {
		FilterDatetimeSpecificity.year="Year";
		FilterDatetimeSpecificity.month="Month";
		FilterDatetimeSpecificity.day="Day";
		FilterDatetimeSpecificity.hour="Hour";
		FilterDatetimeSpecificity.minute="Minute";
		FilterDatetimeSpecificity.second="Second";
	})(FilterDatetimeSpecificity=Excel.FilterDatetimeSpecificity || (Excel.FilterDatetimeSpecificity={}));
	var FilterOn;
	(function (FilterOn) {
		FilterOn.bottomItems="BottomItems";
		FilterOn.bottomPercent="BottomPercent";
		FilterOn.cellColor="CellColor";
		FilterOn.dynamic="Dynamic";
		FilterOn.fontColor="FontColor";
		FilterOn.values="Values";
		FilterOn.topItems="TopItems";
		FilterOn.topPercent="TopPercent";
		FilterOn.icon="Icon";
		FilterOn.custom="Custom";
	})(FilterOn=Excel.FilterOn || (Excel.FilterOn={}));
	var FilterOperator;
	(function (FilterOperator) {
		FilterOperator.and="And";
		FilterOperator.or="Or";
	})(FilterOperator=Excel.FilterOperator || (Excel.FilterOperator={}));
	var HorizontalAlignment;
	(function (HorizontalAlignment) {
		HorizontalAlignment.general="General";
		HorizontalAlignment.left="Left";
		HorizontalAlignment.center="Center";
		HorizontalAlignment.right="Right";
		HorizontalAlignment.fill="Fill";
		HorizontalAlignment.justify="Justify";
		HorizontalAlignment.centerAcrossSelection="CenterAcrossSelection";
		HorizontalAlignment.distributed="Distributed";
	})(HorizontalAlignment=Excel.HorizontalAlignment || (Excel.HorizontalAlignment={}));
	var IconSet;
	(function (IconSet) {
		IconSet.invalid="Invalid";
		IconSet.threeArrows="ThreeArrows";
		IconSet.threeArrowsGray="ThreeArrowsGray";
		IconSet.threeFlags="ThreeFlags";
		IconSet.threeTrafficLights1="ThreeTrafficLights1";
		IconSet.threeTrafficLights2="ThreeTrafficLights2";
		IconSet.threeSigns="ThreeSigns";
		IconSet.threeSymbols="ThreeSymbols";
		IconSet.threeSymbols2="ThreeSymbols2";
		IconSet.fourArrows="FourArrows";
		IconSet.fourArrowsGray="FourArrowsGray";
		IconSet.fourRedToBlack="FourRedToBlack";
		IconSet.fourRating="FourRating";
		IconSet.fourTrafficLights="FourTrafficLights";
		IconSet.fiveArrows="FiveArrows";
		IconSet.fiveArrowsGray="FiveArrowsGray";
		IconSet.fiveRating="FiveRating";
		IconSet.fiveQuarters="FiveQuarters";
		IconSet.threeStars="ThreeStars";
		IconSet.threeTriangles="ThreeTriangles";
		IconSet.fiveBoxes="FiveBoxes";
	})(IconSet=Excel.IconSet || (Excel.IconSet={}));
	var ImageFittingMode;
	(function (ImageFittingMode) {
		ImageFittingMode.fit="Fit";
		ImageFittingMode.fitAndCenter="FitAndCenter";
		ImageFittingMode.fill="Fill";
	})(ImageFittingMode=Excel.ImageFittingMode || (Excel.ImageFittingMode={}));
	var InsertShiftDirection;
	(function (InsertShiftDirection) {
		InsertShiftDirection.down="Down";
		InsertShiftDirection.right="Right";
	})(InsertShiftDirection=Excel.InsertShiftDirection || (Excel.InsertShiftDirection={}));
	var NamedItemScope;
	(function (NamedItemScope) {
		NamedItemScope.worksheet="Worksheet";
		NamedItemScope.workbook="Workbook";
	})(NamedItemScope=Excel.NamedItemScope || (Excel.NamedItemScope={}));
	var NamedItemType;
	(function (NamedItemType) {
		NamedItemType.string="String";
		NamedItemType.integer="Integer";
		NamedItemType.double="Double";
		NamedItemType.boolean="Boolean";
		NamedItemType.range="Range";
		NamedItemType.error="Error";
		NamedItemType.array="Array";
	})(NamedItemType=Excel.NamedItemType || (Excel.NamedItemType={}));
	var RangeUnderlineStyle;
	(function (RangeUnderlineStyle) {
		RangeUnderlineStyle.none="None";
		RangeUnderlineStyle.single="Single";
		RangeUnderlineStyle.double="Double";
		RangeUnderlineStyle.singleAccountant="SingleAccountant";
		RangeUnderlineStyle.doubleAccountant="DoubleAccountant";
	})(RangeUnderlineStyle=Excel.RangeUnderlineStyle || (Excel.RangeUnderlineStyle={}));
	var SheetVisibility;
	(function (SheetVisibility) {
		SheetVisibility.visible="Visible";
		SheetVisibility.hidden="Hidden";
		SheetVisibility.veryHidden="VeryHidden";
	})(SheetVisibility=Excel.SheetVisibility || (Excel.SheetVisibility={}));
	var RangeValueType;
	(function (RangeValueType) {
		RangeValueType.unknown="Unknown";
		RangeValueType.empty="Empty";
		RangeValueType.string="String";
		RangeValueType.integer="Integer";
		RangeValueType.double="Double";
		RangeValueType.boolean="Boolean";
		RangeValueType.error="Error";
		RangeValueType.richValue="RichValue";
	})(RangeValueType=Excel.RangeValueType || (Excel.RangeValueType={}));
	var SortOrientation;
	(function (SortOrientation) {
		SortOrientation.rows="Rows";
		SortOrientation.columns="Columns";
	})(SortOrientation=Excel.SortOrientation || (Excel.SortOrientation={}));
	var SortOn;
	(function (SortOn) {
		SortOn.value="Value";
		SortOn.cellColor="CellColor";
		SortOn.fontColor="FontColor";
		SortOn.icon="Icon";
	})(SortOn=Excel.SortOn || (Excel.SortOn={}));
	var SortDataOption;
	(function (SortDataOption) {
		SortDataOption.normal="Normal";
		SortDataOption.textAsNumber="TextAsNumber";
	})(SortDataOption=Excel.SortDataOption || (Excel.SortDataOption={}));
	var SortMethod;
	(function (SortMethod) {
		SortMethod.pinYin="PinYin";
		SortMethod.strokeCount="StrokeCount";
	})(SortMethod=Excel.SortMethod || (Excel.SortMethod={}));
	var VerticalAlignment;
	(function (VerticalAlignment) {
		VerticalAlignment.top="Top";
		VerticalAlignment.center="Center";
		VerticalAlignment.bottom="Bottom";
		VerticalAlignment.justify="Justify";
		VerticalAlignment.distributed="Distributed";
	})(VerticalAlignment=Excel.VerticalAlignment || (Excel.VerticalAlignment={}));
	var _typeFunctionResult="FunctionResult";
	var FunctionResult=(function (_super) {
		__extends(FunctionResult, _super);
		function FunctionResult() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(FunctionResult.prototype, "_className", {
			get: function () {
				return "FunctionResult<T>";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FunctionResult.prototype, "_scalarPropertyNames", {
			get: function () {
				return ["error", "value"];
			},
			enumerable: true,
			configurable: true
		});
		FunctionResult.prototype.retrieve=function (option) {
			return _retrieve(this, option);
		};
		FunctionResult.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		FunctionResult.prototype.ensureUnchanged=function (data) {
			_createEnsureUnchangedAction(this.context, this, data);
			return;
		};
		return FunctionResult;
	}(OfficeExtension.ClientObject));
	Excel.FunctionResult=FunctionResult;
	var _typeFunctions="Functions";
	var Functions=(function (_super) {
		__extends(Functions, _super);
		function Functions() {
			return _super !==null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Functions.prototype, "_className", {
			get: function () {
				return "Functions";
			},
			enumerable: true,
			configurable: true
		});
		Functions.prototype.abs=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Abs", 0, [number], false, true, null, false));
		};
		Functions.prototype.accrInt=function (issue, firstInterest, settlement, rate, par, frequency, basis, calcMethod) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AccrInt", 0, [issue, firstInterest, settlement, rate, par, frequency, basis, calcMethod], false, true, null, false));
		};
		Functions.prototype.accrIntM=function (issue, settlement, rate, par, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AccrIntM", 0, [issue, settlement, rate, par, basis], false, true, null, false));
		};
		Functions.prototype.acos=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acos", 0, [number], false, true, null, false));
		};
		Functions.prototype.acosh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acosh", 0, [number], false, true, null, false));
		};
		Functions.prototype.acot=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acot", 0, [number], false, true, null, false));
		};
		Functions.prototype.acoth=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acoth", 0, [number], false, true, null, false));
		};
		Functions.prototype.amorDegrc=function (cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AmorDegrc", 0, [cost, datePurchased, firstPeriod, salvage, period, rate, basis], false, true, null, false));
		};
		Functions.prototype.amorLinc=function (cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AmorLinc", 0, [cost, datePurchased, firstPeriod, salvage, period, rate, basis], false, true, null, false));
		};
		Functions.prototype.and=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "And", 0, [values], false, true, null, false));
		};
		Functions.prototype.arabic=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Arabic", 0, [text], false, true, null, false));
		};
		Functions.prototype.areas=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Areas", 0, [reference], false, true, null, false));
		};
		Functions.prototype.asc=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asc", 0, [text], false, true, null, false));
		};
		Functions.prototype.asin=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asin", 0, [number], false, true, null, false));
		};
		Functions.prototype.asinh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asinh", 0, [number], false, true, null, false));
		};
		Functions.prototype.atan=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atan", 0, [number], false, true, null, false));
		};
		Functions.prototype.atan2=function (xNum, yNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atan2", 0, [xNum, yNum], false, true, null, false));
		};
		Functions.prototype.atanh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atanh", 0, [number], false, true, null, false));
		};
		Functions.prototype.aveDev=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AveDev", 0, [values], false, true, null, false));
		};
		Functions.prototype.average=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Average", 0, [values], false, true, null, false));
		};
		Functions.prototype.averageA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageA", 0, [values], false, true, null, false));
		};
		Functions.prototype.averageIf=function (range, criteria, averageRange) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageIf", 0, [range, criteria, averageRange], false, true, null, false));
		};
		Functions.prototype.averageIfs=function (averageRange) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageIfs", 0, [averageRange, values], false, true, null, false));
		};
		Functions.prototype.bahtText=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BahtText", 0, [number], false, true, null, false));
		};
		Functions.prototype.base=function (number, radix, minLength) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Base", 0, [number, radix, minLength], false, true, null, false));
		};
		Functions.prototype.besselI=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselI", 0, [x, n], false, true, null, false));
		};
		Functions.prototype.besselJ=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselJ", 0, [x, n], false, true, null, false));
		};
		Functions.prototype.besselK=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselK", 0, [x, n], false, true, null, false));
		};
		Functions.prototype.besselY=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselY", 0, [x, n], false, true, null, false));
		};
		Functions.prototype.beta_Dist=function (x, alpha, beta, cumulative, A, B) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Beta_Dist", 0, [x, alpha, beta, cumulative, A, B], false, true, null, false));
		};
		Functions.prototype.beta_Inv=function (probability, alpha, beta, A, B) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Beta_Inv", 0, [probability, alpha, beta, A, B], false, true, null, false));
		};
		Functions.prototype.bin2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Dec", 0, [number], false, true, null, false));
		};
		Functions.prototype.bin2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Hex", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.bin2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Oct", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.binom_Dist=function (numberS, trials, probabilityS, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Dist", 0, [numberS, trials, probabilityS, cumulative], false, true, null, false));
		};
		Functions.prototype.binom_Dist_Range=function (trials, probabilityS, numberS, numberS2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Dist_Range", 0, [trials, probabilityS, numberS, numberS2], false, true, null, false));
		};
		Functions.prototype.binom_Inv=function (trials, probabilityS, alpha) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Inv", 0, [trials, probabilityS, alpha], false, true, null, false));
		};
		Functions.prototype.bitand=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitand", 0, [number1, number2], false, true, null, false));
		};
		Functions.prototype.bitlshift=function (number, shiftAmount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitlshift", 0, [number, shiftAmount], false, true, null, false));
		};
		Functions.prototype.bitor=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitor", 0, [number1, number2], false, true, null, false));
		};
		Functions.prototype.bitrshift=function (number, shiftAmount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitrshift", 0, [number, shiftAmount], false, true, null, false));
		};
		Functions.prototype.bitxor=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitxor", 0, [number1, number2], false, true, null, false));
		};
		Functions.prototype.ceiling_Math=function (number, significance, mode) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ceiling_Math", 0, [number, significance, mode], false, true, null, false));
		};
		Functions.prototype.ceiling_Precise=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ceiling_Precise", 0, [number, significance], false, true, null, false));
		};
		Functions.prototype.char=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Char", 0, [number], false, true, null, false));
		};
		Functions.prototype.chiSq_Dist=function (x, degFreedom, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Dist", 0, [x, degFreedom, cumulative], false, true, null, false));
		};
		Functions.prototype.chiSq_Dist_RT=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Dist_RT", 0, [x, degFreedom], false, true, null, false));
		};
		Functions.prototype.chiSq_Inv=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Inv", 0, [probability, degFreedom], false, true, null, false));
		};
		Functions.prototype.chiSq_Inv_RT=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Inv_RT", 0, [probability, degFreedom], false, true, null, false));
		};
		Functions.prototype.choose=function (indexNum) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Choose", 0, [indexNum, values], false, true, null, false));
		};
		Functions.prototype.clean=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Clean", 0, [text], false, true, null, false));
		};
		Functions.prototype.code=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Code", 0, [text], false, true, null, false));
		};
		Functions.prototype.columns=function (array) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Columns", 0, [array], false, true, null, false));
		};
		Functions.prototype.combin=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Combin", 0, [number, numberChosen], false, true, null, false));
		};
		Functions.prototype.combina=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Combina", 0, [number, numberChosen], false, true, null, false));
		};
		Functions.prototype.complex=function (realNum, iNum, suffix) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Complex", 0, [realNum, iNum, suffix], false, true, null, false));
		};
		Functions.prototype.concatenate=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Concatenate", 0, [values], false, true, null, false));
		};
		Functions.prototype.confidence_Norm=function (alpha, standardDev, size) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Confidence_Norm", 0, [alpha, standardDev, size], false, true, null, false));
		};
		Functions.prototype.confidence_T=function (alpha, standardDev, size) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Confidence_T", 0, [alpha, standardDev, size], false, true, null, false));
		};
		Functions.prototype.convert=function (number, fromUnit, toUnit) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Convert", 0, [number, fromUnit, toUnit], false, true, null, false));
		};
		Functions.prototype.cos=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cos", 0, [number], false, true, null, false));
		};
		Functions.prototype.cosh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cosh", 0, [number], false, true, null, false));
		};
		Functions.prototype.cot=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cot", 0, [number], false, true, null, false));
		};
		Functions.prototype.coth=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Coth", 0, [number], false, true, null, false));
		};
		Functions.prototype.count=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Count", 0, [values], false, true, null, false));
		};
		Functions.prototype.countA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountA", 0, [values], false, true, null, false));
		};
		Functions.prototype.countBlank=function (range) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountBlank", 0, [range], false, true, null, false));
		};
		Functions.prototype.countIf=function (range, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountIf", 0, [range, criteria], false, true, null, false));
		};
		Functions.prototype.countIfs=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountIfs", 0, [values], false, true, null, false));
		};
		Functions.prototype.coupDayBs=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDayBs", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.coupDays=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDays", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.coupDaysNc=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDaysNc", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.coupNcd=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupNcd", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.coupNum=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupNum", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.coupPcd=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupPcd", 0, [settlement, maturity, frequency, basis], false, true, null, false));
		};
		Functions.prototype.csc=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Csc", 0, [number], false, true, null, false));
		};
		Functions.prototype.csch=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Csch", 0, [number], false, true, null, false));
		};
		Functions.prototype.cumIPmt=function (rate, nper, pv, startPeriod, endPeriod, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CumIPmt", 0, [rate, nper, pv, startPeriod, endPeriod, type], false, true, null, false));
		};
		Functions.prototype.cumPrinc=function (rate, nper, pv, startPeriod, endPeriod, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CumPrinc", 0, [rate, nper, pv, startPeriod, endPeriod, type], false, true, null, false));
		};
		Functions.prototype.daverage=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DAverage", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dcount=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DCount", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dcountA=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DCountA", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dget=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DGet", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dmax=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DMax", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dmin=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DMin", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dproduct=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DProduct", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dstDev=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DStDev", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dstDevP=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DStDevP", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dsum=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DSum", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dvar=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DVar", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.dvarP=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DVarP", 0, [database, field, criteria], false, true, null, false));
		};
		Functions.prototype.date=function (year, month, day) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Date", 0, [year, month, day], false, true, null, false));
		};
		Functions.prototype.datevalue=function (dateText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Datevalue", 0, [dateText], false, true, null, false));
		};
		Functions.prototype.day=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Day", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.days=function (endDate, startDate) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Days", 0, [endDate, startDate], false, true, null, false));
		};
		Functions.prototype.days360=function (startDate, endDate, method) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Days360", 0, [startDate, endDate, method], false, true, null, false));
		};
		Functions.prototype.db=function (cost, salvage, life, period, month) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Db", 0, [cost, salvage, life, period, month], false, true, null, false));
		};
		Functions.prototype.dbcs=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dbcs", 0, [text], false, true, null, false));
		};
		Functions.prototype.ddb=function (cost, salvage, life, period, factor) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ddb", 0, [cost, salvage, life, period, factor], false, true, null, false));
		};
		Functions.prototype.dec2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Bin", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.dec2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Hex", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.dec2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Oct", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.decimal=function (number, radix) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Decimal", 0, [number, radix], false, true, null, false));
		};
		Functions.prototype.degrees=function (angle) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Degrees", 0, [angle], false, true, null, false));
		};
		Functions.prototype.delta=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Delta", 0, [number1, number2], false, true, null, false));
		};
		Functions.prototype.devSq=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DevSq", 0, [values], false, true, null, false));
		};
		Functions.prototype.disc=function (settlement, maturity, pr, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Disc", 0, [settlement, maturity, pr, redemption, basis], false, true, null, false));
		};
		Functions.prototype.dollar=function (number, decimals) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dollar", 0, [number, decimals], false, true, null, false));
		};
		Functions.prototype.dollarDe=function (fractionalDollar, fraction) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DollarDe", 0, [fractionalDollar, fraction], false, true, null, false));
		};
		Functions.prototype.dollarFr=function (decimalDollar, fraction) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DollarFr", 0, [decimalDollar, fraction], false, true, null, false));
		};
		Functions.prototype.duration=function (settlement, maturity, coupon, yld, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Duration", 0, [settlement, maturity, coupon, yld, frequency, basis], false, true, null, false));
		};
		Functions.prototype.ecma_Ceiling=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ECMA_Ceiling", 0, [number, significance], false, true, null, false));
		};
		Functions.prototype.edate=function (startDate, months) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "EDate", 0, [startDate, months], false, true, null, false));
		};
		Functions.prototype.effect=function (nominalRate, npery) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Effect", 0, [nominalRate, npery], false, true, null, false));
		};
		Functions.prototype.eoMonth=function (startDate, months) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "EoMonth", 0, [startDate, months], false, true, null, false));
		};
		Functions.prototype.erf=function (lowerLimit, upperLimit) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Erf", 0, [lowerLimit, upperLimit], false, true, null, false));
		};
		Functions.prototype.erfC=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ErfC", 0, [x], false, true, null, false));
		};
		Functions.prototype.erfC_Precise=function (X) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ErfC_Precise", 0, [X], false, true, null, false));
		};
		Functions.prototype.erf_Precise=function (X) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Erf_Precise", 0, [X], false, true, null, false));
		};
		Functions.prototype.error_Type=function (errorVal) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Error_Type", 0, [errorVal], false, true, null, false));
		};
		Functions.prototype.even=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Even", 0, [number], false, true, null, false));
		};
		Functions.prototype.exact=function (text1, text2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Exact", 0, [text1, text2], false, true, null, false));
		};
		Functions.prototype.exp=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Exp", 0, [number], false, true, null, false));
		};
		Functions.prototype.expon_Dist=function (x, lambda, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Expon_Dist", 0, [x, lambda, cumulative], false, true, null, false));
		};
		Functions.prototype.fvschedule=function (principal, schedule) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FVSchedule", 0, [principal, schedule], false, true, null, false));
		};
		Functions.prototype.f_Dist=function (x, degFreedom1, degFreedom2, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Dist", 0, [x, degFreedom1, degFreedom2, cumulative], false, true, null, false));
		};
		Functions.prototype.f_Dist_RT=function (x, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Dist_RT", 0, [x, degFreedom1, degFreedom2], false, true, null, false));
		};
		Functions.prototype.f_Inv=function (probability, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Inv", 0, [probability, degFreedom1, degFreedom2], false, true, null, false));
		};
		Functions.prototype.f_Inv_RT=function (probability, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Inv_RT", 0, [probability, degFreedom1, degFreedom2], false, true, null, false));
		};
		Functions.prototype.fact=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fact", 0, [number], false, true, null, false));
		};
		Functions.prototype.factDouble=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FactDouble", 0, [number], false, true, null, false));
		};
		Functions.prototype.false=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "False", 0, [], false, true, null, false));
		};
		Functions.prototype.find=function (findText, withinText, startNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Find", 0, [findText, withinText, startNum], false, true, null, false));
		};
		Functions.prototype.findB=function (findText, withinText, startNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FindB", 0, [findText, withinText, startNum], false, true, null, false));
		};
		Functions.prototype.fisher=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fisher", 0, [x], false, true, null, false));
		};
		Functions.prototype.fisherInv=function (y) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FisherInv", 0, [y], false, true, null, false));
		};
		Functions.prototype.fixed=function (number, decimals, noCommas) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fixed", 0, [number, decimals, noCommas], false, true, null, false));
		};
		Functions.prototype.floor_Math=function (number, significance, mode) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Floor_Math", 0, [number, significance, mode], false, true, null, false));
		};
		Functions.prototype.floor_Precise=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Floor_Precise", 0, [number, significance], false, true, null, false));
		};
		Functions.prototype.fv=function (rate, nper, pmt, pv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fv", 0, [rate, nper, pmt, pv, type], false, true, null, false));
		};
		Functions.prototype.gamma=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma", 0, [x], false, true, null, false));
		};
		Functions.prototype.gammaLn=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GammaLn", 0, [x], false, true, null, false));
		};
		Functions.prototype.gammaLn_Precise=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GammaLn_Precise", 0, [x], false, true, null, false));
		};
		Functions.prototype.gamma_Dist=function (x, alpha, beta, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma_Dist", 0, [x, alpha, beta, cumulative], false, true, null, false));
		};
		Functions.prototype.gamma_Inv=function (probability, alpha, beta) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma_Inv", 0, [probability, alpha, beta], false, true, null, false));
		};
		Functions.prototype.gauss=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gauss", 0, [x], false, true, null, false));
		};
		Functions.prototype.gcd=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gcd", 0, [values], false, true, null, false));
		};
		Functions.prototype.geStep=function (number, step) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GeStep", 0, [number, step], false, true, null, false));
		};
		Functions.prototype.geoMean=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GeoMean", 0, [values], false, true, null, false));
		};
		Functions.prototype.hlookup=function (lookupValue, tableArray, rowIndexNum, rangeLookup) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HLookup", 0, [lookupValue, tableArray, rowIndexNum, rangeLookup], false, true, null, false));
		};
		Functions.prototype.harMean=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HarMean", 0, [values], false, true, null, false));
		};
		Functions.prototype.hex2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Bin", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.hex2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Dec", 0, [number], false, true, null, false));
		};
		Functions.prototype.hex2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Oct", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.hour=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hour", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.hypGeom_Dist=function (sampleS, numberSample, populationS, numberPop, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HypGeom_Dist", 0, [sampleS, numberSample, populationS, numberPop, cumulative], false, true, null, false));
		};
		Functions.prototype.hyperlink=function (linkLocation, friendlyName) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hyperlink", 0, [linkLocation, friendlyName], false, true, null, false));
		};
		Functions.prototype.iso_Ceiling=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ISO_Ceiling", 0, [number, significance], false, true, null, false));
		};
		Functions.prototype.if=function (logicalTest, valueIfTrue, valueIfFalse) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "If", 0, [logicalTest, valueIfTrue, valueIfFalse], false, true, null, false));
		};
		Functions.prototype.imAbs=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImAbs", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imArgument=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImArgument", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imConjugate=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImConjugate", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imCos=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCos", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imCosh=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCosh", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imCot=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCot", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imCsc=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCsc", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imCsch=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCsch", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imDiv=function (inumber1, inumber2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImDiv", 0, [inumber1, inumber2], false, true, null, false));
		};
		Functions.prototype.imExp=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImExp", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imLn=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLn", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imLog10=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLog10", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imLog2=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLog2", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imPower=function (inumber, number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImPower", 0, [inumber, number], false, true, null, false));
		};
		Functions.prototype.imProduct=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImProduct", 0, [values], false, true, null, false));
		};
		Functions.prototype.imReal=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImReal", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSec=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSec", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSech=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSech", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSin=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSin", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSinh=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSinh", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSqrt=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSqrt", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imSub=function (inumber1, inumber2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSub", 0, [inumber1, inumber2], false, true, null, false));
		};
		Functions.prototype.imSum=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSum", 0, [values], false, true, null, false));
		};
		Functions.prototype.imTan=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImTan", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.imaginary=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Imaginary", 0, [inumber], false, true, null, false));
		};
		Functions.prototype.int=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Int", 0, [number], false, true, null, false));
		};
		Functions.prototype.intRate=function (settlement, maturity, investment, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IntRate", 0, [settlement, maturity, investment, redemption, basis], false, true, null, false));
		};
		Functions.prototype.ipmt=function (rate, per, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ipmt", 0, [rate, per, nper, pv, fv, type], false, true, null, false));
		};
		Functions.prototype.irr=function (values, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Irr", 0, [values, guess], false, true, null, false));
		};
		Functions.prototype.isErr=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsErr", 0, [value], false, true, null, false));
		};
		Functions.prototype.isError=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsError", 0, [value], false, true, null, false));
		};
		Functions.prototype.isEven=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsEven", 0, [number], false, true, null, false));
		};
		Functions.prototype.isFormula=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsFormula", 0, [reference], false, true, null, false));
		};
		Functions.prototype.isLogical=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsLogical", 0, [value], false, true, null, false));
		};
		Functions.prototype.isNA=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNA", 0, [value], false, true, null, false));
		};
		Functions.prototype.isNonText=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNonText", 0, [value], false, true, null, false));
		};
		Functions.prototype.isNumber=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNumber", 0, [value], false, true, null, false));
		};
		Functions.prototype.isOdd=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsOdd", 0, [number], false, true, null, false));
		};
		Functions.prototype.isText=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsText", 0, [value], false, true, null, false));
		};
		Functions.prototype.isoWeekNum=function (date) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsoWeekNum", 0, [date], false, true, null, false));
		};
		Functions.prototype.ispmt=function (rate, per, nper, pv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ispmt", 0, [rate, per, nper, pv], false, true, null, false));
		};
		Functions.prototype.isref=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Isref", 0, [value], false, true, null, false));
		};
		Functions.prototype.kurt=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Kurt", 0, [values], false, true, null, false));
		};
		Functions.prototype.large=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Large", 0, [array, k], false, true, null, false));
		};
		Functions.prototype.lcm=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lcm", 0, [values], false, true, null, false));
		};
		Functions.prototype.left=function (text, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Left", 0, [text, numChars], false, true, null, false));
		};
		Functions.prototype.leftb=function (text, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Leftb", 0, [text, numBytes], false, true, null, false));
		};
		Functions.prototype.len=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Len", 0, [text], false, true, null, false));
		};
		Functions.prototype.lenb=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lenb", 0, [text], false, true, null, false));
		};
		Functions.prototype.ln=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ln", 0, [number], false, true, null, false));
		};
		Functions.prototype.log=function (number, base) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Log", 0, [number, base], false, true, null, false));
		};
		Functions.prototype.log10=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Log10", 0, [number], false, true, null, false));
		};
		Functions.prototype.logNorm_Dist=function (x, mean, standardDev, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "LogNorm_Dist", 0, [x, mean, standardDev, cumulative], false, true, null, false));
		};
		Functions.prototype.logNorm_Inv=function (probability, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "LogNorm_Inv", 0, [probability, mean, standardDev], false, true, null, false));
		};
		Functions.prototype.lookup=function (lookupValue, lookupVector, resultVector) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lookup", 0, [lookupValue, lookupVector, resultVector], false, true, null, false));
		};
		Functions.prototype.lower=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lower", 0, [text], false, true, null, false));
		};
		Functions.prototype.mduration=function (settlement, maturity, coupon, yld, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MDuration", 0, [settlement, maturity, coupon, yld, frequency, basis], false, true, null, false));
		};
		Functions.prototype.mirr=function (values, financeRate, reinvestRate) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MIrr", 0, [values, financeRate, reinvestRate], false, true, null, false));
		};
		Functions.prototype.mround=function (number, multiple) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MRound", 0, [number, multiple], false, true, null, false));
		};
		Functions.prototype.match=function (lookupValue, lookupArray, matchType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Match", 0, [lookupValue, lookupArray, matchType], false, true, null, false));
		};
		Functions.prototype.max=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Max", 0, [values], false, true, null, false));
		};
		Functions.prototype.maxA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MaxA", 0, [values], false, true, null, false));
		};
		Functions.prototype.median=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Median", 0, [values], false, true, null, false));
		};
		Functions.prototype.mid=function (text, startNum, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Mid", 0, [text, startNum, numChars], false, true, null, false));
		};
		Functions.prototype.midb=function (text, startNum, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Midb", 0, [text, startNum, numBytes], false, true, null, false));
		};
		Functions.prototype.min=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Min", 0, [values], false, true, null, false));
		};
		Functions.prototype.minA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MinA", 0, [values], false, true, null, false));
		};
		Functions.prototype.minute=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Minute", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.mod=function (number, divisor) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Mod", 0, [number, divisor], false, true, null, false));
		};
		Functions.prototype.month=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Month", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.multiNomial=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MultiNomial", 0, [values], false, true, null, false));
		};
		Functions.prototype.n=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "N", 0, [value], false, true, null, false));
		};
		Functions.prototype.nper=function (rate, pmt, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NPer", 0, [rate, pmt, pv, fv, type], false, true, null, false));
		};
		Functions.prototype.na=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Na", 0, [], false, true, null, false));
		};
		Functions.prototype.negBinom_Dist=function (numberF, numberS, probabilityS, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NegBinom_Dist", 0, [numberF, numberS, probabilityS, cumulative], false, true, null, false));
		};
		Functions.prototype.networkDays=function (startDate, endDate, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NetworkDays", 0, [startDate, endDate, holidays], false, true, null, false));
		};
		Functions.prototype.networkDays_Intl=function (startDate, endDate, weekend, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NetworkDays_Intl", 0, [startDate, endDate, weekend, holidays], false, true, null, false));
		};
		Functions.prototype.nominal=function (effectRate, npery) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Nominal", 0, [effectRate, npery], false, true, null, false));
		};
		Functions.prototype.norm_Dist=function (x, mean, standardDev, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_Dist", 0, [x, mean, standardDev, cumulative], false, true, null, false));
		};
		Functions.prototype.norm_Inv=function (probability, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_Inv", 0, [probability, mean, standardDev], false, true, null, false));
		};
		Functions.prototype.norm_S_Dist=function (z, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_S_Dist", 0, [z, cumulative], false, true, null, false));
		};
		Functions.prototype.norm_S_Inv=function (probability) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_S_Inv", 0, [probability], false, true, null, false));
		};
		Functions.prototype.not=function (logical) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Not", 0, [logical], false, true, null, false));
		};
		Functions.prototype.now=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Now", 0, [], false, true, null, false));
		};
		Functions.prototype.npv=function (rate) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Npv", 0, [rate, values], false, true, null, false));
		};
		Functions.prototype.numberValue=function (text, decimalSeparator, groupSeparator) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NumberValue", 0, [text, decimalSeparator, groupSeparator], false, true, null, false));
		};
		Functions.prototype.oct2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Bin", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.oct2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Dec", 0, [number], false, true, null, false));
		};
		Functions.prototype.oct2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Hex", 0, [number, places], false, true, null, false));
		};
		Functions.prototype.odd=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Odd", 0, [number], false, true, null, false));
		};
		Functions.prototype.oddFPrice=function (settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddFPrice", 0, [settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.oddFYield=function (settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddFYield", 0, [settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.oddLPrice=function (settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddLPrice", 0, [settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.oddLYield=function (settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddLYield", 0, [settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.or=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Or", 0, [values], false, true, null, false));
		};
		Functions.prototype.pduration=function (rate, pv, fv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PDuration", 0, [rate, pv, fv], false, true, null, false));
		};
		Functions.prototype.percentRank_Exc=function (array, x, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PercentRank_Exc", 0, [array, x, significance], false, true, null, false));
		};
		Functions.prototype.percentRank_Inc=function (array, x, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PercentRank_Inc", 0, [array, x, significance], false, true, null, false));
		};
		Functions.prototype.percentile_Exc=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Percentile_Exc", 0, [array, k], false, true, null, false));
		};
		Functions.prototype.percentile_Inc=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Percentile_Inc", 0, [array, k], false, true, null, false));
		};
		Functions.prototype.permut=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Permut", 0, [number, numberChosen], false, true, null, false));
		};
		Functions.prototype.permutationa=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Permutationa", 0, [number, numberChosen], false, true, null, false));
		};
		Functions.prototype.phi=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Phi", 0, [x], false, true, null, false));
		};
		Functions.prototype.pi=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pi", 0, [], false, true, null, false));
		};
		Functions.prototype.pmt=function (rate, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pmt", 0, [rate, nper, pv, fv, type], false, true, null, false));
		};
		Functions.prototype.poisson_Dist=function (x, mean, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Poisson_Dist", 0, [x, mean, cumulative], false, true, null, false));
		};
		Functions.prototype.power=function (number, power) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Power", 0, [number, power], false, true, null, false));
		};
		Functions.prototype.ppmt=function (rate, per, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ppmt", 0, [rate, per, nper, pv, fv, type], false, true, null, false));
		};
		Functions.prototype.price=function (settlement, maturity, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Price", 0, [settlement, maturity, rate, yld, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.priceDisc=function (settlement, maturity, discount, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PriceDisc", 0, [settlement, maturity, discount, redemption, basis], false, true, null, false));
		};
		Functions.prototype.priceMat=function (settlement, maturity, issue, rate, yld, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PriceMat", 0, [settlement, maturity, issue, rate, yld, basis], false, true, null, false));
		};
		Functions.prototype.product=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Product", 0, [values], false, true, null, false));
		};
		Functions.prototype.proper=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Proper", 0, [text], false, true, null, false));
		};
		Functions.prototype.pv=function (rate, nper, pmt, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pv", 0, [rate, nper, pmt, fv, type], false, true, null, false));
		};
		Functions.prototype.quartile_Exc=function (array, quart) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quartile_Exc", 0, [array, quart], false, true, null, false));
		};
		Functions.prototype.quartile_Inc=function (array, quart) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quartile_Inc", 0, [array, quart], false, true, null, false));
		};
		Functions.prototype.quotient=function (numerator, denominator) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quotient", 0, [numerator, denominator], false, true, null, false));
		};
		Functions.prototype.radians=function (angle) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Radians", 0, [angle], false, true, null, false));
		};
		Functions.prototype.rand=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rand", 0, [], false, true, null, false));
		};
		Functions.prototype.randBetween=function (bottom, top) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RandBetween", 0, [bottom, top], false, true, null, false));
		};
		Functions.prototype.rank_Avg=function (number, ref, order) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rank_Avg", 0, [number, ref, order], false, true, null, false));
		};
		Functions.prototype.rank_Eq=function (number, ref, order) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rank_Eq", 0, [number, ref, order], false, true, null, false));
		};
		Functions.prototype.rate=function (nper, pmt, pv, fv, type, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rate", 0, [nper, pmt, pv, fv, type, guess], false, true, null, false));
		};
		Functions.prototype.received=function (settlement, maturity, investment, discount, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Received", 0, [settlement, maturity, investment, discount, basis], false, true, null, false));
		};
		Functions.prototype.replace=function (oldText, startNum, numChars, newText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Replace", 0, [oldText, startNum, numChars, newText], false, true, null, false));
		};
		Functions.prototype.replaceB=function (oldText, startNum, numBytes, newText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ReplaceB", 0, [oldText, startNum, numBytes, newText], false, true, null, false));
		};
		Functions.prototype.rept=function (text, numberTimes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rept", 0, [text, numberTimes], false, true, null, false));
		};
		Functions.prototype.right=function (text, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Right", 0, [text, numChars], false, true, null, false));
		};
		Functions.prototype.rightb=function (text, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rightb", 0, [text, numBytes], false, true, null, false));
		};
		Functions.prototype.roman=function (number, form) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Roman", 0, [number, form], false, true, null, false));
		};
		Functions.prototype.round=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Round", 0, [number, numDigits], false, true, null, false));
		};
		Functions.prototype.roundDown=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RoundDown", 0, [number, numDigits], false, true, null, false));
		};
		Functions.prototype.roundUp=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RoundUp", 0, [number, numDigits], false, true, null, false));
		};
		Functions.prototype.rows=function (array) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rows", 0, [array], false, true, null, false));
		};
		Functions.prototype.rri=function (nper, pv, fv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rri", 0, [nper, pv, fv], false, true, null, false));
		};
		Functions.prototype.sec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sec", 0, [number], false, true, null, false));
		};
		Functions.prototype.sech=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sech", 0, [number], false, true, null, false));
		};
		Functions.prototype.second=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Second", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.seriesSum=function (x, n, m, coefficients) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SeriesSum", 0, [x, n, m, coefficients], false, true, null, false));
		};
		Functions.prototype.sheet=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sheet", 0, [value], false, true, null, false));
		};
		Functions.prototype.sheets=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sheets", 0, [reference], false, true, null, false));
		};
		Functions.prototype.sign=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sign", 0, [number], false, true, null, false));
		};
		Functions.prototype.sin=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sin", 0, [number], false, true, null, false));
		};
		Functions.prototype.sinh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sinh", 0, [number], false, true, null, false));
		};
		Functions.prototype.skew=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Skew", 0, [values], false, true, null, false));
		};
		Functions.prototype.skew_p=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Skew_p", 0, [values], false, true, null, false));
		};
		Functions.prototype.sln=function (cost, salvage, life) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sln", 0, [cost, salvage, life], false, true, null, false));
		};
		Functions.prototype.small=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Small", 0, [array, k], false, true, null, false));
		};
		Functions.prototype.sqrt=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sqrt", 0, [number], false, true, null, false));
		};
		Functions.prototype.sqrtPi=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SqrtPi", 0, [number], false, true, null, false));
		};
		Functions.prototype.stDevA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDevA", 0, [values], false, true, null, false));
		};
		Functions.prototype.stDevPA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDevPA", 0, [values], false, true, null, false));
		};
		Functions.prototype.stDev_P=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDev_P", 0, [values], false, true, null, false));
		};
		Functions.prototype.stDev_S=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDev_S", 0, [values], false, true, null, false));
		};
		Functions.prototype.standardize=function (x, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Standardize", 0, [x, mean, standardDev], false, true, null, false));
		};
		Functions.prototype.substitute=function (text, oldText, newText, instanceNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Substitute", 0, [text, oldText, newText, instanceNum], false, true, null, false));
		};
		Functions.prototype.subtotal=function (functionNum) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Subtotal", 0, [functionNum, values], false, true, null, false));
		};
		Functions.prototype.sum=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sum", 0, [values], false, true, null, false));
		};
		Functions.prototype.sumIf=function (range, criteria, sumRange) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumIf", 0, [range, criteria, sumRange], false, true, null, false));
		};
		Functions.prototype.sumIfs=function (sumRange) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumIfs", 0, [sumRange, values], false, true, null, false));
		};
		Functions.prototype.sumSq=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumSq", 0, [values], false, true, null, false));
		};
		Functions.prototype.syd=function (cost, salvage, life, per) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Syd", 0, [cost, salvage, life, per], false, true, null, false));
		};
		Functions.prototype.t=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T", 0, [value], false, true, null, false));
		};
		Functions.prototype.tbillEq=function (settlement, maturity, discount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillEq", 0, [settlement, maturity, discount], false, true, null, false));
		};
		Functions.prototype.tbillPrice=function (settlement, maturity, discount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillPrice", 0, [settlement, maturity, discount], false, true, null, false));
		};
		Functions.prototype.tbillYield=function (settlement, maturity, pr) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillYield", 0, [settlement, maturity, pr], false, true, null, false));
		};
		Functions.prototype.t_Dist=function (x, degFreedom, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist", 0, [x, degFreedom, cumulative], false, true, null, false));
		};
		Functions.prototype.t_Dist_2T=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist_2T", 0, [x, degFreedom], false, true, null, false));
		};
		Functions.prototype.t_Dist_RT=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist_RT", 0, [x, degFreedom], false, true, null, false));
		};
		Functions.prototype.t_Inv=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Inv", 0, [probability, degFreedom], false, true, null, false));
		};
		Functions.prototype.t_Inv_2T=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Inv_2T", 0, [probability, degFreedom], false, true, null, false));
		};
		Functions.prototype.tan=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Tan", 0, [number], false, true, null, false));
		};
		Functions.prototype.tanh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Tanh", 0, [number], false, true, null, false));
		};
		Functions.prototype.text=function (value, formatText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Text", 0, [value, formatText], false, true, null, false));
		};
		Functions.prototype.time=function (hour, minute, second) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Time", 0, [hour, minute, second], false, true, null, false));
		};
		Functions.prototype.timevalue=function (timeText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Timevalue", 0, [timeText], false, true, null, false));
		};
		Functions.prototype.today=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Today", 0, [], false, true, null, false));
		};
		Functions.prototype.trim=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Trim", 0, [text], false, true, null, false));
		};
		Functions.prototype.trimMean=function (array, percent) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TrimMean", 0, [array, percent], false, true, null, false));
		};
		Functions.prototype.true=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "True", 0, [], false, true, null, false));
		};
		Functions.prototype.trunc=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Trunc", 0, [number, numDigits], false, true, null, false));
		};
		Functions.prototype.type=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Type", 0, [value], false, true, null, false));
		};
		Functions.prototype.usdollar=function (number, decimals) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "USDollar", 0, [number, decimals], false, true, null, false));
		};
		Functions.prototype.unichar=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Unichar", 0, [number], false, true, null, false));
		};
		Functions.prototype.unicode=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Unicode", 0, [text], false, true, null, false));
		};
		Functions.prototype.upper=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Upper", 0, [text], false, true, null, false));
		};
		Functions.prototype.vlookup=function (lookupValue, tableArray, colIndexNum, rangeLookup) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VLookup", 0, [lookupValue, tableArray, colIndexNum, rangeLookup], false, true, null, false));
		};
		Functions.prototype.value=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Value", 0, [text], false, true, null, false));
		};
		Functions.prototype.varA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VarA", 0, [values], false, true, null, false));
		};
		Functions.prototype.varPA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VarPA", 0, [values], false, true, null, false));
		};
		Functions.prototype.var_P=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Var_P", 0, [values], false, true, null, false));
		};
		Functions.prototype.var_S=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Var_S", 0, [values], false, true, null, false));
		};
		Functions.prototype.vdb=function (cost, salvage, life, startPeriod, endPeriod, factor, noSwitch) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Vdb", 0, [cost, salvage, life, startPeriod, endPeriod, factor, noSwitch], false, true, null, false));
		};
		Functions.prototype.weekNum=function (serialNumber, returnType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WeekNum", 0, [serialNumber, returnType], false, true, null, false));
		};
		Functions.prototype.weekday=function (serialNumber, returnType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Weekday", 0, [serialNumber, returnType], false, true, null, false));
		};
		Functions.prototype.weibull_Dist=function (x, alpha, beta, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Weibull_Dist", 0, [x, alpha, beta, cumulative], false, true, null, false));
		};
		Functions.prototype.workDay=function (startDate, days, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WorkDay", 0, [startDate, days, holidays], false, true, null, false));
		};
		Functions.prototype.workDay_Intl=function (startDate, days, weekend, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WorkDay_Intl", 0, [startDate, days, weekend, holidays], false, true, null, false));
		};
		Functions.prototype.xirr=function (values, dates, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xirr", 0, [values, dates, guess], false, true, null, false));
		};
		Functions.prototype.xnpv=function (rate, values, dates) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xnpv", 0, [rate, values, dates], false, true, null, false));
		};
		Functions.prototype.xor=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xor", 0, [values], false, true, null, false));
		};
		Functions.prototype.year=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Year", 0, [serialNumber], false, true, null, false));
		};
		Functions.prototype.yearFrac=function (startDate, endDate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YearFrac", 0, [startDate, endDate, basis], false, true, null, false));
		};
		Functions.prototype.yield=function (settlement, maturity, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Yield", 0, [settlement, maturity, rate, pr, redemption, frequency, basis], false, true, null, false));
		};
		Functions.prototype.yieldDisc=function (settlement, maturity, pr, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YieldDisc", 0, [settlement, maturity, pr, redemption, basis], false, true, null, false));
		};
		Functions.prototype.yieldMat=function (settlement, maturity, issue, rate, pr, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YieldMat", 0, [settlement, maturity, issue, rate, pr, basis], false, true, null, false));
		};
		Functions.prototype.z_Test=function (array, x, sigma) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Z_Test", 0, [array, x, sigma], false, true, null, false));
		};
		Functions.prototype._handleRetrieveResult=function (value, result) {
			_super.prototype._handleRetrieveResult.call(this, value, result);
			_processRetrieveResult(this, value, result);
		};
		return Functions;
	}(OfficeExtension.ClientObject));
	Excel.Functions=Functions;
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.apiNotFound="ApiNotFound";
		ErrorCodes.conflict="Conflict";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.insertDeleteConflict="InsertDeleteConflict";
		ErrorCodes.invalidArgument="InvalidArgument";
		ErrorCodes.invalidBinding="InvalidBinding";
		ErrorCodes.invalidOperation="InvalidOperation";
		ErrorCodes.invalidReference="InvalidReference";
		ErrorCodes.invalidSelection="InvalidSelection";
		ErrorCodes.itemAlreadyExists="ItemAlreadyExists";
		ErrorCodes.itemNotFound="ItemNotFound";
		ErrorCodes.notImplemented="NotImplemented";
		ErrorCodes.unsupportedOperation="UnsupportedOperation";
		ErrorCodes.invalidOperationInCellEditMode="InvalidOperationInCellEditMode";
	})(ErrorCodes=Excel.ErrorCodes || (Excel.ErrorCodes={}));
})(Excel || (Excel={}));

OfficeExtension.Utility._doApiNotSupportedCheck=true;


