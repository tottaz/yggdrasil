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

import java.io.*;
import java.text.*;
import java.util.*;

/**
 * This class retrieves i18n information (e.g. month/weekday translations,
 * formatting patterns, etc.) and generates properties files for all the
 * locales known to Java in the JVM in which this program is run.
 * <p>
 * The <code>Locale.US</code> locale is assumed to be the default language.
 * This means that after the i18n information is gathered, the en_US data
 * is merged into the en data. Also, when the resources are written out,
 * the en data is saved without the language suffix. For example, if the
 * basename is "I18nMsg", then the en data will be saved as
 * "I18nMsg.properties" instead of "I18nMsg_en.properties". This is to
 * ensure that English is the default regardless of what locale the JVM
 * is running under.  
 * <p>
 * <strong>Note:</strong>
 * In order for the timezone information to be useful to the Zimbra
 * server, only specific timezones are queried and their identifiers are 
 * mapped to the identifiers expected by the server. In the future, the
 * server may change to support the Java identifiers removing the need
 * for such a mapping.
 */
public class GenerateData {
    
    //
    // Constants
    //
    
	private static int[] DATE_STYLES = { 
        DateFormat.SHORT, 
        DateFormat.MEDIUM, 
        DateFormat.LONG, 
        DateFormat.FULL 
    };
	
	private static String[] MONTHS = {
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	};
	private static String[] WEEKDAYS = {
		"Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"
	};
	
	private static final Locale DEFAULT_LOCALE = Locale.US;
	private static final Locale[] LOCALES = Locale.getAvailableLocales();
    
	private static Map TIMEZONES = new HashMap();
	
	//
	// Static initializer
	//
	
