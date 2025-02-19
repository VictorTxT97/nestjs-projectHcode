
import { FileService } from "../file/file.service";

export const fileServiceMock = {
    provide: FileService,
    useValue: {
        getDestinationpath: jest.fn(),
        upload: jest.fn().mockResolvedValue(''),
       
}
}
