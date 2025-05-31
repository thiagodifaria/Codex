'use client';

import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskCompletionAnimationProps {
  onAnimationEnd?: () => void;
  visible: boolean;
}

export default function TaskCompletionAnimation({ onAnimationEnd, visible }: TaskCompletionAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onAnimationEnd?.();
      }, 1500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [visible, onAnimationEnd]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-sm flex items-center justify-center z-[10000]" data-testid="task-completion-animation">
      <div className="p-8 bg-card rounded-lg shadow-xl animate-in fade-in zoom-in-75">
        <CheckCircle2 className="w-24 h-24 text-green-500" />
        <p className="mt-4 text-center text-lg font-medium">Task Completed!</p>
      </div>
    </div>
  );
}
