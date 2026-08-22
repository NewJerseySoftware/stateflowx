

import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MySqlStore } from '../core/store/mysql.store.js';


/*


docker run --name stateflowx-test-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=stateflowx_test \
  -p 3307:3306 \
  -d mysql:8

  */

describe('MySqlStore integration', () => {

    let store: MySqlStore;

    beforeAll(async () => {
        store = new MySqlStore({
            type: 'mysql',
            host: 'localhost',
            port: 3307,
            database: 'stateflowx_test',
            user: 'root',
            password: 'root',
        });

        await store.initialize();
    });

    beforeEach(async () => {
        await store.clear();
    });

    afterAll(async () => {
        await store.close();
    });

    it('should set and get a value', async () => {
        await store.set(
            'test:key',
            { value: 'one' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual({
            value: 'one'
        });
    });

    it('should overwrite an existing value with set', async () => {
        await store.set(
            'test:key',
            { value: 'one' }
        );

        await store.set(
            'test:key',
            { value: 'two' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual({
            value: 'two'
        });
    });

    it('should create an array on first insert', async () => {
        await store.insert(
            'test:key',
            { value: 'one' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual([
            { value: 'one' }
        ]);
    });

    it('should append values with insert', async () => {
        await store.insert(
            'test:key',
            { value: 'one' }
        );

        await store.insert(
            'test:key',
            { value: 'two' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual([
            { value: 'one' },
            { value: 'two' }
        ]);
    });

    it('should allow duplicate values with insert', async () => {
        await store.insert(
            'test:key',
            { value: 'same' }
        );

        await store.insert(
            'test:key',
            { value: 'same' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual([
            { value: 'same' },
            { value: 'same' }
        ]);
    });

    it('should preserve an existing set value when insert is called', async () => {
        await store.set(
            'test:key',
            { value: 'existing' }
        );

        await store.insert(
            'test:key',
            { value: 'inserted' }
        );

        const result =
            await store.get('test:key');

        expect(result).toEqual([
            { value: 'existing' },
            { value: 'inserted' }
        ]);
    });

    it('should report whether a key exists', async () => {
        expect(
            await store.has('test:key')
        ).toBe(false);

        await store.set(
            'test:key',
            { value: 'one' }
        );

        expect(
            await store.has('test:key')
        ).toBe(true);
    });

    it('should delete a value', async () => {
        await store.set(
            'test:key',
            { value: 'one' }
        );

        await store.delete('test:key');

        expect(
            await store.get('test:key')
        ).toBeUndefined();
    });

    it('should clear all values', async () => {
        await store.set(
            'test:one',
            { value: 'one' }
        );

        await store.insert(
            'test:two',
            { value: 'two' }
        );

        await store.clear();

        expect(
            await store.has('test:one')
        ).toBe(false);

        expect(
            await store.has('test:two')
        ).toBe(false);
    });

});