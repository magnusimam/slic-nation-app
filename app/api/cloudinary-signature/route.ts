import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Cloudinary Signed Upload API Route
 * 
 * This endpoint generates a signed upload signature for Cloudinary.
 * Use this for signed uploads when you don't have an unsigned upload preset.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dckgjhlsq';
const API_KEY = process.env.CLOUDINARY_API_KEY || '657885322772846';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'ybvD8noZp1_msXQfXi8rpXitZYs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder = 'slic-nations' } = body;

    const timestamp = Math.round(Date.now() / 1000);
    
    // Parameters to sign (must be in alphabetical order)
    const paramsToSign = {
      folder,
      timestamp,
    };
    
    // Create signature string
    const signatureString = Object.entries(paramsToSign)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + API_SECRET;
    
    // Generate SHA-1 signature
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
      folder,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
