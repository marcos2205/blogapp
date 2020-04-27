if (process.env.NODE_ENV == "production") {
    module.exports = {        
        mongoURI: "mongodb+srv://sa:123local@cluster0-nuhhq.mongodb.net/test?retryWrites=true&w=majority"
    }
} else {
    module.exports = { mongoURI: "mongodb://localhost/blogapp" }
}