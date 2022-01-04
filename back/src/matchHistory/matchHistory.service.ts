import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MatchHistory } from './matchHistory.entity';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchRepository: Repository<MatchHistory>,
  ) {}
  async findUserMatches(user: User) {
    const u1Matches = await this.matchRepository.find({
      where: {
        user1: user,
      },
    });
    const u2Matches = (
      await this.matchRepository.find({
        where: {
          user2: user,
        },
      })
    ).map((match) => {
      const tmp = match.user1;
      match.user1 = match.user2;
      match.user2 = tmp;
      return match;
    });
    return u1Matches.concat(u2Matches);
  }

  async add(user1: User, user2: User, socre1: number, score2: number) {
    await this.matchRepository.save({
      user1Score: socre1,
      user2Score: score2,
      user1: user1,
      user2: user2,
      createdAt: new Date(),
    });
  }
}
