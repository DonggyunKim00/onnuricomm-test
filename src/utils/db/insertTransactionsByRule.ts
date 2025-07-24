import { createClient } from '@supabase/supabase-js';
import { createKeywordMap, findKeywordInfo, Rule } from '@/utils/keywordMapFn';
import { Transaction } from '../file/parseCSV';

async function insertTransactionsByRule(rule: Rule, csv: Transaction[]) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_API_KEY || ''
  );
  // 각 키워드에 회사와 카테고리가 매핑된 객체 생성
  const keywordMap = createKeywordMap(rule);

  // 계정과목을 매핑, DB 컬럼 삽입
  await Promise.all(
    csv.map(async (transaction) => {
      const { company_id, category_id } = findKeywordInfo(
        transaction['적요'],
        keywordMap
      );

      const { error } = await supabase.from('transactions').upsert(
        {
          date: transaction['거래일시'],
          description: transaction['적요'],
          deposit: transaction['입금액'],
          withdrawal: transaction['출금액'],
          balance: transaction['거래후잔액'],
          branch: transaction['거래점'],
          company_id,
          category_id,
        },
        { onConflict: 'date' } // 현재 csv 파일에는 트랜잭션의 고유 값이 없기 때문에 date로 임시 지정
      );

      if (error) {
        console.error(
          `❌ bank_transaction DB 삽입 실패 (${transaction['적요']}):`,
          error
        );
      } else {
        console.log(`✅ bank_transaction DB 저장 완료: ${transaction['적요']}`);
      }
    })
  );
}

export default insertTransactionsByRule;