	static {
		TIMEZONES.put("Africa/Algiers", "(GMT+01.00) West Central Africa");
		TIMEZONES.put("Africa/Cairo", "(GMT+02.00) Cairo");
		TIMEZONES.put("Africa/Casablanca", "(GMT) Casablanca / Monrovia");
		TIMEZONES.put("Africa/Harare", "(GMT+02.00) Harare / Pretoria");
		TIMEZONES.put("Africa/Nairobi", "(GMT+03.00) Nairobi");
		
		TIMEZONES.put("America/Bogota", "(GMT-05.00) Bogota / Lima / Quito");
		TIMEZONES.put("America/Buenos_Aires", "(GMT-03.00) Buenos Aires / Georgetown");
		TIMEZONES.put("America/Caracas", "(GMT-04.00) Caracas / La Paz");
		TIMEZONES.put("America/Godthab", "(GMT-03.00) Greenland");
		TIMEZONES.put("America/Santiago", "(GMT-04.00) Santiago");
		
		TIMEZONES.put("Asia/Aqtobe", "(GMT+05.00) Ekaterinburg");
		TIMEZONES.put("Asia/Baghdad", "(GMT+03.00) Baghdad");
		TIMEZONES.put("Asia/Baku", "(GMT+04.00) Baku / Tbilisi / Yerevan");
		TIMEZONES.put("Asia/Bangkok", "(GMT+07.00) Bangkok / Hanoi / Jakarta");
		TIMEZONES.put("Asia/Calcutta", "(GMT+05.30) Chennai / Kolkata / Mumbai / New Delhi");
		TIMEZONES.put("Asia/Colombo", "(GMT+06.00) Sri Jayawardenepura");
		TIMEZONES.put("Asia/Dhaka", "(GMT+06.00) Astana / Dhaka");
		TIMEZONES.put("Asia/Hong_Kong", "(GMT+08.00) Beijing / Chongqing / Hong Kong / Urumqi");
		TIMEZONES.put("Asia/Irkutsk", "(GMT+08.00) Irkutsk / Ulaan Bataar");
		TIMEZONES.put("Asia/Jerusalem", "(GMT+02.00) Jerusalem");
		TIMEZONES.put("Asia/Kabul", "(GMT+04.30) Kabul");
		TIMEZONES.put("Asia/Karachi", "(GMT+05.00) Islamabad / Karachi / Tashkent");
		TIMEZONES.put("Asia/Katmandu", "(GMT+05.45) Kathmandu");
		TIMEZONES.put("Asia/Krasnoyarsk", "(GMT+07.00) Krasnoyarsk");
		TIMEZONES.put("Asia/Kuala_Lumpur", "(GMT+08.00) Kuala Lumpur / Singaporev");
		TIMEZONES.put("Asia/Kuwait", "(GMT+03.00) Kuwait / Riyadh");
		TIMEZONES.put("Asia/Magadan", "(GMT+11.00) Magadan / Solomon Is. / New Calenodia");
		TIMEZONES.put("Asia/Muscat", "(GMT+04.00) Abu Dhabi / Muscat");
		TIMEZONES.put("Asia/Novosibirsk", "(GMT+06.00) Almaty / Novosibirsk");
		TIMEZONES.put("Asia/Rangoon", "(GMT+06.30) Rangoon");
		TIMEZONES.put("Asia/Seoul", "(GMT+09.00) Seoul");
		TIMEZONES.put("Asia/Taipei", "(GMT+08.00) Taipei");
		TIMEZONES.put("Asia/Tehran", "(GMT+03.30) Tehran");
		TIMEZONES.put("Asia/Tokyo", "(GMT+09.00) Osaka / Sapporo / Tokyo");
		TIMEZONES.put("Asia/Vladivostok", "(GMT+10.00) Vladivostok");
		TIMEZONES.put("Asia/Yakutsk", "(GMT+09.00) Yakutsk");
		
		TIMEZONES.put("Atlantic/Azores", "(GMT-01.00) Azores");
		TIMEZONES.put("Atlantic/Cape_Verde", "(GMT-01.00) Cape Verde Is.");
		
		TIMEZONES.put("Australia/Adelaide", "(GMT+09.30) Adelaide");
		TIMEZONES.put("Australia/Brisbane", "(GMT+10.00) Brisbane");
		TIMEZONES.put("Australia/Darwin", "(GMT+09.30) Darwin");
		TIMEZONES.put("Australia/Hobart", "(GMT+10.00) Hobart");
		TIMEZONES.put("Australia/Perth", "(GMT+08.00) Perth");
		TIMEZONES.put("Australia/Sydney", "(GMT+10.00) Canberra / Melbourne / Sydney");
		
		TIMEZONES.put("Brazil/East", "(GMT-03.00) Brasilia");

		TIMEZONES.put("Canada/Eastern", "(GMT-04.00) Atlantic Time (Canada)");
		TIMEZONES.put("Canada/Newfoundland", "(GMT-03.30) Newfoundlan");
		TIMEZONES.put("Canada/Saskatchewan", "(GMT-06.00) Saskatchewan");

		//TIMEZONES.put("Etc/GMT+12", "(GMT-12.00) International Date Line West");

		TIMEZONES.put("Europe/Athens", "(GMT+02.00) Athens / Beirut / Istanbul / Minsk");
		TIMEZONES.put("Europe/Berlin", "(GMT+01.00) Amsterdam / Berlin / Bern / Rome / Stockholm / Vienna");
		TIMEZONES.put("Europe/London", "(GMT) Greenwich Mean Time - Dublin / Edinburgh / Lisbon / London");
		TIMEZONES.put("Europe/Moscow", "(GMT+03.00) Moscow / St. Petersburg / Volgograd");

		TIMEZONES.put("Pacific/Auckland", "(GMT+12.00) Auckland / Wellington");
		TIMEZONES.put("Pacific/Fiji", "(GMT+12.00) Fiji / Kamchatka / Marshall Is.");
		TIMEZONES.put("Pacific/Guam", "(GMT+10.00) Guam / Port Moresby");
		TIMEZONES.put("Pacific/Midway", "(GMT-11.00) Midway Island / Samoa");
		TIMEZONES.put("Pacific/Tongatapu", "(GMT+13.00) Nuku'alofa");
		
		TIMEZONES.put("US/Alaska", "(GMT-09.00) Alaska");
		TIMEZONES.put("US/Arizona", "(GMT-07.00) Arizona");
		TIMEZONES.put("US/Central", "(GMT-06.00) Central America"); // D'OH! Duplicate!
		TIMEZONES.put("US/Central", "(GMT-06.00) Central Time (US & Canada)");
		TIMEZONES.put("US/Eastern", "(GMT-05.00) Eastern Time (US & Canada)");
		TIMEZONES.put("US/East-Indiana", "(GMT-05.00) Indiana (East)");
		TIMEZONES.put("US/Hawaii", "(GMT-10.00) Hawaii");
		TIMEZONES.put("US/Mountain", "(GMT-07.00) Mountain Time (US & Canada)");
		TIMEZONES.put("US/Pacific", "(GMT-08.00) Pacific Time (US & Canada) / Tijuana");
} // <clinit>()
	
