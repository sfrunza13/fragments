const Memory = require('../../src/model/data/memory/index');

describe('memory methods', () => {
  test('writeFragment returns nothing', async () => {
    let fragment = {
      ownerId: '12345',
      id: '3',
      fragment: {},
    };

    const result = await Memory.writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('readFragment returns fragment we put in with writeFragment', async () => {
    let fragment = {
      ownerId: '12345',
      id: '3',
      fragment: {},
    };

    await Memory.writeFragment(fragment);

    const result = await Memory.readFragment('12345', '3');

    expect(result).toEqual(fragment);
  });

  test('readFragment with incorrect secondary key returns nothing', async () => {
    let fragment = {
      ownerId: '12345',
      id: '3',
      fragment: {},
    };

    await Memory.writeFragment(fragment);

    const result = await Memory.readFragment('12345', '2');

    expect(result).toEqual(undefined);
  });

  test('writeFragmentData returns nothing', async () => {
    let value = 'value';
    const result = await Memory.writeFragmentData('12345', '3', value);
    expect(result).toBe(undefined);
  });

  test('readFragmentData returns value we put in with writeFragmentData', async () => {
    const result = await Memory.readFragmentData('12345', '3');

    expect(result).toEqual('value');
  });

  test('overWriting existing value with writeFragmentData replacing it with Buffer Value', async () => {
    let data = Buffer.from([1, 2, 3]);
    await Memory.writeFragmentData('12345', '3', data);
    const result = await Memory.readFragmentData('12345', '3');

    expect(result).toEqual(data);
  });

  test('readFragmentData and writeFragmentData work with buffers', async () => {
    let data = Buffer.from([1, 2, 3]);

    await Memory.writeFragmentData('12345', '3', data);

    const result = await Memory.readFragmentData('12345', '3');

    expect(result).toEqual(data);
  });

  test('readFragmentData with incorrect secondary key returns nothing', async () => {
    let value = 'value';

    await Memory.writeFragmentData('12345', '3', value);

    const result = await Memory.readFragmentData('12345', '2');

    expect(result).toEqual(undefined);
  });

  test('listFragments with something in DB should return list of secondary keys', async () => {
    const result = await Memory.listFragments('12345');
    expect(result).toEqual(['3']);
  });

  test('listFragments with expanded flag for existing value in DB', async () => {
    let fragment = {
      ownerId: '12345',
      id: '3',
      fragment: {},
    };

    const result = await Memory.listFragments('12345', true);
    expect(result).toEqual([fragment]);
  });

  test('deleteFragment should remove fragment', async () => {
    await Memory.deleteFragment('12345', '3');
    const result = await Memory.readFragment('12345', '3');
    expect(result).toBe(undefined);
  });

  test('listFragments with nothing in DB should return nothing', async () => {
    const result = await Memory.listFragments('12345');
    expect(result).toEqual([]);
  });
});
