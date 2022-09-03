import { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Post from './Post';

function Main() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState(null);

  const login = {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  };
  const params = new URLSearchParams(login);

  useEffect(()=>{
    // Get Token
    fetch('http://localhost:3000/api/login', {
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
  }, [])

  useEffect(()=>{
    // Get Posts
    if(token !==null){
      fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
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
  },[token])

  return (
    <div className="Main">
      <div className='cardHolder'>
          {posts ? posts.map((item, i)=>{
            const titleSplit = item.title.split(' ');
            const randomWord = titleSplit[Math.floor(Math.random()*titleSplit.length)];
            const imgsrc = 'https://source.unsplash.com/random/' + randomWord;
            return <div className='card' key={item._id}>
              <div className='card_body'>
                <div className='card_img'>
                  <img alt='random stock img' src={imgsrc} />
                </div>
                <div className='card_title'>{item.title}</div>
                <div className='card_content'>{item.content}</div>
                <button onClick={()=>{navigate(`/post/${item._id}`, {state: {post: item}})}}>Check it Out</button>
              </div>
            </div>
          })
        : 'Loading Posts...'}
      </div>
    </div>
  );
}

export default Main;
