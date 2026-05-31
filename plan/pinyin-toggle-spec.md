# Pinyin Toggle Spec

## 요약

앱 설정에 병음(pinyin)을 전역적으로 on/off하는 토글 기능을 추가한다. 헤더의 언어 선택기 옆에 간단한 토글 버튼을 배치하고, 상태는 localStorage에 저장하여 세션 간 유지한다.

## UI 배치

- **위치**: 레슨 화면 헤더의 언어 선택기(`.mini-language-picker`) 바로 오른쪽
- **디자인**: 최대한 단순하고 공간을 차지하지 않는 작은 토글 버튼
  - 예: 작은 아이콘 또는 짧은 텍스트 pill 버튼 (예: `🔊` / `🔇` 또는 `PINYIN` / `pinyin` 텍스트)
  - 언어 선택기와 동일한 높이, 폰트 스타일
  - 활성화 상태를 시각적으로 구분 (배경색, 불투명도 등)

## 상태 저장

- **키**: `redgold-pinyin-visible` (예: `'true'` / `'false'`)
- **저장 방식**: `window.localStorage.setItem/getItem`
- **기본값**: `true` (병음 표시)
- **초기화 로직**: `getSavedPinyinVisible()` 메서드에서 localStorage 읽기 → 없으면 `true`

## 동작 방식

- **토글 클릭 시**: 상태 반전 → localStorage 저장 → `this.render()` 호출로 전체 재렌더링
- **적용 범위**: 전역 (vocab, grammar, text, mastery 탭 모두 일괄 적용)
- **공간 처리**: `display: none` (병음 요소를 렌더링하지 않아 레이아웃 compact하게 유지)

## 대상 요소 상세

### 숨길 요소 (pinyin OFF 시 display:none)

| 섹션 | 요소 | CSS 선택자 / 위치 |
|------|------|-------------------|
| **Lesson Header** | 부제목 `.subtitle` (pinyin 텍스트) | `App.ts` renderLesson → `<p class="subtitle">` |
| **VocabTab (compact card)** | `.pinyin` | `VocabCard.ts` compact 모드 |
| **TextSection (dialog)** | 각 라인 `.pinyin` | `TextSection.ts` → `.line .content .pinyin` |
| **TextSection (monologue)** | monologue-pinyin 블록 전체 | `TextSection.ts` → `.monologue-pinyin` |
| **TextSection (vocab 섹션)** | vocab-item의 `.pinyin` | `TextSection.ts` → `.vocab-item .pinyin` |
| **TextSection (proper nouns)** | proper-item의 `.pinyin` | `TextSection.ts` → `.proper-item .pinyin` |
| **GrammarCard (front/back)** | 예문 `.pinyin`, `formal_pinyin`, `colloquial_pinyin` | `GrammarCard.ts` |
| **KeySentences (Mastery)** | formal/colloquial 섹션 `.pinyin` | `KeySentences.ts` |

### 유지할 요소 (항상 표시)

| 섹션 | 요소 | 이유 |
|------|------|------|
| **Review vocab card (back)** | `.pinyin` | 복습 기능이므로 pinyin을 항상 참고할 수 있어야 함 |

## CSS 구현

모든 pinyin 요소에 공통 클래스를 적용하거나, `data-pinyin-visible` 속성을 `:host` 또는 최상위 컨테이너에 설정하여 CSS로 제어:

```css
/* 전역 pinyin 표시 제어 */
:host([data-pinyin-visible="false"]) .pinyin,
:host([data-pinyin-visible="false"]) .monologue-pinyin {
  display: none;
}
```

단, Review 폴더의 VocabCard는 이 속성의 영향을 받지 않도록 별도 처리.

## 컴포넌트 수정 계획

### 1. `src/utils/lessonTranslations.ts`
- 변경 없음 (pinyin 토글은 UI 레벨에서 처리)

### 2. `src/utils/uiCopy.ts`
- 변경 없음

### 3. `src/web/App.ts`
- `_pinyinVisible: boolean` 필드 추가
- `getSavedPinyinVisible()` 메서드 추가
- `setPinyinVisible()` 메서드 추가
- 헤더 `.header-controls` 영역에 pinyin 토글 버튼 추가 (언어 선택기 옆)
- `.subtitle`에 `data-pinyin-visible` 속성 전파 또는 CSS 클래스 제어
- `renderLesson()`에서 pinyin 버튼 렌더링
- `setupEventListeners()`에서 pinyin 버튼 이벤트 바인딩
- 모든 하위 컴포넌트에 pinyin visible 상태 전달

### 4. `src/components/TextSection.ts`
- `_pinyinVisible: boolean` 필드 추가
- `pinyinVisible` setter 추가
- 렌더링 시 pinyin 요소 조건부 표시
- CSS에 `:host([data-pinyin-visible="false"]) .pinyin { display: none; }` 추가

### 5. `src/components/GrammarCard.ts`
- `_pinyinVisible: boolean` 필드 추가
- `pinyinVisible` setter 추가
- 렌더링 시 pinyin 요소 조건부 표시
- CSS에 병음 숨김 규칙 추가

### 6. `src/components/KeySentences.ts`
- `_pinyinVisible: boolean` 필드 추가
- `pinyinVisible` setter 추가
- CSS에 병음 숨김 규칙 추가

### 7. `src/features/review/VocabCard.ts`
- 변경 없음 (review는 항상 pinyin 표시)

### 8. `src/features/review/CardStack.ts`
- 변경 없음

## App.ts에서 하위 컴포넌트로 pinyinVisible 전달

`updated()` 메서드에서 각 컴포넌트에 data를 설정할 때 함께 전달:

```typescript
// Example for TextSection
el.language = this._language;
el.data = t;
el.pinyinVisible = this._pinyinVisible; // 추가
```

## 토글 버튼 디자인 (안)

```html
<button class="pinyin-toggle ${this._pinyinVisible ? 'active' : ''}" id="pinyin-toggle">
  <span class="toggle-label">拼</span>
</button>
```

```css
.pinyin-toggle {
  border: none;
  background: transparent;
  color: #888;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Noto Sans SC', sans-serif;
}

.pinyin-toggle.active {
  background: #8B0000;
  color: #fff;
}

.pinyin-toggle:not(.active) {
  opacity: 0.5;
}
```

## 에지 케이스

1. **localStorage에 값이 없는 경우**: 기본값 `true` (병음 표시)
2. **데이터 로딩 중**: pinyinVisible 상태는 컴포넌트 생성 시 기본값으로 설정, 데이터 로드 후 App.updated()에서 전달
3. **언어 변경 시**: pinyinVisible 상태는 영향받지 않음 (독립적 설정)
4. **레슨 전환 시**: pinyinVisible 상태 유지 (App 레벨에서 관리)
