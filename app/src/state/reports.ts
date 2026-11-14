import type { ReportScene } from '@/data/reports.sample';

/**
 * DEMO: which scene the report camera shows. Each report you finish moves to the next one, so all
 * three designed cases can be seen: a normal spot (R1·1), a hazard (R1·1b) and a spot that was
 * already reported (R1·2c). In memory only.
 */
const SCENES: readonly ReportScene[] = ['normal', 'hazard', 'already'];
let finished = 0;

export const currentScene = (): ReportScene => SCENES[finished % SCENES.length];

export function finishReport() {
  finished += 1;
}
