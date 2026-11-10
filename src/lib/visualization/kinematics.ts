import {motionAt,type MotionScenario} from '../physics/mechanics/accelerated-motion.ts';
/** Sample the validated model, including its exact boundaries and interior turning point. */
export function kinematicsChartData(scenario:MotionScenario) {
 const {duration,motion}=scenario;
 const peak=motion.a!==0?-motion.v0/motion.a:0;
 const times=duration===0?[0]:[...new Set([...Array.from({length:81},(_,i)=>duration*(i/80)),...(peak>0&&peak<duration?[peak]:[])])].sort((a,b)=>a-b);
 const states=times.map(t=>motionAt(motion,t));
 const positions=states.map((state,i)=>i===times.length-1?scenario.finalPosition:state.position);
 const velocities=states.map((state,i)=>i===times.length-1?scenario.finalVelocity:state.velocity);
 const horizontal=times.map(t=>motionAt({s0:0,v0:scenario.horizontalVelocity??0,a:0},t).position);
 return {times,positions,velocities,horizontal};
}
