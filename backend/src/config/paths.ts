import path from 'path';

export const paths = {
    base: process.env.STORAGE_PATH || '/app/src',
    temp: () => `${paths.base}/temp`,
    storageDirectory: (additionalPath: string = ''): string => {
        const root = process.env.STORAGE || `${paths.base}/storage`;
        return path.join(root, additionalPath);
    },
};
