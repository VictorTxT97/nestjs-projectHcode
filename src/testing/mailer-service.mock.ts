
import { MailerService } from "@nestjs-modules/mailer"


export const mailerServiveMock = {
    
        provide: MailerService,
        
        useValue: {
            sendMail: jest.fn(),
            
        },
    
}