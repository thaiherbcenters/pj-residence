# Fix Accommodation Prices

## Goal Description
The accommodation prices displayed on the website are incorrect because they use a hardcoded "per night" label for all rooms, including the monthly room. The prices themselves are also hardcoded. The goal is to move pricing data into the translation files to support different units (e.g., "per month" vs "per night") and ensure correct labeling.

## User Review Required
> [!NOTE]
> I am assuming the current price values (4,500 THB and 680 THB) are numerically correct but labeled wrong. I will move them to the data source.

## Proposed Changes
### src/translations
#### [MODIFY] [translations.js](file:///c:/test_ai/pj-residence/src/translations/translations.js)
- Add `govOfficial` and `googleReview` keys to `accommodations` section for all languages.
    - th: govOfficial: 'ข้าราชการ/รัฐวิสาหกิจ (650 บาท/คืน)', govSub: '(*โปรดแสดงบัตร)', googleReview: 'รีวิว Google Map 5 ดาว (650 บาท/คืน)'
    - cn: govOfficial: '公务员/国企员工 (650 泰铢/晚)', govSub: '(*请出示证件)', googleReview: '谷歌地图 5 星好评 (650 泰铢/晚)'
    - en: govOfficial: 'Gov. Official (650 THB/night)', govSub: '(*Show ID)', googleReview: 'Google Map 5-Star Review (650 THB/night)'

### src/components/Accommodations
#### [MODIFY] [Accommodations.css](file:///c:/test_ai/pj-residence/src/components/Accommodations/Accommodations.css)
- Add classes `.gov-checkbox-wrapper` and `.google-review-wrapper` with styles extracted from `Booking.jsx`.

#### [MODIFY] [Accommodations.jsx](file:///c:/test_ai/pj-residence/src/components/Accommodations/Accommodations.jsx)
- Import `gov-checkbox-wrapper` and `google-review-wrapper` classes.
- In `rooms.map`, check if `room.unit === 'perNight'` (or id='daily').
- Render the badges below the price or description.

## Verification Plan
### Manual Verification
- Run the frontend.
- Check the "Accommodations" section.
- Verify "Daily Room" card shows the two new green/blue badges.
- Verify "Monthly Room" card does NOT show them.
- Switch languages to ensure correct text.
