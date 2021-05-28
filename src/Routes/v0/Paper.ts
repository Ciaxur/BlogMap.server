import { Router } from 'express';
import { IPaperDb } from '../../Database';
import { IPaper, PaperModel, PaperValidator } from '../../Database/Paper.model';

const app = Router();

/** 
 * Fetches all Paper Entries from Database
 *  - Overridable with a Query
 * @param req.body
 *  {
 *    query: (Optional - Mongoose Query)
 *  }
 */
app.get('/', async (req, res) => {
  try {
    const query = req.body.query || {};
    const papers = await PaperModel.find(query)
      .select([
        // HIDE FIELDS
        '-__v', '-_title'
      ]);

    res
      .status(200)
      .json({
        data: papers,
        length: papers.length,
      });
  } catch(e) {
    if (e.toString().startsWith('ObjectParameterError')) {
      return res
        .status(400)
        .json({
          err: 'Invalid Query Structure',
          _debug: e.toString(),
      });
    }

    res.status(500)
      .json({
        err: 'Could not query Papers',
        _debug: e.toString(),
      });
  }
});

/**
 * Create new Paper Entry
 * @param req.body Valid Paper Body
 */
 app.post('/', async (req, res) => {
  try {
    // VALIDATE BODY REQUREST
    const paper: IPaper = req.body as IPaper;
    const validation = PaperValidator.validate(paper);
    if (validation.error) {
      return res
        .status(400)
        .json({
          err: 'Invalid Paper Entry',
          _debug: validation.error,
        });
    }

    // CHECK IF PAPER EXISTS FOR AUTHOR
    const foundEntry = await PaperModel.findOne({
      _title: paper.title.toLowerCase(),
      author: paper.author,
    } as Partial<IPaper>)
      .select([
        // HIDE FIELDS
        '-__v', '-_title'
      ]);
    if (foundEntry) {
      return res
        .status(409)
        .json({
          data: foundEntry,
          err: `Duplicate Paper Found "${paper.title}"`
        });
    }
    
    // CREATE ENTRY
    const creationResponse = await PaperModel.create({
      ...paper,
      _title: paper.title,
    } as Partial<IPaperDb>);
    res
      .status(200)
      .json({
        data: creationResponse,
      });
  } catch(e) {
    res
      .status(500)
      .json({
        err: e.toString() || 'Could not create Paper',
      });
  }
});


export default app;