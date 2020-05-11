import { Injectable } from '@nestjs/common';
import { CastMeta, CastType, CastOptions } from '@raspi-cast/core';
import youtubeDl from 'youtube-dl';

@Injectable()
class StreamProvider {
  private youtube(video: any): Promise<CastMeta> {
    return new Promise((resolve, reject) => {
      youtubeDl.getInfo(
        video,
        ['-format=bestvideo[ext!=webm]+bestaudio[ext!=webm]/best[ext!=webm]'],
        (err: Error, result: any) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve({
              title: result.title,
              description: result.description,
              thumbnail: result.thumbnail,
              url: result.url,
              duration: result._duration_raw,
            });
          }
        },
      );
    });
  }

  public async getStreamUrl({ type, data }: CastOptions) {
    switch (type) {
      case CastType.YOUTUBEDL:
      default:
        return this.youtube(data);
    }
  }
}

export default StreamProvider;
