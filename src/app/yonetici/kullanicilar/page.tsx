
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
import { Loader2, User, UserCheck, UserCog, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns';


const statusColors: { [key: string]: string } = {
    lead: 'bg-blue-100 text-blue-800',
    trial_scheduled: 'bg-yellow-100 text-yellow-800',
    trial_done: 'bg-orange-100 text-orange-800',
    active: 'bg-green-100 text-green-800',
    churn: 'bg-red-100 text-red-800',
};

export default function UsersPage() {
  const db = useFirestore();
  // Renamed from 'users' to 'parents' to match the new data model
  const { data: parents, isLoading: parentsLoading } = useCollection(
    db ? collection(db, 'parents') : null
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Veli Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tüm Veliler</CardTitle>
          <CardDescription>
            Sistemdeki tüm velilerin listesi ve durumları.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {parentsLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Ülke</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead>Etiketler</TableHead>
                  <TableHead><span className="sr-only">İşlemler</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents?.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell className="font-medium">
                      {parent.name}
                    </TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[parent.status] || 'bg-gray-100 text-gray-800'}>
                        {parent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{parent.country}</TableCell>
                    <TableCell>
                      {parent.created_at ? format(new Date(parent.created_at.seconds * 1000), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                         {(parent.tags || []).slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                         ))}
                         {parent.tags?.length > 2 && <Badge variant="outline">+{parent.tags.length - 2}</Badge>}
                        </div>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Menüyü aç</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                <DropdownMenuItem>Profili Görüntüle</DropdownMenuItem>
                                <DropdownMenuItem>Not Ekle</DropdownMenuItem>
                                <DropdownMenuItem>Etiket Yönet</DropdownMenuItem>
                             </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
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
