'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  children, 
  title,
  description,
  className 
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const dialog = dialogRef.current;
    const content = contentRef.current;

    if (!overlay || !dialog || !content) return;

    // Disable body scroll
    document.body.style.overflow = 'hidden';

    // Set initial states
    gsap.set(overlay, { opacity: 0 });
    gsap.set(dialog, { scale: 0.8, opacity: 0 });

    // Animate in
    const tl = gsap.timeline();
    tl.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(dialog, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)"
    }, "-=0.2");

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;

    if (!overlay || !dialog) {
      onClose();
      return;
    }

    // Animate out
    const tl = gsap.timeline({
      onComplete: onClose
    });
    
    tl.to(dialog, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }, "-=0.1");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        aria-describedby={description ? "dialog-description" : undefined}
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-hidden",
          "bg-background border border-foreground/20 rounded-2xl shadow-2xl",
          "dark:bg-background dark:border-beige/20",
          className
        )}
      >
        <div ref={contentRef} className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-foreground/70 hover:text-foreground" />
          </button>

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4 border-b border-foreground/10">
              {title && (
                <h2 id="dialog-title" className="text-2xl font-light text-foreground mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p id="dialog-description" className="text-foreground/70 text-sm">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Input component for forms
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        className={cn(
          "w-full px-4 py-3 rounded-lg border border-foreground/20",
          "bg-transparent text-foreground placeholder:text-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40",
          "transition-colors duration-200",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Textarea component for forms
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        className={cn(
          "w-full px-4 py-3 rounded-lg border border-foreground/20",
          "bg-transparent text-foreground placeholder:text-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40",
          "transition-colors duration-200 resize-none",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
