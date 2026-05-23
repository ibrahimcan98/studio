import { Metadata } from 'next';
import { GrupPaketleriClient } from './grup-paketleri-client';

export const metadata: Metadata = {
  title: 'Grup Paketleri Yönetimi | Türk Çocuk Akademisi',
  description: '4 haftalık grup dersi paketlerinin ve oturumlarının yönetimi.',
};

export default function GrupPaketleriPage() {
  return <GrupPaketleriClient />;
}
