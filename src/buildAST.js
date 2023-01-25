import _ from 'lodash';

const mknode = (key, value, type, meta = {}) => ({
  key, value, type, meta,
});

const buildAST = ([obj1, obj2]) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const sortedKeys = _.sortBy(keys);
  const nodes = sortedKeys.map((key) => {
    const [value1, value2] = [obj1[key], obj2[key]];
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildAST([value1, value2]),
      };
    }
    if (!_.has(obj1, key)) return mknode(key, value2, 'added');
    if (!_.has(obj2, key)) return mknode(key, value1, 'removed');
    if (value1 !== value2) return mknode(key, value2, 'updated', { oldValue: value1 });

    return mknode(key, value1, 'unchanged');
  });
  return nodes;
};

export default buildAST;
