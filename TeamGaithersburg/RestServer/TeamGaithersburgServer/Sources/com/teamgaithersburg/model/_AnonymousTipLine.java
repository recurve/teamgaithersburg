// DO NOT EDIT.  Make changes to AnonymousTipLine.java instead.
package com.teamgaithersburg.model;

import com.webobjects.eoaccess.*;
import com.webobjects.eocontrol.*;
import com.webobjects.foundation.*;
import java.math.*;
import java.util.*;
import org.apache.log4j.Logger;

import er.extensions.eof.*;
import er.extensions.foundation.*;

@SuppressWarnings("all")
public abstract class _AnonymousTipLine extends  ERXGenericRecord {
  public static final String ENTITY_NAME = "AnonymousTipLine";

  // Attribute Keys
  public static final ERXKey<String> BODY = new ERXKey<String>("body");
  public static final ERXKey<String> BY_WHOM = new ERXKey<String>("byWhom");
  public static final ERXKey<NSTimestamp> CREATED_WHEN = new ERXKey<NSTimestamp>("createdWhen");
  public static final ERXKey<NSTimestamp> SAVED_WHEN = new ERXKey<NSTimestamp>("savedWhen");
  public static final ERXKey<String> SUBJECT = new ERXKey<String>("subject");
  // Relationship Keys

  // Attributes
  public static final String BODY_KEY = BODY.key();
  public static final String BY_WHOM_KEY = BY_WHOM.key();
  public static final String CREATED_WHEN_KEY = CREATED_WHEN.key();
  public static final String SAVED_WHEN_KEY = SAVED_WHEN.key();
  public static final String SUBJECT_KEY = SUBJECT.key();
  // Relationships

  private static Logger LOG = Logger.getLogger(_AnonymousTipLine.class);

  public AnonymousTipLine localInstanceIn(EOEditingContext editingContext) {
    AnonymousTipLine localInstance = (AnonymousTipLine)EOUtilities.localInstanceOfObject(editingContext, this);
    if (localInstance == null) {
      throw new IllegalStateException("You attempted to localInstance " + this + ", which has not yet committed.");
    }
    return localInstance;
  }

  public String body() {
    return (String) storedValueForKey(_AnonymousTipLine.BODY_KEY);
  }

  public void setBody(String value) {
    if (_AnonymousTipLine.LOG.isDebugEnabled()) {
    	_AnonymousTipLine.LOG.debug( "updating body from " + body() + " to " + value);
    }
    takeStoredValueForKey(value, _AnonymousTipLine.BODY_KEY);
  }

  public String byWhom() {
    return (String) storedValueForKey(_AnonymousTipLine.BY_WHOM_KEY);
  }

  public void setByWhom(String value) {
    if (_AnonymousTipLine.LOG.isDebugEnabled()) {
    	_AnonymousTipLine.LOG.debug( "updating byWhom from " + byWhom() + " to " + value);
    }
    takeStoredValueForKey(value, _AnonymousTipLine.BY_WHOM_KEY);
  }

  public NSTimestamp createdWhen() {
    return (NSTimestamp) storedValueForKey(_AnonymousTipLine.CREATED_WHEN_KEY);
  }

  public void setCreatedWhen(NSTimestamp value) {
    if (_AnonymousTipLine.LOG.isDebugEnabled()) {
    	_AnonymousTipLine.LOG.debug( "updating createdWhen from " + createdWhen() + " to " + value);
    }
    takeStoredValueForKey(value, _AnonymousTipLine.CREATED_WHEN_KEY);
  }

  public NSTimestamp savedWhen() {
    return (NSTimestamp) storedValueForKey(_AnonymousTipLine.SAVED_WHEN_KEY);
  }

  public void setSavedWhen(NSTimestamp value) {
    if (_AnonymousTipLine.LOG.isDebugEnabled()) {
    	_AnonymousTipLine.LOG.debug( "updating savedWhen from " + savedWhen() + " to " + value);
    }
    takeStoredValueForKey(value, _AnonymousTipLine.SAVED_WHEN_KEY);
  }

  public String subject() {
    return (String) storedValueForKey(_AnonymousTipLine.SUBJECT_KEY);
  }

