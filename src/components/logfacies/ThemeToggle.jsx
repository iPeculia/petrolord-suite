import React, { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeToggle = ({ theme, setTheme }) => {
    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 inline-flex">
            <ToggleGroup type="single" value={theme} onValueChange={(v) => v && setTheme(v)}>
                <ToggleGroupItem value="dark" aria-label="Dark Mode" className="data-[state=on]:bg-slate-800">
                    <Moon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="light" aria-label="Light Mode" className="data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900">
                    <Sun className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="system" aria-label="System" className="data-[state=on]:bg-slate-800">
                    <Monitor className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default ThemeToggle;