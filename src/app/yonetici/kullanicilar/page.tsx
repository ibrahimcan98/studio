
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
import { Loader2, User, UserCheck, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const roleIcons = {
    parent: <User className="h-4 w-4" />,
    teacher: <UserCheck className="h-4 w-4" />,
    admin: <UserCog className="h-4 w-4" />,
};

const roleNames = {
    parent: 'Veli',
    teacher: 'Öğretmen',
    admin: 'Yönetici',
};

const roleColors = {
    parent: 'secondary',
    teacher: 'default',
    admin: 'destructive',
} as const;

export default function UsersPage() {
  const db = useFirestore();
  const { data: users, isLoading: usersLoading } = useCollection(
    db ? collection(db, 'users') : null
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kullanıcılar</CardTitle>
          <CardDescription>
            Sistemdeki tüm kullanıcıların listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Premium Üye</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleColors[user.role as keyof typeof roleColors] || 'secondary'}>
                        {roleIcons[user.role as keyof typeof roleIcons]}
                        <span className="ml-2">{roleNames[user.role as keyof typeof roleNames] || 'Bilinmiyor'}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                        {user.isPremium ? 'Evet' : 'Hayır'}
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

    