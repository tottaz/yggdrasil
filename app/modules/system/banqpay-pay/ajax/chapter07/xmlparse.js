/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *         http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original code by Matthew Eernisse (mde@fleegix.org)
 *
 */

XMLParse = new function(){

    // Takes an array of XML items, transforms into an array of JS objects
    // Call it like this: res = XMLParse.xml2ObjArray(xml, 'Item'); 
    this.xml2ObjArray = function(xmlDocElem, tagItemName) {
        var self = XMLParse;
        var xmlElemArray = new Array;
        var xmlElemRow;
        var objArray = [];
        
        // Rows returned
        if (xmlDocElem.hasChildNodes()) {
            xmlElemArray = xmlDocElem.getElementsByTagName(tagItemName);
            xmlElemRow = xmlElemArray[0];
            // Create array of objects and set properties
            for (var j = 0; j < xmlElemArray.length; j++) {
                xmlElemRow = xmlElemArray[j];
                objArray[j] = self.xmlElem2Obj(xmlElemArray[j]);
            }
        }
        return objArray;
    };
    
    // Transforms an XML element into a JS object
    this.xmlElem2Obj = function(xmlElem) {
        var self = XMLParse;
        var ret = new Object();
        self.setPropertiesRecursive(ret, xmlElem);
        return ret;
    };
    
    this.setPropertiesRecursive = function(obj, node) {
        var self = XMLParse;
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType == 1 &&
                  node.childNodes[i].firstChild) {
                    // If node has only one child
                    // set the obj property to the value of the node
                    if(node.childNodes[i].childNodes.length == 1) {
                        obj[node.childNodes[i].tagName] = 
                        node.childNodes[i].firstChild.nodeValue;
                    }
                    // Otherwise this obj property is an array
                    // Recurse to set its multiple properties
                    else {
                        obj[node.childNodes[i].tagName] = [];
                        // Call recursively -- rinse and repeat
                        // ==============
                        self.setPropertiesRecursive(
                        obj[node.childNodes[i].tagName], 
                        node.childNodes[i]);
                    }
                }
            }
        }
    };
    
    this.cleanXMLObjText = function(xmlObj) {
        var self = XMLParse;
        var cleanObj = xmlObj;
        for (var prop in cleanObj) {
            cleanObj[prop] = cleanText(cleanObj[prop]);
        }
        return cleanObj;
    };
    
    this.cleanText = function(str) {
        var self = XMLParse;
        var ret = str;
        ret = ret.replace(/\n/g, '');
        ret = ret.replace(/\r/g, '');
        ret = ret.replace(/\'/g, "\\'");
        ret = ret.replace(/\[CDATA\[/g, '');
        ret = ret.replace(/\]]/g, '');
        return ret;
    };
    
    this.rendered2Source = function(str) {
        var self = XMLParse;
        // =============
        // Convert string of markup into format which will display
        // markup in the browser instead of rendering it
        // =============
        var proc = str;    
        proc = proc.replace(/</g, '&lt;');
        proc = proc.replace(/>/g, '&gt;');
        return '<pre>' + proc + '</pre>';
    };
    
    /*
    Works with embedded XML document structured like this:
    =====================
    <div id="xmlThingDiv" style="display:none;">
        <xml>
            <thinglist>
                <thingsection sectionname="First Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Foo</thingproperty1>
                        <thingproperty2>Bar</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                    <thingitem>
                        <thingproperty1>Free</thingproperty1>
                        <thingproperty2>Beer</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection> 
                <thingsection sectionname="Second Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Far</thingproperty1>
                        <thingproperty2>Boor</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection>
            </thinglist>
        </xml>
    </div>
    
    Call the function like this:
    var xmlElem = getXMLDocElem('xmlThingDiv', 'thinglist');
    --------
    xmlDivId: For IE to pull using documentElement
    xmlNodeName: For Moz/compat to pull using getElementsByTagName
    */
    
    // Returns a single, top-level XML document node
    this.getXMLDocElem = function(xmlDivId, xmlNodeName) {
        var self = XMLParse;
        var xmlElemArray = [];
        var xmlDocElem = null;
        if (document.all) {
                var xmlStr = document.getElementById(xmlDivId).innerHTML;
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xmlStr);    
                xmlDocElem = xmlDoc.documentElement;
          }
          // Moz/compat can access elements directly
          else {
            xmlElemArray = 
                window.document.body.getElementsByTagName(xmlNodeName);
            xmlDocElem = xmlElemArray[0]; ;
          }
          return xmlDocElem;
    };
}
// Close the .constructor loophole
XMLParse.constructor = null;
