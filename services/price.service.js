function calculateVideoCost(videoCostForFirstMinute, videoCallMinutes) {
  return (
    (videoCostForFirstMinute * videoCallMinutes * (videoCallMinutes + 1)) / 2
  );
}

function calculateTimeCost(timeInMinutes, tiers) {
  for (const tier of tiers) {
    if (timeInMinutes <= tier.maxTime) {
      return tier.cost;
    }
  }
  return tiers[tiers.length - 1].cost;
}

function calculateTotalCostOfServiceAndProduct(
  distance,
  pricePerKm,
  platformFee,
  timeTaken,
  videoCostForFirstMinute,
  videoCallMinutes
) {
  let deliveryCost =
    distance * pricePerKm + platformFee + Math.max(0, (timeTaken - 30) * 0.5);
  let videoCost = calculateVideoCost(videoCostForFirstMinute, videoCallMinutes);
  return deliveryCost + videoCost;
}

function calculateCappedTimeCost(timeInSeconds) {
  let timeInMinutes = timeInSeconds / 60;
  const tiers = [
    { maxTime: 10, cost: 9 },
    { maxTime: 20, cost: 19 },
    { maxTime: 30, cost: 29 },
  ];
  return calculateTimeCost(timeInMinutes, tiers);
}

function calculateIncrementalTimeCost(timeInSeconds) {
  let timeInMinutes = timeInSeconds / 60;
  const tiers = [
    { maxTime: 10, cost: 9 },
    { maxTime: 20, cost: 19 },
    { maxTime: 30, cost: 29 },
  ];

  if (timeInMinutes <= 30) {
    return calculateTimeCost(timeInMinutes, tiers);
  }

  let extraTimeSlots = Math.ceil((timeInMinutes - 30) / 10);
  return 29 + extraTimeSlots * 10;
}

function calculateQuickLookupCost(
  distance,
  pricePerKm,
  platformFee,
  videoCallSeconds,
  videoCostForFirstMinute
) {
  let deliveryCost = distance * pricePerKm + platformFee;
  let videoMinutes = Math.ceil(videoCallSeconds / 60);
  let videoCost = calculateVideoCost(videoCostForFirstMinute, videoMinutes);
  return parseFloat((deliveryCost + videoCost).toFixed(2));
}

export {
  calculateTotalCostOfServiceAndProduct,
  calculateCappedTimeCost,
  calculateIncrementalTimeCost,
  calculateQuickLookupCost,
};
