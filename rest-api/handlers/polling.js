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

module.exports = {
  checkRepairStatus
}