import { Router } from 'express';
import { AuthorModel, IAuthor, IAuthorDb } from '../../Database';
import { AuthorValidator } from '../../Database/Author.model';

const app = Router();

/** 
 * Fetches all Author Entries from Database
 *  - Overridable with a Query
 * @param req.body
 *  {
 *    query: (Optional - Mongoose Query)
 *  }
 */
app.get('/', async (req, res) => {
  try {
    const query = req.body.query || {};
    const authors = await AuthorModel.find(query)
      .select([
        // HIDE FIELDS
        '-__v', '-_name'
      ]);

    res
      .status(200)
      .json({
        data: authors,
        length: authors.length,
      });
  } catch(e) {
    let errMsg = 'Could not query Authors';
    
    if (e.toString().startsWith('ObjectParameterError'))
      errMsg = 'Invalid Query Structure';
    
    res.status(401)
      .json({
        err: errMsg,
        _debug: e.toString(),
      });
  }
});

/**
 * Create new Author Entry
 * @param req.body Valid Author Body
 */
app.post('/', async (req, res) => {
  try {
    // VALIDATE BODY REQUREST
    const author: IAuthor = req.body as IAuthor;
    const validation = AuthorValidator.validate(author);
    if (validation.error) {
      return res
        .status(400)
        .json({
          err: 'Invalid Author Entry',
          _debug: validation.error,
        });
    }

    // CHECK IF AUTHOR EXISTS (unique name)
    const foundEntry = await AuthorModel.findOne({
      _name: author.name.toLowerCase(),
    } as Partial<IAuthor>)
      .select([
        // HIDE FIELDS
        '-__v', '-_name'
      ]);
    if (foundEntry) {
      return res
        .status(409)
        .json({
          data: foundEntry,
          err: `Duplicate Author Name "${author.name}"`
        });
    }
    
    // CREATE ENTRY
    const creationResponse = await AuthorModel.create({
      ...author,
      _name: author.name,
    } as Partial<IAuthorDb>);
    res
      .status(200)
      .json({
        data: creationResponse,
      });
  } catch(e) {
    res
      .status(500)
      .json({
        err: e.toString() || 'Could not create Author',
      });
  }
});



export default app;