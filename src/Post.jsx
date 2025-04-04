import React, { useState } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Post({ post, db, setPosts, posts }) {
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    const postRef = doc(db, "post", post.id);
    try {
      await updateDoc(postRef, { likes: post.likes + 1 });
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, likes: post.likes + 1 } : p
        )
      );
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    const commentData = {
      commentText: newComment,
      createdAt: new Date(),
      createdBy: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };
    const postRef = doc(db, "post", post.id);
    try {
      await updateDoc(postRef, {
        comments: arrayUnion(commentData),
      });
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? { ...p, comments: [...p.comments, commentData] }
            : p
        )
      );
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-details">
        <img src={post.image} alt={post.title} />
        <div>
          <h3>{post.title}</h3>
          <p>{post.details}</p>
        </div>
      </div>
      <div className="like-dislike">
        <button onClick={handleLike} className="like">
          <img src="https://i.imgur.com/e26ummY.png" alt="Like" />
          {post.likes}
        </button>
        <button className="dislike">
          <img src="https://i.imgur.com/EV5cY3Q.png" alt="Dislike" />
        </button>
      </div>
      <div className="user-info">
        <h4>Publicado por:</h4>
        <div className="user-details">
          <img src={post.createdBy.photoURL} alt={post.createdBy.displayName} />
          <p>{post.createdBy.displayName}</p>
        </div>
      </div>
      <div className="comments-section">
        <h4>Comentarios:</h4>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <img
                src={comment.createdBy.photoURL}
                alt={comment.createdBy.displayName}
                className="comment-avatar"
              />
              <p>
                <strong>{comment.createdBy.displayName}:</strong>{" "}
                {comment.commentText}
              </p>
            </div>
          ))
        ) : (
          <p>Aún no hay comentarios.</p>
        )}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe..."
          />
          <button onClick={handleComment}>Agregar Comentario</button>
        </div>
      </div>
    </div>
  );
}
