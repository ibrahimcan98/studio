
'use client';

import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, UserCheck, TrendingUp, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

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
    const [monthlyStats, setMonthlyStats] = useState({ trials: 0, sales: 0, revenue: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    const parentsQuery = useMemoFirebase(() => db ? query(collection(db, 'parents'), where('status', '==', 'active')) : null, [db]);
    const studentsQuery = useMemoFirebase(() => db ? query(collection(db, 'students'), where('status', '==', 'active')) : null, [db]);
    
    const { data: activeParents, isLoading: parentsLoading } = useCollection(parentsQuery);
    const { data: activeStudents, isLoading: studentsLoading } = useCollection(studentsQuery);

    useEffect(() => {
      if (!db) return;

      const fetchMonthlyStats = async () => {
        setLoadingStats(true);
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const trialsRef = collection(db, 'trials');
        const salesRef = collection(db, 'sales');

        const trialsQuery = query(trialsRef, where('trial_date', '>=', Timestamp.fromDate(start)), where('trial_date', '<=', Timestamp.fromDate(end)));
        const salesQuery = query(salesRef, where('sale_date', '>=', Timestamp.fromDate(start)), where('sale_date', '<=', Timestamp.fromDate(end)));

        const trialsPromise = getDocs(trialsQuery).catch(error => {
          const permissionError = new FirestorePermissionError({
            path: 'trials',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          throw permissionError; 
        });

        const salesPromise = getDocs(salesQuery).catch(error => {
            const permissionError = new FirestorePermissionError({
                path: 'sales',
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            throw permissionError;
        });

        Promise.all([trialsPromise, salesPromise]).then(([trialsSnapshot, salesSnapshot]) => {
            const totalTrials = trialsSnapshot.size;
            const totalSales = salesSnapshot.size;
            const totalRevenue = salesSnapshot.docs.reduce((acc, doc) => acc + (doc.data().price || 0), 0);

            setMonthlyStats({
                trials: totalTrials,
                sales: totalSales,
                revenue: totalRevenue
            });
        }).catch(error => {
            // Error is already emitted, just log for local debugging if needed.
            // Do not use console.error in production code for this.
        }).finally(() => {
            setLoadingStats(false);
        });
      };

      fetchMonthlyStats();
    }, [db]);
    
    const trialToSaleConversionRate = monthlyStats.trials > 0 ? ((monthlyStats.sales / monthlyStats.trials) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Toplam Aktif Veli"
                    value={activeParents?.length ?? 0}
                    icon={Users}
                    isLoading={parentsLoading}
                />
                 <StatCard 
                    title="Toplam Aktif Öğrenci"
                    value={activeStudents?.length ?? 0}
                    icon={UserCheck}
                    isLoading={studentsLoading}
                />
                <StatCard 
                    title="Bu Ayki Deneme Dersi"
                    value={monthlyStats.trials}
                    icon={TrendingUp}
                    isLoading={loadingStats}
                />
                 <StatCard 
                    title="Deneme -> Satış Dönüşüm Oranı"
                    value={`${trialToSaleConversionRate}%`}
                    icon={BarChart}
                    isLoading={loadingStats}
                />
                <StatCard 
                    title="Bu Ayki Ciro"
                    value={`€${monthlyStats.revenue.toFixed(2)}`}
                    icon={TrendingUp}
                    isLoading={loadingStats}
                />
            </div>
            {/* TODO: Add charts for country distribution and top selling courses */}
        </div>
    );
}
