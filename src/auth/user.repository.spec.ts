import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockCredentialDto = { username: 'TestUsername', password: '123456' };

describe('UserRespository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);

      expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exist', () => {
      save.mockRejectedValue({ code: '2395' });

      expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a conflict exception as username already exist', () => {
      save.mockRejectedValue({ code: '123' }); //unhandled error code

      expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user: User;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'Test';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is successful', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (user.validatePassword as jest.Mock).mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );
      expect(result).toEqual('Test');
    });

    it('returns null as user cannot be found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (user.validatePassword as jest.Mock).mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(
        mockCredentialDto,
      );

      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
