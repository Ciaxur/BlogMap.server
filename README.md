<h1 align='center'>
  BlogMap.server
</h1>
<p align='center'>
  BlogMap API service
</p>

This API runs in coordination with [BlogMap](https://github.com/Ciaxur/BlogMap)

## Setup 📦
1. Setup a MongoDB Instance. *Quick & Basic [Docker Container](https://hub.docker.com/_/mongo)*: 

2. Configure [.env](.env.sample) to include the correct environment variables.
    - **Rename/Copy .env.sample to .env**
    - `MONGO_URI`: Link to the MongoDB Instance
    - `EXPRESS_PORT`: The port that this API will expose

3. Install NPM Packages, `npm install`

4. Transpile the source code, `npm run build`

5. Start the app, `npm start`

## License 📔
Licensed under the [MIT License](LICENSE).