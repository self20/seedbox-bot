import { httpRequest } from "../components/Http";
import { cookieJars } from "../mem/CookieJars";
import request from "request";
import urlJoin from "url-join";

//TODO: 在调用处，LoginQb返回false时做相应处理
//TODO: cookie过期时间？
async function LoginQb(boxConfig) {
  let cookieJar = request.jar();

  if (!boxConfig.username || !boxConfig.password) {
    cookieJars[boxConfig.url] = cookieJar;
    return true;
  }

  console.log("Posting LoginQb Request", urlJoin(boxConfig.url, '/login'));
  let result = await httpRequest({
    jar: cookieJar,
    url: urlJoin(boxConfig.url, '/login'),
    form: { username: boxConfig.username, password: boxConfig.password },
    auth: { username: boxConfig.basic_auth_username, password: boxConfig.basic_auth_password },
    method: "POST",
  });
  console.log("LoginQb Request Result:", result.errors, result.body, result.response ? result.response.statusCode : null);

  if (result.errors || result.response.statusCode !== 200) {
    return false;
  }
  cookieJars[boxConfig.url] = cookieJar;
  return true;
}

export { LoginQb };