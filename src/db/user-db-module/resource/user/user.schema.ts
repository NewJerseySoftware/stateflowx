import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class UserDetails {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  emailAddress: string;

  // Other properties of UserDetails
}

export type UserDetailsDocument = UserDetails & Document;
export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);

@Schema({ timestamps: true })
export class User {
  @Prop({ default: 'Guest' })
  name: string;

  // @Prop({ default: 'lobby' })
  // roomID: string;

  // @Prop({ default: 'watcher' })
  // gameID: string;

  @Prop({ default: false })
  registered: boolean;

  @Prop({ type: Types.ObjectId, ref: 'UserDetails' })
  userDetails: Types.ObjectId; // Reference to UserDetails
}

export type UserDocument = User & Document & HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);





