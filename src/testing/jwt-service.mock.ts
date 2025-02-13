
import { JwtService } from "@nestjs/jwt";
import { jwtPayload } from "./jwt-payload.mock";
import { accessToken } from "./access-token.mock"; // ✅ Certifique-se de importar corretamente

export const jwtServiveMock = {
    provide: JwtService,
    useValue: {
        sign: jest.fn().mockImplementation(() => {
            
            return accessToken;
        }), 
        verify: jest.fn().mockReturnValue(jwtPayload),
    },
};
