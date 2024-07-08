import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  uri: string;

  @Prop({ type: [String]}) // Array of socketIds
  players: string[];

  @Prop({ type: [String] }) // Array of socketIds
  watchers: string[];

  @Prop({ default: 5 })
  maxClients: number;

  @Prop()
  startTime: string // timestamp when table activated (someone joined/created)

  @Prop({ type: Types.ObjectId, ref: 'Game' })
  gameID: Types.ObjectId
 

  validateName(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    // Add custom validation logic here
    return value.length > 0;
  }

  validateUri(value: string): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    // Add custom validation logic here
    return value.length > 0;
  }
}

export const TableSchema = SchemaFactory.createForClass(Table);
TableSchema.path('name').validate(Table.prototype.validateName, 'Invalid name');
TableSchema.path('uri').validate(Table.prototype.validateUri, 'Invalid URI');

