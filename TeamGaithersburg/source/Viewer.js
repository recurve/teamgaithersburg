enyo.kind({
	name: "Viewer",
	kind: "Panels",
	classes: "panels-sample-flickr-panels enyo-unselectable enyo-fit",
	arrangerKind: "CollapsingArranger",
	components: [
		{layoutKind: "FittableRowsLayout", components: [
			/*
			{kind: "onyx.Toolbar", components: [
				{kind: "onyx.InputDecorator", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", value: "Golden Campine Rooster", onchange: "search"},
					{kind: "Image", src: "assets/search-input-search.png"}
				]},
				{name: "searchSpinner", kind: "Image", src: "assets/spinner.gif", showing: false}
			]},
			*/
			{kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
				{name: "item", ontap: "itemTap", classes: "panels-sample-flickr-item enyo-border-box", components: [
					/*{name: "thumbnail", kind: "Image", classes: "panels-sample-flickr-thumbnail"},*/
					{name: "title", allowHtml: true, classes: "panels-sample-flickr-title"}
				]},
				/*
				{name: "more", components: [
					{kind: "onyx.Button", content: "more photos", classes: "onyx-dark panels-sample-flickr-more-button", ontap: "more"},
					{name: "moreSpinner", kind: "Image", src: "assets/spinner.gif", classes: "panels-sample-flickr-more-spinner"}
				]}
				*/
			]}
		]},
		{name: "pictureView", fit: true, kind: "FittableRows", classes: "enyo-fit panels-sample-flickr-main", components: [
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", name: "detailScroller", kind: enyo.Scroller, classes: "detailScroller", components: [
				{name: "topicImage", kind: "Image", showing: false,  
					classes: "panels-sample-flickr-center"},
				{name: "topicDetails", allowHtml: true, showing: false, classes: "panels-sample-flickr-center"},
				{name: "topicFooterImage", kind: "Image", showing: false,  
					classes: "panels-sample-flickr-center"}
			
				/*{name: "flickrImage", kind: "Image", showing: false, onload: "imageLoaded", onerror: "imageLoaded", 
					classes: "enyo-fit panels-sample-flickr-center panels-sample-flickr-image"},*/
				/*{name: "imageSpinner", kind: "Image", src: "assets/spinner-large.gif", showing: false, 
					classes: "enyo-fit panels-sample-flickr-center"}*/
			]}
		]},
		{name: "flickrSearch", kind: "Search", onResults: "searchResults"}
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
		//this.searchText = this.$.searchInput.getValue();
		this.page = 0;
		this.results = [];
		//this.$.searchSpinner.show();
		//this.$.flickrSearch.search(this.searchText);
		this.teamGaithersburgResults();
	},
	teamGaithersburgResults: function() {
		//this.$.searchSpinner.hide();
		//this.$.moreSpinner.hide();
		
		this.loadGaithersburgData();
		
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	searchResults: function(inSender, inResults) {
		this.$.searchSpinner.hide();
		this.$.moreSpinner.hide();
		this.results = this.results.concat(inResults);
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		//this.$.thumbnail.setSrc(item.thumbnail);
		this.$.title.setContent(item.title || "Untitled");
		//this.$.more.canGenerate = !this.results[i+1];
		return true;
	},
	more: function() {
		this.page++;
		this.$.moreSpinner.show();
		this.$.flickrSearch.search(this.searchText, this.page);
	},
	itemTap: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
		//this.$.imageSpinner.show();
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
		
		/*
		if (item.original == this.$.flickrImage.getSrc()) {
			this.imageLoaded();
		} else {
			this.$.flickrImage.hide();
			this.$.flickrImage.setSrc(item.original);
		}*/
		
	},
	imageLoaded: function() {
		var img = this.$.flickrImage;
		img.removeClass("tall");
		img.removeClass("wide");
		img.show();
		var b = img.getBounds();
		var r = b.height / b.width;
		if (r >= 1.25) {
			img.addClass("tall");
		} else if (r <= 0.8 ) {
			img.addClass("wide");
		}
		this.$.imageSpinner.hide();
	},
	showList: function() {
		this.setIndex(0);
	},
	mailTo: function(email, subject, body) {
		var mailLink = "<a href=\"mailto:" + email + "?bcc=aaron@chatnbike.com&amp;Subject=" + subject.replace("/ /g","%20") + "&body=" + body.replace("/ /g","%20") + "%0D%0A%0D%0A\">" + email + "</a>";
		return mailLink;
	},
	loadGaithersburgData: function() {
		this.results = [
			{title: "Team Gaithersburg", 
				detailsImage: "assets/team_drink.jpg",
				topicFooterImage: "assets/together_we_can.jpg",
				details: "<p>Team Gaithersburg</p>" +
				"<p>When citizens become neighbors they can create an impact.</p>" + 
				"<p><a href=\"https://rallyhood.com/rallies/23387\">Join our &ldquo;Rallyhood.&rdquo;</a> It is a modern mailing list where you can post, share, and read all previous messages</p>" + 
				"<p>Saddened by the status quo, we are a group of concerned neighbors demanding change. We want to find out what happens when an irresistible force (neighbors united) meets an immovable object (local government). When the dust settles, we'll learn nothing is truly irresistible nor immovable, things only appear that way until you dig into the root cause. It's time to hold our local government accountable. It's time to stop letting career politicians use their time governing our great city as merely a stepping stone on their way to the Senate. Leading our city means more than embellishing their resume, they must work to enhance our quality of life. </p>" + 
				"<p>How will we hold our local city government accountable? By holding fast to the issues that matter most and educating our neighbors about what is going on. We won't let our City Council forget the big picture. If they don't change their ways, we'll vote them out of office in the next election cycle.</p>" + 
				"<p>When you cannot get the simple issues right… like coming to someone’s home when they ask for help, forcing them to make a public spectacle before they leave you alone… digging in their heels and refusing to make amends… that’s when you realize that there is no hope in getting the &ldquo;big&rdquo; issues right such as our schools and transportation. The entire purpose of having a &ldquo;city&rdquo; is so we can have more control than what the county allows us. If we are nothing more than a &ldquo;yes-man&rdquo; for the county, there is little point in having a city. Our city taxes are only useful when we mobilize to create a difference we can feel in our quality of life. Things like leaf and and branch pickup are a useful benefit. </p>" + 
				"<p>Who are we? Anyone can join us and bring up issues that must be addressed and resolved which aren't getting the attention they deserve.</p>" +
				"<h2>We welcome our city council to respond to our concerns. We will post their official stance on each line item if and when we receive them.</h2>" + 
				"<p>Aaron Rosenzweig <a href=\"mailto:aaron@chatnbike.com\">aaron@chatnbike.com</a> - I'm a family man who never really cared about city politics until he was directly impacted by it, now I know too much about the realities of our local government. The city threatened to take our children away with child protective services because a citizen didn't like our choice of pets. I refuse to sit idly by while our way of life is ruined. I'm not chicken to speak the truth, even when it hurts. <a href=\"https://www.change.org/p/city-of-gaithersburg-maryland-lift-rooster-ban\">Learn my story and please sign my petition</a></p>"  + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Team Gaithersburg", 
					"I support TeamGaithersburg.org and will also hold you accountable for your actions (and inactions)") + 
				"</p>"
			}, 
			
			{title: "Public Comments", 
				detailsImage: "assets/comments.jpg",
				details: "<p>City Hall: 31 S Summit Ave, Gaithersburg, MD 20877</p>" + 
				"<p>Please come to City Hall and attend a meeting. Even if you don't speak at the meeting every neighbor should go to City Hall at least once to know what it is about. Honestly, hardly anyone ever attends these meetings, that is why bad things happen because few people are watching. </p>" + 
				"<p>Generally the public is allowed to speak for 3 minutes about any topic. This is only allowed twice a month on both the first and third mondays of the month. Note: It's not a perfect rule. If a holiday falls on one of those Mondays the city will often move the meeting to another day, like a Tuesday.</p>" + 
				"<p>You will want to find meetings named &ldquo;Mayor and City Council Regular Session&rdquo; - When you view the online &ldquo;Agenda&rdquo; there will be a section named &ldquo;public comments.&rdquo; Use <a href=\"http://www.gaithersburgmd.gov/government/meeting-agendas-and-minutes\">this link to published Gaithersburg city meetings</a> to double check the dates. Note: you have to scroll down to the bottom of the page and &ldquo;wait&rdquo; for about 5 seconds before the meetings and dates will appear. It is a technical issue, the website is not designed all that well. </p>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Team Gaithersburg", 
					"I plan to attend the next City Hall Meeting") + 
				"</p>" + 
				"<p>Right now Gaithersburg schools do not belong to the city, they belong to the county and are managed by Montgomery County Public Schools. If you want to advocate for serious change in our city schools, you must attend the County Board of Education meetings.</p>" + 
				"<p>How Montgomery Board of Education public comments work (aka: BOE):</p>" +
				"<ol>" + 
				"<li>Look at the bottom of this page for a calendar: <a href=\"http://www.montgomeryschoolsmd.org/boe/meetings/\">BOE calendar</a></li>" + 
				"<li>Look for &ldquo;All-day Business Meeting&rdquo; or &ldquo;Evening Business Meeting&rdquo;</li>" + 
				"<li>Register the Monday of that week to get one of fifteen 3 minute time slots. Registration opens that Monday at 11:00 am, phone this number for Board of Education: 301-279-3617</li>" + 
				"<li>Look the &ldquo;Friday before&rdquo; the date of the session to see the finalized agenda</li>" + 
				"<li>Read and understand the &ldquo;Public Comments at Board Meetings&rdquo; portion of this page: <a href=\"http://www.montgomeryschoolsmd.org/boe/community/participation.aspx\">community participation</a></li>" + 
				"</ol>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("boe@mcpsmd.org", "Team Gaithersburg", 
					"I plan to attend the next Board of Education meeting") + 
				"</p>"				
			}, 

			{title: "Fix our schools",
				detailsImage: "assets/SchoolOvercrowding.jpg",
				details: "<p>Overcrowded and 150% overcapacity. New housing development continues. This is hurting our private housing values and our children deserve better. <a href =\"https://www.change.org/p/city-of-gaithersburg-limit-gaithersburg-school-overcrowding-to-110\">Sign the petition!</a></p>" + 
				"<p>In 2015 our local government voted to increase our overcapacity limits from 110% to 150% so that more houses can be built. This means 1/3 of students will be in temporary structures outside of the main school building. It's very shortsighted. The city gets immediate revenue from more citizens moving in which creates more tax dollars for them to spend. In the long run our house values will be hurt because good families do not want to move into a city with overcrowded schools.</p>" + 
				"<p>Our city council says they've done well because there is a special tax they'll collect when developers build housing that causes overcrowding. Interesting! but nowhere can we find that the amount of tax they raise from developers is enough to do anything with. To make matters worse, there is no direction on how and when that money will be spent other than if it is not spent, it will go back to the housing developers.</p>" + 
				"<p>It is obvious that our local government is either unwilling or unable to improve our schools. Something has to change.</p>" + 
				"<p>The county simply does not have the funding to build schools as fast as Gaithersburg is building housing. </p>" + 
				"<p>We should look into what it would take to break off from MCPS (Montgomery County Public Schools). How much will it cost to buy the current buildings from MCPS and roll our own school system? </p> " + 
				"<p>The county is determined to raise our taxes on a bus system called the CCT (Corridor Cities Transitway) in addition to the Ride-On buses we already have which are hardly used. Why not cancel the CCT and spend the money on our schools? If you think education is expensive, try ignorance. </p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(stop annexation and housing development) - <a href =\"https://www.change.org/p/city-of-gaithersburg-limit-gaithersburg-school-overcrowding-to-110\">Sign the petition!</a> We cannot continue building homes faster than the county can build schools. It's already too late and we are not slowing down! Gaithersburg children are going to have to be bussed out of the city in the near future because the schools are overcrowded. No more! Every neighbor must come to city hall to voice their concern. Stop the insanity.</li>" +
				"<li>(easy but imperfect) - Allow a child to transfer to any underutilized school if their home school is overcrowded. Only parents capable of driving to the new location can do this but for those that can it's better than staying in a crowded environment.</li>" +
				"<li>(costly but worth it) - We want a dollar amount on how much it would cost to build out the schools in Gaithersburg and build the new High School on new ground. Can the city of Gaithersburg foot the bill? How much of a tax increase might we need to pull this off in 1 to 2 years?</li>" +
				"<li>(ultimate) - Break off from MCPS and make our own school system. It's no secret that Gaithersburg schools are not rated highly. The best way to ensure an increase in home values is with a strong school system. The only way to make that happen is to take ownership of our schools at the city level. </li>" +
				"</ol>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://youtu.be/tOp-WSPS3Xs\">The county is straight with us. The county does not have enough money to build more schools. Gaithersburg will not get any schools built and children will be bussed out of Gaithersburg. We are building houses too fast.</a></li>" +
				"<li><a href=\"https://youtu.be/-6eQLflMvUA\">Gaithersburg has plenty of cash, but we aren't investigating how we can build more schools with it, we'd rather the county do that but that's not practical.</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ#t=22m30s\">Watch Council Member Neil Harris prevent our neighbors from voicing their ideas about school overcrowding and Aaron asking him to be a man</a></li>" + 
				"<li><a href=\"http://mcpsmd.swagit.com/play/11122015-1062\">See our council talk and talk at county board meetings but nothing ever happens</a></li>" +
				"<li><a href=\"http://thesentinel.com/mont/newsx/local/item/2384-gaithersburg-studies-adequate-public-facilities-ordinance\">150% overcrowding reported by Sentinel Newspaper</a></li>" +
				"<li><a href=\"http://towncourier.com/proposed-apfo-amendment-suggests-local-fix-for-schools/\">150% overcrowding reported by Gaithersburg Courier Newspaper</a></li>" +
				"<li><a href=\"http://parentscoalitionmc.blogspot.com/2015/09/what-is-staff-confidence-level-that.html\">150% overcrowding reported by Parents' Coalition</a></li>" +
				"<li><a href=\"http://gaithersburgmd.gov/~/media/city/documents/government/city_projects/ctam_7036_2015/exhibits_001_005.pdf\">150% overcrowding the actual changes to Gaithersburg regulations</a></li>" +
				"<li><a href=\"http://gaithersburgmd.gov/~/media/city/documents/government/city_projects/ctam_7036_2015/exhibits_011_015.pdf\">150% overcrowding Gaithersburg's PowerPoint presentation</a></li>" +
				"<li><a href=\"http://thesentinel.com/mont/newsx/local/item/2779-mcps-students-perform-poorly-on-state-tests\">More than half of the students in Montgomery County failed the state's math exam. I wonder why? Maybe because we value business interests rather than our children's interests?</a></li>" +
				"<li><a href=\"http://www.boarddocs.com/mabe/mcpsmd/Board.nsf/goto?open&id=A4YSFH63C580\">Aaron thanks the school system for allowing modern keyboards on standardized tests (PDF is there and TV Icon shows video of speech)</a></li>" +
				"</ol>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Fix our schools", 
					"I am against the 150% overcrowding you approved for our schools. I'm very upset, how could you do this to our community?") + 
				"</p>"
			}, 
			
			{title: "Stop Corridor Cities Transitway",
				detailsImage: "assets/bus-in-traffic.jpg",
				details: "<p>The CCT (Corridor Cities Transitway) is a &ldquo;not so rapid transit&rdquo; which will raise our taxes, create more congestion, remove homes through eminent domain and worse - yet we are doing nothing to stop it. We already have Ride-On buses that cover these routes that are underutilized</p>" + 
				"<p>The idea is to connect Shady Grove to Clarksburg by messing up Gaithersburg. Muddy branch will be widened and Great Seneca Highway will become further congested by these busses and additional traffic lights on what is already a pickle point.</p>" +
				"<p>No citizen wants the CCT, it is a power play by developers and politicians. First the CCT must be built and then Johns Hopkins will destroy Belward Farm on Muddy Branch. Our neighbor whose house will be taken during the widening of Muddy Branch is now stuck and cannot retire! They told him they would take his house in 2016, then they said 2018, now they say they are not sure when because they have no money. He has no way to sell his home and continue his life.</p>" + 
				"<p>To finish this project the county will have to raise taxes. They have tried to create a special task force called the &ldquo;Independent Transit Authority&rdquo; which would have the authority to create whatever tax hikes they see fit without a public hearing.</p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(easy and immediate) - Purchase the citizen's home that is scheduled to be demolished to make the CCT. Rent the home to that citizen or someone else. The city can sell it to the county when, and if, the CCT is built.</li>" +
				"<li>(practical) - public hearing to stop the CCT from going through Gaithersburg. We don't have to change the flavor of our city to meet the county's demands. </li>" +
				"<li>(ethical) - purchase the Belward farm from JHU and revitalize it. The Belward family wanted the land to be used to make a school. Either make a school or run it as a real farm. Our city's history included over 400 dairy farms that are no more. Everyone would like true local produce and students would have excellent educational experiences on day trips to a city owned farm. Ideally it could be a farmed animal sanctuary and also vegetable producing resource. </li>" +
				"</ol>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://youtu.be/-6eQLflMvUA\">Gaithersburg has plenty of cash. We should buy the home that is in limbo. It will be purchased by county government when they fund the CCT but when will that be? Our neighbor is stuck. Let's help our neighbor so he can retire and offload his nest egg. </a></li>" +
				"<li><a href=\"http://wpo.st/wB_w0\">Belward farm - the sad truth</a></li>" +
				"<li><a href=\"http://www.scale-it-back.com\">Scale it back</a></li>" +
				"<li><a href=\"http://beyonddc.com/log/?p=73\">Beyond DC</a></li>" +	
				"<li><a href=\"http://wpo.st/aHen0\">Independent Transit Authority - taxing without a hearing</a></li>" + 
				"<li><a href=\"https://www.facebook.com/sensibleCCT/?fref=ts\">Sensible CCT</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Stop the CCT", 
					"I do not want the CCT. I believe it will create more congestion and raise our taxes for no good reason. Better to spend that money fixing our schools. Please prevent the CCT from passing through Gaithersburg. ") + 
				"</p>"
				},

			{title: "Revitalize Olde Towne", 
				detailsImage: "assets/olde_towne.jpg",
				details: "<p>Not enough love in revitalizing our Olde Towne. Local government says they’ll improve Olde Towne but always go for new development instead.</p>" 	+ 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li><a href=\"assets/GaithCitizensPlan_Frederick_Avenue_Corridor.pdf\">Citizens' plan</a> That is a link to the well organized plan for Olde Towne that citizens have tried to bring to life since 2011. The city has completely ignored the proposal and have removed all manner of links to this document from the city's website. </li>" +
				"</ol>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Revitalize Olde Towne First", 
					"Olde Towne needs help. I want you to stop developing other parts of Gaithersburg until you put effort into Olde Towne. ") + 
				"</p>"
			}, 
			
			{title: "Overdevelopment", 
				detailsImage: "assets/Overdevelopment.jpg",
				details: "<p>The semi-rural feel of our city has almost disappeared. Our green spaces are few and rare. If we keep going down this path we will end up being another Baltimore City. Who wants that? The majority of citizens want a light suburban feel with good food and convient shopping. We do not want a concrete jungle without even a place to let our dogs run. </p>" +
				"<p> Local government have not asked citizens for input on what the big picture should be. Local government has not asked us what the upper limit on our city population should be. Local government has not asked us, &ldquo;How many people are too many people&rdquo; Instead they go for the power plays by wealthy developers</p> " + 
				"<p> How do we want our city to feel, what quality of life is important to us? This is a conversation we must have before it is too late</p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(sensible) - Stop building homes until our schools are large enough to hold the students. Stop annexing new land for the purpose of making homes. Stop approving new housing development. Schools first!</li>" +
				"<li>(practical) - Public hearing with a real plan for what the ideal Gaithersburg lifestyle should be. Do we want to be a large city with little green space or a suburban community? The original vision of Gaithersburg has been lost and citizens are no longer involved. Let's all get involved!</li>" +
				"</ol>" + 
				"Learn more: <ol>" +
				"<li><a href=\"http://towncourier.com/concerned-residents-testify-against-johnson-annexation/\">Gaithersburg wants to annex another 25 acres to create more housing and tax revenue to continue overcrowding our schools</a></li>" +
				"</ol>"	+
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Overdevelopment", 
					"Our City has no debt, so why do you continuously push for overdevelopment? Are our tax dollars not enough for you that you must find new residents? Why do you even entertain the thought of the Johnson annexation? That will only overcrowd our schools and create even more congestion. Let the county do what it will but cease and desist the overdevelopment of Gaithersburg. ") + 
				"</p>"				
			}, 

			{title: "Dog Park repurposed", 
				detailsImage: "assets/dogpark.jpg",
				details: "<p>Our local government changed the rules for our dog park without involving our citizens. Their end game is to reduce usage so that they can &rdquo;repurpose it for something else.&ldquo;</p>" +
				"<p>Friendships were broken. People who used to go to the park were kicked out. I guess we are just running out of green space. Listen to how the City Manager says: &ldquo;usage just goes down so we can repurpose the dog park for something else&rdquo;: <a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ#t=3m33s\">watch the video</a></p>" +
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(ethical) - Put the ordinance back the way it was. Most citizens were happy with it before the city changed it without involving the community.</li>" +
				"</ol>" + 
				"Official response from City government: <ol>" +
				"<li><a href=\"assets/Dec_7_2015_dog_park_ammendment_5211912072015115801317.pdf\">The currently proposed changes to our dog park ordinance</a></li>" +
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Dog Park", 
					"I am appalled by your secret motives for the dog park. It is egregious that you did not look for citizen input before you changed the rules for the dog park. You are not doing what I expect from you. ") + 
				"</p>"				
			}, 

			{title: "Control &ldquo;Animal Control&rdquo;", 
				detailsImage: "assets/animal_control.jpg",
				topicFooterImage: "assets/gallina_gnomo.jpg",
				details: "<p>City resources are being used to harass citizens but local government has done nothing to prevent it. If you don’t like someone, you can use taxpayer resources to wreak havoc on the innocent.</p>" + 
				"<p>Have a parking spot that you fight over with your neighbor? Do you have a dog? Do you have kids? If you answered &ldquo;Yes&rdquo; to those questions then watch out. According to Lisa Holland, the director of Animal Control, your neighbor will say your dog bit them or that you spank your kids and the city will &ldquo;take care of it because that is what we do.&rdquo;</p>" + 
				"<p>Please, don't be scared, if you have been harassed by the city please step forward and share your story. We can put an end to this type of abuse.</p>" +
				"<p>If the city council was honest about this and cared to stop it, they would audit all dog bite reports and all child services calls. They would ask an independent party to analyze and report how many calls were fraudulent.</p>" + 
				"<p>It happened to Aaron Rosenzweig. The city constantly harassed him and eventually threatened him with child support services taking his children away. Why? because someone in the greater community did not like their choice of pets. David and Faith Roseman used taxpayer resources to do the unthinkable all the while he drove by photographing Aaron's kids and flipping them &ldquo;the bird.&rdquo; David is treasurer of NARFE and United Seniors of Maryland, somehow his voice was heard rather than go through a process of public hearing. </p>" + 
				"<p>When Aaron started testifying at public hearings, the harassment suddenly stopped but the city refuses to apologize and refuses to fix the problems in our code enforcement.</p>" +  

				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" + 				
				"<li>(easy) - Grant Aaron a permit to keep a non-crowing rooster.</li>" +
				"<li>(ethical) - Admit they made a mistake in 2010 when they changed our laws in a way that benefits nobody yet leads to conflict. Look at the <a href=\"assets/no_crowing_rooster.jpg\">2009 law</a> that was fair to everyone (scanned from ordinances Lisa Holland gave Aaron)</li>" +
				"<li>(ethical) - Make a public apology for not respecting the Rosenzweig family as true citizens and forcing them to build a privacy fence.</li>" +
				"<li>(transparency) - Audit all dog bite claims in the last 5 years to determine how many were fraudulent abuse over trivial issues like car parking</li>" +
				"<li>(transparency) - Publish the results of the city's secret investigation of Animal Control for all to see</li>" +
				"<li>(transparency) - Explain what, if any, corrective action was taken to prevent future abuse of process</li>" +
				"</ol>"	+ 

				
				"<p>Aaron has received email from the Mayor asking him to give up his right to free speech. The mayor, Jud Ashman, has even visited Aaron's home with the express purpose of saying &ldquo;Man to man, let sleeping dogs lie.&rdquo; What does the City have to hide? Oh yes, here it is, the blog post that Mayor Ashman has deleted from his website: <a href=\"http://liftroosterban.com/file/Jud_Ashman_Roosters.pdf\">2010 Rooster ban was the one mistake the council made that year</a> </p>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://www.change.org/p/city-of-gaithersburg-maryland-lift-rooster-ban\">Please listen to Aaron's story and sign his petition</a></li>" +
				"<li><a href=\"http://liftroosterban.com\">Rooster collars</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=Rd6hcfDNg1I\">Neighbors defending chickens</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=m8v4kNg6OVk\">&ldquo;I have a dream&rdquo;</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=U5SfVT-LRMY#t=2m43s\">Ryan &ldquo;Temper Tantrum&rdquo; Spiegel breaks radio silence</a>" + 
					"<ol>" + 
						"<li>Ryan phoned Aaron to say the city should have a hidden &ldquo;Standard Operating Procedure&rdquo; (SOP) to help guide city staff when issues of chickens arise and would include me in the discussion.</li>" + 
						"<li>Aaron did not &ldquo;torpedo&rdquo; Ryan's idea. Here is the <a href=\"assets/SOP_ideas.pdf\">draft SOP document</a> Aaron gave to Ryan.</li>" + 
						"<li>Note: Telling staff it's ok to have a chicken that looks like a rooster when there is no crowing... yet having a law that explicitly bans roosters... puts the city in a difficult situation.</li>" + 
					"</ol>" + 
				"</li>" +
				"<li><a href=\"http://www.thesentinel.com/mont/index.php?option=com_k2&view=item&id=1985:a-big-clucking-problem-in-gaithersburg&Itemid=321\">&ldquo;Big Clucking&rdquo; problem in Gaithersburg</a></li>" +				
				"<li><a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ\">The 2010 hearing (and Terri Cedrin's reaction)</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=VI0L12a352Y\">&rdquo;Dude where's my car?&ldquo;</a></li>" +
				"<li><a href=\"https://youtu.be/aAzcXXOmXgc\">&rdquo;Has child services visited you?&ldquo;</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=qf-YOuQz8t0\">&ldquo;Nugget&rdquo; the rooster and the &rdquo;No bell peace prize&ldquo;</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=FT9kHqWWgG4\">Gaithersburg vs Rockville</a></li>" +
				"<li><a href=\"https://www.youtube.com/watch?v=vxrJfTp16wQ\">Abe Lincoln and Liberty</a></li>" +
				"<li><a href=\"http://www.backyardchickens.com/t/942286/lifting-rooster-bans-city-hall-speech\">All the Gaithersburg speeches</a></li>" +
				"</ol>"	+ 
				"Official response from City government: <ol>" +
				"<li><a href=\"assets/city_letter_cease_and_desist.pdf\">Cease and desist letter (Aaron, we don't care, go away)</a></li>" +
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Animal Control", 
					"What you have done to the Rosenzweig family is outrageous. They have not bothered anyone: not with noise, not with smell, not with anything. It is not reasonable to harass them. You are on a power trip by not providing them with permit to own a prohibited animal considering all that you've done. The fact that city staff gloat about abuse of process, yet you have done nothing to prevent future abuse, is simply appalling. ") + 
				"</p>"
				
			}, 

			{title: "Luna Memorial", 
				detailsImage: "assets/luna_in_sunlight.jpg",
				topicFooterImage: "assets/ripken_luna.jpg",
				details: "<p>&ldquo;Luna&rdquo; was a beautiful Black Marans chicken from France. Yes, this is the kind that lays chocolate eggs. Luna's red bits glowed crimson. Luna's black feathers were such a deep hue that they shined with green iridescence in the bright rays of the sun. The name, &ldquo;Luna,&rdquo; means moon. Why is it that the stars which shine twice as bright shine half as long? Luna is no longer of this earth. </p>" + 
				"<p>Luna never crowed, never created a nuisance. Luna's only crime was the fact that Luna lived and breathed in Gaithersburg. Some people just cannot accept that people can love chickens, or that chickens could love you back.</p>" + 
				"<p>When Ryan Spiegel said: <a href=\"https://www.youtube.com/watch?v=U5SfVT-LRMY#t=4m19s\">&ldquo;no-one has taken any of his chickens&rdquo;</a> he was incorrect. Ryan never wanted to learn the depths of what happened to Aaron's family. Aaron begged him, and other council members, to visit their home but no-one ever did. Perhaps because <a href=\"https://www.youtube.com/watch?v=lWxaU-eLqps#t=2m03s\">Ryan had chickens</a> he thought he knew everything. </p>" + 
				"<p>In 2010 Ryan and the rest of the council decided that the ban only on crowing roosters was not enough, they must ban all roosters, pigs, goats, etc. They reasoned that people only want chickens for eggs. What they didn't realize is that now they have to <a href=\"https://www.youtube.com/watch?v=N3CeP2w3UoA\">figure out what is a rooster</a> and what is not even when there is no noise nuisance. Additionally, if you are getting chickens &ldquo;for eggs&rdquo; then you are doing it for the wrong reasons. Just go to the store to get eggs, or go to the Agricultural Reserve to get local eggs. You get chickens because you want a companion, it's that simple. Roosters make great pets and don't crow any more than a dog barks and it is fully controllable in more humane ways than dogs. Does your dog or cat give you eggs? Does that make them useless?</p>" + 
				"<p>The city constantly harassed us. First telling us we simply could not have chickens &ldquo;in the city&rdquo;... all the way to saying &ldquo;that is a rooster, I take him now or give you fines and citations.&rdquo; Only through the help of Sylvester Ferguson, the only city staff member with a heart, could we keep our chickens but only if we built a privacy fence and kept them permanently invisible to the world. (Note: A fence is not required in any of our written ordinances) Why are chickens &ldquo;wrong&rdquo; and hidden in shame instead of &ldquo;cool&rdquo; and accepted?</p>" + 
				"<p>Scrambling, within a week of this verbal agreement, Aaron's family started building the privacy fence. We had also ordered <a href=\"https://www.youtube.com/watch?v=8fbEEXrbKdg#t=1m55s\">chicken diapers</a>. The fence was half complete when Jorge Esmieu, of the city's Animal Control division, came again ranting and wanting to take the chickens. He simply could not wait until the fence was complete. Reluctantly we moved them into the half completed area.</p>" + 
				"<p>A fence is not a safe idea. Burglars love a fence, because nobody can see them breaking into a house. The same is true of foxes, they love half completed fences. </p>" + 
				"<p>When the coop was in the front yard, the motion sensors and video cameras only captured humans and rabbits investigating the chickens. Never a fox, never a raccoon. It is too conspicuous so the fox wouldn't even try. </p>" + 
				"<p>Luna and friends live in a fortress, a fox cannot break in. Still, the fox tried to break in and literally scared Luna to death. Aaron's family had a necropsy performed on Luna's body. The official cause of death was that the heart just suddenly stopped beating. Luna was in good health, just could not take the emotional stress of moving to a new location and then confronting a fox. Ironically, Luna's diaper arrived the day after Luna's death. </p>" + 
				"<p>Luna's death could have been prevented. Luna did not have to die. To say &ldquo;no-one took our chickens&rdquo; is technically true but in a very cruel way. The city constantly threatened to take our chickens and even when we bent over backwards to comply with their illegal demands, the city never cut us any slack. Remember, these animals were kept clean and enjoyed by most people in the community. We abided by all ordinances handed to us on official pink parchment by the director of Animal Control.</p>" +
				"<p>Luna, we wished we let you spend the nights in our home even without a diaper until the fence was complete. We are sorry to have let you down. You were a magnificent creature and a dear part of our family. You are missed and not forgotten. </p>" +
				"Learn about meat animals kept as pets: <ol>" +
				"<li><a href=\"https://www.youtube.com/watch?v=mMz6xAfkQeU\">Purring chicken baby</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=fxzo14pMxiM\">Cuddling rooster</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=qK65zRZlEkE\">Gorgeous pets, not food</a></li>" + 
				"<li><a href=\"http://upc-online.org/pp/winter2012/peeper.html\">&ldquo;Peeper&rdquo; the turkey</a></li>" +
				"<li><a href=\"http://www.mypetchicken.com/about-chickens/chicken-pictures/Frizzle-the-litterbox-trained-rooster-X109.aspx\">&ldquo;Frizzle&rdquo; the litterbox-trained rooster</a></li>" +	
				"<li><a href=\"https://www.youtube.com/watch?v=GNv_X7wCge0\">Chicken sweaters</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=0c_z9gaobgU\">Chicken diapers</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=M5H7uMq3mS8\">Oops I let the cow in...</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=6c_rhF2TfsI\">Pig in the city</a></li>" + 
				"<li><a href=\"https://youtu.be/jU16HUCDYm8\">Nana the poker playing chicken</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=-yCZKjVSPwY\">Children raising rabbits, chickens, goats, pigs, in under 2 acres of land</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "A chicken named Luna", 
					"All life has value, even a chicken's. You should apologize for Luna's senseless death. ") + 
				"</p>"				
			}, 


			{title: "Tiny House Legalization", 
				detailsImage: "assets/tiny-house-2.jpg",
				details: "<p>Across the country Americans are learning they can create their own dream homes on a small scale. They create pride of ownership and live debt-free. Local government prevents our citizens this freedom out of spite and ignorance.</p>" + 
				"<p>Zuccarelli built a tiny house in her 0.5 acre property but the City condemned it because of zoning. They say it is illegal to have two single family homes in one plat of land. What is the purpose of this zoning? Zucarrelli's little house doesn't compete with the landscape and isn't even visible from the road. The city has stated that if anyone walks into Darline's Tiny Home, even herself, that she will go to jail for 3 months. Because of this, her Tiny Home has been moth-balled for over 2 years. Is this just a power play, preventing Zuccarelli the freedom of using her land to the fullest? We think so. </p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(easy and ethical) - Grant Darline a weekend to show off her Tiny Home to the public and garner signatures. Give Darline 2 weeks to prepare her home for viewing</li>" +
				"<li>(ethical) - If Darline gets 100 signatures, find a way to make her Tiny Home legal</li>" +
				"<li>(reasonable) - If Darline gets 250 signatures, bring Tiny Homes to public hearing so that other neighbors may make Tiny Homes and accessory dwellings</li>" +
				"</ol>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://youtu.be/Uxwsa_pC05Y\">Aaron asks the council to open Darline's tiny house to the public</a></li>" + 
				"<li><a href=\"http://wjla.com/news/local/tiny-home-causes-controversy-in-gaithersburg-99692\">See Darline's tiny house</a></li>" +
				"<li><a href=\"http://www.countryliving.com/homes/real-estate/tiny-house\">44 impressive tiny houses</a></li>" +	
				"<li><a href=\"http://tinyhouseva.com\">Built to order in Virginia</a></li>" + 
				"<li><a href=\"http://www.ted.com/talks/alastair_parvin_architecture_for_the_people_by_the_people?language=en\">Architecture for the people by the people</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Tiny House Legalization", 
					"I would like to explore and learn more about Tiny Houses. I would like to see the inside of Darline's Tiny House. I wish you would look at the excitement around Tiny Houses across the country and see this as an opportunity to lead by example. ") + 
				"</p>"				
			}			
			
				
		];
	}
});
