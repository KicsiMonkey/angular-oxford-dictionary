import { trigger, transition, animate, style, state } from '@angular/animations'

export const SlideInOutAnimation = [
    trigger('slideInOutBottom', [
        transition(':enter', [
            style({ transform: 'translateY(10px)', opacity: 0 }),
            animate('100ms ease-in', style({ transform: 'translateY(0px)', opacity: 1 }))
        ]),
        transition(':leave', [
            animate('100ms ease-in', style({ transform: 'translateY(10px)', opacity: 0 }))
        ])
    ]),
    trigger('slideInOutLeft', [
        state('true', style({
            transform: 'translateX(0px)',
            opacity: 1,
            display: "initial"
        })),
        state('false', style({
            transform: 'translateX(-10px)',
            opacity: 0,
            display: 'none'
        })),
        transition('false => true', animate('300ms ease-in')),
        transition('true => false', animate('0ms ease-in'))
    ]),
    trigger('slideInOutRight', [
        state('true', style({
            transform: 'translateX(0px)',
            opacity: 1,
            display: 'initial'
        })),
        state('false', style({
            transform: 'translateX(10px)',
            opacity: 0,
            display: 'none'
        })),
        transition('false => true', animate('300ms ease-in')),
        transition('true => false', animate('0ms ease-in'))
    ])
]

export const SlideInOutAnimationFromLeft = [
    
]

export const SlideInOutAnimationFromRight = [
    
]