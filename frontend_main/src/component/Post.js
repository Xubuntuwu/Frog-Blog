import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function Post(props) {
    const { id } = useParams();
    const { state } = useLocation();
    const post = state ? state.post : null;

    const [token, setToken] = useState(null);
    const [loadedPost, setPost] = useState(null);
    const [loadedComments, setComments] = useState(null);
  
    const login = {
      type: process.env.REACT_APP_APIKEY_TYPE,
      key: process.env.REACT_APP_APIKEY_KEY,
    };
    const params = new URLSearchParams(login);

    const postComment = `http:localhost:3000/api/comments/post/${id}`;

    useEffect(()=>{
         // Get Token
        fetch('/api/login/user', {
          method: 'POST',
          body: params,
        })
        .then((e)=>{
          return e.json()
        })
        .then(json=> {
          setToken(json.token);
        })
        .catch(function(err) {
          console.log(err)
        });
    }, []);


    useEffect(()=>{
      // Get Post if state is null
      if(token !==null && state===null){
        fetch(`/api/posts/${id}`, {
          method: 'GET',
          headers: new Headers({
            'Authorization': 'Bearer ' + token,
          })        
        })
        .then((res)=>{
          return res.json()
        })
        .then((res)=>{
          setPost(res.post);
        })
        .catch((err)=>{
          console.log(err)
        })
      }
      if(token !==null){
        loadComments();
      }
    },[token]);

  const loadComments = () =>{
    fetch(`/api/comments/post/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + token,
      })        
    })
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
      // console.log(res);
      setComments(res.comments);
    })
    .catch((err)=>{
      console.log(err)
    });
  }
  const submitComment = (e) =>{
    e.preventDefault();
    const ownername = document.getElementById('comment_username').value;
    const content = document.getElementById('comment_content').value;
    const form = document.querySelector('form');

    const commentdata = props.adminID ? {
      ownername,
      content,
    } : {
      ownerid: props.adminID,
      ownername: false,
      content: content,
    };
    const params = new URLSearchParams(commentdata);


    fetch(`/api/comments/post/${id}`, {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer ' + token,
          }),
          body: params,     
        })
        .then((res)=>{
          loadComments();
          form.reset();
          return res.json()
        })
        .catch((err)=>{
          console.log(err)
        })
  }
    
  return (
    <div className="Post">
     {state!==null ? <div className='post' key={post._id}>
        <div className='post_img'>
        </div>
        <div className='post_body'>
          <div className='post_title'>{post.title}</div>
          <div className='post_content'>{post.content}</div>
        </div>
      </div>
      : loadedPost!==null?
      <div className='post' key={loadedPost._id}>
        <div className='post_img'>
        </div>
        <div className='post_body'>
          <div className='post_title'>{loadedPost.title}</div>
          <pre className='post_content'>{loadedPost.content}</pre>
        </div>
      </div>
      : 'Loading...'
      }    
      <div className='Commentsection'>
        <hr/>
        <h2 className='title'>Comment Section</h2>
        <div className='comments'>
        {loadedComments !== null && loadedComments.length > 0 ?
            loadedComments.map((item, i)=>{
              return <div className='comment' key={item._id}>
                  <div className='comment_name'> {item.ownername} </div>
                  <pre className='comment_text'> {item.content} </pre>
              </div>
            })
          : loadedComments !== null && loadedComments.length===0 ?
            'No comments yet, be the first!'
          : 'Loading comments...'}
        </div>
        <div className='create-comment'>
          <hr/>
          <div className='title'>
            <h3>Leave A Comment: </h3>
          </div>
          <form method='post' action={postComment} onSubmit={submitComment}>
            <div>              
                <label> Username: 
                  {/* if user is signed in, that profile will be used in submitcomment function */}
                  <input type='text' minLength={2} maxLength={30} name='ownername' id='comment_username' required/>
                </label>
            </div>
            <div>              
                <label> Comment: 
                  <textarea id='comment_content' name='content' minLength={5} maxLength={1000} required>
                  </textarea>
                </label>
            </div>
            <button type='submit'>Post!</button>
          </form>
        </div>
      </div> 
    </div>
  );
}

export default Post;
