enyo.kind({
	name: "Search",
	kind: "Component",
	published: {
		searchText: ""
	},
	events: {
		onResults: ""
	},
	url: "https://api.flickr.com/services/rest/",
	pageSize: 200,
	api_key: "2a21b46e58d207e4888e1ece0cb149a5",
	search: function(inSearchText, inPage) {
		this.searchText = inSearchText || this.searchText;
		var i = (inPage || 0) * this.pageSize;
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: this.api_key,
			per_page: this.pageSize,
			page: i,
			text: this.searchText
		};
		var req;
		if (window.location.protocol === "ms-appx:") {
			params.nojsoncallback = 1;
			// Use ajax for platforms with no jsonp support (Windows 8)
			req = new enyo.Ajax({url: this.url, handleAs: "text"})
				.response(this, "processAjaxResponse")
				.go(params);
		} else {
			req = new enyo.JsonpRequest({url: this.url, callbackName: "jsoncallback"})
				.response(this, "processResponse")
				.go(params);
		}
		return req;
	},
	processAjaxResponse: function(inSender, inResponse) {
		inResponse = enyo.json.parse(inResponse);
		this.processResponse(inSender, inResponse);
	},
	processResponse: function(inSender, inResponse) {
		var photos = inResponse.photos ? inResponse.photos.photo || [] : [];
		for (var i=0, p; (p=photos[i]); i++) {
			var urlprefix = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret;
			p.thumbnail = urlprefix + "_s.jpg";
			p.original = urlprefix + ".jpg";
		}
		this.doResults(photos);
		return photos;
	}
});
