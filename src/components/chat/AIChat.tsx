import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Maximize2, Minimize2, FileText, Brain, ClipboardCheck } from 'lucide-react';
import { useAIChatStore } from '../../store/useAIChatStore';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'protocol' | 'validation'>('chat');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useAIChatStore();

  const tabs = [
    { id: 'chat', label: 'General Assistant', icon: Brain },
    { id: 'protocol', label: 'Protocol Review', icon: FileText },
    { id: 'validation', label: 'Data Validation', icon: ClipboardCheck },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'flex' : ''}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span>AI Assistant</span>
        </button>
      ) : (
        <div
          className={`bg-white rounded-lg shadow-xl flex flex-col ${
            isExpanded ? 'fixed top-4 right-4 left-4 bottom-4' : 'w-96 h-[600px]'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-indigo-700">
                      Hi! I'm your AI research assistant. I can help you with:
                      <ul className="mt-2 list-disc list-inside">
                        <li>Study setup and design</li>
                        <li>Protocol review and optimization</li>
                        <li>Data validation rules</li>
                        <li>Regulatory compliance checks</li>
                      </ul>
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-50 ml-8'
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <p className="text-sm">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-gray-50 p-4 rounded-lg mr-8">
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {activeTab === 'protocol' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    Upload your protocol document for AI-powered analysis:
                    <ul className="mt-2 list-disc list-inside">
                      <li>Inclusion/exclusion criteria extraction</li>
                      <li>Visit schedule optimization</li>
                      <li>Endpoint validation</li>
                      <li>Protocol deviation risk analysis</li>
                    </ul>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'validation' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    AI-powered data validation assistant:
                    <ul className="mt-2 list-disc list-inside">
                      <li>Custom validation rule generation</li>
                      <li>Data quality metrics</li>
                      <li>Cross-form validation checks</li>
                      <li>Edit check suggestions</li>
                    </ul>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`px-4 py-2 rounded-lg ${
                  isLoading || !inputValue.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}