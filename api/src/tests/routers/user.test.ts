import User, { TUser } from "../../models/user";
import { hashPassword } from "../../utils/bcrypt";
import env from "../../utils/env";
import { encodeJwt } from "../../utils/jwt";
import { mockSendMail, testApp } from "../setupFile";
import jwt from "jsonwebtoken";

describe("/user/register", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("missing request data", async () => {
    const response = await testApp.post("/user/register").send({});
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        firstName: ["Required"],
        lastName: ["Required"],
        email: ["Required"],
        password: ["Required"],
      },
    });
  });
  it("invalid request data", async () => {
    const response = await testApp.post("/user/register").send({
      firstName: 1,
      lastName: 1,
      email: 1,
      password: 1,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        firstName: ["Expected string, received number"],
        lastName: ["Expected string, received number"],
        email: ["Expected string, received number"],
        password: ["Expected string, received number"],
      },
    });
  });
  it("invalid email and password", async () => {
    const response = await testApp.post("/user/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      password: "password",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Email is invalid"],
        password: [
          "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ],
      },
    });
  });
  it("email already exists", async () => {
    await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: "Password1!",
    });
    const response = await testApp.post("/user/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: "Password1!",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "email already exists",
      status: 400,
      data: {},
    });
  });
  it("valid registration", async () => {
    await User.deleteMany({});
    const response = await testApp.post("/user/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: "Password1!",
    });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {},
    });
    const user = await User.findOne({ email: "valid@email.com" });
    expect(user).toBeTruthy();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: env.EMAIL_ADDRESS,
      to: "valid@email.com",
      subject: "Kacify register verification",
      text: `Your verification code is: ${user?.verificationCode}`,
    });
  });
});

describe("/user/login", () => {
  beforeEach(async () => {
    await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("missing request data", async () => {
    const response = await testApp.post("/user/login").send({});
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Required"],
        password: ["Required"],
      },
    });
  });
  it("invalid request data", async () => {
    const response = await testApp.post("/user/login").send({
      email: 1,
      password: 1,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Expected string, received number"],
        password: ["Expected string, received number"],
      },
    });
  });
  it("email not found", async () => {
    const response = await testApp.post("/user/login").send({
      email: "notfound@email.com",
      password: "Password1!",
    });
    expect(response.body).toEqual({
      success: false,
      code: "unauthorized",
      message: "unauthorized",
      status: 401,
      data: {},
    });
  });
  it("email not verified", async () => {
    const response = await testApp.post("/user/login").send({
      email: "valid@email.com",
      password: "Password1!",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "email not verified",
      status: 400,
      data: {},
    });
  });
  it("invalid password", async () => {
    await User.updateMany({}, { emailVerified: true });
    const response = await testApp.post("/user/login").send({
      email: "valid@email.com",
      password: "invalidpassword",
    });
    expect(response.body).toEqual({
      success: false,
      code: "unauthorized",
      message: "unauthorized",
      status: 401,
      data: {},
    });
  });
  it("valid login", async () => {
    await User.updateMany({}, { emailVerified: true });
    const response = await testApp.post("/user/login").send({
      email: "valid@email.com",
      password: "Password1!",
    });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {
        authToken: expect.any(String),
      },
    });
  });
});

describe("/user/verifyEmail", () => {
  beforeEach(async () => {
    await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("missing request data", async () => {
    const response = await testApp.post("/user/verifyEmail").send({});
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Required"],
        verificationCode: ["Required"],
      },
    });
  });
  it("invalid request data", async () => {
    const response = await testApp.post("/user/verifyEmail").send({
      email: 1,
      verificationCode: "invalid",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Expected string, received number"],
        verificationCode: ["Expected number, received string"],
      },
    });
  });
  it("email not found", async () => {
    const response = await testApp.post("/user/verifyEmail").send({
      email: "notfound@email.com",
      verificationCode: 123456,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {},
    });
  });
  it("invalid verification code", async () => {
    const response = await testApp.post("/user/verifyEmail").send({
      email: "valid@email.com",
      verificationCode: -1,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {},
    });
  });
  it("valid request", async () => {
    await User.updateMany(
      {},
      { emailVerified: false, verificationCode: 123456 }
    );
    const response = await testApp.post("/user/verifyEmail").send({
      email: "valid@email.com",
      verificationCode: 123456,
    });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {},
    });
  });
});

