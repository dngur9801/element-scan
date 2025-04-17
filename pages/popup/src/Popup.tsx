/* eslint-disable jsx-a11y/label-has-associated-control */
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useState, useEffect } from 'react';

const Popup = () => {
  const [isActive, setIsActive] = useState(false);

  // 초기 상태 로드
  useEffect(() => {
    chrome.storage.local.get(['isInspectorActive'], result => {
      if (result.isInspectorActive !== undefined) {
        setIsActive(result.isInspectorActive);
      }
    });
  }, []);

  // 토글 상태 변경 시 스토리지 저장 및 현재 탭에 메시지 전송
  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);

    // 스토리지에 상태 저장
    chrome.storage.local.set({ isInspectorActive: newState });

    // 현재 활성 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleInspector',
          isActive: newState,
        });
      }
    });
  };

  return (
    <div className="w-[300px] p-4 font-sans text-gray-800 bg-gray-50">
      <h1 className="m-0 mb-4 text-lg font-semibold">CSS-Scan</h1>

      <div className="p-3 mb-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <span>인스펙터 활성화</span>
          <label htmlFor="toggle" className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              id="toggle"
              className="w-0 h-0 opacity-0 peer"
              checked={isActive}
              onChange={handleToggle}
            />
            <span
              className={`absolute inset-0 transition-colors duration-300 rounded-full cursor-pointer 
              ${isActive ? 'bg-blue-500' : 'bg-gray-300'}
              before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 
              before:bg-white before:rounded-full before:transition-transform before:duration-300
              ${isActive ? 'before:translate-x-6' : 'before:translate-x-0'}`}></span>
          </label>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          단축키: <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">Alt+C</span>
        </div>
      </div>

      <div className="p-3 mb-4 bg-white rounded-lg shadow-sm">
        <h3 className="mt-0 text-sm font-medium">사용 방법</h3>
        <ol className="pl-4 m-0 text-sm">
          <li className="mb-1">토글 버튼이나 단축키로 인스펙터를 활성화합니다.</li>
          <li className="mb-1">웹 페이지의 요소 위에 마우스를 올리면 CSS 정보가 표시됩니다.</li>
          <li>CSS 정보를 복사하려면 오버레이의 'Copy CSS' 버튼을 클릭하세요.</li>
        </ol>
      </div>

      <div className="mt-4 text-xs text-center text-gray-500">CSS-Scan v1.0.0</div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
