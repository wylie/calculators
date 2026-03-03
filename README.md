# Simple Calculators

A clean, responsive multi-calculator web app featuring mortgage, budget, weather, calorie, and bike gear calculators. Built with Astro, React islands, TypeScript, and Tailwind CSS.

## Features

- **5 Calculators**: Mortgage, Budget, Weather Converter, Calorie Calculator, and Bike Gear Calculator

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the Astro dev server (typically `http://localhost:4321/`, or the next open port).

### Build

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once
```

## Project Structure

```
src/
├── components/
│   ├── Card.tsx          # Reusable card component
│   ├── Input.tsx         # Text input with validation
│   ├── Select.tsx        # Select/dropdown
│   ├── Toggle.tsx        # Toggle switch
│   ├── AdSlot.tsx        # AdSense placeholder
│   ├── AffiliateBox.tsx  # Affiliate link component
│   └── NavAstro.tsx      # Hydrated navigation island
├── layouts/
│   └── MainLayout.astro  # Shared Astro layout
├── pages/
│   ├── index.astro
│   ├── mortgage.astro
│   └── ... (route wrappers)
├── react-pages/
│   ├── Mortgage/
│   ├── Budget/
│   └── ... (calculator React islands)
├── utils/
│   ├── calculators.ts         # All calculator functions
│   ├── calculators.test.ts    # Unit tests
│   └── formatting.ts          # Currency, percentage formatting
├── types/
│   └── index.ts              # TypeScript interfaces
└── index.css                 # Tailwind entry styles
```

## Calculator Details

### Mortgage Calculator

Calculate monthly mortgage payments, total interest, and amortization details.

- Inputs: home price, down payment (% or $), loan term, interest rate, property tax, home insurance, PMI
- Formula: Standard amortization formula with P&I calculation

### Budget Calculator

Track monthly income and expenses with real-time calculations.

- Editable expense categories
- Automatic calculation of remaining balance and savings rate
- Add/remove expense items dynamically

### Weather Converter

Quick temperature conversion between Celsius and Fahrenheit.

- Reference table with common temperatures
- 1 decimal precision

### Calorie Calculator

Calculate BMR and daily calorie targets using the Mifflin-St Jeor formula.

- Inputs: sex, age, height, weight, activity level, goal
- Supports multiple goals: maintain, lose weight, gain weight
- Activity multipliers from sedentary to athlete

### Bike Gear Calculator

Calculate gear inches and speed estimates for cycling.

- Inputs: chainring teeth, cog teeth, wheel diameter, cadence
- Outputs: gear ratio, gear inches, speed in MPH
- Preset combo comparison

## Adding AdSense

To add real AdSense support:

1. Open `src/components/AdSlot.tsx`
2. Replace the placeholder div with your AdSense script tag:

```tsx
export default function AdSlot() {
  return (
    <>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
        crossOrigin="anonymous"></script>
      {/* Ad unit code */}
    </>
  );
}
```

## Deployment

This project is deployed to a custom domain at **simplecalculators.io**.

### Configure Custom Domain

1. **vite.config.ts** is configured with `base: '/'` for root domain deployment
2. **GitHub Pages** custom domain is set to `simplecalculators.io`
3. **CloudFlare DNS** records point to GitHub Pages servers

### Deploy

1. Push to GitHub
2. GitHub Actions automatically builds and deploys on push to main
3. Site is live at **https://simplecalculators.io**

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for the deployment configuration.

## Analytics

### GA4 Setup

This project includes **Google Analytics 4 (GA4)** configured with your measurement ID: **G-FY6764MTRQ**.

- GA4 script is loaded on every page in [src/layouts/MainLayout.astro](src/layouts/MainLayout.astro)
- Analytics module is in [src/utils/analytics.ts](src/utils/analytics.ts)
- All analytics are privacy-first: **no PII (personally identifiable information) is collected**

### Cloudflare Web Analytics (Optional)

This project also supports **Cloudflare Web Analytics** as a secondary traffic source.

1. In Cloudflare, create a Web Analytics site and copy your token.
2. Create a local env file:

```bash
cp .env.example .env
```

3. Set your token:

```bash
PUBLIC_CF_WEB_ANALYTICS_TOKEN=your_cloudflare_token_here
```

4. Deploy. The beacon script is loaded automatically in production when the token is present.

Implementation location: [src/layouts/MainLayout.astro](src/layouts/MainLayout.astro)

### Events Tracked

The analytics module tracks the following meaningful events:

| Event Name | Parameters | Description |
|------------|-----------|-------------|
| `calculator_view` | `calculator_name` | Fired when a calculator page loads |
| `calculator_submit` | `calculator_name`, `method` | Fired when user submits/calculates (method: "button", "auto", "enter") |
| `calculator_result` | `calculator_name` | Fired when calculation results are displayed |
| `calculator_reset` | `calculator_name` | Fired when user resets/clears the calculator |
| `calculator_input_change` | `calculator_name`, `field_name` | Fired on any input field change |
| `calculator_copy` | `calculator_name` | Fired when user copies a result |
| `calculator_share` | `calculator_name`, `channel` | Fired when user shares (channel: "twitter", "facebook", etc.) |
| `calculator_error` | `calculator_name`, `error_code` | Fired on calculation errors |
| `outbound_click` | `link_url`, `link_text`, `calculator_name` (optional) | Fired on external link clicks |
| `email_signup` | `signup_source` (optional) | Fired on successful newsletter signup (no email collected) |
| `contact_submit` | `contact_type` (optional) | Fired on successful contact form submission (no message collected) |

### Privacy & Data Protection

✅ **What we DO NOT collect:**
- Email addresses
- Phone numbers
- Names or personal identifiers
- Entered numerical values (amounts, dates, etc.)
- Message content from forms
- IP addresses (anonymous_ip enabled)
- Ad conversion data

✅ **What we DO track:**
- Page views and calculator names
- Button clicks and interaction types
- Field names (not values)
- External link clicks
- Form submission success (not content)

### Using the Analytics Module

#### In React Components

```typescript
import analytics from '../../utils/analytics';
import { useEffect } from 'react';

