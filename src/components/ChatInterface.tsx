import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  FileText, 
  X, 
  User, 
  Bot,
  Paperclip,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { apiService } from '../services/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBackToLanding: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBackToLanding }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !documentId || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await apiService.sendMessage(documentId, inputValue);
      
      if (response.success && response.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          sender: 'ai',
          timestamp: new Date(response.data.timestamp)
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${response.error || 'Failed to get response'}`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Error: Failed to send message. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file only.');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setErrorMessage('');
    setUploadedFile(file);

    try {
      const response = await apiService.uploadDocument(file);
      
      if (response.success && response.data) {
        setDocumentId(response.data.document_id);
        setUploadStatus('success');
        
        const uploadMessage: Message = {
          id: Date.now().toString(),
          content: `Successfully uploaded: ${file.name}`,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages([uploadMessage]);

        // Add AI welcome message
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Great! I've successfully processed "${file.name}" and created ${response.data!.chunk_count} text chunks for analysis. The document is now ready for questions. What would you like to know about it?`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }, 1000);
      } else {
        setUploadStatus('error');
        setErrorMessage(response.error || 'Upload failed');
        setUploadedFile(null);
      }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Upload failed. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setDocumentId(null);
    setMessages([]);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToLanding}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-semibold">AI PDF Chat</span>
            </div>
          </div>
          
          {uploadedFile && (
            <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
              uploadStatus === 'success' ? 'bg-green-500/20' :
              uploadStatus === 'error' ? 'bg-red-500/20' :
              uploadStatus === 'uploading' ? 'bg-blue-500/20' :
              'bg-white/10'
            }`}>
              {getStatusIcon()}
              <span className="text-sm">{uploadedFile.name}</span>
              <button
                onClick={removeUploadedFile}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 mx-4 mt-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                <Bot className="h-16 w-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Welcome to AI PDF Chat!</h2>
                <p className="text-gray-300 mb-8">
                  Upload a PDF document to start an intelligent conversation powered by OpenAI.
                </p>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-purple-400 bg-purple-400/10' 
                      : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-lg font-semibold mb-2">
                    {isUploading ? 'Processing PDF...' : 'Drop your PDF here'}
                  </p>
                  <p className="text-gray-400">
                    {isUploading ? 'Please wait while we analyze your document' : 'or click to browse files'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-blue-500 to-teal-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Upload PDF"
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={documentId ? "Ask me anything about your document..." : "Upload a PDF first to start chatting..."}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-400 transition-colors placeholder-gray-400"
                disabled={!documentId || isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !documentId || isSending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;