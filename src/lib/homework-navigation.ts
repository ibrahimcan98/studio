export function activeHomeworkTopics(child: any): string[] {
  const topics = [...(Array.isArray(child?.activeHomeworkTopics) ? child.activeHomeworkTopics : []), child?.activeHomeworkTopic];
  return [...new Set(topics.filter((id): id is string | number => typeof id === 'string' || typeof id === 'number').map(String).filter(Boolean))];
}

export function hasActiveHomework(child: any, topicId: unknown) {
  return (typeof topicId === 'string' || typeof topicId === 'number') && activeHomeworkTopics(child).includes(String(topicId));
}

export function homeworkDestination(childId: string, topicId: string) {
  const base = `/cocuk-modu/${encodeURIComponent(childId)}`;
  const topic = encodeURIComponent(topicId);
  if (['sari-top', 'bir-iki-uc-basardim', 'kaptan-kahvaltisi', 'gokusagi-partisi'].includes(topicId)) return `${base}/hikayeler/${topic}`;
  if (/^\d+$/.test(topicId) || topicId.startsWith('tekrar-')) return `${base}/turkce-hazinem/${topic}`;
  if (topicId.startsWith('chest-')) return `${base}/turkce-hazinem/${encodeURIComponent(topicId.split('-')[1])}`;
  return `${base}/${topic}`;
}
