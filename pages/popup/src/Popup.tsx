/* eslint-disable jsx-a11y/label-has-associated-control */
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useState } from 'react';

const Popup = () => {
  const [isActive, setIsActive] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const handleActiveToggle = () => {
    const newState = !isActive;
    setIsActive(newState);

    chrome.runtime.sendMessage({
      action: 'toggleElementScan',
      value: newState,
    });
  };

  const handleButtonVisibleToggle = () => {
    const newState = !isButtonVisible;
    setIsButtonVisible(newState);

    chrome.runtime.sendMessage({
      action: 'toggleElementScanButtonVisible',
      value: newState,
    });
  };

  return (
    <div className="w-[300px] p-4 font-sans text-gray-800 bg-gray-50">
      <h1 className="m-0 mb-4 text-lg font-semibold">Element-Scan</h1>

      <div className="p-3 mb-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span>인스펙터 활성화</span>
          <label htmlFor="active-toggle" className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              id="active-toggle"
              className="w-0 h-0 opacity-0 peer"
              checked={isActive}
              onChange={handleActiveToggle}
            />
            <span
              className={`absolute inset-0 transition-colors duration-300 rounded-full cursor-pointer 
              ${isActive ? 'bg-blue-500' : 'bg-gray-300'}
              before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 
              before:bg-white before:rounded-full before:transition-transform before:duration-300
              ${isActive ? 'before:translate-x-6' : 'before:translate-x-0'}`}></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span>인스펙터 버튼 노출</span>
          <label htmlFor="button-visible-toggle" className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              id="button-visible-toggle"
              className="w-0 h-0 opacity-0 peer"
              checked={isButtonVisible}
              onChange={handleButtonVisibleToggle}
            />
            <span
              className={`absolute inset-0 transition-colors duration-300 rounded-full cursor-pointer 
              ${isButtonVisible ? 'bg-blue-500' : 'bg-gray-300'}
              before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 
              before:bg-white before:rounded-full before:transition-transform before:duration-300
              ${isButtonVisible ? 'before:translate-x-6' : 'before:translate-x-0'}`}></span>
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
          <li className="mb-1">ESC 키를 통해 인스펙터를 비활성화합니다.</li>
        </ol>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
