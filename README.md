# AI PDF Chat Frontend

A modern, responsive React application for intelligent PDF document conversations powered by AI. Upload PDF documents and have natural conversations about their content using advanced language models.

## 🌟 Features

- **📄 PDF Upload & Processing**: Drag-and-drop or click to upload PDF documents
- **🤖 AI-Powered Chat**: Natural language conversations about document content
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **⚡ Real-time Responses**: Instant AI responses with typing indicators
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations
- **🔒 Secure Processing**: Enterprise-grade document processing and privacy
- **💬 Chat History**: Persistent conversation history per document
- **📊 Document Management**: Upload, view, and delete documents

## 🚀 Live Demo

**Frontend**: [https://pdf-chat-frontend.netlify.app](https://pdf-chat-frontend.netlify.app)

**Backend API**: [https://planetai-dfemcqakf3afhkc8.canadacentral-01.azurewebsites.net](https://planetai-dfemcqakf3afhkc8.canadacentral-01.azurewebsites.net)

## 🔗 Related Repositories

**Backend Repository**: [Simple-RAG-backend](https://github.com/Rohitw3code/Simple-RAG-backend)
- Flask-based REST API
- LangChain integration for document processing
- OpenAI embeddings and Groq chat models
- Deployed on Microsoft Azure

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Backend**: Flask API (deployed on Azure)

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-pdf-chat-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

The application is pre-configured to use the deployed backend API. No additional environment setup is required for basic usage.

If you want to use a local backend, update the API URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000'; // For local development
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ChatInterface.tsx # Main chat interface
│   ├── LandingPage.tsx   # Landing page component
│   └── Logo.tsx          # Logo component
├── services/             # API services
│   └── api.ts           # API client and types
├── App.tsx              # Main app component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎯 Key Components

### ChatInterface
- **Responsive Design**: Adapts to mobile, tablet, and desktop screens
- **File Upload**: Drag-and-drop and click-to-upload functionality
- **Real-time Chat**: Instant messaging with AI responses
- **Message History**: Scrollable chat history with timestamps
- **Status Indicators**: Upload progress and message status

### LandingPage
- **Hero Section**: Compelling introduction with call-to-action
- **Features Showcase**: Highlight key application capabilities
- **Statistics**: User engagement and performance metrics
- **Responsive Layout**: Mobile-first design approach

### API Service
- **Type Safety**: Full TypeScript integration
- **Error Handling**: Comprehensive error management
- **Response Types**: Strongly typed API responses
- **HTTP Client**: Fetch-based API communication

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices:

- **Adaptive Layout**: Flexible grid and flexbox layouts
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Responsive Typography**: Scalable text sizes across devices
- **Mobile Navigation**: Optimized header and navigation
- **Safe Areas**: Support for device safe areas and notches

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run build && npm run preview  # Build and preview locally
```

## 🌐 API Integration

The frontend communicates with a Flask-based backend API that provides:

### Endpoints Used
- `POST /upload` - Upload PDF documents
- `POST /chat/{document_id}` - Send chat messages
- `GET /chat/{document_id}/history` - Retrieve chat history
- `GET /documents` - List uploaded documents
- `DELETE /documents/{document_id}` - Delete documents
- `GET /health` - API health check

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## 🎨 Design System

### Colors
- **Primary**: Green (#16a34a) - Actions and highlights
- **Secondary**: Gray (#6b7280) - Text and borders
- **Success**: Green (#10b981) - Success states
- **Error**: Red (#ef4444) - Error states
- **Background**: White/Gray (#f9fafb) - Page backgrounds

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body Text**: Readable, accessible contrast
- **Code**: Monospace for technical content

### Spacing
- **8px Grid System**: Consistent spacing throughout
- **Responsive Breakpoints**: Mobile-first approach
- **Safe Areas**: Mobile device compatibility

## 🔒 Security & Privacy

- **Client-Side Only**: No sensitive data stored locally
- **HTTPS Communication**: Secure API communication
- **File Validation**: PDF-only upload restrictions
- **Error Handling**: Graceful error management
- **No Persistence**: Documents processed server-side only

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on push to main branch

### Manual Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'your-api-endpoint-here';
```

### Build Configuration
Modify `vite.config.ts` for custom build settings:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-base-path/', // For subdirectory deployment
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the backend API is running and accessible
   - Check CORS configuration on the backend
   - Ensure API URL is correct in `api.ts`

2. **File Upload Issues**
   - Confirm file is a valid PDF
   - Check file size limits (16MB max)
   - Verify backend upload endpoint is working

3. **Mobile Display Issues**
   - Clear browser cache
   - Check viewport meta tag in `index.html`
   - Test on different mobile browsers

4. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Update dependencies: `npm update`
   - Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models and embeddings
- **Groq** for fast inference capabilities
- **LangChain** for document processing framework
- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [backend repository](https://github.com/Rohitw3code/Simple-RAG-backend) for API-related issues
- Review the troubleshooting section above

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**