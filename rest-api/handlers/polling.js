async function checkRepairStatus(prisma, requestId) {
  try {
    const result = await prisma.repair.findFirst({
      where: { requestId },
    })
    if (!result) {
      throw new Error(`Repair with requestId ${requestId} not found`);
    }
    return result.status
  } catch (error) {
    console.error('Error checking repair status:', error.message);
    throw error;
  }
}

async function pollRepairStatus(prisma, requestId, interval, maxAttempts) {
  let attempts = 0;
  let status
  while (attempts < maxAttempts) {
    status = await checkRepairStatus(prisma, requestId);

    if (status === 'DONE' || status === 'FAILED') {
      console.log(`Repair status: ${status}`);
      break;
    }

    console.log(`Attempt ${attempts + 1} - Status: ${status}`);
    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  if (attempts >= maxAttempts) {
    console.log('Max attempts reached. Could not get final status.');
  }
}

module.exports = {
  pollRepairStatus,
  checkRepairStatus
}