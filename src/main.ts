import './styles/global.css';
import './styles/global.css';
import { VocabCard } from './components/VocabCard';
import lesson1 from '../data/lesson1.json';

/**
 * 메인 엔트리 포인트
 * 카드를 생성하고 화면에 렌더링합니다.
 */
const init = () => {
  // 1. 첫 번째 단어 데이터를 가져옵니다.
  const firstWord = lesson1[0];

  // 2. VocabCard 인스턴스 생성
  const vocabCard = new Voc난이도/VocabCard(firstWord);

  // 3. 화면(Body)에 추가
  document.body.appendChild(vocabCard.getElement());
};

// 앱 시작
init();
import './web/App';

console.log("🚀 Chinese Vocabulary App starting up...");

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = '<chn-vocab-app></chn-vocab-app>';
  }
});
