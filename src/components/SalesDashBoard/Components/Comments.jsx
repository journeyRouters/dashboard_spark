/* eslint-disable react/prop-types */

import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import './commentModal.css'
const Comments = ({ commentData, showSaleFlightComment = true }) => {
  // put herr user detail please
  //   const user="";
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(commentData?.NurtureComments || []);
  const [comment, setComment] = useState("");
  const allCommentDivRef = useRef(null);
  const loggedInUser = {
    role: "Admin",
  };

  useEffect(() => {
    setComments(commentData?.NurtureComments || []);
  }, [commentData]);

  const saveComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    const newComment = {
      DateTimeStamp: new Date().toISOString(),
      //   Role: user?.UserId,
      comments: comment,
      //   Name: user?.UserUid,
    };
    try {
      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
      scrollToBottom();

      const updatedData = {
        ...commentData,
        NurtureComments: [...comments, newComment],
      };

      await axios.put(
        `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander?Status=new`,
        updatedData
      );
    } catch (error) {
      console.error("Error saving comment:", error);
      setComments((prevComments) =>
        prevComments.filter((c) => c !== newComment)
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    const container = allCommentDivRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const savingCommentOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveComment();
    }
  };

  const printFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      date.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })} at ${time}`;
  };

  return (
    <div style={{ height: "25rem" }} className="comment-section">
      <div
        style={{
          flexDirection: "column",
          gap: 0,
          fontSize: "1rem",
          height: "20rem",
          overflow: "scroll",
          maxHeight: "20rem",
        }}
        className={
          showSaleFlightComment ? "comments-shower" : "salecommnetshower"
        }
      >
        {comments.map((item, idx) => (
          <Fragment key={idx}>
            <p className={idx % 2 === 0 ? "evendiv" : "odddiv"} key={idx}>
              {item.comments}
              <span> - {printFormattedDate(item.DateTimeStamp)}</span>
            </p>
          </Fragment>
        ))}
      </div>
      <div className="comment-saving">
        <textarea
        className="Comments_input_feild_raw_lead_manager"
          type="text"
          disabled={loading}
          placeholder="Comment here"
          value={comment}
          onKeyDown={savingCommentOnEnter}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button onClick={saveComment}>{loading ? "Loading..." : "Save"}</button>
      </div>
    </div>
  );
};

export default Comments;
