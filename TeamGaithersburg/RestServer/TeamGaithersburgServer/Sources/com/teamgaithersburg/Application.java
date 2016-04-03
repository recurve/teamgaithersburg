package com.teamgaithersburg;

import er.extensions.appserver.ERXApplication;
import er.rest.routes.ERXRoute;
import er.rest.routes.ERXRouteRequestHandler;
import com.teamgaithersburg.components.Main;
import com.teamgaithersburg.model.CommunityTopic;
import com.teamgaithersburg.rest.controllers.PagesController;

public class Application extends ERXApplication {
	public static void main(String[] argv) {
		ERXApplication.main(argv, Application.class);
	}

	public Application() {
		ERXApplication.log.info("Welcome to " + name() + " !");
		/* ** put your initialization code in here ** */
		setAllowsConcurrentRequestHandling(true);
		
		ERXRouteRequestHandler restRequestHandler = new ERXRouteRequestHandler();

		restRequestHandler.insertRoute(new ERXRoute("Pages", "", ERXRoute.Method.Get, PagesController.class, "mainPage"));

	    restRequestHandler.addDefaultRoutes(CommunityTopic.ENTITY_NAME);

		ERXRouteRequestHandler.register(restRequestHandler);
	    setDefaultRequestHandler(restRequestHandler);
	}
}