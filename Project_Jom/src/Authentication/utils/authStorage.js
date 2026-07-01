const STORAGE_KEY = 'registeredUsers';

function ensureUsersStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

function readUsers() {
  ensureUsersStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function createSessionPayload(user, profile) {
  return {
    sessionToken: `local-${user.id}`,
    user: {
      userId: user.id,
      displayName: user.displayName,
      name: user.displayName,
      email: user.email,
      ...user,
    },
    profile: {
      displayName: user.displayName,
      demoResidentId: profile.demoResidentId,
      ...profile,
    },
  };
}

export function registerUser({
  name,
  displayName,
  email,
  password,
  demoResidentId,
  age,
  residentialStatus,
  housingType,
  householdType,
  employmentStatus,
  incomeBand,
  maritalStatus,
  hasChildren,
  caregiver,
  mobilityNeeds,
}) {
  const users = readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const savedDisplayName = displayName || name;

  const user = {
    id: `local-${Date.now()}`,
    displayName: savedDisplayName,
    email,
    password,
    demoResidentId,
    profile: {
      demoResidentId,
      displayName: savedDisplayName,
      age,
      residentialStatus,
      housingType,
      householdType,
      employmentStatus,
      incomeBand,
      maritalStatus,
      hasChildren,
      caregiver,
      mobilityNeeds,
    },
  };

  users.push(user);
  writeUsers(users);

  const profile = {
    ...user.profile,
    demoResidentId,
    displayName: savedDisplayName,
  };

  return createSessionPayload(user, profile);
}

export function loginUser({ email, password }) {
  const users = readUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const profile = {
    displayName: user.displayName,
    demoResidentId: user.demoResidentId,
    ...(user.profile || {}),
  };

  return createSessionPayload(user, profile);
}
