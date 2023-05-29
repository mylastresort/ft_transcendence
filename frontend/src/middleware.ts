import { NextResponse } from 'next/server';
import { GetMe } from './pages/api/auth/auth';

export default function middleware(req: any) {
  const token = req.cookies.get('access_token');
  let url = req.url;

  if (!token && url.includes('/home/dashboard'))
    return NextResponse.redirect('http://localhost:3000/login');
  if (token && url.includes('/login'))
    return NextResponse.redirect('http://localhost:3000/home/dashboard');
}
