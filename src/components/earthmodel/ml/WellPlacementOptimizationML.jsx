import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Wind, Play, RotateCw, Target, BarChart } from 'lucide-react';
import { optimizationService } from '@/services/ml/optimizationService';
import { useToast } from '@/components/ui/use-toast';

const WellPlacementOptimizationML = () => {
    const { toast } = useToast();
    const [config, setConfig] = useState({
        populationSize: 50,
        generations: 20,
        mutationRate: 0.1,
    });
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);

    const handleRun = async () => {
        setIsRunning(true);
        setProgress(0);
        setResults(null);
        toast({ title: "Optimization Started", description: "Genetic algorithm is running..." });
        
        try {
            await optimizationService.runGeneticAlgorithm(
                { ...config, grid: { width: 1000, height: 1000 } },
                (update) => {
                    setProgress((update.generation / config.generations) * 100);
                    setResults(update);
                }
            );
            toast({ title: "Optimization Complete", description: "Optimal well locations identified." });
        } catch (error) {
            toast({ variant: "destructive", title: "Optimization Failed", description: error.message });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-full p-6 bg-slate-950 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Wind className="w-6 h-6 text-cyan-400" />
                            <CardTitle className="text-white">Well Placement Optimization</CardTitle>
                        </div>
                        <CardDescription>Using Genetic Algorithm to find optimal locations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Population Size: <span className="text-cyan-400">{config.populationSize}</span></Label>
                            <Slider value={[config.populationSize]} onValueChange={([v]) => setConfig(c => ({...c, populationSize: v}))} max={200} step={10} disabled={isRunning} />
                        </div>
                        <div className="space-y-3">
                            <Label>Generations: <span className="text-cyan-400">{config.generations}</span></Label>
                            <Slider value={[config.generations]} onValueChange={([v]) => setConfig(c => ({...c, generations: v}))} max={100} step={5} disabled={isRunning} />
                        </div>
                         <div className="space-y-3">
                            <Label>Mutation Rate: <span className="text-cyan-400">{config.mutationRate.toFixed(2)}</span></Label>
                            <Slider value={[config.mutationRate]} onValueChange={([v]) => setConfig(c => ({...c, mutationRate: v}))} max={1} step={0.05} disabled={isRunning} />
                        </div>
                        
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={handleRun} disabled={isRunning}>
                            {isRunning ? <RotateCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            {isRunning ? 'Optimizing...' : 'Run Optimization'}
                        </Button>

                        {isRunning && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-center text-slate-400">Generation: {Math.round(progress * config.generations / 100)} / {config.generations}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {results && (
                     <Card className="bg-slate-900 border-slate-800 animate-in fade-in duration-500">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2"><BarChart className="w-4 h-4 text-cyan-400"/> Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                             <div className="flex justify-between">
                                <span className="text-slate-400">Best Fitness:</span>
                                <span className="font-mono text-emerald-400">{results.bestFitness.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Best Location (X, Y):</span>
                                <span className="font-mono text-white">{results.population[0].x.toFixed(1)}, {results.population[0].y.toFixed(1)}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Visualization */}
            <div className="lg:col-span-3">
                <Card className="bg-slate-900 border-slate-800 h-full min-h-[500px] flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Candidate Locations</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-2 bg-slate-950 m-4 rounded-lg border border-slate-800 relative">
                        {/* Mock Grid */}
                        <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]"></div>
                        
                        {results && results.population.map((ind, i) => (
                            <div
                                key={i}
                                className={`absolute rounded-full transition-all duration-300 ${i === 0 ? 'w-4 h-4 bg-cyan-400 shadow-lg shadow-cyan-500/50 ring-2 ring-white z-10' : 'w-2 h-2 bg-slate-500 opacity-50'}`}
                                style={{ 
                                    left: `${(ind.x / 1000) * 100}%`, 
                                    top: `${(ind.y / 1000) * 100}%`,
                                    transform: 'translate(-50%, -50%)',
                                    transitionDelay: `${i * 2}ms`
                                }}
                                title={`Fitness: ${ind.fitness.toFixed(3)}`}
                            ></div>
                        ))}

                        {!results && (
                             <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <Target className="w-12 h-12 mb-4 opacity-20" />
                                <p>Run optimization to visualize potential well locations.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WellPlacementOptimizationML;