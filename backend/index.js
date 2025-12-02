import express from  "express";
const app = express();
const PORT = 3010;


app.get('/', (req, res) => {
    res.send('send landing page file');
});
app.get('/user/admin-panel',(req, res) => {
    res.send('send admin panel');
});
app.get('/user/tenant-panel', (req, res) =>{
    res.send('send tenant panel');
});
app.get('/user/owner-panel', (req, res) => {
    res.send('send the owner panel');
});


app.listen((PORT) , ()=> {
    console.log(`app listening on ${PORT}`)
});