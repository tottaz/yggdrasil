/*                                                                                                                                                      
Copyright (c) 2006, Yahoo! Inc. All rights reserved.                                                                                                    
Code licensed under the BSD License:                                                                                                                    
http://developer.yahoo.net/yui/license.txt                                                                                                              
version: 0.10.0                                                                                                                                         
*/ 

/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

/**
 * The Yahoo global namespace
 * @constructor
 */
var BANQPAY = window.BANQPAY || {};

/**
 * Returns the namespace specified and creates it if it doesn't exist
 *
 * BANQPAY.namespace("property.package");
 * BANQPAY.namespace("BANQPAY.property.package");
 *
 * Either of the above would create BANQPAY.property, then
 * BANQPAY.property.package
 *
 * @param  {String} sNameSpace String representation of the desired 
 *                             namespace
 * @return {Object}            A reference to the namespace object
 */
BANQPAY.namespace = function( sNameSpace ) {

    if (!sNameSpace || !sNameSpace.length) {
        return null;
    }

    var levels = sNameSpace.split(".");

    var currentNS = BANQPAY;

    // BANQPAY is implied, so it is ignored if it is included
    for (var i=(levels[0] == "BANQPAY") ? 1 : 0; i<levels.length; ++i) {
        currentNS[levels[i]] = currentNS[levels[i]] || {};
        currentNS = currentNS[levels[i]];
    }

    return currentNS;
};

/**
 * Global log method.
 */
BANQPAY.log = function(sMsg,sCategory) {
    if(BANQPAY.widget.Logger) {
        BANQPAY.widget.Logger.log(null, sMsg, sCategory);
    } else {
        return false;
    }
};

BANQPAY.namespace("util");
BANQPAY.namespace("widget");
BANQPAY.namespace("example");
