// Country-specific crisis resources and helplines

export const COUNTRIES = {
  IN: {
    code: 'IN',
    name: 'India',
    flag: 'ðŸ‡®ðŸ‡³',
    emergency: '112',
    crisisHelplines: [
      {
        name: 'KIRAN Mental Health Helpline',
        phone: '1800-599-0019',
        description: '24/7 mental health support in multiple languages',
        hours: '24/7',
        languages: 'Hindi, English, and 13 regional languages'
      },
      {
        name: 'Vandrevala Foundation',
        phone: '1860-266-2345',
        description: 'Free mental health counseling',
        hours: '24/7',
        languages: 'Hindi, English'
      },
      {
        name: 'iCall Helpline',
        phone: '9152987821',
        email: 'icall@tiss.edu',
        description: 'Psychosocial helpline by TISS',
        hours: 'Mon-Sat, 8 AM - 10 PM',
        languages: 'Hindi, English, Marathi'
      },
      {
        name: 'Snehi Foundation',
        phone: '91-22-2772-6771',
        description: 'Emotional support for those in distress',
        hours: '24/7',
        languages: 'Hindi, English'
      }
    ],
    emergencyServices: {
      police: '100',
      ambulance: '102',
      fire: '101',
      women: '1091'
    }
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: 'ðŸ‡ºðŸ‡¸',
    emergency: '911',
    crisisHelplines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        text: 'Text 988',
        description: 'Free, confidential support 24/7',
        hours: '24/7',
        languages: 'English, Spanish, and 150+ languages via interpretation'
      },
      {
        name: 'Crisis Text Line',
        text: 'Text HOME to 741741',
        description: 'Free crisis counseling via text',
        hours: '24/7',
        languages: 'English, Spanish'
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        description: 'Treatment referral and information',
        hours: '24/7',
        languages: 'English, Spanish'
      },
      {
        name: 'Veterans Crisis Line',
        phone: '988 (Press 1)',
        text: 'Text 838255',
        description: 'Support for veterans and their families',
        hours: '24/7',
        languages: 'English, Spanish'
      }
    ],
    emergencyServices: {
      emergency: '911',
      poison: '1-800-222-1222'
    }
  }
}

export const getCountryData = (countryCode) => {
  return COUNTRIES[countryCode] || COUNTRIES.US
}

export const saveUserCountry = (countryCode) => {
  localStorage.setItem('space4u_country', countryCode)
}

export const getUserCountry = () => {
  return localStorage.getItem('space4u_country') || 'US'
}

