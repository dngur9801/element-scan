import { cn } from '@extension/ui';
import { useElementScanStore } from '@extension/shared';

export default function ToggleButton() {
  const { elementScanActive, toggleScan } = useElementScanStore();

  return (
    <div className="fixed top-2 right-2 z-[9999]">
      <button
        id="element-scan-toggle-btn"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          toggleScan();
        }}
        className={cn(
          'px-3 py-2 text-sm rounded border-none shadow-md font-sans transition-colors duration-200',
          elementScanActive ? 'bg-green-500 text-white' : 'bg-gray-800 text-white',
        )}>
        Element Scan: {elementScanActive ? '활성화' : '비활성화'}
      </button>
    </div>
  );
}
