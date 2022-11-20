import needle from "needle";

process.on('message', async (url: string) => {
  const { body, statusCode } = await needle('get', url);

  if (process.send) {
    process.send({ body: Array.from(body), statusCode, url });
  }
})
