type TestAuthUser = {
  userId: string;
  role: string;
  email: string;
};

type HeaderCapableRequest<T> = {
  set(name: string, value: string): T;
};

const defaultTestAuthUser: TestAuthUser = {
  userId: "user-1",
  role: "MEMBER",
  email: "tester@example.com",
};

export function createHeaderAuthMiddleware() {
  return (req: any, res: any, next: any) => {
    const userId = req.header("x-test-user-id");
    const role = req.header("x-test-role");

    if (!userId || !role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: userId,
      email: defaultTestAuthUser.email,
      role,
    };

    next();
  };
}

export function createAuthMiddlewareMock() {
  return {
    authMiddleware: createHeaderAuthMiddleware(),
  };
}

export function createNoopMiddleware() {
  return (_req: any, _res: any, next: any) => next();
}

export function createAuthRateLimitMocks() {
  return {
    authGeneralLimiter: createNoopMiddleware(),
    authLoginLimiter: createNoopMiddleware(),
  };
}

export function withTestAuth<T>(
  request: HeaderCapableRequest<T>,
  user: Partial<TestAuthUser> = {},
) {
  const resolvedUser = {
    ...defaultTestAuthUser,
    ...user,
  };

  return request
    .set("x-test-user-id", resolvedUser.userId)
    .set("x-test-role", resolvedUser.role);
}
