# Go Tawi - Food Delivery App

A modern, mobile-first food delivery application built with vanilla HTML, CSS, and JavaScript.

## Design Overview

Go Tawi features a clean, intuitive interface with a distinctive zigzag background accent and warm color palette inspired by natural tones.

### Color Palette
```css
--porcelain: #FDFDFA     /* Primary background */
--turf-green: #237E56    /* Primary brand color */
--light-gold: #EAD290    /* Secondary accent */
--amber-flame: #FDBC22   /* Call-to-action */
--evergreen: #183526     /* Text & dark elements */
```

## Application Structure

### Layout Wireframe

```
┌─────────────────────────────────────┐
│ BACKGROUND ACCENT (Zigzag Edge)    │ ← Dynamic morphing shape
├─────────────────────────────────────┤
│ Location | Cart Profile            │ ← Top navigation bar
├─────────────────────────────────────┤
│ Search Bar    | Filter             │ ← Search functionality
├─────────────────────────────────────┤
│ DEALS & PROMOS SECTION             │ ← Horizontal scroll cards
│ [50% OFF] [Free Del] [20% OFF]     │   with burger images
├─────────────────────────────────────┤
│ CATEGORIES                         │ ← Icon-based category grid
│ [Pizza] [Burger] [Asian] [Mexican]  │   with animated elements
├─────────────────────────────────────┤
│ RECOMMENDED                        │ ← 2x2 food grid
│ [Pizza    ] [Burger   ]            │   with photos & ratings
│ [Noodles  ] [Tacos    ]            │
├─────────────────────────────────────┤
│ RESTAURANTS NEAR YOU               │ ← Vertical list with photos
│ [Restaurant 1] [>]                  │   and distance info
│ [Restaurant 2] [>]                  │
├─────────────────────────────────────┤
│ SPECIAL OFFER                      │ ← Featured restaurant card
│ [Large Image + Restaurant Info]     │   with promotional badge
└─────────────────────────────────────┘
│ Home | Search | Orders             │ ← Floating bottom navigation
│ Profile                            │   with morphing background
└─────────────────────────────────────┘
```

## Technical Architecture

### File Structure
```
project/
├── index.html          # Main application structure
├── style.css           # Complete styling & animations
├── script.js           # Interactive functionality
├── README.md           # This documentation
└── assets/
    ├── delicious-juicy-double-cheeseburger-mid-air-levitation.png
    └── training/        # Food category images
        ├── Bread/
        ├── Fried food/
        ├── Noodles-Pasta/
        └── Meat/
```

### Component Breakdown

#### 1. Background System
- **Dynamic Accent Shape**: CSS clip-path polygon creating zigzag pattern
- **Morphing Animation**: Shape transforms based on navigation state
- **Shadow Element**: Yellow accent shadow following zigzag contour
- **Floating Elements**: Animated circles and shapes within accent area

#### 2. Navigation Components
**Top Bar:**
- Location selector with dropdown functionality
- Cart icon with item counter badge
- Profile access button

**Bottom Navigation:**
- 4-tab floating navigation (Home, Search, Orders, Profile)
- Active state indicators
- Background morphing triggers

#### 3. Content Sections

**Search Interface:**
- Full-width search input with icon
- Filter button for advanced options
- Auto-suggestion capability

**Deals & Promos:**
- Horizontal scrolling card layout
- Gradient backgrounds with animated overlays
- Burger image integration (110px with transforms)
- Copy-to-clipboard promo codes

**Categories:**
- Icon-based circular buttons (64px)
- Subtle shadow effects (0 2px 8px rgba(0,0,0,0.1))
- Animated floating elements on hover
- SVG icons for each category

**Recommended Foods:**
- 2x2 grid layout with responsive design
- Food photography with favorite toggle
- Rating display and pricing
- Add-to-cart functionality

**Restaurant Listings:**
- Vertical card layout with photos
- Distance and rating information
- Expandable details with arrow indicators

**Special Offers:**
- Large featured card (200px image height)
- Restaurant branding with badges
- Hover transformations

#### 4. Interactive Features

**Cart System:**
- Modal overlay with item management
- Quantity controls and pricing calculations
- Promo code application
- Checkout workflow

**Animation Library:**
- CSS keyframes for morphing shapes
- Hover transformations
- Floating element animations
- Page transition effects

## Key Features

### Visual Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Organic Shapes**: Custom clip-path animations and floating elements
- **Consistent Shadows**: Unified shadow system across components
- **Brand Identity**: Cohesive color palette and typography

### User Experience
- **Intuitive Navigation**: Clear visual hierarchy and familiar patterns
- **Interactive Feedback**: Hover states, animations, and micro-interactions
- **Performance**: Optimized animations with CSS transforms
- **Accessibility**: Semantic HTML structure and keyboard navigation

### Technical Highlights
- **Pure CSS Animations**: No external animation libraries
- **Clip-path Mastery**: Complex zigzag shapes with shadow effects
- **Modular JavaScript**: Object-oriented app architecture
- **Responsive Grid**: Flexible layouts for different screen sizes

## Development Notes

### CSS Architecture
- CSS Custom Properties for consistent theming
- BEM-inspired class naming convention
- Progressive enhancement approach
- Hardware-accelerated animations

### JavaScript Patterns
- Class-based application structure
- Event delegation for dynamic content
- Local storage for cart persistence
- Modal system for overlays

### Performance Considerations
- CSS `will-change` property for optimized animations
- Lazy loading for food images
- Debounced search functionality
- Minimal DOM manipulation

## Animation Showcase

### Background Morphing
The signature feature - a dynamic background that morphs based on user navigation:
- **Home**: Default zigzag pattern
- **Search**: Extended wave pattern
- **Orders**: Simplified geometric shape
- **Profile**: Rounded corner variation

### Micro-Interactions
- Card hover elevations with scale transforms
- Floating element speed variations on interaction
- Burger image rotation on deal card hover
- Category icon bounce animations

### Visual Hierarchy
- Z-index layering system for proper element stacking
- Shadow depth indicating interaction importance
- Color temperature shifts for call-to-action elements

---

*Built for seamless food delivery experiences*