	//
	// Data
	//
	
	protected File dir;
	protected String basename;
	
	//
	// Public methods
	//
	
	public void setDirName(String dirname) {
	    File dir = new File(dirname);
	    if (!dir.isDirectory()) {
	        throw new IllegalArgumentException("not a directory");
	    }
	    this.dir = dir;
	} // setsetDirNameDir(String)
	
	public void setBaseName(String basename) {
	    this.basename = basename;
	} // setBaseName(String)
	
	public void generate() throws Exception {
        // generate properties for the available locales
        Map map = new HashMap();
        for (int i = 0; i < LOCALES.length; i++) {
            Locale locale = LOCALES[i];
            //System.out.println(locale);
            Properties props = generate(locale);
            map.put(locale, props);
        }
        
        // merge en and en_US and make it default
        Properties en = (Properties)map.get(Locale.ENGLISH);
        Properties enUS = (Properties)map.get(Locale.US);
        Iterator pnames = enUS.keySet().iterator();
        while (pnames.hasNext()) {
            String pname = (String)pnames.next();
            String pvalue = enUS.getProperty(pname);
            en.put(pname, pvalue);
        }
        map.remove(Locale.ENGLISH);
        map.put(Locale.US, en);
        
        // remove duplicates
        Iterator locales = map.keySet().iterator();
        while (locales.hasNext()) {
            Locale locale = (Locale)locales.next();
            Properties props = (Properties)map.get(locale);
            List chain = getPropertyChain(map, locale);
            
            Iterator names = props.keySet().iterator();
            while (names.hasNext()) {
                String name = (String)names.next();
                String value = (String)props.get(name);
                
                if (isDuplicate(chain, name, value)) {
                    names.remove();
                }
            }
        }
        
        // save properties files
        Date date = new Date();
        locales = map.keySet().iterator();
        while (locales.hasNext()) {
            Locale locale = (Locale)locales.next();
            Properties properties = (Properties)map.get(locale);
            String suffix = locale.equals(DEFAULT_LOCALE) ? "" : "_" + locale; 
            File file = new File(this.dir, this.basename+suffix+".properties");
            PrintStream out = new PrintStream(new FileOutputStream(file));
            store(properties, out, locale.toString()+" generated on "+date);
            out.close();
        }
	} // generate()
	
    //
    // MAIN
    //
    
    public static void main(String[] argv) throws Exception {
        String dirname = ".";
        String basename = "I18nMsg";
        
        for (int i = 0; i < argv.length; i++) {
            String arg = argv[i];
            if (arg.equals("-d")) {
                dirname = argv[++i];
                continue;
            }
            if (arg.equals("-b")) {
                basename = argv[++i];
                continue;
            }
            if (arg.equals("-h")) {
                System.out.println("usage: java "+GenerateData.class.getName()+" (options)");
                System.out.println();
                System.out.println("options:");
                System.out.println("  -d dirname   Output directory.");
                System.out.println("  -b basename  Output file base name.");
                System.out.println("  -h           Help.");
                System.exit(1);
            }
        }
        
        GenerateData generator = new GenerateData();
        generator.setDirName(dirname);
        generator.setBaseName(basename);
        generator.generate();
        
    } // main(String[])
    
    //
    // Private static methods
    //
    
