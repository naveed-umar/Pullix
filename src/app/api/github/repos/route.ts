import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'GitHub account not connected.' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch repositories from GitHub.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
