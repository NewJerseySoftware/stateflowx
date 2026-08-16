export async function retry<T>(
    operation: () => Promise<T>,
    attempts: number,
    delay: number
): Promise<T> {

    if (attempts < 1) {
        throw new Error('Retry attempts must be greater than 0.');
    }

    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt++) {

        try {

            return await operation();

        } catch (error) {

            lastError = error;

            if (attempt < attempts) {
                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );
            }
        }
    }

    throw lastError;
}
