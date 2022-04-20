module.exports = class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnautharizedError() {
        return new ApiError(401, "Unautharized user")
    }
    static BadRequest(message, error = []) {
        return new ApiError(400, message, error)
    }

}