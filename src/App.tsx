import { useCallback, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AmbientBackground from '@/components/AmbientBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import MultiStepForm from '@/components/MultiStepForm';
import type { FormState } from '@/components/MultiStepForm';
import AIThinking from '@/components/AIThinking';
import Results from '@/components/Results';
import ComparisonMatrix from '@/components/ComparisonMatrix';
import {
  getRecommendations,
  getCategoryImage,
  validateBudget,
  BUDGET_DEFAULTS,
  Category,
  RecommendationResponse,
} from '@/lib/catalog';
import Login from '@/components/Login';
import ForgotPassword from '@/components/ForgotPassword';
import HistoryModal from '@/components/HistoryModal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

type Phase = 'landing' | 'form' | 'thinking' | 'results' | 'login' | 'forgot-password';

const DEFAULT_FORM: FormState = {
  category: 'Laptops',
  budget: BUDGET_DEFAULTS.Laptops,
  useCase: 'Casual',
  priorities: [],
};

export default function App() {
  const { user, loading } = useAuth();
  const [phase, setPhase] = useState<Phase>('landing');
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const thinkTimer = useRef<number[]>([]);

  // Enforce authentication
  useEffect(() => {
    if (!loading) {
      if (!user && phase !== 'login' && phase !== 'forgot-password') {
        setPhase('login');
      } else if (user && (phase === 'login' || phase === 'forgot-password')) {
        setPhase('landing');
      }
    }
  }, [user, loading, phase]);

  const startFromCategory = (c: Category) => {
    setForm({
      category: c,
      budget: BUDGET_DEFAULTS[c],
      useCase: 'Casual',
      priorities: [],
    });
    setPhase('form');
  };

  const handleSubmit = useCallback((state: FormState) => {
    setForm(state);
    setPhase('thinking');
    setResults(null);

    // Clear any pending timers
    thinkTimer.current.forEach((t) => clearTimeout(t));
    thinkTimer.current = [];

    // Simulate the AI pipeline stages, then compute results locally.
    // In production this is where the FastAPI /api/recommend call happens.
    const compute = async () => {
      let recs: RecommendationResponse = { top_3_devices: [] };

      // Local budget validation check first
      const val = validateBudget(state.category, state.budget, state.useCase);
      if (!val.isValid) {
        recs = {
          top_3_devices: [],
          fallback_info: val,
        };
        setResults(recs);
        setPhase('results');
        return;
      }

      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: state.category,
            budget: state.budget,
            use_case: state.useCase,
            priorities: state.priorities,
            brand_pref: 'Any',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.fallback_message) {
            recs = {
              top_3_devices: [],
              fallback_info: {
                isValid: false,
                floorPrice: data.floor_price || 0,
                cutoffPrice: data.cutoff_price || 0,
                subcategoryName: state.category,
                fallbackMessage: data.fallback_message,
                nextSteps: data.next_steps || [],
                adjacentCategorySuggestion: '',
              },
            };
          } else if (data.recommendations && data.recommendations.length >= 3) {
            const devices = data.recommendations.slice(0, 3).map((d: any, idx: number) => ({
              name: d.model_name || d.name,
              price: typeof d.estimated_price_inr === 'number' ? d.estimated_price_inr : (typeof d.price === 'number' ? d.price : state.budget),
              image_url: d.image_url || getCategoryImage(state.category, idx),
              specs: Array.isArray(d.key_specs)
                ? d.key_specs.reduce((acc: Record<string, string>, spec: string, i: number) => {
                    acc[`Spec ${i + 1}`] = spec;
                    return acc;
                  }, {})
                : (typeof d.specs === 'object' && d.specs !== null ? d.specs : {}),
              why_fits_you: d.why_recommended || d.why_fits_you || `Best match for your ${state.useCase.toLowerCase()} requirements.`,
              matchScore: Math.max(85, 98 - idx * 4),
              highlights: Array.isArray(d.key_specs) && d.key_specs.length > 0 ? d.key_specs : [
                'Top Performance',
                'Vivid Display',
                'Long Battery Life',
              ],
            }));
            recs = { top_3_devices: devices };
          } else {
            recs = getRecommendations(
              state.category,
              state.budget,
              state.useCase,
              state.priorities,
            );
          }
        } else {
          recs = getRecommendations(
            state.category,
            state.budget,
            state.useCase,
            state.priorities,
          );
        }
      } catch (error) {
        recs = getRecommendations(
          state.category,
          state.budget,
          state.useCase,
          state.priorities,
        );
      }

      setResults(recs);
      setPhase('results');

      // Save recommendation query and full results to Firestore
      if (user?.uid) {
        try {
          await addDoc(collection(db, 'recommendations'), {
            userId: user.uid,
            userEmail: user.email || '',
            category: state.category,
            budget: state.budget,
            useCase: state.useCase,
            priorities: state.priorities,
            brandPref: 'Any',
            recommendationsCount: recs.top_3_devices.length,
            results: recs.top_3_devices.map((d) => ({
              name: d.name,
              price: d.price,
              specs: d.specs || {},
              why_fits_you: d.why_fits_you || '',
              matchScore: d.matchScore || 90,
              highlights: d.highlights || [],
            })),
            timestamp: new Date().toISOString(),
          });
        } catch (firestoreError) {
          console.error("Firestore Error:", firestoreError);
        }
      }
    };

    // ~4.5s of staged "thinking" feedback
    thinkTimer.current.push(window.setTimeout(compute, 4500));
  }, [user]);

  const goHome = () => {
    thinkTimer.current.forEach((t) => clearTimeout(t));
    setPhase('landing');
    setResults(null);
  };

  const refine = () => {
    setPhase('form');
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      {user && (
        <Header
          onHome={goHome}
          onLogin={() => setPhase('login')}
          onOpenHistory={() => setShowHistory(true)}
        />
      )}

      <main className="relative pb-12">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onPickCategory={startFromCategory} />
            </motion.div>
          )}

          {phase === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MultiStepForm
                initial={form}
                onSubmit={handleSubmit}
                onCancel={goHome}
              />
            </motion.div>
          )}

          {phase === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AIThinking category={form.category} budget={form.budget} />
            </motion.div>
          )}

          {phase === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Results
                devices={results.top_3_devices}
                category={form.category}
                budget={form.budget}
                useCase={form.useCase}
                fallbackInfo={results.fallback_info}
                notice={results.notice}
                onExploreFloor={(floorPrice) => handleSubmit({ ...form, budget: floorPrice })}
                onRestart={goHome}
                onRefine={refine}
                onOpenHistory={() => setShowHistory(true)}
              />
              {results.top_3_devices.length > 0 && (
                <ComparisonMatrix devices={results.top_3_devices} />
              )}
            </motion.div>
          )}

          {phase === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Login
                onBack={goHome}
                onForgotPassword={() => setPhase('forgot-password')}
              />
            </motion.div>
          )}

          {phase === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ForgotPassword onBackToLogin={() => setPhase('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
