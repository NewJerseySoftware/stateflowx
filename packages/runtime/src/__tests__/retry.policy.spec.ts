import { describe, expect, it, jest } from '@jest/globals';

import { retry } from '../core/provider/policies/retry.policy.js';

describe('Retry Policy', () => {

    it('should retry until the operation succeeds', async () => {

        let attempts = 0;

        const operation = jest.fn(async () => {

            attempts++;

            if (attempts < 3) {
                throw new Error('failed');
            }

            return 'success';
        });

        const result = await retry(
            operation,
            3,
            0
        );

        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(3);

    });

    it('should throw after all retry attempts fail', async () => {

        const error = new Error('failed');

        const operation = jest.fn(
            async () => {
                throw error;
            }
        );

        await expect(
            retry(operation, 3, 0)
        ).rejects.toThrow('failed');

        expect(operation).toHaveBeenCalledTimes(3);

    });

});