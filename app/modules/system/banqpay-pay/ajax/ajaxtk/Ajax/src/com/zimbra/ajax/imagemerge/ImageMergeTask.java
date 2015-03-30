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


package com.zimbra.ajax.imagemerge;

import java.io.File;
import java.util.*;

import org.apache.tools.ant.*;
import org.apache.tools.ant.types.*;

public class ImageMergeTask 
	extends Task {
    
    //
    // Data
    //

    // required
    
    private List _inputDirs= new LinkedList();
    private String _outputDir = null;
    private String _cssFile = null;
    private String _cssPath = null;
    private String _divFile = null;
    
    // optional
    
    private String _layoutStyle = "auto";
    private boolean _copy = false;

    //
    // Public methods
    //
    
    // required
    
    public void setDestDir(String dirname) {
        _outputDir = dirname;
    }
    
    public DirSet createDirSet() {
        DirSet dirset = new DirSet();
        _inputDirs.add(dirset);
        return dirset;
    }
    
    public void setCssFile(String filename) {
        _cssFile = filename;
    }
    
    public void setCssPath(String path) {
        _cssPath = path;
    }
    
    public void setDivFile(String filename) {
        _divFile = filename;
    }
    
    // optional
    
    public void setCopy(boolean copy) {
        _copy = copy;
    }
    
    public void setLayout(String layout) {
        _layoutStyle = layout;
    }
    
    //
    // Task methods
    //
    
    public void execute() throws BuildException {

        // check required arguments 
        if (_outputDir == null) {
            throw new BuildException("destination directory required -- use destdir attribute");
        }
        File dir = new File(_outputDir);
        if (!dir.exists()) {
            throw new BuildException("destination directory doesn't exist");
        }
        if (!dir.isDirectory()) {
            throw new BuildException("destination must be a directory");
        }
        
        if (_inputDirs.size() == 0) {
            throw new BuildException("input directories required -- use nested <dirset> element(s)");
        }
        
        if (_cssFile == null || _cssFile.length() == 0) {
            throw new BuildException("css output file required -- use cssfile attribute");
        }
        
        if (_cssPath == null) {
            throw new BuildException("css path prefix required -- use csspath attribute");
        }
        
        if (!_layoutStyle.equals("auto") && !_layoutStyle.equals("horizontal") && 
            !_layoutStyle.equals("vertical") && !_layoutStyle.equals("repeat")) {
            throw new BuildException("layout must be specified as 'auto', 'horizontal', 'vertical', or 'repeat'");
        }

        // build argument list
        List argList = new LinkedList();
        
        Iterator iter = _inputDirs.iterator();
        StringBuffer dirs = new StringBuffer();
        while (iter.hasNext()) {
            DirSet dirset = (DirSet)iter.next();
            DirectoryScanner scanner = dirset.getDirectoryScanner(getProject());
            File baseDir = scanner.getBasedir();
            String baseDirName = baseDir.getAbsolutePath() + File.separator;
            String[] dirnames = scanner.getIncludedDirectories();
            for (int i = 0; i < dirnames.length; i++) {
                if (dirs.length() > 0) {
                    dirs.append(';');
                }
                dirs.append(baseDirName+dirnames[i]);
            }
        }
        argList.add("-i");
        argList.add(dirs.toString());
        
        argList.add("-o");
        String basedirname = getProject().getBaseDir().getAbsolutePath()+File.separator;
        argList.add(_outputDir.startsWith(basedirname) ? _outputDir : basedirname+_outputDir);
        
        argList.add("-s");
        argList.add(_cssFile);
        
        argList.add("-p");
        argList.add(_cssPath);
        
        if (_divFile != null) {
        	argList.add("-d");
        	argList.add(_divFile);
        }
        
        if (!_layoutStyle.equals("auto")) {
            argList.add("-l");
            argList.add(_layoutStyle);
        }

        if (_copy) {
            argList.add("-c");
        }
        
        // run program
        try {
            String[] argv = (String[])argList.toArray(new String[0]);
            System.out.print("ImageMerge");
            for (int i = 0; i < argv.length; i++) {
                System.out.print(' ');
                System.out.print(argv[i]);
            }
            System.out.println();
            ImageMerge.main(argv);
        }
        catch (Exception e) {
            throw new BuildException(e);
        }
        
    } // execute()

} // class ImageMergeTask