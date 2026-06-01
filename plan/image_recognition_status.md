# 📊 Image Recognition Progress Status

> **목적:** 교재 이미지 → JSON 변환 파이프라인의 레슨별 처리 진행 상황을 추적한다.
> **갱신일:** 2026-06-01

---

## 진행 상황 요약

| 레슨 | 제목 | 상태 | 완료일 | 비고 |
|:---|:---|:---|:---|:---|
| Lesson 1 | 简单的爱情 (Simple Love) | ✅ 완료 | - | 최신 스키마 적용 완료 |
| Lesson 2 | 两个人的事儿 (Our Story) | ✅ 완료 | - | 구버전 스키마 → 마이그레이션 필요 |
| Lesson 3 | 经理对我印象不错 (Good Impression on the Manager) | ⏳ 대기 | - | 교재 정보: plan/textbook_inventory.md 참조 |
| Lesson 4 | 现在流行什么？ (What's Popular Now?) | 🔄 진행 중 | - | 이미지 수신 완료, JSON 생성 진행 중 |
| Lesson 5 | - | ⏳ 대기 | - | - |
| Lesson 6 | - | ⏳ 대기 | - | - |
| Lesson 7 | - | ⏳ 대기 | - | - |
| Lesson 8 | - | ⏳ 대기 | - | - |
| Lesson 9 | - | ⏳ 대기 | - | - |
| Lesson 10 | - | ⏳ 대기 | - | - |

---

## 상태 정의

| 상태 | 의미 |
|:---|:---|
| ⏳ 대기 | 이미지 수신 전 또는 아직 작업 미시작 |
| 🔄 진행 중 | 이미지 수신 후 JSON 생성/검증 진행 중 |
| ✅ 완료 | JSON 생성 및 검증 완료, 앱에서 렌더링 확인 완료 |
| 🔄 마이그레이션 필요 | 완료되었으나 스키마 업데이트 필요 (lesson2.json 등) |

---

## 다음 작업

1. **Lesson 4**: 현재 진행 중 → JSON 생성 및 검증 완료
2. **Lesson 3**: 대기 중 → 이미지 수신 후 처리
3. **Lesson 2**: 스키마 마이그레이션 (lesson1.json 기준으로 변환)

---

## 참고 문서

- **파이프라인 스펙:** `plan/image-recognition-spec.md`
- **Canonical 스키마:** `plan/lesson-schema-canonical.md`
- **교재 정보:** `plan/textbook_inventory.md`

---

*이 문서는 image-recognition-spec.md에서 분리된 상태 추적 문서입니다.*
