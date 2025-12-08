# Go Tawi - Food Delivery Application

A modern, mobile-first food delivery application featuring a comprehensive UI/UX implementation built with vanilla HTML, CSS, and JavaScript. This project demonstrates advanced front-end development practices with modular architecture and separation of concerns.

## Project Structure

```
gotawee/
├── index.html                      # Main landing page
├── README.md                       # Project documentation
├── .gitignore                      # Version control exclusions
│
├── assets/                         # Static media resources
│   ├── map-tracking.png           # Delivery tracking map
│   ├── training/                  # Training dataset (categorized food images)
│   │   ├── Bread/
│   │   ├── Dairy product/
│   │   ├── Dessert/
│   │   ├── Egg/
│   │   ├── Fried food/
│   │   ├── Meat/
│   │   ├── Noodles-Pasta/
│   │   ├── Rice/
│   │   ├── Seafood/
│   │   ├── Soup/
│   │   └── Vegetable-Fruit/
│   ├── validation/                # Validation dataset (same structure)
│   └── evaluation/                # Evaluation dataset (same structure)
│
├── css/                           # Stylesheets (modular architecture)
│   ├── style.css                  # Base styles and design system
│   ├── order-tracking.css         # Order tracking page styles
│   ├── profile.css                # User profile page styles
│   ├── search.css                 # Search functionality styles
│   └── orders.css                 # Orders management styles
│
├── js/                            # JavaScript modules
│   ├── script.js                  # Main application logic
│   ├── food-modal.js              # Food item modal functionality
│   ├── order-tracking.js          # Order status management
│   ├── profile.js                 # Profile page interactions
│   ├── search.js                  # Search and filter logic
│   └── orders.js                  # Orders page functionality
│
└── pages/                         # Application pages
    ├── splash.html                # Initial loading screen
    ├── login.html                 # User authentication
    ├── signup.html                # User registration
    ├── forgot-password.html       # Password recovery
    ├── confirmation-code.html     # Email verification
    ├── nearby-merchants.html      # Restaurant discovery
    ├── merchant-detail.html       # Restaurant details and menu
    ├── food-detail.html           # Individual food item details
    ├── cart.html                  # Shopping cart management
    ├── order-tracking.html        # Real-time order tracking
    ├── profile.html               # User account management
    ├── search.html                # Search and filtering
    └── orders.html                # Order history
```

## Core Features

### User Interface
- Animated background with morphing gradient shapes responsive to navigation state
- Interactive shopping cart with real-time quantity management
- Horizontal scrolling promotional cards with touch-optimized gestures
- Icon-based category navigation system
- Restaurant listings with comprehensive details and imagery
- Mobile-optimized responsive design (max-width: 430px)
- Smooth CSS transitions and keyframe animations

### Functionality
- Real-time order tracking with interactive status timeline
- User profile management with statistics dashboard
- Advanced search with category filtering and live results
- Order history with status-based filtering
- Shopping cart persistence and management
- Authentication flow (login, signup, password recovery)

## Design System

### Color Palette
The application implements a cohesive color system using CSS custom properties:

- **Porcelain** (`#FDFDFA`): Primary background color
- **Turf Green** (`#237E56`): Primary brand color and interactive elements
- **Light Gold** (`#EAD290`): Secondary accent for highlights
- **Amber Flame** (`#FDBC22`): Call-to-action buttons and alerts
- **Evergreen** (`#183526`): Text, headings, and dark UI elements

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
- Mobile-optimized font sizes with consistent hierarchy

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yksu0/GoTawee.git
   cd GoTawee
   ```

2. Open the application
   - Start with `pages/splash.html` for the complete experience
   - Or open `index.html` directly for the home screen
   - For development, use a local server (e.g., Live Server, http-server)

3. No build process required
   - Pure HTML/CSS/JavaScript implementation
   - No dependencies or package managers needed
   - Ready to run immediately after cloning

## Technical Architecture

### CSS Architecture
- **Modular Design**: Separate CSS files for each major page component
- **CSS Variables**: Centralized design tokens for consistency
- **BEM-inspired Naming**: Clear, maintainable class naming conventions
- **Mobile-First**: Optimized for 430px viewport with responsive patterns

### JavaScript Structure
- **ES6+ Standards**: Modern JavaScript syntax and features
- **Module Pattern**: Separated concerns with dedicated JS files per feature
- **Event-Driven**: Responsive UI updates based on user interactions
- **No Framework Dependencies**: Vanilla JavaScript for maximum performance

### Navigation States
The animated background adapts to navigation context:
- **Home**: Organic zigzag pattern
- **Search**: Wavy pattern with deeper valleys
- **Orders**: Smooth wave progression
- **Profile**: Gentle rounded wave

## Technology Stack

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom properties, Flexbox, Grid, animations, transforms
- **JavaScript ES6+**: Modern syntax, arrow functions, template literals
- **Google Fonts**: Inter font family for professional typography

## Development

### Code Style
- Consistent indentation (4 spaces)
- Comprehensive inline documentation
- Descriptive variable and function names
- Modular, reusable components

### File Organization
- Separation of concerns (HTML/CSS/JS)
- Page-specific stylesheets and scripts
- Centralized asset management
- Clear directory structure

## License

This project is developed for educational and portfolio demonstration purposes.

## Author

**yksu0**
- GitHub: [@yksu0](https://github.com/yksu0)
- Repository: [GoTawee](https://github.com/yksu0/GoTawee)

## Acknowledgments

This project demonstrates front-end development best practices including modular architecture, separation of concerns, and modern CSS/JavaScript techniques.
