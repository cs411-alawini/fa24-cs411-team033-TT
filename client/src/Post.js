// import "./styles/Post.css";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";



// const Post = () => {
//   // Mock data for posts

//   const VoteLeft = 5;

//   const mockPosts = [
//     {
//       UserId: 1,
//       FirstName: "John",
//       LastName: "Doe",
//       Vote: 10,
//       Cloth1Img: "https://via.placeholder.com/50?text=Hat",
//       Cloth2Img: "https://via.placeholder.com/50?text=Shirt",
//       Cloth3Img: "https://via.placeholder.com/50?text=Pants",
//       Cloth4Img: "https://via.placeholder.com/50?text=Shoes",
//       Cloth5Img: null, // Empty image
//     },
//     {
//       UserId: 2,
//       FirstName: "Jane",
//       LastName: "Smith",
//       Vote: 25,
//       Cloth1Img: "https://via.placeholder.com/50?text=Scarf",
//       Cloth2Img: "https://via.placeholder.com/50?text=Coat",
//       Cloth3Img: "https://via.placeholder.com/50?text=Jeans",
//       Cloth4Img: null,
//       Cloth5Img: null,
//     },
//     {
//       UserId: 3,
//       FirstName: "Alice",
//       LastName: "Johnson",
//       Vote: 8,
//       Cloth1Img: "https://via.placeholder.com/50?text=Beanie",
//       Cloth2Img: "https://via.placeholder.com/50?text=Jacket",
//       Cloth3Img: "https://via.placeholder.com/50?text=Skirt",
//       Cloth4Img: "https://via.placeholder.com/50?text=Boots",
//       Cloth5Img: null,
//     },
//   ];

//   const [posts, setPosts] = useState(mockPosts);
//   const [votedPosts, setVotedPosts] = useState({}); // Tracks voted status for each post
//   const navigate = useNavigate();

//   // Handle voting toggle
//   const handleVoteToggle = (userId) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.UserId === userId) {
//           const isVoted = votedPosts[userId];
//           return { ...post, Vote: isVoted ? post.Vote - 1 : post.Vote + 1 };
//         }
//         return post;
//       })
//     );

//     setVotedPosts((prev) => ({
//       ...prev,
//       [userId]: !prev[userId], // Toggle the vote status
//     }));
//   };

//   const handleLogout = () => {
//     navigate("/");
//   };

//   return (
//     <div className="closet-container">
//       <h2>Others' OOTD <br />
//       (Vote Left for Today: {VoteLeft})</h2>
//       <div className="posts-grid">
//         {posts.map((post) => (
//           <div key={post.UserId} className="post-card">
//             <div className="post-user">
//               <strong>{post.FirstName} {post.LastName}</strong> Votes: <strong>{post.Vote}</strong>
//               {'    '}
//               <button
//                 className={`vote-button ${votedPosts[post.UserId] ? "voted" : ""}`}
//                 onClick={() => handleVoteToggle(post.UserId)}
//               >
//                 {votedPosts[post.UserId] ? "Unvote" : "Vote"}
//               </button>
//             </div>
//             <div className="post-clothes">
//               {[post.Cloth1Img, post.Cloth2Img, post.Cloth3Img, post.Cloth4Img, post.Cloth5Img]
//                 .filter((img) => img) // Filter out null images
//                 .map((img, index) => (
//                   <img key={index} src={img} alt={`Cloth ${index + 1}`} className="post-cloth-img" />
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="logout-button" onClick={handleLogout}>
//         Log Out
//       </button>

//     </div>
//   );
// };

// export default Post;

