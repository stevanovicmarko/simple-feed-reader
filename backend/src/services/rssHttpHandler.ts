import axios, { AxiosError } from 'axios';
import FeedParser, { Item } from 'feedparser';
import ReadableStream = NodeJS.ReadableStream;

type Nullable<T> = T | null | undefined;

// http://www.reddit.com/r/kde/.rss

export class RssHttpHandler {
  private feedParser = new FeedParser({});

  private items: Item[] = [];

  constructor(private url: string) {
    const items = this.items;
    this.feedParser.on('readable', function(this: FeedParser) {
      const item = this.read() as Nullable<Item>;
      if (item) {
        items.push(item);
      }
    });
  }

  public async getArticles(): Promise<Item[]> {
    // TODO: Refactor AxiosError handling.
    const { data } = await axios.get<ReadableStream>(this.url, {
        responseType: 'stream',
    });
    data.pipe<FeedParser>(this.feedParser);

    return new Promise<Item[]>((resolve, reject) => {
      this.feedParser.on('end', () => resolve(this.items));
      this.feedParser.on('error', reject);
    });
  }
}