    private static Properties generate(Locale locale) {
        Properties props = new Properties();
        //generateLocaleNames(props, locale);
        generateCalendarNames(props, locale);
        generateDateTimeFormats(props, locale);
        generateNumberFormats(props, locale);
        generateTimeZones(props, locale);
        return props;
    } // generate(Locale):Properties
    
    private static void store(Properties props, PrintStream out, String header) throws IOException {
        
        // sort keys
        Set keySet = props.keySet();
        List keyList = new LinkedList(keySet);
        Collections.sort(keyList);
        
        // save properties
        if (header != null) {
            out.print("# ");
            out.println(header);
        }
        Iterator iter = keyList.iterator();
        while (iter.hasNext()) {
            String pname = (String)iter.next();
            String pvalue = props.getProperty(pname);
            out.print(pname);
            out.print(" = ");
            int len = pvalue.length();
            for (int i = 0; i < len; i++) {
                int c = pvalue.charAt(i);
                switch (c) {
                    case '\\': out.print("\\\\"); break;
                    case '\r': out.print("\\r"); break;
                    case '\n': out.print("\\n"); break;
                    case '\t': out.print("\\t"); break;
                    default: {
                        if (c < 32 || c > 127) {
                            out.print("\\u");
                            String hex = Integer.toString(c, 16);
                            for (int j = hex.length(); j < 4; j++) {
                                out.print('0');
                            }
                            out.print(hex);
                        }
                        else {
                            out.print((char)c);
                        }
                    }
                }
            }
            out.println();
        }
        
    } // store(Properties,OutputStream,String)
    
    // Generation methods
    
    /***
    private static void generateLocaleNames(Properties props, Locale locale) {
        // locale names
        Set languages = new TreeSet();
        List countries = new LinkedList();
        for (int i = 0; i < LOCALES.length; i++) {
            Locale LOCALE = LOCALES[i];
            String languageCode = toCamel(LOCALE.getLanguage());
            String countryCode = toCamel(LOCALE.getCountry());
            String variantCode = toCamel(LOCALE.getVariant());
            String localeCode = languageCode + countryCode + variantCode;
            props.setProperty("language"+languageCode, LOCALE.getDisplayLanguage(locale));
            props.setProperty("country"+countryCode, LOCALE.getDisplayCountry(locale));
            props.setProperty("variant"+countryCode+variantCode, LOCALE.getDisplayCountry(locale));
            props.setProperty("locale"+localeCode, LOCALE.getDisplayName(locale));
            languages.add(languageCode);
            countries.add(countryCode);
        }
        props.setProperty("languages", toString(languages));
        props.setProperty("countries", toString(countries));
    } // generateLocaleNames(Properties,Locale)
    /***/
    
    private static void generateCalendarNames(Properties props, Locale locale) {
        Calendar calendar = Calendar.getInstance(locale);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        SimpleDateFormat mediumMonthFormatter = new SimpleDateFormat("MMM", locale);
        SimpleDateFormat longMonthFormatter = new SimpleDateFormat("MMMM", locale);
        for (int i = 0; i < 12; i++) {
            calendar.set(Calendar.MONTH, i);
            Date date = calendar.getTime();
            props.setProperty("month"+MONTHS[i]+"Medium", mediumMonthFormatter.format(date));
            props.setProperty("month"+MONTHS[i]+"Long", longMonthFormatter.format(date));
        }
        SimpleDateFormat mediumWeekdayFormatter = new SimpleDateFormat("EEE", locale);
        SimpleDateFormat longWeekdayFormatter = new SimpleDateFormat("EEEE", locale);
        calendar = Calendar.getInstance(locale);        
        for (int i = 0; i < 7; i++) {
            calendar.set(Calendar.DAY_OF_WEEK, i);
            Date date = calendar.getTime();
            props.setProperty("weekday"+WEEKDAYS[i]+"Medium", mediumWeekdayFormatter.format(date));
            props.setProperty("weekday"+WEEKDAYS[i]+"Long", longWeekdayFormatter.format(date));
        }
       int firstDayOfWeek = calendar.getFirstDayOfWeek();
       props.setProperty("firstDayOfWeek", Integer.toString(firstDayOfWeek));
    } // generateCalendarNames(Properties,Locale)
    
