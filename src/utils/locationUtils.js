const EARTH_RADIUS_METRES = 6371000;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function calculateDistance(
  firstLatitude,
  firstLongitude,
  secondLatitude,
  secondLongitude
) {
  const latitudeDifference = toRadians(
    secondLatitude - firstLatitude
  );

  const longitudeDifference = toRadians(
    secondLongitude - firstLongitude
  );

  const firstLatitudeRadians = toRadians(firstLatitude);
  const secondLatitudeRadians = toRadians(secondLatitude);

  const calculation =
    Math.sin(latitudeDifference / 2) *
      Math.sin(latitudeDifference / 2) +
    Math.cos(firstLatitudeRadians) *
      Math.cos(secondLatitudeRadians) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const angularDistance =
    2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));

  return EARTH_RADIUS_METRES * angularDistance;
}

export function formatDistance(distanceInMetres) {
  if (distanceInMetres === null || distanceInMetres === undefined) {
    return "Distance unavailable";
  }

  if (distanceInMetres < 1000) {
    return `${Math.round(distanceInMetres)} m away`;
  }

  return `${(distanceInMetres / 1000).toFixed(1)} km away`;
}