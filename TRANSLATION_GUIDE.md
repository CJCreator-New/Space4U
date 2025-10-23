# Translation Contribution Guide

## Overview

Space4U is committed to providing a fully localized experience for all users. This guide helps contributors add and maintain translations.

## Supported Languages

### Indian Languages (8)
- 🇮🇳 Hindi (hi)
- 🇮🇳 Tamil (ta)
- 🇮🇳 Telugu (te)
- 🇮🇳 Bengali (bn)
- 🇮🇳 Marathi (mr)
- 🇮🇳 Kannada (kn)
- 🇮🇳 Malayalam (ml)
- 🇮🇳 Gujarati (gu)

### International Languages (5)
- 🇬🇧 English (en) - Base language
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇸🇦 Arabic (ar)

## File Structure

```
src/i18n/
├── config.js                 # i18n configuration
├── locales/
│   ├── en.json              # English (base)
│   ├── hi.json              # Hindi
│   ├── ta.json              # Tamil
│   ├── te.json              # Telugu
│   ├── bn.json              # Bengali
│   ├── mr.json              # Marathi
│   ├── kn.json              # Kannada
│   ├── ml.json              # Malayalam
│   ├── gu.json              # Gujarati
│   ├── es.json              # Spanish
│   ├── fr.json              # French
│   ├── de.json              # German
│   └── ar.json              # Arabic
```

## Translation File Format

```json
{
  "section": {
    "key": "Translated text",
    "anotherKey": "Another translation"
  }
}
```

### Sections

- `common` - Common UI elements (buttons, labels, etc.)
- `home` - Home page content
- `mood` - Mood tracking features
- `circles` - Support circles
- `insights` - Analytics and insights
- `profile` - User profile
- `settings` - Settings page
- `resources` - Resource library
- `gratitude` - Gratitude journal
- `habits` - Habit tracker
- `premium` - Premium features

## How to Add Translations

### Step 1: Find Missing Keys

Run the test suite to identify missing translations:

```bash
npm test -- i18n.test.js
```

This will generate a report showing missing keys for each language.

### Step 2: Add Translations

1. Open the language file (e.g., `src/i18n/locales/hi.json`)
2. Add the missing keys with translations
3. Maintain the same structure as `en.json`

Example:

```json
{
  "settings": {
    "sound": "ध्वनि",
    "security": "सुरक्षा",
    "storage": "भंडारण"
  }
}
```

### Step 3: Test Your Translations

1. Start the dev server: `npm run dev`
2. Change language in Settings
3. Navigate through all pages
4. Verify translations appear correctly

### Step 4: Run Automated Tests

```bash
npm test
```

Ensure all tests pass before submitting.

## Translation Guidelines

### 1. **Accuracy**
- Translate meaning, not word-for-word
- Maintain context and tone
- Use culturally appropriate terms

### 2. **Consistency**
- Use consistent terminology throughout
- Follow existing translations for similar terms
- Maintain brand voice

### 3. **Length**
- Keep translations similar length to English
- Avoid overly long translations that break UI
- Use abbreviations when appropriate

### 4. **Formatting**
- Preserve placeholders: `{{variable}}`
- Keep HTML tags intact: `<strong>text</strong>`
- Maintain line breaks and spacing

### 5. **Cultural Sensitivity**
- Use inclusive language
- Avoid idioms that don't translate
- Consider regional variations

### 6. **Technical Terms**
- Keep technical terms in English if commonly used
- Translate UI elements fully
- Use native terms for mental health concepts

## Special Cases

### Pluralization

Use i18next pluralization format:

```json
{
  "item": "item",
  "item_plural": "items"
}
```

### Variables

Preserve variable placeholders:

```json
{
  "welcome": "Welcome, {{name}}!"
}
```

### RTL Languages (Arabic)

- Text direction is handled automatically
- Ensure translations read naturally RTL
- Test UI layout in RTL mode

## Testing Checklist

Before submitting translations:

- [ ] All keys from `en.json` are translated
- [ ] No empty string values
- [ ] Placeholders preserved
- [ ] Tested in app UI
- [ ] No breaking UI layouts
- [ ] Culturally appropriate
- [ ] Reviewed by native speaker (if possible)
- [ ] Automated tests pass

## Common Mistakes to Avoid

❌ **Don't:**
- Leave keys untranslated
- Use machine translation without review
- Break placeholder syntax
- Ignore context
- Copy-paste between similar languages

✅ **Do:**
- Translate with context in mind
- Test in actual UI
- Ask for clarification if unsure
- Review existing translations
- Use native speaker review

## Tools & Resources

### Recommended Tools
- **Google Translate** - Initial draft only
- **DeepL** - Better context understanding
- **Native speaker review** - Always recommended

### Testing Tools
```bash
# Run translation tests
npm test -- i18n.test.js

# Generate translation report
npm run i18n:report

# Check missing translations
npm run i18n:missing
```

## Contribution Workflow

1. **Fork the repository**
2. **Create a branch**: `git checkout -b translations/hindi-settings`
3. **Add translations** to appropriate files
4. **Test thoroughly** in dev environment
5. **Run automated tests**: `npm test`
6. **Commit changes**: `git commit -m "Add Hindi translations for Settings page"`
7. **Push to fork**: `git push origin translations/hindi-settings`
8. **Create Pull Request** with description of changes

## Pull Request Template

```markdown
## Translation Update

**Language:** Hindi (hi)
**Section:** Settings Page
**Keys Added:** 45

### Checklist
- [x] All keys translated
- [x] Tested in UI
- [x] No layout breaks
- [x] Tests passing
- [x] Native speaker reviewed

### Screenshots
[Add screenshots showing translations in UI]

### Notes
[Any special considerations or questions]
```

## Getting Help

- **Questions:** Open an issue with `translation` label
- **Discussion:** Join our Discord #translations channel
- **Review:** Request native speaker review in PR

## Recognition

All translation contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in app About section
- Thanked in release notes

## Priority Languages

Current priority for complete translations:

1. **Hindi** - Largest user base
2. **Tamil** - High engagement
3. **Telugu** - Growing community
4. **Bengali** - Active users
5. **Spanish** - International expansion

## Translation Status

Run this command to see current status:

```bash
npm run i18n:status
```

Example output:
```
Language  Completeness  Missing Keys
--------  ------------  ------------
en        100%          0
hi        85%           45
ta        80%           60
te        75%           75
...
```

## Contact

- **Email:** translations@space4u.com
- **Discord:** #translations
- **GitHub:** @space4u/translations-team

---

Thank you for helping make Space4U accessible to everyone! 🌍❤️
