/**
 * Step-by-step cancellation guides for Subscription Cleanse quest.
 */

export interface CancellationStep {
  step: number;
  text: string;
}

const guides: Record<string, CancellationStep[]> = {
  Netflix: [
    { step: 1, text: 'Open Netflix on the web or in the app and sign in.' },
    { step: 2, text: 'Tap your profile icon, then Account.' },
    { step: 3, text: 'Under Membership & Billing, tap Cancel membership.' },
    { step: 4, text: 'Confirm cancellation. You can use Netflix until the end of your billing period.' },
  ],
  Spotify: [
    { step: 1, text: 'Open Spotify and go to account.spotify.com (or Account in the app).' },
    { step: 2, text: 'Under Subscription, click Cancel Premium.' },
    { step: 3, text: 'Choose a reason (optional) and confirm. You keep access until the period ends.' },
  ],
  'Paramount+': [
    { step: 1, text: 'Go to paramountplus.com and sign in.' },
    { step: 2, text: 'Click your profile name, then Account.' },
    { step: 3, text: 'Click Cancel Subscription and follow the prompts.' },
    { step: 4, text: 'Confirm. You keep access until the billing period ends.' },
  ],
  Hulu: [
    { step: 1, text: 'Go to hulu.com and sign in. Open your Account page.' },
    { step: 2, text: 'Under Your Subscription, click Cancel.' },
    { step: 3, text: 'Select your reason and confirm cancellation.' },
    { step: 4, text: 'You keep access until the end of the current period.' },
  ],
  'Amazon Prime': [
    { step: 1, text: 'Go to amazon.com and sign in. Click Account & Lists.' },
    { step: 2, text: 'Under Memberships & Subscriptions, click Prime Membership.' },
    { step: 3, text: 'Click Update, Cancel and More, then End membership.' },
    { step: 4, text: 'Confirm. Benefits continue until the end of the billing period.' },
  ],
  'Apple TV+': [
    { step: 1, text: 'On iPhone: Settings > [your name] > Subscriptions.' },
    { step: 2, text: 'Tap Apple TV+, then Cancel Subscription.' },
    { step: 3, text: 'Confirm. You keep access until the period ends.' },
  ],
  'Disney+': [
    { step: 1, text: 'Go to disneyplus.com and sign in. Click Profile, then Account.' },
    { step: 2, text: 'Under Subscription, click Cancel Subscription.' },
    { step: 3, text: 'Confirm. Access continues until the billing period ends.' },
  ],
  'YouTube Premium': [
    { step: 1, text: 'On YouTube, tap your profile photo > Paid memberships.' },
    { step: 2, text: 'Tap Manage membership, then Cancel membership.' },
    { step: 3, text: 'Confirm. You keep benefits until the period ends.' },
  ],
};

export function getCancellationGuide(serviceName: string): CancellationStep[] {
  return guides[serviceName] ?? [
    { step: 1, text: `Open the ${serviceName} app or website and sign in.` },
    { step: 2, text: 'Go to Account or Settings.' },
    { step: 3, text: 'Find Subscription or Billing and choose Cancel.' },
    { step: 4, text: 'Confirm cancellation.' },
  ];
}

export function hasGuide(serviceName: string): boolean {
  return serviceName in guides;
}
