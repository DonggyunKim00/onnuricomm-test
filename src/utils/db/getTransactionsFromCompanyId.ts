import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase/types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_API_KEY || ''
);

async function getTransactionFromCompanyId(companyId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('company_id', companyId);

  if (error) throw error;
  return data;
}

export default getTransactionFromCompanyId;
