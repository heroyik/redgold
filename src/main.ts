import './styles/global.css';
import './web/App';

console.log("🚀 Chinese Vocabulary App starting up...");

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = '<chn-vocab-app></chn-vocab-app>';
  }
});
