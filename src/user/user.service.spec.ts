import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { creatUserDto } from "../testing/create-user-dto.mock";
import { updatePutUserDto } from "../testing/update-put-user-dto.mock";
import { updatePatchUserDto } from "../testing/update-patch-user-dto.mock";

describe('UserService',  () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                userRepositoryMock
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    test('validar a definição', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });
    describe('Create', () => {
        test('method creat', async () => {
        jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);

        const result = await userService.create(creatUserDto);
        expect(result).toEqual(userEntityList[0]);
        
        })
    })
    describe('Read', () => {
        test('method list', async () => {
          
            const result = await userService.list();
            expect(result).toEqual(userEntityList);
            
            });
            test('method show', async () => {
          
                const result = await userService.show(1);
                expect(result).toEqual(userEntityList[0]);
                
                })
    })
    describe('Update',  () => {
        test('method update', async () => {
          
        const result = await userService.update(1, updatePutUserDto );
        expect(result).toEqual(userEntityList[0]);
        
        });
        test('method updatePartial', async () => {
          
            const result = await userService.updatePartial(1, updatePatchUserDto);
            expect(result).toEqual(userEntityList[0]);
            
            });
    })
    describe('Delete', () => {
        test('method delete', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userEntityList[0]); // Simula que o usuário existe
            jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(userEntityList[0]); // Retorna o próprio usuário excluído
    
            const result = await userService.delete(1);
            expect(result).toEqual(userEntityList[0]); // Agora esperamos que retorne o próprio usuário excluído
        });
    
        test('should throw an error if user does not exist', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // Simula usuário inexistente
        
            await expect(userService.delete(99)).rejects.toThrowError(`O usuário 99 não existe`); // ✅ Corrigido para refletir a mensagem real
        });
        
        });
    });
    

