import React, { useEffect } from 'react';
import { Moon, Sun, Monitor, Printer } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ThemeToggleManager = ({ theme, setTheme }) => {
    const { toast } = useToast();

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'print-mode');
        
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else if (theme === 'print') {
            root.classList.add('light');
            root.classList.add('print-mode'); // Custom class for print-specific CSS overrides if needed
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const handlePrintMode = () => {
        setTheme('print');
        toast({
            title: "Print Optimization Enabled",
            description: "High-contrast light mode activated for export.",
        });
    };

    return (
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <ToggleGroup type="single" value={theme} onValueChange={(v) => v && setTheme(v)}>
                <ToggleGroupItem value="dark" aria-label="Dark Mode" className="h-7 w-7 data-[state=on]:bg-slate-800">
                    <Moon className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="light" aria-label="Light Mode" className="h-7 w-7 data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900">
                    <Sun className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="system" aria-label="System" className="h-7 w-7 data-[state=on]:bg-slate-800">
                    <Monitor className="h-3.5 w-3.5" />
                </ToggleGroupItem>
            </ToggleGroup>
            <div className="w-[1px] h-4 bg-slate-800 mx-1"></div>
            <Button 
                variant="ghost" 
                size="icon" 
                className={`h-7 w-7 ${theme === 'print' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                onClick={handlePrintMode}
                title="Print Mode"
            >
                <Printer className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
};

export default ThemeToggleManager;