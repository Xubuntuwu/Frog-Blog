// show all posts in full, one by one
// each post can be edited and deleted
// comments made are saved under admin username
// instead of login the header says log out

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

function Admin(props) {
    
  const navigate = useNavigate();
  const { state } = useLocation();
  const adminToken = state ? state.adminToken : null;
  const [editPostID, setEditPostID]= useState(null);

  
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState(null);
  
  const login = {
      type: process.env.REACT_APP_APIKEY_TYPE,
    key: process.env.REACT_APP_APIKEY_KEY,
};
const params = new URLSearchParams(login);

  useEffect(()=>{
    if(adminToken===null){
        navigate('/admin/login');
    }
    else{
        // Get User Token
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
    }
  }, [])

  useEffect(()=>{
    // Get Posts
    if(adminToken !==null){
        getAllPosts();
    }
  },[adminToken])

  const getAllPosts = () =>{
    fetch('/api/posts/admin', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + adminToken,
        })
      })
      .then((res)=>{
        return res.json()
      })
      .then((res)=>{
        setPosts(res.posts);
      })
      .catch((err)=>{
        console.log(err)
      })
  }
  const createPost = (e) =>{
    e.preventDefault();

    const form = document.querySelector('form.newpost');

    const postData = {
        title: form['new_post_title'].value,
        content: form['new_post_content'].value,
        owner: props.adminID,
        public: form['publish'].checked,
    };
    const params = new URLSearchParams(postData);

    fetch('/api/posts', {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + adminToken,
        }),
        body: params
      })
      .then((res)=>{
        // console.log(res);
        form.reset()
        getAllPosts();
        return res.json()
      })
      .then((res)=>{
        // console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const editPost = (e, postid) =>{
    e.preventDefault();
    const form = document.querySelector('form.editpost');

    const postData = {
        title: form['full_post_title_edit'].value,
        content: form['full_post_content_edit'].value,
        // public: form['publish'].checked,
    };
    const params = new URLSearchParams(postData);

    fetch(`/api/posts/${postid}`, {
        method: 'PATCH',
        headers: new Headers({
          'Authorization': 'Bearer ' + adminToken,
        }),
        body: params
      })
      .then((res)=>{
        // console.log(res);
        form.reset()
        setEditPostID(null);
        getAllPosts();
        return res.json()
      })
      .then((res)=>{
        // console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const deletePost = (postid) =>{
    fetch(`/api/posts/${postid}`, {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': 'Bearer ' + adminToken,
        })
      })
      .then((res)=>{
        // console.log(res);
        getAllPosts();
        return res.json()
      })
      .then((res)=>{
        // console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const changePublic = (postid, oldpublic) =>{
    const postData = {
        public: oldpublic? false : true,
    };
    const params = new URLSearchParams(postData);

    fetch(`/api/posts/${postid}`, {
        method: 'PATCH',
        headers: new Headers({
          'Authorization': 'Bearer ' + adminToken,
        }),
        body: params
      })
      .then((res)=>{
        // console.log(res);
        getAllPosts();
        return res.json()
      })
      .then((res)=>{
        // console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  return (
    <div className="Admin">
        {posts ?
        <div className='Posts'>
            {posts.map((item, i)=>{
                return (
                <div className='postHolder' key={item._id}>
                    {editPostID!==item._id ?
                    <div className='full_post' key={item._id}>
                        <div className='full_post_body'>
                            <div className='full_post_header'><span className='full_post_title'>{item.title}</span> <span className='full_post_status'>{item.public? 'Status: Public' : 'Status: Unpublished'}</span></div>
                            <pre className='full_post_content'>{item.content}</pre>
                            <div className='full_post_buttoncontainer'>
                                <button className='btn_secondary' onClick={()=>{navigate(`/post/${item._id}`, {state: {post: item}})}}>Visit Page</button>
                                <button className='btn_primary' onClick={()=>{setEditPostID(item._id)}}>Edit Post</button>
                                <button className='btn_danger' onClick={()=>{deletePost(item._id)}}>Delete Post</button>
                                <button className='btn_secondary' onClick={()=>{changePublic(item._id, item.public)}}>{item.public ? 'Unpublish': 'Publish'}</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='full_post_edit' key={item._id}>
                        <form className='editpost' onSubmit={(e)=>{editPost(e,item._id)}}>
                        <div className='full_post_body_edit'>
                            <div>              
                                <label> Title: 
                                <input type='text' minLength={2} maxLength={30} id='full_post_title_edit' defaultValue={item.title} required/>
                                </label>
                            </div>
                            <div>              
                                <label> Content: 
                                    <textarea minLength={5} maxLength={1000} id='full_post_content_edit' defaultValue={item.content} required></textarea>
                                </label>
                            </div>
                            <div className='full_post_buttoncontainer'>
                                <button className='btn_secondary' type='button' onClick={()=>{setEditPostID(null)}}>Cancel</button>
                                <button className='btn_primary' type='submit'>Save Post</button>
                            </div>
                        </div>
                        </form>
                    </div>
                    } 
                </div>)

            })}
        </div>
        :
        'Loading Posts...' 
        }
        <div className='create-post'>
          <hr/>
          <div className='title'>
            <h3>Create A New Post: </h3>
          </div>
          <form className='newpost' method='post' action='api/posts' onSubmit={createPost}>
            <div>              
                <label> Title: 
                  <input type='text' minLength={2} maxLength={30} name='new_post_title' id='new_post_title' required/>
                </label>
            </div>
            <div>              
                <label> Content: 
                  <textarea id='new_post_content' name='new_post_content' minLength={5} maxLength={1000} required>
                  </textarea>
                </label>
            </div>
            <div>
                <label> Publish:
                  <input type='checkbox' name='public' id='publish' value={true} />
                </label>
            </div>
            <button type='submit'>Post!</button>
          </form>
        </div>
    </div>
  );
}

export default Admin;
