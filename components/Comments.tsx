import Comment from "./Comment"

export default function Comments({
  comments,
} : {
  comments: {
    id: string;
    by: string;
    content: string;
    commentedAt: string;
  }[];
}) {
  const rootComments = comments.filter(comment => comment.commentedAt === null)
  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.commentedAt === commentId)
  }
  return (
    <div>
      {rootComments
        .map((rootComment) => {
          return (
            <div>
              <Comment rootComment={rootComment} replies={getReplies(rootComment.id)} comments={comments}/>        
            </div>
          );
        })}
    </div>
  );
}
