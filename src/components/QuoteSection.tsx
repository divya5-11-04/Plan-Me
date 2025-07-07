import { useState, useEffect } from 'react';
import { getRandomQuote } from '@/lib/quotes';

export const QuoteSection = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="text-center mb-8">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-gentle transition-smooth hover:shadow-focus">
        <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
          "{quote}"
        </p>
      </div>
    </div>
  );
};