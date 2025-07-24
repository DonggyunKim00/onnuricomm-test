import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase/types/database.types';
import { Rule } from '../keywordMapFn';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_API_KEY || ''
);

async function initDBFromRules(parsedRule: Rule) {
  // rule.json에 정의된 내용을 DB에 삽입
  await Promise.all(
    parsedRule.companies.map(async (company) => {
      // 1. companies 저장
      const { error: companyError } = await supabase.from('companies').upsert(
        {
          identity: company.company_id,
          name: company.company_name,
        },
        { onConflict: 'identity' }
      );

      if (companyError) {
        console.error(
          `❌ company upsert 실패 (${company.company_name}):`,
          companyError
        );
        return;
      } else {
        console.log(`✅ company upsert 성공: ${company.company_name}`);
      }

      // 2. categories 저장
      await Promise.all(
        company.categories.map(async (category) => {
          const { error: categoryError } = await supabase
            .from('categories')
            .upsert(
              {
                identity: category.category_id,
                name: category.category_name,
                keywords: category.keywords,
              },
              { onConflict: 'identity' }
            );

          if (categoryError) {
            console.error(
              `❌ category upsert 실패 (${category.category_name}):`,
              categoryError
            );
          } else {
            console.log(`✅ category upsert 성공: ${category.category_name}`);
          }
        })
      );
    })
  );
}

export default initDBFromRules;
