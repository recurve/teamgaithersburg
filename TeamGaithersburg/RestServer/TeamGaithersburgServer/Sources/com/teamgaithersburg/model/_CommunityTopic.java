// DO NOT EDIT.  Make changes to CommunityTopic.java instead.
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
public abstract class _CommunityTopic extends  ERXGenericRecord {
  public static final String ENTITY_NAME = "CommunityTopic";

  // Attribute Keys
  public static final ERXKey<String> DETAILS = new ERXKey<String>("details");
  public static final ERXKey<String> DETAILS_IMAGE = new ERXKey<String>("detailsImage");
  public static final ERXKey<Integer> SORT_ORDER = new ERXKey<Integer>("sortOrder");
  public static final ERXKey<String> TITLE = new ERXKey<String>("title");
  public static final ERXKey<String> TOPIC_FOOTER_IMAGE = new ERXKey<String>("topicFooterImage");
  // Relationship Keys

  // Attributes
  public static final String DETAILS_KEY = DETAILS.key();
  public static final String DETAILS_IMAGE_KEY = DETAILS_IMAGE.key();
  public static final String SORT_ORDER_KEY = SORT_ORDER.key();
  public static final String TITLE_KEY = TITLE.key();
  public static final String TOPIC_FOOTER_IMAGE_KEY = TOPIC_FOOTER_IMAGE.key();
  // Relationships

  private static Logger LOG = Logger.getLogger(_CommunityTopic.class);

  public CommunityTopic localInstanceIn(EOEditingContext editingContext) {
    CommunityTopic localInstance = (CommunityTopic)EOUtilities.localInstanceOfObject(editingContext, this);
    if (localInstance == null) {
      throw new IllegalStateException("You attempted to localInstance " + this + ", which has not yet committed.");
    }
    return localInstance;
  }

  public String details() {
    return (String) storedValueForKey(_CommunityTopic.DETAILS_KEY);
  }

  public void setDetails(String value) {
    if (_CommunityTopic.LOG.isDebugEnabled()) {
    	_CommunityTopic.LOG.debug( "updating details from " + details() + " to " + value);
    }
    takeStoredValueForKey(value, _CommunityTopic.DETAILS_KEY);
  }

  public String detailsImage() {
    return (String) storedValueForKey(_CommunityTopic.DETAILS_IMAGE_KEY);
  }

  public void setDetailsImage(String value) {
    if (_CommunityTopic.LOG.isDebugEnabled()) {
    	_CommunityTopic.LOG.debug( "updating detailsImage from " + detailsImage() + " to " + value);
    }
    takeStoredValueForKey(value, _CommunityTopic.DETAILS_IMAGE_KEY);
  }

  public Integer sortOrder() {
    return (Integer) storedValueForKey(_CommunityTopic.SORT_ORDER_KEY);
  }

  public void setSortOrder(Integer value) {
    if (_CommunityTopic.LOG.isDebugEnabled()) {
    	_CommunityTopic.LOG.debug( "updating sortOrder from " + sortOrder() + " to " + value);
    }
    takeStoredValueForKey(value, _CommunityTopic.SORT_ORDER_KEY);
  }

  public String title() {
    return (String) storedValueForKey(_CommunityTopic.TITLE_KEY);
  }

  public void setTitle(String value) {
    if (_CommunityTopic.LOG.isDebugEnabled()) {
    	_CommunityTopic.LOG.debug( "updating title from " + title() + " to " + value);
    }
    takeStoredValueForKey(value, _CommunityTopic.TITLE_KEY);
  }

  public String topicFooterImage() {
    return (String) storedValueForKey(_CommunityTopic.TOPIC_FOOTER_IMAGE_KEY);
  }

  public void setTopicFooterImage(String value) {
    if (_CommunityTopic.LOG.isDebugEnabled()) {
    	_CommunityTopic.LOG.debug( "updating topicFooterImage from " + topicFooterImage() + " to " + value);
    }
    takeStoredValueForKey(value, _CommunityTopic.TOPIC_FOOTER_IMAGE_KEY);
  }


