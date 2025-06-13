import type { AngleUnit } from '@/types';
import { Button } from '@/components/ui/button';

interface AngleUnitSwitcherProps {
  currentUnit: AngleUnit;
  onUnitChange: (unit: AngleUnit) => void;
}

export function AngleUnitSwitcher({ currentUnit, onUnitChange }: AngleUnitSwitcherProps) {
  return (
    <div className="flex items-center space-x-1 p-1 bg-muted rounded-md">
      <Button
        variant={currentUnit === 'deg' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onUnitChange('deg')}
        className={`flex-1 transition-all duration-200 ${currentUnit === 'deg' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/80'}`}
      >
        Deg
      </Button>
      <Button
        variant={currentUnit === 'rad' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onUnitChange('rad')}
        className={`flex-1 transition-all duration-200 ${currentUnit === 'rad' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/80'}`}
      >
        Rad
      </Button>
    </div>
  );
}
