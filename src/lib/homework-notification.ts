import type { User } from 'firebase/auth';

export async function notifyHomeworkAssigned(user: User | null, assignment: { homeworkId: string } | { lessonId: string; homeworkUrl: string }) {
  if (!user) throw new Error('Bildirim için oturum gerekli.');
  const response = await fetch('/api/game-homeworks/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
    body: JSON.stringify(assignment),
  });
  if (!response.ok) throw new Error('Ödev kaydedildi ancak iletişim e-postası gönderilemedi.');
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));

export function homeworkNotificationContent(data: { studentName: string; parentName: string; phone: string; title: string; category: string; teacherName: string; childId: string; game: boolean }) {
  const phone = data.phone.replace(/\D/g, '').replace(/^00/, '');
  const portal = 'https://turkcocukakademisi.com/ebeveyn-portali';
  const message = `Merhaba ${data.parentName}, ${data.studentName} için yeni bir etkinlik/ödev atandı: ${data.title} (${data.category}). ${data.game ? 'Ebeveyn panelinden Çocuk Modu’na girerek ödevinizi görebilirsiniz.' : 'Ebeveyn panelindeki dersler bölümünden ödevinizi görebilirsiniz.'} ${portal}`;
  const whatsappUrl = /^\d{8,15}$/.test(phone) ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
  const html = `<h2>Yeni ödev atandı</h2><p><strong>Öğrenci:</strong> ${escapeHtml(data.studentName)}</p><p><strong>Veli:</strong> ${escapeHtml(data.parentName)}</p><p><strong>Ödev:</strong> ${escapeHtml(data.title)} (${escapeHtml(data.category)})</p><p><strong>Atayan:</strong> ${escapeHtml(data.teacherName)}</p><p>${escapeHtml(message)}</p>${whatsappUrl ? `<p><a href="${escapeHtml(whatsappUrl)}" style="display:inline-block;background:#128c7e;color:white;padding:14px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Veliye WhatsApp’tan Mesaj Gönder</a></p>` : '<p>Velinin geçerli telefon numarası bulunamadı. Lütfen veli kaydını kontrol edin.</p>'}<p>Buton mesajı hazır açar; göndermeden önce kontrol edin.</p>`;
  return { html, whatsappUrl, message };
}
