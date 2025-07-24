import { createClient } from '@supabase/supabase-js';
import { createKeywordMap, findKeywordInfo, Rule } from '@/utils/keywordMapFn';
import { Transaction } from '../file/parseCSV';
import { Database } from '../../../supabase/types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_API_KEY || ''
);

async function insertTransactionsByRule(rule: Rule, csv: Transaction[]) {
  const keywordMap = createKeywordMap(rule);

  const rows = csv.map((transaction) => {
    const { company_id, category_id } = findKeywordInfo(
      transaction['적요'],
      keywordMap
    );

    return {
      date: transaction['거래일시'],
      description: transaction['적요'],
      deposit: Number(transaction['입금액']),
      withdrawal: Number(transaction['출금액']),
      balance: Number(transaction['거래후잔액']),
      branch: transaction['거래점'],
      company_id,
      category_id,
    };
  });

  const { error } = await supabase.from('transactions').upsert(rows, {
    onConflict: 'date',
  });

  if (error) {
    console.error(`❌ bulk upsert 실패`, error);
  } else {
    console.log(`✅ bulk upsert 성공: ${rows.length}건 삽입`);
  }
}

export default insertTransactionsByRule;
