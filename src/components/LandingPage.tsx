import React from 'react';
import { 
  FileText, 
  MessageCircle, 
  Zap, 
  Shield, 
  Upload, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onStartChat: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo className="h-10 text-gray-900" />
          </div>
          <button
            onClick={onStartChat}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            Try Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">AI-Powered Document Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Chat with Your
            <span className="text-green-600">
              {" "}PDFs
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload any PDF document and have intelligent conversations about its content. 
            Get instant answers, summaries, and insights powered by advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartChat}
              className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2"
            >
              <span>Start Chatting</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="border-2 border-gray-300 hover:border-green-600 hover:text-green-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-green-50">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to interact with your documents intelligently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: "Easy Upload",
              description: "Simply drag and drop your PDF files or click to browse. Support for multiple formats and sizes."
            },
            {
              icon: MessageCircle,
              title: "Natural Conversations",
              description: "Ask questions in plain English and get detailed, contextual answers from your documents."
            },
            {
              icon: Zap,
              title: "Instant Results",
              description: "Get immediate responses powered by cutting-edge AI technology. No waiting, just answers."
            },
            {
              icon: CheckCircle,
              title: "Smart Analysis",
              description: "Advanced understanding of document structure, context, and meaning for accurate responses."
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your documents are processed securely with enterprise-grade privacy protection."
            },
            {
              icon: FileText,
              title: "Document Memory",
              description: "AI remembers the entire document context throughout your conversation session."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 group"
            >
              <div className="bg-green-100 group-hover:bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: Users,
              number: "10,000+",
              label: "Active Users"
            },
            {
              icon: FileText,
              number: "50,000+",
              label: "Documents Processed"
            },
            {
              icon: Clock,
              number: "99.9%",
              label: "Uptime"
            }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-green-100 group-hover:bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <stat.icon className="h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-green-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Document Experience?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already chatting with their PDFs and unlocking insights faster than ever.
          </p>
          <button
            onClick={onStartChat}
            className="bg-white text-green-600 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Logo className="h-8 text-gray-400" />
          </div>
          <p>&copy; 2025 Planerly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;