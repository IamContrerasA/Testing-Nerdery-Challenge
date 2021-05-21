import {
  isInteger,
  toLowerCase,
  removeDuplicatesFromArray,
  createRandomProduct,
  getStarWarsPlanets,
  createProduct,
} from './index';
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
jest.mock('node-fetch');

describe('isInteger tests', () => {
  test('Integer with positive number is valid', () => {
    expect(isInteger(1)).toBe(true);
  });
  test('Integer with negative number is valid', () => {
    expect(isInteger(-1)).toBe(true);
  });
  test('Integer with the number 0 is valid', () => {
    expect(isInteger(0)).toBe(true);
  });
  test('Integer with a string is invalid', () => {
    expect(isInteger('b')).toBe(false);
  });
  test('Integer with a decimal is invalid', () => {
    expect(isInteger(1.1)).toBe(false);
  });
  test('Integer with a null value is invalid', () => {
    expect(isInteger(null)).toBe(false);
  });
  test('Integer with an undefined value is invalid', () => {
    expect(isInteger(undefined)).toBe(false);
  });
});

describe('toLowerCase tests', () => {
  test('LowerCase with a upper case string is valid', () => {
    expect(toLowerCase('ASD')).toBe('asd');
  });
  test('LowerCase with a lower case string is valid', () => {
    expect(toLowerCase('asd')).toBe('asd');
  });
  test('LowerCase with a lower and upper case string is valid', () => {
    expect(toLowerCase('AsD')).toBe('asd');
  });
  test('LowerCase with a number and string is valid', () => {
    expect(toLowerCase('A0d')).toBe('a0d');
  });
  test('LowerCase with a random chars value is valid', () => {
    expect(toLowerCase('D/;.[- [.1A]_]s')).toBe('d/;.[- [.1a]_]s');
  });
  test('LowerCase with a string number is invalid', () => {
    expect(toLowerCase('1')).toBe('1');
  });
  test('LowerCase with a decimal string number is invalid', () => {
    expect(toLowerCase('1.1')).toBe('1.1');
  });
  test('LowerCase with a null is invalid', () => {
    expect(toLowerCase(null)).toMatchInlineSnapshot(
      `"Please provide a string"`,
    );
  });
  test('LowerCase with undefined is invalid', () => {
    try {
      toLowerCase(undefined);
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[TypeError: Cannot read property 'toLowerCase' of undefined]`,
      );
    }
  });
});

describe('removeDuplicatesFromArray tests', () => {
  test('An array of numbers without duplicates is valid', () => {
    const arr = [1, 2];
    expect(removeDuplicatesFromArray(arr)).toEqual(expect.arrayContaining(arr));
  });
  test('An array of numbers with duplicates is valid', () => {
    const arr = [1, 1, 2, 4, 2];
    expect(removeDuplicatesFromArray(arr)).toEqual(
      expect.arrayContaining([1, 2, 4]),
    );
  });
  test('An array of numbers and decimals with duplicates is valid', () => {
    const arr = [1, 2, 4, 2, 1.1, 2, 1.1];
    expect(removeDuplicatesFromArray(arr)).toEqual(
      expect.arrayContaining([1, 2, 4, 1.1]),
    );
  });
  test('An array with only one number element is valid', () => {
    const arr = [1];
    expect(removeDuplicatesFromArray(arr)).toEqual(expect.arrayContaining([1]));
  });
  test('An empty array is invalid', () => {
    const arr = [];
    expect(removeDuplicatesFromArray(arr)).toMatchInlineSnapshot(`Array []`);
  });
  test('An array with many types is invalid', () => {
    const arr = ['a', 1, 'b', null];
    expect(removeDuplicatesFromArray(arr)).toEqual(expect.arrayContaining(arr));
  });
  test('An array with null and undefined is invalid', () => {
    const arr = [undefined, null, undefined];
    expect(removeDuplicatesFromArray(arr)).toEqual(
      expect.arrayContaining([undefined, null]), // passed with values different to string or number
    );
  });
  test('A null value is invalid', () => {
    const arr = null;
    try {
      expect(removeDuplicatesFromArray(arr));
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: please provide an array of numbers or strings]`,
      );
    }
  });
  test('An undefined value is invalid', () => {
    const arr = undefined;
    try {
      expect(removeDuplicatesFromArray(arr));
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: please provide an array of numbers or strings]`,
      );
    }
  });
});

describe('createProduct tests', () => {
  function createCustomProduct(args = {}) {
    const myCustomProduct = {
      name: 'Asparagus',
      tags: ['vegetable'],
      description: 'Asparagus',
      price: 18.95,
    };
    return createProduct({ ...myCustomProduct, ...args });
  }

  test('A new product with correct types is valid', () => {
    const result = createCustomProduct();
    expect(result.name).toBe('Asparagus');
  });

  test('A new product with negative id is invalid', () => {
    try {
      createCustomProduct({ id: -1 });
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toMatchInlineSnapshot(
        `"\\"id\\" is not allowed"`,
      );
    }
  });

  test('A new product with negative price is invalid', () => {
    try {
      createCustomProduct({ price: -18.95 });
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toMatchInlineSnapshot(
        `"\\"price\\" must be greater than or equal to 0"`,
      );
    }
  });

  test('A new product with null description is invalid', () => {
    try {
      createCustomProduct({ description: null });
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toMatchInlineSnapshot(
        `"\\"description\\" must be a string"`,
      );
    }
  });

  test('A new product with null tags is invalid', () => {
    try {
      createCustomProduct({ tags: null });
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toMatchInlineSnapshot(
        `"\\"tags\\" must be an array"`,
      );
    }
  });

  test('A new product with null name is invalid', () => {
    try {
      createCustomProduct({ name: null });
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toMatchInlineSnapshot(
        `"\\"name\\" must be a string"`,
      );
    }
  });
});

describe('createFakeProduct tests', () => {
  test('Create a fake product with the correct user role is valid', () => {
    const result = createRandomProduct('clark@kent.com');
    expect(result).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      price: expect.any(String),
    });
  });

  test('Create a fake product with the incorrect user role is invalid', () => {
    function errorWayFunction() {
      createRandomProduct('bruce@wayne.com');
    }
    expect(errorWayFunction).toThrowErrorMatchingInlineSnapshot(
      `"You are not allowed to create products"`,
    );
  });
});

describe('getStarWarsPlanets tests', () => {
  const { Response } = jest.requireActual('node-fetch');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Get mock star wars API and check if name is valid', async () => {
    const starWarsApiMockResult = {
      count: 60,
      next: 'http://swapi.dev/api/planets/?page=2',
      previous: null,
      results: [
        {
          name: 'Tatooine',
          rotation_period: '23',
          orbital_period: '304',
          diameter: '10465',
          climate: 'arid',
          gravity: '1 standard',
          terrain: 'desert',
          surface_water: '1',
          population: '200000',
          residents: [Array],
          films: [Array],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: 'http://swapi.dev/api/planets/1/',
        },
      ],
    };
    mocked(fetch).mockResolvedValue(
      Promise.resolve(new Response(JSON.stringify(starWarsApiMockResult))),
    );
    const result = await getStarWarsPlanets();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    expect(result.results[0].name).toBe(starWarsApiMockResult.results[0].name);
  });

  test('Get mock star wars API with null promise null is invalid', async () => {
    mocked(fetch).mockReturnValue(Promise.resolve(new Response(null)));
    const error = await getStarWarsPlanets().catch((e) => e);
    expect(error).toMatchInlineSnapshot(`[Error: unable to make request]`);
  });
});
