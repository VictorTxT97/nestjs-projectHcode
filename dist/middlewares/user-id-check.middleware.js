"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdCheckMiddleware = void 0;
const common_1 = require("@nestjs/common");
class UserIdCheckMiddleware {
    use(req, res, next) {
        if (isNaN(Number(req.params.id)) || Number(req.params.id) < 0) {
            throw new common_1.BadRequestException('Invalid ID');
        }
        next();
    }
}
exports.UserIdCheckMiddleware = UserIdCheckMiddleware;
