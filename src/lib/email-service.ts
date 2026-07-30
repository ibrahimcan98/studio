/**
 * Merkezi E-posta Servisi
 * Tüm e-posta bildirimleri buradan yönetilir.
 */

// ─── Sabit Alıcı Listeleri ────────────────────────────────────────────────────

export const ADMIN_EMAILS = [
  'tubakodak@turkcocukakademisii.com',
  'iletisim@turkcocukakademisi.com',
  'rehberlik@turkcocukakademisi.com',
];

/**
 * Öğretmen e-posta eşlemesi:
 * Firestore'daki kurumsal e-posta → gerçek inbox adresi
 */
export const TEACHER_EMAIL_MAP: Record<string, string> = {
  'dilanogretmen@turkcocukakademisi.com': 'dilanogretmen.tca@gmail.com',
  'selviogretmen@turkcocukakademisi.com': 'selviogretmen.tca@gmail.com',
};

/**
 * Firestore'daki öğretmen e-postasını gerçek inbox adresine çevirir.
 * Eşleme yoksa aynı adresi döndürür.
 */
export function resolveTeacherEmail(firestoreEmail: string): string {
  if (!firestoreEmail) return firestoreEmail;
  const normalizedEmail = firestoreEmail.trim().toLowerCase();
  return TEACHER_EMAIL_MAP[normalizedEmail] ?? firestoreEmail;
}

// ─── Yardımcı Gönderim Fonksiyonu ─────────────────────────────────────────────

interface SendEmailParams {
  to: string | string[];
  subject: string;
  templateName: string;
  data: Record<string, any>;
}

/**
 * /api/emails/send endpoint'ine istek gönderir.
 * Birden fazla alıcı varsa tek tek gönderir (Resend free plan uyumu).
 */
export async function sendEmail({ to, subject, templateName, data }: SendEmailParams): Promise<void> {
  const recipients = Array.isArray(to) ? to : [to];
  await Promise.all(
    recipients.map((address) =>
      fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: address, subject, templateName, data }),
      }).catch((e) => console.error(`Email send error to ${address}:`, e))
    )
  );
}

// ─── Senaryo Bazlı E-posta Fonksiyonları ──────────────────────────────────────

export interface LessonEmailData {
  studentName: string;
  teacherName: string;
  teacherFirestoreEmail?: string; // Öğretmenin Firestore'daki e-postası
  parentEmail?: string;
  date: string;         // Türkiye saati (Öğretmen için)
  time: string;         // Türkiye saati (Öğretmen için)
  parentDate?: string;  // Ebeveyn saat diliminde tarih
  parentTime?: string;  // Ebeveyn saat diliminde saat
  courseName?: string;
  startTime?: string;
  duration?: number;
  isTrial?: boolean;
  reason?: string;
}

/**
 * 1 & 2. Ders Planlandı (Ücretli veya Deneme)
 * Alıcılar: Öğretmen, Ebeveyn, Admin
 */
export async function sendLessonPlannedEmails(data: LessonEmailData): Promise<void> {
  const teacherRealEmail = data.teacherFirestoreEmail
    ? resolveTeacherEmail(data.teacherFirestoreEmail)
    : null;

  const label = data.isTrial ? '🚨 Deneme Dersi Planlandı' : '📅 Yeni Ders Planlandı';
  const adminSubject = `${label} — ${data.studentName} / ${data.teacherName}`;

  const promises: Promise<void>[] = [];

  // Öğretmen
  if (teacherRealEmail) {
    promises.push(sendEmail({
      to: teacherRealEmail,
      subject: data.isTrial ? 'Yeni Bir Deneme Dersiniz Var' : 'Yeni Bir Dersiniz Var',
      templateName: 'lesson-planned',
      data: { ...data, date: data.date, time: data.time, role: 'teacher' },
    }));
  }

  // Ebeveyn
  if (data.parentEmail) {
    promises.push(sendEmail({
      to: data.parentEmail,
      subject: data.isTrial ? 'Deneme Dersiniz Planlandı' : 'Yeni Dersiniz Planlandı',
      templateName: 'lesson-planned',
      data: { ...data, date: data.parentDate ?? data.date, time: data.parentTime ?? data.time, role: 'parent' },
    }));
  }

  // Admin
  promises.push(sendEmail({
    to: ADMIN_EMAILS,
    subject: adminSubject,
    templateName: 'lesson-planned',
    data: { ...data, date: data.date, time: data.time, role: 'admin' },
  }));

  await Promise.all(promises);
}

