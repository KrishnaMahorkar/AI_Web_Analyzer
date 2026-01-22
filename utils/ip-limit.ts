import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'ip_limits.json');
const LIMIT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface IpData {
    [ip: string]: number; // timestamp
}

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8');
    }
}

function readData(): IpData {
    ensureDataFile();
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(content);
        // console.log(`[RateLimit] Read data:`, data);
        return data;
    } catch (error) {
        console.error('[RateLimit] Error reading IP limit data:', error);
        return {};
    }
}

function writeData(data: IpData) {
    ensureDataFile();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing IP limit data:', error);
    }
}

export function checkRateLimit(ip: string): boolean {
    // return true;
    if (!ip) return true; // Allow if IP can't be determined (dev env etc)

    const data = readData();
    const lastRequest = data[ip];

    if (!lastRequest) return true;

    const now = Date.now();
    return (now - lastRequest) > LIMIT_DURATION;
}

export function getRemainingTime(ip: string): number {
    if (!ip) return 0;

    const data = readData();
    const lastRequest = data[ip];

    if (!lastRequest) return 0;

    const now = Date.now();
    const elapsed = now - lastRequest;

    if (elapsed > LIMIT_DURATION) return 0;

    return LIMIT_DURATION - elapsed;
}

export function recordRequest(ip: string) {
    if (!ip) return;

    const data = readData();
    // Optional: Clean up old entries to check file size growing indefinitely
    // For now, just setting the new one
    data[ip] = Date.now();
    writeData(data);
}
