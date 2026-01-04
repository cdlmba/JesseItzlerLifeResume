import { PrepItem } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface YearPrepProps {
  checklist: PrepItem[];
  onToggle: (id: string) => void;
}

const YearPrep: React.FC<YearPrepProps> = ({ checklist, onToggle }) => {
  const completedCount = checklist.filter(i => i.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24 px-4">
      <header className="text-center space-y-4">
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">SYSTEMS CHECK</h2>
        <p className="text-neutral-500 font-black text-[10px] tracking-[0.3em] uppercase">Prepare the environment for peak performance</p>
      </header>

      <div className="bg-neutral-900 p-8 md:p-12 rounded-[2.5rem] border border-white/5 space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Readiness Level</span>
          <span className="text-4xl font-black text-white italic">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-black h-4 rounded-full overflow-hidden p-1 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="h-full bg-red-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {checklist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onToggle(item.id)}
            className={`group relative flex items-center gap-8 p-8 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden ${item.completed
                ? 'bg-neutral-900/50 border-red-600/20 opacity-60'
                : 'bg-black border-white/5 hover:border-white/10'
              }`}
          >
            {/* Animated Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />

            {/* Custom Animated Checkbox */}
            <div className="relative flex-shrink-0 w-12 h-12">
              <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${item.completed ? 'border-red-600 bg-red-600' : 'border-neutral-800'
                }`} />

              <AnimatePresence>
                {item.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                    className="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex-1 space-y-1">
              <h3 className={`text-2xl font-black italic uppercase transition-all duration-300 ${item.completed ? 'text-neutral-500 line-through' : 'text-white'
                }`}>
                {item.task}
              </h3>
              <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-widest">
                {item.description}
              </p>
            </div>

            <div className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${item.completed ? 'opacity-100 text-red-600' : 'opacity-0'}`}>
              SECURED
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default YearPrep;
