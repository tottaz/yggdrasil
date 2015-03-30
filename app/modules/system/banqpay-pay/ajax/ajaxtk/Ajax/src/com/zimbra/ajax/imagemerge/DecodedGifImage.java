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

import java.awt.*;
import java.io.*;
import java.awt.image.*;

public class DecodedGifImage extends DecodedImage {

    private GifDecoder d;
    private int mSortedColorTable[];

    public DecodedGifImage(String filename,
                           String prefix,
                           int layoutStyle
                           ) 
    {
        d = new GifDecoder();
        mFilename = filename;
        mPrefix = prefix;
        mLayoutStyle = layoutStyle;
    }


    public BufferedImage getBufferedImage() { return d.getImage(); }
    
    public boolean usesTransparency() { return d.transparency; }

    public int getTransparencyColor() {
        return d.gct[d.transIndex];
    }

    public int getWidth() {
        return d.width;
    }
    public int getHeight() {
        return d.height;
    }

    public int[] getImagesColorTable() {
        return d.gct;
    }

    public int[] getUniqueColorTable() {
        return mSortedColorTable;
    }

    /*
     * Ensure that any colors that are present in this image are included
     * in the colorTable.  This returns the total number of colors in the
     * color table after any needed colors are added.
     */
    public int addImageColors(Color colorTable[],
                              int combinedColors)
    {
        for (int i = 0; i < mSortedColorTable.length; i++) {
            int j;
            // the 1 starting point skips the transparent color
            for (j = 1; j < combinedColors; j++)
                if (colorTable[j].getRGB() == mSortedColorTable[i])
                    break;
            if (j >= combinedColors)
                // not found so add it
                colorTable[combinedColors++] = new Color(mSortedColorTable[i]);
        }
        return combinedColors;
    }



    private static void sort(int ct[],
                             int numElems) 
    {
        // bubble sort 
        int flag;
        do { 
            /* do...while loop to sort the array */
            flag=0;
            for(int z=0; z<(numElems-1); z++) {
                if(ct[z] > ct[z+1]) {
                    int temp = ct[z];
                    ct[z] = ct[z+1];
                    ct[z+1] = temp;
                    flag = 1;
                }
            }
        } while(flag!=0); /* end of bubble sort */
    }


    /*
     * Load the image.  This includes parsing out the color table, transparency,
     * etc.  It will also determine the unique colors in this image.
     */
    public void load() 
        throws ImageMergeException
    {
        try {
            int status = d.read(new FileInputStream(new File(mFilename)));
            if (status != GifDecoder.STATUS_OK) {
                System.err.println("ERROR " + status + " decoding " + mFilename);
                throw new ImageMergeException("ERROR " + status + " decoding " + mFilename);
            }
        } catch (FileNotFoundException f) {
            System.err.println("ERROR cannot find file " + mFilename);
            throw new ImageMergeException("ERROR cannot find file " + mFilename, f);
        }

        int n = d.getFrameCount();
        if (n != 1) {
            System.err.println("ERROR: There are " + n + " frames in " + mFilename);
            throw new ImageMergeException("ERROR: There are " + n + " frames in " + mFilename);
        }
        
        //System.out.println("gctFlag is " + d.gctFlag);
        //System.out.println("gctSize is " + d.gctSize);
        //System.out.println("gct.length is " + d.gct.length);
        //System.out.println("transparency is " + ((d.transparency) ? "on" : "off"));
        //System.out.println("transparency index is " + d.transIndex + ", and color is " + d.gct[d.transIndex]);

        // get a sorted list of the colors in the color table
        int ct[] = new int[d.gctSize];
        for (int i = 0; i < d.gctSize; i++)
            ct[i] = d.gct[i];
        sort(ct, ct.length);

        // get a list of the unique colors using the sorted list
        mSortedColorTable = uniqify(ct, ct.length);
    }

    /*
     * Given a sorted array, returns an array that contains exactly
     * one instance of each int in the array (removing duplicates).
     */
    private static int[] uniqify(int ct[],
                                 int numElems) 
    {
        int unique = 1;
        for (int i = 1; i < numElems; i++)
            if (ct[i] != ct[i-1])
                unique++;

        int result[] = new int[unique];
        result[0] = ct[0];
        unique = 1;
        for (int i = 1; i < numElems; i++) {
            if (ct[i] != ct[i-1]) {
                result[unique] = ct[i];
                unique++;
            }
        }
        
        return result;
    }
}