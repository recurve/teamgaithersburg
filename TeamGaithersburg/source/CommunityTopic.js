enyo.kind({
	name: "CommunityTopic",
	kind: "Component",
	events: {
		onResults: ""
	},
	// for connecting to WO Rest app running locally
//	url: "http://127.0.0.1:60242/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.json",

	// for connecting using relative path when installed on server
//	url: "/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.json",

	// for connecting directly
	url: "http://teamgaithersburg.org/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.json",
	search: function() {
		var params = {};
		var req;
		req = new enyo.Ajax({url: this.url, handleAs: "text"})
			.response(this, "processAjaxResponse")
			.error(enyo.bind(this, function(inSender, inResponse) {
				// Because lawnchair is async, we must put all actions that we want to take place in its callback.
				// This also means that we need to scope "this" and pass in the method we want to call using "enyo.bind"
				var doResultsMethodBoundToThis = enyo.bind(this, "doResults");
				var db = Lawnchair({name : 'db'}, function(store) {
					store.get("communityTopicsResults", function(obj) {
						var communityTopicsResults = null;
						if (obj && obj.value) {
							communityTopicsResults = obj.value;
						}

						if ( ! communityTopicsResults) {
							communityTopicsResults = []; // set a default
						}

						doResultsMethodBoundToThis(communityTopicsResults);
					});
				});
			}))
			.go(params);
		return req;
	},
	processAjaxResponse: function(inSender, inResponse) {
		inResponse = enyo.json.parse(inResponse);
		this.doResults(inResponse);
		var db = Lawnchair({name : 'db'}, function(store) {
			store.save({key:"communityTopicsResults", value:inResponse});
		});
		return inResponse;
	}
});
