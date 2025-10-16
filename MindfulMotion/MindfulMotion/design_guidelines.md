# Bliss Buzz Design Guidelines

## Design Approach

**Reference-Based Hybrid**: Drawing inspiration from Calm's serene aesthetics, Headspace's playful approachability, Linear's precise typography, and Stripe's sophisticated color restraint. The design embodies "transformation from chaos to calm" through a carefully balanced palette that feels both grounding and uplifting.

**Core Principles:**
- Serenity Through Simplicity: Clean, uncluttered interfaces that reduce cognitive load
- Purposeful Motion: Every animation serves the meditation experience, never distracts
- Emotional Intelligence: Visual design adapts to user's emotional state
- Progressive Disclosure: Complexity revealed gradually as users deepen their practice

---

## Color Palette

### Dark Mode (Primary)
**Foundation Colors:**
- Background Primary: `240 10% 8%` (deep charcoal with subtle blue undertone)
- Background Secondary: `240 8% 12%` (elevated surfaces)
- Background Tertiary: `240 6% 16%` (cards, modals)

**Brand & Accent:**
- Primary (Serenity Blue): `210 80% 60%` (calming azure, used for CTAs and focus states)
- Secondary (Zen Purple): `270 50% 65%` (gentle lavender, used sparingly for meditation states)
- Success (Growth Green): `150 45% 55%` (muted sage for streaks, achievements)
- Calm (Breath Teal): `180 50% 50%` (for breathwork visualizations)

**Neutrals:**
- Text Primary: `240 5% 96%` (soft white)
- Text Secondary: `240 5% 70%` (muted for supporting text)
- Text Tertiary: `240 5% 50%` (subtle labels)
- Border: `240 10% 20%` (barely visible dividers)

### Light Mode
**Foundation Colors:**
- Background Primary: `40 20% 97%` (warm off-white)
- Background Secondary: `40 15% 94%` (elevated surfaces)
- Background Tertiary: `40 10% 90%` (cards)

**Brand & Accent:**
- Primary: `210 75% 50%` (deeper blue for contrast)
- Secondary: `270 45% 55%` (richer purple)
- Success: `150 40% 45%` (deeper sage)
- Calm: `180 45% 42%` (deeper teal)

**Neutrals:**
- Text Primary: `240 10% 10%` (near black)
- Text Secondary: `240 5% 35%`
- Text Tertiary: `240 5% 55%`
- Border: `240 5% 85%`

---

## Typography

**Font Families:**
- Primary (Headings): Inter (via Google Fonts) - clean, modern, excellent readability
- Secondary (Body): Inter - consistent system for cohesion
- Accent (Meditation Scripts): Crimson Pro (via Google Fonts) - elegant serif for guided meditation text

**Type Scale:**
- Hero Heading: `text-6xl md:text-7xl font-bold` (60-72px)
- Section Heading: `text-4xl md:text-5xl font-semibold` (36-48px)
- Card Title: `text-2xl font-semibold` (24px)
- Body Large: `text-lg` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Caption: `text-xs` (12px)

**Meditation Script Typography:**
- Use Crimson Pro at `text-xl md:text-2xl leading-relaxed` for guided meditation text
- Generous line-height (1.8-2.0) for calming reading rhythm
- Letter-spacing: `tracking-wide` for affirmations and mantras

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20, 24 and 32 consistently
- Micro spacing: `p-2, gap-2` (8px) - tight grouping
- Small spacing: `p-4, gap-4` (16px) - component padding
- Medium spacing: `p-8, gap-8` (32px) - section padding
- Large spacing: `py-16, py-20` (64-80px) - major sections
- XL spacing: `py-24, py-32` (96-128px) - hero sections

**Container Strategy:**
- Full-width sections: `w-full` with inner `max-w-7xl mx-auto px-4`
- Content sections: `max-w-6xl mx-auto`
- Meditation content: `max-w-4xl mx-auto` (focus, reduced distraction)
- Reading content: `max-w-prose` (optimal 65-75 characters per line)

**Grid Patterns:**
- Feature cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Dashboard stats: `grid-cols-2 lg:grid-cols-4 gap-4`
- Zen Sparks library: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

---

## Component Library

### Navigation
- Sticky header: `h-16` with backdrop blur (`backdrop-blur-md bg-background/80`)
- Logo left, nav center, CTA right on desktop
- Mobile: Hamburger menu with slide-in drawer

### Cards
**Meditation Card:**
- Rounded corners: `rounded-2xl`
- Elevation: `shadow-lg hover:shadow-xl transition-shadow`
- Padding: `p-6`
- Hover state: Subtle lift with `hover:-translate-y-1 transition-transform`

