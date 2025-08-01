# Security Guide for AuraMobile

## Firebase Security

### What's Safe in Version Control
- `google-services.json` - Contains client-side API keys (not secret keys)
- Firebase project IDs and app IDs - These are public identifiers
- Current Firebase configuration - Protected by Firestore Security Rules

### What Should Be Private
- Admin user credentials (email/password for Firebase Auth)
- Service account keys (if added for server-side operations)
- Third-party API keys
- Database connection strings for non-Firebase services

## Current Security Measures

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /NEWTEMPLATE/{document} {
      allow create: if true;           // Anyone can submit surveys
      allow read: if request.auth != null;  // Only authenticated users can read
      allow update, delete: if false;      // No modifications allowed
    }
    match /{document=**} {
      allow read, write: if false;     // Default deny
    }
  }
}
```

### Authentication
- Email/password authentication for admin access
- No authentication required for survey submission
- Session management with auto-logout

## Environment Variables Setup

### For Development
1. Copy `.env.example` to `.env`
2. Fill in your actual Firebase configuration
3. Never commit `.env` to version control

### For Production
1. Set environment variables in your deployment platform
2. Use CI/CD pipeline to inject production values
3. Keep separate configurations for staging/production

## Best Practices

1. **Never commit** `.env` files to version control
2. **Always include** `.env.example` for other developers
3. **Use Firebase Security Rules** as your primary protection
4. **Regularly audit** Firebase user permissions
5. **Monitor** Firebase usage for unusual activity

## What to Monitor
- Unusual authentication attempts
- Unexpected Firestore read/write patterns  
- Firebase project usage quotas
- Admin user activity logs