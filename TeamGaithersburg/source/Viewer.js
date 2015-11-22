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
				"<p>Saddened by the status quo, we are a group of concerned neighbors demanding change. We want to find out what happens when an irresistible force (neighbors united) meets an immovable object (local government). When the dust settles, we'll learn nothing is truly irresistible nor immovable, things only appear that way until you dig into the root cause. It's time to hold our local government accountable. It's time to stop letting career politicians use their time governing our great city as merely a stepping stone on their way to the Senate. Leading our city means more than embellishing their resume, they must work to enhance our quality of life. </p>" + 
				"<p>How will we hold our local city government accountable? By holding fast to the issues that matter most and educating our neighbors about what is going on. We won't let our City Council forget the big picture. If they don't change their ways, we'll vote them out of office in the next election cycle.</p>" + 
				"<p>When you cannot get the simple issues right… like coming to someone’s home when they ask for help, forcing them to make a public spectacle before they leave you alone… digging in their heels and refusing to make amends… that’s when you realize that there is no hope in getting the &ldquo;big&rdquo; issues right such as our schools and transportation. The entire purpose of having a &ldquo;city&rdquo; is so we can have more control than what the county allows us. If we are nothing more than a &ldquo;yes-man&rdquo; for the county, there is little point in having a city. Our city taxes are only useful when we mobilize to create a difference we can feel in our quality of life. Things like leaf and and branch pickup are a useful benefit. </p>" + 
				"<p>Who are we? Anyone can join us and bring up issues that must be addressed and resolved which aren't getting the attention they deserve.</p>" +
				"<h2>We welcome our city council to respond to our concerns. We will post their official stance on each line item if and when we receive them.</h2>" + 
				"<p>Aaron Rosenzweig <a href=\"mailto:aaron@chatnbike.com\">aaron@chatnbike.com</a> - I'm a working family man who never really cared about city politics until he was directly impacted by it, now I know too much about the realities of our local government. The city threatened to take our children away with child protective services because a wealthy citizen didn't like our choice of pets. I refuse to sit idly by while our way of life is ruined. I'm not chicken to speak the truth, even when it hurts. <a href=\"https://www.change.org/p/city-of-gaithersburg-maryland-lift-rooster-ban\">Learn my story</a></p>"  + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Team Gaithersburg", 
					"I support TeamGaithersburg.org and will also hold you accountable for your actions (and inactions)") + 
				"</p>"
			}, 
			
			{title: "Fix our schools",
				detailsImage: "assets/SchoolOvercrowding.jpg",
				details: "<p>Overcrowded and 150% overcapacity. New housing development continues. This is hurting our private housing values and our children deserve better.</p>" + 
				"<p>In 2015 our local government voted to increase our overcapacity limits from 110% to 150% so that more houses can be built. This means 1/3 of students will be in temporary structures outside of the main school building. It's very shortsighted. The city gets immediate revenue from more citizens moving in which creates more tax dollars for them to spend. In the long run our house values will be hurt because good families do not want to move into a city with overcrowded schools.</p>" + 
				"<p>Our city council says they've done well because there is a special tax they'll collect when developers build housing that causes overcrowding. Interesting! but nowhere can we find that the amount of tax they raise from developers is enough to do anything with. To make matters worse, there is no direction on how and when that money will be spent other than if it is not spent, it will go back to the housing developers.</p>" + 
				"<p>It is obvious that our local government is either unwilling or unable to improve our schools. Something has to change.</p>" + 
				"<p>We should look into what it would take to break off from MCPS (Montgomery County Public Schools). How much will it cost to buy the current buildings from MCPS and roll our own school system? </p> " + 
				"<p>The county is determined to raise our taxes on a bus system called the CCT (Corridor Cities Transitway) in addition to the Ride-On buses we already have which are hardly used. Why not cancel the CCT and spend the money on our schools? If you think education is expensive, try ignorance. </p>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ#t=22m30s\">Watch Council Member Neil Harris prevent our neighbors from voicing their ideas about school overcrowding and Aaron asking him to be a man</a></li>" + 
				"<li><a href=\"http://mcpsmd.swagit.com/play/11122015-1062\">See our council talk and talk at county board meetings but nothing ever happens</a></li>" +
				"<li><a href=\"http://thesentinel.com/mont/newsx/local/item/2384-gaithersburg-studies-adequate-public-facilities-ordinance\">150% overcrowding reported by Sentinel Newspaper</a></li>" +
				"<li><a href=\"http://towncourier.com/proposed-apfo-amendment-suggests-local-fix-for-schools/\">150% overcrowding reported by Gaithersburg Courier Newspaper</a></li>" +
				"<li><a href=\"http://parentscoalitionmc.blogspot.com/2015/09/what-is-staff-confidence-level-that.html\">150% overcrowding reported by Parents' Coalition</a></li>" +
				"<li><a href=\"http://gaithersburgmd.gov/~/media/city/documents/government/city_projects/ctam_7036_2015/exhibits_001_005.pdf\">150% overcrowding the actual changes to Gaithersburg regulations</a></li>" +
				"<li><a href=\"http://gaithersburgmd.gov/~/media/city/documents/government/city_projects/ctam_7036_2015/exhibits_011_015.pdf\">150% overcrowding Gaithersburg's PowerPoint presentation</a></li>" +
				"<li><a href=\"http://thesentinel.com/mont/newsx/local/item/2779-mcps-students-perform-poorly-on-state-tests\">More than half of the students in Montgomery County failed the state's math exam. I wonder why? Maybe because we value business interests rather than our children's interests?</a></li>" +
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
				"Learn more: <ol>" +
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
				"<p>Friendships were broken. People who used to go to the park were kicked out. I guess we are just running out of green space. Listen to how the City Manager says: &ldquo;usage just goes down so we can repurpose the dog park for something else&rdquo;: <a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ#t=3m33s\">watch the video</a>" +
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
				"<p>It happened to Aaron Rosenzweig. The city constantly harassed him and eventually threatened him with child support services taking his children away. Why? because someone in the greater community did not like their choice of pets. David and Faith Roseman used taxpayer resources to do the unthinkable all the while he drove by photographing Aaron's kids and flipping them &ldquo;the bird.&rdquo; David is a wealthy man, as treasurer of NARFE and United Seniors of Maryland, exerted influence and underhanded tactics rather than go through a process of public hearing. </p>" + 
				"<p>When Aaron started testifying at public hearings, the harassment suddenly stopped but the city refuses to apologize and refuses to fix the problems in our code enforcement.</p>" +  

				"The city refuses to: <ol>" +
				"<li>Grant Aaron a permit to keep a non-crowing rooster nor explain why they refuse to do so.</li>" +
				"<li>Admit they made a mistake in 2010 when they changed our laws in a way that benefits nobody yet leads to conflict. Look at the <a href=\"assets/no_crowing_rooster.jpg\">2009 law</a> that was fair to everyone (scanned from ordinances Lisa Holland gave Aaron)</li>" +
				"<li>Audit all dog bite claims in the last 5 years to determine how many were fraudulent abuse over trivial issues like car parking</li>" +
				"<li>Publish the results of the city's secret investigation of Animal Control for all to see</li>" +
				"<li>Explain what, if any, corrective action was taken to prevent future abuse of process</li>" +
				"<li>Make a public apology for not respecting the Rosenzweig family as true citizens and forcing them to build a privacy fence.</li>" +
				"</ol>"	+ 

				
				"<p>Aaron has received email from the Mayor asking him to give up his right to free speech. The mayor, Jud Ashman, has even visited Aaron's home with the express purpose of saying &ldquo;Man to man, let sleeping dogs lie.&rdquo; What does the City have to hide? Oh yes, here it is, the blog post that Mayor Ashman has deleted from his website: <a href=\"http://liftroosterban.com/file/Jud_Ashman_Roosters.pdf\">2010 Rooster ban was the one mistake the council made that year</a> </p>" + 
				"Learn more: <ol>" +
				"<li><a href=\"https://www.change.org/p/city-of-gaithersburg-maryland-lift-rooster-ban\">Aaron's story</a></li>" +
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

			{title: "Tiny House Legalization", 
				detailsImage: "assets/tiny-house-2.jpg",
				details: "<p>Across the country Americans are learning they can create their own dream homes on a small scale. They create pride of ownership and live debt-free. Local government prevents our citizens this freedom out of spite and ignorance.</p>" + 
				"<p>Zuccarelli built a tiny house in her 0.5 acre property but the City condemned it because of zoning. They say it is illegal to have two single family homes in one plat of land. What is the purpose of this zoning? Zucarrelli's little house doesn't compete with the landscape and isn't even visible from the road. Is this just a power play, preventing Zuccarelli the freedom of using her land to the fullest? We think so. " + 
				"Learn more: <ol>" +
				"<li><a href=\"http://wjla.com/news/local/tiny-home-causes-controversy-in-gaithersburg-99692\">See the Zuccarelli tiny house</a></li>" +
				"<li><a href=\"http://www.countryliving.com/homes/real-estate/tiny-house\">44 impressive tiny houses</a></li>" +	
				"<li><a href=\"http://tinyhouseva.com\">Built to order in Virginia</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Tiny House Legalization", 
					"I would like to explore and learn more about Tiny Houses. I would like to see the inside of Darline's Tiny House. I wish you would look at the excitement around Tiny Houses across the country and see this as an opportunity to lead by example. ") + 
				"</p>"				
			}			
				
		];
	}
});
