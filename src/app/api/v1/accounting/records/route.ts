import getTransactionFromCompanyId from '@/utils/db/getTransactionsFromCompanyId';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json(
      { error: '"companyId" 쿼리 파라미터가 없습니다.' },
      { status: 400 }
    );
  }

  try {
    const transactions = await getTransactionFromCompanyId(companyId);

    // transactions 가공
    const result = transactions.map(({ category, ...item }) => ({
      ...item,
      category_name: category.name,
    }));

    return NextResponse.json(
      { data: result },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('GET /api/v1/accounting/records 처리 실패:', error);
    return NextResponse.json(
      { error: '서버 내부 오류로 요청을 처리할 수 없습니다.' },
      { status: 500 }
    );
  }
}
