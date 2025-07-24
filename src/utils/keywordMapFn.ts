type Category = {
  category_id: string;
  category_name: string;
  keywords: string[];
};

type Company = {
  company_id: string;
  company_name: string;
  categories: Category[];
};

export type Rule = {
  companies: Company[];
};

type KeywordMapValue = {
  company_id: string | null;
  category_id: string | null;
};

export const createKeywordMap = (rule: Rule): Map<string, KeywordMapValue> => {
  const map = new Map<string, KeywordMapValue>();

  rule.companies.forEach(({ company_id, categories }) => {
    categories.forEach(({ category_id, keywords }) => {
      keywords.forEach((keyword) => {
        map.set(keyword, {
          company_id,
          category_id,
        });
      });
    });
  });

  return map;
};

export const findKeywordInfo = (
  inputText: string,
  keywordMap: Map<string, KeywordMapValue>
): KeywordMapValue => {
  for (const [keyword, value] of keywordMap.entries()) {
    if (inputText.includes(keyword)) {
      return value;
    }
  }

  return {
    company_id: null,
    category_id: null,
  };
};
