import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Device } from '@/lib/catalog';

interface HistoryRecord {
  id: string;
  category: string;
  budget: number;
  useCase: string;
  timestamp: string;
  results: Device[];
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const recRef = collection(db, 'recommendations');
        let q;
        if (user?.uid) {
          q = query(recRef, where('userId', '==', user.uid), limit(25));
        } else {
          q = query(recRef, limit(25));
        }

        const snapshot = await getDocs(q);
        const docs: HistoryRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            category: data.category || 'General',
            budget: data.budget || 0,
            useCase: data.useCase || 'General',
            timestamp: data.timestamp || new Date().toISOString(),
            results: data.results || [],
          });
        });

        // Client side sort by timestamp descending
        docs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(docs);
      } catch (err: any) {
        console.error('Error fetching recommendation history from Firestore:', err);
        setError('Failed to load recommendation history from Firestore.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl glass-strong border border-cyan-500/30 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Search History</h3>
                <p className="text-xs text-slate-400">Stored AI recommendation logs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading && (
              <div className="py-12 text-center text-slate-400">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <p className="mt-3 text-sm">Fetching recommendation history from Firestore...</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {!loading && !error && history.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Clock className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <p className="font-medium text-slate-300">No saved search history found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Run an AI recommendation search to save results to Firestore.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              history.map((record) => {
                const isExpanded = expandedId === record.id;
                const formattedDate = new Date(record.timestamp).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-200 hover:border-cyan-500/30"
                  >
                    {/* Record Bar */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="flex flex-wrap items-center justify-between gap-4 p-4 cursor-pointer hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                          {record.category}
                        </span>
                        <div className="text-sm font-semibold text-white">
                          Budget: <span className="text-amber-300">₹{record.budget.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-xs text-slate-400">• {record.useCase}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{formattedDate}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Record Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-white/10 bg-black/40 p-4"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                            Stored AI Recommendations ({record.results.length})
                          </h4>
                          {record.results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {record.results.map((device, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2 text-xs"
                                >
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-white leading-tight">{device.name}</h5>
                                    <span className="font-semibold text-cyan-300 shrink-0">
                                      ₹{device.price ? device.price.toLocaleString('en-IN') : 'N/A'}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] line-clamp-2">
                                    {device.why_fits_you}
                                  </p>
                                  {device.highlights && device.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {device.highlights.map((h, i) => (
                                        <span key={i} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                                          {h}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">No device details logged for this record.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700/50 bg-black/40 flex justify-end">
            <button onClick={onClose} className="btn-ghost text-xs">
              Close History
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
