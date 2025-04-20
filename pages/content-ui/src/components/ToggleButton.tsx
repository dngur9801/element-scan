import { cn } from '@extension/ui';
import { useElementScanStore } from '@extension/shared';
import { ELEMENT_ID, Z_INDEX } from '@src/constants';

export default function ToggleButton() {
  const { elementScanActive, toggleScan, isButtonVisible } = useElementScanStore();

  if (!isButtonVisible) return <></>;

  return (
    <div className="fixed top-2 right-2" style={{ zIndex: Z_INDEX.TOGGLE_BTN }}>
      <button
        id={ELEMENT_ID.TOGGLE_BTN}
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
