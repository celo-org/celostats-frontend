import { trigger, state, style, group, query, transition, animate, AnimationTriggerMetadata } from '@angular/animations'

const loadingAnimationTime = (delay: number = 0, time: number = 800) => `${time - (time * delay)}ms ${time * delay}ms ease`

export const loadingAnimation: AnimationTriggerMetadata = trigger('loadingAnimation', [
  state('*', style({
    background: 'currentColor',
    opacity: 0.2,
    animation: 'loading-animation 1s ease-in-out infinite alternate',
  })),
  state('false', style({
    background: 'transparent',
    opacity: 1,
  })),
  transition(':enter, :leave', animate(0)),
  transition('* => false', group([
    animate(loadingAnimationTime()),
    query('[loadingAnimationText]', [
      style({opacity: 0}),
      animate(loadingAnimationTime(0.4), style({opacity: 1})),
    ]),
  ])),
])

