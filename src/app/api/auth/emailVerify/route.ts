import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db'; 
import { decrypt } from "@/lib/auth";
import { updateEmailStatus } from "@/lib/routes";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  const token = url.searchParams.get('token') as string; 
    const decryptedToken = await decrypt(token); 
    const email = decryptedToken.email;
  
    const isEmailVerified = await updateEmailStatus(email,decryptedToken.type); 
  
    if (isEmailVerified) {
      return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token or email' }, { status: 400 });
    }
  }
  