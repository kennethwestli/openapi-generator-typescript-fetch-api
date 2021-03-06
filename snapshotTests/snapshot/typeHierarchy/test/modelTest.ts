import {
    AnyPetDto,
    CatAllOfDto,
    CatDto,
    DogAllOfDto,
    DogAllOfDtoBreedDtoEnum,
    DogAllOfDtoBreedDtoEnumValues,
    DogDto,
    DogDtoBreedDtoEnum,
    DogDtoBreedDtoEnumValues,
    PetDto,
} from "../model";

export class Random {
    seed: number;
    constructor(seed: number) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return this.seed;
    }

    nextFloat(): number {
        return (this.next() - 1) / 2147483646;
    }

    nextInt(limit: number): number {
        return this.next() % limit;
    }

    nextnumber(limit: number): number {
        return this.next() % limit;
    }

    nextBoolean(): boolean {
        return this.nextInt(2) == 0;
    }

    pickOne<T>(options: Array<T>): T {
        return options[this.nextInt(options.length)];
    }

    pickSome<T>(options: Array<T>, n?: number): T[] {
        const shuffled = options.sort(() => 0.5 - this.next());
        return shuffled.slice(0, n || this.nextInt(options.length));
    }

    uuidv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = this.nextInt(16) | 0;
            const v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

type Factory<T> = {
    [P in keyof T]?: ((sampleData: TestSampleData) => T[P]) | T[P];
};

type ModelFactory<T> = Factory<T> | ((testData: TestSampleData) => T);

export interface SampleModelFactories {
    AnyPetDto?: ModelFactory<AnyPetDto>;
    CatAllOfDto?: ModelFactory<CatAllOfDto>;
    CatDto?: ModelFactory<CatDto>;
    DogAllOfDto?: ModelFactory<DogAllOfDto>;
    DogDto?: ModelFactory<DogDto>;
    PetDto?: ModelFactory<PetDto>;
}

export interface SamplePropertyValues {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (sampleData: TestSampleData) => any;
}

export interface TestData {
    seed?: number;
    sampleModelProperties?: SampleModelFactories;
    samplePropertyValues?: SamplePropertyValues;
    now?: Date;
}

export interface PropertyDefinition {
    containerClass: string;
    propertyName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    example?: string | null | Array<any>;
    isNullable?: boolean;
}

export class TestSampleData {
    random: Random;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleModelProperties: any;
    samplePropertyValues: SamplePropertyValues;
    now: Date;

    constructor({ seed, sampleModelProperties, samplePropertyValues, now }: TestData) {
        this.random = new Random(seed || 100);
        this.now = now || new Date(2019, 1, seed);
        this.sampleModelProperties = sampleModelProperties || {};
        this.samplePropertyValues = samplePropertyValues || {};
    }

    nextFloat(): number {
        return this.random.nextFloat();
    }

    nextInt(limit: number): number {
        return this.random.nextInt(limit);
    }

    nextBoolean(): boolean {
        return this.random.nextBoolean();
    }

    sampleboolean(): boolean {
        return this.random.nextBoolean();
    }

    pickOne<T>(options: Array<T>): T {
        return this.random.pickOne(options);
    }

    pickSome<T>(options: Array<T>): T[] {
        return this.random.pickSome(options);
    }

    uuidv4(): string {
        return this.random.uuidv4();
    }

    randomString(): string {
        return this.pickOne(["foo", "bar", "baz"]);
    }

    randomArray<T>(generator: (n: number) => T, length?: number): T[] {
        if (!length) length = this.nextInt(3) + 1;
        return Array.from({ length }).map((_, index) => generator(index));
    }

    randomEmail(): string {
        return (
            this.randomFirstName().toLowerCase() +
            "." +
            this.randomLastName().toLowerCase() +
            "@" +
            this.randomDomain()
        );
    }

    randomFirstName(): string {
        return this.pickOne(["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Linda"]);
    }

    randomLastName(): string {
        return this.pickOne(["Smith", "Williams", "Johnson", "Jones", "Brown", "Davis", "Wilson"]);
    }

    randomFullName(): string {
        return this.randomFirstName() + " " + this.randomLastName();
    }

    randomDomain(): string {
        return (
            this.pickOne(["a", "b", "c", "d", "e"]) +
            ".example." +
            this.pickOne(["net", "com", "org"])
        );
    }

    randomPastDateTime(now: Date): Date {
        return new Date(now.getTime() - this.nextInt(4 * 7 * 24 * 60 * 60 * 1000));
    }

    sampleDateTime(): Date {
        return this.randomPastDateTime(this.now);
    }

