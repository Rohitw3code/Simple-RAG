import React from 'react';
import { 
  FileText, 
  MessageCircle, 
  Zap, 
  Shield, 
  Upload, 
  Brain,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DocuChat
            </span>
          </div>
          <button
            onClick={onStartChat}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">AI-Powered Document Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Chat with Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}PDFs
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload any PDF document and have intelligent conversations about its content. 
            Get instant answers, summaries, and insights powered by advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartChat}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2"
            >
              <span>Start Chatting</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="border border-white/30 hover:border-white/60 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
              icon: Brain,
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
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Document Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already chatting with their PDFs and unlocking insights faster than ever.
          </p>
          <button
            onClick={onStartChat}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/20">
        <div className="text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DocuChat
            </span>
          </div>
          <p>&copy; 2025 DocuChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;