describe("/user/profile", () => {
  let user: TUser;
  beforeEach(async () => {
    user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("without auth", async () => {
    const response = await testApp.get("/user/profile");
    expect(response.body).toEqual({
      success: false,
      code: "unauthorized",
      message: "unauthorized",
      status: 401,
      data: {},
    });
  });
  it("with auth - incorrect secret", () => {
    const encodedJwt = jwt.sign({ _id: user._id }, "differentSecret");
    return testApp
      .get("/user/profile")
      .set("Authorization", encodedJwt)
      .expect({
        success: false,
        code: "internalServerError",
        message: "internal server error",
        status: 500,
        data: {},
      });
  });
  it("with auth - right secret - incorrect payload", () => {
    const encodedJwt = encodeJwt({ differentKey: user._id });
    return testApp
      .get("/user/profile")
      .set("Authorization", encodedJwt)
      .expect({
        success: false,
        code: "unauthorized",
        message: "unauthorized",
        status: 401,
        data: {},
      });
  });
  it("with auth - right secret - right payload - incorrect header", () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    return testApp
      .get("/user/profile")
      .set("IncorrectHeader", encodedJwt)
      .expect({
        success: false,
        code: "unauthorized",
        message: "unauthorized",
        status: 401,
        data: {},
      });
  });
  it("with auth - right secret - right payload - right header key - incorrect header value", () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    return testApp
      .get("/user/profile")
      .set("Authorization", "Invalid " + encodedJwt)
      .expect({
        success: false,
        code: "internalServerError",
        message: "internal server error",
        status: 500,
        data: {},
      });
  });
  it("with auth - right secret - right payload - right header - email not verified", () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    return testApp
      .get("/user/profile")
      .set("Authorization", encodedJwt)
      .expect({
        success: false,
        status: 401,
        message: "email not verified",
        code: "unauthorized",
        data: {},
      });
  });
  it("with auth - right secret - right payload - right header - email verified", async () => {
    await User.updateMany({}, { emailVerified: true });
    const encodedJwt = encodeJwt({ _id: user._id });
    return testApp
      .get("/user/profile")
      .set("Authorization", encodedJwt)
      .expect({
        success: true,
        status: 200,
        message: "success",
        code: "success",
        data: {
          _id: user._id.toString(),
          firstName: "John",
          lastName: "Doe",
          email: "valid@email.com",
          emailVerified: true,
          image: null,
        },
      });
  });
});

describe("/user/forgotPassword", () => {
  let user: TUser;
  beforeEach(async () => {
    user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("missing request data", async () => {
    const response = await testApp.post("/user/forgotPassword").send({});
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Required"],
      },
    });
  });
  it("invalid request data", async () => {
    const response = await testApp.post("/user/forgotPassword").send({
      email: 1,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Expected string, received number"],
      },
    });
  });
  it("email not found", async () => {
    const response = await testApp.post("/user/forgotPassword").send({
      email: "notfound@email.com",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {},
    });
  });
  it("valid request", async () => {
    const response = await testApp.post("/user/forgotPassword").send({
      email: "valid@email.com",
    });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {},
    });
    await user.refresh();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: env.EMAIL_ADDRESS,
      to: "valid@email.com",
      subject: "Kacify forgot password verification",
      text: `Your verification code is: ${user?.forgotPasswordVerificationCode}`,
    });
  });
});

describe("/user/changePassword", () => {
  let user: TUser;
  beforeEach(async () => {
    user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("missing request data", async () => {
    const response = await testApp.post("/user/changePassword").send({});
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Required"],
        verificationCode: ["Required"],
        password: ["Required"],
      },
    });
  });
  it("invalid request data", async () => {
    const response = await testApp.post("/user/changePassword").send({
      email: 1,
      verificationCode: "invalid",
      password: 1,
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Expected string, received number"],
        verificationCode: ["Expected number, received string"],
        password: ["Expected string, received number"],
      },
    });
  });
  it("invalid email and password", async () => {
    const response = await testApp.post("/user/changePassword").send({
      email: "invalid-email",
      verificationCode: -1,
      password: "password",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Email is invalid"],
        password: [
          "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ],
      },
    });
  });
  it("email not found", async () => {
    const response = await testApp.post("/user/changePassword").send({
      email: "notfound@email.com",
      verificationCode: -1,
      password: "Password2!",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {},
    });
  });
  it("invalid verification code", async () => {
    await User.updateMany({}, { forgotPasswordVerificationCode: 123456 });
    const response = await testApp.post("/user/changePassword").send({
      email: "valid@email.com",
      verificationCode: -1,
      password: "Password2!",
    });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {},
    });
  });
  it("valid request", async () => {
    await User.updateMany({}, { forgotPasswordVerificationCode: 123456 });
    expect(user.comparePassword("Password1!")).toBe(true);
    const response = await testApp.post("/user/changePassword").send({
      email: "valid@email.com",
      verificationCode: 123456,
      password: "Password2!",
    });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {},
    });
    await user.refresh();
    expect(user.forgotPasswordVerificationCode).toBeNull();
    expect(user.comparePassword("Password2!")).toBe(true);
    expect(user.comparePassword("Password1!")).toBe(false);
  });
});

