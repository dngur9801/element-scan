import { useState } from 'react';

interface ElementInfoOverlayProps {
  elementInfo?: {
    tagName: string;
    className: string;
    width: number;
    height: number;
    styles: {
      [key: string]: string;
    };
  };
  onCopy?: () => void;
  onPin?: () => void;
  isPinned?: boolean;
}

export default function ElementInfoOverlay({
  elementInfo = {
    tagName: 'div',
    className: 'py-12',
    width: 862,
    height: 224,
    styles: {
      'padding-top': '64px',
      'padding-bottom': '64px',
      border: '0px solid rgb(229, 231, 235)',
    },
  },
  onCopy,
  onPin,
  isPinned = false,
}: ElementInfoOverlayProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'typography' | 'colors'>('layout');

  return (
    <div
      className="fixed shadow-lg rounded-lg overflow-hidden flex flex-col w-[300px]"
      style={{ backgroundColor: '#22232D', color: '#fff' }}>
      {/* 헤더 영역 */}
      <div className="p-3 pb-2">
        <div className="font-mono text-sm text-gray-300">
          {elementInfo.tagName}.{elementInfo.className}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {elementInfo.width} × {elementInfo.height}
        </div>
      </div>

      {/* 탭 영역 */}
      <div className="text-sm border-b border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'layout' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('layout')}>
          Layout
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto font-mono" style={{ maxHeight: '300px' }}>
        <div className="p-3">
          {Object.entries(elementInfo.styles).map(([property, value]) => (
            <div key={property} className="flex justify-between items-center mb-1">
              <span className="text-xs text-blue-300">{property}</span>
              <span className="text-xs text-yellow-300">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 영역 */}
      <div className="grid grid-cols-2 gap-2 p-2 border-t border-gray-700">
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-2 px-4 rounded transition"
          onClick={onCopy}>
          Copy CSS
        </button>
        <button
          className={`${isPinned ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'} text-white text-xs py-2 px-4 rounded transition`}
          onClick={onPin}>
          요소 클릭 시 고정
        </button>
      </div>
    </div>
  );
}
