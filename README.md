# Excel Data Analysis Platform

A modern, responsive web application for uploading Excel files and generating interactive charts and data visualizations. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 📊 Data Analysis
- **Excel File Upload** - Support for .xlsx and .xls files up to 10MB
- **Data Preview** - Interactive table with search, sort, and filtering
- **Chart Generation** - Multiple chart types (Bar, Line, Scatter, Pie, 3D)
- **Real-time Processing** - Fast file processing with progress indicators

### 🎨 User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Modern UI** - Clean, professional interface with smooth animations
- **Accessibility** - Keyboard navigation and screen reader support
- **Error Handling** - Comprehensive error boundaries and user feedback

### ⚡ Performance
- **Lazy Loading** - Chart components loaded on demand
- **Memoization** - Optimized re-renders with React.memo
- **Code Splitting** - Reduced initial bundle size
- **Progressive Enhancement** - Works without JavaScript

### 🔧 Technical Features
- **TypeScript** - Full type safety and IntelliSense
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - User feedback system
- **File Validation** - Type and size checking
- **Data Validation** - Input sanitization and error handling

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd excel-loom-ai-main
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**
Navigate to [http://localhost:5173](http://localhost:5173)

## 📱 Usage

### Upload Excel File
1. Drag and drop an Excel file onto the upload area
2. Or click to select a file from your device
3. Wait for processing (progress bar shows status)
4. View your data in the interactive preview

### Analyze Data
1. **Search** - Use the search box to filter rows
2. **Sort** - Click column headers to sort data
3. **View** - Toggle between preview and full data view
4. **Export** - Download processed data (coming soon)

### Generate Charts
1. **Select Axes** - Choose X and Y axis columns
2. **Pick Chart Type** - Bar, Line, Scatter, Pie, or 3D charts
3. **Customize** - Adjust colors and settings
4. **Download** - Save charts as PNG images

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run build:dev` - Build in development mode

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── FileUpload.tsx  # File upload component
│   ├── DataPreview.tsx # Data table component
│   ├── ChartGenerator.tsx # Chart creation
│   └── ErrorBoundary.tsx # Error handling
├── pages/              # Page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── styles/            # Global styles
└── main.tsx          # Application entry point
```

## 🎨 Design System

### Colors
- **Primary**: Professional blue (#3B82F6)
- **Secondary**: Subtle purple (#8B5CF6)
- **Accent**: Success green (#22C55E)
- **Destructive**: Error red (#EF4444)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Responsive**: Fluid typography scaling

### Components
- **Cards**: Subtle shadows with hover effects
- **Buttons**: Multiple variants with smooth transitions
- **Forms**: Accessible inputs with validation
- **Tables**: Sortable columns with keyboard navigation

## 🔧 Technologies Used

### Core
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library
- **Lucide React** - Beautiful icon library

### Data & Charts
- **XLSX** - Excel file processing
- **Plotly.js** - Interactive charting library
- **React Plotly** - React wrapper for Plotly

### Development
- **ESLint** - Code linting and formatting
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

## 🚀 Performance Optimizations

### Bundle Size
- **Code Splitting** - Lazy-loaded chart components
- **Tree Shaking** - Unused code elimination
- **Dynamic Imports** - On-demand module loading

### Runtime Performance
- **React.memo** - Prevent unnecessary re-renders
- **useMemo** - Expensive calculation caching
- **useCallback** - Function reference stability

### User Experience
- **Skeleton Loading** - Perceived performance
- **Progressive Enhancement** - Works without JavaScript
- **Error Boundaries** - Graceful error handling

## 🔒 Security Features

- **File Validation** - Type and size checking
- **Input Sanitization** - XSS prevention
- **Error Boundaries** - Information disclosure prevention
- **CSP Headers** - Content Security Policy (production)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch Gestures** - Swipe and tap interactions
- **Responsive Tables** - Horizontal scrolling
- **Collapsible UI** - Space-efficient layouts

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and roles
- **Color Contrast** - Sufficient contrast ratios
- **Focus Management** - Visible focus indicators

### Features
- **Skip Links** - Quick navigation
- **Alt Text** - Descriptive image alternatives
- **Semantic HTML** - Proper heading structure
- **Form Labels** - Associated form controls

## 🐛 Error Handling

### Error Boundaries
- **Component Level** - Isolated error handling
- **Global Level** - Application-wide error catching
- **User Feedback** - Clear error messages

### Validation
- **File Types** - Excel file validation
- **File Size** - 10MB limit enforcement
- **Data Integrity** - Row and column validation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_APP_TITLE=Excel Data Analysis Platform
VITE_APP_VERSION=1.0.0
```

### Hosting Options
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable hosting

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- **TypeScript** - Use strict type checking
- **ESLint** - Follow code style guidelines
- **Testing** - Add tests for new features
- **Documentation** - Update README for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Plotly.js** - Interactive charting library
- **React Team** - Amazing UI library
- **Vite Team** - Fast build tool

## 📞 Support

For support, email support@example.com or create an issue on GitHub.

---

**Built with ❤️ using modern web technologies**