import "./styles/Post.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const [posts, setPosts] = useState([]); // To store posts data
  const [votedPosts, setVotedPosts] = useState({}); // Tracks voted status for each post
  const [voteLeft, setVoteLeft] = useState(0); // Tracks votes left for the user
  const navigate = useNavigate();

  // Fetch posts data on component mount
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {

//         // Get the current date in YYYY-MM-DD format
//         const currentDate = new Date().toLocaleDateString('en-CA');
//         // const formData = new FormData();
//         console.log(currentDate);
//         // formData.append('Date', currentDate);


//         // const response = await axios.get("http://localhost:5050/api/posts", formData, {
//         //   headers: { 'Content-Type': 'multipart/form-data' },
//         // });
//         const response = await axios.get("http://localhost:5050/api/posts", {
//             params: { Date: currentDate },
//           });
//         const postsData = response.data;
//         console.log(postsData);

//         // Set the posts and extract the votes left for the logged-in user
//         setPosts(postsData);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//         alert("Failed to fetch posts. Please try again later.");
//       }
//     };

//     fetchPosts();
//   }, []);
useEffect(() => {
    const fetchPostsAndVotes = async () => {
      try {
        const userId = localStorage.getItem("UserId");
        if (!userId) {
          alert("UserId is not available in localStorage.");
          return;
        }

        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toLocaleDateString("en-CA");

        // Use Promise.all to fetch posts and votes simultaneously
        const [postsResponse, votesResponse, votedResponse] = await Promise.all([
          axios.get("http://localhost:5050/api/posts", { params: { Date: currentDate } }),
          axios.get("http://localhost:5050/api/votes", { params: { Date: currentDate, UserId: userId } }),
          axios.get('http://localhost:5050/api/voted', {
            params: {
              Date: currentDate, // Get today's date in YYYY-MM-DD format
              UserId: userId,
            },
          }),
        ]);

        // console.log(postsResponse.data)
        // console.log(votedResponse.data.map((item) => item.PostId));

        // Set the posts data
        setPosts(postsResponse.data);

        // Set the votes left for the user
        // console.log(votesResponse.data);
        setVoteLeft(votesResponse.data.VoteNum);

        setVotedPosts(votedResponse.data.map((item) => item.PostId));
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again later.");
      }
    };

    fetchPostsAndVotes();
  }, []);

//   const handleVoteToggle = (userId) => {
//     if (voteLeft === 0 && !votedPosts[userId]) {
//       alert("You have no votes left for today!");
//       return;
//     }

//     // Update the posts and votes left state
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.UserId === userId) {
//           const isVoted = votedPosts[userId];
//           return { ...post, Vote: isVoted ? post.Vote - 1 : post.Vote + 1 };
//         }
//         return post;
//       })
//     );

//     setVotedPosts((prev) => ({
//       ...prev,
//       [userId]: !prev[userId], // Toggle the vote status
//     }));

//     setVoteLeft((prevVoteLeft) => (votedPosts[userId] ? prevVoteLeft + 1 : prevVoteLeft - 1));
//   };
// const handleVoteToggle = (userId) => {
//     if (voteLeft === 0 && !votedPosts[userId]) {
//       alert("You have no votes left for today!");
//       return;
//     }
  
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.UserId === userId) {
//           const isVoted = votedPosts[userId] || false;
//           return { ...post, Votes: isVoted ? post.Votes - 1 : post.Votes + 1 };
//         }
//         return post;
//       })
//     );
  
//     setVotedPosts((prevVotedPosts) => ({
//       ...prevVotedPosts,
//       [userId]: !prevVotedPosts[userId], // Toggle the vote status for the specific user
//     }));
  
//     setVoteLeft((prevVoteLeft) => (votedPosts[userId] ? prevVoteLeft + 1 : prevVoteLeft - 1));
//   };
const handleVoteToggle = async (postId) => {
    const userId = localStorage.getItem("UserId");
    const currentDate = new Date().toLocaleDateString("en-CA");
  
    if (!userId) {
      alert("UserId is missing. Please log in again.");
      return;
    }
  
    // const apiUrl = posts.find((post) => post.PostId === postId).voted
    //   ? "http://localhost:5050/api/unvote"
    //   : "http://localhost:5050/api/vote";

    const apiUrl = votedPosts.includes(postId)
    ? "http://localhost:5050/api/unvote"
    : "http://localhost:5050/api/vote";
  
    try {
      // Prepare FormData for API call
      const formData = new FormData();
      formData.append("Date", currentDate);
      formData.append("UserId", userId);
      formData.append("PostId", postId);

      console.log(apiUrl);
      console.log(currentDate, userId, postId);
  
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
  
      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
        return;
      }
  
      // Update posts and votes left locally
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) => {
      //     if (post.PostId === postId) {
      //       const isVoted = post.voted;
      //       return {
      //         ...post,
      //         voted: false,
      //         Votes: isVoted ? post.Votes - 1 : post.Votes + 1,
      //       };
      //     }
      //     return post;
      //   })
      // );
  
      // setVoteLeft((prevVoteLeft) =>
      //   posts.find((post) => post.PostId === postId).voted
      //     ? prevVoteLeft + 1
      //     : prevVoteLeft - 1
      // );
  
      alert(response.data.message || "Action successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error while voting/unvoting:", error);
      alert("Failed to process your request. Please try again later.");
    }
  };
  const handleLogout = () => {
    navigate("/");
  };

  console.log(votedPosts);

  return (
    <div className="closet-container">
      <h2>
        Others' OOTD <br />
        (Votes Left for Today: {voteLeft})
      </h2>
      <div className="posts-grid">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="post-user">
              <strong>
                {post.FirstName} {post.LastName}
              </strong>{" "}
              Votes: <strong>{post.Votes}</strong>
              {"    "}
              <button
                className={`vote-button ${votedPosts[post.PostId] ? "voted" : ""}`}
                onClick={() => handleVoteToggle(post.PostId)}
                >
                {votedPosts.includes(post.PostId) ? "Unvote" : "Vote"}
                </button>
            </div>
            <div className="post-clothes">
              {[post.Cloth1Image, post.Cloth2Image, post.Cloth3Image, post.Cloth4Image, post.Cloth5Image]
                .filter((img) => img) // Filter out null images
                .map((img, idx) => (
                  <img key={idx} src={img} alt={`Cloth ${idx + 1}`} className="post-cloth-img" />
                  
                ))}
                {post.Description}
            </div>
            
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Post;