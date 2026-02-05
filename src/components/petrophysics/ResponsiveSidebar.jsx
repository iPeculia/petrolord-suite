import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Settings2, Menu } from 'lucide-react';

const ResponsiveSidebar = ({ children, title = "Menu", icon: Icon = Settings2, triggerLabel }) => {
    return (
        <>
            {/* Desktop View */}
            <div className="hidden lg:block h-full overflow-hidden">
                {children}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden w-full mb-4">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center bg-slate-800 border-slate-700 text-slate-200">
                            <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {triggerLabel || title}</span>
                            <Menu className="w-4 h-4" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-slate-900 border-slate-800 text-white max-h-[85vh]">
                        <DrawerHeader>
                            <DrawerTitle>{title}</DrawerTitle>
                            <DrawerDescription className="text-slate-400">
                                Configure settings and view options.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 overflow-y-auto">
                            {children}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
};

export default ResponsiveSidebar;