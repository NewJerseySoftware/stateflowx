

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { InMemoryStore } from '../core/store/in-memory.store.js';

describe('InMemoryStore', () => {

    let store: InMemoryStore;

    beforeEach(() => {
        store = new InMemoryStore();
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