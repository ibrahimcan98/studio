import { getStorage } from 'firebase-admin/storage';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';

// Load config
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const projectId = serviceAccount.project_id;
const bucketName = `studio-5883545682-2eaa4.firebasestorage.app`;

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: bucketName
    });
}

async function setCors() {
    try {
        const bucket = getStorage().bucket();
        console.log(`Setting CORS for bucket: ${bucketName}`);
        await bucket.setCorsConfiguration([
            {
                origin: ['*'],
                method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
                maxAgeSeconds: 3600,
                responseHeader: ['*'],
            }
        ]);
        console.log('CORS rules applied to bucket successfully!');
    } catch (e) {
        console.error('Failed to set CORS:', e);
    }
}

setCors();
