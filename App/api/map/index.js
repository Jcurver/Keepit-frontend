import { KI, KInoHeader } from 'api/index.js';

export const getGroupMapPins = async ({ groupId }) => {
  return await KI.get(`/places/groups/${groupId}/pins`);
};
