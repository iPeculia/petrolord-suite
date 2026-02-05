import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { cn } from '@/lib/utils';

const MBFavoritesButton = () => {
  const { currentProject, projectList, favorites, toggleFavorite, loadProjectAction } = useMaterialBalance();

  const isCurrentFavorite = currentProject && favorites.includes(currentProject.id);
  
  const favoriteProjects = projectList.filter(p => favorites.includes(p.id));

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-slate-800">
                <Heart className={cn("w-5 h-5", isCurrentFavorite && "fill-red-500 text-red-500")} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-slate-800">
            <DropdownMenuLabel className="text-xs text-slate-500 font-normal uppercase tracking-wider">Favorite Projects</DropdownMenuLabel>
            
            {favoriteProjects.length > 0 ? (
                favoriteProjects.map(project => (
                    <DropdownMenuItem 
                        key={project.id} 
                        onClick={() => loadProjectAction(project.id)}
                        className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200"
                    >
                        <Heart className="w-3.5 h-3.5 mr-2 fill-red-500 text-red-500" />
                        {project.name}
                    </DropdownMenuItem>
                ))
            ) : (
                <div className="px-2 py-1.5 text-xs text-slate-600 italic">No favorites added</div>
            )}

            {currentProject && (
                <>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem 
                        onClick={() => toggleFavorite(currentProject.id)}
                        className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200"
                    >
                        <Heart className={cn("w-3.5 h-3.5 mr-2", isCurrentFavorite ? "fill-slate-400 text-slate-400" : "text-slate-400")} />
                        {isCurrentFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </DropdownMenuItem>
                </>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MBFavoritesButton;