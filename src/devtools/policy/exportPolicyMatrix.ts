import { Role } from '../../domain/Role';
import { BusinessEvent } from '../../domain/BusinessEvent';
import { BusinessState } from '../../cores/StateMachine';
import { decideTransaction } from '../../domain/commands/guard/transactionGuard';
import { writeFileSync } from 'fs';
import { join } from 'path';

const roles = Object.values(Role);
const events = Object.values(BusinessEvent);

// 你认可的“候选状态迁移”
const transitions: Array<[BusinessState, BusinessState]> = [
  [BusinessState.S02, BusinessState.S03],
  [BusinessState.S03, BusinessState.S04],
];

function decisionToSymbol(result: any) {
  if (result.result === 'APPROVED') return '✅';
  if (result.reasonCode === 'INVALID_STATE_TRANSITION') return '⚠️';
  
  return '❌';
}

function exportMatrix() {
  let md = `# Transaction Policy Matrix\n\n`;
  md += `Legend:\n`;
  md += `- ✅ APPROVED\n`;
  md += `- ❌ DENIED (RBAC)\n`;
  md += `- ⚠️ DENIED (Invalid State)\n\n`;

  for (const event of events) {
    md += `## Event: ${event}\n\n`;

    // table header
    md += `| Role \\ State Transition |`;
    for (const [from, to] of transitions) {
      md += ` ${from} → ${to} |`;
    }
    md += `\n`;

    md += `|------------------------|`;
    for (let i = 0; i < transitions.length; i++) {
      md += `-----------|`;
    }
    md += `\n`;

    for (const role of roles) {
      md += `| ${role} |`;

      for (const [from, to] of transitions) {
        const decision = decideTransaction({
          entityId: 'policy-check',
          fromState: from,
          toState: to,
          event,
          actorRole: role,
        });

        md += ` ${decisionToSymbol(decision)} |`;
      }

      md += `\n`;
    }

    md += `\n`;
  }

  const outputPath = join(process.cwd(), 'docs/policy-matrix.md');
  writeFileSync(outputPath, md, 'utf-8');

  console.log(`✅ Policy Matrix exported to ${outputPath}`);
}

exportMatrix();