  public void setSubject(String value) {
    if (_AnonymousTipLine.LOG.isDebugEnabled()) {
    	_AnonymousTipLine.LOG.debug( "updating subject from " + subject() + " to " + value);
    }
    takeStoredValueForKey(value, _AnonymousTipLine.SUBJECT_KEY);
  }


  public static AnonymousTipLine createAnonymousTipLine(EOEditingContext editingContext, String body
, NSTimestamp createdWhen
, NSTimestamp savedWhen
, String subject
) {
    AnonymousTipLine eo = (AnonymousTipLine) EOUtilities.createAndInsertInstance(editingContext, _AnonymousTipLine.ENTITY_NAME);    
		eo.setBody(body);
		eo.setCreatedWhen(createdWhen);
		eo.setSavedWhen(savedWhen);
		eo.setSubject(subject);
    return eo;
  }

  public static ERXFetchSpecification<AnonymousTipLine> fetchSpec() {
    return new ERXFetchSpecification<AnonymousTipLine>(_AnonymousTipLine.ENTITY_NAME, null, null, false, true, null);
  }

  public static NSArray<AnonymousTipLine> fetchAllAnonymousTipLines(EOEditingContext editingContext) {
    return _AnonymousTipLine.fetchAllAnonymousTipLines(editingContext, null);
  }

  public static NSArray<AnonymousTipLine> fetchAllAnonymousTipLines(EOEditingContext editingContext, NSArray<EOSortOrdering> sortOrderings) {
    return _AnonymousTipLine.fetchAnonymousTipLines(editingContext, null, sortOrderings);
  }

  public static NSArray<AnonymousTipLine> fetchAnonymousTipLines(EOEditingContext editingContext, EOQualifier qualifier, NSArray<EOSortOrdering> sortOrderings) {
    ERXFetchSpecification<AnonymousTipLine> fetchSpec = new ERXFetchSpecification<AnonymousTipLine>(_AnonymousTipLine.ENTITY_NAME, qualifier, sortOrderings);
    fetchSpec.setIsDeep(true);
    NSArray<AnonymousTipLine> eoObjects = fetchSpec.fetchObjects(editingContext);
    return eoObjects;
  }

  public static AnonymousTipLine fetchAnonymousTipLine(EOEditingContext editingContext, String keyName, Object value) {
    return _AnonymousTipLine.fetchAnonymousTipLine(editingContext, new EOKeyValueQualifier(keyName, EOQualifier.QualifierOperatorEqual, value));
  }

  public static AnonymousTipLine fetchAnonymousTipLine(EOEditingContext editingContext, EOQualifier qualifier) {
    NSArray<AnonymousTipLine> eoObjects = _AnonymousTipLine.fetchAnonymousTipLines(editingContext, qualifier, null);
    AnonymousTipLine eoObject;
    int count = eoObjects.count();
    if (count == 0) {
      eoObject = null;
    }
    else if (count == 1) {
      eoObject = eoObjects.objectAtIndex(0);
    }
    else {
      throw new IllegalStateException("There was more than one AnonymousTipLine that matched the qualifier '" + qualifier + "'.");
    }
    return eoObject;
  }

  public static AnonymousTipLine fetchRequiredAnonymousTipLine(EOEditingContext editingContext, String keyName, Object value) {
    return _AnonymousTipLine.fetchRequiredAnonymousTipLine(editingContext, new EOKeyValueQualifier(keyName, EOQualifier.QualifierOperatorEqual, value));
  }

  public static AnonymousTipLine fetchRequiredAnonymousTipLine(EOEditingContext editingContext, EOQualifier qualifier) {
    AnonymousTipLine eoObject = _AnonymousTipLine.fetchAnonymousTipLine(editingContext, qualifier);
    if (eoObject == null) {
      throw new NoSuchElementException("There was no AnonymousTipLine that matched the qualifier '" + qualifier + "'.");
    }
    return eoObject;
  }

  public static AnonymousTipLine localInstanceIn(EOEditingContext editingContext, AnonymousTipLine eo) {
    AnonymousTipLine localInstance = (eo == null) ? null : ERXEOControlUtilities.localInstanceOfObject(editingContext, eo);
    if (localInstance == null && eo != null) {
      throw new IllegalStateException("You attempted to localInstance " + eo + ", which has not yet committed.");
    }
    return localInstance;
  }
}