  public static CommunityTopic createCommunityTopic(EOEditingContext editingContext, String details
, Integer sortOrder
, String title
) {
    CommunityTopic eo = (CommunityTopic) EOUtilities.createAndInsertInstance(editingContext, _CommunityTopic.ENTITY_NAME);    
		eo.setDetails(details);
		eo.setSortOrder(sortOrder);
		eo.setTitle(title);
    return eo;
  }

  public static ERXFetchSpecification<CommunityTopic> fetchSpec() {
    return new ERXFetchSpecification<CommunityTopic>(_CommunityTopic.ENTITY_NAME, null, null, false, true, null);
  }

  public static NSArray<CommunityTopic> fetchAllCommunityTopics(EOEditingContext editingContext) {
    return _CommunityTopic.fetchAllCommunityTopics(editingContext, null);
  }

  public static NSArray<CommunityTopic> fetchAllCommunityTopics(EOEditingContext editingContext, NSArray<EOSortOrdering> sortOrderings) {
    return _CommunityTopic.fetchCommunityTopics(editingContext, null, sortOrderings);
  }

  public static NSArray<CommunityTopic> fetchCommunityTopics(EOEditingContext editingContext, EOQualifier qualifier, NSArray<EOSortOrdering> sortOrderings) {
    ERXFetchSpecification<CommunityTopic> fetchSpec = new ERXFetchSpecification<CommunityTopic>(_CommunityTopic.ENTITY_NAME, qualifier, sortOrderings);
    fetchSpec.setIsDeep(true);
    NSArray<CommunityTopic> eoObjects = fetchSpec.fetchObjects(editingContext);
    return eoObjects;
  }

  public static CommunityTopic fetchCommunityTopic(EOEditingContext editingContext, String keyName, Object value) {
    return _CommunityTopic.fetchCommunityTopic(editingContext, new EOKeyValueQualifier(keyName, EOQualifier.QualifierOperatorEqual, value));
  }

  public static CommunityTopic fetchCommunityTopic(EOEditingContext editingContext, EOQualifier qualifier) {
    NSArray<CommunityTopic> eoObjects = _CommunityTopic.fetchCommunityTopics(editingContext, qualifier, null);
    CommunityTopic eoObject;
    int count = eoObjects.count();
    if (count == 0) {
      eoObject = null;
    }
    else if (count == 1) {
      eoObject = eoObjects.objectAtIndex(0);
    }
    else {
      throw new IllegalStateException("There was more than one CommunityTopic that matched the qualifier '" + qualifier + "'.");
    }
    return eoObject;
  }

  public static CommunityTopic fetchRequiredCommunityTopic(EOEditingContext editingContext, String keyName, Object value) {
    return _CommunityTopic.fetchRequiredCommunityTopic(editingContext, new EOKeyValueQualifier(keyName, EOQualifier.QualifierOperatorEqual, value));
  }

  public static CommunityTopic fetchRequiredCommunityTopic(EOEditingContext editingContext, EOQualifier qualifier) {
    CommunityTopic eoObject = _CommunityTopic.fetchCommunityTopic(editingContext, qualifier);
    if (eoObject == null) {
      throw new NoSuchElementException("There was no CommunityTopic that matched the qualifier '" + qualifier + "'.");
    }
    return eoObject;
  }

  public static CommunityTopic localInstanceIn(EOEditingContext editingContext, CommunityTopic eo) {
    CommunityTopic localInstance = (eo == null) ? null : ERXEOControlUtilities.localInstanceOfObject(editingContext, eo);
    if (localInstance == null && eo != null) {
      throw new IllegalStateException("You attempted to localInstance " + eo + ", which has not yet committed.");
    }
    return localInstance;
  }
}
