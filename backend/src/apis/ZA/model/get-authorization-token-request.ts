/**
 * All API
 * TODO: Add Description
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export class GetAuthorizationTokenRequest {
    'username': string;
    'password': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{ name: string; baseName: string; type: string }> = [
        {
            name: 'username',
            baseName: 'username',
            type: 'string',
        },
        {
            name: 'password',
            baseName: 'password',
            type: 'string',
        },
    ];

    static getAttributeTypeMap() {
        return GetAuthorizationTokenRequest.attributeTypeMap;
    }
}
