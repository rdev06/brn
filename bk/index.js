const data = {user:[], article:[]};


function parseToken(token){
    if(!token.startsWith('bk_')) throw 'Invalid Token';
    return token.slice(3);
}

const handler = {
    user:{
        GET: req => {
            const id = req.auth?.userId||req.id;
            if(id){
                return data.user[id]||null
            }
            return data.user;
        },
        POST: req => {
            const alreadyExist = data.user.find(e => e.email === req.data.email);
            if(alreadyExist){
                throw {message: 'This user already exist'};
            }
            data.user.push(req.data)
            return {message: 'Added!'}
        },
        PUT: req => {
            if(!req.auth.userId) throw new Error('Please login');
            data.user[req.auth.userId] = req.data;
            return {message: 'Updated!'}
        },
        login: {
            POST: req => {
                let user = null;
                let userId = null;
                for (let i = 0; i < data.user.length; i++) {
                    const u = data.user[i];
                    if(u.email === req.data.email){
                        user = u;
                        userId = i;
                        break;
                    }
                    
                }
                if(!user) throw {message: 'User Not Found'};
                if(user.password !== req.data.password) throw {message: 'Incorrect password'}
                return {token: 'bk_' + userId};
            }
        }
    },
    article:{
        GET: req => {
            if(req.query.me && req.auth.userId){
                return data.article.filter(({userId}) => userId === req.auth.userId);
            }
            return data.article
        },
        POST: req => {
            if(!req.auth.userId) throw new Error('Please login');
            data.article.push({...req.data, id: data.article.length, userId: req.auth.userId})
            return {message: 'Created!'};
        },
        PUT: req => {
            if(!req.auth.userId) throw new Error('Please login');
            if(!req.id) throw new Error('Todo Id is required');
            data.article[req.id] = {...data.article[req.id], ...req.data, userId: req.auth.userId}
            return {message: 'Updated!'}
        },
        DELETE: req => {
            if(!req.auth.userId) throw new Error('Please login');
            if(!req.id) throw new Error('Todo Id is required');
            data.article.splice(req.id, 1);
            return {message: 'Deleted!'}
        }
    }
}


const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials':'*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, PUT, DELETE, GET',
    'Access-Control-Allow-Headers': '*',
}


const server = Bun.serve({
    port: 5000,
    async fetch(req){
        if (req.method === 'OPTIONS') {
            return Response('Departed', {headers: CORS_HEADERS});
        }
        const url = new URL(req.url);
        const radix = url.pathname.split('/');
        const NOT_FOUND = `Path ${url.pathname} with method ${req.method} does not exist`;
        radix.shift();
        const lastElement = radix.at(-1)
        if(parseInt(lastElement).toString().length === lastElement.length || lastElement === '0'){
            req.id = lastElement;
            radix.pop();
        }
        req.query = {};
        if(url.search){
            req.query = Object.fromEntries(new URLSearchParams(url.search.slice(1)))
        }
        let toCompute = handler;
        try {
            for (const p of radix) {
                toCompute = toCompute[p]
            }
            toCompute = toCompute[req.method];
        } catch (error) {
            throw new Error(NOT_FOUND)
        }

        if(!toCompute) throw new Error(NOT_FOUND)

        req.auth = {};

        if(req.body){
            req.data = await Bun.readableStreamToJSON(req.body);
        }
        if(req.headers.get('authorization')){
            const [_, token] = req.headers.get('authorization').split(' ');
            if(token){
                req.auth.userId = parseToken(token)
            }
        }
        return Response.json(toCompute(req), {headers: CORS_HEADERS})
    },
    error(err){
        return Response.json({message: err.message}, {status: 404, headers: CORS_HEADERS})
    }
})



console.log(`server is running on http://localhost:${server.port}`)