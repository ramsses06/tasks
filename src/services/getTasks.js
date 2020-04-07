import axios from 'axios';

export async function getTasks () {
  const responseData = await axios({
    method: 'get',
    url: 'http://167.172.141.64:3000/api/'
  });
  return responseData.data;
}
