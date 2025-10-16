import * as fs from 'fs';
import * as path from 'path';

interface MockUser {
    email: string;
    displayName: string;
    apps: string[];
}

export async function loadMockData(): Promise<MockUser[]> {
    // This path is relative to where the script is executed, which can be tricky in Lambda.
    // A better approach is to bundle the JSON with the Lambda function.
    const mockDataPath = path.join(__dirname, '../../../../app-catalog/mock-data.json');
    
    try {
        const rawData = fs.readFileSync(mockDataPath, 'utf-8');
        const data = JSON.parse(rawData);
        return data.users;
    } catch (error) {
        console.error("Error reading mock data:", error);
        return [];
    }
}
