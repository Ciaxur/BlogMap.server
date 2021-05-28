import Joi from 'joi';
import { Schema, model } from 'mongoose';
import { IAuthor } from './Author.model';


const PaperType = [ 'Block', 'Article', 'White-Paper' ] as const;
export type IPaperType = typeof PaperType[number];
export interface IPaper {
  title:      string,
  body:       string,
  type:       IPaperType,
  author:     IAuthor,
  createdAt:  Date,
  updatedAt:  Date,
}

const PaperSchema = new Schema<IPaper>({
  title:  { type: String, minLength: 8, maxLength: 128, required: true, trim: true },
  body:   { type: String, minLength: 1, required: true, trim: true },
  type:   { type: String, enum: PaperType, required: true },
  author: { type: 'ObjectId', ref: 'Author', required: true },

  // INDEXED ENTRY
  _title:  { type: String, minLength: 8, maxLength: 128, required: true, trim: true, indexed: true, lowercase: true },
}, {
  timestamps: true,
});

export const PaperValidator = Joi.object<IPaper>({
  title: Joi
    .string().trim()
    .required()
    .min(8).max(128),
  body: Joi
    .string().trim()
    .required()
    .min(1),
  type: Joi
    .string().trim()
    .valid(...PaperType)
    .required(),
  author: Joi
    .string().trim()
    .required(),
});

export const PaperModel = model('Paper', PaperSchema);