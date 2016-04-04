enyo.kind({
	name: "Viewer",
	kind: "Panels",
	classes: "panels-sample-flickr-panels enyo-unselectable enyo-fit",
	arrangerKind: "CollapsingArranger",
	components: [
		{layoutKind: "FittableRowsLayout", components: [
			{kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
				{name: "item", ontap: "itemTap", classes: "panels-sample-flickr-item enyo-border-box", components: [
					/*{name: "thumbnail", kind: "Image", classes: "panels-sample-flickr-thumbnail"},*/
					{name: "title", allowHtml: true, classes: "panels-sample-flickr-title"}
				]},
			]}
		]},
		{name: "pictureView", fit: true, kind: "FittableRows", classes: "enyo-fit panels-sample-flickr-main", components: [
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back to Topics", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", name: "detailScroller", kind: enyo.Scroller, classes: "detailScroller", components: [
				{name: "topicImage", kind: "Image", showing: false,  
					classes: "panels-sample-flickr-center"},
				{name: "topicDetails", allowHtml: true, showing: false, classes: "panels-sample-flickr-center"},
				{name: "topicFooterImage", kind: "Image", showing: false,  
					classes: "panels-sample-flickr-center"}
			
			]}
		]},
		{name: "communityTopicFetch", kind: "CommunityTopic", onResults: "communityTopicResults"}
	],
	rendered: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.search();
		};
	}),
	reflow: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			var backShowing = this.$.backToolbar.showing;
			this.$.backToolbar.setShowing(enyo.Panels.isScreenNarrow());
		};
	}),
	search: function() {
		this.page = 0;
		this.results = [];
		this.$.communityTopicFetch.search();
	},
	communityTopicResults: function(inSender, inResults) {
		this.results = this.results.concat(inResults);
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
		this.tapDefaultTopic();		
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.title.setContent(item.title || "Untitled");
		return true;
	},
	itemTap: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}

		var item = this.results[inEvent.index];
		
		this.$.topicImage.setSrc(item.detailsImage || "assets/together_we_can.jpg");
		this.$.topicImage.show();

		this.$.topicDetails.setContent(item.details || "Untitled");
		this.$.topicDetails.show();
		
		if (item.topicFooterImage) {
			this.$.topicFooterImage.setSrc(item.topicFooterImage);
			this.$.topicFooterImage.show();
		} else {
			this.$.topicFooterImage.hide();
		}
		
		this.$.detailScroller.scrollTo(0, 0);
		
		this.setLastVisitedTopicIndex(inEvent.index);
	},
	lastVisitedTopicIndex: function() {
	},
	setLastVisitedTopicIndex: function(index) {
		var db = Lawnchair({name : 'db'}, function(store) {
			store.save({key:"lastVisitedTopicIndex", value:index});
		});
	},
	tapDefaultTopic: function() {
		// Because lawnchair is async, we must put all actions that we want to take place in its callback.
		// This also means that we need to scope "this" and pass in the method we want to call using "enyo.bind"
		var itemTapMethod = enyo.bind(this, "itemTap");
		var db = Lawnchair({name : 'db'}, function(store) {

			store.get("lastVisitedTopicIndex", function(obj) {
				var lastVisitedTopicIndex = null;
				if (obj && obj.value) {
					lastVisitedTopicIndex = obj.value;
				}

				if ( ! lastVisitedTopicIndex) {
					lastVisitedTopicIndex = 0; // set a default
				}

				itemTapMethod({}, {index: lastVisitedTopicIndex});
			});
		});
	},
	showList: function() {
		this.setIndex(0);
	},
	mailTo: function(email, subject, body) {
		var mailLink = "<a href=\"mailto:" + email + "?bcc=aaron@chatnbike.com&amp;Subject=" + subject.replace("/ /g","%20") + "&body=" + body.replace("/ /g","%20") + "%0D%0A%0D%0A\">" + email + "</a>";
		return mailLink;
	}
});
