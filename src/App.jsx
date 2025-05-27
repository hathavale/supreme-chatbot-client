import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize with a welcome message from the bot
  useEffect(() => {
    const welcomeMessage = {
      text: "Hello! I'm Supreme Chatbot, here to listen and support you. Feel free to share what's on your mind, or try a calming exercise by clicking the button above.",
      isBot: true,
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userId = 'user123'; // Replace with proper user auth later
    const userMessage = { text: input, isBot: false };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: input }),
      });
      if (!res.ok) throw new Error('Failed to connect to the server');
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.message, isBot: true }]);
    } catch (err) {
      setError('Sorry, something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger a grounding exercise
  const triggerGroundingExercise = () => {
    const groundingMessage = {
      text: "Let’s try a quick breathing exercise: Inhale for 4 seconds, hold for 4, exhale for 4. Want to do it again? Just click the button!",
      isBot: true,
    };
    setMessages(prev => [...prev, groundingMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 text-center shadow-md">
        <h1 className="text-2xl font-semibold">Supreme Chatbot</h1>
        <p className="text-sm mt-1">
          A supportive space for you. Not a substitute for professional help.{' '}
          <a
            href="tel:988"
            className="underline hover:text-yellow-200"
            aria-label="Call crisis hotline"
          >
            Call 988 for emergencies
          </a>.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-xl max-w-md shadow-sm ${
              msg.isBot
                ? 'bg-teal-100 ml-auto text-teal-900'
                : 'bg-white mr-auto text-gray-900'
            }`}
            role="log"
            aria-live="polite"
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-center">Typing...</div>
        )}
        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and Controls */}
      <div className="p-4 bg-white border-t shadow-inner">
        <div className="flex flex-col space-y-2">
          <button
            onClick={triggerGroundingExercise}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            aria-label="Start a grounding exercise"
          >
            Try a Calming Exercise
          </button>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Type your message..."
              aria-label="Chat input"
            />
            <button
              onClick={sendMessage}
              className="bg-teal-600 text-white p-2 rounded-r-lg hover:bg-teal-700 disabled:bg-gray-400"
              disabled={isLoading}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;