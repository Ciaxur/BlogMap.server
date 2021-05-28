import Joi from 'joi';
import { Schema, model } from 'mongoose';

export interface IAuthor {
  name:   string,
  _name:  string,    // Lowercase Indexed Name
}

const AuthorSchema = new Schema<IAuthor>({
  name:   { type: String, minLength: 4, maxLength: 64, required: true, trim: true },
  
  // INDEXED ENTRY
  _name:  { type: String, minLength: 4, maxLength: 64, trim: true, indexed: true, lowercase: true, required: true },
});

export const AuthorValidator = Joi.object<IAuthor>({
  name: Joi
    .string()
    .required()
    .min(4).max(64)
    .trim()
})

export const AuthorModel = model('Author', AuthorSchema);