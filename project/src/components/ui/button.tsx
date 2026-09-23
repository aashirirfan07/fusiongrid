import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow hover:-translate-y-0.5',
        outline:
          'border border-slate-200/80 bg-white/70 backdrop-blur-md text-foreground shadow-sm hover:bg-white hover:border-slate-300 hover:shadow hover:-translate-y-0.5',
        secondary:
          'bg-secondary/80 text-secondary-foreground shadow-sm hover:bg-secondary hover:shadow hover:-translate-y-0.5',
        ghost: 'hover:bg-slate-100/80 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        frosted:
          'bg-white/80 backdrop-blur-xl border border-white/90 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-white hover:shadow-md hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8.5 rounded-lg px-3.5 text-xs',
        lg: 'h-11 rounded-xl px-8 text-base font-semibold',
        icon: 'h-9 w-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
