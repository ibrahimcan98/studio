
'use client';

import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, BookOpen, Calendar } from 'lucide-react';

function StatCard({ title, value, icon: Icon, isLoading }: { title: string, value: string | number, icon: React.ElementType, isLoading: boolean }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
      </Card>
    )
}

export default function AdminPage() {
    const db = useFirestore();

    const { data: users, isLoading: usersLoading } = useCollection(
        db ? collection(db, 'users') : null
    );

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(
        db ? collection(db, 'lesson-slots') : null
    );

    const { data: courses, isLoading: coursesLoading } = useCollection(
        db ? collection(db, 'courses') : null
    );
    
    const parentCount = users?.filter(u => u.role === 'parent').length ?? 0;
    const teacherCount = users?.filter(u => u.role === 'teacher').length ?? 0;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Yönetici Paneli</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Toplam Veli"
                    value={parentCount}
                    icon={Users}
                    isLoading={usersLoading}
                />
                 <StatCard 
                    title="Toplam Öğretmen"
                    value={teacherCount}
                    icon={Users}
                    isLoading={usersLoading}
                />
                <StatCard 
                    title="Planlanmış Dersler"
                    value={lessonSlots?.filter(l => l.status === 'booked').length ?? 0}
                    icon={Calendar}
                    isLoading={lessonsLoading}
                />
                 <StatCard 
                    title="Tanımlı Kurslar"
                    value={courses?.length ?? 0}
                    icon={BookOpen}
                    isLoading={coursesLoading}
                />
            </div>
        </div>
    );
}

    