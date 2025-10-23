// Quick script to update remaining language files with common section
// Run: node UPDATE_REMAINING_LANGUAGES.js

const fs = require('fs');
const path = require('path');

const commonSections = {
  te: {
    "home": "హోమ్", "circles": "సర్కిల్స్", "insights": "అంతర్దృష్టులు", "profile": "ప్రొఫైల్",
    "settings": "సెట్టింగ్స్", "resources": "వనరులు", "save": "సేవ్ చేయండి", "cancel": "రద్దు చేయండి",
    "delete": "తొలగించండి", "edit": "సవరించండి", "close": "మూసివేయండి", "loading": "లోడ్ అవుతోంది...",
    "error": "లోపం", "success": "విజయం", "back": "వెనుకకు", "next": "తదుపరి", "done": "పూర్తయింది",
    "confirm": "నిర్ధారించండి", "search": "శోధించండి", "filter": "ఫిల్టర్", "sort": "క్రమబద్ధీకరించండి",
    "view": "చూడండి", "share": "భాగస్వామ్యం", "export": "ఎగుమతి", "import": "దిగుమతి", "add": "జోడించండి",
    "remove": "తొలగించండి", "update": "నవీకరించండి", "create": "సృష్టించండి", "submit": "సమర్పించండి",
    "reset": "రీసెట్", "clear": "క్లియర్", "all": "అన్నీ", "none": "ఏదీ లేదు", "yes": "అవును", "no": "కాదు",
    "ok": "సరే", "today": "ఈరోజు", "yesterday": "నిన్న", "week": "వారం", "month": "నెల", "year": "సంవత్సరం",
    "day": "రోజు", "days": "రోజులు", "hour": "గంట", "hours": "గంటలు", "minute": "నిమిషం", "minutes": "నిమిషాలు"
  },
  bn: {
    "home": "হোম", "circles": "সার্কেল", "insights": "অন্তর্দৃষ্টি", "profile": "প্রোফাইল",
    "settings": "সেটিংস", "resources": "সম্পদ", "save": "সংরক্ষণ করুন", "cancel": "বাতিল করুন",
    "delete": "মুছুন", "edit": "সম্পাদনা করুন", "close": "বন্ধ করুন", "loading": "লোড হচ্ছে...",
    "error": "ত্রুটি", "success": "সফলতা", "back": "পিছনে", "next": "পরবর্তী", "done": "সম্পন্ন",
    "confirm": "নিশ্চিত করুন", "search": "অনুসন্ধান করুন", "filter": "ফিল্টার", "sort": "সাজান",
    "view": "দেখুন", "share": "শেয়ার করুন", "export": "রপ্তানি করুন", "import": "আমদানি করুন", "add": "যোগ করুন",
    "remove": "সরান", "update": "আপডেট করুন", "create": "তৈরি করুন", "submit": "জমা দিন",
    "reset": "রিসেট করুন", "clear": "পরিষ্কার করুন", "all": "সব", "none": "কোনটিই নয়", "yes": "হ্যাঁ", "no": "না",
    "ok": "ঠিক আছে", "today": "আজ", "yesterday": "গতকাল", "week": "সপ্তাহ", "month": "মাস", "year": "বছর",
    "day": "দিন", "days": "দিন", "hour": "ঘন্টা", "hours": "ঘন্টা", "minute": "মিনিট", "minutes": "মিনিট"
  },
  mr: {
    "home": "होम", "circles": "वर्तुळे", "insights": "अंतर्दृष्टी", "profile": "प्रोफाइल",
    "settings": "सेटिंग्ज", "resources": "संसाधने", "save": "जतन करा", "cancel": "रद्द करा",
    "delete": "हटवा", "edit": "संपादित करा", "close": "बंद करा", "loading": "लोड होत आहे...",
    "error": "त्रुटी", "success": "यश", "back": "मागे", "next": "पुढे", "done": "पूर्ण",
    "confirm": "पुष्टी करा", "search": "शोधा", "filter": "फिल्टर", "sort": "क्रमवारी लावा",
    "view": "पहा", "share": "सामायिक करा", "export": "निर्यात करा", "import": "आयात करा", "add": "जोडा",
    "remove": "काढा", "update": "अद्यतनित करा", "create": "तयार करा", "submit": "सबमिट करा",
    "reset": "रीसेट करा", "clear": "साफ करा", "all": "सर्व", "none": "काहीही नाही", "yes": "होय", "no": "नाही",
    "ok": "ठीक आहे", "today": "आज", "yesterday": "काल", "week": "आठवडा", "month": "महिना", "year": "वर्ष",
    "day": "दिवस", "days": "दिवस", "hour": "तास", "hours": "तास", "minute": "मिनिट", "minutes": "मिनिटे"
  },
  kn: {
    "home": "ಮುಖಪುಟ", "circles": "ವಲಯಗಳು", "insights": "ಒಳನೋಟಗಳು", "profile": "ಪ್ರೊಫೈಲ್",
    "settings": "ಸೆಟ್ಟಿಂಗ್ಗಳು", "resources": "ಸಂಪನ್ಮೂಲಗಳು", "save": "ಉಳಿಸಿ", "cancel": "ರದ್ದುಮಾಡಿ",
    "delete": "ಅಳಿಸಿ", "edit": "ಸಂಪಾದಿಸಿ", "close": "ಮುಚ್ಚಿ", "loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "error": "ದೋಷ", "success": "ಯಶಸ್ಸು", "back": "ಹಿಂದೆ", "next": "ಮುಂದೆ", "done": "ಮುಗಿದಿದೆ",
    "confirm": "ದೃಢೀಕರಿಸಿ", "search": "ಹುಡುಕಿ", "filter": "ಫಿಲ್ಟರ್", "sort": "ವಿಂಗಡಿಸಿ",
    "view": "ವೀಕ್ಷಿಸಿ", "share": "ಹಂಚಿಕೊಳ್ಳಿ", "export": "ರಫ್ತು", "import": "ಆಮದು", "add": "ಸೇರಿಸಿ",
    "remove": "ತೆಗೆದುಹಾಕಿ", "update": "ನವೀಕರಿಸಿ", "create": "ರಚಿಸಿ", "submit": "ಸಲ್ಲಿಸಿ",
    "reset": "ಮರುಹೊಂದಿಸಿ", "clear": "ತೆರವುಗೊಳಿಸಿ", "all": "ಎಲ್ಲಾ", "none": "ಯಾವುದೂ ಇಲ್ಲ", "yes": "ಹೌದು", "no": "ಇಲ್ಲ",
    "ok": "ಸರಿ", "today": "ಇಂದು", "yesterday": "ನಿನ್ನೆ", "week": "ವಾರ", "month": "ತಿಂಗಳು", "year": "ವರ್ಷ",
    "day": "ದಿನ", "days": "ದಿನಗಳು", "hour": "ಗಂಟೆ", "hours": "ಗಂಟೆಗಳು", "minute": "ನಿಮಿಷ", "minutes": "ನಿಮಿಷಗಳು"
  },
  ml: {
    "home": "ഹോം", "circles": "സർക്കിളുകൾ", "insights": "ഉൾക്കാഴ്ചകൾ", "profile": "പ്രൊഫൈൽ",
    "settings": "ക്രമീകരണങ്ങൾ", "resources": "വിഭവങ്ങൾ", "save": "സംരക്ഷിക്കുക", "cancel": "റദ്ദാക്കുക",
    "delete": "ഇല്ലാതാക്കുക", "edit": "എഡിറ്റ് ചെയ്യുക", "close": "അടയ്ക്കുക", "loading": "ലോഡ് ചെയ്യുന്നു...",
    "error": "പിശക്", "success": "വിജയം", "back": "തിരികെ", "next": "അടുത്തത്", "done": "പൂർത്തിയായി",
    "confirm": "സ്ഥിരീകരിക്കുക", "search": "തിരയുക", "filter": "ഫിൽട്ടർ", "sort": "അടുക്കുക",
    "view": "കാണുക", "share": "പങ്കിടുക", "export": "കയറ്റുമതി", "import": "ഇറക്കുമതി", "add": "ചേർക്കുക",
    "remove": "നീക്കം ചെയ്യുക", "update": "അപ്ഡേറ്റ് ചെയ്യുക", "create": "സൃഷ്ടിക്കുക", "submit": "സമർപ്പിക്കുക",
    "reset": "പുനഃസജ്ജമാക്കുക", "clear": "മായ്ക്കുക", "all": "എല്ലാം", "none": "ഒന്നുമില്ല", "yes": "അതെ", "no": "ഇല്ല",
    "ok": "ശരി", "today": "ഇന്ന്", "yesterday": "ഇന്നലെ", "week": "ആഴ്ച", "month": "മാസം", "year": "വർഷം",
    "day": "ദിവസം", "days": "ദിവസങ്ങൾ", "hour": "മണിക്കൂർ", "hours": "മണിക്കൂറുകൾ", "minute": "മിനിറ്റ്", "minutes": "മിനിറ്റുകൾ"
  },
  gu: {
    "home": "હોમ", "circles": "વર્તુળો", "insights": "આંતરદૃષ્ટિ", "profile": "પ્રોફાઇલ",
    "settings": "સેટિંગ્સ", "resources": "સંસાધનો", "save": "સાચવો", "cancel": "રદ કરો",
    "delete": "કાઢી નાખો", "edit": "સંપાદિત કરો", "close": "બંધ કરો", "loading": "લોડ થઈ રહ્યું છે...",
    "error": "ભૂલ", "success": "સફળતા", "back": "પાછળ", "next": "આગળ", "done": "પૂર્ણ",
    "confirm": "પુષ્ટિ કરો", "search": "શોધો", "filter": "ફિલ્ટર", "sort": "ક્રમબદ્ધ કરો",
    "view": "જુઓ", "share": "શેર કરો", "export": "નિકાસ કરો", "import": "આયાત કરો", "add": "ઉમેરો",
    "remove": "દૂર કરો", "update": "અપડેટ કરો", "create": "બનાવો", "submit": "સબમિટ કરો",
    "reset": "રીસેટ કરો", "clear": "સાફ કરો", "all": "બધા", "none": "કોઈ નહીં", "yes": "હા", "no": "ના",
    "ok": "ઠીક છે", "today": "આજે", "yesterday": "ગઈકાલે", "week": "અઠવાડિયું", "month": "મહિનો", "year": "વર્ષ",
    "day": "દિવસ", "days": "દિવસો", "hour": "કલાક", "hours": "કલાકો", "minute": "મિનિટ", "minutes": "મિનિટ"
  }
};

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

Object.keys(commonSections).forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.common = commonSections[lang];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Updated ${lang}.json`);
});

console.log('\n🎉 All language files updated successfully!');
