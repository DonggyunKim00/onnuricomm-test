async function parseRule(ruleFile: File) {
  const text = await ruleFile.text();
  const ruleJSON = JSON.parse(text);

  return ruleJSON;
}

export default parseRule;
