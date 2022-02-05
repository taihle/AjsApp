// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------
ajsApp.service('ajsApi', ['$http', 'ajsCache', 
    function ($http, ajsCache) {

    var self = this;

    self.Config = {
		ApiKey: "1234-ABCD-5678-EFGH-90IJ",
        Server: "https://abc.xyz.com/api",
        Username: "username",
        Password: "password"
    }

    var cfg = ajsCache.getObject('AJS_CONFIG');
	if (cfg) {
        self.Config = cfg;
	}

    self.updateConfig = function(cfg) {
        cfg = JSON.parse(JSON.stringify(cfg));
        if (cfg.Server.indexOf("/api") != (cfg.Server.length - 5)) {
            cfg.Server += "/api";
        }
        self.Config = cfg;
        ajsCache.setObject('AJS_CONFIG', cfg);
    };

    self.relogin = function (onSuccess, onError) {
        $http.get(self._url + "user").then(
            function (res) {
                onSuccess(res.data);
            },
            onError
        );
    };

    self.login = function (data, onSuccess, onError) {
        // TODO: login to SureMDM
        self.Config.Username = data.username;
        self.Config.Password = data.password;
        onSuccess(data);
        // $http.post(self._url + "user/login", data).then(
		// 	function (res) {
		// 	    onSuccess(res.data);
		// 	},
        //     onError
		// );
    };

    self.logout = function (onDone) {
        $http.get(self._url + "user/logout").then(
            function (res) {
                onDone()
            },
            onDone
        );
    };

    self.getAvailableDevices = function(onDone) {
        $http.get(self._url + "logclients").then(function(r){
            onDone(r.data);
        }, function() {
            onDone([]);
        });
    };

    self.subscribe = function (id, onDone) {
        if (!id) {
            onDone(null);
            return;
        }
        $http.post(self._url + "subscribe", {id: id}).then(
            function(r) {
                onDone(r.data);
            }, 
            function(r) {
                onDone(null);
            }
        );
    }; 

    self.unsubscribe = function (id, onDone) {
        if (!id) {
            onDone(null);
            return;
        }
        $http.post(self._url + "unsubscribe", {id: id}).then(
            function(r) {
                onDone(r.data);
            }, 
            function(r) {
                onDone(null);
            }
        );
    }; 

    self.changePassword = function (data, onSuccess, onError) {
        $http.post(self._url + "user/changepassword", data).then(
            function (res) {
                onSuccess(res.data);
            },
            onError
        );
    }; 

    self.resetPassword = function (data, onSuccess, onError) {
        $http.post(self._url + "messages/sms", data).then(
            function (res) {
                onSuccess(res.data);
            },
            onError
        );
    };

    self.getContacts = function (onDone) {
        $http.get(self._url + "users?xme=true").then(function (res) { onDone(res.data); });
    };

    self.addUser = function (data, onSuccess, onError) {
        $http.post(self._url + "user/add", data).then(
			function (res) {
				onSuccess(res.data);
            },
            onError
		);
    };

    self.updateUser = function (data, onSuccess, onError) {
        $http.post(self._url + "user/update", data).then(
            function (res) {
                onSuccess(res.data);
            },
            function (err) {
                onError(err.status + " - " + err.statusText);
            }
        );
    };

    self.getMessages = function(roomId, onDone) {
        $http.get(self._url + "messages?roomId="+roomId).then(function (res) {
            onDone(res.data);
        });
    };

    self.sendMessage = function(toId, msg, onDone) {
        $http.post(self._url + "messages/add", {to_id: toId, body: msg}).then(
            function (res) {
                onDone(res.data);
            },
            function (err) {
                onDone(err.status + " - " + err.statusText);
            }
        );
    };

    self.deleteMessage = function(msgId, onDone) {
        $http.post(self._url + "messages/delete/" + msgId).then(
            function (res) {
                onDone(res.data);
            },
            function (err) {
                onDone(err.status + " - " + err.statusText);
            }
        );
    };

    self.setAllNewMessagesViewed = function(roomId, onDone) {
        $http.get(self._url + "messages/setviewedall?roomId=" + roomId).then(
            function (res) {
                if(onDone) onDone(res.data);
            },
            function (err) {
                if(onDone) onDone(err.status + " - " + err.statusText);
            }
        );
    };

    self.getRooms = function(onDone) {
        $http.get(self._url + "rooms").then(
            function (res) {
                onDone(res.data);
            },
            function (err) {
                onDone(err.status + " - " + err.statusText);
            }
        );
    };    

    self.getRoomWith = function(users, onDone) {
        $http.post(self._url + "roomwith", {users: users}).then(
            function (res) {
                onDone(res.data);
            },
            function (err) {
                onDone(null);
            }
        );
    };    

    self.createRoom = function(users, onDone) {
        $http.post(self._url + "room/add", {users: users}).then(
            function (res) {
                onDone(res.data);
            },
            function (err) {
                onDone(err.status + " - " + err.statusText);
            }
        );        
    }

    
}]);

