import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { model } from 'mongoose';

@Schema({ timestamps: true })
export class GameDB {
  @Prop()
  gameID: string;

  @Prop({ default: false })
  active: boolean;

  @Prop({ type: Map, of: String })
  seats: Map<string, string>;
}

export type GameDocument = GameDB & Document;
export const GameSchema = SchemaFactory.createForClass(GameDB);
export const GameModel = model('Game', GameSchema);
