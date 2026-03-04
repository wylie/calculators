/**
 * GA4 Analytics Module for Simple Calculators
 * 
 * Provides helper functions for tracking calculator usage events.
 * No PII is collected. All events are opt-in and designed for meaningful analytics.
 * 
 * Features:
 * - Automatic localhost filtering
 * - Debug mode via ?ga_debug=1 query parameter
 * - Event delegation for common calculator patterns
 * - Privacy-first design (no personal data captured)
 */

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsConfig {
  debug: boolean;
  enabled: boolean;
  calculatorName?: string;
}

interface DebugStats {
  attempted: number;
  sent: number;
  blockedNoGtag: number;
  blockedDisabled: number;
  lastEvent?: string;
  lastEventAt?: string;
  heartbeatStarted: boolean;
}

class AnalyticsManager {
  private config: AnalyticsConfig;
  private debugStats: DebugStats;

  private publishDebugStats(): void {
    if (typeof window === 'undefined') return;
    (window as any).__gaDebugStats = {
      ...this.debugStats,
      enabled: this.config.enabled,
      gtagReady: this.getGtag() !== undefined,
      calculatorName: this.config.calculatorName,
      hostname: window.location.hostname,
    };
  }

  constructor() {
    // Initialize configuration
    const isLocalhost = this.isLocalhost();
    const isDebugMode = this.isDebugMode();
    const localAnalyticsEnabled = this.isLocalAnalyticsEnabled();
    
    this.config = {
      debug: isDebugMode,
      enabled: typeof window !== 'undefined' && (!isLocalhost || localAnalyticsEnabled),
      calculatorName: undefined,
    };

    this.debugStats = {
      attempted: 0,
      sent: 0,
      blockedNoGtag: 0,
      blockedDisabled: 0,
      heartbeatStarted: false,
    };

    this.publishDebugStats();

    if (this.config.debug && this.config.enabled) {
      console.log('[GA4 Analytics] Debug mode enabled. All events will be logged.');
      this.startDebugHeartbeat();
    }

    if (isLocalhost && !localAnalyticsEnabled) {
      console.log('[GA4 Analytics] Running on localhost - analytics disabled. Add ?ga_local=1 to enable for testing.');
    }

    if (isLocalhost && localAnalyticsEnabled && this.config.debug) {
      console.log('[GA4 Analytics] Local analytics override enabled via ?ga_local=1');
    }

    this.publishDebugStats();
  }

  /**
   * Get current gtag reference (handles async script load timing)
   */
  private getGtag(): ((command: string, eventName: string, params?: EventParams) => void) | undefined {
    if (typeof window === 'undefined') return undefined;
    const gtag = (window as any).gtag;
    return typeof gtag === 'function' ? gtag : undefined;
  }

  /**
   * Debug-only heartbeat to quickly verify analytics pipeline health.
   */
  private startDebugHeartbeat(): void {
    if (!this.config.debug || typeof window === 'undefined' || this.debugStats.heartbeatStarted) {
      return;
    }

    this.debugStats.heartbeatStarted = true;

    const logHeartbeat = (): void => {
      const gtagReady = this.getGtag() !== undefined;
      console.log('[GA4 Analytics] Heartbeat', {
        enabled: this.config.enabled,
        gtagReady,
        hostname: window.location.hostname,
        attempted: this.debugStats.attempted,
        sent: this.debugStats.sent,
        blockedNoGtag: this.debugStats.blockedNoGtag,
        blockedDisabled: this.debugStats.blockedDisabled,
        lastEvent: this.debugStats.lastEvent,
        lastEventAt: this.debugStats.lastEventAt,
      });
      this.publishDebugStats();
    };

    logHeartbeat();
    window.setInterval(logHeartbeat, 15000);
  }

