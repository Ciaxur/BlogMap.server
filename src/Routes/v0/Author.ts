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

/**
 * Removes given Author based on ID
 * @param req.params.id Valid ObjectId
 */
 app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await AuthorModel.findById(id);

    // Entry not found
    if (!entry) {
      return res
        .status(404)
        .json({
          err: 'Author Entry not found',
        });
    }
    const removedEntry = await AuthorModel.deleteOne({ _id: id });
    
    if (removedEntry.ok) {
      res
        .status(200)
        .json({
          data: entry,
        });
    } else {
      throw new Error(`Could not remove author '${id}'`);
    }
  } catch(e) {
    res
      .status(500)
      .json({
        err: e.toString() || 'Could not remove given author id',
        _debug: e,
      });
  }
});

/**
 * Patches given Author body and ID
 * @param req.params.id Valid ObjectId
 * @param req.body Valid IPaper Object
 */
app.patch('/:id', async (req, res) => {
  const { id } = req.params;
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

  try {
    const entry = await AuthorModel.findById(id);

    // Entry not found
    if (!entry) {
      return res
        .status(404)
        .json({
          err: 'Author Entry not found',
        });
    }
    const updatedEntry = await AuthorModel.updateOne({ _id: id }, author);
    
    if (updatedEntry.ok) {
      res
        .status(200)
        .json({
          data: author,
        });
    } else {
      throw new Error(`Could not update author '${id}'`);
    }
  } catch(e) {
    res
      .status(500)
      .json({
        err: e.toString() || 'Could not update given author id',
        _debug: e,
      });
  }
});


export default app;