export default function Comment({
  replies,
  rootComment,
  comments,
}: {
  replies: {
    id: string;
    by: string;
    content: string;
    commentedAt: string;
  }[];
  rootComment: {
    id: string;
    by: string;
    content: string;
    commentedAt: string;
  };
  comments: {
    id: string;
    by: string;
    content: string;
    commentedAt: string;
  }[];
}) {
  const { by: rootBy, content: rootContent } = rootComment;

  const getReplies = (commentId: string) => {
    return comments.filter((comment) => comment.commentedAt === commentId);
  };

  return (
    <div className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">
      <div className="md:ml-4 cursor-pointer pb-2 pr-4">
        <h1 className="font-[500] md:text-base hover:underline">
          · {rootContent}
        </h1>
        <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]">
          <span>{rootBy}</span> ·{" "}
          <span className="text-blue-500">Responder</span>
        </p>
      </div>

      <ul>
        {replies.map((replyComment) => {
          return (
            <li>
              <Comment
                rootComment={replyComment}
                replies={getReplies(replyComment.id)}
                comments={comments}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
