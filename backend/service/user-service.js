const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exeptions/api-error");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw  ApiError.BadRequest(`User ${email} already exist`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink});
    if (!user) {
      throw new ApiError.BadRequest("Invalid link")
    }
    user.isActivated = true;
    await user.save();
    
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});
    if (!user) {
      throw new ApiError.BadRequest("Incorrect email or password");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw ApiError.BadRequest("Incorrect email or password");
    }
    const userDto = UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
   return token;
    
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnautharizedError();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);
    if (!userData || !dbToken) {
      throw ApiError.UnautharizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
    
  }

  async getAllUsers() {
    return UserModel.find()
  }
    
}

module.exports = new UserService();
