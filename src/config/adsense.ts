export const ADSENSE_PUBLISHER_ID = 'ca-pub-1766867001144344';

export const ADSENSE_SCRIPT_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;

export const ADSENSE_SLOT_IDS = {
  homeIntro: '0000000001',
  homeBottom: '0000000002',
  calculatorAfterResults: '0000000003',
  calculatorBottom: '0000000004',
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOT_IDS;

export interface AdSlotDefinition {
  slotId: string;
  label: string;
  minHeight: number;
}

// Replace these placeholder slot IDs with real Google AdSense slot IDs after the site
// is approved and the production ad units have been created in the AdSense dashboard.
export const ADSENSE_SLOTS: Record<AdSlotKey, AdSlotDefinition> = {
  homeIntro: {
    slotId: ADSENSE_SLOT_IDS.homeIntro,
    label: 'Home intro ad',
    minHeight: 280,
  },
  homeBottom: {
    slotId: ADSENSE_SLOT_IDS.homeBottom,
    label: 'Home bottom ad',
    minHeight: 280,
  },
  calculatorAfterResults: {
    slotId: ADSENSE_SLOT_IDS.calculatorAfterResults,
    label: 'Calculator results ad',
    minHeight: 280,
  },
  calculatorBottom: {
    slotId: ADSENSE_SLOT_IDS.calculatorBottom,
    label: 'Calculator bottom ad',
    minHeight: 280,
  },
};
