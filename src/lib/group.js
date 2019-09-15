const group = (members, size) => {
  const memberCount = members.length;
  const results = [];
  let table = [];

  for (let i = 0; i < memberCount; i++) {
    if (i % size === 0) {
      table = [];
      results.push(table);
    }
    table.push(members[i]);
  }

  if (memberCount % size === 1) {
    const alone = results.pop()[0];
    const last = results[results.length - 1];
    last.push(alone);
  }

  return results;
};

module.exports = group;