describe("/user/edit", () => {
  let user: TUser;
  beforeEach(async () => {
    user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "valid@email.com",
      password: hashPassword("Password1!"),
      emailVerified: true,
    });
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("without auth", async () => {
    const response = await testApp.put("/user/edit").send({});
    expect(response.body).toEqual({
      success: false,
      code: "unauthorized",
      message: "unauthorized",
      status: 401,
      data: {},
    });
  });
  it("without email verification", async () => {
    await User.updateMany({}, { emailVerified: false });
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({});
    expect(response.body).toEqual({
      success: false,
      code: "unauthorized",
      message: "email not verified",
      status: 401,
      data: {},
    });
  });
  it("invalid request data", async () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({
        firstName: 1,
        lastName: 1,
        email: 1,
        password: 1,
        image: 1,
      });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        firstName: ["Expected string, received number"],
        lastName: ["Expected string, received number"],
        email: ["Expected string, received number"],
        password: ["Expected string, received number"],
        image: ["Expected string, received number"],
      },
    });
  });
  it("invalid email, password and image", async () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({
        email: "invalid-email",
        password: "password",
        image: "invalid-image",
      });
    expect(response.body).toEqual({
      success: false,
      code: "badRequest",
      message: "bad request",
      status: 400,
      data: {
        email: ["Email is invalid"],
        password: [
          "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ],
        image: ["Image is invalid"],
      },
    });
  });
  it("update optional fields", async () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({
        firstName: "Jane",
        lastName: "Smith",
      });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {
        _id: user._id.toString(),
        firstName: "Jane",
        lastName: "Smith",
        email: "valid@email.com",
        emailVerified: true,
        image: null,
      },
    });
    await user.refresh();
    expect(user.firstName).toBe("Jane");
    expect(user.lastName).toBe("Smith");
    expect(mockSendMail).not.toHaveBeenCalled();
  });
  it("valid request", async () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({
        firstName: "Jane",
        lastName: "Smith",
        email: "validToo@email.com",
        password: "Password2!",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wQACfsD/QkhH1oAAAAASUVORK5CYII=",
      });
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {
        _id: user._id.toString(),
        firstName: "Jane",
        lastName: "Smith",
        email: "validToo@email.com",
        emailVerified: false,
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wQACfsD/QkhH1oAAAAASUVORK5CYII=",
      },
    });
    await user.refresh();
    expect(user.firstName).toBe("Jane");
    expect(user.lastName).toBe("Smith");
    expect(user.email).toBe("validToo@email.com");
    expect(user.emailVerified).toBe(false);
    expect(user.image).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wQACfsD/QkhH1oAAAAASUVORK5CYII="
    );
    expect(user.comparePassword("Password2!")).toBe(true);
    expect(user.verificationCode).toBeTruthy();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: env.EMAIL_ADDRESS,
      to: "validToo@email.com",
      subject: "Kacify update email verification",
      text: `Your verification code is: ${user?.verificationCode}`,
    });
  });
  it("limit exceeding 10mb", async () => {
    const encodedJwt = encodeJwt({ _id: user._id });
    const response = await testApp
      .put("/user/edit")
      .set("Authorization", encodedJwt)
      .send({
        image: "data:image/png;base64," + "a".repeat(10 * 1024 * 1024 / 100),
      });
    expect(response.body).toEqual({
      success: false,
      code: "internalServerError",
      message: "internal server error",
      status: 500,
      data: {},
    });
  });
});
