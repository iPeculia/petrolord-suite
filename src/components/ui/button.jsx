import { cn } from '@/lib/utils';
    import { Slot } from '@radix-ui/react-slot';
    import { cva } from 'class-variance-authority';
    import React from 'react';

    const buttonVariants = cva(
    	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    	{
    		variants: {
    			variant: {
    				default: 'bg-blue-600 text-white hover:bg-blue-600/90',
    				destructive:
              'bg-red-600 text-slate-50 hover:bg-red-600/90',
    				outline:
              'border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
    				secondary:
              'bg-slate-700 text-slate-200 hover:bg-slate-600/80',
    				ghost: 'hover:bg-slate-800 hover:text-slate-200',
    				link: 'text-slate-200 underline-offset-4 hover:underline',
    			},
    			size: {
    				default: 'h-10 px-4 py-2',
    				sm: 'h-9 rounded-md px-3',
    				lg: 'h-11 rounded-md px-8',
    				icon: 'h-10 w-10',
    			},
    		},
    		defaultVariants: {
    			variant: 'default',
    			size: 'default',
    		},
    	},
    );

    const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    	const Comp = asChild ? Slot : 'button';
    	return (
    		<Comp
    			className={cn(buttonVariants({ variant, size, className }))}
    			ref={ref}
    			{...props}
    		/>
    	);
    });
    Button.displayName = 'Button';

    export { Button, buttonVariants };