import React, { useState, useEffect } from 'react';
// If you get an error here, you forgot to install 'framer-motion' in dependencies
import { motion, AnimatePresence } from 'framer-motion';
// If you get an error here, you forgot to install 'lucide-react' in dependencies
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

// --- COMPONENTS ---
const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${className}`} 
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input 
    className={`w-full px-4 py-3 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 ${className}`} 
    {...props} 
  />
);

function ProblemCard({ problem, onAnswer, disabled }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
  }, [problem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer || disabled) return;

    // We use parseInt so "8" matches 8
    const isCorrect = parseInt(userAnswer) === problem.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setTimeout(() => {
        onAnswer(isCorrect);
        setFeedback(null);
      }, 1000);
    }
  };

  const handleContinue = () => {
    onAnswer(false);
    setFeedback(null);
  };

  const getExplanation = () => {
    // Logic to show different hints based on the operator
    let text = "";
    if (problem.operator === '+') text = "Add them together!";
    if (problem.operator === '-') text = "Take the second number away!";
    if (problem.operator === '×') text = "Count the groups!";
    if (problem.operator === '÷') text = "Split into equal groups!";

    return (
       <div className="p-4 bg-blue-50 rounded-lg text-left">
         <p className="font-bold text-blue-800">Hint: {text}</p>
         <p className="mt-1">{problem.num1} {problem.operator} {problem.num2} = {problem.answer}</p>
       </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 mx-auto mt-10">
      
      <div className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        {problem.num1} {problem.operator} {problem.num2}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={disabled || feedback !== null}
            placeholder="?"
            className="text-center text-3xl font-bold border-blue-200"
            autoFocus
          />
        </div>

        <Button
          type="submit"
          disabled={!userAnswer || disabled || feedback !== null}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Check Answer
        </Button>
      </form>

      {feedback === 'incorrect' && (
        <div className="mt-6">
          <p className="text-red-500 font-bold mb-2">Not quite!</p>
          {getExplanation()}
          <Button
            onClick={handleContinue}
            className="w-full mt-4 bg-green-500 hover:bg-green-600"
          >
            Next Problem
          </Button>
        </div>
      )}
       {feedback === 'correct' && (
        <div className="mt-6">
          <p className="text-green-500 font-bold text-2xl animate-bounce">Correct! 🎉</p>
        </div>
      )}
    </div>
  );
}

// --- MAIN APP LOGIC ---
export default function App() {
  const [problem, setProblem] = useState({
    id: 1,
    num1: 5,
    num2: 3,
    operator: '+',
    answer: 8
  });

  const generateNewProblem = () => {
    // 1. Pick a random operator
    const operators = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let n1, n2, ans;

    // 2. Create numbers based on the operator so they are easy to solve
    switch (operator) {
      case '+':
        n1 = Math.floor(Math.random() * 20) + 1;
        n2 = Math.floor(Math.random() * 20) + 1;
        ans = n1 + n2;
        break;
      case '-':
        n1 = Math.floor(Math.random() * 20) + 2; // Ensure bigger than 1
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // Ensure result is positive
        ans = n1 - n2;
        break;
      case '×':
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        ans = n1 * n2;
        break;
      case '÷':
        // For division, we create the answer first, then multiply to get the big number
        // This ensures the division is always clean (no decimals)
        n2 = Math.floor(Math.random() * 9) + 2; // Divide by 2-10
        ans = Math.floor(Math.random() * 10) + 1; // Answer is 1-10
        n1 = n2 * ans; 
        break;
      default:
        n1 = 1; n2 = 1; ans = 2;
    }

    setProblem({
      id: Date.now(),
      num1: n1,
      num2: n2,
      operator: operator,
      answer: ans
    });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      generateNewProblem();
    }
  };

  // Generate a random problem when the app first loads
  useEffect(() => {
    generateNewProblem();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ProblemCard problem={problem} onAnswer={handleAnswer} disabled={false} />
    </div>
  );
}