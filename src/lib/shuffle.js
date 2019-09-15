const shuffle = items => {
  for (let i = items.length - 1; i > 0; i--) {
    const r = randint(i);
    swap(items, i, r);
  }
  return items;
};

const swap = (items, one, other) => {
  const tmp = items[one];
  items[one] = items[other];
  items[other] = tmp;
};

const randint = max => {
  const random = Math.random() * (max + 1);
  return Math.floor(random);
};

module.exports = shuffle;
