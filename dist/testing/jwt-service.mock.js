"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtServiveMock = void 0;
const jwt_1 = require("@nestjs/jwt");
const jwt_payload_mock_1 = require("./jwt-payload.mock");
const access_token_mock_1 = require("./access-token.mock"); // ✅ Certifique-se de importar corretamente
exports.jwtServiveMock = {
    provide: jwt_1.JwtService,
    useValue: {
        sign: jest.fn().mockImplementation(() => {
            return access_token_mock_1.accessToken;
        }),
        verify: jest.fn().mockReturnValue(jwt_payload_mock_1.jwtPayload),
    },
};
