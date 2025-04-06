function calculateTotalCostOfServiceAndProduct(
  distance,
  pricePerKm,
  platformFee,
  timeTaken,
  videoChatFee,
  videoCallMinutes
) {
  let deliveryCost =
    distance * pricePerKm + platformFee + Math.max(0, (timeTaken - 30) * 0.5);
  let videoCost = videoChatFee * videoCallMinutes;
  return deliveryCost + videoCost;
}

function calculateQuickLookupCost(
  distance,
  pricePerKm,
  platformFee,
  videoCallSeconds,
  videoChatFee
) {
  let deliveryCost = distance * pricePerKm + platformFee;
  let videoMinutes = Math.ceil(videoCallSeconds / 60);
  let videoCost = videoChatFee * videoMinutes;
  return parseFloat((deliveryCost + videoCost).toFixed(2));
}

export { calculateTotalCostOfServiceAndProduct, calculateQuickLookupCost };
