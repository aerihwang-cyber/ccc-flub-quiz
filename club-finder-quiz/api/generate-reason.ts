// Vercel Serverless Function
// 경로: 프로젝트 루트의 /api/generate-reason.ts
// 환경변수: ANTHROPIC_API_KEY (Vercel 대시보드에서 설정)

const FALLBACK_REASON =
  '다양한 경험을 원하는 당신! CCC는 캠퍼스 활동, 국내외 선교, 문화 사역 등 폭넓은 경험을 제공해요. 의미와 재미를 모두 잡을 수 있어요! 🎯';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set');
    return res.status(200).json({ reason: FALLBACK_REASON });
  }

  try {
    const { answers } = req.body ?? {};
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(200).json({ reason: FALLBACK_REASON });
    }

    // 허용된 키워드만 통과 (임의 입력 방지)
    const allowed = ['extrovert','introvert','meaningful','fun','thoughtful','social','leader','supporter','value','experience'];
    const safeAnswers = answers.filter((a: string) => allowed.includes(a));

    const prompt = `사용자가 대학 동아리 추천 퀴즈를 풀었습니다. 결과는 기독교 동아리 'CCC(한국대학생선교회)'를 추천하는 것입니다.
사용자의 퀴즈 답변으로 미루어 본 성향 키워드는 [${safeAnswers.join(', ')}] 입니다.
이 키워드들을 바탕으로, 왜 CCC가 이 사용자에게 잘 맞는 동아리인지 2~3 문장으로 된 추천사를 한국어로 작성해주세요.
사용자의 성향과 CCC의 특징(예: 다양한 사람들과의 교류, 리더십 훈련, 삶의 의미 탐구, 깊이 있는 나눔, 공동체 활동, 봉사, 선교 등)을 자연스럽게 연결해주세요.
매우 친근하고, 따뜻하며, 설득력 있는 톤으로 작성해주세요. 추천사 본문만 출력하고, 마지막에 이모지를 하나 붙여서 마무리해주세요.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, await response.text());
      return res.status(200).json({ reason: FALLBACK_REASON });
    }

    const data = await response.json();
    const text = data?.content?.find((b: any) => b.type === 'text')?.text?.trim();
    return res.status(200).json({ reason: text || FALLBACK_REASON });
  } catch (error) {
    console.error('generate-reason error:', error);
    return res.status(200).json({ reason: FALLBACK_REASON });
  }
}
