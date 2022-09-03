import './App.scss';
import { useEffect, useState } from 'react';

function App() {
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
    <div className="App">
      <header>The Fog Blog</header>
      <div className='cardHolder'>
          {posts ? posts.map((item, i)=>{
            return <div className='card'>
              <div className='card_body'>
                <div className='card_title'>{item.title}</div>
                <div className='card_content'>{item.content}</div>
                <button>Check it Out</button>
              </div>
            </div>
          })
        : 'Loading Posts...'}
      </div>
    </div>
  );
}

export default App;
