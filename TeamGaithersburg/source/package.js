enyo.depends(
	"$lib/lawnchair/lawnchair-0.6.1.js", // default "window" adapator forgets everything when you open a new window
	"$lib/lawnchair/lawnchair-adapter-indexed-db-0.6.1.js", // this is the new persistent way of saving state for any window
	"$lib/lawnchair/lawnchair-adapter-webkit-sqlite-0.6.1.js", // this is the previous and most common (2016) way of persisting on mobile devices
	"$lib/layout",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
	"Viewer.js",
	"CommunityTopic.js",
	"Viewer.css"
);
