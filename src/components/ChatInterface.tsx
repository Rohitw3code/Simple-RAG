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
    <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 p-3 md:p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <button
              onClick={onBackToLanding}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
              <Logo className="h-6 md:h-8 text-gray-900 flex-shrink-0" />
            </div>
          </div>
          
          {uploadedFile && (
            <div className={`flex items-center space-x-2 rounded-lg px-2 md:px-3 py-2 border max-w-xs md:max-w-sm ${
              uploadStatus === 'success' ? 'bg-green-50 border-green-200' :
              uploadStatus === 'error' ? 'bg-red-50 border-red-200' :
              uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              {getStatusIcon()}
              <span className="text-xs md:text-sm text-gray-700 truncate">{uploadedFile.name}</span>
              <button
                onClick={removeUploadedFile}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-3 mx-3 md:mx-4 mt-2 md:mt-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm md:text-base flex-1 min-w-0">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="ml-auto text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
        <div className="h-full">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 md:p-12 border border-gray-200 shadow-sm max-w-2xl w-full">
                <Bot className="h-12 md:h-16 w-12 md:w-16 text-green-600 mx-auto mb-4 md:mb-6" />
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center text-gray-900">Welcome to AI PDF Chat!</h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-center text-sm md:text-base">
                  Upload a PDF document to start an intelligent conversation powered by OpenAI.
                </p>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-6 md:p-8 transition-all duration-300 cursor-pointer ${
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
                    <Loader className="h-10 md:h-12 w-10 md:w-12 text-green-600 mx-auto mb-3 md:mb-4 animate-spin" />
                  ) : (
                    <Upload className="h-10 md:h-12 w-10 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  )}
                  <p className="text-base md:text-lg font-semibold mb-2 text-center text-gray-900">
                    {isUploading ? 'Processing PDF...' : 'Drop your PDF here'}
                  </p>
                  <p className="text-gray-500 text-center text-sm md:text-base">
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
            <div className="p-3 md:p-4">
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-green-600' 
                          : 'bg-gray-100 border border-gray-200'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                        ) : (
                          <Bot className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl p-3 md:p-4 ${
                        message.sender === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-gray-200 shadow-sm'
                      }`}>
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
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
                    <div className="flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-2xl">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                        <Bot className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      </div>
                      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-3 md:p-4">
                        <div className="flex items-center space-x-2">
                          <Loader className="h-4 w-4 animate-spin text-green-600" />
                          <span className="text-gray-600 text-sm md:text-base">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3 md:p-4 safe-area-inset-bottom">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2 md:space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
              title="Upload PDF"
              disabled={isUploading}
            >
              <Paperclip className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={documentId ? "Ask me anything about your document..." : "Upload a PDF first to start chatting..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors placeholder-gray-500 text-sm md:text-base resize-none min-h-[44px] max-h-32"
                disabled={!documentId || isSending}
                rows={1}
                style={{ 
                  height: 'auto',
                  minHeight: '44px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !documentId || isSending}
                className="absolute right-2 bottom-2 p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader className="h-3 w-3 md:h-4 md:w-4 animate-spin text-white" />
                ) : (
                  <Send className="h-3 w-3 md:h-4 md:w-4 text-white" />
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