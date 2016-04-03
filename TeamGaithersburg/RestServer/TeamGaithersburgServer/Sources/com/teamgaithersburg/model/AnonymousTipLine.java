package com.teamgaithersburg.model;

import org.apache.log4j.Logger;

import com.webobjects.eocontrol.EOEditingContext;
import com.webobjects.foundation.NSTimestamp;

public class AnonymousTipLine extends _AnonymousTipLine {
	@SuppressWarnings("unused")
	private static Logger log = Logger.getLogger(AnonymousTipLine.class);
	
	@Override
	public void awakeFromInsertion(EOEditingContext editingContext) {
		super.awakeFromInsertion(editingContext);
		NSTimestamp now = new NSTimestamp();
		setSavedWhen(now);
	}
}
