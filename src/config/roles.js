const allRoles = {
  user: [],
  admin: ['manageUsers', 'manageHomes'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
