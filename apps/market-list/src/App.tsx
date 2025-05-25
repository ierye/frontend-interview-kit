import { TradingPairList } from './components/TradingPairList';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-900 font-sans antialiased animate-fadeInUp">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 py-8 text-center animate-fadeInUp">
          <div className="max-w-6xl mx-auto px-8 md:px-4">
            <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-4 md:flex-col md:gap-2 drop-shadow-lg">
              <span className="text-6xl md:text-5xl sm:text-4xl drop-shadow-lg">📈</span>
              FIX 交易对行情系统
            </h1>
          </div>
        </header>
        
        <main className="flex-1 py-8 md:py-4 animate-fadeInUp-delay-100">
          <TradingPairList />
        </main>
      </div>
  );
}

export default App
