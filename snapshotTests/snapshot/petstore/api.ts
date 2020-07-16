/**
 * Sample API
 * Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
 *
 * The version of the OpenAPI document: 0.1.9
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import {
        AnyPetDto,
        CatAllOfDto,
        CatDto,
        DogAllOfDto,
        DogDto,
        PetDto,
} from "./model";

import { BaseAPI } from './base';

/**
 * DefaultApi - object-oriented interface
 */
export interface DefaultApiInterface {
    /**
     * 
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    petsPatch(params?: { 
          anyPetDto?: AnyPetDto,
          options?: any
    }): Promise<void>;
}


/**
 * DefaultApi - object-oriented interface
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
    /**
     * 
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async petsPatch(params: { 
          anyPetDto?: AnyPetDto,
          options?: any
    }): Promise<void> {
        return await this.PATCH(
            "/pets",
            {},
            { body: params.anyPetDto, contentType: "application/json" },
            params && params.options,
        );
    }

}


