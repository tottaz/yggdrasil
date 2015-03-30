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

package com.zimbra.webClient.servlet;

import java.io.*;
import java.util.*;
import java.util.zip.*;

import javax.servlet.*;
import javax.servlet.http.*;

/**
 * This class looks for the resource bundle for the requested file (e.g.
 * "/path/Messages.js"), resolves it, and generates a JavaScript file with
 * a class that contains all of the properties in the bundle. The servlet
 * takes into account the locale of the user request in order to load the
 * correct resource bundle.
 * <p>
 * For example, if the client requested the URL "/path/Messages.js" and
 * the locale was set to Japanese/Japan, the servlet would try to load the
 * Japanese version of the resource bundle. The base name of the bundle
 * would be just "/path/Messages" but the ResourceBundle class would
 * resolve this with the locale and look for the resource files.
 * <p>
 * Once all of the properties in the resource bundle have been resolved,
 * then the servlet iterates over the resource keys and generates a line
 * of JavaScript for each value. For example, if "/path/Messages.properties"
 * contains the following:
 * <pre>
 * one = One
 * two : Two\
 * Two
 * three = Three\
 * 		Three\
 * 		Three
 * </pre>
 * the generated JavaScript would look like this:
 * <pre>
 * function Messages() {}
 * 
 * Messages.one = "One";
 * Messages.two = "TwoTwo";
 * Messages.three = "ThreeThreeThree";
 * </pre>
 * <p>
 * <strong>Note:</strong>
 * The implementation assumes that the basename of the resource bundle
 * will always be "/msgs/" concatenated with the filename without the
 * extension.
 * 
 * @author Andy Clark
 */
public class Props2JsServlet 
	extends HttpServlet {

    //
    // Constants
    //
    
    private static final String BASENAME_PREFIX = "/msgs/";
    private static final String COMPRESSED_EXT = ".zgz";
    
    //
    // Data
    //
    
    private Map/*<Locale,Map<String,byte[]>>*/ buffers = new HashMap();
    
    //
    // HttpServlet methods
    //
    
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws IOException, ServletException {
        Locale locale = getLocale(req);
        String uri = req.getRequestURI();
        
        //resp.setContentType(uri.endsWith(COMPRESSED_EXT) ? "application/x-gzip" : "text/plain");
        OutputStream out = resp.getOutputStream();
        byte[] buffer = getBuffer(locale, uri);
        out.write(buffer);
        out.close();
    } // doGet(HttpServletRequest,HttpServletResponse)
    
    //
    // Private methods
    //

    private Locale getLocale(HttpServletRequest req) {
    	String language = req.getParameter("language");
    	if (language != null) {
        	String country = req.getParameter("country");
        	if (country != null) {
            	String variant = req.getParameter("variant");
            	if (variant != null) {
            		return new Locale(language, country, variant);
            	}
            	return new Locale(language, country);
        	}
        	return new Locale(language);
    	}
    	return req.getLocale();
    } // getLocale(HttpServletRequest):Locale
    
    private byte[] getBuffer(Locale locale, String uri) throws IOException {
        // get locale buffers
        Map/*<String,byte[]>*/ localeBuffers = (Map)buffers.get(locale);
        if (localeBuffers == null) {
            localeBuffers = new HashMap();
            buffers.put(locale, localeBuffers);
        }
        
        // get byte buffer
        byte[] buffer = (byte[])localeBuffers.get(uri);
        if (buffer == null) {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            PrintStream out = uri.endsWith(COMPRESSED_EXT) 
            				? new PrintStream(new GZIPOutputStream(bos)) 
            				: new PrintStream(bos); 
            out.println("// Locale: "+locale);

            String filenames = uri.substring(uri.lastIndexOf('/')+1);
            String classnames = filenames.substring(0, filenames.indexOf('.'));
            StringTokenizer tokenizer = new StringTokenizer(classnames, ",");
            while (tokenizer.hasMoreTokens()) {
                String classname = tokenizer.nextToken();
                load(out, locale, classname);
            }
            
            // save buffer
            out.close();
            buffer = bos.toByteArray();
            localeBuffers.put(uri, buffer);
        }

        return buffer;
    } // getBuffer(Locale,String):byte[]

    private void load(PrintStream out, Locale locale, String classname) {
        String basename = BASENAME_PREFIX+classname;

        out.println();
        out.println("// Basename: "+basename);
        out.println("function "+classname+"(){}");
        out.println();
        
        ResourceBundle bundle;
        try {
            bundle = ResourceBundle.getBundle(basename, locale);

            Enumeration keys = bundle.getKeys();
            Set keySet = new TreeSet();
            while (keys.hasMoreElements()) {
                keySet.add(keys.nextElement());
            }
            Iterator iter = keySet.iterator();
            while (iter.hasNext()) {
                String key = (String)iter.next();
                String value = bundle.getString(key);

                out.print(classname);
                out.print("[\"");
                printEscaped(out, key);
                out.print("\"] = \"");
                printEscaped(out, value);
                out.println("\";");
            }
        }
        catch (MissingResourceException e) {
            out.println("// resource bundle not found");
        }
    } // load(PrintStream,String)
    
    private static void printEscaped(PrintStream out, String s) {
        int length = s.length();
        for (int i = 0; i < length; i++) {
            char c = s.charAt(i);
            switch (c) {
                case '\t': out.print("\\t"); break;
                case '\n': out.print("\\n"); break;
                case '\r': out.print("\\r"); break;
                case '\\': out.print("\\\\"); break;
                case '"': out.print("\\\""); break;
                default: {
                    if (c < 32 || c > 127) {
                        String cs = Integer.toString(c, 16);
                        out.print("\\u");
                        int cslen = cs.length();
                        for (int j = cslen; j < 4; j++) {
                            out.print('0');
                        }
                        out.print(cs);
                    }
                    else {
                        out.print(c);
                    }
                }
            }
        }
    } // printEscaped(PrintStream,String)
    
} // class Props2JsServlet
