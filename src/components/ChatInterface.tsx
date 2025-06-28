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
import Logo from './Logo';

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
        return <Loader className="h-4 w-4 text-green-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToLanding}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <Logo className="h-8 text-gray-900" />
            </div>
          </div>
          
          {uploadedFile && (
            <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 border ${
              uploadStatus === 'success' ? 'bg-green-50 border-green-200' :
              uploadStatus === 'error' ? 'bg-red-50 border-red-200' :
              uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              {getStatusIcon()}
              <span className="text-sm text-gray-700">{uploadedFile.name}</span>
              <button
                onClick={removeUploadedFile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl h-full">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm max-w-2xl w-full">
                <Bot className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Welcome to AI PDF Chat!</h2>
                <p className="text-gray-600 mb-8 text-center">
                  Upload a PDF document to start an intelligent conversation powered by OpenAI.
                </p>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-lg font-semibold mb-2 text-center text-gray-900">
                    {isUploading ? 'Processing PDF...' : 'Drop your PDF here'}
                  </p>
                  <p className="text-gray-500 text-center">
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
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-green-600' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin text-green-600" />
                        <span className="text-gray-600">Thinking...</span>
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

      {/* Fixed Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
              title="Upload PDF"
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={documentId ? "Ask me anything about your document..." : "Upload a PDF first to start chatting..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors placeholder-gray-500"
                disabled={!documentId || isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !documentId || isSending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
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