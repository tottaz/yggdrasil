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


package com.zimbra.ajax.imagesort;

import org.apache.tools.ant.*;
import org.apache.tools.ant.util.FileUtils;
import java.io.*;

public class ImageSortTask 
	extends Task {
    
    //
    // Data
    
    private String sourceDirname;
    private String targetDirname;
    private boolean deleteSource;
    
    private boolean noop;
    
    //
    // Public methods
    //
    
    public void setSource(String dirname) {
        sourceDirname = dirname;
    }
    
    public void setTarget(String dirname) {
        targetDirname = dirname;
    }
    
    public void setDelete(boolean delete) {
        deleteSource = delete;
    }
    
    public void setNoop(boolean noop) {
        this.noop = noop;
    }
    
    //
    // Task methods
    //
    
    public void execute() throws BuildException {

        // check parameters
        require(sourceDirname != null, "missing source directory name");
        require(targetDirname != null, "missing target directory name");
        
        File sourceDir = new File(sourceDirname);
        File targetDir = new File(targetDirname);
        
        require(sourceDir.exists(), "source directory doesn't exist");
        require(targetDir.exists(), "target directory doesn't exist");
        
        // process files in target directory
        try {
            System.out.println("Source directory: "+sourceDir);
            // results[0] is number of files processed 
            // results[1] is number of files skipped
            // results[2] is number of warnings
            int[] results = { 0 , 0, 0 };
            process(sourceDir, targetDir, deleteSource, noop, results);
            System.out.println("Processed "+results[0]+" file(s), skipped "+results[1]+" file(s).");
            if (results[2] > 0) {
                System.out.println("NOTE: Finished processing with "+results[2]+" warning(s).");
            }
        }
        catch (IOException e) {
            throw new BuildException(e);
        }
        
    } // execute()
    
    //
    // Private static methods
    //
    
    private static void process(File sourceDir, File targetDir, 
            					 boolean deleteSource, boolean noop,
            					 final int[] results) throws IOException {
        System.out.println("Scanning target directory: "+targetDir);

        // process files
        File[] files = targetDir.listFiles(new FileFilter() {
            public boolean accept(File file) {
                if (file.isFile()) {
	                String filename = file.getName().toLowerCase();
	                int period = filename.lastIndexOf('.');
	                String suffix = period != -1 ? filename.substring(period+1) : "";
	                boolean image = suffix.equals("gif") || suffix.equals("png") ||
	                				suffix.equals("jpg") || suffix.equals("jpeg");
	                if (image) {
	                    return true;
	                }
	                System.out.println("  Skipping non-image file: "+file);
	                results[1]++;
                }
                return false;
            }
        });
        if (files.length > 0) {
            FileUtils fileUtils = FileUtils.newFileUtils();
	        for (int i = 0; i < files.length; i++) {
	            File targetFile = files[i];
	            File sourceFile = new File(sourceDir, targetFile.getName());
	            if (!sourceFile.exists()) {
	                System.out.println("  Source file missing: "+sourceFile);
	                results[2]++;
	            }
	            else {
	                if (deleteSource) {
	                    System.out.println("  Moving "+sourceFile+" -> "+targetFile);
	                }
	                else {
	                    System.out.println("  Copying "+sourceFile+" -> "+targetFile);
	                }
	                if (!noop) {
		                fileUtils.copyFile(sourceFile, targetFile);
		                if (deleteSource) {
		                    sourceFile.delete();
		                }
	                }
	                results[0]++;
	            }
	        }
        }
        
        // process sub-directories
        File[] dirs = targetDir.listFiles(new FileFilter() {
            public boolean accept(File file) {
                return file.isDirectory();
            }
        });
        for (int i = 0; i < dirs.length; i++) {
            File dir = dirs[i];
            process(sourceDir, dir, deleteSource, noop, results);
        }

    } // process(File,File,boolean,boolean,int[])
    
    private static void require(boolean truthful, String message) throws BuildException {
        if (!truthful) {
            throw new BuildException(message);
        }
    }

} // class ImageSortTask
