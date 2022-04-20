const ApiError = require("../exeptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnautharizedError());
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnautharizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnautharizedError());
        }

        req.user = userData;
        next();
    } catch(e) {
        return next(ApiError.UnautharizedError());
    }
}