/**
 * 1 & 2. Ders Değiştirildi (Ücretli veya Deneme)
 * Alıcılar: Öğretmen, Ebeveyn, Admin
 */
export async function sendLessonRescheduledEmails(data: LessonEmailData): Promise<void> {
  const teacherRealEmail = data.teacherFirestoreEmail
    ? resolveTeacherEmail(data.teacherFirestoreEmail)
    : null;

  const label = data.isTrial ? '🔄 Deneme Dersi Değiştirildi' : '🔄 Ders Değiştirildi';
  const adminSubject = `${label} — ${data.studentName} / ${data.teacherName}`;

  const promises: Promise<void>[] = [];

  if (teacherRealEmail) {
    promises.push(sendEmail({
      to: teacherRealEmail,
      subject: data.isTrial ? 'Deneme Dersiniz Yeni Bir Saate Taşındı' : 'Bir Dersiniz Değiştirildi',
      templateName: 'lesson-rescheduled',
      data: { ...data, date: data.date, time: data.time, role: 'teacher' },
    }));
  }

  if (data.parentEmail) {
    promises.push(sendEmail({
      to: data.parentEmail,
      subject: data.isTrial ? 'Deneme Dersiniz Değiştirildi' : 'Dersiniz Değiştirildi',
      templateName: 'lesson-rescheduled',
      data: { ...data, date: data.parentDate ?? data.date, time: data.parentTime ?? data.time, role: 'parent' },
    }));
  }

  promises.push(sendEmail({
    to: ADMIN_EMAILS,
    subject: adminSubject,
    templateName: 'lesson-rescheduled',
    data: { ...data, date: data.date, time: data.time, role: 'admin' },
  }));

  await Promise.all(promises);
}

/**
 * 1 & 2. Ders İptal Edildi (Ücretli veya Deneme)
 * Alıcılar: Öğretmen, Ebeveyn, Admin
 */
export async function sendLessonCancelledEmails(data: LessonEmailData): Promise<void> {
  const teacherRealEmail = data.teacherFirestoreEmail
    ? resolveTeacherEmail(data.teacherFirestoreEmail)
    : null;

  const label = data.isTrial ? '🚨 Deneme Dersi İptal Edildi' : '❌ Ders İptal Edildi';
  const adminSubject = `${label} — ${data.studentName} / ${data.teacherName}`;

  const promises: Promise<void>[] = [];

  if (teacherRealEmail) {
    promises.push(sendEmail({
      to: teacherRealEmail,
      subject: data.isTrial ? 'Bir Deneme Dersiniz İptal Edildi' : 'Bir Dersiniz İptal Edildi',
      templateName: 'lesson-cancelled',
      data: { ...data, date: data.date, time: data.time, role: 'teacher' },
    }));
  }

  if (data.parentEmail) {
    promises.push(sendEmail({
      to: data.parentEmail,
      subject: data.isTrial ? 'Deneme Dersiniz İptal Edildi' : 'Ders İptal Onayı',
      templateName: 'lesson-cancelled',
      data: { ...data, date: data.parentDate ?? data.date, time: data.parentTime ?? data.time, role: 'parent' },
    }));
  }

  promises.push(sendEmail({
    to: ADMIN_EMAILS,
    subject: adminSubject,
    templateName: 'lesson-cancelled',
    data: { ...data, date: data.date, time: data.time, role: 'admin' },
  }));

  await Promise.all(promises);
}

/**
 * 3. Geri Bildirim Verildi
 * Alıcılar: SADECE Ebeveyn
 */
export async function sendFeedbackEmail(data: {
  studentName: string;
  teacherName: string;
  parentEmail: string;
}): Promise<void> {
  await sendEmail({
    to: data.parentEmail,
    subject: `${data.teacherName} Geri Bildirim Verdi — ${data.studentName}`,
    templateName: 'feedback',
    data: { ...data, role: 'parent' },
  });
}

/**
 * 4. Admin Tarafından Yapılan Ders İşlemi
 * Alıcılar: Öğretmen, Ebeveyn (Admin yok)
 */
