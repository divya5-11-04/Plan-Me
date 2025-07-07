const motivationalQuotes = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Whether you think you can or you think you can't, you're right. - Henry Ford",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson"
];

export const getRandomQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};