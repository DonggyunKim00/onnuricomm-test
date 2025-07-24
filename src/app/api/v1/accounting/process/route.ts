import { NextRequest, NextResponse } from 'next/server';
import parseCSV from '@/utils/file/parseCSV';
import parseRule from '@/utils/file/parseRule';
import initDBFromRules from '@/utils/db/initDBFromRules';
import insertTransactionsByRule from '@/utils/db/insertTransactionsByRule';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const csv = formData.get('csv') as File;
    const rule = formData.get('rule') as File;

    if (!csv) {
      return NextResponse.json(
        { error: 'CSV 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!rule) {
      return NextResponse.json(
        { error: 'rule.json 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // rule.json, bank_transaction.csv 파싱
    const p_rule = await parseRule(rule);
    const p_csv = await parseCSV(csv);

    // rule.json에 따른 DB(companies, categories) 스키마 데이터 초기화
    await initDBFromRules(p_rule);

    // bank_transaction에 정의된 계정 과목을 매핑 → DB 컬럼 삽입
    await insertTransactionsByRule(p_rule, p_csv);

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error('POST /api/v1/accounting/process 처리 실패:', error);
    return NextResponse.json(
      { error: '서버 내부 오류로 요청을 처리할 수 없습니다.' },
      { status: 500 }
    );
  }
}
