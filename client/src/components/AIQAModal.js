import React, { useState } from 'react';
import { X, Send, Sparkles, Loader, AlertCircle } from 'lucide-react';
import { aiAPI } from '../api/ai.api';
import './AIQAModal.css';

/**
 * AIQAModal Component
 *
 * Props:
 * - projectId: String - Project ID for context
 * - projectName: String - Project name for display
 * - onClose: Function() - Close modal handler
 */
const AIQAModal = ({ projectId, projectName, onClose }) => {
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || isLoading) {
      return;
    }

    const currentQuestion = question.trim();
    setQuestion('');
    setError(null);
    setIsLoading(true);

    // Add user question to conversation
    const userMessage = {
      type: 'question',
      content: currentQuestion,
      timestamp: new Date()
    };
    setConversations(prev => [...prev, userMessage]);

    try {
      const response = await aiAPI.askQuestion(currentQuestion, projectId);

      // Add AI answer to conversation
      // Backend returns: { success, message, data: { answer, relatedTasks } }
      const aiMessage = {
        type: 'answer',
        content: response.data.answer,
        relatedTasks: response.data.relatedTasks || [],
        timestamp: new Date()
      };
      setConversations(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error asking AI question:', err);
      setError(err.response?.data?.message || 'Failed to get answer. Please try again.');

      // Remove the question if there was an error
      setConversations(prev => prev.filter(msg => msg !== userMessage));
      setQuestion(currentQuestion); // Restore the question
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setConversations([]);
      setError(null);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-qa-title"
    >
      <div className="modal-content ai-qa-modal">
        <div className="modal-header">
          <div className="header-content">
            <Sparkles size={24} className="ai-icon" />
            <div>
              <h2 id="ai-qa-title">AI Assistant</h2>
              <p className="project-name-subtitle">{projectName}</p>
            </div>
          </div>
          <div className="header-actions">
            {conversations.length > 0 && (
              <button
                className="btn-clear-chat"
                onClick={handleClearChat}
                aria-label="Clear conversation"
              >
                Clear
              </button>
            )}
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body qa-body">
          {conversations.length === 0 && !isLoading && (
            <div className="empty-state">
              <Sparkles size={48} className="empty-icon" />
              <h3>Ask me anything about this project</h3>
              <p>I can help you with task summaries, priorities, deadlines, and more.</p>
              <div className="suggestion-chips">
                <button
                  className="suggestion-chip"
                  onClick={() => setQuestion('What tasks are overdue?')}
                >
                  What tasks are overdue?
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => setQuestion('Show me high priority tasks')}
                >
                  Show me high priority tasks
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => setQuestion('What is the project progress?')}
                >
                  What is the project progress?
                </button>
              </div>
            </div>
          )}

          <div className="conversation-list">
            {conversations.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type === 'question' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  {message.type === 'answer' && (
                    <Sparkles size={16} className="message-icon" />
                  )}
                  <div className="message-text">
                    {message.content}
                  </div>
                </div>

                {message.relatedTasks && message.relatedTasks.length > 0 && (
                  <div className="related-tasks">
                    <h4 className="related-title">Related Tasks:</h4>
                    {message.relatedTasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="related-task">
                        <div className="task-title">{task.title}</div>
                        {task.status && (
                          <span className={`task-status status-${task.status}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message ai-message loading-message">
                <div className="message-content">
                  <Loader size={16} className="message-icon spinner" />
                  <div className="message-text">Thinking...</div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer qa-footer">
          <form onSubmit={handleSubmit} className="qa-form">
            <input
              type="text"
              className="qa-input"
              placeholder="Ask a question about this project..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              maxLength={500}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-send"
              disabled={!question.trim() || isLoading}
              aria-label="Send question"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIQAModal;
