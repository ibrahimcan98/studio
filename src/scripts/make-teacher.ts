import { db, auth } from '../lib/firebase-admin';

async function makeTeacher(email: string) {
    try {
        console.log(`Buscando usuario con email: ${email}`);
        const userRecord = await auth.getUserByEmail(email);
        console.log(`Usuario encontrado: ${userRecord.uid}`);
        
        const userRef = db.collection('users').doc(userRecord.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            console.log('El documento de usuario no existe en Firestore. Creándolo...');
            await userRef.set({
                email: email,
                role: 'teacher',
                createdAt: new Date(),
            });
        } else {
            console.log('Actualizando rol a teacher en Firestore...');
            await userRef.update({
                role: 'teacher'
            });
        }
        
        // Custom claims si fuera necesario (opcional)
        // await auth.setCustomUserClaims(userRecord.uid, { role: 'teacher' });

        console.log(`¡Éxito! La cuenta ${email} ahora es de tipo teacher.`);
    } catch (error) {
        console.error('Error:', error);
    }
}

makeTeacher('tubakodak8@gmail.com');