export async function sendAdminLessonActionEmails(
  action: 'planned' | 'rescheduled' | 'cancelled',
  data: LessonEmailData
): Promise<void> {
  const teacherRealEmail = data.teacherFirestoreEmail
    ? resolveTeacherEmail(data.teacherFirestoreEmail)
    : null;

  const templateMap = {
    planned: 'lesson-planned',
    rescheduled: 'lesson-rescheduled',
    cancelled: 'lesson-cancelled',
  };
  const subjectMap = {
    planned: { teacher: 'Admin Tarafından Yeni Bir Ders Atandı', parent: 'Admin Bir Ders Planladı' },
    rescheduled: { teacher: 'Bir Dersiniz Admin Tarafından Değiştirildi', parent: 'Dersiniz Admin Tarafından Değiştirildi' },
    cancelled: { teacher: 'Bir Dersiniz Admin Tarafından İptal Edildi', parent: 'Bir Dersiniz İptal Edildi' },
  };

  const promises: Promise<void>[] = [];

  if (teacherRealEmail) {
    promises.push(sendEmail({
      to: teacherRealEmail,
      subject: subjectMap[action].teacher,
      templateName: templateMap[action],
      data: { ...data, date: data.date, time: data.time, role: 'teacher' },
    }));
  }

  if (data.parentEmail) {
    promises.push(sendEmail({
      to: data.parentEmail,
      subject: subjectMap[action].parent,
      templateName: templateMap[action],
      data: { ...data, date: data.parentDate ?? data.date, time: data.parentTime ?? data.time, role: 'parent' },
    }));
  }

  await Promise.all(promises);
}

/**
 * 5. Satın Alım
 * Alıcılar: Ebeveyn, Admin
 */
export async function sendPurchaseEmails(data: {
  customerName: string;
  email: string;
  packageName: string;
  amount: string;
  currency: string;
}): Promise<void> {
  await Promise.all([
    // Ebeveyine makbuz
    sendEmail({
      to: data.email,
      subject: 'Ödemeniz Alındı — Türk Çocuk Akademisi',
      templateName: 'payment-receipt',
      data: { studentName: data.customerName, packageName: data.packageName, amount: `${data.amount} ${data.currency}` },
    }),
    // Admin'e bilgi
    sendEmail({
      to: ADMIN_EMAILS,
      subject: `💰 Yeni Satın Alım — ${data.customerName}`,
      templateName: 'admin-purchase',
      data,
    }),
  ]);
}

/**
 * 6a. Yeni Veli Kayıt Oldu
 * Alıcılar: Ebeveyn (hoş geldin), Admin
 */
export async function sendNewRegistrationEmails(data: {
  parentName: string;
  parentEmail: string;
}): Promise<void> {
  await Promise.all([
    // Ebeveyine hoş geldin
    sendEmail({
      to: data.parentEmail,
      subject: 'Türk Çocuk Akademisi\'ne Hoş Geldiniz!',
      templateName: 'welcome',
      data: { name: data.parentName },
    }),
    // Admin'e bilgi
    sendEmail({
      to: ADMIN_EMAILS,
      subject: `🆕 Yeni Veli Kaydı — ${data.parentName} (${data.parentEmail})`,
      templateName: 'admin-new-user',
      data: { parentName: data.parentName, parentEmail: data.parentEmail },
    }),
  ]);
}

/**
 * 6b. Veli Çocuk Ekledi
 * Alıcılar: SADECE Admin
 */
export async function sendChildAddedEmail(data: {
  parentName: string;
  parentEmail: string;
  childName: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_EMAILS,
    subject: `👶 Yeni Öğrenci Eklendi — ${data.childName} (Veli: ${data.parentName})`,
    templateName: 'admin-child-added',
    data,
  });
}

/**
 * 7. Admin Derse Ödev Yükledi
 * Alıcılar: SADECE Ebeveyn
 */
export async function sendHomeworkAssignedEmail(data: {
  studentName: string;
  parentEmail: string;
  homeworkTitle: string;
  homeworkUrl: string;
  courseName: string;
  lessonDate: string;
  lessonTime: string;
}): Promise<void> {
  await sendEmail({
    to: data.parentEmail,
    subject: `📝 Yeni Ödev Eklendi — ${data.studentName}`,
    templateName: 'homework-assigned',
    data,
  });
}

/**
 * 8. Admin Derse Materyal Yükledi
 * Alıcılar: SADECE Ebeveyn
 */
export async function sendMaterialAssignedEmail(data: {
  studentName: string;
  parentEmail: string;
  materialTitle: string;
  materialUrl: string;
  courseName: string;
  lessonDate: string;
  lessonTime: string;
}): Promise<void> {
  await sendEmail({
    to: data.parentEmail,
    subject: `📚 Yeni Ders Materyali — ${data.studentName}`,
    templateName: 'material-assigned',
    data,
  });
}