    samplenumber(): number {
        return this.nextInt(10000);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleany(): any {
        return {
            [this.randomString()]: this.randomString(),
        }
    }

    sampleDate(): Date {
        return this.randomPastDateTime(this.now);
    }

    sampleString(dataFormat?: string, example?: string): string {
        if (dataFormat === "uuid") {
            return this.uuidv4();
        }
        if (dataFormat === "uri") {
            return "https://" + this.randomDomain() + "/" + this.randomFirstName().toLowerCase();
        }
        if (dataFormat === "email") {
            return this.randomEmail();
        }
        if (example && example !== "null") return example;
        return this.randomString();
    }

    sampleArrayString(length?: number): Array<string> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.sampleString());
    }

    sampleArraynumber(length?: number): Array<number> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.samplenumber());
    }

    generate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template?: ((sampleData: TestSampleData) => any) | any,
        propertyDefinition?: PropertyDefinition,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generator?: () => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        if (template) {
            return typeof template === "function" ? template(this) : template;
        }
        if (propertyDefinition) {
            const { containerClass, propertyName, example } = propertyDefinition;
            if (this.sampleModelProperties[containerClass]) {
                const propertyFactory = this.sampleModelProperties[containerClass][propertyName];
                if (propertyFactory && typeof propertyFactory === "function") {
                    return propertyFactory(this);
                } else if (propertyFactory) {
                    return propertyFactory;
                }
            }
            if (this.samplePropertyValues[propertyName]) {
                return this.samplePropertyValues[propertyName](this);
            }
            if (example && example !== "null") return example;
        }
        return generator && generator();
    }

    arrayLength(): number {
        return this.nextInt(3) + 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sample(modelName: string): any {
        switch (modelName) {
            case "CatAllOfDto":
                return this.sampleCatAllOfDto();
            case "Array<CatAllOfDto>":
                return this.sampleArrayCatAllOfDto();
            case "CatDto":
                return this.sampleCatDto();
            case "Array<CatDto>":
                return this.sampleArrayCatDto();
            case "DogAllOfDto":
                return this.sampleDogAllOfDto();
            case "Array<DogAllOfDto>":
                return this.sampleArrayDogAllOfDto();
            case "DogDto":
                return this.sampleDogDto();
            case "Array<DogDto>":
                return this.sampleArrayDogDto();
            case "PetDto":
                return this.samplePetDto();
            case "Array<PetDto>":
                return this.sampleArrayPetDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleCatAllOfDto(template?: Factory<CatAllOfDto>): CatAllOfDto {
        const containerClass = "CatAllOfDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            hunts: this.generate(
                template?.hunts,
                { containerClass, propertyName: "hunts", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            age: this.generate(
                template?.age,
                { containerClass, propertyName: "age", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayCatAllOfDto(
        template: Factory<CatAllOfDto> = {},
        length?: number
    ): Array<CatAllOfDto> {
        return this.randomArray(
            () => this.sampleCatAllOfDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleCatDto(template?: Factory<CatDto>): CatDto {
        const containerClass = "CatDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            pet_type: this.generate(
                template?.pet_type,
                { containerClass, propertyName: "pet_type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
            hunts: this.generate(
                template?.hunts,
                { containerClass, propertyName: "hunts", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            age: this.generate(
                template?.age,
                { containerClass, propertyName: "age", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayCatDto(
        template: Factory<CatDto> = {},
        length?: number
    ): Array<CatDto> {
        return this.randomArray(
            () => this.sampleCatDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleDogAllOfDto(template?: Factory<DogAllOfDto>): DogAllOfDto {
        const containerClass = "DogAllOfDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            bark: this.generate(
                template?.bark,
                { containerClass, propertyName: "bark", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            breed: this.generate(
                template?.breed,
                { containerClass, propertyName: "breed", example: "null", isNullable: false },
                () => this.pickOne(DogAllOfDtoBreedDtoEnumValues)
            ),
        };
    }

    sampleArrayDogAllOfDto(
        template: Factory<DogAllOfDto> = {},
        length?: number
    ): Array<DogAllOfDto> {
        return this.randomArray(
            () => this.sampleDogAllOfDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleDogDto(template?: Factory<DogDto>): DogDto {
        const containerClass = "DogDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            pet_type: this.generate(
                template?.pet_type,
                { containerClass, propertyName: "pet_type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
            bark: this.generate(
                template?.bark,
                { containerClass, propertyName: "bark", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            breed: this.generate(
                template?.breed,
                { containerClass, propertyName: "breed", example: "null", isNullable: false },
                () => this.pickOne(DogDtoBreedDtoEnumValues)
            ),
        };
    }

    sampleArrayDogDto(
        template: Factory<DogDto> = {},
        length?: number
    ): Array<DogDto> {
        return this.randomArray(
            () => this.sampleDogDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePetDto(template?: Factory<PetDto>): PetDto {
        const containerClass = "PetDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            pet_type: this.generate(
                template?.pet_type,
                { containerClass, propertyName: "pet_type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayPetDto(
        template: Factory<PetDto> = {},
        length?: number
    ): Array<PetDto> {
        return this.randomArray(
            () => this.samplePetDto(template),
            length ?? this.arrayLength()
        );
    }
}
