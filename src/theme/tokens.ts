// Design Tokens for Financial Health Dashboard
// Ready for React Native (Expo) implementation

export const colors = {
    background: {
      primary: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)',
      primaryStart: '#F8FAFC',
      primaryEnd: '#EEF2FF',
    },
    card: {
      glass: {
        awareness: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        spending: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        subscription: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        cash: 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)',
        credit: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        hero: 'linear-gradient(135deg, #5B7CFA 0%, #8B5CF6 100%)',
      },
      highlight: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 20%)',
      heroHighlight: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 20%)',
    },
    status: {
      good: '#22C55E',
      moderate: '#F59E0B',
      high: '#EF4444',
      strong: '#22C55E',
    },
    text: {
      primary: '#0F172A',
      secondary: 'rgba(15, 23, 42, 0.7)',
      white: '#FFFFFF',
      whiteSecondary: 'rgba(255, 255, 255, 0.7)',
      whiteSubtle: 'rgba(255, 255, 255, 0.9)',
      muted: '#64748B',
      mutedLight: '#94A3B8',
    },
    accent: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
    },
    glow: {
      awareness: 'rgba(34, 197, 94, 0.15)',
      spending: 'rgba(245, 158, 11, 0.18)',
      subscription: 'rgba(239, 68, 68, 0.18)',
      cash: 'rgba(34, 197, 94, 0.15)',
      credit: 'rgba(99, 102, 241, 0.15)',
      hero: 'rgba(139, 92, 246, 0.3)',
    },
    badge: {
      background: {
        good: 'rgba(34, 197, 94, 0.15)',
        moderate: 'rgba(245, 158, 11, 0.15)',
        high: 'rgba(239, 68, 68, 0.15)',
        strong: 'rgba(34, 197, 94, 0.15)',
        heroGood: 'rgba(34, 197, 94, 0.2)',
      },
      border: 'rgba(255, 255, 255, 0.25)',
    },
    progressBar: {
      empty: 'rgba(0, 0, 0, 0.08)',
      emptyHero: 'rgba(255, 255, 255, 0.25)',
      filled: 'rgba(255, 255, 255, 0.95)',
    },
    overlay: {
      awareness: 'rgba(209, 250, 229, 0.15)',
      spending: 'rgba(255, 237, 213, 0.15)',
      subscription: 'rgba(254, 226, 226, 0.15)',
      cash: 'rgba(220, 252, 231, 0.15)',
      credit: 'rgba(219, 234, 254, 0.15)',
      hero: 'rgba(91, 124, 250, 0.12)',
    },
    nav: {
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.32) 100%)',
      border: 'rgba(255, 255, 255, 0.6)',
      innerHighlight: 'inset 0 -1px 0 rgba(255, 255, 255, 0.8)',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
      blur: 'blur(60px)',
      borderRadius: '28px',
      height: '72px',
      bottomSpacing: '12px',
      horizontalMargin: '20px',
      activeTab: {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%)',
        border: 'rgba(255, 255, 255, 0.9)',
        shadow: '0 8px 24px rgba(91, 140, 255, 0.35)',
        blur: 'blur(20px)',
      },
      icon: {
        default: 'rgba(60, 80, 120, 0.65)',
        active: '#5B8CFF',
      },
      label: {
        default: 'rgba(60, 80, 120, 0.75)',
        active: '#5B8CFF',
        activeFontWeight: 600,
        defaultFontWeight: 500,
      },
    },
  };
  
  export const typography = {
    fontFamily: {
      text: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
      // Large Display
      heroScore: '64px',
      heroScoreSecondary: '30px',
      
      // Display
      metricValue: '32px',
      
      // Headings
      pageTitle: '34px',
      cardTitle: '17px',
      
      // Body
      body: '16px',
      bodySmall: '14px',
      caption: '13px',
      tiny: '10px',
    },
    lineHeight: {
      heroScore: '68px',
      heroScoreSecondary: '36px',
      metricValue: '38px',
      pageTitle: '41px',
      body: '22px',
      bodySmall: '20px',
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      medium: 500,
      regular: 400,
    },
    letterSpacing: {
      tight: '-0.3px',
      normal: '-0.2px',
    },
  };
  
  export const spacing = {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '16px',
    xxl: '20px',
    xxxl: '24px',
    
    // Card specific
    cardPadding: '24px',
    cardPaddingCompact: '20px',
    cardGap: '20px',
    
    // Progress bars
    progressBarGap: '6px',
    progressBarGapHero: '8px',
    
    // Sections
    sectionGap: '20px',
    mainContentGap: '20px',
  };
  
  export const radius = {
    card: '28px',
    cardSmall: '24px',
    badge: '999px', // Fully rounded
    progressBar: '999px',
    button: '16px',
  };
  
  export const shadows = {
    card: '0 12px 40px rgba(15, 23, 42, 0.06), 0 0 1px rgba(255, 255, 255, 0.2) inset',
    cardHero: '0 12px 40px rgba(91, 124, 250, 0.16), 0 0 1px rgba(255, 255, 255, 0.2) inset',
    nav: '0 -4px 16px rgba(15, 23, 42, 0.04)',
    progressBarActive: (color: string) => `0 2px 8px ${color}30`,
  };
  
  export const effects = {
    backdropBlur: {
      strong: 'blur(40px)',
      medium: 'blur(30px)',
      light: 'blur(20px)',
      badge: 'blur(8px)',
    },
    glassBlur: {
      card: '30px',
      hero: '40px',
      nav: '20px',
      badge: '8px',
    },
    illustrationBlur: '1px',
    glowBlur: {
      small: '50px',
      medium: '60px',
      large: '80px',
    },
  };
  
  export const illustration = {
    size: {
      hero: '200px',
      card: '170px',
    },
    opacity: {
      hero: 0.45,
      card: 0.40,
    },
    position: {
      hero: { top: '-30px', right: '-40px' },
      card: { top: '-25px', right: '-35px' },
    },
    glow: {
      size: {
        hero: { width: '250px', height: '250px' },
        card: { width: '180px', height: '180px' },
      },
      position: {
        hero: { top: '-40px', right: '-40px' },
        card: { top: '-30px', right: '-30px' },
      },
    },
    maskGradient: {
      hero: 'radial-gradient(circle at 60% 60%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
      card: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
    },
  };
  
  export const layout = {
    container: {
      maxWidth: '393px', // iPhone 15 Pro width
    },
    header: {
      paddingTop: '56px', // 14 * 4
      paddingBottom: '24px',
      paddingHorizontal: '24px',
    },
    main: {
      paddingHorizontal: '24px',
      paddingBottom: '96px',
      gap: '20px',
    },
    nav: {
      height: '80px',
      paddingHorizontal: '24px',
      paddingTop: '12px',
      paddingBottom: '32px',
    },
  };
  
  export const progressBar = {
    height: '8px',
    heightCompact: '8px',
    gap: '6px',
    totalSegments: 5,
  };
  
  export const transitions = {
    duration: '200ms',
    easing: 'ease-in-out',
    hover: {
      brightness: 1.02,
    },
    active: {
      scale: 0.98,
    },
  };
  
  // Illustration assets mapping
  export const illustrations = {
    hero: '📊',
    awareness: '🧠',
    spending: '💳',
    subscription: '📱',
    cash: '💰',
    credit: '✨',
  };
  
  // Status type definitions
  export type StatusType = 'good' | 'moderate' | 'high' | 'strong';
  export type CardType = 'awareness' | 'spending' | 'subscription' | 'cash' | 'credit';

  // Flat tokens for components (e.g. StatusBadge, SegmentProgressBar)
  export const tokens = {
    colors: {
      badgeGoodBg: colors.badge.background.good,
      badgeModerateBg: colors.badge.background.moderate,
      badgeHighBg: colors.badge.background.high,
      badgeHeroGoodBg: colors.badge.background.heroGood,
      statusGood: colors.status.good,
      statusModerate: colors.status.moderate,
      statusHigh: colors.status.high,
      progressHeroFilled: colors.progressBar.filled,
      progressHeroEmpty: colors.progressBar.emptyHero,
    },
    radius: {
      badge: 9999,
    },
    progress: {
      segments: progressBar.totalSegments,
      height: 8,
      gap: 6,
    },
  };

  // React Native LinearGradient color arrays (from card.glass and background)
  export const gradientColors = {
    background: [colors.background.primaryStart, colors.background.primaryEnd] as [string, string],
    hero: ['#5B7CFA', '#8B5CF6'] as [string, string],
    awareness: ['#ECFDF5', '#D1FAE5'] as [string, string],
    spending: ['#FFF7ED', '#FFEDD5'] as [string, string],
    subscription: ['#FEF2F2', '#FEE2E2'] as [string, string],
    cash: ['#ECFDF5', '#DCFCE7'] as [string, string],
    credit: ['#EFF6FF', '#DBEAFE'] as [string, string],
  };

  // Overlay gradient end colors (start transparent) for glass cards
  export const overlayColors: Record<CardType | 'hero', string> = {
    hero: colors.overlay.hero,
    awareness: colors.overlay.awareness,
    spending: colors.overlay.spending,
    subscription: colors.overlay.subscription,
    cash: colors.overlay.cash,
    credit: colors.overlay.credit,
  };