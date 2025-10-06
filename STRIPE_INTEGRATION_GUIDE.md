# 💳 Stripe Integration Guide

## 🎯 Goal
Enable premium subscriptions with Stripe payments

## 📋 What We'll Build

### Features
- Monthly subscription (₹299/month)
- Annual subscription (₹2,999/year - 2 months free)
- 7-day free trial
- Subscription management
- Payment success/failure handling
- Webhook for subscription updates

---

## 🚀 Quick Start (30 minutes)

### Step 1: Create Stripe Account (5 mins)
1. Go to https://stripe.com
2. Sign up (free)
3. Activate test mode
4. Get API keys from Dashboard → Developers → API keys

### Step 2: Install Dependencies (2 mins)
```bash
# Backend (Railway)
cd backend
npm install stripe

# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Step 3: Add Environment Variables (3 mins)

**Backend `.env`**:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
```

**Frontend `.env`**:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 🏗️ Implementation Steps

### Part 1: Create Products in Stripe (10 mins)

1. **Go to Stripe Dashboard** → Products
2. **Create Monthly Plan**:
   - Name: "Space4U Premium Monthly"
   - Price: ₹299/month
   - Billing: Recurring monthly
   - Trial: 7 days
   - Copy Price ID: `price_xxx`

3. **Create Annual Plan**:
   - Name: "Space4U Premium Annual"
   - Price: ₹2,999/year
   - Billing: Recurring yearly
   - Trial: 7 days
   - Copy Price ID: `price_yyy`

---

### Part 2: Backend Implementation (Railway)

I'll create the complete backend files for you:

1. **Stripe Service** (`backend/src/services/stripe.js`)
2. **Payment Routes** (`backend/src/routes/payments.js`)
3. **Webhook Handler** (`backend/src/routes/webhooks.js`)
4. **Subscription Middleware** (`backend/src/middleware/premium.js`)

---

### Part 3: Frontend Implementation

I'll create:

1. **Stripe Context** (`src/contexts/StripeContext.jsx`)
2. **Checkout Component** (`src/components/premium/StripeCheckout.jsx`)
3. **Subscription Status** (`src/components/premium/SubscriptionStatus.jsx`)
4. **Updated Premium Page** (`src/pages/PremiumPage.jsx`)

---

## 💾 Database Updates

Add to Supabase `profiles` table:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP;
```

---

## 🧪 Testing

### Test Cards (Stripe provides these)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Test Flow
1. Click "Upgrade to Premium"
2. Select plan (Monthly/Annual)
3. Enter test card
4. Complete checkout
5. Verify subscription status updates
6. Check Stripe dashboard

---

## 🔐 Security Checklist

- [ ] API keys in environment variables (never in code)
- [ ] Webhook signature verification
- [ ] HTTPS only in production
- [ ] Customer ID stored securely
- [ ] Subscription status validated server-side
- [ ] Rate limiting on payment endpoints

---

## 📊 Webhook Events to Handle

```javascript
// Essential events:
checkout.session.completed       // New subscription
customer.subscription.updated    // Plan change
customer.subscription.deleted    // Cancellation
invoice.payment_succeeded        // Successful payment
invoice.payment_failed           // Failed payment

// Optional events:
customer.subscription.trial_will_end  // Trial ending soon
```

---

## 🎯 User Flow

### Upgrade Flow
```
1. User clicks "Upgrade to Premium"
2. Select plan (Monthly/Annual)
3. Redirect to Stripe Checkout
4. Enter payment details
5. Complete payment
6. Redirect back to app
7. Webhook updates subscription status
8. Premium features unlock
```

### Cancellation Flow
```
1. User clicks "Manage Subscription"
2. Redirect to Stripe Customer Portal
3. User cancels subscription
4. Webhook updates status
5. Access continues until period end
6. Then downgrade to free
```

---

## 💰 Pricing Strategy

### Current Plan
- **Free**: Basic features
- **Monthly**: ₹299/month (7-day trial)
- **Annual**: ₹2,999/year (₹250/month, save ₹588)

### Revenue Projections
- 100 users, 5% conversion = 5 premium
- 5 × ₹299 = ₹1,495/month
- Annual: ₹17,940/year

- 1000 users, 5% conversion = 50 premium
- 50 × ₹299 = ₹14,950/month
- Annual: ₹1,79,400/year

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Switch to live API keys
- [ ] Test with real card (small amount)
- [ ] Set up webhook endpoint in Stripe
- [ ] Configure webhook secret
- [ ] Test all webhook events
- [ ] Add error monitoring (Sentry)
- [ ] Set up email notifications
- [ ] Create refund policy
- [ ] Add terms of service
- [ ] Test cancellation flow

---

## 📈 Monitoring

### Stripe Dashboard
- Daily revenue
- Active subscriptions
- Churn rate
- Failed payments
- Trial conversions

### App Analytics
- Upgrade button clicks
- Checkout abandonment
- Subscription cancellations
- Feature usage (premium vs free)

---

## 🎉 Next Steps

1. **Create Stripe account** (if not done)
2. **Get API keys**
3. **I'll generate all the code files**
4. **Test with test cards**
5. **Deploy to production**

**Ready to start? I'll create all the files now!** 🚀
