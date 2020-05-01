const handleLogin = () => {
    
    const userN = document.getElementById('user').value;
    const passW = document.getElementById('pass').value;
    
    loginPros(userN, passW);
  };


  const loginPros = (userN, passW) => {
    console.log(`${userN} , ${passW}`);




  }
const loginForm = document.getElementById('userLogin');
loginForm.addEventListener('login', handleLogin);