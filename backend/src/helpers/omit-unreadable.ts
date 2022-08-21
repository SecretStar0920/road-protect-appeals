import { isArray, isPlainObject, isString, mapValues, isBuffer, isFunction, isDate, isObjectLike } from 'lodash';

/**
 * Finds data recursively and hides it if it's not really loggable
 */
export function omitUnreadable(data: any, maxLength: number = 200, currentDepth = 0, maxDepth = 15) {
    currentDepth = currentDepth + 1;
    if (currentDepth > maxDepth) {
        return `MAX DEPTH OF ${maxDepth} REACHED`;
    }
    // If it's a string, trim and remove it
    if (isString(data)) {
        if (data.length >= maxLength) {
            return `EXCEEDS ${maxLength} CHARACTERS`;
        } else {
            return data;
        }
    }
    // If it's an array map it recursively
    if (isArray(data)) {
        return data.map((item) => omitUnreadable(item, maxLength, currentDepth, maxDepth));
    }

    if (isBuffer(data)) {
        return `OMITTED BUFFER`;
    }

    if (isPlainObject(data)) {
        return mapValues(data, (val) => {
            return omitUnreadable(val, maxLength, currentDepth, maxDepth);
        });
    }

    if (isFunction(data)) {
        return `OMITTED FUNCTION`;
    }

    if (isDate(data)) {
        return data;
    }

    if (isObjectLike(data)) {
        return mapValues(data, (val) => {
            return omitUnreadable(val, maxLength, currentDepth, maxDepth);
        });
    }

    return data;
}
