package com.teamgaithersburg.rest.controllers;

import com.teamgaithersburg.model.CommunityTopic;
import com.webobjects.appserver.WOActionResults;
import com.webobjects.appserver.WORequest;
import com.webobjects.foundation.NSArray;

import er.extensions.eof.ERXKeyFilter;
import er.rest.routes.ERXDefaultRouteController;

public class CommunityTopicController extends BaseRestController {

	public CommunityTopicController(WORequest request) {
		super(request);
	}

	protected ERXKeyFilter filter() {
		ERXKeyFilter filter = ERXKeyFilter.filterWithAttributes();
		filter.setUnknownKeyIgnored(true);
		return filter;
	}
	
	// http://127.0.0.1:51640/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.json
	// http://127.0.0.1:51640/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.html
	// http://127.0.0.1:51640/cgi-bin/WebObjects/TeamGaithersburgServer.woa/ra/communityTopics.xml
	@Override
	public WOActionResults indexAction() throws Throwable {
		NSArray<CommunityTopic> entries = CommunityTopic.fetchAllCommunityTopics(
				editingContext(), CommunityTopic.SORT_ORDER.ascs());
	    return response(entries, filter());
	}

}