  /**
   * Check if running on localhost (disable analytics)
   */
  private isLocalhost(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]'
    );
  }

  /**
   * Check if debug mode is enabled via ?ga_debug=1 query parameter
   */
  private isDebugMode(): boolean {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('ga_debug') === '1';
  }

  /**
   * Allow local analytics testing with ?ga_local=1
   */
  private isLocalAnalyticsEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('ga_local') === '1';
  }

  /**
   * Internal method to send event to GA4
   */
  private sendEvent(eventName: string, params: EventParams = {}): void {
    this.debugStats.attempted += 1;
    this.publishDebugStats();

    if (!this.config.enabled) {
      this.debugStats.blockedDisabled += 1;
      this.publishDebugStats();
      if (this.config.debug && this.config.enabled === false && !this.isLocalhost()) {
        console.log(`[GA4 Analytics] Event blocked (analytics disabled): ${eventName}`, params);
      }
      return;
    }

    const gtag = this.getGtag();
    if (!gtag) {
      this.debugStats.blockedNoGtag += 1;
      this.publishDebugStats();
      if (this.config.debug) {
        console.log(`[GA4 Analytics] Event blocked (gtag not available yet): ${eventName}`, params);
      }
      return;
    }

    // Add calculator name if set
    const enhancedParams: EventParams = { ...params };
    if (this.config.calculatorName && !params.calculator_name) {
      enhancedParams.calculator_name = this.config.calculatorName;
    }

    if (this.config.debug) {
      console.log(`[GA4 Analytics] Event: ${eventName}`, enhancedParams);
    }

    try {
      gtag('event', eventName, enhancedParams);
      this.debugStats.sent += 1;
      this.debugStats.lastEvent = eventName;
      this.debugStats.lastEventAt = new Date().toISOString();
      this.publishDebugStats();
    } catch (error) {
      if (this.config.debug) {
        console.error('[GA4 Analytics] Error sending event:', error);
      }
    }
  }

  /**
   * Set the calculator name for the current page
   * This will be automatically added to all subsequent events
   */
  public setCalculator(name: string): void {
    this.config.calculatorName = name;
    if (this.config.debug) {
      console.log(`[GA4 Analytics] Calculator set to: ${name}`);
    }
  }

  /**
   * Generic event tracking function
   */
  public trackEvent(name: string, params: EventParams = {}): void {
    this.sendEvent(name, params);
  }

  /**
   * Track calculator page view
   */
  public trackCalculatorView(calculatorName: string): void {
    this.setCalculator(calculatorName);
    this.sendEvent('calculator_view', {
      calculator_name: calculatorName,
    });
  }

  /**
   * Track calculator form submission/calculation
   */
  public trackCalculatorSubmit(calculatorName: string, method: 'button' | 'auto' | 'enter' = 'button'): void {
    this.sendEvent('calculator_submit', {
      calculator_name: calculatorName,
      method: method,
    });
  }

  /**
   * Track when results are displayed (after calculation)
   */
  public trackCalculatorResult(calculatorName: string): void {
    this.sendEvent('calculator_result', {
      calculator_name: calculatorName,
    });
  }

  /**
   * Track calculator reset/clear action
   */
  public trackCalculatorReset(calculatorName: string): void {
    this.sendEvent('calculator_reset', {
      calculator_name: calculatorName,
    });
  }

  /**
   * Track input field changes
   */
  public trackInputChange(calculatorName: string, fieldName: string): void {
    this.sendEvent('calculator_input_change', {
      calculator_name: calculatorName,
      field_name: fieldName,
    });
  }

  /**
   * Track copy result action
   */
  public trackCopyResult(calculatorName: string): void {
    this.sendEvent('calculator_copy', {
      calculator_name: calculatorName,
    });
  }

  /**
   * Track share action
   */
  public trackShare(calculatorName: string, channel: string): void {
    this.sendEvent('calculator_share', {
      calculator_name: calculatorName,
      channel: channel,
    });
  }

  /**
   * Track calculator errors
   */
  public trackError(calculatorName: string, errorCode: string): void {
    this.sendEvent('calculator_error', {
      calculator_name: calculatorName,
      error_code: errorCode,
    });
  }

  /**
   * Track outbound link clicks
   */
  public trackOutboundClick(linkUrl: string, linkText?: string, calculatorName?: string): void {
    const params: EventParams = {
      link_url: linkUrl,
    };
    if (linkText) {
      params.link_text = linkText;
    }
    if (calculatorName) {
      params.calculator_name = calculatorName;
    }
    this.sendEvent('outbound_click', params);
  }

  /**
   * Track email signup (success only, no email address)
   */
  public trackEmailSignup(source?: string): void {
    const params: EventParams = {};
    if (source) {
      params.signup_source = source;
    }
    this.sendEvent('email_signup', params);
  }

  /**
   * Track contact form submission (success only, no form content)
   */
  public trackContactSubmit(contactType?: string): void {
    const params: EventParams = {};
    if (contactType) {
      params.contact_type = contactType;
    }
    this.sendEvent('contact_submit', params);
  }

  /**
   * Enable event delegation for common calculator patterns
   * Call this once on page load to automatically track:
   * - [data-action="calculate"] button clicks
   * - [data-action="reset"] button clicks
   * - [data-action="copy"] button clicks
   * - Input changes within [data-calculator-container]
   */
  public enableEventDelegation(calculatorName: string): void {
    this.setCalculator(calculatorName);

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Track Calculate button clicks
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('data-action') === 'calculate') {
        this.trackCalculatorSubmit(calculatorName, 'button');
      }
    });

    // Track Reset button clicks
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('data-action') === 'reset') {
        this.trackCalculatorReset(calculatorName);
      }
    });

    // Track Copy button clicks
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('data-action') === 'copy') {
        this.trackCopyResult(calculatorName);
      }
    });

    // Track input changes in calculator container
    document.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLElement;
      const container = target.closest('[data-calculator-container]');
      if (container) {
        const fieldName = target.getAttribute('data-field-name') || target.id || (target as any).name || 'unknown';
        this.trackInputChange(calculatorName, fieldName);
      }
    });

    // Track outbound link clicks
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const href = target.href;
        // Check if it's an external link or affiliate link
        if (!href.includes(window.location.hostname)) {
          const linkText = target.textContent?.trim() || target.text || target.href;
          this.trackOutboundClick(href, linkText, calculatorName);
        }
      }
    });
  }
}

// Create singleton instance
const analytics = new AnalyticsManager();

export default analytics;
