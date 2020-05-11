import paper from 'paper';

// export const getDestinationAnimationEvents = (animations: em.AnimationEvent[], destination: string): em.AnimationEvent[] => {
//   return animations.reduce((result, current) => {
//     if (current.destination === destination) {
//       result = [...result, current];
//     }
//     return result;
//   }, []);
// }

// export const getLongestAnimationByDestination = (animations: em.AnimationEvent[], destination: string): em.AnimationEvent => {
//   return animations.reduce((result, current) => {
//     if (current.destination === destination && current.duration >= result.duration) {
//       result = current;
//     }
//     return result;
//   }, animations[0]);
// }