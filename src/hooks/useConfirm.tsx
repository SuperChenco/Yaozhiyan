import { useState, useCallback, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface UseConfirmOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger';
}

interface UseConfirmResult {
  confirm: (options?: UseConfirmOptions) => Promise<boolean>;
}

let confirmRoot: Root | null = null;
let confirmContainer: HTMLDivElement | null = null;

function ensureContainer(): HTMLDivElement {
  if (!confirmContainer) {
    confirmContainer = document.createElement('div');
    confirmContainer.id = 'confirm-modal-root';
    document.body.appendChild(confirmContainer);
    confirmRoot = createRoot(confirmContainer);
  }
  return confirmContainer;
}

function ConfirmModal({
  options,
  onResolve,
}: {
  options: UseConfirmOptions;
  onResolve: (value: boolean) => void;
}) {
  const {
    title = '确认操作',
    content,
    confirmText = '确认',
    cancelText = '取消',
    type = 'default',
  } = options;

  const handleClose = (result: boolean) => {
    onResolve(result);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose(false);
      if (e.key === 'Enter') handleClose(true);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="fixed inset-0 bg-steel-dark/50 flex items-center justify-center px-4 z-50">
      <Card variant="light" className="w-full max-w-sm p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-base flex items-center justify-center flex-shrink-0 ${
            type === 'danger' ? 'bg-status-danger/15' : 'bg-rock-blue/15'
          }`}>
            <AlertTriangle
              size={20}
              className={type === 'danger' ? 'text-status-danger' : 'text-rock-blue'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-carbon-black mb-1">{title}</h3>
            <p className="text-sm text-steel-gray">{content}</p>
          </div>
          <button
            onClick={() => handleClose(false)}
            className="flex-shrink-0 p-1 text-steel-light-gray hover:text-steel-gray"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-3">
          <Button variant="default" fullWidth onClick={() => handleClose(false)}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={() => handleClose(true)}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function useConfirm(): UseConfirmResult {
  const confirm = useCallback((options?: UseConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const container = ensureContainer();

      const handleResolve = (value: boolean) => {
        if (confirmRoot) {
          confirmRoot.render(<></>);
        }
        resolve(value);
      };

      if (confirmRoot && options) {
        confirmRoot.render(<ConfirmModal options={options} onResolve={handleResolve} />);
      } else {
        resolve(false);
      }
    });
  }, []);

  return { confirm };
}
