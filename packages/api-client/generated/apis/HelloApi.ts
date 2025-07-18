/* tslint:disable */
/* eslint-disable */
/**
 * File Uploader API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  MessageDto,
} from '../models/index';
import {
    MessageDtoFromJSON,
    MessageDtoToJSON,
} from '../models/index';

/**
 * 
 */
export class HelloApi extends runtime.BaseAPI {

    /**
     * Returns a greeting message. It’s like saying \"I\'m Pickle Rick!\" but... less green.
     * Get a hello message
     */
    async getHelloMessageRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MessageDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/api/hello`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MessageDtoFromJSON(jsonValue));
    }

    /**
     * Returns a greeting message. It’s like saying \"I\'m Pickle Rick!\" but... less green.
     * Get a hello message
     */
    async getHelloMessage(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MessageDto> {
        const response = await this.getHelloMessageRaw(initOverrides);
        return await response.value();
    }

}
