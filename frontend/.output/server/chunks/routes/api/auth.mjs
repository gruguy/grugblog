import service from './request.mjs';
import 'axios';
import 'pinia';
import 'vue';

const login = (params) => {
  return service.post(
    "/auth/login",
    params
  );
};
const register = (params) => {
  return service.post(
    "/auth/register",
    params
  );
};
const getUserInfo = () => {
  return service.get("/auth/user");
};
const logout = () => {
  return service.post("/auth/logout");
};

export { getUserInfo, login, logout, register };
//# sourceMappingURL=auth.mjs.map
