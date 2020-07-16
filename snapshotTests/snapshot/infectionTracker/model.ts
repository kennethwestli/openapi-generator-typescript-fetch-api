/**
 * Infection Tracker
 * Infection Tracker - A case management system for tracking the spread of diseases
 *
 * The version of the OpenAPI document: 1.0.0-draft
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



export interface CaseWorkerDto {
    readonly id?: string;
    fullName: string;
    email: string;
    role: CaseWorkerDtoRoleDtoEnum;
}


export enum CaseWorkerDtoRoleDtoEnum {
    Administrator = 'administrator',
    Interviewer = 'interviewer',
    Followup = 'followup'
}


export interface ExposureDto {
    readonly id?: string;
    exposedPersonName?: string;
    exposedPersonPhoneNumber?: string;
    exposedDate?: Date;
    /**
     * Address or other identifying description of the location
     */
    exposureLocation?: string;
    /**
     * Information that may be relevant to identify the person fully or determine if they are infected
     */
    notes?: string;
    /**
     * The id of the case worker assigned to follow up this person
     */
    caseWorker?: string;
    status: ExposureDtoStatusDtoEnum;
}


export enum ExposureDtoStatusDtoEnum {
    Unidentified = 'unidentified',
    Identified = 'identified',
    Contacted = 'contacted',
    Tested = 'tested',
    Infected = 'infected'
}


export interface InfectionDto {
    readonly id?: string;
    information: InfectionInformationDto;
    registeredExposures: Array<ExposureDto>;
}



export interface InfectionInformationDto {
    patientName?: string;
    patientPhoneNumber?: string;
    likelyInfectionDate?: Date;
    /**
     * Free form text to describe anything about the patient
     */
    notes?: string;
}