    private static void generateDateTimeFormats(Properties props, Locale locale) {
        for (int i = 0; i < DATE_STYLES.length; i++) {
            int style = DATE_STYLES[i];
            props.setProperty("formatDate"+toStyle(style), getDateFormat(locale, style));
        }
        for (int i = 0; i < DATE_STYLES.length; i++) {
            int style = DATE_STYLES[i];
            props.setProperty("formatTime"+toStyle(style), getTimeFormat(locale, style));
        }
        String shortDateFormat = getDateFormat(locale, DateFormat.SHORT);
        String shortTimeFormat = getTimeFormat(locale, DateFormat.SHORT);
        String shortDateTimeFormat = getDateTimeFormat(locale, DateFormat.SHORT, DateFormat.SHORT);
        int shortDateIndex = shortDateTimeFormat.indexOf(shortDateFormat);
        int shortTimeIndex = shortDateTimeFormat.indexOf(shortTimeFormat);
        int[] indexes = new int[2];
        int[] lengths = new int[2];
        String[] params = new String[2];
        if (shortDateIndex < shortTimeIndex) {
            indexes[0] = shortDateIndex;
            indexes[1] = shortTimeIndex;
            lengths[0] = shortDateFormat.length();
            lengths[1] = shortTimeFormat.length();
            params[0] = "{0}";
            params[1] = "{1}";
        }
        else {
            indexes[0] = shortTimeIndex;
            indexes[1] = shortDateIndex;
            lengths[0] = shortTimeFormat.length();
            lengths[1] = shortDateFormat.length();
            params[0] = "{1}";
            params[1] = "{0}";
        }
		int place = 0;
		StringBuffer format = new StringBuffer();
		for (int i = 0; i < indexes.length; i++) {
		    int index = indexes[i];
		    if (place < index) {
		        format.append(shortDateTimeFormat.substring(place, index));
		    }
		    format.append(params[i]);
		    place = index + lengths[i];
		}
		if (place < shortDateTimeFormat.length()) {
		    format.append(shortDateTimeFormat.substring(place));
		}
		props.setProperty("formatDateTime", format.toString());
		
		DateFormat eraFormatter = new SimpleDateFormat("G", locale);
		Calendar era = Calendar.getInstance(locale);
		props.setProperty("eraAD", eraFormatter.format(era.getTime()));
		era.set(Calendar.ERA, GregorianCalendar.BC);
		props.setProperty("eraBC", eraFormatter.format(era.getTime()));
		DateFormat ampmFormatter = new SimpleDateFormat("a", locale);
		Calendar calendar = Calendar.getInstance(locale);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		props.setProperty("periodAm", ampmFormatter.format(calendar.getTime()));
		calendar.set(Calendar.HOUR_OF_DAY, 12);
		props.setProperty("periodPm", ampmFormatter.format(calendar.getTime()));

		Iterator iter = TIMEZONES.keySet().iterator();
		while (iter.hasNext()) {
			String timezoneId = (String)iter.next();
			TimeZone timezone = TimeZone.getTimeZone(timezoneId);
			String displayName = timezone.getDisplayName(locale);
			props.put("timezoneName"+timezoneId, displayName);
		}
    } // generateDateTimeFormats(Properties,Locale)
    
