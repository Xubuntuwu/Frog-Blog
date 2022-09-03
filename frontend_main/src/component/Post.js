import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function Post() {
    // const { id } = useParams();
    const { state } = useLocation();
    const { post } = state;

    useEffect(()=>{

    }, [])
  return (
    <div className="Post">
      <div className='post' key={post._id}>
        <div className='post_img'>
          {/* <img alt='random stock img' src='https://source.unsplash.com/random/' /> */}
        </div>
        <div className='post_body'>
          <div className='post_title'>{post.title}</div>
          <div className='post_content'>{post.content}</div>
        </div>
      </div>
      <div className='comments'>
        {/* load comments here */}
      </div>    
    </div>
  );
}

export default Post;
