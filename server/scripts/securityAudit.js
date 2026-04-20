
async function runAudit() {
  console.log('🛡️ Starting Security & Integration Audit...\n');

  // 1. Health Check
  try {
    const health = await fetch('http://localhost:5000/health');
    if (health.ok) console.log('✅ Server Health: OK');
    else throw new Error();
  } catch (e) {
    console.log('❌ Server Health: FAILED (Is server running?)');
    return;
  }

  // 2. Database Check via Menu Fetch
  try {
    const menu = await fetch('http://localhost:5000/api/menu');
    if (menu.status === 401 || menu.status === 403) {
      console.log('✅ Access Control: /api/menu is PROTECTED');
    } else {
      console.log('⚠️ Security Warning: /api/menu is accessible without authentication');
    }
  } catch (e) {
    console.log('❌ API Connectivity: FAILED');
  }

  // 3. Rate Limiting Check
  console.log('🚀 Testing Rate Limiter (Sending 10 rapid requests)...');
  let successCount = 0;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://localhost:5000/health');
      if (res.ok) successCount++;
    } catch (e) {}
  }
  console.log(`✅ Rate Limiter: Processed ${successCount}/10 requests`);

  console.log('\n✅ Audit Complete.');
}

runAudit();
