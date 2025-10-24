# Multiple Business Email Configuration

## Overview
The contact form now supports sending emails to multiple business email addresses simultaneously.

## Configuration

### Environment Variable
Set the `BUSINESS_EMAIL` environment variable in your `.env.local` file with comma-separated email addresses:

```env
BUSINESS_EMAIL=info@marquetmedia.in,rohinimodi2@gmail.com,shashi.bhusan.kumar@beenait.com
```

### How It Works
1. The API route (`/src/app/api/send-email/route.ts`) reads the `BUSINESS_EMAIL` environment variable
2. It splits the value by commas
3. Trims whitespace from each email address
4. Filters out any empty strings
5. Sends the contact form submission to all specified email addresses

### Example Values
```env
# Single email (still supported)
BUSINESS_EMAIL=info@marquetmedia.in

# Multiple emails (comma-separated)
BUSINESS_EMAIL=info@marquetmedia.in,rohinimodi2@gmail.com,shashi.bhusan.kumar@beenait.com

# Multiple emails with spaces (automatically trimmed)
BUSINESS_EMAIL=info@marquetmedia.in, rohinimodi2@gmail.com, shashi.bhusan.kumar@beenait.com
```

## Implementation Details

### Code Changes
The following change was made to `/src/app/api/send-email/route.ts`:

```typescript
// Before
const businessEmailResult = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: [process.env.BUSINESS_EMAIL!],
  // ...
});

// After
const businessEmails = process.env.BUSINESS_EMAIL!
  .split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0);

const businessEmailResult = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: businessEmails,
  // ...
});
```

### Benefits
- ✅ Multiple stakeholders receive form submissions simultaneously
- ✅ No code changes required to add/remove email addresses
- ✅ Backward compatible (single email still works)
- ✅ Automatic whitespace trimming
- ✅ Filters out empty values

## Testing
After updating your `.env.local` file:
1. Restart your development server
2. Submit a test form through the contact dialog
3. Verify all three email addresses receive the submission

## Note
Make sure all email addresses are properly configured in your Resend account if domain verification is required.
