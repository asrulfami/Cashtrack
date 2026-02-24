"use client";

import { useEffect, useState } from "react";

interface InteractionHintProps {
  message: string;
  visible?: boolean;
  duration?: number;
  onClose?: () => void;
}

/**
 * Component untuk menampilkan hint/petunjuk interaksi kepada user
 * Muncul sebentar lalu hilang otomatis
 */
export default function InteractionHint({ 
  message, 
  visible = true, 
  duration = 3000,
  onClose 
}: InteractionHintProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
        <span className="text-xl">💡</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
          className="ml-2 text-gray-400 dark:text-gray-600 hover:text-gray-200 dark:hover:text-gray-800 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Hook untuk menampilkan hint interaksi
 */
export function useInteractionHint() {
  const [hint, setHint] = useState<{ message: string; visible: boolean } | null>(null);

  const showHint = (message: string, duration?: number) => {
    setHint({ message, visible: true });
    if (duration) {
      setTimeout(() => {
        setHint(null);
      }, duration);
    }
  };

  const hideHint = () => {
    setHint(null);
  };

  const HintComponent = hint ? (
    <InteractionHint
      key={hint.message}
      message={hint.message}
      visible={hint.visible}
      onClose={hideHint}
    />
  ) : null;

  return { showHint, hideHint, HintComponent };
}
