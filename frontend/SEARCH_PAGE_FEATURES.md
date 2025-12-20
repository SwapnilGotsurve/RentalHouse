# Search Page Features - JoinRental

## Overview
Complete property search page with advanced filtering, sorting, and beautiful property cards under the `/search` route.

## Components Built

### 1. Search Page (`Search.jsx`)
Main page component that orchestrates all search functionality.

**Features:**
- Property listing display
- Filter management
- Sort functionality
- Responsive layout
- Sample property data

### 2. Search Header (`SearchHeader.jsx`)
Custom header with integrated search functionality.

**Features:**
- Logo with home navigation
- Multi-tag search system
- Add/remove location tags
- Search input with "Add more..." placeholder
- User profile icon
- Sticky positioning
- Blue brand color (#005BCB)

**Interactions:**
- Click X to remove tags
- Press Enter to add new tags
- Click logo to return home

### 3. Filter Bar (`FilterBar.jsx`)
Comprehensive filtering system with dropdown menus.

**Filter Options:**
1. **No. of Bedrooms** - 1 BHK to 5+ BHK
2. **Price Range** - ₹0 to ₹50000+
3. **Furnishing Status** - Fully/Semi/Unfurnished
4. **Availability** - Immediate to After 30 days
5. **Available For** - Family/Bachelor/Company
6. **Property Type** - Apartment/House/Villa/Studio
7. **Posted By** - Owner/Agent/Builder
8. **Amenities** - Parking/Gym/Pool/Security/Power Backup
9. **More Filters** - Pet Friendly/Balcony/Garden/Lift

**Features:**
- Sticky positioning below header
- Horizontal scroll on mobile
- Hover dropdown menus
- Clean gray design
- Smooth transitions

### 4. Property Card (`PropertyCard.jsx`)
Beautiful property listing card with image carousel.

**Features:**
- **Image Carousel:**
  - Multiple property images
  - Left/Right navigation arrows
  - Dot indicators
  - Smooth transitions
  - Hover-activated controls

- **Badges:**
  - "NEW" badge (green gradient)
  - "Furnished" badge (orange gradient)

- **Property Details:**
  - Title and location
  - Price per month
  - Security deposit
  - Area in sqft
  - Bedrooms (BHK)
  - Bathrooms
  - Property description

- **Visual Design:**
  - Blue gradient background
  - White detail cards with shadows
  - Icons for bed, bath, area
  - Hover shadow effects

- **Actions:**
  - Click card to view details
  - Contact button with phone icon
  - Owner info and posted date

### 5. Breadcrumb (`Breadcrumb.jsx`)
Navigation breadcrumb trail.

**Features:**
- Home > Property in > Location
- Clickable home link
- Current location highlighted in blue
- Chevron separators

### 6. Sort Dropdown (`SortDropdown.jsx`)
Advanced sorting options.

**Sort Options:**
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Newest First
- Oldest First
- Area: Largest First
- Area: Smallest First

**Features:**
- Dropdown menu
- Active state highlighting
- Click outside to close
- Smooth animations

## Design System

### Color Palette
- **Primary Blue:** `#005BCB` (header, buttons, accents)
- **Light Blue:** `#EFF6FF` (backgrounds, cards)
- **Orange:** `#FB923C` (featured badges)
- **Green:** `#10B981` (new badges)
- **Gray Scale:** Various shades for text and borders
- **White:** Card backgrounds

### Typography
- **Headings:** Bold, 18-24px
- **Body Text:** Regular, 14-16px
- **Small Text:** 12-14px
- **Font:** System default (can be customized)

### Icons
Using React Icons library:
- `FaSearch` - Search icon
- `FaHome` - Home/property icons
- `FaBed` - Bedroom icon
- `FaBath` - Bathroom icon
- `FaRulerCombined` - Area measurement
- `FaPhoneAlt` - Contact icon
- `FaChevronLeft/Right` - Navigation arrows
- `FaChevronDown` - Dropdown indicators
- `FaTimes` - Close/remove icon
- `FaUserCircle` - User profile
- `FaSort` - Sort icon

### Spacing & Layout
- **Container:** max-w-7xl (1280px)
- **Card Padding:** 24px (p-6)
- **Gap Between Cards:** 24px (space-y-6)
- **Border Radius:** 16px (rounded-2xl) for cards
- **Shadows:** Multiple levels (sm, md, lg, xl, 2xl)

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Single column layout
  - Stacked property details
  - Horizontal scroll filters
  
- **Tablet:** 768px - 1024px
  - Two column grids
  - Side-by-side property cards
  
- **Desktop:** > 1024px
  - Full layout with all features
  - Optimal spacing

## Interactions & Animations

### Hover Effects
- Card shadow elevation
- Button color changes
- Filter dropdown appearance
- Image carousel controls fade in

### Transitions
- All transitions: 200-300ms
- Smooth easing functions
- Transform animations for scale

### Carousel
- Smooth image transitions
- Dot indicator animations
- Arrow button hover states

## Sample Data Structure

```javascript
{
  id: 1,
  title: '3 BHK Flat for rent in Solapur',
  location: 'Biradar Complex, Rupa Bhawani Rd...',
  price: 15000,
  deposit: 20000,
  area: 1500,
  bedrooms: 3,
  bathrooms: 3,
  description: 'Property description...',
  images: ['url1', 'url2', 'url3'],
  owner: 'Owner',
  postedDate: '7 days ago',
  featured: true,
  isNew: true
}
```

## Navigation Flow

1. **Home Page** → Search Bar → Enter location → Press Enter → **Search Page**
2. **Search Page** → Click Property Card → **Property Details Page**
3. **Search Page** → Click Logo → **Home Page**
4. **Search Page** → Click Breadcrumb Home → **Home Page**

## File Structure

```
frontend/src/
├── pages/
│   └── Search.jsx (Main search page)
├── components/
│   ├── SearchBar.jsx (Updated with navigation)
│   └── search/
│       ├── SearchHeader.jsx (Custom header)
│       ├── FilterBar.jsx (Filter dropdowns)
│       ├── PropertyCard.jsx (Property listing card)
│       ├── Breadcrumb.jsx (Navigation breadcrumb)
│       └── SortDropdown.jsx (Sort options)
└── index.css (Updated with utilities)
```

## Routes Added

```javascript
<Route path="/search" element={
  <>
    <Search />
    <Footer />
  </>
} />
```

## Future Enhancements

1. **Backend Integration:**
   - Connect to property API
   - Real-time search
   - Filter persistence
   - Pagination

2. **Advanced Features:**
   - Map view
   - Save favorites
   - Compare properties
   - Virtual tours
   - Share listings

3. **Performance:**
   - Lazy loading images
   - Infinite scroll
   - Search debouncing
   - Cache results

4. **User Experience:**
   - Recently viewed
   - Search history
   - Saved searches
   - Email alerts

## Testing Checklist

- ✅ Search header displays correctly
- ✅ Tags can be added/removed
- ✅ Filter dropdowns work
- ✅ Property cards display properly
- ✅ Image carousel functions
- ✅ Sort dropdown works
- ✅ Breadcrumb navigation works
- ✅ Contact button clickable
- ✅ Responsive on all devices
- ✅ Smooth animations
- ✅ No console errors

## Development Server

```bash
cd frontend
npm run dev
```

Access the search page at: `http://localhost:5174/search`

## Dependencies Used

- React
- React Router DOM
- React Icons
- Tailwind CSS
- GSAP (for animations)

All components are fully functional and ready for backend integration!