**Stat Card:**
- Glass morphism effect: `backdrop-blur-lg bg-white/5 border border-white/10`
- Large number: `text-4xl font-bold`
- Label below: `text-sm text-secondary`

### Buttons
**Primary CTA:**
- `bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold`
- Shadow: `shadow-lg shadow-primary/20`

**Secondary:**
- `border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-full`

**Meditation Session Controls:**
- Circular play/pause button: `w-16 h-16 rounded-full bg-primary`
- Icon-only, centered with smooth transitions

### Forms
**Mood Check-In:**
- 6 emotion cards in grid (2x3 on mobile, 3x2 on tablet, 6x1 on desktop)
- Each card: Icon, label, radio input (hidden), styled as clickable card
- Selected state: `border-2 border-primary bg-primary/10`
- Hover: `scale-105 transition-transform`

**Input Fields:**
- Dark mode: `bg-background-tertiary border border-white/10 rounded-lg px-4 py-3`
- Light mode: `bg-white border border-gray-300 rounded-lg px-4 py-3`
- Focus: `ring-2 ring-primary border-transparent`

### Data Visualization
**Progress Charts (Recharts):**
- Line charts for mood trends: Smooth curves, gradient fill beneath
- Bar charts for weekly stats: Rounded tops, gradient fills
- Colors: Use brand palette (Primary, Success, Calm)
- Grid: Subtle `stroke-white/5` in dark mode
- Tooltips: Glass morphism design matching stat cards

**Streak Tracker:**
- Calendar heatmap style: Small squares representing days
- Color intensity: Based on meditation minutes (lighter to Primary color)
- Current day: `ring-2 ring-primary`

### Breathwork Visualization
**Canvas-Based Animations:**
- Circular breathing guide: Expands/contracts in 4-7-8 rhythm
- Particle system: Gentle floating particles responding to breath phase
- Color shifts: Cool (inhale) → Warm (hold) → Cool (exhale)
- Full-screen option: `fixed inset-0 z-50 bg-black`

### Meditation Session Player
**Immersive Layout:**
- Full-height section: `min-h-screen flex items-center justify-center`
- Background: Blurred environment image with dark overlay
- Central focus: Meditation script in Crimson Pro
- Bottom controls: Fixed bar with play/pause, progress indicator, timer

---

## Animations

**Minimal, Purposeful Motion:**
- Page transitions: Fade in `opacity-0 animate-fade-in` (300ms)
- Card hovers: Subtle lift `-translate-y-1` (200ms)
- Button interactions: Scale `scale-95` on click (100ms)
- Loading states: Gentle pulse `animate-pulse` for breathwork guide
- **Avoid:** Scroll-triggered animations, parallax effects, excessive motion

**Breathwork-Specific:**
- Breathing circle: Smooth scale transform synced to breath count
- Particle float: Slow, organic motion using CSS animations or canvas

---

## Images

### Hero Section
**Large Hero Image:** Yes - full-width, reduced opacity background
- **Description:** Serene meditation scene - person in lotus position silhouetted against misty mountains at sunrise, soft purple-blue gradient sky
- **Placement:** Hero section background with dark overlay (`bg-black/40`)
- **Treatment:** Slightly blurred (`blur-sm`) to maintain text readability

### 3D/Immersive Environments
**Meditation Environment Backgrounds:**
- **Bamboo Forest:** Lush green bamboo stalks with dappled sunlight filtering through
- **Ocean Depths:** Deep blue underwater scene with gentle light rays from surface
- **Aurora Sky:** Arctic landscape with vibrant northern lights in purples and greens
- **Temple Garden:** Stone lanterns, raked sand, cherry blossom petals
- **Treatment:** These serve as full-screen backgrounds during active meditation sessions, dimmed with overlays for text readability

### Feature Cards
**Icon-Based:** Use Lucide React icons instead of photos for features (Brain, Heart, BarChart3, Sparkles, Users, Moon)

### Dashboard
**No images needed** - Data visualizations and charts provide visual interest

### Testimonials/Social Proof (if added)
**Avatar placeholders:** Circular, gradient backgrounds with initials instead of photos for anonymous sharing

---

## Accessibility Enhancements

- All interactive elements: Minimum `44x44px` touch target
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Focus indicators: Visible `ring-2 ring-primary` on keyboard navigation
- Reduced motion: Respect `prefers-reduced-motion` - disable breathwork animations
- Screen reader labels: Comprehensive ARIA labels for meditation controls
- Form inputs: Consistent dark mode treatment (no jarring white backgrounds)

---

**Final Note:** This design creates a sanctuary from digital chaos - every pixel serves the transformation from "buzz" to "bliss." The aesthetic is sophisticated yet approachable, calming yet engaging, minimal yet feature-rich.