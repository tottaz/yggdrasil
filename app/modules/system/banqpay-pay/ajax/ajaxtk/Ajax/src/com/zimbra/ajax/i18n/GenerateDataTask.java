/*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 1.1
*
* The contents of this file are subject to the Mozilla Public
* License Version 1.1 ("License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.zimbra.com/license
*
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
* the License for the specific language governing rights and limitations
* under the License.
*
* The Original Code is: Zimbra AJAX Toolkit.
*
* The Initial Developer of the Original Code is Zimbra, Inc.
* Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
* All Rights Reserved.
*
* Contributor(s):
*
* ***** END LICENSE BLOCK *****
*/


package com.zimbra.ajax.i18n;

import java.io.File;
import org.apache.tools.ant.*;

public class GenerateDataTask 
	extends Task {
    
    //
    // Data
    //

    // required
    
    private String dirname = null;
    private String basename = "I18nMsg";
    
    //
    // Public methods
    //
    
    // required
    
    public void setDestDir(String dirname) {
        this.dirname = dirname;
    }
    
    public void setBaseName(String basename) {
        this.basename = basename;
    }
    
    //
    // Task methods
    //
    
    public void execute() throws BuildException {

        // check required arguments 
        if (dirname == null) {
            throw new BuildException("destination directory required -- use destdir attribute");
        }
        File dir = new File(dirname);
        if (!dir.exists()) {
            throw new BuildException("destination directory doesn't exist");
        }
        if (!dir.isDirectory()) {
            throw new BuildException("destination must be a directory");
        }
        
        // build argument list
        String[] argv = { "-d", dirname, "-b", basename };
        
        // run program
        try {
            System.out.print("GenerateData");
            for (int i = 0; i < argv.length; i++) {
                System.out.print(' ');
                System.out.print(argv[i]);
            }
            System.out.println();
            GenerateData.main(argv);
        }
        catch (Exception e) {
            throw new BuildException(e);
        }
        
    } // execute()

} // class GenerateDataTask