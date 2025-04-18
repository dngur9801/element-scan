import { useShallow } from 'zustand/shallow';
import { useElementScanStore, type StyleGroup } from '@extension/shared';
import { useEffect, useRef, useState } from 'react';
import { colorManager } from '@src/utils';

interface Props {
  groups: StyleGroup[];
}

export default function StyleGroups({ groups }: Props) {
  const [editingStyle, setEditingStyle] = useState<{ property: string; groupName: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { hoveredElement, updateElementStyle } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      updateElementStyle: state.updateElementStyle,
    })),
  );

  const handleStyleDoubleClick = (property: string, value: string, groupName: string) => {
    setEditingStyle({ property, groupName });
    setEditValue(value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingStyle || !hoveredElement) return;

    const newValue = e.target.value;
    setEditValue(newValue);

    if (editingStyle.property && newValue) {
      hoveredElement.style.setProperty(editingStyle.property, newValue);

      updateElementStyle(editingStyle.groupName, editingStyle.property, newValue);
    }
  };

  const handleStyleEditComplete = () => {
    setEditingStyle(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStyleEditComplete();
    }
  };

  useEffect(() => {
    if (editingStyle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingStyle]);

  return (
    <>
      {/* 스타일 그룹별 표시 */}
      {groups &&
        groups.map(group => (
          <div key={group.name}>
            {/* 그룹 헤더 */}
            <div className="w-full flex justify-between items-center p-2 bg-gray-100/80 backdrop-blur-sm">
              <div className="flex items-center">
                <span className="text-xs text-black font-medium">{group.name}</span>
              </div>
            </div>

            {/* 그룹 내용 */}
            <div className="p-2">
              {Object.entries(group.styles).map(([property, value]) => (
                <div key={property} className="flex items-center px-1 py-1">
                  <span
                    className="text-[11px] text-gray-600 truncate max-w-[45%] self-start width-[120px] flex-1"
                    title={property}>
                    {property}
                  </span>
                  <div
                    className="text-[11px] text-gray-600 truncate max-w-[50%] whitespace-break-spaces"
                    title={value}
                    onDoubleClick={() => handleStyleDoubleClick(property, value, group.name)}>
                    {editingStyle && editingStyle.property === property && editingStyle.groupName === group.name ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleStyleChange}
                        onBlur={handleStyleEditComplete}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        className="w-full text-[11px] text-black bg-white/90 border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : colorManager.isColorProperty(property) ? (
                      <>
                        <div className="flex items-center gap-1">
                          <div
                            className="size-3 rounded-[3px] outline-[1px] outline-solid outline-gray-300 shadow-sm"
                            style={{ backgroundColor: value }}
                          />
                          <span>{value}</span>
                        </div>
                      </>
                    ) : (
                      value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}
