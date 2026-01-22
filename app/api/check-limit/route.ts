import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRemainingTime } from '@/utils/ip-limit';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    // Get IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    const isAllowed = checkRateLimit(ip);
    const remainingTime = getRemainingTime(ip);

    return NextResponse.json({
        allowed: isAllowed,
        remainingTime: remainingTime
    });
}
