import { NextResponse } from 'next/server';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/server';

export async function GET() {
    try {
        const uid = 'C07rAPXTS6YAjojxH3fvUXb0cnc2';
        const lessonId = 'q5h51nCRzYB6czjaPJeM';
        const newPhone = '+353894128103';
        
        // 1. Update user phone
        await updateDoc(doc(db, 'users', uid), { phoneNumber: newPhone });
        
        // 2. Reset lesson status
        await updateDoc(doc(db, 'lesson-slots', lessonId), { 
            whatsappReminderSent: false,
            whatsappReminderSentAt: null
        });
        
        return NextResponse.json({ 
            success: true, 
            message: 'User phone updated and lesson reset for testing.' 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
