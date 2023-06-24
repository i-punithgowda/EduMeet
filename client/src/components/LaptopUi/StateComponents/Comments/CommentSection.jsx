import { useState } from "react";
import axios from "axios";

function Comment({ comment, currentUser, fetchComments, streamID }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const baseAPI = process.env.REACT_APP_BASEAPI;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleReplySubmit = async (val) => {
    try {
      const obj = {
        userID: currentUser,
        commentID: val,
        replyText: replyText,
        timeStamp: Date.now(),
      };
      //console.log(obj);
      const { data } = await axios.post(`${baseAPI}/post-reply`, obj);
      console.log(data);
      setReplyText("");
      fetchComments(streamID);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const getTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const commentTime = new Date(parseInt(timestamp));
    const timeDifference = currentTime - commentTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div key={comment.comment_id} className="comment mb-4">
      <div className="flex items-start mb-2">
        <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white text-lg font-bold mr-3">
          {comment.commentUser.name.substring(0, 1)}
        </div>
        <div className="flex flex-col">
          <div className="bg-white text-gray-800 py-2 px-3 rounded-lg">
            <div className="flex items-center">
              <span className="font-bold">{comment.commentUser.name}</span>
              <span className="text-gray-500 text-sm ml-2">
                {getTimeDifference(comment.commentTimeStamp)}
              </span>
            </div>
            <p>{comment.commentText}</p>
          </div>
          <div className=" rounded-lg mt-2 p-2">
            <input
              className="w-48 p-2 border border-gray-300 rounded-lg outline-none"
              placeholder="Add a reply"
              value={replyText}
              onChange={handleReplyTextChange}
            />
            <button
              className="text-white bg-blue-500 rounded-lg mt-2 px-4 py-2 font-bold"
              onClick={() => handleReplySubmit(comment.comment_id)}
            >
              Submit
            </button>
          </div>
          {comment.replies.length > 0 && (
            <button
              className="text-secondary-content text-left font-bold mt-2"
              onClick={toggleReplies}
            >
              View {comment.replies.length} Replies
            </button>
          )}
          {showReplies && <Replies replies={comment.replies} />}
        </div>
      </div>
    </div>
  );
}

function Replies({ replies }) {
  const getTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const commentTime = new Date(parseInt(timestamp));
    const timeDifference = currentTime - commentTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="replies mt-2">
      {replies.map((reply) => (
        <div key={reply.replyTimeStamp} className="flex items-start mb-1">
          <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-gray-800 text-lg font-bold mr-3">
            {reply.replyUser.name.substring(0, 1)}
          </div>
          <div className="flex flex-col">
            <div className="bg-white text-gray-800 py-2 px-3 rounded-lg">
              <div className="flex items-center">
                <span className="font-bold">{reply.replyUser.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {getTimeDifference(reply.replyTimeStamp)}
                </span>
              </div>
              <p>{reply.replyText}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommentSection({
  commentsData,
  currentUser,
  fetchComments,
  streamID,
}) {
  return (
    <div className="query-list h-5/6">
      {commentsData.length > 0 ? (
        commentsData.map((data) => (
          <Comment
            comment={data}
            currentUser={currentUser}
            fetchComments={fetchComments}
            streamID={streamID}
          />
        ))
      ) : (
        <span className="text-gray-500 italic">No comments</span>
      )}
    </div>
  );
}
