import mongoose from 'mongoose';
import { AuthorModel, IAuthor } from './Author.model';
import { PaperModel, IPaper } from './Paper.model';

/** DATABASE INFUSED INTERFACES */
interface DatabaseOptions {
  _id:        string,
  createdAt:  Date,
  updatedAt:  Date,
}
interface IAuthorDb extends DatabaseOptions, IAuthor {
  _name: string,
}
interface IPaperDb extends DatabaseOptions, IPaper {
  _title: string,
}

// Source of Truth, if import needs to be a General Database
export { AuthorModel, PaperModel };
export type { IPaper, IPaperType } from './Paper.model';
export type { IAuthor } from './Author.model';
export type { IAuthorDb, IPaperDb };

/** MONGO CONNECTION INIT */
/**
 * Inits Mongoose Connection with MongoDB URI
 * @param uri URI Connection to Mongo DB
 * @param verbose Verbose logging Trigger
 * @returns Connection state result
 */
export function initMongoose(uri: string, verbose?: boolean): Promise<typeof mongoose> {
  return mongoose.connect(uri, {
    dbName: 'BlogMap',
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
    .then(conx => {
      if (verbose)
        console.log('initMongoose: Success');
      return conx;
    })
    .catch(err => {
      if (verbose)
        console.log('initMongoose: Error:', err);
      return err;
    });
}
