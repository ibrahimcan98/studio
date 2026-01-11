
'use client';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoursesPage() {
  const db = useFirestore();
  const { data: courses, isLoading: coursesLoading } = useCollection(
    db ? collection(db, 'courses') : null
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Kurs Yönetimi</h1>
            <p className="text-muted-foreground">Mevcut kursları görüntüleyin ve yenilerini ekleyin.</p>
        </div>
        <Button disabled>Yeni Kurs Ekle</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kurslar</CardTitle>
          <CardDescription>
            Platformda sunulan tüm kursların listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kurs Adı</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Ders Sayısı</TableHead>
                  <TableHead>Fiyat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>{course.numberOfLessons}</TableCell>
                    <TableCell>€{course.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
