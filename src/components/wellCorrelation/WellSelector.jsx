import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useWellManagement } from '@/hooks/useWellManagement';
import { cn } from '@/lib/utils';

const WellSelector = () => {
  const { wells, selectedWells, selectWell } = useWellManagement();
  const [open, setOpen] = React.useState(false);

  // If single select logic is preferred for a dropdown
  const activeWellId = selectedWells.length > 0 ? selectedWells[0] : null;
  const activeWell = wells.find(w => w.id === activeWellId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 h-8 text-xs"
        >
          {activeWell ? activeWell.name : "Go to well..."}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-slate-900 border-slate-800 text-slate-200">
        <Command className="bg-slate-900">
          <CommandInput placeholder="Search wells..." className="h-8 text-xs" />
          <CommandEmpty className="py-2 text-xs text-slate-500">No well found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {wells.map((well) => (
                <CommandItem
                  key={well.id}
                  value={well.name}
                  onSelect={() => {
                    selectWell(well.id); // Single select behavior
                    setOpen(false);
                  }}
                  className="text-xs aria-selected:bg-slate-800"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      activeWellId === well.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {well.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WellSelector;