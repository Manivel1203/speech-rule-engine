// Copyright 2013 Google Inc.
// Copyright 2018 Volker Sorge
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Utility functions for high performance xpath lookup.
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

goog.provide('sre.RuleEngineUtil');

goog.require('sre.DomUtil');


sre.RuleEngineUtil.NODE_SELECTORS_ = {
  'children/*[1]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 0);
  },
  'children/*[2]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 1);
  },
  'children/*[3]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 2);
  },
  'children/*[4]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 3);
  },
  'children/*[5]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 4);
  },
  'content/*[1]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CONTENT', 0);
  },
  'content/*[2]': function(node) {
    return sre.RuleEngineUtil.getSecondLayer_(node, 'CONTENT', 1);
  },
  'children/*[1]/children/*[1]': function(node) {
    var firstLayer = sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 0);
    return firstLayer ?
      sre.RuleEngineUtil.getSecondLayer_(firstLayer[0], 'CHILDREN', 0) :
      null;
  },
  'children/*[1]/children/*[2]': function(node) {
    var firstLayer = sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 0);
    return firstLayer ?
      sre.RuleEngineUtil.getSecondLayer_(firstLayer[0], 'CHILDREN', 1) :
      null;
  },
  'children/*[2]/children/*[1]': function(node) {
    var firstLayer = sre.RuleEngineUtil.getSecondLayer_(node, 'CHILDREN', 1);
    return firstLayer ?
      sre.RuleEngineUtil.getSecondLayer_(firstLayer[0], 'CHILDREN', 0) :
      null;
  },
  '.': function(node) { return [node]; },
  './*[1]': function(node) {
    var children = node.childNodes;
    return children && children[0] ? [children[0]] : null;
  },
  './*[2]': function(node) {
    var children = node.childNodes;
    return children && children[1] ? [children[1]] : null;
  },
  'text()': function(node) {
    return [node.childNodes[0]];
  }
};

sre.RuleEngineUtil.TEXT_SELECTORS_ = {
  'text()': function(node) { return node.textContent; },
  '@role': function(node) { return node.getAttribute('role'); },
  '@font': function(node) { return node.getAttribute('font'); }
};

// Helper functions
sre.RuleEngineUtil.getAttribute_ = function(node, attr) {
  return node.getAttribute(attr);
};

sre.RuleEngineUtil.getLayer_ = function(node, tag) {
  if (!node.hasChildNodes()) {
    return null;
  }
  var children = node.childNodes;
  var firstLayer = null;
  for (var i = 0, child; child = children[i]; i++) {
    if (child.nodeType == sre.DomUtil.NodeType.ELEMENT_NODE &&
        sre.DomUtil.tagName(child) === tag) {
      return firstLayer;
    }
  }
  return null;
};


sre.RuleEngineUtil.getSecondLayer_ = function(node, tag, number) {
  var firstLayer = sre.RuleEngineUtil.getLayer_(node, tag);
  if (firstLayer && firstLayer.hasChildNodes()) {
    var child = firstLayer.childNodes[number];
    return child ? [child] : null;
  }
  return null;
};


sre.RuleEngineUtil.addCustomQueries = function(store) {
  for (var key in sre.RuleEngineUtil.NODE_SELECTORS_) {
    store.customQueries.addXpath(key, sre.RuleEngineUtil.NODE_SELECTORS_[key]);
    store.customStrings.addXpath(key, sre.RuleEngineUtil.TEXT_SELECTORS_[key]);
  }
};
