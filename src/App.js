import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Trophy, Sparkles } from 'lucide-react';

// --- ANIMATED COMPONENTS ---

// A button that squishes when you click it
const BouncyButton = ({ children, className, onClick, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/30 transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

// The background shapes that float around
const FloatingBackground = () => (
  <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full opacity-20 ${i % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{ 
          y: [0, -100, 0],
          x: [0, 50, 0],
          rotate: 360,
        }}
        transition={{ 
          duration: 10 + Math.random() * 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          width: `${Math.random() * 200 + 50}px`,
          height: `${Math.random() * 200 + 50}px`,
        }}
      />
    ))}
  </div>
);

// --- MAIN GAME CARD ---
function ProblemCard({ problem, onAnswer, score, streak }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
  }, [problem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer || feedback) return;

    const isCorrect = parseInt(userAnswer) === problem.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Wait 1 second before showing next problem so they see the success animation
      setTimeout(() => {
        onAnswer(isCorrect);
      }, 1200);
    }
  };

  const handleContinue = () => {
    onAnswer(false); // False means "didn't get it right on first try, but moving on"
  };

  const getExplanation = () => {
    let text = "";
    if (problem.operator === '+') text = "Put them together!";
    if (problem.operator === '-') text = "Take away the second number!";
    if (problem.operator === '×') text = "Count the groups!";
    if (problem.operator === '÷') text = "Share equally!";

    return (
       <motion.div 
         initial={{ opacity: 0, height: 0 }}
         animate={{ opacity: 1, height: 'auto' }}
         className="p-4 bg-blue-50 rounded-xl text-left border-2 border-blue-100"
       >
         <div className="flex gap-2 mb-2 text-blue-700 font-bold">
           <Lightbulb className="w-5 h-5" /> Hint:
         </div>
         <p className="text-blue-900">{text}</p>
         <p className="mt-2 font-mono text-lg text-center bg-white p-2 rounded-lg border border-blue-100">
           {problem.num1} {problem.operator} {problem.num2} = <span className="font-bold text-green-600">{problem.answer}</span>
         </p>
       </motion.div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: feedback === 'correct' ? [0, -20, 0] : 0, // Jump when correct
      }}
      // FIX: Am schimbat din 'spring' in 'easeOut' standard pentru a evita eroarea cu 3 keyframes
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center border-4 border-white relative overflow-hidden"
    >
      {/* Success Sparkles */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-green-400/20 z-0" />
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    opacity: 0, 
                    x: (Math.random() - 0.5) * 300, 
                    y: (Math.random() - 0.5) * 300, 
                    scale: 1.5 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute text-4xl"
                >
                  ⭐
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Header: Score & Streak */}
      <div className="flex justify-between items-center mb-8 bg-gray-100 p-2 rounded-2xl">
        <div className="flex items-center gap-2 px-3">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-gray-700">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2 px-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-bold text-gray-700">Streak: {streak}</span>
        </div>
      </div>

      {/* The Math Problem */}
      <div className="relative z-10">
        <motion.div 
          key={problem.id} // Key change triggers animation
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 drop-shadow-sm"
        >
          {problem.num1} {problem.operator} {problem.num2}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <motion.input
              layoutId="inputBox"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              placeholder="?"
              className={`w-full h-24 text-center text-5xl font-bold rounded-2xl border-4 outline-none transition-all ${
                feedback === 'correct' ? 'border-green-400 bg-green-50 text-green-600' :
                feedback === 'incorrect' ? 'border-red-300 bg-red-50' :
                'border-blue-100 focus:border-blue-400 bg-white'
              }`}
              autoFocus
            />
            
            {/* Status Icons */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {feedback === 'correct' ? (
                    <CheckCircle2 className="w-12 h-12 text-green-500 fill-green-100" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500 fill-red-100" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!feedback ? (
              <BouncyButton
                key="check"
                type="submit"
                disabled={!userAnswer}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Check Answer
              </BouncyButton>
            ) : feedback === 'incorrect' ? (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {getExplanation()}
                <BouncyButton
                  type="button"
                  onClick={handleContinue}
                  className="w-full bg-gray-400 hover:bg-gray-500"
                >
                  Next Problem →
                </BouncyButton>
              </motion.div>
            ) : (
              <motion.div key="correct" className="h-14 flex items-center justify-center">
                 <span className="text-2xl font-bold text-green-500 animate-bounce">Awesome! 🎉</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}

// --- ROOT APP COMPONENT ---
export default function App() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState({ id: 0, num1: 2, num2: 2, operator: '+', answer: 4 });

  const r = (max) => Math.floor(Math.random() * max) + 1;

  const generateNewProblem = () => {
    const operators = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2, ans;

    // Math Logic (Kept from previous version)
    switch (operator) {
      case '+':
        n1 = r(20); n2 = r(20); ans = n1 + n2; break;
      case '-':
        n1 = r(20) + 2; n2 = Math.floor(Math.random() * (n1 - 1)) + 1; ans = n1 - n2; break;
      case '×':
        n1 = r(10); n2 = r(10); ans = n1 * n2; break;
      case '÷':
        n2 = r(9) + 1; ans = r(10); n1 = n2 * ans; break;
      default: n1=1; n2=1; ans=2;
    }

    setProblem({
      id: Date.now(),
      num1: n1,
      num2: n2,
      operator,
      answer: ans
    });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(s => s + 10 + (streak * 2)); // Bonus points for streaks
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    generateNewProblem();
  };

  // Initial load
  useEffect(() => {
    generateNewProblem();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 flex items-center justify-center relative font-sans">
      <FloatingBackground />
      <ProblemCard 
        problem={problem} 
        onAnswer={handleAnswer} 
        score={score}
        streak={streak}
      />
    </div>
  );
}
