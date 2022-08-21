import { compact, groupBy, mapValues, uniq, pickBy } from 'lodash';

/**
 * A function to take an array of objects
 * Group objects by a key (groupKey)
 * And map the grouped objects to a flat array based on a selected key (selectKey)
 * @param objectArray
 * @param groupKey
 * @param selectKey
 */
export default (objectArray: any[], groupKey: string, selectKey: string) => {
    // Group the data by the group key
    const groupedData = groupBy(objectArray, item => item[groupKey]);

    // Map the array of objects to just the single select key
    // Remove any undefined or null items
    const group = mapValues(groupedData, value => {
        const mappedValue = value.map(item => item[selectKey]);
        return compact(uniq(mappedValue));
    });
    delete group['undefined'];
    return group;
};
