import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDbPool } from '@/lib/db';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, pollId, answers } = body;

    if (userId !== session.userId) {
      return NextResponse.json({ success: false, error: 'User ID mismatch' }, { status: 403 });
    }

    const conn = await getDbPool().getConnection();

    try {
      await conn.beginTransaction();

      // Delete existing responses for this user and poll (allow re-submission)
      await conn.execute(
        'DELETE FROM poll_responses WHERE user_id = ? AND poll_id = ?',
        [userId, pollId]
      );

      // Insert new responses
      for (const [questionId, answer] of Object.entries(answers)) {
        const answerValue = Array.isArray(answer) ? JSON.stringify(answer) : String(answer);

        await conn.execute(
          `INSERT INTO poll_responses (user_id, poll_id, question_id, answer_value) 
           VALUES (?, ?, ?, ?)`,
          [userId, pollId, questionId, answerValue]
        );
      }

      await conn.commit();

      return NextResponse.json({ success: true });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error submitting poll:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

