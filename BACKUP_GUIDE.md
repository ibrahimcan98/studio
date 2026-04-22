# Firestore Otomatik Yedekleme Kılavuzu 💾

Bu kılavuz, Türk Çocuk Akademisi verilerinin her gün otomatik olarak yedeklenmesini sağlamak için izlemeniz gereken adımları içerir.

> [!IMPORTANT]
> Otomatik yedekleme özelliğini kullanabilmek için Google Cloud projenizde **Faturalandırma (Billing)** hesabının aktif olması gerekmektedir. Firebase'in ücretsiz (Spark) planında bu özellik kullanılamaz.

## Adım 1: Bir Yedekleme Sepeti (GCS Bucket) Oluşturun
1. [Google Cloud Console](https://console.cloud.google.com/storage/browser) adresine gidin.
2. **"Create Bucket"** butonuna tıklayın.
3. İsim olarak `tca-firestore-backups` gibi benzersiz bir isim verin.
4. Bölge (Location) olarak veritabanınızla aynı bölgeyi (örn: `europe-west3`) seçin.
5. Diğer ayarları varsayılan bırakıp oluşturun.

## Adım 2: Yedekleme İşlemini Zamanlayın
En sağlıklı ve ekonomik yöntem, Google Cloud'un kendi zamanlama servisini kullanmaktır.

### Yöntem A: Google Cloud Console Üstünden (Kodsuz)
1. Firebase panelinde **"Extensions"** (Uzantılar) kısmına gidin.
2. **"Export Collections to Google Cloud Storage"** uzantısını arayın ve kurun.
3. Kurulum sırasında oluşturduğunuz sepet involves (bucket) adını verin.
4. Yedekleme sıklığını (CRON formatında: `0 0 * * *` - Her gece 00:00'da) ayarlayın.

### Yöntem B: Firebase CLI Üstünden (Gelişmiş)
Terminalinize şu komutu yazarak (değişkenleri doldurarak) tek seferde zamanlanmış yedeklemeyi başlatabilirsiniz:

```bash
gcloud scheduler jobs create http firestore-backup \
    --schedule="0 0 * * *" \
    --uri="https://firestore.googleapis.com/v1/projects/[PROJE_ID]/databases/(default):exportDocuments" \
    --http-method=POST \
    --message-body='{"outputUriPrefix":"gs://[BUCKET_ADI]"}' \
    --oauth-service-account-email=[PROJE_ID]@appspot.gserviceaccount.com
```

## Adım 3: Kritik Hatırlatmalar ⚠️

*   **Saklama Süresi:** Yedeklerin sonsuza kadar birikip maliyet yaratmaması için Bucket ayarlarından **"Lifecycle Management"** (Yaşam Döngüsü) kısmına girip "30 günden eski dosyaları sil" kuralı eklemeniz önerilir.
*   **İzinler:** Eğer yedekleme hata verirse, Firestore Hizmet Hesabına (Service Account) oluşturduğunuz Bucket üzerinde "Storage Admin" yetkisi vermeniz gerekebilir.

---
Herhangi bir adımda takılırsanız, ekran görüntüsü iletmeniz yeterli! 🌻
