# Google OAuth Login Implementation

This implementation adds Google OAuth login functionality to the Personal Blog Web application.

## Frontend Components

### Google Login Button (`/src/components/auth/google-login-button.tsx`)

- Reusable Google login button component
- Uses Google's official branding and colors
- Redirects to backend Google OAuth flow

### Google Callback Page (`/src/app/auth/google/callback/page.tsx`)

- Handles the OAuth callback from Google
- Processes authentication tokens
- Redirects to home page on success
- Shows error states if authentication fails

### Integration in Login/Register Pages

- Added Google login option with "or" divider
- Maintains existing username/password login
- Consistent UI design with Material Tailwind

## Backend Implementation

### Google OAuth Endpoints

1. **`GET /api/users/google-login`**

   - Initiates Google OAuth flow
   - Redirects to Google authentication

2. **`GET /api/users/google-response`**
   - Handles Google OAuth callback
   - Creates user account if doesn't exist
   - Generates JWT token
   - Redirects to frontend callback page

### Configuration Required

#### `appsettings.json`

```json
{
  "GoogleKeys": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  },
  "Frontend": {
    "BaseUrl": "http://localhost:3000"
  }
}
```

## User Flow

1. **User clicks "Continue with Google"**

   - Frontend redirects to `/api/users/google-login`

2. **Backend initiates OAuth flow**

   - Redirects to Google authentication

3. **User authenticates with Google**

   - Google redirects back to `/api/users/google-response`

4. **Backend processes OAuth response**

   - Extracts user email and name from Google
   - Creates user account if doesn't exist
   - Generates JWT token
   - Redirects to frontend callback page with token

5. **Frontend callback page**
   - Receives token and user data
   - Updates authentication context
   - Redirects to home page

## Features

- **Automatic User Registration**: Creates account if user doesn't exist
- **Seamless Integration**: Works alongside existing login system
- **Error Handling**: Proper error states and user feedback
- **Secure**: Uses JWT tokens for session management
- **Responsive**: Works on mobile and desktop

## Error Handling

- Network errors during OAuth flow
- Missing user email from Google
- Database errors during user creation
- Invalid or expired tokens

## Security Notes

- User passwords are auto-generated for Google accounts
- JWT tokens have configurable expiration
- Google client credentials should be kept secure
- Frontend URL is configurable for different environments
