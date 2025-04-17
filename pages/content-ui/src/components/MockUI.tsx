export default function MockUi() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Element-scan 테스트 페이지</h1>

      {/* 플렉스박스 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">플렉스박스(Flexbox) 예제</h2>
        <p className="mb-4 text-gray-600">CSS Flexbox를 사용한 레이아웃 예제입니다.</p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-100 p-4 rounded-md flex-1 min-w-[120px] text-center shadow-sm">항목 1</div>
          <div className="bg-blue-200 p-4 rounded-md flex-1 min-w-[120px] text-center shadow-sm">항목 2</div>
          <div className="bg-blue-300 p-4 rounded-md flex-1 min-w-[120px] text-center shadow-sm">항목 3</div>
          <div className="bg-blue-400 p-4 rounded-md flex-1 min-w-[120px] text-center shadow-sm text-white">항목 4</div>
        </div>
      </div>

      {/* 그리드 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">그리드(Grid) 예제</h2>
        <p className="mb-4 text-gray-600">CSS Grid를 사용한 레이아웃 예제입니다.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-md text-center shadow-sm">항목 1</div>
          <div className="bg-green-200 p-4 rounded-md text-center shadow-sm">항목 2</div>
          <div className="bg-green-300 p-4 rounded-md text-center shadow-sm">항목 3</div>
          <div className="bg-green-400 p-4 rounded-md text-center shadow-sm">항목 4</div>
          <div className="bg-green-500 p-4 rounded-md text-center shadow-sm text-white">항목 5</div>
          <div className="bg-green-600 p-4 rounded-md text-center shadow-sm text-white">항목 6</div>
        </div>
      </div>

      {/* 타이포그래피 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">타이포그래피(Typography) 예제</h2>
        <p className="mb-4 text-gray-600">다양한 글꼴과 텍스트 스타일 예제입니다.</p>
        <p className="mb-3 font-serif text-lg">
          이 텍스트는 Georgia 서체로 표시됩니다. 세리프 서체는 주로 본문에 사용됩니다.
        </p>
        <p className="mb-3 font-sans text-lg">
          이 텍스트는 Arial 서체로 표시됩니다. 산세리프 서체는 제목에 많이 사용됩니다.
        </p>
        <p className="mb-3 font-mono text-lg bg-gray-100 p-2 rounded">
          이 텍스트는 Courier New 서체로 표시됩니다. 고정폭 서체는 코드 표시에 사용됩니다.
        </p>
      </div>

      {/* 버튼 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">버튼(Button) 스타일</h2>
        <p className="mb-4 text-gray-600">다양한 스타일의 버튼 예제입니다.</p>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200">
            기본 버튼
          </button>
          <button
            onClick={() => alert('보조 버튼 클릭됨')}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors duration-200 shadow-sm">
            보조 버튼
          </button>
          <button
            onClick={() => alert('성공 버튼 클릭됨')}
            className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors duration-200 shadow-sm">
            성공 버튼
          </button>
        </div>
      </div>

      {/* 카드 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">카드(Card) 컴포넌트</h2>
        <p className="mb-4 text-gray-600">카드 형태의 UI 컴포넌트 예제입니다.</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">카드 제목</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-700">
              이것은 카드 컴포넌트의 본문 영역입니다. 여기에 카드의 주요 내용이 들어갑니다.
            </p>
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200">
              취소
            </button>
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors duration-200">
              확인
            </button>
          </div>
        </div>
      </div>

      {/* 폼 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">폼(Form) 요소</h2>
        <p className="mb-4 text-gray-600">다양한 폼 요소 예제입니다.</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              메시지
            </label>
            <textarea
              rows={4}
              placeholder="메시지를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              로그인 정보 저장
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors duration-200 shadow-sm w-full sm:w-auto">
            제출하기
          </button>
        </form>
      </div>

      {/* 위치 속성 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">위치(Position) 속성</h2>
        <p className="mb-4 text-gray-600">CSS Position 속성을 활용한 예제입니다.</p>
        <div className="relative h-60 bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute top-2 left-2 p-2 bg-yellow-200 rounded shadow-sm">좌상단</div>
          <div className="absolute top-2 right-2 p-2 bg-yellow-300 rounded shadow-sm">우상단</div>
          <div className="absolute bottom-2 left-2 p-2 bg-yellow-400 rounded shadow-sm">좌하단</div>
          <div className="absolute bottom-2 right-2 p-2 bg-yellow-500 rounded shadow-sm">우하단</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-yellow-600 text-white rounded-full shadow-md">
            중앙
          </div>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">테이블(Table)</h2>
        <p className="mb-4 text-gray-600">반응형 테이블 예제입니다.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">홍길동</td>
                <td className="px-6 py-4 whitespace-nowrap">hong@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">팀장</td>
                <td className="px-6 py-4 whitespace-nowrap">개발팀</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">김철수</td>
                <td className="px-6 py-4 whitespace-nowrap">kim@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">대리</td>
                <td className="px-6 py-4 whitespace-nowrap">디자인팀</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">이영희</td>
                <td className="px-6 py-4 whitespace-nowrap">lee@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">과장</td>
                <td className="px-6 py-4 whitespace-nowrap">마케팅팀</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 애니메이션 섹션 */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">애니메이션(Animation)</h2>
        <p className="mb-4 text-gray-600">CSS 애니메이션 예제입니다.</p>
        <div className="inline-block px-6 py-3 bg-purple-500 text-white font-medium rounded-md shadow-md hover:bg-purple-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          Hover Me
        </div>
      </div>
    </div>
  );
}
