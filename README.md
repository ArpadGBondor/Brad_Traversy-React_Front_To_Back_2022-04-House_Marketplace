# Brad Traversy - React Front To Back 2022 - 04 - House Marketplace

## Udemy - [Brad Traversy - React Front To Back 2022](https://www.udemy.com/course/react-front-to-back-2022/)

-   Section 13: House Marketplace Project Start
-   Section 14: Firebase Authentication & Profile
-   Section 15: Get & Create Listings
-   Section 16: Single Listings, Map, Slider & Edit

## Deployed

-   Not yet. (Will be on Netlify)

## Used Tools:

-   Frontend:
    -   React.js
-   Backend:
    -   Firebase - authentication
    -   Firestore - database
    -   Netlify - serverless functions & hosting
    -   Positionstack - geocoding

## Mayor changes:

-   Create Listing: I made `/create-listing` a Private Route that only can accessed when the user is logged in, to simplify the code.
-   Geocoding: I'm using Positionstack's free tier instead of google billing. Added Netlify serverless function backend to hide the geocoding API key.

## Environment variables:

-   App's firebase configuration: (these variables will be visible in the fronend project)
    -   REACT_APP_FIREBASE_CONFIG_API_KEY
    -   REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN
    -   REACT_APP_FIREBASE_CONFIG_PROJECT_ID
    -   REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET
    -   REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID
    -   REACT_APP_FIREBASE_CONFIG_APP_ID
-   App's positionstack configuration: (these variables are hidden in a serverless backend function)
    -   POSITIONSTACK_API_KEY
    -   POSITIONSTACK_BASE_URL

## Resources:

-   Firebase Setup For House Marketplace:
    -   [on Gist](https://gist.github.com/bradtraversy/caab8ebd8ff4b6e947632887e0183761)
-   Firestore rules & Storage rules:
    -   [on Gist](https://gist.github.com/bradtraversy/6d7de7e877d169a6aa4e61140d25767f)
-   The instructor's solution:
    -   The source code of the instructor's solution is in [this Github repo](https://github.com/bradtraversy/house-marketplace)
