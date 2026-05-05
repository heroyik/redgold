import { test, expect } from '@playwright/test';

test.describe('Localization Sanity Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app component to be defined
    await page.waitForSelector('chn-vocab-app');
  });

  test('should display Korean translations when language is set to KO', async ({ page }) => {
    const app = page.locator('chn-vocab-app');
    
    // 1. Language selector에서 한국어 선택
    await app.locator('button[data-lang="ko"]').click();

    // 2. 시작 버튼 클릭 (ID: start-learning-btn)
    await app.locator('#start-learning-btn').click();

    // 3. Lesson 1 카드 클릭 (chapter-card 중 data-id="1")
    await app.locator('.chapter-card[data-id="1"]').click();

    // 4. 단어 탭이 로드될 때까지 대기 (기본 탭이 vocab)
    // "爱情" (사랑) 단어 카드를 찾아서 한국어 뜻이 있는지 확인
    const vocabCard = app.locator('vocab-card#v-爱情');
    await expect(vocabCard).toBeVisible();
    
    // Shadow DOM 내부의 내용을 확인하려면 evaluate를 쓰거나 
    // Playwright의 shadow-piercing selector를 활용
    const meaning = vocabCard.locator('.meaning');
    await expect(meaning).toHaveText('사랑');

    // 스크린샷으로 시각적 확인
    await page.screenshot({ path: 'test-results/test_ko.png' });
  });

  test('should display Japanese translations when language is set to JA', async ({ page }) => {
    const app = page.locator('chn-vocab-app');
    
    // 1. Language selector에서 日本語 선택
    await app.locator('button[data-lang="ja"]').click();

    // 2. 시작 버튼 클릭
    await app.locator('#start-learning-btn').click();

    // 3. Lesson 1 카드 클릭
    await app.locator('.chapter-card[data-id="1"]').click();

    // 4. "爱情" (恋愛、愛情) 단어 카드 확인
    const vocabCard = app.locator('vocab-card#v-爱情');
    await expect(vocabCard).toBeVisible();
    
    const meaning = vocabCard.locator('.meaning');
    await expect(meaning).toHaveText('恋愛、愛情');
    
    await page.screenshot({ path: 'test-results/test_ja.png' });
  });

  test('should update translations dynamically when switching language inside a lesson', async ({ page }) => {
    const app = page.locator('chn-vocab-app');
    
    // 1. Lesson 1 진입 (기본 언어 English)
    await app.locator('#start-learning-btn').click();
    await app.locator('.chapter-card[data-id="1"]').click();
    
    const vocabCard = app.locator('vocab-card#v-爱情');
    await expect(vocabCard).toBeVisible();
    await expect(vocabCard.locator('.meaning')).toHaveText('love');

    // 2. 한국어로 변경
    // 상단 헤더의 미니 픽커 또는 랜딩에서 변경 가능하지만, 
    // App.ts 로직상 헤더 제어 버튼이 있는지 확인 필요.
    // 일단 evaluate로 setLanguage 호출해서 반응성 확인
    await page.evaluate(() => {
      const appEl = document.querySelector('chn-vocab-app') as any;
      if (appEl) appEl.setLanguage('ko');
    });
    
    await expect(vocabCard.locator('.meaning')).toHaveText('사랑');

    // 3. 日本語로 변경
    await page.evaluate(() => {
      const appEl = document.querySelector('chn-vocab-app') as any;
      if (appEl) appEl.setLanguage('ja');
    });
    
    await expect(vocabCard.locator('.meaning')).toHaveText('恋愛、愛情');
  });
});
