import axios from 'axios';

export async function getTasks () {
  const responseData = await axios({
    method: 'get',
    url: '/api/'
  });
  return responseData.data;
}
