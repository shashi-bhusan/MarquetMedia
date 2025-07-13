'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button, buttonVariants } from './button';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { ContactFormDialog } from './contact-form-dialog';

interface ProfessionalButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  magneticStrength?: number;
  hoverScale?: number;
  rippleEffect?: boolean;
  variant?: "professional" | "outline" | "ghost" | "default" | "destructive" | "secondary" | "link" | null | undefined;
  showContactForm?: boolean; // New prop to enable contact form
}

export function ProfessionalButton({
  children,
  className,
  variant = "professional",
  size = "xl",
  magneticStrength = 30,
  hoverScale = 1.02,
  rippleEffect = true,
  asChild = false,
  showContactForm = false,
  onClick,
  ...props
}: ProfessionalButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showContactForm) {
      e.preventDefault();
      setIsContactFormOpen(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;
    if (!button) return;

    // Magnetic effect with improved physics
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const strength = magneticStrength / 100;
      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      // Scale on hover with enhanced effects
      gsap.to(button, {
        scale: hoverScale,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    };

    const handleMouseLeave = () => {
      // Reset position and scale with smooth transitions
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    };

    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: hoverScale,
        duration: 0.2,
        ease: "back.out(2)"
      });
    };

    const handleRippleClick = (e: MouseEvent) => {
      if (!rippleEffect || !ripple) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.set(ripple, {
        left: x,
        top: y,
        scale: 0,
        opacity: 1,
      });

      gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    // Add event listeners
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);
    if (rippleEffect) {
      button.addEventListener('click', handleRippleClick);
    }

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
      if (rippleEffect) {
        button.removeEventListener('click', handleRippleClick);
      }
    };
  }, [magneticStrength, hoverScale, rippleEffect]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        data-professional-button="true"
        className={cn(
          "relative overflow-hidden backdrop-blur-sm border-2 group",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700",
          "hover:before:translate-x-[100%]",
          "after:absolute after:inset-0 after:bg-gradient-to-r after:from-foreground/0 after:via-foreground/5 after:to-foreground/0 after:opacity-0 after:transition-opacity after:duration-300",
          "hover:after:opacity-100",
          className
        )}
        onClick={handleClick}
        asChild={asChild}
        {...props}
      >
        <>
          {children}
          {rippleEffect && (
            <div
              ref={rippleRef}
              className="absolute w-4 h-4 bg-white/30 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: 0, top: 0 }}
            />
          )}
        </>
      </Button>
      
      {showContactForm && (
        <ContactFormDialog
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />
      )}
    </>
  );
}
