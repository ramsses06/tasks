import axios from 'axios';
/**
 *
 * @param {object} query {
 *    where: {}
 * }
 */
export async function getTasksQuery (query) {
  const responseData = await axios({
    method: 'post',
    url: 'http://167.172.141.64:3000/api/query',
    headers: {
      'Content-Type': 'application/json'
    },
    data: query
  });
  return responseData.data;
}
