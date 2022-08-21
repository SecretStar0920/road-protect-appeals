export class EnvironmentException extends Error {
    constructor(environment: string) {
        super(`The environment ${environment} is unknown...`);
    }
}
