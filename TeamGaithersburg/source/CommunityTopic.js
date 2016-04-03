enyo.kind({
	name: "CommunityTopic",
	kind: "Component",
	events: {
		onResults: ""
	},
	url: "http://127.0.0.1:60242/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.json",
	search: function() {
		var params = {format: "json"};
		var req;
		params.nojsoncallback = 1;
		req = new enyo.Ajax({url: this.url, handleAs: "text"})
			.response(this, "processAjaxResponse")
			.go(params);
		return req;
	},
	processAjaxResponse: function(inSender, inResponse) {
		inResponse = enyo.json.parse(inResponse);
		this.doResults(inResponse);
		return inResponse;
	}
});
