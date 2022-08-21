import config from '@config';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import moment from 'moment';

export function IsMoment(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'isMoment',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    const format = config.app.momentFormat;
                    return moment(value, format).isValid();
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${propertyName} must be a valid date`;
                },
            },
        });
    };
}
