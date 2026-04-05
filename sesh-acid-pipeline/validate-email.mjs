/**
 * Email Validation — Beyond MX Check
 *
 * Level 1: MX record check (domain accepts email)
 * Level 2: SMTP probe (connect to MX, try RCPT TO — catches many invalid addresses)
 * Level 3: Pattern detection (flags fabricated firstname@company.com patterns)
 *
 * Usage: node validate-email.mjs <email>
 * Exit codes: 0 = likely valid, 1 = likely invalid, 2 = uncertain
 */

import { createConnection } from 'net';
import { resolveMx } from 'dns';
import { promisify } from 'util';

const resolveMxAsync = promisify(resolveMx);

// ── Fabricated email pattern detection ──

const FABRICATED_PREFIXES = [
  'info', 'team', 'hello', 'contact', 'support', 'admin', 'office',
  'sales', 'help', 'service', 'general', 'mail', 'enquiries', 'inquiries',
];

const CORPORATE_DOMAINS = [
  'sutton.com', 'remax.com', 'century21.com', 'royallepage.com', 'kw.com',
  'coldwellbanker.com', 'sothebys.com', 'chestnutpark.com',
];

function detectFabricatedPattern(email) {
  const [local, domain] = email.split('@');
  const warnings = [];

  // Check generic prefixes
  if (FABRICATED_PREFIXES.includes(local.toLowerCase())) {
    warnings.push(`Generic prefix "${local}" — likely fabricated for small business`);
  }

  // Check firstname@corporate-domain (the exact pattern that bounced)
  // Pattern: single word (no dots/numbers) @ known corporate domain
  if (/^[a-z]+$/i.test(local) && !local.includes('.')) {
    const isCorpDomain = CORPORATE_DOMAINS.some((d) => domain.toLowerCase() === d);
    if (isCorpDomain) {
      warnings.push(
        `Pattern "${local}@${domain}" looks fabricated — corporate domains rarely use firstname-only addresses. Try firstname.lastname@domain or look for a personal Gmail/Outlook.`
      );
    }
  }

  // Check firstnamelastname@corporate (also common fabrication)
  if (/^[a-z]{2,}[a-z]{2,}$/i.test(local) && local.length > 8) {
    warnings.push(
      `"${local}@${domain}" may be a guess — verify this address exists on their website or social media`
    );
  }

  return warnings;
}

// ── SMTP Probe ──

function smtpProbe(email, mxHost, timeout = 10000) {
  return new Promise((resolve) => {
    const results = { connected: false, accepted: false, rejected: false, error: null };
    const socket = createConnection(25, mxHost);
    let step = 0;
    let buffer = '';

    const timer = setTimeout(() => {
      socket.destroy();
      results.error = 'timeout';
      resolve(results);
    }, timeout);

    socket.on('data', (data) => {
      buffer += data.toString();

      if (step === 0 && buffer.includes('220')) {
        // Server greeting — send EHLO
        results.connected = true;
        socket.write('EHLO verify.local\r\n');
        step = 1;
        buffer = '';
      } else if (step === 1 && buffer.includes('250')) {
        // EHLO accepted — send MAIL FROM
        socket.write('MAIL FROM:<verify@verify.local>\r\n');
        step = 2;
        buffer = '';
      } else if (step === 2 && buffer.includes('250')) {
        // MAIL FROM accepted — send RCPT TO (the actual check)
        socket.write(`RCPT TO:<${email}>\r\n`);
        step = 3;
        buffer = '';
      } else if (step === 3) {
        if (buffer.includes('250') || buffer.includes('251')) {
          results.accepted = true;
        } else if (
          buffer.includes('550') ||
          buffer.includes('551') ||
          buffer.includes('553') ||
          buffer.includes('554') ||
          buffer.includes('521')
        ) {
          results.rejected = true;
        }
        // Send QUIT and close
        socket.write('QUIT\r\n');
        clearTimeout(timer);
        setTimeout(() => {
          socket.destroy();
          resolve(results);
        }, 1000);
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      results.error = err.message;
      resolve(results);
    });

    socket.on('close', () => {
      clearTimeout(timer);
      resolve(results);
    });
  });
}

// ── Main ──

async function main() {
  const email = process.argv[2];
  if (!email || !email.includes('@')) {
    console.error('Usage: node validate-email.mjs <email>');
    process.exit(1);
  }

  const [local, domain] = email.split('@');
  console.log(`\n  Validating: ${email}\n`);

  // ── Level 1: MX Check ──
  let mxRecords;
  try {
    mxRecords = await resolveMxAsync(domain);
    mxRecords.sort((a, b) => a.priority - b.priority);
    console.log(`  ✓ MX records found: ${mxRecords[0].exchange} (priority ${mxRecords[0].priority})`);
  } catch {
    console.log(`  ✗ NO MX records for ${domain} — email will bounce`);
    process.exit(1);
  }

  // ── Level 2: Pattern Detection ──
  const fabricationWarnings = detectFabricatedPattern(email);
  if (fabricationWarnings.length > 0) {
    console.log(`  ⚠️  FABRICATION WARNING:`);
    for (const w of fabricationWarnings) {
      console.log(`     ${w}`);
    }
  }

  // ── Level 3: SMTP Probe ──
  console.log(`\n  Probing ${mxRecords[0].exchange}:25 ...`);
  const probe = await smtpProbe(email, mxRecords[0].exchange, 15000);

  if (probe.error) {
    console.log(`  ⚠️  SMTP probe inconclusive: ${probe.error}`);
    console.log(`     (Many servers block port 25 probes — this doesn't mean the email is invalid)`);

    if (fabricationWarnings.length > 0) {
      console.log(`\n  VERDICT: UNCERTAIN — MX exists but address looks fabricated and SMTP probe failed`);
      console.log(`  RECOMMENDATION: Find a different email (personal Gmail/Outlook) or verify on their website`);
      process.exit(2);
    } else {
      console.log(`\n  VERDICT: UNCERTAIN — MX valid, SMTP probe blocked. Proceed with caution.`);
      process.exit(2);
    }
  } else if (probe.rejected) {
    console.log(`  ✗ SMTP server REJECTED ${email} — this address does not exist`);
    console.log(`\n  VERDICT: INVALID — do NOT use this email`);
    process.exit(1);
  } else if (probe.accepted) {
    console.log(`  ✓ SMTP server accepted ${email}`);
    if (fabricationWarnings.length > 0) {
      console.log(`\n  VERDICT: LIKELY VALID (SMTP accepted) but pattern looks fabricated — verify manually`);
      process.exit(0);
    } else {
      console.log(`\n  VERDICT: VALID — email exists`);
      process.exit(0);
    }
  } else {
    console.log(`  ⚠️  SMTP probe connected but gave no clear answer`);
    console.log(`\n  VERDICT: UNCERTAIN`);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(2);
});
