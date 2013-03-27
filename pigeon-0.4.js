var pigeon = { 
    callNativeFunction: function (success, fail, resultType) { 
    	return cordova.exec(success, fail, "PigeonPlugin", "nativeAction", [resultType]); 
    }, 
	getSubscriptionId: function (success, fail) {
		return cordova.exec(success, fail, "PigeonPlugin", "getSubscriptionId", []); 
	},
	getKeyValue: function (success, fail, account, password, key) {
		return cordova.exec(success, fail, "PigeonPlugin", "remoteKeyValue", [account,password,key]); 
	},
	subscribeChannel: function (success, fail, channel_name, function_name) {
		var callbackId = 'subscribeChannel' + cordova.callbackId++;
		cordova.callbacks[callbackId] = function_name;
		return cordova.exec(success, fail, "PigeonPlugin", "subscribeChannel", [channel_name,callbackId]); 
	},
	unsubscribeChannel: function (success, fail, channel_name) {
		return cordova.exec(success, fail, "PigeonPlugin", "unsubscribeChannel", [channel_name]); 
	},
	publishChannel: function (success, fail, channel_name, message) {
		return cordova.exec(success, fail, "PigeonPlugin", "publishChannel", [channel_name,message]);
	},
	subscribeGeoChannel: function (success, fail, level, function_name) {
		var callbackId = 'subscribeGeoChannel' + cordova.callbackId++;
		cordova.callbacks[callbackId] = function_name;
		return cordova.exec(success, fail, "PigeonPlugin", "subscribeGeoChannel", [level,callbackId]); 
	},
	unsubscribeGeoChannel: function (success, fail) {
		return cordova.exec(success, fail, "PigeonPlugin", "unsubscribeGeoChannel", []); 
	},
	publishGeoChannel: function (success, fail, message) {
		return cordova.exec(success, fail, "PigeonPlugin", "publishGeoChannel", [message]);
	},
	invoke: function (callbackId, args) {
		if (cordova.callbacks[callbackId]) {
			cordova.callbacks[callbackId](args);
		}
	}
};