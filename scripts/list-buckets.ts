import { Storage } from '@google-cloud/storage';
import * as path from 'path';

const storage = new Storage({
    keyFilename: path.join(process.cwd(), 'service-account.json'),
    projectId: 'studio-5883545682-2eaa4'
});

storage.getBuckets().then(([buckets]) => {
    console.log("Buckets:", buckets.map(b => b.name));
}).catch(console.error);
