# Node.js AuthSystem

## Short Description

It is a simple authentication system.

## Functions

- Local Register with confirm email sender and generate qr code for authenticator
- Login/Register with Facebook
- Login/Register with Google
- Local login with two factor authentication (Authentication app)
- Forgot password email sender
- Logout
- Validation token

## Key Technology

- Node.js
- Express
- Passport
- MongoDB
- Speakeasy
- NodeMailer

## How to start

    npm install

create .env and configure this SCHEMA:

- SESSION_SECRET_KEY = // your secret key
- JWT_KEY= // your secret key
- HOST = // email host
- USER = // email user
- PASS = // email password
- SERVICE = // mail service (e.g. gmail)
- BASE_URL = // base app URL
- FB_APP_ID = // FB APP ID
- FB_APP_SECRET = // FB APP SECRET KEY
- FB_REDIRECT_URI = // FB CALLBACK REDIRECT URL
- GOOGLE_CLIENT_ID = // GOOGLE CLIENT ID
- GOOGLE_CLIENT_SECRET = // GOOGLE CLIENT SECRET KEY
- GOOGLE_REDIRECT_URI = // GOOGLE CALLBACK REDIRECT URL

      npm start
