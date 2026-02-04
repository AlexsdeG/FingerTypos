
export const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    "house", "world", "school", "still", "try", "hand", "small", "large", "part", "place", "again", "case", "week", "company", "system", "program", "question", "number", "night", "point"
];

export const COMPLEX_WORDS = [
    "algorithm", "bandwidth", "cybersecurity", "database", "encryption", "firewall", "gigabyte", "hardware", "interface", "javascript",
    "keyboard", "latency", "motherboard", "network", "operating", "protocol", "quantum", "resolution", "software", "technology",
    "absolute", "boundary", "character", "dialogue", "element", "fraction", "gradient", "horizon", "infinite", "junction",
    "kinetic", "luminosity", "molecule", "nebula", "optical", "particle", "quality", "resonance", "spectrum", "trajectory",
    "universe", "velocity", "wavelength", "xenon", "yield", "zenith", "aerospace", "blueprint", "circuit", "dynamic",
    "equation", "frequency", "geometry", "hypothesis", "inertial", "jupiter", "kilowatt", "logistics", "magnetic", "nuclear",
    "optimization", "processor", "quasar", "radiation", "satellite", "telemetry", "ultraviolet", "vector", "wireless", "xylophone"
];

export const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "Technology is best when it brings people together.",
    "The art of programming is the art of organizing complexity.",
    "Simplicity is the soul of efficiency.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step.",
    "Success is not final, failure is not fatal.",
    "In the middle of difficulty lies opportunity.",
    "Knowledge is power, but enthusiasm pulls the switch.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    "Life is what happens when you are busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "First, solve the problem. Then, write the code.",
    "Experience is the name everyone gives to their mistakes."
];

export const CODE_SNIPPETS = [
    "const [state, setState] = useState(null);",
    "import React, { useEffect } from 'react';",
    "function calculate(a, b) { return a + b; }",
    "if (isActive && !isPaused) { return; }",
    "const result = array.filter(i => i > 0);",
    "export default function App() { return <div />; }",
    "console.log('Hello World');",
    "document.getElementById('root');",
    "const styles = { display: 'flex' };",
    "return new Promise((resolve, reject) => {});",
    "class User extends Person { constructor() {} }",
    "const { id, name } = props.user;",
    "array.reduce((acc, curr) => acc + curr, 0);",
    "try { await api.fetchData(); } catch (e) {}",
    "window.addEventListener('keydown', handleKey);",
    "import { cn } from '@/lib/utils';",
    "interface Props { children: React.ReactNode; }",
    "const toggle = () => setIsOpen(!isOpen);",
    "return Math.floor(Math.random() * 100);",
    "JSON.stringify(data, null, 2);"
];

export const NAMES = [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", 
    "Ivan", "Judy", "Mallory", "Oscar", "Peggy", "Sybil", "Trent", "Walter",
    "Ada", "Elon", "Linus", "Steve", "Bill", "Mark"
];

export const ELITE_PATTERNS = [
    "45%", "$100", "24/7", "#1", "100kg", "360°", "10px", "0.5", "1/2", 
    "h4x0r", "n00b", "<br/>", "id=\"1\"", "w@rh34d", "die 4 you", 
    "2 + 2 = 4", "100%", "high-voltage", "O(n^2)", "C++", "C#", 
    "user_id", "admin@root"
];
