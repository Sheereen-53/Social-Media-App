import commentResolvers from "./comments.js";
import postResolvers from "./posts.js";
import userResolvers from "./users.js";

const queries = {
    Post: { 
        likeCount(parent){
            return parent.likes.length;
        },
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}

export default queries;