export default function MyCalculator() {
  // Track page view on mount
  useEffect(() => {
    analytics.trackCalculatorView('my-calculator');
  }, []);

  // Track input changes
  const handleInputChange = (value: string) => {
    setValue(value);
    analytics.trackInputChange('my-calculator', 'field_name');
  };

  // Track result calculation
  useEffect(() => {
    if (result) {
      analytics.trackCalculatorResult('my-calculator');
    }
  }, [result]);

  // Track reset
  const handleReset = () => {
    resetState();
    analytics.trackCalculatorReset('my-calculator');
  };

  // Track copy
  const handleCopyResult = () => {
    copyToClipboard(resultText);
    analytics.trackCopyResult('my-calculator');
  };

  return (
    // ... JSX
  );
}
```

#### Supported Methods

```typescript
// Generic event tracking
analytics.trackEvent(eventName: string, params: object)

// Calculator-specific helpers
analytics.trackCalculatorView(calculatorName: string)
analytics.trackCalculatorSubmit(calculatorName: string, method?: 'button' | 'auto' | 'enter')
analytics.trackCalculatorResult(calculatorName: string)
analytics.trackCalculatorReset(calculatorName: string)
analytics.trackInputChange(calculatorName: string, fieldName: string)
analytics.trackCopyResult(calculatorName: string)
analytics.trackShare(calculatorName: string, channel: string)
analytics.trackError(calculatorName: string, errorCode: string)
analytics.trackOutboundClick(linkUrl: string, linkText?: string, calculatorName?: string)
analytics.trackEmailSignup(source?: string)
analytics.trackContactSubmit(contactType?: string)

// Enable event delegation (auto-tracks common patterns)
// Call once on page mount to automatically track data-action buttons, input changes, links
analytics.enableEventDelegation(calculatorName: string)
```

### Event Delegation

For simpler implementations, use **event delegation** to automatically track common patterns:

```tsx
useEffect(() => {
  analytics.enableEventDelegation('my-calculator');
}, []);
```

This will automatically track:
- Clicks on buttons with `data-action="calculate"`, `data-action="reset"`, `data-action="copy"`
- Changes in inputs within `data-calculator-container`
- Input field names via `data-field-name` attribute

**Minimal HTML example:**
```html
<div data-calculator-container>
  <input type="number" data-field-name="home_price" />
  <button data-action="calculate">Calculate</button>
  <button data-action="reset">Reset</button>
  <button data-action="copy">Copy Result</button>
</div>
```

### Testing & Debugging

#### Option 1: GA DebugView

1. Go to [Google Analytics DebugView](https://analytics.google.com/)
2. Select your property and open the **DebugView** tab
3. Visit your calculator page
4. Events will appear in real-time

#### Option 2: Local Debug Mode

Add `?ga_debug=1` to the calculator URL to enable console logging:

```
https://simplecalculators.io/mortgage?ga_debug=1
```

Console will show:
```
[GA4 Analytics] Event: calculator_view {calculator_name: "mortgage"}
[GA4 Analytics] Event: calculator_input_change {calculator_name: "mortgage", field_name: "home_price"}
```

#### Option 3: Browser DevTools

1. Open DevTools → Network tab
2. Filter for requests starting with `collect`
3. Each event triggers a `POST` to `www.google-analytics.com/g/collect`
4. View request payload to see parameters sent

### Customizing Events

To add a new event type, edit [src/utils/analytics.ts](src/utils/analytics.ts):

```typescript
// Add a new method
public trackCustomEvent(calculatorName: string, customParam: string): void {
  this.sendEvent('custom_event_name', {
    calculator_name: calculatorName,
    custom_param: customParam,
  });
}
```

Then use in your component:
```typescript
analytics.trackCustomEvent('my-calculator', 'custom_value');
```

### Disabling Analytics

- **Localhost**: Analytics automatically disabled on localhost (no configuration needed)
- **Opt-out**: Remove the GA4 script tag from [src/layouts/MainLayout.astro](src/layouts/MainLayout.astro) to fully disable analytics

---

## Monetization

### AdSense

- AdSlot placeholders are placed on the home page and within each calculator
- Replace with real AdSense code (see "Adding AdSense" section above)

### Affiliate Links

- Each calculator has an AffiliateBox component with sample affiliate links
- Update URLs in the page components to your actual affiliate links
- All affiliate links use `rel="nofollow sponsored"`

## Accessibility

- Semantic HTML throughout
- ARIA labels on form inputs
- Keyboard navigation support
- Good focus states with visible outlines
- Color contrast ratios meet WCAG standards
- Touch-friendly button sizes (min 44x44 px)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Disclaimer

These calculators provide estimates for educational purposes only. They are not financial, medical, or professional advice. Users should consult qualified professionals for personalized guidance.

## License

MIT

## Contributing

Contributions are welcome. Please open an issue or pull request.

---

Built with React, Vite, and Tailwind CSS.
