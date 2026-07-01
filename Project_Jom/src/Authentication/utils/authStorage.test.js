import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const storage = new MemoryStorage();
global.localStorage = storage;

const { registerUser, loginUser } = await import('./authStorage.js');

test('registerUser stores a user and profile for later login', () => {
  const result = registerUser({
    name: 'Ava',
    email: 'ava@example.com',
    password: 'secret123',
    demoResidentId: 'youngStudent',
  });

  assert.equal(result.user.displayName, 'Ava');
  assert.equal(result.profile.demoResidentId, 'youngStudent');
  assert.equal(storage.getItem('registeredUsers').includes('ava@example.com'), true);
});

test('loginUser succeeds with matching credentials and returns the saved session payload', () => {
  const result = loginUser({ email: 'ava@example.com', password: 'secret123' });

  assert.equal(result.user.email, 'ava@example.com');
  assert.equal(result.profile.demoResidentId, 'youngStudent');
});

test('loginUser rejects an incorrect password', () => {
  assert.throws(
    () => loginUser({ email: 'ava@example.com', password: 'wrong' }),
    /Invalid email or password/
  );
});
