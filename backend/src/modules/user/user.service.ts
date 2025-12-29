import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User } from "./entities/user.entity";
import { UserFollow } from "./entities/follow.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserFollow)
    private followRepository: Repository<UserFollow>
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  // 关注用户
  async followUser(userId: number, followingId: number): Promise<UserFollow> {
    // 检查是否关注自己
    if (userId === followingId) {
      throw new BadRequestException("不能关注自己");
    }

    // 检查是否已经关注
    const existingFollow = await this.followRepository.findOne({
      where: { userId, followingId },
    });

    if (existingFollow) {
      return existingFollow;
    }

    const follow = this.followRepository.create({
      userId,
      followingId,
    });

    return this.followRepository.save(follow);
  }

  // 取消关注
  async unfollowUser(userId: number, followingId: number): Promise<void> {
    await this.followRepository.delete({
      userId,
      followingId,
    });
  }

  // 检查是否关注
  async isFollowing(userId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { userId, followingId },
    });

    return !!follow;
  }

  // 获取用户关注列表
  async getFollowingList(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    const followingIds = follows.map((follow) => follow.followingId);

    if (followingIds.length === 0) {
      return [];
    }

    return this.userRepository.find({
      where: { id: In(followingIds) },
    });
  }

  // 获取用户粉丝列表
  async getFollowersList(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
      order: { createdAt: "DESC" },
    });

    const followerIds = follows.map((follow) => follow.userId);

    if (followerIds.length === 0) {
      return [];
    }

    return this.userRepository.find({
      where: { id: In(followerIds) },
    });
  }

  // 获取作者榜（根据文章数量排序，文章数量相同时按作者名称排序）
  async getAuthorRanking(limit: number = 10): Promise<any[]> {
    // 使用原始SQL查询获取作者榜数据
    const rankings = await this.userRepository.query(
      `
      SELECT 
        u.id, 
        u.username, 
        u.nickname, 
        u.avatar, 
        COUNT(a.id) as articleCount
      FROM 
        user u
      LEFT JOIN 
        article a ON u.id = a.authorId AND a.status = 'published'
      GROUP BY 
        u.id
      ORDER BY 
        articleCount DESC, 
        u.username ASC
      LIMIT ?
    `,
      [limit]
    );

    return rankings.map((user) => ({
      id: user.id,
      username: user.username,
      nickname: user.nickname || user.username,
      avatar: user.avatar,
      articleCount: user.articleCount,
    }));
  }
}
