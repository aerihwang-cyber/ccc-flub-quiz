// services/claudeService.ts — 기존 geminiService.ts 대체
// 브라우저에는 API 키가 전혀 없고, 자체 서버리스 함수만 호출합니다.

const FALLBACK_REASON =
  '다양한 경험을 원하는 당신! CCC는 캠퍼스 활동, 국내외 선교, 문화 사역 등 폭넓은 경험을 제공해요. 의미와 재미를 모두 잡을 수 있어요! 🎯';

export const generateCccReason = async (answers: string[]): Promise<string> => {
  try {
    const res = await fetch('/api/generate-reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) return FALLBACK_REASON;
    const data = await res.json();
    return data.reason || FALLBACK_REASON;
  } catch (error) {
    console.error('Claude reason API error:', error);
    return FALLBACK_REASON;
  }
};
