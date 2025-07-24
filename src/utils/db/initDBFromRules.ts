import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase/types/database.types';
import { Rule } from '../keywordMapFn';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_API_KEY || ''
);

async function initDBFromRules(parsedRule: Rule) {
  // 1. companies 배열 생성
  const companiesData = parsedRule.companies.map((company) => ({
    identity: company.company_id,
    name: company.company_name,
  }));

  // 2. categories 배열 생성
  const categoriesData = parsedRule.companies.flatMap((company) =>
    company.categories.map((category) => ({
      identity: category.category_id,
      name: category.category_name,
      keywords: category.keywords,
    }))
  );

  // 3. companies bulk upsert
  const { error: companyError } = await supabase
    .from('companies')
    .upsert(companiesData, { onConflict: 'identity' });

  if (companyError) {
    console.error('❌ companies bulk upsert 실패:', companyError);
  } else {
    console.log('✅ companies bulk upsert 성공');
  }

  // 4. categories bulk upsert
  const { error: categoryError } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'identity' });

  if (categoryError) {
    console.error('❌ categories bulk upsert 실패:', categoryError);
  } else {
    console.log('✅ categories bulk upsert 성공');
  }
}

export default initDBFromRules;
