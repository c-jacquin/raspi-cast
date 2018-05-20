import { Injectable, Inject } from '@nestjs/common';
import youtubeDl from 'youtube-dl';

import { CastMeta } from '../types/CastMeta';
import { Player } from './Player';

@Injectable()
export class YoutubeDl {
  constructor(@Inject(Player) private player: Player) {}

  public getInfo(video: any): Promise<CastMeta> {
    return new Promise((resolve, reject) => {
      youtubeDl.getInfo(
        video,
        ['-format=bestvideo[ext!=webm]+bestaudio[ext!=webm]/best[ext!=webm]'],
        (err: Error, result: any) => {
          if (err) {
            reject(err);
          } else {
            this.player.setMeta({
              title: result.title,
              description: result.description,
              thumbnail: result.thumbnail,
              url: result.url,
            });
            resolve(result);
          }
        },
      );
    });
  }
}