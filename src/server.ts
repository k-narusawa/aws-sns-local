import server from '.';

console.log('aws-sns-local-mock');

server()
  .then((s) => {
    console.log('starting sever...');
  })
  .catch((e) => {
    console.log('failed to star server');
    console.log(e);
  });