    private static void generateNumberFormats(Properties props, Locale locale) {
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(locale);
        props.setProperty("formatNumber", toPattern(NumberFormat.getNumberInstance(locale)));
        props.setProperty("formatNumberCurrency", toPattern(currencyFormatter));
        props.setProperty("formatNumberInteger", toPattern(NumberFormat.getIntegerInstance(locale)));
        props.setProperty("formatNumberPercent", toPattern(NumberFormat.getPercentInstance(locale)));
        Currency currency = currencyFormatter.getCurrency();
        props.setProperty("currencyCode", currency.getCurrencyCode());
        props.setProperty("currencySymbol", currency.getSymbol());
    	DecimalFormatSymbols symbols = new DecimalFormatSymbols(locale);
    	props.setProperty("numberNaN", symbols.getNaN());
    	props.setProperty("numberInfinity", symbols.getInfinity());
    	props.setProperty("numberZero", Character.toString(symbols.getZeroDigit()));
    	props.setProperty("numberSignMinus", Character.toString(symbols.getMinusSign()));
    	props.setProperty("numberSignPercent", Character.toString(symbols.getPercent()));
    	props.setProperty("numberSignPerMill", Character.toString(symbols.getPerMill()));
    	props.setProperty("numberSeparatorDecimal", Character.toString(symbols.getDecimalSeparator()));
    	props.setProperty("numberSeparatorGrouping", Character.toString(symbols.getGroupingSeparator()));
    	props.setProperty("numberSeparatorMoneyDecimal", Character.toString(symbols.getMonetaryDecimalSeparator()));
    } // generateNumberFormats(Properties,Locale)
    
    private static void generateTimeZones(Properties props, Locale locale) {
		Iterator iter = TIMEZONES.keySet().iterator();
		while (iter.hasNext()) {
			String timezoneId = (String)iter.next();
			String timezoneValue = (String)TIMEZONES.get(timezoneId);
			props.setProperty("timezoneMap"+timezoneId, timezoneValue);
		}
    } // generateTimeZones(Properties,Locale)
    
    // Other methods
    
    private static List getPropertyChain(Map map, Locale locale) {
        List chain = new LinkedList();
        
        String language = locale.getLanguage();
        String country = locale.getCountry();
        String variant = locale.getVariant();
        if (variant != null && variant.length() > 0) {
            Object props = map.get(new Locale(language, country));
            if (props != null) {
                chain.add(props);
            }
        }
        if (country != null && country.length() > 0) {
            Object props = map.get(new Locale(language));
            if (props != null) {
                chain.add(props);
            }
        }
        if (!locale.equals(DEFAULT_LOCALE)) {
            chain.add(map.get(DEFAULT_LOCALE));
        }
        return chain;
    }
    
    private static boolean isDuplicate(List chain, String name, String value) {
        Iterator iter = chain.iterator();
        while (iter.hasNext()) {
            Properties props = (Properties)iter.next();
            String pvalue = (String)props.get(name);
            if (pvalue != null) {
                return pvalue.equals(value);
            }
        }
        return false;
    }
    
    // Convenience methods
    
    private static String toString(Collection collection) {
        StringBuffer str = new StringBuffer();
        Iterator iter = collection.iterator();
        while (iter.hasNext()) {
            str.append(iter.next());
            str.append(' ');
        }
        return str.toString();
    }
    
    private static String getDateFormat(Locale locale, int style) {
        return toPattern(DateFormat.getDateInstance(style, locale)); 
    }
    private static String getTimeFormat(Locale locale, int style) {
        return toPattern(DateFormat.getTimeInstance(style, locale)); 
    }
    private static String getDateTimeFormat(Locale locale, int dateStyle, int timeStyle) {
        return toPattern(DateFormat.getDateTimeInstance(dateStyle, timeStyle, locale)); 
    }

	public static String toStyle(int style) {
		switch (style) {
			case DateFormat.SHORT: return "Short";
			case DateFormat.MEDIUM: return "Medium";
			case DateFormat.LONG: return "Long";
			case DateFormat.FULL: return "Full";
		}
		// Note: should never get here!
		return "Unknown";
	}

	public static String toPattern(DateFormat formatter) {
		try {
			SimpleDateFormat simpleDateFormatter = (SimpleDateFormat)formatter;
			return simpleDateFormatter.toPattern();
		}
		catch (Exception e) {
			return "???";
		}
	}

	public static String toPattern(NumberFormat formatter) {
		try {
			DecimalFormat decimalFormatter = (DecimalFormat)formatter;
			return decimalFormatter.toPattern();
		}
		catch (Exception e) {
			return "???";
		}
	}

	public static String toCamel(String s) {
	    if (s == null || s.length() == 0) {
	        return "";	        
		}
	    s = s.toLowerCase();
	    return Character.toUpperCase(s.charAt(0))+s.substring(1);
	}
	
} // class GenerateI18nData
