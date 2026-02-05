import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Zap } from 'lucide-react';

    const EmptyState = ({ onAddWell }) => {
        const [wellName, setWellName] = useState('');

        const handleAdd = () => {
            if (wellName) {
                onAddWell(wellName);
                setWellName('');
            }
        };

        return (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg max-w-lg mx-auto">
                <Zap className="mx-auto h-12 w-12 text-blue-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">No Wells Found</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Get started by creating your first well. Once a well is created, you can add casing strings and run analyses.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                    <Input
                        type="text"
                        placeholder="Enter new well name..."
                        value={wellName}
                        onChange={(e) => setWellName(e.target.value)}
                        className="max-w-xs bg-gray-700 border-gray-600 text-white"
                    />
                    <Button onClick={handleAdd}>
                        Create Well
                    </Button>
                </div>
            </div>
        );
    };

    export default EmptyState;