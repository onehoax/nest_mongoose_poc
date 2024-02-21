/*
===============================================================
========================= Inserts =============================
===============================================================
*/

// ==================== Permissions ========================

db.permissions.insertMany([
  {
    module: "user",
    path: "/api/user",
    method: "post",
    description: "create users",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    module: "user",
    path: "/api/user",
    method: "get",
    description: "view users",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// ======================= Roles ===========================

const createUsersPermission = db.permissions.findOne({
  $and: [{ module: "user" }, { method: "post" }],
});
const viewUsersPermission = db.permissions.findOne({
  $and: [{ module: "user" }, { method: "get" }],
});

db.roles.insertMany([
  {
    slug: "admin",
    name: "Admin",
    permissions: [createUsersPermission._id, viewUsersPermission._id],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "test",
    name: "Test",
    permissions: [viewUsersPermission._id],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// ======================= Users ===========================

const adminRole = db.roles.findOne({
  slug: "admin",
});
const testRole = db.roles.findOne({
  slug: "test",
});

db.usertests.insertMany([
  {
    fullName: "Super User",
    userName: "super",
    email: "super@email.com",
    password: "$2b$10$xnruAmWKJtvUuNm9dDVRS.YJFB62DqKoQetjDtFxSXB7CQCY0Trxq",
    status: "1",
    language: "en",
    role: adminRole._id,
    isSuperUser: true,
    refreshToken: "",
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);
