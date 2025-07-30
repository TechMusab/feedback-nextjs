import mongoose,{Schema,Document} from  'mongoose';

export interface Message extends Document {
    content:string,
    createdAt: Date,
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    VerifyCode:string,
    VerifyCodeExpires: Date,
    isAcceptingMsg: boolean,
    isVerified: boolean,
    messages: Message[],
}
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    VerifyCode:{
        type:String,
        default:"",
    },
    VerifyCodeExpires:{
        type:Date,
        default:null
    },
    isAcceptingMsg:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    messages:[MessageSchema]
});
const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User> ('User', UserSchema);
export default UserModel;