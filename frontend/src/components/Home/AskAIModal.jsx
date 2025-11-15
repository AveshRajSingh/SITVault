import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaSpinner, FaMagic, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { renderSafeMarkdown } from '../../utils/sanitize';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';
import './ai-modal.css';

const AskAIModal = ({ isOpen, onClose, post }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const questionInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      // Add initial AI greeting
      if (conversation.length === 0) {
        setConversation([
          {
            role: 'ai',
            content: `Hi! 👋 I'm here to help you understand this post better. Ask me anything about:\n- The main topic\n- Specific details\n- Related concepts\n- Clarifications\n\nWhat would you like to know?`,
            timestamp: new Date()
          }
        ]);
      }
      // Focus on input
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    } else {
      unlockBodyScroll();
      // Reset conversation when modal closes
      setConversation([]);
      setQuestion('');
    }
    return () => unlockBodyScroll();
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleAskAI = async () => {
    if (!question.trim()) {
      toast.warning('Please enter a question');
      return;
    }

    const userQuestion = question.trim();
    
    // Add user's question to conversation
    const userMessage = {
      role: 'user',
      content: userQuestion,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are a helpful AI assistant for a student community platform called SITVault.

Context - Original Post:
"""
${post.content}
"""

Post Tag: ${post.tag}
Posted by: ${post.author?.name || 'Anonymous'}

Student's Question:
"""
${userQuestion}
"""

Please provide a helpful, clear, and concise answer to the student's question about this post.
- Be friendly and supportive
- Focus on the specific question asked
- Reference the post content when relevant
- If the question is unclear, ask for clarification
- Keep responses concise but informative
- Use markdown formatting for better readability

Your response:
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Add AI's response to conversation
      const aiMessage = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error asking AI:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add error message to conversation
      const errorMessage = {
        role: 'ai',
        content: '❌ Sorry, I encountered an error processing your question. Please try again or rephrase your question.',
        timestamp: new Date(),
        isError: true
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  const quickQuestions = [
    "What is the main topic?",
    "Can you explain this in simpler terms?",
    "What are the key points?",
    "Are there any examples?",
  ];

  const handleQuickQuestion = (q) => {
    setQuestion(q);
    questionInputRef.current?.focus();
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-500 rounded-lg">
              <FaRobot className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Ask AI About This Post</h3>
              <p className="text-xs text-gray-600">Get instant answers to your questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Post Preview */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-orange-600 uppercase">{post.tag}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600">by {post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="mt-1 text-sm text-gray-700 line-clamp-2">
            {post.content.substring(0, 150)}...
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-2xl rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-2xl rounded-tl-sm'
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                } px-4 py-3`}
              >
                {msg.role === 'ai' ? (
                  <div
                    className="markdown-body-ai text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(msg.content) }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
                <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-orange-600" size={14} />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions */}
        {conversation.length <= 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-3 py-1.5 bg-white border border-orange-200 text-orange-700 rounded-full hover:bg-orange-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={questionInputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about this post... (Press Enter to send)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none outline-none text-sm"
                rows="2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleAskAI}
              disabled={!question.trim() || isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaPaperPlane size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAIModal;
