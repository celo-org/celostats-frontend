import { trigger, state, style, group, query, transition, animate, AnimationTriggerMetadata } from '@angular/animations'

const loadingAnimationTime = (delay: number = 0, time: number = 600) => `${time - delay}ms ${delay}ms ease`

export const loadingAnimation: AnimationTriggerMetadata = trigger('loadingAnimation', [
  state('*', style({
    background: 'currentColor',
    opacity: 0.3,
    animation: 'loading-animation 1s ease-in-out infinite alternate',
  })),
  state('false', style({
    background: 'transparent',
    opacity: 1,
  })),
  transition('* => false', group([
    animate(loadingAnimationTime()),
    query('span', [
      style({opacity: 0}),
      animate(loadingAnimationTime(200), style({opacity: 1})),
    ]),
  ])),
])

