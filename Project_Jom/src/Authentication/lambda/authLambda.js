const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { createHash, randomUUID } = require("crypto");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const USERS_TABLE = process.env.USERS_TABLE || "Users";
const PROFILES_TABLE = process.env.PROFILES_TABLE || "UserProfiles";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

const DEMO_RESIDENTS = {
  seniorResident: {
    demoResidentId: "seniorResident",
    displayName: "Mdm Lim Siew Lan",
    profileType: "Senior Resident",
    age: 68,
    residentialStatus: "Citizen",
    housingType: "4-room HDB",
    householdType: "Single senior household",
    employmentStatus: "Retired",
    incomeBand: "Low income",
    maritalStatus: "Widowed",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  },
  workingAdult: {
    demoResidentId: "workingAdult",
    displayName: "Tan Wei Jie",
    profileType: "Working Adult",
    age: 35,
    residentialStatus: "Citizen",
    housingType: "BTO flat",
    householdType: "Family",
    employmentStatus: "Employed",
    incomeBand: "Middle income",
    maritalStatus: "Married",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  },
  caregiver: {
    demoResidentId: "caregiver",
    displayName: "Nur Aisyah",
    profileType: "Adult Caregiver",
    age: 45,
    residentialStatus: "Citizen",
    housingType: "5-room HDB",
    householdType: "Multi-generation household",
    employmentStatus: "Employed",
    incomeBand: "Middle income",
    maritalStatus: "Married",
    hasChildren: false,
    caregiver: true,
    mobilityNeeds: false,
  },
  youngStudent: {
    demoResidentId: "youngStudent",
    displayName: "Jason Ong",
    profileType: "Student",
    age: 21,
    residentialStatus: "Citizen",
    housingType: "4-room HDB",
    householdType: "Family",
    employmentStatus: "Student",
    incomeBand: "Low income",
    maritalStatus: "Single",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  },
  youngParent: {
    demoResidentId: "youngParent",
    displayName: "Priya Devi",
    profileType: "Young Parent",
    age: 39,
    residentialStatus: "Citizen",
    housingType: "5-room HDB",
    householdType: "Family with children",
    employmentStatus: "Employed",
    incomeBand: "Middle income",
    maritalStatus: "Married",
    hasChildren: true,
    caregiver: false,
    mobilityNeeds: false,
  },
  unemployedResident: {
    demoResidentId: "unemployedResident",
    displayName: "Ahmad Rahman",
    profileType: "Jobseeker",
    age: 48,
    residentialStatus: "Citizen",
    housingType: "3-room HDB",
    householdType: "Single adult household",
    employmentStatus: "Unemployed",
    incomeBand: "Low income",
    maritalStatus: "Divorced",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  },
  mobilitySenior: {
    demoResidentId: "mobilitySenior",
    displayName: "Mdm Chua Mei Ling",
    profileType: "Mobility Support Senior",
    age: 76,
    residentialStatus: "Citizen",
    housingType: "2-room Flexi HDB",
    householdType: "Senior household",
    employmentStatus: "Retired",
    incomeBand: "Low income",
    maritalStatus: "Married",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: true,
  },
  prResident: {
    demoResidentId: "prResident",
    displayName: "Raj Kumar",
    profileType: "Permanent Resident",
    age: 30,
    residentialStatus: "Permanent Resident",
    housingType: "Rental flat",
    householdType: "Single adult household",
    employmentStatus: "Employed",
    incomeBand: "Middle income",
    maritalStatus: "Single",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  },
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

function getRoute(event) {
  return (event.rawPath || event.path || event.requestContext?.http?.path || "/").toLowerCase();
}

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

async function findUserByEmail(email) {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
  );

  return result.Items?.[0] || null;
}

function buildProfileFromResident(resident, userId, displayName, now) {
  return {
    userId,
    demoResidentId: resident.demoResidentId,
    displayName,
    age: resident.age,
    residentialStatus: resident.residentialStatus,
    housingType: resident.housingType,
    householdType: resident.householdType,
    employmentStatus: resident.employmentStatus,
    incomeBand: resident.incomeBand,
    maritalStatus: resident.maritalStatus,
    hasChildren: resident.hasChildren,
    caregiver: resident.caregiver,
    mobilityNeeds: resident.mobilityNeeds,
    updatedAt: now,
  };
}

function buildProfileFromPayload(body, userId, now) {
  const resident = DEMO_RESIDENTS[body.demoResidentId] || null;

  return {
    userId,
    demoResidentId: body.demoResidentId || resident?.demoResidentId || "seniorResident",
    displayName: body.displayName || resident?.displayName || "Resident",
    age: body.age ?? resident?.age ?? null,
    residentialStatus: body.residentialStatus ?? resident?.residentialStatus ?? "Citizen",
    housingType: body.housingType ?? resident?.housingType ?? null,
    householdType: body.householdType ?? resident?.householdType ?? null,
    employmentStatus: body.employmentStatus ?? resident?.employmentStatus ?? null,
    incomeBand: body.incomeBand ?? resident?.incomeBand ?? null,
    maritalStatus: body.maritalStatus ?? resident?.maritalStatus ?? null,
    hasChildren: body.hasChildren ?? resident?.hasChildren ?? false,
    caregiver: body.caregiver ?? resident?.caregiver ?? false,
    mobilityNeeds: body.mobilityNeeds ?? resident?.mobilityNeeds ?? false,
    updatedAt: now,
  };
}

