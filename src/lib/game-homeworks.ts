import type { User } from 'firebase/auth';

export async function completeGameHomework(
  user: User | null,
  childId: string,
  topicId: string,
) {
  if (!user || !childId || !topicId || childId === 'demo') return;

  const token = await user.getIdToken();
  const response = await fetch('/api/game-homeworks/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ childId, topicId }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || 'Ödev durumu güncellenemedi.');
  }
}
