import { trigger, transition, query, group, style, animate } from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
    transition('* <=> *', [
        query(
            ':enter, :leave',
            style({
                position: 'fixed',
                width: '100%',
            }),
            { optional: true },
        ),
        group([
            query(
                ':enter',
                [
                    style({ transform: 'translateX(-100%)' }),
                    animate('0.5s ease-out', style({ transform: 'translateX(0%)' })),
                ],
                { optional: true },
            ),
            query(
                ':leave',
                [
                    style({ transform: 'translateX(0%)' }),
                    animate('0.5s ease-out', style({ transform: 'translateX(100%)' })),
                ],
                { optional: true },
            ),
        ]),
    ]),
]);