function buildUserRecord({ userId, displayName, email, passwordHash, demoResidentId, now, authProvider = "local" }) {
  return {
    userId,
    authProvider,
    demoResidentId,
    displayName,
    email,
    passwordHash,
    accountStatus: "active",
    consentGiven: false,
    consentTimestamp: null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };
}

exports.handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(200, { message: "CORS OK" });
    }

    const route = getRoute(event);
    const body = typeof event.body === "string" ? JSON.parse(event.body || "{}") : event.body || {};

    if (route.endsWith("/register") || route === "/register") {
      const { name, email, password, demoResidentId } = body;

      if (!name || !email || !password) {
        return response(400, { message: "name, email, and password are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await findUserByEmail(normalizedEmail);
      if (existingUser) {
        return response(409, { message: "An account with this email already exists" });
      }

      const residentKey = DEMO_RESIDENTS[demoResidentId] ? demoResidentId : "seniorResident";
      const resident = DEMO_RESIDENTS[residentKey];
      const now = new Date().toISOString();
      const userId = `user_${randomUUID()}`;
      const passwordHash = hashPassword(password);
      const user = buildUserRecord({
        userId,
        displayName: name,
        email: normalizedEmail,
        passwordHash,
        demoResidentId: resident.demoResidentId,
        now,
      });
      const profile = buildProfileFromResident(resident, userId, name, now);

      await dynamo.send(new PutCommand({ TableName: USERS_TABLE, Item: user }));
      await dynamo.send(new PutCommand({ TableName: PROFILES_TABLE, Item: profile }));

      return response(200, {
        message: "User registered successfully",
        sessionToken: randomUUID(),
        user: {
          userId: user.userId,
          displayName: user.displayName,
          email: user.email,
          demoResidentId: user.demoResidentId,
          accountStatus: user.accountStatus,
        },
        profile,
      });
    }

    if (route.endsWith("/login") || route === "/login") {
      const { email, password } = body;

      if (!email || !password) {
        return response(400, { message: "email and password are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await findUserByEmail(normalizedEmail);
      if (!existingUser) {
        return response(401, { message: "Invalid email or password" });
      }

      const passwordHash = hashPassword(password);
      if (existingUser.passwordHash !== passwordHash) {
        return response(401, { message: "Invalid email or password" });
      }

      const resident = DEMO_RESIDENTS[existingUser.demoResidentId] || DEMO_RESIDENTS.seniorResident;
      const now = new Date().toISOString();
      const profile = buildProfileFromResident(resident, existingUser.userId, existingUser.displayName, now);

      const updatedUser = {
        ...existingUser,
        lastLoginAt: now,
        updatedAt: now,
      };

      await dynamo.send(new PutCommand({ TableName: USERS_TABLE, Item: updatedUser }));
      await dynamo.send(new PutCommand({ TableName: PROFILES_TABLE, Item: profile }));

      return response(200, {
        message: "Login successful",
        sessionToken: randomUUID(),
        user: {
          userId: updatedUser.userId,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          demoResidentId: updatedUser.demoResidentId,
          accountStatus: updatedUser.accountStatus,
        },
        profile,
      });
    }

    if (route.endsWith("/demo-login") || route === "/demo-login") {
      const selectedResident = body.demoResidentId || "seniorResident";
      const resident = DEMO_RESIDENTS[selectedResident];
      if (!resident) {
        return response(400, {
          message: "Invalid demoResidentId",
          availableResidents: Object.keys(DEMO_RESIDENTS),
        });
      }

      const now = new Date().toISOString();
      const userId = `demo_${resident.demoResidentId}`;
      const sessionToken = randomUUID();
      const user = {
        userId,
        authProvider: "demo",
        demoResidentId: resident.demoResidentId,
        displayName: resident.displayName,
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };
      const profile = buildProfileFromResident(resident, userId, resident.displayName, now);

      await dynamo.send(new PutCommand({ TableName: USERS_TABLE, Item: user }));
      await dynamo.send(new PutCommand({ TableName: PROFILES_TABLE, Item: profile }));

      return response(200, {
        message: "Demo resident logged in",
        sessionToken,
        user,
        profile,
        availableResidents: Object.keys(DEMO_RESIDENTS),
      });
    }

    if (route.endsWith("/save-profile") || route === "/save-profile") {
      const { userId, ...profileData } = body;

      if (!userId) {
        return response(400, { message: "userId is required" });
      }

      const now = new Date().toISOString();
      const profile = buildProfileFromPayload({ ...profileData, userId }, userId, now);

      await dynamo.send(new PutCommand({ TableName: PROFILES_TABLE, Item: profile }));

      return response(200, {
        message: "Profile saved successfully",
        profile,
      });
    }

    if (route.endsWith("/get-profile") || route === "/get-profile") {
      const { userId } = body;

      if (!userId) {
        return response(400, { message: "userId is required" });
      }

      const result = await dynamo.send(
        new GetCommand({
          TableName: PROFILES_TABLE,
          Key: { userId },
        })
      );

      return response(200, {
        message: result.Item ? "Profile found" : "Profile not found",
        profile: result.Item || null,
      });
    }

    return response(404, { message: "Route not found" });
  } catch (error) {
    console.error(error);
    return response(500, {
      message: "Authentication failed",
      error: error.message,
    });
  }
};
