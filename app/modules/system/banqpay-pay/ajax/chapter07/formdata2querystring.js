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
 * Additional bugfixes by Mark Pruett (mark.pruett@comcast.net)
 *
 */

// The var docForm should be a reference to a <form>

function formData2QueryString(docForm) {

    var submitContent = '';
    var formElem;
    var lastElemName = '';
    
    for (i = 0; i < docForm.elements.length; i++) {
        
        formElem = docForm.elements[i];
        switch (formElem.type) {
            // Text fields, hidden form elements
            case 'text':
            case 'hidden':
            case 'password':
            case 'textarea':
            case 'select-one':
                submitContent += formElem.name + '=' + escape(formElem.value) + '&'
                break;
                
            // Radio buttons
            case 'radio':
                if (formElem.checked) {
                    submitContent += formElem.name + '=' + escape(formElem.value) + '&'
                }
                break;
                
            // Checkboxes
            case 'checkbox':
                if (formElem.checked) {
                    // Continuing multiple, same-name checkboxes
                    if (formElem.name == lastElemName) {
                        // Strip of end ampersand if there is one
                        if (submitContent.lastIndexOf('&') == submitContent.length-1) {
                            submitContent = submitContent.substr(0, submitContent.length - 1);
                        }
                        // Append value as comma-delimited string
                        submitContent += ',' + escape(formElem.value);
                    }
                    else {
                        submitContent += formElem.name + '=' + escape(formElem.value);
                    }
                    submitContent += '&';
                    lastElemName = formElem.name;
                }
                break;
                
        }
    }
    // Remove trailing separator
    submitContent = submitContent.substr(0, submitContent.length - 1);
    return submitContent;
}