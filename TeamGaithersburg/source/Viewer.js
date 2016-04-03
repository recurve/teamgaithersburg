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
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
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
		//this.teamGaithersburgResults();
	},
	teamGaithersburgResults: function() {
		this.loadGaithersburgData();
		
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	communityTopicResults: function(inSender, inResults) {
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
				detailsImage: "assets/teamwork-quotes-11.jpg",
				topicFooterImage: "assets/together_we_can.jpg",
				details: "<p>Team Gaithersburg</p>" +
				"<p><a href=\"https://rallyhood.com/rallies/23387\">Join our &ldquo;Rallyhood.&rdquo;</a> It is a modern mailing list where you can post, share, and read all previous messages</p>" + 
				"<p>Saddened by the status quo, we are a group of concerned neighbors demanding change. We want to find out what happens when an irresistible force (neighbors united) meets an immovable object (local government). When the dust settles, we'll learn nothing is truly irresistible nor immovable, things only appear that way until you dig into the root cause. It's time to hold our local government accountable. It's time to stop letting career politicians use their time governing our great city as merely a stepping stone on their way to the Senate. Leading our city means more than embellishing their resume, they must work to enhance our quality of life. </p>" + 
				"<p>How will we hold our local city government accountable? By holding fast to the issues that matter most and educating our neighbors about what is going on. We won't let our City Council forget the big picture. If they don't change their ways, we'll vote them out of office in the next election cycle.</p>" + 
				"<p>When you cannot get the simple issues right… like coming to someone’s home when they ask for help, forcing them to make a public spectacle before they leave you alone… digging in their heels and refusing to make amends… that’s when you realize that there is no hope in getting the &ldquo;big&rdquo; issues right such as our schools and transportation. The entire purpose of having a &ldquo;city&rdquo; is so we can have more control than what the county allows us. If we are nothing more than a &ldquo;yes-man&rdquo; for the county, there is little point in having a city. Our city taxes are only useful when we mobilize to create a difference we can feel in our quality of life. Things like leaf and and branch pickup are a useful benefit. </p>" + 
				"<p>Who are we? Anyone can join us and bring up issues that must be addressed and resolved which aren't getting the attention they deserve.</p>" +
				
				"Related links: <ol>" +
				"<li><a href=\"https://www.facebook.com/SmallPotatoesBlog/\">Gaithersburg &ldquo;Small Potatoes&rdquo; blog</a></li>" +
				"<li><a href=\"http://bjohnhayden.com\">John Hayden Reporting on Gaithersburg, Montgomery County, and life</li>" + 
				"</ol>" + 
				
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

			{title: "Petitions", 
				detailsImage: "assets/petition.jpg",
				details: "<p>Look over these petitions and sign what appeals to you</p>" + 
				"<ol>" + 
				"<li><a href=\"https://www.change.org/p/city-of-gaithersburg-roll-our-own-city-of-gaithersburg-school-system\">Fix Gaithersburg Schools</a></li>" + 
				"<li><a href=\"https://www.change.org/p/planning-gaithersburgmd-gov-20878-don-t-let-our-neighborhood-and-schools-become-overdeveloped-over-commercialized-and-traffic-ridden\">Annexation of the Johnson property</a></li>" +
				"<li><a href=\"https://www.change.org/p/city-of-gaithersburg-maryland-lift-rooster-ban\">Pet equality</a></li>" +
				"</ol>" + 
				"<p>Have a petition you'd like to list here? Let us know: " + 
					this.mailTo("aaron@chatnbike.com", "Petition Idea - Team Gaithersburg", 
					"I would like to start a petition about...") + 
				"</p>"				
			}, 

			{title: "Lack of Transparency", 
				detailsImage: "assets/transparency_concealment.jpg",
				topicFooterImage: "assets/Straight-Talk.jpg",
				details: 
				"<p>&ldquo;A lack of transparency results in distrust and a deep sense of insecurity&rdquo; &mdash; Dalai Lama</p>" + 
				"<p>Why is it that only a handful of people know how the City of Gaithersburg operates? Perhaps it is because you need to spend money to find out. Not just $25 or $50 but hundreds and possibly thousands of dollars. This is why we've setup a grass-roots <a href=\"https://www.gofundme.com/GaithersburgInfo\">funding campaign</a> to get the word out.</p>" + 
				"<p><a target=\"_blank\" style=\"border:none;\" href=\"http://www.gofundme.com/GaithersburgInfo?utm_medium=wdgt\" title=\"Visit this page now.\"><img style=\"border:none;\" src=\"https://funds.gofundme.com/css/3.0_donate/green/widget.png\"></a></p>" + 
				"<p>Mayor Jud Ashman said his #1 core value is <a href = \"assets/Jud_Ashman_Transparency_main.jpg\">&ldquo;Responsive, open government&rdquo;</a> </p>" + 
				"<p>Mayor Jud Ashman further said with regards to &rdquo;<a href = \"assets/Jud_Ashman_Transparency.jpg\">Fostering open, responsive government:</a>  We must always operate openly, invite public participation, and respond to feedback.  This is a core value for me.&ldquo;</p>" +
				"<p>The Mayor claims he is open but his actions speak otherwise. When you come to the Mayor with real issues and ask for transparency, the Mayor responds with <a href = \"https://www.youtube.com/watch?v=aAzcXXOmXgc&t=3m13s\">(video) no comments</a></p>" +  
				"<p>When you ask the Mayor how much it costs to have our annual book festival, he wants to charge you for the information. How much he'll charge you depends on who is asking, some people have been told it will cost &ldquo;thousands of dollars&rdquo; to get that information. Organizers of non-city-sponsored events in the Kentlands must provide full operating costs to city government free of charge. When we ask the city how much city sponsored events cost we get the runaround. It is inconsistent &mdash; a double standard.</p>" + 
				"<p>Aaron Rosenzweig asked <a href=\"https://youtu.be/sH1J-uFLgfg\">in person</a> and <a href=\"assets/aaron_foi_2016_Jan_19.pdf\">in writing</a> to find out both the cost of operating the book festival and also statistics on Animal Control. He was told <a href=\"assets/Rosenzweig-MPIA-Request-02302016.pdf\">it would cost $236.12</a> &mdash; Aaron challenged our local leaders to provide all of this information on the city website free for anyone to view. Aaron challenged them to tell the world what city staff did to his family. The city refused, what are they hiding?</p>" + 
				"<p>Darline Bell-Zuccarelli asked <a href=\"assets/Darline_request_for_information.pdf\">in writing</a> to find out the cost of operating the book festival, the amont of money spent on helping the homeless, and the amount of money to be spent on the new police department. She was told <a href=\"assets/Bell-Zuccarelli_PIA_RequestResponse.pdf\">it would cost $791.78</a></p>" + 
				"Analysis: <ol>" +
				"<li>Why should we investigate the cost of the Book Festival? In a word &mdash; consistency. For &ldquo;Kentlands Day,&rdquo; the city required the organizers to provide all of this information free of charge. It's inconsistent to ask citizens to provide this information but local government does not do the same for us. We deserve to know how our taxpayer dollars are spent. In <a href=\"assets/Kentlands_Day_Andrew_Ross_TCGThree0515Web.pdf\">this edition of the Town Courier newspaper</a> we learn that &ldquo;Kentlands Day&rdquo; costed $40k to organize but booth sales brought in $35k which is near break even. They also paid the city $2k in funds. The estimated economic impact was $200k for Kentlands businesses. Why can't we get this type of information about the Gaithersburg Book Festival? Why is it hidden from view? Why must Aaron spend $230 to get an answer? Some citizens speculate the Gaithersburg Book Fair operates on a $150-200k net loss. </li>" + 
				"<li>Why should we investigate city staff? Stated simply &mdash; it could happen to you. If somebody does not like you they can use city resources to turn your life upside down. The city refuses to say what Animal Control did to Aaron Rosenzweig and if they did any corrective action. If they were in the clear, they would come out and say it. Aaron meticulously documented what happened to his family, it was evil and it is shameful the city will not own up to it: <ul>" + 
				"<li><a href=\"assets/request_for_Internal_Investigation.pdf\">Request to investigate abuse of process</a></li>" + 
				"<li><a href=\"assets/details_of_abuse.pdf\">Details of abuse</a></li>" + 
				"<li><a href=\"assets/city_staff_Internal_Investigation.pdf\">The only published results of investigation</a></li>" + 
				"</ul></li>" + 
				"<li>Why should we care about dog bite statistics? In a word &mdash; accountability. We need to know how city resources are being used. If each department is allowed to police themselves with zero accountability, that is a problem. The Director of Animal Control, Lisa Holland, told Aaron Rosenzweig they often investigate fraudulent dog bite complaints where people are fighting over a parking spot so they use her department to harass their neighbor. She says it happens all the time. Unfortunately the city only records dog bite statistics when they can verify that a dog actually bit a person. All other incidents are not recorded. This is why all 246 recorded dog bite complaints are verifiable: <ul>" + 
				"<li><a href=\"assets/evading_simple_questions.pdf\">The city evades issues surrounding dog bite statistics</a></li>" + 
				"<li>Council Member Ryan Speigel’s dog was reported as biting someone but Ryan said it is a little tiny dog and never bit anyone. Still, he gave up his dog to spend a few days under Animal Control’s care to &ldquo;watch for aggressive behavior.&rdquo; So at least one dog bite complaint was unfounded. They cannot say they all were founded. Since the dog bite complaint could not be verified, the record was cast aside. Ryan has first hand experience with misuse of city resources yet does nothing to prevent it from happening to you.</li>" + 
				"</ul></li>" + 
				"<li>Why should we care about spending for the homeless? In a word &mdash; justice. It's one thing to say we help those who need financial assistance. It's another thing to actually help them and how do we help them? It's reasonable to ask and find out.</li>" + 
				"<li>Why should we care about the costs involved with a new Police Department? In a word &mdash; responsibility. The new police department is also supposed to house a new City Hall. Do we need a new building more than raising wages of our Police Department and also better staffing the Police Department? People are calling in with drug deal sightings and asking for Police assistance but they are short staffed. Seems better to invest our taxpayer money in man-power instead of building fancier facilities. Also, hardly anyone ever goes to our current City Hall, what is the reason for wanting something bigger?</li>" + 
				"</ol>"	+ 				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Fix Our Community", 
					"I want you to charge reasonable fees no more than $50 when citizens request information. I want you to reply to citizens in a clear and easy to understand matter. Moreover, I'm increasingly concerned with our semi-transparent government, stop hiding information from us. ") + 
				"</p>"				
			}, 

// 			{title: "Rosey's Thorns", 
// 				detailsImage: "assets/rosey_thorn.jpg",
// 				details: "<p>My name is Rosenzweig. It means &ldquo;rose branch&ldquo; in German. That is because I am not pretty enough to be the flower and not feisty enough to be the thorn, I am the support structure. </p>" + 
// 				"<p>I have tried to effect positive change in Gaithersburg. Showing facts, pointing to issues, and offering solutions. The city council of Gaithersburg does not care.</p>" + 
// 				"<p>Real change requires new leadership. If you want me to be part of that leadership then I need you to be my &ldquo;Thorns.&rdquo; As one of Rosey's Thorns you need to be courageous enough to speak your mind, to come to city hall, and support our city. I don't just want I need you to tell me when I'm out of line and what the real world issues are that we can solve. </p>" + 
// 				"</ol>" + 
// 				"<p>Have a petition you'd like to list here? Let us know: " + 
// 					this.mailTo("aaron@chatnbike.com", "Petition Idea - Team Gaithersburg", 
// 					"I would like to start a petition about...") + 
// 				"</p>"				
// 			}, 

			{title: "Fix Our Community",
				detailsImage: "assets/diverse-community-pic.jpg",
				details: 
				"<p>Gaithersburg is made of diverse cultures and backgrounds. We'd like to see it stay that way. There are a number of issues that neighbors in Gaithersburg want addressed. Some are appalling, like the treatment of miniority neighborhoods by city government. Other issues are just common sense, there is no reason NOT to address them. Residents have voiced these issues with Team Gaithersburg because the city is not listening to them.</p>" + 				
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li><a href=\"https://youtu.be/sH1J-uFLgfg\">(video) Aaron asks the city to be transparent</a> by invoking the Public Information Act to find out not only how much money is spent on the Gaithersburg Book Festival but also to see the results of the internal investigation into abuse of process by city staff. </li>" +
				"<li><a href=\"http://www.thesentinel.com/mont/newsx/local/item/2995-howling-and-crowing-at-the-latest-g-burg-council-meeting\">Howling and crowing at City Hall</a></li>" +
				"<li><a href=\"https://youtu.be/g9STJZMNwak\">(video) Aaron asks the city to apologize</a> for the complacency and disrespect the City showed minority residents when they were the victim of a hate crime destroying their cars in the East Deer Park community. The city never identified the perpetrator and then not even seven days passed before giving the residents citations for unsightly vehicles. </li>" +
				"<li>When an ethnic minority phones in an animal abuse complaint, don't blow them off. Take their complaint seriously. Twice a hispanic woman phoned in a complaint about a dog being left out during snow fall without shelter. Her voice was ignored.</li>" +
				"<li>A hispanic person was given a citation for a car that was in their car port. The car did not have tags and they were not driving it. I can understand if a car is parked on the street and not moved for a period of time that the city would give a person a citation. In this case? Maybe the city has the legal right to do it but I question the purpose of harassing someone who has kept their car in their car-port.</li>" +
				"<li>Roads are not being resurfaced and yellow curb paint is not being reapplied in places where it has faded to signify that cars should not park there. The city says the yellow paint does not hold up in court but… why do we have to go that far? Isn’t it nice to let people easily know where they should not park? Isn’t it nice to resurface the roads every so often before they get too bad? Why not?</li>" +
				"<li>Bee-safe neighborhoods - following the lead of the County getting rid of pesticides in residential neighborhoods so that bees and butterflies have a path to fly.</li>" +
				"<li>Rain gardens are not granted the same respect as rain barrels. Why not? They work all the time and are generally better than rain barrels, what’s the difference? You can’t get rebates for installing a rain garden but you can if you install a rain barrel. </li>" +
				"<li>Leaf and yard waste pickup only happens if you put it in a paper bag. If you put it in a reusable container, the city won’t grab it. Why? In the county if you put a yard-waste sticker on the container they’ll take it. Isn’t that better? Reduce-Reuse-Recycle… a plastic container beats a paper bag any day. </li>" +
				"</ol>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Fix Our Community", 
					"I want you to address the problems identified by Team Gaithersburg that are hurting our community. ") + 
				"</p>"
			}, 

			{title: "Fix Our Schools",
				detailsImage: "assets/SchoolOvercrowding.jpg",
				details: 
				"<p>Now it is 2016. Schools like Summit Hall are falling apart, it's disgraceful. Some schools, such are Rachel Carson, are 160% overcrowded. <a href =\"https://www.change.org/p/city-of-gaithersburg-roll-our-own-city-of-gaithersburg-school-system\">Sign the petition!</a></p>" + 				
				"<p>Overcrowded and overcapacity. New housing development continues. This will eventually hurt our private housing values and our children deserve better. </p>" + 
				"<p>In 2015 our local government voted to increase our overcapacity limits from 110% to 150% so that more houses can be built. This means 1/3 of students will be in temporary structures outside of the main school building. It's very shortsighted. The city gets immediate revenue from more citizens moving in which creates more tax dollars for them to spend. In the long run our house values will be hurt because good families do not want to move into a city with overcrowded schools.</p>" + 
				"<p>Knowledgable parents have learned the hard way that our school facilities planning is dysfunctional. When we had a 110% overcrowding limit on schools, that was used as an excuse NOT to build larger facilities. The reasoning was that eventually the communities will grow older. The logic doesn't make sense, it is a half-baked excuse. Now that the limit was raised to 150% we are still told we cannot build larger schools because the county does not have money for Gaithersburg. The realities and desires of Gaithersburg residents will never align with the county's challenges to operate our school system. </p>" + 
				"<p>Our city council says they've done well because there is a special tax they'll collect when developers build housing that causes overcrowding. Interesting! but nowhere can we find that the amount of tax they raise from developers is enough to do anything with. To make matters worse, there is no direction on how and when that money will be spent other than if it is not spent, it will go back to the housing developers.</p>" + 
				"<p>It is obvious that our local government is either unwilling or unable to improve our schools. Something has to change.</p>" + 
				"<p>The county simply does not have the funding to build schools as fast as Gaithersburg is building housing. </p>" + 
				"<p>We should look into what it would take to break off from MCPS (Montgomery County Public Schools). How much will it cost to buy the current buildings from MCPS and roll our own school system? </p> " + 
				"<p>The county is determined to raise our taxes on a bus system called the CCT (Corridor Cities Transitway) in addition to the Ride-On buses we already have which are hardly used. Why not cancel the CCT and spend the money on our schools? If you think education is expensive, try ignorance. </p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				"<li>(real discussion on annexation and housing development) - <a href =\"https://www.change.org/p/city-of-gaithersburg-roll-our-own-city-of-gaithersburg-school-system\">Sign the petition!</a> By law the city only has to notify residents within two-hundred feet of new development. That's terrible, only 200 ft! This has to change, the city must stop keeping citizens in the dark. We need notifications to be sent in the postal mail to every home within a 2 mile radius of where new development is to take place. We cannot continue building homes faster than the county can build schools. It's already too late and we are not slowing down! Gaithersburg children are going to have to be bussed out of the city in the near future because the schools are overcrowded. No more! Every neighbor must come to city hall to voice their concern. Stop the insanity.</li>" +
				"<li>(easy but imperfect) - Allow a child to transfer to any underutilized school if their home school is overcrowded. Only parents capable of driving to the new location can do this but for those that can it's better than staying in a crowded environment.</li>" +
				"<li>(ultimate) - We want a dollar amount on how much it would cost to purchase existing schools from MCPS and rebuild / modify school structures. Can the city of Gaithersburg foot the bill? Can we encourage the state to fund some of the cost? How much of a tax increase might we need to pull this off in 1 to 2 years? Break off from MCPS and make our own school system. It's no secret that Gaithersburg schools are not rated highly. The best way to ensure an increase in home values is with a strong school system. The only way to make that happen is to take ownership of our schools at the city level. </li>" +
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
				"Related links: <ol>" +
				"<li><a href=\"https://www.facebook.com/rcesovercrowding/\">Rachel Carson Elementary school blog</a></li>" +
				"</ol>" + 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Fix Our Schools", 
					"I am tired of the finger pointing. I want the city to seriously investigate rolling our own school system. To take ownership and fix our schools!") + 
				"</p>"
			}, 
			
			{title: "Stop Corridor Cities Transitway",
				detailsImage: "assets/bus-in-traffic.jpg",
				details: "<p>The CCT (Corridor Cities Transitway) is a &ldquo;not so rapid transit&rdquo; which will raise our taxes, create more congestion, remove homes through eminent domain and worse - yet we are doing nothing to stop it. We already have Ride-On buses that cover these routes that are underutilized</p>" + 
				"<p>The idea is to connect Shady Grove to Clarksburg by messing up Gaithersburg. Muddy branch will be widened and Great Seneca Highway will become further congested by these busses and additional traffic lights on what is already a pickle point.</p>" +
				"<p>No citizen wants the CCT, it is a power play by developers and politicians. First the CCT must be built and then Johns Hopkins will destroy Belward Farm on Muddy Branch. Our neighbor whose house will be taken during the widening of Muddy Branch is now stuck and cannot retire! They told him they would take his house in 2016, then they said 2018, now they say they are not sure when because they have no money. He has no way to sell his home and continue his life.</p>" + 
				"<p>To finish this project the county will have to raise taxes. They have tried to create a special task force called the &ldquo;Independent Transit Authority&rdquo; which would have the authority to create whatever tax hikes they see fit without a public hearing.</p>" + 
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" +
				//"<li>(easy and immediate) - Purchase the citizen's home that is scheduled to be demolished to make the CCT. Rent the home to that citizen or someone else. The city can sell it to the county when, and if, the CCT is built.</li>" +
				"<li>(practical) - public hearing to stop the CCT from going through Muddy Branch, let it only go through Great Seneca Highway. We don't have to change the flavor of our city to meet the county's demands but if we are going allow the CCT we should strive for minimal negative impact. Keeping the CCT away from Muddy Branch will retain the character of the many homes that interact with Muddy Branch. Also, Mr. Zhang's home would no longer be in the path of the CCT. </li>" +
				"<li>(ethical) - purchase the Belward farm from JHU and revitalize it. The Belward family wanted the land to be used to make a school. Either make a school or run it as a real farm. Our city's history included over 400 dairy farms that are no more. Everyone would like true local produce and students would have excellent educational experiences on day trips to a city owned farm. Ideally it could be a farmed animal sanctuary and also vegetable producing resource. </li>" +
				"</ol>" + 
				"Learn more: <ol>" +
				//"<li><a href=\"https://youtu.be/-6eQLflMvUA\">Gaithersburg has plenty of cash. We should buy the home that is in limbo. It will be purchased by county government when they fund the CCT but when will that be? Our neighbor is stuck. Let's help our neighbor so he can retire and offload his nest egg. </a></li>" +
				//
				"<li><a href=\"https://youtu.be/U2GPTN0OyZc\">(video) Aaron asks the City how long will they keep Mr. Zhang in limbo? Are they going to take his house or not? Why won't they help him?</a></li>" +
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
				
				"<li>(simple) - Any notifications of future retail and housing development should be within at least a 1 mile radius. The current rule of only 200 feet is outdated and only makes sense for a <a href=\"assets/no_crowing_rooster.jpg\">rooster ordinance</a></li>" +
				"<li>(sensible) - Stop building homes until our schools are large enough to hold the students. Stop annexing new land for the purpose of making homes. Stop approving new housing development. Schools first!</li>" +
				"<li>(practical) - Public hearing with a real plan for what the ideal Gaithersburg lifestyle should be. Do we want to be a large city with little green space or a suburban community? The original vision of Gaithersburg has been lost and citizens are no longer involved. Let's all get involved!</li>" +
				"</ol>" + 
				"<span id = \"learnMoreID\">Learn more:</span> <ol>" +
				"<li><a href=\"https://www.change.org/p/planning-gaithersburgmd-gov-20878-don-t-let-our-neighborhood-and-schools-become-overdeveloped-over-commercialized-and-traffic-ridden\">Sign the petition to stop the annexation of the Johnson property.</a></li>" +
				"<li><a href=\"http://towncourier.com/concerned-residents-testify-against-johnson-annexation/\">Gaithersburg wants to annex another 25 acres to create more housing and tax revenue to continue overcrowding our schools</a></li>" +
				"<li><a href=\"http://www.mymcmedia.org/johnson-property-annexation-petition-draws-opposition-from-community-members/\">Video interviews with citizens about annexation</a></li>" +

				"<li><a href=\"assets/citizens_against_magruder_annexation.pdf\">Magruder annexation is opposed by all residents of Gaithersburg and Montgomery County</a></li>" +
				"<li><a href=\"assets/magruder_annexation_approved.pdf\">Magruder annexation is approved by the City Council anyway</a></li>" +
				"</ol>"	+
				
				"<h2>Full details on Johnson annexation</h2><div>(from Barbara Brenkworth of Dufief):</div>" + 

"<p>The property owner/developer is trying right now to be annexed into the City of Gaithersburg. It seems they are trying to do this so they can rezone the property and put more on it. Currently the county would allow for ball fields, single family homes or townhouses but the developers want both plus mixed use buildings – up to 6 stories high and the City of Gaithersburg would allow this. If they get annexed, they will develop the property in a 3 phase approach:</p> <ol>" + 

"<li>Phase 1 –The first would be to develop everything to the left of the Safeway. We would have a few single family homes, townhomes and condos. While currently the county would allow for 30 homes, the city would allow for 180. They are hoping for over 180 units.</li>" + 

"<li>Phase 2 – the Safeway has another 20 potential years on their lease (two 10 year options). Assuming they do both options, phase 2 would be the removal of the Safeway for more mixed use buildings. These would be the 5-6 story buildings with retail on the first floor and apts, condos above. We would lose our only grocery store close to us – albeit not a wonderful one, it still is nice and convenient.</li>" + 

"<li>Phase 3 – would be for commercial high rise building(s) on the corner.</li>" + 
				"</ol>" + 
				
				"<h3>GOOD NEWS! (Dec. 2015) The Johnson proposal has been pulled</h3><p> Johnson's will likely come back with a proposal to build 45 homes. That is much better than the 180 homes they originally wanted.</p>" + 
				
				"<h2>Full details on Magruder annexation</h2><div>(from Mark Ezrin of Lakelands):</div>" + 
				
				"<p>The Magruder Property is on the southwest corner near Quince Orchard Highschool. It's where McDonald's, Dunkin Donuts, and Papa John's Pizza currently is. They want to become part of the City of Gaithersburg so they can change to MXD zoning. That means they can do whatever they want including building residential housing in the form of condos. Bill Magruder says that if his property is annexed into Gaithersburg they won't do anything immediately but &ldquo;When the time is right it will be right and having both sides in one municipality will allow us to respond to the market as quickly as we can&rdquo;</p>" + 
				
				"<p>Nobody was notified about the Magruder annexation because Gaithersburg rules only require homes within 200 feet be notified. That's a good rule of thumb for a <a href=\"assets/no_crowing_rooster.jpg\">rooster ordinance</a> but a very outdated rule for city planning. Nobody lives within 200 feet of the Magruder shopping center. If this were the county the rule requires a 1 mile radius to be notified. As it stands, extremely few people knew about the Magruder annexation. It flew under the radar and the last time anyone could officially voice a concern has come and gone. The last date for comments was December 16, 2015. <a href=\"assets/citizens_against_magruder_annexation.pdf\">Read the opposing comments of citizens that did find out</a></p>" + 
				
				"<p>Even though the Magruder property is a strip mall now, once it becomes part of Gaithersburg anything can happen. Residential condos 10 stories high are possible.</p>" + 
				
				"<h3>BAD NEWS! (Jan. 2016) The Magruder proposal has been approved</h3>" + 

				"<p>See <a href=\"#learnMoreID\">learn more</a> for details.</p>" + 
				
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Overdevelopment", 
					"Our City has no debt, so why do you continuously push for overdevelopment? Are our tax dollars not enough for you that you must find new residents? Why do you even entertain the thought of the Johnson annexation? That will only overcrowd our schools and create even more congestion. Let the county do what it will but cease and desist the overdevelopment of Gaithersburg. ") + 
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
				"<li><a href=\"https://youtu.be/Uxwsa_pC05Y\">(video) Aaron asks the council to open Darline's tiny house to the public</a></li>" + 
				"<li><a href=\"http://wjla.com/news/local/tiny-home-causes-controversy-in-gaithersburg-99692\">(video) See Darline's tiny house</a></li>" +
				"<li><a href=\"http://www.countryliving.com/homes/real-estate/tiny-house\">44 impressive tiny houses</a></li>" +	
				"<li><a href=\"http://tinyhouseva.com\">Built to order in Virginia</a></li>" + 
				"<li><a href=\"http://www.ted.com/talks/alastair_parvin_architecture_for_the_people_by_the_people?language=en\">(video) Architecture for the people by the people</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "Tiny House Legalization", 
					"I would like to explore and learn more about Tiny Houses. I would like to see the inside of Darline's Tiny House. I wish you would look at the excitement around Tiny Houses across the country and see this as an opportunity to lead by example. ") + 
				"</p>"				
			}, 			

			{title: "Dog Park repurposed", 
				detailsImage: "assets/dogpark.jpg",
				details: "<p>Our local government changed the rules for our dog park without involving our citizens. Their end game is to reduce usage so that they can &rdquo;repurpose it for something else.&ldquo;</p>" +
				"<p>Friendships were broken. People who used to go to the park were kicked out. I guess we are just running out of green space. Listen to how the City Manager says: <a href=\"https://www.youtube.com/watch?v=j-f3fbdjIgQ#t=3m33s\">&ldquo;usage just goes down so we can repurpose the dog park for something else&rdquo;</a> Then later on Feb. 2, 2016 Tony says <a href=\"https://youtu.be/Es7KxrhkLls\">&ldquo;We could make more money if we turn the dog park into a cricket field.&rdquo;</a></p>" +
				"More info: <ol>" + 
				"<li><a href=\"http://www.thesentinel.com/mont/newsx/local/item/2995-howling-and-crowing-at-the-latest-g-burg-council-meeting\">Howling and crowing at City Hall</a></li>" +
				"</ol>" + 				
				"Workable solutions &quot;Team Gaithersburg&quot; would like to see: <ol>" + 
				"<li>(ethical) - Put the ordinance back the way it was. Most citizens were happy with it before the city changed it without involving the community.</li>" +
				"</ol>" + 
				"Official response from City government: <ol>" +
				"<li><a href=\"assets/Dog_Exercise_Area_orig_rules.pdf\">The 2014 dog park rules</a></li>" +
				"<li><a href=\"assets/Dog_Exercise_Area_2015_changes.pdf\">The 2015 &ldquo;sneak attack&rdquo; dog park rules</a></li>" +
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
				"<li>Nana the poker playing chicken: <a href=\"https://youtu.be/jU16HUCDYm8\">part 1</a>, <a href=\"https://youtu.be/2O-VOxXxLls\">part 2</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=-yCZKjVSPwY\">Children raising rabbits, chickens, goats, pigs, in under 2 acres of land</a></li>" + 
				"</ol>"	+ 
				"<p>Voice your concerns: " + 
					this.mailTo("cityhall@gaithersburgmd.gov", "A chicken named Luna", 
					"All life has value, even a chicken's. You should apologize for Luna's senseless death. ") + 
				"</p>"				
			},

			{title: "Bloopers", 
				detailsImage: "assets/bloopers.jpg",
				details: "<p>Here are links to interesting things that happened or have been discussed in Gaithersburg.</p>" + 
				"<ol>" +
				"<li><a href=\"https://www.facebook.com/SmallPotatoesBlog/posts/1089219641108671\">Citizen estimates $200,000 is the annual cost of the Gaithersburg book festival.</a> Tell me why the organizers of &ldquo;Kentlands Day&rdquo; must divulge their operating cost but the city does not?</li>" + 
				"<li><a href=\"https://www.facebook.com/SmallPotatoesBlog/videos/vb.472440889453219/1041206809243288/?type=2&theater\">(video) Standing room only at City Hall.</a> Tell me why we need to spend $3 million on a new City Hall when nobody comes to the one we have now?</li>" + 
				"<li><a href=\"http://bjohnhayden.com/2015/10/16/gaithersburg-mayor-and-city-council-election-is-almost-a-secret/\">&rdquo;Knock knock I'm running for Mayor&ldquo; but nobody knew there was an election?</a></li>" + 
				"<li><a href=\"https://www.youtube.com/watch?v=qf-YOuQz8t0\">(video) &ldquo;Nugget&rdquo; the rooster and the &rdquo;No bell peace prize&ldquo;</a></li>" + 
				"<li><a href=\"https://wallethub.com/edu/best-worst-small-cities-to-live-in/16581/\">Gaithersburg rated #305 compared to Rockville #23 &ldquo;Best place to live&rdquo;</a></li>" + 
				"<li><a href=\"https://www.facebook.com/SmallPotatoesBlog/posts/994746033889366\">Kentlands wants $900,000 from Gaithersburg to help fix $2 million retaining wall collapse</a></li>" + 
				"<li><a href=\"https://wallethub.com/edu/cities-with-the-most-and-least-ethno-racial-and-linguistic-diversity/10264/\">Gaithersburg is most diverse city in the nation.</a> Then how come we don't have Spanish translators at City Hall?</li>" + 
				//"<li><a href=\"?\">?</a></li>" + 
				"</ol>"	+ 
				"<p>Email your bloopers to: " + 
					this.mailTo("aaron@chatnbike.com", "Gaithersburg Bloopers", 
					"I'd like to share the following: ") + 
				"</p>"				
			}
				
		];
	}
});
